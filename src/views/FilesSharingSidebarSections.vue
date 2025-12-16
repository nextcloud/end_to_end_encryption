<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { INode } from '@nextcloud/files'
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { RootMetadata } from '../models/RootMetadata.ts'

import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { ref, toRaw, watch } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import FilesSharingSidebarSectionFiledrop from '../components/FilesSharingSidebarSection/FilesSharingSidebarSectionFiledrop.vue'
import FilesSharingSidebarSectionUsers from '../components/FilesSharingSidebarSection/FilesSharingSidebarSectionUsers.vue'
import logger from '../services/logger.ts'
import * as metadataStore from '../store/metadata.ts'

export interface IShare extends Record<string, string | number> {
	id: number | string
	share_with: string
	share_with_displayname: string
}

const props = defineProps<{
	node: INode
}>()

const isLoadingMetadata = ref(true)
const isLoadingShares = ref(true)

const metadata = ref<RootMetadata>()
watch(() => props.node, loadMetadata, { immediate: true })

const userShares = ref<IShare[]>([])
const filedropShares = ref<IShare[]>([])
watch(metadata, loadShares, { immediate: true })

/**
 * Handle loading metadata for the current node
 */
async function loadMetadata() {
	isLoadingMetadata.value = true
	try {
		metadata.value = await metadataStore.getRootMetadata(props.node.path)
	} catch (error) {
		logger.error('Failed to load root metadata', { error })
	} finally {
		isLoadingMetadata.value = false
	}
}

/**
 * Handle loading shares for the root metadata
 */
async function loadShares() {
	const rootMetadata = toRaw(metadata.value)
	if (!rootMetadata) {
		logger.debug('No metadata available, skipping loading shares')
		return
	}

	isLoadingShares.value = true
	try {
		let { path } = metadataStore.getRootFolder(rootMetadata)
		path = decodeURI(path)
		logger.debug(`Loading shares for path: ${path}`)
		const { data } = await axios.get<OCSResponse<IShare[]>>(generateOcsUrl('/apps/files_sharing/api/v1/shares'), {
			params: {
				path,
			},
		})

		logger.debug(`Loaded ${data.ocs.data.length} shares for path: ${path}`, { shares: data.ocs.data })
		const shares = data.ocs.data
		userShares.value = shares.filter(({ share_type: shareType }) => shareType === ShareType.User)
		filedropShares.value = shares.filter(({ share_type: shareType }) => shareType === ShareType.Link)
	} catch (error) {
		logger.error('Failed to load shares', { error })
		showError(t('end_to_end_encryption', 'Failed to load shares.'))
	} finally {
		isLoadingShares.value = false
	}
}
</script>

<template>
	<NcEmptyContent
		v-if="!metadata || isLoadingMetadata || isLoadingShares"
		:name="isLoadingShares ? t('end_to_end_encryption', 'Loading shares…') : t('end_to_end_encryption', 'Loading metadata…')">
		<template #icon>
			<NcLoadingIcon />
		</template>
	</NcEmptyContent>
	<template v-else>
		<FilesSharingSidebarSectionUsers v-model="userShares" :class="$style.userSection" :metadata />
		<FilesSharingSidebarSectionFiledrop v-model="filedropShares" :metadata />
	</template>
</template>

<style module>
.userSection {
	/* No additional styles needed */
}

:global(#tab-sharing .sharingTab__content):has(.userSection) > section:nth-of-type(1),
:global(#tab-sharing .sharingTab__content):has(.userSection) > section:nth-of-type(2) {
	display: none;
}
</style>
