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
	 * Navigate the picker back to the root of the user's files through its
	 * breadcrumbs.
	 *
	 * The picker has two navigations: the views on the side, which also have an
	 * "All files" entry, and the breadcrumbs - told apart by the views having
	 * "Favorites" as well.
	 */
	public async openRoot(): Promise<void> {
		await this.dialogLocator
			.getByRole('navigation')
			.filter({ hasNot: this.page.getByRole('button', { name: 'Favorites' }) })
			.getByRole('button', { name: 'All files' })
			.click()
		await expect(this.buttonCopy).toHaveAccessibleName('Copy')
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
