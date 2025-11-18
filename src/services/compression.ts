/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { gunzip, gzip } from 'fflate'
import logger from './logger.ts'

/**
 * Uncompress GZIP compressed data.
 *
 * @param data - The data to decompress (its unusable after decompression)
 */
export function uncompress(data: Uint8Array): Promise<Uint8Array<ArrayBuffer>> {
	const { promise, resolve, reject } = Promise.withResolvers<Uint8Array<ArrayBuffer>>()
	gunzip(data, { consume: true }, (error, decompressed) => {
		if (error) {
			logger.error('Error decompressing data', { error })
			reject(error)
		}
		resolve(new Uint8Array(decompressed))
	})
	return promise
}

/**
 * Compress data using GZIP.
 *
 * @param data - The data to compress (the buffer is consumed!)
 */
export function compress(data: Uint8Array): Promise<Uint8Array<ArrayBuffer>> {
	const { promise, resolve, reject } = Promise.withResolvers<Uint8Array<ArrayBuffer>>()
	gzip(data, { consume: true }, (error, compressed) => {
		if (error) {
			logger.error('Error compressing data', { error })
			reject(error)
		}
		resolve(new Uint8Array(compressed))
	})
	return promise
}
