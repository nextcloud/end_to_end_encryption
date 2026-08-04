/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'

import { createRandomUser, login } from '@nextcloud/e2e-test-server/playwright'
import { test as baseTest, expect } from '@playwright/test'
import { FilesAppPage } from '../sections/FilesAppPage.ts'
import { setBrowserE2eeEnabled } from '../utils/config.ts'
import { withRetry } from '../utils/retry.ts'

interface E2eeAccount {
	user: User
	mnemonic: string
}

/**
 * A user that has browser based end-to-end encryption enabled and its key pair
 * already generated, together with the recovery phrase needed to unlock it.
 *
 * Setting this up costs an RSA key generation plus 600k PBKDF2 rounds, so it is
 * done once per worker. Only the server side state is shared though - every test
 * logs in on its own: a browser session captured in one context and restored in
 * another is invalidated by the remember-me token rotation as soon as a second
 * context uses it, which surfaces as seemingly random 401s mid-test.
 */
export const test = baseTest.extend<{ mnemonic: string, user: User }, { e2eeAccount: E2eeAccount }>({
	mnemonic: ({ e2eeAccount }, use) => use(e2eeAccount.mnemonic),

	// exposed so a test can talk to the server as this account itself, e.g. to
	// read a file through WebDAV without this app in between
	user: ({ e2eeAccount }, use) => use(e2eeAccount.user),

	page: async ({ browser, baseURL, e2eeAccount }, use) => {
		// Important: make sure we authenticate in a clean environment by unsetting storage state.
		const page = await browser.newPage({ storageState: undefined, baseURL })
		await withRetry(() => login(page.request, e2eeAccount.user), 'authenticate as the e2ee user')

		await use(page)
		await page.close()
	},

	e2eeAccount: [async ({ browser }, use) => {
		const page = await browser.newPage({
			storageState: undefined,
			baseURL: baseTest.info().project.use.baseURL,
		})

		// Acquire a unique account so that multiple workers - and multiple team
		// members running the tests at the same time - cannot interfere.
		const user = await withRetry(() => createRandomUser(), 'create the e2ee user')
		await withRetry(() => login(page.request, user), 'authenticate as the e2ee user')

		// Enable browser based E2EE through the config API instead of the settings
		// page - it is delivered as initial state on page load, so it has to be set
		// before the files app is opened.
		await setBrowserE2eeEnabled(page.request, true)

		const filesApp = new FilesAppPage(page)
		await filesApp.openFilesApp()

		const newMenu = await filesApp.openNewMenu()
		await expect(newMenu.getNewEncryptedFolderEntry()).toBeVisible()
		const dialog = await newMenu.createNewE2eeFolder()

		// generate the key pair and remember the recovery phrase
		await dialog.setupEncryption()
		await expect(dialog.codeRecoveryPhrase).toHaveText(/(\w+ ){11}\w+/)
		const mnemonic = (await dialog.codeRecoveryPhrase.textContent())!
		await dialog.continueAfterCountdown()

		// the initial setup is only finished once the first encrypted folder exists
		await dialog.createFolder('test-folder')
		await expect(filesApp.getFileOrFolder('test-folder')).toBeVisible()

		await page.close()

		await use({ user, mnemonic })
	}, { scope: 'worker' }],
})
