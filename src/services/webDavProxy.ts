/* eslint-disable jsdoc/require-jsdoc */
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { DAVResult, parseStat, parseXML } from 'webdav'
import { XMLBuilder } from 'fast-xml-parser'

import { decryptMetadataInfo } from './metadataUtils'
import { getMetadata, getPrivateKey } from './api'
import { decryptPrivateKey } from './privateKeyUtils'
import { promptUserForMnemonic } from './mnemonicDialogs'
import { getCurrentUser } from '@nextcloud/auth'
import { FileEncryptionInfo, Metadata, MetadataInfo } from '../models'
import { decryptWithAES, loadAESPrivateKey } from './crypto'
import { basename, dirname } from 'path'
import { base64ToBuffer } from './utils'

const originalFetch = window.fetch
let privateKey: CryptoKey|undefined

window.fetch = async (input: RequestInfo | URL, config: RequestInit = {}) => {
	const request = new Request(input, config)

	if (!(request.url.includes('/remote.php/') && (request.method === 'GET' || request.method === 'PROPFIND'))) {
		return await originalFetch(input, config)
	}

	config.headers = new Headers(config.headers)
	config.headers.set('X-E2EE-SUPPORTED', 'true')

	switch (config.method) {
	case 'PROPFIND':
		return handlePropFind(request, await originalFetch(input, config))
	case 'GET':
	default:
		return handleGet(request)
	}
}

const metadataInfos: Record<string, MetadataInfo> = {}

async function handleGet(request: Request) {
	console.log('GET', request.url)

	const parentPath = dirname(request.url)
	const propfindResponse = await fetch(parentPath, { method: 'PROPFIND' })
	const xml = await parseXML(await propfindResponse.text())
	const stat = parseStat(xml, parentPath, true)

	if (stat.props?.['is-encrypted'] !== 1) {
		return response
	}

	const metadataInfo = await getFolderMetadataInfo(stat.props.fileid as string)

	const filename = basename(request.url)
	const fileInfo = Object.entries(metadataInfo.files).find(([_, file]) => file.filename === filename)

	if (fileInfo === undefined) {
		throw new Error('Could not find file in metadata')
	}

	const [randomFileId, fileEncryptionInfo] = fileInfo

	request.url.replace(filename, randomFileId)

	const encryptedFileResponse = await originalFetch(request)

	return await decryptFile(encryptedFileResponse, metadataInfo, fileEncryptionInfo)
}

async function handlePropFind(request: Request, response: Response) {
	const path = new URL(request.url).pathname
	const xml = await parseXML(await response.text())
	const stat = parseStat(xml, path, true)

	if (stat.props?.['is-encrypted'] !== 1) {
		return response
	}

	if (privateKey === undefined) {
		// TODO: Store the private key?
		privateKey = await decryptPrivateKey(await getPrivateKey(), await promptUserForMnemonic())
	}

	const currentUser = getCurrentUser()
	if (!currentUser) {
		throw new Error('No user logged in')
	}

	replacePlaceholderInPropfind(
		xml,
		path,
		await getFolderMetadataInfo(stat.props.fileid as string),
	)

	return new Response(new XMLBuilder().build(xml), response)
}

export function replacePlaceholderInPropfind(xml: DAVResult, folderPath: string, metadataInfo: MetadataInfo): void {
	xml.multistatus.response.forEach((childNode) => {
		if (childNode.href === folderPath) {
			return
		}

		if (childNode.propstat === undefined) {
			return
		}

		const randomFileId = childNode.propstat.prop.displayname

		let name: string|undefined

		if (metadataInfo.files[randomFileId]) {
			name = metadataInfo.files[randomFileId].filename
			childNode.propstat.prop.getcontenttype = metadataInfo.files[randomFileId].mimetype
		} else if (metadataInfo.folders[randomFileId]) {
			name = metadataInfo.folders[randomFileId]
			childNode.propstat.prop.getcontenttype = 'httpd/unix-directory'
		} else {
			return
		}

		childNode.href = childNode.href.replace(randomFileId, name)
		childNode.propstat.prop.displayname = name
	})
}

async function getFolderMetadataInfo(fileId: string): Promise<MetadataInfo> {
	if (metadataInfos[fileId]) {
		return metadataInfos[fileId]
	}

	const currentUser = getCurrentUser()
	if (!currentUser) {
		throw new Error('No user logged in')

	}
	if (privateKey === undefined) {
		// TODO: Store the private key?
		privateKey = await decryptPrivateKey(await getPrivateKey(), await promptUserForMnemonic())
	}

	metadataInfos[fileId] = await decryptMetadataInfo(
		await getMetadata(fileId),
		currentUser.uid,
		privateKey,
	)

	return metadataInfos[fileId]
}

export async function decryptFile(response: Response, fileEncryptionInfo: FileEncryptionInfo): Promise<Response> {
	const filePrivateKey = await loadAESPrivateKey(base64ToBuffer(fileEncryptionInfo.key))

	const decryptedFileContent = await decryptWithAES(
		await response.arrayBuffer(),
		filePrivateKey,
		{ iv: base64ToBuffer(fileEncryptionInfo.nonce) },
	)

	return new Response(decryptedFileContent, response)
}
