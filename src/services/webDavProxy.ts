/* eslint-disable jsdoc/require-jsdoc */
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export function registerWebDavProxy() {
	const OriginalXHR = window.XMLHttpRequest

	// Create a custom XHR class that overrides specific methods
	function CustomXHR() {
		const xhr = new OriginalXHR()

		// Intercept the `open` method
		const originalOpen = xhr.open
		xhr.open = function(method, url, ...rest) {
			console.log(`Intercepted XHR Request: ${method} ${url}`)
			// You can modify the URL or other properties here
			this._interceptedURL = url
			originalOpen.call(this, method, url, ...rest)
		}

		// Intercept the `send` method
		const originalSend = xhr.send
		xhr.send = async function(body) {
			console.log(`Sending XHR Request to ${this._interceptedURL}`, body)

			const url = event.request.url

			console.debug('[E2EE SW]', event, url)

			if (!url.includes('/remote.php/')) {
				return
			}

			switch (event.request.method) {
			case 'GET':
				handleGet(event)
				break
			case 'PROPFIND':
				handlePropFind(event)
				break
			}

			originalSend.call(this, modifiedBody)
		}

		return xhr
	}

	// Replace the global `XMLHttpRequest` with the custom version
	window.XMLHttpRequest = CustomXHR
}

const e2eeFolders = []

function isInE2eeFolder(url: string): boolean {
	return true
}

async function handleGet(event: FetchEvent) {
	console.log('[E2EE SW]', 'IMPLEMENT GET HANDLER')

	if (!isInE2eeFolder(event.request.url)) {
		return
	}

	const originalResponse = await fetch(event.request)
	console.log('[E2EE SW]', originalResponse)
	const decryptedResponse = originalResponse.body // TODO: decrypt(originalResponse)
	event.respondWith(new Response(decryptedResponse))
}

async function handlePropFind(event: FetchEvent) {
	const originalResponse = await fetch(event.request)
	console.log('[E2EE SW]', originalResponse)

	const decryptedResponse = originalResponse.body // TODO: proxy(originalResponse)
	event.respondWith(new Response(decryptedResponse))
}
