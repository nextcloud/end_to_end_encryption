/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PrivateKeyInfo } from '../models.ts'

import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, vi } from 'vitest'
import { test } from '../../__tests__/api-mock.ts'
import * as api from './api.ts'
import { stringToBuffer } from './bufferUtils.ts'

describe('getPrivateKey', () => {
	const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
	beforeEach(() => consoleError.mockClear())

	test('throws on network failure', async ({ worker }) => {
		worker.use(http.get('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			return HttpResponse.error()
		}))

		await expect(api.getPrivateKey()).rejects.toThrow()
		expect(consoleError).toHaveBeenCalled()
	})

	test('throws on server failure', async ({ worker }) => {
		worker.use(http.get('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			return HttpResponse.json({ ocs: { meta: { status: 'failure', statuscode: 500, message: 'Internal Server Error' } } }, { status: 500 })
		}))

		await expect(api.getPrivateKey()).rejects.toThrow()
		expect(consoleError).toHaveBeenCalled()
	})

	test('returns null if no private key is available', async ({ worker }) => {
		worker.use(http.get('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			return HttpResponse.json({ ocs: { meta: { status: 'failure', statuscode: 404, message: 'Not Found' } } }, { status: 404 })
		}))

		await expect(api.getPrivateKey()).resolves.toBeNull()
		expect(consoleError).not.toHaveBeenCalled()
	})

	test('returns private key information when available', async ({ worker }) => {
		worker.use(http.get('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
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

	test('throws on network failure', async ({ worker }) => {
		let called = false
		worker.use(http.post('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			called = true
			return HttpResponse.error()
		}))

		await expect(api.setPrivateKey(keyInfo)).rejects.toThrow()
		expect(called).toBe(true)
	})

	test('works with proper data', async ({ worker }) => {
		let called = false
		worker.use(http.post('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', async ({ request }) => {
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
	test('throws on network failure', async ({ worker }) => {
		let called = false
		worker.use(http.delete('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			called = true
			return HttpResponse.error()
		}))

		await expect(api.deletePrivateKey()).rejects.toThrow()
		expect(called).toBe(true)
	})

	test('works when network available', async ({ worker }) => {
		let called = false
		worker.use(http.delete('**/ocs/v2.php/apps/end_to_end_encryption/api/v2/private-key', () => {
			called = true
			return HttpResponse.json({ ocs: { meta: { status: 'ok', statuscode: 200, message: 'OK' } } }, { status: 200 })
		}))

		await expect(api.deletePrivateKey()).resolves.toBeUndefined()
		expect(called).toBe(true)
	})
})
