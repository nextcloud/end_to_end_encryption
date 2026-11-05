<!--
	- SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { INode } from '@nextcloud/files'
import type { DebugCheckId, IDebugCheck, IDebugReport } from '../services/debug.ts'

import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { computed, onMounted, ref, useId } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import IconAlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import IconCheckCircleOutline from 'vue-material-design-icons/CheckCircleOutline.vue'
import IconMinusCircleOutline from 'vue-material-design-icons/MinusCircleOutline.vue'
import { loadDebugReport } from '../services/debug.ts'
import logger from '../services/logger.ts'

const props = defineProps<{
	node: INode
}>()

const emit = defineEmits<{
	close: []
}>()

const CHECK_LABELS: Record<DebugCheckId, string> = {
	metadata: t('end_to_end_encryption', 'Metadata is stored and readable'),
	version: t('end_to_end_encryption', 'Metadata version is supported'),
	metadataKey: t('end_to_end_encryption', 'Metadata key is available'),
	decrypt: t('end_to_end_encryption', 'Metadata can be decrypted'),
	signature: t('end_to_end_encryption', 'Metadata signature is valid'),
	keyChecksum: t('end_to_end_encryption', 'Metadata key checksum is listed'),
}

/** Vue already escapes text interpolations, so the placeholders must not be escaped twice */
const RAW_PLACEHOLDERS = { escape: false, sanitize: false }

const STATUS_LABELS: Record<IDebugCheck['status'], string> = {
	passed: t('end_to_end_encryption', 'Passed'),
	failed: t('end_to_end_encryption', 'Failed'),
	skipped: t('end_to_end_encryption', 'Skipped'),
}

const ids = {
	summary: useId(),
	checks: useId(),
	fileDrop: useId(),
	contents: useId(),
	unknown: useId(),
	metadata: useId(),
}

const loading = ref(true)
const error = ref<string>()
const report = ref<IDebugReport>()
const showMetadata = ref(false)

const metadataJson = computed(() => JSON.stringify(report.value?.redactedMetadata ?? null, null, 2))

onMounted(async () => {
	try {
		report.value = await loadDebugReport(props.node.path)
	} catch (e) {
		logger.error('Failed to inspect the metadata', { error: e, node: props.node })
		error.value = e instanceof Error ? e.message : String(e)
	} finally {
		loading.value = false
	}
})

/**
 * Copy the redacted metadata to the clipboard
 */
async function copyMetadata() {
	try {
		await navigator.clipboard.writeText(metadataJson.value)
		showSuccess(t('end_to_end_encryption', 'Metadata copied to the clipboard'))
	} catch (e) {
		logger.error('Failed to copy the metadata', { error: e })
		showError(t('end_to_end_encryption', 'Could not copy the metadata'))
	}
}
</script>

