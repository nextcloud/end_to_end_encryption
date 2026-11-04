<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\Settings;

use OCA\EndToEndEncryption\Config;
use OCA\EndToEndEncryption\Settings\Admin;
use OCP\AppFramework\Services\IInitialState;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class AdminTest extends TestCase {
	private IInitialState&MockObject $initialState;
	private Config&MockObject $config;

	protected function setUp(): void {
		parent::setUp();

		$this->initialState = $this->createMock(IInitialState::class);
		$this->config = $this->createMock(Config::class);
	}

	public function testGetForm(): void {
		$this->config->method('getAllowedGroupIds')
			->willReturn(['group1']);
		$this->config->method('isDebugToolsAllowed')
			->willReturn(true);

		$provided = [];
		$this->initialState->expects($this->exactly(2))
			->method('provideInitialState')
			->willReturnCallback(function (string $key, mixed $value) use (&$provided): void {
				$provided[$key] = $value;
			});

		$response = (new Admin($this->initialState, $this->config))->getForm();

		$this->assertSame('settings-admin', $response->getTemplateName());
		$this->assertSame([
			'allowed_groups' => ['group1'],
			'debug_tools_allowed' => true,
		], $provided);
	}
}
