/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'

import { base64ToBuffer } from './utils.ts'
import { sha256Hash } from './crypto.ts'

test('sha256Hash correctly returns a hex string', async () => {
	const buffer = 'KPJswKr0owRxrcj4/3SRIw=='
	const hash = '9a60be9846978884033fcdfb978fbdd428221b20583bca6bfcb425f1b540152a'
	const computedHash = await sha256Hash(base64ToBuffer(buffer))
	expect(computedHash).toEqual(hash)
})
