// SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
// SPDX-License-Identifier: AGPL-3.0-or-later

import Vue from 'vue'
import { translate, translatePlural } from '@nextcloud/l10n'

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

import SecuritySection from './components/SecuritySection'

const View = Vue.extend(SecuritySection)
new View({}).$mount('#security-end-to-end')
