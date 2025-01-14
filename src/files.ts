/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'
import { registerFileAction } from '@nextcloud/files'
import { registerDavProperty } from '@nextcloud/files/dav'

import { setupWebDavDecryptionProxy } from './services/webDavProxy.ts'
import downloadUnencryptedAction from './services/downloadUnencryptedAction.ts'

const userConfig = loadState('end_to_end_encryption', 'userConfig', { e2eeInBrowserEnabled: false })

if (userConfig.e2eeInBrowserEnabled) {
	setupWebDavDecryptionProxy()
	registerDavProperty('nc:e2ee-metadata', { nc: 'http://nextcloud.org/ns' })
	registerDavProperty('nc:e2ee-metadata-signature', { nc: 'http://nextcloud.org/ns' })
	registerFileAction(downloadUnencryptedAction)
}
