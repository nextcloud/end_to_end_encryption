/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

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
}
