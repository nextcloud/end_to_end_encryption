<?php
/**
 * SPDX-License-Identifier: AGPL-3.0+
 *
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
 *
 * @author Bjoern Schiessle <bjoern@schiessle.org>
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
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\Exceptions\KeyExistsException;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\KeyStorage;
use OCA\EndToEndEncryption\LockManager;
use OCA\EndToEndEncryption\SignatureHandler;
use OCP\AppFramework\Http;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\ForbiddenException;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\ILogger;
use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;

/**
 * Class RequestHandlerController
 *
 * handle API calls from the client to the server
 *
 * @package OCA\EndToEndEncryption\Controller
 */
class RequestHandlerController extends OCSController {

	/** @var  string */
	private $userId;

	/** @var KeyStorage */
	private $keyStorage;

	/** @var SignatureHandler */
	private $signatureHandler;

	/** @var EncryptionManager */
	private $manager;

	/** @var ILogger */
	private $logger;

	/** @var LockManager */
	private $lockManager;

	/** @var IL10N */
	private $l;

	/**
	 * RequestHandlerController constructor.
	 *
	 * @param string $AppName
	 * @param IRequest $request
	 * @param string $UserId
	 * @param KeyStorage $keyStorage
	 * @param SignatureHandler $signatureHandler
	 * @param EncryptionManager $manager
	 * @param LockManager $lockManager
	 * @param ILogger $logger
	 * @param IL10N $l
	 */
	public function __construct($AppName,
								IRequest $request,
								$UserId,
								KeyStorage $keyStorage,
								SignatureHandler $signatureHandler,
								EncryptionManager $manager,
								LockManager $lockManager,
								ILogger $logger,
								IL10N $l
	){
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->keyStorage = $keyStorage;
		$this->signatureHandler = $signatureHandler;
		$this->manager = $manager;
		$this->logger = $logger;
		$this->lockManager = $lockManager;
		$this->l = $l;
	}

