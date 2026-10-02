/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { INode } from '@nextcloud/files'
import type { ShareAttribute } from '../models/sharing.d.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { Permission } from '@nextcloud/files'
import { isPublicShare } from '@nextcloud/sharing/public'

/**
 * Check permissions on the node if it can be downloaded
 *
 * @param node The node to check
 * @return True if downloadable, false otherwise
 */
export function isDownloadable(node: INode): boolean {
	if ((node.permissions & Permission.READ) === 0) {
		return false
	}

	// If the mount type is a share, ensure it got download permissions.
	if (node.attributes['share-attributes'] && typeof node.attributes['share-attributes'] === 'string') {
		const shareAttributes = JSON.parse(node.attributes['share-attributes']) as Array<ShareAttribute>
		const downloadAttribute = shareAttributes.find(({ scope, key }: ShareAttribute) => scope === 'permissions' && key === 'download')
		if (downloadAttribute !== undefined) {
			return downloadAttribute.value === true
		}
	}

	return true
}

/**
 * Check if the current user can manage the shares of an e2ee node.
 * Needed as e2ee nodes have no share permission, see `usePropFindInterceptor`.
 *
 * @param node The node to check
 */
export function canManageEncryptedShares(node: INode): boolean {
	// Do not leak information about users to public shares
	if (isPublicShare()) {
		return false
	}

	// Needed to open the sharing sidebar
	if ((node.permissions & Permission.READ) === 0) {
		return false
	}

	return node.attributes['e2ee-is-encrypted'] === 1
		&& node.owner === getCurrentUser()?.uid
}
