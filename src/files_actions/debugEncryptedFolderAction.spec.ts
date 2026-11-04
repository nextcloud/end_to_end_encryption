/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ActionContext, INode } from '@nextcloud/files'

import { File, Folder, View } from '@nextcloud/files'
import { defaultRemoteURL } from '@nextcloud/files/dav'
import { spawnDialog } from '@nextcloud/vue/functions/dialog'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getPrivateKey } from '../store/keys.ts'
import Action from './debugEncryptedFolderAction.ts'

vi.mock('@nextcloud/vue/functions/dialog', () => ({
	spawnDialog: vi.fn(),
}))
vi.mock('../store/keys.ts', () => ({
	getPrivateKey: vi.fn(),
}))
vi.mock('../services/logger.ts', () => ({
	default: { error: vi.fn() },
}))

beforeEach(() => {
	vi.mocked(spawnDialog).mockReset()
	vi.mocked(getPrivateKey).mockReset()
})

const view = new View({
	getContents: async () => {
		throw new Error('Not implemented')
	},
	icon: '<svg></svg>',
	name: 'Test View',
	id: 'test_view',
})

const encryptedFolder = new Folder({
	owner: 'test',
	source: defaultRemoteURL + '/files/test/folder',
	root: '/files/test',
	attributes: { 'e2ee-is-encrypted': 1 },
})

const otherEncryptedFolder = new Folder({
	owner: 'test',
	source: defaultRemoteURL + '/files/test/other',
	root: '/files/test',
	attributes: { 'e2ee-is-encrypted': 1 },
})

const folder = new Folder({
	owner: 'test',
	source: defaultRemoteURL + '/files/test/plain',
	root: '/files/test',
})

const encryptedFile = new File({
	owner: 'test',
	source: defaultRemoteURL + '/files/test/folder/6dbd5008041f4103a24b45a6560ebe95',
	root: '/files/test',
	mime: 'text/plain',
	attributes: { 'e2ee-is-encrypted': 1 },
})

const nonDavFolder = new Folder({
	owner: 'test',
	source: 'https://example.com/folder',
	root: '/',
	attributes: { 'e2ee-is-encrypted': 1 },
})

/**
 * @param nodes - The nodes of the context
 */
function getContext(nodes: INode[]): ActionContext {
	return { nodes, view, folder, contents: [] }
}

test('all properties are set correctly', () => {
	expect(Action.id).toBe('e2ee-debug')
	expect(Action.displayName()).toBe('Debug encryption')
	expect(Action.iconSvgInline()).toContain('<svg')
})

describe('enabled', () => {
	test('is enabled for a single encrypted folder', () => {
		expect(Action.enabled(getContext([encryptedFolder]))).toBe(true)
	})

	test.each([
		['no node', []],
		['multiple encrypted folders', [encryptedFolder, otherEncryptedFolder]],
		['an unencrypted folder', [folder]],
		['an encrypted file', [encryptedFile]],
		['a folder that is no DAV resource', [nonDavFolder]],
	])('is disabled for %s', (_, nodes) => {
		expect(Action.enabled(getContext(nodes))).toBe(false)
	})
})

describe('exec', () => {
	test('unlocks the private key and then opens the debug dialog for the folder', async () => {
		vi.mocked(getPrivateKey).mockImplementation(async () => {
			expect(spawnDialog).not.toHaveBeenCalled()
			return {} as CryptoKey
		})

		await expect(Action.exec(getContext([encryptedFolder]))).resolves.toBe(null)
		expect(getPrivateKey).toHaveBeenCalledOnce()
		expect(spawnDialog).toHaveBeenCalledOnce()
		expect(vi.mocked(spawnDialog).mock.calls[0]![1]).toEqual({ node: encryptedFolder })
	})

	test('does not open the dialog if the private key cannot be unlocked', async () => {
		vi.mocked(getPrivateKey).mockRejectedValue(new Error('Mnemonic prompt was cancelled'))

		await expect(Action.exec(getContext([encryptedFolder]))).resolves.toBe(false)
		expect(spawnDialog).not.toHaveBeenCalled()
	})
})
