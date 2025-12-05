<script setup lang="ts">
import { mdiClose, mdiContentCopy } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'

const props = defineProps<{
	share: Record<string, unknown>
}>()

defineEmits<{
	delete: [void]
}>()

const shareLink = computed(() => generateUrl('/s/{shareToken}', { shareToken: props.share.shareWith as string }))

/**
 * Copy the filedrop link to clipboard
 */
async function copyLink() {
	try {
		await navigator.clipboard.writeText(shareLink.value)
	} catch {
		window.prompt('', shareLink.value)
	}
}
</script>

<template>
	<li>
		<a
			:href="shareLink"
			target="_blank"
			rel="noopener"
			@click.prevent="() => {}">
			{{ share.label || t('end_to_end_encryption', 'Filedrop') }}
		</a>
		<NcButton
			:aria-label="t('end_to_end_encryption', 'Copy filedrop link')"
			:title="t('end_to_end_encryption', 'Copy filedrop link')"
			@click="copyLink">
			<template #icon>
				<NcIconSvgWrapper :path="mdiContentCopy" />
			</template>
		</NcButton>
		<NcButton
			:aria-label="t('end_to_end_encryption', 'Delete filedrop')"
			:title="t('end_to_end_encryption', 'Delete filedrop')"
			@click="$emit('delete')">
			<template #icon>
				<NcIconSvgWrapper :path="mdiClose" />
			</template>
		</NcButton>
	</li>
</template>
