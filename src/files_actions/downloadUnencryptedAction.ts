/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IFileAction, INode } from '@nextcloud/files'

import ArrowDownSvg from '@mdi/svg/svg/arrow-down.svg?raw'
import { DefaultType, FileType } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { spawnDialog } from '@nextcloud/vue/functions/dialog'
import { defineAsyncComponent } from 'vue'
import { isDownloadable } from '../services/permissions.ts'

const DownloadFolderDialog = defineAsyncComponent(() => import('../components/DownloadFolderDialog.vue'))

/**
 * Trigger downloading of given file (only the first node is downloaded).
 *
 * @param file - File to download
 */
async function downloadNode(file: INode) {
	// Decryption happens in the proxy.
	const response = await fetch(file.encodedSource)
	const decryptedFileContent = await response.arrayBuffer()
	const blob = new Blob([decryptedFileContent], { type: file.mime })

	const link = document.createElement('a')
	link.href = window.URL.createObjectURL(blob)
	link.download = file.displayname
	link.click()
}

export default {
	id: 'download_unencrypted',
	default: DefaultType.DEFAULT,

	displayName: () => t('files', 'Download unencrypted'),
	iconSvgInline: () => ArrowDownSvg,

	enabled({ nodes }) {
		if (nodes.length === 0) {
			return false
		}

		if (window.showDirectoryPicker === undefined) {
			// we need File System API for downloading folders
			if (nodes.length !== 1) {
				return false
			}
			if (nodes.some((node) => node.type === FileType.Folder)) {
				return false
			}
		}

		if (nodes.some((node) => node.attributes['e2ee-is-encrypted'] !== 1)) {
			return false
		}

		// We can only download dav resources
		if (nodes.some((node) => !node.isDavResource)) {
			return false
		}

		return nodes.every(isDownloadable)
	},

	async exec({ nodes }) {
		const node = nodes[0]
		if (node.type === FileType.Folder) {
			await spawnDialog(DownloadFolderDialog, {
				nodes,
			})
		} else {
			await downloadNode(node)
		}
		return null
	},

	async execBatch({ nodes }) {
		await spawnDialog(DownloadFolderDialog, {
			nodes,
		})

		return new Array(nodes.length).fill(null)
	},

	order: 30,
} satisfies IFileAction
