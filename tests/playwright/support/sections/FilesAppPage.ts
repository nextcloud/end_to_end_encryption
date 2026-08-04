/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { SectionCopyMoveDialog } from './SectionCopyMoveDialog.ts'
import { SectionFileActionsMenu } from './SectionFileActionsMenu.ts'
import { SectionMnemonicDialog } from './SectionMnemonicDialog.ts'
import { SectionNewMenu } from './SectionNewMenu.ts'

/** How long to keep retrying to open a menu. */
const OPEN_MENU_TIMEOUT = 15000

/**
 * Escape a string for use inside a regular expression, so a file name is matched
 * as itself - the dot of an extension especially.
 *
 * @param value - The string to escape
 */
function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

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

	/**
	 * The row of the file or folder with exactly this name.
	 *
	 * {@link getFileOrFolder} matches the name as a substring of the accessible
	 * name of a cell, so it cannot tell apart the very names a test about copying
	 * has to: a copy that ended up as "file (1).txt" next to the "file.txt" it was
	 * made from. This matches the name element of the row instead, which holds the
	 * display name and nothing else.
	 *
	 * The files app renders that name in two elements - the base name and the
	 * extension - so the text of their common parent has the whitespace that sits
	 * between them in the template ("file" + " " + ".txt"), which the pattern below
	 * allows for.
	 *
	 * @param name - Full name of the file or folder, extension included
	 */
	public getFileOrFolderExactly(name: string): Locator {
		const extension = name.match(/\.[^.]*$/)?.[0] ?? ''
		const base = extension ? name.slice(0, -extension.length) : name
		const pattern = new RegExp(`^${escapeRegExp(base)}\\s*${escapeRegExp(extension)}$`)

		return this.tableFilesList
			.getByRole('row')
			.filter({ has: this.page.locator('[data-cy-files-list-row-name-link]').filter({ hasText: pattern }) })
	}

	/**
	 * All rows of the files list, i.e. its contents without the header row.
	 *
	 * Counting them is how a test states that nothing *else* ended up in a folder -
	 * a second copy of a file, or one stored under the UUID it has on the server
	 * instead of under its name.
	 */
	public getAllRows(): Locator {
		return this.filesListLocator.locator('[data-cy-files-list-row]')
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
	 * Navigate back to the home directory through the breadcrumbs.
	 *
	 * Unlike {@link openFilesApp} this does not reload the page, which is what a
	 * test that has to get out of an encrypted folder and back in needs: the
	 * decrypted private key is only held in memory, so a reload means unlocking it
	 * again - with a recovery phrase prompt in the middle of whatever the test was
	 * doing, or a stuck folder listing if nothing answers it.
	 */
	public async navigateToHome(): Promise<void> {
		await this.page.getByRole('navigation', { name: 'Current directory path' })
			.getByRole('button', { name: 'All files' })
			.click()
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
	 * Open the destination picker of the "Move or copy" action for a row.
	 *
	 * @param name - Name of the file or folder to move or copy
	 */
	public async openMoveOrCopyDialog(name: string): Promise<SectionCopyMoveDialog> {
		const actionsMenu = await this.openActionsMenu(name)
		await actionsMenu.getMoveOrCopyEntry().click()

		return await new SectionCopyMoveDialog(this.page).waitForOpen()
	}

	/**
	 * Download a file through its actions menu and return what was downloaded.
	 *
	 * For an encrypted file this is the only way to state that its contents made it
	 * through an operation intact: the file is stored encrypted with a key that
	 * only lives in the metadata of the folder it is in, so a copy that kept its
	 * name but lost - or mismatched - its key looks exactly like a correct one in
	 * the list, and only fails once something decrypts it.
	 *
	 * @param name - Name of the file to download
	 */
	public async downloadFileContent(name: string): Promise<string> {
		const actionsMenu = await this.openActionsMenu(name)

		// armed before the click: the download starts with it
		const download = this.page.waitForEvent('download')
		await actionsMenu.getDownloadEntry().click()

		const stream = await (await download).createReadStream()
		const chunks: Buffer[] = []
		for await (const chunk of stream) {
			chunks.push(Buffer.from(chunk))
		}
		return Buffer.concat(chunks).toString('utf-8')
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
