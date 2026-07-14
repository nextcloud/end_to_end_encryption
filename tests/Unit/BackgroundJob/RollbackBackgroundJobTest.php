<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\BackgroundJob;

use OCA\EndToEndEncryption\BackgroundJob\RollbackBackgroundJob;
use OCA\EndToEndEncryption\RollbackService;
use OCP\AppFramework\Services\IAppConfig;
use OCP\AppFramework\Utility\ITimeFactory;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class RollbackBackgroundJobTest extends TestCase {

	private IAppConfig&MockObject $appConfig;
	private ITimeFactory&MockObject $timeFactory;
	private RollbackService&MockObject $rollbackService;
	private RollbackBackgroundJob $rollbackBackgroundJob;

	protected function setUp(): void {
		parent::setUp();

		$this->appConfig = $this->createMock(IAppConfig::class);
		$this->timeFactory = $this->createMock(ITimeFactory::class);
		$this->rollbackService = $this->createMock(RollbackService::class);

		$this->rollbackBackgroundJob = new RollbackBackgroundJob($this->timeFactory, $this->rollbackService, $this->appConfig);
	}

	/**
	 * @dataProvider runDataProvider
	 */
	public function testRun(bool $automaticRollback, bool $expectsServiceCall, int $automaticRollbackTTL, int $expectedTimestamp):void {
		$this->appConfig->expects($this->once())
			->method('getAppValueBool')
			->with('automatic_rollback')
			->willReturn($automaticRollback);
		$this->appConfig
			->method('getAppValueInt')
			->with('automatic_rollback_ttl')
			->willReturn($automaticRollbackTTL);

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
			[false, false, -1,  -1],
			[true, true, 60, 440],
			[true, true, 80, 420],
		];
	}
}
