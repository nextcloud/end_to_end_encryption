/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Metadata, RootMetadata } from '../models.ts'

import { base64ToBuffer, stringToBuffer } from './bufferUtils.ts'
import { validateCertificateSignature, validateCMSSignature } from './crypto.ts'

export async function validateMetadataSignature(metadata: Metadata, signature: string, rootMetadata: RootMetadata): Promise<true> {
	const signedData = JSON.stringify(metadata, (key, value) => {
		if (key === 'filedrop') {
			return undefined
		}
		return value
	})

	const verificationResult = await validateCMSSignature(
		stringToBuffer(btoa(signedData)),
		base64ToBuffer(signature),
		rootMetadata.users,
	)

	if (!verificationResult) {
		throw new Error('Metadata signature verification failed')
	}

	return verificationResult
}

export async function validateUserCertificates(metadata: RootMetadata, serverPublicKeyPEM: string): Promise<true[]> {
	const verifications = metadata.users.map(async ({ userId, certificate }) => {
		const result = await validateCertificateSignature(certificate, serverPublicKeyPEM)

		if (!result) {
			throw new Error(`Certificate verification failed for user ${userId}`)
		}

		return result
	})

	return await Promise.all(verifications)
}
