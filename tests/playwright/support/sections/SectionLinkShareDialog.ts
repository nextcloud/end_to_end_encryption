/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

export class SectionLinkShareDialog {
	public readonly dialogLocator: Locator
	public readonly radioUploadOnly: Locator
	public readonly inputPassword: Locator
	public readonly inputNote: Locator
	public readonly buttonCreate: Locator
	public readonly buttonClose: Locator

	constructor(public readonly page: Page) {
		this.dialogLocator = page.getByRole('dialog', { name: 'End-to-end encrypted link share' })
		this.radioUploadOnly = this.dialogLocator.getByRole('radio', { name: 'Upload only' })
		// password inputs have no ARIA role
		this.inputPassword = this.dialogLocator.getByLabel('Password', { exact: true })
		this.inputNote = this.dialogLocator.getByRole('textbox', { name: 'Note to recipient' })
		this.buttonCreate = this.dialogLocator.getByRole('button', { name: 'Create link share' })
		this.buttonClose = this.dialogLocator.getByRole('button', { name: 'Close', exact: true })
	}

	/**
	 * Create an upload only share and close the dialog.
	 *
	 * @param options - Optional password and note of the share
	 * @param options.password - Password of the share
	 * @param options.note - Note to the recipient
	 */
	public async createFileDrop(options: { password?: string, note?: string } = {}): Promise<void> {
		await expect(this.radioUploadOnly).toBeChecked()
		if (options.password) {
			await this.inputPassword.fill(options.password)
		}
		if (options.note) {
			await this.inputNote.fill(options.note)
		}
		await this.buttonCreate.click()
		await this.buttonClose.click()
		await expect(this.dialogLocator).toHaveCount(0)
	}
}
