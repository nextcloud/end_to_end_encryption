/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { X509Certificate } from '@peculiar/x509'
import type { IRawMetadataUser } from '../models/metadata.d.ts'

import { Certificate, ContentInfo, CryptoEngine, SignedData } from 'pkijs'
import { bufferToHex, pemToBuffer } from './bufferUtils.ts'

/**
 * Encrypts content using AES-GCM encryption algorithm
 *
 * @param content - The content to encrypt
 * @param key - The AES crypto key to use for encryption
 * @param options - Optional AES-GCM parameters
 */
export async function encryptWithAES(content: BufferSource, key: CryptoKey, options: Partial<AesGcmParams> & { iv?: Uint8Array<ArrayBuffer> } = {}) {
	const iv = self.crypto.getRandomValues(new Uint8Array(12)) // 96 bits IV for AES-GCM

	const cipherText = await self.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv, tagLength: 128, ...options },
		key,
		content,
	)

	const tag = new Uint8Array(cipherText.slice(-16)) // tag size is 128 bits so 16 bytes
	const encryptedContent = new Uint8Array(cipherText) // new Uint8Array(cipherText.slice(0, -16))

	return {
		encryptedContent,
		iv,
		tag,
	}
}

/**
 * Decrypts content using AES-GCM decryption algorithm
 *
 * @param content - The encrypted content to decrypt
 * @param key - The AES crypto key to use for decryption
 * @param options - Optional AES-GCM parameters including the initialization vector
 */
export async function decryptWithAES(content: BufferSource, key: CryptoKey, options: Partial<AesGcmParams> = {}): Promise<ArrayBuffer> {
	return await self.crypto.subtle.decrypt(
		{ name: 'AES-GCM', tagLength: 128, ...options },
		key,
		content,
	)
}

/**
 * Decrypts content using RSA-OAEP decryption algorithm
 *
 * @param content - The encrypted content to decrypt
 * @param key - The RSA private key to use for decryption
 */
export async function decryptWithRSA(content: BufferSource, key: CryptoKey): Promise<ArrayBuffer> {
	return await self.crypto.subtle.decrypt(
		{ name: 'RSA-OAEP' },
		key,
		content,
	)
}

/**
 * Imports a raw AES key for encryption and decryption
 *
 * @param key - The raw AES key
 */
export async function loadAESPrivateKey(key: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
	return await self.crypto.subtle.importKey(
		'raw',
		key,
		{
			name: 'AES-GCM',
			length: 128,
		},
		true,
		['decrypt', 'encrypt'],
	)
}

/**
 * Imports a server's RSA public key for signature verification
 *
 * @param key - The SPKI-formatted public key
 * @param hash - The hash algorithm used ('SHA-1' or 'SHA-256')
 */
export async function loadServerPublicKey(key: Uint8Array<ArrayBuffer>, hash: 'SHA-1' | 'SHA-256'): Promise<CryptoKey> {
	return await self.crypto.subtle.importKey(
		'spki',
		key,
		{
			name: 'RSASSA-PKCS1-v1_5',
			hash,
		},
		true,
		['verify'],
	)
}

/**
 * Imports an RSA private key for decryption
 *
 * @param key - The PKCS8-formatted private key
 */
export async function loadRSAPrivateKey(key: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
	return await self.crypto.subtle.importKey(
		'pkcs8',
		key,
		{
			name: 'RSA-OAEP',
			hash: 'SHA-256',
		},
		true,
		['decrypt'],
	)
}

/**
 * Exports an RSA key to a raw format
 *
 * @param key - The CryptoKey to export (public or private)
 */
export async function exportRSAKey(key: CryptoKey): Promise<Uint8Array<ArrayBuffer>> {
	if (key.type === 'public') {
		return new Uint8Array(await self.crypto.subtle.exportKey('spki', key))
	} else {
		return new Uint8Array(await self.crypto.subtle.exportKey('pkcs8', key))
	}
}

/**
 * Exports an AES key to raw format
 *
 * @param key - The AES CryptoKey to export
 */
export async function exportAESKey(key: CryptoKey): Promise<Uint8Array<ArrayBuffer>> {
	return new Uint8Array(await self.crypto.subtle.exportKey('raw', key))
}

/**
 * Computes the SHA-256 hash of a buffer
 *
 * @param buffer - The data to hash
 */
