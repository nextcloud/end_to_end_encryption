<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { RootMetadata } from '../../models/RootMetadata.ts'
import type { IShare } from '../../services/sharing.ts'

import { mdiEmailOutline, mdiPlus } from '@mdi/js'
import { getCapabilities } from '@nextcloud/capabilities'
import { t } from '@nextcloud/l10n'
import { spawnDialog } from '@nextcloud/vue/functions/dialog'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import FilesSharingSidebarSectionPublicLinksDialog from './FilesSharingSidebarSectionPublicLinksDialog.vue'
import FilesSharingSidebarSectionPublicLinksEntry from './FilesSharingSidebarSectionPublicLinksEntry.vue'

const publicLinkShares = defineModel<IShare[]>({ required: true })
const props = defineProps<{
	metadata: RootMetadata
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isShareByMailEnabled = (getCapabilities() as any).files_sharing?.sharebymail?.enabled === true

/**
 * Create a new end-to-end link or email share
 *
 * @param isEmailShare - If an email share should be created
 */
async function openDialog(isEmailShare: boolean = false) {
	const share = await spawnDialog(FilesSharingSidebarSectionPublicLinksDialog, {
		metadata: props.metadata,
		isEmailShare,
	})
	if (share) {
		publicLinkShares.value.push(share)
	}
}
</script>

<template>
	<section>
		<h5>{{ t('end_to_end_encryption', 'End-to-end encrypted link shares') }}</h5>
		<ul :aria-label="t('end_to_end_encryption', 'End-to-end encrypted link shares')">
			<FilesSharingSidebarSectionPublicLinksEntry
				v-for="share in publicLinkShares"
				:key="share.id"
				:share="share"
				@delete="publicLinkShares = publicLinkShares.filter((s) => s !== share)" />
		</ul>
		<div :class="$style.publicLinks__actions">
			<NcButton @click="openDialog()">
				<template #icon>
					<NcIconSvgWrapper :path="mdiPlus" />
				</template>
				{{ t('end_to_end_encryption', 'Link share') }}
			</NcButton>
			<NcButton v-if="isShareByMailEnabled" @click="openDialog(true)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiEmailOutline" />
				</template>
				{{ t('end_to_end_encryption', 'Email share') }}
			</NcButton>
		</div>
	</section>
</template>

<style module>
.publicLinks__actions {
	display: flex;
	flex-wrap: wrap;
	gap: var(--default-grid-baseline);
}
</style>
