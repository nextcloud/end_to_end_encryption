/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { SectionLinkShareDialog } from './SectionLinkShareDialog.ts'

/** The sharing tab of the files sidebar for an end-to-end encrypted folder. */
export class SectionSharingTab {
	public readonly panelLocator: Locator
	public readonly headingUserShares: Locator
	public readonly listLinkShares: Locator
	public readonly buttonNewLinkShare: Locator

	constructor(public readonly page: Page) {
		this.panelLocator = page.getByRole('tabpanel', { name: 'Sharing' })
		this.headingUserShares = this.panelLocator.getByRole('heading', { name: 'End-to-end encrypted shares' })
		this.listLinkShares = this.panelLocator.getByRole('list', { name: 'End-to-end encrypted link shares' })
		this.buttonNewLinkShare = this.panelLocator.getByRole('button', { name: 'Link share', exact: true })
	}

	public async createUploadOnlyLinkShare(): Promise<void> {
		const shares = this.listLinkShares.getByRole('listitem')
		const count = await shares.count()

		await this.buttonNewLinkShare.click()
		await new SectionLinkShareDialog(this.page).createUploadOnlyShare()
		await expect(shares).toHaveCount(count + 1)
	}
}
