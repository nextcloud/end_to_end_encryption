/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

export class SectionCreateE2eeFolderDialog {
	public readonly dialogLocator: Locator
	public readonly buttonContinue: Locator
	public readonly buttonCreateFolder: Locator
	public readonly buttonSetupEncryption: Locator
	public readonly buttonSubmitMnemonic: Locator
	public readonly checkboxConsent: Locator
	public readonly codeRecoveryPhrase: Locator
	public readonly inputFolderName: Locator
	public readonly inputMnemonic: Locator

	constructor(public readonly page: Page) {
		this.dialogLocator = page.getByRole('dialog', { name: 'Create new encrypted folder' })
		this.buttonSetupEncryption = this.dialogLocator.getByRole('button', { name: /Setup encryption/i })
		this.buttonContinue = this.dialogLocator.getByRole('button', { name: /Continue/i })
		this.buttonCreateFolder = this.dialogLocator.getByRole('button', { name: /Create folder/i })
		this.buttonSubmitMnemonic = this.dialogLocator.getByRole('button', { name: /Submit/i })
		this.checkboxConsent = this.dialogLocator.getByRole('checkbox', { name: /I understand the risks/i })
		this.codeRecoveryPhrase = this.dialogLocator.getByRole('code')
		this.inputFolderName = this.dialogLocator.getByRole('textbox', { name: /Folder name/i })
		this.inputMnemonic = this.dialogLocator.getByRole('textbox', { name: /Mnemonic/i })
	}

	public async fillMnemonic(mnemonic: string): Promise<this> {
		await expect(this.inputMnemonic).toBeVisible()
		await this.inputMnemonic.fill(mnemonic)
		await this.checkboxConsent.click({ force: true })
		await expect(this.buttonSubmitMnemonic).not.toBeDisabled()
		await this.buttonSubmitMnemonic.click()
		return this
	}

	public async createFolder(folderName: string): Promise<this> {
		const response = this.page.waitForResponse((res) => res.request().method() === 'POST'
			&& res.url().includes('/ocs/v2.php/apps/end_to_end_encryption/api/v2/meta-data/'))

		await expect(this.inputFolderName).toBeVisible()
		await this.inputFolderName.fill(folderName)
		await this.buttonCreateFolder.click()
		await response

		return this
	}
}
