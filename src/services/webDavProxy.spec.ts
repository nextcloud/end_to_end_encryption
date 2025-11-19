/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test, vi } from 'vitest'
import { parseXML } from 'webdav'
import { encryptedFileContent, rootFolderMetadataInfo, rootFolderPropfindResponse } from '../../__tests__/consts.spec.ts'
import { base64ToBuffer } from './bufferUtils.ts'
import { decryptFile, replacePlaceholdersInPropfind, setupWebDavDecryptionProxy } from './webDavProxy.ts'

test('Correctly replace file info in PROPFIND', async () => {
	const xml = await parseXML(rootFolderPropfindResponse)
	replacePlaceholdersInPropfind(xml, '/remote.php/dav/files/admin/New%20folder/', rootFolderMetadataInfo)
	expect(xml.multistatus.response).toHaveLength(3)
	expect(xml.multistatus.response[0]!.propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[1]!.propstat?.prop.displayname).toBe('test.txt')
	expect(xml.multistatus.response[1]!.propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[1]!.propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[2]!.propstat?.prop.displayname).toBe('Test')
	expect(xml.multistatus.response[2]!.propstat?.prop.getcontenttype).toBe('httpd/unix-directory')
	expect(xml.multistatus.response[2]!.propstat?.prop.permissions).toBe('G')
})

test('Correctly decrypt file on GET', async () => {
	const fileContent = await decryptFile(
		new Response(base64ToBuffer(encryptedFileContent)),
		rootFolderMetadataInfo.files.ad3b12554e0d4364854ae3e21b170152,
	)
	expect(await fileContent.text()).toBe('test content\n')
})

test('Keeps orginal headers in request', async () => {
	const spy = vi.spyOn(window, 'fetch').mockResolvedValue(new Response('<?xml version="1.0"?><d:multistatus xmlns:d="DAV:"><d:response><d:href>/remote.php/dav/files/alice/jj/</d:href><d:propstat><d:prop><d:getetag>&quot;691e0c8336899&quot;</d:getetag><d:getlastmodified>Wed, 19 Nov 2025 18:29:23 GMT</d:getlastmodified><d:creationdate>1970-01-01T00:00:00+00:00</d:creationdate><d:displayname>jj</d:displayname><d:quota-available-bytes>-3</d:quota-available-bytes><d:resourcetype><d:collection/></d:resourcetype><nc:mount-type></nc:mount-type></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat><d:propstat><d:prop><d:getcontentlength/><d:getcontenttype/></d:prop><d:status>HTTP/1.1 404 Not Found</d:status></d:propstat></d:response></d:multistatus>'))

	setupWebDavDecryptionProxy()
	await window.fetch('https://example.com/remote.php/dav/files/user/folder/', {
		method: 'PROPFIND',
		headers: {
			Authorization: 'Bearer token123',
		},
		body: '<d:propfind xmlns:d="DAV:"><d:allprop/></d:propfind>',
	})
	expect(spy).toHaveBeenCalledOnce()
	expect(spy.mock.calls[0]![0]).toBeInstanceOf(Request)
	const realRequest = spy.mock.calls[0]![0] as Request
	// keep original auth header
	expect(realRequest.headers.get('Authorization')).toBe('Bearer token123')
	// added E2EE header
	expect(realRequest.headers.get('X-E2EE-SUPPORTED')).toBe('true')
})
