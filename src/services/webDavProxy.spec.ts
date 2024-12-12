/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'
import { parseXML } from 'webdav'

import propfindRequest from '../../__tests__/propfindRequest.js'
import { replacePlaceholderInPropfind } from './webDavProxy.ts'

test('Correctly replace file info in PROPFIND', async () => {
	const xml = await parseXML(propfindRequest)
	const metadataInfo = {
		counter: 4,
		files: {
			ad3b12554e0d4364854ae3e21b170152: {
				authenticationTag: 'nJHAcpZwSS1BCIkGbmtbNg==',
				filename: 'test.txt',
				key: 'Hj+q7e53ZeQdHKPyF7FKeg==',
				mimetype: 'text/plain',
				nonce: 'sqqtY0eRjhuwf+qTv5Kg2g==',
			},
		},
		folders: { fa666d819a6c4315abba421172f0a0b1: 'Test' },
		keyChecksums: [
			'9a60be9846978884033fcdfb978fbdd428221b20583bca6bfcb425f1b540152a',
		],
	}

	replacePlaceholderInPropfind(xml, '/remote.php/dav/files/admin/New%20folder/', metadataInfo)

	expect(xml.multistatus.response[1].propstat?.prop.displayname).toBe('test.txt')
})
test('Correctly decrypt file on GET', async () => {
	const fileContent = await decryptFile()
})
