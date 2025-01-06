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

	const mnemonicPrivateKey = await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt)

	const rawPrivateKey = await decryptWithAES(
		privateKeyInfo.encryptedPrivateKey,
		mnemonicPrivateKey,
		{ iv: privateKeyInfo.iv, tagLength: 128 },
	)

	const pemKey = atob(bufferToString(new Uint8Array(rawPrivateKey)))
	return loadRSAPrivateKey(pemToBuffer(pemKey))
}

async function mnemonicToPrivateKey(mnemonic: string, salt: Uint8Array): Promise<CryptoKey> {
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
			hash: 'SHA-1', // TODO: Futur - 'SHA-256'
			iterations: 1024, // TODO: Futur - 600000
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		true,
		['decrypt', 'encrypt'],
	)
}
