/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { runOcc } from '@nextcloud/e2e-test-server/docker'
import { withRetry } from './retry.ts'

/**
 * Set a system config value.
 *
 * @param key - Name of the config value
 * @param value - Value to set, an empty string unsets it
 */
export async function setSystemConfig(key: string, value: string): Promise<void> {
	await withRetry(
		() => runOcc(['config:system:set', key, `--value=${value}`], { verbose: true }),
		`set the system config ${key}`,
	)
}

/**
 * Stop new accounts from being seeded with the default skeleton and template
 * files.
 *
 * Tests that assert on the contents of a folder should not have to know about
 * files they did not create, and the skeleton is copied into the home directory
 * of every account the tests create.
 */
export async function disableDefaultHomeContents(): Promise<void> {
	await setSystemConfig('skeletondirectory', '')
	await setSystemConfig('templatedirectory', '')
}
