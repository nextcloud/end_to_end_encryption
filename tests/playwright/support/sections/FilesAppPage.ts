/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { SectionMnemonicDialog } from './SectionMnemonicDialog.ts'
import { SectionNewMenu } from './SectionNewMenu.ts'

export class FilesAppPage {
	public readonly buttonNewMenuLocator: Locator
	public readonly dialogMnemonicLocator: Locator
	public readonly tableFilesList: Locator

	constructor(public readonly page: Page) {
		this.tableFilesList = this.page.getByRole('table', { name: /List of your files and folders/i })
		this.buttonNewMenuLocator = this.page.getByRole('button', {
			name: 'New',
		})
		this.dialogMnemonicLocator = this.page.getByRole('dialog', { name: 'Enter your 12 words mnemonic' })
	}

	public async openFilesApp(): Promise<void> {
		await this.page.goto('/apps/files')
	}

	public async openNewMenu(): Promise<SectionNewMenu> {
		await this.buttonNewMenuLocator.first().click()
		const menu = new SectionNewMenu(this.page)
		await expect(menu.menuLocator).toBeVisible()
		return menu
	}

	public getFileOrFolder(name: string): Locator {
		return this.tableFilesList
			.getByRole('row')
			.filter({ has: this.page.getByRole('cell', { name }) })
	}

	public openFileOrFolder(name: string): Promise<void> {
		return this.getFileOrFolder(name)
			.getByRole('button', { name: `Open folder ${name}` })
			.click()
	}

	public getMnemonicDialog(): SectionMnemonicDialog {
		return new SectionMnemonicDialog(this.dialogMnemonicLocator)
	}
}
