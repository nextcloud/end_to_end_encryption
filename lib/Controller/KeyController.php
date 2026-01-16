<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Controller;

use BadMethodCallException;
use Exception;
use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\Attributes\E2ERestrictUserAgent;
use OCA\EndToEndEncryption\Exceptions\KeyExistsException;
use OCA\EndToEndEncryption\IKeyStorage;
use OCA\EndToEndEncryption\SignatureHandler;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\PublicPage;
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
use OCP\Share\IManager;
use Psr\Log\LoggerInterface;

class KeyController extends OCSController {

	public function __construct(
		IRequest $request,
		private ?string $userId,
		private IKeyStorage $keyStorage,
		private SignatureHandler $signatureHandler,
		private LoggerInterface $logger,
		private IL10N $l10n,
		private IManager $shareManager,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * Get private key
	 *
	 * @param ?string $shareToken - Optional share token to get a private key associated with a share
	 * @return DataResponse<Http::STATUS_OK, array{private-key: string}, array{}>
	 * @throws OCSBadRequestException Internal error
	 * @throws OCSForbiddenException Not allowed to get private key
	 * @throws OCSNotFoundException Private key not found
	 *
	 * 200: Private key returned
	 */
	#[NoAdminRequired]
	#[PublicPage]
	#[E2ERestrictUserAgent]
	public function getPrivateKey(?string $shareToken = null): DataResponse {
		if ($this->userId === null && $shareToken === null) {
			throw new OCSForbiddenException($this->l10n->t('Not allowed to get private key'));
		}

		try {
			$privateKey = $this->keyStorage->getPrivateKey($this->userId ?? '', $shareToken);
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
	 * @param ?string $shareToken - Optional share token to delete a private key associated with a share
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
	 * @throws OCSBadRequestException Internal error
	 * @throws OCSForbiddenException Not allowed to delete public key
	 * @throws OCSNotFoundException Private key not found
	 *
	 * 200: Private key deleted successfully
	 */
	#[NoAdminRequired]
	public function deletePrivateKey(?string $shareToken = null): DataResponse {
		try {
			$this->keyStorage->deletePrivateKey($this->userId, $shareToken);
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
	 * @param string $privateKey - The new private key
	 * @param ?string $shareToken - Optional share token to set a private key associated with a share
	 * @return DataResponse<Http::STATUS_OK, array{private-key: string}, array{}>|DataResponse<Http::STATUS_CONFLICT, list<empty>, array{}>
	 * @throws OCSBadRequestException Internal error
	 *
	 * 200: Private key set successfully
	 * 409: Private key already exists
	 */
	#[NoAdminRequired]
	#[E2ERestrictUserAgent]
	public function setPrivateKey(string $privateKey, ?string $shareToken = null): DataResponse {
		try {
			$this->keyStorage->setPrivateKey($privateKey, $this->userId, $shareToken);
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
	 * @param string $users a json encoded list of users
	 * @return DataResponse<Http::STATUS_OK, array{public-keys: array<string, string>}, array{}>
	 * @throws OCSBadRequestException Internal error
	 * @throws OCSNotFoundException Public key not found
	 *
	 * 200: Public keys returned
	 */
	#[NoAdminRequired]
	#[PublicPage]
	#[E2ERestrictUserAgent]
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
	 * @param string $csr request to create a valid public key
	 * @param ?string $shareToken - optional share token to create a public key associated with a share
	 *
	 * @return DataResponse<Http::STATUS_OK, array{public-key: string}, array{}>|DataResponse<Http::STATUS_CONFLICT, list<empty>, array{}>
	 * @throws OCSForbiddenException Common name (CN) does not match the current user
	 * @throws OCSBadRequestException Internal error
	 *
	 * 200: Public key created successfully
	 * 409: Public key already exists
	 */
	#[NoAdminRequired]
	#[E2ERestrictUserAgent]
	public function createPublicKey(string $csr, ?string $shareToken = null): DataResponse {
		if ($this->keyStorage->publicKeyExists($this->userId, $shareToken)) {
			return new DataResponse([], Http::STATUS_CONFLICT);
		}

		$subject = openssl_csr_get_subject($csr);
		if ($subject === false) {
			throw new OCSBadRequestException($this->l10n->t('Could not parse the CSR, please make sure to submit a valid CSR'));
		}
		$cn = isset($subject['CN']) ? $subject['CN'] : '';
		if ($shareToken !== null) {
			if ($cn !== "s:$shareToken") {
				throw new OCSForbiddenException($this->l10n->t('Common name (CN) does not match the share token'));
			}
			$share = $this->shareManager->getShareByToken($shareToken);
			if ($share->getShareOwner() !== $this->userId) {
				throw new OCSForbiddenException($this->l10n->t('You are not the owner of the share'));
			}
		} elseif ($this->userId !== $cn) {
			throw new OCSForbiddenException($this->l10n->t('Common name (CN) does not match the current user'));
		}

		try {
			$publicKey = $this->signatureHandler->sign($csr);
		} catch (BadMethodCallException $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($e->getMessage());
		} catch (Exception $e) {
			$this->logger->critical($e->getMessage(), ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Internal error'));
		}

		$this->keyStorage->setPublicKey($publicKey, $this->userId, $shareToken);
		return new DataResponse(['public-key' => $publicKey]);
	}

	/**
	 * Set public key
	 *
	 * @param string $publicKey The new public key
	 * @return DataResponse<Http::STATUS_OK, array{public-key: string}, array{}>|DataResponse<Http::STATUS_CONFLICT, list<empty>, array{}>
	 * @throws OCSBadRequestException Internal error
	 *
	 * 200: Public key set successfully
	 * 409: Public key already exists
	 */
	#[NoAdminRequired]
	#[E2ERestrictUserAgent]
	public function setPublicKey(string $publicKey): DataResponse {
		try {
			$this->keyStorage->setPublicKey($publicKey, $this->userId);
		} catch (KeyExistsException $e) {
			return new DataResponse([], Http::STATUS_CONFLICT);
		} catch (Exception $e) {
			$this->logger->error('Fail to set user public key', ['exception' => $e, 'app' => $this->appName]);
			throw new OCSBadRequestException($this->l10n->t('Internal error'));
		}

		return new DataResponse(['public-key' => $publicKey]);
	}

	/**
	 * Delete the users public key
	 *
	 * @param ?string $shareToken - Optional share token to delete a public key associated with a share
	 * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
	 *
	 * @throws OCSForbiddenException Not allowed to delete public key
	 * @throws OCSBadRequestException Internal error
	 * @throws OCSNotFoundException Public key not found
	 *
	 * 200: Public key deleted successfully
	 */
	#[NoAdminRequired]
	public function deletePublicKey(?string $shareToken = null): ?DataResponse {
		try {
			$this->keyStorage->deletePublicKey($this->userId, $shareToken);
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
	 * Get the public server key so that the clients can verify the
	 * signature of the users public keys
	 *
	 * @return DataResponse<Http::STATUS_OK, array{public-key: string}, array{}>
	 *
	 * @throws OCSBadRequestException Internal error
	 *
	 * 200: Server public key returned
	 */
	#[NoAdminRequired]
	#[PublicPage]
	#[E2ERestrictUserAgent]
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

		if ($this->userId !== null && !in_array($this->userId, $usersArray, true)) {
			$usersArray[] = $this->userId;
		}

		return $usersArray;
	}
}
