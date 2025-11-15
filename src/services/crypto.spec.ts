/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { X509Certificate } from '@peculiar/x509'
import { expect, test } from 'vitest'
import { base64ToBuffer } from './bufferUtils.ts'
import { sha256Hash, validateCertificateSignature } from './crypto.ts'

test('sha256Hash correctly returns a hex string', async () => {
	const buffer = 'KPJswKr0owRxrcj4/3SRIw=='
	const hash = '9a60be9846978884033fcdfb978fbdd428221b20583bca6bfcb425f1b540152a'
	const computedHash = await sha256Hash(base64ToBuffer(buffer))
	expect(computedHash).toEqual(hash)
})

test('Validate user certificate signed with SHA-1', async () => {
	const certificate = '-----BEGIN CERTIFICATE-----\nMIIDlDCCAnygAwIBAgIBADANBgkqhkiG9w0BAQUFADBjMQswCQYDVQQGEwJERTEb\nMBkGA1UECAwSQmFkZW4tV3VlcnR0ZW1iZXJnMRIwEAYDVQQHDAlTdHV0dGdhcnQx\nEjAQBgNVBAoMCU5leHRjbG91ZDEPMA0GA1UEAwwGbG91aXNjMB4XDTI1MDIwNTEw\nNDYxN1oXDTQ1MDEzMTEwNDYxN1owYzELMAkGA1UEBhMCREUxGzAZBgNVBAgMEkJh\nZGVuLVd1ZXJ0dGVtYmVyZzESMBAGA1UEBwwJU3R1dHRnYXJ0MRIwEAYDVQQKDAlO\nZXh0Y2xvdWQxDzANBgNVBAMMBmxvdWlzYzCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBAMppd4np6dzg/QGbC8nuKM/gvU4eEL/AqnuygaKaEsGtvgcdeDKe\nO2gtok4zPoH6soCi3AznEkcvnzg3p7UrSxA9a59DSnY9b9468tY+2LFqwjQIDNef\ngcdyBxLMOA1rOJ5FV18+XHq5D8Hl0172frcyXlSYfxvg7fxE91v1IJecF0jeca9v\nCW3zTu5VA70waZrQPWUJg3QodfYX6bKV968+S66BI0hr/KGu3cgR4ASE9Fos+RnW\nrxkstlblp81RBMjP+wcHlRuGWXeqcxVWV6Ky74G5WbY1eUpUmzxCrIa5lY1P6kpm\n9pWuFz1Tj28fES7He3TtSFpx+HGWeBRKglUCAwEAAaNTMFEwHQYDVR0OBBYEFAYJ\nS6Fhq18DHpOAI5iA3Z9LNxn+MB8GA1UdIwQYMBaAFAYJS6Fhq18DHpOAI5iA3Z9L\nNxn+MA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQEFBQADggEBAKPMbkLSQDnG\nz3iDvPxkxJ0vDurSVVpyajbyj6L2/Nw5qMfRIiI64XD7iVDzRoAJrH62hpn1L0a4\nCSNF7PDabtuDEkcVDWx1Dhk+IsF2rXlWGYva8SnFkDRS2RUenzYCzdlB0YsLY1/g\nRWHUmm0d7jn7ai/h1T89txXCO0NGkl/D/H8G5pwu55DZ6RhCz7RvBLm4H0qFun1m\nr/ZJtNtRi4nu40utPZIDjAXFCZjbu+IjCMSBQ5R3nIpd3Qpjqf+LZcqUzr5aeANy\nq2mmbO+i+RjD8pNICh/px3j97XcgZF8klU8fO1TvOrPSUZ6aa0pk/ngR7uqdM/ng\nptl32lAcZwQ=\n-----END CERTIFICATE-----'
	const rawPublicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5e394Y8Cp2lI8DKE+jE1\nRD14o933p9mXfSKRdnLOgDnGEZfdL4OeALAS7PArysL5GMNG+UdaTxYLcoYe4osM\nUpp9WjJYpfGutZh3CSDZXLYlwSIzRwznAaymsK0yN+ujT+sQIQrbfGQ2BMNyxJy+\naRC/W3JnKVTCtrIM6E7QpZ2lwo0DJ/a1Ahyaphm1+A7OX1Wwgh69gzpCjG1KRti9\nvbPdKVSYQpMZ4he+tzDUXZK6GLHKX69ZEBNc6ZPKSDW67r232NduoHxf2lS/723p\ndkBpHiZGTTGVFGfTQBUW215+UhCm5vHX1mNHw2gN2IPi0o+mfvVKPbjuI+dQtcYg\n5wIDAQAB\n-----END PUBLIC KEY-----'

	const result = await validateCertificateSignature(new X509Certificate(certificate), rawPublicKey)

	expect(result).toBeTruthy()
})

