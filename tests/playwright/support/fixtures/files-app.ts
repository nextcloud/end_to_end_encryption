/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { test as baseTest } from '@playwright/test'
import { FilesAppPage } from '../sections/FilesAppPage.ts'

interface FilesAppFixture {
	filesApp: FilesAppPage
}

export const test = baseTest.extend<FilesAppFixture>({
	filesApp: async ({ page }, use) => {
		const filesApp = new FilesAppPage(page)
		await use(filesApp)
	},
})
