<!--
  - SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { mdiAlertCircleOutline, mdiCheck } from '@mdi/js'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { getSharingToken } from '@nextcloud/sharing/public'
import { X509Certificate } from '@peculiar/x509'
import { onMounted, reactive, ref } from 'vue'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcContent from '@nextcloud/vue/components/NcContent'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import { uploadFileDrop } from '../services/fileDropUtils.ts'
import logger from '../services/logger.ts'

const folderId = loadState<string>('end_to_end_encryption', 'fileId')
const fileName = loadState<string>('end_to_end_encryption', 'fileName')
const metadataVersion = loadState<number>('end_to_end_encryption', 'metadataVersion')
const publicKeys: { userId: string, key: CryptoKey }[] = []

const uploadedFiles = ref<{ name: string, status: 'uploading' | 'done' | 'error' }[]>([])
const highlightDropZone = ref(false)
const loading = ref(true)

// initialize the public keys
onMounted(async () => {
	for (const [userId, pemCert] of Object.entries(loadState<Record<string, string>>('end_to_end_encryption', 'publicKeys'))) {
		const cert = new X509Certificate(pemCert)
		const key = await cert.publicKey.export()
		publicKeys.push({ userId, key })
	}

	loading.value = false
})

/**
 * @param event - The dragover event
 */
function handleDragOver(event: DragEvent) {
	if (!event.dataTransfer?.types.includes('Files')) {
		return
	}

	event.dataTransfer.dropEffect = 'copy'
	highlightDropZone.value = true
}

/**
 * @param event - The drop event
 */
function handleDrop(event: DragEvent) {
	if (!event.dataTransfer?.types.includes('Files')) {
		return
	}

	const files = event.dataTransfer.files
	if (files && files.length > 0) {
		handleUpload(event.dataTransfer.files)
	}
	highlightDropZone.value = false
}

/**
 * Handle the change event of the file input
 *
 * @param event - The change event
 */
async function onFilesInputChanged(event: Event) {
	const input = event.target as HTMLInputElement
	if (input.files && input.files.length > 0) {
		handleUpload(input.files)
		input.value = ''
	}
}

/**
 * @param fileList - The list of files to upload
 */
async function handleUpload(fileList: FileList) {
	if (loading.value) {
		return
	}

	loading.value = true
	const promises: Promise<void>[] = []
	logger.debug('[FileDrop] Starting upload of files')
	for (const file of Array.from(fileList)) {
		const entry = reactive({ name: file.name, status: 'uploading' as 'uploading' | 'done' | 'error' })
		uploadedFiles.value.push(entry)
		promises.push(uploadFileDrop(file, folderId, getSharingToken()!, publicKeys)
			.then(() => {
				entry.status = 'done'
			})
			.catch((error) => {
				entry.status = 'error'
				throw error
			}))
	}

	logger.debug('[FileDrop] Waiting for all files to be encrypted and uploaded')
	try {
		await Promise.all(promises)
		logger.debug('[FileDrop] All files encrypted and uploaded')
	} catch (exception) {
		logger.error('[FileDrop] Error while encrypting and uploading files', { exception })
	}
	loading.value = false
}
</script>

<template>
	<NcContent appName="end_to_end_encryption">
		<NcAppContent
			@drop.prevent="handleDrop"
			@dragover.prevent="handleDragOver"
			@dragleave="highlightDropZone = false">
			<NcNoteCard
				v-if="metadataVersion < 2"
				type="error">
				{{ t('end_to_end_encryption', 'This share is using a legacy encryption method. Please ask the share owner to update the encryption metadata.') }}
			</NcNoteCard>

			<div
				v-else
				class="uploader-form"
				:class="{ highlight: highlightDropZone }">
				<div class="uploader-form__label">
					<div class="uploader-form__icon icon-folder" />
					{{ t("end_to_end_encryption", "Upload encrypted files to {fileName}", { fileName }) }}

					<label
						class="uploader-form__input button primary"
						:class="{ loading }">
						{{ t('end_to_end_encryption', 'Select or drop files') }}
						<input
							type="file"
							multiple
							:disabled="loading"
							@change="onFilesInputChanged">
					</label>
				</div>

				<ul aria-live="polite" :aria-label="t('end_to_end_encryption', 'Uploaded files')" class="uploader-form__file-list">
					<li
						v-for="({ name, status }, index) in uploadedFiles"
						:key="index"
						class="uploader-form__file-list__item">
						<NcIconSvgWrapper
							v-if="status === 'error'"
							:path="mdiAlertCircleOutline"
							:name="t('end_to_end_encryption', 'Upload failed')" />
						<NcIconSvgWrapper
							v-else-if="status === 'done'"
							:path="mdiCheck"
							:name="t('end_to_end_encryption', 'Upload successful')" />
						<NcLoadingIcon
							v-else
							:size="20"
							:name="t('end_to_end_encryption', 'Uploading…')" />
						<b>{{ name }}</b>
					</li>
				</ul>
			</div>
		</NcAppContent>
	</NcContent>
</template>

<style scoped lang="scss">
#app-content-vue {
	display: flex;
	align-items: center;
	justify-content: center;

	.uploader-form {
		width: 700px;
		height: 700px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		&.highlight {
			border: 4px solid var(--color-primary);
			border-radius: var(--border-radius-large);
			background: var(--color-primary-element-light-hover);
		}

		&__label {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-weight: bold;
			font-size: 20px;
			text-align: center;
			position: sticky;
		}

		&__icon {
			margin-bottom: 12px;
			height: 48px;
			width: 48px;
			background-size: 48px;
		}

		&__input {
			margin-top: 20px;

			input {
				display: none;
			}
		}

		&__file-list {
			margin-top: 12px;
			height: 100%;
			overflow: scroll;
			padding: 0 32px;

			&__item {
				display: flex;
				align-items: center;

				.material-design-icon {
					margin-inline-end: 8px;
				}

				.loading-icon :deep(svg) {
					animation: rotate var(--animation-duration, 0.8s) linear infinite;
				}
			}
		}
	}
}
</style>
