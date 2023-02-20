
<!--
  - SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->
<template>
	<NcContent app-name="end_to_end_encryption">
		<NcAppContent @drop.native.prevent="handleDrop"
			@dragover.native.prevent="handleDragOver"
			@dragleave.native="highlightDropZone = false">
			<div class="uploader-form"
				:class="{highlight: highlightDropZone}">
				<div class="uploader-form__label">
					<div class="uploader-form__icon icon-folder" />
					{{ t("end_to_end_encryption", "Upload encrypted files to {fileName}", { fileName }) }}

					<label class="uploader-form__input button primary"
						:class="{ loading }">
						{{ t('end_to_end_encryption', 'Select or drop files') }}
						<input type="file"
							multiple="multiple"
							:disabled="loading"
							@change="filesChange($event.target.files)">
					</label>
				</div>

				<ul class="uploader-form__file-list">
					<li v-for="({file, step, error}, index) in uploadedFiles"
						:key="index"
						class="uploader-form__file-list__item">
						<AlertCircle v-if="error" />
						<Check v-else-if="step === UploadStep.DONE" />
						<Loading v-else />
						<b>{{ file.name }}</b>
					</li>
				</ul>
			</div>
		</NcAppContent>
	</NcContent>
</template>

<script>
import Loading from 'vue-material-design-icons/Loading'
import Check from 'vue-material-design-icons/Check'
import AlertCircle from 'vue-material-design-icons/AlertCircle'

import NcContent from '@nextcloud/vue/dist/Components/NcContent.js'
import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent.js'
import { loadState } from '@nextcloud/initial-state'
import { showError } from '@nextcloud/dialogs'
import { translate } from '@nextcloud/l10n'

import logger from '../services/logger.js'
import { EncryptedFile } from '../services/crypto.js'
import { uploadFile } from '../services/uploadFile.js'
import { lock, unlock } from '../services/lock.js'
import FolderMetadata from '../services/metadata.js'

const UploadStep = {
	NONE: 'none',
	ENCRYPTING: 'encrypting',
	UPLOADING: 'uploading',
	UPLOADED: 'uploaded',
	UPLOADING_METADATA: 'uploading_metadata',
	UNLOCKING: 'unlocking',
	DONE: 'done',
}

export default {
	name: 'FileDrop',
	components: {
		NcContent,
		NcAppContent,
		Loading,
		Check,
		AlertCircle,
	},
	data() {
		return {
			/** @type {string} */
			shareToken: loadState('end_to_end_encryption', 'token'),
			/** @type {number} */
			folderId: loadState('end_to_end_encryption', 'fileId'),
			/** @type {string} */
			publicKey: loadState('end_to_end_encryption', 'publicKey'),
			/** @type {string} */
			fileName: loadState('end_to_end_encryption', 'fileName'),
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
			if (!event.dataTransfer.types.includes('Files')) {
				return
			}

			event.dataTransfer.dropEffect = 'copy'
			this.highlightDropZone = true
		},

		/**
		 * @param {DragEvent} event
		 */
		handleDrop(event) {
			if (!event.dataTransfer.types.includes('Files')) {
				return
			}

			this.filesChange(event.dataTransfer.files)
			this.highlightDropZone = false
		},

		/**
		 * @param {FileList} fileList
		 */
		async filesChange(fileList) {
			if (!fileList.length) {
				return
			}

			if (this.loading) {
				return
			}

			this.error = ''
			this.loading = true
			let progresses = []
			let folderMetadata = null
			let lockToken = null

			try {
				logger.debug('Locking the folder', { lockToken: this.lockToken, shareToken: this.shareToken })
				lockToken = await lock(this.folderId, this.shareToken)

			} catch (exception) {
				logger.error('Could not lock the folder', { exception })
				showError('Could not lock the folder')
				this.loading = false
				return
			}

			try {
				logger.debug('Getting the folder metadata', { lockToken, shareToken: this.shareToken })
				folderMetadata = new FolderMetadata(this.folderId)
				await folderMetadata.retrieveMetadata(this.shareToken)

				progresses = await Promise.all(
					Array
						.from(fileList)
						.map((file) => this.uploadFile(file, folderMetadata))
				)
			} catch (exception) {
				logger.error('Error while uploading files', { exception })
				showError('Error while uploading files')
				progresses.forEach(progress => { progress.error = true })
			}

			try {
				if (folderMetadata !== null) {
					logger.debug('Updating the folder metadata', { lockToken, shareToken: this.shareToken })
					progresses
						.filter(({ error }) => !error)
						.forEach(progress => { progress.step = UploadStep.UPLOADING_METADATA })
					await folderMetadata.uploadMetadata(lockToken, this.shareToken)
				}
			} catch (exception) {
				logger.error('Error while uploading metadata', { exception })
				showError('Error while uploading metadata')
				progresses.forEach(progress => { progress.error = true })
			}

			try {
				progresses
					.filter(({ error }) => !error)
					.forEach(progress => { progress.step = UploadStep.UNLOCKING })
				await unlock(this.folderId, lockToken, this.shareToken)
				logger.debug('Unlocking the folder', { lockToken, shareToken: this.shareToken })
				progresses
					.filter(({ error }) => !error)
					.forEach(progress => { progress.step = UploadStep.DONE })
			} catch (exception) {
				logger.error('Error while unlocking the folder', { exception })
				showError('Error while unlocking the folder')
				progresses.forEach(progress => { progress.error = true })
			}

			this.loading = false
		},

		/**
		 * @param {File} unencryptedFile
		 * @param {FolderMetadata} folderMetadata
		 */
		async uploadFile(unencryptedFile, folderMetadata) {
			const progress = { file: unencryptedFile, step: UploadStep.NONE, error: false }
			this.uploadedFiles.push(progress)

			try {
				progress.step = UploadStep.ENCRYPTING
				logger.debug('Encrypting the file', { unencryptedFile, shareToken: this.shareToken })
				const file = new EncryptedFile(unencryptedFile.name, unencryptedFile.type)
				const blob = await unencryptedFile.arrayBuffer()
				const { content, tag } = await file.encrypt(blob)

				progress.step = UploadStep.UPLOADING
				logger.debug('Uploading the file', { unencryptedFile, shareToken: this.shareToken })
				await uploadFile('/public.php/webdav/', file.encryptedFileName, content, this.shareToken)
				progress.step = UploadStep.UPLOADED

				await folderMetadata.addFileDrop(file, tag, this.publicKey)
			} catch (exception) {
				progress.error = true
				logger.error(`Fail to upload the file (${progress.step})`, { exception })
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
					animation: rotate var(--animation-duration, 0.8s) linear
						infinite;
				}
			}
		}
	}
}
</style>
