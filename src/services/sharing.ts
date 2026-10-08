/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { RootMetadata } from '../models/RootMetadata.ts'

import axios from '@nextcloud/axios'
import { Permission } from '@nextcloud/files'
import { generateOcsUrl, generateUrl, getBaseUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { initializeEncryption } from './encryptionService.ts'

export interface IShare extends Record<string, string | number> {
	id: number | string
	share_with: string
	share_with_displayname: string
}

export interface IFileDropShareOptions {
	/** Email address to share with, creates an email share instead of a link share */
	email?: string
	/** Password required to access the share */
	password?: string
	/** Note shown to the recipient */
	note?: string
}

/**
 * Get the public URL of a link or email share.
 * The API only includes the URL for link shares, so it is built from the token otherwise.
 *
 * @param share - The share
 */
export function getShareUrl(share: IShare): string {
	return (share.url as string | undefined) ?? generateUrl('/s/{token}', { token: share.token }, { baseURL: getBaseUrl() })
}

/**
 * Create a new file drop
 *
 * @param path - Path of the root encrypted folder
 * @param options - Optional share settings
 */
export async function createFileDropShare(path: string, options: IFileDropShareOptions = {}) {
	return await createShare(path, Permission.CREATE, options)
}

/**
 * Create a new public link share with encryption
 *
 * @param path - Path of the root encrypted folder to share
 * @param metadata - The root metadata
 * @param readonly - If the share should only have read permissions
 * @param email - Email address to share with, creates an email share instead of a link share
 */
export async function createPublicLinkShare(path: string, metadata: RootMetadata, readonly: boolean = false, email?: string) {
	const share = await createShare(path, readonly ? Permission.READ : (Permission.READ | Permission.UPDATE | Permission.CREATE), { email })
	const keyData = await initializeEncryption(share.token as string)
	await metadata.addUser(`s:${share.token}`, keyData.publicKeyCertificate)

	return {
		...keyData,
		share,
	}
}

/**
 * Create a new link share, or an email share if an email address is given
 *
 * @param path - The path to share
 * @param permissions - The permissions for the share
 * @param options - Optional share settings
 */
async function createShare(path: string, permissions: number, options: IFileDropShareOptions = {}) {
	const { data } = await axios.post<OCSResponse<IShare>>(
		generateOcsUrl('/apps/files_sharing/api/v1/shares'),
		{
			path: decodeURI(path),
			permissions,
			shareType: options.email ? ShareType.Email : ShareType.Link,
			shareWith: options.email || undefined,
			password: options.password || undefined,
			note: options.note || undefined,
		},
	)
	return data.ocs.data
}
