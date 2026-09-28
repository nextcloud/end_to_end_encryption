/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/** Creates an end-to-end encrypted link share. */
export class SectionLinkShareDialog {
	public readonly dialogLocator: Locator
	public readonly buttonCreate: Locator

	constructor(public readonly page: Page) {
		this.dialogLocator = page.getByRole('dialog', { name: 'End-to-end encrypted link share' })
		this.buttonCreate = this.dialogLocator.getByRole('button', { name: 'Create link share' })
	}

	/**
	 * Create the share with the default "Upload only" permission and close the dialog.
	 */
	public async createUploadOnlyShare(): Promise<void> {
		await this.buttonCreate.click()
		// the dialog stays open to show the share url
		await expect(this.buttonCreate).toHaveCount(0)
		await this.page.keyboard.press('Escape')
		await expect(this.dialogLocator).toHaveCount(0)
	}
}
