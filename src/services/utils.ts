/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import { decryptWithAES, encryptWithAES, exportX509Certificate, loadX509Certificate } from './crypto'

export async function encryptPrivateKey(privateKey: CryptoKey, mnemonic: string): Promise<string> {
	// TODO: convert mnemonic to key
	const encryptedPrivateKeyInfo = await encryptWithAES(await exportX509Certificate(privateKey), mnemonic)
	return await `${encryptedPrivateKeyInfo.encryptedContent}|${encryptedPrivateKeyInfo.iv}|${encryptedPrivateKeyInfo.salt}`
}

export async function decryptPrivateKey(encryptedPrivateKeyInfo: string, mnemonic: string): Promise<CryptoKey> {
	const [encryptedPrivateKey, iv, salt] = encryptedPrivateKeyInfo.split('|')

	const rawPrivateKey = await decryptWithAES(
		stringToBuffer(encryptedPrivateKey),
		stringToBuffer(iv),
		salt,
		// TODO: convert mnemonic to key
		mnemonic,
	)

	return loadX509Certificate(rawPrivateKey)
}

export function stringToBuffer(str: string): ArrayBuffer {
	const enc = new TextEncoder()
	return enc.encode(str)
}
