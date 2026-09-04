/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, expect, test, vi } from 'vitest'
import { parseXML } from 'webdav'
import {
	adminMnemonic,
	adminPrivateKeyInfo,
	homeListingPropFindResponse,
	mixedPropFindResponse,
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

vi.mock('@nextcloud/auth', () => ({
	getCurrentUser: () => ({ uid: 'admin' }),
}))
vi.mock('@nextcloud/sharing/public', () => ({
	isPublicShare: () => false,
	getSharingToken: () => null,
}))
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

test('does not throw and passes through the response as-is when it cannot be parsed', async () => {
	// e.g. an empty body, an HTML error page, or any other response that is
	// not a well-formed WebDAV multistatus - this must never take down the
	// whole PROPFIND request, see #1991.
	const malformedBody = 'this is not xml'
	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin/unencrypted', { method: 'PROPFIND' }),
		res: new Response(malformedBody),
		type: 'fetch' as const,
	}

	await expect(usePropFindInterceptor(context, async () => {})).resolves.not.toThrow()
	await expect(context.res.text()).resolves.toBe(malformedBody)
})

test('Correctly adjust e2ee nodes in PROPFIND of an unencrypted folder', async () => {
	const metadata = await RootMetadata.fromJson(rootFolderMetadata, 'admin', await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic))
	metadataStore.getMetadata
		// @ts-expect-error -- mocking for tests
		.mockImplementation(async (path: string) => ({ metadata, path: path.replace(/\/+$/g, '') }))
	metadataStore.setRawMetadata
		// @ts-expect-error -- mocking for tests
		.mockImplementation(async () => {})

	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin', { method: 'PROPFIND' }),
		res: new Response(mixedPropFindResponse),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})

	// the metadata shipped with the e2ee root child is cached
	expect(metadataStore.setRawMetadata).toHaveBeenCalledTimes(1)
	expect(metadataStore.setRawMetadata).toHaveBeenCalledWith(
		'/remote.php/dav/files/admin/New folder',
		89,
		JSON.stringify(rootFolderMetadata),
		rootFolderMetadataSignature,
	)

	const xml = await parseXML(await context.res.text())
	expect(xml.multistatus.response).toHaveLength(4)
	// the unencrypted PROPFIND target and the unencrypted sibling are kept untouched
	expect(xml.multistatus.response[0]!.propstat?.prop.displayname).toBe('admin')
	expect(xml.multistatus.response[0]!.propstat?.prop.permissions).toBe('RGDNVCK')
	expect(xml.multistatus.response[1]!.propstat?.prop.displayname).toBe('plain.txt')
	expect(xml.multistatus.response[1]!.propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[1]!.propstat?.prop.permissions).toBe('RGDNVW')
	// the e2ee root keeps its unencrypted name but loses the share permission
	expect(xml.multistatus.response[2]!.propstat?.prop.displayname).toBe('New folder')
	expect(xml.multistatus.response[2]!.propstat?.prop.permissions).toBe('GDNVCK')
	// the node inside the e2ee root is decrypted
	expect(xml.multistatus.response[3]!.propstat?.prop.displayname).toBe('test.txt')
	expect(xml.multistatus.response[3]!.propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[3]!.propstat?.prop.permissions).toBe('GDNVW')

	// metadata is only resolved for the parent of the node inside the e2ee root,
	// never for the unencrypted nodes or the e2ee root itself
	expect(metadataStore.getMetadata).toHaveBeenCalledTimes(1)
	expect(metadataStore.getMetadata).toHaveBeenCalledWith('/remote.php/dav/files/admin/New folder')
})

test('Does not decrypt the metadata of a listed e2ee root', async () => {
	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin', { method: 'PROPFIND' }),
		res: new Response(homeListingPropFindResponse),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})

	// The listing does not contain any encrypted name, so no metadata is needed -
	// touching it would ask the user for the recovery phrase just to list the home
	// folder, as decrypting the metadata of an e2ee root needs their private key.
	expect(metadataStore.setRawMetadata).not.toHaveBeenCalled()
	expect(metadataStore.getMetadata).not.toHaveBeenCalled()

	const xml = await parseXML(await context.res.text())
	expect(xml.multistatus.response).toHaveLength(3)
	expect(xml.multistatus.response[2]!.propstat?.prop.displayname).toBe('New folder')
	// the share permission is still dropped for the e2ee root
	expect(xml.multistatus.response[2]!.propstat?.prop.permissions).toBe('GDNVCK')
})

