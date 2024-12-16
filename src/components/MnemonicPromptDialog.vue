<script setup lang="ts">
import { computed, ref } from 'vue';

import { t } from '@nextcloud/l10n'
import { NcDialog, NcTextField } from '@nextcloud/vue'

const emit = defineEmits<{
	(e: 'close', mnemonic: string): void
}>()

const mnemonic = ref('')

function submit() {
	// TODO: Implement form validation
	if (mnemonic.value.trim().split(/\s+/g).length !== 12) {
		throw new Error('Mnemonic must be 12 words long')
	}

	emit('close', mnemonic.value)
}

const buttons = computed(() => [
	{
		label: t('end_to_en_encryption', 'Submit'),
		nativeType: 'submit',
		type: 'primary',
		callback: submit,
	},
])
</script>
<template>
<NcDialog
	:name="t('end_to_end_encryption', 'Enter your 12 words mnemonic')"
	:buttons="buttons"
	:is-form="true"
	@submit="submit">

	<NcTextField
		:value.sync="mnemonic"
		:label="t('end_to_end_encryption', 'Mnemonic')"
		:autofocus="true"
		:required="true">
	</NcTextField>
</NcDialog>
</template>
