/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createApp } from 'vue'
import AdminSection from './components/AdminSection.vue'

const app = createApp(AdminSection)
app.mount('#security-admin-end-to-end')
