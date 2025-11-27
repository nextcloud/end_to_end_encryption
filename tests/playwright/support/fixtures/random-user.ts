/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { createRandomUser, login } from '@nextcloud/e2e-test-server/playwright'
import { test as base } from '@playwright/test'

/**
 * This test fixture ensures a new random user is created and used for the test (current page)
 */
export const test = base.extend({
	page: async ({ browser, baseURL }, use) => {
		// Important: make sure we authenticate in a clean environment by unsetting storage state.
		const page = await browser.newPage({
			storageState: undefined,
			baseURL,
		})

		const user = await createRandomUser()
		await login(page.request, user)

		await use(page)
		await page.close()
	},
})
