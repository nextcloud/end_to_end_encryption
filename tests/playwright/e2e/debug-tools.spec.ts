/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { User } from '@nextcloud/e2e-test-server'
import { login } from '@nextcloud/e2e-test-server/playwright'
import { expect, mergeTests } from '@playwright/test'
import { test as browserE2eeTest } from '../support/fixtures/browser-e2ee.ts'
import { test as debugToolsTest } from '../support/fixtures/debug-tools.ts'
import { test as personalSettingsTest } from '../support/fixtures/personal-settings.ts'
import { AdminSettingsPage } from '../support/sections/AdminSettingsPage.ts'
import { FileDropPage } from '../support/sections/FileDropPage.ts'
import { DEBUG_TOOLS_CONFIG_KEY, setDebugToolsAllowed, setUserConfig } from '../support/utils/config.ts'
import { createFolderInEncryptedFolder, uploadFileToEncryptedFolder } from '../support/utils/e2ee.ts'
import { withRetry } from '../support/utils/retry.ts'
import { createFileDropShare } from '../support/utils/sharing.ts'

const settingsTest = mergeTests(browserE2eeTest, personalSettingsTest)

/** Every check a valid root metadata passes */
const ROOT_CHECKS = [
	'Metadata is stored and readable',
	'Metadata version is supported',
	'Metadata key is available',
	'Metadata can be decrypted',
	'Metadata signature is valid',
	'Metadata key checksum is listed',
]

// Whether the debugging tools are allowed is a global setting. All tests that
// depend on it live in this file and run one after the other, so no test sees
// it change midway - and every describe block sets the state it needs itself.
settingsTest.describe.configure({ mode: 'default' })

settingsTest.describe('debugging tools not allowed', () => {
	settingsTest.beforeEach(() => setDebugToolsAllowed(false))

	settingsTest('people cannot enable the debugging tools', async ({ page, personalSettings }) => {
		await personalSettings.openSettingsPage()
		await expect(personalSettings.buttonResetE2ee).toBeVisible()
		await expect(personalSettings.switchEnableDebugTools).toHaveCount(0)

		expect(await setUserConfig(page.request, DEBUG_TOOLS_CONFIG_KEY, 'true')).toBe(403)
	})

	settingsTest('the administrator can allow the debugging tools', async ({ browser, baseURL }) => {
		const page = await browser.newPage({ storageState: undefined, baseURL })
		await withRetry(() => login(page.request, new User('admin', 'admin')), 'authenticate as admin')

		const adminSettings = new AdminSettingsPage(page)
		await adminSettings.openSettingsPage()
		await adminSettings.setDebugToolsAllowed(true)

		// the setting is stored on the server
		await adminSettings.openSettingsPage()
		await expect(adminSettings.switchAllowDebugTools).toBeChecked()
		await page.close()
	})
})

settingsTest.describe('debugging tools allowed', () => {
	settingsTest.use({ browserE2ee: true })
	settingsTest.beforeEach(() => setDebugToolsAllowed(true))

	settingsTest('people can enable the debugging tools', async ({ personalSettings }) => {
		await personalSettings.openSettingsPage()
		await personalSettings.setDebugToolsEnabled(true)

		// the setting is stored on the server
		await personalSettings.openSettingsPage()
		await expect(personalSettings.switchEnableDebugTools).toBeChecked()
	})
})

