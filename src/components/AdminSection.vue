<!--
  - SPDX-FileCopyrightText: 2019 Joas Schilling <coding@schilljs.com>
  - SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
	<SettingsSection :title="t('end_to_end_encryption', 'End-to-End Encryption')" class="admin-e2ee">
		<h3>{{ t('end_to_end_encryption', 'Limit to groups') }}</h3>
		<p class="settings-hint">
			{{ t('end_to_end_encryption', 'When at least one group is selected, only people of the listed groups can use the End-to-End encryption app.') }}
		</p>
		<Multiselect v-model="allowedGroups"
			class="allowed-groups"
			:options="groups"
			:placeholder="t('end_to_end_encryption', 'Limit app usage to groups.')"
			:disabled="loading"
			:multiple="true"
			:searchable="true"
			:tag-width="60"
			track-by="id"
			label="displayname"
			:loading="loadingGroups"
			:show-no-options="false"
			:close-on-select="false"
			@search-change="searchGroup" />

		<Button type="primary"
			:loading="loading"
			@click="saveChanges">
			{{ t('end_to_end_encryption', 'Save') }}
		</Button>
	</SettingsSection>
</template>

<script>
import axios from '@nextcloud/axios'
import Multiselect from '@nextcloud/vue/dist/Components/Multiselect.js'
import SettingsSection from '@nextcloud/vue/dist/Components/SettingsSection.js'
import Button from '@nextcloud/vue/dist/Components/Button.js'
import { loadState } from '@nextcloud/initial-state'
import { showSuccess } from '@nextcloud/dialogs'
import { generateOcsUrl } from '@nextcloud/router'
import { getLoggerBuilder } from '@nextcloud/logger'
import debounce from 'debounce'

const logger = getLoggerBuilder()
	.setApp('end_to_end_encryption')
	.detectUser()
	.build()

export default {
	name: 'AdminSection',
	components: {
		Multiselect,
		SettingsSection,
		Button,
	},
	data() {
		return {
			loading: false,
			loadingGroups: true,
			groups: loadState('end_to_end_encryption', 'allowed_groups'),
			allowedGroups: [],
		}
	},
	methods: {
		searchGroup: debounce(async function(query) {
			this.loadingGroups = true
			try {
				const response = await axios.get(generateOcsUrl('cloud/groups/details'), {
					search: query,
					limit: 20,
					offset: 0,
				})
				this.groups = response.data.ocs.data.groups.sort(function(a, b) {
					return a.displayname.localeCompare(b.displayname)
				})
			} catch (err) {
				logger.error('Could not fetch groups', err)
			} finally {
				this.loadingGroups = false
			}
		}, 500),
		saveChanges() {
			this.loading = true
			this.loadingGroups = true
			const groups = this.allowedGroups.map(group => {
				return group.id
			})
			OCP.AppConfig.setValue('end_to_end_encryption', 'allowed_groups', JSON.stringify(groups), {
				success: function() {
					this.loading = false
					this.loadingGroups = false
					showSuccess(t('end_to_end_encryption', 'Saved groups'))
				}.bind(this),
			})
		},
	},
	mounted() {
		this.allowedGroups = loadState('end_to_end_encryption', 'allowed_groups').sort(function(a, b) {
			return a.displayname.localeCompare(b.displayname)
		})
		this.searchGroup()
	},
}
</script>

<style lang="scss" scopped>
h3 {
	margin-top: 0;
	font-size: 18px;
}

.button-vue {
	margin-top: 1rem;
}

.allowed-groups {
	width: 300px;
}
</style>
