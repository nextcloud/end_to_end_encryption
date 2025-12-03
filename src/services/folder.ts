/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IFolder } from '@nextcloud/files'
import type { X509Certificate } from '@peculiar/x509'

import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { defaultRemoteURL, defaultRootPath } from '@nextcloud/files/dav'
import { joinPaths } from '@nextcloud/paths'
import { createMetadata, lockFolder, setFolderAsEncrypted, unlockFolder } from './api.ts'
import { Metadata } from './Metadata.ts'

/**
 * Set up a new root folder with encryption
 *
 * @param name - The name of the new root folder
 * @param context - The context folder where the new root folder will be created
 * @param certificate - The current user's X509 certificate
 */
export async function createNewRootFolder(name: string, context: IFolder, certificate: X509Certificate): Promise<string> {
	if (!certificate.privateKey) {
		throw new Error('User certificate does not have a private key')
	}

	// first create the folder
	const folderPath = joinPaths(context.path, name)
	const response = await axios.request({
		method: 'MKCOL',
		url: defaultRemoteURL + joinPaths(defaultRootPath, folderPath),
		headers: {
			'X-E2EE-SUPPORTED': 'true',
		},
	})
	const fileId = Number.parseInt(response.headers['oc-fileid'] as string).toString()
	if (!fileId) {
		throw new Error('Could not retrieve fileid for newly created folder')
	}

	// enable encryption on it
	await setFolderAsEncrypted(fileId)

	const token = await lockFolder(fileId, 1) // TODO: documentation: should be 0?
	try {
		// now we finally create the initial metadata for the folder
		const metadata = await RootMetadata.createNew()
		await metadata.addUser(getCurrentUser()!.uid, certificate)
		const {
			metadata: rawMetadata,
			signature,
		} = await metadata.export(certificate)

		await createMetadata(
			fileId,
			JSON.stringify(rawMetadata),
			token,
			signature,
		)
		return fileId
	} finally {
		await unlockFolder(fileId, token)
	}
}
