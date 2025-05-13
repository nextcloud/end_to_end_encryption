<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Controller\V1;

use OC\User\NoUserException;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\IMetaDataStorageV1;
use OCA\EndToEndEncryption\LockManagerV1;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
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
	private IMetaDataStorageV1 $metaDataStorage;
	private LoggerInterface $logger;
	private LockManagerV1 $lockManager;
	private IL10N $l10n;
	private ShareManager $shareManager;

	public function __construct(
		string $AppName,
		IRequest $request,
		?string $userId,
		IMetaDataStorageV1 $metaDataStorage,
		LockManagerV1 $lockManager,
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
	 * @param int $id File ID
	 * @param ?string $shareToken Token of the share if available
	 * @return DataResponse<Http::STATUS_OK, array{meta-data: string}, array{}>
	 * @throws OCSNotFoundException Metadata-file not found
	 * @throws OCSBadRequestException Cannot read metadata
	 *
	 * 200: Metadata returned
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
		return new DataResponse(['meta-data' => $metaData]);
	}

	/**
	 * Set metadata
	 *
	 * @NoAdminRequired
	 *
	 * @param int $id File ID
	 * @param string $metaData New metadata
	 * @return DataResponse<Http::STATUS_OK, array{meta-data: string}, array{}>|DataResponse<Http::STATUS_CONFLICT, list<empty>, array{}>
	 * @throws OCSNotFoundException File not found
	 * @throws OCSBadRequestException Cannot store metadata
	 *
	 * 200: Metadata set successfully
	 * 409: Metadata already exists
	 */
	public function setMetaData(int $id, string $metaData): DataResponse {
		try {
			$this->metaDataStorage->setMetaDataIntoIntermediateFile($this->userId, $id, $metaData);
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
	 * @param int $id File ID
	 * @param string $metaData New metadata
	 * @return DataResponse<Http::STATUS_OK, array{meta-data: string}, array{}>
	 * @throws OCSForbiddenException User is not allowed to edit the file
	 * @throws OCSBadRequestException Cannot store metadata
	 * @throws OCSNotFoundException Metadata-file does not exist
	 *
	 * 200: Metadata updated successfully
	 */
	public function updateMetaData(int $id, string $metaData): DataResponse {
		$e2eToken = $this->request->getParam('e2e-token');

		if ($this->lockManager->isLocked($id, $e2eToken, null, true)) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to edit the file, make sure to first lock it, and then send the right token'));
		}

		try {
			$this->metaDataStorage->updateMetaDataIntoIntermediateFile($this->userId, $id, $metaData);
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
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
	 *
	 * @throws OCSForbiddenException Only the owner can delete the metadata-file
	 * @throws OCSNotFoundException Metadata for the file not found
	 * @throws OCSBadRequestException Cannot delete metadata
	 *
	 * 200: Metadata deleted successfully
	 */
	public function deleteMetaData(int $id): DataResponse {
		try {
			$this->metaDataStorage->updateMetaDataIntoIntermediateFile($this->userId, $id, '{}');
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
	 * @param int $id File ID
	 * @param string $fileDrop File drop metadata
	 * @param ?string $shareToken Token of the share if available
	 * @return DataResponse<Http::STATUS_OK, array{meta-data: string}, array{}>
	 * @throws OCSForbiddenException User is not allowed to create the lock
	 * @throws OCSBadRequestException Cannot update filedrop
	 * @throws OCSNotFoundException Metadata-file does not exist
	 *
	 * 200: File drop metadata added successfully
	 */
	public function addMetadataFileDrop(int $id, string $fileDrop, ?string $shareToken = null): DataResponse {
		$ownerId = $this->getOwnerId($shareToken);

		try {
			$userFolder = $this->rootFolder->getUserFolder($ownerId);
		} catch (NoUserException $e) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		if ($userFolder->getId() === $id) {
			$e = new OCSForbiddenException($this->l10n->t('You are not allowed to lock the root'));
			$this->logger->error($e->getMessage(), ['exception' => $e]);
			throw $e;
		}

		$nodes = $userFolder->getById($id);
		if (!isset($nodes[0]) || !$nodes[0] instanceof Folder) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to create the lock'));
		}

		$lockToken = $this->lockManager->lockFile($id, 'filedrop-token', $ownerId);
		if ($lockToken === null) {
			throw new OCSForbiddenException($this->l10n->t('File already locked'));
		}

		try {
			$metaData = $this->metaDataStorage->getMetaData($ownerId, $id);
			$decodedMetadata = json_decode($metaData, true);
			$decodedFileDrop = json_decode($fileDrop, true);
			$decodedMetadata['filedrop'] = array_merge($decodedMetadata['filedrop'] ?? [], $decodedFileDrop);
			$encodedMetadata = json_encode($decodedMetadata);

			$this->metaDataStorage->updateMetaDataIntoIntermediateFile($ownerId, $id, $encodedMetadata);
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

		return new DataResponse(['meta-data' => $metaData]);
	}

	private function getOwnerId(?string $shareToken = null): string {
		if ($shareToken !== null) {
			$share = $this->shareManager->getShareByToken($shareToken);

			if (!($share->getPermissions() & \OCP\Constants::PERMISSION_CREATE)) {
				throw new OCSForbiddenException("Can't lock share without create permission");
			}

			return $share->getShareOwner();
		} elseif ($this->userId !== null) {
			return $this->userId;
		} else {
			throw new OCSBadRequestException("Couldn't find the owner of the encrypted folder");
		}
	}
}
