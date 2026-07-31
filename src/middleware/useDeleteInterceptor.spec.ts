/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IMetadataFile } from '../models/metadata.d.ts'

import { X509Certificate } from '@peculiar/x509'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
	adminMnemonic,
	adminPrivateKeyInfo,
	rootFolderMetadata,
} from '../../__tests__/consts.spec.ts'
import { Metadata } from '../models/Metadata.ts'
import { RootMetadata } from '../models/RootMetadata.ts'
import * as api from '../services/api.ts'
import { decryptPrivateKey } from '../services/privateKeyUtils.ts'
import * as metadataStore from '../store/metadata.ts'
import { useDeleteInterceptor } from './useDeleteInterceptor.ts'

vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'admin' }) }))
vi.mock('@nextcloud/sharing/public', () => ({
	isPublicShare: () => false,
	getSharingToken: () => null,
}))
vi.mock('../store/keys.ts', () => ({
	getCertificate: async () => {
		const certificate = new X509Certificate(rootFolderMetadata.users[1]!.certificate)
		certificate.privateKey = await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic)
		return certificate
	},
	getPrivateKey: async () => await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic),
	loadPrivateKey: async () => true,
	loadPublicKey: async () => true,
}))
vi.mock('../services/api.ts', { spy: true })

/** The e2ee root folder, as shipped by the metadata fixture */
const ROOT = '/remote.php/dav/files/admin/New folder'
/** A file within the e2ee root folder */
const FILE_UUID = 'ad3b12554e0d4364854ae3e21b170152'
/** A folder within the e2ee root folder */
const SUB_UUID = 'fa666d819a6c4315abba421172f0a0b1'
/** The counter of the metadata fixture */
const COUNTER = 5

beforeEach(() => {
	vi.clearAllMocks()
	vi.mocked(api.lockFolder).mockResolvedValue('lock-token')
	vi.mocked(api.unlockFolder).mockResolvedValue()
	vi.mocked(api.updateMetadata).mockResolvedValue()
	vi.mocked(api.deleteMetadata).mockResolvedValue()
	// only folders have metadata of their own, and only within the e2ee root folder.
	// Folders are seeded into the cache, so every uuid that gets here is a file.
	vi.mocked(api.getMetadataByPath).mockImplementation(async (path: string) => {
		if (/\/New folder(\/[0-9a-f]{32})+$/.test(path)) {
			return false
		}
		throw new api.NoMetadataError(`No metadata found for path ${path}`)
	})
	metadataStore.deleteMetadata(ROOT)
})

describe('pass through', () => {
	test('passes through targets that are not end-to-end encrypted', async () => {
		const { next } = await runDelete('/remote.php/dav/files/admin/unencrypted/file.txt')

		expect(next).toHaveBeenCalledOnce()
		expect(api.lockFolder).not.toHaveBeenCalled()
	})

	test('does not pass through when the metadata could not be read', async () => {
		vi.mocked(api.getMetadataByPath).mockRejectedValue(new Error('Signature verification failed'))

		await expect(runDelete(`${ROOT}/${FILE_UUID}`)).rejects.toThrow('Signature verification failed')
		expect(api.lockFolder).not.toHaveBeenCalled()
	})
})

