<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { mdiContentCopy, mdiLink, mdiTrashCanOutline } from '@mdi/js'
import axios from '@nextcloud/axios'
import { t } from '@nextcloud/l10n'
import { basename } from '@nextcloud/paths'
import { generateOcsUrl } from '@nextcloud/router'
import { computed } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcListItem from '@nextcloud/vue/components/NcListItem'

const props = defineProps<{
	share: Record<string, unknown>
}>()

const emit = defineEmits<{
	delete: []
}>()

const shareLink = computed(() => props.share.url as string)

/**
 * Copy the filedrop link to clipboard
 */
async function copyLink() {
	try {
		await navigator.clipboard.writeText(shareLink.value)
	} catch {
		window.prompt('', shareLink.value)
	}
}

/**
 * Delete the filedrop share
 */
async function deleteShare() {
	await axios.delete(generateOcsUrl(`/apps/files_sharing/api/v1/shares/${props.share.id}`))
	emit('delete')
}
</script>

<template>
	<NcListItem :name="basename(shareLink)" :href="shareLink">
		<template #icon>
			<NcIconSvgWrapper :path="mdiLink" />
		</template>
		<template #extra-actions>
			<NcButton
				:aria-label="t('end_to_end_encryption', 'Copy file drop link')"
				:title="t('end_to_end_encryption', 'Copy file drop link')"
				@click="copyLink">
				<template #icon>
					<NcIconSvgWrapper :path="mdiContentCopy" />
				</template>
			</NcButton>
			<NcButton
				:aria-label="t('end_to_end_encryption', 'Delete file drop')"
				:title="t('end_to_end_encryption', 'Delete file drop')"
				@click="deleteShare">
				<template #icon>
					<NcIconSvgWrapper :path="mdiTrashCanOutline" />
				</template>
			</NcButton>
		</template>
	</NcListItem>
</template>
