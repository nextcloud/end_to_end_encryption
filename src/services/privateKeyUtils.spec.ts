/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'

import { decryptPrivateKey } from './privateKeyUtils.ts'
import { mnemonic, privateKeyInfo } from '../../__tests__/consts.spec.ts'

test('Can decrypt a real private key', async () => {
	const privateKey = await decryptPrivateKey(privateKeyInfo, mnemonic)
	expect(privateKey.type).toEqual('private')
})
