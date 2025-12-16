/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { FileStat, ResponseDataDetailed, SearchResult, WebDAVClient } from 'webdav'
import type { PrivateKeyInfo } from '../models.ts'

import { getCurrentUser } from '@nextcloud/auth'
import axios, { isAxiosError } from '@nextcloud/axios'
import { defaultRootPath, getClient } from '@nextcloud/files/dav'
import { join } from '@nextcloud/paths'
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

const METADATA_PROPFIND = `<?xml version="1.0"?>
	<d:propfind xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns" xmlns:oc="http://owncloud.org/ns">
		<d:prop>
			<d:resourcetype />
			<d:displayname />
			<nc:e2ee-is-encrypted />
			<nc:e2ee-metadata />
			<nc:e2ee-metadata-signature />
			<oc:fileid />
		</d:prop>
	</d:propfind>`

let client: WebDAVClient

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
	const users = [userId ?? getCurrentUser()!.uid]

	try {
		const response = await axios.get<OCSResponse<{ 'public-keys': Record<string, string> }>>(
			generateOcsUrl(Url.PublicKey),
			{
				headers: { 'X-E2EE-SUPPORTED': 'true' },
				params: { users: JSON.stringify(users) },
			},
		)
		return response.data.ocs.data['public-keys'][users[0]!]!
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
export async function setFolderAsEncrypted(folderId: string): Promise<void> {
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
export async function lockFolder(folderId: string, counter: number, token?: string, shareToken?: string): Promise<string> {
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
export async function unlockFolder(folderId: string, token: string, shareToken?: string, abort?: true): Promise<void> {
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
 * @param metadata - The metadata to set
 * @param token - The locking token
 * @param signature - The signature to verify the request
 */
export async function createMetadata(fileId: string, metadata: string, token: string, signature: string): Promise<void> {
	const url = generateOcsUrl(Url.Metadata, { fileId })
	await axios.post(
		url,
		{
			metaData: metadata,
		},
		{
			headers: {
				'E2E-TOKEN': token,
				'X-NC-E2EE-SIGNATURE': signature,
				'X-E2EE-SUPPORTED': 'true',
			},
		},
	)
}

/**
 * Update metadata for a folder.
 *
 * @param fileId - The fileid of the folder
 * @param metadata - The metadata to set
 * @param token - The locking token
 * @param signature - The signature to verify the request
 */
export async function updateMetadata(fileId: string, metadata: string, token: string, signature: string): Promise<void> {
	const url = generateOcsUrl(Url.Metadata, { fileId })
	await axios.put(
		url,
		{
			metaData: metadata,
		},
		{
			headers: {
				'E2E-TOKEN': token,
				'X-NC-E2EE-SIGNATURE': signature,
				'X-E2EE-SUPPORTED': 'true',
			},
		},
	)
}

/**
 * Delete metadata of a folder.
 *
 * @param fileId - The fileid of the folder
 * @param token - The locking token
 */
export async function deleteMetadata(fileId: string, token: string): Promise<void> {
	const url = generateOcsUrl(Url.Metadata, { fileId })
	await axios.delete(
		url,
		{
			headers: {
				'E2E-TOKEN': token,
				'X-E2EE-SUPPORTED': 'true',
			},
		},
	)
}

/**
 * Fetch metadata for a given file ID.
 *
 * @param fileId - The file ID of the folder
 * @param shareToken - Optional share token if folder is a share (to identify the owner)
 */
export async function getMetadata(fileId: string, shareToken?: string) {
	const url = generateOcsUrl(Url.Metadata, { fileId })
	const response = await axios.get<OCSResponse<{ 'meta-data': string }>>(
		url,
		{
			headers: {
				'X-E2EE-SUPPORTED': 'true',
			},
			params: {
				shareToken,
			},
		},
	)
	return {
		metadata: response.data.ocs.data['meta-data'],
		signature: response.headers['x-nc-e2ee-signature']!,
	}
}

interface MetdataResponse {
	fileId: string
	metadata: string
	signature: string
}

/**
 * Fetch metadata for a given path.
 *
 * @param path - The file path of the folder relative to the DAV root
 * @return The metadata response or false if the path is not a folder
 * @throws {Error} If metadata could not be fetched, is not available or incomplete
 */
export async function getMetadataByPath(path: string): Promise<MetdataResponse | false> {
	const result = await getNodeStat(path)

	if (!result.props) {
		logger.debug('No props found in PROPFIND result', { result, path })
		throw new Error('No metadata found for path ' + path)
	}

	const isFolder = typeof result.props.resourcetype.collection !== 'undefined'
	if (!isFolder) {
		return false
	}

	const {
		fileid: fileId,
		'e2ee-metadata': metadata,
		'e2ee-metadata-signature': signature,
	} = result.props
	if (!fileId || !metadata || !signature) {
		logger.debug('Not all props provided by PROPFIND', { path, fileId, metadata, signature })
		throw new Error('No metadata found for path ' + path)
	}

	return {
		fileId: fileId.toString(),
		metadata: metadata.toString(),
		signature: signature.toString(),
	}
}

/**
 * Wrapper around WebDAV STAT to fetch e2ee related properties.
 *
 * @param path - The file path relative to the DAV root
 */
export async function getNodeStat(path: string) {
	if (!client) {
		client = getClient()
	}

	if (!path.startsWith(defaultRootPath)) {
		path = join(defaultRootPath, path)
	}

	const { data } = await client.stat(path, { details: true, data: METADATA_PROPFIND }) as ResponseDataDetailed<FileStat>
	return data
}

/**
 * Wrapper around WebDAV list directory to fetch e2ee related properties of folder content.
 *
 * @param path - The directory path relative to the DAV root
 */
export async function getDirectoryContents(path: string) {
	if (!client) {
		client = getClient()
	}

	if (!path.startsWith(defaultRootPath)) {
		path = join(defaultRootPath, path)
	}

	const { data } = await client.getDirectoryContents(path, { details: true, data: METADATA_PROPFIND }) as ResponseDataDetailed<FileStat[]>
	return data
}

/**
 * Search for folders within a given path.
 *
 * @param path - The path relative to the DAV root to search within
 */
export async function searchFolders(path: string) {
	if (!client) {
		client = getClient()
	}

	path = join(defaultRootPath, path)
	const { data } = await client.search('', {
		details: true,
		data: `<?xml version="1.0"?>
	<d:searchrequest xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns" xmlns:oc="http://owncloud.org/ns">
		<d:basicsearch>
			<d:select>
				<d:prop>
					<d:resourcetype />
					<d:displayname />
					<nc:e2ee-is-encrypted />
					<nc:e2ee-metadata />
					<nc:e2ee-metadata-signature />
					<oc:fileid />
				</d:prop>
			</d:select>
			<d:from>
				<d:scope>
					<d:href>${path}</d:href>
					<d:depth>infinity</d:depth>
				</d:scope>
			</d:from>
			<d:where>
				<d:is-collection/>
			</d:where>
			<d:orderby/>
		</d:basicsearch>
	</d:searchrequest>`,
	}) as ResponseDataDetailed<SearchResult>

	return data.results.map((result) => ({
		path: join(defaultRootPath, result.filename),
		metadata: result.props!['e2ee-metadata'] as string,
		signature: result.props!['e2ee-metadata-signature'] as string,
		fileId: (result.props!.fileid as number | string).toString(),
	}))
}
