import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { metadata, serverPublicKey, subfolderMetadata } from './consts.spec'

export const restHandlers = [
	http.get('http://nextcloud.local//ocs/v2.php/apps/end_to_end_encryption/api/v2/server-key', () => {
		return HttpResponse.json({ ocs: { data: { 'public-key': serverPublicKey }}})
	}),
	http.get('http://nextcloud.local//ocs/v2.php/apps/end_to_end_encryption/api/v2/meta-data/89', () => {
		return HttpResponse.json({ ocs: { data: { 'meta-data': JSON.stringify(metadata) }}})
	}),
	http.get('http://nextcloud.local//ocs/v2.php/apps/end_to_end_encryption/api/v2/meta-data/266', () => {
		return HttpResponse.json({ ocs: { data: { 'meta-data': JSON.stringify(subfolderMetadata) }}})
	}),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())