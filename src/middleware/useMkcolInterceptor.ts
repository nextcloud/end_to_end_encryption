/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'
import type { RootMetadata } from '../models/RootMetadata.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { Folder } from '@nextcloud/files'
import { defaultRootPath } from '@nextcloud/files/dav'
import stringify from 'safe-stable-stringify'
import { Metadata } from '../models/Metadata.ts'
import * as api from '../services/api.ts'
import logger from '../services/logger.ts'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'

/**
 * Callback to handle MKCOL requests.
 *
 * @param context - The fetch context
 * @param next - The next middleware function
 */
export async function useMkcolInterceptor(context: FetchContext, next: () => Promise<void>): Promise<void> {
	logger.debug('Handling MKCOL request', { request: context.req })

	const folder = new Folder({
		owner: getCurrentUser()!.uid,
		source: decodeURI(context.req.url),
		root: defaultRootPath,
	})

	let rootMetadata: RootMetadata
	try {
		rootMetadata = await metadataStore.getRootMetadata(folder.dirname)
	} catch (error) {
		logger.debug('Could not get root metadata for MKCOL', { error })
		// not end-to-end encrypted
		return next()
	}

	// it is end-to-end encrypted, proceed with creating the folder
	// first we need to ensure the keys are initialized
	await keyStore.loadPublicKey()
	await keyStore.loadPrivateKey()

	const originalName = folder.basename
	folder.rename(globalThis.crypto.randomUUID().replaceAll('-', ''))

	const parentMetadata = await metadataStore.getMetadata(folder.dirname)
	parentMetadata.metadata.addFolder(folder.basename, originalName)

	const parentLockToken = await api.lockFolder(parentMetadata.id, parentMetadata.metadata.counter)
	try {
		context.req = new Request(folder.encodedSource, context.req)
		context.req.headers.set('X-E2EE-SUPPORTED', 'true')
		context.req.headers.set('E2E-TOKEN', parentLockToken)
		logger.debug('Creating end-to-end encrypted folder', { originalName, name: folder.basename })
		await next()

		// then lock the new folder to set its metadata
		const fileId = Number.parseInt(context.res.headers.get('OC-FileId')!).toString()
		// create the new metadata
		const metadata = await Metadata.createNew(rootMetadata.key)
		const rawMetadata = await metadata.export(keyStore.getCertificate()!)
		logger.debug('Creating new metadata')
		await api.setFolderAsEncrypted(fileId)
		await api.createMetadata(
			fileId,
			stringify(rawMetadata.metadata),
			parentLockToken,
			rawMetadata.signature,
		)

		// Finally update the parent metadata
		const metadataRaw = await parentMetadata.metadata.export(keyStore.getCertificate()!)
		logger.debug('Update parent metadata')
		await api.updateMetadata(
			parentMetadata.id,
			stringify(metadataRaw.metadata),
			parentLockToken,
			metadataRaw.signature,
		)
		metadataStore.setMetadata(folder.path, fileId, metadata)
	} finally {
		// ensure we unlock the parent folder on failure
		await api.unlockFolder(parentMetadata.id, parentLockToken)
	}
}
