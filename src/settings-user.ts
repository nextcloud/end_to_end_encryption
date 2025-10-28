/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createApp } from 'vue'
import SettingsUser from './views/SettingsUser.vue'

const app = createApp(SettingsUser)
app.mount('#security-end-to-end')
