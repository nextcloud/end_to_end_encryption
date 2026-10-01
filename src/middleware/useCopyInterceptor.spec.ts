/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'
import type { FileStat } from 'webdav'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as api from '../services/api.ts'
import * as metadataStore from '../store/metadata.ts'
import { useCopyInterceptor } from './useCopyInterceptor.ts'

vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'admin' }) }))
vi.mock('../services/api.ts', () => ({
	getNodeStat: vi.fn(),
	getDirectoryContents: vi.fn(),
}))
vi.mock('../store/metadata.ts', () => ({
	getRootMetadata: vi.fn(),
	getMetadata: vi.fn(),
}))

const DAV = `${window.location.origin}/remote.php/dav`
/** The e2ee root folder */
const ROOT = '/files/admin/encrypted'
/** The uuid of the encrypted node within the e2ee root folder */
const UUID = 'ad3b12554e0d4364854ae3e21b170152'

const fetchMock = vi.spyOn(window, 'fetch')

beforeEach(() => {
	vi.resetAllMocks()
	fetchMock.mockImplementation(async () => new Response('content', { status: 201 }))
	// only the e2ee root folder is encrypted
	vi.mocked(metadataStore.getRootMetadata).mockImplementation(async (path: string) => {
		if (path.startsWith(`/remote.php/dav${ROOT}`)) {
			return {} as Awaited<ReturnType<typeof metadataStore.getRootMetadata>>
		}
		throw new Error('Not encrypted')
	})
	vi.mocked(metadataStore.getMetadata).mockRejectedValue(new Error('Not encrypted'))
})

describe('pass through', () => {
	test('passes through when neither source nor destination are end-to-end encrypted', async () => {
		const { next } = await runCopy('/files/admin/a.txt', '/files/admin/folder/a.txt')

		expect(next).toHaveBeenCalledOnce()
		expect(api.getNodeStat).not.toHaveBeenCalled()
	})
})

describe('copying a file', () => {
	test('uses the real filename when the destination keeps the uuid of the source', async () => {
		mockStat('file', 'secret.txt')

		const { context, next } = await runCopy(`${ROOT}/${UUID}`, `/files/admin/folder/${UUID}`)

		expect(next).not.toHaveBeenCalled()
		expect(context.res.status).toBe(201)
		expect(getUploads()).toEqual([`${DAV}/files/admin/folder/secret.txt`])
	})

	test('keeps a destination name different from the source', async () => {
		mockStat('file', 'secret.txt')

		await runCopy(`${ROOT}/${UUID}`, '/files/admin/folder/renamed.txt')

		expect(getUploads()).toEqual([`${DAV}/files/admin/folder/renamed.txt`])
	})

	test('keeps the name of an unencrypted source copied into an encrypted folder', async () => {
		mockStat('file', 'plain.txt', 'plain.txt')

		await runCopy('/files/admin/plain.txt', `${ROOT}/plain.txt`)

		expect(getUploads()).toEqual([`${DAV}${ROOT}/plain.txt`])
	})
})

describe('copying a folder', () => {
	test('uses the real folder name when the destination keeps the uuid of the source', async () => {
		mockStat('directory', 'Secret folder')
		vi.mocked(api.getDirectoryContents).mockResolvedValue([])

		await runCopy(`${ROOT}/${UUID}`, `/files/admin/folder/${UUID}`)

		expect(fetchMock).toHaveBeenCalledOnce()
		const [url, init] = fetchMock.mock.calls[0]!
		expect(init?.method).toBe('MKCOL')
		expect(url).toBe(`${DAV}/files/admin/folder/Secret%20folder`)
	})
})

/**
 * Mock the PROPFIND result of the source node, as returned through the PROPFIND interceptor.
 *
 * @param type - The type of the source node
 * @param displayname - The real name of the source node
 * @param basename - The name the node is stored as on the server
 */
function mockStat(type: FileStat['type'], displayname: string, basename = UUID) {
	vi.mocked(api.getNodeStat).mockResolvedValue({
		basename,
		type,
		props: { displayname },
	} as unknown as Awaited<ReturnType<typeof api.getNodeStat>>)
}

/**
 * The URLs of all PUT requests sent by the interceptor.
 */
function getUploads(): string[] {
	return fetchMock.mock.calls
		.filter(([, init]) => init?.method === 'PUT')
		.map(([url]) => url.toString())
}

/**
 * Run the interceptor for a COPY request.
 *
 * @param source - The source path relative to the DAV root
 * @param destination - The destination path relative to the DAV root
 */
async function runCopy(source: string, destination: string) {
	const context = {
		req: new Request(`${DAV}${source}`, {
			method: 'COPY',
			headers: { Destination: `${DAV}${destination}` },
		}),
	} as FetchContext
	const next = vi.fn(async () => {})
	await useCopyInterceptor(context, next)
	return { context, next }
}
