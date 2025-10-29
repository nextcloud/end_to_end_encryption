<script setup lang="ts">
import type { INode, InvalidFilenameError } from '@nextcloud/files'

import { InvalidFilenameErrorReason, validateFilename } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { computed, watchEffect } from 'vue'
import NcInputField from '@nextcloud/vue/components/NcInputField'

const modelValue = defineModel<string>({ required: true })
const isValid = defineModel<boolean>('valid')

const props = defineProps<{
	content: INode[]
}>()

const helperText = computed(() => {
	if (modelValue.value.trim().length === 0) {
		return t('end_to_end_encryption', 'Folder name cannot be empty')
	} else if (props.content.find((node) => node.basename === modelValue.value.trim())) {
		return t('end_to_end_encryption', 'A folder with this name already exists')
	}

	try {
		validateFilename(modelValue.value.trim())
	} catch (error) {
		const result = error as InvalidFilenameError
		if (result.reason === InvalidFilenameErrorReason.Character) {
			return t('end_to_end_encryption', '"{char}" is not allowed in folder names', { char: result.segment })
		} else if (result.reason === InvalidFilenameErrorReason.Extension) {
			return t('end_to_end_encryption', 'Folder name cannot end with "{extension}"', { extension: result.segment })
		}
		return t('end_to_end_encryption', 'Folder name is invalid')
	}
	return ''
})

watchEffect(() => {
	isValid.value = modelValue.value.trim().length > 0 && helperText.value === ''
})
</script>

<template>
	<NcInputField
		v-model="modelValue"
		:error="modelValue.length > 0 && helperText.length > 0"
		:helper-text
		:label="t('end_to_end_encryption', 'Folder name')"
		max-length="250"
		min-length="1"
		required />
</template>
