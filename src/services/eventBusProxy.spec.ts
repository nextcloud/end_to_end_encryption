/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { INode } from '@nextcloud/files'

import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'
import { File, Folder } from '@nextcloud/files'
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import {
	adminMnemonic,
	adminPrivateKeyInfo,
	rootFolderMetadata,
} from '../../__tests__/consts.spec.ts'
import { RootMetadata } from '../models/RootMetadata.ts'
import { NoMetadataError } from '../services/api.ts'
import { decryptPrivateKey } from '../services/privateKeyUtils.ts'
import * as metadataStore from '../store/metadata.ts'
import { setupEventBusProxy } from './eventBusProxy.ts'

vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'admin' }) }))
vi.mock('@nextcloud/sharing/public', () => ({
	isPublicShare: () => false,
	getSharingToken: () => null,
}))
vi.mock('../store/metadata.ts', { spy: true })

/** The DAV root relative path of the e2ee root folder */
const ROOT = '/New folder'
/** The uuid the metadata fixture stores `test.txt` under */
const FILE_UUID = 'ad3b12554e0d4364854ae3e21b170152'
/** The uuid the metadata fixture stores the `Test` folder under */
const FOLDER_UUID = 'fa666d819a6c4315abba421172f0a0b1'

/** The metadata of the e2ee root folder, as a PROPFIND would have cached it */
let rootMetadata: RootMetadata

beforeAll(() => setupEventBusProxy())

beforeEach(async () => {
	vi.resetAllMocks()
	rootMetadata = await RootMetadata.fromJson(
		rootFolderMetadata,
		'admin',
		await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic),
	)
	// only the e2ee root folder is encrypted, every other path has no metadata
	vi.mocked(metadataStore.getMetadata).mockImplementation(async (path: string) => {
		if (path !== ROOT) {
			throw new NoMetadataError(`No metadata found for path ${path}`)
		}
		return { id: '89', metadata: rootMetadata, path }
	})
})

describe('renamed nodes', () => {
	test('restores the uuid source of a renamed file', async () => {
		const node = encryptedFile(FILE_UUID, 'test.txt')
		// the MOVE interceptor has already put the new name into the metadata
		rootMetadata.rename(FILE_UUID, 'renamed.txt')
		node.rename('renamed.txt')

		await emitAndWait('files:node:updated', node)

		expect(node.source).toBe(`https://example.com/remote.php/dav/files/admin${ROOT}/${FILE_UUID}`)
		expect(node.basename).toBe(FILE_UUID)
		expect(node.displayname).toBe('renamed.txt')
	})

	test('restores the uuid source of a renamed folder', async () => {
		const node = encryptedFolder(FOLDER_UUID, 'Test')
		rootMetadata.rename(FOLDER_UUID, 'renamed folder')
		node.rename('renamed folder')

		await emitAndWait('files:node:updated', node)

		expect(node.basename).toBe(FOLDER_UUID)
		expect(node.displayname).toBe('renamed folder')
	})

	test('keeps a node that is already named by its uuid untouched', async () => {
		const node = encryptedFile(FILE_UUID, 'test.txt')

		await emitAndWait('files:node:updated', node)

		expect(node.basename).toBe(FILE_UUID)
		expect(node.displayname).toBe('test.txt')
	})

	test('does not look up a node that is not encrypted', async () => {
		const node = new File({
			source: 'https://example.com/remote.php/dav/files/admin/unencrypted/file.txt',
			owner: 'admin',
			mime: 'text/plain',
			root: '/files/admin',
		})

		await emitAndWait('files:node:updated', node)

		expect(node.basename).toBe('file.txt')
		expect(metadataStore.getMetadata).not.toHaveBeenCalled()
	})
})

describe('created nodes', () => {
	test('renames a created node to its uuid', async () => {
		const node = new File({
			source: `https://example.com/remote.php/dav/files/admin${ROOT}/test.txt`,
			owner: 'admin',
			mime: 'text/plain',
			root: '/files/admin',
		})

		await emitAndWait('files:node:created', node)

		expect(node.basename).toBe(FILE_UUID)
		expect(node.displayname).toBe('test.txt')
		expect(node.attributes['e2ee-is-encrypted']).toBe(1)
	})

	test('leaves a created node that is not part of the metadata alone', async () => {
		const node = new File({
			source: `https://example.com/remote.php/dav/files/admin${ROOT}/unknown.txt`,
			owner: 'admin',
			mime: 'text/plain',
			root: '/files/admin',
		})

		await emitAndWait('files:node:created', node)

		expect(node.basename).toBe('unknown.txt')
	})

	test('leaves a created node outside of an encrypted folder alone', async () => {
		const node = new File({
			source: 'https://example.com/remote.php/dav/files/admin/unencrypted/file.txt',
			owner: 'admin',
			mime: 'text/plain',
			root: '/files/admin',
		})

		await emitAndWait('files:node:created', node)

		expect(node.basename).toBe('file.txt')
		expect(node.attributes['e2ee-is-encrypted']).toBeUndefined()
	})
})

/**
 * An encrypted file the way a PROPFIND delivers it: named by its uuid, carrying
 * its decrypted name as the displayname.
 *
 * @param uuid - The uuid the file is stored under
 * @param filename - The decrypted name of the file
 */
function encryptedFile(uuid: string, filename: string): File {
	return new File({
		source: `https://example.com/remote.php/dav/files/admin${ROOT}/${uuid}`,
		displayname: filename,
		owner: 'admin',
		mime: 'text/plain',
		root: '/files/admin',
		attributes: { 'e2ee-is-encrypted': 1 },
	})
}

/**
 * An encrypted folder the way a PROPFIND delivers it.
 *
 * @param uuid - The uuid the folder is stored under
 * @param filename - The decrypted name of the folder
 */
function encryptedFolder(uuid: string, filename: string): Folder {
	return new Folder({
		source: `https://example.com/remote.php/dav/files/admin${ROOT}/${uuid}`,
		displayname: filename,
		owner: 'admin',
		root: '/files/admin',
		attributes: { 'e2ee-is-encrypted': 1 },
	})
}

/**
 * Emit an event through the proxied bus and wait for it to reach its subscribers.
 *
 * @param event - Name of the event to emit
 * @param node - The node to emit it with
 */
async function emitAndWait(event: 'files:node:created' | 'files:node:updated', node: INode): Promise<void> {
	// the proxy is async while `emit` is not, so the event only reaches the
	// subscribers once the proxy is done with the node
	const subscriber = vi.fn()
	subscribe(event, subscriber)
	try {
		emit(event, node)
		await vi.waitFor(() => expect(subscriber).toHaveBeenCalledOnce())
	} finally {
		unsubscribe(event, subscriber)
	}
}
