/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createAppConfig } from '@nextcloud/vite-config'
import { playwright } from '@vitest/browser-playwright'
import { join } from 'path'
import { defineConfig } from 'vitest/config'

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
	config: defineConfig({
		// Setup for vitest unit tests
		test: {
			include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
			browser: {
				provider: playwright(),
				enabled: true,
				headless: true,
				screenshotFailures: false,
				instances: [
					{ browser: 'chromium' },
				],
			},
			coverage: {
				include: ['src/**'],
				exclude: ['**.spec.*', '**.test.*', '**.cy.*'],
				provider: 'v8',
				reporter: ['lcov', 'text'],
			},
			setupFiles: ['__tests__/setup-testing-library.ts'],
			server: {
				deps: {
					inline: [/@nextcloud\//],
				},
			},
		},
	}),
})
