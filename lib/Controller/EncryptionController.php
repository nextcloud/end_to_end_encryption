<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Controller;

use OCA\EndToEndEncryption\EncryptionManager;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\NotFoundException;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

/**
 * Class EncryptionController
 *
 * @package OCA\EndToEndEncryption\Controller
 */
class EncryptionController extends OCSController {
	private ?string $userId;
	private IMetaDataStorage $metaDataStorage;
	private EncryptionManager $manager;
	private LoggerInterface $logger;

	public function __construct(string $AppName,
		IRequest $request,
		?string $userId,
		IMetaDataStorage $metaDataStorage,
		EncryptionManager $manager,
		LoggerInterface $logger) {
		parent::__construct($AppName, $request);
		$this->userId = $userId;
		$this->metaDataStorage = $metaDataStorage;
		$this->manager = $manager;
		$this->logger = $logger;
	}

	/**
	 * Set encryption flag for folder
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
	 * @throws OCSNotFoundException
	 */
	public function setEncryptionFlag(int $id): DataResponse {
		try {
			$this->manager->setEncryptionFlag($id);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($e->getMessage());
		}

		return new DataResponse();
	}

	/**
	 * Set encryption flag for folder
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
	 * @throws OCSNotFoundException
	 */
	public function removeEncryptionFlag(int $id): DataResponse {
		try {
			$this->manager->removeEncryptionFlag($id);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($e->getMessage());
		}

		try {
			$this->metaDataStorage->deleteMetaData($this->userId, $id);
		} catch (\Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
		}

		return new DataResponse();
	}

	/**
	 * Remove encrypted files
	 *
	 * @NoAdminRequired
	 *
	 * @return DataResponse<Http::STATUS_OK, array{deletedIds: list<int>}, array{}>
	 * @throws OCSNotFoundException
	 */
	public function removeEncryptedFolders(): DataResponse {
		try {
			$ids = $this->manager->removeEncryptedFolders($this->userId);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($e->getMessage());
		}
		foreach ($ids as $id) {
			try {
				$this->metaDataStorage->deleteMetaData($this->userId, $id);
			} catch (\Exception $e) {
				$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			}
		}

		return new DataResponse(['deletedIds' => $ids]);
	}
}
