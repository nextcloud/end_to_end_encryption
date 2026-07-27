/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { mergeTests } from '@playwright/test'
import { test as e2eeUserTest } from './e2ee-user.ts'
import { test as filesAppTest } from './files-app.ts'

interface EncryptedFolderFixture {
	/**
	 * Name of an empty encrypted folder that the files app is already navigated
	 * into, so a test can get straight to what it is about.
	 */
	encryptedFolder: string
}

/**
 * Provides a fresh encrypted folder, created through the UI by the e2ee user.
 *
 * The name is random because the folder lives in the home directory of a user
 * that is shared by all tests of a worker - a fixed name would make the tests
 * depend on their execution order.
 */
export const test = mergeTests(e2eeUserTest, filesAppTest).extend<EncryptedFolderFixture>({
	encryptedFolder: async ({ filesApp, mnemonic }, use) => {
		const name = globalThis.crypto.randomUUID()

		await filesApp.openFilesApp()
		await filesApp.openNewMenu()
			.then((menu) => menu.createNewE2eeFolder())
			// the key pair exists but this browser session has not unlocked it yet
			.then((dialog) => dialog.fillMnemonic(mnemonic))
			.then((dialog) => dialog.createFolder(name))

		await filesApp.openFileOrFolder(name)
		await filesApp.waitForListLoaded()

		await use(name)
	},
})
