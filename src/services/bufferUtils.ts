/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

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

export function pemToBuffer(pem: string): Uint8Array {
	const pemContents = pem
		.replace(/-----BEGIN ((PRIVATE KEY)|(PUBLIC KEY)|(CERTIFICATE))-----/, '')
		.replace(/-----END ((PRIVATE KEY)|(PUBLIC KEY)|(CERTIFICATE))-----/, '')
		.replace(/\n/g, '')

	return base64ToBuffer(pemContents)
}