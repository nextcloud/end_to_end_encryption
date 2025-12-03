/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PrivateKeyInfo } from '../models.ts'

import { base64ToBuffer, bufferToBase64, bufferToPem, bufferToString, pemToBuffer, stringToBuffer } from './bufferUtils.ts'
import { decryptWithAES, encryptWithAES, loadRSAPrivateKey } from './crypto.ts'
import logger from './logger.ts'

/**
 * Generates a new RSA-OAEP private and public key pair.
 */
export async function generatePrivateKey(): Promise<CryptoKeyPair> {
	return await self.crypto.subtle.generateKey({
		name: 'RSA-OAEP',
		modulusLength: 2048,
		publicExponent: new Uint8Array([1, 0, 1]),
		hash: { name: 'SHA-256' },
	}, true, ['encrypt', 'decrypt'])
}

/**
 * Encrypts the user's private key using their mnemonic.
 *
 * @param privateKey - the RSA private key to encrypt
 * @param mnemonic - The user's mnemonic
 */
export async function encryptPrivateKey(
	privateKey: CryptoKey,
	mnemonic: string,
): Promise<PrivateKeyInfo> {
	if (!privateKey.extractable) {
		throw new Error('Private key is not extractable')
	}

	// remove whitespace and lowercase the mnemonic
	mnemonic = mnemonic.toLowerCase().replaceAll(/\s+/g, '')

	// generate the encryption key (deviate from mnemonic)
	const salt = self.crypto.getRandomValues(new Uint8Array(40))
	const encryptionKey = await mnemonicToPrivateKey(mnemonic, salt, { hash: 'SHA-256', iterations: 600000 })
	// export the private key to PEM format
	const rawKeyData = new Uint8Array(await self.crypto.subtle.exportKey('pkcs8', privateKey))
	const pemKeyData = bufferToPem(rawKeyData, 'private')
	// Undocumented base64 encoding, see: https://github.com/nextcloud/end_to_end_encryption_rfc/issues/67
	const b42KeyData = stringToBuffer(bufferToBase64(stringToBuffer(pemKeyData)))

	// encrypt the private key with the derived encryption key
	const { encryptedContent: encryptedPrivateKey, iv } = await encryptWithAES(b42KeyData, encryptionKey, { tagLength: 128 })
	return {
		encryptedPrivateKey,
		iv,
		salt,
	}
}

/**
 * Decrypts the user's private key using their mnemonic.
 *
 * @param privateKeyInfo - The encrypted private key info
 * @param mnemonic - The user's mnemonic
 */
export async function decryptPrivateKey(privateKeyInfo: PrivateKeyInfo, mnemonic: string): Promise<CryptoKey> {
	logger.debug('Decrypting private key', { privateKeyInfo, mnemonic })

	// We need to support the old mnemonic formats for backwards compatibility
	const mnemonicPrivateKeys = await Promise.all([
		await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt, { hash: 'SHA-256', iterations: 600000 }),
		await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt, { hash: 'SHA-1', iterations: 1024 }),
		await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt, { hash: 'SHA-1', iterations: 600000 }),
	])

	for (const mnemonicPrivateKey of mnemonicPrivateKeys) {
		try {
			const pemKey = await decryptWithAES(
				privateKeyInfo.encryptedPrivateKey,
				mnemonicPrivateKey,
				{ iv: privateKeyInfo.iv, tagLength: 128 },
			)
				.then(bufferToString) // Make the buffer a string
				.then(base64ToBuffer) // so that we can convert it from base64 encoding to binary
				.then(bufferToString) // we need a string to parse the inner PEM
				.then(pemToBuffer) // finally convert the PEM to a buffer (get the raw pkcs8 data)

			return loadRSAPrivateKey((pemKey))
		} catch (error) {
			logger.debug('Failed to decrypt private key with mnemonic', { error })
			// Try the next one
		}
	}

	throw new Error('Failed to decrypt private key')
}

/**
 * Derives a private key from the given mnemonic using PBKDF2.
 *
 * @param mnemonic - The user's mnemonic
 * @param salt - The salt to use for key derivation
 * @param params - Additional parameters for key derivation
 */
async function mnemonicToPrivateKey(mnemonic: string, salt: Uint8Array, params: Partial<Pbkdf2Params>): Promise<CryptoKey> {
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(mnemonic.replaceAll(' ', '')),
		{ name: 'PBKDF2' },
		false,
		['deriveKey'],
	)

	return await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			...params,
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		true,
		['decrypt', 'encrypt'],
	)
}
