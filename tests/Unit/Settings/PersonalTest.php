<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\Settings;

use OCA\EndToEndEncryption\AppInfo\ConfigLexicon;
use OCA\EndToEndEncryption\Config;
use OCA\EndToEndEncryption\IKeyStorage;
use OCA\EndToEndEncryption\Settings\Personal;
use OCP\AppFramework\Services\IInitialState;
use OCP\Config\IUserConfig;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class PersonalTest extends TestCase {
	private IInitialState&MockObject $initialState;
	private IUserConfig&MockObject $userConfig;
	private Config&MockObject $config;
	private Personal $personal;

	protected function setUp(): void {
		parent::setUp();

		$this->initialState = $this->createMock(IInitialState::class);
		$this->userConfig = $this->createMock(IUserConfig::class);
		$this->config = $this->createMock(Config::class);

		$userSession = $this->createStub(IUserSession::class);
		$userSession->method('getUser')
			->willReturn($this->createStub(IUser::class));

		$this->personal = new Personal(
			$this->createStub(IKeyStorage::class),
			$this->initialState,
			'alice',
			$userSession,
			$this->config,
			$this->userConfig,
		);
	}

	public static function dataGetForm(): array {
		return [
			'allowed and enabled' => [true, true],
			'allowed but not enabled' => [true, false],
			'not allowed' => [false, false],
		];
	}

	#[DataProvider('dataGetForm')]
	public function testGetForm(bool $allowed, bool $enabled): void {
		$this->config->method('isDebugToolsAllowed')
			->willReturn($allowed);
		$this->userConfig->method('getValueBool')
			->willReturnMap([
				['alice', 'end_to_end_encryption', ConfigLexicon::E2EE_IN_BROWSER_ENABLED, false, false, false],
				['alice', 'end_to_end_encryption', ConfigLexicon::DEBUG_TOOLS_ENABLED, false, false, $enabled],
			]);

		$provided = [];
		$this->initialState->method('provideInitialState')
			->willReturnCallback(function (string $key, mixed $value) use (&$provided): void {
				$provided[$key] = $value;
			});

		$this->personal->getForm();

		$this->assertSame([
			'e2eeInBrowserEnabled' => false,
			'debug_tools_enabled' => $enabled,
		], $provided['userConfig']);
		$this->assertSame($allowed, $provided['debugToolsAllowed']);
	}
}
