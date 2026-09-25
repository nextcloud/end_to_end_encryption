/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test, vi } from 'vitest'
import { queueMetadataUpdate } from './metadataQueue.ts'

vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'admin' }) }))

describe('queueMetadataUpdate', () => {
	test('runs operations of the same folder one after another', async () => {
		const log: string[] = []

		await Promise.all([
			queueMetadataUpdate('/folder', operation(log, 'first', 20)),
			queueMetadataUpdate('/folder', operation(log, 'second', 10)),
			queueMetadataUpdate('/folder', operation(log, 'third', 0)),
		])

		expect(log).toEqual([
			'start first',
			'end first',
			'start second',
			'end second',
			'start third',
			'end third',
		])
	})

	test('runs operations of different folders in parallel', async () => {
		const log: string[] = []

		await Promise.all([
			queueMetadataUpdate('/folder', operation(log, 'first', 20)),
			queueMetadataUpdate('/other-folder', operation(log, 'second', 0)),
		])

		expect(log).toEqual(['start first', 'start second', 'end second', 'end first'])
	})

	test('queues on the folder and not on how its path is spelled', async () => {
		const log: string[] = []

		await Promise.all([
			queueMetadataUpdate('/folder', operation(log, 'first', 20)),
			queueMetadataUpdate('/folder/', operation(log, 'second', 0)),
		])

		expect(log).toEqual(['start first', 'end first', 'start second', 'end second'])
	})

	test('passes the result of the operation on', async () => {
		await expect(queueMetadataUpdate('/folder', async () => 'result')).resolves.toBe('result')
	})

	test('a failing operation does not hold up the ones behind it', async () => {
		const log: string[] = []
		const failing = queueMetadataUpdate('/folder', async () => {
			throw new Error('nope')
		})
		const following = queueMetadataUpdate('/folder', operation(log, 'second', 0))

		await expect(failing).rejects.toThrow('nope')
		await expect(following).resolves.toBe('second')
		expect(log).toEqual(['start second', 'end second'])
	})
})

/**
 * An operation that records when it ran.
 *
 * @param log - Where to record
 * @param name - Name of the operation
 * @param duration - How long it takes
 */
function operation(log: string[], name: string, duration: number): () => Promise<string> {
	return async () => {
		log.push(`start ${name}`)
		await new Promise((resolve) => setTimeout(resolve, duration))
		log.push(`end ${name}`)
		return name
	}
}
