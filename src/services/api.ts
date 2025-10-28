/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { PrivateKeyInfo } from '../models.ts'

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { base64ToBuffer } from './bufferUtils.ts'

// API: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md

const API_ROOT = 'apps/end_to_end_encryption/api/v2'
const Url = {
	PrivateKey: API_ROOT + '/private-key',
	Metadata: API_ROOT + '/meta-data/{fileId}',
	ServerKey: API_ROOT + '/server-key',
}

/**
 * Fetches the private key for the current user.
 */
export async function getPrivateKey(): Promise<PrivateKeyInfo> {
	const response = await axios.get<OCSResponse<{ 'private-key': string }>>(
		generateOcsUrl(Url.PrivateKey),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
	const encryptedPrivateKeyInfo = response.data.ocs.data['private-key']
	const [encryptedPrivateKey, iv, salt] = encryptedPrivateKeyInfo.split('|')
	return {
		encryptedPrivateKey: base64ToBuffer(encryptedPrivateKey!),
		iv: base64ToBuffer(iv!),
		salt: base64ToBuffer(salt!),
	}
}

/**
 * Fetches the server public key in PEM format.
 */
export async function getServerPublicKey(): Promise<string> {
	const response = await axios.get<OCSResponse<{ 'public-key': string }>>(
		generateOcsUrl(Url.ServerKey),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)

	return await response.data.ocs.data['public-key']
}
