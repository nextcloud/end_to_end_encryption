import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { EncryptedFile, encryptStringAsymmetric } from './crypto.js'

/**
 * @typedef {object} EncryptedFileKey
 * @property {string} key - Encryption key of the file (ex: "jtboLmgGR1OQf2uneqCVHpklQLlIwWL5TXAQ0keK")
 * @property {string} filename - Unencrypted file name (ex: "/foo/test.txt")
 * @property {string} mimetype - Mimetype, if unknown use "application/octet-stream" (ex: "plain/text")
 * @property {object} version - Which encryption method version was used? For updating in the future. (ex: 1)
 */

/**
 * @typedef {object} EncryptedFileMetadata
 * @property {string} encrypted - Encrypted JSON payload to the currently used metadata key. Encryption algorithm: AES/GCM/NoPadding (128 bit key size) with metadata key (symmetric)
 * @property {string} initializationVector - Initialization vector (ex: "+mHu52HyZq+pAAIN")
 * @property {string} authenticationTag - Authentication tag of the file (ex: "LYRaJghbZUzBiNWb51ypWw==")
 */

/**
 * @param {EncryptedFile} file
 * @param {Uint8Array} tag
 * @param {string} publicKey
 * @return {Promise<Object<string, EncryptedFileMetadata>>}
 */
export async function getFileDropEntry(file, tag, publicKey) {
	const rawFileEncryptionKey = await window.crypto.subtle.exportKey('raw', await file.getEncryptionKey())

	/** @type {EncryptedFileKey} */
	const encryptedPayload = {
		key: btoa(String.fromCharCode(...new Uint8Array(rawFileEncryptionKey))),
		filename: file.originalFileName,
		mimetype: file.mimetype,
		version: '1.2',
	}

	const encrypted = await encryptStringAsymmetric(
		publicKey,
		new TextEncoder().encode(btoa(JSON.stringify(encryptedPayload)))
	)

	return {
		[file.encryptedFileName]: {
			encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
			initializationVector: btoa(String.fromCharCode(...file.initializationVector)),
			authenticationTag: btoa(String.fromCharCode(...new Uint8Array(tag))),
		},
	}
}

/**
 * @param {string} folderId
 * @param {EncryptedFileMetadata[]} fileDrop
 * @param {string} lockToken
 * @param {string} shareToken
 */
export async function uploadFileDrop(folderId, fileDrop, lockToken, shareToken) {
	const ocsUrl = generateOcsUrl(
		'apps/end_to_end_encryption/api/v1/meta-data/{folderId}',
		{
			folderId,
		}
	)

	const { data: { ocs: { meta } } } = await axios.put(
		`${ocsUrl}/filedrop`,
		{
			fileDrop: JSON.stringify(fileDrop),
		},
		{
			headers: {
				'x-e2ee-supported': true,
			},
			params: {
				'e2e-token': lockToken,
				shareToken,
			},
		},
	)

	if (meta.statuscode !== 200) {
		throw new Error(`Failed to upload metadata: ${meta.message}`)
	}
}
