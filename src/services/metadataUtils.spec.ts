/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'
import { decryptMetadataInfo, getMetadataPrivateKey } from './metadataUtils.ts'
import { decryptPrivateKey } from './privateKeyUtils.ts'
import { metadata, mnemonic, privateKeyInfo } from '../../__tests__/consts.spec.ts'

test('Metadata is correctly decrypted', async () => {
	const privateKey = await decryptPrivateKey(privateKeyInfo, mnemonic)
	const metadataPrivateKey = await getMetadataPrivateKey(metadata, 'admin', privateKey)
	const metadataInfo = await decryptMetadataInfo(metadata, metadataPrivateKey)
	expect(metadataInfo).toEqual(metadataInfo)
})
