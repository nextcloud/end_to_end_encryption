<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Controller\V1;

use OCA\EndToEndEncryption\AccessManager;
use OCA\EndToEndEncryption\Attributes\E2ERestrictUserAgent;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\IMetaDataStorageV1;
use OCA\EndToEndEncryption\LockManagerV1;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\RequestHeader;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\IRequest;
use OCP\Share\IManager as ShareManager;
use Psr\Log\LoggerInterface;

class MetaDataController extends OCSController {
	public function __construct(
		string $AppName,
		IRequest $request,
		private readonly ?string $userId,
		private readonly IMetaDataStorageV1 $metaDataStorage,
		private readonly LockManagerV1 $lockManager,
		private readonly LoggerInterface $logger,
		private readonly IL10N $l10n,
		private readonly ShareManager $shareManager,
		private readonly AccessManager $accessManager,
	) {
		parent::__construct($AppName, $request);
	}

	/**
	 * Get metadata
	 *
	 * @param int $id File ID
	 * @param ?string $shareToken Token of the share if available
	 * @return DataResponse<Http::STATUS_OK, array{meta-data: string}, array{}>
	 * @throws OCSNotFoundException Metadata-file not found
	 * @throws OCSBadRequestException Cannot read metadata
	 *
	 * 200: Metadata returned
	 */
	#[NoAdminRequired]
	#[E2ERestrictUserAgent]
	public function getMetaData(int $id, ?string $shareToken = null): DataResponse {
		try {
			$ownerId = $this->getOwnerId($shareToken);
			$this->metaDataStorage->assertMetadataIsV1($ownerId, $id);
			$metaData = $this->metaDataStorage->getMetaData($ownerId, $id);
		} catch (NotFoundException) {
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
	 * @param int $id File ID
	 * @param string $metaData New metadata
	 * @return DataResponse<Http::STATUS_OK, array{meta-data: string}, array{}>|DataResponse<Http::STATUS_CONFLICT, list<empty>, array{}>
	 * @throws OCSForbiddenException User is not allowed to edit the metadata
	 * @throws OCSNotFoundException File not found
	 * @throws OCSBadRequestException Cannot store metadata
	 *
	 * 200: Metadata set successfully
	 * 409: Metadata already exists
	 */
	#[NoAdminRequired]
	public function setMetaData(int $id, string $metaData): DataResponse {
		$ownerId = $this->assertWriteAccess($id);

		try {
			$this->metaDataStorage->assertMetadataIsV1($ownerId, $id);
			$this->metaDataStorage->setMetaDataIntoIntermediateFile($ownerId, $id, $metaData);
		} catch (MetaDataExistsException) {
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
	 * @param int $id File ID
	 * @param string $metaData New metadata
	 * @return DataResponse<Http::STATUS_OK, array{meta-data: string}, array{}>
	 * @throws OCSForbiddenException User is not allowed to edit the file
	 * @throws OCSBadRequestException Cannot store metadata
	 * @throws OCSNotFoundException Metadata-file does not exist
	 *
	 * 200: Metadata updated successfully
	 */
	#[NoAdminRequired]
	#[RequestHeader(name: 'e2e-token', description: 'The lock token this folder was locked with, alternatively passed as request parameter')]
	public function updateMetaData(int $id, string $metaData): DataResponse {
		// Legacy clients send the lock token as a request parameter,
		// but it is also accepted as a header like on the v2 API.
		$e2eToken = $this->request->getParam('e2e-token') ?? $this->request->getHeader('e2e-token');

		$ownerId = $this->assertWriteAccess($id);

		$this->metaDataStorage->assertMetadataIsV1($ownerId, $id);

		if ($this->lockManager->isLocked($id, $e2eToken, $ownerId, true)) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to edit the file, make sure to first lock it, and then send the right token'));
		}

		try {
			$this->metaDataStorage->updateMetaDataIntoIntermediateFile($ownerId, $id, $metaData);
		} catch (MissingMetaDataException) {
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
	 * @param int $id file id
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
	 *
	 * @throws OCSForbiddenException User is not allowed to delete the metadata-file
	 * @throws OCSNotFoundException Metadata for the file not found
	 * @throws OCSBadRequestException Cannot delete metadata
	 *
	 * 200: Metadata deleted successfully
	 */
	#[NoAdminRequired]
	#[RequestHeader(name: 'e2e-token', description: 'The lock token this folder was locked with, alternatively passed as request parameter')]
	public function deleteMetaData(int $id): DataResponse {
		// Legacy clients send the lock token as a request parameter,
		// but it is also accepted as a header like on the v2 API.
		$e2eToken = $this->request->getParam('e2e-token') ?? $this->request->getHeader('e2e-token');

		$ownerId = $this->assertWriteAccess($id);

		$this->metaDataStorage->assertMetadataIsV1($ownerId, $id);

		if ($this->lockManager->isLocked($id, $e2eToken, $ownerId, true)) {
			$this->logger->debug('Tried to delete metadata without holding the lock', ['nodeId' => $id]);
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to edit the file, make sure to first lock it, and then send the right token'));
		}

		try {
			$this->metaDataStorage->updateMetaDataIntoIntermediateFile($ownerId, $id, '{}');
		} catch (NotFoundException) {
			throw new OCSNotFoundException($this->l10n->t('Could not find metadata for "%s"', [$id]));
		} catch (NotPermittedException) {
			throw new OCSForbiddenException($this->l10n->t('Only the owner can delete the metadata-file'));
		} catch (\Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Cannot delete metadata'));
		}
		return new DataResponse();
	}

	/**
	 * Ensure the current user is allowed to write the metadata of the given file
	 *
	 * @return string The user id of the file owner
	 * @throws OCSForbiddenException The current user has no write access
	 */
	private function assertWriteAccess(int $id): string {
		try {
			$this->accessManager->checkPermissions($id, true);
			return $this->accessManager->getOwnerId($id);
		} catch (\InvalidArgumentException $e) {
			$this->logger->warning('Unauthorized access to metadata API', ['exception' => $e]);
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to edit the metadata of this folder'));
		}
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
