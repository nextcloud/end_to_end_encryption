<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
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

use OC\User\NoUserException;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCP\Files\IAppData;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;

/**
 * Class MetaDataStorage
 *
 * @package OCA\EndToEndEncryption
 */
class MetaDataStorage implements IMetaDataStorage {

	/** @var IAppData */
	private $appData;

	/** @var IRootFolder */
	private $rootFolder;

	/** @var string */
	private $metaDataRoot = '/meta-data';

	/** @var string */
	private $metaDataFileName = 'meta.data';

	/** @var string */
	private $intermediateMetaDataFileName = 'intermediate.meta.data';

	/**
	 * MetaDataStorage constructor.
	 *
	 * @param IAppData $appData
	 * @param IRootFolder $rootFolder
	 */
	public function __construct(IAppData $appData,
								IRootFolder $rootFolder) {
		$this->appData = $appData;
		$this->rootFolder = $rootFolder;
	}

	/**
	 * @inheritDoc
	 */
	public function getMetaData(int $id): string {
		$this->verifyFolderStructure();
		$this->verifyOwner($id);

		$folderName = $this->getFolderNameForFileId($id);
		$folder = $this->appData->getFolder($folderName);

		return $folder
			->getFile($this->metaDataFileName)
			->getContent();
	}

	/**
	 * @inheritDoc
	 */
	public function setMetaDataIntoIntermediateFile(int $id, string $metaData): void {
		$this->verifyFolderStructure();
		$this->verifyOwner($id);

		$folderName = $this->getFolderNameForFileId($id);
		try {
			$dir = $this->appData->getFolder($folderName);
		} catch (NotFoundException $ex) {
			$dir = $this->appData->newFolder($folderName);
		}

		// Do not override metadata-file
		if ($dir->fileExists($this->metaDataFileName)) {
			throw new MetaDataExistsException('Meta-data file already exists');
		}

		if ($dir->fileExists($this->intermediateMetaDataFileName)) {
			throw new MetaDataExistsException('Intermediate meta-data file already exists');
		}

		$dir->newFile($this->intermediateMetaDataFileName)
			->putContent($metaData);
	}

	/**
	 * @inheritDoc
	 */
	public function updateMetaDataIntoIntermediateFile(int $id, string $fileKey): void {
		// ToDo check signature for race condition
		$this->verifyFolderStructure();
		$this->verifyOwner($id);

		$folderName = $this->getFolderNameForFileId($id);
		try {
			$dir = $this->appData->getFolder($folderName);
		} catch (NotFoundException $ex) {
			throw new MissingMetaDataException('Meta-data file missing');
		}

		if (!$dir->fileExists($this->metaDataFileName)) {
			throw new MissingMetaDataException('Meta-data file missing');
		}

		try {
			$intermediateMetaDataFile = $dir->getFile($this->intermediateMetaDataFileName);
		} catch (NotFoundException $ex) {
			$intermediateMetaDataFile = $dir->newFile($this->intermediateMetaDataFileName);
		}

		$intermediateMetaDataFile
			->putContent($fileKey);
	}

	/**
	 * @inheritDoc
	 */
	public function deleteMetaData(int $id): void {
		$this->verifyFolderStructure();
		$this->verifyOwner($id);

		$folderName = $this->getFolderNameForFileId($id);
		try {
			$dir = $this->appData->getFolder($folderName);
		} catch (NotFoundException $ex) {
			return;
		}

		$dir->delete();
	}

	/**
	 * @inheritDoc
	 */
	public function saveIntermediateFile(int $id): void {
		$this->verifyFolderStructure();
		$this->verifyOwner($id);

		$folderName = $this->getFolderNameForFileId($id);
		try {
			$dir = $this->appData->getFolder($folderName);
		} catch (NotFoundException $ex) {
			throw new MissingMetaDataException('Intermediate meta-data file missing');
		}

		if (!$dir->fileExists($this->intermediateMetaDataFileName)) {
			throw new MissingMetaDataException('Intermediate meta-data file missing');
		}

		$intermediateMetaDataFile = $dir->getFile($this->intermediateMetaDataFileName);

		try {
			$finalFile = $dir->getFile($this->metaDataFileName);
		} catch (NotFoundException $ex) {
			$finalFile = $dir->newFile($this->metaDataFileName);
		}

		$finalFile->putContent($intermediateMetaDataFile->getContent());
	}

	/**
	 * @inheritDoc
	 */
	public function deleteIntermediateFile(int $id): void {
		$this->verifyFolderStructure();
		$this->verifyOwner($id);

		$folderName = $this->getFolderNameForFileId($id);
		try {
			$dir = $this->appData->getFolder($folderName);
		} catch (NotFoundException $ex) {
			return;
		}

		if (!$dir->fileExists($this->intermediateMetaDataFileName)) {
			return;
		}

		$dir->getFile($this->intermediateMetaDataFileName)
			->delete();
	}

	/**
	 * @param int $id
	 * @return string
	 */
	private function getFolderNameForFileId(int $id): string {
		return $this->metaDataRoot . '/' . $id;
	}

	/**
	 * Verifies that user has access to file-id
	 *
	 * @param int $id
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	protected function verifyOwner(int $id): void {
		$nodes = $this->rootFolder->getById($id);
		if (!isset($nodes[0])) {
			throw new NotFoundException('No file with ID ' . $id);
		}

		$owner = $nodes[0]->getOwner();
		try {
			$ownerRoot = $this->rootFolder->getUserFolder($owner->getUID());
		} catch (NoUserException $ex) {
			throw new NotFoundException('No user-root for owner of ID ' . $id);
		}

		$ownerNodes = $ownerRoot->getById($id);
		if (!isset($ownerNodes[0])) {
			throw new NotFoundException('No file for owner with ID ' . $id);
		}
	}

	/**
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	protected function verifyFolderStructure(): void {
		$appDataRoot = $this->appData->getFolder('/');
		if (!$appDataRoot->fileExists($this->metaDataRoot)) {
			$this->appData->newFolder($this->metaDataRoot);
		}
	}
}
