/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'
import type { DAVResult, DAVResultResponse } from 'webdav'

import { dirname } from '@nextcloud/paths'
import { XMLBuilder } from 'fast-xml-parser'
import { parseStat, parseXML } from 'webdav'
import { RootMetadata } from '../models/RootMetadata.ts'
import logger from '../services/logger.ts'
import * as metadataStore from '../store/metadata.ts'
import * as taskStore from '../store/tasks.ts'

/**
 * Callback to handle PROPFIND requests.
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

	// The requested node itself might not be encrypted while the result still contains
	// encrypted nodes, e.g. when listing an unencrypted folder that contains an e2ee root.
	// So the encryption state has to be decided for each node individually.
	const targetIsEncrypted = stat.props !== undefined && String(stat.props['e2ee-is-encrypted']) === '1'
	const isEncryptedNode = (node: DAVResultResponse): boolean => (
		// all nodes within an encrypted PROPFIND target are encrypted as well
		targetIsEncrypted
		|| String(node.propstat?.prop['e2ee-is-encrypted']) === '1'
	)

	if (!xml.multistatus.response.some(isEncryptedNode)) {
		logger.debug('No e2ee nodes in PROPFIND result', { xml })
		return
	}

	await cacheMetadataFromPropfind(xml, isEncryptedNode)
	await replacePlaceholdersInPropfind(xml, isEncryptedNode)

	context.res = new Response(new XMLBuilder().build(xml), response)
}

/**
 * Cache all e2ee metadata that is shipped as part of the PROPFIND response.
 *
 * @param xml - The XML response
 * @param isEncryptedNode - Whether a given response node is end-to-end encrypted
 */
async function cacheMetadataFromPropfind(xml: DAVResult, isEncryptedNode: (node: DAVResultResponse) => boolean): Promise<void> {
	for (const node of xml.multistatus.response) {
		if (!isEncryptedNode(node) || node.propstat === undefined) {
			continue
		}

		const isFolder = typeof node.propstat.prop?.resourcetype.collection !== 'undefined'
		const {
			fileid: fileId,
			'e2ee-metadata': rawMetadata,
			'e2ee-metadata-signature': metadataSignature,
		} = node.propstat.prop as Record<string, string>
		if (isFolder && fileId && rawMetadata && metadataSignature) {
			await metadataStore.setRawMetadata(
				nodePath(node),
				fileId,
				rawMetadata,
				metadataSignature,
			)
		}
	}
}

/**
 * Replace the encrypted placeholder names and mimetypes of all encrypted nodes
 * with the real ones from the metadata of their parent folder.
 *
 * @param xml - The XML response
 * @param isEncryptedNode - Whether a given response node is end-to-end encrypted
 */
async function replacePlaceholdersInPropfind(xml: DAVResult, isEncryptedNode: (node: DAVResultResponse) => boolean): Promise<void> {
	logger.debug('Updating PROPFIND info', { xml })

	// Encryption state of all nodes in the response - used to look up whether the parent of a node is encrypted.
	const encryptedPaths = new Map<string, boolean>()
	for (const node of xml.multistatus.response) {
		encryptedPaths.set(nodePath(node), isEncryptedNode(node))
	}

	const parsedNodes: DAVResultResponse[] = []
	for (const node of xml.multistatus.response) {
		if (!isEncryptedNode(node)) {
			// e.g. an unencrypted sibling of an e2ee root - keep it untouched
			parsedNodes.push(node)
			continue
		}

		if (node.propstat === undefined) {
			throw new Error('Invalid PROPFIND response: missing propstat')
		}

		if (node.propstat.prop.permissions) {
			// remove share permissions as we have internal sharing methods for e2ee
			node.propstat.prop.permissions = (node.propstat.prop.permissions as string).replace(/R/g, '')
		}

		const isFolder = typeof node.propstat.prop?.resourcetype.collection !== 'undefined'
		if (!(await hasEncryptedParent(node, isFolder, encryptedPaths))) {
			// The node is an e2ee root: its name is not encrypted so only the permissions needed adjustment.
			logger.debug('Node is an e2ee root, skipping PROPFIND replacement', { node })
			parsedNodes.push(node)
			continue
		}

		const { metadata, path: parentPath } = await metadataStore.getMetadata(dirname(nodePath(node)))
		const identifier = node.propstat.prop.displayname
		if (isFolder) {
			const name = metadata.getFolder(identifier)
			if (!name) {
				logger.error('Could not find folder in metadata for PROPFIND replacement', { node, identifier, metadata })
				continue
			}

			node.propstat.prop.displayname = name
			node.propstat.prop.getcontenttype = 'httpd/unix-directory'
		} else {
			const info = metadata.getFile(identifier)
			if (!info) {
				if (metadata instanceof RootMetadata && metadata.fileDropEntries.includes(identifier)) {
					logger.debug('File drop entry found for PROPFIND replacement', { node, identifier })
					if (node.propstat.prop.permissions && (node.propstat.prop.permissions as string).includes('NV')) {
						// we found a file drop entry and we have permissions to migrate it
						// so we do not want to block this request any longer but we should
						// notify the user that this entry needs migration
						taskStore.addFileDropMigration(parentPath)
					}

					continue
				}

				logger.error('Could not find file in metadata for PROPFIND replacement', { node, identifier, metadata })
				continue
			}

			node.propstat.prop.displayname = info.filename
			node.propstat.prop.getcontenttype = info.mimetype
		}
		parsedNodes.push(node)
	}
	xml.multistatus.response = parsedNodes
}

/**
 * Check whether the parent folder of the given node is encrypted,
 * meaning the name of the node is a placeholder that needs to be replaced.
 * If the parent is not encrypted the node itself is an e2ee root.
 *
 * @param node - The response node to check
 * @param isFolder - Whether the node is a folder
 * @param encryptedPaths - Encryption state of all nodes in the response
 */
async function hasEncryptedParent(node: DAVResultResponse, isFolder: boolean, encryptedPaths: Map<string, boolean>): Promise<boolean> {
	const parentState = encryptedPaths.get(dirname(nodePath(node)))
	if (parentState !== undefined) {
		return parentState
	}

	// The parent is not part of the response, so this node is the PROPFIND target itself.
	if (!isFolder) {
		// an encrypted file is always located inside an encrypted folder
		return true
	}

	// Only an e2ee root has root metadata, every other encrypted folder has an encrypted parent.
	const { metadata } = await metadataStore.getMetadata(nodePath(node))
	return !(metadata instanceof RootMetadata)
}

/**
 * Get the path of a response node (its href without trailing slash).
 *
 * @param node - The response node
 */
function nodePath(node: DAVResultResponse): string {
	return node.href.replace(/\/+$/, '')
}
