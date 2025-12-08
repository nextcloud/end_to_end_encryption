/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'
import type { DAVResult, DAVResultResponse } from 'webdav'
import type { Metadata } from '../models/Metadata.ts'

import { dirname } from '@nextcloud/paths'
import { XMLBuilder } from 'fast-xml-parser'
import { parseStat, parseXML } from 'webdav'
import { RootMetadata } from '../models/RootMetadata.ts'
import logger from '../services/logger.ts'
import * as metadataStore from '../store/metadata.ts'

/**
 * Callback to handle GET requests.
 *
 * @param context - The fetch context
 * @param next - The next middleware function
 */
export async function usePropFindInterceptor(context: FetchContext, next: () => Promise<void>): Promise<void> {
	logger.debug('Fetching raw PROPFIND', { request: context.req })

	context.req.headers.set('X-E2EE-SUPPORTED', 'true')
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
		const {
			fileid: fileId,
			'e2ee-metadata': rawMetadata,
			'e2ee-metadata-signature': metadataSignature,
		} = stat.props! as Record<string, string>
		if (fileId && rawMetadata && metadataSignature) {
			await metadataStore.setRawMetadata(
				path,
				fileId,
				rawMetadata,
				metadataSignature,
			)
		}

		const metadata = await metadataStore.getMetadata(path)

		if (metadata.metadata instanceof RootMetadata) {
			replacePlaceholdersInPropfind(xml, path, metadata.metadata)
		} else {
			const { metadata: parentMetadata } = await metadataStore.getMetadata(dirname(metadata.path))
			replacePlaceholdersInPropfind(xml, path, metadata.metadata, parentMetadata)
		}
	} else if (stat.type === 'file') {
		const { metadata, path: parentPath } = await metadataStore.getMetadata(dirname(path))
		replacePlaceholdersInPropfind(xml, parentPath, metadata)
	}

	context.res = new Response(new XMLBuilder().build(xml), response)
}

/**
 * @param xml - The XML response
 * @param path - The path of the file or folder
 * @param metadata - The metadata for the file or folder
 * @param parentMetadata - The metadata for the parent folder
 */
function replacePlaceholdersInPropfind(xml: DAVResult, path: string, metadata: Metadata, parentMetadata?: Metadata): void {
	logger.debug('Updating PROPFIND info', { path, metadata, parentMetadata, xml })

	const parsedNodes: DAVResultResponse[] = []
	for (const childNode of xml.multistatus.response) {
		if (childNode.propstat === undefined) {
			throw new Error('Invalid PROPFIND response: missing propstat')
		}

		if (childNode.propstat.prop.permissions) {
			// remove share permissions as we have internal sharing methods for e2ee
			childNode.propstat.prop.permissions = (childNode.propstat.prop.permissions as string).replace(/R/g, '')
		}

		const currentMetadata = depths(childNode.href) <= depths(path) ? parentMetadata : metadata
		if (!currentMetadata) {
			logger.debug('No current metadata found, skipping PROPFIND replacement (likely the e2ee root)', { path, childNode, metadata, parentMetadata })
			parsedNodes.push(childNode)
			continue
		}

		const identifier = childNode.propstat.prop.displayname
		const isFolder = typeof childNode.propstat.prop?.resourcetype.collection !== 'undefined'
		if (isFolder) {
			const name = currentMetadata.getFolder(identifier)
			if (!name) {
				logger.error('Could not find folder in metadata for PROPFIND replacement', { path, childNode, identifier, currentMetadata })
				continue
			}

			childNode.propstat.prop.displayname = name
			childNode.propstat.prop.getcontenttype = 'httpd/unix-directory'
		} else {
			const info = currentMetadata.getFile(identifier)
			if (!info) {
				logger.error('Could not find file in metadata for PROPFIND replacement', { path, childNode, identifier, currentMetadata })
				continue
			}

			childNode.propstat.prop.displayname = info.filename
			childNode.propstat.prop.getcontenttype = info.mimetype
		}
		parsedNodes.push(childNode)
	}
	xml.multistatus.response = parsedNodes
}

/**
 * Checks the depth of a folder path.
 *
 * @param folder - The folder path
 */
function depths(folder: string): number {
	return folder
		.split('/')
		.filter(Boolean)
		.length
}
