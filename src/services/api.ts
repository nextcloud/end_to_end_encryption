/* eslint-disable jsdoc/require-jsdoc */
import { getAppRootUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { OCSResponse } from '@nextcloud/typings/ocs'

// API: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md
// API usage: https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api-usage.md

const apiRootPath = getAppRootUrl('end_to_end_encryption') + '/api/v2'
const Url = {
	PrivateKey: apiRootPath + '/private-key',
	PublicKey: apiRootPath + '/public-key',
	Lock: apiRootPath + '/lock',
	Metadata: apiRootPath + '/meta-data',
	ServerKey: apiRootPath + '/server-key',
	Encrypted: apiRootPath + '/encrypted',
}

export async function setPrivateKey(privateKey: string): Promise<void> {
	await axios.post(Url.PrivateKey, privateKey)
}

export async function getPrivateKey(): Promise<string> {
	try {
		const response = await axios.get<OCSResponse<{'private-key': string}>>(Url.PrivateKey)
		return response.data.ocs.data['private-key']
	} catch (error) {
		if (error.response.status === 404) {
			// const privateKey = await generatePrivateKey()
			// await setPrivateKey(privateKey)
			// return privateKey
		}
		throw error
	}
}

export async function deletePrivateKey(): Promise<void> {
	await axios.delete(Url.PrivateKey)
}

export async function signPublicKey(certificate: string): Promise<string> {
	const response = await axios.post<OCSResponse<{'public-key': string}>>(Url.PublicKey, certificate)
	return response.data.ocs.data['public-key']
}

export async function getPublicKeys<T extends string>(userIds?: T[]): Promise<Record<T, string>> {
	const response = await axios.get<OCSResponse<{'public-key': Record<T, string> }>>(
		Url.PublicKey,
		{ params: { users: JSON.stringify(userIds) } },
	)
	return response.data.ocs.data['public-key']
}

export async function deletePublicKey(): Promise<void> {
	await axios.delete(Url.PublicKey)
}

export async function lockFile(fileId: string, counter: number, e2eToken?: string): Promise<string> {
	const response = await axios.post<OCSResponse<{'e2e-token': string}>>(
		`${Url.Lock}/${fileId}`,
		{
			params: { 'e2e-token': e2eToken },
			undefined,
			headers: { 'X-NC-E2EE-COUNTER': counter },
		},
	)
	return response.data.ocs.data['e2e-token']
}

export async function unlockFile(fileId: string, e2eToken: string): Promise<string> {
	const response = await axios.post<OCSResponse<{'e2e-token': string}>>(
		`${Url.Lock}/${fileId}`,
		undefined,
		{ headers: { 'e2e-token': e2eToken } },
	)
	return response.data.ocs.data['e2e-token']
}

export async function storeMetadata(fileId: string, metadata: string, e2eToken: string): Promise<void> {
	await axios.post(
		`${Url.Metadata}/${fileId}`,
		metadata,
		{ headers: { 'e2e-token': e2eToken } },
	)
}

export async function getMetadata(fileId: string): Promise<string> {
	const response = await axios.get<OCSResponse<{'meta-data': string}>>(`${Url.Metadata}/${fileId}`)
	return response.data.ocs.data['meta-data']
}

export async function updateMetadata(fileId: string, metadata: string, e2eToken: string, signature: string): Promise<void> {
	await axios.put(
		`${Url.Metadata}/${fileId}`,
		metadata,
		{
			headers: {
				'e2e-token': e2eToken,
				'X-NC-E2EE-SIGNATURE': signature,
			},
		},
	)
}

export async function updateMetadataFiledrop(fileId, fileDrops, shareToken): Promise<void> {
	await axios.put(
		`${Url.Metadata}/${fileId}/filedrop`,
		{ filedrop: JSON.stringify(fileDrops) },
		{ params: { shareToken } },
	)
}

export async function deleteMetadata(fileId: string, e2eToken: string): Promise<void> {
	await axios.delete(
		`${Url.Metadata}/${fileId}`,
		{ headers: { 'e2e-token': e2eToken } },
	)
}

export async function getServerPublicKey(): Promise<string> {
	const response = await axios.get<OCSResponse<{'public-key': string}>>(Url.ServerKey)
	return response.data.ocs.data['public-key']
}

export async function setEncrypted(fileId: string): Promise<void> {
	await axios.put(`${Url.Encrypted}/${fileId}`)
}

export async function removeEncrypted(fileId: string): Promise<void> {
	await axios.delete(`${Url.Encrypted}/${fileId}`)
}
