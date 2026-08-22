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
import { decodePath } from '../services/path.ts'
import * as metadataStore from '../store/metadata.ts'
import * as taskStore from '../store/tasks.ts'

// `parseXML()` (see below) parses every PROPFIND response with `textNodeName: 'text'`
// and `attributeNamePrefix: '@'` (the `webdav` package's own defaults, see its
// `parseXML()`/`getParser()` in `source/tools/dav.ts`) - but `XMLBuilder` defaults to
// `textNodeName: '#text'`, `attributeNamePrefix: '@_'` and `ignoreAttributes: true`.
// Building with the builder's own defaults after parsing with the parser's therefore
// does not round-trip: any node whose text content ends up wrapped in an object (e.g.
// because the node also carries attributes) keeps sitting under the key `'text'`, which
// the builder - looking for `'#text'` - does not recognise as special and instead
// serialises as a literal `<text>` child element, corrupting the rebuilt response.
const XML_BUILDER_OPTIONS = { attributeNamePrefix: '@', textNodeName: 'text', ignoreAttributes: false }

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

	// This interceptor is a transparency layer on top of every single PROPFIND
	// request, including ones that have nothing to do with e2ee. If anything
	// below fails to parse or process the response - for whatever reason - we
	// must not let that take down the original, otherwise perfectly fine,
	// PROPFIND response with it. Worst case, e2ee placeholders are left
	// unresolved for this one request instead of the whole file listing
	// breaking (see #1991 for a case where an unencrypted instance with no
	// e2ee folders at all had every single PROPFIND fail because of this).
	try {
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

		await cacheMetadataFromPropfind(xml, isEncryptedNode, targetIsEncrypted)
		await replacePlaceholdersInPropfind(xml, isEncryptedNode)

		context.res = new Response(new XMLBuilder(XML_BUILDER_OPTIONS).build(xml), response)
	} catch (error) {
		logger.error('Failed to process PROPFIND response for e2ee, passing it through unmodified', { error, request: context.req })
	}
}

/**
 * Cache all e2ee metadata that is shipped as part of the PROPFIND response.
 *
 * @param xml - The XML response
 * @param isEncryptedNode - Whether a given response node is end-to-end encrypted
 * @param targetIsEncrypted - Whether the PROPFIND target itself is end-to-end encrypted
 */
async function cacheMetadataFromPropfind(
	xml: DAVResult,
	isEncryptedNode: (node: DAVResultResponse) => boolean,
	targetIsEncrypted: boolean,
): Promise<void> {
	for (const node of xml.multistatus.response) {
		if (!isEncryptedNode(node) || node.propstat === undefined) {
			continue
		}

		// An encrypted node in the response of an unencrypted target is an e2ee root,
		// and the name of an e2ee root is not encrypted - so its metadata is only
		// needed if the response reaches into it. Decrypting it either way would ask
		// the user for their recovery phrase just to list the folder the root sits in.
		if (!targetIsEncrypted && !hasContentsInResponse(xml, nodePath(node))) {
			logger.debug('Skipping metadata of a listed e2ee root', { node })
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
 * Check whether the response contains any node located inside the given path.
 *
 * @param xml - The XML response
 * @param path - The path of the folder to check
 */
function hasContentsInResponse(xml: DAVResult, path: string): boolean {
	return xml.multistatus.response.some((node) => nodePath(node).startsWith(`${path}/`))
}

/**
 * Get the path of a response node (its decoded href without trailing slash).
 *
 * The `href` is percent-encoded, while everything outside of the requests works
 * on decoded paths - including the keys of the metadata cache.
 *
 * @param node - The response node
 */
function nodePath(node: DAVResultResponse): string {
	return decodePath(node.href.replace(/\/+$/, ''))
}
