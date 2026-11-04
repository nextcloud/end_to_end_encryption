/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import type { IDebugReport } from '../services/debug.ts'

import { showSuccess } from '@nextcloud/dialogs'
import { Folder } from '@nextcloud/files'
import { defaultRemoteURL } from '@nextcloud/files/dav'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import EncryptedFolderDebugDialog from './EncryptedFolderDebugDialog.vue'
import { loadDebugReport } from '../services/debug.ts'

vi.mock('@nextcloud/dialogs', () => ({
	showError: vi.fn(),
	showSuccess: vi.fn(),
}))
vi.mock('../services/debug.ts', () => ({
	loadDebugReport: vi.fn(),
}))
vi.mock('../services/logger.ts', () => ({
	default: { debug: vi.fn(), error: vi.fn() },
}))

/** Renders the dialog in place instead of teleporting it */
const DialogStub = defineComponent({
	props: { name: { type: String, required: true } },
	setup(props, { slots }) {
		return () => h('div', { role: 'dialog', 'aria-label': props.name }, slots.default?.())
	},
})

const node = new Folder({
	owner: 'alice',
	source: defaultRemoteURL + '/files/alice/Secret',
	root: '/files/alice',
	attributes: { 'e2ee-is-encrypted': 1 },
})

const report: IDebugReport = {
	version: '2.1',
	isRoot: true,
	counter: 4,
	users: ['alice', 'bob'],
	checks: [
		{ id: 'metadata', status: 'passed' },
		{ id: 'signature', status: 'failed', error: 'Message digest doesn\'t match' },
		{ id: 'keyChecksum', status: 'skipped' },
	],
	contents: [
		{ uuid: 'uuid-file', name: 'file.txt', mimetype: 'text/plain', isFolder: false, existsOnServer: true },
		{ uuid: 'uuid-folder', name: 'Folder', mimetype: 'httpd/unix-directory', isFolder: true, existsOnServer: false },
	],
	fileDrop: [
		{ uuid: 'uuid-drop', recipients: ['alice'], name: 'dropped.txt', mimetype: 'text/plain', existsOnServer: true },
		{ uuid: 'uuid-drop-bob', recipients: ['bob'], error: 'Current user has no access to this file drop', existsOnServer: true },
	],
	unknownServerNodes: [{ name: 'uuid-unknown', isFolder: false }],
	redactedMetadata: { counter: 4, files: { 'uuid-file': { filename: 'file.txt', key: '[redacted]' } } },
}

beforeEach(() => {
	vi.mocked(loadDebugReport).mockReset()
})

/**
 * Mount the dialog and wait for the report to be loaded
 *
 * @param result - The report or the error to load
 */
async function mountDialog(result: IDebugReport | Error): Promise<VueWrapper> {
	if (result instanceof Error) {
		vi.mocked(loadDebugReport).mockRejectedValue(result)
	} else {
		vi.mocked(loadDebugReport).mockResolvedValue(result)
	}

	const wrapper = mount(EncryptedFolderDebugDialog, {
		props: { node },
		global: { stubs: { NcDialog: DialogStub } },
	})
	await flushPromises()
	return wrapper
}

/**
 * Get a section of the dialog by its heading
 *
 * @param wrapper - The mounted dialog
 * @param heading - The heading of the section
 */
function getSection(wrapper: VueWrapper, heading: string): DOMWrapper<Element> | undefined {
	return wrapper.findAll('section').find((section) => section.find('h3').text() === heading)
}

/**
 * Get the value of a row of the summary table
 *
 * @param wrapper - The mounted dialog
 * @param label - The label of the row
 */
function getSummaryValue(wrapper: VueWrapper, label: string): string | undefined {
	return getSection(wrapper, 'Summary')!.findAll('tr')
		.find((row) => row.find('th').text() === label)
		?.find('td')
		.text()
}

