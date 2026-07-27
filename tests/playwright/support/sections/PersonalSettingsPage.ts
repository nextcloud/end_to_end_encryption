/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { BROWSER_E2EE_CONFIG_ENDPOINT } from '../utils/config.ts'

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

	/**
	 * Open the security settings and wait for this app's section to be mounted.
	 *
	 * The section is rendered by Vue well after `goto` resolved, so returning
	 * early would let callers scroll to and click into an element that is not
	 * there yet.
	 */
	public async openSettingsPage(): Promise<void> {
		await this.page.goto(this.URL)
		await expect(this.sectionHeaderLocator).toBeVisible()
		await this.sectionLocator.scrollIntoViewIfNeeded()
	}

	/**
	 * Enable browser based end-to-end encryption through the UI.
	 *
	 * The switch lives inside a warning note card that only appears once the user
	 * acknowledged it with the "Enable E2EE navigation in browser" button, so that
	 * button is clicked first — it is only rendered while the setting is off.
	 */
	public async enableBrowserE2ee(): Promise<void> {
		await expect(this.buttonEnableBrowserE2ee).toBeEnabled()
		await this.buttonEnableBrowserE2ee.click()
		await this.toggleBrowserE2ee(true)
	}

	/** Disable browser based end-to-end encryption through the UI. */
	public async disableBrowserE2ee(): Promise<void> {
		await this.toggleBrowserE2ee(false)
	}

	/**
	 * Flip the switch in the warning note card and wait for the server to
	 * acknowledge it.
	 *
	 * The component only updates its model once the request resolved, so without
	 * waiting for the response every following state assertion races it. The
	 * status is asserted too: a rejected request would otherwise be
	 * indistinguishable from a setting that simply did not stick.
	 */
	private async toggleBrowserE2ee(enabled: boolean): Promise<void> {
		await expect(this.noteCardBrowserE2ee).toBeVisible()
		await expect(this.checkboxEnableBrowserE2ee).toBeChecked({ checked: !enabled })

		const saved = this.page.waitForResponse((response) => response.request().method() === 'PUT'
			&& response.url().endsWith(BROWSER_E2EE_CONFIG_ENDPOINT))
		// the input is visually hidden inside NcCheckboxRadioSwitch
		await this.checkboxEnableBrowserE2ee.click({ force: true })

		expect((await saved).status()).toBe(200)
		await expect(this.checkboxEnableBrowserE2ee).toBeChecked({ checked: enabled })
	}
}
