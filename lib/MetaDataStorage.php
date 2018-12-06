<?php
/**
 * @copyright Copyright (c) 2018 Bjoern Schiessle <bjoern@schiessle.org>
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


use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
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
class MetaDataStorage {

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
		$metaDataStorageRoot = $this->appData->getFolder('/');
		if (!$metaDataStorageRoot->fileExists($this->metaDataRoot)) {
			$this->appData->newFolder($this->metaDataRoot);
		}
	}

	/**
	 * create target folder recursively
	 *
	 * @param string $path
	 * @param $root
	 *
	 * @throws \Exception
	 */
	private function prepareTargetFolder($path, $root) {
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
		} catch (\Exception $e) {
			$error = 'Can\'t prepare target folders: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw $e;
		}
	}


	/**
	 * get meta data file
	 *
	 * @param int $id
	 * @return string
	 *
	 * @throws NotFoundException
	 * @throws \RuntimeException
	 * @throws NotPermittedException
	 */
	public function getMetaData($id) {
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
	 * @throws \RuntimeException
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function deleteMetaData($id) {
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
	 * @throws \RuntimeException
	 * @throws \Exception
	 * @throws MetaDataExistsException
	 */
	public function setMetaData($id, $metaData) {
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
	 * @throws NotPermittedException
	 */
	public function deleteAllMetaDataFiles(IUser $user) {
		$uid = $user->getUID();
		if(!$this->userManager->userExists($uid)) {
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
	 * @throws \RuntimeException
	 * @throws \Exception
	 * @throws MissingMetaDataException
	 */
	public function updateMetaData($id, $fileKey) {
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
	 * get path to the file for the file-owner
	 *
	 * @param int $id file id
	 * @return string path to the owner's file
	 *
	 * @throws NotFoundException
	 */
	private function getOwnerPath($id) {
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
	private function getOwner($id) {
		$node = $this->rootFolder->getById($id);
		if (!isset($node[0])) {
			throw new NotFoundException('No file with ID ' . $id);
		}
		$owner = $node[0]->getOwner();

		return $owner;
	}
}