describe('EncryptedFolderDebugDialog', () => {
	test('shows the report of the folder', async () => {
		const wrapper = await mountDialog(report)

		expect(wrapper.find('[role="dialog"]').attributes('aria-label')).toBe('Debug encryption of Secret')
		expect(loadDebugReport).toHaveBeenCalledWith('/Secret')

		expect(getSummaryValue(wrapper, 'Metadata version')).toBe('2.1')
		expect(getSummaryValue(wrapper, 'Metadata type')).toBe('Root metadata')
		expect(getSummaryValue(wrapper, 'Counter')).toBe('4')
		expect(getSummaryValue(wrapper, 'Users with access')).toBe('alice, bob')

		const checks = getSection(wrapper, 'Checks')!.findAll('li').map((item) => item.text())
		expect(checks).toEqual([
			'Metadata is stored and readable: Passed',
			'Metadata signature is valid: Failed (Message digest doesn\'t match)',
			'Metadata key checksum is listed: Skipped',
		])

		const fileDrop = getSection(wrapper, 'File drop')!.findAll('li')
		expect(fileDrop[0]!.text()).toContain('dropped.txt')
		expect(fileDrop[0]!.text()).not.toContain('Missing on the server')
		expect(fileDrop[1]!.text()).toContain('Unknown file')
		expect(fileDrop[1]!.text()).toContain('Cannot be decrypted: Current user has no access to this file drop')

		const contents = getSection(wrapper, 'Files and folders')!.findAll('li')
		expect(contents[0]!.text()).toContain('file.txt')
		expect(contents[0]!.text()).not.toContain('Missing on the server')
		expect(contents[1]!.text()).toContain('Folder')
		expect(contents[1]!.text()).toContain('Missing on the server')

		expect(getSection(wrapper, 'Not listed in the metadata')!.find('li').text()).toContain('uuid-unknown')
	})

	test('shows the redacted metadata on request', async () => {
		const wrapper = await mountDialog(report)
		const section = getSection(wrapper, 'Decrypted metadata')!
		expect(section.find('pre').exists()).toBe(false)

		const toggle = section.findAll('button').find((button) => button.text() === 'Show metadata')!
		expect(toggle.attributes('aria-expanded')).toBe('false')
		await toggle.trigger('click')

		expect(toggle.text()).toBe('Hide metadata')
		expect(toggle.attributes('aria-expanded')).toBe('true')
		expect(JSON.parse(section.find('pre').text())).toEqual(report.redactedMetadata)
	})

	test('copies the redacted metadata', async () => {
		const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
		const wrapper = await mountDialog(report)

		const copy = getSection(wrapper, 'Decrypted metadata')!.findAll('button').find((button) => button.text() === 'Copy metadata')!
		await copy.trigger('click')
		await flushPromises()

		expect(showSuccess).toHaveBeenCalled()
		expect(JSON.parse(writeText.mock.calls[0]![0])).toEqual(report.redactedMetadata)
	})

	test('hides sections without data', async () => {
		const wrapper = await mountDialog({
			...report,
			fileDrop: [],
			contents: [],
			unknownServerNodes: [],
			redactedMetadata: undefined,
		})

		expect(getSection(wrapper, 'File drop')!.text()).toContain('No file drop entries')
		expect(getSection(wrapper, 'Files and folders')!.text()).toContain('The metadata lists no files or folders')
		expect(getSection(wrapper, 'Not listed in the metadata')).toBeUndefined()
		expect(getSection(wrapper, 'Decrypted metadata')).toBeUndefined()
	})

	test('shows special characters unescaped', async () => {
		vi.mocked(loadDebugReport).mockResolvedValue({
			...report,
			fileDrop: [{ uuid: 'uuid-drop', recipients: ['a&b', '<user>'], error: 'Invalid "key" & <tag>', existsOnServer: true }],
		})
		const wrapper = mount(EncryptedFolderDebugDialog, {
			props: { node: new Folder({ ...node, source: defaultRemoteURL + '/files/alice/A & <B>', root: '/files/alice', owner: 'alice' }) },
			global: { stubs: { NcDialog: DialogStub } },
		})
		await flushPromises()

		expect(wrapper.find('[role="dialog"]').attributes('aria-label')).toBe('Debug encryption of A & <B>')
		const entry = getSection(wrapper, 'File drop')!.find('li').text()
		expect(entry).toContain('Recipients: a&b, <user>')
		expect(entry).toContain('Cannot be decrypted: Invalid "key" & <tag>')
	})

	test('shows an error if the metadata cannot be loaded', async () => {
		const wrapper = await mountDialog(new Error('Request failed with status code 404'))

		expect(wrapper.text()).toContain('Could not load the metadata')
		expect(wrapper.text()).toContain('Request failed with status code 404')
		expect(wrapper.findAll('section')).toHaveLength(0)
	})
})
