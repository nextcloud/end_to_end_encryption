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


use OCA\EndToEndEncryption\Db\LockEntity;
use OCA\EndToEndEncryption\Db\LockMapper;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCP\Files\IRootFolder;
use OCP\IUserSession;
use OCP\Security\ISecureRandom;

/**
 * Class LockManager
 *
 * handle end-to-end encryption file locking
 *
 * @package OCA\EndToEndEncryption
 */
class LockManager {

	/** @var LockMapper */
	private $lockMapper;

	/** @var ISecureRandom */
	private $secureRandom;

	/** @var IUserSession */
	private $userSession;

	/** @var IRootFolder */
	private $rootFolder;

	private $validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	/**
	 * LockManager constructor.
	 *
	 * @param LockMapper $lockMapper
	 * @param ISecureRandom $secureRandom
	 * @param IRootFolder $rootFolder
	 * @param IUserSession $userSession
	 */
	public function __construct(LockMapper $lockMapper,
								ISecureRandom $secureRandom,
								IRootFolder $rootFolder,
								IUserSession $userSession
	) {
		$this->lockMapper = $lockMapper;
		$this->secureRandom = $secureRandom;
		$this->userSession = $userSession;
		$this->rootFolder = $rootFolder;
	}

	/**
	 * lock file
	 *
	 * @param int $id
	 * @param string $token
	 * @return string
	 */
	public function lockFile($id, $token = '') {
		$result = '';
		if ($this->isLocked($id, $token)) {
			return $result;
		}
		$lock = $this->lockMapper->getByFileId($id);
		if (empty($lock)) {
			$newToken = $this->getToken();
			$lockEntity = new LockEntity();
			$lockEntity->setId($id);
			$lockEntity->setTimestamp($this->getTimestamp());
			$lockEntity->setToken($newToken);
			$this->lockMapper->insert($lockEntity);
			$result = $newToken;
		} elseif ($lock->getToken() === $token) {
			$result = $token;
		}

		return $result;
	}

	/**
	 * unlock file
	 *
	 * @param int $id
	 * @param string $token
	 *
	 * @throws FileLockedException
	 * @throws FileNotLockedException
	 */
	public function unlockFile($id, $token) {
		$lock = $this->lockMapper->getByFileId($id);
		if (empty($lock)) {
			throw new FileNotLockedException();
		}

		if ($lock->getToken() !== $token) {
			throw new FileLockedException();
		}

		$this->lockMapper->delete($lock);
	}

	/**
	 * check if a file or a parent folder is locked
	 *
	 * @param int $id
	 * @param string $token
	 * @return bool
	 * @throws \OCP\Files\InvalidPathException
	 * @throws \OCP\Files\NotFoundException
	 */
	public function isLocked($id, $token) {
		$user = $this->userSession->getUser();
		$userRoot = $this->rootFolder->getUserFolder($user->getUID());
		$nodes = $userRoot->getById($id);
		foreach ($nodes as $node) {
			while ($node->getPath() !== '/') {
				$lock = $this->lockMapper->getByFileId($node->getId());
				if (!empty($lock) && $lock->getToken() !== $token) {
					return true;
				}
				$node = $node->getParent();
			}
		}

		return false;
	}


	/**
	 * generate a new token
	 *
	 * @return string
	 */
	private function getToken() {
		return $this->secureRandom->generate(64, $this->validChars);
	}

	/**
	 * get timestamp of current time
	 *
	 * @return int
	 */
	private function getTimestamp() {
		return time();
	}

}
