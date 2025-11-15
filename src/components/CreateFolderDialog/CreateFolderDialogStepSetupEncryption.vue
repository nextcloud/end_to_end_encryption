<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { inject, onMounted, ref } from 'vue'
import { initializeEncryption } from '../../services/encryptionService.ts'
import logger from '../../services/logger.ts'
import * as store from '../../store/keys.ts'
import { INJECTION_KEY } from './useCreateFolderDialog.ts'

const canContinue = defineModel<boolean>()

const {
	buttonLabel,
	onContinue,
} = inject(INJECTION_KEY)!

onMounted(() => {
	buttonLabel.value = t('end_to_end_encryption', 'Setup encryption')
	onContinue.value = callback
	canContinue.value = true
})

const mnemonic = ref('')

/**
 * Callback to decrypt private key when continuing from this step
 */
async function callback() {
	if (!mnemonic.value) {
		// stop user from continuing until setup is done
		canContinue.value = false

		logger.debug('Initializing encryption for new user')
		const data = await initializeEncryption()
		await store.setCertificate(data.publicKeyCertificate)
		store.setPrivateKey(data.privateKey)
		mnemonic.value = data.mnemonic.join(' ')
		buttonLabel.value = t('end_to_end_encryption', 'Continue ({secondsLeft})', { secondsLeft: 5 })

		// allow continuing after a short delay to ensure user sees the mnemonic
		let i = 5
		const interval = window.setInterval(() => {
			if (--i > 0) {
				buttonLabel.value = t('end_to_end_encryption', 'Continue ({secondsLeft})', { secondsLeft: i })
			} else {
				window.clearInterval(interval)
				buttonLabel.value = t('end_to_end_encryption', 'Continue')
				canContinue.value = true
			}
		}, 1000)
	} else {
		logger.debug('Continue with creating encrypted folder')
		return true
	}
}
</script>

<template>
	<p v-if="!mnemonic">
		{{ t('end_to_end_encryption', 'To set up encryption, a new private key will be generated for you.') }}
		<br>
		{{ t('end_to_end_encryption', 'Please make sure to back up the following recovery phrase, as it will be required to access your encrypted files.') }}
	</p>
	<div v-else>
		<p>{{ t('end_to_end_encryption', 'Your recovery phrase is:') }}</p>
		<div :class="$style.setupEncryption__mnemonic">
			<code>{{ mnemonic }}</code>
		</div>
	</div>
</template>

<style module>
.setupEncryption__mnemonic {
	background-color: var(--color-background-dark);
}
</style>
