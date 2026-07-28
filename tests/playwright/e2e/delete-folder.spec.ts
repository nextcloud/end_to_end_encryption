/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/encrypted-folder.ts'
import { createEncryptedRootFolder, withEncryptedFolderUpdate } from '../support/utils/e2ee.ts'
import { disableDefaultHomeContents } from '../support/utils/occ.ts'

test.describe('deleting subfolders', () => {
	test.beforeAll(disableDefaultHomeContents)

	test('delete a subfolder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		// two of them, so the assertions below can tell "the folder is gone" apart
		// from "the list did not render" - deleting rewrites the metadata of the
		// parent, which is where the remaining entry could get lost as well
		for (const name of ['kept-folder', 'deleted-folder']) {
			await withEncryptedFolderUpdate(page, () => filesApp.openNewMenu()
				.then((menu) => menu.createNewFolder())
				.then((dialog) => dialog.createFolder(name)))
		}
		await expect(filesApp.getFileOrFolder('deleted-folder')).toBeVisible()

		await withEncryptedFolderUpdate(page, () => filesApp.deleteFileOrFolder('deleted-folder'))

		// gone from the list, and the sibling untouched
		await expect(filesApp.getFileOrFolder('deleted-folder')).toHaveCount(0)
		await expect(filesApp.getFileOrFolder('kept-folder')).toBeVisible()

		// still gone once the folder is decrypted from scratch
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('kept-folder')).toBeVisible()
		await expect(filesApp.getFileOrFolder('deleted-folder')).toHaveCount(0)
	})

	test('delete a subfolder that has contents', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await withEncryptedFolderUpdate(page, () => filesApp.openNewMenu()
			.then((menu) => menu.createNewFolder())
			.then((dialog) => dialog.createFolder('deleted-folder')))

		await filesApp.openFileOrFolder('deleted-folder')
		await filesApp.waitForListLoaded()
		await withEncryptedFolderUpdate(page, () => filesApp.openNewMenu()
			.then((menu) => menu.createNewFolder())
			.then((dialog) => dialog.createFolder('nested-folder')))
		await expect(filesApp.getFileOrFolder('nested-folder')).toBeVisible()

		// delete the parent of the nested folder, from the encrypted root
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await withEncryptedFolderUpdate(page, () => filesApp.deleteFileOrFolder('deleted-folder'))

		await expect(filesApp.getFileOrFolder('deleted-folder')).toHaveCount(0)

		// the encrypted folder is still readable, i.e. its metadata survived
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.buttonNewMenuLocator).toBeVisible()
		await expect(filesApp.getFileOrFolder('deleted-folder')).toHaveCount(0)
	})
})

test.describe('deleting encrypted root folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	/**
	 * Unlike the contents of an encrypted folder - which are stored under a UUID
	 * and only carry their real name in the metadata - the name of an encrypted
	 * root folder is the name on the server. It is therefore the one folder name
	 * that travels through URL encoding on every WebDAV request, and the app has
	 * to look it up by the very same name it stored it under.
	 */
	test('delete a folder with a space in its name', async ({ filesApp, page, mnemonic }) => {
		const name = `folder - ${globalThis.crypto.randomUUID()}`

		await filesApp.openFilesApp()
		await createEncryptedRootFolder(filesApp, name, mnemonic)

		// reloaded before deleting: the row of a just created encrypted folder is
		// added to the list without its real permissions, so it has no delete action
		await filesApp.openFilesApp()
		await expect(filesApp.getFileOrFolder(name)).toBeVisible()

		await withEncryptedFolderUpdate(page, () => filesApp.deleteFileOrFolder(name, mnemonic))

		// still gone after a reload, i.e. it is gone on the server and not just
		// dropped from the list the browser was holding
		await filesApp.openFilesApp()
		await expect(filesApp.getFileOrFolder(name)).toHaveCount(0)
	})

	test.describe('with a space in the encrypted folder name', () => {
		test.use({ encryptedFolderPrefix: 'folder - ' })

		test('delete a subfolder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
			await withEncryptedFolderUpdate(page, () => filesApp.openNewMenu()
				.then((menu) => menu.createNewFolder())
				.then((dialog) => dialog.createFolder('deleted-folder')))
			await expect(filesApp.getFileOrFolder('deleted-folder')).toBeVisible()

			await withEncryptedFolderUpdate(page, () => filesApp.deleteFileOrFolder('deleted-folder'))

			// still gone once the folder is decrypted from scratch
			await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
			await expect(filesApp.getFileOrFolder('deleted-folder')).toHaveCount(0)
		})
	})
})
