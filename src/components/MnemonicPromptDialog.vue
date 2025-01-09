<!--
	- SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!-- eslint-disable jsdoc/require-jsdoc -->

<script setup lang="ts">
import { computed, ref } from 'vue'

import { t } from '@nextcloud/l10n'
import NcDialog from '@nextcloud/vue/dist/Components/NcDialog.js'
import NcTextField from '@nextcloud/vue/dist/Components/NcTextField.js'
import NcNoteCard from '@nextcloud/vue/dist/Components/NcNoteCard.js'
import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

const emit = defineEmits<{
	(e: 'close', mnemonic: string): void
}>()

const dialogRef = ref()
const mnemonic = ref('')
const confirmToggle = ref(false)

const isFormValid = computed(() => confirmToggle.value === true && mnemonic.value.trim().split(/\s+/g).length === 12)

function submit() {
	emit('close', mnemonic.value)
}

const buttons = computed(() => [
	{
		label: t('end_to_en_encryption', 'Submit'),
		nativeType: 'submit',
		type: 'primary',
		disabled: !isFormValid.value,
		callback: submit,
	},
])
</script>
<template>
	<NcDialog ref="dialogRef"
		:name="t('end_to_end_encryption', 'Enter your 12 words mnemonic')"
		:buttons="buttons"
		:is-form="true"
		@submit="submit">
		<NcNoteCard type="warning"
			:show-alert="true"
			:heading="t('end_to_end_encryption', 'Decrypting your files in the browser can weaken security')">
			{{ t('end_to_end_encryption', 'The server could serve malicious source code to extract the secret that protects your files.') }}

			<NcCheckboxRadioSwitch v-model="confirmToggle"
				:required="true"
				data-cy-e2ee-mnemonic-prompt="i_understand_the_risks"
				type="switch">
				{{ t('end_to_end_encryption', 'I understand the risks') }}
			</NcCheckboxRadioSwitch>
		</NcNoteCard>

		<NcTextField :value.sync="mnemonic"
			required="true"
			pattern="^(\w+\s+){11}\w+$"
			:label="t('end_to_end_encryption', 'Mnemonic')"
			:autofocus="true" />
	</NcDialog>
</template>
