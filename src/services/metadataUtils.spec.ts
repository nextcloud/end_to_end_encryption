/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'

import { metadata, metadataInfo, mnemonic, privateKeyInfo, subfolderMetadata, subfolderMetadataInfo } from '../../__tests__/consts.spec.ts'

import { decryptMetadataInfo, getMetadataPrivateKey } from './metadataUtils.ts'
import { decryptPrivateKey } from './privateKeyUtils.ts'

test('Metadata info is correctly decrypted', async () => {
	const privateKey = await decryptPrivateKey(privateKeyInfo, mnemonic)
	const metadataPrivateKey = await getMetadataPrivateKey(metadata, 'admin', privateKey)
	const decryptedMetadataInfo = await decryptMetadataInfo(metadata, metadataPrivateKey)
	expect(decryptedMetadataInfo).toEqual(metadataInfo)
})

test('Subfolder metadata is correctly decrypted', async () => {
	const privateKey = await decryptPrivateKey(privateKeyInfo, mnemonic)
	const metadataPrivateKey = await getMetadataPrivateKey(metadata, 'admin', privateKey)
	const decryptedSubfolderMetadataInfo = await decryptMetadataInfo(subfolderMetadata, metadataPrivateKey)
	expect(decryptedSubfolderMetadataInfo).toEqual(subfolderMetadataInfo)
})
