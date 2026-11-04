/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FileStat } from 'webdav'
import type { IMetadataFile, IRawRootMetadata } from '../models/metadata.d.ts'
import type { IInspectMetadataOptions } from './debug.ts'

import { beforeAll, describe, expect, test, vi } from 'vitest'
import * as Alice from '../../__tests__/fixtures/Alice.spec.ts'
import * as Bob from '../../__tests__/fixtures/Bob.spec.ts'
import { FileDropEntry } from '../models/FileDropEntry.ts'
import { Metadata } from '../models/Metadata.ts'
import { RootMetadata } from '../models/RootMetadata.ts'
import * as metadataStore from '../store/metadata.ts'
import * as api from './api.ts'
import { bufferToBase64 } from './bufferUtils.ts'
import { getMetadataVersion, inspectMetadata, loadDebugReport, redactMetadata } from './debug.ts'
import { encryptWithRSA } from './rsaUtils.ts'

vi.mock('@nextcloud/auth', () => ({
	getCurrentUser: () => ({ uid: 'alice' }),
}))
vi.mock('./api.ts', () => ({
	getRawFolderListing: vi.fn(),
}))
vi.mock('../store/keys.ts', () => ({
	getPrivateKey: vi.fn(),
}))
vi.mock('../store/metadata.ts', () => ({
	getRootMetadata: vi.fn(),
}))

const file: IMetadataFile = {
	filename: 'file.txt',
	mimetype: 'text/plain',
	key: 'secret-key',
	nonce: 'secret-nonce',
	authenticationTag: 'secret-tag',
}

let privateKey: CryptoKey
let rootMetadata: RootMetadata
let rawRoot: IRawRootMetadata
let rootSignature: string

beforeAll(async () => {
	privateKey = await importPrivateKey(Alice.privateKey)
	Alice.certificate.privateKey = privateKey

	rootMetadata = await RootMetadata.createNew()
	await rootMetadata.addUser(Alice.userId, Alice.certificate)
	rootMetadata.addFolder('uuid-folder', 'Folder')
	rootMetadata.addFile('uuid-file', file)
	const { metadata, signature } = await rootMetadata.export(Alice.certificate)
	rawRoot = metadata
	rootSignature = signature
})

/**
 * Get options for inspecting the root metadata, by default as Alice with all nodes on the server.
 *
 * @param options - Options to override
 */
function getRootOptions(options: Partial<IInspectMetadataOptions> = {}): IInspectMetadataOptions {
	return {
		rawMetadata: JSON.stringify(rawRoot),
		signature: rootSignature,
		userId: Alice.userId,
		serverNodes: [
			{ name: 'uuid-folder', isFolder: true },
			{ name: 'uuid-file', isFolder: false },
		],
		getPrivateKey: async () => privateKey,
		getRootMetadata: () => Promise.reject(new Error('Not a nested folder')),
		...options,
	}
}

