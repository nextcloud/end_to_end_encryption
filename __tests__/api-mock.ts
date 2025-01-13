/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { rootFolderMetadata, rootFolderMetadataSignature, serverPublicKey, subfolderMetadata, subFolderMetadataSignature } from './consts.spec'

export const restHandlers = [
	http.get('http://nextcloud.local//ocs/v2.php/apps/end_to_end_encryption/api/v2/server-key', () => {
		return HttpResponse.json({ ocs: { data: { 'public-key': serverPublicKey } } })
	}),
	http.get('http://nextcloud.local//ocs/v2.php/apps/end_to_end_encryption/api/v2/meta-data/89', () => {
		const response = HttpResponse.json({ ocs: { data: { 'meta-data': JSON.stringify(rootFolderMetadata) } } })
		response.headers.set('x-nc-e2ee-signature', rootFolderMetadataSignature)
		return response
	}),
	http.get('http://nextcloud.local//ocs/v2.php/apps/end_to_end_encryption/api/v2/meta-data/266', () => {
		const response = HttpResponse.json({ ocs: { data: { 'meta-data': JSON.stringify(subfolderMetadata) } } })
		response.headers.set('x-nc-e2ee-signature', subFolderMetadataSignature)
		return response
	}),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
