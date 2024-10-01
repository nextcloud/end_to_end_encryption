<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
