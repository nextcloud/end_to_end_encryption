/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import { loadState } from '@nextcloud/initial-state'
import { registerFileAction, getFileActions, Node, View } from '@nextcloud/files'
import { registerDavProperty } from '@nextcloud/files/dav'

import { setupWebDavDecryptionProxy } from './services/webDavProxy.ts'
import downloadUnencryptedAction from './services/downloadUnencryptedAction.ts'
import logger from './services/logger.ts'

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

function disableFileAction(actionId: string) {
	logger.debug(`Inhibiting ${actionId} actions for e2ee files`)
	const actions = getFileActions()

	const action = actions.find(action => action.id === actionId) as unknown as { _action: { enabled: (nodes: Node[], view: View) => boolean } }
	const originalEnabled = action._action.enabled

	action._action.enabled = (nodes: Node[], view: View) => {
		if (nodes.some(node => node.attributes['e2ee-is-encrypted'] === 1)) {
			return false
		}

		return originalEnabled(nodes, view)
	}
}
