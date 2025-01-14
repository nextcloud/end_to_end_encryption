/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { adminPrivateKeyInfo, rootFolderPropfindResponse, serverPublicKey, subFolderPropfindResponse } from './consts.spec'
import { bufferToBase64 } from '../src/services/bufferUtils'

export const restHandlers = [
	http.get('http://nextcloud.local//ocs/v2.php/apps/end_to_end_encryption/api/v2/server-key', () => {
		return HttpResponse.json({ ocs: { data: { 'public-key': serverPublicKey } } })
	}),
	http.get('http://nextcloud.local//ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
		return HttpResponse.json({ ocs: { data: { 'private-key': Object.values(adminPrivateKeyInfo).map(bufferToBase64).join('|') } } })
	}),

	http.all('http://nextcloud.local//remote.php/dav/files/admin/New%20folder', ({ request }) => {
		if (request.method === 'PROPFIND') {
			return HttpResponse.xml(rootFolderPropfindResponse)
		}
	}),

	http.all('http://nextcloud.local//remote.php/dav/files/admin/New%20folder/fa666d819a6c4315abba421172f0a0b1', ({ request }) => {
		if (request.method === 'PROPFIND') {
			return HttpResponse.xml(subFolderPropfindResponse)
		}
	}),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
