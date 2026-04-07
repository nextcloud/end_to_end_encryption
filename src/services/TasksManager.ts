/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ITask } from '../store/tasks.ts'

import { showConfirmation, showError, showLoading } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'
import * as taskStore from '../store/tasks.ts'
import * as api from './api.ts'
import logger from './logger.ts'

let intervalId: number | undefined = undefined

/**
 * Start handling tasks like metadata conversion
 */
export function setupTasksManager() {
	logger.debug('Registering tasks manager')
	if (intervalId !== undefined) {
		logger.debug('Tasks manager is already registered, skipping.')
		return
	}

	intervalId = window.setInterval(async () => {
		logger.debug('Start handling pending tasks')
		try {
			window.clearInterval(intervalId!)
			intervalId = undefined
			window.addEventListener('beforeunload', onBeforeUnload)
			await handleTasks()
		} finally {
			window.removeEventListener('beforeunload', onBeforeUnload)
			logger.debug('Finished handling pending tasks, setting up next interval')
			setupTasksManager()
		}
	}, 60 * 1000)
}

/**
 * Handle pending tasks
 */
async function handleTasks() {
	const tasks = taskStore.getTasks()
		.filter((task) => task.type === 'file-drop-migration')

	if (tasks.length === 0) {
		return
	}

	const dialog = showConfirmation({
		name: t('end_to_end_encryption', 'Pending file drop migrations'),
		text: t('end_to_end_encryption', 'There are pending file drop migrations that need to be completed. Do you want to complete them now?'),
		labelConfirm: t('end_to_end_encryption', 'Migrate now'),
		labelReject: t('end_to_end_encryption', 'Migrate later'),
	})
	if (!await dialog) {
		return
	}

	window.addEventListener('beforeunload', onBeforeUnload)
	const toast = showLoading(t('end_to_end_encryption', 'Migrating file drop entries, please do not close this tab…'))
	for (const task of tasks) {
		try {
			if (task.type === 'file-drop-migration') {
				await executeFileDropMigrationTask(task)
			} else {
				logger.debug('Unknown task type', { type: task.type })
			}
			taskStore.markTaskCompleted(task.id)
		} catch {
			logger.error('Error while executing file drop migration task', { path: task.path, type: task.type })
		}
	}
	toast.hideToast()
}

/**
 * Execute a single task
 *
 * @param task - The task to execute
 */
async function executeFileDropMigrationTask(task: ITask) {
	const metadata = await metadataStore.getRootMetadata(task.path)
	if (!metadata.hasFileDropEntries) {
		return
	}

	const { id, path } = metadataStore.getRootFolder(metadata)
	const token = await api.lockFolder(id, metadata.counter + 1)
	try {
		for (const entryName of metadata.fileDropEntries) {
			metadata.migrateFileDrop(entryName)
		}

		const { metadata: metadataRaw, signature } = await metadata.export(await keyStore.getCertificate())
		await api.updateMetadata(id, JSON.stringify(metadataRaw), token, signature)
		await api.unlockFolder(id, token)
	} catch (error) {
		logger.error('Error while updating metadata during file drop migration', { path, error, metadata })
		showError(t('end_to_end_encryption', 'An error occurred while migrating one file drop entry. Please try again later.'))
		await api.unlockFolder(id, token, true)
	}
}

/**
 * Block the unload of the page if there are pending tasks to prevent data loss.
 *
 * @param event - The beforeunload event
 */
function onBeforeUnload(event: BeforeUnloadEvent) {
	if (intervalId !== undefined) {
		event.preventDefault()
		event.returnValue = t('end_to_end_encryption', 'There are pending tasks that need to be completed. Are you sure you want to leave?')
	}
}
