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

use OCA\EndToEndEncryption\Exceptions\KeyExistsException;
use OCA\EndToEndEncryption\IKeyStorage;
use OCA\EndToEndEncryption\SignatureHandler;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\AppFramework\OCSController;
use OCP\Files\ForbiddenException;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\IRequest;
use Exception;
use BadMethodCallException;
use Psr\Log\LoggerInterface;

class KeyController extends OCSController {
	private ?string $userId;
	private IKeyStorage $keyStorage;
	private SignatureHandler $signatureHandler;
	private LoggerInterface $logger;
	private IL10N $l10n;

	public function __construct(string $AppName,
								IRequest $request,
								?string $userId,
								IKeyStorage $keyStorage,
								SignatureHandler $signatureHandler,
								LoggerInterface $logger,
								IL10N $l10n
	) {
		parent::__construct($AppName, $request);
		$this->userId = $userId;
		$this->keyStorage = $keyStorage;
		$this->signatureHandler = $signatureHandler;
		$this->logger = $logger;
		$this->l10n = $l10n;
	}

	/**
	 * Get private key
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 * @throws OCSBadRequestException
	 * @throws OCSForbiddenException
	 * @throws OCSNotFoundException
	 */
	public function getPrivateKey(): DataResponse {
		try {
			$privateKey = $this->keyStorage->getPrivateKey($this->userId);
			return new DataResponse(['private-key' => $privateKey]);
		} catch (ForbiddenException $e) {
			throw new OCSForbiddenException($this->l10n->t('This is someone else\'s private key'));
		} catch (NotFoundException $e) {
			$this->logger->warning('Could not find the private key of the user: ' . $this->userId);
			throw new OCSNotFoundException($this->l10n->t('Could not find the private key of the user %s', [$this->userId]));
		} catch (Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Internal error'));
		}
	}

	/**
	 * Delete the users private key
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 * @throws OCSBadRequestException
	 * @throws OCSForbiddenException
	 * @throws OCSNotFoundException
	 */
	public function deletePrivateKey(): DataResponse {
		try {
			$this->keyStorage->deletePrivateKey($this->userId);
			return new DataResponse();
		} catch (NotPermittedException $e) {
			throw new OCSForbiddenException($this->l10n->t('You are not allowed to delete this private key'));
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l10n->t('Could not find the private key belonging to the user %s', [$this->userId]));
		} catch (Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Internal error'));
		}
	}


	/**
	 * Set private key
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 * @throws OCSBadRequestException
	 */
	public function setPrivateKey(string $privateKey): DataResponse {
		try {
			$this->keyStorage->setPrivateKey($privateKey, $this->userId);
		} catch (KeyExistsException $e) {
			return new DataResponse([], Http::STATUS_CONFLICT);
		} catch (Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Internal error'));
		}

		return new DataResponse(['private-key' => $privateKey]);
	}

	/**
	 * Get public key
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 * @param string $users a json encoded list of users
	 * @throws OCSBadRequestException
	 * @throws OCSNotFoundException
	 */
	public function getPublicKeys(string $users = ''): DataResponse {
		$usersArray = $this->jsonDecode($users);

		$result = ['public-keys' => []];
		foreach ($usersArray as $uid) {
			try {
				$publicKey = $this->keyStorage->getPublicKey($uid);
				$result['public-keys'][$uid] = $publicKey;
			} catch (NotFoundException $e) {
				throw new OCSNotFoundException($this->l10n->t('Could not find the public key belonging to the user %s', [$uid]));
			} catch (Exception $e) {
				$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
				throw new OCSBadRequestException($this->l10n->t('Internal error'));
			}
		}

		return new DataResponse($result);
	}

	/**
	 * Create public key, store it on the server and return it to the user
	 *
	 * If no public key exists and the request contains a valid certificate
	 * from the currently logged in user we will create one
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * @param string $csr request to create a valid public key
	 *
	 * @throws OCSForbiddenException
	 * @throws OCSBadRequestException
	 */
	public function createPublicKey(string $csr): DataResponse {
		if ($this->keyStorage->publicKeyExists($this->userId)) {
			return new DataResponse([], Http::STATUS_CONFLICT);
		}

		try {
			$subject = openssl_csr_get_subject($csr);
			$publicKey = $this->signatureHandler->sign($csr);
		} catch (BadMethodCallException $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($e->getMessage());
		} catch (Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Internal error'));
		}

		$cn = isset($subject['CN']) ? $subject['CN'] : '';
		if ($cn !== $this->userId) {
			throw new OCSForbiddenException($this->l10n->t('Common name (CN) does not match the current user'));
		}

		$this->keyStorage->setPublicKey($publicKey, $this->userId);

		return new DataResponse(['public-key' => $publicKey]);
	}

	/**
	 * Delete the users public key
	 *
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * @return DataResponse
	 *
	 * @throws OCSForbiddenException
	 * @throws OCSBadRequestException
	 * @throws OCSNotFoundException
	 */
	public function deletePublicKey(): ?DataResponse {
		try {
			$this->keyStorage->deletePublicKey($this->userId);
			return new DataResponse();
		} catch (NotFoundException $e) {
			throw new OCSNotFoundException($this->l10n->t('Could not find the public key belonging to %s', [$this->userId]));
		} catch (NotPermittedException $e) {
			throw new OCSForbiddenException($this->l10n->t('This is not your public key to delete'));
		} catch (Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Internal error'));
		}
	}


	/**
	 * @NoAdminRequired
	 * @E2ERestrictUserAgent
	 *
	 * Get the public server key so that the clients can verify the
	 * signature of the users public keys
	 *
	 * @return DataResponse
	 *
	 * @throws OCSBadRequestException
	 */
	public function getPublicServerKey(): DataResponse {
		try {
			$publicKey = $this->signatureHandler->getPublicServerKey();
		} catch (Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Internal error'));
		}

		return new DataResponse(['public-key' => $publicKey]);
	}

	/**
	 * Decode JSON-encoded userlist and return an array
	 * add the currently logged in user if the user isn't part of the list
	 *
	 * @param string $users JSON-encoded userlist
	 * @return array
	 * @throws OCSBadRequestException
	 */
	private function jsonDecode(string $users): array {
		$usersArray = [];
		if (!empty($users)) {
			// TODO - use JSON_THROW_ON_ERROR once we require PHP 7.3
			$usersArray = \json_decode($users, true);
			if ($usersArray === null) {
				throw new OCSBadRequestException($this->l10n->t('Cannot decode userlist'));
			}
		}

		if (!in_array($this->userId, $usersArray, true)) {
			$usersArray[] = $this->userId;
		}

		return $usersArray;
	}
}
