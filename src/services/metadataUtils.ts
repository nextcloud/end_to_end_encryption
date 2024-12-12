/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Metadata } from '../models'
import { decryptWithAES, decryptWithRSA, loadAESPrivateKey } from './crypto.ts'
import { base64ToBuffer } from './utils'

/* eslint-disable jsdoc/require-jsdoc */

export async function decryptMetadataInfo(metadata: Metadata, userId: string, privateKey: CryptoKey) {
	const [encryptedMetadata, iv] = metadata.metadata.ciphertext.split('|')

	const compressedMetadataInfo = await decryptWithAES(
		base64ToBuffer(encryptedMetadata),
		await getMetadataPrivateKey(metadata, userId, privateKey),
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

async function getMetadataPrivateKey(metadata: Metadata, userId: string, privateKey: CryptoKey): Promise<CryptoKey> {
	const userInfo = metadata.users.find(user => user.userId === userId)

	if (!userInfo) {
		throw new Error('User not found in metadata')
	}

	const encryptedMetadataPrivateKey = base64ToBuffer(userInfo.encryptedMetadataKey)
	const rawMetadataPrivateKey = await decryptWithRSA(encryptedMetadataPrivateKey, privateKey)
	return await loadAESPrivateKey(rawMetadataPrivateKey)
}