	/**
	 * get private key
	 *
	 * @NoAdminRequired
	 *
	 * @return DataResponse
	 *
	 * @throws OCSBadRequestException
	 * @throws OCSForbiddenException
	 * @throws OCSNotFoundException
	 */
	public function getPrivateKey() {
		try {
			$privateKey = $this->keyStorage->getPrivateKey($this->userId);
			return new DataResponse(['private-key' => $privateKey]);
		} catch (ForbiddenException $e) {
			throw new OCSForbiddenException($this->l->t('You are not allowed to access this private key'));
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l->t('Private key for user %s not found', [$this->userId]));
		} catch (\Exception $e) {
			$error = 'Can\'t get private key: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t('Internal error'));
		}
	}

	/**
	 * delete the users private key
	 *
	 * @NoAdminRequired
	 *
	 * @return DataResponse
	 *
	 * @throws OCSBadRequestException
	 * @throws OCSForbiddenException
	 * @throws OCSNotFoundException
	 */
	public function deletePrivateKey() {
		try {
			$this->keyStorage->deletePrivateKey($this->userId);
			return new DataResponse();
		} catch (NotPermittedException $e) {
			throw new OCSForbiddenException($this->l->t('You are not allowed to delete this private key'));
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l->t('Private key for user %s not found', [$this->userId]));
		} catch (\Exception $e) {
			$error = 'Can\'t get private key: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t('Internal error'));
		}
	}


	/**
	 * set private key
	 *
	 * @NoAdminRequired
	 *
	 * @param string $privateKey
	 * @return DataResponse
	 *
	 * @throws OCSBadRequestException
	 */
	public function setPrivateKey($privateKey) {
		try {
			$this->keyStorage->setPrivateKey($privateKey, $this->userId);
		} catch (KeyExistsException $e) {
			return new DataResponse([], Http::STATUS_CONFLICT);
		} catch (\Exception $e) {
			$error = 'Can\'t store private key: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t('internal error'));
		}

		return new DataResponse(['private-key' => $privateKey]);
	}

	/**
	 * get public key
	 *
	 * @NoAdminRequired
	 *
	 * @param string $users a json encoded list of users
	 * @return DataResponse
	 *
	 * @throws OCSBadRequestException
	 * @throws OCSNotFoundException
	 */
	public function getPublicKeys($users = '') {

		$usersArray = $this->jsonDecode($users);

		$result = ['public-keys' => []];
		foreach ($usersArray as $uid) {
			try {
				$publicKey = $this->keyStorage->getPublicKey($uid);
				$result['public-keys'][$uid] = $publicKey;
			} catch (NotFoundException $e) {
				throw new OCSNotFoundException($this->l->t('Public key for user %s not found', [$uid]));
			} catch (\Exception $e) {
				$error = 'Can\'t get public keys: ' . $e->getMessage();
				$this->logger->error($error, ['app' => 'end_to_end_encryption']);
				throw new OCSBadRequestException($this->l->t('Internal error'));
			}
		}

		return new DataResponse($result);
	}

	/**
	 * create public key, store it on the server and return it to the user
	 *
	 * if no public key exists and the request contains a valid certificate
	 * from the currently logged in user we will create one
	 *
	 * @NoAdminRequired
	 *
	 * @param string $csr request to create a valid public key
	 * @return DataResponse
	 *
	 * @throws OCSForbiddenException
	 * @throws OCSBadRequestException
	 */
	public function createPublicKey($csr) {
		if ($this->keyStorage->publicKeyExists($this->userId)) {
			return new DataResponse([], Http::STATUS_CONFLICT);
		}

		try {
			$subject = openssl_csr_get_subject($csr);
			$publicKey = $this->signatureHandler->sign($csr);
		} catch (\BadMethodCallException $e) {
			$error = 'Can\'t create public key: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t($e->getMessage()));
		} catch (\Exception $e) {
			$error = 'Can\'t create public key: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t('Internal error'));
		}

		$cn = isset($subject['CN']) ? $subject['CN'] : '';
		if ($cn !== $this->userId) {
			throw new OCSForbiddenException($this->l->t('CN does not match the current user'));
		}

		$this->keyStorage->setPublicKey($publicKey, $this->userId);

		return new DataResponse(['public-key' => $publicKey]);

	}

	/**
	 * delete the users public key
	 *
	 * @NoAdminRequired
	 *
	 * @return DataResponse
	 *
	 * @throws OCSForbiddenException
	 * @throws OCSBadRequestException
	 * @throws OCSNotFoundException
	 */
	public function deletePublicKey() {
		try {
			$this->keyStorage->deletePublicKey($this->userId);
			return new DataResponse();
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l->t('Public key for user %s not found', [$this->userId]));
		} catch (NotPermittedException $e) {
			throw new OCSForbiddenException($this->l->t('You are not allowed to delete this private key'));
		} catch (\Exception $e) {
			$error = 'Can\'t delete public keys: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t('Internal error'));
		}
	}


	/**
	 * get meta data
	 *
	 * @NoAdminRequired
	 *
	 * @param int $id file id
	 * @return DataResponse
	 *
	 * @throws OCSNotFoundException
	 * @throws OCSBadRequestException
	 */
	public function getMetaData($id) {
		try {
			$metaData = $this->keyStorage->getMetaData($id);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l->t('Meta data for "%s" not found', [$id]));
		} catch (\Exception $e) {
			$error = 'Can\'t read meta data: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t("Can't read meta data"));
		}
		return new DataResponse(['meta-data' => $metaData]);
	}

	/**
	 * set meta data
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
	public function setMetaData($id, $metaData) {
		try {
			$this->keyStorage->setMetaData($id, $metaData);
		} catch (MetaDataExistsException $e) {
			return new DataResponse([], Http::STATUS_CONFLICT);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l->t($e->getMessage()));
		} catch (\Exception $e) {
			$error = 'Can\'t store meta data: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t("Can't store meta data"));
		}

		return new DataResponse(['meta-data' => $metaData]);
	}

	/**
	 * update meta data
	 *
	 * @NoAdminRequired
	 *
	 * @param int $id file id
	 * @param string $metaData
	 * @param string $token
	 *
	 * @return DataResponse
	 * @throws OCSForbiddenException
	 * @throws OCSBadRequestException
	 * @throws OCSNotFoundException
	 */
	public function updateMetaData($id, $metaData, $token) {

		if ($this->lockManager->isLocked($id, $token)) {
			throw new OCSForbiddenException($this->l->t('You are not allowed to edit the file, make sure to lock it first and send the right token'));
		}

		try {
			$this->keyStorage->updateMetaData($id, $metaData);
		} catch (MissingMetaDataException $e) {
			throw new OCSNotFoundException($this->l->t("Meta data file doesn't exist"));
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l->t($e->getMessage()));
		} catch (\Exception $e) {
			$error = 'Can\'t store meta data: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t("Can't store meta data"));
		}

		return new DataResponse(['meta-data' => $metaData]);
	}

	/**
	 * delete meta data
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
	public function deleteMetaData($id) {
		try {
			$this->keyStorage->deleteMetaData($id);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l->t('Meta data for "%s" not found', [$id]));
		} catch (NotPermittedException $e) {
			throw new OCSForbiddenException($this->l->t('Only the owner can delete the meta-data file'));
		} catch (\Exception $e) {
			$error = 'Internal server error: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t("Can't delete meta data"));
		}
		return new DataResponse();
	}


	/**
	 * @NoAdminRequired
	 *
	 * get the public server key so that the clients can verify the
	 * signature of the users public keys
	 *
	 * @return DataResponse
	 *
	 * @throws \OCP\AppFramework\OCS\OCSBadRequestException
	 */
	public function getPublicServerKey() {
		try {
			$publicKey = $this->signatureHandler->getPublicServerKey();
		} catch (\Exception $e) {
			$error = 'Can\'t read server wide public key: ' . $e->getMessage();
			$this->logger->error($error, ['app' => 'end_to_end_encryption']);
			throw new OCSBadRequestException($this->l->t('Internal error'));
		}

		return new DataResponse(['public-key' => $publicKey]);
	}

	/**
	 * @NoAdminRequired
	 *
	 * set encryption flag for folder
	 *
	 * @param int $id file ID
	 * @return DataResponse
	 *
	 * @throws OCSNotFoundException
	 */
	public function setEncryptionFlag($id) {
		try {
			$this->manager->setEncryptionFlag($id);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l->t($e->getMessage()));
		}

		return new DataResponse();
	}

	/**
	 * @NoAdminRequired
	 *
	 * set encryption flag for folder
	 *
	 * @param int $id file ID
	 * @return DataResponse
	 *
	 * @throws OCSNotFoundException
	 */
	public function removeEncryptionFlag($id) {
		try {
			$this->manager->removeEncryptionFlag($id);
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l->t($e->getMessage()));
		}

		return new DataResponse();
	}

	/**
	 * lock folder
	 *
	 * @NoAdminRequired
	 *
	 * @param int $id file ID
	 * @param string $token token to identify client
	 *
	 * @return DataResponse
	 * @throws OCSForbiddenException
	 */
	public function lockFolder($id, $token = '') {
		$token = $this->lockManager->lockFile($id, $token);
		if (empty($token)) {
			throw new OCSForbiddenException($this->l->t('File is already locked'));
		}
		return new DataResponse(['token' => $token]);
	}


	/**
	 * unlock folder
	 *
	 * @NoAdminRequired
	 *
	 * @param int $id file ID
	 *
	 * @return DataResponse
	 * @throws OCSNotFoundException
	 * @throws OCSForbiddenException
	 */
	public function unlockFolder($id) {
		$token = $this->request->getHeader('token');
		try {
			$this->lockManager->unlockFile($id, $token);
		} catch (FileLockedException $e) {
			throw new OCSForbiddenException($this->l->t('You are not allowed to remove the lock'));
		} catch (FileNotLockedException $e) {
			throw new OCSNotFoundException($this->l->t('File not locked'));
		}

		return new DataResponse();

	}

	/**
	 * decode json encoded users list and return a array
	 * add the currently logged in user if the user isn't part of the list
	 *
	 * @param string $users json encoded users list
	 * @return array
	 * @throws OCSBadRequestException
	 */
	private function jsonDecode($users) {

		$usersArray = [];
		if (!empty($users)) {
			$usersArray = json_decode($users);
			if ($usersArray === null) {
				throw new OCSBadRequestException($this->l->t('Can not decode users list'));
			}
		}

		if (!in_array($this->userId, $usersArray, true)) {
			$usersArray[] = $this->userId;
		}

		return $usersArray;
	}

}
