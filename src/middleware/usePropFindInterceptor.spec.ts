/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test, vi } from 'vitest'
import { parseXML } from 'webdav'
import { rootFolderMetadata, rootFolderMetadataInfo, rootFolderMetadataSignature, rootFolderPropfindResponse, unencryptedPropFindResponse } from '../../__tests__/consts.spec.ts'
import { state } from '../services/state.ts'
import { usePropFindInterceptor } from './usePropFindInterceptor.ts'

test('passes through non encrypted propfinds', async () => {
	const spy = vi.spyOn(state, 'getMetadataInfo')
	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin/unencrypted', { method: 'PROPFIND' }),
		res: new Response(unencryptedPropFindResponse),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})
	expect(spy).not.toHaveBeenCalled()
	await expect(context.res.text()).resolves.toBe(unencryptedPropFindResponse)
})

test('Correctly replace file info in PROPFIND', async () => {
	vi.spyOn(state, 'getMetadata').mockResolvedValue(rootFolderMetadata)
	vi.spyOn(state, 'getMetadataInfo').mockResolvedValue(rootFolderMetadataInfo)
	vi.spyOn(state, 'setMetadata').mockImplementationOnce(async () => {})

	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin/New%20folder/', { method: 'PROPFIND' }),
		res: new Response(rootFolderPropfindResponse),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})

	expect(state.setMetadata).toHaveBeenCalledWith(
		'/remote.php/dav/files/admin/New%20folder/',
		JSON.stringify(rootFolderMetadata),
		rootFolderMetadataSignature,
	)

	const xml = await parseXML(await context.res.text())
	expect(xml.multistatus.response).toHaveLength(3)
	expect(xml.multistatus.response[0]!.propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[1]!.propstat?.prop.displayname).toBe('test.txt')
	expect(xml.multistatus.response[1]!.propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[1]!.propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[2]!.propstat?.prop.displayname).toBe('Test')
	expect(xml.multistatus.response[2]!.propstat?.prop.getcontenttype).toBe('httpd/unix-directory')
	expect(xml.multistatus.response[2]!.propstat?.prop.permissions).toBe('G')
})
