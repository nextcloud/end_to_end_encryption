/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserConfig } from 'vitest/node'

import { createAppConfig } from '@nextcloud/vite-config'
import { join } from 'path'

// replaced by vite
declare const __dirname: string

export default createAppConfig({
	files: join(__dirname, 'src', 'files.ts'),
	settings: join(__dirname, 'src', 'settings.js'),
	adminSettings: join(__dirname, 'src', 'settings-admin.js'),
	filedrop: join(__dirname, 'src', 'filedrop.js'),
}, {
	inlineCSS: { relativeCSSInjection: true },
	extractLicenseInformation: true,
	thirdPartyLicense: false,
	config: {
		// Setup for vitest unit tests
		test: {
			include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
			environment: 'jsdom',
			environmentOptions: {
				jsdom: {
					url: 'http://nextcloud.local',
				},
			},
			coverage: {
				include: ['src/**'],
				exclude: ['**.spec.*', '**.test.*', '**.cy.*'],
				provider: 'v8',
				reporter: ['lcov', 'text'],
			},
			setupFiles: ['__tests__/setup-testing-library.ts', '__tests__/api-mock.ts'],
			server: {
				deps: {
					inline: [/@nextcloud\//],
				},
			},
		} as UserConfig,
	},
})
