/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

export function bufferToString(buffer: Uint8Array): string {
	return String.fromCharCode(...buffer)
}

export function stringToBuffer(str: string): Uint8Array {
	return Uint8Array.from(str, c => c.charCodeAt(0))
}

export function bufferToBase64(buffer: Uint8Array): string {
	return btoa(bufferToString(buffer))
}

export function bufferToHex(buffer: Uint8Array): string {
	return Array.from(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

export function base64ToBuffer(base64Str: string): Uint8Array {
	return stringToBuffer(atob(base64Str))
}

const PEM_HEADER = '-----BEGIN PRIVATE KEY-----'
const PEM_FOOTER = '-----END PRIVATE KEY-----'

export function pemToBuffer(pem: string): Uint8Array {
	const pemContents = pem
		.substring(
			PEM_HEADER.length,
			pem.length - PEM_FOOTER.length - 1,
		)
		.replace(/\n/g, '')

	return base64ToBuffer(pemContents)
}