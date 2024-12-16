/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
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

export function base64ToBuffer(base64Str: string): Uint8Array {
	return stringToBuffer(atob(base64Str))
}
