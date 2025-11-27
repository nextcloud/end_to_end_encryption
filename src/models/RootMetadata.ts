/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { X509Certificate } from '@peculiar/x509'
import type { IRawMetadata, IRawMetadataFiledrop, IRawMetadataUser, IRawRootMetadata } from './metadata.d.ts'

import { base64ToBuffer, bufferToBase64, bufferToString } from '../services/bufferUtils.ts'
import { uncompress } from '../services/compression.ts'
import { sha256Hash } from '../services/crypto.ts'
import logger from '../services/logger.ts'
import { Metadata } from './Metadata.ts'

export class RootMetadata extends Metadata<IRawRootMetadata> {
	#filedrop?: Record<string, IRawMetadataFiledrop>
	#users: IRawMetadataUser[]

	protected constructor(metadataKey: CryptoKey, version: string = '2.0', initialMetadata?: IRawMetadata) {
		super(metadataKey, version, initialMetadata)
		this.#users = []
	}

	public async removeUser(userId: string): Promise<void> {
		logger.debug(`Removing user ${userId} from folder metadata`)
		const user = this.#users.find((u) => u.userId === userId)
		if (!user) {
			logger.warn(`User ${userId} not found in folder metadata`)
			return
		}

		this.#users = this.#users.filter((u) => u.userId !== userId)
		// TODO: add new metadata key and re-encrypt for remaining users
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
		this._metadata.keyChecksums.push(keyChecksum)
	}

	/**
	 * Get the list of user IDs who have access to this folder
	 */
	public getUsers(): string[] {
		return this.#users.map((u) => u.userId)
	}

	protected async _exportMetadata(): Promise<IRawRootMetadata> {
		return {
			...await super._exportMetadata(),
			users: this.#users,
			filedrop: this.#filedrop,
		}
	}

	/**
	 * Encrypt the metadata key with the user's public key
	 *
	 * @param key - The user's public key
	 */
	async #encryptMetadataKey(key: CryptoKey) {
		if (!this._metadataKey) {
			throw new Error('Metadata key is not set')
		}

		const metadataKey = await globalThis.crypto.subtle.exportKey('raw', this._metadataKey)
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

	public static async createNew(): Promise<RootMetadata> {
		const metadataKey = await globalThis.crypto.subtle.generateKey(
			{
				name: 'AES-GCM',
				length: 128,
			},
			true,
			['encrypt', 'decrypt'],
		)
		return new RootMetadata(metadataKey)
	}

	public static async fromJson(json: string, userId: string, privateKey: CryptoKey): Promise<RootMetadata> {
		const parsed = JSON.parse(json) as IRawRootMetadata
		if ('users' in parsed === false) {
			throw new Error('Provided metadata is not root metadata')
		}

		if (parsed.version !== '2.0') {
			throw new Error(`Unsupported metadata version: ${parsed.version}`)
		}

		const currentUserEntry = parsed.users.find((u) => u.userId === userId)
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

		const metadata = new RootMetadata(metadataKey, parsed.version, JSON.parse(jsonMetadata))
		metadata.#filedrop = parsed.filedrop
		metadata.#users = parsed.users
		return metadata
	}
}