export async function sha256Hash(buffer: Uint8Array<ArrayBuffer>): Promise<string> {
	const hashBuffer = await self.crypto.subtle.digest('SHA-256', buffer)
	return bufferToHex(new Uint8Array(hashBuffer))
}

/**
 * Validates a certificate's signature using a public key
 *
 * @param certificate - The X.509 certificate to validate
 * @param publicKeyPEM - The public key in PEM format to use for validation
 */
export async function validateCertificateSignature(certificate: X509Certificate, publicKeyPEM: string): Promise<boolean> {
	const publicKey = await loadServerPublicKey(
		pemToBuffer(publicKeyPEM),
		certificate.signatureAlgorithm.hash.name as 'SHA-1' | 'SHA-256',
	)

	return certificate.verify({ publicKey }, getPatchedCrypto())
}

/**
 * Returns a patched crypto object that ensures proper data types for the subtle.verify method
 *
 * The x509 library's default crypto implementation doesn't convert data to the correct type,
 * so this wrapper ensures signatures and data are passed as Uint8Array instances.
 */
function getPatchedCrypto(): Crypto {
	return {
		...self.crypto,
		subtle: {
			...self.crypto.subtle,
			async verify(algorithm: globalThis.AlgorithmIdentifier | RsaPssParams | EcdsaParams, key: CryptoKey, signature: ArrayBuffer, data: ArrayBuffer): Promise<boolean> {
				return self.crypto.subtle.verify(algorithm, key, new Uint8Array(signature), new Uint8Array(data))
			},
		},
	}
}

/**
 * Validates a CMS (Cryptographic Message Syntax) signature
 *
 * @param signedData - The data that was signed
 * @param cmsBuffer - The CMS signature buffer
 * @param users - Array of users with access to verify the signer's identity
 * @throws {Error} if the signer is not found in the users array
 */
export async function validateCMSSignature(signedData: Uint8Array<ArrayBuffer>, cmsBuffer: Uint8Array<ArrayBuffer>, users: IRawMetadataUser[]): Promise<boolean> {
	// Parse the CMS buffer
	const cmsContent = ContentInfo.fromBER(cmsBuffer)
	const originalSignedData = new SignedData({ schema: cmsContent.content })

	// Get the signer certificate from the users array
	const signerInfo = originalSignedData.signerInfos[0]
	if (signerInfo === undefined) {
		throw new Error('Signer not found in the users array')
	}

	const signerUserId = signerInfo.sid.issuer.typesAndValues.find(({ type }) => type === '2.5.4.3' /** Common name OID */).value.valueBlock.value
	const signer = users.find(({ userId }) => userId === signerUserId)
	if (signer === undefined) {
		throw new Error('Signer not found in the users array')
	}
	const signerCertificate = Certificate.fromBER(pemToBuffer(signer.certificate))

	const verificationResult = await originalSignedData.verify(
		{
			signer: 0,
			trustedCerts: [signerCertificate],
			data: signedData.buffer,
			checkChain: true,
		},
		getPatchedCryptoEngine(),
	)

	return verificationResult
}

/**
 * Custom crypto engine that extends PKI.js CryptoEngine with proper data type handling
 *
 * This class ensures that the data parameter is converted to Uint8Array for the verify method,
 * which is required by the Web Crypto API but not handled correctly by the default PKI.js engine.
 */
class CustomCryptoEngine extends CryptoEngine {
	/**
	 * Verifies a digital signature with proper data type conversion
	 *
	 * @param algorithm - The algorithm identifier for verification
	 * @param key - The CryptoKey to use for verification
	 * @param signature - The signature to verify
	 * @param data - The data that was signed
	 */
	verify(algorithm: globalThis.AlgorithmIdentifier | RsaPssParams | EcdsaParams, key: CryptoKey, signature: BufferSource, data: ArrayBuffer): Promise<boolean> {
		return super.verify(algorithm, key, signature, new Uint8Array(data))
	}
}

/**
 * Returns a patched crypto engine that ensures proper data types for signature verification
 *
 * The PKI.js library's default crypto engine doesn't convert data to the correct type,
 * so this wrapper provides a CustomCryptoEngine that handles the conversion.
 */
function getPatchedCryptoEngine() {
	return new CustomCryptoEngine({ crypto: self.crypto })
}
