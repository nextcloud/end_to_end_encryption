/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, mergeTests } from '@playwright/test'
import { test as browserE2eeTest } from '../support/fixtures/browser-e2ee.ts'
import { test as filesTest } from '../support/fixtures/files-app.ts'

const test = mergeTests(browserE2eeTest, filesTest)

test('No new-menu entry if browser support is disabled', async ({ filesApp }) => {
	await filesApp.openFilesApp()
	await expect(filesApp.buttonNewMenuLocator).toBeVisible()

	const newMenu = await filesApp.openNewMenu()
	await expect(newMenu.getNewEncryptedFolderEntry()).toHaveCount(0)
})

test.describe('with enabled browser e2ee', () => {
	// Enabled through the config API instead of clicking through the settings
	// page: these tests are about what the feature does, not about turning it on.
	test.use({ browserE2ee: true })

	test.beforeEach(async ({ filesApp }) => {
		await filesApp.openFilesApp()
	})

	test('Can see the new-menu entry', async ({ filesApp }) => {
		await expect(filesApp.buttonNewMenuLocator).toBeVisible()

		const newMenu = await filesApp.openNewMenu()
		await expect(newMenu.getNewEncryptedFolderEntry()).toBeVisible()
	})

	test('Initial E2EE setup', async ({ filesApp }) => {
		// See the folder does not exist
		await expect(filesApp.getFileOrFolder('test-folder')).toHaveCount(0)

		const newMenu = await filesApp.openNewMenu()
		await expect(newMenu.getNewEncryptedFolderEntry()).toBeVisible()
		const dialog = await newMenu.createNewE2eeFolder()

		// generate the key pair and see the recovery phrase
		await dialog.setupEncryption()
		await expect(dialog.codeRecoveryPhrase).toHaveText(/(\w+ ){11}\w+/)

		// The count down keeps the user on the recovery phrase for a moment.
		// Label and disabled state are read as one sample so a tick boundary
		// cannot split them; the individual ticks are not asserted because each
		// only lasts a second and can elapse between two polls.
		const { disabled } = await dialog.waitForCountdown()
		expect(disabled).toBe(true)

		// once it ran out the button is enabled again and we can continue
		await dialog.continueAfterCountdown()

		// see the folder name input, name the folder and create it
		await dialog.createFolder('test-folder')

		// the folder was created
		const row = filesApp.getFileOrFolder('test-folder')
		await expect(row).toBeVisible()
		// see its not pending (in that case no size is shown) and has a modification time
		await expect(filesApp.getSizeCell(row)).toHaveText(/^0 [KM]?B$/i)
		// a slow runner can push this past "a few seconds", so accept minutes too
		await expect(filesApp.getModifiedCell(row)).toHaveText(/(seconds|minutes?) ago/i)
	})
})
