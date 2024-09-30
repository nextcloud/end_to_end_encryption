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
use OCP\IUser;
use OCP\IUserSession;

/**
 * Class KeyStorage
 *
 * read and write encryption keys to the server
 *
 * @package OCA\EndToEndEncryption
 */
class KeyStorage implements IKeyStorage {
	private IAppData $appData;
	private IUserSession $userSession;
	private string $privateKeysRoot = '/private-keys';
	private string $publicKeysRoot = '/public-keys';

	public function __construct(IAppData $appData,
		IUserSession $userSession) {
		$this->appData = $appData;
		$this->userSession = $userSession;
	}

	/**
	 * @inheritDoc
	 */
	public function getPublicKey(string $uid): string {
		$this->verifyFolderStructure();

		$fileName = $this->getFileNameForPublicKey($uid);
		return $this->appData->getFolder($this->publicKeysRoot)
			->getFile($fileName)
			->getContent();
	}

	/**
	 * @inheritDoc
	 */
	public function publicKeyExists(string $uid): bool {
		$this->verifyFolderStructure();

		$fileName = $this->getFileNameForPublicKey($uid);
		return $this->appData->getFolder($this->publicKeysRoot)
			->fileExists($fileName);
	}

	/**
	 * @inheritDoc
	 */
	public function setPublicKey(string $publicKey, string $uid): void {
		$this->verifyFolderStructure();

		$fileName = $this->getFileNameForPublicKey($uid);
		$publicKeyRoot = $this->appData->getFolder($this->publicKeysRoot);
		if ($publicKeyRoot->fileExists($fileName)) {
			throw new KeyExistsException('Public key already exists');
		}

		$publicKeyRoot
			->newFile($fileName)
			->putContent($publicKey);
	}

	/**
	 * @inheritDoc
	 */
	public function deletePublicKey(string $uid): void {
		$this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new NotPermittedException('You are not allowed to delete the public key');
		}

		$fileName = $this->getFileNameForPublicKey($uid);
		$publicKeyRoot = $this->appData->getFolder($this->publicKeysRoot);
		try {
			$file = $publicKeyRoot->getFile($fileName);
		} catch (NotFoundException $ex) {
			return;
		}

		$file->delete();
	}

	/**
	 * @inheritDoc
	 */
	public function getPrivateKey(string $uid): string {
		$this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new ForbiddenException('You are not allowed to access the private key', false);
		}

		$fileName = $this->getFileNameForPrivateKey($uid);
		return $this->appData->getFolder($this->privateKeysRoot)
			->getFile($fileName)
			->getContent();
	}

	/**
	 * @inheritDoc
	 */
	public function privateKeyExists(string $uid): bool {
		$this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new ForbiddenException('You are not allowed to access the private key', false);
		}

		$fileName = $this->getFileNameForPrivateKey($uid);
		return $this->appData->getFolder($this->privateKeysRoot)
			->fileExists($fileName);
	}

	/**
	 * @inheritDoc
	 */
	public function setPrivateKey(string $privateKey, string $uid): void {
		$this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new ForbiddenException('You are not allowed to write the private key', false);
		}

		$fileName = $this->getFileNameForPrivateKey($uid);
		$privateKeysRoot = $this->appData->getFolder($this->privateKeysRoot);
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
	public function deletePrivateKey(string $uid): void {
		$this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new NotPermittedException('You are not allowed to delete the private key');
		}

		$fileName = $this->getFileNameForPrivateKey($uid);
		$privateKeysRoot = $this->appData->getFolder($this->privateKeysRoot);
		try {
			$file = $privateKeysRoot->getFile($fileName);
		} catch (NotFoundException $ex) {
			return;
		}

		$file->delete();
	}

	/**
	 * @inheritDoc
	 */
	public function deleteUserKeys(IUser $user): void {
		$this->verifyFolderStructure();
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
		$fileName = $this->getFileNameForPublicKey($uid);

		try {
			$this->appData->getFolder($this->publicKeysRoot)
				->getFile($fileName)
				->delete();
		} catch (NotFoundException $e) {
			return;
		}
	}

	/**
	 * Delete private key of user
	 *
	 * @throws NotPermittedException
	 */
	protected function deleteUsersPrivateKey(string $uid): void {
		$fileName = $this->getFileNameForPrivateKey($uid);

		try {
			$this->appData->getFolder($this->privateKeysRoot)
				->getFile($fileName)
				->delete();
		} catch (NotFoundException $e) {
			return;
		}
	}

	/**
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	protected function verifyFolderStructure(): void {
		$keyStorageRoot = $this->appData->getFolder('/');
		if (!$keyStorageRoot->fileExists($this->privateKeysRoot)) {
			$this->appData->newFolder($this->privateKeysRoot);
		}
		if (!$keyStorageRoot->fileExists($this->publicKeysRoot)) {
			$this->appData->newFolder($this->publicKeysRoot);
		}
	}

	private function getFileNameForPublicKey(string $uid): string {
		return $uid . '.public.key';
	}

	private function getFileNameForPrivateKey(string $uid): string {
		return $uid . '.private.key';
	}
}
