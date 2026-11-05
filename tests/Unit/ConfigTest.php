<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\AppInfo\ConfigLexicon;
use OCA\EndToEndEncryption\Config;
use OCP\Config\IUserConfig;
use OCP\IAppConfig;
use OCP\IConfig;
use OCP\IGroupManager;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class ConfigTest extends TestCase {
	private IAppConfig&MockObject $appConfig;
	private IUserConfig&MockObject $userConfig;
	private Config $config;

	protected function setUp(): void {
		parent::setUp();

		$this->appConfig = $this->createMock(IAppConfig::class);
		$this->userConfig = $this->createMock(IUserConfig::class);
		$this->config = new Config(
			$this->createStub(IConfig::class),
			$this->createStub(IGroupManager::class),
			$this->appConfig,
			$this->userConfig,
		);
	}

	public static function dataIsDebugToolsAllowed(): array {
		return [
			[true],
			[false],
		];
	}

	#[DataProvider('dataIsDebugToolsAllowed')]
	public function testIsDebugToolsAllowed(bool $allowed): void {
		$this->appConfig->expects($this->once())
			->method('getValueBool')
			->with('end_to_end_encryption', ConfigLexicon::DEBUG_TOOLS_ALLOWED)
			->willReturn($allowed);

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
		$this->appConfig->method('getValueBool')
			->with('end_to_end_encryption', ConfigLexicon::DEBUG_TOOLS_ALLOWED)
			->willReturn($allowed);
		$this->userConfig->expects($allowed ? $this->once() : $this->never())
			->method('getValueBool')
			->with('alice', 'end_to_end_encryption', ConfigLexicon::DEBUG_TOOLS_ENABLED)
			->willReturn($enabled);

		$this->assertSame($expected, $this->config->isDebugToolsEnabled('alice'));
	}
}
