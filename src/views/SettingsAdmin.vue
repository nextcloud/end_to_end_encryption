<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<script setup lang="ts">
import type { OCSResponse } from '@nextcloud/typings/ocs'

import axios from '@nextcloud/axios'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import debounce from 'debounce'
import { onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
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

const debugToolsAllowed = ref(loadState<boolean>('end_to_end_encryption', 'debug_tools_allowed', false))
const savingDebugTools = ref(false)

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

/**
 * Allow or disallow people to enable the debugging tools
 *
 * @param allowed - Whether the debugging tools are allowed
 */
function setDebugToolsAllowed(allowed: boolean) {
	savingDebugTools.value = true
	globalThis.OCP.AppConfig.setValue('end_to_end_encryption', 'debug_tools_allowed', allowed ? 'true' : 'false', {
		success() {
			savingDebugTools.value = false
			debugToolsAllowed.value = allowed
			showSuccess(t('end_to_end_encryption', 'Saved debugging tools setting'))
		},
		error(error: unknown) {
			savingDebugTools.value = false
			logger.error('Could not save the debugging tools setting', { error })
			showError(t('end_to_end_encryption', 'Could not save the debugging tools setting'))
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
			:inputLabel="t('end_to_end_encryption', 'Limit app usage to groups')"
			label="displayname"
			:loading="loadingGroups"
			:options="groups"
			multiple
			searchable
			@searchChange="searchGroup" />

		<NcButton
			class="admin-e2ee__save-button"
			:loading="loading"
			variant="primary"
			@click="saveChanges">
			{{ t('end_to_end_encryption', 'Save') }}
		</NcButton>

		<h3>{{ t('end_to_end_encryption', 'Debugging tools') }}</h3>
		<p class="settings-hint">
			{{ t('end_to_end_encryption', 'People can enable an action in their personal settings that shows the metadata of end-to-end encrypted folders in the browser. This helps to investigate issues with encrypted folders.') }}
		</p>
		<NcCheckboxRadioSwitch
			:disabled="savingDebugTools"
			:loading="savingDebugTools"
			:modelValue="debugToolsAllowed"
			type="switch"
			@update:modelValue="setDebugToolsAllowed">
			{{ t('end_to_end_encryption', 'Allow people to enable the debugging tools') }}
		</NcCheckboxRadioSwitch>
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
