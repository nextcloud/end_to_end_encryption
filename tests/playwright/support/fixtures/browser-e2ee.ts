/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { setBrowserE2eeEnabled } from '../utils/config.ts'
import { test as randomUserTest } from './random-user.ts'

interface BrowserE2eeOptions {
	/**
	 * Whether browser based end-to-end encryption is already enabled for the
	 * test user when the test body starts. Declare it per spec file or per
	 * describe block with `test.use({ browserE2ee: true })`.
	 */
	browserE2ee: boolean
}

interface BrowserE2eeFixture {
	/** Applies the {@link BrowserE2eeOptions.browserE2ee} option. Not used directly. */
	browserE2eeSetup: void
}

/**
 * This test fixture can enable browser based end-to-end encryption for the test
 * user up front, so tests about what the feature *does* no longer depend on the
 * settings UI that turns it on.
 *
 * The setting is applied before the test body runs, which is what the app needs:
 * it is delivered as initial state on page load, so enabling it later would only
 * take effect on the next navigation.
 */
export const test = randomUserTest.extend<BrowserE2eeOptions & BrowserE2eeFixture>({
	browserE2ee: [false, { option: true }],

	// `auto` so declaring the option is enough to have it applied
	browserE2eeSetup: [async ({ page, browserE2ee }, use) => {
		if (browserE2ee) {
			await setBrowserE2eeEnabled(page.request, true)
		}
		await use()
	}, { auto: true }],
})
