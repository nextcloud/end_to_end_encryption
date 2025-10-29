/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { PrivateKeyInfo } from '../models.ts'

import axios, { isAxiosError } from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { base64ToBuffer, bufferToBase64 } from './bufferUtils.ts'
import logger from './logger.ts'

// API: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md

const API_ROOT = 'apps/end_to_end_encryption/api/v2'
const Url = {
	PrivateKey: API_ROOT + '/private-key',
	PublicKey: API_ROOT + '/public-key',
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
 * Fetches the public key for the current user.
 *
 * @return The public key in PEM format, or null if not found
 */
export async function getPublicKey(): Promise<string | null> {
	try {
		const response = await axios.get<OCSResponse<{ 'public-key': string }>>(
			generateOcsUrl(Url.PublicKey),
			{ headers: { 'X-E2EE-SUPPORTED': 'true' } },
		)
		return response.data.ocs.data['public-key']
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === 404) {
			logger.debug('No public key found for the current user.')
			return null
		}
		logger.error('Error fetching public key', { error })
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
		logger.error('Error fetching public key', { error })
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
