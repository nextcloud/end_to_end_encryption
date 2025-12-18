<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\Exceptions\KeyExistsException;
use OCP\Files\ForbiddenException;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\Files\SimpleFS\ISimpleFolder;
use OCP\IUser;
use OCP\IUserSession;
use OCP\Share\IManager;

/**
 * Class KeyStorage
 *
 * read and write encryption keys to the server
 *
 * @package OCA\EndToEndEncryption
 */
class KeyStorage implements IKeyStorage {
	private string $privateKeysRoot = '/private-keys';
	private string $publicKeysRoot = '/public-keys';

	private ?ISimpleFolder $privateKeysRootFolder = null;
	private ?ISimpleFolder $publicKeysRootFolder = null;

	public function __construct(
		private IAppData $appData,
		private IUserSession $userSession,
		private IManager $shareManager,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function getPublicKey(string $uid): string {
		$publicKeysRoot = $this->getPublicKeysRootFolder();

		$fileName = $this->getFileNameForPublicKey($uid);
		return $publicKeysRoot->getFile($fileName)->getContent();
	}

	/**
	 * @inheritDoc
	 */
	public function publicKeyExists(string $uid, ?string $shareToken = null): bool {
		$publicKeysRoot = $this->getPublicKeysRootFolder();

		$fileName = $this->getFileNameForPublicKey($uid, $shareToken);
		return $publicKeysRoot->fileExists($fileName);
	}

	/**
	 * @inheritDoc
	 */
	public function setPublicKey(string $publicKey, string $uid, ?string $shareToken = null): void {
		$publicKeysRoot = $this->getPublicKeysRootFolder();

		$fileName = $this->getFileNameForPublicKey($uid, $shareToken);
		if ($publicKeysRoot->fileExists($fileName)) {
			throw new KeyExistsException('Public key already exists');
		}

		$publicKeysRoot
			->newFile($fileName)
			->putContent($publicKey);
	}

	/**
	 * @inheritDoc
	 */
	public function deletePublicKey(string $uid, ?string $shareToken = null): void {
		$publicKeysRoot = $this->getPublicKeysRootFolder();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new NotPermittedException('You are not allowed to delete the public key');
		}
		if ($shareToken !== null) {
			$share = $this->shareManager->getShareByToken($shareToken);
			if ($share->getShareOwner() !== $user->getUID()) {
				throw new NotPermittedException('You are not allowed to delete the public key');
			}
		}

		$fileName = $this->getFileNameForPublicKey($uid, $shareToken);
		try {
			$file = $publicKeysRoot->getFile($fileName);
		} catch (NotFoundException $ex) {
			return;
		}

		$file->delete();
	}

	/**
	 * @inheritDoc
	 */
	public function getPrivateKey(string $uid, ?string $shareToken = null): string {
		$privateKeysRoot = $this->getPrivateKeysRootFolder();

		$user = $this->userSession->getUser();
		if ($shareToken === null && ($user === null || $user->getUID() !== $uid)) {
			throw new ForbiddenException('You are not allowed to access the private key', false);
		}

		$fileName = $this->getFileNameForPrivateKey($uid, $shareToken);
		return $privateKeysRoot->getFile($fileName)->getContent();
	}

	/**
	 * @inheritDoc
	 */
	public function privateKeyExists(string $uid, ?string $shareToken = null): bool {
		$privateKeysRoot = $this->getPrivateKeysRootFolder();

		$user = $this->userSession->getUser();
		if (($user === null && $shareToken === null) || ($shareToken === null && $user->getUID() !== $uid)) {
			throw new ForbiddenException('You are not allowed to access the private key', false);
		}

		$fileName = $this->getFileNameForPrivateKey($uid, $shareToken);
		return $privateKeysRoot->fileExists($fileName);
	}

