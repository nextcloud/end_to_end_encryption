/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createAppConfig } from '@nextcloud/vite-config'
import { join } from 'path'

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
		build: {
			rollupOptions: {
				// TODO: Remove when merged https://github.com/nextcloud/server/pull/56941
				preserveEntrySignatures: 'strict',
			},
		},
	},
})
