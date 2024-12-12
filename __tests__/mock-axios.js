/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import propfindRequest from './propfindRequest.js'

const API_ROOT = 'http://nextcloud.local//ocs/v2.php/apps/end_to_end_encryption/api/v2'

export const restHandlers = [
	http.get(`${API_ROOT}/public-key`, () => {
		return HttpResponse.json({
			ocs: {
				meta: {
					status: 'ok',
					statuscode: 200,
					message: 'OK',
				},
				data: {
					'public-keys': {
						test: '-----BEGIN CERTIFICATE-----\nMIIDkjCCAnqgAwIBAgIBADANBgkqhkiG9w0BAQsFADBiMQswCQYDVQQGEwJERTEb\nMBkGA1UECAwSQmFkZW4tV3VlcnR0ZW1iZXJnMRIwEAYDVQQHDAlTdHV0dGdhcnQx\nEjAQBgNVBAoMCU5leHRjbG91ZDEOMAwGA1UEAwwFYWRtaW4wHhcNMjQxMjA5MTQw\nNTI2WhcNNDQxMjA0MTQwNTI2WjBiMQswCQYDVQQGEwJERTEbMBkGA1UECAwSQmFk\nZW4tV3VlcnR0ZW1iZXJnMRIwEAYDVQQHDAlTdHV0dGdhcnQxEjAQBgNVBAoMCU5l\neHRjbG91ZDEOMAwGA1UEAwwFYWRtaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw\nggEKAoIBAQCR5e87QtuM8uyh2W+PVPVklS\/7xnpYH6QmkwKgK8lNHkrsGFRdaHP0\nx98FbjlVHM\/wandZlqKlyspANX57tGUFoR+Ya3ymYkvyrKeFv34WsbBL\/3QDS6nT\nNrl40hgsuhAJVl99JfFmJPrHwb9iU8yM89ktWsAa+xhDH9n37vmADJiBjOR7IW1b\nF0xjpwp2+9SDMkWCK5A2WMPIY45waZLJw9PsaiKikhV+n1q00PTnULKSkDuUrENy\nYdqY4MnHs\/k70QkTdynyDLS2LUdmMyHEHyyMktiwaRileqrsGsQf2pErD5pKhvcf\nuIhN1g7sNDyOtPtyB1ioX5DGTg6LuhrJAgMBAAGjUzBRMB0GA1UdDgQWBBQgTmjF\nLB\/B3VZ6sYYZTXFKGL245TAfBgNVHSMEGDAWgBQgTmjFLB\/B3VZ6sYYZTXFKGL24\n5TAPBgNVHRMBAf8EBTADAQH\/MA0GCSqGSIb3DQEBCwUAA4IBAQABg8Sz2rlkG6\/x\nc6GxwWr64EaqrAPfPpi6yUg1HfscokrgGjMuj\/g0N6OBXNodkAxQAxOYdaI8LuAe\niqjuiJh0tn1u0yxF0cxUqk3EUZsPmF8YRN4cG55z0hTnXJ\/9YxCrYQl\/LRUmvP8q\nufnJX+CtRLs5oDVpmCJrEc8hA1rEDaeGYZDy+sfOqk3YjpVKR\/ETI+AdQ9ubxFhj\nvUzF4gZNbCyLk1ul0QzwNW1aKV920BVMhYnMaYM9Xaume4pn6wuZoD0k7py+tKCe\nXaemHYSvFS1lY4Q8Ih2cacIan6FgxI\/jkanCEOxdUcwtSOTocrn6DL2wmkcLm0Ao\nYovd2rO6\n-----END CERTIFICATE-----\n',
					},
				},
			},
		})
	}),
	http.all('https://nextcloud.local/remote.php/dav/files/test', () => {
		return HttpResponse.xml(propfindRequest)
	}),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
