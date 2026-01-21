<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Controller;

use InvalidArgumentException;
use OC\User\NoUserException;
use OCA\EndToEndEncryption\AccessManager;
use OCA\EndToEndEncryption\Attributes\E2ERestrictUserAgent;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\FileService;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\LockManager;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\Attribute\RequestHeader;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCS\OCSPreconditionFailedException;
use OCP\AppFramework\OCSController;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\IL10N;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

class LockingController extends OCSController {

	public function __construct(
		string $AppName,
		IRequest $request,
		private IMetaDataStorage $metaDataStorage,
		private LockManager $lockManager,
		private IRootFolder $rootFolder,
		private FileService $fileService,
		private LoggerInterface $logger,
		private IL10N $l10n,
		private AccessManager $accessManager,
	) {
		parent::__construct($AppName, $request);
	}

	/**
	 * Lock folder
	 *
	 * @param int $id file ID
	 * @param ?string $shareToken Token of the share if available
	 *
	 * @return DataResponse<Http::STATUS_OK, array{e2e-token: string}, array{}>
	 * @throws OCSForbiddenException User is not allowed to create the lock
	 *
	 * 200: Folder locked successfully
	 */
	#[PublicPage]
	#[E2ERestrictUserAgent]
	#[RequestHeader(name: 'x-nc-e2ee-share-token', description: 'The share token when interacting with the API as an external share user', indirect: true)]
	public function lockFolder(int $id): DataResponse {
		$e2eToken = $this->request->getParam('e2e-token', '');
		$e2eCounter = (int)$this->request->getHeader('x-nc-e2ee-counter');
		$ownerId = $this->accessManager->getOwnerId($id);

		if ($e2eCounter === 0) {
			throw new OCSPreconditionFailedException($this->l10n->t('X-NC-E2EE-COUNTER is missing in the request'));
		}

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
			$this->accessManager->checkPermissions($id, true);
		} catch (NoUserException|InvalidArgumentException $e) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		if ($userFolder->getId() === $id) {
			$e = new OCSForbiddenException($this->l10n->t('You are not allowed to lock the root'));
			$this->logger->error($e->getMessage(), ['exception' => $e]);
			throw $e;
		}

		$node = $userFolder->getFirstNodeById($id);
		if (!$node instanceof Folder) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		$newToken = $this->lockManager->lockFile($id, $e2eToken, $e2eCounter, $ownerId);
		if ($newToken === null) {
			throw new OCSForbiddenException($this->l10n->t('File already locked'));
		}
		return new DataResponse(['e2e-token' => $newToken]);
	}


	/**
	 * Unlock folder
	 *
	 * @param int $id file ID
	 * @param ?string $shareToken Token of the share if available
	 * @param null|'true' $abort Abort changes during unlock
	 *
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
	 * @throws OCSForbiddenException User is not allowed to remove the lock
	 * @throws OCSNotFoundException Folder not locked
	 *
	 * 200: Folder unlocked successfully
	 */
	#[PublicPage]
	#[E2ERestrictUserAgent]
	#[RequestHeader(name: 'x-nc-e2ee-share-token', description: 'The share token when interacting with the API as an external share user', indirect: true)]
	public function unlockFolder(int $id, ?string $abort = null): DataResponse {
		$token = $this->request->getHeader('e2e-token');
		$ownerId = $this->accessManager->getOwnerId($id);

		if ($token === '') {
			throw new OCSPreconditionFailedException($this->l10n->t('e2e-token is empty'));
		}

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
			$this->accessManager->checkPermissions($id, true);
		} catch (NoUserException|InvalidArgumentException) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		}

		$node = $userFolder->getFirstNodeById($id);
		if (!$node instanceof Folder) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		}

		$touchFoldersIds = $this->metaDataStorage->getTouchedFolders($token);
		$folders = array_map(fn (int $id) => $userFolder->getFirstNodeById($id), $touchFoldersIds);
		$folders = array_filter($folders, fn (?Node $folder) => $folder instanceof Folder);
		// ensure we sort to handle deepest folders first
		usort($folders, fn (Node $a, Node $b)
			=> substr_count($b->getPath(), '/') - substr_count($a->getPath(), '/'),
		);
		foreach ($folders as $folder) {
			if ($abort === 'true') {
				$this->fileService->revertChanges($folder);
				$this->metaDataStorage->deleteIntermediateFile($ownerId, $folder->getId());
			} else {
				$deletedFileIds = $this->fileService->finalizeChanges($folder) ?: [];
				$isDeleted = in_array($folder->getId(), $deletedFileIds, true);
				$this->metaDataStorage->saveIntermediateFile($ownerId, $folder->getId(), $isDeleted);
			}
		}

		$this->metaDataStorage->clearTouchedFolders($token);

		try {
			$this->lockManager->unlockFile($id, $token);
		} catch (FileLockedException $e) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		} catch (FileNotLockedException $e) {
			throw new OCSNotFoundException($this->l10n->t('File not locked'));
		}

		return new DataResponse();
	}
}
