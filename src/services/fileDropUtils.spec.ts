/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { getUploadErrorMessage } from './fileDropUtils.ts'

/**
 * Create an error like the WebDAV client throws it for a failed request
 *
 * @param status - The HTTP status code of the response
 */
function webDavError(status: number): Error {
	return Object.assign(new Error(`Invalid response: ${status}`), { status })
}

/**
 * Create an error like axios throws it for a failed request
 *
 * @param status - The HTTP status code of the response, or undefined if there was no response
 */
function axiosError(status?: number) {
	return {
		isAxiosError: true,
		message: 'Request failed',
		response: status === undefined ? undefined : { status },
	}
}

describe('fileDropUtils: getUploadErrorMessage', () => {
	test.each([
		[413, 'The file is too large to be uploaded.'],
		[507, 'There is not enough free space to upload the file.'],
		[401, 'You are not allowed to upload files to this share.'],
		[403, 'You are not allowed to upload files to this share.'],
		[404, 'The share does not exist anymore.'],
		[500, 'An unexpected error occurred while uploading the file.'],
	])('maps WebDAV status %i to a message', (status, message) => {
		expect(getUploadErrorMessage(webDavError(status))).toBe(message)
	})

	test.each([
		[413, 'The file is too large to be uploaded.'],
		[507, 'There is not enough free space to upload the file.'],
		[403, 'You are not allowed to upload files to this share.'],
		[500, 'An unexpected error occurred while uploading the file.'],
	])('maps axios status %i to a message', (status, message) => {
		expect(getUploadErrorMessage(axiosError(status))).toBe(message)
	})

	test('treats a request without response as connection problem', () => {
		const message = 'The connection to the server was lost. Please check your network connection and try again.'
		expect(getUploadErrorMessage(axiosError())).toBe(message)
		expect(getUploadErrorMessage(new TypeError('Failed to fetch'))).toBe(message)
	})

	test('treats an allocation failure as too large file', () => {
		expect(getUploadErrorMessage(new RangeError('Array buffer allocation failed'))).toBe('The file is too large to be uploaded.')
	})

	test('falls back to a generic message', () => {
		const message = 'An unexpected error occurred while uploading the file.'
		expect(getUploadErrorMessage(new Error('Something went wrong'))).toBe(message)
		expect(getUploadErrorMessage('not an error')).toBe(message)
		expect(getUploadErrorMessage(undefined)).toBe(message)
	})
})
