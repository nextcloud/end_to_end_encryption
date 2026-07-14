/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, mergeTests } from '@playwright/test'
import { test as settingsTest } from '../support/fixtures/personal-settings.ts'
import { test as randomUserTest } from '../support/fixtures/random-user.ts'

const test = mergeTests(randomUserTest, settingsTest)

test.beforeEach(async ({ personalSettings }) => {
	await personalSettings.openSettingsPage()
})

test('Can see personal settings page', async ({ personalSettings }) => {
	await personalSettings.sectionLocator.scrollIntoViewIfNeeded()
	await expect(personalSettings.sectionLocator).toBeVisible()
	await expect(personalSettings.sectionHeaderLocator).toBeVisible()
	await expect(personalSettings.buttonEnableBrowserE2ee).toBeVisible()
	await expect(personalSettings.buttonEnableBrowserE2ee).not.toBeDisabled()

	await expect(personalSettings.buttonResetE2ee).toBeVisible()
	await expect(personalSettings.buttonResetE2ee).toBeDisabled()
})

test('Can enable browser based end-to-end encryption', async ({ page, personalSettings }) => {
	await personalSettings.sectionLocator.scrollIntoViewIfNeeded()
	expect(personalSettings.sectionLocator).toBeVisible()

	await personalSettings.enableBrowserE2ee()
	await expect(personalSettings.checkboxEnableBrowserE2ee).toBeChecked()

	// page reload preserves the settings
	await page.reload()
	await expect(personalSettings.checkboxEnableBrowserE2ee).toBeChecked()
})

test('Can disable browser based end-to-end encryption', async ({ page, personalSettings }) => {
	await personalSettings.sectionLocator.scrollIntoViewIfNeeded()
	await personalSettings.enableBrowserE2ee()
	await expect(personalSettings.checkboxEnableBrowserE2ee).toBeChecked()

	await personalSettings.disableBrowserE2ee()
	await expect(personalSettings.checkboxEnableBrowserE2ee).not.toBeChecked()

	// page reload preserves the settings
	await page.reload()
	await expect(personalSettings.noteCardBrowserE2ee).not.toBeVisible()
})

// TODO: Reset encryption
