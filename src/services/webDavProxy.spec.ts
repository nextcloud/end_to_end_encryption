/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { http, HttpResponse } from 'msw'
import { expect, vi } from 'vitest'
import { test } from '../../__tests__/api-mock.ts'
import { destroyWebDavProxy, setupWebDavProxy } from './webDavProxy.ts'

const useGetInterceptor = vi.hoisted(() => vi.fn((_, next) => next()))
vi.mock('../middleware/useGetInterceptor.ts', () => ({ useGetInterceptor }))
const usePropFindInterceptor = vi.hoisted(() => vi.fn((_, next) => next()))
vi.mock('../middleware/usePropFindInterceptor.ts', () => ({ usePropFindInterceptor }))
const usePutInterceptor = vi.hoisted(() => vi.fn((_, next) => next()))
vi.mock('../middleware/usePutInterceptor.ts', () => ({ usePutInterceptor }))
const useCopyInterceptor = vi.hoisted(() => vi.fn((_, next) => next()))
vi.mock('../middleware/useCopyInterceptor.ts', () => ({ useCopyInterceptor }))
const useMoveInterceptor = vi.hoisted(() => vi.fn((_, next) => next()))
vi.mock('../middleware/useMoveInterceptor.ts', () => ({ useMoveInterceptor }))
const useDeleteInterceptor = vi.hoisted(() => vi.fn((_, next) => next()))
vi.mock('../middleware/useDeleteInterceptor.ts', () => ({ useDeleteInterceptor }))

const logger = vi.hoisted(() => vi.mockObject({
	debug: () => {},
	error: () => {},
}))
vi.mock('./logger.ts', () => ({ default: logger }))

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
	destroyWebDavProxy()
	vi.resetAllMocks()
	worker.use(...restHandlers)
})

test('intercepts WebDAV requests', async () => {
	setupWebDavProxy()

	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href))
	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href), { method: 'PROPFIND' })
	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href), { method: 'PUT' })
	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href), { method: 'DELETE' })
	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href), { method: 'MOVE' })
	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href), { method: 'COPY' })

	expect(useGetInterceptor).toHaveBeenCalled()
	expect(usePropFindInterceptor).toHaveBeenCalled()
	expect(usePutInterceptor).toHaveBeenCalled()
	expect(useDeleteInterceptor).toHaveBeenCalled()
	expect(useMoveInterceptor).toHaveBeenCalled()
	expect(useCopyInterceptor).toHaveBeenCalled()
})

test('can destroy proxy', async () => {
	setupWebDavProxy()
	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href), { method: 'MOVE' })
	expect(useMoveInterceptor).toHaveBeenCalledOnce()

	destroyWebDavProxy()
	await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href), { method: 'MOVE' })
	expect(useMoveInterceptor).toHaveBeenCalledOnce()
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

test('log exceptions in handler', async () => {
	await expect(async () => {
		useGetInterceptor.mockImplementationOnce(() => {
			throw new Error('Test error')
		})
		setupWebDavProxy()
		await window.fetch(new URL('/remote.php/dav/files/user/file.txt', window.location.href))
	}).rejects.toThrow('Test error')
	expect(useGetInterceptor).toHaveBeenCalled()
	expect(logger.error).toHaveBeenCalled()
	// @ts-expect-error we know the type here
	expect(logger.error.mock.calls[0][0]).toContain('Error in GET interceptor')
	// @ts-expect-error we know the type here
	expect(logger.error.mock.calls[0][1].error.message).toBe('Test error')
})
