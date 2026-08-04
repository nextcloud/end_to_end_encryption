/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { expect, mergeTests } from '@playwright/test'
import { SectionCopyMoveDialog } from '../sections/SectionCopyMoveDialog.ts'
import { createEncryptedRootFolder } from '../utils/e2ee.ts'
import { test as encryptedFolderTest } from './encrypted-folder.ts'

interface CopyMoveFixture {
	/** The destination picker of the "Move or copy" action. */
	copyMoveDialog: SectionCopyMoveDialog

	/**
	 * Name of an empty folder in the home directory that is *not* encrypted, to
	 * copy and move across the border of the encrypted world.
	 */
	unencryptedFolder: string

	/**
	 * Name of a second, empty encrypted root folder - one with a metadata and a
	 * metadata key of its own, which is what makes it a different encrypted world
	 * than {@link encryptedFolder} rather than another folder inside the same one.
	 */
	secondEncryptedFolder: string
}

/**
 * Everything a test about copying or moving encrypted files needs: the picker
 * that drives it, plus the counterparts to copy and move to.
 *
 * The two folders are created by fixtures rather than by the tests because the
 * order matters and is easy to get wrong: creating them means leaving the
 * encrypted folder the {@link encryptedFolder} fixture navigated into, so both
 * navigate back into it afterwards. Depending on that fixture is what makes them
 * run after it in the first place - and keeps them from doing so while the tests
 * would rather be inside the encrypted folder.
 *
 * They navigate rather than reload, all the way through: the encryption is
 * unlocked when a test starts, and a reload would drop the decrypted private key
 * and have the app ask for the recovery phrase again - somewhere in the middle of
 * the copy or move the test is about.
 */
export const test = mergeTests(encryptedFolderTest)
	.extend<CopyMoveFixture>({
		copyMoveDialog: async ({ page }, use) => {
			await use(new SectionCopyMoveDialog(page))
		},

		unencryptedFolder: async ({ filesApp, encryptedFolder }, use) => {
			const name = `unencrypted - ${globalThis.crypto.randomUUID()}`

			await filesApp.navigateToHome()
			await filesApp.openNewMenu()
				.then((menu) => menu.createNewFolder())
				.then((dialog) => dialog.createFolder(name))
			await expect(filesApp.getFileOrFolder(name)).toBeVisible()

			await filesApp.openFolder(encryptedFolder)

			await use(name)
		},

		secondEncryptedFolder: async ({ filesApp, mnemonic, encryptedFolder }, use) => {
			const name = `second encrypted - ${globalThis.crypto.randomUUID()}`

			await filesApp.navigateToHome()
			await createEncryptedRootFolder(filesApp, name, mnemonic)
			await expect(filesApp.getFileOrFolder(name)).toBeVisible()

			await filesApp.openFolder(encryptedFolder)

			await use(name)
		},
	})
