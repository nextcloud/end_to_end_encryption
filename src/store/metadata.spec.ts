/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, expect, test, vi } from 'vitest'
import * as Alice from '../../__tests__/fixtures/Alice.spec.ts'
import { Metadata } from '../models/Metadata.ts'
import { RootMetadata } from '../models/RootMetadata.ts'
import * as keyStore from './keys.ts'
import { deleteMetadata, getRootMetadata, setRawMetadata } from './metadata.ts'

vi.mock('@nextcloud/auth', () => ({
	getCurrentUser: () => ({ uid: Alice.userId }),
}))
vi.mock('@nextcloud/sharing/public', () => ({
	isPublicShare: () => false,
	getSharingToken: () => null,
}))
vi.mock('./keys.ts', () => ({
	getPrivateKey: vi.fn(),
}))

class EmptyUsersMetadata extends Metadata {
	protected override async _exportMetadata() {
		return { ...await super._exportMetadata(), users: [] }
	}

	public static override async createNew(key: CryptoKey, version = '2.0') {
		return new EmptyUsersMetadata(key, version)
	}
}

beforeEach(async () => {
	deleteMetadata('/encrypted')
	const privateKey = await crypto.subtle.importKey('jwk', Alice.privateKey, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt'])
	Alice.certificate.privateKey = privateKey
	vi.mocked(keyStore.getPrivateKey).mockResolvedValue(privateKey)
})

test.each(['2.0', '2.1'])('decrypts a %s subfolder with empty users using its root metadata', async (version) => {
	const root = await RootMetadata.createNew()
	await root.addUser(Alice.userId, Alice.certificate)
	const exportedRoot = await root.export(Alice.certificate)
	await setRawMetadata('/encrypted', '1', exportedRoot.metadata, exportedRoot.signature)

	const child = await EmptyUsersMetadata.createNew(root.key, version)
	child.addFolder('uuid-folder', 'Nested folder')
	const exportedChild = await child.export(Alice.certificate)
	expect(exportedChild.metadata.users).toEqual([])
	const { metadata } = await setRawMetadata('/encrypted/uuid-child', '2', exportedChild.metadata, exportedChild.signature)

	expect(metadata).toBeInstanceOf(Metadata)
	expect(metadata).not.toBeInstanceOf(RootMetadata)
	expect(metadata.getFolder('uuid-folder')).toBe('Nested folder')
	expect(await getRootMetadata('/encrypted/uuid-child')).toBe(await getRootMetadata('/encrypted'))

	deleteMetadata('/encrypted/uuid-child')
	await expect(setRawMetadata('/encrypted/uuid-child', '2', exportedChild.metadata, exportedRoot.signature))
		.rejects.toThrow()
})

test('rejects root metadata that does not grant access to the current user', async () => {
	const root = await RootMetadata.createNew()
	await root.addUser('another-user', Alice.certificate)
	const { metadata, signature } = await root.export(Alice.certificate)

	await expect(setRawMetadata('/encrypted', '1', metadata, signature))
		.rejects.toThrow('Current user has no access to this folder')
})
