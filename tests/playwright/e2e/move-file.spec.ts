/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/copy-move.ts'
import { readFile } from '../support/utils/dav.ts'
import { createFolderInEncryptedFolder, uploadFileToEncryptedFolder } from '../support/utils/e2ee.ts'
import { disableDefaultHomeContents } from '../support/utils/occ.ts'

const SOURCE_FILE = 'source-file.txt'
const KEPT_FILE = 'kept-file.txt'
const FILE_CONTENT = 'contents of the file that is moved around\n'

/**
 * A move of an encrypted file is a copy followed by a delete, so it has to get
 * two folders right instead of one: the file has to arrive under its name and
 * with its contents, and its entry has to be gone from the metadata of the folder
 * it came from. That metadata is the folder listing, so an entry left behind is
 * not a leftover nobody sees - it keeps claiming the name for a file that is not
 * there anymore, which is what makes the next file of that name in the folder end
 * up as "… (1)".
 *
 * Every test therefore keeps a second file in the source folder: a listing that
 * still has it is what tells "the entry of the moved file was removed" apart from
 * "the metadata was emptied or lost". And both sides are asserted after a reload,
 * i.e. against folders that were decrypted from scratch, so they are statements
 * about what reached the server.
 */
test.describe('moving files of encrypted folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	test('move a file within the same encrypted folder', async ({ copyMoveDialog, filesApp, mnemonic, page, encryptedFolder }) => {
		await createFolderInEncryptedFolder(page, filesApp, 'target-folder')
		await uploadFileToEncryptedFolder(page, filesApp, KEPT_FILE)
		await uploadFileToEncryptedFolder(page, filesApp, SOURCE_FILE, FILE_CONTENT)

		await filesApp.openMoveOrCopyDialog(SOURCE_FILE)
		await copyMoveDialog.moveToFolder('target-folder')

		// gone from the folder it was in, which still has its other contents
		await expect(filesApp.getFileOrFolder(SOURCE_FILE)).toHaveCount(0)
		await expect(filesApp.getFileOrFolderExactly(KEPT_FILE)).toBeVisible()

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder(SOURCE_FILE)).toHaveCount(0)
		await expect(filesApp.getFileOrFolderExactly(KEPT_FILE)).toBeVisible()

		// and in the target folder, by its name and with its contents
		await filesApp.openFolder('target-folder')
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()
		await expect(filesApp.getAllRows()).toHaveCount(1)
		expect(await filesApp.downloadFileContent(SOURCE_FILE)).toBe(FILE_CONTENT)
	})

	test('move a file from an unencrypted folder into an encrypted folder', async ({ copyMoveDialog, filesApp, mnemonic, encryptedFolder, unencryptedFolder }) => {
		await filesApp.navigateToHome()
		await filesApp.openFolder(unencryptedFolder)
		await filesApp.uploadTextFile(KEPT_FILE)
		await filesApp.uploadTextFile(SOURCE_FILE, FILE_CONTENT)

		await filesApp.openMoveOrCopyDialog(SOURCE_FILE)
		await copyMoveDialog.navigateToAllFiles()
		await copyMoveDialog.moveToFolder(encryptedFolder)

		// gone from the unencrypted folder it came from
		await expect(filesApp.getFileOrFolder(SOURCE_FILE)).toHaveCount(0)
		await expect(filesApp.getFileOrFolderExactly(KEPT_FILE)).toBeVisible()

		// and encrypted in the encrypted folder
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()
		await expect(filesApp.getAllRows()).toHaveCount(1)
		expect(await filesApp.downloadFileContent(SOURCE_FILE)).toBe(FILE_CONTENT)
	})

	// the `unencryptedFolder` fixture depends on `encryptedFolder`, so the app is
	// inside the encrypted folder when this starts
	test('move a file from an encrypted folder into an unencrypted folder', async ({ copyMoveDialog, filesApp, mnemonic, page, user, encryptedFolder, unencryptedFolder }) => {
		await uploadFileToEncryptedFolder(page, filesApp, KEPT_FILE)
		await uploadFileToEncryptedFolder(page, filesApp, SOURCE_FILE, FILE_CONTENT)

		await filesApp.openMoveOrCopyDialog(SOURCE_FILE)
		await copyMoveDialog.navigateToAllFiles()
		await copyMoveDialog.moveToFolder(unencryptedFolder)

		// gone from the encrypted folder, whose other contents are still listed
		await expect(filesApp.getFileOrFolder(SOURCE_FILE)).toHaveCount(0)
		await expect(filesApp.getFileOrFolderExactly(KEPT_FILE)).toBeVisible()

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder(SOURCE_FILE)).toHaveCount(0)
		await expect(filesApp.getFileOrFolderExactly(KEPT_FILE)).toBeVisible()

		await filesApp.navigateToHome()
		await filesApp.openFolder(unencryptedFolder)
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()
		await expect(filesApp.getAllRows()).toHaveCount(1)

		// it left the encrypted world: a client that knows nothing about end-to-end
		// encryption can read it under its name and gets the plain contents, i.e. it
		// is neither encrypted nor marked as encrypted anymore
		expect(await readFile(page.request, user, `${unencryptedFolder}/${SOURCE_FILE}`)).toBe(FILE_CONTENT)
	})

	test('move a file into another encrypted root folder', async ({ copyMoveDialog, filesApp, mnemonic, page, encryptedFolder, secondEncryptedFolder }) => {
		await uploadFileToEncryptedFolder(page, filesApp, KEPT_FILE)
		await uploadFileToEncryptedFolder(page, filesApp, SOURCE_FILE, FILE_CONTENT)

		await filesApp.openMoveOrCopyDialog(SOURCE_FILE)
		await copyMoveDialog.navigateToAllFiles()
		await copyMoveDialog.moveToFolder(secondEncryptedFolder)

		// gone from the encrypted folder it was in, which is otherwise untouched
		await expect(filesApp.getFileOrFolder(SOURCE_FILE)).toHaveCount(0)
		await expect(filesApp.getFileOrFolderExactly(KEPT_FILE)).toBeVisible()

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder(SOURCE_FILE)).toHaveCount(0)
		await expect(filesApp.getFileOrFolderExactly(KEPT_FILE)).toBeVisible()

		// and in the other one - re-encrypted with a metadata key it has nothing in
		// common with, as the two folders are separate roots
		await filesApp.reopenEncryptedFolder(secondEncryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()
		await expect(filesApp.getAllRows()).toHaveCount(1)
		expect(await filesApp.downloadFileContent(SOURCE_FILE)).toBe(FILE_CONTENT)
	})
})
