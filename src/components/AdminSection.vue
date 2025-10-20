<!--
  - SPDX-FileCopyrightText: 2019 Joas Schilling <coding@schilljs.com>
  - SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

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

<script>
import axios from '@nextcloud/axios'
import { showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { getLoggerBuilder } from '@nextcloud/logger'
import { generateOcsUrl } from '@nextcloud/router'
import debounce from 'debounce'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import NcSettingsSection from '@nextcloud/vue/components/NcSettingsSection'

const logger = getLoggerBuilder()
	.setApp('end_to_end_encryption')
	.detectUser()
	.build()

export default {
	name: 'AdminSection',
	components: {
		NcButton,
		NcSelect,
		NcSettingsSection,
	},

	setup() {
		return {
			t,
		}
	},

	data() {
		return {
			loading: false,
			loadingGroups: true,
			allowedGroups: loadState('end_to_end_encryption', 'allowed_groups').map((group) => {
				return {
					id: group,
					displayname: group,
				}
			}).sort(function(a, b) {
				return a.displayname.localeCompare(b.displayname)
			}),

			groups: [],
		}
	},

	mounted() {
		this.groups = this.allowedGroups
		this.searchGroup()
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
			const groups = this.allowedGroups.map((group) => {
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
}
</script>

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
