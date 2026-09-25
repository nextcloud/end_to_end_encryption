/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { INode } from '@nextcloud/files'

import { showConfirmation } from '@nextcloud/dialogs'
import { emit } from '@nextcloud/event-bus'
import { getClient } from '@nextcloud/files/dav'
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import * as metadataStore from '../store/metadata.ts'
import * as taskStore from '../store/tasks.ts'
import * as api from './api.ts'
import { setupTasksManager } from './TasksManager.ts'

vi.hoisted(() => document.head.setAttribute('data-user', 'admin'))
vi.mock('@nextcloud/dialogs', () => ({
	showConfirmation: vi.fn(),
	showError: vi.fn(),
	showLoading: () => ({ hideToast: () => {} }),
}))
vi.mock('@nextcloud/event-bus', () => ({ emit: vi.fn() }))
vi.mock('@nextcloud/files/dav', async (importOriginal) => ({
	...(await importOriginal()),
	getClient: vi.fn(),
}))
vi.mock('../store/keys.ts', () => ({ getCertificate: async () => ({}) }))
vi.mock('../store/metadata.ts', () => ({
	getRootMetadata: vi.fn(),
	getRootFolder: vi.fn(),
}))
vi.mock('./api.ts', () => ({
	lockFolder: vi.fn(),
	unlockFolder: vi.fn(),
	updateMetadata: vi.fn(),
}))

const FOLDER = '/e2ee'
const ENTRY = 'ad3b12554e0d4364854ae3e21b170152'

const stat = vi.fn()
const metadata = {
	counter: 1,
	hasFileDropEntries: true,
	fileDropEntries: [ENTRY],
	migrateFileDrop: vi.fn(),
	export: vi.fn(),
}

// the tasks manager keeps its interval across tests, so the fake clock must be shared as well
beforeAll(() => {
	vi.useFakeTimers()
})

afterAll(() => {
	vi.useRealTimers()
})

beforeEach(() => {
	vi.clearAllMocks()
	vi.mocked(showConfirmation).mockResolvedValue(true)
	vi.mocked(getClient).mockReturnValue({ stat } as never)
	vi.mocked(metadataStore.getRootMetadata).mockResolvedValue(metadata as never)
	vi.mocked(metadataStore.getRootFolder).mockReturnValue({ id: '42', path: FOLDER } as never)
	vi.mocked(api.lockFolder).mockResolvedValue('lock-token')
	vi.mocked(api.unlockFolder).mockResolvedValue()
	vi.mocked(api.updateMetadata).mockResolvedValue()
	metadata.export.mockResolvedValue({ metadata: {}, signature: 'signature' })
	stat.mockResolvedValue({
		data: {
			filename: `/files/admin${FOLDER}/${ENTRY}`,
			basename: ENTRY,
			lastmod: new Date().toUTCString(),
			size: 5,
			type: 'file',
			etag: 'etag',
			mime: 'text/plain',
			props: { fileid: 7, displayname: 'dropped.txt', permissions: 'GDNVW' },
		},
	})
})

describe('file drop migration', () => {
	test('announces the migrated entries to the files list', async () => {
		await runTasks()

		expect(stat).toHaveBeenCalledOnce()
		expect(stat.mock.calls[0]![0]).toMatch(new RegExp(`${FOLDER}/${ENTRY}$`))
		const node = vi.mocked(emit).mock.calls[0]![1] as INode
		expect(emit).toHaveBeenCalledWith('files:node:created', expect.anything())
		expect(node.basename).toBe(ENTRY)
		expect(node.displayname).toBe('dropped.txt')
		expect(node.fileid).toBe(7)
	})

	test('does not announce entries if the migration failed', async () => {
		vi.mocked(api.updateMetadata).mockRejectedValue(new Error('Conflict'))

		await runTasks()

		expect(api.unlockFolder).toHaveBeenCalledWith('42', 'lock-token', true)
		expect(stat).not.toHaveBeenCalled()
		expect(emit).not.toHaveBeenCalled()
	})

	test('keeps announcing remaining entries if one cannot be fetched', async () => {
		metadata.fileDropEntries = ['a'.repeat(32), ENTRY]
		stat.mockRejectedValueOnce(new Error('Not found'))

		await runTasks()

		expect(stat).toHaveBeenCalledTimes(2)
		expect(emit).toHaveBeenCalledOnce()
		metadata.fileDropEntries = [ENTRY]
	})
})

/**
 * Queue a file drop migration and wait until the tasks manager handled it.
 */
async function runTasks() {
	taskStore.addFileDropMigration(FOLDER)
	setupTasksManager()
	await vi.advanceTimersByTimeAsync(60 * 1000)
	await vi.waitFor(() => expect(taskStore.getTasks()).toHaveLength(0))
}
