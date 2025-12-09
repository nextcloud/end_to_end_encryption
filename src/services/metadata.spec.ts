/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IRawMetadata, IRawRootMetadata } from '../models/metadata.d.ts'

import { describe, expect, test } from 'vitest'
import { adminMnemonic, adminPrivateKeyInfo, rootFolderMetadata, rootFolderMetadataInfo, rootFolderMetadataSignature, subFolderMetadataSignature } from '../../__tests__/consts.spec.ts'
import { base64ToBuffer } from './bufferUtils.ts'
import { decryptWithRSA } from './crypto.ts'
import { decryptMetadata, isRootMetadata, validateMetadataSignature } from './metadata.ts'
import { decryptPrivateKey } from './privateKeyUtils.ts'

const folderMetadata: IRawMetadata = {
	metadata: {
		ciphertext: 'ciphertext',
		nonce: 'nonce',
		authenticationTag: 'authenticationTag',
	},
	version: '2.0',
}

const rootMetadata: IRawRootMetadata = {
	...folderMetadata,
	users: [],
}

describe('isRootMetadata', () => {
	test('check root metadata', () => {
		expect(isRootMetadata(rootMetadata)).toBe(true)
	})

	test('check subfolder metadata', () => {
		expect(isRootMetadata(folderMetadata)).toBe(false)
	})
})

describe('decryptMetadata', () => {
	test('Decrypt metadata', async () => {
		const key = await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic)
		const metadataEntry = rootFolderMetadata.users.find(({ userId }) => userId === 'admin')!.encryptedMetadataKey
		const metadataKeyData = await decryptWithRSA(base64ToBuffer(metadataEntry), key)
		const metadataKey = await globalThis.crypto.subtle.importKey(
			'raw',
			metadataKeyData,
			{ name: 'AES-GCM', length: 128 },
			false,
			['decrypt', 'encrypt'],
		)
		expect(await decryptMetadata(rootFolderMetadata, metadataKey)).toEqual(rootFolderMetadataInfo)
	})

	test('Cannot decrypt old metadata', async () => {
		const key = await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic)
		const metadataEntry = rootFolderMetadata.users.find(({ userId }) => userId === 'admin')!.encryptedMetadataKey
		const metadataKeyData = await decryptWithRSA(base64ToBuffer(metadataEntry), key)
		const metadataKey = await globalThis.crypto.subtle.importKey(
			'raw',
			metadataKeyData,
			{ name: 'AES-GCM', length: 128 },
			false,
			['decrypt', 'encrypt'],
		)
		await expect(decryptMetadata({ ...rootFolderMetadata, version: '1.0' }, metadataKey)).rejects.toThrow('Unsupported metadata version: 1.0')
	})
})

describe('validateMetadataSignature', () => {
	test('Metadata validation works with a valid signature', async () => {
		await expect(validateMetadataSignature(rootFolderMetadata, rootFolderMetadataSignature, rootFolderMetadata.users)).resolves.not.toThrow()
	})

	test('Metadata validation ignores filedrop key', async () => {
		const metadata: IRawRootMetadata = {
			...rootFolderMetadata,
			metadata: {
				...rootFolderMetadata.metadata,
				authenticationTag: rootFolderMetadata.metadata.authenticationTag,
			},
			filedrop: {
				a869665765fe: {
					authenticationTag: 'someTag',
					ciphertext: 'someCiphertext',
					nonce: 'someNonce',
					users: [],
				},
			},
		}
		await expect(validateMetadataSignature(metadata, rootFolderMetadataSignature, rootFolderMetadata.users)).resolves.not.toThrow()
	})

	// see also https://github.com/nextcloud/end_to_end_encryption_rfc/issues/66
	test('Metadata validation works with a valid signature and unordered metadata', async () => {
		const metadata = {
			...rootFolderMetadata,
			metadata: {
				...rootFolderMetadata.metadata,
				authenticationTag: rootFolderMetadata.metadata.authenticationTag,
			},
		}
		await expect(validateMetadataSignature(metadata, rootFolderMetadataSignature, rootFolderMetadata.users)).resolves.not.toThrow()
	})

	test('Metadata validation throws with a truncated signature', async () => {
		const badSignature = rootFolderMetadataSignature.slice(0, -1)
		await expect(validateMetadataSignature(rootFolderMetadata, badSignature, rootFolderMetadata.users)).rejects.toThrow()
	})

	test('Metadata validation throws with a tempered signature', async () => {
		const badSignature = rootFolderMetadataSignature.replace('a', 'b')
		await expect(validateMetadataSignature(rootFolderMetadata, badSignature, rootFolderMetadata.users)).rejects.toThrow()
	})

	test('Metadata validation throws with a wrong signature', async () => {
		await expect(validateMetadataSignature(rootFolderMetadata, subFolderMetadataSignature, rootFolderMetadata.users)).rejects.toThrow()
	})

	test('Metadata validation throws with a tempered metadata', async () => {
		(rootFolderMetadata as any).version = '1.0'
		await expect(validateMetadataSignature(rootFolderMetadata, rootFolderMetadataSignature, rootFolderMetadata.users)).rejects.toThrow()
	})
})
