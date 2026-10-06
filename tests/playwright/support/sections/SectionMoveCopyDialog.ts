/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * The file picker the "Move or copy" action of the files app opens to choose
 * the destination.
 *
 * Its confirm buttons are worded after the folder the picker shows: "Copy" and
 * "Move" for the root, "Copy to <name>" and "Move to <name>" for any other.
 * That name is taken from the path, so within an encrypted folder it is the
 * uuid the folder is stored as - which is why the buttons are not matched by it.
 */
export class SectionMoveCopyDialog {
	public readonly dialogLocator: Locator
	public readonly buttonCopy: Locator
	public readonly buttonMove: Locator

	constructor(public readonly page: Page) {
		this.dialogLocator = page.getByRole('dialog', { name: 'Choose destination' })
		this.buttonCopy = this.dialogLocator.getByRole('button', { name: /^Copy( to .+)?$/ })
		this.buttonMove = this.dialogLocator.getByRole('button', { name: /^Move( to .+)?$/ })
	}

	/**
	 * A row of the picker's file list, matched by the name it shows.
	 *
	 * @param name - Name of the file or folder
	 */
	public getRow(name: string): Locator {
		return this.dialogLocator
			.getByRole('row')
			.filter({ has: this.page.getByRole('cell', { name, exact: true }) })
	}

	/**
	 * Navigate the picker into a folder of the folder it currently shows.
	 *
	 * @param name - Name of the folder to open, it may not contain a folder of the same name
	 */
	public async openFolder(name: string): Promise<void> {
		await this.getRow(name).getByRole('cell', { name, exact: true }).click()
		await expect(this.getRow(name)).toHaveCount(0)
	}

	/**
	 * Navigate the picker into a folder in the root of the user's files.
	 *
	 * Up to @nextcloud/dialogs 7.5.0 the picker can lose track of a listing it
	 * still has to abort, which then replaces the listing of the folder navigated
	 * to once it is done. Listing an encrypted folder takes long enough for that
	 * to happen to the folder the picker was opened in, so the root is listed
	 * again until the folder shows up in it.
	 *
	 * The picker has two navigations: the views on the side, which also have an
	 * "All files" entry, and the breadcrumbs - told apart by the views having
	 * "Favorites" as well.
	 *
	 * @param name - Name of the folder to open
	 */
	public async openFolderInRoot(name: string): Promise<void> {
		const views = this.dialogLocator
			.getByRole('navigation')
			.filter({ has: this.page.getByRole('button', { name: 'Favorites' }) })
		const breadcrumbs = this.dialogLocator
			.getByRole('navigation')
			.filter({ hasNot: this.page.getByRole('button', { name: 'Favorites' }) })

		await breadcrumbs.getByRole('button', { name: 'All files' }).click()
		let attempt = 0
		await expect(async () => {
			if (attempt++ > 0 && !(await this.getRow(name).isVisible())) {
				// selecting the current view again does not list it anew, so go through another one
				await views.getByRole('button', { name: 'Recent' }).click()
				await views.getByRole('button', { name: 'All files' }).click()
			}
			await expect(this.buttonCopy).toHaveAccessibleName('Copy')
			await this.getRow(name).getByRole('cell', { name, exact: true }).click({ timeout: 5000 })
		}).toPass({ timeout: 30_000 })
		await expect(this.getRow(name)).toHaveCount(0)
	}

	/** Copy into the folder the picker shows and wait for the copy to be done. */
	public async copy(): Promise<void> {
		await this.confirm(this.buttonCopy, 'Copying')
	}

	/** Move into the folder the picker shows and wait for the move to be done. */
	public async move(): Promise<void> {
		await this.confirm(this.buttonMove, 'Moving')
	}

	/**
	 * Confirm the picker and wait for the files app to finish the operation.
	 *
	 * Inside an encrypted folder the COPY and MOVE never reach the network as
	 * such - the app turns them into downloads, uploads and deletes - so there is
	 * no single response to wait for. Instead the progress toast tells: the files
	 * app shows it once it checked the destination for conflicts, and keeps it
	 * until every node is transferred - several round trips for an encrypted
	 * node, so it does not come and go unnoticed.
	 *
	 * @param button - The confirm button
	 * @param progressText - How the progress toast starts
	 */
	private async confirm(button: Locator, progressText: string): Promise<void> {
		// the picker disables its buttons while it loads a folder
		await expect(button).toBeEnabled()
		await button.click()
		await expect(this.dialogLocator).toBeHidden()

		const progress = this.page.getByRole('status').filter({ hasText: progressText })
		await expect(progress).toBeVisible()
		await expect(progress).toHaveCount(0, { timeout: 30_000 })
	}
}
