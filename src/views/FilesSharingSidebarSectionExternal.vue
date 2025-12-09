<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { INode } from '@nextcloud/files'
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { RootMetadata } from '../models/RootMetadata.ts'

import { mdiPlus } from '@mdi/js'
import axios from '@nextcloud/axios'
import { Permission } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { X509CertificateGenerator } from '@peculiar/x509'
import stringify from 'safe-stable-stringify'
import { ref, toRaw, useId, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import * as api from '../services/api.ts'
import { bufferToBase64 } from '../services/bufferUtils.ts'
import { exportRSAKey } from '../services/crypto.ts'
import logger from '../services/logger.ts'
import { generatePrivateKey } from '../services/privateKeyUtils.ts'
import { ensureKeyUsage } from '../services/rsaUtils.ts'
import * as keyStore from '../store/keys.ts'
import * as metadataStore from '../store/metadata.ts'

const props = defineProps<{
	node: INode
}>()

const idHeading = useId()

const rootMetadata = ref<RootMetadata>()
watch(() => props.node, async () => {
	rootMetadata.value = await metadataStore.getRootMetadata(props.node.path)
}, { immediate: true })

const shares = ref()
watch(rootMetadata, loadShares, { immediate: true })

/**
 * Create a new end-to-end encrypted external share
 */
async function createShare() {
	logger.debug('Creating end-to-end external share')
	const metadata = toRaw(rootMetadata.value)
	if (!metadata) {
		throw new Error('No metadata available for the current folder')
	}

	await keyStore.loadPublicKey()
	await keyStore.loadPrivateKey()

	const { path, id } = metadataStore.getRootFolder(metadata)
	const { data } = await axios.post(generateOcsUrl('/apps/files_sharing/api/v1/shares'), {
		path: decodeURI(path),
		permissions: Permission.READ,
		shareType: ShareType.Link,
	})

	const publicKeys = await generatePrivateKey()
	const cert = await X509CertificateGenerator.createSelfSigned({
		keys: {
			privateKey: await ensureKeyUsage(publicKeys.privateKey, 'sign'),
			publicKey: await ensureKeyUsage(publicKeys.publicKey, 'verify'),
		},
		name: `CN=s:${data.ocs.data.token}`,
	})
	window.prompt('The private key:', bufferToBase64(await exportRSAKey(publicKeys.privateKey)))

	metadata.addUser(`s:${data.ocs.data.token}`, cert)
	const lockToken = await api.lockFolder(id, metadata.counter)
	try {
		const metadataRaw = await metadata.export(await keyStore.getCertificate())
		await api.updateMetadata(id, stringify(metadataRaw.metadata), lockToken, metadataRaw.signature)
	} finally {
		await api.unlockFolder(id, lockToken)
	}
}

/**
 * Handle loading shares for the root metadata
 */
async function loadShares() {
	const metadata = toRaw(rootMetadata.value)
	if (!metadata) {
		logger.debug('No metadata available, skipping loading shares')
		return
	}

	let { path } = metadataStore.getRootFolder(metadata)
	path = decodeURI(path)
	logger.debug(`Loading shares for path: ${path}`)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data } = await axios.get<OCSResponse<any[]>>(generateOcsUrl('/apps/files_sharing/api/v1/shares'), {
		params: {
			path,
		},
	})

	logger.debug(`Loaded ${data.ocs.data.length} shares for path: ${path}`, { shares: data.ocs.data })
	shares.value = data.ocs.data.filter(({ share_type: shareType, permissions }) => shareType === ShareType.Link && (permissions & Permission.READ) !== 0)
}
</script>

<template>
	<section>
		<h5 :id="idHeading">
			{{ t('end_to_end_encryption', 'End-to-end encrypted external share') }}
		</h5>
		<ul :aria-labelledby="idHeading">
			<li>todo</li>
		</ul>
		<NcButton @click="createShare">
			<template #icon>
				<NcIconSvgWrapper :path="mdiPlus" />
			</template>
			{{ t('end_to_end_encryption', 'New external share') }}
		</NcButton>
	</section>
</template>
