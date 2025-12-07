<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\Connector\Sabre\RedirectRequestPlugin;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\Files\Storage\ISharedStorage;

/**
 * Class FileService
 *
 * @package OCA\EndToEndEncryption
 */
class FileService {
	/**
	 * @return bool Whether this operation changed any files
	 */
	public function revertChanges(Folder $folder): bool {
		$intermediateFiles = $this->getIntermediateFiles($folder);
		if (empty($intermediateFiles['to_save']) && empty($intermediateFiles['to_delete'])) {
			return false;
		}

		/** @var Node $intermediateFile */
		foreach ($intermediateFiles['to_save'] as $intermediateFile) {
			$intermediateFile->delete();
		}

		/** @var Node $intermediateFile */
		foreach ($intermediateFiles['to_delete'] as $intermediateFile) {
			$newPath = $this->removeSuffixFromString($intermediateFile->getPath(), RedirectRequestPlugin::DELETE_SUFFIX);
			$intermediateFile->move($newPath);
		}

		return true;
	}

	/**
	 * Move and delete temporary files suffixed by .e2e-to-save and .e2e-to-delete
	 *
	 * @return false|list<positive-int> Return false if there are no changes or array of deleted file IDs
	 */
	public function finalizeChanges(Folder $folder): false|array {
		$intermediateFiles = $this->getIntermediateFiles($folder);
		if (empty($intermediateFiles['to_save']) && empty($intermediateFiles['to_delete'])) {
			return false;
		}

		/** @var Node $intermediateFile */
		foreach ($intermediateFiles['to_save'] as $intermediateFile) {
			$newPath = $this->removeSuffixFromString($intermediateFile->getPath(), RedirectRequestPlugin::SAVE_SUFFIX);
			$intermediateFile->move($newPath);
		}

		$deletedIds = [];
		/** @var Node $intermediateFile */
		foreach ($intermediateFiles['to_delete'] as $intermediateFile) {
			// If shared to user, try to unshare it first
			$storage = $intermediateFile->getStorage();
			if ($storage->instanceOfStorage(ISharedStorage::class) && $storage->unshareStorage()) {
				continue;
			}
			// Otherwise delete it
			$deletedIds[] = $intermediateFile->getId();
			$intermediateFile->delete();
		}

		return $deletedIds;
	}

	/**
	 * @param Folder $folder
	 * @return array{to_save: Node[], to_delete: Node[]}
	 */
	private function getIntermediateFiles(Folder $folder): array {
		$result = [
			'to_save' => [],
			'to_delete' => [],
		];

		// Special case when root folder is deleted/unshared
		if ($this->isIntermediateFileToDelete($folder)) {
			$result['to_delete'][] = $folder;
		}

		$listing = $folder->getDirectoryListing();

		foreach ($listing as $node) {
			if ($this->isIntermediateFileToSave($node)) {
				$result['to_save'][] = $node;
				continue;
			}

			if ($this->isIntermediateFileToDelete($node)) {
				$result['to_delete'][] = $node;
			}
		}

		return $result;
	}

	private function isIntermediateFileToSave(Node $node): bool {
		return (substr($node->getName(), strlen(RedirectRequestPlugin::SAVE_SUFFIX) * -1) === RedirectRequestPlugin::SAVE_SUFFIX);
	}

	private function isIntermediateFileToDelete(Node $node): bool {
		return (substr($node->getName(), strlen(RedirectRequestPlugin::DELETE_SUFFIX) * -1) === RedirectRequestPlugin::DELETE_SUFFIX);
	}

	private function removeSuffixFromString(string $filename, string $suffix): string {
		// Do nothing if filename does not end with suffix
		if (substr($filename, strlen($suffix) * -1) !== $suffix) {
			return $filename;
		}

		return substr($filename, 0, strlen($filename) - strlen($suffix));
	}
}
