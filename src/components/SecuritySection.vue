<!--
  - SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
	<SettingsSection :title="t('end_to_end_encryption', 'End to End Encryption')">
		<Button :disabled="!hasKey" type="warning" @click="startResetProcess()">
			{{ t('end_to_end_encryption', 'Reset End to End Encryption') }}
		</Button>

		<div v-if="shouldDisplayWarning && hasKey" class="notecard warning" role="alert">
			<p>{{ t('end_to_end_encryption', 'Please read carefully before resetting your end-to-end encryption keys') }}</p>
			<ul>
				<li>{{ t('end_to_end_encryption', 'Once your end to end encryption are reset, all files stored in your encrypted folder will be inaccessible') }}</li>
				<li>{{ t('end_to_end_encryption', 'You should only reset your end to end encryption when you have lost your secure key words') }}</li>
				<li>{{ t('end_to_end_encryption', 'Check on all connected devices, if you can retrieve your mnemonic') }}</li>
				<li>{{ t('end_to_end_encryption', 'After deleting the keys any still existing device might cause problems, therefore please re-setup the accounts.') }}</li>
			</ul>

			<p class="margin-bottom">
				{{ t('end_to_end_encryption', 'This is the final warning: Do you really want to reset your keys?') }}
			</p>
			<Button type="error"
				@click="showModal()">
				{{ t('end_to_end_encryption', "Confirm") }}
			</Button>

			<modal v-if="modal" @close="closeModal" size="small">
				<p>{{ t('end_to_end_encryption', 'Are you really sure?') }}
				<Button type="error"
					@click="resetEncryption()">
					{{ t('end_to_end_encryption', "Confirm") }}
				</Button>
			</modal>
		</div>
	</SettingsSection>
</template>

<script>
import axios from '@nextcloud/axios'
import SettingsSection from '@nextcloud/vue/dist/Components/SettingsSection'
import Button from '@nextcloud/vue/dist/Components/Button'
import Modal from '@nextcloud/vue/dist/Components/Modal'
import { loadState } from '@nextcloud/initial-state'
import { showError } from '@nextcloud/dialogs'
import { getLoggerBuilder } from '@nextcloud/logger'
import { generateOcsUrl } from '@nextcloud/router'

 const logger = getLoggerBuilder()
	.setApp('settings')
	.detectUser()
	.build()

export default {
	name: 'SecuritySection',
	components: {
		SettingsSection,
		Button,
		Modal,
	},
	data() {
		return {
			hasKey: loadState('end_to_end_encryption', 'hasKey'),
			shouldDisplayWarning: false,
			modal: false,
		}
	},
	methods: {
		startResetProcess() {
			this.shouldDisplayWarning = true
		},
		showModal() {
			this.modal = true
		},
		closeModal() {
			this.modal = false
		},
		async resetEncryption() {
			try {
				let { data } = await axios.delete(generateOcsUrl('/apps/end_to_end_encryption/api/v1/private-key'))

				this.handleResponse({
					status: data.ocs?.meta?.status,
				})

				data = await axios.delete(generateOcsUrl('/apps/end_to_end_encryption/api/v1/public-key')).data
				this.handleResponse({
					status: data.ocs?.meta?.status,
				})
			} catch (e) {
				this.handleResponse({
					errorMessage: t('end_to_end_encryption', 'Unable to reset end to end encryption'),
					error: e,
				})
			}
		},
		async handleResponse({ status, errorMessage, error }) {
			if (status !== 'ok') {
				showError(errorMessage)
				logger.error(errorMessage, { error })
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.notecard {
	color: var(--color-text-light) !important;
	background-color: var(--note-background) !important;
	border: 1px solid var(--color-border);
	border-left: 4px solid var(--note-theme);
	border-radius: var(--border-radius);
	box-shadow: rgba(43, 42, 51, 0.05) 0 1px 2px 0;
	margin: 1rem 0;
	padding: 1rem !important;
	&.warning {
		--note-background: rgba(var(--color-warning-rgb), 0.2);
		--note-theme: var(--color-warning);
	}
}

li {
	list-style-type: initial;
	margin-left: 1rem;
	padding: 0.25rem 0;
}
.margin-bottom {
	margin-bottom: 0.75rem;
}
</style>
