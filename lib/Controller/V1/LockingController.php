<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Controller\V1;

use OC\User\NoUserException;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\FileService;
use OCA\EndToEndEncryption\IMetaDataStorageV1;
use OCA\EndToEndEncryption\LockManagerV1;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IL10N;
use OCP\IRequest;
use OCP\Share\IManager as ShareManager;
use Psr\Log\LoggerInterface;

class LockingController extends OCSController {
	private ?string $userId;
	private IMetaDataStorageV1 $metaDataStorage;
	private IRootFolder $rootFolder;
	private FileService $fileService;
	private LockManagerV1 $lockManager;
	private IL10N $l10n;
	private LoggerInterface $logger;
	private ShareManager $shareManager;

	public function __construct(
		string $AppName,
		IRequest $request,
		?string $userId,
		IMetaDataStorageV1 $metaDataStorage,
		LockManagerV1 $lockManager,
		IRootFolder $rootFolder,
		FileService $fileService,
		LoggerInterface $logger,
		IL10N $l10n,
		ShareManager $shareManager,
	) {
		parent::__construct($AppName, $request);
		$this->userId = $userId;
		$this->metaDataStorage = $metaDataStorage;
		$this->rootFolder = $rootFolder;
		$this->fileService = $fileService;
		$this->lockManager = $lockManager;
		$this->logger = $logger;
		$this->l10n = $l10n;
		$this->shareManager = $shareManager;
	}

	/**
	 * Lock folder
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 * @PublicPage
	 *
	 * @param int $id file ID
	 * @param ?string $shareToken Token of the share if available
	 * @return DataResponse<Http::STATUS_OK, array{e2e-token: string}, array{}>
	 * @throws OCSForbiddenException User is not allowed to create the lock
	 *
	 * 200: Folder locked successfully
	 */
	public function lockFolder(int $id, ?string $shareToken = null): DataResponse {
		$e2eToken = $this->request->getParam('e2e-token', '');

		$ownerId = $this->getOwnerId($shareToken);

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
		} catch (NoUserException $e) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		if ($userFolder->getId() === $id) {
			$e = new OCSForbiddenException($this->l10n->t('You are not allowed to lock the root'));
			$this->logger->error($e->getMessage(), ['exception' => $e]);
			throw $e;
		}

		$nodes = $userFolder->getById($id);
		if (!isset($nodes[0]) || !$nodes[0] instanceof Folder) {
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
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 * @PublicPage
	 *
	 * @param int $id file ID
	 * @param ?string $shareToken Token of the share if available
	 *
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
	 * @throws OCSForbiddenException User is not allowed to remove the lock
	 * @throws OCSNotFoundException File not locked
	 *
	 * 200: Folder unlocked successfully
	 */
	public function unlockFolder(int $id, ?string $shareToken = null): DataResponse {
		$token = $this->request->getHeader('e2e-token');

		$ownerId = $this->getOwnerId($shareToken);

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
		} catch (NoUserException $e) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		}

		$nodes = $userFolder->getById($id);
		if (!isset($nodes[0]) || !$nodes[0] instanceof Folder) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		}

		$hadChanges = $this->fileService->finalizeChanges($nodes[0]) !== false;

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

	private function getOwnerId(?string $shareToken = null): string {
		if ($shareToken !== null) {
			$share = $this->shareManager->getShareByToken($shareToken);

			if (!($share->getPermissions() & \OCP\Constants::PERMISSION_CREATE)) {
				throw new OCSForbiddenException("Can't lock share without create permission");
			}

			return $share->getShareOwner();
		} elseif ($this->userId !== null) {
			return $this->userId;
		} else {
			throw new OCSBadRequestException("Couldn't find the owner of the encrypted folder");
		}
	}
}
