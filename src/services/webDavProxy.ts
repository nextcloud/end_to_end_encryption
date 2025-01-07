/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import { type DAVResult, type FileStat, type ResponseDataDetailed, type WebDAVClient, parseStat, parseXML } from 'webdav'
import { XMLBuilder } from 'fast-xml-parser'
import { basename, dirname } from 'path'

import { type Node } from '@nextcloud/files'
import { getCurrentUser } from '@nextcloud/auth'
import { getClient, getDefaultPropfind, resultToNode } from '@nextcloud/files/dav'

import type { FileEncryptionInfo, Metadata, MetadataInfo } from '../models'
import logger from './logger.ts'
import { decryptMetadataInfo, getMetadataPrivateKey } from './metadataUtils'
import { getMetadata, getPrivateKey, getServerPublicKey } from './api'
import { decryptPrivateKey } from './privateKeyUtils'
import { promptUserForMnemonic } from './mnemonicDialogs'
import { decryptWithAES, loadAESPrivateKey } from './crypto.ts'
import { base64ToBuffer } from './utils'

let originalFetch: typeof window.fetch
const davClient = getClient() as WebDAVClient
let privateKey: CryptoKey|undefined
let serverPublicKey: CryptoKey|undefined
const metadataCache: Record<string, Metadata> = {}

export function setupWebDavDecryptionProxy() {
	originalFetch = window.fetch
	logger.debug('Setting up WebDAV decryption proxy')

	window.fetch = async (input: RequestInfo | URL, config: RequestInit = {}): Promise<Response> => {
		let request = new Request(input, config)

		if (!(request.url.includes('/remote.php/') && (request.method === 'GET' || request.method === 'PROPFIND'))) {
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

	const rootMetadata = await getRootMetadataForPath(path)
	if (rootMetadata === undefined) {
		logger.debug('File is not part of e2ee folder', { path })
		return originalFetch(request)
	}

	const metadataInfo = await getMetadataInfoForPath(dirname(path), rootMetadata)

	const fileInfo = metadataInfo.files[basename(request.url)]
	if (fileInfo === undefined) {
		logger.debug('Could not find metadata info', { path, metadataInfo })
		throw new Error('Could not find file in metadata')
	}

	logger.debug('Fetching encrypted file', { request })
	return await decryptFile(await originalFetch(request), fileInfo)
}

async function handlePropFind(request: Request) {
	logger.debug('Fetching raw PROPFIND', { request })
	const response = await originalFetch(request)
	const path = new URL(request.url).pathname
	const body = await response.text()
	const xml = await parseXML(body)
	const stat = parseStat(xml, path, true)

	let metadataPath = path

	if (stat.type === 'directory') {
		if (stat.props?.['is-encrypted'] !== 1) {
			logger.debug('Folder is not e2ee', { xml })
			return new Response(body, response)
		}

		if (serverPublicKey === undefined) {
			serverPublicKey = await getServerPublicKey()
		}

		// Update cache for this path
		metadataCache[path] = await getMetadata(stat.props?.fileid as string, serverPublicKey)

		const rootMetadata = await getRootMetadataForPath(metadataPath)

		if (rootMetadata === undefined) {
			logger.debug('Cannot find root E2EE folder', { path })
			return new Response(body, response)
		}

		const metadataInfo = await getMetadataInfoForPath(metadataPath, rootMetadata)

		let parentMetadataInfo: MetadataInfo|undefined
		try {
			parentMetadataInfo = await getMetadataInfoForPath(dirname(metadataPath), rootMetadata)
		} catch (e) {}

		replacePlaceholdersInPropfind(xml, path, metadataInfo, parentMetadataInfo)
	}

	if (stat.type === 'file') {
		metadataPath = dirname(path)

		const rootMetadata = await getRootMetadataForPath(metadataPath)

		if (rootMetadata === undefined) {
			logger.debug('Cannot find root E2EE folder', { path })
			return new Response(body, response)
		}

		replacePlaceholdersInPropfind(xml, path, undefined, await getMetadataInfoForPath(metadataPath, rootMetadata))
	}

	return new Response(new XMLBuilder().build(xml), response)
}

export function replacePlaceholdersInPropfind(xml: DAVResult, folderPath: string, metadataInfo?: MetadataInfo, parentMetadataInfo?: MetadataInfo): void {
	logger.debug('Updating PROPFIND info', { folderPath, metadataInfo, parentMetadataInfo, xml })

	xml.multistatus.response.forEach((childNode) => {
		if (childNode.propstat === undefined) {
			return
		}

		let relevantMetadataInfo = metadataInfo
		if (childNode.href === folderPath && parentMetadataInfo) {
			relevantMetadataInfo = parentMetadataInfo
		}
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

async function getMetadataInfoForPath(path: string, rootMetadata: Metadata): Promise<MetadataInfo> {
	logger.debug('Getting metadata info', { path })

	const currentUser = getCurrentUser()
	if (!currentUser) {
		throw new Error('No user logged in')
	}

	if (privateKey === undefined) {
		privateKey = await decryptPrivateKey(await getPrivateKey(), await promptUserForMnemonic())
	}

	return await decryptMetadataInfo(
		await getMetadataForPath(path),
		await getMetadataPrivateKey(rootMetadata, currentUser.uid, privateKey),
	)
}

async function getFileIdForPath(path: string): Promise<string> {
	logger.debug('Getting file id', { path })

	const response = (await davClient.stat(decodeURI(path).replace('remote.php/dav/', ''), { details: true, data: getDefaultPropfind() })) as ResponseDataDetailed<FileStat>
	const node = resultToNode(response.data) as Node

	if (!node.fileid) {
		throw new Error('File ID not found')
	}

	return String(node.fileid)
}

async function getMetadataForPath(path: string): Promise<Metadata> {
	logger.debug('Getting metadata', { path, metadataCache })

	if (metadataCache[path]) {
		return metadataCache[path]
	}

	if (serverPublicKey === undefined) {
		serverPublicKey = await getServerPublicKey()
	}

	metadataCache[path] = await getMetadata(await getFileIdForPath(path), serverPublicKey)

	return metadataCache[path]
}

async function getRootMetadataForPath(path: string): Promise<Metadata|undefined> {
	logger.debug('Getting root metadata', { path, metadataCache })

	const metadataEntry = Object.entries(metadataCache)
		.filter(([, metadata]) => metadata.users !== undefined)
		.find(([rootPath]) => path.startsWith(rootPath))

	if (metadataEntry) {
		return metadataEntry[1]
	}

	while (path !== '/') {
		metadataCache[path] = await getMetadataForPath(path)

		if (metadataCache[path].users !== undefined) {
			return metadataCache[path]
		}

		path = dirname(path)
	}

	return undefined
}
