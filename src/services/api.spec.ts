/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// sum.test.js
import { describe, expect, test } from 'vitest'
import { getPublicKeys } from './api.ts'

test('public key is correctly loaded', async () => {
	expect(await getPublicKeys()).toBe('')
})
