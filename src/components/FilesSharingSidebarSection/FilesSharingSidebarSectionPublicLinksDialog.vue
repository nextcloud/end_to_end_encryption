<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { RootMetadata } from '../../models/RootMetadata.ts'
import type { IShare } from '../../services/sharing.ts'

import { Permission } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import stringify from 'safe-stable-stringify'
import { computed, ref, toRaw, watchEffect } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcFormBox from '@nextcloud/vue/components/NcFormBox'
import NcFormBoxCopyButton from '@nextcloud/vue/components/NcFormBoxCopyButton'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcRadioGroup from '@nextcloud/vue/components/NcRadioGroup'
import NcRadioGroupButton from '@nextcloud/vue/components/NcRadioGroupButton'
import * as api from '../../services/api.ts'
import logger from '../../services/logger.ts'
import { reencryptSubfolders } from '../../services/metadata.ts'
import { createFileDropShare, createPublicLinkShare } from '../../services/sharing.ts'
import * as keyStore from '../../store/keys.ts'
import * as metadataStore from '../../store/metadata.ts'

const props = defineProps<{
	share?: IShare
	metadata: RootMetadata
}>()

defineEmits<{
	close: [share?: IShare]
}>()

const Permissions = Object.freeze({
	UploadOnly: 'upload',
	ViewOnly: 'view',
	ViewAndUpload: 'upload+view',
})

const isLoading = ref(false)
const sharePermissions = ref<typeof Permissions[keyof typeof Permissions]>(Permissions.UploadOnly)
watchEffect(() => {
	if (props.share) {
		const permissions = props.share.permissions as number
		sharePermissions.value = (permissions & Permission.UPDATE)
			? Permissions.ViewAndUpload
			: (permissions & Permission.READ)
					? Permissions.ViewOnly
					: Permissions.UploadOnly
	}
})

const sharedMnemonic = ref<string>()
const internalShare = ref<IShare>()
const shareUrl = computed(() => internalShare.value?.url as string | undefined)

/**
 * Create a new end-to-end link share
 */
async function createShare() {
	logger.debug('Creating end-to-end link share')
	const metadata = toRaw(props.metadata)
	if (!metadata) {
		throw new Error('No metadata available for the current folder')
	}

	const { path, id } = metadataStore.getRootFolder(metadata)
	if (sharePermissions.value === Permissions.UploadOnly) {
		internalShare.value = await createFileDropShare(path)
		return
	}

	isLoading.value = true
	const token = await api.lockFolder(id, metadata.counter + 1)
	try {
		// we need to reencrypt all folders later with the new key
		const subfolders = await metadataStore.loadAllSubfolders(metadata)

		const { share, mnemonic } = await createPublicLinkShare(path, metadata, sharePermissions.value === Permissions.ViewOnly)
		internalShare.value = share
		sharedMnemonic.value = mnemonic.join(' ')

		// update the metadata to re-encrypt with the new key
		const { metadata: rawMetadata, signature } = await metadata.export(await keyStore.getCertificate())
		await api.updateMetadata(id, stringify(rawMetadata), token, signature)
		// re-encrypt all subfolders
		await reencryptSubfolders(subfolders, metadata.key, await keyStore.getCertificate(), token)
		return
	} finally {
		await api.unlockFolder(id, token)
	}
}
</script>

<template>
	<NcDialog
		isForm
		:contentClasses="$style.publicLinksDialog"
		:name="t('end_to_end_encryption', 'End-to-end encrypted link share')"
		@submit="createShare"
		@update:open="$event || $emit('close', internalShare)">
		<NcRadioGroup
			v-model="sharePermissions"
			:disabled="!!internalShare"
			:label="t('end_to_end_encryption', 'Permissions')">
			<NcRadioGroupButton
				:label="t('end_to_end_encryption', 'Upload only')"
				:value="Permissions.UploadOnly" />
			<NcRadioGroupButton
				:label="t('end_to_end_encryption', 'View only')"
				:value="Permissions.ViewOnly" />
			<NcRadioGroupButton
				:label="t('end_to_end_encryption', 'View and upload')"
				:value="Permissions.ViewAndUpload" />
		</NcRadioGroup>

		<p v-if="sharePermissions === Permissions.ViewOnly" :class="$style.publicLinksDialog__hint">
			{{ t('end_to_end_encryption', 'Unlike upload-only shares view-only shares require a trusted server to enforce the restriction.') }}
		</p>

		<template v-if="shareUrl">
			<NcFormBox :class="$style.publicLinksDialog__formBox">
				<NcFormBoxCopyButton
					:label="t('end_to_end_encryption', 'Share url')"
					:value="shareUrl" />
				<NcFormBoxCopyButton
					v-if="sharedMnemonic"
					:label="t('end_to_end_encryption', 'Mnemonic')"
					:value="sharedMnemonic" />
			</NcFormBox>

			<NcNoteCard v-if="sharedMnemonic" type="info">
				{{ t('end_to_end_encryption', 'Please share the secret mnemonic with the recipient using a secure second channel.') }}
			</NcNoteCard>
		</template>

		<template #actions>
			<NcButton v-if="!internalShare" type="submit" variant="primary">
				{{ share ? t('end_to_end_encryption', 'Update link share') : t('end_to_end_encryption', 'Create link share') }}
			</NcButton>
			<NcButton v-else variant="primary" @click="$emit('close', internalShare)">
				{{ t('end_to_end_encryption', 'Close') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style module>
.publicLinksDialog {
	display: flex;
	flex-direction: column;
	gap: var(--default-grid-baseline);
}

.publicLinksDialog__hint {
	color: var(--color-text-maxcontrast);
}

.publicLinksDialog__formBox {
	margin-top: 1rem;
}
</style>
