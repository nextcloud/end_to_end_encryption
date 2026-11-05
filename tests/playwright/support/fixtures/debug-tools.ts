/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { setDebugToolsAllowed, setDebugToolsEnabled } from '../utils/config.ts'
import { test as encryptedFolderTest } from './encrypted-folder.ts'

interface DebugToolsOptions {
	/**
	 * Whether the debugging tools are enabled for the e2ee user when the files
	 * app is loaded. Declare it per spec file or per describe block with
	 * `test.use({ debugTools: false })`.
	 */
	debugTools: boolean
}

/**
 * An encrypted folder of a user whose debugging tools are enabled or disabled
 * as declared by the {@link DebugToolsOptions.debugTools} option.
 *
 * The setting is applied on the page itself, which every other fixture builds
 * on: it is delivered as initial state on page load, so it has to be in place
 * before the encrypted folder fixture opens the files app. It is applied either
 * way, as the account - and with it the setting - is shared by all tests of a
 * worker.
 */
export const test = encryptedFolderTest.extend<DebugToolsOptions>({
	debugTools: [true, { option: true }],

	page: async ({ page, debugTools }, use) => {
		if (debugTools) {
			await setDebugToolsAllowed(true)
		}
		await setDebugToolsEnabled(page.request, debugTools)
		await use(page)
	},
})
