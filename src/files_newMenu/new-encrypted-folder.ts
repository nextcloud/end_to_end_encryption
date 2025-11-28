/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import svgFolderLock from '@mdi/svg/svg/folder-lock-outline.svg?raw'
import { showError, showInfo } from '@nextcloud/dialogs'
import { emit } from '@nextcloud/event-bus'
import { addNewFileMenuEntry, Folder, NewMenuEntryCategory, Permission } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { spawnDialog } from '@nextcloud/vue/functions/dialog'
import CreateFolderDialog from '../components/CreateFolderDialog/CreateFolderDialog.vue'
import logger from '../services/logger.ts'

/**
 * Register a new encrypted folder entry in the files "new-menu".
 */
export function registerNewEncryptedFolderEntry() {
	addNewFileMenuEntry({
		id: 'end_to_end_encryption:new-encrypted-folder',
		category: NewMenuEntryCategory.CreateNew,
		displayName: t('end_to_end_encryption', 'New encrypted folder'),
		iconSvgInline: svgFolderLock,
		order: 5,

		enabled(context) {
			// we need create permissions and we cannot nest encrypted folders
			return (context.permissions & Permission.CREATE) !== 0
				&& !context.attributes['e2ee-is-encrypted']
		},

		async handler(context, content) {
			try {
				const result = await spawnDialog(CreateFolderDialog, {
					context,
					content,
				})
				if (result instanceof Folder) {
					emit('files:node:created', result)
				} else if (result === false) {
					showInfo(t('end_to_end_encryption', 'Creating new encrypted folder: Cancelled'))
				} else {
					throw result
				}
			} catch (error) {
				logger.error('Error while creating new encrypted folder:', { error })
				showError(t('end_to_end_encryption', 'Creating new encrypted folder: Failed'))
			}
		},
	})
}
