/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createApp } from 'vue'
import FileDrop from './views/FileDrop.vue'

import 'core-js/proposals/reflect-metadata.js' // for @peculiar/x509

const createAppInstance = createApp(FileDrop)
createAppInstance.mount('#content')
