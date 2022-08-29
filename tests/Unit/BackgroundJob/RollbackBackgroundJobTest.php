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

namespace OCA\EndToEndEncryption\Tests\Unit\BackgroundJob;

use OCA\EndToEndEncryption\BackgroundJob\RollbackBackgroundJob;
use OCA\EndToEndEncryption\RollbackService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IConfig;
use Test\TestCase;

class RollbackBackgroundJobTest extends TestCase {

	/** @var IConfig|\PHPUnit\Framework\MockObject\MockObject */
	private $config;

	/** @var ITimeFactory|\PHPUnit\Framework\MockObject\MockObject */
	private $timeFactory;

	/** @var RollbackService|\PHPUnit\Framework\MockObject\MockObject */
	private $rollbackService;

	/** @var RollbackBackgroundJob */
	private $rollbackBackgroundJob;

	protected function setUp(): void {
		parent::setUp();

		$this->config = $this->createMock(IConfig::class);
		$this->timeFactory = $this->createMock(ITimeFactory::class);
		$this->rollbackService = $this->createMock(RollbackService::class);

		$this->rollbackBackgroundJob = new RollbackBackgroundJob($this->config, $this->timeFactory, $this->rollbackService);
	}

	/**
	 * @dataProvider runDataProvider
	 *
	 * @param string $automaticRollback
	 * @param bool $expectsServiceCall
	 * @param int $automaticRollbackTTL
	 * @param int $expectedTimestamp
	 */
	public function testRun(string $automaticRollback, bool $expectsServiceCall, int $automaticRollbackTTL, int $expectedTimestamp):void {
		$this->config->expects($automaticRollback === 'no' ? $this->once() : $this->exactly(2))
			->method('getAppValue')
			->willReturnMap([
				['end_to_end_encryption', 'automatic_rollback', 'yes', $automaticRollback],
				['end_to_end_encryption', 'automatic_rollback_ttl', '86400', (string)$automaticRollbackTTL],
			]);

		if ($expectsServiceCall) {
			$this->timeFactory->expects($this->once())
				->method('getTime')
				->willReturn(500);

			$this->rollbackService->expects($this->once())
				->method('rollbackOlderThan')
				->with($expectedTimestamp);
		}

		self::invokePrivate($this->rollbackBackgroundJob, 'run', [[]]);
	}

	public function runDataProvider(): array {
		return [
			['no', false, -1,  -1],
			['yes', true, 60, 440],
			['yes', true, 80, 420],
		];
	}
}
