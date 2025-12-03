/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test, vi } from 'vitest'
import { encryptedFileContent, rootFolderMetadataInfo } from '../../__tests__/consts.spec.ts'
import { base64ToBuffer } from '../services/bufferUtils.ts'
import { useGetInterceptor } from './useGetInterceptor.js'

const state = vi.hoisted(() => ({
	getMetadataInfo: vi.fn(),
}))

vi.mock('../services/state.ts', () => ({ state }))

test('Correctly decrypt file on GET', async () => {
	const context = {
		req: new Request('https://example.com/remote.php/dav/files/user/test/ad3b12554e0d4364854ae3e21b170152'),
		res: new Response(base64ToBuffer(encryptedFileContent)),
		type: 'fetch' as const,
	}

	state.getMetadataInfo.mockResolvedValueOnce(rootFolderMetadataInfo)

	await useGetInterceptor(context, async () => {})
	await expect(context.res.text()).resolves.toBe('test content\n')
})

test('passes orginal value on not-encrypted files', async () => {
	const context = {
		req: new Request('https://example.com/remote.php/dav/files/user/test/file.txt'),
		res: new Response('test content\n'),
		type: 'fetch' as const,
	}

	state.getMetadataInfo.mockRejectedValueOnce(new Error('No metadata found'))

	await useGetInterceptor(context, async () => {})
	await expect(context.res.text()).resolves.toBe('test content\n')
})

test('throws when invalid metadata is received', async () => {
	const context = {
		req: new Request('https://example.com/remote.php/dav/files/user/test/invaliduuidthatdoesnotexistinmetadata'),
		res: new Response(base64ToBuffer(encryptedFileContent)),
		type: 'fetch' as const,
	}

	state.getMetadataInfo.mockResolvedValueOnce(rootFolderMetadataInfo)

	await expect(useGetInterceptor(context, async () => {})).rejects.toThrow('Could not find file in metadata')
})
