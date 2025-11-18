<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<script setup lang="ts">
import type { OCSResponse } from '@nextcloud/typings/ocs'

import axios from '@nextcloud/axios'
import { getCapabilities } from '@nextcloud/capabilities'
import { DialogBuilder, showError, showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'
import { computed, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcSettingsSection from '@nextcloud/vue/components/NcSettingsSection'
import IconClose from 'vue-material-design-icons/Close.vue'
import logger from '../services/logger.ts'

const supportsE2EEInBrowser = typeof window.crypto !== 'undefined' && typeof window.crypto.subtle !== 'undefined'
const hasKey = ref(loadState('end_to_end_encryption', 'hasKey'))
const shouldDisplayWarning = ref(false)
const deleteEncryptedFiles = ref(false)
const shouldDisplayE2EEInBrowserWarning = ref(false)
const userConfig = ref(loadState('end_to_end_encryption', 'userConfig', { e2eeInBrowserEnabled: false }))

const confirmationDialog = new DialogBuilder()
	.setName(t('end_to_end_encryption', 'Confirm resetting keys'))
	.setText(t('end_to_end_encryption', 'This is the final warning: Do you really want to reset your keys?'))
	.addButton({
		label: t('end_to_end_encryption', 'Cancel'),
		variant: 'tertiary',
		callback: () => {
			deleteEncryptedFiles.value = false
			shouldDisplayWarning.value = false
		},
	})
	.addButton({
		label: t('end_to_end_encryption', 'Reset keys'),
		variant: 'error',
		callback: resetEncryption,
	})
	.build()

const settingsSectionDescription = computed(() => {
	if (hasKey.value) {
		return t(
			'end_to_end_encryption',
			'End-to-end encryption is currently enabled and correctly setup.',
		)
	} else {
		return t(
			'end_to_end_encryption',
			'End-to-end encryption is currently disabled. You can set it up with the {productName} clients.',
			{
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				productName: (getCapabilities() as any).theming?.productName ?? 'Nextcloud',
			},
		)
	}
})

/**
 * Shows the confirmation dialog
 */
async function showDialog() {
	await confirmationDialog.show()
}

/**
 *
 */
function startResetProcess() {
	shouldDisplayWarning.value = true
}

/**
 * Deletes the private key from the server
 */
async function deletePrivateKey() {
	const { data } = await axios.delete<OCSResponse>(generateOcsUrl('/apps/end_to_end_encryption/api/v1/private-key'))

	return handleResponse({
		status: data.ocs?.meta?.status,
		errorMessage: data.ocs?.meta?.message ?? t('end_to_end_encryption', 'Unable to delete private key'),
		error: null,
	})
}

/**
 * Deletes the public key from the server
 */
async function deletePublicKey() {
	const { data } = await axios.delete<OCSResponse>(generateOcsUrl('/apps/end_to_end_encryption/api/v1/public-key'))

	return handleResponse({
		status: data.ocs?.meta?.status,
		errorMessage: data.ocs?.meta?.message ?? t('end_to_end_encryption', 'Unable to delete encrypted files'),
		error: null,
	})
}

/**
 * Delete encrypted files from the server if requested
 */
async function deleteFiles() {
	if (deleteEncryptedFiles.value) {
		const { data } = await axios.delete<OCSResponse>(generateOcsUrl('/apps/end_to_end_encryption/api/v1/encrypted-files'))

		return handleResponse({
			status: data.ocs?.meta?.status,
			errorMessage: data.ocs?.meta?.message ?? t('end_to_end_encryption', 'Unable to delete encrypted files'),
			error: null,
		})
	}
	return true
}

/**
 * Reset the end-to-end encryption keys locally
 */
async function resetEncryption() {
	try {
		let success = true
		success = success && (await deletePrivateKey())
		success = success && (await deletePublicKey())
		success = success && (await deleteFiles())

		if (success) {
			showSuccess(t(
				'end_to_end_encryption',
				'End-to-end encryption keys reset',
			))
		}
	} catch (e) {
		handleResponse({
			errorMessage: t(
				'end_to_end_encryption',
				'Unable to reset end-to-end encryption',
			),
			error: e,
		})
	} finally {
		shouldDisplayWarning.value = false
		hasKey.value = false
	}
}

/**
 * Handles the response from the server
 *
 * @param status The status of the response
 * @param status.status - 'ok' if the request was successful
 * @param status.errorMessage - The error message to show if the request failed
 * @param status.error - The error object
 */
async function handleResponse(status: { status?: 'ok' | 'failure', errorMessage: string, error: unknown }) {
	if (status.status !== 'ok') {
		showError(status.errorMessage)
		logger.error(status.errorMessage, { error: status.error })
		return false
	}
	return true
}

/**
 * Sets a configuration value
 *
 * @param key - The configuration key
 * @param value - The configuration value
 */
async function setConfig(key: string, value: string) {
	await axios.put(generateUrl('apps/end_to_end_encryption/api/v1/config/{key}', { key }), {
		value: (typeof value === 'string') ? value : JSON.stringify(value),
	})
	userConfig.value[key] = value
}
</script>

<template>
	<NcSettingsSection
		:name="t('end_to_end_encryption', 'End-to-end encryption')"
		:description="settingsSectionDescription">
		<NcNoteCard
			v-if="!supportsE2EEInBrowser"
			type="warning"
			:heading="t('end_to_end_encryption', 'End to end encryption not available')"
			:text="t('end_to_end_encryption', 'Either your browser does not support end-to-end encryption or you are using an insecure connection (HTTP). Please use a modern browser and ensure you are using HTTPS.')" />

		<NcButton
			v-if="!shouldDisplayE2EEInBrowserWarning && userConfig['e2eeInBrowserEnabled'] === false"
			class="margin-bottom"
			:disabled="!supportsE2EEInBrowser"
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
				data-cy-e2ee-settings-setting="e2ee_in_browser_enabled"
				:disabled="!supportsE2EEInBrowser"
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

<style lang="scss" scoped>
.notecard {
	position: relative;

	.close-button {
		position: absolute;
		top: 0;
		inset-inline-end: 0;
	}
}

li {
	list-style-type: initial;
	margin-inline-start: 1rem;
	padding: 0.25rem 0;
}

.margin-bottom {
	margin-bottom: 0.75rem;
}

.modal-container {
	padding: 16px;
	button {
		margin-top: 16px;
		margin-inline-start: 8px;
	}
}

.button-row {
	display: flex;
	justify-content: end;
}
</style>
