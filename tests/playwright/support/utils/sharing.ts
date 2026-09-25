/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { APIRequestContext } from '@playwright/test'

import { expect } from '@playwright/test'

const SHARES_ENDPOINT = '/ocs/v2.php/apps/files_sharing/api/v1/shares'
const SHARE_TYPE_LINK = 3
/** Upload only - turns a link share of an encrypted folder into a file drop */
const PERMISSION_CREATE = 4

/**
 * Create a file drop share of an encrypted root folder.
 *
 * @param request - Request context of the logged-in folder owner
 * @param path - Path of the encrypted root folder
 * @return The token of the new share
 */
export async function createFileDropShare(request: APIRequestContext, path: string): Promise<string> {
	const response = await request.post(SHARES_ENDPOINT, {
		headers: { 'OCS-APIRequest': 'true', Accept: 'application/json' },
		data: { path, permissions: PERMISSION_CREATE, shareType: SHARE_TYPE_LINK },
	})
	const { ocs } = await response.json()

	expect(response.status(), `Sharing ${path} as file drop failed`).toBe(200)
	expect(
		ocs.meta.statuscode,
		`Sharing ${path} as file drop failed (OCS statuscode: ${ocs.meta.statuscode}, message: ${ocs.meta.message})`,
	).toBe(100)

	return ocs.data.token
}
