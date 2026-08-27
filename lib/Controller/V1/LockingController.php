<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Controller\V1;

use OC\User\NoUserException;
use OCA\EndToEndEncryption\AccessManager;
use OCA\EndToEndEncryption\Attributes\E2ERestrictUserAgent;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\FileService;
use OCA\EndToEndEncryption\IMetaDataStorageV1;
use OCA\EndToEndEncryption\LockManagerV1;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\Attribute\RequestHeader;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IL10N;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

class LockingController extends OCSController {
	public function __construct(
		string $AppName,
		IRequest $request,
		private readonly IMetaDataStorageV1 $metaDataStorage,
		private readonly LockManagerV1 $lockManager,
		private readonly IRootFolder $rootFolder,
		private readonly FileService $fileService,
		private readonly LoggerInterface $logger,
		private readonly IL10N $l10n,
		private readonly AccessManager $accessManager,
	) {
		parent::__construct($AppName, $request);
	}

	/**
	 * Lock folder
	 *
	 * @param int $id file ID
	 * @return DataResponse<Http::STATUS_OK, array{e2e-token: string}, array{}>
	 * @throws OCSForbiddenException User is not allowed to create the lock
	 *
	 * 200: Folder locked successfully
	 */
	#[PublicPage]
	#[E2ERestrictUserAgent]
	public function lockFolder(int $id): DataResponse {
		$e2eToken = $this->request->getParam('e2e-token', '');

		try {
			$this->accessManager->checkPermissions($id, true);
			$ownerId = $this->accessManager->getOwnerId($id);
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
		} catch (NoUserException|\InvalidArgumentException $e) {
			$this->logger->info('Tried to lock e2ee folder without permission', ['exception' => $e]);
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		$this->metaDataStorage->assertMetadataIsV1($ownerId, $id);

		if ($userFolder->getId() === $id) {
			$e = new OCSForbiddenException($this->l10n->t('You are not allowed to lock the root'));
			$this->logger->error($e->getMessage(), ['exception' => $e]);
			throw $e;
		}

		$node = $userFolder->getFirstNodeById($id);
		if (!$node instanceof Folder) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		$newToken = $this->lockManager->lockFile($id, $e2eToken, $ownerId);
		if ($newToken === null) {
			throw new OCSForbiddenException($this->l10n->t('File already locked'));
		}
		return new DataResponse(['e2e-token' => $newToken]);
	}


	/**
	 * Unlock folder
	 *
	 * @param int $id file ID
	 *
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
	 * @throws OCSForbiddenException User is not allowed to remove the lock
	 * @throws OCSNotFoundException File not locked
	 *
	 * 200: Folder unlocked successfully
	 */
	#[PublicPage]
	#[E2ERestrictUserAgent]
	#[RequestHeader(name: 'e2e-token', description: 'The lock token to unlock')]
	public function unlockFolder(int $id): DataResponse {
		$token = $this->request->getHeader('e2e-token');

		try {
			$this->accessManager->checkPermissions($id, true);
			$ownerId = $this->accessManager->getOwnerId($id);
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
		} catch (NoUserException|\InvalidArgumentException $e) {
			$this->logger->info('Tried to unlock e2ee folder without permission', ['exception' => $e]);
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		}

		$this->metaDataStorage->assertMetadataIsV1($ownerId, $id);

		$node = $userFolder->getFirstNodeById($id);
		if (!$node instanceof Folder) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		}

		// The lock has to be verified before any changes are applied,
		// as those can not be rolled back if the lock turns out to be invalid.
		try {
			$this->lockManager->assertLockedByToken($id, $token);
		} catch (FileLockedException) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		} catch (FileNotLockedException) {
			throw new OCSNotFoundException($this->l10n->t('File not locked'));
		}

		$hadChanges = $this->fileService->finalizeChanges($node) !== false;

		try {
			$this->metaDataStorage->saveIntermediateFile($ownerId, $id);
		} catch (MissingMetaDataException $ex) {
			if ($hadChanges) {
				throw $ex;
			}
		}

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
