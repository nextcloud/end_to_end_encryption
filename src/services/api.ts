/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { PrivateKeyInfo } from '../models.ts'

import { getCurrentUser } from '@nextcloud/auth'
import axios, { isAxiosError } from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { base64ToBuffer, bufferToBase64 } from './bufferUtils.ts'
import logger from './logger.ts'

// API: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md

const API_ROOT = 'apps/end_to_end_encryption/api/v2'
const Url = {
	Encrypted: API_ROOT + '/encrypted/{folderId}',
	Lock: API_ROOT + '/lock/{folderId}',
	Metadata: API_ROOT + '/meta-data/{fileId}',
	PrivateKey: API_ROOT + '/private-key',
	PublicKey: API_ROOT + '/public-key',
	ServerKey: API_ROOT + '/server-key',
}

/**
 * Fetches the private key for the current user.
 */
export async function getPrivateKey(): Promise<PrivateKeyInfo | null> {
	try {
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
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === 404) {
			logger.debug('No private key found for the current user.')
			return null
		}
		logger.error('Error geting private key', { error })
		throw error
	}
}

/**
 * Save the encrypted private key for the current user.
 *
 * @param privateKeyInfo - The private key
 */
export async function setPrivateKey(privateKeyInfo: PrivateKeyInfo): Promise<void> {
	const privateKey = bufferToBase64(privateKeyInfo.encryptedPrivateKey) + '|'
		+ bufferToBase64(privateKeyInfo.iv) + '|'
		+ bufferToBase64(privateKeyInfo.salt)

	await axios.post(
		generateOcsUrl(Url.PrivateKey),
		{ privateKey },
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
}

/**
 * Delete the private key for the current user saved on the server
 */
export async function deletePrivateKey(): Promise<void> {
	await axios.delete(
		generateOcsUrl(Url.PrivateKey),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
}

/**
 * Fetches the public key (certificate) for the current user.
 *
 * @param userId - The user ID to get the public key for (defaults to current user)
 * @return The public key (x509 as PEM), or null if not found
 */
export async function getPublicKey(userId?: string): Promise<string | null> {
	userId ??= getCurrentUser()!.uid
	if (!userId) {
		throw new Error('Cannot fetch a public key without specifying a user')
	}

	try {
		const response = await axios.get<OCSResponse<{ 'public-keys': Record<string, string> }>>(
			generateOcsUrl(Url.PublicKey),
			{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
		)
		return response.data.ocs.data['public-keys'][userId]!
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === 404) {
			logger.debug('No public key found for the current user.')
			return null
		}
		logger.error('Error getting public key', { error })
		throw error
	}
}

/**
 * Request the server to sign and return the public key.
 *
 * @param csr - The certificate signing request to the server
 * @return The signed public key
 */
export async function createPublicKey(csr: string): Promise<string> {
	try {
		const response = await axios.post<OCSResponse<{ 'public-key': string }>>(
			generateOcsUrl(Url.PublicKey),
			{ csr },
			{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
		)
		return response.data.ocs.data['public-key']
	} catch (error) {
		logger.error('Error creating public key', { error })
		throw error
	}
}

/**
 * Delete the public key for the current user saved on the server
 */
export async function deletePublicKey(): Promise<void> {
	await axios.delete(
		generateOcsUrl(Url.PublicKey),
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
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

/**
 * Set a folder as encrypted.
 *
 * @param folderId - The fileid of the folder
 */
export async function setFolderAsEncrypted(folderId: number): Promise<void> {
	const url = generateOcsUrl(Url.Encrypted, { folderId })
	await axios.put(
		url,
		{},
		{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
	)
}

/**
 * Lock a folder for metadata updates.
 *
 * @param folderId - The folder to lock
 * @param counter - The incremented counter value (see metadata)
 * @param token - Optional existing token to extend the lock
 * @param shareToken - Optional share token if folder is a share (to identify the owner)
 * @return The locking token
 */
export async function lockFolder(folderId: number, counter: number, token?: string, shareToken?: string): Promise<string> {
	const url = generateOcsUrl(Url.Lock, { folderId })
	const response = await axios.post<OCSResponse<{ 'e2e-token': string }>>(
		url,
		{
			'e2e-token': token,
			shareToken,
		},
		{
			headers: {
				'X-NC-E2EE-COUNTER': counter.toString(),
				'X-E2EE-SUPPORTED': 'true',
			},
		},
	)
	return response.data.ocs.data['e2e-token']
}

/**
 * Unlock a folder for metadata updates.
 *
 * @param folderId - The folder to lock
 * @param token - Optional existing token to extend the lock
 * @param shareToken - Optional share token if folder is a share (to identify the owner)
 * @param abort - Whether to abort the ongoing operation
 */
export async function unlockFolder(folderId: number, token: string, shareToken?: string, abort?: true): Promise<void> {
	const url = generateOcsUrl(Url.Lock, { folderId })
	await axios.delete<OCSResponse<{ 'e2e-token': string }>>(
		url,
		{
			data: {
				abort: abort ? 'true' : undefined,
				shareToken,
			},
			headers: {
				'E2E-TOKEN': token,
				'X-E2EE-SUPPORTED': 'true',
			},
		},
	)
}

/**
 * Set initial metadata for a folder.
 *
 * @param fileId - The fileid of the folder
 * @param metaData - The metadata to set
 * @param token - The locking token
 * @param signature - The signature to verify the request
 */
export async function createMetadata(fileId: number, metaData: string, token: string, signature: string): Promise<void> {
	const url = generateOcsUrl(Url.Metadata, { fileId })
	await axios.post(
		url,
		{ metaData },
		{
			headers: {
				'E2E-TOKEN': token,
				'X-NC-E2EE-SIGNATURE': signature,
				'X-E2EE-SUPPORTED': 'true',
			},
		},
	)
}
