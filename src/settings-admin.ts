/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createApp } from 'vue'
import SettingsAdmin from './views/SettingsAdmin.vue'

const app = createApp(SettingsAdmin)
app.mount('#security-admin-end-to-end')
