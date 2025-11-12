/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { compress, uncompress } from './compression.ts'

describe('Compression Service', () => {
	test('compress and uncompress data', async () => {
		const text = 'This is some test data to compress and uncompress using GZIP.'
		const originalData = new TextEncoder().encode(text)

		const compressedData = await compress(originalData)
		expect(compressedData).toBeInstanceOf(Uint8Array)
		expect(compressedData.length).not.toEqual(text.length)

		const uncompressedData = await uncompress(compressedData)
		expect(uncompressedData).toBeInstanceOf(Uint8Array)
		expect(uncompressedData.length).toEqual(text.length)

		const result = new TextDecoder().decode(uncompressedData)
		expect(result).toEqual(text)
	})
})
