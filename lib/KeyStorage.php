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
		['publicKeysRoot' => $publicKeysRoot] = $this->verifyFolderStructure();

		$fileName = $this->getFileNameForPublicKey($uid);
		return $publicKeysRoot->getFile($fileName)->getContent();
	}

	/**
	 * @inheritDoc
	 */
	public function publicKeyExists(string $uid): bool {
		['publicKeysRoot' => $publicKeysRoot] = $this->verifyFolderStructure();

		$fileName = $this->getFileNameForPublicKey($uid);
		return $publicKeysRoot->fileExists($fileName);
	}

	/**
	 * @inheritDoc
	 */
	public function setPublicKey(string $publicKey, string $uid): void {
		['publicKeysRoot' => $publicKeysRoot] = $this->verifyFolderStructure();

		$fileName = $this->getFileNameForPublicKey($uid);
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
	public function deletePublicKey(string $uid): void {
		['publicKeysRoot' => $publicKeysRoot] = $this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new NotPermittedException('You are not allowed to delete the public key');
		}

		$fileName = $this->getFileNameForPublicKey($uid);
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
	public function getPrivateKey(string $uid): string {
		['privateKeysRoot' => $privateKeysRoot] = $this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new ForbiddenException('You are not allowed to access the private key', false);
		}

		$fileName = $this->getFileNameForPrivateKey($uid);
		return $privateKeysRoot->getFile($fileName)->getContent();
	}

	/**
	 * @inheritDoc
	 */
	public function privateKeyExists(string $uid): bool {
		['privateKeysRoot' => $privateKeysRoot] = $this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new ForbiddenException('You are not allowed to access the private key', false);
		}

		$fileName = $this->getFileNameForPrivateKey($uid);
		return $privateKeysRoot->fileExists($fileName);
	}

	/**
	 * @inheritDoc
	 */
	public function setPrivateKey(string $privateKey, string $uid): void {
		['privateKeysRoot' => $privateKeysRoot] = $this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new ForbiddenException('You are not allowed to write the private key', false);
		}

		$fileName = $this->getFileNameForPrivateKey($uid);
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
		['privateKeysRoot' => $privateKeysRoot] = $this->verifyFolderStructure();

		$user = $this->userSession->getUser();
		if ($user === null || $user->getUID() !== $uid) {
			throw new NotPermittedException('You are not allowed to delete the private key');
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
		[
			'privateKeysRoot' => $privateKeysRoot,
			'publicKeysRoot' => $publicKeysRoot
		] = $this->verifyFolderStructure();
		$uid = $user->getUID();

		$this->deleteUsersPublicKey($publicKeysRoot, $uid);
		$this->deleteUsersPrivateKey($privateKeysRoot, $uid);
	}

	/**
	 * Delete public key of user
	 *
	 * @throws NotPermittedException
	 */
	protected function deleteUsersPublicKey(ISimpleFolder $publicKeysRoot, string $uid): void {
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
	protected function deleteUsersPrivateKey(ISimpleFolder $privateKeysRoot, string $uid): void {
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
	 * @return array{privateKeysRoot: ISimpleFolder, publicKeysRoot: ISimpleFolder}
	 */
	protected function verifyFolderStructure(): array {
		try {
			$privateKeysRoot = $this->appData->getFolder($this->privateKeysRoot);
		} catch (NotFoundException) {
			$privateKeysRoot = $this->appData->newFolder($this->privateKeysRoot);
		}
		try {
			$publicKeysRoot = $this->appData->getFolder($this->publicKeysRoot);
		} catch (NotFoundException) {
			$publicKeysRoot = $this->appData->newFolder($this->publicKeysRoot);
		}

		return [
			'privateKeysRoot' => $privateKeysRoot,
			'publicKeysRoot' => $publicKeysRoot,
		];
	}

	private function getFileNameForPublicKey(string $uid): string {
		return $uid . '.public.key';
	}

	private function getFileNameForPrivateKey(string $uid): string {
		return $uid . '.private.key';
	}
}
