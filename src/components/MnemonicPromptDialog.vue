<!--
	- SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { computed, ref } from 'vue'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import BrowserWarning from './BrowserWarning.vue'

const emit = defineEmits<{
	(e: 'close', mnemonic: string): void
}>()

const mnemonic = ref('')
const confirmToggle = ref(false)

const isFormValid = computed(() => confirmToggle.value === true && mnemonic.value.trim().split(/\s+/g).length === 12)

/**
 * The submit callback.
 * Emits the close event with the mnemonic.
 */
function submit() {
	emit('close', mnemonic.value)
}

const buttons = computed(() => [
	{
		label: t('end_to_en_encryption', 'Submit'),
		type: 'submit',
		variant: 'primary',
		disabled: !isFormValid.value,
		callback: submit,
	} as const,
])
</script>

<template>
	<NcDialog
		:name="t('end_to_end_encryption', 'Enter your 12 words mnemonic')"
		:buttons="buttons"
		:is-form="true"
		@submit="submit">
		<BrowserWarning
			v-model="confirmToggle"
			:heading="t('end_to_end_encryption', 'Decrypting your files in the browser can weaken security')" />

		<NcTextField
			v-model="mnemonic"
			autofocus
			required
			pattern="^(\w+\s+){11}\w+$"
			:label="t('end_to_end_encryption', 'Mnemonic')" />
	</NcDialog>
</template>
