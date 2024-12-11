/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { PrivateKeyInfo } from '../models'
import { decryptWithAES, encryptWithAES, exportX509Certificate, loadX509Certificate, mnemonicToPrivateKey } from './crypto'

export async function encryptPrivateKey(privateKey: CryptoKey, mnemonic: string): Promise<PrivateKeyInfo> {
	const salt = self.crypto.getRandomValues(new Uint8Array(16))

	const encryptedPrivateKeyInfo = await encryptWithAES(
		await exportX509Certificate(privateKey),
		await mnemonicToPrivateKey(mnemonic, salt),
	)

	return {
		encryptedPrivateKey: encryptedPrivateKeyInfo.encryptedContent,
		iv: encryptedPrivateKeyInfo.iv,
		salt,
	}
}

export async function decryptPrivateKey(privateKeyInfo: PrivateKeyInfo, mnemonic: string): Promise<CryptoKey> {
	const rawPrivateKey = await decryptWithAES(
		privateKeyInfo.encryptedPrivateKey,
		privateKeyInfo.iv,
		await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt),
	)

	return loadX509Certificate(rawPrivateKey)
}

export function stringToBuffer(str: string): ArrayBuffer {
	const enc = new TextEncoder()
	return enc.encode(str)
}

export function base64ToBuffer(base64Str: string): ArrayBuffer {
	return stringToBuffer(atob(base64Str))
}

export function bufferToBase64(buffer: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}
