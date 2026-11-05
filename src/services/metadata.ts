/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { X509Certificate } from '@peculiar/x509'
import type { IMetadata, IRawMetadata, IRawMetadataUser, IRawRootMetadata } from '../models/metadata.d.ts'
import type { IStoreMetadata } from '../store/metadata.ts'

import stringify from 'safe-stable-stringify'
import * as api from './api.ts'
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
 * Decrypt the metadata key of the given root metadata for a user.
 *
 * @param json - The raw root metadata
 * @param userId - The user to decrypt the metadata key for
 * @param privateKey - The private key of that user
 * @return The raw metadata key
 * @throws {Error} If the user has no access to the metadata
 */
export async function decryptMetadataKey(json: IRawRootMetadata, userId: string, privateKey: CryptoKey): Promise<Uint8Array<ArrayBuffer>> {
	const userEntry = json.users.find((u) => u.userId === userId)
	if (!userEntry) {
		throw new Error('Current user has no access to this folder')
	}

	const decryptionKey = await ensureKeyUsage(privateKey, 'decrypt')
	const metadataKey = await globalThis.crypto.subtle.decrypt(
		{ name: 'RSA-OAEP' },
		decryptionKey,
		base64ToBuffer(userEntry.encryptedMetadataKey),
	)
	return new Uint8Array(metadataKey)
}

/**
 * Import a raw metadata key for usage with the metadata.
 *
 * @param metadataKey - The raw metadata key
 */
export async function importMetadataKey(metadataKey: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
	return await globalThis.crypto.subtle.importKey(
		'raw',
		metadataKey,
		{ name: 'AES-GCM', length: 128 },
		false,
		['decrypt', 'encrypt'],
	)
}

/**
 * Decrypt the metadata from the given raw json using the provided metadata key
 *
 * @param json - The raw json
 * @param metadataKey - The metadata key used to encrypt it
 */
export async function decryptMetadata(json: IRawMetadata, metadataKey: CryptoKey): Promise<IMetadata> {
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
	const result = await validateCMSSignature(
		getMetadataSignedData(metadata),
		base64ToBuffer(signature),
		users,
	)
	if (!result) {
		throw new Error('Metadata signature verification failed')
	}
}

/**
 * Get the data the signature of the given metadata is created over.
 *
 * @param metadata - The raw metadata
 */
export function getMetadataSignedData(metadata: Partial<IRawMetadata>): Uint8Array<ArrayBuffer> {
	const signedData = stringify(metadata, (key, value) => {
		if (key === 'filedrop') {
			return undefined
		}
		return value
	})!

	return stringToBuffer(bufferToBase64(stringToBuffer(signedData)))
}

/**
 * Re-encrypt all subfolders with the new metadata key
 *
 * @param subfolders - The subfolders to re-encrypt
 * @param key - The new metadata key
 * @param certificate - The user certificate
 * @param token - The lock token for the root folder
 */
export async function reencryptSubfolders(subfolders: IStoreMetadata[], key: CryptoKey, certificate: X509Certificate, token: string) {
	for (const { metadata, id } of subfolders) {
		metadata.key = key
		const { metadata: rawMetadata, signature } = await metadata.export(certificate)
		await api.updateMetadata(id, stringify(rawMetadata), token, signature)
	}
}
