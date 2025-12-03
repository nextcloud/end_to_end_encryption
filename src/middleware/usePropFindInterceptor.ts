/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'
import type { DAVResult } from 'webdav'
import type { MetadataInfo } from '../models.ts'

import { dirname } from '@nextcloud/paths'
import { XMLBuilder } from 'fast-xml-parser'
import { parseStat, parseXML } from 'webdav'
import { isRootMetadata } from '../models.ts'
import logger from '../services/logger.ts'
import { state } from '../services/state.ts'

/**
 * Callback to handle GET requests.
 *
 * @param context - The fetch context
 * @param next - The next middleware function
 */
export async function usePropFindInterceptor(context: FetchContext, next: () => Promise<void>): Promise<void> {
	logger.debug('Fetching raw PROPFIND', { request: context.req })

	await next()
	const response = context.res.clone()
	const path = new URL(context.req.url).pathname
	const body = await response.text()
	const xml = await parseXML(body)
	const stat = parseStat(xml, path, true)

	if (!stat.props || String(stat.props['e2ee-is-encrypted']) !== '1') {
		logger.debug('Node is not e2ee', { xml })
		return
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
			return
		}

		replacePlaceholdersInPropfind(xml, path, undefined, parentMetadataInfo)
	}

	context.res = new Response(new XMLBuilder().build(xml), response)
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
