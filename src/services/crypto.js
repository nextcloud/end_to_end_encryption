/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import * as x509 from '@peculiar/x509'
import { bufferToBase64 } from './filedrop.js'
import logger from './logger.ts'

/**
 * Gets tag from encrypted data
 *
 * @param {ArrayBuffer} encrypted Encrypted data
 * @return {ArrayBuffer}
 */
function getTag(encrypted) {
	return encrypted.slice(encrypted.byteLength - 16)
}

/**
 * @return {Promise<CryptoKey>}
 */
export async function getRandomAESKey() {
	return await window.crypto.subtle.generateKey(
		{
			name: 'AES-GCM',
			length: 128,
		},
		true,
		['encrypt', 'decrypt'],
	)
}

/**
 * @typedef {object} EncryptionParams
 * @property {CryptoKey} key - Encryption key of the file (ex: "jtboLmgGR1OQf2uneqCVHpklQLlIwWL5TXAQ0keK")
 * @property {Uint8Array} initializationVector - Mimetype, if unknown use "application/octet-stream" (ex: "plain/text")
 */

/**
 * @return {Promise<EncryptionParams>}
 */
export async function getRandomEncryptionParams() {
	return {
		key: await getRandomAESKey(),
		initializationVector: window.crypto.getRandomValues(new Uint8Array(16)),
	}
}

/**
 * Encrypt file content
 *
 * @param {EncryptionParams} encryptionData
 * @param {Uint8Array} content
 * @return {Promise<{content: ArrayBuffer, tag: ArrayBuffer}>}
 */
export async function encryptWithAES({ key, initializationVector }, content) {
	const encrypted = await window.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv: initializationVector },
		key,
		content,
	)

	return {
		content: encrypted,
		tag: getTag(encrypted),
	}
}

/**
 * @typedef {object} FileEncryptionInfo
 * @property {string} filename - Original file name (ex: "/foo/test.txt")
 * @property {string} mimetype - Mimetype, if unknown use "application/octet-stream" (ex: "plain/text")
 * @property {string} key - Encryption key of the file (ex: "jtboLmgGR1OQf2uneqCVHpklQLlIwWL5TXAQ0keK")
 * @property {string} nonce - Initialisation vector
 * @property {string} authenticationTag - Authentication tag of the file (ex: "LYRaJghbZUzBiNWb51ypWw==")
 */

/**
 * Encrypt file content
 *
 * @param {File} file
 * @return {Promise<{encryptedFileContent: ArrayBuffer, encryptionInfo: FileEncryptionInfo}>}
 */
export async function encryptFile(file) {
	const blob = await file.arrayBuffer()
	const encryptionParams = await getRandomEncryptionParams()
	const { content, tag } = await encryptWithAES(encryptionParams, new Uint8Array(blob))
	logger.debug(`[FileDrop] File encrypted: ${file.name}`, { file, content, tag, encryptionParams, rawKey: bufferToBase64(await window.crypto.subtle.exportKey('raw', encryptionParams.key)) })

	return {
		encryptedFileContent: content,
		encryptionInfo: {
			filename: file.name,
			mimetype: file.type || 'application/octet-stream',
			nonce: bufferToBase64(encryptionParams.initializationVector),
			key: bufferToBase64(await window.crypto.subtle.exportKey('raw', encryptionParams.key)),
			authenticationTag: bufferToBase64(tag),
		},
	}
}

/**
 *
 * @param {string} pem
 * @return {Promise<CryptoKey>}
 */
async function importPublicKey(pem) {
	// fetch the part of the PEM string between header and footer
	const cert = new x509.X509Certificate(pem)

	return await window.crypto.subtle.importKey(
		'spki',
		cert.publicKey.rawData,
		{
			name: 'RSA-OAEP',
			hash: 'SHA-256',
		},
		true,
		['encrypt'],
	)
}

/**
 * @param {string} publicKey
 * @param {BufferSource} buffer
 * @return {Promise<ArrayBuffer>}
 */
export async function encryptStringAsymmetric(publicKey, buffer) {
	return await window.crypto.subtle.encrypt(
		{ name: 'RSA-OAEP' },
		await importPublicKey(publicKey),
		buffer,
	)
}
