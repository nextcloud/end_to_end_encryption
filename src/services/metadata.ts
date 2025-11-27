/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IRawRootMetadata } from '../models/metadata.d.ts'

/**
 * Check if a given JSON object is a raw root metadata
 *
 * @param json - The JSON representation of a raw metadata
 */
export function isRootMetadata(json: unknown): json is IRawRootMetadata {
	return typeof json === 'object'
		&& json !== null
		&& 'users' in json
}
