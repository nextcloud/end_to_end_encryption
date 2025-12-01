/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test, vi } from 'vitest'
import { parseXML } from 'webdav'
import {
	adminMnemonic,
	adminPrivateKeyInfo,
	rootFolderMetadata,
	rootFolderMetadataSignature,
	rootFolderPropfindResponse,
	subfolderMetadata,
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

test('Correctly replace file info in PROPFIND', async () => {
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
	expect(xml.multistatus.response[0]!.propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[1]!.propstat?.prop.displayname).toBe('test.txt')
	expect(xml.multistatus.response[1]!.propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[1]!.propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[2]!.propstat?.prop.displayname).toBe('Test')
	expect(xml.multistatus.response[2]!.propstat?.prop.getcontenttype).toBe('httpd/unix-directory')
	expect(xml.multistatus.response[2]!.propstat?.prop.permissions).toBe('G')
})

test('Correctly replaces subfolder file info in PROPFIND', async () => {
	const rootMetadata = await RootMetadata.fromJson(rootFolderMetadata, 'admin', await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic))
	const metadata = await Metadata.fromJson(subfolderMetadata, rootMetadata.key)
	metadataStore.getMetadata
		// @ts-expect-error -- mocking for tests
		.mockImplementation((path: string) => {
			if (path.includes('/fa666d819a6c4315abba421172f0a0b1')) {
				return { metadata }
			} else {
				return { metadata: rootMetadata }
			}
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
		JSON.stringify(subfolderMetadata),
		subFolderMetadataSignature,
	)

	const xml = await parseXML(await context.res.text())
	expect(xml.multistatus.response).toHaveLength(3)
	expect(xml.multistatus.response[0]!.propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[1]!.propstat?.prop.displayname).toBe('07-09-2018 11.40.15.jpg')
	expect(xml.multistatus.response[1]!.propstat?.prop.getcontenttype).toBe('image/jpeg')
	expect(xml.multistatus.response[1]!.propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[2]!.propstat?.prop.displayname).toBe('subtest.txt')
	expect(xml.multistatus.response[2]!.propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[2]!.propstat?.prop.permissions).toBe('G')
})
