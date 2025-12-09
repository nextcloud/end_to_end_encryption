/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'
import { base64ToBuffer, bufferToBase64, bufferToHex, bufferToPem, bufferToString, pemToBuffer, stringToBuffer } from './bufferUtils.ts'

// until we use Node 25+
import 'core-js/proposals/array-buffer-base64'

test('base64: Strings are correctly converted back and forth', async () => {
	const testStrings = [btoa('test'), 'ZbBpIfMafxwNc9j8', 'vkO93HhyRAj7D/t37u5b+iLDqShwMRMTAcsR8g0TVqriVUiqslGHtw==', 'N42Z9cEtqK0H5AXqZC/SoGsnIaj3uJAXqh9StE2CdUdKMGXvUUaFJf9HeY20yYdrhgSDTz9C/bsAohuEyxkmP3Ct699rhSoBGArI1wtRxj6seErGCpyoBaY5LsqxiAIMoW/D70bfqrdE7pk6v+PrioDVPeTfriCx2Rqu1HcsmbeDrs0i5waNBxdzM109fHi7CcLcRI6MpjKlejhwsxbET/JoUWe+hTb91ztPcNLN3jqESWuS62O6aqc9nBdA9Gl4Dq0gCdSJ/iIcqhd0SYMMZrX/5iTtfA8uLy/CA6za7yNByK8nnyUOzAYrbu2MuShiwmViT7cYHWrjwTQfMX3UhKMO7MS084c80yaWWjXePKfyWLn5lD570MzNGXKvk7hlqwZDt0fj0g9PAiISVZ5wtnnZU0ZfYTWeybU9cfBhlhGQttObqlOUxo1FjvzO3SDb4B8sExKYRc7kgtIUQH25gZl4q6KKngFpikzdClpKI8YPDY+fga+3wWziHjPFIck0tJlH3T2WD2s8R1fHlkE9MTTNn/7/EvRiXPYjEmkpGLukFk/4e9HRMlEQmqzzC7OqXuqh5axTcjwmivXpnmug4CO8RM4lkgwNJ/GhQQD0uV+n4bo7rFt7fa7k+0tCnD5HUiET69qL3p6w7MqK0kkAf2qXF/vaPQjBk7LQUggHlZtGEIXivT1aS8M48BxDHmwXZJCpAhOo/QOWiaMGxURUbxSzRcsUylpY6pPhj76BQ0WVrViF8f/Cr7mpqrDAn91ivk9Aj7nbhh2sWpSzIq3DSgS68PveIOuIKZbLE/DKkmw4HN+KmUcS57MzR1uV0vdE20m5ysR5cVCSYGM4yP/lSZAaGnDsMVBBeP697titXKwkmkCZ3ta39WHPWOwVRjQo72yB0UC7uNsTYaShUfvd2+3nrOCmrtI/fVUVEVYorpo9v5eSr/RgIbwxvq/4lZGLIjWmxfzYRJ4tTCs/gAa8sLLySLxLTimLGUam/Wr3ewON0mCWmPvsVu5ZZmowISrsPD2//nT3EGj/sBMLFEuwLZQb6zuILky2CL5hytuMih6EId3BTrajFIzIuxWAuIBQ34kn9kurmw7UQhlPsziPd+Qnw0gcmsn97F04XB68zx/HljIcVnpgWs30avBmp4xVCWg92lZaRFt+/UktGlyeXeZQEn+aNG09zbwUlwNCAJTcf4cFVkEMA47Y3eBKzY++MBcKXJjign00IOzy00CmfZK2sTAlbl7rBBB9FaKoAOPlFlWcBvgIOCdx2vdPl3HW6BsWDZvCM9q8QHfxDTQM6TFBceUokfXzuZd1XrvRa2lEEtF8Vwp/nnzl2dYNry061KouCmx0YW1NdR7GyM//FKEKzpVxdC6Y4DLXFLUpFmDdIceMgLccaCXUWg2A8id7f6qZW6syD80MJc/DKyiT/18lwkld0ngWDerq4O7L7H28imBuV8OucNMGpZw0JUN6ksZymuWOCTOP4Lt6shzBE5ZVowuDqjedmLkaH6Ra82Qx4IfL2sjf/vIsYUiD0G5pmybz5xS633ooS3/ZOGXAe4xmY8a992ij9irEifTMJIqeyI/omM0y9cbIJPbRMIwaE55pkG53K0DfPg7vQzjaaGBFi/7rCHiDH931rFRdyi85T7YeSQ64T3GiK0nYdOWv10rCIBPj4O3MXbMTvqUOjN7TeIurFxBEEIr7RH6s6X6acUu82X8NkY6m6CEaER3PJhK8BgOWRJi9FwRRgl2zKV6ZAeov+Q0aOq5U8x9GS/dzSHcHv+LrOOM26VHKUMzJUF9ycKeNqyT+IvwxthJmiUTvM4UjR2RtN1NX9SmZxMMpvgotMqP8Nm++l3XZ7e8WtZVpos9+Bjkexig3tLIH8SQTKUSeaKwOaxJldfFzf6Yvj/HTjdcgIgZg6sfyvsFz/d8Sw5AniaEggHHbceqcM+pG78AgUZlTz7ToohdwH7TudniqlLoYBQYA+6PhRExr/gAltaAhS7JjW913YIAnxu2pgnVl+LQTp4xc4OraxensOXAuocr7EcWiSJ3LfpFxEbNc/H+DX3MXgIQgoU4jFuGLyiv9CYc9dpo8YE+e+krnwA6vA2hBq0Uw/2meEN9iTG7T6hSH1Ax1kcGYfaYd1Jay7syRXEoxAlRs+jW3/zFMLWIEvUtfhPN0JWAEqBdmn1Bep+8V54ONmljvnrhYAJN7/uRxUii3AHf7f30YJMHQ+ArR59hEmPpjs3SOjH3y8hkqZJRfieuTFbEKpkseTgU2kNl5WHg+OggiexlAnRnAqSYJLVlciDOUEO116UBBtWjgELewk8JhO2B4Wvp8oVBI/1gJSLqFTCLTmxJfleWaUtxmy64A0v5O6kuHLRNwu53sJ/AFfFNEciCO7uIU/rGd8sBe+idioQJbmFOorDX1OI+vbS1O78ainr283Ou4vYu4xiULHXkS/WlMLfuY9IAeNX2LZ7u//v7y+ivguGD3hDZ0MEl+9wAItOvxDRtk41mj3W9jRwnR02A+4hUzqpxTCzLgTbYW78DORVkWBN3+bWUI34S0kocKm2kD6d/p3FSuPsXRb+Ibupmbi9hauQ4e6l3gy9AFZ5QlnUI9KHhZMy5sEtd9Nf4NULAUlXmo/l74Yz4sXUq6VjNIYeNNJh8z/z8j6wBE5Wbjpzrlf+qSgKmGU9LX7jK2XTUjUrtc7patN1vsxBvUQNEkQNSpTOVfcqq/2k9IxUE+K8EzovxT4dK0cZgG0Cparbyy3iJhclpp46asO5HYKyU8KAY9C8u5cEvSiAK8YdFU2fOf6v3MfWbcpJqIKaRadDnTY3pMkrX2Hhg3Z6NHKqami0fglxBFT1ThY5eLh9G2t0/0ebfmJgDNHGNKdo2ASXLNoZsJIdR7z4x/+1RWOfiv6rXJIYhqhm+hJvo3BuNIh8BcFL9fv868FOMmHsdoy3lmdeKPeBKqqAg0b7+5QD2m5q60NfOmLF6xq2fKMpY7rDIY0zkdId8II3yxDCuelotDC4iL98i+XfYaDC3VYl8q39WI/cMr1FXUliOcgE3eLg66IWw=']

	for (const testString of testStrings) {
		expect(bufferToBase64(base64ToBuffer(testString))).toEqual(testString)
	}
})

