/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IRawRootMetadata } from '../models/metadata.d.ts'

import stringify from 'safe-stable-stringify'
import { base64ToBuffer, bufferToBase64, stringToBuffer } from './bufferUtils.ts'
import { validateCMSSignature } from './crypto.ts'

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
		key,
		metadataKey,
	)
	return bufferToBase64(new Uint8Array(encryptedKey))
}

/**
 * Validates the signature of the given metadata using the provided root metadata.
 *
 * @param metadata - The metadata to validate
 * @param signature - The base64-encoded signature of the metadata
 * @param rootMetadata - The root metadata
 */
export async function validateMetadataSignature(metadata: IRawRootMetadata, signature: string, rootMetadata: IRawRootMetadata): Promise<true> {
	const signedData = stringify(metadata, (key, value) => {
		if (key === 'filedrop') {
			return undefined
		}
		return value
	})!

	const verificationResult = await validateCMSSignature(
		stringToBuffer(btoa(signedData)),
		base64ToBuffer(signature),
		rootMetadata.users,
	)

	if (!verificationResult) {
		throw new Error('Metadata signature verification failed')
	}

	return verificationResult
}
