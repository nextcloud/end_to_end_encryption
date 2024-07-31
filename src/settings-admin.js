// SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
// SPDX-License-Identifier: AGPL-3.0-or-later

import Vue from 'vue'
import { translate, translatePlural } from '@nextcloud/l10n'

import AdminSection from './components/AdminSection.vue'

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

const View = Vue.extend(AdminSection)
new View({}).$mount('#security-admin-end-to-end')
