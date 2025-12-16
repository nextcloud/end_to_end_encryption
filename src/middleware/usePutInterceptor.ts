/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'
import type { IMetadataFile } from '../models/metadata.d.ts'
import type { IStoreMetadata } from '../store/metadata.ts'

import { getUniqueName } from '@nextcloud/files'
import { basename, dirname, join } from '@nextcloud/paths'
import stringify from 'safe-stable-stringify'
import * as api from '../services/api.ts'
import { bufferToBase64 } from '../services/bufferUtils.ts'
import { encryptWithAES } from '../services/crypto.ts'
import logger from '../services/logger.ts'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'

/**
 * Callback to handle PUT requests.
 *
 * @param context - The fetch context
 * @param next - The next middleware function
 */
export async function usePutInterceptor(context: FetchContext, next: () => Promise<void>): Promise<void> {
	logger.debug('Handling PUT request', { request: context.req })

	const url = new URL(context.req.url)
	const path = url.pathname
	const filename = decodeURIComponent(basename(path))
	let metadata: IStoreMetadata
	try {
		metadata = await metadataStore.getMetadata(dirname(path))
	} catch (error) {
		logger.debug('Could not get root metadata for PUT', { error })
		// not end-to-end encrypted
		return next()
	}

	// it is end-to-end encrypted, proceed with creating the folder
	// first we need to ensure the keys are initialized
	await keyStore.loadPublicKey()
	await keyStore.loadPrivateKey()

	logger.debug('Encrypting file for PUT', { filename })
	const key = await globalThis.crypto.subtle.generateKey(
		{ name: 'AES-GCM', length: 256 },
		true,
		['encrypt', 'decrypt'],
	)
	const result = await encryptWithAES(await context.req.arrayBuffer(), key)

	logger.debug('Updating file in metadata', { filename })
	const fileInfo: IMetadataFile = {
		filename,
		mimetype: context.req.headers.get('Content-Type') || 'application/octet-stream',
		authenticationTag: bufferToBase64(result.tag),
		nonce: bufferToBase64(result.iv),
		key: bufferToBase64(new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', key))),
	}

	let uuid = filename
	if (metadata.metadata.getFile(filename)) {
		// in case this PUT request was an update then the "filename" is in reality the uuid
		fileInfo.filename = metadata.metadata.getFile(filename)!.filename
	} else {
		// otherwise this is a new file, generate a new uuid
		uuid = globalThis.crypto.randomUUID().replace(/-/g, '')
		// and make sure the name is unique
		fileInfo.filename = getUniqueName(fileInfo.filename, metadata.metadata.listContents())
	}
	metadata.metadata.addFile(uuid, fileInfo)

	logger.debug('Update metadata for added file', { metadata, filename })
	const lockToken = await api.lockFolder(metadata.id, metadata.metadata.counter)
	try {
		url.pathname = join(dirname(url.pathname), uuid)
		const headers = context.req.headers
		headers.set('Content-Type', 'application/octet-stream')
		headers.set('X-E2EE-SUPPORTED', 'true')
		headers.set('E2E-TOKEN', lockToken)
		context.req = new Request(url, {
			method: 'PUT',
			headers,
			body: result.encryptedContent,
		})
		await next()

		const { metadata: rawMetadata, signature } = await metadata.metadata.export(await keyStore.getCertificate())
		await api.updateMetadata(metadata.id, stringify(rawMetadata), lockToken, signature)
	} finally {
		await api.unlockFolder(metadata.id, lockToken)
	}
}
