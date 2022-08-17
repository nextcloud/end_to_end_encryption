<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2022 Carl Schwan <carl@carlschwan.eu>
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

use Sabre\DAV\INode;
use OCP\Files\Node;
use OCP\Files\Storage\IStorage;
use OCP\Files\IHomeStorage;
use OCP\Files\Cache\ICache;
use OCP\Cache\CappedMemoryCache;
use Sabre\DAV\Exception\NotFound;

class E2EEnabledPathCache {
	/**
	 * @psalm-type EncryptedState=bool
	 *
	 * @psalm-type Path=string
	 *
	 * @psalm-type StorageId=string|int
	 */

	/** @var CappedMemoryCache<StorageId, array<Path, EncryptedState>> */
	private CappedMemoryCache $perStorageEncryptedStateCache;

	public function __construct() {
		$this->perStorageEncryptedStateCache = new CappedMemoryCache();
		$this->nodeCache = [];
	}

	/**
	 * Checks if the path is an E2E folder or inside an E2E folder
	 *
	 * @param INode&Node $node
	 */
	public function isE2EEnabledPath($node): bool {
		$storage = $node->getStorage();
		$cache = $storage->getCache();
		return $this->getEncryptedStates($cache, $node, $storage);
	}

	/**
	 * Get file system node of requested file
	 * @throws NotFound
	 */
	public function getFileNode($uid, string $path, $rootFolder): Node {
		if (!isset($this->nodeCache[$uid])) {
			$this->nodeCache[$uid] = [];
		} else if (isset($this->nodeCache[$uid][$path])) {
			$node = $this->nodeCache[$uid][$path];
			if ($node instanceof \Exception) {
				throw new NotFound('file not found', Http::STATUS_NOT_FOUND, $node);
			}
			return $node;
		}
		try {
			$node = $rootFolder
				->getUserFolder($uid)
				->get($path);
			$this->nodeCache[$uid][$path] = $node;
			return $node;
		} catch (Exception $e) {
			$this->nodeCache[$uid][$path] = $e;
			throw new NotFound('file not found', Http::STATUS_NOT_FOUND, $e);
		}
	}

	/**
	 * Get the encryption state for the path
	 */
	protected function getEncryptedStates(ICache $cache, $node, IStorage $storage): bool {
		if (!$storage->instanceOfStorage(IHomeStorage::class)) {
			return false;
		}

		$storageId = $cache->getNumericStorageId();
		if (isset($this->perStorageEncryptedStateCache[$storageId][$node->getPath()])) {
			return $this->perStorageEncryptedStateCache[$storageId][$node->getPath()];
		}

		$parentIds = [];
		if ($node->getPath() === '/' || $node->getPath() === '') {
			// root is never encrypted
			$this->perStorageEncryptedStateCache[$storageId][$node->getPath()] = false;
			return false;
		}

		if ($node->isEncrypted()) {
			// no need to go further down in the tree
			$this->perStorageEncryptedStateCache[$storageId][$node->getPath()] = true;
			return true;
		}

		// go down more, but try first just with the parent path to spare a lot of
		// queries if already cached
		$parentPath = $this->dirname($node->getPath());
		if (isset($this->perStorageEncryptedStateCache[$storageId][$parentPath])) {
			return $this->perStorageEncryptedStateCache[$storageId][$parentPath];
		}

		if ($parentPath === '/' || $parentPath === '.') {
			$this->perStorageEncryptedStateCache[$storageId][$node->getPath()] = false;
			return false;
		}

		$encrypted = $this->getEncryptedStates($cache, $node->getParent(), $storage);
		$this->perStorageEncryptedStateCache[$storageId][$node->getPath()] = $encrypted;
		return $encrypted;
	}

	protected function dirname(string $path): string {
		$dir = dirname($path);
		return $dir === '.' ? '' : $dir;
	}
}
