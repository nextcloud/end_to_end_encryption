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
use OCP\IUserSession;
use OCP\Share\IManager;
use OCP\Share\IShare;
use Psr\Log\LoggerInterface;

/**
 * Class EncryptionManager
 *
 * Manage encryption state in the file cache
 *
 * @package OCA\EndToEndEncryption
 */
class EncryptionManager {
	private IRootFolder $rootFolder;
	private IUserSession $userSession;
	private IManager $shareManager;
	private IDBConnection $dbConnection;
	private LoggerInterface $logger;

	public function __construct(IRootFolder $rootFolder,
		IUserSession $userSession,
		IManager $shareManager,
		IDBConnection $dbConnection,
		LoggerInterface $logger) {
		$this->rootFolder = $rootFolder;
		$this->userSession = $userSession;
		$this->shareManager = $shareManager;
		$this->dbConnection = $dbConnection;
		$this->logger = $logger;
	}

	/**
	 * Mark folder as encrypted
	 * @throws NotFoundException
	 */
	public function setEncryptionFlag(int $id): void {
		$this->isValidFolder($id);
		$userRoot = $this->getUserRoot();
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
		$userRoot = $this->getUserRoot();
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
	 * Get root folder of the currently logged in user
	 */
	protected function getUserRoot(): Folder {
		$uid = $this->userSession->getUser()->getUID();
		return $this->rootFolder->getUserFolder($uid);
	}


	/**
	 * Check if file ID points to a valid folder
	 * @throws NotFoundException
	 */
	protected function isValidFolder(int $id):void {
		$node = $this->rootFolder->getById($id);

		if (!isset($node[0])) {
			throw new NotFoundException('No folder with ID ' . $id);
		}

		$firstNode = $node[0];
		if (!($firstNode instanceof Folder)) {
			throw new NotFoundException('No folder with ID ' . $id);
		}

		if (!empty($firstNode->getDirectoryListing())) {
			throw new NotFoundException('Folder with ID ' . $id . ' not empty');
		}

		$user = $this->userSession->getUser();
		if ($user === null) {
			throw new NotFoundException('No active user-session');
		}

		$userId = $user->getUID();
		if ($this->isNodeShared($userId, $firstNode)) {
			throw new NotFoundException('Folder with ID ' . $id . ' is shared');
		}
	}

	/**
	 * Check if a node is shared
	 */
	private function isNodeShared(string $userId, Node $node):bool {
		$shareTypesToCheck = [
			IShare::TYPE_USER,
			IShare::TYPE_GROUP,
			IShare::TYPE_USERGROUP,
			IShare::TYPE_LINK,
			IShare::TYPE_EMAIL,
			IShare::TYPE_REMOTE,
			IShare::TYPE_CIRCLE,
			IShare::TYPE_GUEST,
			IShare::TYPE_REMOTE_GROUP,
			IShare::TYPE_ROOM,
		];

		foreach ($shareTypesToCheck as $shareType) {
			$shares = $this->shareManager->getSharesBy(
				$userId,
				$shareType,
				$node,
				false,
				1 // Limit 1, because we only care whether there is a share or not
			);

			if (!empty($shares)) {
				return true;
			}
		}

		return false;
	}

	public function removeEncryptedFolders(string $userId): array {
		$userRoot = $this->getUserRoot();
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
