/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'
import type { IMetadataFile } from '../models/metadata.d.ts'
import type { Metadata } from '../models/Metadata.ts'

import { basename, dirname } from '@nextcloud/paths'
import { base64ToBuffer } from '../services/bufferUtils.ts'
import { decryptWithAES, loadAESPrivateKey } from '../services/crypto.ts'
import logger from '../services/logger.ts'
import * as metadataStore from '../store/metadata.ts'

/**
 * Callback to handle GET requests.
 *
 * @param context - The fetch context
 * @param next - The next middleware function
 */
export async function useGetInterceptor(context: FetchContext, next: () => Promise<void>): Promise<void> {
	const path = new URL(context.req.url).pathname

	await next()
	const response = context.res.clone()

	let metadata: Metadata
	try {
		// TODO: Optimize, this will make a propfind request for every GET request even when not encrypted.
		metadata = (await metadataStore.getMetadata(dirname(path))).metadata
	} catch {
		// not end-to-end encrypted
		return
	}

	const fileInfo = metadata.getFile(basename(path))
	if (fileInfo === undefined) {
		logger.debug('Could not find file in metadata', { path, metadata })
		throw new Error('Could not find file in metadata')
	}

	context.res = await decryptFile(response, fileInfo)
}

/**
 * Decrypts a file from a fetch response using the provided file encryption info.
 *
 * @param response - The fetch response
 * @param fileInfo - The file encryption info
 */
async function decryptFile(response: Response, fileInfo: IMetadataFile): Promise<Response> {
	logger.debug('Decrypting encrypted file', { response, fileInfo })
	const decryptedFileContent = await decryptWithAES(
		new Uint8Array(await response.arrayBuffer()),
		await loadAESPrivateKey(base64ToBuffer(fileInfo.key)),
		{ iv: base64ToBuffer(fileInfo.nonce) },
	)

	const headers = new Headers(response.headers)
	headers.set('Content-Type', fileInfo.mimetype)

	return new Response(
		decryptedFileContent,
		// ensure to keep headers and status.
		// We cannot just pass the response here as some browsers will then also use the original body
		{
			status: response.status,
			statusText: response.statusText,
			headers,
		},
	)
}
