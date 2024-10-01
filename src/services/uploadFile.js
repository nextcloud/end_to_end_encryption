/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { getRootUrl } from '@nextcloud/router'
import path from 'path'

/**
 * @param {string} davEndpoint
 * @param {string} fileName
 * @param {string} content
 * @param {string} shareToken
 */
export async function uploadFile(davEndpoint, fileName, content, shareToken) {
	await axios.put(
		path.join(getRootUrl(), davEndpoint, fileName),
		content,
		{
			headers: {
				Authorization: `Basic ${btoa(`${shareToken}:`)}`,
			},
		},
	)
}
