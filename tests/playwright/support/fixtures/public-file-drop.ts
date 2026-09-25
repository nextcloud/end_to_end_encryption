/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { test as baseTest } from '@playwright/test'
import { PublicFileDropPage } from '../sections/PublicFileDropPage.ts'

interface PublicFileDropFixture {
	/** Public file drop page in a separate browser context, so the guest has no session */
	publicFileDrop: PublicFileDropPage
}

export const test = baseTest.extend<PublicFileDropFixture>({
	publicFileDrop: async ({ browser, baseURL }, use) => {
		const context = await browser.newContext({ storageState: undefined, baseURL })
		const page = await context.newPage()

		await use(new PublicFileDropPage(page))
		await context.close()
	},
})
