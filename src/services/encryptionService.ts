/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import { KeyUsageFlags, KeyUsagesExtension, Pkcs10CertificateRequestGenerator, X509Certificate } from '@peculiar/x509'
import * as api from './api.ts'
import { validateCertificateSignature } from './crypto.ts'
import { encryptPrivateKey, generatePrivateKey } from './privateKeyUtils.ts'
import { ensureKeyUsage } from './rsaUtils.ts'

/**
 * Initializes encryption for the current user
 *
 * This will generate a new RSA key pair, create a CSR, send it to the server.
 * Afterwards the private RSA key is encrypted with a mnemonic and stored locally as well as on the server.
 */
export async function initializeEncryption() {
	const serverKey = await api.getServerPublicKey()
	const keyPair = await generatePrivateKey() // RSA key for encryption usage

	const csr = await Pkcs10CertificateRequestGenerator.create({
		keys: {
			publicKey: keyPair.publicKey,
			privateKey: await ensureKeyUsage(keyPair.privateKey, 'sign'),
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

	const publicKeyCertificate = new X509Certificate(await api.createPublicKey(pem))
	if (!await validateCertificateSignature(publicKeyCertificate, serverKey)) {
		throw new Error('Public key not correctly signed by server')
	}

	// key is valid so we encrypt it and store it on the server as well as locally for this session
	const mnemonic = await generateMnemonic()
	const encryptedKey = await encryptPrivateKey(keyPair.privateKey, mnemonic.join(''))

	await api.setPrivateKey(encryptedKey)

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
	const values = self.crypto.getRandomValues(new Uint16Array(12))
	return Array.from(values)
		.map((value) => words.at(value % words.length)!)
}
