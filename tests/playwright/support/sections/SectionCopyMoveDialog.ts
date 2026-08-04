/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * A copy or move of an encrypted file is not a single WebDAV request: the app
 * takes it apart into a stat, a download, an upload and a metadata rewrite of the
 * receiving folder - all of them behind the fetch interceptor, so the COPY or
 * MOVE the files app issued never reaches the network at all. Waiting for the
 * operation therefore cannot wait for a response, and the crypto plus the
 * additional round trips make it much slower than the plain server side copy.
 */
const ACTION_TIMEOUT = 60000

/** How long to wait for the picker to be interactive, initial listing included. */
const PICKER_TIMEOUT = 30000

/**
 * The destination picker of the files app "Move or copy" action - the FilePicker
 * dialog of `@nextcloud/dialogs`.
 *
 * Everything the picker shows about an encrypted node comes from two different
 * places: its *name* is the decrypted one from the folder metadata, while its
 * *path* is the one on the server, whose last segment is the UUID the node is
 * stored under. Rows are therefore addressed by name, and the confirm buttons -
 * which the files app labels with the destination's path - by pattern.
 */
export class SectionCopyMoveDialog {
	public readonly dialogLocator: Locator

	constructor(public readonly page: Page) {
		this.dialogLocator = page.getByRole('dialog', { name: 'Choose destination' })
	}

	/**
	 * A row of the picker, addressed by the name it displays.
	 *
	 * The picker tags its rows with `data-filename`, but that is the name on the
	 * server - for anything inside an encrypted folder a UUID, which a test has no
	 * way to know. The name element is matched instead; the picker splits a name
	 * into its base and its extension, so the match is on the element holding both.
	 *
	 * @param name - Name of the file or folder as it is displayed
	 */
	public getRow(name: string): Locator {
		return this.dialogLocator
			.locator('[data-testid="file-list-row"]')
			.filter({ has: this.page.locator('[data-testid="row-name"]').getByText(name, { exact: true }) })
	}

	/**
	 * The breadcrumbs of the picker.
	 *
	 * The dialog holds two navigations: the view list on the left - which carries
	 * the "All files", "Recent" and "Favorites" shortcuts - and the breadcrumbs of
	 * the current destination. Only the latter changes the destination folder, so
	 * it is picked as the navigation without those shortcuts.
	 */
	public getBreadcrumbs(): Locator {
		return this.dialogLocator
			.getByRole('navigation')
			.filter({ hasNot: this.page.getByRole('button', { name: 'Favorites' }) })
	}

	/**
	 * The skeleton rows the picker renders while it loads a listing. They are
	 * `aria-hidden`, so there is no role to address them by.
	 */
	public getLoadingRows(): Locator {
		return this.dialogLocator.locator('.loading-row')
	}

	/**
	 * The button that confirms the operation.
	 *
	 * Its label is "Copy"/"Move" for the folder the picker opened in and
	 * "Copy to <target>"/"Move to <target>" for any other one. The target is the
	 * last segment of the destination *path*, which for a folder inside an
	 * encrypted folder is its UUID - hence the pattern instead of the name the
	 * picker displays.
	 *
	 * @param action - Which of the two buttons to address
	 */
	public getConfirmButton(action: 'Copy' | 'Move'): Locator {
		return this.dialogLocator.getByRole('button', { name: new RegExp(`^${action}( to .+)?$`) })
	}

	/** Wait for the dialog and its initial listing to be there. */
	public async waitForOpen(): Promise<this> {
		await expect(this.dialogLocator).toBeVisible()
		await expect(this.getLoadingRows()).toHaveCount(0, { timeout: PICKER_TIMEOUT })
		return this
	}

	/**
	 * Navigate the destination into a folder, or through several of them.
	 *
	 * No wait is needed between two steps: the row of the next folder only exists
	 * once the listing of the current one is there, and Playwright waits for it.
	 *
	 * @param path - Names of the folders to enter, separated by slashes
	 */
	public async navigateTo(path: string): Promise<this> {
		for (const name of path.split('/').filter(Boolean)) {
			await this.getRow(name).click()
		}
		await expect(this.getLoadingRows()).toHaveCount(0, { timeout: PICKER_TIMEOUT })
		return this
	}

	/** Navigate the destination back to the home directory of the user. */
	public async navigateToAllFiles(): Promise<this> {
		await this.getBreadcrumbs().getByRole('button', { name: 'All files' }).click()
		await expect(this.getLoadingRows()).toHaveCount(0, { timeout: PICKER_TIMEOUT })
		return this
	}

	/** Copy into the folder the picker currently shows. */
	public async copyToCurrentFolder(): Promise<void> {
		await this.confirm('Copy')
	}

	/** Move into the folder the picker currently shows. */
	public async moveToCurrentFolder(): Promise<void> {
		await this.confirm('Move')
	}

	/**
	 * Copy into the given folder, relative to what the picker currently shows.
	 *
	 * @param path - Names of the folders to enter, separated by slashes
	 */
	public async copyToFolder(path: string): Promise<void> {
		await this.navigateTo(path)
		await this.confirm('Copy')
	}

	/**
	 * Move into the given folder, relative to what the picker currently shows.
	 *
	 * @param path - Names of the folders to enter, separated by slashes
	 */
	public async moveToFolder(path: string): Promise<void> {
		await this.navigateTo(path)
		await this.confirm('Move')
	}

	/**
	 * Confirm the operation and wait for it to be finished.
	 *
	 * The picker keeps its buttons disabled while a listing loads, so being
	 * enabled is what says the destination is settled and the click will not be
	 * dropped.
	 *
	 * @param action - Whether to copy or to move
	 */
	private async confirm(action: 'Copy' | 'Move'): Promise<void> {
		const button = this.getConfirmButton(action)
		await expect(button).toBeEnabled({ timeout: PICKER_TIMEOUT })
		await button.click()

		await expect(this.dialogLocator).toHaveCount(0)
		await this.waitForActionFinished()
	}

	/**
	 * Wait for the copy or move to be done.
	 *
	 * The files app shows a loading toast for the whole operation and only hides
	 * it once every node has been transferred, which for an encrypted node
	 * includes the metadata rewrite of the receiving folder. That toast going away
	 * is therefore the only signal that the app is done - and waiting for it also
	 * keeps it from covering the list for whatever the test does next.
	 *
	 * Its appearance is only waited for briefly and failure to see it is ignored:
	 * the toast is shown before the first request of the operation, so an
	 * operation that finished before the first poll was never observed as loading
	 * - but one that reports an error instead of showing a toast has to be caught
	 * by the assertion below rather than by a timeout with no explanation.
	 */
	private async waitForActionFinished(): Promise<void> {
		const loading = this.page.locator('.toastify.toast-loading')
		await loading.first().waitFor({ state: 'visible', timeout: 2000 }).catch(() => {})
		await expect(loading).toHaveCount(0, { timeout: ACTION_TIMEOUT })

		const error = this.page.locator('.toastify.toast-error')
		await expect(error, 'the copy or move operation reported an error').toHaveCount(0)
	}
}
