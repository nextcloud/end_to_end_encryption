<?php

declare(strict_types=1);
/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;

/**
 * Finds all end-to-end encrypted folders that still use the legacy v1 metadata format.
 *
 * @psalm-type V1MetaDataEntry = array{user: ?string, fileId: ?int, path: ?string, version: mixed}
 */
class V1MetaDataScanner {
	private const string METADATA_FILE_NAME = 'meta.data';

	public function __construct(
		private readonly IRootFolder $rootFolder,
		private readonly MetaDataRoot $metaDataRoot,
	) {
	}

	/**
	 * @return list<V1MetaDataEntry>
	 */
	public function findV1MetaData(): array {
		$metaDataRoot = $this->metaDataRoot->getFolder();
		if ($metaDataRoot === null) {
			return [];
		}

		$entries = [];
		foreach ($metaDataRoot->getDirectoryListing() as $node) {
			if (!($node instanceof Folder)) {
				continue;
			}

			if (ctype_digit($node->getName()) && $node->nodeExists(self::METADATA_FILE_NAME)) {
				$entry = $this->checkFileIdMetaData((int)$node->getName(), $node);
				if ($entry !== null) {
					$entries[] = $entry;
				}
			} else {
				// Legacy storage layout: meta-data/<owner path>/meta.data, always v1
				array_push($entries, ...$this->findLegacyMetaData($node, $metaDataRoot));
			}
		}

		return $entries;
	}

	/**
	 * Get the sorted list of accounts owning folders with v1 metadata.
	 * Metadata whose owner could not be resolved is reported as `null`.
	 *
	 * @param list<V1MetaDataEntry>|null $entries Previously scanned entries, scans if not provided
	 * @return list<?string>
	 */
	public function findAffectedUsers(?array $entries = null): array {
		$entries ??= $this->findV1MetaData();
		$users = array_values(array_unique(array_map(
			static fn (array $entry): ?string => $entry['user'],
			$entries,
		), SORT_REGULAR));
		sort($users);
		return $users;
	}

	/**
	 * @return V1MetaDataEntry|null
	 */
	private function checkFileIdMetaData(int $fileId, Folder $folder): ?array {
		try {
			$file = $folder->get(self::METADATA_FILE_NAME);
			if (!($file instanceof File)) {
				return null;
			}
			$metaData = json_decode($file->getContent(), true);
		} catch (\Exception) {
			return null;
		}

		$version = is_array($metaData) && is_array($metaData['metadata'] ?? null)
			? ($metaData['metadata']['version'] ?? null)
			: null;
		if (!MetaDataVersion::isV1($version)) {
			return null;
		}

		$node = $this->rootFolder->getFirstNodeById($fileId);
		return [
			'user' => $node?->getOwner()?->getUID(),
			'fileId' => $fileId,
			'path' => $node?->getPath(),
			'version' => $version,
		];
	}

	/**
	 * @return list<V1MetaDataEntry>
	 */
	private function findLegacyMetaData(Folder $folder, Folder $metaDataRoot): array {
		$entries = [];
		foreach ($folder->getDirectoryListing() as $node) {
			if ($node instanceof Folder) {
				array_push($entries, ...$this->findLegacyMetaData($node, $metaDataRoot));
			} elseif ($node->getName() === self::METADATA_FILE_NAME) {
				// The legacy path is the owners node path: /<uid>/files/...
				$path = (string)$metaDataRoot->getRelativePath($folder->getPath());
				$user = explode('/', ltrim($path, '/'), 2)[0];
				$entries[] = [
					'user' => $user !== '' ? $user : null,
					'fileId' => null,
					'path' => $path,
					'version' => null,
				];
			}
		}
		return $entries;
	}
}