describe('deleting a file', () => {
	test('removes a file of the e2ee root folder from its metadata', async () => {
		const metadata = await seedRootFolder()
		const markAsDeleted = vi.spyOn(metadata, 'markAsDeleted')

		const { context, next } = await runDelete(`${ROOT}/${FILE_UUID}`)

		// the file is removed, but the folder itself is left alone
		expect(markAsDeleted).not.toHaveBeenCalled()
		expect(metadata.listContents()).toEqual(['Test'])
		// within the lock of the parent, using the next counter
		expect(api.lockFolder).toHaveBeenCalledExactlyOnceWith('89', COUNTER + 1)
		expect(api.updateMetadata).toHaveBeenCalledOnce()
		expect(api.unlockFolder).toHaveBeenCalledExactlyOnceWith('89', 'lock-token')
		// and the request itself was authorized and kept out of the trashbin
		expect(next).toHaveBeenCalledOnce()
		expect(context.req.headers.get('E2E-TOKEN')).toBe('lock-token')
		expect(context.req.headers.get('X-E2EE-SUPPORTED')).toBe('true')
		expect(context.req.headers.get('X-NC-Skip-Trashbin')).toBe('true')
	})

	test('removes a file of a subfolder from its metadata', async () => {
		const root = await seedRootFolder()
		const metadata = await seedSubFolder(root.key)
		metadata.addFile(FILE_UUID, file('test.txt'))
		await metadata.export(await (await import('../store/keys.ts')).getCertificate())

		await runDelete(`${ROOT}/${SUB_UUID}/${FILE_UUID}`)

		expect(metadata.listContents()).toEqual([])
		// the metadata of the subfolder is updated - it was exported once while
		// seeding the file, so its counter is at 1 - and the root folder is untouched
		expect(api.lockFolder).toHaveBeenCalledExactlyOnceWith('90', 2)
		expect(root.listContents()).toEqual(['Test', 'test.txt'])
	})

	test('deleting one file does not break the next one', async () => {
		const metadata = await seedRootFolder()
		metadata.addFile('bbbb12554e0d4364854ae3e21b170152', file('second.txt'))
		await metadata.export(await (await import('../store/keys.ts')).getCertificate())

		await runDelete(`${ROOT}/${FILE_UUID}`)
		await runDelete(`${ROOT}/bbbb12554e0d4364854ae3e21b170152`)

		expect(metadata.listContents()).toEqual(['Test'])
		// the counter of the metadata is bumped once per delete, the lock has to match it
		expect(vi.mocked(api.lockFolder).mock.calls.map(([, counter]) => counter))
			.toEqual([COUNTER + 2, COUNTER + 3])
		expect(metadata.counter).toBe(COUNTER + 3)
		expect(api.updateMetadata).toHaveBeenCalledTimes(2)
	})
})

describe('deleting a folder', () => {
	test('marks the metadata of the e2ee root folder as deleted', async () => {
		const metadata = await seedRootFolder()
		const markAsDeleted = vi.spyOn(metadata, 'markAsDeleted')

		const { context, next } = await runDelete(ROOT)

		expect(markAsDeleted).toHaveBeenCalledOnce()
		// the metadata of the folder itself is updated, it has no parent to update
		expect(api.lockFolder).toHaveBeenCalledExactlyOnceWith('89', COUNTER + 1)
		expect(api.updateMetadata).toHaveBeenCalledOnce()
		expect(api.deleteMetadata).not.toHaveBeenCalled()
		expect(next).toHaveBeenCalledOnce()
		expect(context.req.headers.get('E2E-TOKEN')).toBe('lock-token')
	})

	test('removes a subfolder from the metadata of its parent', async () => {
		const root = await seedRootFolder()
		await seedSubFolder(root.key)

		const { next } = await runDelete(`${ROOT}/${SUB_UUID}`)

		expect(root.listContents()).toEqual(['test.txt'])
		// the metadata of the deleted folder is removed within the lock of the parent
		expect(api.lockFolder).toHaveBeenCalledExactlyOnceWith('89', COUNTER + 1)
		expect(api.deleteMetadata).toHaveBeenCalledExactlyOnceWith('90', 'lock-token')
		expect(api.updateMetadata).toHaveBeenCalledOnce()
		expect(next).toHaveBeenCalledOnce()
	})
})

/**
 * Seed the cache with the metadata of the e2ee root folder, like a PROPFIND would.
 */
async function seedRootFolder(): Promise<RootMetadata> {
	const privateKey = await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic)
	const metadata = await RootMetadata.fromJson(rootFolderMetadata, 'admin', privateKey)
	metadataStore.setMetadata(ROOT, '89', metadata)
	return metadata
}

/**
 * Seed the cache with the metadata of the subfolder of the e2ee root folder.
 *
 * @param key - The metadata key of the e2ee root folder
 */
async function seedSubFolder(key: CryptoKey): Promise<Metadata> {
	const metadata = await Metadata.createNew(key)
	metadataStore.setMetadata(`${ROOT}/${SUB_UUID}`, '90', metadata)
	return metadata
}

/**
 * Run the DELETE interceptor for the given path.
 *
 * @param path - The path of the node to delete
 */
async function runDelete(path: string) {
	const next = vi.fn(async () => {})
	const context = {
		req: new Request(`https://example.com${path}`, { method: 'DELETE' }),
		res: new Response(),
		type: 'fetch' as const,
	}
	await useDeleteInterceptor(context, next)
	return { context, next }
}

/**
 * A metadata file entry.
 *
 * @param filename - The name of the file
 */
function file(filename: string): IMetadataFile {
	return {
		filename,
		mimetype: 'text/plain',
		key: 'Hj+q7e53ZeQdHKPyF7FKeg==',
		nonce: 'sqqtY0eRjhuwf+qTv5Kg2g==',
		authenticationTag: 'nJHAcpZwSS1BCIkGbmtbNg==',
	}
}