describe('inspectMetadata', () => {
	test('passes all checks for valid root metadata', async () => {
		const report = await inspectMetadata(getRootOptions())

		expect(report.checks).toEqual([
			{ id: 'metadata', status: 'passed' },
			{ id: 'version', status: 'passed' },
			{ id: 'metadataKey', status: 'passed' },
			{ id: 'decrypt', status: 'passed' },
			{ id: 'signature', status: 'passed' },
			{ id: 'keyChecksum', status: 'passed' },
		])
		expect(report.version).toBe('2.0')
		expect(report.isRoot).toBe(true)
		expect(report.counter).toBe(1)
		expect(report.users).toEqual([Alice.userId])
		expect(report.contents).toEqual([
			{ uuid: 'uuid-file', name: 'file.txt', mimetype: 'text/plain', isFolder: false, existsOnServer: true },
			{ uuid: 'uuid-folder', name: 'Folder', mimetype: 'httpd/unix-directory', isFolder: true, existsOnServer: true },
		])
		expect(report.fileDrop).toEqual([])
		expect(report.unknownServerNodes).toEqual([])
	})

	test('compares the metadata with the contents on the server', async () => {
		const report = await inspectMetadata(getRootOptions({
			serverNodes: [
				{ name: 'uuid-file', isFolder: false },
				{ name: 'uuid-unknown', isFolder: false },
				{ name: 'toString', isFolder: true },
			],
		}))

		expect(report.contents.find(({ uuid }) => uuid === 'uuid-folder')?.existsOnServer).toBe(false)
		expect(report.contents.find(({ uuid }) => uuid === 'uuid-file')?.existsOnServer).toBe(true)
		expect(report.unknownServerNodes).toEqual([
			{ name: 'uuid-unknown', isFolder: false },
			{ name: 'toString', isFolder: true },
		])
	})

	test('redacts the secrets of the decrypted metadata', async () => {
		const report = await inspectMetadata(getRootOptions())
		const json = JSON.stringify(report.redactedMetadata)

		expect(json).toContain('"filename":"file.txt"')
		expect(json).toContain('"key":"[redacted]"')
		expect(json).not.toMatch(/secret-(key|nonce|tag)/)
	})

	test('fails without metadata', async () => {
		const report = await inspectMetadata(getRootOptions({ rawMetadata: undefined }))

		expect(report.checks).toEqual([
			{ id: 'metadata', status: 'failed', error: 'No metadata is stored for this folder' },
			{ id: 'version', status: 'skipped' },
			{ id: 'metadataKey', status: 'skipped' },
			{ id: 'decrypt', status: 'skipped' },
			{ id: 'signature', status: 'skipped' },
		])
		expect(report.redactedMetadata).toBeUndefined()
	})

	test('fails for metadata that is not JSON', async () => {
		const report = await inspectMetadata(getRootOptions({ rawMetadata: '{invalid' }))

		expect(report.checks[0]).toMatchObject({ id: 'metadata', status: 'failed' })
		expect(report.checks[0]!.error).toBeTruthy()
	})

	test('reports legacy metadata as unsupported', async () => {
		const report = await inspectMetadata(getRootOptions({
			rawMetadata: JSON.stringify({ metadata: { version: 1.2, metadataKeys: {} }, files: {} }),
		}))

		expect(report.version).toBe('1.2')
		expect(report.checks).toContainEqual({ id: 'version', status: 'failed', error: 'Unsupported metadata version: 1.2' })
		expect(report.checks).toContainEqual({ id: 'decrypt', status: 'skipped' })
	})

	test('fails if the user has no access but still validates the signature', async () => {
		const report = await inspectMetadata(getRootOptions({ userId: Bob.userId }))

		expect(report.checks).toEqual([
			{ id: 'metadata', status: 'passed' },
			{ id: 'version', status: 'passed' },
			{ id: 'metadataKey', status: 'failed', error: 'Current user has no access to this folder' },
			{ id: 'decrypt', status: 'skipped' },
			{ id: 'signature', status: 'passed' },
			{ id: 'keyChecksum', status: 'skipped' },
		])
		expect(report.users).toEqual([Alice.userId])
	})

	test('fails for a signature of other metadata', async () => {
		const other = await RootMetadata.createNew()
		await other.addUser(Alice.userId, Alice.certificate)
		const { signature } = await other.export(Alice.certificate)

		const report = await inspectMetadata(getRootOptions({ signature }))

		expect(report.checks).toContainEqual({ id: 'decrypt', status: 'passed' })
		expect(report.checks.find(({ id }) => id === 'signature')).toMatchObject({
			status: 'failed',
			error: expect.stringContaining('Message digest doesn\'t match'),
		})
	})

	test('fails if the metadata key is not listed in the key checksums', async () => {
		const metadataKey = await globalThis.crypto.subtle.generateKey({ name: 'AES-GCM', length: 128 }, true, ['encrypt', 'decrypt'])
		const { metadata } = await (await Metadata.createNew(metadataKey)).export(Alice.certificate)
		const rawKey = new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', metadataKey))
		const publicKey = await Alice.certificate.publicKey.export()
		const raw: IRawRootMetadata = {
			...metadata,
			users: [{
				userId: Alice.userId,
				certificate: Alice.certificate.toString('pem'),
				encryptedMetadataKey: bufferToBase64(await encryptWithRSA(rawKey, publicKey)),
			}],
		}

		const report = await inspectMetadata(getRootOptions({ rawMetadata: JSON.stringify(raw) }))

		expect(report.checks).toContainEqual({ id: 'decrypt', status: 'passed' })
		expect(report.checks).toContainEqual({ id: 'keyChecksum', status: 'failed', error: 'The checksum of the metadata key is not listed in the metadata' })
	})

	test('inspects nested metadata with the key of the root metadata', async () => {
		const nested = await Metadata.createNew(rootMetadata.key)
		nested.addFile('uuid-nested-file', { ...file, filename: 'nested.txt' })
		const { metadata, signature } = await nested.export(Alice.certificate)

		const report = await inspectMetadata(getRootOptions({
			rawMetadata: JSON.stringify(metadata),
			signature,
			serverNodes: [{ name: 'uuid-nested-file', isFolder: false }],
			getRootMetadata: async () => ({ key: rootMetadata.key, users: rawRoot.users }),
		}))

		expect(report.isRoot).toBe(false)
		expect(report.users).toEqual([Alice.userId])
		expect(report.checks).toEqual([
			{ id: 'metadata', status: 'passed' },
			{ id: 'version', status: 'passed' },
			{ id: 'metadataKey', status: 'passed' },
			{ id: 'decrypt', status: 'passed' },
			{ id: 'signature', status: 'passed' },
		])
		expect(report.contents).toEqual([
			{ uuid: 'uuid-nested-file', name: 'nested.txt', mimetype: 'text/plain', isFolder: false, existsOnServer: true },
		])
	})

	test('fails for nested metadata if the root metadata is not available', async () => {
		const nested = await Metadata.createNew(rootMetadata.key)
		const { metadata, signature } = await nested.export(Alice.certificate)

		const report = await inspectMetadata(getRootOptions({
			rawMetadata: JSON.stringify(metadata),
			signature,
			getRootMetadata: () => Promise.reject(new Error('Metadata signature verification failed')),
		}))

		expect(report.checks).toContainEqual({ id: 'metadataKey', status: 'failed', error: 'Metadata signature verification failed' })
		expect(report.checks).toContainEqual({ id: 'decrypt', status: 'skipped' })
		expect(report.checks).toContainEqual({ id: 'signature', status: 'skipped' })
	})

	test('lists file drop entries', async () => {
		const alicePublicKey = await Alice.certificate.publicKey.export()
		const bobPublicKey = await Bob.certificate.publicKey.export()
		const raw: IRawRootMetadata = {
			...rawRoot,
			filedrop: {
				'uuid-drop': await new FileDropEntry({ ...file, filename: 'dropped.txt' })
					.export([{ userId: Alice.userId, key: alicePublicKey }]),
				'uuid-drop-bob': await new FileDropEntry({ ...file, filename: 'for-bob.txt' })
					.export([{ userId: Bob.userId, key: bobPublicKey }]),
			},
		}

		const report = await inspectMetadata(getRootOptions({
			rawMetadata: JSON.stringify(raw),
			serverNodes: [{ name: 'uuid-drop', isFolder: false }],
		}))

		expect(report.fileDrop).toEqual([
			{ uuid: 'uuid-drop', recipients: [Alice.userId], name: 'dropped.txt', mimetype: 'text/plain', existsOnServer: true },
			{ uuid: 'uuid-drop-bob', recipients: [Bob.userId], error: 'Current user has no access to this file drop', existsOnServer: false },
		])
		// the file drop is not signed
		expect(report.checks).toContainEqual({ id: 'signature', status: 'passed' })
		// file drop entries are not unknown to the metadata
		expect(report.unknownServerNodes).toEqual([])
		expect(JSON.stringify(report.redactedMetadata)).toContain('"filedrop":{"uuid-drop":{')
		expect(JSON.stringify(report.redactedMetadata)).not.toMatch(/secret-(key|nonce|tag)/)
	})
})