test('does not corrupt a PROPFIND property that also carries an XML attribute when rebuilding the response', async () => {
	// fast-xml-parser only wraps a node's text content in an object under the
	// configured `textNodeName` key - instead of returning it as a plain string -
	// when the node also has to carry other keys alongside it, e.g. an attribute.
	// `parseXML()` (from the `webdav` package) parses with `textNodeName: 'text'`,
	// so the `XMLBuilder` used to rebuild the response has to use the same value
	// for the round trip to be symmetric. Without it, `XMLBuilder`'s own default
	// (`'#text'`) does not recognise the wrapped text and serialises it as a
	// literal `<text>` child element instead - plus an invalid `<@attr>` tag for
	// the attribute itself - corrupting the response Nextcloud's own DAV client
	// then fails to parse back ("Invalid tag name: text").
	//
	// No known Nextcloud DAV property currently ships an attribute like this
	// (the one pre-existing case in these fixtures, `x1:share-permissions`'s
	// inline `xmlns:x1`, is filtered out by the parser as a namespace
	// declaration rather than kept as data), so this uses a synthetic one to
	// pin the invariant regardless of whether one exists in the wild today.
	const response = homeListingPropFindResponse.replace(
		'<d:displayname>New folder</d:displayname>',
		'<d:displayname synthetic-attr="1">New folder</d:displayname>',
	)
	expect(response).not.toBe(homeListingPropFindResponse)

	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin', { method: 'PROPFIND' }),
		res: new Response(response),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})

	const raw = await context.res.text()
	expect(raw).not.toContain('<text>')
	expect(raw).not.toContain('<@')
	expect(raw).toContain('<displayname synthetic-attr="1">New folder</displayname>')
})

test('does not drop a boolean-valued XML attribute when rebuilding the response', async () => {
	// `XMLBuilder`'s `suppressBooleanAttributes` defaults to `true`: it omits the
	// `="value"` part for any attribute whose value is exactly the string 'true',
	// e.g. `attr="true"` round-trips as the bare `attr`. That does not corrupt the
	// XML the way the mismatched `textNodeName` above does, but a stricter parser
	// downstream can silently lose the attribute instead of reading it back as
	// `'true'`. Unlike the synthetic case above, this one ships in the wild today:
	// a folder tagged with a Nextcloud collaborative system tag gets a
	// `<nc:system-tag oc:can-assign="true" oc:user-visible="true">` in every
	// PROPFIND response that lists it.
	const response = homeListingPropFindResponse.replace(
		'<d:displayname>New folder</d:displayname>',
		'<d:displayname>New folder</d:displayname>'
			+ '<nc:system-tags><nc:system-tag oc:can-assign="true" oc:id="8" oc:user-assignable="false" '
			+ 'oc:user-visible="true" nc:color="B0B0B0">BACKUP</nc:system-tag></nc:system-tags>',
	)
	expect(response).not.toBe(homeListingPropFindResponse)

	const context = {
		req: new Request('https://example.com/remote.php/dav/files/admin', { method: 'PROPFIND' }),
		res: new Response(response),
		type: 'fetch' as const,
	}

	await usePropFindInterceptor(context, async () => {})

	const raw = await context.res.text()
	expect(raw).toContain('<system-tag can-assign="true" id="8" user-assignable="false" user-visible="true" color="B0B0B0">BACKUP</system-tag>')
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
		'/remote.php/dav/files/admin/New folder',
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
		'/remote.php/dav/files/admin/New folder/fa666d819a6c4315abba421172f0a0b1',
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
		.mockResolvedValue({ metadata, path: '/remote.php/dav/files/admin/New folder' })
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