test('bufferToHex', async () => {
	const buffer = Uint8Array.from([0, 15, 16, 255, 128, 64, 32, 1])
	expect(bufferToHex(buffer)).toMatchInlineSnapshot('"000f10ff80402001"')
})

test('bufferToString and stringToBuffer', async () => {
	const text = 'hello'.repeat(100)
	expect(bufferToString(stringToBuffer(text))).toEqual(text)
})

test('PEM string is correctly loaded', async () => {
	const privateKeyBuffer = pemToBuffer(`-----BEGIN PRIVATE KEY-----\n${btoa('private key')}\n-----END PRIVATE KEY-----`)
	expect(bufferToString(privateKeyBuffer)).toEqual('private key')

	const publicKeyBuffer = pemToBuffer(`-----BEGIN PUBLIC KEY-----\n${btoa('public key')}\n-----END PUBLIC KEY-----`)
	expect(bufferToString(publicKeyBuffer)).toEqual('public key')

	const certificateBuffer = pemToBuffer(`-----BEGIN CERTIFICATE-----\n${btoa('certificate')}\n-----END CERTIFICATE-----`)
	expect(bufferToString(certificateBuffer)).toEqual('certificate')
})

test('PEM string is correctly generated', async () => {
	expect(bufferToPem(stringToBuffer('certificate content'), 'certificate')).toEqual('-----BEGIN CERTIFICATE-----\n' + btoa('certificate content') + '\n-----END CERTIFICATE-----')
	expect(bufferToPem(stringToBuffer('csr content'), 'csr')).toEqual('-----BEGIN CERTIFICATE REQUEST-----\n' + btoa('csr content') + '\n-----END CERTIFICATE REQUEST-----')
	expect(bufferToPem(stringToBuffer('private key'), 'private')).toEqual('-----BEGIN PRIVATE KEY-----\n' + btoa('private key') + '\n-----END PRIVATE KEY-----')
	expect(bufferToPem(stringToBuffer('public key'), 'public')).toEqual('-----BEGIN PUBLIC KEY-----\n' + btoa('public key') + '\n-----END PUBLIC KEY-----')
})
