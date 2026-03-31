/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

type TaskType = 'file-drop-migration'

export interface ITask {
	id: symbol
	type: TaskType
	path: string
}

const tasks: ITask[] = []

/**
 * Add a new file drop migration task for the given path.
 *
 * @param path - The path of the file drop entry that needs migration
 */
export function addFileDropMigration(path: string) {
	if (tasks.some((t) => t.type === 'file-drop-migration' && t.path === path)) {
		return
	}

	tasks.push({ id: Symbol(), type: 'file-drop-migration', path })
}

/**
 * Get all open tasks
 */
export function getTasks(): ITask[] {
	return [...tasks]
}

/**
 * Mark the task with the given ID as completed and remove it from the list of open tasks.
 *
 * @param id - The ID of the task to mark as completed
 */
export function markTaskCompleted(id: symbol) {
	const index = tasks.findIndex((t) => t.id === id)
	if (index !== -1) {
		tasks.splice(index, 1)
	}
}
