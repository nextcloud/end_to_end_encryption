/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export interface IRawMetadataUser {
	/**
	 * The user's ID
	 */
	userId: string
	/**
	 * The user's public key (x509 as PEM)
	 */
	certificate: string
	/**
	 * The metadata key encrypted with the user's public key, then base64 encoded.
	 * So the user can decrypt it with their private key and use it to decrypt the metadata.
	 */
	encryptedMetadataKey: string
}

export interface IRawMetadataFiledrop {
	ciphertext: string
	nonce: string
	authenticationTag: string
	users: Array<{
		userId: string
		encryptedFiledropKey: string
	}>
}

export interface IRawMetadata {
	metadata: {
		/**
		 * Encrypted metadata (AES/GCM/NoPadding, 128 bit key size with key from "users" section).
		 *
		 * Data is first gzipped, then encrypted, then base64 encoded.
		 */
		ciphertext: string
		nonce: string // sometimes also called iv
		authenticationTag: string
	}

	/**
	 * Metadata version
	 */
	version: string
}

export interface IRawRootMetadata extends IRawMetadata {
	/**
	 * Array of users who have access to the folder
	 */
	users: IRawMetadataUser[]

	/**
	 * Mapping of uuid to filedrop info
	 */
	filedrop?: Record<string, IRawMetadataFiledrop>
}

export interface IMetadataFile {
	/** Unencrypted file name */
	filename: string
	/** Mimetype. If unknown, use "application/octet-stream" */
	mimetype: string
	/** Encryption algorithm: AES/GCM/NoPadding (128 bit key size) */
	nonce: string
	authenticationTag: string
	key: string
}

export interface IMetadata {
	/** list of hashes of metadata-keys */
	keyChecksums: string[]
	deleted: boolean
	counter: number
	/**
	 * Mapping of uuids to cleartext folder names
	 */
	folders: Record<string, string>
	files: Record<string, IMetadataFile>
}
