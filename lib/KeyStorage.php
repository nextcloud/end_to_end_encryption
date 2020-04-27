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

use Exception;
use OCA\EndToEndEncryption\Exceptions\KeyExistsException;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCP\Files\ForbiddenException;
use OCP\Files\IAppData;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\ILogger;
use OCP\IUser;
use OCP\IUserManager;
use OCP\IUserSession;
use RuntimeException;

/**
 * Class KeyStorage
 *
 * read and write encryption keys to the server
 *
 * @package OCA\EndToEndEncryption
 */
class KeyStorage {

	/** @var  IAppData */
	private $appData;

	/** @var IUserSession */
	private $userSession;

	/** @var ILogger */
	private $logger;

	/** @var IRootFolder */
	private $rootFolder;

	/** @var IUserManager */
	private $userManager;

	/** @var string */
	private $privateKeysRoot = '/private-keys';

	/** @var string */
	private $publicKeysRoot = '/public-keys';

	/** @var string */
	private $metaDataRoot = '/meta-data';

	/** @var string */
	private $metaDataFileName = 'meta.data';

	/**
	 * KeyStorage constructor.
	 *
	 * @param IAppData $appData
	 * @param IUserSession $userSession
	 * @param ILogger $logger
	 * @param IRootFolder $rootFolder
	 * @param IUserManager $userManager
	 */
	public function __construct(IAppData $appData,
								IUserSession $userSession,
								ILogger $logger,
								IRootFolder $rootFolder,
								IUserManager $userManager
	) {
		$this->appData = $appData;
		$this->userSession = $userSession;
		$this->logger = $logger;
		$this->rootFolder = $rootFolder;
		$this->userManager = $userManager;
		$this->checkFolderStructure();
	}

	private function checkFolderStructure(): void {
		$keyStorageRoot = $this->appData->getFolder('/');
		if (!$keyStorageRoot->fileExists($this->privateKeysRoot)) {
			$this->appData->newFolder($this->privateKeysRoot);
		}
		if (!$keyStorageRoot->fileExists($this->publicKeysRoot)) {
			$this->appData->newFolder($this->publicKeysRoot);
		}
		if (!$keyStorageRoot->fileExists($this->metaDataRoot)) {
			$this->appData->newFolder($this->metaDataRoot);
		}
	}

	/**
	 * create target folder recursively
	 *
	 * @param string $path
	 * @param string $root
	 *
	 * @throws Exception
	 */
	private function prepareTargetFolder(string $path, string $root): void {
		try {
			$node = $this->appData->getFolder($root);
			// create folder structure recursively
			if (!$node->fileExists($path)) {
				$sub_dirs = explode('/', ltrim($path, '/'));
				$dir = '';
				foreach ($sub_dirs as $sub_dir) {
					$dir .= '/' . $sub_dir;
					if (!$node->fileExists($dir)) {
						$this->appData->newFolder($root . $dir);
					}
				}
			}
		} catch (Exception $e) {
			$error = 'Can\'t prepare target folders: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw $e;
		}
	}


	/**
	 * get users public key
	 *
	 * @param string $uid
	 * @return string
	 *
	 * @throws RuntimeException
	 * @throws NotFoundException
	 */
	public function getPublicKey(string $uid): string {
		$publicKeys = $this->appData->getFolder($this->publicKeysRoot);
		$file = $publicKeys->getFile($uid . '.public.key');
		return $file->getContent();
	}


	/**
	 * delete the users public key
	 *
	 * @param string $uid
	 * @return bool
	 *
	 * @throws NotPermittedException
	 * @throws RuntimeException
	 * @throws NotFoundException
	 */
	public function deletePublicKey(string $uid): bool {
		$user = $this->userSession->getUser();
		if ($user !== null && $user->getUID() === $uid) {
			$publicKeys = $this->appData->getFolder($this->publicKeysRoot);
			$file = $publicKeys->getFile($uid . '.public.key');
			$file->delete();
			return true;
		}

		throw new NotPermittedException('you are not allowed to delete the private key');
	}


