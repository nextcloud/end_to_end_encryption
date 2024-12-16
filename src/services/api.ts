/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */
import { generateOcsUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import type { OCSResponse } from '@nextcloud/typings/ocs'

import type { Metadata, PrivateKeyInfo } from '../models'
import { base64ToBuffer, bufferToBase64, stringToBuffer } from './utils'
import { loadRSAPublicKey } from './crypto.ts'

// API: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md

const API_ROOT = 'apps/end_to_end_encryption/api/v2'
const Url = {
	PrivateKey: API_ROOT + '/private-key',
	PublicKey: API_ROOT + '/public-key',
	Lock: API_ROOT + '/lock/{fileId}',
	Metadata: API_ROOT + '/meta-data/{fileId}',
	FileDrop: API_ROOT + '/meta-data/{fileId}/filedrop',
	ServerKey: API_ROOT + '/server-key',
	Encrypted: API_ROOT + '/encrypted/{fileId}',
}

export async function setPrivateKey(privateKeyInfo: PrivateKeyInfo): Promise<void> {
	await axios.post(
		generateOcsUrl(Url.PrivateKey),
		`${bufferToBase64(privateKeyInfo.encryptedPrivateKey)}|${bufferToBase64(privateKeyInfo.iv)}|${bufferToBase64(privateKeyInfo.salt)}`,
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },

	)
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

export async function deletePrivateKey(): Promise<void> {
	await axios.delete(
		generateOcsUrl(Url.PrivateKey),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
}

export async function signPublicKey(certificate: string): Promise<CryptoKey> {
	const response = await axios.post<OCSResponse<{'public-key': string}>>(
		generateOcsUrl(Url.PublicKey),
		{ csr: certificate },
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
	return await loadRSAPublicKey(stringToBuffer(response.data.ocs.data['public-key']))
}

export async function getPublicKeys<T extends string>(userIds?: T[]): Promise<Record<T, CryptoKey>> {
	const response = await axios.get<OCSResponse<{'public-keys': Record<T, string> }>>(
		generateOcsUrl(Url.PublicKey),
		{
			params: { users: JSON.stringify(userIds) },
			headers: { 'X-E2EE-SUPPORTED': 'true' },
		},
	)

	const keys = {} as Record<T, CryptoKey>

	for (const userId in response.data.ocs.data['public-keys']) {
		const publicKey = response.data.ocs.data['public-keys'][userId]
		keys[userId] = await loadRSAPublicKey(stringToBuffer(publicKey))
	}

	return keys
}

export async function deletePublicKey(): Promise<void> {
	await axios.delete(
		generateOcsUrl(Url.PublicKey),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
}

// TODO: maybe store the tokens somewhere to be able to unlock the file later if the browser was closed.
export async function lockFile(fileId: string, counter: number, e2eToken?: string): Promise<string> {
	const response = await axios.post<OCSResponse<{'e2e-token': string}>>(
		generateOcsUrl(Url.Lock, { fileId }),
		{
			params: { 'e2e-token': e2eToken },
			undefined,
			headers: {
				'X-E2EE-SUPPORTED': 'true',
				'X-NC-E2EE-COUNTER': counter,
			},
		},
	)
	return response.data.ocs.data['e2e-token']
}

export async function unlockFile(fileId: string, e2eToken: string): Promise<string> {
	const response = await axios.post<OCSResponse<{'e2e-token': string}>>(
		generateOcsUrl(Url.Lock, { fileId }),
		undefined,
		{
			headers: {
				'X-E2EE-SUPPORTED': 'true',
				'E2E-TOKEN': e2eToken,
			},
		},
	)
	return response.data.ocs.data['e2e-token']
}

export async function storeMetadata(fileId: string, metadata: Metadata, e2eToken: string): Promise<void> {
	await axios.post(
		generateOcsUrl(Url.Metadata, { fileId }),
		JSON.stringify(metadata),
		{
			headers: {
				'X-E2EE-SUPPORTED': 'true',
				'E2E-TOKEN': e2eToken,
			},
		},
	)
}

export async function getMetadata(fileId: string): Promise<Metadata> {
	const response = await axios.get<OCSResponse<{'meta-data': string}>>(
		generateOcsUrl(Url.Metadata, { fileId }),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
	return JSON.parse(response.data.ocs.data['meta-data']) as Metadata
}

export async function updateMetadata(fileId: string, metadata: Metadata, e2eToken: string, signature: string): Promise<void> {
	await axios.put(
		generateOcsUrl(Url.Metadata, { fileId }),
		JSON.stringify(metadata),
		{
			headers: {
				'X-E2EE-SUPPORTED': 'true',
				'E2E-TOKEN': e2eToken,
				'X-NC-E2EE-SIGNATURE': signature,
			},
		},
	)
}

export async function updateMetadataFiledrop(fileId, fileDrops, shareToken): Promise<void> {
	await axios.put(
		generateOcsUrl(Url.FileDrop, { fileId }),
		{ filedrop: JSON.stringify(fileDrops) },
		{
			params: { shareToken },
			headers: { 'X-E2EE-SUPPORTED': 'true' },
		},
	)
}

export async function deleteMetadata(fileId: string, e2eToken: string): Promise<void> {
	await axios.delete(
		generateOcsUrl(Url.Metadata, { fileId }),
		{
			headers: {
				'X-E2EE-SUPPORTED': 'true',
				'E2E-TOKEN': e2eToken,
			},
		},
	)
}

export async function getServerPublicKey(): Promise<CryptoKey> {
	const response = await axios.get<OCSResponse<{'public-key': string}>>(
		generateOcsUrl(Url.ServerKey),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
	return await loadRSAPublicKey(stringToBuffer(response.data.ocs.data['public-key']))
}

export async function setEncrypted(fileId: string): Promise<void> {
	await axios.put(
		generateOcsUrl(Url.Encrypted, { fileId }),
		undefined,
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
}

export async function removeEncrypted(fileId: string): Promise<void> {
	await axios.delete(
		generateOcsUrl(Url.Encrypted, { fileId }),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
}
