/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FetchContext } from '@rxliuli/vista'

import { basename, dirname, join } from '@nextcloud/paths'
import stringify from 'safe-stable-stringify'
import * as api from '../services/api.ts'
import logger from '../services/logger.ts'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'

/**
 * Callback to handle MOVE requests.
 *
 * @param context - The fetch context
 * @param next - The next middleware function
 */
export async function useMoveInterceptor(context: FetchContext, next: () => Promise<void>): Promise<void> {
	const source = new URL(context.req.url)
	const destination = new URL(context.req.headers.get('Destination')!)
	const pathSrc = source.pathname
	const pathDst = destination.pathname

	if (pathSrc === pathDst) {
		return next() // this is invalid but let the server handle it
	}

	const metadataRootSrc = await metadataStore.getRootMetadata(pathSrc).catch(() => null)
	const metadataRootDest = await metadataStore.getRootMetadata(dirname(pathDst)).catch(() => null)

	if (metadataRootSrc === metadataRootDest && metadataRootSrc === null) {
		logger.debug('[MOVE] Both source and destination are not end-to-end encrypted, passing through')
		return next()
	}

	if (metadataRootDest === metadataRootSrc && dirname(pathDst) === dirname(pathSrc)) {
		logger.debug('[MOVE] Source and destination are the same folder, renaming only.', { source: pathSrc, destination: pathDst })

		const metadata = await metadataStore.getMetadata(dirname(pathSrc))
		// check if the target name is already an uuid or use it as the new name (first case happens for overrides)
		const filenameDst = basename(pathDst)
		const newName = metadata.metadata.getByUuid(filenameDst)?.filename ?? decodeURIComponent(filenameDst)
		metadata.metadata.rename(basename(pathSrc), newName)

		logger.debug(`[MOVE] Renamed ${basename(pathSrc)} to ${newName}`, { metadata: metadata.metadata })

		const lockToken = await api.lockFolder(metadata.id, metadata.metadata.counter)
		try {
			const metadataRaw = await metadata.metadata.export(await keyStore.getCertificate())
			await api.updateMetadata(metadata.id, stringify(metadataRaw.metadata), lockToken, metadataRaw.signature)
		} finally {
			await api.unlockFolder(metadata.id, lockToken)
		}
		context.res = new Response(null, { status: 201 })
		return
	}

	// otherwise we need to handle the move as copy + delete
	const metadataSrc = await metadataStore.getMetadata(pathSrc).catch(() => null)
	if (metadataSrc && basename(pathSrc) === basename(pathDst) && metadataSrc.metadata.hasUuid(basename(pathSrc))) {
		// the source was encrypted so we need to adjust the destination to use the real filename
		destination.pathname = join(dirname(pathDst), metadataSrc.metadata.getByUuid(basename(pathSrc))!.filename)
	}

	context.res = await fetch(context.req, {
		method: 'COPY',
		headers: {
			Destination: destination.toString(),
		},
	})
	await fetch(source, {
		method: 'DELETE',
		headers: {
			'OCS-APIRequest': 'true',
		},
	})
}
