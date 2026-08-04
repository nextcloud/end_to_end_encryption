/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

/**
 * The actions menu of a single row of the files list.
 *
 * The files list does not name the menu per row - its trigger falls back to
 * NcActions' default "Actions" label - so the menu is looked up page wide. Only
 * one row menu can be open at a time, which is what makes that unambiguous.
 */
export class SectionFileActionsMenu {
	public readonly menuLocator: Locator

	constructor(public readonly page: Page) {
		this.menuLocator = page.getByRole('menu', { name: 'Actions' })
	}

	public getMenuEntry(name: string | RegExp): Locator {
		return this.menuLocator.getByRole('menuitem', { name })
	}

	/**
	 * The entry that moves the node to the trash bin.
	 *
	 * The files app words it after what is selected, so it is matched anchored
	 * for both a file and a folder - an unanchored /Delete/ would also match
	 * "Delete permanently" of the trash bin view.
	 */
	public getDeleteEntry(): Locator {
		return this.getMenuEntry(/^Delete (file|folder)$/i)
	}

	/**
	 * The entry that opens the destination picker.
	 *
	 * The files app words it after what the permissions of the node allow, so all
	 * three wordings are accepted - a node that can only be copied has no "Move"
	 * in its label, and one that can only be moved has no "Copy".
	 */
	public getMoveOrCopyEntry(): Locator {
		return this.getMenuEntry(/^(Move or copy|Move|Copy)$/i)
	}

	/**
	 * The entry that downloads the node.
	 *
	 * This app replaces the files app download action for encrypted nodes with one
	 * that decrypts on the way out ("Download unencrypted"), so which of the two
	 * is offered depends on where the node is - which is exactly what a test
	 * copying a file out of an encrypted folder must not have to know.
	 */
	public getDownloadEntry(): Locator {
		return this.getMenuEntry(/^Download( unencrypted)?$/i)
	}
}
