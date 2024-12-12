/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'

import './webDavProxy.ts'

test('PROPFIND on the encrypted folder properly get decrypted', async () => {

	fetch(new Request('https://nextcloud.local/remote.php/dav/files/test', {
		method: 'PROPFIND',
		// headers: {
		// 	'Content-Type': 'application/xml',
		// },
	}))
})
