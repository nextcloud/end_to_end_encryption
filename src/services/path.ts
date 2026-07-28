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
	return normalizePath(decodePath(url.pathname))
}

/**
 * Decode a percent-encoded path, segment by segment.
 *
 * Paths are handled decoded everywhere outside of the requests themselves: it is
 * how the metadata stores the names, how `@nextcloud/files` nodes report them,
 * and what the WebDAV client expects to encode itself.
 *
 * `decodeURI` is not enough for that, as it keeps the characters that are
 * reserved in URLs percent-encoded - `#`, `?` and `&` are all legal in file
 * names, so a folder called "a#b" would not match its own name anymore.
 *
 * @param path - The percent-encoded path
 */
export function decodePath(path: string): string {
	return path.split('/').map(decodeURIComponent).join('/')
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
