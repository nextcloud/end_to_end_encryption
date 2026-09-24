/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/encrypted-folder.ts'
import { FileDropPage } from '../support/sections/FileDropPage.ts'
import { withEncryptedFolderUpdate } from '../support/utils/e2ee.ts'
import { createFileDropShare } from '../support/utils/sharing.ts'

/** Interval in which the files app handles pending tasks like file drop migrations */
const TASKS_INTERVAL = 60 * 1000

test.describe('file drop migration', () => {
	test('migrated entries are shown without reloading', async ({ browser, baseURL, filesApp, page, mnemonic, encryptedFolder }) => {
		const token = await createFileDropShare(page.request, `/${encryptedFolder}`)

		const anonymousContext = await browser.newContext({ storageState: undefined, baseURL })
		const fileDrop = new FileDropPage(await anonymousContext.newPage())
		await fileDrop.open(token)
		await fileDrop.uploadTextFile('dropped-file.txt')
		await anonymousContext.close()

		// the clock must be installed before the files app loads to control the tasks interval
		await page.clock.install()
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		// file drop entries are hidden until they are migrated
		await expect(filesApp.getFileOrFolder('dropped-file.txt')).toHaveCount(0)

		await page.clock.fastForward(TASKS_INTERVAL)
		await withEncryptedFolderUpdate(page, () => filesApp.getFileDropMigrationDialog().migrateNow())

		await expect(filesApp.getFileOrFolder('dropped-file.txt')).toBeVisible()
	})
})
