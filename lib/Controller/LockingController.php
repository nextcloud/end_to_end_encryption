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
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\FileService;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\LockManager;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IL10N;
use OCP\IRequest;

class LockingController extends OCSController {

	/** @var  string */
	private $userId;

	/** @var IMetaDataStorage */
	private $metaDataStorage;

	/** @var IRootFolder */
	private $rootFolder;

	/** @var FileService */
	private $fileService;

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
	 * @param IRootFolder $rootFolder
	 * @param FileService $fileService
	 * @param IL10N $l10n
	 */
	public function __construct($AppName,
								IRequest $request,
								$userId,
								IMetaDataStorage $metaDataStorage,
								LockManager $lockManager,
								IRootFolder $rootFolder,
								FileService $fileService,
								IL10N $l10n
	) {
		parent::__construct($AppName, $request);
		$this->userId = $userId;
		$this->metaDataStorage = $metaDataStorage;
		$this->rootFolder = $rootFolder;
		$this->fileService = $fileService;
		$this->lockManager = $lockManager;
		$this->l10n = $l10n;
	}

	/**
	 * lock folder
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * @param int $id file ID
	 *
	 * @return DataResponse
	 * @throws OCSForbiddenException
	 */
	public function lockFolder(int $id): DataResponse {
		$e2eToken = $this->request->getParam('e2e-token', '');

		$newToken = $this->lockManager->lockFile($id, $e2eToken);
		if ($newToken === null) {
			throw new OCSForbiddenException($this->l10n->t('File already locked'));
		}
		return new DataResponse(['e2e-token' => $newToken]);
	}


	/**
	 * unlock folder
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * @param int $id file ID
	 *
	 * @return DataResponse
	 * @throws OCSForbiddenException
	 * @throws OCSNotFoundException
	 */
	public function unlockFolder(int $id): DataResponse {
		$token = $this->request->getHeader('e2e-token');
		if ($token === '') {
			$token = $this->request->getParam('e2e-token', '');
		}

		try {
			$userFolder = $this->rootFolder->getUserFolder($this->userId);
		} catch (NoUserException $e) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		}

		$nodes = $userFolder->getById($id);
		if (!isset($nodes[0]) || !$nodes[0] instanceof Folder) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		}

		$this->fileService->finalizeChanges($nodes[0]);
		$this->metaDataStorage->saveIntermediateFile($this->userId, $id);
		$this->metaDataStorage->deleteIntermediateFile($this->userId, $id);

		try {
			$this->lockManager->unlockFile($id, $token);
		} catch (FileLockedException $e) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to remove the lock'));
		} catch (FileNotLockedException $e) {
			throw new OCSNotFoundException($this->l10n->t('File not locked'));
		}

		return new DataResponse();
	}
}
