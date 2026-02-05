<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption;

use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\IDBConnection;
use Psr\Log\LoggerInterface;

/**
 * Class EncryptionManager
 *
 * Manage encryption state in the file cache
 *
 * @package OCA\EndToEndEncryption
 */
class EncryptionManager {

	public function __construct(
		private IRootFolder $rootFolder,
		private IDBConnection $dbConnection,
		private LoggerInterface $logger,
		private AccessManager $accessManager,
	) {
	}

	/**
	 * Mark folder as encrypted
	 * @throws NotFoundException
	 */
	public function setEncryptionFlag(int $id): void {
		$this->isValidFolder($id);
		$ownerId = $this->accessManager->getOwnerId($id);
		$userRoot = $this->rootFolder->getUserFolder($ownerId);
		$cache = $userRoot->getFirstNodeById($id)->getStorage()->getCache();
		if ($cache === null) {
			throw new NotFoundException('No cache available for folder with ID ' . $id);
		}
		$cache->update($id, ['encrypted' => '1']);
	}

	/**
	 * Mark folder as un-encrypted
	 * @throws NotFoundException
	 */
	public function removeEncryptionFlag(int $id): void {
		$this->isValidFolder($id);
		$ownerId = $this->accessManager->getOwnerId($id);
		$userRoot = $this->rootFolder->getUserFolder($ownerId);
		$cache = $userRoot->getFirstNodeById($id)->getStorage()->getCache();
		if ($cache === null) {
			throw new NotFoundException('No cache available for folder with ID ' . $id);
		}
		$cache->update($id, ['encrypted' => '0']);
	}

	/**
	 * Check if a file is in a folder marked as encrypted
	 */
	public static function isEncryptedFile(Node $node): bool {
		// traverse up if node is not a folder to prevent false positives for SSE files
		// (see E2EEnabledPathCache#isE2EEnabledPath)
		if (!($node instanceof Folder)) {
			$node = $node->getParent();
		}

		do {
			if ($node->isEncrypted()) {
				return true;
			}
			$node = $node->getParent();
		} while ($node->getPath() !== '/');

		return false;
	}

	/**
	 * Check if file ID points to a valid folder
	 * @throws NotFoundException
	 */
	protected function isValidFolder(int $id):void {
		$this->accessManager->checkPermissions($id, true);
		$node = $this->rootFolder->getFirstNodeById($id);
		if (!$node instanceof Folder) {
			throw new NotFoundException('No folder with ID ' . $id);
		}

		if (!empty($node->getDirectoryListing())) {
			throw new NotFoundException('Folder with ID ' . $id . ' not empty');
		}
	}

	public function removeEncryptedFolders(string $userId): array {
		$userRoot = $this->rootFolder->getUserFolder($userId);
		$storageId = $userRoot->getStorage()->getCache()->getNumericStorageId();

		$qb = $this->dbConnection->getQueryBuilder();
		$qb->select('fileid')
			->from('filecache')
			->where($qb->expr()->eq('encrypted', $qb->createNamedParameter(1, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)));

		$fileIds = [];
		$result = $qb->executeQuery();
		while (($row = $result->fetch()) !== false) {
			$nodes = $userRoot->getById($row['fileid']);
			try {
				foreach ($nodes as $node) {
					$node->delete();
					$fileIds[] = $node->getId();
				}
			} catch (\Exception $e) {
				$this->logger->error('Error while deleting file', ['exception' => $e]);
			}
		}

		return $fileIds;
	}
}
