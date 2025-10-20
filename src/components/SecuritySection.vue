<!--
  - SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
	<NcSettingsSection
		:name="t('end_to_end_encryption', 'End-to-end encryption')"
		:description="encryptionState">
		<NcButton
			v-if="!shouldDisplayE2EEInBrowserWarning && userConfig['e2eeInBrowserEnabled'] === false"
			class="margin-bottom"
			:disabled="!hasKey"
			variant="secondary"
			@click="shouldDisplayE2EEInBrowserWarning = true">
			{{ t('end_to_end_encryption', 'Enable E2EE navigation in browser') }}
		</NcButton>
		<NcNoteCard
			v-else
			class="notecard"
			type="warning"
			:show-alert="true"
			:heading="t('end_to_end_encryption', 'Enabling E2EE in the browser can weaken security')">
			<NcButton
				v-if="userConfig['e2eeInBrowserEnabled'] === false"
				class="close-button"
				:aria-label="t('end_to_end_encryption', 'Close')"
				variant="tertiary-no-background"
				@click="shouldDisplayE2EEInBrowserWarning = false">
				<template #icon>
					<IconClose :size="20" />
				</template>
			</NcButton>

			{{ t('end_to_end_encryption', 'The server could serve malicious source code to extract the secret that protects your files.') }}

			<NcCheckboxRadioSwitch
				:disabled="!hasKey"
				data-cy-e2ee-settings-setting="e2ee_in_browser_enabled"
				:model-value="userConfig.e2eeInBrowserEnabled"
				class="margin-bottom"
				type="switch"
				@update:model-value="value => setConfig('e2eeInBrowserEnabled', value)">
				{{ t('end_to_end_encryption', 'Enable E2EE navigation in browser') }}
			</NcCheckboxRadioSwitch>
		</NcNoteCard>

		<NcButton
			v-if="!shouldDisplayWarning"
			:disabled="!hasKey"
			:variant="(hasKey && !shouldDisplayWarning) ? 'error' : 'secondary'"
			@click="startResetProcess()">
			{{ t('end_to_end_encryption', 'Reset end-to-end encryption') }}
		</NcButton>
		<NcNoteCard
			v-else
			class="notecard"
			type="warning"
			:show-alert="true"
			:heading="t('end_to_end_encryption', 'Please read carefully before resetting your end-to-end encryption keys')">
			<NcButton
				class="close-button"
				:aria-label="t('end_to_end_encryption', 'Close')"
				variant="tertiary-no-background"
				@click="shouldDisplayWarning = false">
				<template #icon>
					<IconClose :size="20" />
				</template>
			</NcButton>

			<ul>
				<li>{{ t('end_to_end_encryption', 'Once your end-to-end encryption keys are reset, all files stored in your encrypted folder will be inaccessible.') }}</li>
				<li>{{ t('end_to_end_encryption', 'You should only reset your end-to-end encryption keys if you lost your secure key words (mnemonic).') }}</li>
				<li>{{ t('end_to_end_encryption', 'Check on all connected devices if you can retrieve your mnemonic.') }}</li>
				<li>{{ t('end_to_end_encryption', 'Any still connected device might cause problems after deleting the keys, so it is better to disconnect and reconnect the devices again.') }}</li>
			</ul>

			<NcCheckboxRadioSwitch v-model="deleteEncryptedFiles" type="switch" class="margin-bottom">
				{{ t('end_to_end_encryption', 'Delete existing encrypted files') }}
			</NcCheckboxRadioSwitch>

			<NcButton variant="error" @click="showDialog">
				{{ t('end_to_end_encryption', "Confirm and reset end-to-end encryption") }}
			</NcButton>
		</NcNoteCard>
	</NcSettingsSection>
</template>

<script lang="ts">
import axios from '@nextcloud/axios'
import { DialogBuilder, showError, showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'
import { defineComponent } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcSettingsSection from '@nextcloud/vue/components/NcSettingsSection'
import IconClose from 'vue-material-design-icons/Close.vue'
import logger from '../services/logger.ts'

export default defineComponent({
	name: 'SecuritySection',
	components: {
		NcSettingsSection,
		NcButton,
		NcCheckboxRadioSwitch,
		NcNoteCard,
		IconClose,
	},

	setup() {
		return {
			t,
		}
	},

	data() {
		return {
			hasKey: loadState('end_to_end_encryption', 'hasKey'),
			shouldDisplayWarning: false,
			deleteEncryptedFiles: false,
			shouldDisplayE2EEInBrowserWarning: false,
			userConfig: loadState('end_to_end_encryption', 'userConfig', { e2eeInBrowserEnabled: false }),
		}
	},

	computed: {
		confirmationDialog() {
			const builder = new DialogBuilder()
			return builder
				.setName(t('end_to_end_encryption', 'Confirm resetting keys'))
				.setText(t('end_to_end_encryption', 'This is the final warning: Do you really want to reset your keys?'))
				.addButton({
					label: t('end_to_end_encryption', 'Cancel'),
					type: 'tertiary',
					callback: () => {
						this.deleteEncryptedFiles = false
						this.shouldDisplayWarning = false
					},
				})
				.addButton({
					label: t('end_to_end_encryption', 'Reset keys'),
					type: 'error',
					callback: this.resetEncryption.bind(this),
				})
				.build()
		},

		encryptionState() {
			if (this.hasKey) {
				return t(
					'end_to_end_encryption',
					'End-to-end encryption is currently enabled and correctly setup.',
				)
			} else {
				return t(
					'end_to_end_encryption',
					'End-to-end encryption is currently disabled. You can set it up with the {productName} clients.',
					{
						productName: OCA.Theming
							? OCA.Theming.name
							: 'Nextcloud',
					},
				)
			}
		},
	},

	methods: {
		showDialog() {
			this.confirmationDialog
				.show()
		},

		startResetProcess() {
			this.shouldDisplayWarning = true
		},

		async deletePrivateKey() {
			const { data } = await axios.delete(generateOcsUrl('/apps/end_to_end_encryption/api/v1/private-key'))

			return this.handleResponse({
				status: data.ocs?.meta?.status,
				error: null,
			})
		},

		async deletePublicKey() {
			const { data } = await axios.delete(generateOcsUrl('/apps/end_to_end_encryption/api/v1/public-key'))

			return this.handleResponse({
				status: data.ocs?.meta?.status,
				error: null,
			})
		},

		async deleteFiles() {
			if (this.deleteEncryptedFiles) {
				const { data } = await axios.delete(generateOcsUrl('/apps/end_to_end_encryption/api/v1/encrypted-files'))

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
					showSuccess(t(
						'end_to_end_encryption',
						'End-to-end encryption keys reset',
					))
				}
			} catch (e) {
				this.handleResponse({
					errorMessage: t(
						'end_to_end_encryption',
						'Unable to reset end-to-end encryption',
					),
					error: e,
				})
			} finally {
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

		async setConfig(key: string, value: string) {
			await axios.put(generateUrl('apps/end_to_end_encryption/api/v1/config/{key}', { key }), {
				value: (typeof value === 'string') ? value : JSON.stringify(value),
			})
			this.userConfig[key] = value
		},
	},
})
</script>

<style lang="scss" scoped>
.notecard {
	position: relative;

	.close-button {
		position: absolute;
		top: 0;
		right: 0;
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
