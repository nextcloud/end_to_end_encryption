/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'
import { parseXML } from 'webdav'
import { encryptedFileContent, rootFolderMetadataInfo, rootFolderPropfindResponse } from '../../__tests__/consts.spec.ts'
import { base64ToBuffer } from './bufferUtils.ts'
import { decryptFile, replacePlaceholdersInPropfind } from './webDavProxy.ts'

test('Correctly replace file info in PROPFIND', async () => {
	const xml = await parseXML(rootFolderPropfindResponse)
	replacePlaceholdersInPropfind(xml, '/remote.php/dav/files/admin/New%20folder/', rootFolderMetadataInfo)
	expect(xml.multistatus.response[0].propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[1].propstat?.prop.displayname).toBe('test.txt')
	expect(xml.multistatus.response[1].propstat?.prop.getcontenttype).toBe('text/plain')
	expect(xml.multistatus.response[1].propstat?.prop.permissions).toBe('G')
	expect(xml.multistatus.response[2].propstat?.prop.displayname).toBe('Test')
	expect(xml.multistatus.response[2].propstat?.prop.getcontenttype).toBe('httpd/unix-directory')
	expect(xml.multistatus.response[2].propstat?.prop.permissions).toBe('G')
})

test('Correctly decrypt file on GET', async () => {
	const fileContent = await decryptFile(
		new Response(base64ToBuffer(encryptedFileContent)),
		rootFolderMetadataInfo.files.ad3b12554e0d4364854ae3e21b170152,
	)
	expect(await fileContent.text()).toBe('test content\n')
})
