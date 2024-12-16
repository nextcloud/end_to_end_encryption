/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import { spawnDialog } from '@nextcloud/dialogs'
import '@nextcloud/dialogs/style.css'

import MnemonicPromptDialog from '../components/MnemonicPromptDialog.vue'

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
