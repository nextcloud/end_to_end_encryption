/* eslint-disable jsdoc/require-jsdoc */
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { parseStat, parseXML } from 'webdav'
import { XMLBuilder } from 'fast-xml-parser'

import type { Metadata } from '../models'
import { getMetadata } from './api'

const originalFetch = window.fetch

window.fetch = async (input: RequestInfo | URL, config: RequestInit = {}) => {
	const request = new Request(input, config)

	if (!(request.url.includes('/remote.php/') && (request.method === 'GET' || request.method === 'PROPFIND'))) {
		return await originalFetch(input, config)
	}

	config.headers = new Headers(config.headers)
	config.headers.set('X-E2EE-SUPPORTED', 'true')
	const response = await originalFetch(input, config)

	console.debug('[E2EE WebDAV proxy]', request.url, request)

	switch (config.method) {
	case 'PROPFIND':
		return handlePropFind(request, response)
	case 'GET':
	default:
		return handleGet(request, response)
	}
}

const e2eeFoldersMetadata: Record<string, Metadata> = {}

function isInE2eeFolder(url: string): boolean {
	for (const folder in e2eeFoldersMetadata) {
		if (url.startsWith(folder)) {
			return true
		}
	}

	return false
}

async function handleGet(request: Request, response: Response) {
	if (!isInE2eeFolder(request.url)) {
		return response
	}

	return new Response(response.body, response) // TODO: decrypt(response)
}

async function handlePropFind(request: Request, response: Response) {
	const path = new URL(request.url).pathname
	const body = await response.text()
	const xml = await parseXML(body)
	const stat = parseStat(xml, path, true)
	const isEncrypted = stat.props?.['is-encrypted'] === 1

	if (!isEncrypted) {
		return response
	}

	console.log('[E2EE SW]', 'PROPFIND xml', xml)

	e2eeFoldersMetadata[path] = await getMetadata(stat.props?.fileid ?? '')

	// xml.multistatus.response.forEach((childNode, i) => {
	// 	if (childNode.href === path) {
	// 		return
	// 	}

	// 	if (xml.multistatus.response[i].propstat === undefined) {
	// 		return
	// 	}

	// 	// TODO: replace basename, filename, size, creationDate, and type in xml
	// 	xml.multistatus.response[i].href = 'TODO'
	// 	xml.multistatus.response[i].propstat.prop.displayname = 'TODO'
	// 	xml.multistatus.response[i].propstat.prop.creationdate = 'TODO'
	// 	xml.multistatus.response[i].propstat.prop.getcontenttype = 'TODO'
	// })

	const builder = new XMLBuilder()
	const xmlContent = builder.build(xml)

	return new Response(xmlContent, response) // TODO: proxy(originalResponse)
}
