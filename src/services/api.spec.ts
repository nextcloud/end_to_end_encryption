/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'

import { rootFolderMetadata } from '../../__tests__/consts.spec.ts'

import { getMetadata, getServerPublicKey } from './api.ts'

test("Users' certificates are correctly verified", async () => {
	const serverPublicKey = await getServerPublicKey()
	const fetchedMetadata = await getMetadata('89', serverPublicKey)
	expect(fetchedMetadata).toEqual(rootFolderMetadata)
})
