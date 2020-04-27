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

use OCA\EndToEndEncryption\Db\Lock;
use OCA\EndToEndEncryption\Db\LockMapper;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Files\InvalidPathException;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
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

	/** @var ITimeFactory */
	private $timeFactory;

	private $validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	/**
	 * LockManager constructor.
	 *
	 * @param LockMapper $lockMapper
	 * @param ISecureRandom $secureRandom
	 * @param IRootFolder $rootFolder
	 * @param IUserSession $userSession
	 * @param ITimeFactory $timeFactory
	 */
	public function __construct(LockMapper $lockMapper,
								ISecureRandom $secureRandom,
								IRootFolder $rootFolder,
								IUserSession $userSession,
								ITimeFactory $timeFactory
	) {
		$this->lockMapper = $lockMapper;
		$this->secureRandom = $secureRandom;
		$this->userSession = $userSession;
		$this->rootFolder = $rootFolder;
		$this->timeFactory = $timeFactory;
	}

	/**
	 * lock file
	 *
	 * @param int $id
	 * @param string $token
	 * @return string|null
	 */
	public function lockFile(int $id, string $token = ''): ?string {
		if ($this->isLocked($id, $token)) {
			return null;
		}

		try {
			$lock = $this->lockMapper->getByFileId($id);
		} catch (DoesNotExistException $ex) {
			$newToken = $this->getToken();
			$lockEntity = new Lock();
			$lockEntity->setId($id);
			$lockEntity->setTimestamp($this->timeFactory->getTime());
			$lockEntity->setToken($newToken);
			$this->lockMapper->insert($lockEntity);
			return $newToken;
		}

		if ($lock->getToken() === $token) {
			return $token;
		}

		return null;
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
	public function unlockFile(int $id, string $token): void {
		try {
			$lock = $this->lockMapper->getByFileId($id);
		} catch (DoesNotExistException $ex) {
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
	 * @throws InvalidPathException
	 * @throws NotFoundException
	 */
	public function isLocked(int $id, string $token): bool {
		$user = $this->userSession->getUser();
		$userRoot = $this->rootFolder->getUserFolder($user->getUID());
		$nodes = $userRoot->getById($id);
		foreach ($nodes as $node) {
			while ($node->getPath() !== '/') {
				try {
					$lock = $this->lockMapper->getByFileId($node->getId());
				} catch (DoesNotExistException $ex) {
					// If this node is not locked, just check the parent one
					$node = $node->getParent();
					continue;
				}

				// If it's locked with a different token, return true
				if ($lock->getToken() !== $token) {
					return true;
				}

				// If it's locked with the expected token, check the parent node
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
	private function getToken(): string {
		return $this->secureRandom->generate(64, $this->validChars);
	}
}
