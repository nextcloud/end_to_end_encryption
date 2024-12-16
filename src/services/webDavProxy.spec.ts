/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'
import { parseXML } from 'webdav'

import { base64ToBuffer } from './utils.ts'
import { decryptFile, replacePlaceholdersInPropfind } from './webDavProxy.ts'
import { encryptedFileContent, metadataInfo, propFindResponse } from '../../__tests__/consts.spec.ts'

test('Correctly replace file info in PROPFIND', async () => {
	const xml = await parseXML(propFindResponse)
	replacePlaceholdersInPropfind(xml, '/remote.php/dav/files/admin/New%20folder/', metadataInfo)
	expect(xml.multistatus.response[1].propstat?.prop.displayname).toBe('test.txt')
	expect(xml.multistatus.response[1].propstat?.prop.getcontenttype).toBe('text/plain')
})

test('Correctly decrypt file on GET', async () => {
	const fileContent = await decryptFile(
		new Response(base64ToBuffer(encryptedFileContent)),
		metadataInfo.files.ad3b12554e0d4364854ae3e21b170152,
	)
	expect(await fileContent.text()).toBe('test content\n')
})
