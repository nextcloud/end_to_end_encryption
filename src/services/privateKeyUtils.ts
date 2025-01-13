/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import logger from './logger.ts'
import type { PrivateKeyInfo } from '../models.ts'
import { decryptWithAES, loadRSAPrivateKey } from './crypto.ts'
import { bufferToString, pemToBuffer } from './utils.ts'

export async function decryptPrivateKey(privateKeyInfo: PrivateKeyInfo, mnemonic: string): Promise<CryptoKey> {
	logger.debug('Decrypting private key', { privateKeyInfo, mnemonic })

	// We need to support the old mnemonic formats for backwards compatibility
	const mnemonicPrivateKeys = await Promise.all([
		await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt, { hash: 'SHA-256', iterations: 600000 }),
		await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt, { hash: 'SHA-1', iterations: 1024 }),
		await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt, { hash: 'SHA-1', iterations: 600000 }),
	])

	for (const mnemonicPrivateKey of mnemonicPrivateKeys) {
		try {
			const rawPrivateKey = await decryptWithAES(
				privateKeyInfo.encryptedPrivateKey,
				mnemonicPrivateKey,
				{ iv: privateKeyInfo.iv, tagLength: 128 },
			)

			const pemKey = atob(bufferToString(new Uint8Array(rawPrivateKey)))
			return loadRSAPrivateKey(pemToBuffer(pemKey))
		} catch {
		}
	}

	throw new Error('Failed to decrypt private key')
}

async function mnemonicToPrivateKey(mnemonic: string, salt: Uint8Array, params: Partial<Pbkdf2Params>): Promise<CryptoKey> {
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(mnemonic.replaceAll(' ', '')),
		{ name: 'PBKDF2' },
		false,
		['deriveKey'],
	)

	return await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			...params,
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		true,
		['decrypt', 'encrypt'],
	)
}
