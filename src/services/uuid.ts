/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Generate a random uuid matching the RFC pattern for metadata filenames
 */
export function generateUuid(): string {
	return globalThis.crypto.randomUUID().replace(/-/g, '')
}
