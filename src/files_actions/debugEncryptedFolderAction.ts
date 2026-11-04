/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IFileAction } from '@nextcloud/files'

import BugOutlineSvg from '@mdi/svg/svg/bug-outline.svg?raw'
import { FileType } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { spawnDialog } from '@nextcloud/vue/functions/dialog'
import { defineAsyncComponent } from 'vue'
import logger from '../services/logger.ts'

const EncryptedFolderDebugDialog = defineAsyncComponent(() => import('../components/EncryptedFolderDebugDialog.vue'))

export default {
	id: 'e2ee-debug',
	displayName: () => t('end_to_end_encryption', 'Debug encryption'),
	iconSvgInline: () => BugOutlineSvg,

	enabled({ nodes }) {
		if (nodes.length !== 1) {
			return false
		}

		const [node] = nodes
		return node!.type === FileType.Folder
			&& node!.isDavResource
			&& node!.attributes['e2ee-is-encrypted'] === 1
	},

	async exec({ nodes }) {
		try {
			// Inspecting the metadata needs the private key. Unlocking it might ask for the mnemonic,
			// which has to happen before the debug dialog is opened as both dialogs would trap the focus.
			const { getPrivateKey } = await import('../store/keys.ts')
			await getPrivateKey()
		} catch (error) {
			logger.error('Could not unlock the private key', { error })
			return false
		}

		await spawnDialog(EncryptedFolderDebugDialog, { node: nodes[0] })
		return null
	},

	order: 1000,
} satisfies IFileAction
