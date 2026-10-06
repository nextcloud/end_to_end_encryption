/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/encrypted-folder.ts'
import { disableDefaultHomeContents, setSystemConfig } from '../support/utils/occ.ts'

test.describe('email shares of encrypted folders', () => {
	test.beforeAll(async () => {
		await disableDefaultHomeContents()
		// the share mail must be sent successfully, otherwise the server removes the share again
		await setSystemConfig('mail_smtpmode', 'null')
	})

	// back to the parent of the encrypted folder without a reload, which would lock the key pair again
	test.beforeEach(async ({ filesApp, encryptedFolder }) => {
		await filesApp.page.goBack()
		await expect(filesApp.getFileOrFolder(encryptedFolder)).toBeVisible()
	})

	test('creates a view only email share', async ({ filesApp, encryptedFolder }) => {
		const email = 'alice@example.com'
		const sidebar = await filesApp.openSharingSidebar(encryptedFolder)
		const dialog = await sidebar.openEmailShareDialog()

		await dialog.inputEmail.fill(email)
		await dialog.selectViewOnly()
		await dialog.buttonCreate.click()

		await expect(dialog.getLinkSentNotice(email)).toBeVisible()
		await expect(dialog.textMnemonicNotice).toBeVisible()

		await dialog.close()
		await expect(sidebar.listLinkShares.getByRole('listitem').filter({ hasText: email })).toBeVisible()
	})

	test('creates an upload only email share', async ({ filesApp, encryptedFolder }) => {
		const email = 'bob@example.com'
		const sidebar = await filesApp.openSharingSidebar(encryptedFolder)
		const dialog = await sidebar.openEmailShareDialog()

		await dialog.inputEmail.fill(email)
		await expect(dialog.radioUploadOnly).toBeChecked()
		await dialog.buttonCreate.click()

		await expect(dialog.getLinkSentNotice(email)).toBeVisible()
		await expect(dialog.textMnemonicNotice).toHaveCount(0)

		await dialog.close()
		await expect(sidebar.listLinkShares.getByRole('listitem').filter({ hasText: email })).toBeVisible()
	})
})
