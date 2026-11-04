/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IMetadata, IMetadataFile, IRawMetadata, IRawMetadataUser } from '../models/metadata.d.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { dirname } from '@nextcloud/paths'
import { FileDropEntry } from '../models/FileDropEntry.ts'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'
import * as api from './api.ts'
import { sha256Hash } from './crypto.ts'
import { decryptMetadata, decryptMetadataKey, importMetadataKey, isRootMetadata, validateMetadataSignature } from './metadata.ts'

const SUPPORTED_VERSIONS = ['2.0', '2.1']
const REDACTED = '[redacted]'
/** Fields of a file entry that are safe to show, every other field is redacted */
const PUBLIC_FILE_FIELDS = ['filename', 'mimetype', 'chunked', 'filesize']

export type DebugCheckId = 'metadata' | 'version' | 'metadataKey' | 'decrypt' | 'signature' | 'keyChecksum'

export interface IDebugCheck {
	id: DebugCheckId
	status: 'passed' | 'failed' | 'skipped'
	error?: string
}

export interface IDebugServerNode {
	/** The name on the server, for encrypted nodes this is the UUID */
	name: string
	isFolder: boolean
}

export interface IDebugEntry {
	uuid: string
	name: string
	mimetype: string
	isFolder: boolean
	existsOnServer: boolean
}

export interface IDebugFileDropEntry {
	uuid: string
	/** Users who can decrypt the entry */
	recipients: string[]
	name?: string
	mimetype?: string
	error?: string
	existsOnServer: boolean
}

export interface IDebugReport {
	version?: string
	isRoot?: boolean
	counter?: number
	/** Users who have access to the folder */
	users: string[]
	checks: IDebugCheck[]
	/** Files and folders listed in the metadata */
	contents: IDebugEntry[]
	fileDrop: IDebugFileDropEntry[]
	/** Nodes on the server that are neither listed in the metadata nor in the file drop */
	unknownServerNodes: IDebugServerNode[]
	/** The decrypted metadata with all secrets redacted */
	redactedMetadata?: Record<string, unknown>
}

export interface IInspectMetadataOptions {
	/** The raw metadata as stored on the server */
	rawMetadata?: string
	signature: string
	/** The current user */
	userId: string
	/** The contents of the folder on the server */
	serverNodes: IDebugServerNode[]
	getPrivateKey: () => Promise<CryptoKey>
	/** Get the metadata key and users of the root metadata, only used for nested metadata */
	getRootMetadata: () => Promise<{ key: CryptoKey, users: IRawMetadataUser[] }>
}

/**
 * Load the metadata of an encrypted folder and inspect it.
 *
 * @param path - The path of the folder relative to the DAV root, with the names as stored on the server
 */
export async function loadDebugReport(path: string): Promise<IDebugReport> {
	const { folder, contents } = await api.getRawFolderListing(path)
	const rawMetadata = folder.props?.['e2ee-metadata']
	const signature = folder.props?.['e2ee-metadata-signature']

	return await inspectMetadata({
		rawMetadata: rawMetadata ? String(rawMetadata) : undefined,
		signature: signature ? String(signature) : '',
		userId: getCurrentUser()!.uid,
		serverNodes: contents.map((node) => ({ name: node.basename, isFolder: node.type === 'directory' })),
		getPrivateKey: keyStore.getPrivateKey,
		getRootMetadata: async () => {
			const root = await metadataStore.getRootMetadata(dirname(path))
			return { key: root.key, users: root.rawUsers }
		},
	})
}

/**
 * Inspect the given metadata step by step.
 * Every step is reported as a check, so a failing step does not hide the results of the others.
 *
 * @param options - The metadata to inspect and how to get the keys needed for it
 */
