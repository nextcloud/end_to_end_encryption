/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, expect, vi } from 'vitest'
import { test } from '../../__tests__/api-mock.ts'
import { adminMnemonic, rootFolderMetadata, subfolderMetadata } from '../../__tests__/consts.spec.ts'
import { state } from './state.ts'
import { destroyWebDavProxy, setupWebDavProxy } from './webDavProxy.ts'

vi.mock('@nextcloud/auth', async () => {
	return {
		getRequestToken() { return '' },
		onRequestTokenUpdate() {},
		getCurrentUser: () => {
			return {
				uid: 'admin',
			}
		},
	}
})

vi.mock('./mnemonicDialogs.ts', async () => ({ promptUserForMnemonic: () => Promise.resolve(adminMnemonic) }))

beforeEach(destroyWebDavProxy)

test("Correctly fetch user's private key", async () => {
	const userPrivateKey = await state.getUserPrivateKey()
	expect(userPrivateKey instanceof CryptoKey).toBeTruthy()
})

test("Correctly fetch server's public key", async () => {
	const serverPublicKeyPEM = await state.getServerPublicKeyPEM()
	expect(serverPublicKeyPEM).toBeTypeOf('string')
})

test('Correctly fetch root folder metadata', async () => {
	setupWebDavProxy()
	const metadata = await state.getMetadata('/remote.php/dav/files/admin/New%20folder')
	expect(metadata).toEqual(rootFolderMetadata)
})

test('Correctly fetch sub folder metadata', async () => {
	setupWebDavProxy()
	const metadata = await state.getMetadata('/remote.php/dav/files/admin/New%20folder/fa666d819a6c4315abba421172f0a0b1')
	expect(metadata).toEqual(subfolderMetadata)
})
