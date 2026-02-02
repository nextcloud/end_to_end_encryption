<?php

declare(strict_types=1);
/**
 * SPDX-License-Identifier: AGPL-3.0+
 *
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @author Bjoern Schiessle <bjoern@schiessle.org>
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
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

namespace OCA\EndToEndEncryption\Controller;

use OC\User\NoUserException;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\LockManager;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCS\OCSPreconditionFailedException;
use OCP\AppFramework\OCSController;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\IRequest;
use OCP\Share\IManager as ShareManager;
use Psr\Log\LoggerInterface;

class MetaDataController extends OCSController {
	private ?string $userId;
	private IMetaDataStorage $metaDataStorage;
	private LoggerInterface $logger;
	private LockManager $lockManager;
	private IL10N $l10n;
	private ShareManager $shareManager;

	public function __construct(
		string $AppName,
		IRequest $request,
		?string $userId,
		IMetaDataStorage $metaDataStorage,
		LockManager $lockManager,
		LoggerInterface $logger,
		IL10N $l10n,
		ShareManager $shareManager,
		private IRootFolder $rootFolder,
	) {
		parent::__construct($AppName, $request);
		$this->userId = $userId;
		$this->metaDataStorage = $metaDataStorage;
		$this->logger = $logger;
		$this->lockManager = $lockManager;
		$this->l10n = $l10n;
		$this->shareManager = $shareManager;
	}

	/**
	 * Get metadata
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * @throws OCSNotFoundException
	 * @throws OCSBadRequestException
	 */
	public function getMetaData(int $id, ?string $shareToken = null): DataResponse {
		try {
			$ownerId = $this->getOwnerId($shareToken);
			$metaData = $this->metaDataStorage->getMetaData($ownerId, $id);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l10n->t('Could not find metadata for "%s"', [$id]));
		} catch (\Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Cannot read metadata'));
		}
		return new DataResponse(
			['meta-data' => $metaData],
			Http::STATUS_OK,
			['X-NC-E2EE-SIGNATURE' => $this->metaDataStorage->readSignature($id)],
		);
	}

	/**
	 * Set metadata
	 *
	 * @NoAdminRequired
	 *
	 * @throws OCSNotFoundException
	 * @throws OCSBadRequestException
	 */
	public function setMetaData(int $id, string $metaData): DataResponse {
		$e2eToken = $this->request->getHeader('e2e-token');
		$signature = $this->request->getHeader('X-NC-E2EE-SIGNATURE');

		if ($e2eToken === '') {
			throw new OCSPreconditionFailedException($this->l10n->t('e2e-token is empty'));
		}

		if ($signature === '') {
			throw new OCSPreconditionFailedException($this->l10n->t('X-NC-E2EE-SIGNATURE is empty'));
		}

		if ($this->lockManager->isLocked($id, $e2eToken, null, true)) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to edit the file, make sure to first lock it, and then send the right token'));
		}

		try {
			$this->metaDataStorage->setMetaDataIntoIntermediateFile($this->userId, $id, $metaData, $e2eToken, $signature);
		} catch (MetaDataExistsException $e) {
			return new DataResponse([], Http::STATUS_CONFLICT);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($e->getMessage());
		} catch (\Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Cannot store metadata'));
		}

		return new DataResponse(['meta-data' => $metaData]);
	}

	/**
	 * Update metadata
	 *
	 * @NoAdminRequired
	 * @return DataResponse
	 * @throws OCSForbiddenException
	 * @throws OCSBadRequestException
	 * @throws OCSNotFoundException
	 */
	public function updateMetaData(int $id, string $metaData): DataResponse {
		$e2eToken = $this->request->getHeader('e2e-token');
		$signature = $this->request->getHeader('X-NC-E2EE-SIGNATURE');

		if ($e2eToken === '') {
			throw new OCSPreconditionFailedException($this->l10n->t('e2e-token is empty'));
		}

		if ($signature === '') {
			throw new OCSPreconditionFailedException($this->l10n->t('X-NC-E2EE-SIGNATURE is empty'));
		}

		if ($this->lockManager->isLocked($id, $e2eToken, null, true)) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to edit the file, make sure to first lock it, and then send the right token'));
		}

		try {
			$this->metaDataStorage->updateMetaDataIntoIntermediateFile($this->userId, $id, $metaData, $e2eToken, $signature);
		} catch (MissingMetaDataException $e) {
			throw new OCSNotFoundException($this->l10n->t('Metadata-file does not exist'));
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($e->getMessage());
		} catch (\Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Cannot store metadata'));
		}

		return new DataResponse(['meta-data' => $metaData]);
	}

	/**
	 * Delete metadata
	 *
	 * @NoAdminRequired
	 *
	 * @param int $id file id
	 * @return DataResponse
	 *
	 * @throws OCSForbiddenException
	 * @throws OCSNotFoundException
	 * @throws OCSBadRequestException
	 */
	public function deleteMetaData(int $id): DataResponse {
		$e2eToken = $this->request->getHeader('e2e-token');

		if ($e2eToken === '') {
			throw new OCSPreconditionFailedException($this->l10n->t('e2e-token is empty'));
		}

		if ($this->lockManager->isLocked($id, $e2eToken, null, true)) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to edit the file, make sure to first lock it, and then send the right token'));
		}

		try {
			$this->metaDataStorage->updateMetaDataIntoIntermediateFile($this->userId, $id, '{}', $e2eToken, '');
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l10n->t('Could not find metadata for "%s"', [$id]));
		} catch (NotPermittedException $e) {
			throw new OCSForbiddenException($this->l10n->t('Only the owner can delete the metadata-file'));
		} catch (\Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Cannot delete metadata'));
		}
		return new DataResponse();
	}


	/**
	 * Append new entries in the filedrop property of a metadata
	 *
	 * @PublicPage
	 * @NoAdminRequired
	 * @return DataResponse
	 * @throws OCSForbiddenException
	 * @throws OCSBadRequestException
	 * @throws OCSNotFoundException
	 */
	public function addMetadataFileDrop(int $id, string $filedrop, ?string $shareToken = null): DataResponse {
		if ($this->userId === null && $shareToken === null) {
			throw new OCSBadRequestException("No 'shareToken' provided and user is not logged in");
		}

		/** @var string */
		$ownerId = $shareToken
			? $this->getFileDropOwnerId($shareToken, $id)
			: $this->userId;

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
		} catch (NoUserException $e) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		if ($userFolder->getId() === $id) {
			$this->logger->error('Cannot create filedrop lock on root folder of user {userId}', ['userId' => $ownerId]);
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		$nodes = $userFolder->getById($id);
		if (!isset($nodes[0]) || !$nodes[0] instanceof Folder) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		$lockToken = $this->lockManager->lockFile($id, 'filedrop-lock', 0, $ownerId, true);
		if ($lockToken === null) {
			throw new OCSForbiddenException($this->l10n->t('File already locked'));
		}

		try {
			$metaData = $this->metaDataStorage->getMetaData($ownerId, $id);
			$decodedMetadata = json_decode($metaData, true);
			$fileDropArray = $decodedMetadata['filedrop'] ?? [];
			$fileDropArray = array_merge($fileDropArray, json_decode($filedrop, true));
			$decodedMetadata['filedrop'] = $fileDropArray;
			$encodedMetadata = json_encode($decodedMetadata);

			$this->metaDataStorage->updateMetaDataIntoIntermediateFile($ownerId, $id, $encodedMetadata, 'filedrop-lock');
			$this->metaDataStorage->saveIntermediateFile($ownerId, $id);
		} catch (MissingMetaDataException $e) {
			throw new OCSNotFoundException($this->l10n->t('Metadata-file does not exist'));
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($e->getMessage());
		} catch (\Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Cannot update filedrop'));
		} finally {
			$this->lockManager->unlockFile($id, $lockToken);
		}

		return new DataResponse();
	}

	private function getFileDropOwnerId(string $shareToken, int $fileId): string {
		$share = $this->shareManager->getShareByToken($shareToken);

		// if we are the owner of the node shared via the share, we can directly return our user id
		if ($this->userId !== null && $share->getShareOwner() === $this->userId) {
			return $this->userId;
		}

		if (!($share->getPermissions() & \OCP\Constants::PERMISSION_CREATE)) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		$shareRoot = $share->getNode();
		if (!$shareRoot instanceof Folder) {
			$this->logger->error('Cannot create filedrop lock on non-folder share {share}', ['share' => $shareToken]);
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		if (!$shareRoot->isEncrypted()) {
			$this->logger->error('Cannot create filedrop lock on non-encrypted folders of {share}', ['share' => $shareToken]);
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		if ($shareRoot->getId() !== $fileId && ($shareRoot instanceof Folder && $shareRoot->getFirstNodeById($fileId) === null)) {
			$this->logger->error('Cannot create filedrop lock on node outside of share {share}', ['share' => $shareToken, 'fileId' => $fileId]);
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		return $share->getShareOwner();
	}
}
