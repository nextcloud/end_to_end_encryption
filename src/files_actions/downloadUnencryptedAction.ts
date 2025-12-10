/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { INode } from '@nextcloud/files'

import ArrowDownSvg from '@mdi/svg/svg/arrow-down.svg?raw'
import { DefaultType, FileAction, FileType } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { isDownloadable } from '../services/permissions.ts'

/**
 * Trigger downloading of given file (only the first node is downloaded).
 *
 * @param file - File to download
 */
async function downloadNodes(file: INode) {
	// Decryption happens in the proxy.
	const response = await fetch(file.encodedSource)
	const decryptedFileContent = await response.arrayBuffer()
	const blob = new Blob([decryptedFileContent], { type: file.mime })

	const link = document.createElement('a')
	link.href = window.URL.createObjectURL(blob)
	link.download = file.displayname
	link.click()
}

export default new FileAction({
	id: 'download_unencrypted',
	default: DefaultType.DEFAULT,

	displayName: () => t('files', 'Download unencrypted'),
	iconSvgInline: () => ArrowDownSvg,

	enabled(nodes: INode[]) {
		if (nodes.length !== 1) {
			return false
		}

		if (nodes.some((node) => node.attributes['e2ee-is-encrypted'] !== 1)) {
			return false
		}

		// We can only download dav resources
		if (nodes.some((node) => !node.isDavResource)) {
			return false
		}

		// We can only download files
		if (nodes.some((node) => node.type !== FileType.File)) {
			return false
		}

		return nodes.every(isDownloadable)
	},

	async exec(node: INode) {
		await downloadNodes(node)
		return null
	},

	order: 30,
})
