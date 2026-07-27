/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'

import { createRandomUser, login } from '@nextcloud/e2e-test-server/playwright'
import { test as base } from '@playwright/test'

/** How long to back off before retrying a failed setup round trip. */
const RETRY_DELAY = 800

/**
 * This test fixture ensures a new random user is created and used for the test (current page).
 *
 * Both steps talk to the container — creating the user shells out to `occ`, and
 * logging in costs three requests — and either can fail outright while the CI
 * machine is busy, so both are retried once before failing the test.
 */
export const test = base.extend<{ user: User }>({
	// the empty pattern is how Playwright is told this fixture has no dependencies
	// eslint-disable-next-line no-empty-pattern
	user: async ({}, use) => {
		let user: User
		try {
			user = await createRandomUser()
		} catch (error) {
			console.info('Failed to create random user, retrying', error)
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
			user = await createRandomUser()
		}
		await use(user)
	},

	page: async ({ browser, baseURL, user }, use) => {
		// Important: make sure we authenticate in a clean environment by unsetting storage state.
		const page = await browser.newPage({
			storageState: undefined,
			baseURL,
		})

		try {
			await login(page.request, user)
		} catch (error) {
			console.info('Failed to authenticate as random user, retrying', error)
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
			await login(page.request, user)
		}

		await use(page)
		await page.close()
	},
})
