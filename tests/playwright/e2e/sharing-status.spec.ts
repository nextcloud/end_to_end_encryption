/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { test } from '../support/fixtures/encrypted-folder.ts'
import { createEncryptedRootFolder } from '../support/utils/e2ee.ts'
import { disableDefaultHomeContents } from '../support/utils/occ.ts'

test.describe('sharing status of encrypted folders', () => {
	test.beforeAll(disableDefaultHomeContents)

	test('is shown for a new encrypted folder', async ({ filesApp, mnemonic }) => {
		const name = globalThis.crypto.randomUUID()
		await filesApp.openFilesApp()
		await createEncryptedRootFolder(filesApp, name, mnemonic)

		// without reload the row is built by the app, not from the server response
		await expect(filesApp.getSharingStatusAction(name)).toBeVisible()
		const sharingTab = await filesApp.openSharingTab(name)
		await expect(sharingTab.headingUserShares).toBeVisible()

		await filesApp.openFilesApp()
		await expect(filesApp.getSharingStatusAction(name)).toBeVisible()
	})

	test('shows an encrypted folder as shared', async ({ filesApp, mnemonic }) => {
		const name = globalThis.crypto.randomUUID()
		await filesApp.openFilesApp()
		await createEncryptedRootFolder(filesApp, name, mnemonic)
		await expect(filesApp.getSharingStatusAction(name)).not.toContainText('Shared')

		const sharingTab = await filesApp.openSharingTab(name)
		await sharingTab.createUploadOnlyLinkShare()

		// updated without reload
		await expect(filesApp.getSharingStatusAction(name)).toContainText('Shared')

		await filesApp.openFilesApp()
		await expect(filesApp.getSharingStatusAction(name)).toContainText('Shared')
	})
})
