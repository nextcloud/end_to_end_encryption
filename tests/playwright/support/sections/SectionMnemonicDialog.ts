/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator } from '@playwright/test'

import { expect } from '@playwright/test'

export class SectionMnemonicDialog {
	public readonly buttonSubmit: Locator
	public readonly switchConsent: Locator
	public readonly inputMnemonic: Locator

	constructor(public readonly dialogLocator: Locator) {
		this.buttonSubmit = this.dialogLocator.getByRole('button', { name: /Submit/i })
		// NcCheckboxRadioSwitch exposes `type="switch"` as role `switch`, not `checkbox`
		this.switchConsent = this.dialogLocator.getByRole('switch', { name: /I understand the risks/i })
		this.inputMnemonic = this.dialogLocator.getByRole('textbox', { name: /Mnemonic/i })
	}

	public async fillAndSubmit(mnemonic: string): Promise<void> {
		await expect(this.dialogLocator).toBeVisible()
		await this.inputMnemonic.fill(mnemonic)
		await this.switchConsent.check({ force: true })
		await expect(this.buttonSubmit).not.toBeDisabled()
		await this.buttonSubmit.click()
		await expect(this.dialogLocator).toHaveCount(0)
	}
}
