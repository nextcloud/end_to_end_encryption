/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { PemConverter } from '@peculiar/x509'

const utf8Decoder = new TextDecoder('utf-8', { fatal: true })

/**
 * @param buffer - The UTF-8 encoded buffer (Uint8Array) to convert to a string
 */
export function bufferToString(buffer: Uint8Array<ArrayBuffer> | ArrayBuffer): string {
	try {
		return utf8Decoder.decode(buffer)
	} catch {
		// older versions of this app wrote metadata as Latin-1
		return Array.from(new Uint8Array(buffer), (byte) => String.fromCharCode(byte)).join('')
	}
}

/**
 * @param str - The string to convert to a UTF-8 encoded buffer (Uint8Array)
 */
export function stringToBuffer(str: string): Uint8Array<ArrayBuffer> {
	return new TextEncoder().encode(str)
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
	return new Uint8Array(PemConverter.decodeFirst(pem))
}

/**
 * Converts a buffer (pkcs8) to a PEM formatted key
 *
 * @param buffer - The buffer (Uint8Array) to convert to PEM format
 * @param type - The type of the key: 'public', 'private' or 'certificate'
 */
export function bufferToPem(buffer: Uint8Array<ArrayBuffer>, type: 'public' | 'private' | 'certificate' | 'csr'): string {
	const TAGS = {
		public: 'PUBLIC KEY',
		private: 'PRIVATE KEY',
		certificate: 'CERTIFICATE',
		csr: 'CERTIFICATE REQUEST',
	}
	return PemConverter.encode(buffer, TAGS[type])
}
