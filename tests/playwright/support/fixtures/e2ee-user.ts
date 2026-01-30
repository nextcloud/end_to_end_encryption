/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { createRandomUser, login } from '@nextcloud/e2e-test-server/playwright'
import { test as baseTest, expect } from '@playwright/test'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { FilesAppPage } from '../sections/FilesAppPage.ts'
import { PersonalSettingsPage } from '../sections/PersonalSettingsPage.ts'

export const test = baseTest.extend<{ mnemonic: string }, { workerStorageState: { path: string, mnemonic: string } }>({
	// Use the same storage state for all tests in this worker.
	storageState: ({ workerStorageState }, use) => use(workerStorageState.path),

	mnemonic: ({ workerStorageState }, use) => use(workerStorageState.mnemonic),

	// Authenticate once per worker with a worker-scoped fixture.
	workerStorageState: [async ({ browser }, use) => {
		// Use parallelIndex as a unique identifier for each worker.
		const id = test.info().parallelIndex
		const path = resolve(test.info().project.outputDir, `.auth/${id}.json`)

		if (existsSync(path)) {
			// Reuse existing authentication state if any.
			await use({ path, mnemonic: await readFile(path.replace('.json', '.mnemonic'), 'utf-8') })
			return
		}

		// Important: make sure we authenticate in a clean environment by unsetting storage state.
		const page = await browser.newPage({ storageState: undefined, baseURL: baseTest.info().project.use.baseURL })

		// Acquire a unique account, for example create a new one.
		// Alternatively, you can have a list of precreated accounts for testing.
		// Make sure that accounts are unique, so that multiple team members
		// can run tests at the same time without interference.
		const account = await createRandomUser()
		await login(page.request, account)

		// setup e2ee
		const personalSettings = new PersonalSettingsPage(page)
		await personalSettings.openSettingsPage()
		await personalSettings.enableBrowserE2ee()
		const filesApp = new FilesAppPage(page)
		await filesApp.openFilesApp()
		// setup e2ee
		const newMenu = await filesApp.openNewMenu()
		await expect(newMenu.getNewEncryptedFolderEntry()).toBeVisible()
		const dialog = await newMenu.createNewE2eeFolder()
		await dialog.buttonSetupEncryption.click()
		// see the recovery phrase
		await expect(dialog.codeRecoveryPhrase).toHaveText(/(\w+ ){11}\w+/)
		const mnemonic = (await dialog.codeRecoveryPhrase.textContent())!
		await expect(dialog.buttonContinue).not.toBeDisabled({ timeout: 10000 })
		await dialog.buttonContinue.click()
		await expect(dialog.inputFolderName).toBeVisible()
		await dialog.inputFolderName.fill('test-folder')
		await dialog.createFolder('test-folder')
		await expect(dialog.dialogLocator).toHaveCount(0)

		// wait for the folder to appear in the file list
		await expect(filesApp.tableFilesList).toBeVisible()
		await expect(filesApp.getFileOrFolder('test-folder')).toBeVisible()

		await page.context().storageState({ path })
		await page.close()
		await writeFile(path.replace('.json', '.mnemonic'), mnemonic)

		await use({ path, mnemonic })
	}, { scope: 'worker' }],
})
