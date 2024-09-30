<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\Db\LockMapper;
use OCP\Files\Config\ICachedMountFileInfo;
use OCP\Files\Config\IUserMountCache;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use Psr\Log\LoggerInterface;

/**
 * Class RollbackService
 *
 * @package OCA\EndToEndEncryption
 *
 * This is the first implementation of a rollback-service,
 * which allows restoring a previous state of an e2e folder
 * in case a client dies and its token expires.
 *
 * This implementation is rather simple approach which copies
 * a folder on lock. In case of a necessary rollback, it restores
 * the state from the copied folder.
 *
 * A more elaborate approach should keep a journal of modifications
 * and only backup files when they are actually being modified / deleted.
 */
class RollbackServiceV1 {
	private LockMapper $lockMapper;
	private IMetaDataStorageV1 $metaDataStorage;
	private FileService $fileService;
	private IUserMountCache $userMountCache;
	private IRootFolder $rootFolder;
	private LoggerInterface $logger;

	public function __construct(LockMapper $lockMapper,
		IMetaDataStorageV1 $metaDataStorage,
		FileService $fileService,
		IUserMountCache $userMountCache,
		IRootFolder $rootFolder,
		LoggerInterface $logger) {
		$this->lockMapper = $lockMapper;
		$this->metaDataStorage = $metaDataStorage;
		$this->fileService = $fileService;
		$this->userMountCache = $userMountCache;
		$this->rootFolder = $rootFolder;
		$this->logger = $logger;
	}

	/**
	 * Rollback all locks older than given timetstamp
	 *
	 * @param int $olderThanTimestamp
	 * @param int|null $limit
	 */
	public function rollbackOlderThan(int $olderThanTimestamp, ?int $limit = null): void {
		$locks = $this->lockMapper->findAllLocksOlderThan($olderThanTimestamp, $limit);

		foreach ($locks as $lock) {
			$mountPoints = $this->userMountCache->getMountsForFileId($lock->getId());
			if (empty($mountPoints)) {
				$this->lockMapper->delete($lock);
				continue;
			}

			/** @var ICachedMountFileInfo $firstMountPoint */
			$firstMountPoint = array_shift($mountPoints);
			$userId = $firstMountPoint->getUser()->getUID();

			try {
				$userFolder = $this->rootFolder->getUserFolder($userId);
			} catch (\Exception $ex) {
				$this->logger->critical($ex->getMessage(), [
					'exception' => $ex,
					'app' => Application::APP_ID,
				]);
				continue;
			}

			if (strpos($firstMountPoint->getInternalPath(), 'files_trashbin/files/') === 0) {
				$this->lockMapper->delete($lock);
				continue;
			}

			$nodes = $userFolder->getById($lock->getId());
			if (!isset($nodes[0]) || !$nodes[0] instanceof Folder) {
				continue;
			}

			$node = $nodes[0];
			// If the time that passed since the node was last modified
			// is bigger than the time to live, do nothing
			if ($node->getMTime() > $olderThanTimestamp) {
				continue;
			}

			try {
				$this->fileService->revertChanges($node);
				$this->metaDataStorage->deleteIntermediateFile($userId, $lock->getId());
			} catch (\Exception $ex) {
				$this->logger->critical($ex->getMessage(), [
					'exception' => $ex,
					'app' => Application::APP_ID,
				]);
				continue;
			}

			$this->lockMapper->delete($lock);
		}
	}
}
