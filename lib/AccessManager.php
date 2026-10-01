<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OCP\AppFramework\PublicShareController;
use OCP\Constants;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Storage\ISharedStorage;
use OCP\IRequest;
use OCP\ISession;
use OCP\Share\IManager;
use OCP\Share\IShare;

class AccessManager {
	private ?IShare $share;

	public function __construct(
		private readonly ?string $userId,
		private readonly IRequest $request,
		private readonly IRootFolder $rootFolder,
		private readonly IManager $shareManager,
		private readonly ISession $session,
	) {
		$this->share = null;
	}

	/**
	 * Get the owner id of the specified file.
	 * In case of a share the share is validated.
	 *
	 * @param int $fileId - The file id
	 * @throws \InvalidArgumentException in case of invalid share token or no user logged in
	 */
	public function getOwnerId(int $fileId): string {
		$shareToken = $this->request->getHeader('x-nc-e2ee-share-token') ?: null;
		if ($shareToken !== null) {
			if ($this->share === null) {
				$this->share = $this->shareManager->getShareByToken($shareToken);
			}

			if (!$this->isShareAuthenticated($this->share)) {
				throw new \InvalidArgumentException('Share is not authenticated');
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
	 * @throws \InvalidArgumentException in case of insufficient permissions or file not found
	 */
	public function checkPermissions(int $fileId, bool $write = true): void {
		$owner = $this->getOwnerId($fileId);
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

	/**
	 * Check that the current session passed the password check of the share.
	 *
	 * @param IShare $share - The share accessed by its token
	 */
	public function isShareAuthenticated(IShare $share): bool {
		if (!$share->isPasswordProtected()) {
			return true;
		}

		// Same session state the public share page stores after a successful password check
		$allowedTokens = json_decode($this->session->get(PublicShareController::DAV_AUTHENTICATED_FRONTEND) ?? '[]', true);
		return is_array($allowedTokens)
			&& ($allowedTokens[$share->getToken()] ?? null) === $share->getPassword();
	}
}
