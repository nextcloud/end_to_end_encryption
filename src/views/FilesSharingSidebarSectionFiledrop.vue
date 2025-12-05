<script setup lang="ts">
import type { INode } from '@nextcloud/files'
import type { OCSResponse } from '@nextcloud/typings/ocs'

import { mdiPlus } from '@mdi/js'
import axios from '@nextcloud/axios'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { ref, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import FilesSharingSidebarSectionFiledropEntry from '../components/FilesSharingSidebarSectionFiledrop/FilesSharingSidebarSectionFiledropEntry.vue'

const props = defineProps<{
	node: INode
}>()

const showDialog = ref(false)
const shares = ref()
watch(() => props.node, async () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data } = await axios.get<OCSResponse<any[]>>(generateOcsUrl('/ocs/v2.php/apps/files_sharing/api/v1/shares'), {
		params: {
			path: props.node.path,
		},
	})
	shares.value = data.ocs.data.filter(({ share_type: shareType }) => shareType === ShareType.Link)
}, { immediate: true })

/**
 * Handle new share created event
 *
 * @param share - The new share
 */
function onNewShare(share: Record<string, unknown>) {
	shares.value.push(share)
	showDialog.value = false
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
		<NcButton @click="showDialog = true">
			<template #icon>
				<NcIconSvgWrapper :path="mdiPlus" />
			</template>
			{{ t('end_to_end_encryption', 'New filedrop') }}
		</NcButton>
		<FilesSharingSidebarSectionFiledropDialog
			v-if="showDialog"
			:node="props.node"
			@close="showDialog = false"
			@created="onNewShare" />
	</section>
</template>
