/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { SectionNewMenu } from './SectionNewMenu.ts'

/** How long to keep retrying to open the "New" menu. */
const OPEN_MENU_TIMEOUT = 15000

export class FilesAppPage {
	public readonly buttonNewMenuLocator: Locator
	public readonly tableFilesList: Locator
	public readonly filesListLocator: Locator

	constructor(public readonly page: Page) {
		this.filesListLocator = this.page.locator('[data-cy-files-list]')
		this.tableFilesList = this.page.getByRole('table', { name: /List of your files and folders/i })
		// An empty folder renders a second upload picker inside its "no files here"
		// placeholder, so two "New" buttons can exist. The list header's picker is
		// always present and comes first in the DOM — target that one.
		this.buttonNewMenuLocator = this.page.locator('[data-cy-upload-picker]')
			.getByRole('button', { name: 'New' })
			.first()
	}

	/**
	 * Open the files app and wait until its list is rendered and settled.
	 *
	 * `page.goto` resolves on the `load` event, long before Vue has mounted the
	 * list and its upload picker. Returning early would let callers assert on —
	 * or click into — a half-mounted app, which is where "element not found" and
	 * dropped clicks come from on slower machines. It also makes `toHaveCount(0)`
	 * assertions pass for the wrong reason.
	 */
	public async openFilesApp(): Promise<void> {
		await this.page.goto('/apps/files')
		await this.filesListLocator.waitFor({ state: 'visible' })
		await this.waitForListLoaded()
	}

	/**
	 * The list's loading indicator. Rendered in the list header ("File list is
	 * reloading") when the folder already has contents to keep showing, and in
	 * place of the list ("Loading current folder") when it does not.
	 */
	public getLoadingIndicator(): Locator {
		return this.page.getByRole('img', { name: /^(File list is reloading|Loading current folder)$/ })
	}

	/**
	 * Wait for a pending list fetch to settle, i.e. for the loading indicator to
	 * come and go.
	 *
	 * The indicator is only waited for briefly: a fetch that resolves before the
	 * first poll is never observed as visible, and since the app raises the
	 * loading state synchronously with the action that triggers the fetch, an
	 * absent indicator means the fetch already finished — so missing its
	 * appearance is not an error. Waiting for it to be gone is what matters.
	 */
	public async waitForListLoaded(): Promise<void> {
		const indicator = this.getLoadingIndicator()
		await indicator.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {})
		await indicator.waitFor({ state: 'hidden' })
	}

	/**
	 * Open the "New" menu of the files list header.
	 *
	 * Opening is retried until the menu is actually visible: the upload picker's
	 * NcActions can swallow the first click while it is still mounting, which
	 * otherwise surfaces much later as a missing menu entry. Only click while the
	 * menu is closed so an already-open menu is never toggled shut again.
	 */
	public async openNewMenu(): Promise<SectionNewMenu> {
		const newMenu = new SectionNewMenu(this.page)

		await expect(async () => {
			if (!(await newMenu.menuLocator.isVisible())) {
				await this.buttonNewMenuLocator.click()
			}
			await expect(newMenu.menuLocator).toBeVisible({ timeout: 2000 })
		}).toPass({ timeout: OPEN_MENU_TIMEOUT })

		return newMenu
	}

	public getFileOrFolder(name: string): Locator {
		return this.tableFilesList
			.getByRole('row')
			.filter({ has: this.page.getByRole('cell', { name }) })
	}

	/** The size cell of a row, e.g. "0 KB" for a freshly created folder. */
	public getSizeCell(row: Locator): Locator {
		return row.locator('[data-cy-files-list-row-size]')
	}

	/** The relative modification time cell of a row, e.g. "a few seconds ago". */
	public getModifiedCell(row: Locator): Locator {
		return row.locator('[data-cy-files-list-row-mtime]')
	}
}