test('Validate user certificate signed with SHA-256', async () => {
	const certificate = '-----BEGIN CERTIFICATE-----\nMIIDkjCCAnqgAwIBAgIBADANBgkqhkiG9w0BAQsFADBiMQswCQYDVQQGEwJERTEb\nMBkGA1UECAwSQmFkZW4tV3VlcnR0ZW1iZXJnMRIwEAYDVQQHDAlTdHV0dGdhcnQx\nEjAQBgNVBAoMCU5leHRjbG91ZDEOMAwGA1UEAwwFYWRtaW4wHhcNMjUwMjA1MTYx\nMjE3WhcNNDUwMTMxMTYxMjE3WjBiMQswCQYDVQQGEwJERTEbMBkGA1UECAwSQmFk\nZW4tV3VlcnR0ZW1iZXJnMRIwEAYDVQQHDAlTdHV0dGdhcnQxEjAQBgNVBAoMCU5l\neHRjbG91ZDEOMAwGA1UEAwwFYWRtaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw\nggEKAoIBAQCJjQj0CBVpalWd4FBj3BVUlhZf3GQITP4jzIjtUsOf7CF+wF3zSTt2\nxTQsIiu3MvsaR1BE+8AdTuttq5PUFp/DgsHHI/s3jNX01oMQxZfUoR9g0HgV1EeD\n/KXqi+iIxWx5Lyqg8YQClCeq3OjXhGAnSHqgeV+nCCYOaOHsLgHGkPrgsGbDXjKB\nbn8iT6UrKuz1LBVFX48lYFXPft1515fNLF534mj8bbc9FSopIgWF/8Bky4NqYALc\n3tKl5MP8OyWCDfMHgXOUXKHij2rv8UONMJOG6LuxS7agSRlb/cF6eEwcvNhvQE8j\nFynWxotZgq+wdQXzxkJ70escOWp9vFCxAgMBAAGjUzBRMB0GA1UdDgQWBBRcWI5h\naCLM4pjAD5/Ve9zHjokIXDAfBgNVHSMEGDAWgBRcWI5haCLM4pjAD5/Ve9zHjokI\nXDAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQC1fCDirq3dJ/hi\nmHQakF/Jl2PrVdMkaDFjparrJgoBkQUPo4DymxAIQ2s5k0xMn9hSBgb+G5USSfQo\nZxKIAaKLXPlwSqL9pntHBRyj/dy0TtTeCR2J0/hEC699Ud50tV0NjyTA4qd/Dzeg\nVmn2lQ/ixzLCarWwFLAx1/UoD/AuWTku3apjK/FW9N81zlSHENelriBjQrv9CpJA\n4I6qFAKvviDBw7Y/+VbOKjAlm8eftu5BYJMIAMH8e84PbD1YW9dJ/bnWLCWIYs1Q\npFuoSm19qirT01ZvuDSt3j4zqPiYwBtsJog5YtJd+ZsRJJrpZ94a5gTVHzfPUzOC\nIw9iHRL1\n-----END CERTIFICATE-----'
	const rawPublicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxXvMFtdhOhwcug/cv+lE\njy2GeHiWXM3490EvJFrp/udRsPVXl5aNABKi4/KOfev025f+j9t9tvHi1NfNymK2\nJnqUK+0c5mk3iiQa5hAXmj/Yc1BMPNCzWlKF++QQ6W2l9VCYyHzTG3dhRCG0xWjw\nz8NU+5DZmV80HdocR9UU0O5ZcWYYWN0+7QZ8pC7IU7XtQLazb5bhVxpqDQBNEdUC\n4lNrZFjpl3e7wJ/MY5f6otMBlPh6xVmnwYD8BVrNtZ9n5kKSGfJq5VbQd8dhYfHI\nc2bLJprs+dvk/1+j3PQ3OSOcxNmfyXYuqCl1D6kTesq3gTvnXXZeDYBOjdPy+HOR\ngQIDAQAB\n-----END PUBLIC KEY-----'

	const result = await validateCertificateSignature(new X509Certificate(certificate), rawPublicKey)

	expect(result).toBeTruthy()
})
