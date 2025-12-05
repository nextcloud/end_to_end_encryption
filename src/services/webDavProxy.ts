/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { BaseMiddleware, FetchContext } from '@rxliuli/vista'

import { interceptFetch, interceptXHR, Vista } from '@rxliuli/vista'
import { useGetInterceptor } from '../middleware/useGetInterceptor.ts'
import { useMkcolInterceptor } from '../middleware/useMkcolInterceptor.ts'
import { usePropFindInterceptor } from '../middleware/usePropFindInterceptor.ts'
import { usePutInterceptor } from '../middleware/usePutInterceptor.ts'
import logger from './logger.ts'

let vistaInstance: Vista<FetchContext>

/**
 * Sets up a proxy for WebDAV requests to handle decryption of files and metadata.
 */
export function setupWebDavProxy() {
	logger.debug('Setting up WebDAV proxy')

	vistaInstance = new Vista([interceptFetch, interceptXHR])
		.use(wrapInterceptor(useGetInterceptor, 'GET'))
		.use(wrapInterceptor(useMkcolInterceptor, 'MKCOL'))
		.use(wrapInterceptor(usePutInterceptor, 'PUT'))
		.use(wrapInterceptor(usePropFindInterceptor, 'PROPFIND'))
	vistaInstance.intercept()
}

/**
 * Destroys the WebDAV proxy.
 */
export function destroyWebDavProxy() {
	logger.debug('Destroying WebDAV proxy')
	vistaInstance?.destroy()
}

/**
 * Wraps a middleware to only intercept specific methods and requests.
 *
 * @param middleware - The middleware to wrap
 * @param method - Optional HTTP method to filter on
 */
function wrapInterceptor(middleware: BaseMiddleware<FetchContext>, method: string) {
	return async (context: FetchContext, next: () => Promise<void>) => {
		if (context.req.method !== method) {
			return next()
		}
		if (context.req.headers.get('X-E2EE-SUPPORTED') === 'true'
			|| !context.req.url.includes('/remote.php/dav/files/')
		) {
			logger.debug(`Pass through ${context.req.method} ${context.req.url}`)
			return next()
		}

		logger.debug(`Proxying ${context.req.method} ${context.req.url}`, { request: context.req })
		try {
			await middleware(context, next)
		} catch (error) {
			logger.error(`Error in ${context.req.method} interceptor`, { error, request: context.req })
			throw error
		}
	}
}
