<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { INode } from '@nextcloud/files'
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { RootMetadata } from '../models/RootMetadata.ts'

import { mdiTrashCanOutline } from '@mdi/js'
import axios from '@nextcloud/axios'
import { showWarning } from '@nextcloud/dialogs'
import { Permission } from '@nextcloud/files'
import { defaultRootPath } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { useDebounceFn } from '@vueuse/core'
import stringify from 'safe-stable-stringify'
import { computed, ref, toRaw, watch } from 'vue'
import NcAvatar from '@nextcloud/vue/components/NcAvatar'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcListItem from '@nextcloud/vue/components/NcListItem'
import NcSelectUsers from '@nextcloud/vue/components/NcSelectUsers'
import * as api from '../services/api.ts'
import logger from '../services/logger.ts'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'

type IUserData = InstanceType<typeof NcSelectUsers>['$props']['options'][number]

const props = defineProps<{
	node: INode
}>()

const isCreatingShare = ref(false)

const metadata = ref<RootMetadata>()
watch(() => props.node, async () => {
	metadata.value = await metadataStore.getRootMetadata(props.node.path)
}, { immediate: true })

const shares = ref<Record<string, string | number>[]>([])
watch(metadata, loadShares, { immediate: true })

const userShares = computed(() => shares.value.filter(({ share_type: shareType }) => shareType === ShareType.User))
const users = ref<IUserData[]>([])

const debounsedSearch = useDebounceFn(onSearch, 800)

/**
 * Callback for user search
 *
 * @param query - The search query
 */
async function onSearch(query: string) {
	const { data } = await axios.get<OCSResponse<{ users: unknown[] }>>(
		generateOcsUrl('/apps/files_sharing/api/v1/sharees'),
		{
			params: {
				search: query,
				itemType: 'folder',
				shareType: ShareType.User,
			},
		},
	)
	const allUsers = data.ocs.data.users.map((user) => ({
		displayName: user.label || user.shareWithDisplayNameUnique,
		id: user.value.shareWith,
		user: user.value.shareWith,
	}))
	const filteredUsers = []
	for (const user of allUsers) {
		logger.debug(`Checking if user ${user.id} has a public key`, { user })
		if (await keyStore.getUserKey(user.id)) {
			filteredUsers.push(user)
		}
	}
	users.value = filteredUsers
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

	logger.debug(`Creating end-to-end encrypted share for user ${user.id}`)
	if (!metadata.value) {
		throw new Error('No metadata available for the current folder')
	}

	isCreatingShare.value = true
	try {
		await keyStore.loadPublicKey()
		await keyStore.loadPrivateKey()

		// create nextcloud share
		const rootMetadata = toRaw(metadata.value)
		const { path, id } = metadataStore.getRootFolder(rootMetadata)
		await axios.post(generateOcsUrl('/apps/files_sharing/api/v1/shares'), {
			path: path.replace(new RegExp(`^${defaultRootPath}`), ''),
			permissions: Permission.ALL,
			shareType: ShareType.User,
			shareWith: user.id,
		})

		// update the metadata
		rootMetadata.addUser(user.id, cert)
		const token = await api.lockFolder(id, rootMetadata.counter)
		try {
			const { metadata: rawMetadata, signature } = await rootMetadata.export(await keyStore.getCertificate())
			await api.updateMetadata(id, stringify(rawMetadata), token, signature)
		} finally {
			await api.unlockFolder(id, token)
		}

		// refresh shares
		await loadShares()
	} finally {
		isCreatingShare.value = false
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

	let { path } = metadataStore.getRootFolder(rootMetadata)
	path = decodeURI(path)
	logger.debug(`Loading shares for path: ${path}`)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data } = await axios.get<OCSResponse<any[]>>(generateOcsUrl('/apps/files_sharing/api/v1/shares'), {
		params: {
			path,
		},
	})

	logger.debug(`Loaded ${data.ocs.data.length} shares for path: ${path}`, { shares: data.ocs.data })
	shares.value = data.ocs.data
}

/**
 * Remove an end-to-end encrypted share
 *
 * @param shareId - The ID of the share to remove
 */
async function removeShare(shareId: number | string) {
	const share = shares.value.find((s) => s.id === shareId)
	if (!share) {
		logger.error(`Share with id ${shareId} not found`)
		return
	}

	const rootMetadata = toRaw(metadata.value)
	if (!rootMetadata) {
		logger.error('No metadata available, cannot remove share')
		return
	}

	const user = share.share_with as string
	if (!rootMetadata.getUsers().includes(user)) {
		logger.error(`User ${user} not found in metadata, cannot remove share`)
		return
	}

	const { id } = metadataStore.getRootFolder(rootMetadata)
	const token = await api.lockFolder(id, rootMetadata.counter + 1)
	isCreatingShare.value = true
	try {
		await axios.delete(generateOcsUrl('/apps/files_sharing/api/v1/shares/' + shareId))
		rootMetadata.removeUser(user)
		const rawMetadata = await rootMetadata.export(await keyStore.getCertificate())
		await api.updateMetadata(id, stringify(rawMetadata.metadata), token, rawMetadata.signature)
	} finally {
		await api.unlockFolder(id, token)
		isCreatingShare.value = false
	}

	shares.value = shares.value.filter((s) => s.id !== shareId)
}
</script>

<template>
	<section :class="$style.sidebarSection">
		<h5 :class="$style.sidebarSection__heading">
			{{ t('end_to_end_encryption', 'End-to-end encrypted shares') }}
		</h5>
		<p>{{ t('end_to_end_encryption', 'Users always have access to the full encrypted folder.') }}</p>
		<NcSelectUsers
			:class="$style.sidebarSection__selectUsers"
			:disabled="isCreatingShare"
			:input-label="t('end_to_end_encryption', 'Create end-to-end encrypted share')"
			:options="users"
			@search="debounsedSearch"
			@update:model-value="createShare" />
		<ul :aria-label="t('end_to_end_encryption', 'End-to-end encrypted shares')">
			<NcListItem
				v-for="share of userShares"
				:key="share.id"
				compact
				:name="share.share_with_displayname">
				<template #icon>
					<NcAvatar
						disable-menu
						:user="share.share_with"
						:display-name="share.share_with_displayname" />
				</template>
				<template #extra-actions>
					<NcButton
						:aria-label="t('end_to_end_encryption', 'Remove')"
						:disabled="isCreatingShare"
						variant="error"
						@click="removeShare(share.id)">
						<template #icon>
							<NcIconSvgWrapper :path="mdiTrashCanOutline" />
						</template>
					</NcButton>
				</template>
			</NcListItem>
		</ul>
	</section>
</template>

<style module>
.sidebarSection {
	width: 100%;
}

.sidebarSection__heading {
	font-size: 16px;
}

.sidebarSection__selectUsers {
	width: 100%;
}
</style>
