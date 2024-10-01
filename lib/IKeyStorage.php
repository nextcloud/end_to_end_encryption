<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\Exceptions\KeyExistsException;
use OCP\Files\ForbiddenException;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IUser;

/**
 * Interface IKeyStorage
 *
 * @package OCA\EndToEndEncryption
 */
interface IKeyStorage {

	/**
	 * Get users public key
	 *
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	public function getPublicKey(string $uid): string;

	/**
	 * Check if a public key exists
	 *
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	public function publicKeyExists(string $uid): bool;

	/**
	 * Store public key
	 *
	 * @throws KeyExistsException
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	public function setPublicKey(string $publicKey, string $uid): void;

	/**
	 * Delete the users public key
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function deletePublicKey(string $uid): void;

	/**
	 * Get users private key
	 *
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 * @throws ForbiddenException
	 */
	public function getPrivateKey(string $uid): string;

	/**
	 * Check if a private key exists
	 *
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 * @throws ForbiddenException
	 */
	public function privateKeyExists(string $uid): bool;

	/**
	 * Store private key
	 *
	 * @throws KeyExistsException
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 * @throws ForbiddenException
	 */
	public function setPrivateKey(string $privateKey, string $uid): void;

	/**
	 * Get users private key
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function deletePrivateKey(string $uid): void;

	/**
	 * Delete all user private and public key permanently
	 *
	 * @throws NotFoundException
	 * @throws NotPermittedException
	 */
	public function deleteUserKeys(IUser $user): void;
}
