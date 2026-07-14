<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\BackgroundJob;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\RollbackService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\TimedJob;

/**
 * Class RollbackBackgroundJob
 *
 * @package OCA\EndToEndEncryption\BackgroundJob
 */
class RollbackBackgroundJob extends TimedJob {
	public function __construct(
		ITimeFactory $time,
		private readonly RollbackService $rollbackService,
		private readonly \OCP\IAppConfig $appConfig,
	) {
		parent::__construct($time);

		// Run once an hour
		$this->setInterval(60 * 60);
	}

	protected function run($argument) {
		$automaticRollback = $this->appConfig
			->getValue(Application::APP_ID, 'automatic_rollback', 'yes');
		if ($automaticRollback !== 'yes') {
			return;
		}

		$automaticRollbackTTL = (int)$this->appConfig
			->getValue(Application::APP_ID, 'automatic_rollback_ttl', (string)(60 * 60 * 24));
		$timestamp = $this->time->getTime() - $automaticRollbackTTL;

		$this->rollbackService->rollbackOlderThan($timestamp, 25);
	}
}
