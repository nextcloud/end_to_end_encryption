/*!
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import { getCapabilities } from '@nextcloud/capabilities'
import { getClient, getRemoteURL, getRootPath } from '@nextcloud/files/dav'
import { join } from '@nextcloud/paths'
import { getSharingToken } from '@nextcloud/sharing/public'
import { FileDropEntry } from '../models/FileDropEntry.ts'
import * as api from './api.ts'
import { bufferToBase64 } from './bufferUtils.ts'
import { encryptWithAES, exportAESKey, generateAESKey } from './crypto.ts'
import { generateUuid } from './uuid.ts'

const client = getClient(getRemoteURL())

/**
 * Upload a file to a public share as a file drop.
 *
 * @param unencryptedFile - The file to upload
 * @param fileId - The fileid of the e2ee root folder to add the file drop entry to
 * @param shareToken - The share token of the public share to upload the file to
 * @param users - Mapping of user IDs to their public keys to encrypt the file drop entry for
 */
export async function uploadFileDrop(unencryptedFile: File, fileId: string, shareToken: string, users: { userId: string, key: CryptoKey }[]): Promise<void> {
	const key = await generateAESKey()
	const encryptedFileName = generateUuid()

	const encryptedFileData = await handleUpload(encryptedFileName, unencryptedFile, key)
	const keyData = await exportAESKey(key)

	const fileDropEntry = new FileDropEntry({
		filename: unencryptedFile.name,
		mimetype: unencryptedFile.type,
		authenticationTag: encryptedFileData.tag,
		nonce: encryptedFileData.iv,
		key: bufferToBase64(keyData),
		// EXPERIMENTAL
		chunked: encryptedFileData.chunked ? true : undefined,
		filesize: unencryptedFile.size,
	})

	const rawEntry = await fileDropEntry.export(users)
	await api.addFileDrop({ [encryptedFileName]: rawEntry }, fileId, shareToken)
}

/**
 * Handle the upload of the file-drop file.
 *
 * @param encryptedFileName - The name to use for the encrypted file on the server
 * @param source - The unencrypted file to upload
 * @param key - The AES key to encrypt the file with
 */
async function handleUpload(encryptedFileName: string, source: File, key: CryptoKey): Promise<{ iv: string, tag: string, chunked: boolean }> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const supportChunking = (getCapabilities() as any).end_to_end_encryption?.supports_chunking === true
	if (supportChunking && source.size > 10 * 1024 * 1024) {
		await handleChunkedUpload(encryptedFileName, source, key)
		return {
			iv: '',
			tag: '',
			chunked: true,
		}
	} else {
		const buffer = await source.arrayBuffer()
		const encryptedFileData = await encryptWithAES(buffer, key)
		await client.putFileContents(
			join(getRootPath(), encryptedFileName),
			encryptedFileData.encryptedContent.buffer,
		)
		return {
			iv: bufferToBase64(encryptedFileData.iv),
			tag: bufferToBase64(encryptedFileData.tag),
			chunked: false,
		}
	}
}

/**
 * Handle the upload of a file in chunks.
 *
 * @param encryptedFileName - The name to use for the encrypted file on the server
 * @param source - The unencrypted file to upload
 * @param key - The AES key to encrypt the file with
 */
async function handleChunkedUpload(encryptedFileName: string, source: File, key: CryptoKey): Promise<void> {
	const CHUNKED_HEADER_VERSION = 1
	const CHUNKED_HEADER_SIZE = 37 // 4 byte magic + 1 byte version + 4 byte length + 12 byte IV + 16 byte tag
	const CHUNKED_HEADER = new Uint8Array([0x65, 0x32, 0x65, 0x65, CHUNKED_HEADER_VERSION]) // "e2ee" + version

	const numberOfChunks = Math.min(999, Math.ceil(source.size / (10 * 1024 * 1024))) // max 999 chunks, but better 10MB slices
	const rootPath = join(`/uploads/${getSharingToken()}`, encryptedFileName)

	// create the upload root
	await client.createDirectory(rootPath)
	for (let i = 0; i < numberOfChunks; i++) {
		const chunkBlob = source.slice(i * source.size / numberOfChunks, (i + 1) * source.size / numberOfChunks)
		const chunkBuffer = await chunkBlob.arrayBuffer()
		const encryptedChunkData = await encryptWithAES(chunkBuffer, key)

		// we remove the tag from the end of the encrypted content
		const encryptedLength = encryptedChunkData.encryptedContent.byteLength - encryptedChunkData.tag.byteLength

		const dataWithHeader = new Uint8Array(encryptedLength + CHUNKED_HEADER_SIZE)
		dataWithHeader.set(CHUNKED_HEADER, 0)
		const lengthView = new DataView(dataWithHeader.buffer, CHUNKED_HEADER.byteLength, 4) // 4 bytes for the length after the header
		lengthView.setUint32(0, encryptedLength, false) // big endian
		dataWithHeader.set(encryptedChunkData.iv, CHUNKED_HEADER.byteLength + lengthView.byteLength)
		dataWithHeader.set(encryptedChunkData.tag, CHUNKED_HEADER.byteLength + lengthView.byteLength + encryptedChunkData.iv.byteLength)
		dataWithHeader.set(encryptedChunkData.encryptedContent.slice(0, encryptedLength), CHUNKED_HEADER_SIZE)

		await client.putFileContents(join(rootPath, String(i)), dataWithHeader.buffer)
	}
	// assemble
	await client.moveFile(join(rootPath, '.file'), join(getRootPath(), encryptedFileName))
}
