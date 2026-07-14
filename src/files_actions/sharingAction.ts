/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IFileAction } from '@nextcloud/files'

import AccountPlusSvg from '@mdi/svg/svg/account-plus-outline.svg?raw'
import { getCurrentUser } from '@nextcloud/auth'
import { getSidebar, Permission } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { isPublicShare } from '@nextcloud/sharing/public'

export const sharingAction: IFileAction = {
	id: 'end_to_end_encryption::sharing',

	iconSvgInline() {
		return AccountPlusSvg
	},

	displayName() {
		return t('files_sharing', 'Sharing options')
	},

	enabled({ nodes }) {
		if (nodes.length !== 1) {
			return false
		}

		// Do not leak information about users to public shares
		if (isPublicShare()) {
			return false
		}

		const node = nodes[0]
		// Read permissions needed to open the sharing sidebar
		if (!(node.permissions & Permission.READ)) {
			return false
		}

		// Only allow sharing for encrypted files if the user is the owner
		if (node.owner === getCurrentUser()?.uid && node.attributes['e2ee-is-encrypted']) {
			return true
		}

		return false
	},

	async exec({ nodes }) {
		const node = nodes[0]
		const sidebar = getSidebar()
		sidebar.open(node, 'sharing')
		return null
	},
}
