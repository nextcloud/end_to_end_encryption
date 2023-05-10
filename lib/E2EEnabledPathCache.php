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

use OCP\Files\Node;
use OCP\Files\Storage\IStorage;
use OCP\Files\IHomeStorage;
use OCP\Files\Cache\ICache;
use OCP\Cache\CappedMemoryCache;
use OCP\Files\NotFoundException;

class E2EEnabledPathCache {
	/**
	 * @psalm-type EncryptedState=bool
	 *
	 * @psalm-type FileId=int
	 */

	private CappedMemoryCache $perStorageEncryptedStateCache;

	public function __construct() {
		$this->perStorageEncryptedStateCache = new CappedMemoryCache();
	}

	/**
	 * Checks if the path is an E2E folder or inside an E2E folder
	 */
	public function isE2EEnabledPath(Node $node): bool {
		if ($node->isEncrypted()) {
			return true;
		}
		$storage = $node->getStorage();
		$cache = $storage->getCache();
		return $this->getEncryptedStates($cache, $node, $storage);
	}

	/**
	 * Get the encryption state for the path
	 */
	protected function getEncryptedStates(ICache $cache, $node, IStorage $storage): bool {
		if (!$storage->instanceOfStorage(IHomeStorage::class)) {
			return false;
		}

		$storageId = (string)$cache->getNumericStorageId();
		if (!isset($this->perStorageEncryptedStateCache[$storageId])) {
			$this->perStorageEncryptedStateCache[$storageId] = [];
		}
		if (isset($this->perStorageEncryptedStateCache[$storageId][$node->getId()])) {
			return $this->perStorageEncryptedStateCache[$storageId][$node->getId()];
		}

		if ($node->getPath() === '/') {
			// root is never encrypted
			$this->perStorageEncryptedStateCache[$storageId][$node->getId()] = false;
			return false;
		}

		if ($node->isEncrypted()) {
			// no need to go further down in the tree
			$this->perStorageEncryptedStateCache[$storageId][$node->getId()] = true;
			return true;
		}

		try {
			$parentNode = $node->getParent();
		} catch (NotFoundException $e) {
			$this->perStorageEncryptedStateCache[$storageId][$node->getId()] = false;
			return false;
		}
		$encrypted = $this->getEncryptedStates($cache, $parentNode, $storage);
		$this->perStorageEncryptedStateCache[$storageId][$node->getId()] = $encrypted;
		return $encrypted;
	}
}