	/**
	 * check if a public key exists
	 *
	 * @param string $uid
	 * @return bool
	 */
	public function publicKeyExists(string $uid): ?bool {
		try {
			$publicKeys = $this->appData->getFolder($this->publicKeysRoot);
			return $publicKeys->fileExists($uid . '.public.key');
		} catch (Exception $e) {
			$this->logger->error($e->getMessage(), ['app' => 'end_to_end_encryption']);
			return false;
		}
	}

	/**
	 * get users private key
	 *
	 * @param string $uid
	 * @return string
	 *
	 * @throws RuntimeException
	 * @throws NotFoundException
	 * @throws ForbiddenException
	 */
	public function getPrivateKey(string $uid): string {
		$user = $this->userSession->getUser();
		if ($user !== null && $user->getUID() === $uid) {
			$privateKeys = $this->appData->getFolder($this->privateKeysRoot);
			$file = $privateKeys->getFile($uid . '.private.key');
			return $file->getContent();
		}

		throw new ForbiddenException('you are not allowed to access the private key', false);
	}


	/**
	 * get users private key
	 *
	 * @param string $uid
	 * @return bool
	 *
	 * @throws NotPermittedException
	 * @throws RuntimeException
	 * @throws NotFoundException
	 */
	public function deletePrivateKey(string $uid): bool {
		$user = $this->userSession->getUser();
		if ($user !== null && $user->getUID() === $uid) {
			$privateKeys = $this->appData->getFolder($this->privateKeysRoot);
			$file = $privateKeys->getFile($uid . '.private.key');
			$file->delete();
			return true;
		}

		throw new NotPermittedException('you are not allowed to delete the private key');
	}

	/**
	 * delete all user private and public key permanently
	 *
	 * @param IUser $user
	 */
	public function deleteUserKeys(IUser $user): void {
		$uid = $user->getUID();
		if (!$this->userManager->userExists($uid)) {
			$this->deleteUsersPrivateKey($uid);
			$this->deleteUsersPublicKey($uid);
		}
	}

	/**
	 * delete users private key
	 *
	 * @param string $uid
	 */
	protected function deleteUsersPrivateKey(string $uid): void {
		try {
			$privateKeys = $this->appData->getFolder($this->privateKeysRoot);
			$privateKeys->getFile($uid . '.private.key')->delete();
		} catch (NotFoundException $e) {
			// do nothing if the key doesn't exists
		}
	}

	/**
	 * delete users public key
	 *
	 * @param string $uid
	 */
	protected function deleteUsersPublicKey(string $uid): void {
		try {
			$publicKeys = $this->appData->getFolder($this->publicKeysRoot);
			$publicKeys->getFile($uid . '.public.key')->delete();
		} catch (NotFoundException $e) {
			// do nothing if the key doesn't exists
		}
	}

	/**
	 * get meta data file
	 *
	 * @param int $id
	 * @return string
	 *
	 * @throws NotFoundException
	 * @throws RuntimeException
	 */
	public function getMetaData(int $id): string {
		$path = $this->getOwnerPath($id);
		$folder = $this->appData->getFolder($this->metaDataRoot . '/' . $path);
		$file = $folder->getFile($this->metaDataFileName);
		return $file->getContent();
	}

	/**
	 * delete meta data file
	 *
	 * @param int $id
	 *
	 * @throws RuntimeException
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function deleteMetaData(int $id): void {
		$owner = $this->getOwner($id);
		$currentUser = $this->userSession->getUser();
		if ($owner->getUID() !== $currentUser->getUID()) {
			throw new NotPermittedException();
		}

		$path = $this->getOwnerPath($id);
		$folder = $this->appData->getFolder($this->metaDataRoot . '/' . $path);
		$folder->getFile($this->metaDataFileName)->delete();
	}


	/**
	 * set meta data file
	 *
	 * @param int $id file id
	 * @param string $metaData
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws RuntimeException
	 * @throws Exception
	 * @throws MetaDataExistsException
	 */
	public function setMetaData(int $id, string $metaData): void {
		$path = $this->getOwnerPath($id);
		$this->prepareTargetFolder($path, $this->metaDataRoot);
		$dir = $this->appData->getFolder($this->metaDataRoot . '/' . $path);
		if ($dir->fileExists($this->metaDataFileName)) {
			throw new MetaDataExistsException('meta data file already exists');
		}

		$file = $dir->newFile($this->metaDataFileName);
		$file->putContent($metaData);
	}


