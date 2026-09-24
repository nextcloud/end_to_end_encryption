/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/** Asks the folder owner to migrate pending file drop entries. */
export class SectionFileDropMigrationDialog {
	public readonly dialogLocator: Locator
	public readonly buttonMigrateNow: Locator
	public readonly buttonMigrateLater: Locator

	constructor(public readonly page: Page) {
		this.dialogLocator = page.getByRole('dialog', { name: 'Pending file drop migrations' })
		this.buttonMigrateNow = this.dialogLocator.getByRole('button', { name: 'Migrate now' })
		this.buttonMigrateLater = this.dialogLocator.getByRole('button', { name: 'Migrate later' })
	}

	public async migrateNow(): Promise<void> {
		await this.buttonMigrateNow.click()
		await expect(this.dialogLocator).toHaveCount(0)
	}
}
