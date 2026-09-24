/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/** The public upload page of an end-to-end encrypted file drop share. */
export class FileDropPage {
	public readonly inputFiles: Locator
	public readonly listUploadedFiles: Locator

	constructor(public readonly page: Page) {
		this.inputFiles = page.getByLabel('Select or drop files')
		this.listUploadedFiles = page.getByRole('list', { name: 'Uploaded files' })
	}

	/**
	 * @param token - Token of the file drop share
	 */
	public async open(token: string): Promise<void> {
		await this.page.goto(`s/${token}`)
		await expect(this.inputFiles).toBeEnabled()
	}

	public getUploadedFile(name: string): Locator {
		return this.listUploadedFiles
			.getByRole('listitem')
			.filter({ hasText: name })
	}

	/**
	 * Upload a text file and wait until it is added to the file drop.
	 *
	 * @param name - Name of the file to upload
	 * @param content - Contents of the file
	 */
	public async uploadTextFile(name: string, content: string = `content of ${name}\n`): Promise<void> {
		await this.inputFiles.setInputFiles({ name, mimeType: 'text/plain', buffer: Buffer.from(content) })
		await expect(this.getUploadedFile(name).getByRole('img', { name: 'Upload successful' })).toBeVisible()
		// the input stays disabled until the entry is added to the folder metadata
		await expect(this.inputFiles).toBeEnabled()
	}
}
