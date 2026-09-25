/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * The public page of an end-to-end encrypted file drop, as a guest sees it.
 */
export class PublicFileDropPage {
	public readonly inputPassword: Locator
	public readonly buttonSubmitPassword: Locator
	public readonly textWrongPassword: Locator
	public readonly buttonSelectFiles: Locator
	public readonly listUploadedFiles: Locator

	constructor(public readonly page: Page) {
		this.inputPassword = page.getByLabel('Password', { exact: true })
		this.buttonSubmitPassword = page.getByRole('button', { name: 'Submit' })
		this.textWrongPassword = page.getByText(/The password is wrong/)
		this.buttonSelectFiles = page.getByText('Select or drop files')
		this.listUploadedFiles = page.getByRole('list', { name: 'Uploaded files' })
	}

	public async open(url: string): Promise<void> {
		await this.page.goto(url)
	}

	public getHeading(folderName: string): Locator {
		return this.page.getByText(`Upload encrypted files to ${folderName}`)
	}

	public getNote(): Locator {
		return this.page.getByRole('note').filter({ hasText: 'Note from the owner' })
	}

	public async submitPassword(password: string): Promise<void> {
		await this.inputPassword.fill(password)
		await this.buttonSubmitPassword.click()
	}

	/**
	 * Upload a text file and wait until it is encrypted and uploaded.
	 *
	 * @param name - Name of the file
	 * @param content - Contents of the file
	 */
	public async uploadTextFile(name: string, content: string = `content of ${name}\n`): Promise<void> {
		const chooser = this.page.waitForEvent('filechooser')
		await this.buttonSelectFiles.click()
		await (await chooser).setFiles({ name, mimeType: 'text/plain', buffer: Buffer.from(content) })

		await expect(this.listUploadedFiles.getByRole('listitem').filter({ hasText: name })
			.getByRole('img', { name: 'Upload successful' })).toBeVisible()
	}
}
