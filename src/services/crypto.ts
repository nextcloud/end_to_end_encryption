/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { bufferToBase64, bufferToHex } from './utils'

/* eslint-disable jsdoc/require-jsdoc */

export async function encryptWithAES(content: BufferSource, key: CryptoKey, options: Partial<AesGcmParams> = {}) {
	const iv = self.crypto.getRandomValues(new Uint8Array(16))

	const encryptedContent = await self.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv, ...options },
		key,
		content,
	)

	return {
		encryptedContent: new Uint8Array(encryptedContent),
		iv,
	}
}

export async function decryptWithAES(content: BufferSource, key: CryptoKey, options: Partial<AesGcmParams> = {}): Promise<ArrayBuffer> {
	return await self.crypto.subtle.decrypt(
		{ name: 'AES-GCM', ...options },
		key,
		content,
	)
}

export async function decryptWithRSA(content: BufferSource, key: CryptoKey): Promise<ArrayBuffer> {
	return await self.crypto.subtle.decrypt(
		{ name: 'RSA-OAEP' },
		key,
		content,
	)
}

export async function loadAESPrivateKey(key: Uint8Array): Promise<CryptoKey> {
	return await self.crypto.subtle.importKey(
		'raw',
		key,
		{
			name: 'AES-GCM',
			length: 128,
		},
		true,
		['decrypt', 'encrypt'],
	)
}

export async function loadRSAPrivateKey(key: Uint8Array): Promise<CryptoKey> {
	return await self.crypto.subtle.importKey(
		'pkcs8',
		key,
		{
			name: 'RSA-OAEP',
			hash: 'SHA-256',
		},
		true,
		['decrypt'],
	)
}

export async function exportRSAKey(key: CryptoKey): Promise<Uint8Array> {
	if (key.type === 'public') {
		return new Uint8Array(await self.crypto.subtle.exportKey('spki', key))
	} else {
		return new Uint8Array(await self.crypto.subtle.exportKey('pkcs8', key))
	}
}

export async function exportAESKey(key: CryptoKey): Promise<Uint8Array> {
	return new Uint8Array(await self.crypto.subtle.exportKey('raw', key))
}

export async function sha256Hash(buffer: Uint8Array): Promise<string> {
	console.log(bufferToBase64(buffer))
	const hashBuffer = await self.crypto.subtle.digest('SHA-256', buffer)
	console.log(bufferToHex(new Uint8Array(hashBuffer)))
	return bufferToHex(new Uint8Array(hashBuffer))
}
