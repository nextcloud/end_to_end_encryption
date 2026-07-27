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
}
