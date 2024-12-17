<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
use OCP\Files\NotPermittedException;
use OCP\IUserSession;
use OCP\Security\ISecureRandom;

/**
 * Handle end-to-end encryption file locking
 *
 * @package OCA\EndToEndEncryption
 */
class LockManagerV1 {
	private LockMapper $lockMapper;
	private ISecureRandom $secureRandom;
	private IUserSession $userSession;
	private IRootFolder $rootFolder;
	private ITimeFactory $timeFactory;

	public function __construct(LockMapper $lockMapper,
		ISecureRandom $secureRandom,
		IRootFolder $rootFolder,
		IUserSession $userSession,
		ITimeFactory $timeFactory,
	) {
		$this->lockMapper = $lockMapper;
		$this->secureRandom = $secureRandom;
		$this->userSession = $userSession;
		$this->rootFolder = $rootFolder;
		$this->timeFactory = $timeFactory;
	}

	/**
	 * Lock file
	 */
	public function lockFile(int $id, string $token = '', ?string $ownerId = null): ?string {
		if ($this->isLocked($id, $token, $ownerId)) {
			return null;
		}

		try {
			$lock = $this->lockMapper->getByFileId($id);
			return $lock->getToken() === $token ? $token : null;
		} catch (DoesNotExistException $ex) {
			$newToken = $this->getToken();
			$lockEntity = new Lock();
			$lockEntity->setId($id);
			$lockEntity->setTimestamp($this->timeFactory->getTime());
			$lockEntity->setToken($newToken);
			$this->lockMapper->insert($lockEntity);
			return $newToken;
		}
	}

	/**
	 * Unlock file
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
	 * Check if a file or a parent folder is locked
	 *
	 * @param $requireLock - Specify whether we want to assert that the the folder is locked by the given token.
	 *
	 * @throws InvalidPathException
	 * @throws NotFoundException
	 * @throws \OCP\Files\NotPermittedException
	 */
	public function isLocked(int $id, string $token, ?string $ownerId = null, bool $requireLock = false): bool {
		if ($ownerId === null) {
			$user = $this->userSession->getUser();
			if ($user === null) {
				throw new NotPermittedException('No active user-session');
			}
			$ownerId = $user->getUid();
		}

		$lockedByGivenToken = false;

		$userRoot = $this->rootFolder->getUserFolder($ownerId);
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
				} else {
					$lockedByGivenToken = true;
				}

				// If it's locked with the expected token, check the parent node
				$node = $node->getParent();
			}
		}

		if ($requireLock) {
			return !$lockedByGivenToken;
		}

		return false;
	}


	/**
	 * Generate a new token
	 */
	private function getToken(): string {
		return $this->secureRandom->generate(64, ISecureRandom::CHAR_UPPER . ISecureRandom::CHAR_LOWER . ISecureRandom::CHAR_DIGITS);
	}
}
