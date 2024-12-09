/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import * as x509 from '@peculiar/x509'

// TODO: What to do with the salt?
export async function encryptWithAES(content: BufferSource, key: CryptoKey) {
	const iv = self.crypto.getRandomValues(new Uint8Array(16))
	const salt = 'TODO'

	const encryptedContent = await self.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		key,
		content,
	)

	return {
		encryptedContent,
		iv,
		salt,
	}
}

// TODO: Check
// TODO: What to do with the salt?
export async function decryptWithAES(content: BufferSource, iv: BufferSource, salt: string, key: CryptoKey) {
	return await self.crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv },
		key,
		content,
	)
}

// TODO: Check
export async function generateX509Certificate(): Promise<CryptoKeyPair> {
	return await self.crypto.subtle.generateKey(
		{
			name: 'RSA-OAEP',
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: 'SHA-256',
		},
		true,
		['encrypt', 'decrypt'],
	)
}

export async function loadX509Certificate(key: ArrayBuffer): Promise<CryptoKey> {
	const certificate = new x509.X509Certificate(key)

	return await self.crypto.subtle.importKey(
		'spki',
		certificate.publicKey.rawData,
		{
			name: 'RSA-OAEP',
			hash: 'SHA-256',
		},
		true,
		['encrypt'],
	)
}

export async function exportX509Certificate(key: CryptoKey): Promise<ArrayBuffer> {
	return await self.crypto.subtle.exportKey('spki', key)
}

// TODO: Implement
export async function validateX09CertificateSignature(publicKey: CryptoKey, serverPublicKey: CryptoKey): Promise<boolean> {
	return true
}
