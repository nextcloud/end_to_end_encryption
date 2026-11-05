<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\Controller;

use OCA\EndToEndEncryption\Config;
use OCA\EndToEndEncryption\Controller\ConfigController;
use OCP\AppFramework\Http;
use OCP\IConfig;
use OCP\IRequest;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class ConfigControllerTest extends TestCase {
	private IConfig&MockObject $iConfig;
	private Config&MockObject $config;

	protected function setUp(): void {
		parent::setUp();

		$this->iConfig = $this->createMock(IConfig::class);
		$this->config = $this->createMock(Config::class);
	}

	private function getController(?string $userId = 'alice'): ConfigController {
		return new ConfigController(
			'end_to_end_encryption',
			$this->createStub(IRequest::class),
			$this->iConfig,
			$userId,
			$this->config,
		);
	}

	public function testSetUserConfigWithoutUser(): void {
		$this->iConfig->expects($this->never())
			->method('setUserValue');

		$response = $this->getController(null)->setUserConfig('e2eeInBrowserEnabled', 'true');
		$this->assertSame(Http::STATUS_PRECONDITION_FAILED, $response->getStatus());
	}

	public function testSetUserConfigUnknownKey(): void {
		$this->iConfig->expects($this->never())
			->method('setUserValue');

		$response = $this->getController()->setUserConfig('unknown', 'true');
		$this->assertSame(Http::STATUS_PRECONDITION_FAILED, $response->getStatus());
	}

	public function testSetBrowserE2eeEnabled(): void {
		$this->iConfig->expects($this->once())
			->method('setUserValue')
			->with('alice', 'end_to_end_encryption', 'e2eeInBrowserEnabled', 'true');

		$response = $this->getController()->setUserConfig('e2eeInBrowserEnabled', 'true');
		$this->assertSame(Http::STATUS_OK, $response->getStatus());
	}

	public static function dataSetDebugToolsEnabled(): array {
		return [
			'enable if allowed' => ['true', true],
			'disable if allowed' => ['false', true],
			'disable if not allowed' => ['false', false],
		];
	}

	#[DataProvider('dataSetDebugToolsEnabled')]
	public function testSetDebugToolsEnabled(string $value, bool $allowed): void {
		$this->config->method('isDebugToolsAllowed')
			->willReturn($allowed);
		$this->iConfig->expects($this->once())
			->method('setUserValue')
			->with('alice', 'end_to_end_encryption', Config::DEBUG_TOOLS_ENABLED, $value);

		$response = $this->getController()->setUserConfig(Config::DEBUG_TOOLS_ENABLED, $value);
		$this->assertSame(Http::STATUS_OK, $response->getStatus());
	}

	public function testEnableDebugToolsIfNotAllowed(): void {
		$this->config->method('isDebugToolsAllowed')
			->willReturn(false);
		$this->iConfig->expects($this->never())
			->method('setUserValue');

		$response = $this->getController()->setUserConfig(Config::DEBUG_TOOLS_ENABLED, 'true');
		$this->assertSame(Http::STATUS_FORBIDDEN, $response->getStatus());
	}
}
