/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { SectionFileActionsMenu } from './SectionFileActionsMenu.ts'
import { SectionMnemonicDialog } from './SectionMnemonicDialog.ts'
import { SectionNewMenu } from './SectionNewMenu.ts'

/** How long to keep retrying to open a menu. */
const OPEN_MENU_TIMEOUT = 15000

export class FilesAppPage {
	public readonly buttonNewMenuLocator: Locator
	public readonly dialogMnemonicLocator: Locator
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
		this.dialogMnemonicLocator = this.page.getByRole('dialog', { name: 'Enter your 12 words mnemonic' })
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

	public openFileOrFolder(name: string): Promise<void> {
		return this.getFileOrFolder(name)
			.getByRole('button', { name: `Open folder ${name}` })
			.click()
	}

	/**
	 * Navigate into a folder and wait until its contents are rendered.
	 *
	 * @param name - Name of the folder to open
	 */
	public async openFolder(name: string): Promise<void> {
		await this.openFileOrFolder(name)
		await this.waitForListLoaded()
	}

	/**
	 * Upload a text file into the current folder and wait for its row to appear.
	 *
	 * Note that inside an encrypted folder this returns while the parent metadata
	 * is still being rewritten - wrap the call in `withEncryptedFolderUpdate` to
	 * await that too, or use `uploadFileToEncryptedFolder`.
	 *
	 * @param name - Name of the file to create
	 * @param content - Contents of the file
	 */
	public async uploadTextFile(name: string, content: string = `content of ${name}\n`): Promise<void> {
		const newMenu = await this.openNewMenu()
		await newMenu.uploadFiles({ name, mimeType: 'text/plain', buffer: Buffer.from(content) })
		await expect(this.getFileOrFolder(name)).toBeVisible()
	}

	public getMnemonicDialog(): SectionMnemonicDialog {
		return new SectionMnemonicDialog(this.dialogMnemonicLocator)
	}

	/**
	 * Reload the files app and navigate back into an encrypted folder, unlocking
	 * it again on the way.
	 *
	 * Reloading drops the decrypted private key - it is only ever held in memory -
	 * so entering the folder asks for the recovery phrase again. This is what
	 * makes an assertion afterwards a statement about the server state instead of
	 * about the list the browser still had in its store.
	 *
	 * @param name - Name of the encrypted folder to open
	 * @param mnemonic - Recovery phrase to unlock it with
	 */
	public async reopenEncryptedFolder(name: string, mnemonic: string): Promise<void> {
		await this.openFilesApp()
		await this.openFileOrFolder(name)
		await this.getMnemonicDialog().fillAndSubmit(mnemonic)
		await this.waitForListLoaded()
	}

	/**
	 * Open the actions menu of a row.
	 *
	 * Retried like {@link openNewMenu}: the row's NcActions can swallow a click
	 * while the list is still settling, and only clicking while the menu is
	 * closed keeps a retry from toggling an open menu shut again.
	 *
	 * @param name - Name of the file or folder whose menu to open
	 */
	public async openActionsMenu(name: string): Promise<SectionFileActionsMenu> {
		const trigger = this.getFileOrFolder(name).getByRole('button', { name: 'Actions' })
		const actionsMenu = new SectionFileActionsMenu(this.page)

		await expect(async () => {
			if (!(await actionsMenu.menuLocator.isVisible())) {
				await trigger.click()
			}
			await expect(actionsMenu.menuLocator).toBeVisible({ timeout: 2000 })
		}).toPass({ timeout: OPEN_MENU_TIMEOUT })

		return actionsMenu
	}

	/**
	 * Delete a file or folder through its actions menu and wait for it to be gone
	 * from the list.
	 *
	 * Deleting is not confirmed by a dialog: the files app only asks when the
	 * `show_dialog_deletion` user config is enabled, which it is not by default.
	 *
	 * Note that for a node inside an encrypted folder this returns while the
	 * parent metadata is still being rewritten - wrap the call in
	 * `withEncryptedFolderUpdate` to await that too.
	 *
	 * @param name - Name of the file or folder to delete
	 * @param mnemonic - Recovery phrase, if the deletion is expected to ask for it.
	 * Deleting an encrypted root folder rewrites its metadata, so a browser session
	 * that has not unlocked the key pair yet - a freshly loaded page - is asked to.
	 */
	public async deleteFileOrFolder(name: string, mnemonic?: string): Promise<void> {
		const actionsMenu = await this.openActionsMenu(name)
		await actionsMenu.getDeleteEntry().click()
		if (mnemonic !== undefined) {
			await this.getMnemonicDialog().fillAndSubmit(mnemonic)
		}
		await expect(this.getFileOrFolder(name)).toHaveCount(0)
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
