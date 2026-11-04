<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\Config;
use OCP\IConfig;
use OCP\IGroupManager;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class ConfigTest extends TestCase {
	private IConfig&MockObject $iConfig;
	private Config $config;

	protected function setUp(): void {
		parent::setUp();

		$this->iConfig = $this->createMock(IConfig::class);
		$this->config = new Config(
			$this->iConfig,
			$this->createStub(IGroupManager::class),
		);
	}

	public static function dataIsDebugToolsAllowed(): array {
		return [
			['true', true],
			['false', false],
		];
	}

	#[DataProvider('dataIsDebugToolsAllowed')]
	public function testIsDebugToolsAllowed(string $value, bool $allowed): void {
		$this->iConfig->expects($this->once())
			->method('getAppValue')
			->with('end_to_end_encryption', Config::DEBUG_TOOLS_ALLOWED, 'false')
			->willReturn($value);

		$this->assertSame($allowed, $this->config->isDebugToolsAllowed());
	}

	public static function dataIsDebugToolsEnabled(): array {
		return [
			'allowed and enabled' => [true, true, true],
			'allowed but not enabled' => [true, false, false],
			'enabled but not allowed' => [false, true, false],
			'neither allowed nor enabled' => [false, false, false],
		];
	}

	#[DataProvider('dataIsDebugToolsEnabled')]
	public function testIsDebugToolsEnabled(bool $allowed, bool $enabled, bool $expected): void {
		$this->iConfig->method('getAppValue')
			->with('end_to_end_encryption', Config::DEBUG_TOOLS_ALLOWED, 'false')
			->willReturn($allowed ? 'true' : 'false');
		$this->iConfig->expects($allowed ? $this->once() : $this->never())
			->method('getUserValue')
			->with('alice', 'end_to_end_encryption', Config::DEBUG_TOOLS_ENABLED, 'false')
			->willReturn($enabled ? 'true' : 'false');

		$this->assertSame($expected, $this->config->isDebugToolsEnabled('alice'));
	}
}
