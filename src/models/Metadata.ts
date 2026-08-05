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
import logger from '../services/logger.ts'
import { decryptMetadata } from '../services/metadata.ts'
import { ensureKeyUsage } from '../services/rsaUtils.ts'

/**
 * A copy of everything a metadata object holds, taken at the point it last matched
 * the metadata on the server - see {@link Metadata.rollback}.
 */
interface IMetadataState {
	metadata: IMetadata
	metadataKey: CryptoKey
	version: string
}

export class Metadata<MetaData extends IRawMetadata = IRawMetadata> {
	protected _metadataKey: CryptoKey
	protected _metadata: IMetadata
	protected _version: string
	protected _modified: boolean
	/** The internal real metadata */
	#metadata: IMetadata
	/** The state {@link rollback} returns to */
	#committedState: IMetadataState

	/**
	 * Constructor for E2EE Metadata
	 *
	 * @param metadataKey - The metadata key used to encrypt/decrypt the metadata
	 * @param version - The metadata version
	 * @param initialMetadata - Optional initial metadata to populate the instance with
	 */
	protected constructor(metadataKey: CryptoKey, version: string = '2.0', initialMetadata?: IMetadata) {
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

		// Nothing has been changed yet, so this is the state of the folder on the
		// server. Taken here and not through `_commitState`, as calling an
		// overridden method from a constructor would run it before the fields of
		// the subclass exist.
		this.#committedState = this.#createState()
	}

	public get counter(): number {
		return this._metadata.counter
	}

	public get key(): CryptoKey {
		return this._metadataKey
	}

	public set key(newKey: CryptoKey) {
		this._metadataKey = newKey
		this._modified = true
	}

	/**
	 * Get the UUID for a given filename.
	 * This will lookup both files and folders.
	 *
	 * @param filename - The filename to lookup
	 */
	public getUuid(filename: string): string | undefined {
		for (const [uuid, file] of Object.entries(this._metadata.files)) {
			if (file.filename === filename) {
				return uuid
			}
		}
		for (const [uuid, folderName] of Object.entries(this._metadata.folders)) {
			if (folderName === filename) {
				return uuid
			}
		}
	}

	/**
	 * Check if a UUID exists in the metadata.
	 *
	 * @param uuid - The UUID to lookup
	 */
	public hasUuid(uuid: string): boolean {
		return uuid in this._metadata.files || uuid in this._metadata.folders
	}

	/**
	 * Get the file or folder by its UUID.
	 * In case of a folder, the mimetype will be 'httpd/unix-directory'.
	 *
	 * @param uuid - The uuid to lookup
	 */
	public getByUuid(uuid: string): { filename: string, mimetype: string } | undefined {
		if (!this.hasUuid(uuid)) {
			return
		}

		const file = this.getFile(uuid)
		if (file) {
			return file
		}
		return {
			filename: this.getFolder(uuid)!,
			mimetype: 'httpd/unix-directory',
		}
	}

	/**
	 * Get the list of all contents (files and folders) in the metadata.
	 */
	listContents(): string[] {
		return [
			...Object.values(this._metadata.folders),
			...Object.values(this._metadata.files).map((file) => file.filename),
		]
	}

	public getFolders(): [string, string][] {
		return Object.entries(this._metadata.folders)
	}

	public getFiles(): [string, string][] {
		return Object.entries(this._metadata.files).map(([uuid, file]) => [uuid, file.filename])
	}

	public getFolder(uuid: string): string | undefined {
		return this._metadata.folders[uuid]
	}

	public addFolder(uuid: string, folderName: string): void {
		this._metadata.folders = {
			...this._metadata.folders,
			[uuid]: folderName,
		}
	}

	public deleteFolder(uuid: string): void {
		if (!this._metadata.folders[uuid]) {
			throw new Error(`Folder with UUID ${uuid} does not exist`)
		}

		delete this._metadata.folders[uuid]
		this._metadata.folders = { ...this._metadata.folders } // needed for reactivity of the counter
	}

