/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable jsdoc/require-jsdoc */

import { generateMnemonic } from 'bip39'

import { getCurrentUser } from '@nextcloud/auth'

import { decryptPrivateKey, encryptPrivateKey, stringToBuffer } from './utils.ts'
import { exportX509Certificate, generateX509Certificate, loadX509Certificate, validateX09CertificateSignature } from './crypto.ts'
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

// API usage: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api-usage.md

export async function initializeUserKeys(): Promise<{publicKey: CryptoKey, privateKey: CryptoKey}> {
	const user = getCurrentUser()

	if (user === null) {
		throw new Error('No user logged in')
	}

	const publicKeys = await getPublicKeys()
	const rawPublicKey = publicKeys[user.uid]
	const encryptedPrivateKeyInfo = await getPrivateKey()

	let publicKey: CryptoKey
	let privateKey: CryptoKey

	if (encryptedPrivateKeyInfo !== undefined && rawPublicKey !== undefined) {
		publicKey = await loadX509Certificate(stringToBuffer(rawPublicKey))
		privateKey = await decryptPrivateKey(encryptedPrivateKeyInfo, await promptUserForMnemonic())
	} else {
		const keyPair = await generateX509Certificate()
		const signedRawPublicKey = await signPublicKey(await exportX509Certificate(keyPair.publicKey))
		publicKey = await loadX509Certificate(stringToBuffer(signedRawPublicKey))
		privateKey = keyPair.privateKey

		const mnemonic = generateMnemonic()
		await setPrivateKey(await encryptPrivateKey(privateKey, mnemonic))
		await showMnemonic(mnemonic)
		// TODO: save mnemonic
	}

	const serverPublicKey = await getServerPublicKey()
	validateX09CertificateSignature(publicKey, await loadX509Certificate(stringToBuffer(serverPublicKey)))

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
