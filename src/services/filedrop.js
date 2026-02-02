/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { encryptStringAsymmetric, encryptWithAES, getRandomEncryptionParams } from './crypto.js'
import logger from './logger.ts'

/**
 * @typedef {object} FileMetadata
 * @property {string} filename - Original file name (ex: "/foo/test.txt")
 * @property {string} mimetype - Mimetype, if unknown use "application/octet-stream" (ex: "plain/text")
 * @property {string} key - Encryption key of the file (ex: "jtboLmgGR1OQf2uneqCVHpklQLlIwWL5TXAQ0keK")
 * @property {string} nonce - Initialisation vector
 * @property {string} authenticationTag - Authentication tag of the file (ex: "LYRaJghbZUzBiNWb51ypWw==")
 */

/**
 * @typedef {object} UserEncryptionInformation
 * @property {string } userId - The user ID of the user
 * @property {string } encryptedFiledropKey - The base64-encoded encrypted file drop key for the user
 */

/**
 * @typedef {object} FileDropPayload
 * @property {string } ciphertext - The base64-encoded encrypted file metadata
 * @property {string } nonce - The base64-encoded nonce used for encryption
 * @property {string } authenticationTag - The base64-encoded authentication tag
 * @property {UserEncryptionInformation[]} users - The encrypted file drop keys for each user
 */

/**
 * @param {ArrayBuffer} buffer - The buffer to convert
 * @return {string}
 */
export function bufferToBase64(buffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

/**
 * @param {import('./crypto.js').FileEncryptionInfo} encryptionInfo - The encryption information of the file
 * @param {{[userId: string]: string}} publicKeys - Mapping of user IDs to their public keys
 * @return {Promise<FileDropPayload>}
 */
export async function getFileDropEntry(encryptionInfo, publicKeys) {
	const compressedEncryptionInfo = await compress(JSON.stringify(encryptionInfo))
	logger.debug(`[FileDrop] Encryption info compressed (${encryptionInfo.filename})`, { encryptionInfo, compressedEncryptionInfo })

	const encryptionParams = await getRandomEncryptionParams()
	const { content, tag } = await encryptWithAES(
		encryptionParams,
		new Uint8Array(compressedEncryptionInfo),
	)
	logger.debug(`[FileDrop] Encryption info encrypted (${encryptionInfo.filename})`, { content, tag, encryptionParams })
	logger.debug(`[FileDrop] Encryption info base64ed (${encryptionInfo.filename})`, { ciphertext: bufferToBase64(content) })

	return {
		ciphertext: bufferToBase64(content),
		nonce: bufferToBase64(encryptionParams.initializationVector),
		authenticationTag: bufferToBase64(tag),
		users: await encryptRandomKeyForUsers(publicKeys, encryptionParams),
	}
}

/**
 * @param {1|2} encryptionVersion - The encrypted version for the folder
 * @param {number} folderId - The folder ID to upload the file drop to
 * @param {{[uid: string]: FileDropPayload}} fileDrops - The file drop entries to upload
 * @param {string} shareToken - The share token for authentication
 * @return {Promise<{[uid: string]: FileDropPayload}>}
 */
export async function uploadFileDrop(encryptionVersion, folderId, fileDrops, shareToken) {
	const ocsUrl = generateOcsUrl(
		'apps/end_to_end_encryption/api/v{encryptionVersion}/meta-data/{folderId}',
		{
			encryptionVersion,
			folderId,
		},
	)

	const response = await axios.put(
		`${ocsUrl}/filedrop`,
		{
			filedrop: JSON.stringify(fileDrops),
		},
		{
			headers: {
				'x-e2ee-supported': true,
			},
			params: {
				shareToken,
			},
		},
	)

	if (response.data.ocs.meta.statuscode !== 200) {
		throw new Error(`Failed to upload metadata: ${response.data.ocs.meta.message}`)
	}

	return response.data.ocs.data.filedrop
}

/**
 * @param {string} str - The string to compress
 * @return {Promise<ArrayBuffer>}
 */
async function compress(str) {
	const stream = new Blob([str]).stream()
	const compressedStream = stream.pipeThrough(new CompressionStream('gzip'))

	const chunks = []
	const reader = compressedStream.getReader()

	while (true) {
		const { value } = await reader.read()
		if (value === undefined) {
			break
		}
		chunks.push(value)
	}

	return new Uint8Array(await new Blob(chunks).arrayBuffer())
}

/**
 * @param {{[userId: string]: string}} usersPublicKeys - Mapping of user IDs to their public keys
 * @param {import('./crypto.js').EncryptionParams} encryptionParams - The encryption parameters containing the file encryption key
 * @return {Promise<UserEncryptionInformation[]>} - The encrypted file drop keys for each user
 */
async function encryptRandomKeyForUsers(usersPublicKeys, encryptionParams) {
	return Promise.all(Object.entries(usersPublicKeys).map(async ([userId, publicKey]) => {
		const rawKey = await window.crypto.subtle.exportKey('raw', encryptionParams.key)

		const encryptedFileDropKey = await encryptStringAsymmetric(
			publicKey,
			rawKey,
		)

		return { userId, encryptedFiledropKey: bufferToBase64(encryptedFileDropKey) }
	}))
}
