<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { RootMetadata } from '../../models/RootMetadata.ts'
import type { IShare } from '../../views/FilesSharingSidebarSections.vue'

import { mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js'
import axios from '@nextcloud/axios'
import { showInfo, showWarning } from '@nextcloud/dialogs'
import { Permission } from '@nextcloud/files'
import { defaultRootPath } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { spawnDialog } from '@nextcloud/vue/functions/dialog'
import { useDebounceFn } from '@vueuse/core'
import stringify from 'safe-stable-stringify'
import { ref, toRaw } from 'vue'
import NcAvatar from '@nextcloud/vue/components/NcAvatar'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcListItem from '@nextcloud/vue/components/NcListItem'
import NcSelectUsers from '@nextcloud/vue/components/NcSelectUsers'
import FilesSharingSidebarSectionUsersDialog from './FilesSharingSidebarSectionUsersDialog.vue'
import * as api from '../../services/api.ts'
import logger from '../../services/logger.ts'
import * as keyStore from '../../store/keys.ts'
import * as metadataStore from '../../store/metadata.ts'

type IUserData = InstanceType<typeof NcSelectUsers>['$props']['options'][number]

const userShares = defineModel<IShare[]>({ required: true })

const props = defineProps<{
	metadata: RootMetadata
}>()

const isCreatingShare = ref(false)
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
async function createShare(user: IUserData | IUserData[]) {
	user = Array.isArray(user) ? user[0]! : user
	const cert = await keyStore.getUserKey(user.id)
	if (!cert) {
		showWarning(t('end_to_end_encryption', 'The selected user has not yet enabled end-to-end encryption.'))
		return
	}

	const permissions = await askForSharePermission()
	logger.debug(`Creating end-to-end encrypted share for user ${user.id}`, { permissions })

	const rootMetadata = toRaw(props.metadata)
	isCreatingShare.value = true
	try {
		await keyStore.loadPublicKey()
		await keyStore.loadPrivateKey()
		const { path, id } = metadataStore.getRootFolder(rootMetadata)

		// create nextcloud share
		const { data } = await axios.post<OCSResponse>(generateOcsUrl('/apps/files_sharing/api/v1/shares'), {
			path: path.replace(new RegExp(`^${defaultRootPath}`), ''),
			permissions,
			shareType: ShareType.User,
			shareWith: user.id,
		})

		const token = await api.lockFolder(id, rootMetadata.counter + 1)
		try {
			// first load all folders
			const subfolders = await metadataStore.loadAllSubfolders(rootMetadata)
			// add the user to the metadata
			rootMetadata.addUser(user.id, cert)
			// update the metadata to re-encrypt with the new key
			const { metadata: rawMetadata, signature } = await rootMetadata.export(await keyStore.getCertificate())
			await api.updateMetadata(id, stringify(rawMetadata), token, signature)
			// re-encrypt all subfolders
			await reencryptSubfolders(subfolders, rootMetadata.key, token)
		} finally {
			await api.unlockFolder(id, token)
		}

		// refresh shares
		userShares.value.push(data.ocs.data)
	} finally {
		isCreatingShare.value = false
	}
}

/**
 * Remove an end-to-end encrypted share
 *
 * @param shareId - The ID of the share to remove
 */
async function removeShare(shareId: number | string) {
	const share = userShares.value.find((s) => s.id === shareId)
	if (!share) {
		logger.error(`Share with id ${shareId} not found`)
		return
	}

	const rootMetadata = toRaw(props.metadata)
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
		// first load all folders
		const subfolders = await metadataStore.loadAllSubfolders(rootMetadata)
		// delete the share
		await axios.delete(generateOcsUrl('/apps/files_sharing/api/v1/shares/' + shareId))
		rootMetadata.removeUser(user)
		// update the metadata to re-encrypt with the new key
		const rawMetadata = await rootMetadata.export(await keyStore.getCertificate())
		await api.updateMetadata(id, stringify(rawMetadata.metadata), token, rawMetadata.signature)
		// re-encrypt all subfolders
		await reencryptSubfolders(subfolders, rootMetadata.key, token)
	} finally {
		await api.unlockFolder(id, token)
		isCreatingShare.value = false
	}

	userShares.value = userShares.value.filter((s) => s.id !== shareId)
}

/**
 * Edit the share permissions
 *
 * @param share - The share to edit
 */
async function editShare(share: IShare) {
	const newPermissions = await askForSharePermission(getSharePermissions(share))
	if (newPermissions === share.permissions) {
		return
	}

	logger.debug(`Updating share ${share.id} with new permissions`, { newPermissions })
	await axios.put(generateOcsUrl('/apps/files_sharing/api/v1/shares/' + share.id), {
		permissions: newPermissions.toString(),
	})
	share.permissions = newPermissions

	showInfo(t('end_to_end_encryption', 'Share permissions updated successfully.'))
}

/**
 * Re-encrypt all subfolders with the new metadata key
 *
 * @param subfolders - The subfolders to re-encrypt
 * @param key - The new metadata key
 * @param token - The lock token for the root folder
 */
async function reencryptSubfolders(subfolders: metadataStore.IStoreMetadata[], key: CryptoKey, token: string) {
	for (const { metadata, id } of subfolders) {
		metadata.key = key
		const { metadata: rawMetadata, signature } = await metadata.export(await keyStore.getCertificate())
		await api.updateMetadata(id, stringify(rawMetadata), token, signature)
	}
}

/**
 * Ask for share permissions
 *
 * @param permissions - The initial permissions
 */
async function askForSharePermission(permissions: Permission = Permission.ALL): Promise<Permission> {
	return await spawnDialog(FilesSharingSidebarSectionUsersDialog, {
		permissions,
	})
}

/**
 * Get the share permissions from a share
 *
 * @param share - The share to get the permissions from
 */
function getSharePermissions(share: IShare): Permission {
	const permissions = typeof share.permissions === 'number' ? (share.permissions as number) : Number.parseInt(share.permissions as string)
	return (permissions & Permission.UPDATE) ? Permission.ALL : Permission.READ
}
</script>

<template>
	<section :class="$style.sidebarSection">
		<h5 :class="$style.sidebarSection__heading">
			{{ t('end_to_end_encryption', 'End-to-end encrypted shares') }}
		</h5>
		<p>
			{{ t('end_to_end_encryption', 'Share recipients always have access to the full encrypted folder.') }}
			{{ t('end_to_end_encryption', 'It is only possible to share with accounts that have already setup end-to-end encryption.') }}
		</p>
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
				<template #subname>
					({{ getSharePermissions(share) === Permission.ALL ? t('end_to_end_encryption', 'Read, write, and share') : t('end_to_end_encryption', 'Read only') }})
				</template>
				<template #extra-actions>
					<NcButton
						:aria-label="t('end_to_end_encryption', 'Edit')"
						:disabled="isCreatingShare"
						variant="tertiary"
						@click="editShare(share)">
						<template #icon>
							<NcIconSvgWrapper :path="mdiPencilOutline" />
						</template>
					</NcButton>
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
