/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IMetadataFile, IRawMetadataFileDrop } from './metadata.d.ts'

import { describe, expect, test } from 'vitest'
import * as Alice from '../../__tests__/fixtures/Alice.spec.ts'
import { base64ToBuffer, bufferToBase64 } from '../services/bufferUtils.ts'
import { compress, uncompress } from '../services/compression.ts'
import { decryptWithAES, encryptWithAES, generateAESKey, loadAESPrivateKey } from '../services/crypto.ts'
import { decryptWithRSA, encryptWithRSA } from '../services/rsaUtils.ts'
import { FileDropEntry } from './FileDropEntry.ts'

const FILENAMES = ['Prüfung.txt', 'Grüße 😀 日本語.txt']

describe('FileDropEntry', () => {
	test.for(FILENAMES)('"%s" survives an export and import', async (filename) => {
		const exported = await new FileDropEntry(fileInfo(filename)).export([await alice()])

		const imported = await FileDropEntry.fromJson(exported, Alice.userId, await alicePrivateKey())
		expect(imported.getFile()).toEqual(fileInfo(filename))
	})

	test.for(FILENAMES)('"%s" is exported as UTF-8', async (filename) => {
		const exported = await new FileDropEntry(fileInfo(filename)).export([await alice()])

		// the server and the other clients read the entry as UTF-8
		const json = new TextDecoder('utf-8', { fatal: true }).decode(await decryptEntry(exported))
		expect(JSON.parse(json)).toEqual(fileInfo(filename))
	})

	test('entries written as Latin-1 by older versions can be imported', async () => {
		const json = JSON.stringify(fileInfo('Prüfung.txt'))
		const entry = await encryptEntry(Uint8Array.from(json, (char) => char.charCodeAt(0)))

		const imported = await FileDropEntry.fromJson(entry, Alice.userId, await alicePrivateKey())
		expect(imported.getFile().filename).toBe('Prüfung.txt')
	})
})

/**
 * @param filename - Name of the dropped file
 */
function fileInfo(filename: string): IMetadataFile {
	return {
		filename,
		mimetype: 'text/plain',
		nonce: 'bm9uY2U=',
		authenticationTag: 'dGFn',
		key: 'a2V5',
	}
}

/**
 * Alice as a recipient of file drop entries.
 */
async function alice() {
	return { userId: Alice.userId, key: await Alice.certificate.publicKey.export() }
}

function alicePrivateKey(): Promise<CryptoKey> {
	return globalThis.crypto.subtle.importKey('jwk', Alice.privateKey, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt'])
}

/**
 * Decrypt a file drop entry for Alice into the uncompressed JSON bytes.
 *
 * @param entry - The exported file drop entry
 */
async function decryptEntry(entry: IRawMetadataFileDrop): Promise<Uint8Array> {
	const keyData = await decryptWithRSA(base64ToBuffer(entry.users[0]!.encryptedFiledropKey), await alicePrivateKey())
	const compressed = await decryptWithAES(
		base64ToBuffer(entry.ciphertext),
		await loadAESPrivateKey(keyData),
		{ iv: base64ToBuffer(entry.nonce) },
	)
	return await uncompress(new Uint8Array(compressed))
}

/**
 * Encrypt the given JSON bytes into a file drop entry for Alice.
 *
 * @param json - The uncompressed JSON bytes
 */
async function encryptEntry(json: Uint8Array<ArrayBuffer>): Promise<IRawMetadataFileDrop> {
	const key = await generateAESKey()
	const { encryptedContent, iv, tag } = await encryptWithAES(await compress(json), key)
	const keyData = await globalThis.crypto.subtle.exportKey('raw', key)
	const { key: publicKey } = await alice()
	return {
		ciphertext: bufferToBase64(encryptedContent),
		nonce: bufferToBase64(iv),
		authenticationTag: bufferToBase64(tag),
		users: [{ userId: Alice.userId, encryptedFiledropKey: bufferToBase64(await encryptWithRSA(keyData, publicKey)) }],
	}
}
