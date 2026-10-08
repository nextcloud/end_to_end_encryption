/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { VueWrapper } from '@vue/test-utils'
import type { IRawMetadataFileDrop } from '../models/metadata.d.ts'
import type * as FileDropUtils from '../services/fileDropUtils.ts'

import { showError, showInfo, showWarning } from '@nextcloud/dialogs'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import FileDrop from './FileDrop.vue'
import { finalizeFileDrop, uploadFileDrop } from '../services/fileDropUtils.ts'

vi.mock('@nextcloud/dialogs', { spy: true })

vi.mock('@nextcloud/initial-state', () => ({
	loadState: (app: string, key: string, fallback?: unknown) => ({
		fileId: '42',
		fileName: 'Drop folder',
		metadataVersion: 2,
		publicKeys: {},
	})[key] ?? fallback,
}))

vi.mock('@nextcloud/sharing/public', () => ({
	getSharingToken: () => 'share-token',
}))

vi.mock('../services/fileDropUtils.ts', async (importOriginal) => ({
	...await importOriginal<typeof FileDropUtils>(),
	uploadFileDrop: vi.fn(),
	finalizeFileDrop: vi.fn(),
}))

vi.mock('../services/logger.ts', () => ({
	default: { debug: vi.fn(), error: vi.fn() },
}))

const rawEntry = { filename: 'a.txt' } as unknown as IRawMetadataFileDrop

/** Stub that only renders its default slot */
const SlotStub = defineComponent({
	setup(_, { slots }) {
		return () => h('div', slots.default?.())
	},
})

/**
 * Mount the file drop view and wait for its initialization
 */
async function mountFileDrop(): Promise<VueWrapper> {
	const wrapper = mount(FileDrop, {
		global: {
			stubs: {
				NcContent: SlotStub,
				NcAppContent: SlotStub,
			},
		},
	})
	await flushPromises()
	return wrapper
}

/**
 * Select the given files in the file input and wait for the upload to settle
 *
 * @param wrapper - The mounted file drop view
 * @param names - Names of the files to upload
 */
async function selectFiles(wrapper: VueWrapper, names: string[]) {
	const dataTransfer = new DataTransfer()
	for (const name of names) {
		dataTransfer.items.add(new File(['content'], name, { type: 'text/plain' }))
	}
	const input = wrapper.find<HTMLInputElement>('input[type="file"]')
	input.element.files = dataTransfer.files
	await input.trigger('change')
	await flushPromises()
}

/**
 * Get the rendered list items as `[name, error message]` pairs
 *
 * @param wrapper - The mounted file drop view
 */
function listedFiles(wrapper: VueWrapper): [string, string | undefined][] {
	return wrapper.findAll('.uploader-form__file-list__item').map((item) => [
		item.find('b').text(),
		item.find('.uploader-form__file-list__error').exists() ? item.find('.uploader-form__file-list__error').text() : undefined,
	])
}

describe('FileDrop', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(uploadFileDrop).mockImplementation(async (file) => [`uuid-${file.name}`, rawEntry])
		vi.mocked(finalizeFileDrop).mockImplementation(async (entries) => Object.keys(entries))
	})

	test('shows the reason why an upload failed', async () => {
		vi.mocked(uploadFileDrop).mockRejectedValue(Object.assign(new Error('Invalid response'), { status: 413 }))
		const wrapper = await mountFileDrop()

		await selectFiles(wrapper, ['big.bin'])

		expect(listedFiles(wrapper)).toEqual([['big.bin', 'The file is too large to be uploaded.']])
		expect(wrapper.find('.uploader-form__file-list__item--error').exists()).toBe(true)
		expect(showError).toHaveBeenCalledWith('The file is too large to be uploaded.')
		expect(finalizeFileDrop).not.toHaveBeenCalled()
	})

	test('still finalizes the files that could be uploaded', async () => {
		vi.mocked(uploadFileDrop).mockImplementation(async (file) => {
			if (file.name === 'big.bin') {
				throw Object.assign(new Error('Invalid response'), { status: 413 })
			}
			return [`uuid-${file.name}`, rawEntry]
		})
		const wrapper = await mountFileDrop()

		await selectFiles(wrapper, ['big.bin', 'small.txt'])

		expect(finalizeFileDrop).toHaveBeenCalledWith({ 'uuid-small.txt': rawEntry }, '42', 'share-token')
		expect(listedFiles(wrapper)).toEqual([
			['big.bin', 'The file is too large to be uploaded.'],
			['small.txt', undefined],
		])
		expect(showWarning).toHaveBeenCalledWith('Some files failed to upload.')
		expect(showError).not.toHaveBeenCalled()
	})

	test('shows a generic message if all uploads failed for different reasons', async () => {
		vi.mocked(uploadFileDrop).mockImplementation(async (file) => {
			throw Object.assign(new Error('Invalid response'), { status: file.name === 'big.bin' ? 413 : 507 })
		})
		const wrapper = await mountFileDrop()

		await selectFiles(wrapper, ['big.bin', 'other.bin'])

		expect(listedFiles(wrapper)).toEqual([
			['big.bin', 'The file is too large to be uploaded.'],
			['other.bin', 'There is not enough free space to upload the file.'],
		])
		expect(showError).toHaveBeenCalledWith('All files failed to upload.')
	})

	test('marks files the server rejected as failed', async () => {
		vi.mocked(finalizeFileDrop).mockResolvedValue(['uuid-b.txt'])
		const wrapper = await mountFileDrop()

		await selectFiles(wrapper, ['a.txt', 'b.txt'])

		expect(listedFiles(wrapper)).toEqual([
			['a.txt', 'The file was rejected by the server.'],
			['b.txt', undefined],
		])
		expect(showWarning).toHaveBeenCalledWith('Some files failed to upload.')
	})

	test('marks all files as failed if finalizing the file drop fails', async () => {
		vi.mocked(finalizeFileDrop).mockRejectedValue({ isAxiosError: true, response: { status: 403 } })
		const wrapper = await mountFileDrop()

		await selectFiles(wrapper, ['a.txt', 'b.txt'])

		expect(listedFiles(wrapper)).toEqual([
			['a.txt', 'You are not allowed to upload files to this share.'],
			['b.txt', 'You are not allowed to upload files to this share.'],
		])
		expect(showError).toHaveBeenCalledWith('You are not allowed to upload files to this share.')
	})

	test('informs about pending processing on the server', async () => {
		vi.mocked(finalizeFileDrop).mockResolvedValue(null)
		const wrapper = await mountFileDrop()

		await selectFiles(wrapper, ['a.txt'])

		expect(listedFiles(wrapper)).toEqual([['a.txt', undefined]])
		expect(showInfo).toHaveBeenCalledOnce()
		expect(showError).not.toHaveBeenCalled()
		expect(showWarning).not.toHaveBeenCalled()
	})

	test('shows no message if all files were uploaded', async () => {
		const wrapper = await mountFileDrop()

		await selectFiles(wrapper, ['a.txt', 'b.txt'])

		expect(finalizeFileDrop).toHaveBeenCalledWith({ 'uuid-a.txt': rawEntry, 'uuid-b.txt': rawEntry }, '42', 'share-token')
		expect(listedFiles(wrapper)).toEqual([['a.txt', undefined], ['b.txt', undefined]])
		expect(wrapper.find('.uploader-form__file-list__item--error').exists()).toBe(false)
		expect(showError).not.toHaveBeenCalled()
		expect(showWarning).not.toHaveBeenCalled()
	})
})
