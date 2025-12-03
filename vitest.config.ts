/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		vue(),
		nodePolyfills(),
	],
	optimizeDeps: {
		include: [
			'node:module',
			'vite-plugin-node-polyfills/shims/buffer',
			'vite-plugin-node-polyfills/shims/global',
			'vite-plugin-node-polyfills/shims/process',
		],
	},
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
})