<template>
	<NcDialog
		:name="t('end_to_end_encryption', 'Debug encryption of {name}', { name: node.displayname }, undefined, RAW_PLACEHOLDERS)"
		size="normal"
		@update:open="$event || emit('close')">
		<NcLoadingIcon v-if="loading" :name="t('end_to_end_encryption', 'Loading metadata …')" :size="44" />

		<NcNoteCard
			v-else-if="error"
			type="error"
			:heading="t('end_to_end_encryption', 'Could not load the metadata')"
			:text="error" />

		<template v-else-if="report">
			<section :aria-labelledby="ids.summary">
				<h3 :id="ids.summary" :class="$style.debugDialog__heading">
					{{ t('end_to_end_encryption', 'Summary') }}
				</h3>
				<table :class="$style.debugDialog__table">
					<tbody>
						<tr>
							<th scope="row">
								{{ t('end_to_end_encryption', 'Metadata version') }}
							</th>
							<td>{{ report.version ?? t('end_to_end_encryption', 'Unknown') }}</td>
						</tr>
						<tr v-if="report.isRoot !== undefined">
							<th scope="row">
								{{ t('end_to_end_encryption', 'Metadata type') }}
							</th>
							<td>
								{{ report.isRoot
									? t('end_to_end_encryption', 'Root metadata')
									: t('end_to_end_encryption', 'Nested metadata') }}
							</td>
						</tr>
						<tr v-if="report.counter !== undefined">
							<th scope="row">
								{{ t('end_to_end_encryption', 'Counter') }}
							</th>
							<td>{{ report.counter }}</td>
						</tr>
						<tr v-if="report.users.length > 0">
							<th scope="row">
								{{ t('end_to_end_encryption', 'Users with access') }}
							</th>
							<td>{{ report.users.join(', ') }}</td>
						</tr>
					</tbody>
				</table>
			</section>

			<section :aria-labelledby="ids.checks">
				<h3 :id="ids.checks" :class="$style.debugDialog__heading">
					{{ t('end_to_end_encryption', 'Checks') }}
				</h3>
				<ul :class="$style.debugDialog__list">
					<li v-for="check in report.checks" :key="check.id" :class="$style.debugDialog__check">
						<IconCheckCircleOutline v-if="check.status === 'passed'" :class="$style.debugDialog__passed" :size="20" />
						<IconAlertCircleOutline v-else-if="check.status === 'failed'" :class="$style.debugDialog__failed" :size="20" />
						<IconMinusCircleOutline v-else :size="20" />
						<span>
							{{ CHECK_LABELS[check.id] }}: <strong>{{ STATUS_LABELS[check.status] }}</strong> <span v-if="check.error" :class="$style.debugDialog__hint">({{ check.error }})</span>
						</span>
					</li>
				</ul>
			</section>

			<section :aria-labelledby="ids.fileDrop">
				<h3 :id="ids.fileDrop" :class="$style.debugDialog__heading">
					{{ t('end_to_end_encryption', 'File drop') }}
				</h3>
				<p v-if="report.fileDrop.length === 0" :class="$style.debugDialog__hint">
					{{ t('end_to_end_encryption', 'No file drop entries') }}
				</p>
				<ul v-else :class="$style.debugDialog__list">
					<li v-for="entry in report.fileDrop" :key="entry.uuid">
						<span>{{ entry.name ?? t('end_to_end_encryption', 'Unknown file') }}</span>
						<span :class="$style.debugDialog__hint">
							{{ entry.uuid }}
							<template v-if="entry.mimetype">· {{ entry.mimetype }}</template>
							· {{ t('end_to_end_encryption', 'Recipients: {users}', { users: entry.recipients.join(', ') }, undefined, RAW_PLACEHOLDERS) }}
						</span>
						<span v-if="entry.error" :class="$style.debugDialog__failed">
							{{ t('end_to_end_encryption', 'Cannot be decrypted: {error}', { error: entry.error }, undefined, RAW_PLACEHOLDERS) }}
						</span>
						<span v-if="!entry.existsOnServer" :class="$style.debugDialog__failed">
							{{ t('end_to_end_encryption', 'Missing on the server') }}
						</span>
					</li>
				</ul>
			</section>

			<section :aria-labelledby="ids.contents">
				<h3 :id="ids.contents" :class="$style.debugDialog__heading">
					{{ t('end_to_end_encryption', 'Files and folders') }}
				</h3>
				<p v-if="report.contents.length === 0" :class="$style.debugDialog__hint">
					{{ t('end_to_end_encryption', 'The metadata lists no files or folders') }}
				</p>
				<ul v-else :class="$style.debugDialog__list">
					<li v-for="entry in report.contents" :key="entry.uuid">
						<span>{{ entry.name }}</span>
						<span :class="$style.debugDialog__hint">
							{{ entry.uuid }} ·
							{{ entry.isFolder ? t('end_to_end_encryption', 'Folder') : entry.mimetype }}
						</span>
						<span v-if="!entry.existsOnServer" :class="$style.debugDialog__failed">
							{{ t('end_to_end_encryption', 'Missing on the server') }}
						</span>
					</li>
				</ul>
			</section>

			<section v-if="report.unknownServerNodes.length > 0" :aria-labelledby="ids.unknown">
				<h3 :id="ids.unknown" :class="$style.debugDialog__heading">
					{{ t('end_to_end_encryption', 'Not listed in the metadata') }}
				</h3>
				<p :class="$style.debugDialog__hint">
					{{ t('end_to_end_encryption', 'These files and folders exist on the server, but are hidden as they are not listed in the metadata.') }}
				</p>
				<ul :class="$style.debugDialog__list">
					<li v-for="serverNode in report.unknownServerNodes" :key="serverNode.name">
						{{ serverNode.name }}
						<span :class="$style.debugDialog__hint">
							· {{ serverNode.isFolder ? t('end_to_end_encryption', 'Folder') : t('end_to_end_encryption', 'File') }}
						</span>
					</li>
				</ul>
			</section>

			<section v-if="report.redactedMetadata" :aria-labelledby="ids.metadata">
				<h3 :id="ids.metadata" :class="$style.debugDialog__heading">
					{{ t('end_to_end_encryption', 'Decrypted metadata') }}
				</h3>
				<p :class="$style.debugDialog__hint">
					{{ t('end_to_end_encryption', 'All keys are redacted, but file and folder names are included. Only share it with people you trust.') }}
				</p>
				<div :class="$style.debugDialog__actions">
					<NcButton :aria-expanded="showMetadata ? 'true' : 'false'" @click="showMetadata = !showMetadata">
						{{ showMetadata
							? t('end_to_end_encryption', 'Hide metadata')
							: t('end_to_end_encryption', 'Show metadata') }}
					</NcButton>
					<NcButton @click="copyMetadata">
						{{ t('end_to_end_encryption', 'Copy metadata') }}
					</NcButton>
				</div>
				<pre v-if="showMetadata" :class="$style.debugDialog__metadata">{{ metadataJson }}</pre>
			</section>
		</template>
	</NcDialog>
</template>

<style module>
.debugDialog__heading {
	margin-block: 1rem 0.5rem;
	font-size: var(--default-font-size);
	font-weight: bold;
}

.debugDialog__table th {
	padding-inline-end: 1rem;
	text-align: start;
	font-weight: normal;
	color: var(--color-text-maxcontrast);
}

.debugDialog__list {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.debugDialog__list li {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5ch;
}

.debugDialog__check {
	align-items: center;
}

.debugDialog__hint {
	color: var(--color-text-maxcontrast);
	overflow-wrap: anywhere;
}

.debugDialog__passed {
	color: var(--color-element-success);
}

.debugDialog__failed {
	color: var(--color-element-error);
}

.debugDialog__actions {
	display: flex;
	gap: 0.5rem;
	margin-block: 0.5rem;
}

.debugDialog__metadata {
	max-height: 50vh;
	overflow: auto;
	padding: 0.5rem;
	border-radius: var(--border-radius-element);
	background-color: var(--color-background-dark);
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}
</style>
