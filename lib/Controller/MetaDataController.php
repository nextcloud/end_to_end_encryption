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

use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\LockManager;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\ILogger;
use OCP\IRequest;

class MetaDataController extends OCSController {

	/** @var  string */
	private $userId;

	/** @var IMetaDataStorage */
	private $metaDataStorage;

	/** @var ILogger */
	private $logger;

	/** @var LockManager */
	private $lockManager;

	/** @var IL10N */
	private $l10n;

	/**
	 * RequestHandlerController constructor.
	 *
	 * @param string $AppName
	 * @param IRequest $request
	 * @param string $userId
	 * @param IMetaDataStorage $metaDataStorage
	 * @param LockManager $lockManager
	 * @param ILogger $logger
	 * @param IL10N $l10n
	 */
	public function __construct($AppName,
								IRequest $request,
								$userId,
								IMetaDataStorage $metaDataStorage,
								LockManager $lockManager,
								ILogger $logger,
								IL10N $l10n
	) {
		parent::__construct($AppName, $request);
		$this->userId = $userId;
		$this->metaDataStorage = $metaDataStorage;
		$this->logger = $logger;
		$this->lockManager = $lockManager;
		$this->l10n = $l10n;
	}

	/**
	 * get metadata
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * @param int $id file id
	 * @return DataResponse
	 *
	 * @throws OCSNotFoundException
	 * @throws OCSBadRequestException
	 */
	public function getMetaData(int $id): DataResponse {
		try {
			$metaData = $this->metaDataStorage->getMetaData($this->userId, $id);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l10n->t('Could not find metadata for "%s"', [$id]));
		} catch (\Exception $e) {
			$this->logger->logException($e, ['app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Can\'t read metadata'));
		}
		return new DataResponse(['meta-data' => $metaData]);
	}

	/**
	 * set metadata
	 *
	 * @NoAdminRequired
	 *
	 * @param int $id file id
	 * @param string $metaData
	 * @return DataResponse
	 *
	 * @throws OCSNotFoundException
	 * @throws OCSBadRequestException
	 */
	public function setMetaData(int $id, string $metaData): DataResponse {
		try {
			$this->metaDataStorage->setMetaDataIntoIntermediateFile($this->userId, $id, $metaData);
		} catch (MetaDataExistsException $e) {
			return new DataResponse([], Http::STATUS_CONFLICT);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($e->getMessage());
		} catch (\Exception $e) {
			$this->logger->logException($e, ['app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Can\'t store metadata'));
		}

		return new DataResponse(['meta-data' => $metaData]);
	}

	/**
	 * update metadata
	 *
	 * @NoAdminRequired
	 *
	 * @param int $id file id
	 * @param string $metaData
	 *
	 * @return DataResponse
	 * @throws OCSForbiddenException
	 * @throws OCSBadRequestException
	 * @throws OCSNotFoundException
	 */
	public function updateMetaData(int $id, string $metaData): DataResponse {
		$e2eToken = $this->request->getParam('e2e-token');

		if ($this->lockManager->isLocked($id, $e2eToken)) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to edit the file, make sure to first lock it, and then send the right token'));
		}

		try {
			$this->metaDataStorage->updateMetaDataIntoIntermediateFile($this->userId, $id, $metaData);
		} catch (MissingMetaDataException $e) {
			throw new OCSNotFoundException($this->l10n->t('Metadata-file doesn\'t exist'));
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($e->getMessage());
		} catch (\Exception $e) {
			$this->logger->logException($e, ['app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Can\'t store metadata'));
		}

		return new DataResponse(['meta-data' => $metaData]);
	}

	/**
	 * delete metadata
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
		try {
			$this->metaDataStorage->deleteMetaData($this->userId, $id);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l10n->t('Could not find metadata for "%s"', [$id]));
		} catch (NotPermittedException $e) {
			throw new OCSForbiddenException($this->l10n->t('Only the owner can delete the metadata-file'));
		} catch (\Exception $e) {
			$this->logger->logException($e, ['app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Can\'t delete metadata'));
		}
		return new DataResponse();
	}
}
