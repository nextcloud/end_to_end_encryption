/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'
import { rootFolderMetadata, rootFolderMetadataSignature } from '../../__tests__/consts.spec.ts'
import { getServerPublicKey } from './api.ts'
import { validateMetadataSignature, validateUserCertificates } from './security.ts'

import '../../__tests__/api-mock.ts'

test('Metadata validation works with a valid signature', async () => {
	await expect(validateMetadataSignature(rootFolderMetadata, rootFolderMetadataSignature, rootFolderMetadata)).resolves.toBeTruthy()
})

// see also https://github.com/nextcloud/end_to_end_encryption_rfc/issues/66
test('Metadata validation works with a valid signature and unordered metadata', async () => {
	const metadata = {
		...rootFolderMetadata,
		metadata: {
			...rootFolderMetadata.metadata,
			authenticationTag: rootFolderMetadata.metadata.authenticationTag,
		},
	}
	await expect(validateMetadataSignature(metadata, rootFolderMetadataSignature, rootFolderMetadata)).resolves.toBeTruthy()
})

test('Metadata validation throws with a truncated signature', async () => {
	const badSignature = rootFolderMetadataSignature.slice(0, -1)
	await expect(validateMetadataSignature(rootFolderMetadata, badSignature, rootFolderMetadata)).rejects.toThrow()
})

test('Metadata validation throws with a tempered signature', async () => {
	const badSignature = rootFolderMetadataSignature.replace('a', 'b')
	await expect(validateMetadataSignature(rootFolderMetadata, badSignature, rootFolderMetadata)).rejects.toThrow()
})

test('Metadata validation throws with a tempered metadata', async () => {
	(rootFolderMetadata as any).version = '1.0'
	await expect(validateMetadataSignature(rootFolderMetadata, rootFolderMetadataSignature, rootFolderMetadata)).rejects.toThrow()
})

test('Users certificates validation against server public key works', async () => {
	await expect(validateUserCertificates(rootFolderMetadata, await getServerPublicKey())).resolves.toEqual([true, true])
})

test('Altered users certificates validation against server public key does not works', async () => {
	rootFolderMetadata.users[0]!.certificate = rootFolderMetadata.users[0]!.certificate.replace('a', 'b')
	await expect(validateUserCertificates(rootFolderMetadata, await getServerPublicKey())).rejects.toThrow()
})
