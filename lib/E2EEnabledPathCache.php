<?php

declare(strict_types=1);

// SPDX-FileCopyrightText: 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\EndToEndEncryption;

use Sabre\DAV\INode;
use OCP\Files\Node;
use OCP\Files\IHomeStorage;
use OCP\Files\Cache\ICache;
use OC\Files\Storage\Wrapper\Wrapper;
use OCA\Files_Sharing\SharedStorage;

class E2EEnabledPathCache {
	/**
	 * @psalm-type FileId=int
	 *
	 * @psalm-type EncryptedState=array{0: FileId, 1: bool}
	 *
	 * @psalm-type Path=string
	 *
	 * @psalm-type StorageId=string|int
	 */

	/** @var array<StorageId, array<Path, EncryptedState>> */
	protected $cacheEntries;

	/**
	 * Checks if the path is an E2E folder or inside an E2E folder
	 *
	 * @param INode&Node $node
	 */
	public function isE2EEnabledPath($node, string $path): bool {
		$storage = $node->getStorage();
		$cache = $storage->getCache();
		$encryptedStates = $this->getEncryptedStates($cache, $path, $storage, !$storage->instanceOfStorage(IHomeStorage::class) || $storage->instanceOfStorage(SharedStorage::class));
		foreach ($encryptedStates as [$fileid, $encryptedState]) {
			if ($encryptedState) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Get the file ids of the given path and its parents
	 *
	 * @return array<Path, EncryptedState>
	 */
	protected function getEncryptedStates(ICache $cache, string $path, $storage, bool $isExternalStorage): array {
		/** @psalm-suppress InvalidArgument */
		if ($storage->instanceOfStorage(\OCA\GroupFolders\Mount\GroupFolderStorage::class)) {
			// Special implementation for groupfolder since all groupfolders share the same storage
			// id so add the group folder id in the cache key too.
			$groupFolderStorage = $storage;
			if ($this->storage instanceof Wrapper) {
				$groupFolderStorage = $getInstanceOfStorage(\OCA\GroupFolders\Mount\GroupFolderStorage::class);
			}
			if ($groupFolderStorage === null) {
				throw new \LogicException('Should not happen: Storage is instance of GroupFolderStorage but no group folder storage found while unwrapping.');
			}
			/**
			 * @psalm-suppress UndefinedDocblockClass
			 * @psalm-suppress UndefinedInterfaceMethod
			 */
			$cacheId = $cache->getNumericStorageId() . '/' . $groupFolderStorage->getFolderId();
		} else {
			$cacheId = $cache->getNumericStorageId();
		}
		if (isset($this->cacheEntries[$cacheId][$path])) {
			return $this->cacheEntries[$cacheId][$path];
		}

		$parentIds = [];
		if ($path !== $this->dirname($path)) {
			$cacheEntries = [];
			$cacheEntry = $cache->get($path);
			if ($cacheEntry !== false) {
				$cacheEntries[] = [$cacheEntry->getId(), $cacheEntry->isEncrypted()];
				if ($cacheEntry->isEncrypted()) {
					// no need to go further down in the tree
					$this->cacheEntries[$cacheId][$path] = $parentEntries;
					return $cacheEntry;
				}
			}
			$cacheEntries = array_merge($this->getEncryptedStates($cache, $this->dirname($path), $storage, $isExternalStorage), $cacheEntries);
		} elseif (!$isExternalStorage) {
			return [];
		}

		$this->cacheEntries[$cacheId][$path] = $cacheEntries;
		return $cacheEntries;
	}

	protected function dirname(string $path): string {
		$dir = dirname($path);
		return $dir === '.' ? '' : $dir;
	}
}
