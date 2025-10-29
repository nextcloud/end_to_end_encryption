/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @param buffer - The buffer (Uint8Array) to convert to a string
 */
export function bufferToString(buffer: Uint8Array): string {
	return String.fromCharCode(...buffer)
}

/**
 * @param str - The string to convert to a buffer (Uint8Array)
 */
export function stringToBuffer(str: string): Uint8Array<ArrayBuffer> {
	return Uint8Array.from(str, (c) => c.charCodeAt(0))
}

/**
 * @param buffer - The buffer (Uint8Array) to convert to a base64 string
 */
export function bufferToBase64(buffer: Uint8Array): string {
	// @ts-expect-error -- Bug in Typescript but natively supported, fixed with Typescript 6+
	return buffer.toBase64()
}

/**
 * @param base64Str - The base64 string to convert to a buffer (Uint8Array)
 */
export function base64ToBuffer(base64Str: string): Uint8Array<ArrayBuffer> {
	// @ts-expect-error -- Bug in Typescript but natively supported, fixed with Typescript 6+
	return Uint8Array.fromBase64(base64Str)
}

/**
 * @param buffer - The buffer (Uint8Array) to convert to a hex string
 */
export function bufferToHex(buffer: Uint8Array): string {
	// @ts-expect-error -- Bug in Typescript but natively supported, fixed with Typescript 6+
	return buffer.toHex()
}

/**
 * @param pem - The PEM formatted key to convert to a buffer (Uint8Array)
 */
export function pemToBuffer(pem: string): Uint8Array<ArrayBuffer> {
	const pemContents = pem
		.replace(/-----BEGIN ((PRIVATE KEY)|(PUBLIC KEY)|(CERTIFICATE))-----/, '')
		.replace(/-----END ((PRIVATE KEY)|(PUBLIC KEY)|(CERTIFICATE))-----/, '')
		.replace(/\n/g, '')

	return base64ToBuffer(pemContents)
}
