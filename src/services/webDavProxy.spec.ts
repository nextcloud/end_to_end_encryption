/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest'
import { destroyWebDavProxy, setupWebDavProxy } from './webDavProxy.ts'

const useGetInterceptor = vi.hoisted(() => vi.fn((_, next) => next()))
vi.mock('../middleware/useGetInterceptor.ts', () => ({ useGetInterceptor }))

export const restHandlers = [
	http.get('/ocs/v2.php', () => {
		return HttpResponse.json({})
	}),
	http.get('/remote.php/dav/files/user/file.txt', () => {
		return HttpResponse.text('hello world')
	}),
	http.put('/remote.php/dav/files/user/file.txt', () => {
		return HttpResponse.text('')
	}),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())

beforeEach(() => {
	destroyWebDavProxy()
	vi.resetAllMocks()
})

test('intercepts WebDAV requests', async () => {
	setupWebDavProxy()

	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href))
	expect(useGetInterceptor).toHaveBeenCalled()
})

test('ignores non WebDAV requests', async () => {
	setupWebDavProxy()

	await window.fetch(new URL('/ocs/v2.php', window.location.href))
	expect(useGetInterceptor).not.toHaveBeenCalled()
})

test('ignores requests with e2ee header', async () => {
	setupWebDavProxy()

	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href), {
		headers: {
			'X-E2EE-SUPPORTED': 'true',
		},
	})
	expect(useGetInterceptor).not.toHaveBeenCalled()
})

test('ignores requests non registered method', async () => {
	setupWebDavProxy()

	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href), {
		method: 'PUT',
	})
	expect(useGetInterceptor).not.toHaveBeenCalled()
})
