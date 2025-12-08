/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'

import { defaultRemoteURL } from '@nextcloud/files/dav'
import { basename, dirname, join } from '@nextcloud/paths'
import * as api from '../services/api.ts'
import logger from '../services/logger.ts'
import * as metadataStore from '../store/metadata.ts'

/**
 * Callback to handle COPY requests.
 *
 * @param context - The fetch context
 * @param next - The next middleware function
 */
export async function useCopyInterceptor(context: FetchContext, next: () => Promise<void>): Promise<void> {
	const destination = new URL(context.req.headers.get('Destination')!)
	const pathSrc = new URL(context.req.url).pathname
	const pathDst = destination.pathname

	if (pathSrc === pathDst) {
		return next() // this is invalid but let the server handle it
	}

	const metadataRootSrc = await metadataStore.getRootMetadata(pathSrc).catch(() => null)
	const metadataRootDest = await metadataStore.getRootMetadata(dirname(pathDst)).catch(() => null)

	if (metadataRootSrc === metadataRootDest && metadataRootSrc === null) {
		logger.debug('[COPY] Both source and destination are not end-to-end encrypted, passing through')
		return next()
	}

	logger.debug('[COPY] Handling COPY for end-to-end encrypted file/folder', { pathSrc, pathDst })
	// so at this point at least one of them is end-to-end encrypted, so we need:
	// 1. fetch (decrypted - if needed)
	// 2. upload (encrypted - if needed)
	// 3. update metadata on the receiving side

	// we need to know if the source is a folder:
	const base = new URL(defaultRemoteURL).pathname
	const davPath = pathSrc.replace(new RegExp(`^${base}`), '')
	const davPathDst = pathDst.replace(new RegExp(`^${base}`), '')

	const result = await api.getNodeStat(davPath)
	if (result.type === 'directory') {
		// if the source is e2ee we need to also use the displayname for the destination
		await copyFolder(davPath, join(dirname(davPathDst), result.props!.displayname || result.basename))
	} else {
		await copyFile(davPath, davPathDst)
	}
	context.res = new Response(null, { status: 201 })
}

/**
 * @param source - The source path
 * @param destination - The destination path
 */
async function copyFolder(source: string, destination: string): Promise<void> {
	logger.debug('[COPY] Copying folder', { source, destination })

	// create the target folder
	const response = await fetch(defaultRemoteURL + destination, {
		method: 'MKCOL',
		headers: {
			'OCS-APIRequest': 'true',
		},
	})
	if (!response.ok) {
		throw new Error('Failed to create target folder for COPY')
	}
	logger.debug('[COPY] Created directory', { destination })

	// check that we are not in the root of an encrypted folder
	const filename = basename(destination)
	const metadata = await metadataStore.getMetadata(dirname(destination)).catch(() => null)
	if (metadata && metadata.metadata.getUuid(filename)) {
		// this was a proxied mkcol - we need to adjust the destination to the UUID instead of the real name
		const uuid = metadata.metadata.getUuid(filename)!
		destination = join(dirname(destination), uuid)
		logger.debug('[COPY] Adjusted folder destination', { destination, uuid, filename })
	}

	const content = await api.getDirectoryContents(source)
	logger.debug('[COPY] Folder contents', { content, source })
	for (const result of content) {
		if (result.type === 'directory') {
			await copyFolder(result.filename, join(destination, result.props?.displayname || result.basename))
		} else {
			await copyFile(result.filename, join(destination, result.props?.displayname || result.basename))
		}
	}
}

/**
 * @param source - The source path
 * @param destination - The destination path
 */
async function copyFile(source: string, destination: string): Promise<void> {
	logger.debug('[COPY] Copying file', { source, destination })
	// 1. fetch the file (decryption is handled by interceptor)
	let response = await fetch(defaultRemoteURL + source)
	if (!response.ok) {
		throw new Error('Failed to fetch source file for COPY')
	}

	// 2. upload the file (encryption is handled by interceptor)
	response = await fetch(defaultRemoteURL + destination, {
		method: 'PUT',
		headers: {
			// keep the same content type
			'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
			'OCS-APIRequest': 'true',
		},
		body: await response.arrayBuffer(), // handle firefox
	})
	if (!response.ok) {
		throw new Error('Failed to upload file for COPY')
	}
}
