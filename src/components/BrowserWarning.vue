<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { onMounted, ref, watchEffect } from 'vue'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import { storage, StorageKeys } from '../services/storage.ts'

const confirmToggle = defineModel<boolean>()

defineProps<{
	/**
	 * The heading of the warning card.
	 */
	heading: string
}>()

const dontShowAgainStored = storage.getItem(StorageKeys.SuppressBrowserWarning) === 'true'
const dontShowAgain = ref(dontShowAgainStored)
watchEffect(() => {
	if (dontShowAgain.value) {
		confirmToggle.value = true
		storage.setItem(StorageKeys.SuppressBrowserWarning, 'true')
	} else {
		storage.removeItem(StorageKeys.SuppressBrowserWarning)
	}
})

onMounted(() => {
	if (dontShowAgainStored) {
		confirmToggle.value = true
	}
})
</script>

<template>
	<NcNoteCard
		v-if="!dontShowAgainStored"
		:heading
		show-alert
		type="warning">
		{{ t('end_to_end_encryption', 'The server could serve malicious source code to extract the secret that protects your files.') }}

		<NcCheckboxRadioSwitch
			v-model="confirmToggle"
			required
			type="switch">
			{{ t('end_to_end_encryption', 'I understand the risks') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch
			v-if="confirmToggle"
			v-model="dontShowAgain"
			required
			type="switch">
			{{ t('end_to_end_encryption', 'Do not show this warning the next time') }}
		</NcCheckboxRadioSwitch>
	</NcNoteCard>
</template>
