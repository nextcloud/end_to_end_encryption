/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IRawMetadata } from '../models/metadata.d.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { defaultRemoteURL, defaultRootPath } from '@nextcloud/files/dav'
import { dirname } from '@nextcloud/paths'
import { Metadata } from '../models/Metadata.ts'
import { RootMetadata } from '../models/RootMetadata.ts'
import * as api from '../services/api.ts'
import { isRootMetadata, validateMetadataSignature } from '../services/metadata.ts'
import * as keyStore from './keys.ts'

export interface IStoreMetadata {
	/** File id of the metadata - used by the APIs */
	id: string
	/** The metadata itself */
	metadata: Metadata
	/** The path of the metadata */
	path: string
}

const currentUser = getCurrentUser()?.uid
const metadataCache = new Map<string, Omit<IStoreMetadata, 'path'>>()

/**
 * Get the path of the root folder for the given root metadata.
 *
 * @param metadata - The root metadata
 */
export function getRootFolder(metadata: RootMetadata): IStoreMetadata & { metadata: RootMetadata } {
	const entry = metadataCache.entries().find(([, { metadata: md }]) => md === metadata)!
	return {
		id: entry[1].id,
		metadata: entry[1].metadata as RootMetadata,
		path: entry[0],
	}
}

/**
 * Get the root metadata for the given path.
 *
 * @param path - The path to get the root metadata for
 * @throws {Error} - If the root metadata signature verification fails
 * @throws {AxiosError} - If the target path is not end-to-end encrypted
 */
export async function getRootMetadata(path: string): Promise<RootMetadata> {
	path = normalizePath(path)
	if (metadataCache.has(path)) {
		const { metadata } = metadataCache.get(path)!
		if (metadata instanceof RootMetadata) {
			return metadata
		}
		return getRootMetadata(dirname(path))
	}

	// not in cache, fetch it
	const data = await api.getMetadataByPath(path)
	if (data === false) {
		// its a file so get its parent metadata
		const root = await getRootMetadata(dirname(path))
		const { metadata, id } = await getMetadata(dirname(path))
		setMetadata(path, id, metadata)
		return root
	}

	const metadataRaw = JSON.parse(data.metadata)
	if (isRootMetadata(metadataRaw)) {
		return (await setRawMetadata(path, data.fileId, metadataRaw, data.signature)).metadata as RootMetadata
	}

	// we need to fetch the root metadata first for decrypting this current metadata
	const rootMetadata = await getRootMetadata(dirname(path))
	await setRawMetadata(path, data.fileId, metadataRaw, data.signature)

	// still return the root metadata
	return rootMetadata
}

/**
 * Get the metadata for the given path.
 *
 * @param path - The path to get the metadata for
 */
export async function getMetadata(path: string): Promise<IStoreMetadata> {
	path = normalizePath(path)
	if (!metadataCache.has(path)) {
		// if this is not in the cache, fetch the root metadata which will populate the cache as a side effect
		await getRootMetadata(path)
	}

	return {
		...metadataCache.get(path)!,
		path,
	}
}

/**
 * Set the metadata for the given path.
 *
 * @param path - The path of the metadata
 * @param id - The file id of the metadata
 * @param metadata - The metadata object
 */
export function setMetadata(path: string, id: string, metadata: Metadata): IStoreMetadata {
	path = normalizePath(path)
	metadataCache.set(path, { id, metadata })
	return {
		id,
		metadata,
		path,
	}
}

/**
 * Set the raw metadata for the given path.
 *
 * @param path - The path of the metadata
 * @param id - The file id of the metadata
 * @param rawMetadata - The raw metadata
 * @param signature - The signature of the metadata
 */
export async function setRawMetadata(path: string, id: string, rawMetadata: string | IRawMetadata, signature: string): Promise<IStoreMetadata> {
	path = normalizePath(path)
	const metadataRaw: IRawMetadata = typeof rawMetadata === 'string' ? JSON.parse(rawMetadata) : rawMetadata

	let metadata: Metadata
	if (isRootMetadata(metadataRaw)) {
		const rootMetadata = await RootMetadata.fromJson(metadataRaw, currentUser!, await keyStore.getPrivateKey())
		await validateMetadataSignature(metadataRaw, signature, rootMetadata.rawUsers)
		metadata = rootMetadata
	} else {
		const rootMetadata = await getRootMetadata(dirname(path))
		metadata = await Metadata.fromJson(metadataRaw, rootMetadata.key)
		await validateMetadataSignature(metadataRaw, signature, rootMetadata.rawUsers)
	}
	return setMetadata(path, id, metadata)
}

/**
 * Delete the metadata for the given path and all sub-paths.
 *
 * @param path - The path to remove
 */
export function deleteMetadata(path: string): void {
	path = normalizePath(path)
	metadataCache.delete(path)

	// also delete all sub-paths
	for (const [source] of metadataCache.entries()) {
		if (source.startsWith(`${path}/`)) {
			metadataCache.delete(source)
		}
	}
}

/**
 * Load all subfolders for the given root metadata.
 *
 * @param root - The root metadata
  */
export async function loadAllSubfolders(root: RootMetadata): Promise<IStoreMetadata[]> {
	const { path } = getRootFolder(root)
	const results: IStoreMetadata[] = []
	const apiResults = await api.searchFolders(path)
	for (const result of apiResults) {
		const { metadata } = await setRawMetadata(result.path, result.fileId, result.metadata, result.signature)
		results.push({
			id: result.fileId,
			metadata,
			path: result.path,
		})
	}
	return results
}

const RELATIVE_REMOTE_URL = new URL(defaultRemoteURL).pathname

/**
 * Normalize the given path to be relative to the DAV root.
 *
 * @param path - The path to normalize
 */
function normalizePath(path: string): string {
	if (path.startsWith(defaultRemoteURL)) {
		path = path.slice(defaultRemoteURL.length)
	} else if (path.startsWith(RELATIVE_REMOTE_URL)) {
		path = path.slice(RELATIVE_REMOTE_URL.length)
	}

	if (path.startsWith(defaultRootPath)) {
		path = path.slice(defaultRootPath.length)
	}
	return `/${path}`
		.replace(/^\/\/+/, '/')
		.replace(/\/+$/, '')
}
