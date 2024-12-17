/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Metadata, MetadataInfo } from '../models'
import logger from './logger.ts'
import { getMetadata } from './api'
import { base64ToBuffer } from './utils'
import { decryptWithAES, decryptWithRSA, loadAESPrivateKey } from './crypto.ts'

/* eslint-disable jsdoc/require-jsdoc */

export async function getMetadataInfo(fileId: string, metadataPrivateKey: CryptoKey): Promise<MetadataInfo> {
	logger.debug('Getting metadata info', { fileId })
	return await decryptMetadataInfo(await getMetadata(fileId), metadataPrivateKey)
}

export async function decryptMetadataInfo(metadata: Metadata, metadataPrivateKey: CryptoKey): Promise<MetadataInfo> {
	logger.debug('Decrypting metadata info', { metadata })

	const [encryptedMetadata, iv] = metadata.metadata.ciphertext.split('|')

	const compressedMetadataInfo = await decryptWithAES(
		base64ToBuffer(encryptedMetadata),
		metadataPrivateKey,
		{ iv: base64ToBuffer(iv) },
	)

	return JSON.parse(await unzipBuffer(compressedMetadataInfo))
}

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

export async function getMetadataPrivateKey(metadata: Metadata, userId: string, privateKey: CryptoKey): Promise<CryptoKey> {
	logger.debug('Getting metadata private key', { metadata, userId })

	const userInfo = metadata.users?.find(user => user.userId === userId)

	if (!userInfo) {
		throw new Error('User not found in metadata')
	}

	const encryptedMetadataPrivateKey = base64ToBuffer(userInfo.encryptedMetadataKey)
	const rawMetadataPrivateKey = await decryptWithRSA(encryptedMetadataPrivateKey, privateKey)
	return await loadAESPrivateKey(rawMetadataPrivateKey)
}
