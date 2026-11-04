<?php

declare(strict_types=1);
/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCP\Files\Cache\ICacheEntry;
use OCP\Files\Cache\IFileAccess;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IUserManager;
use Psr\Log\LoggerInterface;

/**
 * Finds and removes the metadata of end-to-end encrypted folders that no longer exist.
 *
 * Metadata is stored either by file id (meta-data/<file id>/meta.data) or,
 * for folders encrypted before 2020, by the owner's path (meta-data/<uid>/files/<path>/meta.data).
 *
 * @psalm-type OrphanedMetaDataEntry = array{user: ?string, fileId: ?int, path: string}
 */
class OrphanedMetaDataCleaner {
	private const string METADATA_FILE_NAME = 'meta.data';
	private const array FILE_ID_METADATA_FILE_NAMES = [
		'meta.data',
		'meta.data.signature',
		'meta.data.counter',
		'intermediate.meta.data',
		'intermediate.meta.data.signature',
		'intermediate.meta.data.counter',
	];
	private const int FILE_ID_CHUNK_SIZE = 1000;

	public function __construct(
		private readonly MetaDataRoot $metaDataRoot,
		private readonly IRootFolder $rootFolder,
		private readonly IFileAccess $fileAccess,
		private readonly IUserManager $userManager,
		private readonly AuditLogger $auditLogger,
		private readonly LoggerInterface $logger,
	) {
	}

	/**
	 * @return list<OrphanedMetaDataEntry>
	 */
	public function findOrphanedMetaData(): array {
		$metaDataRoot = $this->metaDataRoot->getFolder();
		if ($metaDataRoot === null) {
			return [];
		}

		$fileIds = [];
		$entries = [];
		foreach ($metaDataRoot->getDirectoryListing() as $node) {
			if (!($node instanceof Folder)) {
				continue;
			}

			if (ctype_digit($node->getName()) && $this->hasFileIdMetaData($node)) {
				$fileIds[] = (int)$node->getName();
			}

			// Checked for numeric folders as well, as they can also belong to an account with a numeric user id
			if ($node->nodeExists('files')) {
				$filesFolder = $node->get('files');
				if ($filesFolder instanceof Folder) {
					array_push($entries, ...$this->findOrphanedLegacyMetaData($node->getName(), $filesFolder, $metaDataRoot));
				}
			}
		}

		foreach ($this->filterNonExistingFileIds($fileIds) as $fileId) {
			$entries[] = [
				'user' => null,
				'fileId' => $fileId,
				'path' => (string)$fileId,
			];
		}

		return $entries;
	}

	/**
	 * Delete the metadata of an entry returned by findOrphanedMetaData().
	 *
	 * @param OrphanedMetaDataEntry $entry
	 */
	public function deleteOrphanedMetaData(array $entry): void {
		$metaDataRoot = $this->metaDataRoot->getFolder();
		if ($metaDataRoot === null) {
			return;
		}

		$folder = $metaDataRoot->get($entry['path']);
		if (!($folder instanceof Folder)) {
			return;
		}

		// Only remove the metadata files, the folder can contain the metadata of other folders as well
		$fileNames = $entry['fileId'] !== null ? self::FILE_ID_METADATA_FILE_NAMES : [self::METADATA_FILE_NAME];
		foreach ($fileNames as $fileName) {
			if ($folder->nodeExists($fileName)) {
				$folder->get($fileName)->delete();
			}
		}

		while ($folder->getId() !== $metaDataRoot->getId() && $folder->getDirectoryListing() === []) {
			$parent = $folder->getParent();
			$folder->delete();
			$folder = $parent;
		}

		$this->auditLogger->log(
			AuditOperation::DeleteMetadata,
			'The orphaned end-to-end encryption metadata "%s" was deleted',
			['path' => $entry['path']],
		);
	}

	private function hasFileIdMetaData(Folder $folder): bool {
		foreach (self::FILE_ID_METADATA_FILE_NAMES as $fileName) {
			if ($folder->nodeExists($fileName)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Get the file ids that have no file cache entry anymore.
	 * File ids are checked against the file cache instead of resolving nodes,
	 * so that folders on currently unavailable storages are not considered deleted.
	 *
	 * @param list<int> $fileIds
	 * @return list<int>
	 */
	private function filterNonExistingFileIds(array $fileIds): array {
		$nonExisting = [];
		foreach (array_chunk($fileIds, self::FILE_ID_CHUNK_SIZE) as $chunk) {
			$existing = array_map(
				static fn (ICacheEntry $cacheEntry): int => $cacheEntry->getId(),
				$this->fileAccess->getByFileIds($chunk),
			);
			array_push($nonExisting, ...array_diff($chunk, $existing));
		}
		return $nonExisting;
	}

	/**
	 * @return list<OrphanedMetaDataEntry>
	 */
	private function findOrphanedLegacyMetaData(string $userId, Folder $folder, Folder $metaDataRoot): array {
		$entries = [];
		foreach ($folder->getDirectoryListing() as $node) {
			if (!($node instanceof Folder)) {
				continue;
			}

			if ($node->nodeExists(self::METADATA_FILE_NAME) && $node->get(self::METADATA_FILE_NAME) instanceof File) {
				// meta-data/<uid>/files/<path> belongs to the folder /<uid>/files/<path>
				$path = ltrim((string)$metaDataRoot->getRelativePath($node->getPath()), '/');
				$folderPath = substr($path, strlen($userId . '/files/'));
				if ($this->isLegacyFolderDeleted($userId, $folderPath)) {
					$entries[] = [
						'user' => $userId,
						'fileId' => null,
						'path' => $path,
					];
				}
			}

			array_push($entries, ...$this->findOrphanedLegacyMetaData($userId, $node, $metaDataRoot));
		}
		return $entries;
	}

	private function isLegacyFolderDeleted(string $userId, string $folderPath): bool {
		if (!$this->userManager->userExists($userId)) {
			return true;
		}

		try {
			return !$this->rootFolder->getUserFolder($userId)->nodeExists($folderPath);
		} catch (\Exception $e) {
			$this->logger->warning('Could not check if the end-to-end encrypted folder still exists', [
				'exception' => $e,
				'app' => Application::APP_ID,
				'user' => $userId,
				'path' => $folderPath,
			]);
			return false;
		}
	}
}
