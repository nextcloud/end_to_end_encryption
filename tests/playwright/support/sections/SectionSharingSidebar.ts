/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { SectionLinkShareDialog } from './SectionLinkShareDialog.ts'

/**
 * The end-to-end encrypted sections of the sharing tab in the files sidebar.
 */
export class SectionSharingSidebar {
	public readonly sidebarLocator: Locator
	public readonly buttonCreateLinkShare: Locator
	public readonly listLinkShares: Locator

	constructor(public readonly page: Page) {
		this.sidebarLocator = page.getByRole('complementary')
		this.buttonCreateLinkShare = this.sidebarLocator.getByRole('button', { name: 'Link share' })
		this.listLinkShares = this.sidebarLocator.getByRole('list', { name: 'End-to-end encrypted link shares' })
	}

	public async openLinkShareDialog(): Promise<SectionLinkShareDialog> {
		const dialog = new SectionLinkShareDialog(this.page)
		await this.buttonCreateLinkShare.click()
		await expect(dialog.dialogLocator).toBeVisible()
		return dialog
	}

	/**
	 * Create a file drop share and return its token.
	 *
	 * @param options - Optional password and note of the share
	 * @param options.password - Password of the share
	 * @param options.note - Note to the recipient
	 */
	public async createFileDrop(options: { password?: string, note?: string } = {}): Promise<string> {
		const dialog = await this.openLinkShareDialog()
		await dialog.createFileDrop(options)

		const link = this.listLinkShares.getByRole('link')
		await expect(link).toHaveCount(1)
		const url = (await link.getAttribute('href'))!
		return url.split('/s/').at(-1)!
	}
}
