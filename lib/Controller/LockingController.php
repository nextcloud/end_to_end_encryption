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
use OCP\AppFramework\Http\Attribute\BruteForceProtection;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\Attribute\RequestHeader;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

class LockingController extends OCSController {

	use ThrottleRequestTrait;

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
	 * @return DataResponse<Http::STATUS_OK, array{e2e-token: string}, array{}>|DataResponse<Http::STATUS_BAD_REQUEST|Http::STATUS_FORBIDDEN|Http::STATUS_LOCKED|Http::STATUS_PRECONDITION_FAILED, array{message: string}, array{}>
	 * @throws OCSForbiddenException User is not allowed to create the lock
	 *
	 * 200: Folder locked successfully
	 * 400: Bad request, e.g. missing counter header
	 * 403: Forbidden
	 * 412: Outdated counter provided
	 * 423: Folder already locked
	 */
	#[PublicPage]
	#[E2ERestrictUserAgent]
	#[BruteForceProtection('e2ee')]
	#[RequestHeader(name: 'x-nc-e2ee-counter', description: 'The next counter value of the metadata to check for consistency')]
	#[RequestHeader(name: 'x-nc-e2ee-share-token', description: 'The share token when interacting with the API as an external share user', indirect: true)]
	public function lockFolder(int $id): DataResponse {
		$e2eToken = $this->request->getParam('e2e-token', '');
		$e2eCounter = (int)$this->request->getHeader('x-nc-e2ee-counter');
		$ownerId = $this->accessManager->getOwnerId($id);

		if ($e2eCounter === 0) {
			return $this->throttleRequest(Http::STATUS_BAD_REQUEST, 'X-NC-E2EE-COUNTER is missing in the request');
		}

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
			$this->accessManager->checkPermissions($id, true);
		} catch (NoUserException|InvalidArgumentException $e) {
			$this->logger->info('Tried to lock e2ee folder without permission', ['exception' => $e]);
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to create the lock');
		}

		if ($userFolder->getId() === $id) {
			$this->logger->info('Tried to lock root of e2ee folder');
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to create the lock');
		}

		$node = $userFolder->getFirstNodeById($id);
		if (!$node instanceof Folder) {
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
	#[PublicPage]
	#[E2ERestrictUserAgent]
	#[BruteForceProtection('e2ee')]
	#[RequestHeader(name: 'e2e-token', description: 'The lock token to unlock')]
	#[RequestHeader(name: 'x-nc-e2ee-share-token', description: 'The share token when interacting with the API as an external share user', indirect: true)]
	public function unlockFolder(int $id, ?string $abort = null): DataResponse {
		$token = $this->request->getHeader('e2e-token');
		$ownerId = $this->accessManager->getOwnerId($id);

		if ($token === '') {
			return $this->throttleRequest(Http::STATUS_BAD_REQUEST, 'e2e-token is empty');
		}

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
			$this->accessManager->checkPermissions($id, true);
		} catch (NoUserException|InvalidArgumentException $e) {
			$this->logger->info('Tried to unlock e2ee folder without permission', ['exception' => $e]);
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to remove the lock');
		}

		$node = $userFolder->getFirstNodeById($id);
		if (!$node instanceof Folder) {
			$this->logger->info('Tried to unlock non-folder e2ee node', ['nodeId' => $id]);
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to remove the lock');
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
			$this->logger->info('Tried to unlock e2ee folder with invalid token', ['exception' => $e]);
			return $this->throttleRequest(Http::STATUS_FORBIDDEN, 'You are not allowed to remove the lock');
		} catch (FileNotLockedException $e) {
			$this->logger->info('Tried to unlock already unlocked e2ee folder', ['exception' => $e]);
			return $this->throttleRequest(Http::STATUS_NOT_FOUND, 'File not locked');
		}

		return new DataResponse();
	}
}
