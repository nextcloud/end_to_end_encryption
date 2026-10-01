/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { worker as mockWorker } from '../../__tests__/api-mock.ts'

import { Permission } from '@nextcloud/files'
import { ShareType } from '@nextcloud/sharing'
import { http, HttpResponse } from 'msw'
import { describe, expect } from 'vitest'
import { test } from '../../__tests__/api-mock.ts'
import { createFileDropShare } from './sharing.ts'

const SHARES_URL = '**/ocs/v2.php/apps/files_sharing/api/v1/shares'

describe('createFileDropShare', () => {
	/**
	 * Mock the share creation and capture the request body.
	 *
	 * @param worker - The mock service worker
	 */
	function captureRequest(worker: typeof mockWorker) {
		const body: { value?: Record<string, unknown> } = {}
		worker.use(http.post(SHARES_URL, async ({ request }) => {
			body.value = await request.json() as Record<string, unknown>
			return HttpResponse.json({ ocs: { meta: { status: 'ok', statuscode: 200 }, data: { id: 1, token: 'abc' } } })
		}))
		return body
	}

	test('creates an upload only link share', async ({ worker }) => {
		const body = captureRequest(worker)

		await expect(createFileDropShare('/My%20folder')).resolves.toEqual({ id: 1, token: 'abc' })
		expect(body.value).toEqual({
			path: '/My folder',
			permissions: Permission.CREATE,
			shareType: ShareType.Link,
		})
	})

	test('sends password and note', async ({ worker }) => {
		const body = captureRequest(worker)

		await createFileDropShare('/folder', { password: 'secret', note: 'Hello' })
		expect(body.value).toMatchObject({ password: 'secret', note: 'Hello' })
	})

	test('omits empty password and note', async ({ worker }) => {
		const body = captureRequest(worker)

		await createFileDropShare('/folder', { password: '', note: '' })
		expect(body.value).not.toHaveProperty('password')
		expect(body.value).not.toHaveProperty('note')
	})
})
