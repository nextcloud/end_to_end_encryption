/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import { t } from '@nextcloud/l10n'
import { DialogSeverity, getDialogBuilder, spawnDialog } from '@nextcloud/dialogs'
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

export async function showMnemonic(mnemonic: string): Promise<void> {
	const promiseWithResolvers = Promise.withResolvers<void>()

	const dialog = getDialogBuilder(t('end_to_end_encryption', 'Please save the mnemonic'))
		.setSeverity(DialogSeverity.Info)
		.setText(mnemonic)
		.addButton({
			label: t('end_to_end_encryption', 'I have written down the mnemonic'),
			type: 'primary',
			callback: () => {
				dialog.hide()
				promiseWithResolvers.resolve()
			},
		})
		.build()

	dialog.show()

	return promiseWithResolvers.promise
}
