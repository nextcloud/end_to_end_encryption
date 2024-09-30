/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import { getLoggerBuilder } from '@nextcloud/logger'

const getLogger = user => {
	if (user === null) {
		return getLoggerBuilder()
			.setApp('end_to_end_encryption')
			.build()
	}
	return getLoggerBuilder()
		.setApp('end_to_end_encryption')
		.setUid(user.uid)
		.build()
}

export default getLogger(getCurrentUser())
