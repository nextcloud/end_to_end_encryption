/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { join } from '@nextcloud/paths'
import { getRootUrl } from '@nextcloud/router'

/**
 * @param {string} davEndpoint
 * @param {string} fileName
 * @param {string} content
 * @param {string} shareToken
 */
export async function uploadFile(davEndpoint, fileName, content, shareToken) {
	await axios.put(
		join(getRootUrl(), davEndpoint, fileName),
		content,
		{
			headers: {
				Authorization: `Basic ${btoa(`${shareToken}:`)}`,
			},
		},
	)
}
