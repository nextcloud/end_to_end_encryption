/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, mergeTests } from '@playwright/test'
import { test as encryptedFolderTest } from '../support/fixtures/encrypted-folder.ts'
import { test as publicFileDropTest } from '../support/fixtures/public-file-drop.ts'
import { withEncryptedFolderUpdate } from '../support/utils/e2ee.ts'
import { disableDefaultHomeContents } from '../support/utils/occ.ts'

const test = mergeTests(encryptedFolderTest, publicFileDropTest)

/** Interval in which the files app handles pending tasks like file drop migrations */
const TASKS_INTERVAL = 60 * 1000

test.describe('public file drop of encrypted folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	// back to the parent of the encrypted folder without a reload, which would lock the key pair again
	test.beforeEach(async ({ filesApp, encryptedFolder }) => {
		await filesApp.page.goBack()
		await expect(filesApp.getFileOrFolder(encryptedFolder)).toBeVisible()
	})

	test('shows the note to the recipient', async ({ filesApp, fileDrop, encryptedFolder }) => {
		const note = 'Please upload your\nfinal report here.'
		const sidebar = await filesApp.openSharingSidebar(encryptedFolder)
		const token = await sidebar.createFileDrop({ note })

		await fileDrop.open(token)
		await expect(fileDrop.getHeading(encryptedFolder)).toBeVisible()
		await expect(fileDrop.getNote()).toContainText('Please upload your')
		await expect(fileDrop.getNote()).toContainText('final report here.')
	})

	test('requires the password before uploading', async ({ filesApp, page, fileDrop, encryptedFolder, mnemonic }) => {
		const password = 'correct horse battery staple'
		const sidebar = await filesApp.openSharingSidebar(encryptedFolder)
		const token = await sidebar.createFileDrop({ password })

		await fileDrop.openPasswordPrompt(token)
		await expect(fileDrop.getHeading(encryptedFolder)).toHaveCount(0)

		await fileDrop.submitPassword('wrong password')
		await expect(fileDrop.textWrongPassword).toBeVisible()

		await fileDrop.submitPassword(password)
		await expect(fileDrop.getHeading(encryptedFolder)).toBeVisible()
		await expect(fileDrop.getNote()).toHaveCount(0)

		await fileDrop.uploadTextFile('dropped-file.txt')

		// the clock must be installed before the files app loads to control the tasks interval
		await page.clock.install()
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await page.clock.fastForward(TASKS_INTERVAL)
		await withEncryptedFolderUpdate(page, () => filesApp.getFileDropMigrationDialog().migrateNow())

		await expect(filesApp.getFileOrFolder('dropped-file.txt')).toBeVisible()
	})
})
