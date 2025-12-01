/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IRawMetadata, IRawRootMetadata } from '../models/metadata.d.ts'

import { expect, test } from 'vitest'
import { isRootMetadata } from './metadata.ts'

const folderMetadata: IRawMetadata = {
	metadata: {
		ciphertext: 'ciphertext',
		nonce: 'nonce',
		authenticationTag: 'authenticationTag',
	},
	version: '2.0',
}

const rootMetadata: IRawRootMetadata = {
	...folderMetadata,
	users: [],
}

test('check root metadata', () => {
	expect(isRootMetadata(rootMetadata)).toBe(true)
})

test('check subfolder metadata', () => {
	expect(isRootMetadata(folderMetadata)).toBe(false)
})
