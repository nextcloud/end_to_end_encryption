/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { test as baseTest } from '@playwright/test'
import { PersonalSettingsPage } from '../sections/PersonalSettingsPage.ts'

interface PersonalSettingsFixture {
	personalSettings: PersonalSettingsPage
}

export const test = baseTest.extend<PersonalSettingsFixture>({
	personalSettings: async ({ page }, use) => {
		const personalSettings = new PersonalSettingsPage(page)
		await use(personalSettings)
	},
})
