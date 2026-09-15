/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

/**
 * The actions menu of a single row of the files list.
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
	 */
	public getDeleteEntry(): Locator {
		return this.getMenuEntry(/^Delete (file|folder)$/i)
	}

	/** The entry that turns the name of the row into an input. */
	public getRenameEntry(): Locator {
		return this.getMenuEntry(/^Rename$/i)
	}
}
