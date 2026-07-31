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

	public getUploadFilesEntry(): Locator {
		return this.getMenuEntry(/Upload files/i)
	}

	/**
	 * Upload files through the "Upload files" entry of the new menu.
	 *
	 * The entry opens the browser's file picker, which is not part of the page -
	 * Playwright hands it over as a `filechooser` event, so the files never have
	 * to exist on disk. The listener is armed before the entry is clicked, as the
	 * event fires synchronously with the click.
	 *
	 * Note that every uploaded file is a separate operation on the server, so pass
	 * one file per call when the metadata write of each has to be awaited.
	 *
	 * @param files - The files to upload
	 */
	public async uploadFiles(...files: { name: string, mimeType: string, buffer: Buffer }[]): Promise<void> {
		const fileChooser = this.page.waitForEvent('filechooser')
		await this.getUploadFilesEntry().click()
		await (await fileChooser).setFiles(files)
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
