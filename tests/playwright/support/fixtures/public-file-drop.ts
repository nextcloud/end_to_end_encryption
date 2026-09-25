/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { test as baseTest } from '@playwright/test'
import { FileDropPage } from '../sections/FileDropPage.ts'

interface PublicFileDropFixture {
	/** File drop page in a separate browser context, so the guest has no session */
	fileDrop: FileDropPage
}

export const test = baseTest.extend<PublicFileDropFixture>({
	fileDrop: async ({ browser, baseURL }, use) => {
		const context = await browser.newContext({ storageState: undefined, baseURL })
		const page = await context.newPage()

		await use(new FileDropPage(page))
		await context.close()
	},
})
