/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, mergeTests } from '@playwright/test'
import { test as filesTest } from '../support/fixtures/files-app.ts'
import { test as settingsTest } from '../support/fixtures/personal-settings.ts'
import { test as randomUserTest } from '../support/fixtures/random-user.ts'

const test = mergeTests(randomUserTest, filesTest, settingsTest)

test('No new-menu entry if browser support is disabled', async ({ filesApp }) => {
	await filesApp.openFilesApp()
	await expect(filesApp.buttonNewMenuLocator).toBeVisible()

	const newMenu = await filesApp.openNewMenu()
	await expect(newMenu.menuLocator).toBeVisible()
	await expect(newMenu.getNewEncryptedFolderEntry()).toHaveCount(0)
})

test.describe('with enabled browser e2ee', () => {
	test.beforeEach(async ({ filesApp, personalSettings }) => {
		await personalSettings.openSettingsPage()
		await personalSettings.enableBrowserE2ee()
		await filesApp.openFilesApp()
	})

	test('Can see the new-menu entry', async ({ filesApp }) => {
		await expect(filesApp.buttonNewMenuLocator).toBeVisible()

		const newMenu = await filesApp.openNewMenu()
		await expect(newMenu.menuLocator).toBeVisible()
		await expect(newMenu.getNewEncryptedFolderEntry()).toBeVisible()
	})

	test('Initial E2EE setup', async ({ filesApp }) => {
		// See the folder does not exist
		await expect(filesApp.getFileOrFolder('test-folder')).toHaveCount(0)

		await expect(filesApp.buttonNewMenuLocator).toBeVisible()
		const newMenu = await filesApp.openNewMenu()
		await expect(newMenu.getNewEncryptedFolderEntry()).toBeVisible()
		const dialog = await newMenu.createNewE2eeFolder()

		await expect(dialog.buttonSetupEncryption).toBeVisible()
		await expect(dialog.buttonSetupEncryption).not.toBeDisabled()
		await dialog.buttonSetupEncryption.click()

		// see the recovery phrase
		await expect(dialog.codeRecoveryPhrase).toBeVisible()
		await expect(dialog.codeRecoveryPhrase).toHaveText(/(\w+ ){11}\w+/)

		// see the count down
		await expect(dialog.buttonContinue).toBeVisible()
		await expect(dialog.buttonContinue).toBeDisabled()
		await Promise.all([
			expect(dialog.buttonContinue).toHaveText('Continue (4)'),
			expect(dialog.buttonContinue).toHaveText('Continue (3)'),
			expect(dialog.buttonContinue).toHaveText('Continue (2)'),
			expect(dialog.buttonContinue).toHaveText('Continue (1)'),
		])
		await expect(dialog.buttonContinue).toHaveText('Continue')
		await expect(dialog.buttonContinue).not.toBeDisabled() // now the button is enabled

		// continue
		await dialog.buttonContinue.click()

		// see the folder name input
		await expect(dialog.inputFolderName).toBeVisible()
		// see that the create button is disabled
		await expect(dialog.buttonCreateFolder).toBeDisabled()
		// can type and continue
		await dialog.inputFolderName.fill('test-folder')
		await expect(dialog.buttonCreateFolder).not.toBeDisabled()
		await dialog.buttonCreateFolder.click()

		// see the dialog is closed
		await expect(dialog.dialogLocator).toHaveCount(0)
		// the folder was created
		const row = filesApp.getFileOrFolder('test-folder')
		await expect(row).toBeVisible()
		// see its not pending (in that case a size is shown) and has modification time
		await expect(row.getByRole('cell', { name: /0 kb/i })).toBeVisible()
		await expect(row.getByRole('cell', { name: /few seconds ago/i })).toBeVisible()
	})
})
