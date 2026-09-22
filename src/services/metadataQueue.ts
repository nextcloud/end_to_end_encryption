/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { normalizePath } from './path.ts'

/** The end of the queue of every folder that currently has an operation pending. */
const queues = new Map<string, Promise<void>>()

/**
 * Queue an operation that rewrites the metadata of a folder, so that only one of
 * them runs for that folder at a time.
 *
 * Nothing keeps the app from starting the next one while a lock-write-unlock
 * cycle is still in flight - the files app deletes a selection five requests at
 * a time. Overlapping operations are rejected by the server, which locks the
 * folder for one of them, and hand each other unsaved changes in the browser,
 * where they share one metadata object. Unrelated folders never touch the same
 * metadata, so the queue is per folder.
 *
 * @param path - Path of the folder whose metadata the operation rewrites
 * @param operation - The operation to run
 */
export function queueMetadataUpdate<T>(path: string, operation: () => Promise<T>): Promise<T> {
	const folder = normalizePath(path)
	const result = (queues.get(folder) ?? Promise.resolve()).then(operation)

	// the queue only orders the operations - a failing one may not keep the ones behind it from running
	const settled = result.then(() => {}, () => {})
	queues.set(folder, settled)
	// forgotten again once nothing is pending, so the map does not keep every folder the session touched
	settled.then(() => {
		if (queues.get(folder) === settled) {
			queues.delete(folder)
		}
	})

	return result
}
