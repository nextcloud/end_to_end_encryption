/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { INode } from '@nextcloud/files'

import { SimpleBus, unsubscribe } from '@nextcloud/event-bus'
import * as metadataStore from '../store/metadata.ts'
import logger from './logger.ts'

/**
 * Sets up a proxy for the EventBus to handle renaming of created nodes.
 */
export function setupEventBusProxy() {
	logger.debug('Setting up EventBus proxy')

	// ensure there is a global bus registered
	unsubscribe('_', () => {})

	const bus = globalThis._nc_event_bus as SimpleBus
	// @ts-expect-error - overriding emit method which is async instead of sync
	bus.emit = interceptedEmit.bind(bus)
}

/**
 * Intercepted emit function to handle renaming of created nodes.
 *
 * @param this - The event bus
 * @param event - The event name
 * @param args - The event arguments
 */
async function interceptedEmit(this: SimpleBus, event: string, ...args: unknown[]) {
	// @ts-expect-error - accessing protected method
	const apply = (...overrides: unknown[]) => SimpleBus.prototype.emit.apply(this, [event, ...(overrides.length ? overrides : args)])

	if (event === 'files:node:created') {
		const node = args[0] as INode
		// there is already a displayname set
		if (node.displayname !== node.basename) {
			return apply()
		}

		try {
			const { metadata } = await metadataStore.getMetadata(node.dirname)
			const uuid = metadata.getUuid(node.basename)
			if (uuid) {
				logger.debug('EventBusMiddleware: Rename node to encrypted uuid', { node })
				const displayname = node.displayname
				node.rename(uuid)
				node.displayname = displayname
				node.attributes['e2ee-is-encrypted'] = 1
				node.attributes['is-encrypted'] = 1
			} else {
				logger.debug('EventBusMiddleware: Node not found in metadata', { node })
			}

			return apply(node)
		} catch {
			// not e2ee
		}
	}
	apply()
}
