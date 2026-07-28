/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Page } from '@playwright/test'
import type { FilesAppPage } from '../sections/FilesAppPage.ts'

export const LOCK_ENDPOINT = '/ocs/v2.php/apps/end_to_end_encryption/api/v2/lock/'

/**
 * Create an encrypted root folder through the "New encrypted folder" dialog.
 *
 * The recovery phrase is needed because the key pair of the shared account
 * already exists while a fresh browser session has not unlocked it yet, so the
 * dialog asks for it before it gets to the folder name.
 *
 * @param filesApp - The files app, opened and settled
 * @param name - Name of the folder to create
 * @param mnemonic - Recovery phrase of the account
 */
export async function createEncryptedRootFolder(filesApp: FilesAppPage, name: string, mnemonic: string): Promise<void> {
	await filesApp.openNewMenu()
		.then((menu) => menu.createNewE2eeFolder())
		.then((dialog) => dialog.fillMnemonic(mnemonic))
		.then((dialog) => dialog.createFolder(name))
}

/**
 * Run an action that mutates the contents of an encrypted folder and wait for
 * the app to have written the folder's metadata back to the server.
 *
 * Every such operation follows the same shape: lock the parent, do the WebDAV
 * request, update the parent metadata, unlock the parent - the unlock sitting in
 * a `finally` so it always concludes the operation. The WebDAV response is
 * therefore the wrong thing to wait for, as it arrives while the metadata is
 * still unwritten; a test continuing there would reload a folder whose listing
 * has not been updated yet and fail for a reason that has nothing to do with it.
 *
 * The wait is armed before the action runs, so an operation that completes
 * quickly cannot slip through unobserved. Awaiting it after every mutation also
 * means no request of the previous operation is ever still in flight when the
 * next one starts, which is what keeps the trailing unlock unambiguous.
 *
 * @param page - Page the action runs on
 * @param action - The mutation to perform
 */
export async function withEncryptedFolderUpdate<T>(page: Page, action: () => Promise<T>): Promise<T> {
	const unlocked = page.waitForResponse((response) => response.request().method() === 'DELETE'
		&& response.url().includes(LOCK_ENDPOINT))

	const result = await action()
	await unlocked

	return result
}
