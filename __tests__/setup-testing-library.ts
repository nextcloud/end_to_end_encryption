/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import '@testing-library/jest-dom/vitest'
import 'core-js/stable/index.js'
import 'core-js/proposals/reflect-metadata.js' // for @peculiar/x509

globalThis._oc_webroot = '' // mock a Nextcloud installation within the web root
