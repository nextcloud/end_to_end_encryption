/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { spawnDialog } from '@nextcloud/dialogs'
import MnemonicPromptDialog from '../components/MnemonicPromptDialog.vue'

import '@nextcloud/dialogs/style.css'

export async function promptUserForMnemonic(): Promise<string> {
	const promiseWithResolvers = Promise.withResolvers<string>()

	spawnDialog(
		MnemonicPromptDialog,
		undefined,
		(mnemonic) => {
			if (mnemonic !== undefined) {
				promiseWithResolvers.resolve(mnemonic as string)
			} else {
				promiseWithResolvers.reject()
			}
		},
	)

	return promiseWithResolvers.promise
}
