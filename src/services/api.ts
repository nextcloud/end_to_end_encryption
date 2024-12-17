/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */
import { generateOcsUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import type { OCSResponse } from '@nextcloud/typings/ocs'

import type { Metadata, PrivateKeyInfo } from '../models'
import { base64ToBuffer } from './utils'

// API: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md

const API_ROOT = 'apps/end_to_end_encryption/api/v2'
const Url = {
	PrivateKey: API_ROOT + '/private-key',
	Metadata: API_ROOT + '/meta-data/{fileId}',
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

export async function getMetadata(fileId: string): Promise<Metadata> {
	const response = await axios.get<OCSResponse<{'meta-data': string}>>(
		generateOcsUrl(Url.Metadata, { fileId }),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
	return JSON.parse(response.data.ocs.data['meta-data']) as Metadata
}