	public getFile(uuid: string): IMetadataFile | undefined {
		return this._metadata.files[uuid]
	}

	public addFile(uuid: string, file: IMetadataFile): void {
		this._metadata.files = {
			...this._metadata.files,
			[uuid]: file,
		}
	}

	public deleteFile(uuid: string): void {
		if (!this._metadata.files[uuid]) {
			throw new Error(`File with UUID ${uuid} does not exist`)
		}

		delete this._metadata.files[uuid]
		this._metadata.files = { ...this._metadata.files } // needed for reactivity of the counter
	}

	public rename(uuid: string, newName: string): void {
		if (uuid in this._metadata.files) {
			this._metadata.files = {
				...this._metadata.files,
				[uuid]: {
					...this._metadata.files[uuid]!,
					filename: newName,
				},
			}
		} else if (uuid in this._metadata.folders) {
			this._metadata.folders = {
				...this._metadata.folders,
				[uuid]: newName,
			}
		} else {
			throw new Error(`UUID ${uuid} does not exist in files or folders`)
		}
	}

	/**
	 * Undo every change made since this metadata was loaded or last exported.
	 */
	public rollback(): void {
		logger.debug('Rolling back metadata changes')
		this._restoreState()
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

		// apply all changes
		this.#metadata.counter = this.counter
		this._modified = false
		this._commitState()

		return { metadata, signature }
	}

	public static async fromJson(json: IRawMetadata, metadataKey: CryptoKey): Promise<Metadata> {
		if (['2.0', '2.1'].includes(json.version) === false) {
			throw new Error(`Unsupported metadata version: ${json.version}`)
		}

		return new Metadata(
			metadataKey,
			json.version,
			await decryptMetadata(json, metadataKey),
		)
	}

	public static async createNew(metadataKey: CryptoKey): Promise<Metadata> {
		return new Metadata(metadataKey)
	}

	/**
	 * Remember the current state as the one a {@link rollback} returns to, i.e. as
	 * the state the server has.
	 *
	 * Subclasses have to extend this to cover what they hold themselves, and to
	 * call it once they are done setting up an instance from existing metadata.
	 */
	protected _commitState(): void {
		this.#committedState = this.#createState()
	}

	/**
	 * Restore the state remembered by the last {@link _commitState}.
	 *
	 * Subclasses have to extend this to cover what they hold themselves.
	 */
	protected _restoreState(): void {
		// Assigned into the existing object instead of replacing it: this object is
		// the target of the `_metadata` proxy, so swapping it would leave every
		// change from here on going to an object nobody reads anymore. Every
		// property of the metadata is part of the state, so all of them are restored.
		Object.assign(this.#metadata, structuredClone(this.#committedState.metadata))
		this._metadataKey = this.#committedState.metadataKey
		this._version = this.#committedState.version
		this._modified = false
	}

	/**
	 * Take a copy of the current state, deep enough to be unaffected by later changes.
	 */
	#createState(): IMetadataState {
		return {
			metadata: structuredClone(this.#metadata),
			metadataKey: this._metadataKey,
			version: this._version,
		}
	}

	protected async _exportMetadata(): Promise<MetaData> {
		const jsonMetadata = stringify(this._metadata)
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

	async #exportSignature(certificate: X509Certificate, rawMetadata: Partial<MetaData>): Promise<string> {
		const { cms, data } = await this.#getSignedData([certificate], rawMetadata)
		const signKey = await ensureKeyUsage(certificate.privateKey!, 'sign')

		logger.debug('Signing metadata')
		await cms.sign(signKey, 0, 'SHA-256', data)

		const contentInfo = new ContentInfo({
			contentType: ContentInfo.SIGNED_DATA,
			content: cms.toSchema(true),
		})
		return contentInfo.toString('base64')
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
}