export async function inspectMetadata(options: IInspectMetadataOptions): Promise<IDebugReport> {
	const report: IDebugReport = {
		users: [],
		checks: [],
		contents: [],
		fileDrop: [],
		unknownServerNodes: [],
	}
	const addCheck = (id: DebugCheckId, status: IDebugCheck['status'], error?: unknown) => {
		report.checks.push({ id, status, error: error === undefined ? undefined : getErrorMessage(error) })
	}
	const skipChecks = (...ids: DebugCheckId[]) => ids.forEach((id) => addCheck(id, 'skipped'))

	let privateKey: Promise<CryptoKey> | undefined
	const getPrivateKey = () => (privateKey ??= options.getPrivateKey())

	let raw: IRawMetadata
	try {
		if (!options.rawMetadata) {
			throw new Error('No metadata is stored for this folder')
		}
		raw = JSON.parse(options.rawMetadata)
		addCheck('metadata', 'passed')
	} catch (error) {
		addCheck('metadata', 'failed', error)
		skipChecks('version', 'metadataKey', 'decrypt', 'signature')
		return report
	}

	report.version = getMetadataVersion(raw)
	if (!report.version || !SUPPORTED_VERSIONS.includes(report.version)) {
		addCheck('version', 'failed', `Unsupported metadata version: ${report.version ?? 'unknown'}`)
		skipChecks('metadataKey', 'decrypt', 'signature')
		return report
	}
	addCheck('version', 'passed')

	report.isRoot = isRootMetadata(raw)
	let users: IRawMetadataUser[] | undefined
	let metadataKey: CryptoKey | undefined
	let metadataKeyChecksum: string | undefined
	try {
		if (isRootMetadata(raw)) {
			users = raw.users
			report.users = users.map(({ userId }) => userId)
			const rawKey = await decryptMetadataKey(raw, options.userId, await getPrivateKey())
			metadataKeyChecksum = await sha256Hash(rawKey)
			metadataKey = await importMetadataKey(rawKey)
		} else {
			const root = await options.getRootMetadata()
			users = root.users
			report.users = users.map(({ userId }) => userId)
			metadataKey = root.key
		}
		addCheck('metadataKey', 'passed')
	} catch (error) {
		addCheck('metadataKey', 'failed', error)
	}

	let metadata: IMetadata | undefined
	if (metadataKey) {
		try {
			metadata = await decryptMetadata(raw, metadataKey)
			addCheck('decrypt', 'passed')
		} catch (error) {
			addCheck('decrypt', 'failed', error)
		}
	} else {
		skipChecks('decrypt')
	}

	if (users) {
		try {
			await validateMetadataSignature(raw, options.signature, users)
			addCheck('signature', 'passed')
		} catch (error) {
			addCheck('signature', 'failed', error)
		}
	} else {
		skipChecks('signature')
	}

	if (report.isRoot) {
		if (!metadata || !metadataKeyChecksum) {
			skipChecks('keyChecksum')
		} else if (metadata.keyChecksums.includes(metadataKeyChecksum)) {
			addCheck('keyChecksum', 'passed')
		} else {
			addCheck('keyChecksum', 'failed', 'The checksum of the metadata key is not listed in the metadata')
		}
	}

	const serverNames = new Set(options.serverNodes.map(({ name }) => name))
	const fileDropFiles: Record<string, IMetadataFile> = {}
	const rawFileDrop = isRootMetadata(raw) ? raw.filedrop ?? {} : {}
	for (const [uuid, rawEntry] of Object.entries(rawFileDrop)) {
		const entry: IDebugFileDropEntry = {
			uuid,
			recipients: rawEntry.users.map(({ userId }) => userId),
			existsOnServer: serverNames.has(uuid),
		}
		try {
			const file = (await FileDropEntry.fromJson(rawEntry, options.userId, await getPrivateKey())).getFile()
			entry.name = file.filename
			entry.mimetype = file.mimetype
			fileDropFiles[uuid] = file
		} catch (error) {
			entry.error = getErrorMessage(error)
		}
		report.fileDrop.push(entry)
	}

	if (metadata) {
		const { files, folders } = metadata
		report.counter = metadata.counter
		report.contents = [
			...Object.entries(folders).map(([uuid, name]) => ({
				uuid,
				name,
				mimetype: 'httpd/unix-directory',
				isFolder: true,
				existsOnServer: serverNames.has(uuid),
			})),
			...Object.entries(files).map(([uuid, file]) => ({
				uuid,
				name: file.filename,
				mimetype: file.mimetype,
				isFolder: false,
				existsOnServer: serverNames.has(uuid),
			})),
		].sort((a, b) => a.name.localeCompare(b.name))
		report.unknownServerNodes = options.serverNodes
			.filter(({ name }) => !Object.hasOwn(files, name) && !Object.hasOwn(folders, name) && !Object.hasOwn(rawFileDrop, name))
		report.redactedMetadata = redactMetadata(metadata, fileDropFiles)
	}

	return report
}

/**
 * Get the version of raw metadata.
 * Version 2 metadata has it on the top level, legacy version 1 metadata within the metadata object.
 *
 * @param raw - The raw metadata
 */
export function getMetadataVersion(raw: unknown): string | undefined {
	if (typeof raw !== 'object' || raw === null) {
		return undefined
	}

	const version = 'version' in raw
		? raw.version
		: (raw as { metadata?: { version?: unknown } }).metadata?.version
	return (typeof version === 'string' || typeof version === 'number') ? String(version) : undefined
}

/**
 * Redact all secrets of decrypted metadata, so it can be shown and shared.
 *
 * @param metadata - The decrypted metadata
 * @param fileDrop - The decrypted file drop entries
 */
export function redactMetadata(metadata: IMetadata, fileDrop: Record<string, IMetadataFile> = {}): Record<string, unknown> {
	return {
		...metadata,
		files: redactFiles(metadata.files),
		filedrop: redactFiles(fileDrop),
	}
}

/**
 * Redact every field of the file entries that is not known to be public, like the file keys.
 *
 * @param files - Mapping of UUID to file entry
 */
function redactFiles(files: Record<string, IMetadataFile>): Record<string, Record<string, unknown>> {
	return Object.fromEntries(Object.entries(files).map(([uuid, file]) => [
		uuid,
		Object.fromEntries(Object.entries(file).map(([field, value]) => [
			field,
			PUBLIC_FILE_FIELDS.includes(field) ? value : REDACTED,
		])),
	]))
}

/**
 * @param error - The error to get a message for
 */
function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message || error.name
	}
	return String(error)
}
