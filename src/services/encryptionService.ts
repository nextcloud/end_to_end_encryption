/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import { KeyUsageFlags, KeyUsagesExtension, Pkcs10CertificateRequestGenerator } from '@peculiar/x509'
import { createPublicKey, getPublicKey, getServerPublicKey, setPrivateKey } from './api.ts'
import { validateCertificateSignature } from './crypto.ts'
import { encryptPrivateKey, generatePrivateKey } from './privateKeyUtils.ts'
import { storage, StorageKeys } from './storage.ts'

/**
 * Check if encryptio is already setup for the current user
 */
export async function isEncryptionSetup(): Promise<boolean> {
	if (storage.getItem(StorageKeys.EncryptionSetup) === 'true') {
		return true
	}

	const key = await getPublicKey()
	storage.setItem(StorageKeys.EncryptionSetup, key ? 'true' : 'false')
	return !!key
}

/**
 * Initializes encryption for the current user
 *
 * This will generate a new RSA key pair, create a CSR, send it to the server.
 * Afterwards the private RSA key is encrypted with a mnemonic and stored locally as well as on the server.
 */
export async function initializeEncryption() {
	const serverKey = await getServerPublicKey()

	// Client has to generate a new X.509 certificate request and private key (TODO: check if we want/need to use PEM, otherwise base64 encode)
	const keyPair = await generatePrivateKey()

	// hack to allow singing the CSR with the RSA key we created for encryption
	// (reason is that its not recommended for RSA to use the same key for both signing and encryption)
	const signKeyJwk = {
		...await self.crypto.subtle.exportKey('jwk', keyPair.privateKey),
		alg: 'RS256',
		key_ops: ['sign'],
		kty: 'RSA',
	}
	const signKey = await self.crypto.subtle.importKey('jwk', signKeyJwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, true, ['sign'])

	const csr = await Pkcs10CertificateRequestGenerator.create({
		keys: {
			publicKey: keyPair.publicKey,
			privateKey: signKey,
		},
		signingAlgorithm: {
			name: 'RSASSA-PKCS1-v1_5',
			hash: 'SHA-256',
		},
		name: `CN=${getCurrentUser()!.uid}`,
		extensions: [
			new KeyUsagesExtension(KeyUsageFlags.digitalSignature | KeyUsageFlags.keyEncipherment),
		],
	})
	const pem = csr.toString('pem')

	// TODO: document that we need PEM here!
	const publicKeyCertificate = await createPublicKey(pem)
	if (!await validateCertificateSignature(publicKeyCertificate, serverKey)) {
		throw new Error('Public key not correctly signed by server')
	}

	// key is valid so we encrypt it and store it on the server as well as locally for this session
	const mnemonic = await generateMnemonic()
	const encryptedKey = await encryptPrivateKey(keyPair.privateKey, mnemonic.join(''))

	await setPrivateKey(encryptedKey)

	storage.setItem(StorageKeys.EncryptedPrivateKey, JSON.stringify(encryptedKey))
	storage.setItem(StorageKeys.EncryptionSetup, 'true')
	return {
		mnemonic,
		publicKeyCertificate,
		...keyPair,
	}
}

/**
 * @return A 12 word mnemonic
 */
async function generateMnemonic(): Promise<string[]> {
	const { default: words } = await import('bip39/src/wordlists/english.json', { assert: { type: 'json' } })
	const values = self.crypto.getRandomValues(new Uint8Array(12))
	return Array.from(values)
		.map((value) => words.at(value % words.length)!)
}
