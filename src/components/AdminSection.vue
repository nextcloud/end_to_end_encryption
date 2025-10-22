<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<script setup lang="ts">
import type { OCSResponse } from '@nextcloud/typings/ocs'

import axios from '@nextcloud/axios'
import { showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import debounce from 'debounce'
import { onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import NcSettingsSection from '@nextcloud/vue/components/NcSettingsSection'
import logger from '../services/logger.ts'

interface IGroup {
	id: string
	displayname: string
}

const loading = ref(false)
const loadingGroups = ref(true)
const allowedGroups = ref(loadState<string[]>('end_to_end_encryption', 'allowed_groups').map((group) => {
	return {
		id: group,
		displayname: group,
	}
}).sort(function(a, b) {
	return a.displayname.localeCompare(b.displayname)
}))
const groups = ref([...allowedGroups.value])

/**
 * Searches for groups matching the query
 */
const searchGroup = debounce(async function(query?: string) {
	loadingGroups.value = true
	try {
		const { data } = await axios.get<OCSResponse<{ groups: IGroup[] }>>(generateOcsUrl('cloud/groups/details'), {
			params: {
				search: query,
				limit: 20,
				offset: 0,
			},
		})
		groups.value = data.ocs.data.groups.sort(function(a, b) {
			return a.displayname.localeCompare(b.displayname)
		})
	} catch (error) {
		logger.error('Could not fetch groups', { error })
	} finally {
		loadingGroups.value = false
	}
}, 500)

onMounted(() => searchGroup())

/**
 * Saves the allowed groups to the config on the server
 */
function saveChanges() {
	loading.value = true
	loadingGroups.value = true
	const groups = allowedGroups.value.map((group) => {
		return group.id
	})
	globalThis.OCP.AppConfig.setValue('end_to_end_encryption', 'allowed_groups', JSON.stringify(groups), {
		success() {
			loading.value = false
			loadingGroups.value = false
			showSuccess(t('end_to_end_encryption', 'Saved groups'))
		},
	})
}
</script>

<template>
	<NcSettingsSection :name="t('end_to_end_encryption', 'End-to-End Encryption')" class="admin-e2ee">
		<h3>{{ t('end_to_end_encryption', 'Limit to groups') }}</h3>
		<p class="settings-hint">
			{{ t('end_to_end_encryption', 'When at least one group is selected, only people of the listed groups can use the End-to-End encryption app.') }}
		</p>
		<NcSelect
			v-model="allowedGroups"
			class="admin-e2ee__group-select"
			:disabled="loading"
			:input-label="t('end_to_end_encryption', 'Limit app usage to groups')"
			label="displayname"
			:loading="loadingGroups"
			:options="groups"
			multiple
			searchable
			@search-change="searchGroup" />

		<NcButton
			class="admin-e2ee__save-button"
			:loading="loading"
			variant="primary"
			@click="saveChanges">
			{{ t('end_to_end_encryption', 'Save') }}
		</NcButton>
	</NcSettingsSection>
</template>

<style scoped lang="scss">
.admin-e2ee {
	&__headline {
		margin-block: 0.5em 1em;
	}

	&__group-select {
		max-width: 300px;
	}

	&__save-button {
		margin-block-start: 1em;
	}
}
</style>
