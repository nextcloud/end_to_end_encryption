<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { RootMetadata } from '../../models/RootMetadata.ts'
import type { IShare } from '../../views/FilesSharingSidebarSections.vue'

import { mdiPlus } from '@mdi/js'
import axios from '@nextcloud/axios'
import { Permission } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { toRaw } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import FilesSharingSidebarSectionFiledropEntry from './FilesSharingSidebarSectionFiledropEntry.vue'
import logger from '../../services/logger.ts'
import * as keyStore from '../../store/keys.ts'
import * as metadataStore from '../../store/metadata.ts'

const filedropShares = defineModel<IShare[]>({ required: true })
const props = defineProps<{
	metadata: RootMetadata
}>()

/**
 * Create a new end-to-end filedrop
 */
async function createShare() {
	logger.debug('Creating end-to-end filedrop')
	const metadata = toRaw(props.metadata)
	if (!metadata) {
		throw new Error('No metadata available for the current folder')
	}

	try {
		await keyStore.loadPublicKey()
		await keyStore.loadPrivateKey()

		// create nextcloud share
		const { path } = metadataStore.getRootFolder(metadata)
		const { data } = await axios.post<OCSResponse<IShare>>(generateOcsUrl('/apps/files_sharing/api/v1/shares'), {
			path: decodeURI(path),
			permissions: Permission.CREATE,
			shareType: ShareType.Link,
		})
		filedropShares.value.push(data.ocs.data)
	} finally {
		// todo
	}
}
</script>

<template>
	<section>
		<h5>{{ t('end_to_end_encryption', 'End-to-end encrypted file drop') }}</h5>
		<ul :aria-label="t('end_to_end_encryption', 'End-to-end encrypted file drops')">
			<FilesSharingSidebarSectionFiledropEntry
				v-for="share in filedropShares"
				:key="share.id"
				:share="share"
				@delete="filedropShares = filedropShares.filter((s) => s !== share)" />
		</ul>
		<NcButton @click="createShare">
			<template #icon>
				<NcIconSvgWrapper :path="mdiPlus" />
			</template>
			{{ t('end_to_end_encryption', 'New file drop') }}
		</NcButton>
	</section>
</template>
