/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/encrypted-folder.ts'
import { createFolderInEncryptedFolder, uploadFileToEncryptedFolder, withEncryptedFolderUpdate } from '../support/utils/e2ee.ts'
import { disableDefaultHomeContents } from '../support/utils/occ.ts'

/**
 * Deleting a file only removes its entry from the metadata of the folder it is
 * in - the folder itself has to survive untouched. Every test therefore keeps a
 * sibling around and decrypts the folder from scratch afterwards: a listing that
 * still has the sibling is the proof that the metadata was rewritten correctly
 * and not, say, emptied or marked as deleted.
 */
test.describe('deleting files in encrypted folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	test('delete a file', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'kept-file.txt')
		await uploadFileToEncryptedFolder(page, filesApp, 'deleted-file.txt')

		await withEncryptedFolderUpdate(page, () => filesApp.deleteFileOrFolder('deleted-file.txt'))

		// gone from the list, and the sibling untouched
		await expect(filesApp.getFileOrFolder('deleted-file.txt')).toHaveCount(0)
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()

		// still gone once the folder is decrypted from scratch
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()
		await expect(filesApp.getFileOrFolder('deleted-file.txt')).toHaveCount(0)
	})

	test('delete a file in a nested folder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await createFolderInEncryptedFolder(page, filesApp, 'nested-folder')
		await filesApp.openFolder('nested-folder')

		await uploadFileToEncryptedFolder(page, filesApp, 'kept-file.txt')
		await uploadFileToEncryptedFolder(page, filesApp, 'deleted-file.txt')

		await withEncryptedFolderUpdate(page, () => filesApp.deleteFileOrFolder('deleted-file.txt'))

		await expect(filesApp.getFileOrFolder('deleted-file.txt')).toHaveCount(0)
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()

		// the nested folder is only reachable through its parent, so this asserts
		// that the metadata of both of them survived
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await filesApp.openFolder('nested-folder')
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()
		await expect(filesApp.getFileOrFolder('deleted-file.txt')).toHaveCount(0)
	})

	test('delete two files in sequence', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		for (const name of ['kept-file.txt', 'first-file.txt', 'second-file.txt']) {
			await uploadFileToEncryptedFolder(page, filesApp, name)
		}

		// The second delete is the point of this test: it has to find the folder in
		// the state the first one left it in - both in the metadata on the server and
		// in what the app kept in memory - which is what deleting the second file
		// through the same page load exercises.
		await withEncryptedFolderUpdate(page, () => filesApp.deleteFileOrFolder('first-file.txt'))
		await withEncryptedFolderUpdate(page, () => filesApp.deleteFileOrFolder('second-file.txt'))

		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()
		await expect(filesApp.getFileOrFolder('first-file.txt')).toHaveCount(0)
		await expect(filesApp.getFileOrFolder('second-file.txt')).toHaveCount(0)
	})
})
