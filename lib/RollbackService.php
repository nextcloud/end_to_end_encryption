<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\EndToEndEncryption;

use OCP\Files\Config\IUserMountCache;
use OCP\Files\Folder;
use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\Db\LockMapper;
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
class RollbackService {

	/** @var LockMapper */
	private $lockMapper;

	/** @var IMetaDataStorage */
	private $metaDataStorage;

	/** @var FileService */
	private $fileService;

	/** @var IUserMountCache */
	private $userMountCache;

	/** @var IRootFolder */
	private $rootFolder;

	/** @var LoggerInterface */
	private $logger;

	/**
	 * RollbackService constructor.
	 *
	 * @param LockMapper $lockMapper
	 * @param IMetaDataStorage $metaDataStorage
	 * @param FileService $fileService
	 * @param IUserMountCache $userMountCache
	 * @param IRootFolder $rootFolder
	 * @param LoggerInterface $logger
	 */
	public function __construct(LockMapper $lockMapper,
								IMetaDataStorage $metaDataStorage,
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
				continue;
			}

			$userId = $mountPoints[0]->getUser()->getUID();
			try {
				$userFolder = $this->rootFolder->getUserFolder($userId);
			} catch (\Exception $ex) {
				$this->logger->critical($ex->getMessage(), [
					'exception' => $ex,
					'app' => Application::APP_ID,
				]);
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
