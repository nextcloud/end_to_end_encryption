/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { runOcc } from '@nextcloud/e2e-test-server/docker'
import { expect, mergeTests } from '@playwright/test'
import { test as e2eeTest } from '../support/fixtures/e2ee-user.ts'
import { test as filesTest } from '../support/fixtures/files-app.ts'
import { test as settingsTest } from '../support/fixtures/personal-settings.ts'

const test = mergeTests(e2eeTest, filesTest, settingsTest)

test.describe('creating subfolders', () => {
	test.beforeAll(async () => {
		await runOcc(['config:system:set', 'skeletondirectory', '--value='], { verbose: true })
		await runOcc(['config:system:set', 'templatedirectory', '--value='], { verbose: true })
	})

	test('create a subfolder', async ({ filesApp, page, mnemonic }) => {
		const folderName = globalThis.crypto.randomUUID()

		await filesApp.openFilesApp()
		await filesApp.openNewMenu()
			.then((menu) => menu.createNewE2eeFolder())
			.then((dialog) => dialog.fillMnemonic(mnemonic))
			.then((dialog) => dialog.createFolder(folderName))
		await filesApp.openFileOrFolder(folderName)

		// create subfolder
		const metadataUpdate = page.waitForResponse((res) => res.request().method() === 'PUT'
			&& res.url().includes('/ocs/v2.php/apps/end_to_end_encryption/api/v2/meta-data/'))
		await filesApp.openNewMenu()
			.then((menu) => menu.createNewFolder())
			.then((dialog) => dialog.createFolder('subfolder'))
		await metadataUpdate

		// see subfolder is created
		await expect(filesApp.getFileOrFolder('subfolder')).toBeVisible()

		await filesApp.openFilesApp()
		await filesApp.openFileOrFolder(folderName)
		await filesApp.getMnemonicDialog()
			.fillAndSubmit(mnemonic)

		// still visible after reload
		await expect(filesApp.getFileOrFolder('subfolder')).toBeVisible()
	})

	test('create a sub-subfolder', async ({ filesApp, page, mnemonic }) => {
		const folderName = globalThis.crypto.randomUUID()

		await filesApp.openFilesApp()
		await filesApp.openNewMenu()
			.then((menu) => menu.createNewE2eeFolder())
			.then((dialog) => dialog.fillMnemonic(mnemonic))
			.then((dialog) => dialog.createFolder(folderName))
		await filesApp.openFileOrFolder(folderName)

		// create subfolder
		await filesApp.openNewMenu()
			.then((menu) => menu.createNewFolder())
			.then((dialog) => dialog.createFolder('subfolder'))
		await page.waitForResponse((res) => res.request().method() === 'PUT'
			&& res.url().includes('/ocs/v2.php/apps/end_to_end_encryption/api/v2/meta-data/'))

		// create sub-subfolder
		await filesApp.openFileOrFolder('subfolder')
		await filesApp.openNewMenu()
			.then((menu) => menu.createNewFolder())
			.then((dialog) => dialog.createFolder('sub-subfolder'))
		await page.waitForResponse((res) => res.request().method() === 'PUT'
			&& res.url().includes('/ocs/v2.php/apps/end_to_end_encryption/api/v2/meta-data/'))

		// see sub-subfolder is created
		await expect(filesApp.getFileOrFolder('sub-subfolder')).toBeVisible()

		await filesApp.openFilesApp()
		await filesApp.openFileOrFolder(folderName)
		await filesApp.getMnemonicDialog()
			.fillAndSubmit(mnemonic)

		// still visible after reload
		await expect(filesApp.getFileOrFolder('subfolder')).toBeVisible()
		await filesApp.openFileOrFolder('subfolder')
		await expect(filesApp.getFileOrFolder('sub-subfolder')).toBeVisible()
	})
})
