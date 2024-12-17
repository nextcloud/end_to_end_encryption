<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\BackgroundJob;

use OCA\EndToEndEncryption\BackgroundJob\RollbackBackgroundJob;
use OCA\EndToEndEncryption\RollbackService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IConfig;
use Test\TestCase;

class RollbackBackgroundJobTest extends TestCase {

	private IConfig&\PHPUnit\Framework\MockObject\MockObject $config;
	private ITimeFactory&\PHPUnit\Framework\MockObject\MockObject $timeFactory;
	private RollbackService&\PHPUnit\Framework\MockObject\MockObject $rollbackService;
	private RollbackBackgroundJob $rollbackBackgroundJob;

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
