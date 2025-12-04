/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests/playwright',
	fullyParallel: true,
	// ensure no `test.only` is left in the code causing false positives
	forbidOnly: !!process.env.CI,
	// on CI we retry once to get traces of failures
	retries: process.env.CI ? 1 : 0,
	// we shard on CI to speed up the tests so no parallelism in workers
	workers: process.env.CI ? 1 : undefined,
	// on CI we want to have blob (so we can merge reports and download them for inspection),
	// dot (so we have a quick overview in the logs while the tests are running)
	// github (to have annotations in the PR)
	// locally we just want the html report with the traces
	reporter: process.env.CI ? [['blob'], ['dot'], ['github']] : 'html',
	use: {
		baseURL: 'http://localhost:8089/index.php/',
		// we record traces but only keep them when the test fails
		trace: 'on-first-retry',
	},

	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},

		...(process.env.CI
			? [
					{
						name: 'firefox',
						use: { ...devices['Desktop Firefox'] },
					},
					{
						name: 'webkit',
						use: { ...devices['Desktop Safari'] },
					},
				]
			: []),
	],

	webServer: {
		// url: 'http://127.0.0.1:8089',
		// Starts the Nextcloud docker container
		command: 'node tests/playwright/start-nextcloud-server.js',
		env: {
			NEXTCLOUD_PORT: '8089',
		},
		// get output of the webserver
		stderr: 'pipe',
		stdout: 'pipe',
		// we use sigterm to notify the script to stop the container
		// if it does not respond, we force kill it after 10 seconds
		gracefulShutdown: {
			signal: 'SIGTERM',
			timeout: 10000,
		},
		reuseExistingServer: !process.env.CI,
		timeout: 5 * 60 * 1000,
		wait: {
			// we wait for this line to appear in the output of the webserver until consider it done
			stdout: /Nextcloud is now ready to use/,
		},
	},
})
