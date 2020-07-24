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

namespace OCA\EndToEndEncryption\Tests\Unit\Listener;

use OCA\EndToEndEncryption\IKeyStorage;
use OCA\EndToEndEncryption\Listener\UserDeletedListener;
use OCP\IUser;
use OCP\User\Events\UserDeletedEvent;
use Test\TestCase;

class UserDeletedListenerTest extends TestCase {

	/** @var IKeyStorage|\PHPUnit\Framework\MockObject\MockObject */
	private $keyStorage;

	/** @var UserDeletedListener */
	private $listener;

	protected function setUp(): void {
		parent::setUp();

		$this->keyStorage = $this->createMock(IKeyStorage::class);
		$this->listener = new UserDeletedListener($this->keyStorage);
	}

	public function testHandle(): void {
		$user = $this->createMock(IUser::class);

		$this->keyStorage->expects($this->once())
			->method('deleteUserKeys')
			->with($user);

		$event = new UserDeletedEvent($user);
		$this->listener->handle($event);
	}
}
