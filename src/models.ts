/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

type FileDropEntry = {
	/**
	 * encrypted metadata (AES/GCM/NoPadding, 128 bit key size) of folder.
	 * - first gzipped
	 * - then encrypted
	 * - then base64 encoded
	 */
	ciphertext: string
	nonce: string
	authenticationTag: string
	users: {
		userId: string
		/**
		 * The metadata-key is encrypted with RSA/ECB/OAEPWithSHA-256AndMGF1Padding
		 */
		encryptedFiledropKey: string
	}[]
}

export type UserWithAccess = {
	userId: string
	certificate: string // PEM format. Example: "-----BEGIN CERTIFICATE-----\nMIIDkjCCAnqgAwIBAgIBADANBgkqhkiG9w0BAQsFADBiMQswCQYDVQQGEwJERTEb\nMBkGA1UECAwSQmFkZW4tV3VlcnR0ZW1iZXJnMRIwEAYDVQQHDAlTdHV0dGdhcnQx\nEjAQBgNVBAoMCU5leHRjbG91ZDEOMAwGA1UEAwwFYWRtaW4wHhcNMjQxMjA5MTQw\nNTI2WhcNNDQxMjA0MTQwNTI2WjBiMQswCQYDVQQGEwJERTEbMBkGA1UECAwSQmFk\nZW4tV3VlcnR0ZW1iZXJnMRIwEAYDVQQHDAlTdHV0dGdhcnQxEjAQBgNVBAoMCU5l\neHRjbG91ZDEOMAwGA1UEAwwFYWRtaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw\nggEKAoIBAQCR5e87QtuM8uyh2W+PVPVklS/7xnpYH6QmkwKgK8lNHkrsGFRdaHP0\nx98FbjlVHM/wandZlqKlyspANX57tGUFoR+Ya3ymYkvyrKeFv34WsbBL/3QDS6nT\nNrl40hgsuhAJVl99JfFmJPrHwb9iU8yM89ktWsAa+xhDH9n37vmADJiBjOR7IW1b\nF0xjpwp2+9SDMkWCK5A2WMPIY45waZLJw9PsaiKikhV+n1q00PTnULKSkDuUrENy\nYdqY4MnHs/k70QkTdynyDLS2LUdmMyHEHyyMktiwaRileqrsGsQf2pErD5pKhvcf\nuIhN1g7sNDyOtPtyB1ioX5DGTg6LuhrJAgMBAAGjUzBRMB0GA1UdDgQWBBQgTmjF\nLB/B3VZ6sYYZTXFKGL245TAfBgNVHSMEGDAWgBQgTmjFLB/B3VZ6sYYZTXFKGL24\n5TAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQABg8Sz2rlkG6/x\nc6GxwWr64EaqrAPfPpi6yUg1HfscokrgGjMuj/g0N6OBXNodkAxQAxOYdaI8LuAe\niqjuiJh0tn1u0yxF0cxUqk3EUZsPmF8YRN4cG55z0hTnXJ/9YxCrYQl/LRUmvP8q\nufnJX+CtRLs5oDVpmCJrEc8hA1rEDaeGYZDy+sfOqk3YjpVKR/ETI+AdQ9ubxFhj\nvUzF4gZNbCyLk1ul0QzwNW1aKV920BVMhYnMaYM9Xaume4pn6wuZoD0k7py+tKCe\nXaemHYSvFS1lY4Q8Ih2cacIan6FgxI/jkanCEOxdUcwtSOTocrn6DL2wmkcLm0Ao\nYovd2rO6\n-----END CERTIFICATE-----\n"
	// The metadata-key is encrypted with RSA/ECB/OAEPWithSHA-256AndMGF1Padding
	encryptedMetadataKey: string // Base64 encoded. Example:: "KS9P5Et+i94PAdpTtR9pyyuTlV6/3e3E/Zzwu8ua1j/e6uHUfQDxpXsksgX95Q/Hin0caoYfwwyWVs2/wtdkHttBdjywzcNfz5yDblrdKAYoyeuCavNatA3OuFDJVcMiisiskD6GMz6o3V21ZqpHwTry05dv4jZMs88lzTOLeDJ7bmmv5Pjyfbg8lxk6oW85LJkUku3+szv+kz+as18Pk+Oe1MylLP+Zktw+1Pckem32h19MacefZI/tkZLmdmjPtKNQGqlefeTXHKnIOzykdPjBG9CJ7zS0MPN7nv0ZgXeSoEi6fUHwkzmg8GxGSjLoL6L7BhLxw7Z8YWZ1MAYyCA=="
}

export type Metadata = {
	metadata: {
		// Encrypted metadata (AES/GCM/NoPadding, 128 bit key size) of folder (see below for the plaintext structure).
		// first gzipped, then encrypted, then base64 encoded."
		// MAKE SURE to always encrypt it using the BINARY representation (NOT base64) of "encryptedMetadataKey" from the "users" array below
		ciphertext: string // Base64 encoded. Example: "/23sBI4AV3RWUHD7pTJ6pXQgcqGvw7xcuuDj61/kX/XfC21jabpfE6ENExjVuckrL8qy6r11WFyHJAJHWLeTiXLJaDiT++JteFecWEE6Ow69iYGgY3HX/IBr5AdBDJVVhhVOdvmkAKVUJQPxRDvDZuo/J/F4UTFt0phfAtpOuIbXY4g+NrJGZWS/IUNaRg==|Bu6LpNYAu3nUtouxt7sRpg=="
		authenticationTag: string // Base64 encoded. Example: "uIbXY4g+NrJGZWS/IUNaRg=="
		nonce: string // Base64 encoded. Example: "Bu6LpNYAu3nUtouxt7sRpg=="
	}
	users?: UserWithAccess[]
	filedrop?: Record<string, FileDropEntry>
	version: '2.0'
}

export type RootMetadata = Metadata & {
	users: UserWithAccess[]
}

export type FileEncryptionInfo = {
	authenticationTag: string // Example: 'nJHAcpZwSS1BCIkGbmtbNg==',
	filename: string // Example: 'test.txt',
	key: string // Example: 'Hj+q7e53ZeQdHKPyF7FKeg==',
	mimetype: string // Example: 'text/plain',
	nonce: string // Example: 'sqqtY0eRjhuwf+qTv5Kg2g=='
}

export type MetadataInfo = {
	counter: number // Example: 3
	files: Record<string, FileEncryptionInfo> // Example: 'ad3b12554e0d4364854ae3e21b170152'
	folders: Record<string, string> // TODO: Example: { fa666d819a6c4315abba421172f0a0b1: 'Test' }
	keyChecksums?: string[] // Example: ['9a60be9846978884033fcdfb978fbdd428221b20583bca6bfcb425f1b540152a']
}

export type PrivateKeyInfo = {
	encryptedPrivateKey: Uint8Array<ArrayBuffer>
	iv: Uint8Array<ArrayBuffer>
	salt: Uint8Array<ArrayBuffer>
}
