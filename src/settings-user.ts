/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createApp } from 'vue'
import SecuritySection from './components/SecuritySection.vue'

const app = createApp(SecuritySection)
app.mount('#security-end-to-end')
