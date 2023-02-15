// SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { v4 as uuidv4 } from 'uuid'
import * as x509 from '@peculiar/x509'

/**
 * Gets tag from encrypted data
 *
 * @param {ArrayBuffer} encrypted Encrypted data
 * @return {ArrayBuffer}
 */
function getTag(encrypted) {
	return encrypted.slice(encrypted.byteLength - ((128 + 7) >> 3))
}

class EncryptedFile {

	/**
	 * @param {string} fileName
	 * @param {string} mimetype
	 */
	constructor(fileName, mimetype) {
		this.encryptedFileName = uuidv4().replaceAll('-', '')
		this.initializationVector = window.crypto.getRandomValues(new Uint8Array(16))
		this.fileVersion = 1
		this.metadataKey = 1
		this.originalFileName = fileName
		this.mimetype = mimetype
		if (this.mimetype === 'inode/directory') {
			this.mimetype = 'httpd/unix-directory'
		}
		this.encryptionKey = null
	}

	/**
	 * Encrypt file content
	 *
	 * @param {Uint8Array} content
	 * @return {Promise<{content: ArrayBuffer, tag: ArrayBuffer}>}
	 */
	async encrypt(content) {
		const encrypted = await window.crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv: this.initializationVector,
			},
			await this.getEncryptionKey(),
			content
		)

		return {
			content: encrypted,
			tag: getTag(encrypted),
		}
	}

	/**
	 * @return {Promise<CryptoKey>}
	 */
	async getEncryptionKey() {
		if (this.encryptionKey === null) {
			this.encryptionKey = await window.crypto.subtle.generateKey(
				{
					name: 'AES-GCM',
					length: 128,
				},
				true,
				['encrypt', 'decrypt']
			)
		}

		return this.encryptionKey
	}

	/**
	 * Encrypt file content
	 *
	 * @param {Uint8Array} content
	 * @return {Promise<ArrayBuffer>}
	 */
	async decrypt(content) {
		return await window.crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv: this.initializationVector,
			},
			await this.getEncryptionKey(),
			content
		)
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
		['encrypt']
	)
}

/**
 * @param {string} publicKey
 * @param {BufferSource} buffer
 * @return {Promise<ArrayBuffer>}
 */
async function encryptStringAsymmetric(publicKey, buffer) {
	return await window.crypto.subtle.encrypt(
		{ name: 'RSA-OAEP' },
		await importPublicKey(publicKey),
		buffer
	)
}

export {
	EncryptedFile,
	encryptStringAsymmetric,
}
