<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

if ($canUseApp) {
	\OCP\Util::addScript('end_to_end_encryption', 'end_to_end_encryption-settings'); ?>
	<div id="security-end-to-end"></div>
<?php
}
?>
