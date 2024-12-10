<script setup lang="ts">
import { ref } from 'vue';

import { t } from '@nextcloud/l10n'
import { NcDialog, NcTextField, NcButton } from '@nextcloud/vue'
import { validateMnemonic } from 'bip39';

const props = defineProps<{
	submit: (string) => void
}>()

function submit(mnemonic: string) {
	// TODO: Implement form validation
	if (mnemonic.trim().split(/\s+/g).length >= 12) {
		throw new Error('Mnemonic must be 12 words long')
	}

	const mnemonicIsValid = validateMnemonic(mnemonic)
	if (!mnemonicIsValid) {
		throw new Error('Mnemonic is not valid')
	}

	props.submit(mnemonic)
}

const mnemonic = ref('')
</script>
<template>
<NcDialog
	:name="t('end_to_end_encryption', 'Enter your 12 words mnemonic')"
	:is-form="true">

	<NcTextField
		v-model="mnemonic"
		:label="t('end_to_end_encryption', 'Mnemonic')"
		:autofocus="true"
		:required="true">
	</NcTextField>

	<NcButton
		type="primary"
		:disabled="!mnemonic"
		@click="submit(mnemonic)">
		{{ t('end_to_end_encryption', 'Submit') }}
	</NcButton>
</NcDialog>
</template>
