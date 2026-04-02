<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Controller;

use InvalidArgumentException;
use OC\User\NoUserException;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\FileService;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\LockManager;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\BruteForceProtection;
use OCP\AppFramework\Http\Attribute\RequestHeader;
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
	private IMetaDataStorage $metaDataStorage;
	private IRootFolder $rootFolder;
	private FileService $fileService;
	private LockManager $lockManager;
	private IL10N $l10n;
	private LoggerInterface $logger;
	private ShareManager $shareManager;

	use ThrottleRequestTrait;

	public function __construct(
		string $AppName,
		IRequest $request,
		?string $userId,
		IMetaDataStorage $metaDataStorage,
		LockManager $lockManager,
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
	 *
	 * @return DataResponse<Http::STATUS_OK, array{e2e-token: string}, array{}>|DataResponse<Http::STATUS_BAD_REQUEST|Http::STATUS_FORBIDDEN|Http::STATUS_LOCKED|Http::STATUS_PRECONDITION_FAILED, array{message: string}, array{}>
	 * @throws OCSForbiddenException User is not allowed to create the lock
	 *
	 * 200: Folder locked successfully
	 * 400: Bad request, e.g. missing counter header
	 * 403: Forbidden
	 * 412: Outdated counter provided
	 * 423: Folder already locked
	 */
	#[BruteForceProtection('e2ee')]
	#[RequestHeader(name: 'x-nc-e2ee-counter', description: 'The next counter value of the metadata to check for consistency')]
	public function lockFolder(int $id, ?string $shareToken = null): DataResponse {
		$e2eToken = $this->request->getParam('e2e-token', '');
		$e2eCounter = (int)$this->request->getHeader('X-NC-E2EE-COUNTER');

		if ($e2eCounter === 0) {
			return $this->throttleRequest(Http::STATUS_BAD_REQUEST, 'X-NC-E2EE-COUNTER is missing in the request');
		}

		$ownerId = $this->getOwnerId($shareToken);

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
		} catch (NoUserException $e) {
			$this->logger->info('Tried to lock e2ee folder without permission', ['exception' => $e]);
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to create the lock');
		}

		if ($userFolder->getId() === $id) {
			$this->logger->info('Tried to lock root of e2ee folder');
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to create the lock');
		}

		$nodes = $userFolder->getById($id);
		if (!isset($nodes[0]) || !$nodes[0] instanceof Folder) {
			$this->logger->info('Tried to lock non-folder e2ee node', ['nodeId' => $id]);
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to create the lock');
		}

		try {
			$newToken = $this->lockManager->lockFile($id, $e2eToken, $e2eCounter, $ownerId);
			if ($newToken === null) {
				$this->logger->debug('Tried to lock already locked e2ee folder', ['nodeId' => $id]);
				return $this->throttleRequest(Http::STATUS_LOCKED, 'File already locked');
			}
		} catch (NotPermittedException $e) {
			$this->logger->debug('Tried to lock e2ee folder with outdated counter', ['nodeId' => $id, 'exception' => $e]);
			return $this->throttleRequest(Http::STATUS_PRECONDITION_FAILED, 'The provided counter is smaller than the current counter.');
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
	 * @param null|'true' $abort Abort changes during unlock
	 *
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>|DataResponse<Http::STATUS_BAD_REQUEST|Http::STATUS_FORBIDDEN|Http::STATUS_NOT_FOUND, array{message: string}, array{}>
	 * @throws OCSForbiddenException User is not allowed to remove the lock
	 * @throws OCSNotFoundException Folder not locked
	 *
	 * 200: Folder unlocked successfully
	 * 400: Bad request, e.g. missing token header
	 * 403: Forbidden
	 */
	#[BruteForceProtection('e2ee')]
	#[RequestHeader(name: 'e2e-token', description: 'The lock token to unlock')]
	public function unlockFolder(int $id, ?string $shareToken = null, ?string $abort = null): DataResponse {
		$token = $this->request->getHeader('e2e-token');

		if ($token === '') {
			return $this->throttleRequest(Http::STATUS_BAD_REQUEST, 'e2e-token is empty');
		}

		$ownerId = $this->getOwnerId($shareToken);

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
		} catch (NoUserException|InvalidArgumentException $e) {
			$this->logger->info('Tried to unlock e2ee folder without permission', ['exception' => $e]);
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to remove the lock');
		}

		$nodes = $userFolder->getById($id);
		if (!isset($nodes[0]) || !$nodes[0] instanceof Folder) {
			$this->logger->info('Tried to unlock non-folder e2ee node', ['nodeId' => $id]);
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to remove the lock');
		}

		$touchFoldersIds = $this->metaDataStorage->getTouchedFolders($token);
		foreach ($touchFoldersIds as $folderId) {
			if ($abort === 'true') {
				$this->fileService->revertChanges($userFolder->getById($folderId)[0]);
				$this->metaDataStorage->deleteIntermediateFile($ownerId, $folderId);
			} else {
				$this->fileService->finalizeChanges($userFolder->getById($folderId)[0]);
				$this->metaDataStorage->saveIntermediateFile($ownerId, $folderId);
			}
		}

		$this->metaDataStorage->clearTouchedFolders($token);

		try {
			$this->lockManager->unlockFile($id, $token);
		} catch (FileLockedException $e) {
			$this->logger->info('Tried to unlock e2ee folder with invalid token', ['exception' => $e]);
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to remove the lock');
		} catch (FileNotLockedException $e) {
			$this->logger->info('Tried to unlock already unlocked e2ee folder', ['exception' => $e]);
			return $this->throttleRequest(Http::STATUS_NOT_FOUND, 'File not locked');
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
