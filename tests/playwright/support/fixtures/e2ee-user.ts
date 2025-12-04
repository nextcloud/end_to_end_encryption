/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'

import { createRandomUser, login } from '@nextcloud/e2e-test-server/playwright'
import { test as baseTest, expect } from '@playwright/test'
import { FilesAppPage } from '../sections/FilesAppPage.ts'
import { setBrowserE2eeEnabled } from '../utils/config.ts'

/** How long to back off before retrying a failed setup round trip. */
const RETRY_DELAY = 800

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
export const test = baseTest.extend<{ mnemonic: string }, { e2eeAccount: E2eeAccount }>({
	mnemonic: ({ e2eeAccount }, use) => use(e2eeAccount.mnemonic),

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

/**
 * Run a setup round trip that talks to the container, retrying it once.
 *
 * Creating a user shells out to `occ` and logging in costs three requests -
 * either can fail outright while the CI machine is busy, which must not fail the
 * test.
 *
 * @param action - The round trip to run
 * @param description - What is attempted, for the log message on the first failure
 */
async function withRetry<T>(action: () => Promise<T>, description: string): Promise<T> {
	try {
		return await action()
	} catch (error) {
		console.info(`Failed to ${description}, retrying`, error)
		await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
		return await action()
	}
}
