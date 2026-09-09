/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
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
} from './davXml.ts'

const multiStatus = `<?xml version="1.0"?>
<d:multistatus xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
	<d:response>
		<d:href>/remote.php/dav/files/admin/New%20folder/</d:href>
		<d:propstat>
			<d:prop>
				<d:displayname>New folder</d:displayname>
				<d:resourcetype><d:collection /></d:resourcetype>
				<oc:permissions>RGDNVCK</oc:permissions>
				<nc:e2ee-is-encrypted>1</nc:e2ee-is-encrypted>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
		<d:propstat>
			<d:prop>
				<d:getcontenttype />
			</d:prop>
			<d:status>HTTP/1.1 404 Not Found</d:status>
		</d:propstat>
	</d:response>
	<d:response>
		<d:href>/remote.php/dav/files/admin/New%20folder/file</d:href>
		<d:propstat>
			<d:prop>
				<d:displayname>file</d:displayname>
				<d:resourcetype />
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>
</d:multistatus>`

/**
 * Get the response node at the given index of the test document.
 *
 * @param index - Index of the response node
 */
function response(index: number): Element {
	return getResponses(parseMultiStatus(multiStatus)!)[index]!
}

describe('parseMultiStatus', () => {
	test('parses a multistatus document', () => {
		const document = parseMultiStatus(multiStatus)
		expect(document).toBeDefined()
		expect(getResponses(document!)).toHaveLength(2)
	})

	test.for([
		['invalid XML', '<d:multistatus'],
		['an empty body', ''],
		['a plain text body', 'Not found'],
		['another document', '<d:error xmlns:d="DAV:"><s:message /></d:error>'],
	])('rejects %s', ([, body]) => {
		expect(parseMultiStatus(body!)).toBeUndefined()
	})
})

describe('getProperty', () => {
	test('reads a property', () => {
		expect(getProperty(response(0), DAV_NS, 'displayname')).toBe('New folder')
		expect(getProperty(response(0), OC_NS, 'permissions')).toBe('RGDNVCK')
		expect(getProperty(response(0), NC_NS, 'e2ee-is-encrypted')).toBe('1')
	})

	test('does not read a property of another namespace', () => {
		expect(getProperty(response(0), NC_NS, 'displayname')).toBeUndefined()
	})

	test('does not read an unavailable property', () => {
		// the content type is only part of the failed propstat
		expect(getProperty(response(0), DAV_NS, 'getcontenttype')).toBeUndefined()
	})
})

describe('setProperty', () => {
	test('replaces an available property', () => {
		const node = response(0)
		setProperty(node, DAV_NS, 'displayname', 'Vacation')
		expect(getProperty(node, DAV_NS, 'displayname')).toBe('Vacation')
		expect(serializeDocument(node.ownerDocument)).toContain('<d:displayname>Vacation</d:displayname>')
	})

	test('escapes the new value', () => {
		const node = response(0)
		setProperty(node, DAV_NS, 'displayname', 'a & b <c>')
		expect(serializeDocument(node.ownerDocument)).toContain('<d:displayname>a &amp; b &lt;c&gt;</d:displayname>')
	})

	test('moves an unavailable property over to the available ones', () => {
		const node = response(0)
		setProperty(node, DAV_NS, 'getcontenttype', 'httpd/unix-directory')

		expect(getProperty(node, DAV_NS, 'getcontenttype')).toBe('httpd/unix-directory')
		// the property is gone from the failed propstat, as it does have a value now
		const failed = node.ownerDocument.evaluate(
			'count(//*[local-name()="status"][contains(text(),"404")]/../*[local-name()="prop"]/*)',
			node.ownerDocument,
			null,
			XPathResult.NUMBER_TYPE,
		)
		expect(failed.numberValue).toBe(0)
	})

	test('creates a missing property with the prefix of the document', () => {
		const node = response(1)
		setProperty(node, OC_NS, 'permissions', 'GDNVW')

		expect(getProperty(node, OC_NS, 'permissions')).toBe('GDNVW')
		expect(serializeDocument(node.ownerDocument)).toContain('<oc:permissions>GDNVW</oc:permissions>')
	})
})

describe('response helpers', () => {
	test('reads the href', () => {
		expect(getHref(response(0))).toBe('/remote.php/dav/files/admin/New%20folder/')
	})

	test('detects folders', () => {
		expect(isCollection(response(0))).toBe(true)
		expect(isCollection(response(1))).toBe(false)
	})

	test('detects available properties', () => {
		expect(hasProperties(response(0))).toBe(true)
	})
})

describe('serializeDocument', () => {
	test('keeps an untouched document as it is', () => {
		const document = parseMultiStatus(multiStatus)!
		// empty elements are collapsed and the whitespace of the prolog is dropped,
		// but nothing of the content itself may change
		expect(serializeDocument(document)).toBe(multiStatus.replace('?>\n', '?>').replaceAll(' />', '/>'))
	})

	test('always emits an XML declaration', () => {
		const document = parseMultiStatus(multiStatus.split('\n').slice(1).join('\n'))!
		expect(serializeDocument(document)).toContain('<?xml version="1.0"?>')
	})
})