debugToolsTest.describe('debug action', () => {
	debugToolsTest.describe('disabled by the user', () => {
		debugToolsTest.use({ debugTools: false })

		debugToolsTest('is not shown', async ({ filesApp, encryptedFolder }) => {
			await filesApp.openFilesApp()
			const actionsMenu = await filesApp.openActionsMenu(encryptedFolder)

			// the menu is rendered completely once its other entries are shown
			await expect(actionsMenu.getDeleteEntry()).toBeVisible()
			await expect(actionsMenu.getDebugEntry()).toHaveCount(0)
		})
	})

	debugToolsTest('is only shown for encrypted folders', async ({ page, filesApp, encryptedFolder }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')
		await createFolderInEncryptedFolder(page, filesApp, 'subfolder')

		const fileActionsMenu = await filesApp.openActionsMenu('file.txt')
		await expect(fileActionsMenu.getDeleteEntry()).toBeVisible()
		await expect(fileActionsMenu.getDebugEntry()).toHaveCount(0)
		await page.keyboard.press('Escape')
		await expect(fileActionsMenu.menuLocator).toHaveCount(0)

		const folderActionsMenu = await filesApp.openActionsMenu('subfolder')
		await expect(folderActionsMenu.getDebugEntry()).toBeVisible()

		// the encrypted root folder itself
		await filesApp.openFilesApp()
		const rootActionsMenu = await filesApp.openActionsMenu(encryptedFolder)
		await expect(rootActionsMenu.getDebugEntry()).toBeVisible()
	})

	debugToolsTest('shows the metadata of an encrypted root folder', async ({ page, filesApp, mnemonic, encryptedFolder, e2eeAccount }) => {
		await uploadFileToEncryptedFolder(page, filesApp, 'file.txt')
		await createFolderInEncryptedFolder(page, filesApp, 'subfolder')

		// reloading drops the private key, so this inspects the state on the server
		await filesApp.openFilesApp()
		const dialog = await filesApp.openDebugDialog(encryptedFolder, mnemonic)

		await expect(dialog.getSummaryRow('Metadata version')).toContainText('2.0')
		await expect(dialog.getSummaryRow('Metadata type')).toContainText('Root metadata')
		await expect(dialog.getSummaryRow('Users with access')).toContainText(e2eeAccount.user.userId)

		await expect(dialog.getChecks()).toHaveCount(ROOT_CHECKS.length)
		for (const check of ROOT_CHECKS) {
			await expect(dialog.getCheck(check)).toContainText('Passed')
		}

		await expect(dialog.getContentsEntry('file.txt')).toContainText('text/plain')
		await expect(dialog.getContentsEntry('subfolder')).toContainText('Folder')
		await expect(dialog.sectionContents).not.toContainText('Missing on the server')
		await expect(dialog.sectionUnknownNodes).toHaveCount(0)
		await expect(dialog.sectionFileDrop).toContainText('No file drop entries')

		await dialog.showMetadata()
		await expect(dialog.sectionMetadata).toContainText('"filename": "file.txt"')
		await expect(dialog.sectionMetadata).toContainText('"key": "[redacted]"')
		await expect(dialog.sectionMetadata).not.toContainText(/"(key|nonce|authenticationTag)": "(?!\[redacted\])/)
	})

	debugToolsTest('shows the metadata of a nested encrypted folder', async ({ page, filesApp, mnemonic, encryptedFolder, e2eeAccount }) => {
		await createFolderInEncryptedFolder(page, filesApp, 'nested')

		// reloading drops all cached metadata, so this inspects the state on the server
		await filesApp.reopenEncryptedFolder(encryptedFolder, mnemonic)
		const dialog = await filesApp.openDebugDialog('nested')

		await expect(dialog.getSummaryRow('Metadata type')).toContainText('Nested metadata')
		await expect(dialog.getSummaryRow('Users with access')).toContainText(e2eeAccount.user.userId)
		await expect(dialog.getChecks()).toHaveCount(5)
		await expect(dialog.getChecks().filter({ hasText: 'Passed' })).toHaveCount(5)
		await expect(dialog.sectionContents).toContainText('The metadata lists no files or folders')
	})

	debugToolsTest('lists pending file drop entries', async ({ browser, baseURL, page, filesApp, mnemonic, encryptedFolder }) => {
		const token = await createFileDropShare(page.request, `/${encryptedFolder}`)

		const anonymousContext = await browser.newContext({ storageState: undefined, baseURL })
		const fileDrop = new FileDropPage(await anonymousContext.newPage())
		await fileDrop.open(token)
		await fileDrop.uploadTextFile('dropped-file.txt')
		await anonymousContext.close()

		// open the dialog from the parent folder: listing the folder itself would ask to migrate the entry
		await filesApp.openFilesApp()
		const dialog = await filesApp.openDebugDialog(encryptedFolder, mnemonic)

		await expect(dialog.getFileDropEntry('dropped-file.txt')).toContainText('text/plain')
		await expect(dialog.getFileDropEntry('dropped-file.txt')).not.toContainText('Missing on the server')
		await expect(dialog.getContentsEntry('dropped-file.txt')).toHaveCount(0)
		// dropped files exist on the server, but they are known to the metadata
		await expect(dialog.sectionUnknownNodes).toHaveCount(0)
		await expect(dialog.getCheck('Metadata signature is valid')).toContainText('Passed')
	})
})
