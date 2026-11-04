/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * The "Debug encryption" dialog of an encrypted folder.
 *
 * Every part of the report is a section named by its heading, so it is exposed
 * as a region with that name.
 */
export class SectionEncryptedFolderDebugDialog {
	public readonly dialogLocator: Locator
	public readonly sectionSummary: Locator
	public readonly sectionChecks: Locator
	public readonly sectionFileDrop: Locator
	public readonly sectionContents: Locator
	public readonly sectionUnknownNodes: Locator
	public readonly sectionMetadata: Locator
	public readonly buttonToggleMetadata: Locator

	constructor(
		public readonly page: Page,
		folderName: string,
	) {
		this.dialogLocator = page.getByRole('dialog', { name: `Debug encryption of ${folderName}` })
		this.sectionSummary = this.dialogLocator.getByRole('region', { name: 'Summary' })
		this.sectionChecks = this.dialogLocator.getByRole('region', { name: 'Checks' })
		this.sectionFileDrop = this.dialogLocator.getByRole('region', { name: 'File drop' })
		this.sectionContents = this.dialogLocator.getByRole('region', { name: 'Files and folders' })
		this.sectionUnknownNodes = this.dialogLocator.getByRole('region', { name: 'Not listed in the metadata' })
		this.sectionMetadata = this.dialogLocator.getByRole('region', { name: 'Decrypted metadata' })
		this.buttonToggleMetadata = this.sectionMetadata.getByRole('button', { name: /^(Show|Hide) metadata$/ })
	}

	/**
	 * Wait until the report is shown, i.e. the metadata was loaded and inspected.
	 *
	 * The checks are always part of a report, while an error replaces the whole report.
	 */
	public async waitForReport(): Promise<void> {
		await expect(this.dialogLocator).toBeVisible()
		await expect(this.sectionChecks).toBeVisible()
	}

	/**
	 * The value of a row of the summary table.
	 *
	 * @param label - The label of the row, e.g. "Metadata version"
	 */
	public getSummaryRow(label: string): Locator {
		return this.sectionSummary.getByRole('row', { name: label })
	}

	/** All checks of the report */
	public getChecks(): Locator {
		return this.sectionChecks.getByRole('listitem')
	}

	/**
	 * A single check of the report.
	 *
	 * @param label - The label of the check, e.g. "Metadata signature is valid"
	 */
	public getCheck(label: string): Locator {
		return this.getChecks().filter({ hasText: label })
	}

	/**
	 * A file or folder listed in the metadata.
	 *
	 * @param name - The decrypted name of the file or folder
	 */
	public getContentsEntry(name: string): Locator {
		return this.sectionContents.getByRole('listitem').filter({ hasText: name })
	}

	/**
	 * A file drop entry of the metadata.
	 *
	 * @param name - The decrypted name of the dropped file
	 */
	public getFileDropEntry(name: string): Locator {
		return this.sectionFileDrop.getByRole('listitem').filter({ hasText: name })
	}

	/** Show the redacted metadata */
	public async showMetadata(): Promise<void> {
		await expect(this.buttonToggleMetadata).toHaveAttribute('aria-expanded', 'false')
		await this.buttonToggleMetadata.click()
		await expect(this.buttonToggleMetadata).toHaveAttribute('aria-expanded', 'true')
	}
}
