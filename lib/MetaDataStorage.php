<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OC\User\NoUserException;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCP\Files\IAppData;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;

/**
 * Class MetaDataStorage
 *
 * @package OCA\EndToEndEncryption
 */
class MetaDataStorage implements IMetaDataStorage {
	private IAppData $appData;
	private IRootFolder $rootFolder;
	private string $metaDataRoot = '/meta-data';
	private string $metaDataFileName = 'meta.data';
	private string $intermediateMetaDataFileName = 'intermediate.meta.data';
	private string $metaDataSignatureFileName = 'meta.data.signature';
	private string $intermediateMetaDataSignatureFileName = 'intermediate.meta.data.signature';
	private string $metaDataCounterFileName = 'meta.data.counter';
	private string $intermediateMetaDataCounterFileName = 'intermediate.meta.data.counter';

	public function __construct(IAppData $appData,
		IRootFolder $rootFolder) {
		$this->appData = $appData;
		$this->rootFolder = $rootFolder;
	}

	/**
	 * @inheritDoc
	 */
	public function getMetaData(string $userId, int $id): string {
		$this->verifyFolderStructure();
		$this->verifyOwner($userId, $id);

		$legacyFile = $this->getLegacyFile($userId, $id);
		if ($legacyFile !== null) {
			return $legacyFile->getContent();
		}

		$folderName = $this->getFolderNameForFileId($id);
		$folder = $this->appData->getFolder($folderName);

		return $folder
			->getFile($this->metaDataFileName)
			->getContent();
	}

	/**
	 * @inheritDoc
	 */
	public function setMetaDataIntoIntermediateFile(string $userId, int $id, string $metaData, string $token, string $signature): void {
		$this->verifyFolderStructure();
		$this->verifyOwner($userId, $id);

		$legacyFile = $this->getLegacyFile($userId, $id);
		if ($legacyFile !== null) {
			throw new MetaDataExistsException('Legacy Meta-data file already exists');
		}

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

		$dir->newFile($this->intermediateMetaDataSignatureFileName)
			->putContent($signature);

		$this->getTokenFolder($token)->newFile("$id", '');
	}

	/**
	 * @inheritDoc
	 */
	public function updateMetaDataIntoIntermediateFile(string $userId, int $id, string $fileKey, string $token, string $signature = ''): void {
		// ToDo check signature for race condition
		$this->verifyFolderStructure();
		$this->verifyOwner($userId, $id);

		$legacyFile = $this->getLegacyFile($userId, $id);
		$folderName = $this->getFolderNameForFileId($id);
		try {
			$dir = $this->appData->getFolder($folderName);
		} catch (NotFoundException $ex) {
			// No folder and no legacy
			if ($legacyFile === null) {
				throw new MissingMetaDataException('Meta-data file missing');
			}

			$dir = $this->appData->newFolder($folderName);
		}

		if ($legacyFile === null && !$dir->fileExists($this->metaDataFileName)) {
			throw new MissingMetaDataException('Meta-data file missing');
		}

		try {
			$intermediateMetaDataFile = $dir->getFile($this->intermediateMetaDataFileName);
		} catch (NotFoundException $ex) {
			$intermediateMetaDataFile = $dir->newFile($this->intermediateMetaDataFileName);
		}

		$intermediateMetaDataFile
			->putContent($fileKey);

		// Signature can be empty when deleting the metadata, or during filedrop upload.
		if ($signature !== '') {
			$this->writeSignature($dir, $this->intermediateMetaDataSignatureFileName, $signature);
		}

		$this->getTokenFolder($token)->newFile("$id", '');
	}

	/**
	 * @inheritDoc
	 */
	public function deleteMetaData(string $userId, int $id): void {
		$this->verifyFolderStructure();
		$this->verifyOwner($userId, $id);

		$folderName = $this->getFolderNameForFileId($id);
		try {
			$dir = $this->appData->getFolder($folderName);
		} catch (NotFoundException $ex) {
			return;
		}

		$dir->delete();
		$this->cleanupLegacyFile($userId, $id);
	}

