/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/encrypted-folder.ts'
import { createFolderInEncryptedFolder, uploadFileToEncryptedFolder, watchUntokenizedDeletes, withEncryptedFolderUpdate, withEncryptedFolderUpdates } from '../support/utils/e2ee.ts'
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

/**
 * Deleting a multi-row selection is the same operation as deleting a single
 * file, only that the files app fires up to five of them at once against the
 * metadata of the same folder. These tests are about that folder ending up with
 * exactly the entries that were not selected - on the server as well as in what
 * the app kept in memory.
 */
test.describe('deleting several files at once', () => {
	test.beforeAll(disableDefaultHomeContents)

	test('delete a selection of files', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		const deleted = ['first-file.txt', 'second-file.txt', 'third-file.txt']
		for (const name of ['kept-file.txt', ...deleted]) {
			await uploadFileToEncryptedFolder(page, filesApp, name)
		}

		await filesApp.selectFilesOrFolders(...deleted)
		await withEncryptedFolderUpdates(page, deleted.length, () => filesApp.deleteSelection(deleted))

		// gone from the list, and the file that was not selected untouched
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()

		// decrypted from scratch, as a metadata that kept a deleted entry or lost the
		// kept one only shows here
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()
		for (const name of deleted) {
			await expect(filesApp.getFileOrFolder(name)).toHaveCount(0)
		}
	})

	test('delete a selection of files and folders', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await createFolderInEncryptedFolder(page, filesApp, 'kept-folder')
		await createFolderInEncryptedFolder(page, filesApp, 'deleted-folder')
		await uploadFileToEncryptedFolder(page, filesApp, 'kept-file.txt')
		await uploadFileToEncryptedFolder(page, filesApp, 'deleted-file.txt')

		// a folder takes an extra request under the same lock to drop its own
		// metadata, so a mixed selection races the two branches against each other
		const deleted = ['deleted-folder', 'deleted-file.txt']
		await filesApp.selectFilesOrFolders(...deleted)
		await withEncryptedFolderUpdates(page, deleted.length, () => filesApp.deleteSelection(deleted))

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('kept-folder')).toBeVisible()
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()
		for (const name of deleted) {
			await expect(filesApp.getFileOrFolder(name)).toHaveCount(0)
		}
	})

	test('delete the whole contents of a folder at once', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		const deleted = ['first-file.txt', 'second-file.txt', 'third-file.txt']
		for (const name of deleted) {
			await uploadFileToEncryptedFolder(page, filesApp, name)
		}

		await filesApp.selectFilesOrFolders(...deleted)
		await withEncryptedFolderUpdates(page, deleted.length, () => filesApp.deleteSelection(deleted))

		// emptying the folder may not take the folder itself with it
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		for (const name of deleted) {
			await expect(filesApp.getFileOrFolder(name)).toHaveCount(0)
		}
		await uploadFileToEncryptedFolder(page, filesApp, 'later-file.txt')

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('later-file.txt')).toBeVisible()
	})

	/**
	 * Ten files are more than the five deletes the files app has in flight at once,
	 * so unlike the selections above this also covers a delete starting while the
	 * folder is still being rewritten by an earlier one.
	 */
	test('delete ten files at once', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		// eleven uploads and ten deletes, each a full lock-write-unlock round trip
		test.slow()

		const deleted = Array.from({ length: 10 }, (_, index) => `file-${index}.txt`)
		for (const name of ['kept-file.txt', ...deleted]) {
			await uploadFileToEncryptedFolder(page, filesApp, name)
		}

		const untokenized = watchUntokenizedDeletes(page)
		await filesApp.selectFilesOrFolders(...deleted)
		await withEncryptedFolderUpdates(page, deleted.length, () => filesApp.deleteSelection(deleted))

		expect(untokenized).toEqual([])
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()
		for (const name of deleted) {
			await expect(filesApp.getFileOrFolder(name)).toHaveCount(0)
		}
	})
})
