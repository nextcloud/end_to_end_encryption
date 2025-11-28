/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { X509Certificate } from '@peculiar/x509'
import type { IMetadata, IMetadataFile, IRawMetadata } from './metadata.d.ts'

import { ObjectIdentifier, OctetString, UTCTime } from 'asn1js'
import { AlgorithmIdentifier, Attribute, Certificate, ContentInfo, EncapsulatedContentInfo, IssuerAndSerialNumber, SignedAndUnsignedAttributes, SignedData, SignerInfo } from 'pkijs'
import stringify from 'safe-stable-stringify'
import { bufferToBase64, stringToBuffer } from '../services/bufferUtils.ts'
import { compress } from '../services/compression.ts'
import { encryptWithAES } from '../services/crypto.ts'
import { convertEncryptionKeyToSigningKey } from '../services/privateKeyUtils.ts'

export class Metadata<MetaData extends IRawMetadata = IRawMetadata> {
	protected _metadataKey: CryptoKey
	protected _metadata: IMetadata
	protected _modified: boolean
	protected _version: string
	#metadata: IMetadata

	/**
	 * Constructor for E2EE Metadata
	 *
	 * @param metadataKey - The metadata key used to encrypt/decrypt the metadata
	 * @param version - The metadata version
	 * @param initialMetadata - Optional initial metadata to populate the instance with
	 */
	protected constructor(metadataKey: CryptoKey, version: string = '2.0', initialMetadata?: IRawMetadata) {
		this._metadataKey = metadataKey
		this._version = version
		this._modified = false
		this.#metadata = {
			keyChecksums: [],
			deleted: false,
			counter: 0,
			folders: {},
			files: {},
			...initialMetadata,
		}

		this._metadata = new Proxy(this.#metadata, {
			get: (target, prop) => {
				if (prop === 'counter' && this._modified) {
					return target.counter + 1
				}
				return target[prop]
			},
			set: (target, prop, value) => {
				target[prop] = value
				this._modified = true
				return true
			},
		})
	}

	public getKey(): CryptoKey {
		return this._metadataKey
	}

	public addFolder(uuid: string, folderName: string): void {
		this._metadata.folders = {
			...this._metadata.folders,
			[uuid]: folderName,
		}
	}

	public getFile(uuid: string): IMetadataFile | undefined {
		return this._metadata.files[uuid]
	}

	public addFile(uuid: string, file: IMetadataFile): void {
		this._metadata.files[uuid] = file
	}

	public deleteFile(uuid: string): void {
		delete this._metadata.files[uuid]
	}

	public renameFile(uuid: string, newName: string): void {
		if (!this._metadata.files[uuid]) {
			throw new Error(`File with UUID ${uuid} does not exist`)
		}

		this._metadata.files[uuid]!.filename = newName
	}

	/**
	 * Export the metadata and its signature
	 *
	 * @param certificate - The x509 certificate including the private key of the current user for signing
	 */
	public async export(certificate: X509Certificate): Promise<{ metadata: MetaData, signature: string }> {
		if (certificate.privateKey === undefined) {
			throw new Error('Certificate does not have a private key for signing')
		}

		const metadata = await this._exportMetadata()
		const signature = await this.#exportSignature(certificate, metadata)

		return { metadata, signature }
	}

	public async verifySignature(signature: string, certificates: X509Certificate[]): Promise<boolean> {
		const metadata = await this._exportMetadata()
		const { cms, data } = await this.#getSignedData(certificates, metadata)
		return await cms.verify({ data: data.buffer })
	}

	public static async fromJson(json: IRawMetadata, metadataKey: CryptoKey): Promise<Metadata> {
		if (json.version !== '2.0') {
			throw new Error(`Unsupported metadata version: ${json.version}`)
		}

		return new Metadata(metadataKey, json.version, json)
	}

	public static async createNew(metadataKey: CryptoKey): Promise<Metadata> {
		return new Metadata(metadataKey)
	}

	protected async _exportMetadata(): Promise<MetaData> {
		const jsonMetadata = JSON.stringify(this._metadata)
		const compressedMetadata = await compress(stringToBuffer(jsonMetadata))

		const { encryptedContent, tag, iv } = await encryptWithAES(compressedMetadata, this._metadataKey)

		const rawMetadata: IRawMetadata = {
			metadata: {
				ciphertext: bufferToBase64(encryptedContent),
				nonce: bufferToBase64(iv),
				authenticationTag: bufferToBase64(tag),
			},
			version: this._version,
		}

		return rawMetadata as MetaData
	}

	async #getSignedData(certificates: X509Certificate[], rawMetadata: Partial<MetaData>): Promise<{ cms: SignedData, data: Uint8Array<ArrayBuffer> }> {
		if ('filedrop' in rawMetadata) {
			// drop the filedrop as we do not sign that
			delete rawMetadata.filedrop
		}

		const metadataForSignature = stringToBuffer(btoa(stringify(rawMetadata)))

		const certs = certificates.map((certificate) => Certificate.fromBER(certificate.rawData))
		const cms = new SignedData({
			version: 1,
			certificates: certs,
			encapContentInfo: new EncapsulatedContentInfo({
				eContentType: ContentInfo.DATA,
			}),
			signerInfos: [new SignerInfo({
				sid: new IssuerAndSerialNumber({
					issuer: certs[0]!.issuer,
					serialNumber: certs[0]!.serialNumber,
				}),
				signatureAlgorithm: certs[0]!.signatureAlgorithm,
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

		return { cms, data: metadataForSignature }
	}

	async #exportSignature(certificate: X509Certificate, rawMetadata: Partial<MetaData>): Promise<string> {
		const { cms, data } = await this.#getSignedData([certificate], rawMetadata)
		const signKey = await convertEncryptionKeyToSigningKey(certificate.privateKey!)

		await cms.sign(signKey, 0, 'SHA-256', data)

		const contentInfo = new ContentInfo({
			contentType: ContentInfo.SIGNED_DATA,
			content: cms.toSchema(true),
		})
		return contentInfo.toString('base64')
	}
}
