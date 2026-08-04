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
const FILE_CONTENT = 'contents of the file that is copied around\n'

/**
 * Copying a file the server cannot read has to be done by the browser: it
 * downloads and decrypts the file, encrypts it again with a key of its own and
 * uploads it - and only then adds it to the metadata of the receiving folder,
 * under its real name and with that key.
 *
 * Every test therefore asserts three things about the copy: that it is listed
 * under the name it had, that the folder holds nothing else - a copy stored under
 * the UUID the source has on the server would show up as its own row - and that
 * its contents come back out of it. The last one is what a name alone cannot say:
 * an entry that kept the name but not the matching key looks perfectly fine in
 * the list and only fails once something decrypts it.
 *
 * The assertions are made after a reload, i.e. against a folder that was
 * decrypted from scratch, so they are statements about what reached the server
 * and not about the list the browser still had in its store.
 *
 * Copying *out of* an encrypted folder is expected to fail for now, see
 * {@link KNOWN_ISSUE_1734}.
 */
test.describe('copying files of encrypted folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	/**
	 * The copy arrives under the UUID the source is stored under instead of under
	 * its name: https://github.com/nextcloud/end_to_end_encryption/issues/1734
	 *
	 * The files app addresses the destination of a copy by the *basename* of the
	 * source node, which for an encrypted file is that UUID. The MOVE interceptor
	 * looks the real name up in the metadata and rewrites the destination with it,
	 * the COPY interceptor only does so for folders - so a copied file keeps the
	 * UUID as its name: in the metadata of an encrypted destination, and as the
	 * name on disk of an unencrypted one (issue 1842).
	 *
	 * These tests therefore assert what *should* happen and are expected to fail
	 * until that is fixed. Remove the annotation with the fix - Playwright reports
	 * a test that unexpectedly passes as a failure, so it will point here.
	 */
	const KNOWN_ISSUE_1734 = 'the copy is named after the UUID of the source, see issue #1734'

	test('copy a file within the same encrypted folder', async ({ copyMoveDialog, filesApp, mnemonic, page, encryptedFolder }) => {
		test.fail(true, KNOWN_ISSUE_1734)

		await createFolderInEncryptedFolder(page, filesApp, 'target-folder')
		await uploadFileToEncryptedFolder(page, filesApp, SOURCE_FILE, FILE_CONTENT)

		await filesApp.openMoveOrCopyDialog(SOURCE_FILE)
		await copyMoveDialog.copyToFolder('target-folder')

		// the original stays where it was
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()

		// and the copy is in the target folder, by its name and with its contents
		await filesApp.openFolder('target-folder')
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()
		await expect(filesApp.getAllRows()).toHaveCount(1)
		expect(await filesApp.downloadFileContent(SOURCE_FILE)).toBe(FILE_CONTENT)
	})

	test('copy a file from an unencrypted folder into an encrypted folder', async ({ copyMoveDialog, filesApp, mnemonic, encryptedFolder, unencryptedFolder }) => {
		await filesApp.navigateToHome()
		await filesApp.openFolder(unencryptedFolder)
		await filesApp.uploadTextFile(SOURCE_FILE, FILE_CONTENT)

		await filesApp.openMoveOrCopyDialog(SOURCE_FILE)
		await copyMoveDialog.navigateToAllFiles()
		await copyMoveDialog.copyToFolder(encryptedFolder)

		// the original stays where it was, unencrypted
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()

		// and the copy is encrypted in the encrypted folder
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()
		await expect(filesApp.getAllRows()).toHaveCount(1)
		expect(await filesApp.downloadFileContent(SOURCE_FILE)).toBe(FILE_CONTENT)
	})

	// the `unencryptedFolder` fixture depends on `encryptedFolder`, so the app is
	// inside the encrypted folder when this starts
	test('copy a file from an encrypted folder into an unencrypted folder', async ({ copyMoveDialog, filesApp, page, user, unencryptedFolder }) => {
		test.fail(true, KNOWN_ISSUE_1734)

		await uploadFileToEncryptedFolder(page, filesApp, SOURCE_FILE, FILE_CONTENT)

		await filesApp.openMoveOrCopyDialog(SOURCE_FILE)
		await copyMoveDialog.navigateToAllFiles()
		await copyMoveDialog.copyToFolder(unencryptedFolder)

		// the original stays in the encrypted folder
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()

		await filesApp.navigateToHome()
		await filesApp.openFolder(unencryptedFolder)
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()
		await expect(filesApp.getAllRows()).toHaveCount(1)

		// the copy left the encrypted world: a client that knows nothing about
		// end-to-end encryption can read it under its name and gets the plain
		// contents, i.e. it is neither encrypted nor marked as encrypted anymore
		expect(await readFile(page.request, user, `${unencryptedFolder}/${SOURCE_FILE}`)).toBe(FILE_CONTENT)
	})

	test('copy a file into another encrypted root folder', async ({ copyMoveDialog, filesApp, mnemonic, page, encryptedFolder, secondEncryptedFolder }) => {
		test.fail(true, KNOWN_ISSUE_1734)

		await uploadFileToEncryptedFolder(page, filesApp, SOURCE_FILE, FILE_CONTENT)

		await filesApp.openMoveOrCopyDialog(SOURCE_FILE)
		await copyMoveDialog.navigateToAllFiles()
		await copyMoveDialog.copyToFolder(secondEncryptedFolder)

		// the original stays in the encrypted folder it was in
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()

		// and the copy is in the other one - re-encrypted with a metadata key it
		// has nothing in common with, as the two folders are separate roots
		await filesApp.reopenEncryptedFolder(secondEncryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolderExactly(SOURCE_FILE)).toBeVisible()
		await expect(filesApp.getAllRows()).toHaveCount(1)
		expect(await filesApp.downloadFileContent(SOURCE_FILE)).toBe(FILE_CONTENT)
	})
})
