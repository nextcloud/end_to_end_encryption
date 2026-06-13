/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

export class SectionCreateFolderDialog {
	public readonly dialogLocator: Locator
	public readonly buttonCreateFolder: Locator
	public readonly inputFolderName: Locator

	constructor(public readonly page: Page) {
		this.dialogLocator = page.getByRole('dialog', { name: 'Create new folder' })
		this.buttonCreateFolder = this.dialogLocator.getByRole('button', { name: /Create/i })
		this.inputFolderName = this.dialogLocator.getByRole('textbox', { name: /Folder name/i })
	}

	public async createFolder(folderName: string): Promise<this> {
		const response = this.page.waitForResponse((res) => res.request().method() === 'MKCOL')
		await this.inputFolderName.fill(folderName)
		await expect(this.buttonCreateFolder).not.toBeDisabled()
		await this.buttonCreateFolder.click()
		await response

		return this
	}
}