	/**
	 * @inheritDoc
	 */
	public function setPrivateKey(string $privateKey, string $uid, ?string $shareToken = null): void {
		$privateKeysRoot = $this->getPrivateKeysRootFolder();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new ForbiddenException('You are not allowed to write the private key', false);
		}
		if ($shareToken !== null) {
			$share = $this->shareManager->getShareByToken($shareToken);
			if ($share->getShareOwner() !== $user->getUID()) {
				throw new ForbiddenException('You are not allowed to write the private key', false);
			}
		}

		$fileName = $this->getFileNameForPrivateKey($uid, $shareToken);
		if ($privateKeysRoot->fileExists($fileName)) {
			throw new KeyExistsException('Private key already exists');
		}

		$privateKeysRoot
			->newFile($fileName)
			->putContent($privateKey);
	}

	/**
	 * @inheritDoc
	 */
	public function deletePrivateKey(string $uid, ?string $shareToken = null): void {
		$privateKeysRoot = $this->getPrivateKeysRootFolder();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new NotPermittedException('You are not allowed to delete the private key');
		}
		if ($shareToken !== null) {
			$share = $this->shareManager->getShareByToken($shareToken);
			if ($share->getShareOwner() !== $user->getUID()) {
				throw new NotPermittedException('You are not allowed to delete the private key');
			}
		}

		$fileName = $this->getFileNameForPrivateKey($uid);
		try {
			$file = $privateKeysRoot->getFile($fileName);
		} catch (NotFoundException) {
			return;
		}

		$file->delete();
	}

	/**
	 * @inheritDoc
	 */
	public function deleteUserKeys(IUser $user): void {
		$uid = $user->getUID();

		$this->deleteUsersPublicKey($uid);
		$this->deleteUsersPrivateKey($uid);
	}

	/**
	 * Delete public key of user
	 *
	 * @throws NotPermittedException
	 */
	protected function deleteUsersPublicKey(string $uid): void {
		$publicKeysRoot = $this->getPublicKeysRootFolder();
		$fileName = $this->getFileNameForPublicKey($uid);

		try {
			$publicKeysRoot->getFile($fileName)->delete();
		} catch (NotFoundException) {
			return;
		}
	}

	/**
	 * Delete private key of user
	 *
	 * @throws NotPermittedException
	 */
	protected function deleteUsersPrivateKey(string $uid): void {
		$privateKeysRoot = $this->getPrivateKeysRootFolder();
		$fileName = $this->getFileNameForPrivateKey($uid);

		try {
			$privateKeysRoot->getFile($fileName)->delete();
		} catch (NotFoundException) {
			return;
		}
	}

	/**
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	protected function getPrivateKeysRootFolder(): ISimpleFolder {
		if (!$this->privateKeysRootFolder) {
			try {
				$this->privateKeysRootFolder = $this->appData->getFolder($this->privateKeysRoot);
			} catch (NotFoundException) {
				$this->privateKeysRootFolder = $this->appData->newFolder($this->privateKeysRoot);
			}
		}

		return $this->privateKeysRootFolder;
	}

	/**
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	protected function getPublicKeysRootFolder(): ISimpleFolder {
		if (!$this->publicKeysRootFolder) {
			try {
				$this->publicKeysRootFolder = $this->appData->getFolder($this->publicKeysRoot);
			} catch (NotFoundException) {
				$this->publicKeysRootFolder = $this->appData->newFolder($this->publicKeysRoot);
			}
		}

		return $this->publicKeysRootFolder;
	}

	private function getFileNameForPublicKey(string $uid, ?string $shareToken = null): string {
		if (str_starts_with($uid, 's:')) {
			$shareToken = substr($uid, 2);
		}

		if ($shareToken !== null) {
			return $shareToken . '.share.public.key';
		}
		return $uid . '.public.key';
	}

	private function getFileNameForPrivateKey(string $uid, ?string $shareToken = null): string {
		if ($shareToken !== null) {
			return $shareToken . '.share.private.key';
		}
		return $uid . '.private.key';
	}
}
