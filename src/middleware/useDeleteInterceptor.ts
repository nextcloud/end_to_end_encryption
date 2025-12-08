/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'

import { basename, dirname } from '@nextcloud/paths'
import stringify from 'safe-stable-stringify'
import * as api from '../services/api.ts'
import logger from '../services/logger.ts'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'

/**
 * Callback to handle DELETE requests.
 *
 * 1. If it is the root folder, then mark as deleted and remove it.
 * 2. Else if its a folder, delete its metadata and remove it from the parent metadata.
 * 3. Else if its a file, remove it from the parent metadata.
 *
 * @param context - The fetch context
 * @param next - The next middleware function
 */
export async function useDeleteInterceptor(context: FetchContext, next: () => Promise<void>): Promise<void> {
	logger.debug('Handling DELETE request', { request: context.req })

	const url = new URL(context.req.url)
	try {
		await metadataStore.getRootMetadata(url.pathname)
	} catch (error) {
		logger.debug('Could not get root metadata for DELETE', { error })
		// not end-to-end encrypted
		return next()
	}

	const metadata = await metadataStore.getRootMetadata(dirname(url.pathname)).catch(() => null)
	const isRootFolder = metadata === null

	context.req.headers.set('X-E2EE-SUPPORTED', 'true')
	if (isRootFolder) {
		logger.debug('Deleting e2ee root folder', { path: url.pathname })
		await handleDeleteRoot(
			url.pathname,
			context,
			next,
		)
	} else {
		logger.debug('Deleting e2ee sub-folder', { path: url.pathname })
		await handleDelete(
			url.pathname,
			context,
			next,
		)
	}

	// clear cache
	metadataStore.deleteMetadata(url.pathname)
}

/**
 * Handle DELETE for the e2ee root folder.
 *
 * @param path - The path of the root folder
 * @param context - The fetch context
 * @param next - The next middleware function
 */
async function handleDeleteRoot(path: string, context: FetchContext, next: () => Promise<void>) {
	const metadata = await metadataStore.getRootMetadata(path)
	const { id } = await metadataStore.getMetadata(path)
	// mark the metadata as deleted
	metadata.markAsDeleted()

	const lockToken = await api.lockFolder(id, metadata.counter)
	try {
		// save the updated metadata
		const rawMetadata = await metadata.export(await keyStore.getCertificate())
		await api.updateMetadata(
			id,
			stringify(rawMetadata.metadata),
			lockToken,
			rawMetadata.signature,
		)

		// now the proper delete
		context.req.headers.set('X-E2EE-SUPPORTED', 'true')
		context.req.headers.set('E2E-TOKEN', lockToken)
		await next()
	} finally {
		await api.unlockFolder(id, lockToken)
	}
}

/**
 * Handle deleteing within e2ee folders.
 *
 * From the RFC:
 * 1. Lock parent folder
 * 2. Update parent metadata to remove the file/folder
 * 3. If folder: delete its metadata (OCS API)
 * 4. Delete the file/folder
 * 5. Update parent metadata on the server
 * 6. Unlock parent folder
 *
 * @param path - The path of the target to delete
 * @param context - The fetch context
 * @param next - The middleware callback
 */
async function handleDelete(path: string, context: FetchContext, next: () => Promise<void>): Promise<void> {
	const filename = basename(path)
	const metadata = await metadataStore.getMetadata(path)
	const parentMetadata = await metadataStore.getMetadata(dirname(path))

	if (!parentMetadata.metadata.hasUuid(filename)) {
		logger.warn('File to delete not found in metadata', { filename })
		// The file is likely not end-to-end encrypted
		// or this is a bug of another client not updating the metadata properly
		return next()
	}

	const lockToken = await api.lockFolder(parentMetadata.id, parentMetadata.metadata.counter + 1)
	try {
		// delete from metadata
		if (parentMetadata.metadata.getFile(filename)) {
			parentMetadata.metadata.deleteFile(filename)
		} else {
			parentMetadata.metadata.deleteFolder(filename)
			// delete the metadata of the deleted folder
			await api.deleteMetadata(metadata.id, lockToken)
		}
		// now the proper delete
		context.req.headers.set('X-E2EE-SUPPORTED', 'true')
		context.req.headers.set('E2E-TOKEN', lockToken)
		await next()

		const rawMetadata = await parentMetadata.metadata.export(await keyStore.getCertificate())
		await api.updateMetadata(
			parentMetadata.id,
			stringify(rawMetadata.metadata),
			lockToken,
			rawMetadata.signature,
		)
		// make sure to empty the cache
		metadataStore.deleteMetadata(path)
	} finally {
		await api.unlockFolder(parentMetadata.id, lockToken)
	}
}
