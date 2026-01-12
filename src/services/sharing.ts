/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { RootMetadata } from '../models/RootMetadata.ts'

import axios from '@nextcloud/axios'
import { Permission } from '@nextcloud/files'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { initializeEncryption } from './encryptionService.ts'

export interface IShare extends Record<string, string | number> {
	id: number | string
	share_with: string
	share_with_displayname: string
}

/**
 * Create a new file drop
 *
 * @param path - Path of the root encrypted folder
 */
export async function createFileDropShare(path: string) {
	return await createShare(path, Permission.CREATE)
}

/**
 * Create a new public link share with encryption
 *
 * @param path - Path of the root encrypted folder to share
 * @param metadata - The root metadata
 * @param readonly - If the share should only have read permissions
 */
export async function createPublicLinkShare(path: string, metadata: RootMetadata, readonly: boolean = false) {
	const share = await createShare(path, readonly ? Permission.READ : (Permission.READ | Permission.UPDATE | Permission.CREATE))
	const keyData = await initializeEncryption(share.token as string)
	await metadata.addUser(`s:${share.token}`, keyData.publicKeyCertificate)

	return {
		...keyData,
		share,
	}
}

/**
 * Create a new link share
 *
 * @param path - The path to share
 * @param permissions - The permissions for the share
 */
async function createShare(path: string, permissions: number) {
	const { data } = await axios.post<OCSResponse<IShare>>(
		generateOcsUrl('/apps/files_sharing/api/v1/shares'),
		{
			path: decodeURI(path),
			permissions,
			shareType: ShareType.Link,
		},
	)
	return data.ocs.data
}
