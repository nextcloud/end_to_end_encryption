<!--
  - SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->
<template>
	<NcContent app-name="end_to_end_encryption">
		<NcAppContent
			@drop.prevent="handleDrop"
			@dragover.prevent="handleDragOver"
			@dragleave="highlightDropZone = false">
			<div
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
							@change="filesChange($event.target?.files)">
					</label>
				</div>

				<ul class="uploader-form__file-list">
					<li
						v-for="({ file, step, error }, index) in uploadedFiles"
						:key="index"
						class="uploader-form__file-list__item">
						<IconAlertCircle v-if="error" :size="20" />
						<IconCheck v-else-if="step === UploadStep.DONE" :size="20" />
						<NcLoadingIcon v-else />
						<b>{{ file.name }}</b>
					</li>
				</ul>
			</div>
		</NcAppContent>
	</NcContent>
</template>

<script>
import { showError } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { translate } from '@nextcloud/l10n'
import { v4 as uuidv4 } from 'uuid'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcContent from '@nextcloud/vue/components/NcContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import IconAlertCircle from 'vue-material-design-icons/AlertCircle.vue'
import IconCheck from 'vue-material-design-icons/Check.vue'
import { encryptFile } from '../services/crypto.js'
import { getFileDropEntry, uploadFileDrop } from '../services/filedrop.js'
import logger from '../services/logger.ts'
import { uploadFile } from '../services/uploadFile.js'

/**
 * @readonly
 * @enum {string}
 */
const UploadStep = {
	NONE: 'none',
	ENCRYPTING: 'encrypting',
	UPLOADING: 'uploading',
	UPLOADED: 'uploaded',
	UPLOADING_METADATA: 'uploading_metadata',
	DONE: 'done',
}

/**
 * @typedef {object} UploadProgress
 * @property {File} file
 * @property {UploadStep} step
 * @property {boolean} error
 * @property {Object<string, import('../services/filedrop.js').FileDropPayload>} fileDrop
 */

export default {
	name: 'FileDrop',
	components: {
		NcContent,
		NcAppContent,
		NcLoadingIcon,
		IconCheck,
		IconAlertCircle,
	},

	data() {
		return {
			/** @type {string} */
			shareToken: loadState('end_to_end_encryption', 'token'),
			/** @type {number} */
			folderId: loadState('end_to_end_encryption', 'fileId'),
			/** @type {{[userId: string]: string}} */
			publicKeys: loadState('end_to_end_encryption', 'publicKeys'),
			/** @type {string} */
			fileName: loadState('end_to_end_encryption', 'fileName'),
			/** @type {1|2} */
			encryptionVersion: Number.parseInt(loadState('end_to_end_encryption', 'encryptionVersion')),
			/** @type {{file: File, step: string, error: boolean}[]} */
			uploadedFiles: [],
			loading: false,
			UploadStep,
			highlightDropZone: false,
		}
	},

	methods: {
		/**
		 * @param {DragEvent} event
		 */
		handleDragOver(event) {
			if (!event.dataTransfer?.types.includes('Files')) {
				return
			}

			event.dataTransfer.dropEffect = 'copy'
			this.highlightDropZone = true
		},

		/**
		 * @param {DragEvent} event
		 */
		handleDrop(event) {
			if (!event.dataTransfer?.types.includes('Files')) {
				return
			}

			this.filesChange(event.dataTransfer.files)
			this.highlightDropZone = false
		},

		/**
		 * @param {FileList?} fileList
		 */
		async filesChange(fileList) {
			if (!fileList?.length) {
				return
			}

			if (this.loading) {
				return
			}

			this.loading = true
			/** @type {UploadProgress[]} */
			let progresses = []

			try {
				progresses = await Promise.all(Array
					.from(fileList)
					.map((file) => this.uploadFile(file)))
				logger.debug('[FileDrop] Files uploaded', { progresses })
			} catch (exception) {
				logger.error('[FileDrop] Error while uploading files', { exception })
				showError(this.t('end_to_end_encryption', 'Error while uploading files'))

				for (const progress of progresses) {
					progress.error = true
				}
			}

			try {
				progresses
					.filter(({ error }) => !error)
					.forEach((progress) => { progress.step = UploadStep.UPLOADING_METADATA })

				const fileDrops = progresses
					.filter(({ error }) => !error)
					.reduce((fileDropEntries, { fileDrop }) => ({ ...fileDropEntries, ...fileDrop }), {})

				logger.debug('[FileDrop] FileDrop entries computed', { fileDrops })

				const result = await uploadFileDrop(this.encryptionVersion, this.folderId, fileDrops, this.shareToken)

				progresses
					.filter(({ error }) => !error)
					.forEach((progress) => { progress.error = result[Object.keys(progress.fileDrop)[0]] === undefined })
			} catch (exception) {
				logger.error('[FileDrop] Error while uploading metadata', { exception })
				showError(this.t('end_to_end_encryption', 'Error while uploading metadata'))

				for (const progress of progresses) {
					progress.error = true
				}
			}

			progresses
				.filter(({ error }) => !error)
				.forEach((progress) => { progress.step = UploadStep.DONE })

			this.loading = false
		},

		/**
		 * @param {File} unencryptedFile
		 * @return {Promise<UploadProgress>}
		 */
		async uploadFile(unencryptedFile) {
			/** @type {UploadProgress} */
			const progress = { file: unencryptedFile, step: UploadStep.NONE, error: false, fileDrop: {} }
			this.uploadedFiles.push(progress)

			try {
				progress.step = UploadStep.ENCRYPTING
				const { encryptedFileContent, encryptionInfo } = await encryptFile(unencryptedFile)
				const encryptedFileName = uuidv4().replaceAll('-', '')

				progress.fileDrop[encryptedFileName] = await getFileDropEntry(encryptionInfo, this.publicKeys)
				logger.debug(`[FileDrop] Filedrop entry computed: ${unencryptedFile.name}`, { fileDropEntry: progress.fileDrop[encryptedFileName] })

				progress.step = UploadStep.UPLOADING
				await uploadFile(`/public.php/dav/files/${this.shareToken}`, encryptedFileName, encryptedFileContent, this.shareToken)
				progress.step = UploadStep.UPLOADED
				logger.debug(`[FileDrop] File uploaded: ${unencryptedFile.name}`, { encryptedFileContent, encryptionInfo, encryptedFileName, shareToken: this.shareToken })
			} catch (exception) {
				progress.error = true
				logger.error(`[FileDrop] Fail to upload the file (${progress.step})`, { exception })
			}

			return progress
		},

		t: translate,
	},
}
</script>

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
					margin-right: 8px;
				}

				.loading-icon :deep(svg) {
					animation: rotate var(--animation-duration, 0.8s) linear infinite;
				}
			}
		}
	}
}
</style>
