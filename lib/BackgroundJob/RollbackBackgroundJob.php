<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\BackgroundJob;

use OCA\EndToEndEncryption\AppInfo\ConfigLexicon;
use OCA\EndToEndEncryption\RollbackService;
use OCP\AppFramework\Services\IAppConfig;
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
		private readonly IAppConfig $appConfig,
	) {
		parent::__construct($time);

		// Run once an hour
		$this->setInterval(60 * 60);
	}

	protected function run($argument) {
		$automaticRollback = $this->appConfig
			->getAppValueBool(ConfigLexicon::AUTOMATIC_ROLLBACK_ENABLED);
		if ($automaticRollback === false) {
			return;
		}

		$automaticRollbackTTL = $this->appConfig
			->getAppValueInt(ConfigLexicon::AUTOMATIC_ROLLBACK_TTL);
		$timestamp = $this->time->getTime() - $automaticRollbackTTL;

		$this->rollbackService->rollbackOlderThan($timestamp, 25);
	}
}
