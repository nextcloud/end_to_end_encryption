/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DAVResult } from 'webdav'
import type { FileEncryptionInfo, MetadataInfo } from '../models.ts'

import { XMLBuilder } from 'fast-xml-parser'
import { basename, dirname } from 'path'
import { parseStat, parseXML } from 'webdav'
import { isRootMetadata } from '../models.ts'
import { base64ToBuffer } from './bufferUtils.ts'
import { decryptWithAES, loadAESPrivateKey } from './crypto.ts'
import logger from './logger.ts'
import { state } from './state.ts'

let originalFetch: typeof window.fetch

/**
 * Sets up a proxy for WebDAV requests to handle decryption of files and metadata.
 */
export function setupWebDavDecryptionProxy() {
	originalFetch = window.fetch
	logger.debug('Setting up WebDAV decryption proxy')

	window.fetch = async (input: RequestInfo | URL, config: RequestInit = {}): Promise<Response> => {
		let request = new Request(input, config)

		if (!(request.url.includes('/remote.php/dav/files/') && (request.method === 'GET' || request.method === 'PROPFIND'))) {
			return originalFetch(request)
		}

		logger.debug(`Proxying ${request.method} ${request.url}`, { request })

		const headers = new Headers(request.headers)
		headers.set('X-E2EE-SUPPORTED', 'true')
		request = new Request(request, { headers })

		switch (request.method) {
			case 'PROPFIND':
				return handlePropFind(request)
			case 'GET':
			default:
				return handleGet(request)
		}
	}
}

/**
 * Callback to handle GET requests.
 *
 * @param request - The fetch request
 */
async function handleGet(request: Request): Promise<Response> {
	const path = new URL(request.url).pathname
	const responsePromise = originalFetch(request)

	try {
		// TODO: Optimize, this will make a propfind request for every GET request even when not encrypted.
		const metadataInfo = await state.getMetadataInfo(dirname(path))

		const fileInfo = metadataInfo.files[basename(request.url)]
		if (fileInfo === undefined) {
			logger.debug('Could not find file in metadata', { path, metadataInfo })
			throw new Error('Could not find file in metadata')
		}

		return await decryptFile(await responsePromise, fileInfo)
	} catch {
		return await responsePromise
	}
}

/**
 * @param request - The fetch request
 */
async function handlePropFind(request: Request) {
	logger.debug('Fetching raw PROPFIND', { request })
	const response = await originalFetch(request)
	const path = new URL(request.url).pathname
	const body = await response.text()
	const xml = await parseXML(body)
	const stat = parseStat(xml, path, true)

	if (stat.props?.['e2ee-is-encrypted'] !== 1) {
		logger.debug('Node is not e2ee', { xml })
		return new Response(body, response)
	}

	if (stat.type === 'directory') {
		const rawMetadata = stat.props['e2ee-metadata'] as string | undefined
		const metadataSignature = stat.props['e2ee-metadata-signature'] as string | undefined
		if (rawMetadata !== undefined && metadataSignature !== undefined) {
			await state.setMetadata(
				path,
				rawMetadata,
				metadataSignature,
			)
		}

		const metadata = await state.getMetadata(path)
		const metadataInfo = await state.getMetadataInfo(path)

		if (isRootMetadata(metadata)) {
			replacePlaceholdersInPropfind(xml, path, metadataInfo)
		} else {
			const parentMetadataInfo = await state.getMetadataInfo(dirname(path))
			replacePlaceholdersInPropfind(xml, path, metadataInfo, parentMetadataInfo)
		}
	} else if (stat.type === 'file') {
		const parentMetadataInfo = await state.getMetadataInfo(dirname(path))

		if (parentMetadataInfo === undefined) {
			logger.debug('Cannot find metadata for parent folder', { path })
			return new Response(body, response)
		}

		replacePlaceholdersInPropfind(xml, path, undefined, parentMetadataInfo)
	}

	return new Response(new XMLBuilder().build(xml), response)
}

/**
 * @param xml - The XML response
 * @param path - The path of the file or folder
 * @param decryptedMetadata - The decrypted metadata for the file or folder
 * @param decryptedParentMetadata - The decrypted metadata for the parent folder
 */
export function replacePlaceholdersInPropfind(xml: DAVResult, path: string, decryptedMetadata?: MetadataInfo, decryptedParentMetadata?: MetadataInfo): void {
	logger.debug('Updating PROPFIND info', { path, decryptedMetadata, decryptedParentMetadata, xml })

	xml.multistatus.response.forEach((childNode) => {
		if (childNode.propstat === undefined) {
			return
		}

		const relevantMetadataInfo = childNode.href === path ? decryptedParentMetadata : decryptedMetadata

		const identifier = childNode.propstat.prop.displayname
		let name = identifier

		if (relevantMetadataInfo !== undefined) {
			if (relevantMetadataInfo.files[identifier]) {
				name = relevantMetadataInfo.files[identifier].filename
				childNode.propstat.prop.getcontenttype = relevantMetadataInfo.files[identifier].mimetype
			} else if (relevantMetadataInfo.folders[identifier]) {
				name = relevantMetadataInfo.folders[identifier]
				childNode.propstat.prop.getcontenttype = 'httpd/unix-directory'
			}
		}

		childNode.propstat.prop.displayname = name
		// TODO: Enable more feature by keeping permissions
		childNode.propstat.prop.permissions = (childNode.propstat.prop.permissions as string).replace(/(R)|(D)|(N)|(V)|(W)|(CK)/g, '')
	})
}

/**
 * Decrypts a file from a fetch response using the provided file encryption info.
 *
 * @param response - The fetch response
 * @param fileEncryptionInfo - The file encryption info
 */
export async function decryptFile(response: Response, fileEncryptionInfo: FileEncryptionInfo): Promise<Response> {
	logger.debug('Decrypting encrypted file', { response, fileEncryptionInfo })
	const decryptedFileContent = await decryptWithAES(
		new Uint8Array(await response.arrayBuffer()),
		await loadAESPrivateKey(base64ToBuffer(fileEncryptionInfo.key)),
		{ iv: base64ToBuffer(fileEncryptionInfo.nonce) },
	)

	const headers = new Headers(response.headers)
	headers.set('Content-Type', fileEncryptionInfo.mimetype)

	return new Response(decryptedFileContent, { ...response, headers })
}
