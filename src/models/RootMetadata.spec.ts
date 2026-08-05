/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import stringify from 'safe-stable-stringify'
import { describe, expect, test } from 'vitest'
import * as Alice from '../../__tests__/fixtures/Alice.spec.ts'
import * as Bob from '../../__tests__/fixtures/Bob.spec.ts'
import { base64ToBuffer, stringToBuffer } from '../services/bufferUtils.ts'
import { validateCMSSignature } from '../services/crypto.ts'
import { RootMetadata } from './RootMetadata.ts'

describe('Creating metadata', () => {
	test('should create new metadata instance', async () => {
		const metadata = await RootMetadata.createNew()
		expect(metadata).toBeInstanceOf(RootMetadata)
		expect(metadata.getUsers()).toHaveLength(0)
	})

	test('should be able to add new user to metadata', async () => {
		const metadata = await RootMetadata.createNew()
		await metadata.addUser(Bob.userId, Bob.certificate)
		expect(metadata.getUsers()).toEqual([Bob.userId])
	})
})

describe('Export metadata', () => {
	test('Export new metadata', async () => {
		const cert = Alice.certificate
		cert.privateKey = await getPrivateKey(Alice.privateKey)
		const metadata = await RootMetadata.createNew()
		await metadata.addUser(Alice.userId, cert)

		const exported = await metadata.export(cert)
		expect(exported.metadata.users).toHaveLength(1)
		expect(exported.metadata.users[0]!.userId).toBe(Alice.userId)
		expect(exported.metadata.filedrop).toBe(undefined)
		expect(exported.metadata.version).toBe('2.0')

		// validate signature
		expect(await validateCMSSignature(
			stringToBuffer(btoa(stringify(exported.metadata))),
			base64ToBuffer(exported.signature),
			exported.metadata.users,
		)).toBe(true)
	})
})

describe('Rolling back root metadata', () => {
	/**
	 * The users are held next to the metadata itself, so a rollback has to cover
	 * them separately - and with them the version, which adding a public share to a
	 * folder raises.
	 */
	test('should undo an added user', async () => {
		const cert = Alice.certificate
		cert.privateKey = await getPrivateKey(Alice.privateKey)
		const metadata = await RootMetadata.createNew()
		await metadata.addUser(Alice.userId, cert)
		await metadata.export(cert)

		// sharing the folder as a public share raises the version to 2.1
		await metadata.addUser('s:share-token', Bob.certificate)
		expect(metadata.getUsers()).toEqual([Alice.userId, 's:share-token'])

		metadata.rollback()

		expect(metadata.getUsers()).toEqual([Alice.userId])

		const exported = await metadata.export(cert)
		expect(exported.metadata.version).toBe('2.0')
		expect(exported.metadata.users).toHaveLength(1)
		// the key the user can decrypt the metadata with survived the rollback
		expect(exported.metadata.users[0]!.encryptedMetadataKey).not.toBe('')
	})

	test('should undo marking the folder as deleted', async () => {
		const cert = Alice.certificate
		cert.privateKey = await getPrivateKey(Alice.privateKey)
		const metadata = await RootMetadata.createNew()
		await metadata.addUser(Alice.userId, cert)
		metadata.addFolder('uuid-1', 'kept')
		await metadata.export(cert)

		metadata.markAsDeleted()
		expect(metadata.listContents()).toEqual([])

		metadata.rollback()

		expect(metadata.listContents()).toEqual(['kept'])

		const exported = await metadata.export(cert)
		expect(exported.metadata.users).toHaveLength(1)
		// marking the folder as deleted also empties the file drop entries, and an
		// empty set of them is not the same as the none this folder ever had
		expect(exported.metadata.filedrop).toBe(undefined)
	})
})

export async function getPrivateKey(privateKeyJwk: JsonWebKey) {
	return await self.crypto.subtle.importKey('jwk', privateKeyJwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt'])
}
