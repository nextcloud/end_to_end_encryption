/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import * as x509 from '@peculiar/x509'

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

export async function generateCSRAndPrivateKey(userId: string): Promise<{ privateKey: CryptoKey; csr: string }> {
	const keyPair = await crypto.subtle.generateKey(
		{
			name: 'RSASSA-PKCS1-v1_5', // AES 256 GCM
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: { name: 'SHA-256' },
		},
		true,
		[],
	)

	// const csr = await x509.Pkcs10CertificateRequestGenerator.create({
	// 	name: `CN=${userId}`,
	// 	keys: keyPair,
	// 	signingAlgorithm: {
	// 		name: 'RSASSA-PKCS1-v1_5',
	// 		hash: { name: 'SHA-256' },
	// 	},
	// 	// extensions: [
	// 	// 	new x509.KeyUsagesExtension(x509.KeyUsageFlags.digitalSignature | x509.KeyUsageFlags.keyEncipherment),
	// 	// 	await x509.SubjectKeyIdentifierExtension.create(keyPair.publicKey),
	// 	// ],
	// })

	return {
		privateKey: keyPair.privateKey,
		// privateKey: await loadRSAPrivateKey(await exportKey(keyPair.privateKey)),
		csr: '', // csr.toString('base64'),
	}
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

export async function loadRSAPublicKey(key: ArrayBuffer): Promise<CryptoKey> {
	return await self.crypto.subtle.importKey(
		'spki',
		key,
		{
			name: 'RSA-OAEP',
			hash: 'SHA-256',
		},
		true,
		['encrypt'],
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

// TODO: Implement
export async function validateX09CertificateSignature(publicKey: CryptoKey, serverPublicKey: CryptoKey): Promise<boolean> {
	await self.crypto.subtle.verify(
		{
			name: 'RSA-OAEP',
			hash: 'SHA-256',
		},
		serverPublicKey,
		await exportRSAKey(publicKey), // What is the signature?
		await exportRSAKey(publicKey),
	)
	return true
}
