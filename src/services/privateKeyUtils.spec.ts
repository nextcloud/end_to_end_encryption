/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'

import { decryptPrivateKey } from './privateKeyUtils.ts'
import { adminMnemonic, adminPrivateKeyInfo, aliceMnemonic, alicePrivateKeyInfo } from '../../__tests__/consts.spec.ts'

test('Can decrypt admin\'s private key', async () => {
	const privateKey = await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic)
	expect(privateKey.type).toEqual('private')
})

test('Can decrypt alice\'s private key', async () => {
	const privateKey = await decryptPrivateKey(alicePrivateKeyInfo, aliceMnemonic)
	expect(privateKey.type).toEqual('private')
})
