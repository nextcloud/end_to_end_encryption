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
	public readonly headingUserShares: Locator
	public readonly buttonCreateLinkShare: Locator
	public readonly buttonCreateEmailShare: Locator
	public readonly listLinkShares: Locator

	constructor(public readonly page: Page) {
		this.sidebarLocator = page.getByRole('complementary')
		this.headingUserShares = this.sidebarLocator.getByRole('heading', { name: 'End-to-end encrypted shares' })
		this.buttonCreateLinkShare = this.sidebarLocator.getByRole('button', { name: 'Link share', exact: true })
		this.buttonCreateEmailShare = this.sidebarLocator.getByRole('button', { name: 'Email share', exact: true })
		this.listLinkShares = this.sidebarLocator.getByRole('list', { name: 'End-to-end encrypted link shares' })
	}

	public async openLinkShareDialog(): Promise<SectionLinkShareDialog> {
		const dialog = new SectionLinkShareDialog(this.page)
		await this.buttonCreateLinkShare.click()
		await expect(dialog.dialogLocator).toBeVisible()
		return dialog
	}

	public async openEmailShareDialog(): Promise<SectionLinkShareDialog> {
		const dialog = new SectionLinkShareDialog(this.page, true)
		await this.buttonCreateEmailShare.click()
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
		const shares = this.listLinkShares.getByRole('listitem')
		const count = await shares.count()

		const dialog = await this.openLinkShareDialog()
		await dialog.createFileDrop(options)
		await expect(shares).toHaveCount(count + 1)

		const url = (await shares.last().getByRole('link').getAttribute('href'))!
		return url.split('/s/').at(-1)!
	}
}
