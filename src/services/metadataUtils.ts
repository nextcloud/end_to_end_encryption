/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Metadata, MetadataInfo } from '../models.ts'

import { base64ToBuffer } from './bufferUtils.ts'
import { decryptWithAES, decryptWithRSA, exportAESKey, loadAESPrivateKey, sha256Hash } from './crypto.ts'
import logger from './logger.ts'

/**
 * Decrypts the metadata info using the provided metadata private key.
 *
 * @param metadata - The metadata object
 * @param metadataPrivateKey - The metadata private key
 */
export async function decryptMetadataInfo(metadata: Metadata, metadataPrivateKey: CryptoKey): Promise<MetadataInfo> {
	logger.debug('Decrypting metadata info', { metadata })

	const [encryptedMetadata, iv] = metadata.metadata.ciphertext.split('|')

	const compressedMetadataInfo = await decryptWithAES(
		base64ToBuffer(encryptedMetadata),
		metadataPrivateKey,
		{ iv: base64ToBuffer(iv) },
	)

	const metadataInfo = JSON.parse(await unzipBuffer(compressedMetadataInfo)) as MetadataInfo

	validateKeyChecksums(metadataInfo, metadata)
	await validateMetadataKeyChecksum(metadataInfo, metadataPrivateKey)

	return metadataInfo
}

/**
 * @param metadataInfo - The decrypted metadata info
 * @param metadata - The original metadata object
 */
function validateKeyChecksums(metadataInfo: MetadataInfo, metadata: Metadata): void {
	if (metadataInfo.keyChecksums?.length !== metadata.users?.length) {
		throw new Error('Key checksums length does not match users length')
	}
}

/**
 * @param metadataInfo - The decrypted metadata info
 * @param metadataPrivateKey - The metadata private key
 */
async function validateMetadataKeyChecksum(metadataInfo: MetadataInfo, metadataPrivateKey: CryptoKey): Promise<void> {
	if (metadataInfo.keyChecksums === undefined) {
		return
	}

	const privateKeyBuffer = await exportAESKey(metadataPrivateKey)
	const privateKeyHash = await sha256Hash(privateKeyBuffer)

	if (!metadataInfo.keyChecksums.includes(privateKeyHash)) {
		throw new Error('Key checksum is not in keyChecksums')
	}
}

/**
 * @param buffer - The compressed buffer
 */
async function unzipBuffer(buffer: ArrayBuffer): Promise<string> {
	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(new Uint8Array(buffer))
			controller.close()
		},
	})

	const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'))
	return await new Response(decompressedStream).text()
}

/**
 * Gets the metadata private key for the given user by decrypting it with the user's private key.
 *
 * @param metadata - The metadata object
 * @param userId - The user ID
 * @param privateKey - The user's private key
 */
export async function getMetadataPrivateKey(metadata: Metadata, userId: string, privateKey: CryptoKey): Promise<CryptoKey> {
	logger.debug('Getting metadata private key', { metadata, userId })

	const userInfo = metadata.users?.find((user) => user.userId === userId)

	if (!userInfo) {
		throw new Error('User not found in metadata')
	}

	const encryptedMetadataPrivateKey = base64ToBuffer(userInfo.encryptedMetadataKey)
	const rawMetadataPrivateKey = await decryptWithRSA(encryptedMetadataPrivateKey, privateKey)
	return await loadAESPrivateKey(new Uint8Array(rawMetadataPrivateKey))
}
