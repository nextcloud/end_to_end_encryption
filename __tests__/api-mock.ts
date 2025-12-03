/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { test as testBase } from 'vitest'
import { bufferToBase64 } from '../src/services/bufferUtils.ts'
import { adminPrivateKeyInfo, rootFolderPropfindResponse, serverPublicKey, subFolderPropfindResponse } from './consts.spec'

const restHandlers = [
	http.get('/ocs/v2.php/apps/end_to_end_encryption/api/v2/server-key', () => {
		return HttpResponse.json({ ocs: { data: { 'public-key': serverPublicKey } } })
	}),
	http.get('/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
		return HttpResponse.json({ ocs: { data: { 'private-key': Object.values(adminPrivateKeyInfo).map(bufferToBase64).join('|') } } })
	}),

	http.all('/remote.php/dav/files/admin/New%20folder', ({ request }) => {
		if (request.method === 'PROPFIND') {
			return HttpResponse.xml(rootFolderPropfindResponse)
		}
	}),

	http.all('/remote.php/dav/files/admin/New%20folder/fa666d819a6c4315abba421172f0a0b1', ({ request }) => {
		if (request.method === 'PROPFIND') {
			return HttpResponse.xml(subFolderPropfindResponse)
		}
	}),
]

export const worker = setupWorker(...restHandlers)

export const test = testBase.extend<{ worker: typeof worker }>({
	worker: [
		// eslint-disable-next-line no-empty-pattern
		async ({ }, use) => {
			// Start the worker before the test.
			await worker.start()

			// Expose the worker object on the test's context.
			await use(worker)

			// Remove any request handlers added in individual test cases.
			// This prevents them from affecting unrelated tests.
			worker.resetHandlers()

			// Stop the worker after the test.
			worker.stop()
		},
		{
			auto: true,
		},
	],
})
