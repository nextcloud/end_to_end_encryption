/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import { generateMnemonic } from 'bip39'

import { generateCSRAndPrivateKey, validateX09CertificateSignature } from './crypto.ts'
import {
	deleteMetadata,
	getMetadata,
	getPrivateKey,
	getPublicKeys,
	getServerPublicKey,
	lockFile,
	setEncrypted,
	setPrivateKey,
	signPublicKey,
	unlockFile,
	updateMetadata,
} from './api.ts'
import { promptUserForMnemonic, showMnemonic } from './mnemonicDialogs.ts'
import { decryptPrivateKey, encryptPrivateKey } from './privateKeyUtils.ts'
import { getCurrentUser } from '@nextcloud/auth'

// API usage: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api-usage.md

export async function initializeUserKeys(userId: string): Promise<{publicKey: CryptoKey, privateKey: CryptoKey}> {
	const publicKeys = await getPublicKeys()

	let publicKey = publicKeys[userId]
	let privateKey: CryptoKey

	const currentUser = getCurrentUser()
	if (!currentUser) {
		throw new Error('No user logged in')
	}

	if (publicKey === undefined) {
		const csrAndPrivateKey = await generateCSRAndPrivateKey(currentUser.uid)
		publicKey = await signPublicKey(csrAndPrivateKey.csr)
		privateKey = csrAndPrivateKey.privateKey
		// TODO: Check that the returned public key is matching private key

		const mnemonic = generateMnemonic()
		await setPrivateKey(await encryptPrivateKey(privateKey, mnemonic))
		await showMnemonic(mnemonic)
		// TODO: save mnemonic
	} else {
		privateKey = await decryptPrivateKey(await getPrivateKey(), await promptUserForMnemonic())
	}

	validateX09CertificateSignature(publicKey, await getServerPublicKey())

	// TODO: save key pair
	return { publicKey, privateKey }
}

// NOTE: Might not be possible as encrypting all file could take a long time.
// NOTE: Need to find a way to continue job if browser is closed.
export async function setFolderAsEncrypted(fileId: string): Promise<void> {
	await setEncrypted(fileId)
	const e2eToken = await lockFile(fileId, 0)
	try {
		// TODO: createMetadata(fileId)
		// TODO: const files = encryptAllFiles()
		// TODO: uploadEncryptedFiles(files)
	} finally {
		await unlockFile(fileId, e2eToken)
	}
}

// NOTE: Might not be possible as decrypting all file could take a long time.
// NOTE: Need to find a way to continue job if browser is closed.
export async function unsetFolderAsEncrypted(fileId: string): Promise<void> {
	const e2eToken = await lockFile(fileId, 0)
	try {
		// TODO: const files = await decryptAllFiles()
		// TODO: uploadUnEncryptedFiles(files)
		await deleteMetadata(fileId, e2eToken)
	} finally {
		await unlockFile(fileId, e2eToken)
	}
}

export async function uploadFile(fileId: string): Promise<void> {
	const e2eToken = await lockFile(fileId, 0)
	try {
		const metadata = await getMetadata(fileId)
		// TODO: addFileToMetadata(metadata, fileId)
		const signature = '' // TODO: signContent(content)
		updateMetadata(fileId, metadata, e2eToken, signature)
		// TODO: uploadFileContent(fileId, content)
	} finally {
		await unlockFile(fileId, e2eToken)
	}
}

export async function shareFile(fileId: string): Promise<void> {
	const e2eToken = await lockFile(fileId, 0)
	try {
		const metadata = await getMetadata(fileId)
		// TODO: addFileShareToMetadata(metadata, fileId)
		const signature = '' // TODO: signContent(content)
		updateMetadata(fileId, metadata, e2eToken, signature)
	} finally {
		await unlockFile(fileId, e2eToken)
	}
}

export async function unshareFile(fileId: string): Promise<void> {
	const e2eToken = await lockFile(fileId, 0)
	try {
		// TODO: const encryptedFile = reencrypteFile(fileId)
		// TODO: uploadFile(fileId)
		const metadata = await getMetadata(fileId)
		// TODO: removeFileShareFromMetadata(metadata, fileId)
		const signature = '' // TODO: signContent(content)
		updateMetadata(fileId, metadata, e2eToken, signature)
	} finally {
		await unlockFile(fileId, e2eToken)
	}
}
