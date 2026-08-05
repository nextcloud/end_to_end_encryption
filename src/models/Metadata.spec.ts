/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IMetadataFile } from './metadata.d.ts'

import { beforeEach, describe, expect, test } from 'vitest'
import * as Alice from '../../__tests__/fixtures/Alice.spec.ts'
import { Metadata } from './Metadata.ts'

describe('Rolling back metadata', () => {
	let metadata: Metadata

	beforeEach(async () => {
		metadata = await Metadata.createNew(await metadataKey())
	})

	test('should undo an added file', () => {
		metadata.addFile('uuid-1', fileInfo('added.txt'))
		expect(metadata.listContents()).toEqual(['added.txt'])

		metadata.rollback()

		expect(metadata.listContents()).toEqual([])
		expect(metadata.getFile('uuid-1')).toBe(undefined)
	})

	test('should undo an added folder', () => {
		metadata.addFolder('uuid-1', 'added')

		metadata.rollback()

		expect(metadata.listContents()).toEqual([])
		expect(metadata.getFolder('uuid-1')).toBe(undefined)
	})

	test('should undo a deleted file', async () => {
		metadata.addFile('uuid-1', fileInfo('kept.txt'))
		await metadata.export(await signingCertificate())

		metadata.deleteFile('uuid-1')
		expect(metadata.listContents()).toEqual([])

		metadata.rollback()

		expect(metadata.getFile('uuid-1')).toEqual(fileInfo('kept.txt'))
		expect(metadata.hasUuid('uuid-1')).toBe(true)
	})

	test('should undo a deleted folder', async () => {
		metadata.addFolder('uuid-1', 'kept')
		await metadata.export(await signingCertificate())

		metadata.deleteFolder('uuid-1')

		metadata.rollback()

		expect(metadata.getFolder('uuid-1')).toBe('kept')
	})

	test('should undo a rename', async () => {
		metadata.addFile('uuid-1', fileInfo('before.txt'))
		metadata.addFolder('uuid-2', 'before')
		await metadata.export(await signingCertificate())

		metadata.rename('uuid-1', 'after.txt')
		metadata.rename('uuid-2', 'after')

		metadata.rollback()

		expect(metadata.getFile('uuid-1')!.filename).toBe('before.txt')
		expect(metadata.getFolder('uuid-2')).toBe('before')
	})

	test('should undo the counter increment that comes with a change', () => {
		expect(metadata.counter).toBe(0)
		metadata.addFile('uuid-1', fileInfo('added.txt'))
		expect(metadata.counter).toBe(1)

		metadata.rollback()

		expect(metadata.counter).toBe(0)
	})

	test('should undo a replaced metadata key', async () => {
		const original = metadata.key
		metadata.key = await metadataKey()

		metadata.rollback()

		expect(metadata.key).toBe(original)
	})

	test('should keep the changes that were exported', async () => {
		const certificate = await signingCertificate()
		metadata.addFile('uuid-1', fileInfo('exported.txt'))
		await metadata.export(certificate)

		metadata.addFile('uuid-2', fileInfo('not-exported.txt'))
		metadata.rollback()

		// the export is the point the metadata was handed to the server, so that is
		// the state a rollback returns to - not the state it was created in
		expect(metadata.listContents()).toEqual(['exported.txt'])
		expect(metadata.counter).toBe(1)

		// and the counter of the next change carries on from there
		metadata.addFile('uuid-3', fileInfo('next.txt'))
		expect(metadata.counter).toBe(2)
	})

	test('should undo changes made after a rollback as well', async () => {
		metadata.addFile('uuid-1', fileInfo('exported.txt'))
		await metadata.export(await signingCertificate())

		metadata.addFile('uuid-2', fileInfo('first-try.txt'))
		metadata.rollback()
		metadata.addFile('uuid-3', fileInfo('second-try.txt'))
		metadata.rollback()

		expect(metadata.listContents()).toEqual(['exported.txt'])
	})

	test('should do nothing when called again', () => {
		metadata.addFile('uuid-1', fileInfo('added.txt'))
		metadata.rollback()
		metadata.rollback()

		expect(metadata.listContents()).toEqual([])
		expect(metadata.counter).toBe(0)
	})

	test('should not be undone by a following export', async () => {
		const certificate = await signingCertificate()
		metadata.addFile('uuid-1', fileInfo('rolled-back.txt'))
		metadata.rollback()

		// the rolled back entry may not come back through the export, which is what
		// would happen if it was still held anywhere
		const exported = await metadata.export(certificate)
		const reloaded = await Metadata.fromJson(exported.metadata, metadata.key)
		expect(reloaded.listContents()).toEqual([])
	})
})

/**
 * A file entry as the PUT interceptor builds it - only the name is of interest
 * here, the rest is what the metadata carries along.
 *
 * @param filename - Name of the file
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
 * A metadata key, as any folder metadata needs one to be created.
 */
function metadataKey(): Promise<CryptoKey> {
	return globalThis.crypto.subtle.generateKey({ name: 'AES-GCM', length: 128 }, true, ['encrypt', 'decrypt'])
}

/**
 * A certificate that can sign, which is what exporting metadata needs.
 */
async function signingCertificate() {
	const certificate = Alice.certificate
	certificate.privateKey = await globalThis.crypto.subtle.importKey(
		'jwk',
		Alice.privateKey,
		{ name: 'RSA-OAEP', hash: 'SHA-256' },
		true,
		['decrypt'],
	)
	return certificate
}
