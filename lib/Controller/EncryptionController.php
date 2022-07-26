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

use OCA\EndToEndEncryption\EncryptionManager;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\NotFoundException;
use OCP\ILogger;
use OCP\IRequest;

/**
 * Class EncryptionController
 *
 * @package OCA\EndToEndEncryption\Controller
 */
class EncryptionController extends OCSController {

	/** @var  string */
	private $userId;

	/** @var IMetaDataStorage */
	private $metaDataStorage;

	/** @var EncryptionManager */
	private $manager;

	/** @var ILogger */
	private $logger;

	/**
	 * RequestHandlerController constructor.
	 *
	 * @param string $AppName
	 * @param IRequest $request
	 * @param string $userId
	 * @param IMetaDataStorage $metaDataStorage
	 * @param EncryptionManager $manager
	 * @param ILogger $logger
	 */
	public function __construct($AppName,
								IRequest $request,
								$userId,
								IMetaDataStorage $metaDataStorage,
								EncryptionManager $manager,
								ILogger $logger) {
		parent::__construct($AppName, $request);
		$this->userId = $userId;
		$this->metaDataStorage = $metaDataStorage;
		$this->manager = $manager;
		$this->logger = $logger;
	}

	/**
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * set encryption flag for folder
	 *
	 *
	 * @param int $id file ID
	 * @return DataResponse
	 *
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
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * set encryption flag for folder
	 *
	 *
	 * @param int $id file ID
	 * @return DataResponse
	 *
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
			$this->logger->logException($e, ['app' => $this->appName]);
		}

		return new DataResponse();
	}

	/**
	 * Remove encrypted files
	 *
	 * @NoAdminRequired
	 * @throws OCSNotFoundException
	 */
	public function removeEncryptedFolders(): DataResponse {
		try {
			$ids = $this->manager->removeEncryptedFolders($this->userId);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($e->getMessage());
		}
		foreach($ids as $id) {
			try {
				$this->metaDataStorage->deleteMetaData($this->userId, $id);
			} catch (\Exception $e) {
				$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			}
		}

		return new DataResponse(['deletedIds' => $ids]);
	}
}
