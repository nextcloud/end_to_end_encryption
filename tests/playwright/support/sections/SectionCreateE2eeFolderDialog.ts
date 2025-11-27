/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

export class SectionCreateE2eeFolderDialog {
	public readonly dialogLocator: Locator
	public readonly buttonContinue: Locator
	public readonly buttonCreateFolder: Locator
	public readonly buttonSetupEncryption: Locator
	public readonly codeRecoveryPhrase: Locator
	public readonly inputFolderName: Locator

	constructor(public readonly page: Page) {
		this.dialogLocator = page.getByRole('dialog', { name: 'Create new encrypted folder' })
		this.buttonSetupEncryption = this.dialogLocator.getByRole('button', { name: /Setup encryption/i })
		this.buttonContinue = this.dialogLocator.getByRole('button', { name: /Continue/i })
		this.buttonCreateFolder = this.dialogLocator.getByRole('button', { name: /Create folder/i })
		this.codeRecoveryPhrase = this.dialogLocator.getByRole('code')
		this.inputFolderName = this.dialogLocator.getByRole('textbox', { name: /Folder name/i })
	}
}
