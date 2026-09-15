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
	 */
	public async openFilesApp(): Promise<void> {
		await this.page.goto('/apps/files')
		// make sure Vue is mounted and the list is rendered before returning
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
	 */
	public async waitForListLoaded(): Promise<void> {
		const indicator = this.getLoadingIndicator()
		// is triggered synchronously with the action that triggers the fetch,
		// so it can be missed if the fetch resolves before the first poll
		await indicator.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {})
		await indicator.waitFor({ state: 'hidden' })
	}

	/**
	 * Open the "New" menu of the files list header.
	 */
	public async openNewMenu(): Promise<SectionNewMenu> {
		const newMenu = new SectionNewMenu(this.page)

		await expect(async () => {
			// * Opening is retried until the menu is actually visible:
			// the upload picker's NcActions can swallow the first click
			// while it is still mounting
			if (!(await newMenu.menuLocator.isVisible())) {
				await this.buttonNewMenuLocator.click()
			}
			await expect(newMenu.menuLocator).toBeVisible({ timeout: 2000 })
		}).toPass({ timeout: OPEN_MENU_TIMEOUT })

		return newMenu
	}

	/** The breadcrumbs of the files list, naming the folder that is open. */
	public getBreadcrumbs(): Locator {
		return this.page.getByRole('navigation', { name: 'Current directory path' })
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

	/**
	 * The rename input of the row that is currently being renamed.
	 *
	 * @param type - Whether a file or a folder is being renamed
	 */
	public getRenameInput(type: 'file' | 'folder' = 'file'): Locator {
		// looked up page wide: the renamed row replaces its name cell with the
		// form, and only one row can be in rename mode at a time
		return this.page.getByRole('form', { name: 'Rename file' })
			.getByRole('textbox', { name: type === 'folder' ? 'Folder name' : 'Filename' })
	}

	/**
	 * Start renaming a file or folder and return the rename input, which the
	 * files app has prefilled with the current name.
	 *
	 * @param name - Name of the file or folder to rename
	 * @param type - Whether the target is a file or a folder
	 */
	public async startRenaming(name: string, type: 'file' | 'folder' = 'file'): Promise<Locator> {
		const actionsMenu = await this.openActionsMenu(name)
		await actionsMenu.getRenameEntry().click()

		const input = this.getRenameInput(type)
		await expect(input).toBeVisible()
		return input
	}

	/**
	 * Rename a file or folder and wait for the renamed row to appear.
	 *
	 * Inside an encrypted folder this returns while the parent metadata is still
	 * being rewritten - wrap the call in `withEncryptedFolderUpdate` to await that.
	 *
	 * @param name - Current name of the file or folder
	 * @param newName - Name to rename it to
	 * @param type - Whether the target is a file or a folder
	 */
	public async renameFileOrFolder(name: string, newName: string, type: 'file' | 'folder' = 'file'): Promise<void> {
		const input = await this.startRenaming(name, type)
		await input.fill(newName)
		await input.press('Enter')
		await expect(this.getFileOrFolder(newName)).toBeVisible()
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
