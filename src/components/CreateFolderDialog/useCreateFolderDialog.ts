/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { InjectionKey, Ref } from 'vue'

export const INJECTION_KEY: InjectionKey<{
	buttonLabel: Ref<string>
	onContinue: Ref<(() => Promise<true | void>) | undefined>
}> = Symbol.for('CreateFolderDialogContext')
