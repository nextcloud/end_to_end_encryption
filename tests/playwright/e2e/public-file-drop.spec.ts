/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, mergeTests } from '@playwright/test'
import { test as encryptedFolderTest } from '../support/fixtures/encrypted-folder.ts'
import { test as publicFileDropTest } from '../support/fixtures/public-file-drop.ts'
import { disableDefaultHomeContents } from '../support/utils/occ.ts'

const test = mergeTests(encryptedFolderTest, publicFileDropTest)

test.describe('public file drop of encrypted folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	// back to the parent of the encrypted folder without a reload, which would lock the key pair again
	test.beforeEach(async ({ filesApp, encryptedFolder }) => {
		await filesApp.page.goBack()
		await expect(filesApp.getFileOrFolder(encryptedFolder)).toBeVisible()
	})

	test('shows the note to the recipient', async ({ filesApp, publicFileDrop, encryptedFolder }) => {
		const note = 'Please upload your\nfinal report here.'
		const sidebar = await filesApp.openSharingSidebar(encryptedFolder)
		const url = await sidebar.createFileDrop({ note })

		await publicFileDrop.open(url)
		await expect(publicFileDrop.getHeading(encryptedFolder)).toBeVisible()
		await expect(publicFileDrop.getNote()).toContainText('Please upload your')
		await expect(publicFileDrop.getNote()).toContainText('final report here.')
	})

	test('requires the password before uploading', async ({ filesApp, publicFileDrop, encryptedFolder, mnemonic }) => {
		const password = 'correct horse battery staple'
		const sidebar = await filesApp.openSharingSidebar(encryptedFolder)
		const url = await sidebar.createFileDrop({ password })

		await publicFileDrop.open(url)
		await expect(publicFileDrop.getHeading(encryptedFolder)).toHaveCount(0)

		await publicFileDrop.submitPassword('wrong password')
		await expect(publicFileDrop.textWrongPassword).toBeVisible()

		await publicFileDrop.submitPassword(password)
		await expect(publicFileDrop.getHeading(encryptedFolder)).toBeVisible()
		await expect(publicFileDrop.getNote()).toHaveCount(0)

		await publicFileDrop.uploadTextFile('dropped-file.txt')

		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		await expect(filesApp.getFileOrFolder('dropped-file.txt')).toBeVisible()
	})
})
