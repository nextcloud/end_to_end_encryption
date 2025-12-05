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
	<NcDialog>
		<NcTextField
			:label="t('end_to_end_encryption', 'Filedrop label')"
			v-model="share.label" />
	</NcDialog>
</template>
