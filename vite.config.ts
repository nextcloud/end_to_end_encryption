/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createAppConfig } from '@nextcloud/vite-config'
import { join } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// replaced by vite
declare const __dirname: string

export default createAppConfig({
	files: join(__dirname, 'src', 'main-files.ts'),
	filedrop: join(__dirname, 'src', 'main-filedrop.js'),
	'settings-admin': join(__dirname, 'src', 'settings-admin.js'),
	'settings-personal': join(__dirname, 'src', 'settings-user.js'),
}, {
	extractLicenseInformation: {
		includeSourceMaps: true,
	},
	config: {
		plugins: [
			viteStaticCopy({
				targets: [{
					src: join(__dirname, 'src', 'public-share.css'),
					dest: 'css',
				}],
			}),
		],
		build: {
			rollupOptions: {
				// TODO: Remove when merged https://github.com/nextcloud/server/pull/56941
				preserveEntrySignatures: 'strict',
			},
		},
	},
})
