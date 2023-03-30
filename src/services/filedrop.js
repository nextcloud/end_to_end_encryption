import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { EncryptedFile, encryptStringAsymmetric, encryptWithAES, getRandomAESKey } from './crypto.js'

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
 * @property {string} encryptedKey - Encryption key to decrypt the 'encrypted' property
 * @property {string} encryptedInitializationVector - Encryption initialization vector used to decrypt the 'encrypted' property.
 * @property {string} encryptedTag - Encryption tag used to decrypt the 'encrypted' property.
 */

async function getRandomEncryptionParams() {
	return {
		key: await getRandomAESKey(),
		initializationVector: window.crypto.getRandomValues(new Uint8Array(16)),
	}
}

/**
 * @param {ArrayBuffer} buffer
 * @return {string}
 */
function bufferToBase64(buffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

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
		key: bufferToBase64(rawFileEncryptionKey),
		filename: file.originalFileName,
		mimetype: file.mimetype,
		version: '1.2',
	}

	const encryptedEncryptionParams = await getRandomEncryptionParams()

	const encrypted = await encryptWithAES(
		encryptedEncryptionParams,
		new TextEncoder().encode(JSON.stringify(encryptedPayload))
	)

	const encryptedKey = await encryptStringAsymmetric(
		publicKey,
		await window.crypto.subtle.exportKey('raw', encryptedEncryptionParams.key),
	)

	return {
		[file.encryptedFileName]: {
			encrypted: bufferToBase64(encrypted.content),
			initializationVector: bufferToBase64(file.initializationVector),
			authenticationTag: bufferToBase64(tag),
			encryptedKey: bufferToBase64(encryptedKey),
			encryptedTag: bufferToBase64(encrypted.tag),
			encryptedInitializationVector: bufferToBase64(encryptedEncryptionParams.initializationVector),
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