	/**
	 * @inheritDoc
	 */
	public function saveIntermediateFile(string $userId, int $id, bool $deleted = false): void {
		$this->verifyFolderStructure();
		if (!$deleted) {
			// if the file was deleted the owner check cannot work
			$this->verifyOwner($userId, $id);
		}

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
		// If the intermediate file is empty, delete the metadata file
		if ($intermediateMetaDataFile->getContent() === '{}') {
			$dir->delete();
		} else {
			try {
				$finalFile = $dir->getFile($this->metaDataFileName);
			} catch (NotFoundException $ex) {
				$finalFile = $dir->newFile($this->metaDataFileName);
			}

			$finalFile->putContent($intermediateMetaDataFile->getContent());
			// After successfully saving, automatically delete the intermediate file
			$intermediateMetaDataFile->delete();

			if ($dir->fileExists($this->intermediateMetaDataSignatureFileName)) {
				$intermediateMetaDataSignature = $dir->getFile($this->intermediateMetaDataSignatureFileName);
				$this->writeSignature($dir, $this->metaDataSignatureFileName, $intermediateMetaDataSignature->getContent());
				$intermediateMetaDataSignature->delete();
			}

			$this->saveCounter($id);
		}

		$this->cleanupLegacyFile($userId, $id);
	}

	private function writeSignature(ISimpleFolder $dir, string $filename, string $signature): void {
		try {
			$signatureFile = $dir->getFile($filename);
		} catch (NotFoundException $ex) {
			$signatureFile = $dir->newFile($filename);
		}

		$signatureFile->putContent($signature);
	}

	/**
	 * @inheritDoc
	 */
	public function readSignature(int $id): string {
		$folderName = $this->getFolderNameForFileId($id);
		$dir = $this->appData->getFolder($folderName);

		try {
			return $dir->getFile($this->metaDataSignatureFileName)->getContent();
		} catch (NotFoundException $ex) {
			$metadata = $dir->getFile($this->metaDataFileName)->getContent();
			$decodedMetadata = json_decode($metadata, true);

			if ($decodedMetadata['metadata']['version'] === '1.2') {
				return '';
			}

			if ($decodedMetadata['metadata']['version'] === 1.2) {
				return '';
			}

			if ($decodedMetadata['metadata']['version'] === 1) {
				return '';
			}

			throw $ex;
		}
	}

	/**
	 * @inheritDoc
	 */
	public function deleteIntermediateFile(string $userId, int $id): void {
		$this->verifyFolderStructure();
		$this->verifyOwner($userId, $id);

		$folderName = $this->getFolderNameForFileId($id);
		try {
			$dir = $this->appData->getFolder($folderName);
		} catch (NotFoundException $ex) {
			return;
		}

		if ($dir->fileExists($this->intermediateMetaDataFileName)) {
			$dir->getFile($this->intermediateMetaDataFileName)
				->delete();
		}

		if ($dir->fileExists($this->intermediateMetaDataCounterFileName)) {
			$dir->getFile($this->intermediateMetaDataCounterFileName)
				->delete();
		}
	}

	private function getFolderNameForFileId(int $id): string {
		return $this->metaDataRoot . '/' . $id;
	}

