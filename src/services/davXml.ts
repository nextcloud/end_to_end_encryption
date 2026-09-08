/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Helpers to edit a WebDAV `multistatus` response in place.
 *
 * Interceptors have to hand the response on to whoever made the request, so the
 * document must survive the detour unchanged apart from the properties we
 * actually replace. Parsing it into a plain object and building a new document
 * from that does not do that: it drops namespace prefixes, turns attributes into
 * elements, coerces values into numbers and merges the `propstat` blocks.
 *
 * So the document is edited as a DOM tree instead - everything we do not touch is
 * serialized back exactly as the server sent it.
 */

/** Namespace of the WebDAV properties */
export const DAV_NS = 'DAV:'

/** Namespace of the ownCloud specific properties */
export const OC_NS = 'http://owncloud.org/ns'

/** Namespace of the Nextcloud specific properties */
export const NC_NS = 'http://nextcloud.org/ns'

/**
 * Parse a WebDAV `multistatus` document.
 *
 * Returns `undefined` if the body is not one - it might be invalid XML, an empty
 * body or a `d:error` document, none of which we want to touch.
 *
 * @param body - The raw response body
 */
export function parseMultiStatus(body: string): Document | undefined {
	// invalid XML yields a `parsererror` document instead of throwing,
	// which is covered by the check for the expected root element below
	const document = new DOMParser().parseFromString(body, 'application/xml')
	const root = document.documentElement
	if (root.namespaceURI !== DAV_NS || root.localName !== 'multistatus') {
		return undefined
	}

	return document
}

/**
 * Serialize a document back into a response body.
 *
 * @param document - The document to serialize
 */
export function serializeDocument(document: Document): string {
	const body = new XMLSerializer().serializeToString(document)
	// The XML declaration is not part of the DOM tree: Chromium keeps the one of the
	// parsed document, other engines drop it. It is optional, but adding it back keeps
	// the response as close to the original as possible.
	return body.startsWith('<?xml') ? body : `<?xml version="1.0"?>\n${body}`
}

/**
 * Get all `d:response` elements of a `multistatus` document.
 *
 * @param document - The `multistatus` document
 */
export function getResponses(document: Document): Element[] {
	return childElements(document.documentElement, DAV_NS, 'response')
}

/**
 * Get the `d:href` of a response - percent-encoded, as sent by the server.
 *
 * @param response - The `d:response` element
 */
export function getHref(response: Element): string {
	return childElements(response, DAV_NS, 'href')[0]?.textContent ?? ''
}

/**
 * Check whether the server returned any property for the given response,
 * meaning its properties can be read and replaced.
 *
 * @param response - The `d:response` element
 */
export function hasProperties(response: Element): boolean {
	return availableProperties(response) !== undefined
}

/**
 * Get the value of a property the server did return for the given response.
 *
 * Returns `undefined` if the property is not part of the response or was reported
 * as unavailable, so a missing property can be told apart from an empty one.
 *
 * @param response - The `d:response` element
 * @param namespace - Namespace of the property
 * @param name - Local name of the property
 */
export function getProperty(response: Element, namespace: string, name: string): string | undefined {
	const properties = availableProperties(response)
	if (properties === undefined) {
		return undefined
	}

	return childElements(properties, namespace, name)[0]?.textContent ?? undefined
}

/**
 * Set the value of a property of the given response.
 *
 * A property the server reported as unavailable - like the content type of a
 * folder - is moved over to the successful `d:propstat`, as it does have a value
 * now. A property that is missing entirely is created.
 *
 * @param response - The `d:response` element
 * @param namespace - Namespace of the property
 * @param name - Local name of the property
 * @param value - The value to set
 */
export function setProperty(response: Element, namespace: string, name: string, value: string): void {
	const properties = availableProperties(response)
	if (properties === undefined) {
		throw new Error('Invalid PROPFIND response: no successful propstat')
	}

	let property = childElements(properties, namespace, name)[0]
	if (property === undefined) {
		property = unavailableProperties(response)
			.flatMap((unavailable) => childElements(unavailable, namespace, name))[0]
			?? createProperty(response.ownerDocument, namespace, name)
		properties.append(property)
	}

	property.textContent = value
}

/**
 * Check whether a response describes a folder.
 *
 * @param response - The `d:response` element
 */
export function isCollection(response: Element): boolean {
	const properties = availableProperties(response)
	const resourcetype = properties && childElements(properties, DAV_NS, 'resourcetype')[0]
	return resourcetype !== undefined && childElements(resourcetype, DAV_NS, 'collection').length > 0
}

/**
 * Get the `d:prop` element holding the properties the server did return,
 * or `undefined` if the response has no successful `d:propstat` at all.
 *
 * @param response - The `d:response` element
 */
function availableProperties(response: Element): Element | undefined {
	const propstat = childElements(response, DAV_NS, 'propstat').find(isSuccessful)
	return propstat && childElements(propstat, DAV_NS, 'prop')[0]
}

/**
 * Get the `d:prop` elements holding the properties the server did not return,
 * e.g. because they do not apply to the resource - those elements are empty.
 *
 * @param response - The `d:response` element
 */
function unavailableProperties(response: Element): Element[] {
	return childElements(response, DAV_NS, 'propstat')
		.filter((propstat) => !isSuccessful(propstat))
		.flatMap((propstat) => childElements(propstat, DAV_NS, 'prop'))
}

/**
 * Check whether a `d:propstat` reports its properties as available.
 *
 * @param propstat - The `d:propstat` element
 */
function isSuccessful(propstat: Element): boolean {
	const status = childElements(propstat, DAV_NS, 'status')[0]?.textContent ?? ''
	return /\s2\d\d(\s|$)/.test(status)
}

/**
 * Create a property element, reusing the namespace prefix of the document so the
 * new element does not need a namespace declaration of its own.
 *
 * @param document - The document to create the element for
 * @param namespace - Namespace of the property
 * @param name - Local name of the property
 */
function createProperty(document: Document, namespace: string, name: string): Element {
	const prefix = document.documentElement.lookupPrefix(namespace)
	return document.createElementNS(namespace, prefix ? `${prefix}:${name}` : name)
}

/**
 * Get all direct child elements with the given namespace and local name.
 *
 * The DOM is queried by namespace instead of by tag name, as the prefixes are
 * chosen by the server and only their namespaces are part of the protocol.
 *
 * @param parent - The element to get the children of
 * @param namespace - Namespace of the children
 * @param name - Local name of the children
 */
function childElements(parent: Element, namespace: string, name: string): Element[] {
	return Array.from(parent.children)
		.filter((child) => child.namespaceURI === namespace && child.localName === name)
}
