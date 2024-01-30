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

use OCP\Cache\CappedMemoryCache;
use OCP\Files\Cache\ICache;
use OCP\Files\IHomeStorage;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\Files\InvalidPathException;
use OCP\Files\NotFoundException;
use OCP\Files\Storage\IStorage;

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
	 * Checks if the node is an E2EE folder or inside an E2EE folder.
     *
     * @return bool true, if the node is valid and E2EE, false otherwise
	 */
	public function isE2EEnabledPath(Node $node): bool {
        // only checking for $node->isEncrypted() will lead to false-positives for SSE files,
        // as they have the encryption flag set but are not E2E, so we need to check the folder's flag,
        // as folders having the encryption flag set are always E2E
        if ($node instanceof Folder && $node->isEncrypted()) {
            return true;
        }

        try {
            $storage = $node->getStorage();
        } catch (NotFoundException $e) {
            return false;
        }
        // if not home storage, fallback to EncryptionManager
        if (!$storage->instanceOfStorage(IHomeStorage::class)) {
            return EncryptionManager::isEncryptedFile($node);
        }

        // walk path backwards while caching each node's state
		return $this->getEncryptedStates((string) $storage->getCache()->getNumericStorageId(), $node);
	}

	/**
     * Determines a node's E2E encryption state by walking up the tree. Caches each node's state on the way.
     *
     * @param string $storageId the node's storage id, used for caching
     * @param Node $node the node to check
     *
     * @return bool true, if the node is valid and E2EE, false otherwise
	 */
	protected function getEncryptedStates(string $storageId, Node $node): bool {

        try {
            $nodeId = $node->getId();
        } catch (InvalidPathException|NotFoundException $e) {
            return false;
        }

        // initialize array for storage id if necessary
        if (!isset($this->perStorageEncryptedStateCache[$storageId])) {
			$this->perStorageEncryptedStateCache[$storageId] = [];
		}
        // return cached state if available
        else if (isset($this->perStorageEncryptedStateCache[$storageId][$nodeId])) {
			return $this->perStorageEncryptedStateCache[$storageId][$nodeId];
		}

		if ($node->getPath() === '/') {
			// root is never encrypted
			$this->perStorageEncryptedStateCache[$storageId][$nodeId] = false;
			return false;
		}

        // checking for folder for the same reason as above
		if ($node instanceof Folder && $node->isEncrypted()) {
			// no need to go further up in the tree
			$this->perStorageEncryptedStateCache[$storageId][$nodeId] = true;
			return true;
		}

		try {
			$parentNode = $node->getParent();
		} catch (NotFoundException $e) {
            // node not encrypted and no parent that could be E2EE, so node is not E2EE
			$this->perStorageEncryptedStateCache[$storageId][$nodeId] = false;
			return false;
		}

        // check parent's state
		$encrypted = $this->getEncryptedStates($storageId, $parentNode);

        // if any parent is E2EE, this node is E2EE as well
		$this->perStorageEncryptedStateCache[$storageId][$nodeId] = $encrypted;
		return $encrypted;
	}
}