describe('loadDebugReport', () => {
	test('inspects the metadata of the folder as stored on the server', async () => {
		vi.mocked(api.getRawFolderListing).mockResolvedValue({
			folder: {
				basename: 'folder',
				type: 'directory',
				props: { 'e2ee-metadata': JSON.stringify(rawRoot), 'e2ee-metadata-signature': rootSignature },
			} as unknown as FileStat,
			contents: [
				{ basename: 'uuid-folder', type: 'directory' },
				{ basename: 'uuid-file', type: 'file' },
			] as FileStat[],
		})
		const keyStore = await import('../store/keys.ts')
		vi.mocked(keyStore.getPrivateKey).mockResolvedValue(privateKey)

		const report = await loadDebugReport('/folder')

		expect(api.getRawFolderListing).toHaveBeenCalledWith('/folder')
		expect(report.checks.every(({ status }) => status === 'passed')).toBe(true)
		expect(report.contents.every(({ existsOnServer }) => existsOnServer)).toBe(true)
		expect(metadataStore.getRootMetadata).not.toHaveBeenCalled()
	})

	test('uses the root metadata of the parent folder for nested folders', async () => {
		const nested = await Metadata.createNew(rootMetadata.key)
		const { metadata, signature } = await nested.export(Alice.certificate)
		vi.mocked(api.getRawFolderListing).mockResolvedValue({
			folder: {
				props: { 'e2ee-metadata': JSON.stringify(metadata), 'e2ee-metadata-signature': signature },
			} as unknown as FileStat,
			contents: [],
		})
		vi.mocked(metadataStore.getRootMetadata).mockResolvedValue(rootMetadata)

		const report = await loadDebugReport('/folder/uuid-folder')

		expect(metadataStore.getRootMetadata).toHaveBeenCalledWith('/folder')
		expect(report.isRoot).toBe(false)
		expect(report.checks.every(({ status }) => status === 'passed')).toBe(true)
	})
})

