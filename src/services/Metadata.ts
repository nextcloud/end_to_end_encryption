/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { X509Certificate } from '@peculiar/x509'

import { ObjectIdentifier, OctetString, UTCTime } from 'asn1js'
import { AlgorithmIdentifier, Attribute, Certificate, ContentInfo, EncapsulatedContentInfo, IssuerAndSerialNumber, SignedAndUnsignedAttributes, SignedData, SignerInfo } from 'pkijs'
import stringify from 'safe-stable-stringify'
import { base64ToBuffer, bufferToBase64, bufferToString, stringToBuffer } from './bufferUtils.ts'
import { compress, uncompress } from './compression.ts'
import { encryptWithAES, sha256Hash } from './crypto.ts'
import logger from './logger.ts'
import { convertEncryptionKeyToSigningKey } from './privateKeyUtils.ts'

interface IRawMetadataUser {
	/**
	 * The user's ID
	 */
	userId: string
	/**
	 * The user's public key (x509 as PEM)
	 */
	certificate: string
	/**
	 * The metadata key encrypted with the user's public key, then base64 encoded.
	 * So the user can decrypt it with their private key and use it to decrypt the metadata.
	 */
	encryptedMetadataKey: string
}

interface IRawMetadataFiledrop {
	ciphertext: string
	nonce: string
	authenticationTag: string
	users: Array<{
		userId: string
		encryptedFiledropKey: string
	}>
}

interface IRawMetadata {
	metadata: {
		/**
		 * Encrypted metadata (AES/GCM/NoPadding, 128 bit key size with key from "users" section).
		 *
		 * Data is first gzipped, then encrypted, then base64 encoded.
		 */
		ciphertext: string
		nonce: string // sometimes also called iv
		authenticationTag: string
	}

	/**
	 * Array of users who have access to the folder
	 */
	users: IRawMetadataUser[]

	/**
	 * Mapping of uuid to filedrop info
	 */
	filedrop: Record<string, IRawMetadataFiledrop>

	/**
	 * Metadata version
	 */
	version: string
}

interface IMetadataFile {
	/** Unencrypted file name */
	filename: string
	/** Mimetype. If unknown, use "application/octet-stream" */
	mimetype: string
	/** Encryption algorithm: AES/GCM/NoPadding (128 bit key size) */
	nonce: string
	authenticationTag: string
	key: string
}

interface IMetadata {
	/** list of hashes of metadata-keys */
	keyChecksums: string[]
	deleted: boolean
	counter: number
	/**
	 * Mapping of uuids to cleartext folder names
	 */
	folders: Record<string, string>
	files: Record<string, IMetadataFile>
}

export class Metadata {
	#metadata?: IMetadata
	#metadataKey: CryptoKey
	#users: IRawMetadataUser[]
	#filedrop: Record<string, IRawMetadataFiledrop>
	#version = '2.0' // TODO: Should we support multiple versions?

	/**
	 * Constructor for E2EE Metadata
	 *
	 * @param metadataKey - The metadata key used to encrypt/decrypt the metadata
	 */
	private constructor(metadataKey: CryptoKey) {
		this.#metadataKey = metadataKey
		this.#filedrop = {}
		this.#users = []
	}

