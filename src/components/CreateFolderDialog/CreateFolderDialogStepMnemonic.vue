<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { inject, onMounted, ref, watchEffect } from 'vue'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import BrowserWarning from '../BrowserWarning.vue'
import logger from '../../services/logger.ts'
import * as store from '../../store/keys.ts'
import { INJECTION_KEY } from './useCreateFolderDialog.ts'

const isValid = defineModel<boolean>()

const {
	buttonLabel,
	onContinue,
} = inject(INJECTION_KEY)!

onMounted(() => {
	buttonLabel.value = t('end_to_end_encryption', 'Submit')
	onContinue.value = callback
})

const mnemonic = ref('')
const warningAccepted = ref(false)
const error = ref(false)

watchEffect(() => {
	if (!warningAccepted.value || !mnemonic.value) {
		isValid.value = false
		return
	}

	isValid.value = /^\w+(\s+\w+){11}$/.test(mnemonic.value)
})

/**
 * Callback to decrypt private key when continuing from this step
 */
async function callback(): Promise<true | void> {
	try {
		await store.loadPrivateKey(mnemonic.value)
	} catch (error) {
		logger.error('Failed to get user private key:', { error })
		throw error
	}
	return true
}
</script>

<template>
	<BrowserWarning
		v-model="warningAccepted"
		:heading="t('end_to_end_encryption', 'Encrypting your files in the browser can weaken security')" />

	<NcTextField
		v-model="mnemonic"
		autofocus
		:error
		:helper-text="error ? t('end_to_end_encryption', 'Decrypting with given mnemonic failed') : undefined"
		required
		pattern="^(\w+\s+){11}\w+$"
		:label="t('end_to_end_encryption', 'Mnemonic')" />
</template>
