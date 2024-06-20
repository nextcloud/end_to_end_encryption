<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\EndToEndEncryption\BackgroundJob;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\RollbackService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\TimedJob;
use OCP\IConfig;

/**
 * Class RollbackBackgroundJob
 *
 * @package OCA\EndToEndEncryption\BackgroundJob
 */
class RollbackBackgroundJob extends TimedJob {
	private IConfig $config;
	private RollbackService $rollbackService;

	public function __construct(IConfig $config,
		ITimeFactory $time,
		RollbackService $rollbackService) {
		parent::__construct($time);
		$this->config = $config;
		$this->rollbackService = $rollbackService;

		// Run once an hour
		$this->setInterval(60 * 60);
	}

	/**
	 * @inheritDoc
	 */
	protected function run($argument) {
		$automaticRollback = $this->config
			->getAppValue(Application::APP_ID, 'automatic_rollback', 'yes');
		if ($automaticRollback !== 'yes') {
			return;
		}

		$automaticRollbackTTL = (int)$this->config
			->getAppValue(Application::APP_ID, 'automatic_rollback_ttl', (string)(60 * 60 * 24));
		$timestamp = $this->time->getTime() - $automaticRollbackTTL;

		$this->rollbackService->rollbackOlderThan($timestamp, 25);
	}
}
