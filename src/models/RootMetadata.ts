/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IMetadata, IRawMetadataFiledrop, IRawMetadataUser, IRawRootMetadata } from './metadata.d.ts'

import { X509Certificate } from '@peculiar/x509'
import { base64ToBuffer } from '../services/bufferUtils.ts'
import { sha256Hash } from '../services/crypto.ts'
import logger from '../services/logger.ts'
import { decryptMetadata, encryptMetadataKey } from '../services/metadata.ts'
import { ensureKeyUsage } from '../services/rsaUtils.ts'
import { Metadata } from './Metadata.ts'

export class RootMetadata extends Metadata<IRawRootMetadata> {
	#filedrop?: Record<string, IRawMetadataFiledrop>
	#users: IRawMetadataUser[]
	#usersModified: boolean

	protected constructor(metadataKey: CryptoKey, version: string = '2.0', initialMetadata?: IMetadata) {
		super(metadataKey, version, initialMetadata)
		this.#users = []
		this.#usersModified = false
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
		// when users are added or removed we need to re-encrypt the metadata key for all users
		if (this.#usersModified) {
			this._metadataKey = await RootMetadata.generateMetadataKey()
			const metadataKey = new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', this._metadataKey))
			for (const user of this.#users) {
				const cert = new X509Certificate(user.certificate)
				const userKey = await cert.publicKey.export()
				user.encryptedMetadataKey = await encryptMetadataKey(metadataKey, userKey)
			}
			this._metadata.keyChecksums.push(await sha256Hash(metadataKey))
			this.#usersModified = false
		}

		return {
			...await super._exportMetadata(),
			users: this.#users,
			filedrop: this.#filedrop,
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

		if (json.version !== '2.0') {
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
		metadata.#filedrop = json.filedrop
		metadata.#users = json.users
		return metadata
	}
}
