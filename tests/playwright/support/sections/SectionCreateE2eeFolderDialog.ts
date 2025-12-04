/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * Generating the key pair (RSA-2048) and encrypting the private key with 600k
 * PBKDF2 rounds is pure main-thread crypto plus three requests. It takes about a
 * second on a developer machine but multiples of that on a loaded CI runner, so
 * it gets its own budget instead of the default expect timeout.
 */
const KEY_GENERATION_TIMEOUT = 60000

/** The recovery phrase step holds the user back for 5 seconds. */
const COUNTDOWN_TIMEOUT = 30000

/** State of the continue button, sampled in one go. */
interface ContinueButtonState {
	label: string
	disabled: boolean
}

/**
 * The dialog walks through its steps with a single action button that is only
 * relabelled, so the per-step buttons below all resolve to the very same
 * element. Waiting for one of them is therefore how a step transition is awaited.
 */
export class SectionCreateE2eeFolderDialog {
	public readonly dialogLocator: Locator
	public readonly buttonContinue: Locator
	public readonly buttonCreateFolder: Locator
	public readonly buttonSetupEncryption: Locator
	public readonly buttonSubmitMnemonic: Locator
	public readonly checkboxConsent: Locator
	public readonly codeRecoveryPhrase: Locator
	public readonly inputFolderName: Locator
	public readonly inputMnemonic: Locator
	public readonly loadingCheckSetup: Locator

	constructor(public readonly page: Page) {
		this.dialogLocator = page.getByRole('dialog', { name: 'Create new encrypted folder' })
		this.buttonSetupEncryption = this.dialogLocator.getByRole('button', { name: /Setup encryption/i })
		// anchored so it also matches the button while it counts down ("Continue (3)")
		this.buttonContinue = this.dialogLocator.getByRole('button', { name: /^Continue/i })
		this.buttonCreateFolder = this.dialogLocator.getByRole('button', { name: /Create folder/i })
		this.buttonSubmitMnemonic = this.dialogLocator.getByRole('button', { name: /Submit/i })
		this.checkboxConsent = this.dialogLocator.getByRole('checkbox', { name: /I understand the risks/i })
		this.loadingCheckSetup = this.dialogLocator.getByText(/Checking encryption setup/i)
		this.codeRecoveryPhrase = this.dialogLocator.getByRole('code')
		this.inputFolderName = this.dialogLocator.getByRole('textbox', { name: /Folder name/i })
		this.inputMnemonic = this.dialogLocator.getByRole('textbox', { name: /Mnemonic/i })
	}

	/**
	 * Unlock the already set up encryption by entering the recovery phrase.
	 *
	 * Shown instead of the "Setup encryption" step whenever the browser session
	 * does not hold the decrypted private key yet, i.e. on every fresh context.
	 */
	public async fillMnemonic(mnemonic: string): Promise<this> {
		await expect(this.inputMnemonic).toBeVisible()
		await this.inputMnemonic.fill(mnemonic)
		await this.checkboxConsent.click({ force: true })
		await expect(this.buttonSubmitMnemonic).toBeEnabled()
		await this.buttonSubmitMnemonic.click()
		return this
	}

	/**
	 * Wait for the dialog and for its initial "Checking encryption setup …" step
	 * to resolve. That step fetches the user's public key, so the first
	 * interactive step only appears after a network round trip.
	 */
	public async waitForSetupCheck(): Promise<void> {
		await expect(this.dialogLocator).toBeVisible()
		await expect(this.loadingCheckSetup).toBeHidden()
	}

	/**
	 * Label and clickability of the continue button, read in a single evaluation.
	 *
	 * The countdown relabels the button and flips its `aria-disabled` one second
	 * apart; sampling the two with separate assertions can straddle a tick and
	 * report a pair of states that never existed at the same time.
	 */
	public async getContinueButtonState(): Promise<ContinueButtonState> {
		return await this.buttonContinue.evaluate((element) => ({
			label: element.textContent?.trim() ?? '',
			disabled: element.getAttribute('aria-disabled') === 'true',
		}))
	}

	/**
	 * Start the initial encryption setup and wait for the generated recovery
	 * phrase to be shown.
	 */
	public async setupEncryption(): Promise<void> {
		await expect(this.buttonSetupEncryption).toBeVisible()
		await expect(this.buttonSetupEncryption).toBeEnabled()
		await this.buttonSetupEncryption.click()

		await expect(this.codeRecoveryPhrase).toBeVisible({ timeout: KEY_GENERATION_TIMEOUT })
	}

	/**
	 * Wait until the continue button is counting down and report that sample, so
	 * callers can assert the button really is unclickable *while* it counts.
	 */
	public async waitForCountdown(): Promise<ContinueButtonState> {
		let state!: ContinueButtonState
		await expect(async () => {
			state = await this.getContinueButtonState()
			expect(state.label).toMatch(/^Continue \(\d\)$/)
		}).toPass({ timeout: COUNTDOWN_TIMEOUT })
		return state
	}

	/**
	 * Wait for the countdown to run out and continue to the next step.
	 *
	 * The individual ticks are deliberately not asserted: each lasts a second
	 * while `expect` polls on a backing-off interval, so a tick can elapse
	 * entirely unobserved.
	 */
	public async continueAfterCountdown(): Promise<void> {
		await expect(this.buttonContinue).toHaveText('Continue', { timeout: COUNTDOWN_TIMEOUT })
		await expect(this.buttonContinue).toBeEnabled()
		await this.buttonContinue.click()
	}

	/**
	 * Fill in the folder name and create the folder. Resolves once the dialog is
	 * gone, i.e. once the folder was created and its metadata stored.
	 */
	public async createFolder(name: string): Promise<void> {
		await expect(this.inputFolderName).toBeVisible()
		await expect(this.buttonCreateFolder).toBeDisabled()

		await this.inputFolderName.fill(name)
		await expect(this.buttonCreateFolder).toBeEnabled()
		await this.buttonCreateFolder.click()

		await expect(this.dialogLocator).toHaveCount(0, { timeout: KEY_GENERATION_TIMEOUT })
	}
}
