/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { SectionCreateE2eeFolderDialog } from './SectionCreateE2eeFolderDialog.ts'
import { SectionCreateFolderDialog } from './SectionCreateFolderDialog.ts'

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

	public getNewFolderEntry(): Locator {
		return this.getMenuEntry(/New folder/i)
	}

	/**
	 * Trigger the "New encrypted folder" entry and wait until the dialog has got
	 * past its initial "Checking encryption setup …" step.
	 */
	public async createNewE2eeFolder(): Promise<SectionCreateE2eeFolderDialog> {
		await this.getNewEncryptedFolderEntry().click()
		const section = new SectionCreateE2eeFolderDialog(this.page)
		await section.waitForSetupCheck()
		return section
	}

	public async createNewFolder(): Promise<SectionCreateFolderDialog> {
		await this.getNewFolderEntry().click()
		const section = new SectionCreateFolderDialog(this.page)
		await expect(section.dialogLocator).toBeVisible()
		return section
	}
}
