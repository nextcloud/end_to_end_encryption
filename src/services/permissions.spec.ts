/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { File, Permission } from '@nextcloud/files'
import { defaultRemoteURL } from '@nextcloud/files/dav'
import { expect, test } from 'vitest'
import { isDownloadable } from './permissions.ts'

const file = new File({
	owner: 'test',
	source: defaultRemoteURL + '/files/test/file.txt',
	root: '/files/test',
	permissions: Permission.ALL,
})

const fileNoRead = file.clone()
fileNoRead.permissions = Permission.CREATE

const fileNoDownload = file.clone()
fileNoDownload.attributes['share-attributes'] = JSON.stringify([
	{
		scope: 'permissions',
		key: 'download',
		value: false,
	},
])

const fileWithShareAttributes = file.clone()
fileWithShareAttributes.attributes['share-attributes'] = JSON.stringify([
	{
		scope: 'somescope',
		key: 'somekey',
		value: true,
	},
])

const fileWithEmptyShareAttributes = file.clone()
fileWithEmptyShareAttributes.attributes['share-attributes'] = {}

test('cannot download files without read permission', () => {
	expect(isDownloadable(fileNoRead)).toBe(false)
})

test('cannot download files without download permission', () => {
	expect(isDownloadable(fileNoDownload)).toBe(false)
})

test('can download files with read and download permission', () => {
	expect(isDownloadable(file)).toBe(true)
})

test('can download files with read and download permission and share attributes', () => {
	expect(isDownloadable(fileWithShareAttributes)).toBe(true)
})

test('can download files with read and download permission and empty share attributes', () => {
	expect(isDownloadable(fileWithEmptyShareAttributes)).toBe(true)
})
