<?php
declare(strict_types=1);
/**
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
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


use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\IUserSession;
use OCP\Share\IManager;
use OCP\Share\IShare;

/**
 * Class EncryptionManager
 *
 * Manage encryption state in the file cache
 *
 * @package OCA\EndToEndEncryption
 */
class EncryptionManager {

	/** @var IRootFolder */
	private $rootFolder;

	/** @var IUserSession */
	private $userSession;

	/** @var IManager */
	private $shareManager;

	/**
	 * EncryptionManager constructor.
	 *
	 * @param IRootFolder $rootFolder
	 * @param IUserSession $userSession
	 * @param IManager $shareManager
	 */
	public function __construct(IRootFolder $rootFolder,
								IUserSession $userSession,
								IManager $shareManager) {
		$this->rootFolder = $rootFolder;
		$this->userSession = $userSession;
		$this->shareManager = $shareManager;
	}

	/**
	 * mark folder as encrypted
	 *
	 * @param int $id
	 * @throws NotFoundException
	 */
	public function setEncryptionFlag(int $id): void {
		$this->isValidFolder($id);
		$userRoot = $this->getUserRoot();
		$userRoot->getStorage()->getCache()->update($id, ['encrypted' => '1']);
	}

	/**
	 * mark folder as un-encrypted
	 *
	 * @param int $id
	 * @throws NotFoundException
	 */
	public function removeEncryptionFlag(int $id): void {
		$this->isValidFolder($id);
		$userRoot = $this->getUserRoot();
		$userRoot->getStorage()->getCache()->update($id, ['encrypted' => '0']);
	}

	/**
	 * check if a file is in a folder marked as encrypted
	 *
	 * @param Node $node
	 * @return bool
	 */
	public function isEncryptedFile(Node $node): bool {
		do {
			if ($node->isEncrypted()) {
				return true;
			}
			$node = $node->getParent();

		} while ($node->getPath() !== '/');

		return false;
	}

	/**
	 * get root folder of the currently logged in user
	 *
	 * @return Folder
	 */
	protected function getUserRoot(): Folder {
		$uid = $this->userSession->getUser()->getUID();
		$userRoot = $this->rootFolder->getUserFolder($uid);
		return $userRoot;
	}


	/**
	 * check if file ID points to a valid folder
	 *
	 * @param int $id folder id
	 *
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
	 *
	 * @param string $userId
	 * @param Node $node
	 * @return bool
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
}
