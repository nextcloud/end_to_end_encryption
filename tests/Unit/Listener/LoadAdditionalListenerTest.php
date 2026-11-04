<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\Listener;

use OCA\EndToEndEncryption\Config;
use OCA\EndToEndEncryption\Listener\LoadAdditionalListener;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\AppFramework\Services\IInitialState;
use OCP\Config\IUserConfig;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class LoadAdditionalListenerTest extends TestCase {
	private IInitialState&MockObject $initialState;
	private IUserConfig&MockObject $userConfig;
	private Config&MockObject $config;

	protected function setUp(): void {
		parent::setUp();

		$this->initialState = $this->createMock(IInitialState::class);
		$this->userConfig = $this->createMock(IUserConfig::class);
		$this->config = $this->createMock(Config::class);
	}

	public static function dataDebugToolsEnabled(): array {
		return [
			[true],
			[false],
		];
	}

	#[DataProvider('dataDebugToolsEnabled')]
	public function testProvidesDebugToolsState(bool $debugToolsEnabled): void {
		$this->userConfig->method('getValueBool')
			->willReturn(true);
		$this->config->expects($this->once())
			->method('isDebugToolsEnabled')
			->with('alice')
			->willReturn($debugToolsEnabled);
		$this->initialState->expects($this->once())
			->method('provideInitialState')
			->with('userConfig', [
				'e2eeInBrowserEnabled' => true,
				'debug_tools_enabled' => $debugToolsEnabled,
			]);

		$listener = new LoadAdditionalListener($this->initialState, 'alice', $this->userConfig, $this->config);
		$listener->handle(new LoadAdditionalScriptsEvent());
	}

	public function testDebugToolsDisabledWithoutUser(): void {
		$this->config->expects($this->never())
			->method('isDebugToolsEnabled');
		$this->initialState->expects($this->once())
			->method('provideInitialState')
			->with('userConfig', [
				'e2eeInBrowserEnabled' => true,
				'debug_tools_enabled' => false,
			]);

		$listener = new LoadAdditionalListener($this->initialState, null, $this->userConfig, $this->config);
		$listener->handle(new LoadAdditionalScriptsEvent());
	}
}
