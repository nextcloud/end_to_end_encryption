/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IMetadata, IRawMetadata, IRawMetadataUser, IRawRootMetadata } from '../models/metadata.d.ts'

import stringify from 'safe-stable-stringify'
import { base64ToBuffer, bufferToBase64, bufferToString, stringToBuffer } from './bufferUtils.ts'
import { uncompress } from './compression.ts'
import { validateCMSSignature } from './crypto.ts'
import { ensureKeyUsage } from './rsaUtils.ts'

/**
 * Check if a given JSON object is a raw root metadata
 *
 * @param json - The JSON representation of a raw metadata
 */
export function isRootMetadata(json: unknown): json is IRawRootMetadata {
	return typeof json === 'object'
		&& json !== null
		&& 'users' in json
}

/**
 * Encrypt the metadata key with the user's public key
 *
 * @param metadataKey - The metadata key to encrypt
 * @param key - The user's public key
 */
export async function encryptMetadataKey(metadataKey: Uint8Array<ArrayBuffer>, key: CryptoKey) {
	const encryptedKey = await globalThis.crypto.subtle.encrypt(
		{
			name: 'RSA-OAEP',
		},
		await ensureKeyUsage(key, 'encrypt'),
		metadataKey,
	)
	return bufferToBase64(new Uint8Array(encryptedKey))
}

/**
 * Decrypt the metadata from the given raw json using the provided metadata key
 *
 * @param json - The raw json
 * @param metadataKey - The metadata key used to encrypt it
 */
export async function decryptMetadata(json: IRawMetadata, metadataKey: CryptoKey): Promise<IMetadata> {
	if (json.version !== '2.0') {
		throw new Error(`Unsupported metadata version: ${json.version}`)
	}

	const decryptionKey = await ensureKeyUsage(metadataKey, 'decrypt')
	const [ciphertext] = json.metadata.ciphertext.split('|') // legacy format support as the Desktop Client still uses this
	return await globalThis.crypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv: base64ToBuffer(json.metadata.nonce),
			tagLength: 128,
		},
		decryptionKey,
		base64ToBuffer(ciphertext!),
	)
		.then((decrypted) => uncompress(new Uint8Array(decrypted)))
		.then((deflated) => bufferToString(deflated))
		.then((str) => JSON.parse(str) as IMetadata)
}

/**
 * Validates the signature of the given metadata using the provided root metadata.
 *
 * @param metadata - The metadata to validate
 * @param signature - The base64-encoded signature of the metadata
 * @param users - The users with access to the metadata
 */
export async function validateMetadataSignature(metadata: IRawMetadata, signature: string, users: IRawMetadataUser[]): Promise<void> {
	const signedData = stringify(metadata, (key, value) => {
		if (key === 'filedrop') {
			return undefined
		}
		return value
	})!

	const result = await validateCMSSignature(
		stringToBuffer(btoa(signedData)),
		base64ToBuffer(signature),
		users,
	)
	if (!result) {
		throw new Error('Metadata signature verification failed')
	}
}
