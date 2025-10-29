<script setup lang="ts">
import type { IFolder, INode } from '@nextcloud/files'

import { t } from '@nextcloud/l10n'
import { ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import CreateFolderDialogStepFolderName from './CreateFolderDialogStepFolderName.vue'
import { deletePrivateKey, deletePublicKey } from '../../services/api.ts'
import { initializeEncryption, isEncryptionSetup } from '../../services/encryptionService.ts'

defineProps<{
	context: IFolder
	content: INode[]
}>()

const emit = defineEmits<{
	close: [result: boolean]
}>()

const STEP_FOLDER_NAME = 0
const STEP_FOLDER_KEYS = 1
const STEP_CONFIRM = 2

const step = ref(STEP_FOLDER_NAME)

const folderName = ref('')
const canContinue = ref(false)

/** handle moving to the next step */
async function nextStep() {
	if (!canContinue.value) {
		return
	}

	if (step.value === STEP_CONFIRM) {
		emit('close', true)
	} else {
		step.value++
		await deletePublicKey()
		await deletePrivateKey()
		console.error(await isEncryptionSetup())
		console.error((await initializeEncryption()).mnemonic.join(' '))
	}
}
</script>

<template>
	<NcDialog
		size="normal"
		:name="t('end_to_end_encryption', 'Create new encrypted folder')"
		@update:open="$event || emit('close', false)">
		<CreateFolderDialogStepFolderName
			v-if="step === STEP_FOLDER_NAME"
			v-model="folderName"
			v-model:valid="canContinue"
			:content />
		<div v-else>
			{{ folderName }}
		</div>

		<template #actions>
			<NcButton v-if="step > 0" @click="step -= 1">
				{{ t('end_to_end_encryption', 'Back') }}
			</NcButton>
			<NcButton
				v-if="step <= STEP_CONFIRM"
				:class="$style.createFolderDialog__buttonContinue"
				:aria-disabled="!canContinue"
				variant="primary"
				@click="nextStep">
				{{ step === STEP_CONFIRM ? t('end_to_end_encryption', 'Create') : t('end_to_end_encryption', 'Next') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style module>
.createFolderDialog__buttonContinue[aria-disabled='true'] {
	pointer-events: none;
	opacity: 0.7;
	filter: saturate(0.7);
}
</style>
