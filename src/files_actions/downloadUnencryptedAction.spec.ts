/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { DefaultType, File, Folder, Permission, View } from '@nextcloud/files'
import { defaultRemoteURL } from '@nextcloud/files/dav'
import { describe, expect, test, vi } from 'vitest'
import { stringToBuffer } from '../services/bufferUtils.ts'
import Action from './downloadUnencryptedAction.ts'

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
	attributes: {
		'e2ee-is-encrypted': 1,
		'is-encrypted': 1,
	},
})

const file = new File({
	owner: 'test',
	source: defaultRemoteURL + '/files/test/file.txt',
	root: '/files/test',
	mime: 'text/plain',
	permissions: Permission.ALL,
})

const encryptedFile = new File({
	owner: 'test',
	source: defaultRemoteURL + '/files/test/6dbd5008041f4103a24b45a6560ebe95',
	root: '/files/test',
	mime: 'application/octet-stream',
	permissions: Permission.ALL,
	attributes: {
		'e2ee-is-encrypted': 1,
	},
})

test('all properties are set correctly', () => {
	expect(Action.id).toBe('download_unencrypted')
	expect(Action.default).toBe(DefaultType.DEFAULT)
	expect(Action.displayName([folder], view)).toBe('Download unencrypted')
	expect(Action.iconSvgInline([folder], view)).toContain('<svg')
	expect(Action.execBatch).toBeUndefined()
})

test('exec method calls downloadNodes', async () => {
	const spy = vi.spyOn(window, 'fetch')
		.mockResolvedValueOnce(new Response(stringToBuffer('decrypted content')))

	const element = vi.mockObject<HTMLAnchorElement>({
		href: '',
		download: '',
		click: () => {},
	} as never)
	vi.spyOn(document, 'createElement').mockReturnValueOnce(element)

	await Action.exec(encryptedFile, view, encryptedFile.dirname)
	expect(spy).toHaveBeenCalledWith(encryptedFile.encodedSource)
	expect(element.href).toContain('blob:')
	expect(element.click).toHaveBeenCalled()
})

describe('enabled method', () => {
	test('is available', () => {
		expect(Action.enabled).toBeTypeOf('function')
	})
	test('returns false for no nodes', () => {
		expect(Action.enabled!([], view)).toBe(false)
	})
	test('returns false for folders', () => {
		expect(Action.enabled!([folder], view)).toBe(false)
	})
	test('returns false for multiple nodes', () => {
		expect(Action.enabled!([encryptedFile, encryptedFile], view)).toBe(false)
	})
	test('returns false for non encrypted node', () => {
		expect(Action.enabled!([file], view)).toBe(false)
	})
	test('returns false for not-downloadable node', () => {
		const file = encryptedFile.clone()
		file.permissions = file.permissions & ~Permission.READ
		expect(Action.enabled!([encryptedFile, encryptedFile], view)).toBe(false)
	})
	test('returns false for external files', () => {
		const externalFile = new File({
			owner: 'test',
			source: 'http://example.com/root/6dbd5008041f4103a24b45a6560ebe95',
			root: '/root',
			mime: 'application/octet-stream',
			permissions: Permission.ALL,
			attributes: {
				'e2ee-is-encrypted': 1,
			},
		})
		expect(Action.enabled!([externalFile], view)).toBe(false)
	})
	test('enabled for one encrypted file', () => {
		expect(Action.enabled!([encryptedFile], view)).toBe(true)
	})
})
