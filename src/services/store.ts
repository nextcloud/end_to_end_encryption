/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { X509Certificate } from '@peculiar/x509'
import type { IRawMetadata } from '../models/metadata.d.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { dirname } from '@nextcloud/paths'
import { Metadata } from '../models/Metadata.ts'
import { RootMetadata } from '../models/RootMetadata.ts'
import * as api from './api.ts'
import { isRootMetadata, validateMetadataSignature } from './metadata.ts'
import { promptUserForMnemonic } from './mnemonicDialogs.ts'
import { decryptPrivateKey } from './privateKeyUtils.ts'

const currentUser = getCurrentUser()!.uid

class MetadataStore {
	#privateKey?: CryptoKey
	#serverKeyPEM?: string
	publicKeyCache: Map<string, X509Certificate>
	#metadataCache: Map<string, Metadata>
	#mnotic?: string

	constructor() {
		this.#metadataCache = new Map()
		this.publicKeyCache = new Map()
	}

	/**
	 * Get the user's private key.
	 * It will be loaded from server and decrypted on first access.
	 */
	async getPrivateKey(): Promise<CryptoKey> {
		if (!this.#privateKey) {
			const encryptedKey = await api.getPrivateKey()
			if (!encryptedKey) {
				throw new Error('No private key found for user')
			}

			if (!this.#mnotic) {
				this.#mnotic = await promptUserForMnemonic()
			}
			this.#privateKey = await decryptPrivateKey(encryptedKey, this.#mnotic!)
		}
		return this.#privateKey
	}

	/**
	 * Get the root metadata for the given path.
	 *
	 * @param path - The path to get the root metadata for
	 * @throws Error - If the root metadata signature verification fails
	 * @throws AxiosError - If the target path is not end-to-end encrypted
	 */
	async getRootMetadata(path: string): Promise<RootMetadata> {
		let metadata = this.#metadataCache.get(path)
		if (metadata) {
			if (metadata instanceof RootMetadata) {
				return metadata
			}
			return this.getRootMetadata(dirname(path))
		}

		const data = await api.getMetadata(path)
		const metadataRaw: IRawMetadata = JSON.parse(data.metadata)
		if (isRootMetadata(metadataRaw)) {
			await validateMetadataSignature(metadataRaw, data.signature, metadataRaw)
			const rootMetadata = await RootMetadata.fromJson(metadataRaw, currentUser, await this.getPrivateKey())
			if (!await rootMetadata.verifySignature(data.signature)) {
				throw new Error('Root metadata signature verification failed')
			}

			this.#metadataCache.set(
				path,
				rootMetadata,
			)
			return rootMetadata
		}

		const rootMetadata = await this.getRootMetadata(dirname(path))
		// but also save it back for later
		metadata = await Metadata.fromJson(metadataRaw, rootMetadata.getKey())
		this.#metadataCache.set(path, metadata!)
		return rootMetadata
	}

	/**
	 * Get the metadata for the given path.
	 *
	 * @param path - The path to get the metadata for
	 */
	async getMetadata(path: string): Promise<Metadata> {
		if (!this.#metadataCache.has(path)) {
			// if this is not in the cache, fetch the root metadata which will populate the cache as a side effect
			await this.getRootMetadata(path)
		}

		return this.#metadataCache.get(path)!
	}
}

export const store = new MetadataStore()
