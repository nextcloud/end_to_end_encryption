<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { Permission } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { ref, watchEffect } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcRadioGroup from '@nextcloud/vue/components/NcRadioGroup'
import NcRadioGroupButton from '@nextcloud/vue/components/NcRadioGroupButton'

const props = defineProps<{
	/**
	 * Initial permissions
	 */
	permissions: Permission
}>()

defineEmits<{
	/**
	 * The selected permissions
	 */
	close: [Permission]
}>()

const internalPermissions = ref<'r' | 'rw'>()
watchEffect(() => {
	internalPermissions.value = (props.permissions & Permission.UPDATE) ? 'rw' : 'r'
})

</script>

<template>
	<NcDialog
		is-form
		no-close
		:name="t('end_to_end_encryption', 'User share setup')"
		@submit="$emit('close', internalPermissions === 'rw' ? Permission.ALL : Permission.READ)">
		<NcNoteCard type="info">
			{{ t('end_to_end_encryption', 'When limiting the permissions you have to trust the server to enforce the limitation.') }}
		</NcNoteCard>

		<NcRadioGroup v-model="internalPermissions" :label="t('end_to_end_encryption', 'Share permissions')">
			<NcRadioGroupButton :label="t('end_to_end_encryption', 'Read only')" value="r" />
			<NcRadioGroupButton :label="t('end_to_end_encryption', 'Read, write, and share')" value="rw" />
		</NcRadioGroup>

		<template #actions>
			<NcButton type="submit" variant="primary">
				{{ t('end_to_end_encryption', 'Save') }}
			</NcButton>
		</template>
	</NcDialog>
</template>
