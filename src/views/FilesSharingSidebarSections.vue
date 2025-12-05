<script setup lang="ts">
import type { INode } from '@nextcloud/files'
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { RootMetadata } from '../models/RootMetadata.ts'

import axios from '@nextcloud/axios'
import { showWarning } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { useDebounceFn } from '@vueuse/core'
import stringify from 'safe-stable-stringify'
import { computed, ref, watch } from 'vue'
import NcSelectUsers from '@nextcloud/vue/components/NcSelectUsers'
import * as api from '../services/api.ts'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'

type IUserData = InstanceType<typeof NcSelectUsers>['$props']['options'][number]

const props = defineProps<{
	node: INode
}>()

const metadata = ref<RootMetadata>()
watch(() => props.node, async () => {
	metadata.value = await metadataStore.getRootMetadata(props.node.path)
}, { immediate: true })

const shares = ref<Record<string, string | number>[]>([])
watch(() => props.node, loadShares, { immediate: true })

const userShares = computed(() => shares.value.filter(({ share_type: shareType }) => shareType === ShareType.User))

const users = ref<IUserData[]>([])

const debounsedSearch = useDebounceFn(onSearch, 800)

/**
 * Callback for user search
 *
 * @param query - The search query
 */
async function onSearch(query: string) {
	const { data } = await axios.get<OCSResponse>(
		generateOcsUrl('/apps/files_sharing/api/v1/sharees'),
		{
			params: {
				search: query,
				itemType: 'folder',
				shareType: ShareType.User,
			},
		},
	)
	users.value = data.ocs.data.users.map((user) => ({
		displayName: user.label || user.shareWithDisplayNameUnique,
		id: user.value.shareWith,
		user: user.value.shareWith,
	}))
	for (const user of users.value) {
		if (!await keyStore.getUserKey(user.id)) {
			users.value = users.value.filter((u) => u !== user)
		}
	}
}

/**
 * Create a new end-to-end encrypted share for the given user
 *
 * @param user - The user to create the share for
 */
async function createShare(user: IUserData) {
	const cert = await keyStore.getUserKey(user.id)
	if (!cert) {
		showWarning(t('end_to_end_encryption', 'The selected user has not yet enabled end-to-end encryption.'))
		return
	}

	// create the nextcloud share
	// create nextcloud share

	// update the metadata
	const path = metadataStore.getRootFolder(metadata.value!)
	const { id } = await metadataStore.getMetadata(path)!
	metadata.value!.addUser(user.id, cert)
	const token = await api.lockFolder(id, metadata.value!.counter)
	try {
		const { metadata: rawMetadata, signature } = await metadata.value!.export(keyStore.getCertificate()!)
		await api.updateMetadata(id, stringify(rawMetadata), token, signature)
	} finally {
		await api.unlockFolder(id, token)
	}

	// refresh shares
	await loadShares()
}

/**
 *
 */
async function loadShares() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data } = await axios.get<OCSResponse<any[]>>(generateOcsUrl('/ocs/v2.php/apps/files_sharing/api/v1/shares'), {
		params: {
			path: props.node.path,
		},
	})
	shares.value = data.ocs.data
}
</script>

<template>
	<section>
		<h5 :class="$style.sidebarSection__heading">
			{{ t('end_to_end_encryption', 'End-to-end encrypted shares') }}
		</h5>
		<NcSelectUsers
			:input-label="t('end_to_end_encryption', 'Create end-to-end encrypted share')"
			:options="users"
			@search="debounsedSearch"
			@update:model-value="createShare" />
		<ul :aria-label="t('end_to_end_encryption', 'End-to-end encrypted shares')">
			<li v-for="user of userShares" :key="user.id">
				{{ user }}
			</li>
		</ul>
	</section>
</template>

<style module>
.sidebarSection__heading {
	font-size: 16px;
}
</style>
