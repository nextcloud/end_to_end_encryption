<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\Capabilities;
use OCA\EndToEndEncryption\Config;
use OCA\EndToEndEncryption\IKeyStorage;
use OCP\IUser;
use OCP\IUserSession;
use Test\TestCase;

class CapabilitiesTest extends TestCase {
	private Capabilities $capabilities;
	/** @var IUserSession */
	private $userSession;
	/** @var Config */
	private $config;
	/** @var IKeyStorage */
	private $keyStorage;

	protected function setUp(): void {
		parent::setUp();

		$this->config = $this->createMock(Config::class);
		$this->userSession = $this->createMock(IUserSession::class);
		$this->keyStorage = $this->createMock(IKeyStorage::class);
		$this->capabilities = new Capabilities(
			$this->config,
			$this->userSession,
			$this->keyStorage
		);
	}

	public function testGetCapabilities(): void {
		$user = $this->createMock(IUser::class);
		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn($user);
		$user
			->method('getUID')
			->willReturn('test');
		$this->config->expects($this->once())
			->method('isDisabledForUser')
			->with($user)
			->willReturn(false);
		$this->keyStorage->expects($this->once())
			->method('publicKeyExists')
			->with('test')
			->willReturn(true);
		$this->keyStorage->expects($this->once())
			->method('privateKeyExists')
			->with('test')
			->willReturn(true);
		$this->assertEquals([
			'end-to-end-encryption' => [
				'enabled' => true,
				'api-version' => '2.0',
				'keys-exist' => true
			]
		], $this->capabilities->getCapabilities());
	}

	public function testGetCapabilitiesDisabled(): void {
		$user = $this->createMock(IUser::class);
		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn($user);
		$this->config->expects($this->once())
			->method('isDisabledForUser')
			->with($user)
			->willReturn(true);
		$this->assertEquals([], $this->capabilities->getCapabilities());
	}

	public function testGetCapabilitiesNoUser(): void {
		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn(null);
		$this->assertEquals([], $this->capabilities->getCapabilities());
	}
}
