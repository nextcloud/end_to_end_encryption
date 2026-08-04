/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { X509Certificate } from '@peculiar/x509'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
	adminMnemonic,
	adminPrivateKeyInfo,
	rootFolderMetadata,
} from '../../__tests__/consts.spec.ts'
import { RootMetadata } from '../models/RootMetadata.ts'
import * as api from '../services/api.ts'
import { base64ToBuffer } from '../services/bufferUtils.ts'
import { decryptWithAES, loadAESPrivateKey } from '../services/crypto.ts'
import { decryptPrivateKey } from '../services/privateKeyUtils.ts'
import * as metadataStore from '../store/metadata.ts'
import { usePutInterceptor } from './usePutInterceptor.ts'

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
/** The file within the e2ee root folder, named "test.txt" */
const FILE_UUID = 'ad3b12554e0d4364854ae3e21b170152'
/** The contents of the e2ee root folder, as shipped by the metadata fixture */
const CONTENTS = ['Test', 'test.txt']
/** The counter of the metadata fixture */
const COUNTER = 5
/** The file id of the e2ee root folder */
const ROOT_ID = '89'

const FILE_CONTENT = 'the contents of the uploaded file\n'

beforeEach(() => {
	vi.clearAllMocks()
	vi.mocked(api.lockFolder).mockResolvedValue('lock-token')
	vi.mocked(api.unlockFolder).mockResolvedValue()
	vi.mocked(api.updateMetadata).mockResolvedValue()
	vi.mocked(api.getMetadataByPath).mockRejectedValue(new api.NoMetadataError('No metadata found'))
	metadataStore.deleteMetadata(ROOT)
})

describe('pass through', () => {
	test('passes through a target that is not end-to-end encrypted', async () => {
		const { context, next } = await runPut('/remote.php/dav/files/admin/unencrypted/file.txt')

		expect(next).toHaveBeenCalledOnce()
		expect(api.lockFolder).not.toHaveBeenCalled()
		// the request reaches the server as it was, contents included
		expect(context.req.headers.get('X-E2EE-SUPPORTED')).toBe(null)
		expect(await context.req.text()).toBe(FILE_CONTENT)
	})
})

describe('uploading a file', () => {
	test('uploads the file encrypted under a uuid and adds it to the metadata', async () => {
		const metadata = await seedRootFolder()

		const { context, next } = await runPut(`${ROOT}/new file.txt`)

		// the name of the file only exists in the metadata, the server gets a uuid
		const uuid = uploadedName(context)
		expect(uuid).toMatch(/^[0-9a-f]{32}$/)
		expect(metadata.getUuid('new file.txt')).toBe(uuid)
		expect(metadata.listContents()).toEqual([...CONTENTS, 'new file.txt'])
		// and the real mimetype travels in the metadata as well
		expect(metadata.getFile(uuid)!.mimetype).toBe('text/plain')

		// within the lock of the folder, using the next counter
		expect(next).toHaveBeenCalledOnce()
		expect(api.lockFolder).toHaveBeenCalledExactlyOnceWith(ROOT_ID, COUNTER + 1)
		expect(api.updateMetadata).toHaveBeenCalledOnce()
		expect(api.unlockFolder).toHaveBeenCalledExactlyOnceWith(ROOT_ID, 'lock-token')
		// and the request itself was authorized and gives nothing away
		expect(context.req.headers.get('E2E-TOKEN')).toBe('lock-token')
		expect(context.req.headers.get('X-E2EE-SUPPORTED')).toBe('true')
		expect(context.req.headers.get('Content-Type')).toBe('application/octet-stream')
	})

	test('uploads contents that the key of the metadata entry decrypts', async () => {
		const metadata = await seedRootFolder()

		const { context } = await runPut(`${ROOT}/new file.txt`)

		// the entry has to describe the very bytes that were uploaded - a key, a
		// nonce or a tag that belongs to anything else is a file lost for good
		const entry = metadata.getFile(uploadedName(context))!
		const uploaded = await context.req.arrayBuffer()
		expect(new TextDecoder().decode(uploaded)).not.toContain('contents')

		const decrypted = await decryptWithAES(
			uploaded,
			await loadAESPrivateKey(base64ToBuffer(entry.key)),
			{ iv: base64ToBuffer(entry.nonce) },
		)
		expect(new TextDecoder().decode(decrypted)).toBe(FILE_CONTENT)
	})

	test('gives a file a unique name if the folder already has one of that name', async () => {
		const metadata = await seedRootFolder()

		const { context } = await runPut(`${ROOT}/test.txt`)

		// the file that is already there keeps its name and its uuid
		expect(uploadedName(context)).not.toBe(FILE_UUID)
		expect(metadata.getFile(FILE_UUID)!.filename).toBe('test.txt')
		expect(metadata.listContents()).toEqual([...CONTENTS, 'test (1).txt'])
	})

	test('keeps name and uuid when an existing file is overwritten', async () => {
		const metadata = await seedRootFolder()

		// the files app addresses a file by the name it has on the server, so an
		// update arrives as a PUT to the uuid
		const { context } = await runPut(`${ROOT}/${FILE_UUID}`)

		expect(uploadedName(context)).toBe(FILE_UUID)
		expect(metadata.getFile(FILE_UUID)!.filename).toBe('test.txt')
		expect(metadata.listContents()).toEqual(CONTENTS)
		expect(api.updateMetadata).toHaveBeenCalledOnce()
	})
})

