<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { INode } from '@nextcloud/files'
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { FileStat, ResponseDataDetailed } from 'webdav'
import type { RootMetadata } from '../models/RootMetadata.ts'
import type { IShare } from '../services/sharing.ts'

import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'
import { emit } from '@nextcloud/event-bus'
import { getClient, getDefaultPropfind, getRootPath, resultToNode } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { join } from '@nextcloud/paths'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { computed, ref, toRaw, watch } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import FilesSharingSidebarSectionPublicLinks from '../components/FilesSharingSidebarSection/FilesSharingSidebarSectionPublicLinks.vue'
import FilesSharingSidebarSectionUsers from '../components/FilesSharingSidebarSection/FilesSharingSidebarSectionUsers.vue'
import logger from '../services/logger.ts'
import * as metadataStore from '../store/metadata.ts'

const props = defineProps<{
	node: INode
}>()

const isLoadingMetadata = ref(true)
const isLoadingShares = ref(true)

const metadata = ref<RootMetadata>()
watch(() => props.node, loadMetadata, { immediate: true })

const userShares = ref<IShare[]>([])
const publicLinkShares = ref<IShare[]>([])
watch(metadata, loadShares, { immediate: true })

// only shares changed in this section need a node update
let loadedShareIds = ''
const shareIds = computed(() => [...userShares.value, ...publicLinkShares.value].map(({ id }) => id).sort().join())
watch(shareIds, (ids) => {
	if (ids !== loadedShareIds) {
		loadedShareIds = ids
		updateNode()
	}
})

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
		publicLinkShares.value = shares.filter(({ share_type: shareType }) => shareType === ShareType.Link)
		loadedShareIds = shareIds.value
	} catch (error) {
		logger.error('Failed to load shares', { error })
		showError(t('end_to_end_encryption', 'Failed to load shares.'))
	} finally {
		isLoadingShares.value = false
	}
}

/**
 * Update the node in the files app so its sharing status is shown
 */
async function updateNode() {
	try {
		const { data } = await getClient().stat(join(getRootPath(), props.node.path), {
			details: true,
			data: getDefaultPropfind(),
		}) as ResponseDataDetailed<FileStat>
		emit('files:node:updated', resultToNode(data))
	} catch (error) {
		logger.error('Failed to update node after sharing changes', { error })
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
		<FilesSharingSidebarSectionUsers
			v-model="userShares"
			:class="$style.userSection"
			:metadata />
		<FilesSharingSidebarSectionPublicLinks
			v-model="publicLinkShares"
			:metadata />
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
