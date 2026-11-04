<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\Controller;

use OCA\EndToEndEncryption\AppInfo\ConfigLexicon;
use OCA\EndToEndEncryption\Config;
use OCA\EndToEndEncryption\Controller\ConfigController;
use OCP\AppFramework\Http;
use OCP\Config\IUserConfig;
use OCP\IRequest;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class ConfigControllerTest extends TestCase {
	private IUserConfig&MockObject $userConfig;
	private Config&MockObject $config;

	protected function setUp(): void {
		parent::setUp();

		$this->userConfig = $this->createMock(IUserConfig::class);
		$this->config = $this->createMock(Config::class);
	}

	private function getController(?string $userId = 'alice'): ConfigController {
		return new ConfigController(
			'end_to_end_encryption',
			$this->createStub(IRequest::class),
			$userId,
			$this->userConfig,
			$this->config,
		);
	}

	public function testSetUserConfigWithoutUser(): void {
		$this->userConfig->expects($this->never())
			->method('setValueBool');

		$response = $this->getController(null)->setUserConfig(ConfigLexicon::E2EE_IN_BROWSER_ENABLED, 'true');
		$this->assertSame(Http::STATUS_PRECONDITION_FAILED, $response->getStatus());
	}

	public function testSetUserConfigUnknownKey(): void {
		$this->userConfig->expects($this->never())
			->method('setValueBool');

		$response = $this->getController()->setUserConfig('unknown', 'true');
		$this->assertSame(Http::STATUS_PRECONDITION_FAILED, $response->getStatus());
	}

	public function testSetBrowserE2eeEnabled(): void {
		$this->userConfig->expects($this->once())
			->method('setValueBool')
			->with('alice', 'end_to_end_encryption', ConfigLexicon::E2EE_IN_BROWSER_ENABLED, true);

		$response = $this->getController()->setUserConfig(ConfigLexicon::E2EE_IN_BROWSER_ENABLED, 'true');
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
		$this->userConfig->expects($this->once())
			->method('setValueBool')
			->with('alice', 'end_to_end_encryption', ConfigLexicon::DEBUG_TOOLS_ENABLED, $value === 'true');

		$response = $this->getController()->setUserConfig(ConfigLexicon::DEBUG_TOOLS_ENABLED, $value);
		$this->assertSame(Http::STATUS_OK, $response->getStatus());
	}

	public function testEnableDebugToolsIfNotAllowed(): void {
		$this->config->method('isDebugToolsAllowed')
			->willReturn(false);
		$this->userConfig->expects($this->never())
			->method('setValueBool');

		$response = $this->getController()->setUserConfig(ConfigLexicon::DEBUG_TOOLS_ENABLED, 'true');
		$this->assertSame(Http::STATUS_FORBIDDEN, $response->getStatus());
	}
}
