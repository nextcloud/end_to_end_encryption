/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import { X509Certificate } from '@peculiar/x509'
import { getPrivateKey as apiGetPrivateKey, getPublicKey as apiGetPublicKey } from '../services/api.ts'
import { decryptPrivateKey } from '../services/privateKeyUtils.ts'

let privateKey: CryptoKey | undefined
let publicKey: CryptoKey | undefined
let certificate: X509Certificate | undefined

const userKeys = new Map<string, CryptoKey>()
const MEMORY_LIMIT = 50

/**
 * Get the current user's X509 certificate.
 * Note that it will only be available if the user has a private key loaded.
 */
export function getCertificate(): X509Certificate | undefined {
	if (!certificate || !certificate.privateKey) {
		return undefined
	}
	return certificate
}

/**
 * Set the current user's X509 certificate.
 *
 * @param cert - The user certificate
 */
export async function setCertificate(cert: X509Certificate): Promise<void> {
	certificate = cert
	publicKey = await certificate.publicKey.export()
}

/**
 * Load the current user's public key from the API
 */
export async function loadPublicKey(): Promise<boolean> {
	if (!certificate) {
		const pem = await apiGetPublicKey()
		if (!pem) {
			return false
		}

		certificate = new X509Certificate(pem)
		if (privateKey) {
			certificate.privateKey = privateKey
		}

		// todo: verify certificate?
		publicKey = await certificate.publicKey.export()
	}
	return true
}

/**
 * Get the current user's public key
 */
export function getPublicKey(): CryptoKey | undefined {
	return publicKey
}

/**
 * Check whether the public key is already loaded
 */
export function hasPublicKey(): boolean {
	return !!publicKey
}

/**
 * Loads the user's private key from the API and store it in the store.
 *
 * @param mnemonic - The users mnemonic
 * @return True if the private key was loaded successfully, false if there is no private key on the server (it throws on other errors)
 */
export async function loadPrivateKey(mnemonic: string): Promise<boolean> {
	if (!privateKey) {
		const key = await apiGetPrivateKey()
		if (key === null) {
			return false
		}

		privateKey = await decryptPrivateKey(key, mnemonic)
		if (certificate) {
			certificate.privateKey = privateKey
		}
	}
	return true
}

/**
 * Check whether the private key is already loaded
 */
export function hasPrivateKey(): boolean {
	return !!privateKey
}

/**
 * Get the loaded private key from the storage
 */
export function getPrivateKey(): CryptoKey | undefined {
	return privateKey
}

/**
 * Set the loaded private key in the storage
 *
 * @param key - The private key
 */
export function setPrivateKey(key: CryptoKey): void {
	if (certificate) {
		certificate.privateKey = key
	}
	privateKey = key
}

/**
 * Get a user's public key from the store.
 *
 * @param userId - The user ID
 */
export function getUserKey(userId: string): CryptoKey | undefined {
	if (userId === getCurrentUser()!.uid) {
		return publicKey
	}
	return userKeys.get(userId)
}

/**
 * Set a user's public key in the store.
 *
 * @param userId - The user id
 * @param key - The public key
 */
export function setUserKey(userId: string, key: CryptoKey): void {
	if (userId === getCurrentUser()!.uid) {
		publicKey = key
		return
	}

	userKeys.delete(userId)
	userKeys.set(userId, key)

	// ensure the memory limit is not exceeded
	if (userKeys.size > MEMORY_LIMIT) {
		const oldestKey = userKeys.keys().next().value!
		userKeys.delete(oldestKey)
	}
}
