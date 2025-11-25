/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { SectionCreateE2eeFolderDialog } from './SectionCreateE2eeFolderDialog.ts'

export class SectionNewMenu {
	public readonly menuLocator: Locator

	constructor(public readonly page: Page) {
		this.menuLocator = page.getByRole('menu', { name: 'New' })
	}

	public getMenuEntry(name: string | RegExp): Locator {
		return this.menuLocator.getByRole('menuitem', { name })
	}

	public getNewEncryptedFolderEntry(): Locator {
		return this.getMenuEntry(/New encrypted folder/i)
	}

	public async createNewE2eeFolder(): Promise<SectionCreateE2eeFolderDialog> {
		this.getNewEncryptedFolderEntry().click()
		const section = new SectionCreateE2eeFolderDialog(this.page)
		await expect(section.dialogLocator).toBeVisible()
		return section
	}
}
