/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ActionContext, INode } from '@nextcloud/files'

import { getFileActions, getFilesRegistry, registerFileAction } from '@nextcloud/files'
import { registerDavProperty } from '@nextcloud/files/dav'
import { loadState } from '@nextcloud/initial-state'
import { isPublicShare } from '@nextcloud/sharing/public'
import downloadUnencryptedAction from './files_actions/downloadUnencryptedAction.ts'
import { registerNewEncryptedFolderEntry } from './files_newMenu/new-encrypted-folder.ts'
import { setupEventBusProxy } from './services/eventBusProxy.ts'
import { registerSharingSidebarSection } from './services/filesSharingSection.ts'
import logger from './services/logger.ts'
import { canManageEncryptedShares } from './services/permissions.ts'
import { setupTasksManager } from './services/TasksManager.ts'
import { setupWebDavProxy } from './services/webDavProxy.ts'

import 'core-js/proposals/reflect-metadata.js' // for @peculiar/x509

const userConfig = loadState('end_to_end_encryption', 'userConfig', { e2eeInBrowserEnabled: false })
const browserSupportsWebCrypto = typeof window.crypto !== 'undefined' && typeof window.crypto.subtle !== 'undefined'

if ((userConfig.e2eeInBrowserEnabled || isPublicShare()) && browserSupportsWebCrypto) {
	setupWebDavProxy()
	setupEventBusProxy()
	// Register DAV properties used for E2EE
	registerDavProperty('nc:e2ee-is-encrypted', { nc: 'http://nextcloud.org/ns' })
	registerDavProperty('nc:e2ee-metadata', { nc: 'http://nextcloud.org/ns' })
	registerDavProperty('nc:e2ee-metadata-signature', { nc: 'http://nextcloud.org/ns' })
	// Register file integrations
	registerFileAction(downloadUnencryptedAction)
	// e2ee nodes have no share permission, but the owner can share them with our sidebar section
	patchFileActionEnabled('sharing-status', ({ nodes }, originalEnabled) => originalEnabled()
		|| (nodes.length === 1 && canManageEncryptedShares(nodes[0]!)))
	disableFileAction('download')
	if (getNextcloudMajorVersion() < 36) {
		// The viewer only supports previewing encrypted media files (our WebDAV interceptor is used)
		// in Nextcloud 36+ the viewer is aware of e2ee itself
		disableFileAction('view', (node) => !/^(image|video|audio|text)\//.test(node.mime ?? ''))
	}

	registerNewEncryptedFolderEntry()
	// Register sharing integrations
	registerSharingSidebarSection()

	if (!isPublicShare()) {
		setupTasksManager()
	}
} else if (userConfig.e2eeInBrowserEnabled && !browserSupportsWebCrypto) {
	logger.error('End-to-end encryption in the browser is not supported by your browser or you are not using a secure connection (HTTPS).')
}

/**
 * Disable a file action by monkey patching a custom enabled function.
 *
 * @param actionId - The ID of the action to disable
 * @param shouldDisable - Optional additional check whether the action should be disabled for an encrypted node
 */
function disableFileAction(actionId: string, shouldDisable: (node: INode) => boolean = () => true) {
	patchFileActionEnabled(actionId, ({ nodes }, originalEnabled) => !nodes.some((node) => isEncrypted(node) && shouldDisable(node))
		&& originalEnabled())
}

/**
 * Patch the enabled function of a file action for e2ee nodes.
 *
 * @param actionId - The ID of the action to patch
 * @param enabled - The enabled function used for e2ee nodes
 */
function patchFileActionEnabled(actionId: string, enabled: (context: ActionContext, originalEnabled: () => boolean) => boolean) {
	const action = getFileActions().find((action) => action.id === actionId)
	if (!action) {
		// the init script of the providing app might be loaded after ours
		const registry = getFilesRegistry()
		registry.addEventListener('register:action', function onRegister({ detail }) {
			if (detail.id === actionId) {
				registry.removeEventListener('register:action', onRegister)
				patchFileActionEnabled(actionId, enabled)
			}
		})
		return
	}

	logger.debug(`Patching ${actionId} action for e2ee files`)
	const originalEnabled = action.enabled
	action.enabled = (context) => {
		const isOriginallyEnabled = () => originalEnabled?.(context) ?? true
		if (!context.nodes.some(isEncrypted)) {
			return isOriginallyEnabled()
		}
		return enabled(context, isOriginallyEnabled)
	}
}

/**
 * Check if a node is end-to-end encrypted.
 *
 * @param node - The node to check
 */
function isEncrypted(node: INode): boolean {
	return node.attributes['e2ee-is-encrypted'] === 1
}

/**
 * Get the major version of the running Nextcloud server.
 */
function getNextcloudMajorVersion(): number {
	const version = (window as { OC?: { config?: { version?: string } } }).OC?.config?.version ?? ''
	return Number.parseInt(version.split('.')[0]!) || 0
}
