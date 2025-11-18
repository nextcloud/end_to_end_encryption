/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Metadata, RootMetadata } from '../models.ts'

import { X509Certificate } from '@peculiar/x509'
import stringify from 'safe-stable-stringify'
import { base64ToBuffer, stringToBuffer } from './bufferUtils.ts'
import { validateCertificateSignature, validateCMSSignature } from './crypto.ts'

/**
 * Validates the signature of the given metadata using the provided root metadata.
 *
 * @param metadata - The metadata to validate
 * @param signature - The base64-encoded signature of the metadata
 * @param rootMetadata - The root metadata
 */
export async function validateMetadataSignature(metadata: Metadata, signature: string, rootMetadata: RootMetadata): Promise<true> {
	const signedData = stringify(metadata, (key, value) => {
		if (key === 'filedrop') {
			return undefined
		}
		return value
	})!

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

/**
 * Verifies all user certificates in the given metadata against the server public key.
 *
 * @param metadata - The root metadata
 * @param serverPublicKeyPEM - The server public key in PEM format
 */
export async function validateUserCertificates(metadata: RootMetadata, serverPublicKeyPEM: string): Promise<true[]> {
	const verifications = metadata.users.map(async ({ userId, certificate }) => {
		const result = await validateCertificateSignature(new X509Certificate(certificate), serverPublicKeyPEM)

		if (!result) {
			throw new Error(`Certificate verification failed for user ${userId}`)
		}

		return result
	})

	return await Promise.all(verifications)
}
