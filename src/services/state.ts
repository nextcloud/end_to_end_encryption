/* eslint-disable jsdoc/require-jsdoc */
/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { dirname } from 'path'
import type { WebDAVClient } from 'webdav'

import { getCurrentUser } from '@nextcloud/auth'
import { getClient, getDefaultPropfind } from '@nextcloud/files/dav'

import { isRootMetadata, type Metadata, type MetadataInfo, type RootMetadata } from '../models.ts'
import { decryptPrivateKey } from './privateKeyUtils'
import { getPrivateKey, getServerPublicKey } from './api.ts'
import { promptUserForMnemonic } from './mnemonicDialogs.ts'
import { decryptMetadataInfo, getMetadataPrivateKey } from './metadataUtils.ts'
import logger from './logger.ts'
import { validateMetadataSignature, validateUserCertificates } from './security.ts'

const davClient = getClient() as WebDAVClient

export const state = {
	_userPrivateKey: undefined as CryptoKey | undefined,
	_serverPublicKey: undefined as CryptoKey | undefined,
	_metadataCache: {} as Record<string, Metadata>,

	async getUserPrivateKey(): Promise<CryptoKey> {
		this._userPrivateKey ??= await decryptPrivateKey(await getPrivateKey(), await promptUserForMnemonic())
		return this._userPrivateKey
	},

	async getServerPublicKey(): Promise<CryptoKey> {
		this._serverPublicKey ??= await getServerPublicKey()
		return this._serverPublicKey
	},

	async getMetadata(path: string): Promise<Metadata> {
		if (this._metadataCache[path]) {
			logger.debug('Found metadata in cache', { path, state })
			return this._metadataCache[path]
		}

		// The PROPFIND will be intercepted by the WebDAV proxy, and the metadata will be saved in the cache.
		// Hence, we can directly return the content of the cache.
		logger.debug('Fetching PROPFIND for metadata', { path, state })
		await davClient.stat(decodeURI(path).replace('remote.php/dav/', ''), { details: true, data: getDefaultPropfind() })

		if (this._metadataCache[path]) {
			logger.debug('Found metadata in cache after PROPFIND', { path, state })
			return this._metadataCache[path]
		}

		throw new Error(`Could not find metadata for ${path}`)
	},

	async setMetadata(path: string, rawMetadata: string, metadataSignature: string): Promise<void> {
		const metadata = JSON.parse(rawMetadata) as Metadata

		if (isRootMetadata(metadata)) {
			await validateMetadataSignature(metadata, metadataSignature, metadata)
			await validateUserCertificates(metadata, await this.getServerPublicKey())
		} else {
			await validateMetadataSignature(metadata, metadataSignature, await this.getRootMetadata(dirname(path)))
		}

		this._metadataCache[path] = metadata
		logger.debug('Added metadata in cache', { path, state })
	},

	async getMetadataInfo(path: string): Promise<MetadataInfo> {
		const metadata = await this.getMetadata(path)
		const rootMetadata = await this.getRootMetadata(path)

		const currentUser = getCurrentUser()
		if (currentUser === null) {
			throw new Error('No user logged in')
		}

		return decryptMetadataInfo(
			metadata,
			await getMetadataPrivateKey(rootMetadata, currentUser.uid, await state.getUserPrivateKey()),
		)
	},

	async getRootMetadata(path: string): Promise<RootMetadata> {
		const cachedRootMetadata = Object.entries(state._metadataCache)
			.filter(([metadataPath]) => path.startsWith(metadataPath))
			.map(([, metadata]) => metadata)
			.find(metadata => isRootMetadata(metadata))

		if (cachedRootMetadata) {
			logger.debug('Found root metadata in cache', { path, state })
			return cachedRootMetadata
		}

		logger.debug('Looking for root metadata', { path, state })
		while (path !== '/') {
			const metadata = await state.getMetadata(path)

			if (isRootMetadata(metadata)) {
				logger.debug('Fetched root metadata', { path, state })
				return metadata
			}

			path = dirname(path)
		}

		throw new Error(`Found no root metadata for ${path}`)
	},
}
