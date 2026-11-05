/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

export class AdminSettingsPage {
	public readonly URL = 'settings/admin/security'

	public readonly sectionHeaderLocator: Locator
	public readonly switchAllowDebugTools: Locator

	constructor(public readonly page: Page) {
		this.sectionHeaderLocator = page.getByRole('heading', { name: 'End-to-End Encryption' })
		// NcCheckboxRadioSwitch exposes `type="switch"` as role `switch`, not `checkbox`
		this.switchAllowDebugTools = page.getByRole('switch', { name: 'Allow people to enable the debugging tools' })
	}

	/** Open the security settings and wait for this app's section to be mounted. */
	public async openSettingsPage(): Promise<void> {
		await this.page.goto(this.URL)
		await expect(this.sectionHeaderLocator).toBeVisible()
		await this.switchAllowDebugTools.scrollIntoViewIfNeeded()
	}

	/**
	 * Allow or disallow the debugging tools through the switch and wait for the
	 * server to acknowledge it.
	 *
	 * The switch only reflects the new state once the request resolved, and a
	 * rejected request would otherwise be indistinguishable from a setting that
	 * simply did not stick.
	 *
	 * @param allowed - Whether the debugging tools should be allowed
	 */
	public async setDebugToolsAllowed(allowed: boolean): Promise<void> {
		await expect(this.switchAllowDebugTools).toBeChecked({ checked: !allowed })

		const saved = this.page.waitForResponse((response) => response.request().method() === 'POST'
			&& response.url().includes('/apps/provisioning_api/api/v1/config/apps/end_to_end_encryption/debug_tools_allowed'))
		// toggled from the keyboard as the input is visually hidden, see `toggleSwitch`
		await this.switchAllowDebugTools.press(' ')

		expect((await saved).status()).toBe(200)
		await expect(this.switchAllowDebugTools).toBeChecked({ checked: allowed })
	}
}
