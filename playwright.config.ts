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
	// The E2EE flows do RSA key generation and 600k PBKDF2 rounds in the browser
	// on top of the usual Nextcloud page loads, which is far slower on a shared
	// CI runner (and in Firefox/WebKit) than locally — the defaults of 30s/5s are
	// not enough headroom for that and time out instead of failing on a real bug.
	timeout: 90_000,
	expect: {
		timeout: 10_000,
	},
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
		actionTimeout: 15_000,
		navigationTimeout: 30_000,
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
					// {
					//   name: 'webkit',
					//   use: { ...devices['Desktop Safari'] },
					// },
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
