/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { INode } from '@nextcloud/files'

import { registerSidebarSection } from '@nextcloud/sharing/ui'
import { defineAsyncComponent, defineCustomElement } from 'vue'

/**
 * Register the user-, and filedrop section in the sharing sidebar for encrypted files.
 */
export function registerSharingSidebarSection() {
	const id = 'oca__end_to_end_encryption__sharing-sections'
	const FilesSharingSidebarSections = defineCustomElement(
		defineAsyncComponent(() => import('../views/FilesSharingSidebarSections.vue')),
		{ shadowRoot: false },
	)
	window.customElements.define(id, FilesSharingSidebarSections)

	registerSidebarSection({
		id: 'end_to_end_encryption',
		order: 50,
		enabled(node: INode) {
			return node.attributes['e2ee-is-encrypted'] === 1
		},
		element: id,
	})
}
