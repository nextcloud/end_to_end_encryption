/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'

import { setupWebDavDecryptionProxy } from './services/webDavProxy.ts'

const userConfig = loadState('end_to_end_encryption', 'userConfig', { e2eeInBrowserEnabled: false })

if (userConfig.e2eeInBrowserEnabled) {
	setupWebDavDecryptionProxy()
}
