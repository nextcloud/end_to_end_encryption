/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/encrypted-folder.ts'
import { createFolderInEncryptedFolder, uploadFileToEncryptedFolder, withEncryptedFolderUpdate } from '../support/utils/e2ee.ts'
import { disableDefaultHomeContents } from '../support/utils/occ.ts'

/**
 * Renaming inside an encrypted folder never moves anything on the server: the
 * name of a node lives in the metadata of its parent, while the node itself stays
 * stored under the uuid it was created with. Reopening the folder from scratch is
 * therefore what proves that the metadata was rewritten and not just the row.
 */
test.describe('renaming in encrypted folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	test('rename a file', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		await withEncryptedFolderUpdate(page, () => filesApp.renameFileOrFolder('file.txt', 'renamed.txt'))

		await expect(filesApp.getFileOrFolder('file.txt')).toHaveCount(0)

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('renamed.txt')).toBeVisible()
		await expect(filesApp.getFileOrFolder('file.txt')).toHaveCount(0)
	})

	test('rename a folder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await createFolderInEncryptedFolder(page, filesApp, 'subfolder')

		await withEncryptedFolderUpdate(page, () => filesApp.renameFileOrFolder('subfolder', 'renamed folder', 'folder'))

		await expect(filesApp.getFileOrFolder('subfolder')).toHaveCount(0)

		// the renamed folder is still the same folder, so its own contents survive
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('renamed folder')).toBeVisible()
		await filesApp.openFolder('renamed folder')
	})

	test('rename a file in a nested folder', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await createFolderInEncryptedFolder(page, filesApp, 'subfolder')
		await filesApp.openFolder('subfolder')
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		await withEncryptedFolderUpdate(page, () => filesApp.renameFileOrFolder('file.txt', 'renamed.txt'))

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await filesApp.openFolder('subfolder')
		await expect(filesApp.getFileOrFolder('renamed.txt')).toBeVisible()
		await expect(filesApp.getFileOrFolder('file.txt')).toHaveCount(0)
	})

	test('rename a file without touching its siblings', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'kept-file.txt')
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		await withEncryptedFolderUpdate(page, () => filesApp.renameFileOrFolder('file.txt', 'renamed.txt'))

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('renamed.txt')).toBeVisible()
		await expect(filesApp.getFileOrFolder('kept-file.txt')).toBeVisible()
	})

	test('rename the same file twice in sequence', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		// the second rename has to find the folder in the state the first one left
		// it in, both on the server and in what the app kept in memory
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		await withEncryptedFolderUpdate(page, () => filesApp.renameFileOrFolder('file.txt', 'once.txt'))
		await withEncryptedFolderUpdate(page, () => filesApp.renameFileOrFolder('once.txt', 'twice.txt'))

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('twice.txt')).toBeVisible()
		await expect(filesApp.getFileOrFolder('once.txt')).toHaveCount(0)
		await expect(filesApp.getFileOrFolder('file.txt')).toHaveCount(0)
	})
})

/**
 * Regression: renaming used to work off the `basename` of a node, which is the
 * uuid an encrypted node is stored under, instead of its real name.
 */
test.describe('renaming shows the real filename', { annotation: { type: 'issue', description: 'https://github.com/nextcloud/end_to_end_encryption/issues/2094' } }, () => {
	test.beforeAll(disableDefaultHomeContents)

	// Requesting the `encryptedFolder` fixture is what creates a fresh encrypted
	// folder and navigates into it, so every test below starts inside one.
	test.beforeEach(async ({ filesApp, encryptedFolder }) => {
		await expect(filesApp.getBreadcrumbs()).toContainText(encryptedFolder)
	})

	test('offers the real filename for editing, not the uuid', async ({ filesApp, page }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		const input = await filesApp.startRenaming('file.txt')

		await expect(input).toHaveValue('file.txt')
	})

	test('offers the real folder name for editing, not the uuid', async ({ filesApp, page }) => {
		await createFolderInEncryptedFolder(page, filesApp, 'subfolder')

		const input = await filesApp.startRenaming('subfolder', 'folder')

		await expect(input).toHaveValue('subfolder')
	})

	test('selects the name without its extension', async ({ filesApp, page }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		const input = await filesApp.startRenaming('file.txt')

		// the extension is kept out of the selection so that typing replaces the name only
		const selection = await input.evaluate((element: HTMLInputElement) => ({
			start: element.selectionStart,
			end: element.selectionEnd,
		}))
		expect(selection).toEqual({ start: 0, end: 'file'.length })
	})

	test('renames without reporting an error', async ({ filesApp, page }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		await withEncryptedFolderUpdate(page, () => filesApp.renameFileOrFolder('file.txt', 'renamed.txt'))

		// the failure of the report surfaced as a toast while the row stayed behind
		await expect(page.getByRole('alert')).toHaveCount(0)
		await expect(filesApp.getFileOrFolder('renamed.txt')).toBeVisible()
	})

	// Used to reach the server: the typed name was compared against the uuid, so it
	// never matched and the rename went through as a change.
	test('does nothing when the name is unchanged', async ({ filesApp, page }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		const moves: string[] = []
		page.on('request', (request) => {
			if (request.method() === 'MOVE') {
				moves.push(request.url())
			}
		})

		const input = await filesApp.startRenaming('file.txt')
		await input.press('Enter')

		await expect(filesApp.getRenameInput()).toHaveCount(0)
		await expect(filesApp.getFileOrFolder('file.txt')).toBeVisible()
		expect(moves).toEqual([])
	})

	// The app asks about the real extension - the uuid has none, so every rename
	// used to look like one that adds an extension.
	test('does not ask about the extension when it is kept', async ({ filesApp, page }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		await withEncryptedFolderUpdate(page, () => filesApp.renameFileOrFolder('file.txt', 'renamed.txt'))

		await expect(page.getByRole('dialog', { name: 'Change file extension' })).toHaveCount(0)
	})

	test('renames a file to a new extension', async ({ filesApp, page, mnemonic, encryptedFolder }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')

		await withEncryptedFolderUpdate(page, async () => {
			const input = await filesApp.startRenaming('file.txt')
			await input.fill('file.md')
			await input.press('Enter')

			await page.getByRole('dialog', { name: 'Change file extension' })
				.getByRole('button', { name: 'Use .md' })
				.click()
			await expect(filesApp.getFileOrFolder('file.md')).toBeVisible()
		})

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('file.md')).toBeVisible()
		await expect(filesApp.getFileOrFolder('file.txt')).toHaveCount(0)
	})
})
