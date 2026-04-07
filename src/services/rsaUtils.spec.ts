/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest'
import { ensureKeyUsage } from './rsaUtils.ts'

const encryptionKeys = await globalThis.crypto.subtle.generateKey(
	{
		name: 'RSA-OAEP',
		modulusLength: 2048,
		publicExponent: new Uint8Array([1, 0, 1]),
		hash: 'SHA-256',
	},
	true,
	['encrypt', 'decrypt'],
)

const signingKeys = await globalThis.crypto.subtle.generateKey(
	{
		name: 'RSASSA-PKCS1-v1_5',
		modulusLength: 2048,
		publicExponent: new Uint8Array([1, 0, 1]),
		hash: 'SHA-256',
	},
	true,
	['sign', 'verify'],
)

describe('ensureKeyUsage', () => {
	it('should return the same key if it already has the intended usage', async () => {
		const spy = vi.spyOn(globalThis.crypto.subtle, 'exportKey')
		const key = await ensureKeyUsage(encryptionKeys.publicKey, 'encrypt')
		expect(key).toBe(encryptionKeys.publicKey)
		expect(spy).not.toHaveBeenCalled()
	})

	it.for`
	                         key |        usage
	-----------------------------|-------------
	${encryptionKeys.publicKey}  | ${'decrypt'}
	${encryptionKeys.publicKey}  | ${'sign'}
	${encryptionKeys.privateKey} | ${'encrypt'}
	${encryptionKeys.privateKey} | ${'verify'}
	${signingKeys.publicKey}     | ${'sign'}
	${signingKeys.publicKey}     | ${'decrypt'}
	${signingKeys.privateKey}    | ${'verify'}
	${signingKeys.privateKey}    | ${'encrypt'}
	`('cannot convert public to private key', async ({ key, usage }) => {
		const spy = vi.spyOn(globalThis.crypto.subtle, 'exportKey')
		await expect(ensureKeyUsage(key, usage)).rejects.toThrow('Cannot convert private key to public key and vice versa')
		expect(spy).not.toHaveBeenCalled()
	})

	it('can sign with an encryption key', async () => {
		const signingKey = await ensureKeyUsage(encryptionKeys.privateKey, 'sign')
		expect(signingKey.usages).toContain('sign')

		const data = new TextEncoder().encode('Hello, World!')
		await expect(globalThis.crypto.subtle.sign(
			{
				name: 'RSASSA-PKCS1-v1_5',
			},
			signingKey,
			data,
		)).resolves.not.toThrow()
	})

	it('can encrypt with signing key', async () => {
		const signingKey = await ensureKeyUsage(signingKeys.publicKey, 'encrypt')
		expect(signingKey.usages).toContain('encrypt')

		const data = new TextEncoder().encode('Hello, World!')
		await expect(globalThis.crypto.subtle.encrypt(
			{
				name: 'RSA-OAEP',
			},
			signingKey,
			data,
		)).resolves.not.toThrow()
	})
})
