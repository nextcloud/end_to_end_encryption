/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

export class PersonalSettingsPage {
	public readonly URL = '/settings/user/security'

	public readonly sectionLocator: Locator
	public readonly sectionHeaderLocator: Locator
	public readonly noteCardBrowserE2ee: Locator
	public readonly buttonEnableBrowserE2ee: Locator
	public readonly buttonResetE2ee: Locator
	public readonly checkboxEnableBrowserE2ee: Locator

	constructor(public readonly page: Page) {
		this.sectionHeaderLocator = page.getByRole('heading', { name: 'End-to-end encryption' })
		this.sectionLocator = page.locator('.settings-section')
			.filter({ has: this.sectionHeaderLocator })

		this.buttonResetE2ee = this.sectionLocator.getByRole('button', { name: /Reset end-to-end encryption/i })
		this.buttonEnableBrowserE2ee = this.sectionLocator.getByRole('button', { name: /Enable E2EE navigation in browser/i })

		this.noteCardBrowserE2ee = this.sectionLocator.getByRole('alert')
		this.checkboxEnableBrowserE2ee = this.noteCardBrowserE2ee.getByRole('checkbox', { name: /Enable E2EE navigation in browser/i })
	}

	public async enableBrowserE2ee(): Promise<void> {
		const waitForRequest = this.page.waitForRequest((request) => (
			request.method() === 'PUT'
			&& request.url().endsWith('/apps/end_to_end_encryption/api/v1/config/e2eeInBrowserEnabled')))

		await this.buttonEnableBrowserE2ee.click()
		await expect(this.noteCardBrowserE2ee).toBeVisible()
		await this.checkboxEnableBrowserE2ee.click({ force: true })

		await (await waitForRequest).response()
	}

	public async disableBrowserE2ee(): Promise<void> {
		const waitForRequest = this.page.waitForRequest((request) => (
			request.method() === 'PUT'
			&& request.url().endsWith('/apps/end_to_end_encryption/api/v1/config/e2eeInBrowserEnabled')))

		await expect(this.noteCardBrowserE2ee).toBeVisible()
		await expect(this.checkboxEnableBrowserE2ee).toBeChecked()
		await this.checkboxEnableBrowserE2ee.click({ force: true })

		await (await waitForRequest).response()
	}

	public async openSettingsPage(): Promise<void> {
		await this.page.goto(this.URL)
	}
}
