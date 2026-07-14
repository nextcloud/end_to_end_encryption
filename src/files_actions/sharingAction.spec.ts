/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import { File, Folder, getSidebar, Permission, View } from '@nextcloud/files'
import { defaultRemoteURL } from '@nextcloud/files/dav'
import { isPublicShare } from '@nextcloud/sharing/public'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { sharingAction } from './sharingAction.ts'

vi.mock('@nextcloud/auth', () => ({
	getCurrentUser: vi.fn(),
}))
vi.mock('@nextcloud/sharing/public', () => ({
	isPublicShare: vi.fn(),
}))
vi.mock('@nextcloud/files', async (importOriginal) => ({
	...(await importOriginal()),
	getSidebar: vi.fn(),
}))

beforeEach(() => {
	vi.resetAllMocks()
	vi.mocked(getCurrentUser).mockReturnValue({ uid: 'test', displayName: 'Test', isAdmin: false })
	vi.mocked(isPublicShare).mockReturnValue(false)
})

const view = new View({
	getContents: async () => {
		throw new Error('Not implemented')
	},
	icon: '<svg></svg>',
	name: 'Test View',
	id: 'test_view',
})

const folder = new Folder({
	owner: 'test',
	source: defaultRemoteURL + '/files/test/folder',
	root: '/files/test',
	permissions: Permission.ALL,
})

const encryptedFolder = new Folder({
	owner: 'test',
	source: defaultRemoteURL + '/files/test/encrypted',
	root: '/files/test',
	permissions: Permission.ALL,
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
	permissions: Permission.ALL,
	attributes: {
		'e2ee-is-encrypted': 1,
	},
})

const contents = [] as File[]

test('all properties are set correctly', () => {
	expect(sharingAction.id).toBe('end_to_end_encryption::sharing')
	expect(sharingAction.displayName({ nodes: [encryptedFolder], view, folder, contents })).toBe('Sharing options')
	expect(sharingAction.iconSvgInline({ nodes: [encryptedFolder], view, folder, contents })).toContain('<svg')
})

test('exec method opens the sharing sidebar', async () => {
	const open = vi.fn()
	vi.mocked(getSidebar).mockReturnValue({ open } as never)

	const result = await sharingAction.exec({ nodes: [encryptedFolder], view, folder, contents })
	expect(result).toBeNull()
	expect(open).toHaveBeenCalledOnce()
	expect(open).toHaveBeenCalledWith(encryptedFolder, 'sharing')
})

describe('enabled method', () => {
	test('is available', () => {
		expect(sharingAction.enabled).toBeTypeOf('function')
	})

	test('returns false for no nodes', () => {
		expect(sharingAction.enabled!({ nodes: [], view, folder, contents })).toBe(false)
	})

	test('returns false for multiple nodes', () => {
		expect(sharingAction.enabled!({ nodes: [encryptedFolder, encryptedFile], view, folder, contents })).toBe(false)
	})

	test('returns false on public shares', () => {
		vi.mocked(isPublicShare).mockReturnValue(true)
		expect(sharingAction.enabled!({ nodes: [encryptedFolder], view, folder, contents })).toBe(false)
	})

	test('returns false without read permissions', () => {
		const encryptedFolderClone = encryptedFolder.clone()
		encryptedFolderClone.permissions = encryptedFolderClone.permissions & ~Permission.READ
		expect(sharingAction.enabled!({ nodes: [encryptedFolderClone], view, folder, contents })).toBe(false)
	})

	test('returns false for non encrypted node', () => {
		expect(sharingAction.enabled!({ nodes: [folder], view, folder, contents })).toBe(false)
	})

	test('returns false if the current user is not the owner', () => {
		vi.mocked(getCurrentUser).mockReturnValue({ uid: 'other', displayName: 'Other', isAdmin: false })
		expect(sharingAction.enabled!({ nodes: [encryptedFolder], view, folder, contents })).toBe(false)
	})

	test('returns false if there is no current user', () => {
		vi.mocked(getCurrentUser).mockReturnValue(null)
		expect(sharingAction.enabled!({ nodes: [encryptedFolder], view, folder, contents })).toBe(false)
	})

	test('returns true for an owned encrypted folder', () => {
		expect(sharingAction.enabled!({ nodes: [encryptedFolder], view, folder, contents })).toBe(true)
	})

	test('returns true for an owned encrypted file', () => {
		expect(sharingAction.enabled!({ nodes: [encryptedFile], view, folder, contents })).toBe(true)
	})
})
