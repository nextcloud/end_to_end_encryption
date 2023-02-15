<!--
  - SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
	<NcSettingsSection :title="t('end_to_end_encryption', 'End-to-end encryption')"
		:description="encryptionState">
		<NcButton :disabled="!hasKey" type="warning" @click="startResetProcess()">
			{{ t('end_to_end_encryption', 'Reset end-to-end encryption') }}
		</NcButton>

		<div v-if="shouldDisplayWarning && hasKey" class="notecard warning" role="alert">
			<p><strong>{{ t('end_to_end_encryption', 'Please read carefully before resetting your end-to-end encryption keys') }}</strong></p>
			<ul>
				<li>{{ t('end_to_end_encryption', 'Once your end-to-end encryption keys are reset, all files stored in your encrypted folder will be inaccessible.') }}</li>
				<li>{{ t('end_to_end_encryption', 'You should only reset your end-to-end encryption keys if you lost your secure key words (mnemonic).') }}</li>
				<li>{{ t('end_to_end_encryption', 'Check on all connected devices if you can retrieve your mnemonic.') }}</li>
				<li>{{ t('end_to_end_encryption', 'Any still connected device might cause problems after deleting the keys, so it is better to disconnect and reconnect the devices again.') }}</li>
			</ul>

			<NcCheckboxRadioSwitch :checked.sync="deleteEncryptedFiles" type="switch" class="margin-bottom">
				{{ t('end_to_end_encryption', 'Delete existing encrypted files') }}
			</NcCheckboxRadioSwitch>

			<NcButton type="error" @click="showModal">
				{{ t('end_to_end_encryption', "Confirm and reset end-to-end encryption") }}
			</NcButton>

			<NcModal v-if="modal"
				size="small"
				class="modal"
				@close="closeModal">
				<div class="modal-container">
					<p>
						<strong>
							{{ t('end_to_end_encryption', 'This is the final warning: Do you really want to reset your keys?') }}
						</strong>
					</p>
					<div class="button-row">
						<NcButton type="tertiary" @click="closeModal">
							{{ t('end_to_end_encryption', "Cancel") }}
						</NcButton>
						<NcButton type="error" @click="resetEncryption">
							{{ t('end_to_end_encryption', "Confirm") }}
						</NcButton>
					</div>
				</div>
			</NcModal>
		</div>
	</NcSettingsSection>
</template>

<script>
import axios from '@nextcloud/axios'
import NcSettingsSection from '@nextcloud/vue/dist/Components/NcSettingsSection.js'
import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcModal from '@nextcloud/vue/dist/Components/NcModal.js'
import { loadState } from '@nextcloud/initial-state'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { generateOcsUrl } from '@nextcloud/router'

import logger from '../services/logger.js'

export default {
	name: 'SecuritySection',
	components: {
		NcSettingsSection,
		NcButton,
		NcModal,
		NcCheckboxRadioSwitch,
	},
	data() {
		return {
			hasKey: loadState('end_to_end_encryption', 'hasKey'),
			shouldDisplayWarning: false,
			modal: false,
			deleteEncryptedFiles: false,
		}
	},
	computed: {
		encryptionState() {
			if (this.hasKey) {
				return t(
					'end_to_end_encryption',
					'End-to-end encryption is currently enabled and correctly setup.'
				)
			} else {
				return t(
					'end_to_end_encryption',
					'End-to-end encryption is currently disabled. You can set it up with the {productName} clients.',
					{
						productName: OCA.Theming
							? OCA.Theming.name
							: 'Nextcloud',
					}
				)
			}
		},
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
		async deletePrivateKey() {
			const { data } = await axios.delete(
				generateOcsUrl('/apps/end_to_end_encryption/api/v1/private-key')
			)

			return this.handleResponse({
				status: data.ocs?.meta?.status,
				error: null,
			})
		},
		async deletePublicKey() {
			const { data } = await axios.delete(
				generateOcsUrl('/apps/end_to_end_encryption/api/v1/public-key')
			)

			return this.handleResponse({
				status: data.ocs?.meta?.status,
				error: null,
			})
		},
		async deleteFiles() {
			if (this.deleteEncryptedFiles) {
				const { data } = await axios.delete(
					generateOcsUrl(
						'/apps/end_to_end_encryption/api/v1/encrypted-files'
					)
				)

				return this.handleResponse({
					status: data.ocs?.meta?.status,
					error: null,
				})
			}
			return true
		},
		async resetEncryption() {
			try {
				let success = true
				success = success && (await this.deletePrivateKey())
				success = success && (await this.deletePublicKey())
				success = success && (await this.deleteFiles())

				if (success) {
					showSuccess(
						t(
							'end_to_end_encryption',
							'End-to-end encryption keys reset'
						)
					)
				}
			} catch (e) {
				this.handleResponse({
					errorMessage: t(
						'end_to_end_encryption',
						'Unable to reset end-to-end encryption'
					),
					error: e,
				})
			} finally {
				this.closeModal()
				this.shouldDisplayWarning = false
				this.hasKey = false
			}
		},
		async handleResponse({ status, errorMessage, error }) {
			if (status !== 'ok') {
				showError(errorMessage)
				logger.error(errorMessage, { error })
				return false
			}
			return true
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

.modal-container {
	padding: 16px;
	button {
		margin-top: 16px;
		margin-left: 8px;
	}
}

.button-row {
	display: flex;
	justify-content: end;
}
</style>
