<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { INode } from '@nextcloud/files'
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { RootMetadata } from '../models/RootMetadata.ts'

import { mdiPlus } from '@mdi/js'
import axios from '@nextcloud/axios'
import { Permission } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { ref, toRaw, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import FilesSharingSidebarSectionFiledropEntry from '../components/FilesSharingSidebarSectionFiledrop/FilesSharingSidebarSectionFiledropEntry.vue'
import logger from '../services/logger.ts'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'

const props = defineProps<{
	node: INode
}>()

const rootMetadata = ref<RootMetadata>()
watch(() => props.node, async () => {
	rootMetadata.value = await metadataStore.getRootMetadata(props.node.path)
}, { immediate: true })

const shares = ref()
watch(rootMetadata, loadShares, { immediate: true })

/**
 * Create a new end-to-end filedrop
 */
async function createShare() {
	logger.debug('Creating end-to-end filedrop')
	const metadata = toRaw(rootMetadata.value)
	if (!metadata) {
		throw new Error('No metadata available for the current folder')
	}

	try {
		await keyStore.loadPublicKey()
		await keyStore.loadPrivateKey()

		// create nextcloud share
		const { path } = metadataStore.getRootFolder(metadata)
		await axios.post(generateOcsUrl('/apps/files_sharing/api/v1/shares'), {
			path: decodeURI(path),
			permissions: Permission.CREATE,
			shareType: ShareType.Link,
		})
		await loadShares()
	} finally {
		// todo
	}
}

/**
 * Handle loading shares for the root metadata
 */
async function loadShares() {
	const metadata = toRaw(rootMetadata.value)
	if (!metadata) {
		logger.debug('No metadata available, skipping loading shares')
		return
	}

	let { path } = metadataStore.getRootFolder(metadata)
	path = decodeURI(path)
	logger.debug(`Loading shares for path: ${path}`)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data } = await axios.get<OCSResponse<any[]>>(generateOcsUrl('/apps/files_sharing/api/v1/shares'), {
		params: {
			path,
		},
	})

	logger.debug(`Loaded ${data.ocs.data.length} shares for path: ${path}`, { shares: data.ocs.data })
	shares.value = data.ocs.data.filter(({ share_type: shareType }) => shareType === ShareType.Link)
}
</script>

<template>
	<section>
		<h5>{{ t('end_to_end_encryption', 'End-to-end encrypted filedrop') }}</h5>
		<ul :aria-label="t('end_to_end_encryption', 'End-to-end encrypted filedrops')">
			<FilesSharingSidebarSectionFiledropEntry
				v-for="share in shares"
				:key="share.id"
				:share="share"
				@delete="shares = shares.filter((s) => s !== share)" />
		</ul>
		<NcButton @click="createShare">
			<template #icon>
				<NcIconSvgWrapper :path="mdiPlus" />
			</template>
			{{ t('end_to_end_encryption', 'New filedrop') }}
		</NcButton>
	</section>
</template>
