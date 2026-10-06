/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import { File, Folder, Permission } from '@nextcloud/files'
import { defaultRemoteURL } from '@nextcloud/files/dav'
import { isPublicShare } from '@nextcloud/sharing/public'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { canManageEncryptedShares, isDownloadable } from './permissions.ts'

vi.mock('@nextcloud/auth', () => ({
	getCurrentUser: vi.fn(),
}))
vi.mock('@nextcloud/sharing/public', () => ({
	isPublicShare: vi.fn(),
}))

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

describe('canManageEncryptedShares', () => {
	const encryptedFolder = new Folder({
		owner: 'test',
		source: defaultRemoteURL + '/files/test/encrypted',
		root: '/files/test',
		permissions: Permission.ALL & ~Permission.SHARE,
		attributes: {
			'e2ee-is-encrypted': 1,
			'is-encrypted': 1,
		},
	})

	const encryptedFile = new File({
		owner: 'test',
		source: defaultRemoteURL + '/files/test/encrypted/6dbd5008041f4103a24b45a6560ebe95',
		root: '/files/test',
		mime: 'application/octet-stream',
		permissions: Permission.ALL & ~Permission.SHARE,
		attributes: {
			'e2ee-is-encrypted': 1,
		},
	})

	beforeEach(() => {
		vi.resetAllMocks()
		vi.mocked(getCurrentUser).mockReturnValue({ uid: 'test', displayName: 'Test', isAdmin: false })
		vi.mocked(isPublicShare).mockReturnValue(false)
	})

	test('returns false on public shares', () => {
		vi.mocked(isPublicShare).mockReturnValue(true)
		expect(canManageEncryptedShares(encryptedFolder)).toBe(false)
	})

	test('returns false without read permissions', () => {
		const encryptedFolderClone = encryptedFolder.clone()
		encryptedFolderClone.permissions = encryptedFolderClone.permissions & ~Permission.READ
		expect(canManageEncryptedShares(encryptedFolderClone)).toBe(false)
	})

	test('returns false for non encrypted node', () => {
		expect(canManageEncryptedShares(file)).toBe(false)
	})

	test('returns false if the current user is not the owner', () => {
		vi.mocked(getCurrentUser).mockReturnValue({ uid: 'other', displayName: 'Other', isAdmin: false })
		expect(canManageEncryptedShares(encryptedFolder)).toBe(false)
	})

	test('returns false if there is no current user', () => {
		vi.mocked(getCurrentUser).mockReturnValue(null)
		expect(canManageEncryptedShares(encryptedFolder)).toBe(false)
	})

	test('returns true for an owned encrypted folder', () => {
		expect(canManageEncryptedShares(encryptedFolder)).toBe(true)
	})

	test('returns true for an owned encrypted file', () => {
		expect(canManageEncryptedShares(encryptedFile)).toBe(true)
	})
})
