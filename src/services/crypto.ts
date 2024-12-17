/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

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

export async function loadAESPrivateKey(key: ArrayBuffer): Promise<CryptoKey> {
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

export async function loadRSAPrivateKey(key: ArrayBuffer): Promise<CryptoKey> {
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