describe('an upload that failed', () => {
	test('does not add the file to the metadata', async () => {
		const metadata = await seedRootFolder()

		const { context } = await runPut(`${ROOT}/failed.txt`, { status: 507 })

		expect(metadata.listContents()).toEqual(CONTENTS)
		expect(metadata.getUuid('failed.txt')).toBe(undefined)
		expect(metadata.getFile(uploadedName(context))).toBe(undefined)
		// the metadata on the server is left as it is, and the folder is unlocked again
		expect(api.updateMetadata).not.toHaveBeenCalled()
		expect(api.unlockFolder).toHaveBeenCalledExactlyOnceWith(ROOT_ID, 'lock-token')
	})

	test('reports the failure to the caller', async () => {
		await seedRootFolder()

		const { context } = await runPut(`${ROOT}/failed.txt`, { status: 507 })

		expect(context.res.status).toBe(507)
	})

	test('leaves the counter where the next operation expects it', async () => {
		const metadata = await seedRootFolder()

		await runPut(`${ROOT}/failed.txt`, { status: 507 })

		// A counter that is off keeps the server from accepting the metadata of every
		// following operation, as it locks the folder with the one it expects to write.
		expect(metadata.counter).toBe(COUNTER)
		await runPut(`${ROOT}/other.txt`)
		expect(api.lockFolder).toHaveBeenLastCalledWith(ROOT_ID, COUNTER + 1)
	})

	test('does not take the name of the file from a second attempt', async () => {
		const metadata = await seedRootFolder()

		await runPut(`${ROOT}/retried.txt`, { status: 507 })
		await runPut(`${ROOT}/retried.txt`)

		expect(metadata.listContents()).toEqual([...CONTENTS, 'retried.txt'])
	})

	test('is not persisted by the next upload that succeeds', async () => {
		const metadata = await seedRootFolder()

		await runPut(`${ROOT}/failed.txt`, { status: 507 })
		await runPut(`${ROOT}/other.txt`)

		// the metadata that reached the server is the one this object holds, so the
		// entry of the failed upload may not be part of it anymore
		expect(metadata.listContents()).toEqual([...CONTENTS, 'other.txt'])
		expect(api.updateMetadata).toHaveBeenCalledOnce()
	})
})

/**
 * Seed the cache with the metadata of the e2ee root folder, like a PROPFIND would.
 */
async function seedRootFolder(): Promise<RootMetadata> {
	const privateKey = await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic)
	const metadata = await RootMetadata.fromJson(rootFolderMetadata, 'admin', privateKey)
	metadataStore.setMetadata(ROOT, ROOT_ID, metadata)
	return metadata
}

/**
 * Run the PUT interceptor for the given path.
 *
 * @param path - The path to upload to
 * @param options - Contents to upload and the status the upload is answered with
 */
async function runPut(path: string, options: { content?: string, status?: number } = {}) {
	const { content = FILE_CONTENT, status = 201 } = options
	const context = {
		req: new Request(`https://example.com${path}`, {
			method: 'PUT',
			body: content,
			headers: { 'Content-Type': 'text/plain' },
		}),
		res: new Response(),
		type: 'fetch' as const,
	}
	// `next` is what performs the request, so it is also what answers it
	const next = vi.fn(async () => {
		context.res = new Response(null, { status })
	})

	await usePutInterceptor(context, next)
	return { context, next }
}

/**
 * The name the file was uploaded under, i.e. the name it has on the server.
 *
 * @param context - The context the interceptor ran on
 */
function uploadedName(context: { req: Request }): string {
	return decodeURIComponent(new URL(context.req.url).pathname.split('/').pop()!)
}
