/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/encrypted-folder.ts'
import { withEncryptedFolderUpdate } from '../support/utils/e2ee.ts'
import { disableDefaultHomeContents } from '../support/utils/occ.ts'

test.describe('creating subfolders', () => {
	test.beforeAll(disableDefaultHomeContents)

	test('create a subfolder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await withEncryptedFolderUpdate(page, () => filesApp.openNewMenu()
			.then((menu) => menu.createNewFolder())
			.then((dialog) => dialog.createFolder('subfolder')))

		// see subfolder is created
		await expect(filesApp.getFileOrFolder('subfolder')).toBeVisible()

		// still visible after reload
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('subfolder')).toBeVisible()
	})

	test('create a sub-subfolder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await withEncryptedFolderUpdate(page, () => filesApp.openNewMenu()
			.then((menu) => menu.createNewFolder())
			.then((dialog) => dialog.createFolder('subfolder')))

		await filesApp.openFileOrFolder('subfolder')
		await filesApp.waitForListLoaded()
		await withEncryptedFolderUpdate(page, () => filesApp.openNewMenu()
			.then((menu) => menu.createNewFolder())
			.then((dialog) => dialog.createFolder('sub-subfolder')))

		// see sub-subfolder is created
		await expect(filesApp.getFileOrFolder('sub-subfolder')).toBeVisible()

		// still visible after reload
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('subfolder')).toBeVisible()
		await filesApp.openFileOrFolder('subfolder')
		await expect(filesApp.getFileOrFolder('sub-subfolder')).toBeVisible()
	})
})
