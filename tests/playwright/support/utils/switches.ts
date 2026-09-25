/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * Turn on a NcCheckboxRadioSwitch.
 *
 * Toggled from the keyboard rather than by a click: its input is visually hidden
 * behind the rendered control, so a click has to be forced - and a forced click
 * lands on whatever is on top, which is a menu popover or a toast often enough
 * to make every test using it flaky.
 *
 * @param element - The switch to turn on
 */
export async function toggleSwitch(element: Locator): Promise<void> {
	await expect(element).not.toBeChecked()
	await element.press(' ')
	await expect(element).toBeChecked()
}
