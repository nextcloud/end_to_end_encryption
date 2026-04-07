/*!
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import type { IMetadataFile, IRawMetadataFileDrop } from './metadata.d.ts'

import { base64ToBuffer, bufferToBase64, bufferToString, stringToBuffer } from '../services/bufferUtils.ts'
import { compress, uncompress } from '../services/compression.ts'
import { decryptWithAES, encryptWithAES, generateAESKey, loadAESPrivateKey } from '../services/crypto.ts'
import logger from '../services/logger.ts'
import { decryptWithRSA, encryptWithRSA, ensureKeyUsage } from '../services/rsaUtils.ts'

export class FileDropEntry {
	#fileInfo: IMetadataFile

	constructor(fileInfo: IMetadataFile) {
		this.#fileInfo = fileInfo
	}

	/**
	 * Get the file info of this file drop entry
	 */
	public getFile(): IMetadataFile {
		return { ...this.#fileInfo }
	}

	public async export(users: { userId: string, key: CryptoKey }[]): Promise<IRawMetadataFileDrop> {
		const jsonDataRaw = JSON.stringify(this.#fileInfo)
		const jsonDataCompressed = await compress(stringToBuffer(jsonDataRaw))

		const key = await generateAESKey()
		const keyData = await crypto.subtle.exportKey('raw', key)
		const encryptedData = await encryptWithAES(jsonDataCompressed, key)
		return {
			ciphertext: bufferToBase64(encryptedData.encryptedContent),
			authenticationTag: bufferToBase64(encryptedData.tag),
			nonce: bufferToBase64(encryptedData.iv),
			users: await Promise.all(users.map(async (user) => {
				const encryptedFiledropKey = await encryptWithRSA(keyData, user.key)
				return {
					userId: user.userId,
					encryptedFiledropKey: bufferToBase64(new Uint8Array(encryptedFiledropKey)),
				}
			})),
		}
	}

	/**
	 * Decrypt filedrop entry from raw metadata
	 *
	 * @param json - The raw filedrop metadata
	 * @param userId - The current user's ID
	 * @param privateKey - The current user's private key to decrypt the filedrop key
	 * @fires Error If the user has no access to the file drop (no entry in "users" section)
	 */
	public static async fromJson(json: IRawMetadataFileDrop, userId: string, privateKey: CryptoKey): Promise<FileDropEntry> {
		logger.debug('Decrypting file drop entry from metadata', { json, userId })
		const userEntry = json.users.find((u) => u.userId === userId)
		if (!userEntry) {
			throw new Error('Current user has no access to this file drop')
		}

		const decryptionKey = await ensureKeyUsage(privateKey, 'decrypt')
		const fileDropKeyData = await decryptWithRSA(
			base64ToBuffer(userEntry.encryptedFiledropKey),
			decryptionKey,
		)
		const fileDropKey = await loadAESPrivateKey(fileDropKeyData)
		logger.debug('File drop key decrypted')

		const compressedData = await decryptWithAES(
			base64ToBuffer(json.ciphertext),
			fileDropKey,
			{ iv: base64ToBuffer(json.nonce), tagLength: 128 },
		)
		logger.debug('File drop entry decrypted')

		const rawData = await uncompress(new Uint8Array(compressedData))
		const fileInfo = JSON.parse(bufferToString(rawData)) as IMetadataFile

		return new this(fileInfo)
	}
}
