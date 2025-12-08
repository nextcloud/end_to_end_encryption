/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defaultRemoteURL, defaultRootPath } from '@nextcloud/files/dav'
import { join } from '@nextcloud/paths'

const RELATIVE_REMOTE_URL = new URL(defaultRemoteURL).pathname

/**
 * @param url - The request URL to decode
 */
export function getPath(url: URL): string {
	return normalizePath(decodeURI(url.pathname))
}

/**
 * Normalize the given path to be relative to the DAV root.
 *
 * @param path - The path to normalize
 */
export function normalizePath(path: string): string {
	if (path.startsWith(defaultRemoteURL)) {
		path = path.slice(defaultRemoteURL.length)
	} else if (path.startsWith(RELATIVE_REMOTE_URL)) {
		path = path.slice(RELATIVE_REMOTE_URL.length)
	}

	if (path.startsWith(defaultRootPath)) {
		path = path.slice(defaultRootPath.length)
	}
	return `/${path}`
		.replace(/^\/\/+/, '/')
		.replace(/\/+$/, '')
}

/**
 * @param path - The relative path (like the output of `normalizePath`)
 */
export function getAbsolutePath(path: string): string {
	return join(defaultRemoteURL, defaultRootPath, path)
}
