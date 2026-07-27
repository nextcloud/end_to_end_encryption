/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { APIRequestContext } from '@playwright/test'

import { expect } from '@playwright/test'

export const BROWSER_E2EE_CONFIG_KEY = 'e2eeInBrowserEnabled'
export const BROWSER_E2EE_CONFIG_ENDPOINT = `apps/end_to_end_encryption/api/v1/config/${BROWSER_E2EE_CONFIG_KEY}`

/**
 * Toggle the current user's "E2EE navigation in browser" setting through the
 * app's config API rather than the personal settings UI.
 *
 * Tests that merely need the feature switched on should neither pay for nor be
 * able to fail on a multi step click-through of the settings page — only the
 * personal settings spec itself exercises that path.
 *
 * @param request - Request context of a logged-in browser session. The endpoint
 * is session authenticated and CSRF protected, hence the token round trip.
 * @param enabled - Whether to enable or disable browser based E2EE
 */
export async function setBrowserE2eeEnabled(request: APIRequestContext, enabled: boolean): Promise<void> {
	const tokenResponse = await request.get('./csrftoken', { failOnStatusCode: true })
	const { token } = await tokenResponse.json()

	const response = await request.put(BROWSER_E2EE_CONFIG_ENDPOINT, {
		headers: { requesttoken: token },
		data: { value: enabled ? 'true' : 'false' },
	})
	expect(response.status(), `Setting ${BROWSER_E2EE_CONFIG_KEY} to ${enabled} failed`).toBe(200)
}
