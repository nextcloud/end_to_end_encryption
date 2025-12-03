/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PrivateKeyInfo } from '../models.ts'

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from './api.ts'
import { stringToBuffer } from './bufferUtils.ts'

const server = setupServer()

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())

describe('getPrivateKey', () => {
	const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
	beforeEach(() => consoleError.mockClear())

	it('throws on network failure', async () => {
		server.use(http.get('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			return HttpResponse.error()
		}))

		await expect(api.getPrivateKey()).rejects.toThrow()
		expect(consoleError).toHaveBeenCalled()
	})

	it('throws on server failure', async () => {
		server.use(http.get('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			return HttpResponse.json({ ocs: { meta: { status: 'failure', statuscode: 500, message: 'Internal Server Error' } } }, { status: 500 })
		}))

		await expect(api.getPrivateKey()).rejects.toThrow()
		expect(consoleError).toHaveBeenCalled()
	})

	it('returns null if no private key is available', async () => {
		server.use(http.get('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			return HttpResponse.json({ ocs: { meta: { status: 'failure', statuscode: 404, message: 'Not Found' } } }, { status: 404 })
		}))

		await expect(api.getPrivateKey()).resolves.toBeNull()
		expect(consoleError).not.toHaveBeenCalled()
	})

	it('returns private key information when available', async () => {
		server.use(http.get('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			return HttpResponse.json({
				ocs: {
					meta: { status: 'ok', statuscode: 200, message: 'OK' },
					data: {
						'private-key': `${btoa('key')}|${btoa('iv')}|${btoa('salt')}`,
					},
				},
			}, { status: 200 })
		}))

		await expect(api.getPrivateKey()).resolves.toEqual({
			encryptedPrivateKey: stringToBuffer('key'),
			iv: stringToBuffer('iv'),
			salt: stringToBuffer('salt'),
		})
		expect(consoleError).not.toHaveBeenCalled()
	})
})

describe('setPrivateKey', () => {
	const keyInfo: PrivateKeyInfo = {
		encryptedPrivateKey: stringToBuffer('key'),
		iv: stringToBuffer('iv'),
		salt: stringToBuffer('salt'),
	}

	it('throws on network failure', async () => {
		let called = false
		server.use(http.post('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			called = true
			return HttpResponse.error()
		}))

		await expect(api.setPrivateKey(keyInfo)).rejects.toThrow()
		expect(called).toBe(true)
	})

	it('works with proper data', async () => {
		let called = false
		server.use(http.post('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', async ({ request }) => {
			expect(request.headers.get('X-E2EE-SUPPORTED')).toBe('true')
			expect(await request.json()).toEqual({
				privateKey: `${btoa('key')}|${btoa('iv')}|${btoa('salt')}`,
			})

			called = true
			return HttpResponse.json({ ocs: { meta: { status: 'ok', statuscode: 200, message: 'OK' } } }, { status: 200 })
		}))

		await expect(api.setPrivateKey(keyInfo)).resolves.toBeUndefined()
		expect(called).toBe(true)
	})
})

describe('deletePrivateKey', () => {
	it('throws on network failure', async () => {
		let called = false
		server.use(http.delete('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			called = true
			return HttpResponse.error()
		}))

		await expect(api.deletePrivateKey()).rejects.toThrow()
		expect(called).toBe(true)
	})

	it('works when network available', async () => {
		let called = false
		server.use(http.delete('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			called = true
			return HttpResponse.json({ ocs: { meta: { status: 'ok', statuscode: 200, message: 'OK' } } }, { status: 200 })
		}))

		await expect(api.deletePrivateKey()).resolves.toBeUndefined()
		expect(called).toBe(true)
	})
})
