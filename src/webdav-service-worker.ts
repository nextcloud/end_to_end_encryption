/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { parseStat, parseXML } from 'webdav'
import { XMLBuilder } from 'fast-xml-parser'

declare const self: ServiceWorkerGlobalScope

self.skipWaiting()
self.clients.claim()

self.addEventListener('fetch', async (event: FetchEvent) => {
	const url = event.request.url

	if (!url.includes('/remote.php/')) {
		return
	}

	console.debug('[E2EE SW]', event.request.method, url, event)

	const request = addE2EESupportHeader(event.request)
	const response = await fetch(request)

	console.log('[E2EE SW]', request.method, request.url, request, response)

	switch (request.method) {
	case 'GET':
		event.respondWith(handleGet(request, response))
		break
	case 'PROPFIND':
		event.respondWith(handlePropFind(request, response))
		break
	}
})

const e2eeFolders: Record<string, boolean> = {}

/**
 *
 * @param url
 */
function isInE2eeFolder(url: string): boolean {
	for (const folder in e2eeFolders) {
		if (url.startsWith(folder)) {
			return true
		}
	}

	return false
}

/**
 *
 * @param request
 */
function addE2EESupportHeader(request: Request): Request {
	const headers = new Headers(request.headers)
	headers.append('x-e2ee-supported', 'true')

	return new Request(request, {
		headers,
	})
}

/**
 *
 * @param event
 * @param request
 * @param response
 */
async function handleGet(request: Request, response: Response) {
	if (!isInE2eeFolder(request.url)) {
		return response
	}

	return new Response(response.body) // TODO: decrypt(response)
}

/**
 *
 * @param event
 * @param request
 * @param response
 */
async function handlePropFind(request: Request, response: Response) {
	const path = new URL(request.url).pathname
	const body = await response.text()
	const xml = await parseXML(body)
	const stat = parseStat(xml, path, true)
	const isEncrypted = stat.props?.['is-encrypted'] === 1

	console.log('[E2EE SW]', 'PROPFIND xml', xml)

	if (isEncrypted) {
		e2eeFolders[path] = true
		console.log(e2eeFolders)
	}

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

	return new Response(xmlContent) // TODO: proxy(originalResponse)
}

// We need an export to force this file to act like a module, so TS will let us re-type `self`
export default null
