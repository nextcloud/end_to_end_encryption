/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { SectionNewMenu } from './SectionNewMenu.ts'

export class FilesAppPage {
	public readonly buttonNewMenuLocator: Locator
	public readonly tableFilesList: Locator

	constructor(public readonly page: Page) {
		this.tableFilesList = this.page.getByRole('table', { name: /List of your files and folders/i })
		this.buttonNewMenuLocator = this.page.getByRole('button', {
			name: 'New',
		})
	}

	public async openFilesApp(): Promise<void> {
		await this.page.goto('/apps/files')
	}

	public async openNewMenu(): Promise<SectionNewMenu> {
		await this.buttonNewMenuLocator.click()
		return new SectionNewMenu(this.page)
	}

	public getFileOrFolder(name: string): Locator {
		return this.tableFilesList
			.getByRole('row')
			.filter({ has: this.page.getByRole('cell', { name }) })
	}
}