	/**
	 * Verifies that user has access to file-id
	 *
	 * @throws NotFoundException
	 */
	protected function verifyOwner(string $userId, int $id): void {
		try {
			$userFolder = $this->rootFolder->getUserFolder($userId);
		} catch (NoUserException|NotPermittedException $ex) {
			throw new NotFoundException('No user-root for ' . $userId);
		}

		$node = $userFolder->getFirstNodeById($id);
		if ($node === null) {
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

	/**
	 * @throws NotPermittedException
	 */
	protected function getLegacyFile(string $userId, int $id): ?ISimpleFile {
		try {
			$legacyOwnerPath = $this->getLegacyOwnerPath($userId, $id);
		} catch (NotFoundException $e) {
			// Just return if file does not exist for user
			return null;
		}

		try {
			$legacyFolder = $this->appData->getFolder($this->metaDataRoot . '/' . $legacyOwnerPath);
			return $legacyFolder->getFile($this->metaDataFileName);
		} catch (NotFoundException $e) {
			// Just return if no legacy file exits
			return null;
		}
	}

	/**
	 * @throws NotPermittedException
	 */
	protected function cleanupLegacyFile(string $userId, int $id): void {
		try {
			$legacyOwnerPath = $this->getLegacyOwnerPath($userId, $id);
		} catch (NotFoundException $e) {
			// Just return if file does not exist for user
			return;
		}

		try {
			$legacyFolder = $this->appData->getFolder($this->metaDataRoot . '/' . $legacyOwnerPath);
			$legacyFolder->delete();
		} catch (NotFoundException|NotPermittedException $e) {
			return;
		}
	}

	/**
	 * Get path to the file for the file-owner.
	 * This is needed for the old way of storing metadata-files.
	 *
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	protected function getLegacyOwnerPath(string $userId, int $id):string {
		try {
			$userFolder = $this->rootFolder->getUserFolder($userId);
		} catch (NoUserException $ex) {
			throw new NotFoundException('No user-root for ' . $userId);
		}

		$ownerNodes = $userFolder->getById($id);
		if (!isset($ownerNodes[0])) {
			throw new NotFoundException('No file for owner with ID ' . $id);
		}

		return $ownerNodes[0]->getPath();
	}

	/**
	 * @inheritDoc
	 */
	public function getTouchedFolders(string $token): array {
		return array_map(
			fn (ISimpleFile $file) => (int)$file->getName(),
			$this->getTokenFolder($token)->getDirectoryListing()
		);
	}

	/**
	 * @inheritDoc
	 */
	public function clearTouchedFolders(string $token): void {
		$this->getTokenFolder($token)->delete();
	}

	// To ease the wrap-up process during unlocking,
	// we keep track of every folder for which metadata was updated.
	// For that we create a file named /tokens/$token/$folderId.
	private function getTokenFolder(string $token): ISimpleFolder {
		try {
			return $this->appData->getFolder("/tokens/$token");
		} catch (NotFoundException $ex) {
			return $this->appData->newFolder("/tokens/$token");
		}
	}

	/**
	 * @inheritDoc
	 */
	public function getCounter(int $id): int {
		try {
			$metadataFolder = $this->appData->getFolder($this->getFolderNameForFileId($id));
			$counterFile = $metadataFolder->getFile($this->metaDataCounterFileName);
			return (int)$counterFile->getContent();
		} catch (NotFoundException $ex) {
			return 0;
		}
	}

	/**
	 * @inheritDoc
	 */
	public function saveIntermediateCounter(int $id, int $counter): void {
		$metadataFolder = $this->appData->getFolder($this->getFolderNameForFileId($id));
		$metadataFolder->newFile($this->intermediateMetaDataCounterFileName)->putContent((string)$counter);
	}

	/**
	 * Save the latest received counter from the intermediate file.
	 */
	private function saveCounter(int $id): void {
		$metadataFolder = $this->appData->getFolder($this->getFolderNameForFileId($id));
		if (!$metadataFolder->fileExists($this->intermediateMetaDataCounterFileName)) {
			return;
		}

		$intermediateCounterFile = $metadataFolder->getFile($this->intermediateMetaDataCounterFileName);

		try {
			$counterFile = $metadataFolder->getFile($this->metaDataCounterFileName);
		} catch (NotFoundException $ex) {
			$counterFile = $metadataFolder->newFile($this->metaDataCounterFileName);
		}

		$counterFile->putContent($intermediateCounterFile->getContent());
		$intermediateCounterFile->delete();
	}
}
