/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, expect, test, vi } from 'vitest'
import { parseXML } from 'webdav'
import {
	adminMnemonic,
	adminPrivateKeyInfo,
	rootFilePropfindResponse,
	rootFolderMetadata,
	rootFolderMetadataSignature,
	rootFolderPropfindResponse,
	subFolderMetadata,
	subFolderMetadataSignature,
	subFolderPropfindResponse,
	unencryptedPropFindResponse,
} from '../../__tests__/consts.spec.ts'
import { Metadata } from '../models/Metadata.ts'
import { RootMetadata } from '../models/RootMetadata.ts'
import { decryptPrivateKey } from '../services/privateKeyUtils.ts'
import * as metadataStore from '../store/metadata.ts'
import { usePropFindInterceptor } from './usePropFindInterceptor.ts'

vi.mock('../store/metadata.ts', { spy: true })

beforeEach(() => vi.resetAllMocks())

test('passes through non encrypted propfinds', async () => {
	const spy = vi.spyOn(metadataStore, 'getMetadata')
	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin/unencrypted', { method: 'PROPFIND' }),
		res: new Response(unencryptedPropFindResponse),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})
	expect(spy).not.toHaveBeenCalled()
	await expect(context.res.text()).resolves.toBe(unencryptedPropFindResponse)
})

test('Correctly replace root file info in PROPFIND', async () => {
	const metadata = await RootMetadata.fromJson(rootFolderMetadata, 'admin', await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic))
	metadataStore.getMetadata
		// @ts-expect-error -- mocking for tests
		.mockResolvedValue({ metadata })
	metadataStore.setRawMetadata
		// @ts-expect-error -- mocking for tests
		.mockImplementation(async () => {})

	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin/New%20folder', { method: 'PROPFIND' }),
		res: new Response(rootFolderPropfindResponse),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})

	expect(metadataStore.setRawMetadata).toHaveBeenCalledWith(
		'/remote.php/dav/files/admin/New%20folder',
		89,
		JSON.stringify(rootFolderMetadata),
		rootFolderMetadataSignature,
	)

	const xml = await parseXML(await context.res.text())
	expect(xml.multistatus.response).toHaveLength(3)
	expect(xml.multistatus.response[0]!.propstat?.prop.permissions).toBe('GDNVCK')
	expect(xml.multistatus.response[1]!.propstat?.prop.displayname).toBe('test.txt')
	expect(xml.multistatus.response[1]!.propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[1]!.propstat?.prop.permissions).toBe('GDNVW')
	expect(xml.multistatus.response[2]!.propstat?.prop.displayname).toBe('Test')
	expect(xml.multistatus.response[2]!.propstat?.prop.getcontenttype).toBe('httpd/unix-directory')
	expect(xml.multistatus.response[2]!.propstat?.prop.permissions).toBe('GDNVCK')
})

test('Correctly replace subfolder file info in PROPFIND', async () => {
	const rootMetadata = await RootMetadata.fromJson(rootFolderMetadata, 'admin', await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic))
	const subfolderMetadata = await Metadata.fromJson(subFolderMetadata, rootMetadata.key)

	metadataStore.getMetadata
		// @ts-expect-error -- mocking for tests
		.mockImplementation((path: string) => {
			let metadata: Metadata = rootMetadata
			if (path.includes('/fa666d819a6c4315abba421172f0a0b1')) {
				metadata = subfolderMetadata
			}
			return { metadata, path: path.replace(/\/+$/g, '') }
		})
	metadataStore.setRawMetadata
		// @ts-expect-error -- mocking for tests
		.mockImplementation(async () => {})

	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin/New%20folder/fa666d819a6c4315abba421172f0a0b1', { method: 'PROPFIND' }),
		res: new Response(subFolderPropfindResponse),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})

	expect(metadataStore.setRawMetadata).toHaveBeenCalledWith(
		'/remote.php/dav/files/admin/New%20folder/fa666d819a6c4315abba421172f0a0b1',
		266,
		JSON.stringify(subFolderMetadata),
		subFolderMetadataSignature,
	)

	const xml = await parseXML(await context.res.text())
	expect(xml.multistatus.response).toHaveLength(3)
	expect(xml.multistatus.response[0]!.propstat?.prop.permissions).toBe('GDNVCK')
	expect(xml.multistatus.response[1]!.propstat?.prop.displayname).toBe('07-09-2018 11.40.15.jpg')
	expect(xml.multistatus.response[1]!.propstat?.prop.getcontenttype).toBe('image/jpeg')
	expect(xml.multistatus.response[1]!.propstat?.prop.permissions).toBe('GDNVW')
	expect(xml.multistatus.response[2]!.propstat?.prop.displayname).toBe('subtest.txt')
	expect(xml.multistatus.response[2]!.propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[2]!.propstat?.prop.permissions).toBe('GDNVW')
})

test('Correctly replace file info in PROPFIND of file', async () => {
	const metadata = await RootMetadata.fromJson(rootFolderMetadata, 'admin', await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic))
	metadataStore.getMetadata
		// @ts-expect-error -- mocking for tests
		.mockResolvedValue({ metadata, path: '/remote.php/dav/files/admin/New%20folder' })
	metadataStore.setRawMetadata
		// @ts-expect-error -- mocking for tests
		.mockImplementation(async () => {})

	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin/New%20folder/ad3b12554e0d4364854ae3e21b170152', { method: 'PROPFIND' }),
		res: new Response(rootFilePropfindResponse),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})

	expect(metadataStore.setRawMetadata).not.toBeCalled()

	const xml = await parseXML(await context.res.text())
	expect(xml.multistatus.response).toHaveLength(1)
	expect(xml.multistatus.response[0]!.propstat?.prop.displayname).toBe('test.txt')
	expect(xml.multistatus.response[0]!.propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[0]!.propstat?.prop.permissions).toBe('GDNVW')
})