describe('getMetadataVersion', () => {
	test.each([
		[{ version: '2.0', metadata: {} }, '2.0'],
		[{ version: '2.1', metadata: {} }, '2.1'],
		[{ metadata: { version: 1 } }, '1'],
		[{ metadata: { version: 1.2 } }, '1.2'],
		[{ metadata: { version: '1.2' } }, '1.2'],
		[{ metadata: {} }, undefined],
		[null, undefined],
		['2.0', undefined],
	])('%j has version %s', (raw, expected) => {
		expect(getMetadataVersion(raw)).toBe(expected)
	})
})

describe('redactMetadata', () => {
	test('redacts every file field that is not known to be public', () => {
		const redacted = redactMetadata(
			{
				keyChecksums: ['checksum'],
				deleted: false,
				counter: 3,
				folders: { 'uuid-folder': 'Folder' },
				files: { 'uuid-file': { ...file, filesize: 42, unknownField: 'value' } as IMetadataFile },
			},
			{ 'uuid-drop': file },
		)

		expect(redacted).toEqual({
			keyChecksums: ['checksum'],
			deleted: false,
			counter: 3,
			folders: { 'uuid-folder': 'Folder' },
			files: {
				'uuid-file': {
					filename: 'file.txt',
					mimetype: 'text/plain',
					key: '[redacted]',
					nonce: '[redacted]',
					authenticationTag: '[redacted]',
					filesize: 42,
					unknownField: '[redacted]',
				},
			},
			filedrop: {
				'uuid-drop': {
					filename: 'file.txt',
					mimetype: 'text/plain',
					key: '[redacted]',
					nonce: '[redacted]',
					authenticationTag: '[redacted]',
				},
			},
		})
	})
})

/**
 * @param privateKeyJwk - The private key as JWK
 */
async function importPrivateKey(privateKeyJwk: JsonWebKey): Promise<CryptoKey> {
	return await globalThis.crypto.subtle.importKey('jwk', privateKeyJwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt'])
}
