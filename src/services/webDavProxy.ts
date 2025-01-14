/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import { type DAVResult, parseStat, parseXML } from 'webdav'
import { XMLBuilder } from 'fast-xml-parser'
import { basename, dirname } from 'path'

import { state } from './state.ts'
import { isRootMetadata, type FileEncryptionInfo, type MetadataInfo } from '../models'
import logger from './logger.ts'
import { decryptWithAES, loadAESPrivateKey } from './crypto.ts'
import { base64ToBuffer } from './bufferUtils.ts'

let originalFetch: typeof window.fetch

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

async function handleGet(request: Request): Promise<Response> {
	const path = new URL(request.url).pathname
	const responsePromise = originalFetch(request)

	try {
		const metadataInfo = await state.getMetadataInfo(dirname(path))

		const fileInfo = metadataInfo.files[basename(request.url)]
		if (fileInfo === undefined) {
			logger.debug('Could not find file in metadata', { path, metadata })
			throw new Error('Could not find file in metadata')
		}

		logger.debug('Fetching encrypted file', { request })
		return await decryptFile(await responsePromise, fileInfo)
	} catch (error) {
		return await responsePromise
	}
}

async function handlePropFind(request: Request) {
	logger.debug('Fetching raw PROPFIND', { request })
	const response = await originalFetch(request)
	const path = new URL(request.url).pathname
	const body = await response.text()
	const xml = await parseXML(body)
	const stat = parseStat(xml, path, true)

	if (stat.type === 'directory') {
		if (stat.props?.['is-encrypted'] !== 1) {
			logger.debug('Folder is not e2ee', { xml })
			return new Response(body, response)
		}

		const rawMetadata = stat.props['e2ee-metadata'] as string|undefined
		const metadataSignature = stat.props['e2ee-metadata-signature'] as string|undefined
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

export function replacePlaceholdersInPropfind(xml: DAVResult, path: string, decryptedMetadata?: MetadataInfo, decryptedParentMetadata?: MetadataInfo): void {
	logger.debug('Updating PROPFIND info', { path, decryptedMetadata, decryptedParentMetadata, xml })

	xml.multistatus.response.forEach((childNode) => {
		if (childNode.propstat === undefined) {
			return
		}

		const relevantMetadataInfo = childNode.href === path ? decryptedParentMetadata : decryptedMetadata

		if (relevantMetadataInfo === undefined) {
			return
		}

		const identifier = childNode.propstat.prop.displayname
		let name = identifier

		if (relevantMetadataInfo.files[identifier]) {
			name = relevantMetadataInfo.files[identifier].filename
			childNode.propstat.prop.getcontenttype = relevantMetadataInfo.files[identifier].mimetype
		} else if (relevantMetadataInfo.folders[identifier]) {
			name = relevantMetadataInfo.folders[identifier]
			childNode.propstat.prop.getcontenttype = 'httpd/unix-directory'
		}

		childNode.propstat.prop.displayname = name
		// TODO: Enable more feature by keeping permissions
		childNode.propstat.prop.permissions = (childNode.propstat.prop.permissions as string).replace(/(R)|(D)|(N)|(V)|(W)|(CK)/g, '')
	})
}

export async function decryptFile(response: Response, fileEncryptionInfo: FileEncryptionInfo): Promise<Response> {
	const decryptedFileContent = await decryptWithAES(
		new Uint8Array(await response.arrayBuffer()),
		await loadAESPrivateKey(base64ToBuffer(fileEncryptionInfo.key)),
		{ iv: base64ToBuffer(fileEncryptionInfo.nonce) },
	)

	return new Response(decryptedFileContent, response)
}
