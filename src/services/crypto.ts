/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import x509 from '@peculiar/x509'

import { bufferToHex } from './utils'

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

export async function loadServerPublicKey(key: Uint8Array): Promise<CryptoKey> {
	return await self.crypto.subtle.importKey(
		'spki',
		key,
		{
			name: 'RSASSA-PKCS1-v1_5',
			hash: 'SHA-256', // TODO: get from server?
		},
		true,
		['verify'],
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
	const hashBuffer = await self.crypto.subtle.digest('SHA-256', buffer)
	return bufferToHex(new Uint8Array(hashBuffer))
}

export async function verifyCertificateSignature(certificate: string, publicKey: CryptoKey): Promise<boolean> {
	let cert = new x509.X509Certificate(certificate)

	const verificationResult = await self.crypto.subtle.verify(
		cert.signatureAlgorithm,
		publicKey,
		cert.signature,
		new Uint8Array(cert.tbs),
	)

	return verificationResult
}
