<!--
  - SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { IRawMetadataFileDrop } from '../models/metadata.d.ts'

import { mdiAlertCircleOutline, mdiCheck } from '@mdi/js'
import { showError, showInfo, showWarning } from '@nextcloud/dialogs'
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
import { finalizeFileDrop, getUploadErrorMessage, uploadFileDrop } from '../services/fileDropUtils.ts'
import logger from '../services/logger.ts'

const folderId = loadState<string>('end_to_end_encryption', 'fileId')
const fileName = loadState<string>('end_to_end_encryption', 'fileName')
const metadataVersion = loadState<number>('end_to_end_encryption', 'metadataVersion')
const note = loadState<string>('end_to_end_encryption', 'note', '')
const publicKeys: { userId: string, key: CryptoKey }[] = []

interface IUploadEntry {
	name: string
	status: 'uploading' | 'done' | 'error'
	/** User facing reason why the upload failed */
	error?: string
}

const uploadedFiles = ref<IUploadEntry[]>([])
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

	// clear the list of uploaded files
	uploadedFiles.value = []

	loading.value = true
	logger.debug('[FileDrop] Starting upload of files')
	const uploads = Array.from(fileList).map(async (file) => {
		const entry = reactive<IUploadEntry>({ name: file.name, status: 'uploading' })
		uploadedFiles.value.push(entry)
		try {
			const [encryptedFileName, rawEntry] = await uploadFileDrop(file, folderId, getSharingToken()!, publicKeys)
			entry.status = 'done'
			return { entry, encryptedFileName, rawEntry }
		} catch (error) {
			logger.error(`[FileDrop] Failed to upload file ${file.name}`, { error })
			entry.status = 'error'
			entry.error = getUploadErrorMessage(error)
			return null
		}
	})

	logger.debug('[FileDrop] Waiting for all files to be encrypted and uploaded')
	const uploaded = (await Promise.all(uploads)).filter((upload) => upload !== null)
	if (uploaded.length > 0) {
		await finalizeUploads(uploaded)
	}

	const failed = uploadedFiles.value.filter(({ status }) => status === 'error')
	if (failed.length === uploadedFiles.value.length) {
		// show the reason if all uploads failed for the same one (e.g. a single file)
		const reasons = new Set(failed.map(({ error }) => error))
		showError(reasons.size === 1 ? failed[0]!.error! : t('end_to_end_encryption', 'All files failed to upload.'))
	} else if (failed.length > 0) {
		showWarning(t('end_to_end_encryption', 'Some files failed to upload.'))
	}
	loading.value = false
}

/**
 * Add the metadata entries of the uploaded files to the file drop
 * and mark the entries the server did not accept as failed.
 *
 * @param uploaded - The successfully uploaded files with their metadata entries
 */
async function finalizeUploads(uploaded: { entry: IUploadEntry, encryptedFileName: string, rawEntry: IRawMetadataFileDrop }[]) {
	const entries = Object.fromEntries(uploaded.map(({ encryptedFileName, rawEntry }) => [encryptedFileName, rawEntry]))
	try {
		const result = await finalizeFileDrop(entries, folderId, getSharingToken()!)
		if (result === null) {
			logger.debug('[FileDrop] Server is still processing the request')
			showInfo(t('end_to_end_encryption', 'The upload completed, but the file drop is still being processed on the server.'))
			return
		}

		for (const { entry, encryptedFileName } of uploaded) {
			if (!result.includes(encryptedFileName)) {
				logger.debug(`[FileDrop] File ${entry.name} was rejected by the server`)
				entry.status = 'error'
				entry.error = t('end_to_end_encryption', 'The file was rejected by the server.')
			}
		}
		logger.debug('[FileDrop] All files encrypted and uploaded')
	} catch (error) {
		logger.error('[FileDrop] Failed to add the uploaded files to the file drop', { error })
		for (const { entry } of uploaded) {
			entry.status = 'error'
			entry.error = getUploadErrorMessage(error)
		}
	}
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

					<NcNoteCard
						v-if="note"
						class="uploader-form__note"
						:heading="t('end_to_end_encryption', 'Note from the owner')"
						type="info">
						{{ note }}
					</NcNoteCard>

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
						v-for="({ name, status, error }, index) in uploadedFiles"
						:key="index"
						class="uploader-form__file-list__item"
						:class="{ 'uploader-form__file-list__item--error': status === 'error' }">
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
						<div>
							<b>{{ name }}</b>
							<p v-if="error" class="uploader-form__file-list__error">
								{{ error }}
							</p>
						</div>
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

		&__note {
			font-size: var(--default-font-size);
			font-weight: normal;
			text-align: start;
			white-space: pre-line;
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
				padding-block: 4px;

				.material-design-icon {
					margin-inline-end: 8px;
					flex-shrink: 0;
				}

				.loading-icon :deep(svg) {
					animation: rotate var(--animation-duration, 0.8s) linear infinite;
				}

				&--error {
					color: var(--color-error-text);
				}
			}

			&__error {
				font-size: var(--default-font-size);
				font-weight: normal;
			}
		}
	}
}
</style>
