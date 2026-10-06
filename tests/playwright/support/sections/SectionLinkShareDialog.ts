/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

export class SectionLinkShareDialog {
	public readonly dialogLocator: Locator
	public readonly inputEmail: Locator
	public readonly radioUploadOnly: Locator
	public readonly radioViewOnly: Locator
	public readonly inputPassword: Locator
	public readonly inputNote: Locator
	public readonly buttonCreate: Locator
	public readonly buttonClose: Locator
	public readonly textMnemonicNotice: Locator

	/**
	 * @param page - The page the dialog is shown on
	 * @param isEmailShare - If the dialog creates an email share instead of a link share
	 */
	constructor(public readonly page: Page, isEmailShare = false) {
		this.dialogLocator = page.getByRole('dialog', {
			name: isEmailShare ? 'End-to-end encrypted email share' : 'End-to-end encrypted link share',
		})
		this.inputEmail = this.dialogLocator.getByRole('textbox', { name: 'Email address' })
		this.radioUploadOnly = this.dialogLocator.getByRole('radio', { name: 'Upload only' })
		this.radioViewOnly = this.dialogLocator.getByRole('radio', { name: 'View only' })
		// password inputs have no ARIA role
		this.inputPassword = this.dialogLocator.getByLabel('Password', { exact: true })
		this.inputNote = this.dialogLocator.getByRole('textbox', { name: 'Note to recipient' })
		this.buttonCreate = this.dialogLocator.getByRole('button', { name: isEmailShare ? 'Create email share' : 'Create link share' })
		// the footer button, not the icon-only close button of the dialog header
		this.buttonClose = this.dialogLocator.getByRole('button', { name: 'Close', exact: true }).filter({ hasText: 'Close' })
		this.textMnemonicNotice = this.dialogLocator.getByText('Please share the secret mnemonic with the recipient using a secure second channel.')
	}

	/**
	 * Get the notice that the share link was sent to the given email address.
	 *
	 * @param email - The email address of the recipient
	 */
	public getLinkSentNotice(email: string): Locator {
		return this.dialogLocator.getByText(`The share link was sent to ${email}.`)
	}

	/**
	 * Select the view only permissions.
	 */
	public async selectViewOnly(): Promise<void> {
		// the radio input is visually hidden, its label is the visible button
		await this.dialogLocator.getByText('View only', { exact: true }).click()
		await expect(this.radioViewOnly).toBeChecked()
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
		await this.close()
	}

	/**
	 * Close the dialog after the share was created.
	 */
	public async close(): Promise<void> {
		await this.buttonClose.click()
		await expect(this.dialogLocator).toHaveCount(0)
	}
}
