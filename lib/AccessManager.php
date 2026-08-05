<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OCP\Constants;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Storage\ISharedStorage;
use OCP\Share\IManager;
use OCP\Share\IShare;

class AccessManager {
	private ?IShare $share;

	public function __construct(
		private ?string $userId,
		private IRootFolder $rootFolder,
		private IManager $shareManager,
	) {
		$this->share = null;
	}

	/**
	 * Get the owner id of the specified file.
	 * In case of a share the share is validated.
	 *
	 * @param int $fileId - The file id
	 * @param ?string $shareToken - The token of the share if the file is accessed through a share link
	 * @throws \OCP\Share\Exceptions\ShareNotFound in case the share token is invalid
	 * @throws \InvalidArgumentException in case of insufficient permissions or file not found
	 */
	public function getOwnerId(int $fileId, ?string $shareToken = null): string {
		if ($shareToken !== null) {
			if ($this->share === null) {
				$this->share = $this->shareManager->getShareByToken($shareToken);
			}

			if ($this->share->getNode()->getId() !== $fileId) {
				$folder = $this->share->getNode();
				$child = null;
				if ($folder instanceof Folder) {
					$child = $folder->getFirstNodeById($fileId);
				}
				if ($child === null) {
					throw new \InvalidArgumentException('File ID does not belong to the share');
				}
			}

			return $this->share->getShareOwner();
		}

		if ($this->userId === null) {
			throw new \InvalidArgumentException('No user logged in');
		}

		$node = $this->rootFolder->getUserFolder($this->userId)
			->getFirstNodeById($fileId);
		if ($node === null) {
			throw new \InvalidArgumentException('File not found');
		}

		$storage = $node->getStorage();
		if ($storage->instanceOfStorage(ISharedStorage::class)) {
			/** @var ISharedStorage $storage */
			$this->share = $storage->getShare();
			return $node->getOwner()->getUID();
		}

		return $this->userId;
	}

	/**
	 * Check that the current user has access to the file.
	 *
	 * @param int $fileId - The file id to check
	 * @param bool $write - True if write access is required
	 * @param ?string $shareToken - The token of the share if the file is accessed through a share link
	 * @throws \OCP\Share\Exceptions\ShareNotFound in case the share token is invalid
	 * @throws \InvalidArgumentException in case of insufficient permissions or file not found
	 */
	public function checkPermissions(int $fileId, bool $write = true, ?string $shareToken = null): void {
		$owner = $this->getOwnerId($fileId, $shareToken);
		if ($this->share !== null) {
			if (($this->share->getPermissions() & ($write ? Constants::PERMISSION_UPDATE : Constants::PERMISSION_READ)) === 0) {
				throw new \InvalidArgumentException('Insufficient permissions on share');
			}
		}

		$userRoot = $this->rootFolder->getUserFolder($owner);
		$node = $userRoot->getFirstNodeById($fileId);
		if ($node === null) {
			throw new \InvalidArgumentException('File not found');
		}
	}

}
