/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'

import { rootFolderMetadata, rootFolderMetadataInfo, adminMnemonic, adminPrivateKeyInfo, subfolderMetadata, subfolderMetadataInfo } from '../../__tests__/consts.spec.ts'

import { decryptMetadataInfo, getMetadataPrivateKey } from './metadataUtils.ts'
import { decryptPrivateKey } from './privateKeyUtils.ts'

test('Metadata info is correctly decrypted', async () => {
	const privateKey = await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic)
	const metadataPrivateKey = await getMetadataPrivateKey(rootFolderMetadata, 'admin', privateKey)
	const decryptedMetadataInfo = await decryptMetadataInfo(rootFolderMetadata, metadataPrivateKey)
	expect(decryptedMetadataInfo).toEqual(rootFolderMetadataInfo)
})

test('Subfolder metadata is correctly decrypted', async () => {
	const privateKey = await decryptPrivateKey(adminPrivateKeyInfo, adminMnemonic)
	const metadataPrivateKey = await getMetadataPrivateKey(rootFolderMetadata, 'admin', privateKey)
	const decryptedSubfolderMetadataInfo = await decryptMetadataInfo(subfolderMetadata, metadataPrivateKey)
	expect(decryptedSubfolderMetadataInfo).toEqual(subfolderMetadataInfo)
})
