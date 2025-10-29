/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getBuilder } from '@nextcloud/browser-storage'

/**
 * Session storage - cleared when the browser/tab is closed.
 */
export const storage = getBuilder('end_to_end_encryption')
	.persist(true)
	.build()

export const StorageKeys = Object.freeze({
	/** Whether the user has already setup e2ee */
	EncryptionSetup: 'encryption_setup',
	/** Whether the frontend has access to e2ee (private key on server) */
	EncryptionAvailable: 'encryption_available',
	/** The encrypted private key */
	EncryptedPrivateKey: 'encrypted_private_key',
})
