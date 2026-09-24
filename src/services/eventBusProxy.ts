/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { INode } from '@nextcloud/files'

import { SimpleBus, unsubscribe } from '@nextcloud/event-bus'
import * as metadataStore from '../store/metadata.ts'
import logger from './logger.ts'

/**
 * Sets up a proxy for the EventBus to keep encrypted nodes named by their uuid.
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
 * Intercepted emit function that restores the uuid name of encrypted nodes
 * before the event reaches its subscribers.
 *
 * @param this - The event bus
 * @param event - The event name
 * @param args - The event arguments
 */
async function interceptedEmit(this: SimpleBus, event: string, ...args: unknown[]) {
	// @ts-expect-error - accessing protected method
	const apply = (...overrides: unknown[]) => SimpleBus.prototype.emit.apply(this, [event, ...(overrides.length ? overrides : args)])

	try {
		const node = args[0] as INode
		if (needsNameRestore(event, node)) {
			await restoreEncryptedName(node)
		}
	} catch {
		// not e2ee
	}

	apply()
}

/**
 * Whether the node an event carries has to be checked for being named by its
 * decrypted name.
 *
 * @param event - Name of the emitted event
 * @param node - The node the event carries
 */
function needsNameRestore(event: string, node: INode): boolean {
	// a created node is built from the name that was uploaded, so only the
	// metadata lookup can tell whether it landed in an encrypted folder
	return event === 'files:node:created'
		// renaming is what puts a decrypted name back onto an existing node, and
		// only checking the encrypted ones keeps this from costing a PROPFIND on
		// every update event of an unencrypted node
		|| (event === 'files:node:updated' && String(node.attributes['e2ee-is-encrypted']) === '1')
}

/**
 * Rename a node that is named by its decrypted name back to its uuid, keeping
 * the decrypted name as the displayname.
 *
 * @param node - The node to restore, modified in place
 * @throws {Error} If the parent folder is not end-to-end encrypted
 */
async function restoreEncryptedName(node: INode): Promise<void> {
	const { metadata } = await metadataStore.getMetadata(node.dirname)
	const filename = node.basename
	const uuid = metadata.getUuid(filename)
	if (!uuid) {
		// the node is already named by its uuid, or it is not part of the metadata
		logger.debug('EventBusProxy: Node is not named by its decrypted name', { node })
		return
	}

	logger.debug('EventBusProxy: Rename node to encrypted uuid', { node, uuid })
	node.rename(uuid)
	// `rename` resets the displayname whenever it matched the previous basename
	node.displayname = filename
	node.attributes['e2ee-is-encrypted'] = 1
	node.attributes['is-encrypted'] = 1
}
