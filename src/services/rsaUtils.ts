/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Encrypts content using RSA-OAEP encryption algorithm
 *
 * @param content - The content to encrypt
 * @param key - The RSA public key to use for encryption
 */
export async function encryptWithRSA(content: BufferSource, key: CryptoKey): Promise<Uint8Array<ArrayBuffer>> {
	const data = await globalThis.crypto.subtle.encrypt(
		{
			name: 'RSA-OAEP',
		},
		await ensureKeyUsage(key, 'encrypt'),
		content,
	)
	return new Uint8Array(data)
}

/**
 * Decrypts content using RSA-OAEP decryption algorithm
 *
 * @param content - The encrypted content to decrypt
 * @param key - The RSA private key to use for decryption
 */
export async function decryptWithRSA(content: BufferSource, key: CryptoKey): Promise<Uint8Array<ArrayBuffer>> {
	const data = await self.crypto.subtle.decrypt(
		{ name: 'RSA-OAEP' },
		await ensureKeyUsage(key, 'decrypt'),
		content,
	)
	return new Uint8Array(data)
}

/**
 * Hack to allow signing and encryption with one RSA key
 * (reason is that its not recommended for RSA to use the same key for both signing and encryption)
 *
 * @param key - The key
 * @param usage - The intended usage of the key
 */
export async function ensureKeyUsage(key: CryptoKey, usage: 'decrypt' | 'encrypt' | 'sign' | 'verify'): Promise<CryptoKey> {
	// check if already has the intended usage
	if (key.usages.includes(usage)) {
		return key
	}

	// we can only convert between private and public keys
	if ((usage === 'sign' && !key.usages.includes('decrypt'))
		|| (usage === 'verify' && !key.usages.includes('encrypt'))
		|| (usage === 'encrypt' && !key.usages.includes('verify'))
		|| (usage === 'decrypt' && !key.usages.includes('sign'))
	) {
		throw new Error('Cannot convert private key to public key and vice versa')
	}

	// export the key to JWK and adjust the key_ops
	const jwk = await globalThis.crypto.subtle.exportKey('jwk', key)
	jwk.key_ops = [usage]
	let name: string
	// adjust the algorithm
	if (usage === 'sign' || usage === 'verify') {
		name = 'RSASSA-PKCS1-v1_5'
		jwk.alg = 'RS256'
	} else {
		name = 'RSA-OAEP'
		jwk.alg = 'RSA-OAEP-256'
	}

	// import the key again with the new usage
	return await globalThis.crypto.subtle.importKey(
		'jwk',
		jwk,
		{ name, hash: 'SHA-256' },
		true,
		[usage],
	)
}
