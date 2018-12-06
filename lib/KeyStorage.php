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


use OCA\EndToEndEncryption\Exceptions\KeyExistsException;
use OCP\Files\ForbiddenException;
use OCP\Files\IAppData;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\ILogger;
use OCP\IUser;
use OCP\IUserManager;
use OCP\IUserSession;

/**
 * Class KeyStorage
 *
 * read and write encryption keys to the server
 *
 * @package OCA\EndToEndEncryption
 */
class KeyStorage implements IKeyStorage {

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

	private function checkFolderStructure() {
		$keyStorageRoot = $this->appData->getFolder('/');
		if (!$keyStorageRoot->fileExists($this->privateKeysRoot)) {
			$this->appData->newFolder($this->privateKeysRoot);
		}
		if (!$keyStorageRoot->fileExists($this->publicKeysRoot)) {
			$this->appData->newFolder($this->publicKeysRoot);
		}
	}


	/**
	 * get users public key
	 *
	 * @param string $uid
	 * @return string
	 *
	 * @throws \RuntimeException
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	public function getPublicKey($uid) {
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
	 * @throws \RuntimeException
	 * @throws NotFoundException
	 */
	public function deletePublicKey($uid) {
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
	public function publicKeyExists($uid) {
		try {
			$publicKeys = $this->appData->getFolder($this->publicKeysRoot);
			return $publicKeys->fileExists($uid . '.public.key');
		} catch (\Exception $e) {
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
	 * @throws ForbiddenException
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	public function getPrivateKey($uid) {
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
	 * @throws \RuntimeException
	 * @throws NotFoundException
	 */
	public function deletePrivateKey($uid) {
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
	public function deleteUserKeys(IUser $user) {
		$uid = $user->getUID();
		if(!$this->userManager->userExists($uid)) {
			$this->deleteUsersPrivateKey($uid);
			$this->deleteUsersPublicKey($uid);
		}
	}

	/**
	 * delete users private key
	 *
	 * @param $uid
	 * @throws NotPermittedException
	 */
	protected function deleteUsersPrivateKey($uid) {
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
	 * @throws NotPermittedException
	 */
	protected function deleteUsersPublicKey($uid) {
		try {
			$publicKeys = $this->appData->getFolder($this->publicKeysRoot);
			$publicKeys->getFile($uid . '.public.key')->delete();
		} catch (NotFoundException $e) {
			// do nothing if the key doesn't exists
		}
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
	public function setPrivateKey($privateKey, $uid) {
		$fileName = $uid . '.private.key';
		try {
			$privateKeysDir = $this->appData->getFolder($this->privateKeysRoot);
			if ($privateKeysDir->fileExists($fileName)) {
				throw new KeyExistsException('private key already exists');
			}
			$file = $privateKeysDir->newFile($fileName);
			$file->putContent($privateKey);
			return true;
		} catch (\Exception $e) {
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
	 * @throws \Exception
	 */
	public function setPublicKey($publicKey, $uid) {
		$fileName = $uid . '.public.key';
		try {
			$privateKeysDir = $this->appData->getFolder($this->publicKeysRoot);
			$file = $privateKeysDir->newFile($fileName);
			$file->putContent($publicKey);
			return true;
		} catch (\Exception $e) {
			$error = 'Can\'t store public key: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new \Exception('Can\'t store public key');
		}

	}
}
