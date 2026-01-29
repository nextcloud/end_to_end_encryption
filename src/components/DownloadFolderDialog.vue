<!--
	- SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { INode } from '@nextcloud/files'

import { FileType, getUniqueName } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { computed, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import logger from '../services/logger.ts'
import * as metadataStore from '../store/metadata.ts'

const props = defineProps<{
	nodes: INode[]
}>()

const emit = defineEmits<{
	close: []
}>()

const filesTotal = ref(1)
const filesDone = ref<number>()
const filesError = ref<string[]>([])
const isDownloading = computed(() => filesDone.value !== undefined && filesDone.value < filesTotal.value)

/**
 * Start downloading the selected nodes
 */
async function startDownload() {
	const target = await getTargetFolder()
	if (!target) {
		logger.debug('No target folder selected for download')
		return emit('close')
	}

	filesDone.value = 0
	filesError.value = []
	filesTotal.value = props.nodes.length
	for (const node of props.nodes) {
		try {
			if (node.type === FileType.Folder) {
				await downloadFolder(node.displayname, node.encodedSource, target)
			} else {
				await downloadFile(node.displayname, node.encodedSource, target)
			}
		} catch (error) {
			logger.error('Error downloading node', { error })
		}
	}

	// only close the dialog if there were no errors
	if (filesError.value.length === 0) {
		emit('close')
	}
}

/**
 * Download a single file
 *
 * @param name - The name of the file to download
 * @param path - The path of the file to download
 * @param target - The target directory handle
 */
async function downloadFile(name: string, path: string, target: FileSystemDirectoryHandle) {
	try {
		logger.debug('Downloading encrypted file', { name, path })
		const content = await Array.fromAsync(target.keys())
		const filename = getUniqueName(name, content)

		// The response will be decrypted as usual by the proxy.
		const response = await window.fetch(path)
		const file = await target.getFileHandle(filename, { create: true })
		const stream = await file.createWritable()
		await stream.write(await response.arrayBuffer())
		stream.close()

		await new Promise((r) => window.setTimeout(r, 3000))
	} catch (error) {
		logger.error('Error downloading file', { error, name, path })
		filesError.value.push(name)
	} finally {
		filesDone.value!++
	}
}

/**
 * Download a folder recursively
 *
 * @param name - The name of the folder to download
 * @param path - The path of the folder to download
 * @param target - The target directory handle
 */
async function downloadFolder(name: string, path: string, target: FileSystemDirectoryHandle) {
	logger.debug('Downloading encrypted folder', { name, path })
	const content = await Array.fromAsync(target.keys())
	const folderName = getUniqueName(name, content)
	const folder = await target.getDirectoryHandle(folderName, { create: true })

	const metadata = await metadataStore.getMetadata(path)
	filesTotal.value += metadata.metadata.listContents().length

	for (const [uuid, filename] of metadata.metadata.getFiles()) {
		await downloadFile(filename, path + '/' + uuid, folder)
	}
	for (const [uuid, foldername] of metadata.metadata.getFolders()) {
		await downloadFolder(foldername, path + '/' + uuid, folder)
	}
	filesDone.value!++
}

/**
 * Show the directory picker to select the target folder
 */
async function getTargetFolder() {
	try {
		return await window.showDirectoryPicker({ mode: 'readwrite', startIn: 'downloads' })
	} catch {
		// User cancelled the directory picker
	}
}
</script>

<template>
	<NcDialog
		:name="t('end_to_end_encryption', 'Download and decrypt')"
		:noClose="isDownloading"
		@update:open="$event || $emit('close')">
		<p v-if="!isDownloading && filesError.length === 0" :class="$style.downloadFolderDialog__hint">
			{{ t('end_to_end_encryption', 'Download and decrypt all selected files.') }}
		</p>

		<div v-else>
			<span v-if="isDownloading">{{ t('end_to_end_encryption', 'Downloading …') }}</span>
			<NcProgressBar
				:color="filesError.length ? 'var(--color-element-error)' : undefined"
				:value="filesDone! * 100 / filesTotal" />
		</div>

		<template v-if="filesError.length > 0">
			<h3 id="download-folder-dialog--errors" :class="$style.downloadFolderDialog__errorHeading">
				{{ t('end_to_end_encryption', 'Failed downloads') }}
			</h3>
			<ul
				:class="$style.downloadFolderDialog__errorList"
				aria-labelledby="download-folder-dialog--errors">
				<li v-for="file in filesError" :key="file">
					{{ file }}
				</li>
			</ul>
		</template>

		<template #actions>
			<NcButton
				:disabled="isDownloading"
				variant="primary"
				@click="startDownload">
				{{ t('end_to_end_encryption', 'Download') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style module>
.downloadFolderDialog__hint {
	color: var(--color-text-maxcontrast);
}

.downloadFolderDialog__errorHeading {
	margin-block: 1rem 0.5rem;
	font-size: var(--default-font-size);
}

.downloadFolderDialog__errorList {
	list-style: disc !important;
	padding-inline-start: var(--default-font-size);
}
</style>
