/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */
import { generateOcsUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import type { OCSResponse } from '@nextcloud/typings/ocs'

import type { Metadata, PrivateKeyInfo } from '../models.ts'
import { base64ToBuffer, pemToBuffer } from './utils.ts'
import { loadServerPublicKey, validateCertificateSignature } from './crypto.ts'

// API: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md

const API_ROOT = 'apps/end_to_end_encryption/api/v2'
const Url = {
	PrivateKey: API_ROOT + '/private-key',
	Metadata: API_ROOT + '/meta-data/{fileId}',
	ServerKey: API_ROOT + '/server-key',
}

export async function getPrivateKey(): Promise<PrivateKeyInfo> {
	const response = await axios.get<OCSResponse<{'private-key': string}>>(
		generateOcsUrl(Url.PrivateKey),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
	const encryptedPrivateKeyInfo = response.data.ocs.data['private-key']
	const [encryptedPrivateKey, iv, salt] = encryptedPrivateKeyInfo.split('|')
	return {
		encryptedPrivateKey: base64ToBuffer(encryptedPrivateKey),
		iv: base64ToBuffer(iv),
		salt: base64ToBuffer(salt),
	}
}

export async function getMetadata(fileId: string, serverPublicKey: CryptoKey): Promise<Metadata> {
	const response = await axios.get<OCSResponse<{'meta-data': string}>>(
		generateOcsUrl(Url.Metadata, { fileId }),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)

	const metadata = JSON.parse(response.data.ocs.data['meta-data']) as Metadata

	await validateUserCertificates(metadata, serverPublicKey)

	return metadata
}

async function validateUserCertificates(metadata: Metadata, serverPublicKey: CryptoKey): Promise<void> {
	if (metadata.users === undefined) {
		return
	}

	const verifications = metadata.users.map(async ({ userId, certificate }) => {
		const result = await validateCertificateSignature(certificate, serverPublicKey)

		if (!result) {
			throw new Error(`Certificate verification failed for user ${userId}`)
		}
	})

	await Promise.all(verifications)
}

export async function getServerPublicKey(): Promise<CryptoKey> {
	const response = await axios.get<OCSResponse<{'public-key': string}>>(
		generateOcsUrl(Url.ServerKey),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
	return await loadServerPublicKey(pemToBuffer(response.data.ocs.data['public-key']))
}
