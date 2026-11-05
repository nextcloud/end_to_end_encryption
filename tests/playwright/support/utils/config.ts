/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { APIRequestContext } from '@playwright/test'

import { expect, request as playwrightRequest, test } from '@playwright/test'
import { withRetry } from './retry.ts'

export const BROWSER_E2EE_CONFIG_KEY = 'e2eeInBrowserEnabled'
export const BROWSER_E2EE_CONFIG_ENDPOINT = `apps/end_to_end_encryption/api/v1/config/${BROWSER_E2EE_CONFIG_KEY}`
export const DEBUG_TOOLS_CONFIG_KEY = 'debug_tools_enabled'
export const DEBUG_TOOLS_CONFIG_ENDPOINT = `apps/end_to_end_encryption/api/v1/config/${DEBUG_TOOLS_CONFIG_KEY}`

/**
 * Set a user config value of the current user through the app's config API.
 *
 * @param request - Request context of a logged-in browser session. The endpoint
 * is session authenticated and CSRF protected, hence the token round trip.
 * @param key - The config key
 * @param value - The value to set
 * @return The status code of the response
 */
export async function setUserConfig(request: APIRequestContext, key: string, value: string): Promise<number> {
	const tokenResponse = await request.get('./csrftoken', { failOnStatusCode: true })
	const { token } = await tokenResponse.json()

	const response = await request.put(`apps/end_to_end_encryption/api/v1/config/${key}`, {
		headers: { requesttoken: token },
		data: { value },
	})
	return response.status()
}

/**
 * Toggle the current user's "E2EE navigation in browser" setting through the
 * app's config API rather than the personal settings UI.
 *
 * Tests that merely need the feature switched on should neither pay for nor be
 * able to fail on a multi step click-through of the settings page — only the
 * personal settings spec itself exercises that path.
 *
 * @param request - Request context of a logged-in browser session
 * @param enabled - Whether to enable or disable browser based E2EE
 */
export async function setBrowserE2eeEnabled(request: APIRequestContext, enabled: boolean): Promise<void> {
	const status = await setUserConfig(request, BROWSER_E2EE_CONFIG_KEY, enabled ? 'true' : 'false')
	expect(status, `Setting ${BROWSER_E2EE_CONFIG_KEY} to ${enabled} failed`).toBe(200)
}

/**
 * Toggle the current user's debugging tools setting through the app's config API.
 * Enabling them requires the administrator to allow them, see {@link setDebugToolsAllowed}.
 *
 * @param request - Request context of a logged-in browser session
 * @param enabled - Whether to enable or disable the debugging tools
 */
export async function setDebugToolsEnabled(request: APIRequestContext, enabled: boolean): Promise<void> {
	const status = await setUserConfig(request, DEBUG_TOOLS_CONFIG_KEY, enabled ? 'true' : 'false')
	expect(status, `Setting ${DEBUG_TOOLS_CONFIG_KEY} to ${enabled} failed`).toBe(200)
}

/**
 * Allow or disallow the debugging tools for all users.
 *
 * This is a global setting: only change it from tests that run sequentially,
 * so no test of another worker sees it change in the middle of a test.
 *
 * It is set through the API instead of `occ`: the web server caches the app
 * config, and a value written by `occ` does not invalidate that cache - so a
 * value the web server already cached would still be served.
 *
 * @param allowed - Whether the debugging tools are allowed
 */
export async function setDebugToolsAllowed(allowed: boolean): Promise<void> {
	const request = await playwrightRequest.newContext({
		baseURL: new URL('../', test.info().project.use.baseURL).href,
		extraHTTPHeaders: {
			// sent right away, as the server answers without asking for credentials
			Authorization: `Basic ${Buffer.from('admin:admin').toString('base64')}`,
			'OCS-APIRequest': 'true',
		},
	})

	try {
		const response = await withRetry(
			() => request.post('ocs/v2.php/apps/provisioning_api/api/v1/config/apps/end_to_end_encryption/debug_tools_allowed', {
				data: { value: allowed ? 'true' : 'false' },
			}),
			`set debug_tools_allowed to ${allowed}`,
		)
		expect(response.status(), `Setting debug_tools_allowed to ${allowed} failed`).toBe(200)
	} finally {
		await request.dispose()
	}
}
