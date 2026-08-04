/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'
import type { APIRequestContext } from '@playwright/test'

/**
 * Read a file through WebDAV, as a plain client that knows nothing about
 * end-to-end encryption.
 *
 * This is what makes an assertion about a file that left the encrypted world a
 * statement about the server state: nothing of this app is involved, so the
 * contents are the raw ones and not the ones its interceptor decrypted on the
 * way to the browser. It also covers the flag: the server refuses WebDAV access
 * to encrypted files for a client that does not announce E2EE support, so a
 * request that succeeds is also a request the file was not left marked as
 * encrypted for.
 *
 * @param request - Request context of the test, used for its own session only
 * @param user - The account the path belongs to, authenticated with Basic auth
 * so the request does not depend on the session of the browser
 * @param path - Path of the file, relative to the home directory of the account
 */
export async function readFile(request: APIRequestContext, user: User, path: string): Promise<string> {
	const response = await request.get(davUrl(user, path), {
		headers: { Authorization: basicAuth(user) },
	})
	if (!response.ok()) {
		throw new Error(`GET ${path} failed with status ${response.status()}`)
	}
	return await response.text()
}

/**
 * The WebDAV URL of a path in the home directory of an account.
 *
 * Encoded segment by segment: the names of the tests contain spaces and the
 * random parts could contain anything, while the separators have to stay.
 *
 * @param user - The account the path belongs to
 * @param path - Path relative to the home directory of the account
 */
function davUrl(user: User, path: string): string {
	const encodedPath = path.split('/').map(encodeURIComponent).join('/')
	return `/remote.php/dav/files/${encodeURIComponent(user.userId)}/${encodedPath}`.replace(/\/+/g, '/')
}

/**
 * @param user - The account to authenticate as
 */
function basicAuth(user: User): string {
	return `Basic ${Buffer.from(`${user.userId}:${user.password}`).toString('base64')}`
}
