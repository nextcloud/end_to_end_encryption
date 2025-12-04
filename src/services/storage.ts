/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getBuilder } from '@nextcloud/browser-storage'

/**
 * Session storage - cleared when the browser/tab is closed.
 */
export const storage = getBuilder('end_to_end_encryption')
	.persist(true)
	.build()

export const StorageKeys = Object.freeze({
	SuppressBrowserWarning: 'suppress_browser_warning',
})
