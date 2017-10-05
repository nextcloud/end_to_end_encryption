<?php
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


use OCP\Files\FileInfo;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\IUserSession;

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

	/**
	 * EncryptionManager constructor.
	 *
	 * @param IRootFolder $rootFolder
	 * @param IUserSession $userSession
	 */
	public function __construct(IRootFolder $rootFolder, IUserSession $userSession) {
		$this->rootFolder = $rootFolder;
		$this->userSession = $userSession;
	}

	/**
	 * mark folder as encrypted
	 *
	 * @param int $id
	 * @throws NotFoundException
	 */
	public function setEncryptionFlag($id) {
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
	public function removeEncryptionFlag($id) {
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
	public function isEncryptedFile(Node $node) {
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
	protected function getUserRoot() {
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
	protected function isValidFolder($id) {
		$node = $this->rootFolder->getById($id);

		if (!isset($node[0])) {
			throw new NotFoundException('No folder with ID ' . $id);
		}

		if ($node[0]->getType() === FileInfo::TYPE_FILE) {
			throw new NotFoundException('No folder with ID ' . $id);
		}
	}
}
