/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import { X509Certificate } from '@peculiar/x509'
import * as api from '../services/api.ts'
import { pemToBuffer } from '../services/bufferUtils.ts'
import { loadServerPublicKey } from '../services/crypto.ts'
import { promptUserForMnemonic } from '../services/mnemonicDialogs.ts'
import { decryptPrivateKey } from '../services/privateKeyUtils.ts'

let privateKey: CryptoKey | undefined
let publicKey: CryptoKey | undefined
let certificate: X509Certificate | undefined
let serverKey: CryptoKey | undefined

const userKeys = new Map<string, X509Certificate | undefined>()
const MEMORY_LIMIT = 100

/**
 * Get the server's public key.
 *
 * If not already loaded, it fetches it from the API.
 */
export async function getServerKey(): Promise<CryptoKey> {
	if (!serverKey) {
		const serverKeyPem = await api.getServerPublicKey()
		serverKey = await loadServerPublicKey(pemToBuffer(serverKeyPem), 'SHA-256')
	}
	return serverKey!
}

/**
 * Get the current user's X509 certificate.
 */
export async function getCertificate(): Promise<X509Certificate> {
	if (!certificate && !await loadPublicKey()) {
		// not e2ee enabled
		throw new Error('No user certificate found')
	}
	if (!certificate!.privateKey) {
		await loadPrivateKey()
	}
	return certificate!
}

/**
 * Set the current user's X509 certificate.
 *
 * @param cert - The user certificate
 */
export async function setCertificate(cert: X509Certificate): Promise<void> {
	certificate = cert
	if (!publicKey) {
		publicKey = await certificate.publicKey.export()
	}
	if (!privateKey && certificate.privateKey) {
		privateKey = certificate.privateKey
	}
}

/**
 * Check whether the public key is already loaded
 */
export function hasPublicKey(): boolean {
	return !!publicKey
}

/**
 * Get the current user's public key
 */
export async function getPublicKey(): Promise<CryptoKey | undefined> {
	if (!hasPublicKey()) {
		await loadPublicKey()
	}
	return publicKey
}

/**
 * Load the current user's public key from the API
 */
export async function loadPublicKey(): Promise<boolean> {
	if (!certificate) {
		const pem = await api.getPublicKey()
		if (!pem) {
			return false
		}

		const cert = new X509Certificate(pem)
		if (!cert.verify({ publicKey: await getServerKey() })) {
			throw new Error('User certificate signature verification failed')
		}
		if (privateKey) {
			cert.privateKey = privateKey
		}

		certificate = cert
		publicKey = await certificate.publicKey.export()
	}
	return true
}

/**
 * Loads the user's private key from the API and store it in the store.
 *
 * @param mnemonic - The users mnemonic
 * @return True if the private key was loaded successfully, false if there is no private key on the server (it throws on other errors)
 */
export async function loadPrivateKey(mnemonic?: string): Promise<boolean> {
	if (!privateKey) {
		const keyInfo = await api.getPrivateKey()
		if (keyInfo === null) {
			return false
		}

		mnemonic ??= await promptUserForMnemonic()

		const key = await decryptPrivateKey(keyInfo, mnemonic)
		privateKey = key
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
export async function getPrivateKey(): Promise<CryptoKey> {
	if (!hasPrivateKey()) {
		await loadPrivateKey()
	}
	return privateKey!
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
export async function getUserKey(userId: string): Promise<X509Certificate | undefined> {
	if (userId === getCurrentUser()!.uid) {
		return await getCertificate()
	}
	if (!userKeys.has(userId)) {
		const pem = await api.getPublicKey(userId)
		if (pem) {
			const cert = new X509Certificate(pem)
			if (!cert.verify({ publicKey: await getServerKey() })) {
				throw new Error('User certificate signature verification failed')
			}
			setUserKey(userId, cert)
		} else {
			userKeys.set(userId, undefined)
		}
	}
	return userKeys.get(userId)
}

/**
 * Set a user's public key in the store.
 *
 * @param userId - The user id
 * @param key - The public key
 */
export function setUserKey(userId: string, key: X509Certificate): void {
	if (userId === getCurrentUser()!.uid) {
		certificate = key
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
