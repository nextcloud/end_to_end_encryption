/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { http, HttpResponse } from 'msw'
import { expect, vi } from 'vitest'
import { test } from '../../__tests__/api-mock.ts'
import { setupWebDavProxy } from './webDavProxy.ts'

const useGetInterceptor = vi.hoisted(() => vi.fn((_, next) => next()))
vi.mock('../middleware/useGetInterceptor.ts', () => ({ useGetInterceptor }))

const restHandlers = [
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

test.beforeEach(({ worker }) => {
	vi.resetAllMocks()
	worker.use(...restHandlers)
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
