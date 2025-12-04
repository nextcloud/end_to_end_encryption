<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { IFolder, INode } from '@nextcloud/files'

import { t } from '@nextcloud/l10n'
import { onMounted, provide, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import CreateFolderDialogStepFolderName from './CreateFolderDialogStepFolderName.vue'
import CreateFolderDialogStepMnemonic from './CreateFolderDialogStepMnemonic.vue'
import CreateFolderDialogStepSetupEncryption from './CreateFolderDialogStepSetupEncryption.vue'
import logger from '../../services/logger.ts'
import * as store from '../../store/keys.ts'
import { INJECTION_KEY } from './useCreateFolderDialog.ts'

defineProps<{
	context: IFolder
	content: INode[]
}>()

const emit = defineEmits<{
	close: [result: IFolder | Error | false]
}>()

const STEP_CHECKING_SETUP = 0
const STEP_SETUP_ENCRYPTION = 1
const STEP_ENTER_MNEMONIC = 2
const STEP_FOLDER_NAME = 3

const currentStep = ref(STEP_CHECKING_SETUP)
onMounted(async () => {
	try {
		if (await store.loadPublicKey()) {
			if (store.hasPrivateKey()) {
				currentStep.value = STEP_FOLDER_NAME
			} else {
				currentStep.value = STEP_ENTER_MNEMONIC
			}
		} else {
			currentStep.value = STEP_SETUP_ENCRYPTION
		}
	} catch (error) {
		logger.error('Error while checking encryption setup:', { error })
		emit('close', error as Error)
	}
})

// state for the sub-components to signal whether we can continue
const canContinue = ref(false)
const callback = ref<() => Promise<void>>()
const buttonLabel = ref('')
provide(INJECTION_KEY, {
	buttonLabel,
	onContinue: callback,
})

/** handle moving to the next step */
async function nextStep() {
	if (!canContinue.value) {
		return
	}

	try {
		if (await callback.value?.()) {
			if (currentStep.value === STEP_SETUP_ENCRYPTION) {
				currentStep.value = STEP_FOLDER_NAME
			} else {
				currentStep.value++
			}
		}
	} catch (error) {
		emit('close', error as Error)
	}
}
</script>

<template>
	<NcDialog
		:content-classes="$style.createFolderDialog"
		size="normal"
		:name="t('end_to_end_encryption', 'Create new encrypted folder')"
		@update:open="$event || emit('close', false)">
		<NcEmptyContent
			v-if="currentStep === STEP_CHECKING_SETUP"
			:name="t('end_to_end_encryption', 'Checking encryption setup …')">
			<template #icon>
				<NcLoadingIcon />
			</template>
		</NcEmptyContent>

		<CreateFolderDialogStepSetupEncryption
			v-else-if="currentStep === STEP_SETUP_ENCRYPTION"
			v-model="canContinue" />

		<CreateFolderDialogStepMnemonic
			v-else-if="currentStep === STEP_ENTER_MNEMONIC"
			v-model="canContinue" />

		<CreateFolderDialogStepFolderName
			v-else-if="currentStep === STEP_FOLDER_NAME"
			v-model="canContinue"
			:content
			:context
			@folder-created="emit('close', $event)" />

		<template #actions>
			<NcButton
				:class="$style.createFolderDialog__buttonContinue"
				:aria-disabled="!canContinue"
				variant="primary"
				@click="nextStep">
				{{ buttonLabel || t('end_to_end_encryption', 'Submit') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style module>
.createFolderDialog {
	min-height: 150px !important;
}

.createFolderDialog__buttonContinue[aria-disabled='true'] {
	pointer-events: none;
	opacity: 0.7;
	filter: saturate(0.7);
}
</style>