	/**
	 * delete all meta data files for a given user, e.g. when the user was deleted
	 *
	 * @param IUser $user
	 */
	public function deleteAllMetaDataFiles(IUser $user): void {
		$uid = $user->getUID();
		if (!$this->userManager->userExists($uid)) {
			try {
				$metaDataRoot = $this->appData->getFolder($this->metaDataRoot . '/' . $uid);
				$metaDataRoot->delete();
			} catch (NotFoundException $e) {
				// do nothing if no meta data exists
			}
		}
	}

	/**
	 * update meta data file
	 *
	 * @param int $id file id
	 * @param string $fileKey
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws RuntimeException
	 * @throws Exception
	 * @throws MissingMetaDataException
	 */
	public function updateMetaData(int $id, string $fileKey): void {
		// ToDo check signature for race condition
		$path = $this->getOwnerPath($id);
		$this->prepareTargetFolder($path, $this->metaDataRoot);
		$dir = $this->appData->getFolder($this->metaDataRoot . '/' . $path);
		if (!$dir->fileExists($this->metaDataFileName)) {
			throw new MissingMetaDataException('meta data file missing');
		}

		$file = $dir->getFile($this->metaDataFileName);
		$file->putContent($fileKey);
	}

	/**
	 * store private key
	 *
	 * @param string $privateKey
	 * @param string $uid
	 * @return bool
	 *
	 * @throw KeyExistsException
	 */
	public function setPrivateKey(string $privateKey, string $uid): ?bool {
		$fileName = $uid . '.private.key';
		try {
			$privateKeysDir = $this->appData->getFolder($this->privateKeysRoot);
			if ($privateKeysDir->fileExists($fileName)) {
				throw new KeyExistsException('private key already exists');
			}
			$file = $privateKeysDir->newFile($fileName);
			$file->putContent($privateKey);
			return true;
		} catch (Exception $e) {
			$error = 'Can\'t store private key: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			return false;
		}
	}


	/**
	 * store public key
	 *
	 * @param string $publicKey
	 * @param string $uid
	 * @return bool
	 *
	 * @throws Exception
	 */
	public function setPublicKey(string $publicKey, string $uid): ?bool {
		$fileName = $uid . '.public.key';
		try {
			$privateKeysDir = $this->appData->getFolder($this->publicKeysRoot);
			$file = $privateKeysDir->newFile($fileName);
			$file->putContent($publicKey);
			return true;
		} catch (Exception $e) {
			$error = 'Can\'t store public key: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new Exception('Can\'t store public key');
		}
	}

	/**
	 * get path to the file for the file-owner
	 *
	 * @param int $id file id
	 * @return string path to the owner's file
	 *
	 * @throws NotFoundException
	 */
	private function getOwnerPath(int $id): string {
		$node = $this->rootFolder->getById($id);
		if (!isset($node[0])) {
			throw new NotFoundException('No file with ID ' . $id);
		}
		$owner = $node[0]->getOwner();
		$ownerRoot = $this->rootFolder->getUserFolder($owner->getUID());
		$node = $ownerRoot->getById($id);
		if (!isset($node[0])) {
			throw new NotFoundException('No file for owner with ID ' . $id);
		}
		return $node[0]->getPath();
	}

	/**
	 * get owner
	 *
	 * @param int $id file id
	 * @return IUser
	 * @throws NotFoundException
	 */
	private function getOwner(int $id): IUser {
		$node = $this->rootFolder->getById($id);
		if (!isset($node[0])) {
			throw new NotFoundException('No file with ID ' . $id);
		}
		$owner = $node[0]->getOwner();

		return $owner;
	}
}