	/**
	 * Add a new user to the metadata (add access for a user)
	 *
	 * @param userId - The user ID
	 * @param certificate - The user's public key (x509 certificate)
	 */
	public async addUser(userId: string, certificate: X509Certificate): Promise<void> {
		logger.debug(`Adding user ${userId} to folder metadata`)
		let key = await certificate.publicKey.export()
		if (!key.usages.includes('encrypt')) {
			// thats a downside of web crypto...
			key = await globalThis.crypto.subtle.importKey('jwk', {
				...(await globalThis.crypto.subtle.exportKey('jwk', key)),
				key_ops: ['encrypt'],
				alg: 'RSA-OAEP-256',
			}, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt'])
		}
		const {
			encryptedMetadataKey,
			keyChecksum,
		} = await this.#encryptMetadataKey(key)
		this.#users.push({ userId, certificate: certificate.toString('pem'), encryptedMetadataKey })
		this.#metadata!.keyChecksums.push(keyChecksum)
	}

	/**
	 * Get the list of user IDs who have access to this folder
	 */
	public getUsers(): string[] {
		return this.#users.map((u) => u.userId)
	}

	public getFile(uuid: string): IMetadataFile | undefined {
		return this.#metadata?.files[uuid]
	}

	public addFile(uuid: string, file: IMetadataFile): void {
		this.#metadata!.files[uuid] = file
	}

	/**
	 * Export the metadata and its signature
	 *
	 * @param certificate - The x509 certificate including the private key of the current user for signing
	 */
	public async export(certificate: X509Certificate): Promise<{ metadata: IRawMetadata, signature: string }> {
		if (certificate.privateKey === undefined) {
			throw new Error('Certificate does not have a private key for signing')
		}

		const metadata = await this.#exportRawMetadata()
		const signature = await this.#exportSignature(certificate, metadata)

		return { metadata, signature }
	}

	async #exportRawMetadata(): Promise<IRawMetadata> {
		const jsonMetadata = JSON.stringify(this.#metadata)
		const compressedMetadata = await compress(stringToBuffer(jsonMetadata))

		const { encryptedContent, tag, iv } = await encryptWithAES(compressedMetadata, this.#metadataKey!)

		return {
			metadata: {
				ciphertext: bufferToBase64(encryptedContent),
				nonce: bufferToBase64(iv),
				authenticationTag: bufferToBase64(tag),
			},
			filedrop: this.#filedrop,
			users: this.#users,
			version: this.#version,
		} satisfies IRawMetadata
	}

	async #exportSignature(certificate: X509Certificate, rawMetadata: Partial<IRawMetadata>): Promise<string> {
		// drop the filedrop as we do not sign that
		delete rawMetadata.filedrop
		const metadataForSignature = stringToBuffer(btoa(stringify(rawMetadata)))

		const cert = Certificate.fromBER(certificate.rawData)
		const cms = new SignedData({
			version: 1,
			certificates: [
				cert,
			],
			encapContentInfo: new EncapsulatedContentInfo({
				eContentType: ContentInfo.DATA,
			}),
			signerInfos: [new SignerInfo({
				sid: new IssuerAndSerialNumber({
					issuer: cert.issuer,
					serialNumber: cert.serialNumber,
				}),
				signatureAlgorithm: cert.signatureAlgorithm,
				digestAlgorithm: new AlgorithmIdentifier({ algorithmId: 'sha-256' }),
				signedAttrs: new SignedAndUnsignedAttributes({
					// rfc6488
					type: 0,
					attributes: [
						new Attribute({
							type: '1.2.840.113549.1.9.3', // contentType
							values: [
								new ObjectIdentifier({ value: ContentInfo.DATA }),
							],
						}),
						new Attribute({
							type: '1.2.840.113549.1.9.4', // messageDigest
							values: [
								new OctetString({ valueHex: await globalThis.crypto.subtle.digest('SHA-256', metadataForSignature) }),
							],
						}),
						new Attribute({
							type: '1.2.840.113549.1.9.5', // signingTime
							values: [
								new UTCTime({ valueDate: new Date() }),
							],
						}),
					],
				}),
			})],
		})

		const signKey = await convertEncryptionKeyToSigningKey(certificate.privateKey!)

		await cms.sign(signKey, 0, 'SHA-256', metadataForSignature)

		const contentInfo = new ContentInfo({
			contentType: ContentInfo.SIGNED_DATA,
			content: cms.toSchema(true),
		})
		return contentInfo.toString('base64')
	}

	/**
	 * Encrypt the metadata key with the user's public key
	 *
	 * @param key - The user's public key
	 */
	async #encryptMetadataKey(key: CryptoKey) {
		if (!this.#metadataKey) {
			throw new Error('Metadata key is not set')
		}

		const metadataKey = await globalThis.crypto.subtle.exportKey('raw', this.#metadataKey)
		const encryptedKey = await globalThis.crypto.subtle.encrypt(
			{
				name: 'RSA-OAEP',
			},
			key,
			metadataKey,
		)
		return {
			encryptedMetadataKey: bufferToBase64(new Uint8Array(encryptedKey)),
			keyChecksum: await sha256Hash(new Uint8Array(metadataKey)),
		}
	}

	static async fromJson(content: string, uid: string, privateKey: CryptoKey): Promise<Metadata> {
		const parsed = JSON.parse(content) as IRawMetadata
		const currentUserEntry = parsed.users.find((u) => u.userId === uid!)
		if (!currentUserEntry) {
			throw new Error('Current user has no access to this folder')
		}

		const metadataKeyData = await globalThis.crypto.subtle.decrypt(
			{
				name: 'RSA-OAEP',
			},
			privateKey,
			base64ToBuffer(currentUserEntry.encryptedMetadataKey),
		)
		const metadataKey = await globalThis.crypto.subtle.importKey(
			'raw',
			metadataKeyData,
			{ name: 'AES-GCM', length: 128 },
			false,
			['decrypt', 'encrypt'],
		)
		const jsonMetadata = await globalThis.crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv: base64ToBuffer(parsed.metadata.nonce),
				tagLength: 128,
			},
			privateKey!,
			base64ToBuffer(currentUserEntry.encryptedMetadataKey),
		)
			.then((decrypted) => uncompress(new Uint8Array(decrypted)))
			.then((deflated) => bufferToString(deflated))

		const metadata = new Metadata(metadataKey)
		metadata.#users = parsed.users
		metadata.#filedrop = parsed.filedrop
		metadata.#metadata = JSON.parse(jsonMetadata)
		return metadata
	}

	public static async createNew(): Promise<Metadata> {
		const metadataKey = await globalThis.crypto.subtle.generateKey(
			{
				name: 'AES-GCM',
				length: 128,
			},
			true,
			['encrypt', 'decrypt'],
		)
		const metadata = new Metadata(metadataKey)
		metadata.#metadata = {
			keyChecksums: [],
			counter: 0,
			deleted: false,
			folders: {},
			files: {},
		}
		return metadata
	}
}
