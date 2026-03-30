/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'
import { generateUuid } from './uuid.ts'

test('generateUuid', () => {
	expect(generateUuid()).toMatch(/^[0-9a-f]{32}$/)
})
