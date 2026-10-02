/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Page } from '@playwright/test'
import type { FilesAppPage } from '../support/sections/FilesAppPage.ts'

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/encrypted-folder.ts'
import { createFolderInEncryptedFolder, uploadFileToEncryptedFolder, withEncryptedFolderUpdate } from '../support/utils/e2ee.ts'
import { disableDefaultHomeContents } from '../support/utils/occ.ts'

/**
 * The files app addresses the nodes of an encrypted folder by the uuid they are
 * stored as on the server, so it asks for a copy or move to a destination of
 * that same name. These tests make sure the node arrives under its real name.
 */
test.describe('copying and moving out of encrypted folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	let unencryptedFolder: string

	test.beforeEach(async ({ filesApp, mnemonic, encryptedFolder }) => {
		unencryptedFolder = `unencrypted-${globalThis.crypto.randomUUID()}`

		await filesApp.openFilesApp()
		await createUnencryptedFolder(filesApp, unencryptedFolder)
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
	})

	test('copy a file to an unencrypted folder', async ({ filesApp, page, e2eeAccount, mnemonic, encryptedFolder }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'copied-file.txt', 'secret content\n')

		const dialog = await filesApp.openMoveCopyDialog('copied-file.txt')
		await dialog.openFolderInRoot(unencryptedFolder)
		await dialog.copy()

		await filesApp.openFilesApp()
		await filesApp.openFolder(unencryptedFolder)
		await expect(filesApp.getFileOrFolder('copied-file.txt')).toBeVisible()
		// the copy is not encrypted anymore
		expect(await getFileContent(page, e2eeAccount.user.userId, `${unencryptedFolder}/copied-file.txt`))
			.toBe('secret content\n')

		// and the original is kept
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('copied-file.txt')).toBeVisible()
	})

	test('copy a folder to an unencrypted folder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await createFolderInEncryptedFolder(page, filesApp, 'copied-folder')

		const dialog = await filesApp.openMoveCopyDialog('copied-folder')
		await dialog.openFolderInRoot(unencryptedFolder)
		await dialog.copy()

		await filesApp.openFilesApp()
		await filesApp.openFolder(unencryptedFolder)
		await expect(filesApp.getFileOrFolder('copied-folder')).toBeVisible()

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('copied-folder')).toBeVisible()
	})

	test('move a file to an unencrypted folder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'kept-file.txt')
		await uploadFileToEncryptedFolder(page, filesApp, 'moved-file.txt')

		const dialog = await filesApp.openMoveCopyDialog('moved-file.txt')
		await dialog.openFolderInRoot(unencryptedFolder)
		// removing the source rewrites the metadata of the encrypted folder
		await withEncryptedFolderUpdate(page, () => dialog.move())

		await filesApp.openFilesApp()
		await filesApp.openFolder(unencryptedFolder)
		await expect(filesApp.getFileOrFolder('moved-file.txt')).toBeVisible()

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()
		await expect(filesApp.getFileOrFolder('moved-file.txt')).toHaveCount(0)
	})
})

test.describe('copying within encrypted folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	test('copy a file to a nested folder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await createFolderInEncryptedFolder(page, filesApp, 'nested-folder')
		await uploadFileToEncryptedFolder(page, filesApp, 'copied-file.txt')

		const dialog = await filesApp.openMoveCopyDialog('copied-file.txt')
		await dialog.openFolder('nested-folder')
		// the upload of the copy rewrites the metadata of the nested folder
		await withEncryptedFolderUpdate(page, () => dialog.copy())

		// decrypted from scratch, as the name of the copy lives in the metadata
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('copied-file.txt')).toBeVisible()
		await filesApp.openFolder('nested-folder')
		await expect(filesApp.getFileOrFolder('copied-file.txt')).toBeVisible()
	})
})

/**
 * Create a regular folder in the folder the files app is navigated into.
 *
 * @param filesApp - The files app, navigated outside of any encrypted folder
 * @param name - Name of the folder to create
 */
async function createUnencryptedFolder(filesApp: FilesAppPage, name: string): Promise<void> {
	await filesApp.openNewMenu()
		.then((menu) => menu.createNewFolder())
		.then((dialog) => dialog.createFolder(name))
	await expect(filesApp.getFileOrFolder(name)).toBeVisible()
}

/**
 * Read a file as it is stored on the server, bypassing the app.
 *
 * @param page - Page whose session to use
 * @param userId - Owner of the file
 * @param path - Path of the file relative to the home folder of the owner
 */
async function getFileContent(page: Page, userId: string, path: string): Promise<string> {
	const response = await page.request.get(`/remote.php/dav/files/${userId}/${path}`, {
		headers: { 'OCS-APIRequest': 'true' },
	})
	expect(response.ok()).toBe(true)
	return response.text()
}
