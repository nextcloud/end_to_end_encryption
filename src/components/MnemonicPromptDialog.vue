<!--
	- SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { computed, ref } from 'vue'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcTextField from '@nextcloud/vue/components/NcTextField'

const emit = defineEmits<{
	(e: 'close', mnemonic: string): void
}>()

const dialogRef = ref()
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
		ref="dialogRef"
		:name="t('end_to_end_encryption', 'Enter your 12 words mnemonic')"
		:buttons="buttons"
		:is-form="true"
		@submit="submit">
		<NcNoteCard
			show-alert
			type="warning"
			:heading="t('end_to_end_encryption', 'Decrypting your files in the browser can weaken security')">
			{{ t('end_to_end_encryption', 'The server could serve malicious source code to extract the secret that protects your files.') }}

			<NcCheckboxRadioSwitch
				v-model="confirmToggle"
				:required="true"
				data-cy-e2ee-mnemonic-prompt="i_understand_the_risks"
				type="switch">
				{{ t('end_to_end_encryption', 'I understand the risks') }}
			</NcCheckboxRadioSwitch>
		</NcNoteCard>

		<NcTextField
			v-model="mnemonic"
			autofocus
			required
			pattern="^(\w+\s+){11}\w+$"
			:label="t('end_to_end_encryption', 'Mnemonic')" />
	</NcDialog>
</template>
