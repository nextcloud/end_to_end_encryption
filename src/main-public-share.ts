/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Node, View } from '@nextcloud/files'

import { getFileActions, registerFileAction } from '@nextcloud/files'
import { registerDavProperty } from '@nextcloud/files/dav'
import downloadUnencryptedAction from './files_actions/downloadUnencryptedAction.ts'
import { base64ToBuffer } from './services/bufferUtils.ts'
import logger from './services/logger.ts'
import { setupWebDavProxy } from './services/webDavProxy.ts'
import * as keyStore from './store/keys.ts'

const browserSupportsWebCrypto = typeof window.crypto !== 'undefined' && typeof window.crypto.subtle !== 'undefined'

if (browserSupportsWebCrypto) {
	setupWebDavProxy()
	// Register DAV properties used for E2EE
	registerDavProperty('nc:e2ee-is-encrypted', { nc: 'http://nextcloud.org/ns' })
	registerDavProperty('nc:e2ee-metadata', { nc: 'http://nextcloud.org/ns' })
	registerDavProperty('nc:e2ee-metadata-signature', { nc: 'http://nextcloud.org/ns' })
	// Register file integrations
	registerFileAction(downloadUnencryptedAction)
	disableFileAction('download')

	document.addEventListener('DOMContentLoaded', async () => {
		// ensure we have the user's private key loaded
		while (!keyStore.hasPrivateKey()) {
			const key = window.prompt('Please enter your private key:')
			if (!key) {
				logger.debug('No private key provided, retrying...')
				continue
			}
			try {
				logger.debug('Importing private key')
				const privateKey = await globalThis.crypto.subtle.importKey('pkcs8', base64ToBuffer(key), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt'])
				keyStore.setPrivateKey(privateKey)
			} catch (error) {
				logger.debug('Failed to import private key', { error })
			}
		}
	})
} else {
	logger.error('End-to-end encryption in the browser is not supported by your browser or you are not using a secure connection (HTTPS).')
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
