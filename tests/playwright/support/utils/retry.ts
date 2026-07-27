/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

/** How long to back off before retrying a failed setup round trip. */
const RETRY_DELAY = 800

/**
 * Run a setup round trip that talks to the container, retrying it once.
 *
 * Anything shelling out to `occ` contends with the other workers over the same
 * SQLite database and can come back with "database is locked", and logging in
 * costs three requests that a busy machine can drop. Neither says anything about
 * what a test is checking, so neither may fail it on the first attempt.
 *
 * @param action - The round trip to run
 * @param description - What is attempted, for the log message on the first failure
 */
export async function withRetry<T>(action: () => Promise<T>, description: string): Promise<T> {
	try {
		return await action()
	} catch (error) {
		console.info(`Failed to ${description}, retrying`, error)
		await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
		return await action()
	}
}
