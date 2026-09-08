/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'

import { dirname } from '@nextcloud/paths'
import { RootMetadata } from '../models/RootMetadata.ts'
import {
	DAV_NS,
	getHref,
	getProperty,
	getResponses,
	hasProperties,
	isCollection,
	NC_NS,
	OC_NS,
	parseMultiStatus,
	serializeDocument,
	setProperty,
} from '../services/davXml.ts'
import logger from '../services/logger.ts'
import { decodePath } from '../services/path.ts'
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
	const body = await response.text()

	const document = parseMultiStatus(body)
	if (document === undefined) {
		// not a multistatus response, e.g. an error - nothing to replace
		logger.debug('PROPFIND response is not a multistatus document', { body })
		return
	}

	const nodes = getResponses(document)

	// The requested node itself might not be encrypted while the result still contains
	// encrypted nodes, e.g. when listing an unencrypted folder that contains an e2ee root.
	// So the encryption state has to be decided for each node individually.
	const targetPath = trimSlashes(decodePath(new URL(context.req.url).pathname))
	// the target is the node for the requested path - it is reported first, which is the
	// fallback in case the server answers with a href we do not recognize as that path
	const target = nodes.find((node) => nodePath(node) === targetPath) ?? nodes[0]
	const targetIsEncrypted = target !== undefined && isEncrypted(target)
	const isEncryptedNode = (node: Element): boolean => (
		// all nodes within an encrypted PROPFIND target are encrypted as well
		targetIsEncrypted || isEncrypted(node)
	)

	if (!nodes.some(isEncryptedNode)) {
		logger.debug('No e2ee nodes in PROPFIND result', { body })
		return
	}

	await cacheMetadataFromPropfind(nodes, isEncryptedNode, targetIsEncrypted)
	await replacePlaceholdersInPropfind(nodes, isEncryptedNode)

	context.res = new Response(serializeDocument(document), response)
}

/**
 * Cache all e2ee metadata that is shipped as part of the PROPFIND response.
 *
 * @param nodes - The `d:response` nodes of the XML response
 * @param isEncryptedNode - Whether a given response node is end-to-end encrypted
 * @param targetIsEncrypted - Whether the PROPFIND target itself is end-to-end encrypted
 */
async function cacheMetadataFromPropfind(
	nodes: Element[],
	isEncryptedNode: (node: Element) => boolean,
	targetIsEncrypted: boolean,
): Promise<void> {
	for (const node of nodes) {
		if (!isEncryptedNode(node) || !hasProperties(node)) {
			continue
		}

		// An encrypted node in the response of an unencrypted target is an e2ee root,
		// and the name of an e2ee root is not encrypted - so its metadata is only
		// needed if the response reaches into it. Decrypting it either way would ask
		// the user for their recovery phrase just to list the folder the root sits in.
		if (!targetIsEncrypted && !hasContentsInResponse(nodes, nodePath(node))) {
			logger.debug('Skipping metadata of a listed e2ee root', { href: getHref(node) })
			continue
		}

		const fileId = getProperty(node, OC_NS, 'fileid')
		const rawMetadata = getProperty(node, NC_NS, 'e2ee-metadata')
		const metadataSignature = getProperty(node, NC_NS, 'e2ee-metadata-signature')
		if (isCollection(node) && fileId && rawMetadata && metadataSignature) {
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
 * @param nodes - The `d:response` nodes of the XML response
 * @param isEncryptedNode - Whether a given response node is end-to-end encrypted
 */
async function replacePlaceholdersInPropfind(nodes: Element[], isEncryptedNode: (node: Element) => boolean): Promise<void> {
	logger.debug('Updating PROPFIND info', { nodes })

	// Encryption state of all nodes in the response - used to look up whether the parent of a node is encrypted.
	const encryptedPaths = new Map<string, boolean>()
	for (const node of nodes) {
		encryptedPaths.set(nodePath(node), isEncryptedNode(node))
	}

	for (const node of nodes) {
		if (!isEncryptedNode(node)) {
			// e.g. an unencrypted sibling of an e2ee root - keep it untouched
			continue
		}

		if (!hasProperties(node)) {
			throw new Error('Invalid PROPFIND response: missing propstat')
		}

		const permissions = getProperty(node, OC_NS, 'permissions')
		if (permissions !== undefined) {
			// remove share permissions as we have internal sharing methods for e2ee
			setProperty(node, OC_NS, 'permissions', permissions.replace(/R/g, ''))
		}

		const isFolder = isCollection(node)
		if (!(await hasEncryptedParent(node, isFolder, encryptedPaths))) {
			// The node is an e2ee root: its name is not encrypted so only the permissions needed adjustment.
			logger.debug('Node is an e2ee root, skipping PROPFIND replacement', { href: getHref(node) })
			continue
		}

		const { metadata, path: parentPath } = await metadataStore.getMetadata(dirname(nodePath(node)))
		const identifier = getProperty(node, DAV_NS, 'displayname')
		if (isFolder) {
			const name = identifier && metadata.getFolder(identifier)
			if (!name) {
				logger.error('Could not find folder in metadata for PROPFIND replacement', { node, identifier, metadata })
				node.remove()
				continue
			}

			setProperty(node, DAV_NS, 'displayname', name)
			setProperty(node, DAV_NS, 'getcontenttype', 'httpd/unix-directory')
		} else {
			const info = identifier ? metadata.getFile(identifier) : undefined
			if (!info) {
				if (identifier && metadata instanceof RootMetadata && metadata.fileDropEntries.includes(identifier)) {
					logger.debug('File drop entry found for PROPFIND replacement', { node, identifier })
					if (permissions?.includes('NV')) {
						// we found a file drop entry and we have permissions to migrate it
						// so we do not want to block this request any longer but we should
						// notify the user that this entry needs migration
						taskStore.addFileDropMigration(parentPath)
					}

					node.remove()
					continue
				}

				logger.error('Could not find file in metadata for PROPFIND replacement', { node, identifier, metadata })
				node.remove()
				continue
			}

			setProperty(node, DAV_NS, 'displayname', info.filename)
			setProperty(node, DAV_NS, 'getcontenttype', info.mimetype)
		}
	}
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
async function hasEncryptedParent(node: Element, isFolder: boolean, encryptedPaths: Map<string, boolean>): Promise<boolean> {
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
 * @param nodes - The `d:response` nodes of the XML response
 * @param path - The path of the folder to check
 */
function hasContentsInResponse(nodes: Element[], path: string): boolean {
	return nodes.some((node) => nodePath(node).startsWith(`${path}/`))
}

/**
 * Check whether a response node is end-to-end encrypted.
 *
 * @param node - The response node
 */
function isEncrypted(node: Element): boolean {
	return getProperty(node, NC_NS, 'e2ee-is-encrypted') === '1'
}

/**
 * Get the path of a response node (its decoded href without trailing slash).
 *
 * The `href` is percent-encoded, while everything outside of the requests works
 * on decoded paths - including the keys of the metadata cache.
 *
 * @param node - The response node
 */
function nodePath(node: Element): string {
	return trimSlashes(decodePath(getHref(node)))
}

/**
 * Remove trailing slashes from a path, as folders are reported with one.
 *
 * @param path - The path to trim
 */
function trimSlashes(path: string): string {
	return path.replace(/\/+$/, '')
}
