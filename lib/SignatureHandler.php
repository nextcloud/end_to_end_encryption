<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption;

use BadMethodCallException;
use OC\Security\IdentityProof\Manager;
use RuntimeException;

/**
 * Signs users public keys and manage system keys
 *
 * @package OCA\EndToEndEncryption
 */
class SignatureHandler {
	private Manager $identityProofManager;

	/** @var int the signature is 20 years (7300 days) valid */
	private int $validity = 7300;

	public function __construct(Manager $identityProofManager) {
		$this->identityProofManager = $identityProofManager;
	}

	/**
	 * @return string signed certificate
	 * @throws BadMethodCallException
	 * @throws RuntimeException
	 */
	public function sign(string $csr): string {
		$systemKeys = $this->identityProofManager->getSystemKey();
		$signedCertificate = openssl_csr_sign($csr, null, $systemKeys->getPrivate(), $this->validity);
		if ($signedCertificate === false) {
			throw new BadMethodCallException('could not sign the CSR, please make sure to submit a valid CSR');
		}
		openssl_x509_export($signedCertificate, $result);
		return $result;
	}

	/**
	 * Return the public key of the instance wide key-pair
	 * @throws RuntimeException
	 */
	public function getPublicServerKey(): string {
		return $this->identityProofManager->getSystemKey()->getPublic();
	}
}
