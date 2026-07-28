/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { mergeTests } from '@playwright/test'
import { createEncryptedRootFolder } from '../utils/e2ee.ts'
import { test as e2eeUserTest } from './e2ee-user.ts'
import { test as filesAppTest } from './files-app.ts'

interface EncryptedFolderOptions {
	/**
	 * Prefix of the {@link EncryptedFolderFixture.encryptedFolder} name, so a test
	 * can pin down the characters it is about - for instance a space, which needs
	 * URL encoding on the way to the server. Declare it per spec file or per
	 * describe block with `test.use({ encryptedFolderPrefix: 'my prefix - ' })`.
	 */
	encryptedFolderPrefix: string
}

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
 * The name always ends in a random part because the folder lives in the home
 * directory of a user that is shared by all tests of a worker - a fixed name
 * would make the tests depend on their execution order.
 */
export const test = mergeTests(e2eeUserTest, filesAppTest)
	.extend<EncryptedFolderOptions & EncryptedFolderFixture>({
		encryptedFolderPrefix: ['', { option: true }],

		encryptedFolder: async ({ filesApp, mnemonic, encryptedFolderPrefix }, use) => {
			const name = `${encryptedFolderPrefix}${globalThis.crypto.randomUUID()}`

			await filesApp.openFilesApp()
			await createEncryptedRootFolder(filesApp, name, mnemonic)

			await filesApp.openFileOrFolder(name)
			await filesApp.waitForListLoaded()

			await use(name)
		},
	})
