<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { IFolder, INode, InvalidFilenameError } from '@nextcloud/files'

import { getCurrentUser } from '@nextcloud/auth'
import { Folder, InvalidFilenameErrorReason, Permission, validateFilename } from '@nextcloud/files'
import { defaultRootPath } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { computed, inject, onMounted, ref, watch } from 'vue'
import NcInputField from '@nextcloud/vue/components/NcInputField'
import { createNewRootFolder } from '../../services/folder.ts'
import * as store from '../../store/keys.ts'
import { INJECTION_KEY } from './useCreateFolderDialog.ts'

const canContinue = defineModel<boolean>()
const props = defineProps<{
	content: INode[]
	context: IFolder
}>()
const emit = defineEmits<{
	folderCreated: [folder: IFolder]
}>()

const {
	buttonLabel,
	onContinue,
} = inject(INJECTION_KEY)!

onMounted(() => {
	buttonLabel.value = t('end_to_end_encryption', 'Create folder')
	canContinue.value = false
	onContinue.value = createFolder
})

const folderName = ref('')

const helperText = computed(() => {
	if (folderName.value.trim().length === 0) {
		return t('end_to_end_encryption', 'Folder name cannot be empty')
	} else if (props.content.find((node) => node.basename === folderName.value.trim())) {
		return t('end_to_end_encryption', 'A folder with this name already exists')
	}

	try {
		validateFilename(folderName.value.trim())
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

const isValid = computed(() => folderName.value.trim().length > 0 && helperText.value === '')
watch(isValid, (newValue) => {
	canContinue.value = newValue
})

/**
 * Create the encrypted folder
 */
async function createFolder(): Promise<true | void> {
	if (!isValid.value) {
		return
	}

	canContinue.value = false
	buttonLabel.value = t('end_to_end_encryption', 'Creating folder …')
	const folderId = await createNewRootFolder(
		folderName.value.trim(),
		props.context,
		await store.getCertificate(),
	)
	// create a folder handle so we can refresh the files list later
	const folder = new Folder({
		id: Number.parseInt(folderId),
		owner: getCurrentUser()!.uid,
		source: props.context.source + '/' + folderName.value.trim(),
		root: defaultRootPath,
		crtime: new Date(),
		mtime: new Date(),
		permissions: Permission.READ, // TODO: allow more permissions once we support that
		size: 0, // its empty for now
		attributes: {
			'e2ee-is-encrypted': 1,
			'is-encrypted': 1,
		},
	})
	emit('folderCreated', folder)
	return true
}
</script>

<template>
	<NcInputField
		v-model="folderName"
		:error="folderName.length > 0 && helperText.length > 0"
		:helper-text
		:label="t('end_to_end_encryption', 'Folder name')"
		max-length="250"
		min-length="1"
		required />
</template>
