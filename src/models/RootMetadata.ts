/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IMetadata, IRawMetadataFileDrop, IRawMetadataUser, IRawRootMetadata } from './metadata.d.ts'

import { X509Certificate } from '@peculiar/x509'
import { base64ToBuffer, bufferToBase64 } from '../services/bufferUtils.ts'
import { sha256Hash } from '../services/crypto.ts'
import logger from '../services/logger.ts'
import { decryptMetadata } from '../services/metadata.ts'
import { encryptWithRSA, ensureKeyUsage } from '../services/rsaUtils.ts'
import { FileDropEntry } from './FileDropEntry.ts'
import { Metadata } from './Metadata.ts'

export class RootMetadata extends Metadata<IRawRootMetadata> {
	#filedrop?: Record<string, FileDropEntry>
	#users: IRawMetadataUser[]
	#usersModified: boolean

	protected constructor(metadataKey: CryptoKey, version: string = '2.0', initialMetadata?: IMetadata) {
		super(metadataKey, version, initialMetadata)
		this.#users = []
		this.#usersModified = false
	}

	public get fileDropEntries(): string[] {
		return this.#filedrop ? Object.keys(this.#filedrop) : []
	}

	public get hasFileDropEntries(): boolean {
		return this.fileDropEntries.length > 0
	}

	public getFileDropEntry(entryName: string): FileDropEntry | undefined {
		return this.#filedrop?.[entryName]
	}

	/**
	 * Migrate a file drop entry to a regular file entry in the metadata.
	 *
	 * @param entryName - The name of the file drop entry to migrate
	 */
	public migrateFileDrop(entryName: string): void {
		logger.debug(`Migrating file drop entry ${entryName} from folder metadata`)
		if (!this.#filedrop || !(entryName in this.#filedrop)) {
			logger.warn(`Trying to migrate non-existing file drop entry: ${entryName}`)
			return
		}

		this.addFile(entryName, this.#filedrop[entryName].getFile())
		delete this.#filedrop[entryName]
	}

	public get rawUsers(): IRawMetadataUser[] {
		return this.#users
	}

	public async removeUser(userId: string): Promise<void> {
		logger.debug(`Removing user ${userId} from folder metadata`)
		const user = this.#users.find((u) => u.userId === userId)
		if (!user) {
			logger.warn(`User ${userId} not found in folder metadata`)
			return
		}

		this.#users = this.#users.filter((u) => u.userId !== userId)
		this.#usersModified = true
		this._modified = true
	}

	/**
	 * Add a new user to the metadata (add access for a user)
	 *
	 * @param userId - The user ID
	 * @param certificate - The user's public key (x509 certificate)
	 */
	public async addUser(userId: string, certificate: X509Certificate): Promise<void> {
		logger.debug(`Adding user ${userId} to folder metadata`)

		if (userId.startsWith('s:') && this._version === '2.0') {
			this._version = '2.1'
		}

		this.#users.push({ userId, certificate: certificate.toString('pem'), encryptedMetadataKey: '' })
		this.#usersModified = true
		this._modified = true
	}

	/**
	 * Get the list of user IDs who have access to this folder
	 */
	public getUsers(): string[] {
		return this.#users.map((u) => u.userId)
	}

	public markAsDeleted(): void {
		this._metadata.deleted = true
		this._metadata.files = {}
		this._metadata.folders = {}
		this.#filedrop = {}
	}

	protected async _exportMetadata(): Promise<IRawRootMetadata> {
		const users: { userId: string, key: CryptoKey }[] = []
		for (const user of this.#users) {
			const cert = new X509Certificate(user.certificate)
			users.push({ userId: user.userId, key: await cert.publicKey.export() })
		}

		// when users are added or removed we need to re-encrypt the metadata key for all users
		if (this.#usersModified) {
			this._metadataKey = await RootMetadata.generateMetadataKey()
			const metadataKey = new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', this._metadataKey))
			for (const user of this.#users) {
				const userKey = users.find((u) => u.userId === user.userId)!.key
				const encryptedContent = await encryptWithRSA(metadataKey, userKey)
				user.encryptedMetadataKey = bufferToBase64(new Uint8Array(encryptedContent))
			}
			this._metadata.keyChecksums.push(await sha256Hash(metadataKey))
			this.#usersModified = false
		}

		let fileDrop: Record<string, IRawMetadataFileDrop> | undefined = undefined
		if (this.#filedrop) {
			fileDrop = {}
			for (const [name, entry] of Object.entries(this.#filedrop)) {
				fileDrop[name] = await entry.export(users)
			}
		}

		return {
			...await super._exportMetadata(),
			users: this.#users,
			filedrop: fileDrop,
		}
	}

	protected static async generateMetadataKey(): Promise<CryptoKey> {
		return await globalThis.crypto.subtle.generateKey(
			{
				name: 'AES-GCM',
				length: 128,
			},
			true,
			['encrypt', 'decrypt'],
		)
	}

	public static async createNew(): Promise<RootMetadata> {
		const metadataKey = await RootMetadata.generateMetadataKey()
		return new RootMetadata(metadataKey)
	}

	public static async fromJson(json: IRawRootMetadata, userId: string, privateKey: CryptoKey): Promise<RootMetadata> {
		if ('users' in json === false) {
			throw new Error('Provided metadata is not root metadata')
		}

		if (['2.0', '2.1'].includes(json.version) === false) {
			throw new Error(`Unsupported metadata version: ${json.version}`)
		}

		const currentUserEntry = json.users.find((u) => u.userId === userId)
		if (!currentUserEntry) {
			throw new Error('Current user has no access to this folder')
		}

		const decryptionKey = await ensureKeyUsage(privateKey, 'decrypt')

		const metadataKeyData = await globalThis.crypto.subtle.decrypt(
			{
				name: 'RSA-OAEP',
			},
			decryptionKey,
			base64ToBuffer(currentUserEntry.encryptedMetadataKey),
		)
		const metadataKey = await globalThis.crypto.subtle.importKey(
			'raw',
			metadataKeyData,
			{ name: 'AES-GCM', length: 128 },
			false,
			['decrypt', 'encrypt'],
		)

		const metadata = new RootMetadata(
			metadataKey,
			json.version,
			await decryptMetadata(json, metadataKey),
		)
		if (json.filedrop && Object.keys(json.filedrop).length > 0) {
			logger.debug('Found file drop entries in metadata', { fileDrop: json.filedrop })
			const fileDropEntries: [string, FileDropEntry][] = []
			for (const [name, entry] of Object.entries(json.filedrop)) {
				try {
					fileDropEntries.push([name, await FileDropEntry.fromJson(entry, userId, decryptionKey)])
				} catch (error) {
					logger.error('Failed to decrypt file drop entry', { name, error })
				}
			}
			metadata.#filedrop = Object.fromEntries(fileDropEntries)
		}
		metadata.#users = json.users
		return metadata
	}
}
