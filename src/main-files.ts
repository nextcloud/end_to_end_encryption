/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Node, View } from '@nextcloud/files'

import { getFileActions, registerFileAction } from '@nextcloud/files'
import { registerDavProperty } from '@nextcloud/files/dav'
import { loadState } from '@nextcloud/initial-state'
import downloadUnencryptedAction from './files_actions/downloadUnencryptedAction.ts'
import logger from './services/logger.ts'
import { setupWebDavDecryptionProxy } from './services/webDavProxy.ts'

const userConfig = loadState('end_to_end_encryption', 'userConfig', { e2eeInBrowserEnabled: false })

if (userConfig.e2eeInBrowserEnabled) {
	setupWebDavDecryptionProxy()
	registerDavProperty('nc:e2ee-is-encrypted', { nc: 'http://nextcloud.org/ns' })
	registerDavProperty('nc:e2ee-metadata', { nc: 'http://nextcloud.org/ns' })
	registerDavProperty('nc:e2ee-metadata-signature', { nc: 'http://nextcloud.org/ns' })
	registerFileAction(downloadUnencryptedAction)
	disableFileAction('download')
	disableFileAction('move-copy')
}

/**
 * Disable a file action by monkey patching a custom enabled function.
 *
 * @param actionId - The ID of the action to disable
 */
function disableFileAction(actionId: string) {
	logger.debug(`Inhibiting ${actionId} actions for e2ee files`)
	const actions = getFileActions()

	const action = actions.find((action) => action.id === actionId) as unknown as { _action: { enabled: (nodes: Node[], view: View) => boolean } }
	const originalEnabled = action._action.enabled

	action._action.enabled = (nodes: Node[], view: View) => {
		if (nodes.some((node) => node.attributes['e2ee-is-encrypted'] === 1)) {
			return false
		}

		return originalEnabled(nodes, view)
	}
}
