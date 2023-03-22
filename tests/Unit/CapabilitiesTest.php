<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\Capabilities;
use OCA\EndToEndEncryption\Config;
use OCA\EndToEndEncryption\IKeyStorage;
use Test\TestCase;
use OCP\IUserSession;
use OCP\IUser;

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
			->willReturn("test");
		$this->config->expects($this->once())
			->method('isDisabledForUser')
			->with($user)
			->willReturn(false);
		$this->keyStorage->expects($this->once())
			->method('publicKeyExists')
			->with("test")
			->willReturn(true);
		$this->keyStorage->expects($this->once())
			->method('privateKeyExists')
			->with("test")
			->willReturn(true);
		$this->assertEquals([
			'end-to-end-encryption' => [
				'enabled' => true,
				'api-version' => '1.2',
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
