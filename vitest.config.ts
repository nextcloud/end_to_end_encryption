/**
 * SPDX-FileCopyrightText: 2023-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
	plugins: [vue()],
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
		setupFiles: ['__tests__/setup-testing-library', '__tests__/mock-window.js', '__tests__/mock-axios.js'],
		server: {
			deps: {
				inline: [/@nextcloud\//],
			},
		},
	},
})
