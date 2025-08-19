<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2018 Bjoern Schiessle <bjoern@schiessle.org>
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

use OCA\EndToEndEncryption\Db\Lock;
use OCA\EndToEndEncryption\Db\LockMapper;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\LockManagerV1;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotPermittedException;
use OCP\IUser;
use OCP\IUserSession;
use OCP\Security\ISecureRandom;
use Test\TestCase;

/**
 * Class LockManagerV1Test
 *
 * @group DB
 */
class LockManagerV1Test extends TestCase {

	/** @var LockMapper|\PHPUnit\Framework\MockObject\MockObject */
	private $lockMapper;

	/** @var ISecureRandom|\PHPUnit\Framework\MockObject\MockObject */
	private $secureRandom;

	/** @var IUserSession|\PHPUnit\Framework\MockObject\MockObject */
	private $userSession;

	/** @var IRootFolder|\PHPUnit\Framework\MockObject\MockObject */
	private $rootFolder;

	/** @var ITimeFactory|\PHPUnit\Framework\MockObject\MockObject */
	private $timeFactory;

	/** @var LockManagerV1 */
	private $lockManager;

	protected function setUp(): void {
		parent::setUp();

		$this->lockMapper = $this->createMock(LockMapper::class);
		$this->secureRandom = $this->createMock(ISecureRandom::class);
		$this->userSession = $this->createMock(IUserSession::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->timeFactory = $this->createMock(ITimeFactory::class);

		$this->lockManager = new LockManagerV1($this->lockMapper, $this->secureRandom,
			$this->rootFolder, $this->userSession, $this->timeFactory);
	}

	/**
	 * @dataProvider lockDataProvider
	 *
	 * @param bool $isLocked
	 * @param bool $lockDoesNotExist
	 * @param string $token
	 * @param bool $expectNull
	 * @param bool $expectNewToken
	 * @param bool $expectOldToken
	 */
	public function testLock(bool $isLocked, bool $lockDoesNotExist, string $token, bool $expectNull, bool $expectNewToken, bool $expectOldToken): void {
		$lockManager = $this->getMockBuilder(LockManagerV1::class)
			->setMethods(['isLocked'])
			->setConstructorArgs([
				$this->lockMapper,
				$this->secureRandom,
				$this->rootFolder,
				$this->userSession,
				$this->timeFactory
			])
			->getMock();

		$lockManager->expects($this->once())
			->method('isLocked')
			->with(42, $token)
			->willReturn($isLocked);

		if (!$isLocked) {
			if ($lockDoesNotExist) {
				$this->lockMapper->expects($this->once())
					->method('getByFileId')
					->with(42)
					->willThrowException(new DoesNotExistException(''));
			} else {
				$fakeLock = new Lock();
				$fakeLock->setToken('correct-token123');

				$this->lockMapper->expects($this->once())
					->method('getByFileId')
					->with(42)
					->willReturn($fakeLock);
			}
		}

		if ($expectNewToken) {
			$this->secureRandom->expects($this->once())
				->method('generate')
				->with(64, ISecureRandom::CHAR_UPPER . ISecureRandom::CHAR_LOWER . ISecureRandom::CHAR_DIGITS)
				->willReturn('new-token');

			$this->timeFactory->expects($this->once())
				->method('getTime')
				->willReturn(1337);

			$this->lockMapper->expects($this->once())
				->method('insert')
				->with($this->callback(static function ($lock) {
					return ($lock instanceof Lock
							&& $lock->getId() === 42
							&& $lock->getTimestamp() === 1337
							&& $lock->getToken() === 'new-token');
				}));
		} else {
			$this->secureRandom->expects($this->never())
				->method('generate');
			$this->timeFactory->expects($this->never())
				->method('getTime');
		}

		$actual = $lockManager->lockFile(42, $token);

		if ($expectNull) {
			$this->assertNull($actual);
		}
		if ($expectOldToken) {
			$this->assertEquals($token, $actual);
		}
		if ($expectNewToken) {
			$this->assertEquals('new-token', $actual);
		}
	}

	public function lockDataProvider(): array {
		return [
			[true,  false, 'correct-token123', true,  false, false],
			[false, true,  'correct-token123', false, true,  false],
			[false, false, 'correct-token123', false, false, true],
			[false, false, 'wrong-token456',   true,  false, false],
		];
	}

	/**
	 * @dataProvider unlockDataProvider
	 *
	 * @param bool $lockDoesNotExist
	 * @param string $token
	 * @param bool $expectFileNotLocked
	 * @param bool $expectFileLocked
	 * @param bool $expectDelete
	 */
	public function testUnlock(bool $lockDoesNotExist, string $token, bool $expectFileNotLocked, bool $expectFileLocked, bool $expectDelete): void {
		if ($lockDoesNotExist) {
			$this->lockMapper->expects($this->once())
				->method('getByFileId')
				->with(42)
				->willThrowException(new DoesNotExistException(''));
		} else {
			$fakeLock = new Lock();
			$fakeLock->setToken('correct-token123');

			$this->lockMapper->expects($this->once())
				->method('getByFileId')
				->with(42)
				->willReturn($fakeLock);
		}

		if ($expectDelete) {
			$this->lockMapper->expects($this->once())
				->method('delete')
				->with($fakeLock);
		} else {
			$this->lockMapper->expects($this->never())
				->method('delete');
		}

		if ($expectFileNotLocked) {
			$this->expectException(FileNotLockedException::class);
		} elseif ($expectFileLocked) {
			$this->expectException(FileLockedException::class);
		}

		$this->lockManager->unlockFile(42, $token);
	}

	public function unlockDataProvider(): array {
		return [
			[true,  'correct-token123', true,  false, false],
			[false, 'correct-token123', false, false, true],
			[false, 'wrong-token456',   false, true,  false],
		];
	}

	public function testIsLockedNoUserSession(): void {
		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn(null);

		$this->expectException(NotPermittedException::class);

		$this->lockManager->isLocked(42, 'correct-token123');
	}

	public function testIsLockedRoot(): void {
		$user = $this->createMock(IUser::class);
		$user->method('getUID')
			->willReturn('jane');

		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn($user);

		$node = $this->createMock(Node::class);
		$node->expects($this->once())
			->method('getPath')
			->willReturn('/');

		$userRoot = $this->createMock(Folder::class);
		$userRoot->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([$node]);

		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('jane')
			->willReturn($userRoot);

		$actual = $this->lockManager->isLocked(42, 'wrong-token456');
		$this->assertFalse($actual);
	}

	public function testIsLockedNodeDifferentToken(): void {
		$user = $this->createMock(IUser::class);
		$user->method('getUID')
			->willReturn('jane');

		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn($user);

		$node = $this->createMock(Node::class);
		$node->expects($this->once())
			->method('getPath')
			->willReturn('/sub/folder/abc');
		$node->expects($this->once())
			->method('getId')
			->willReturn(1337);

		$userRoot = $this->createMock(Folder::class);
		$userRoot->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([$node]);

		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('jane')
			->willReturn($userRoot);

		$lock = new Lock();
		$lock->setToken('correct-token123');

		$this->lockMapper->expects($this->once())
			->method('getByFileId')
			->with(1337)
			->willReturn($lock);

		$actual = $this->lockManager->isLocked(42, 'wrong-token456');
		$this->assertTrue($actual);
	}

	public function testIsLockedNodeCorrectToken(): void {
		$user = $this->createMock(IUser::class);
		$user->method('getUID')
			->willReturn('jane');

		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn($user);

		$parentNode = $this->createMock(Node::class);
		$parentNode->expects($this->once())
			->method('getPath')
			->willReturn('/');

		$node = $this->createMock(Node::class);
		$node->expects($this->once())
			->method('getPath')
			->willReturn('/sub/folder/abc');
		$node->expects($this->once())
			->method('getId')
			->willReturn(1337);
		$node->expects($this->once())
			->method('getParent')
			->willReturn($parentNode);

		$userRoot = $this->createMock(Folder::class);
		$userRoot->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([$node]);

		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('jane')
			->willReturn($userRoot);

		$lock = new Lock();
		$lock->setToken('correct-token123');

		$this->lockMapper->expects($this->once())
			->method('getByFileId')
			->with(1337)
			->willReturn($lock);

		$actual = $this->lockManager->isLocked(42, 'correct-token123');
		$this->assertFalse($actual);
	}

	public function testIsLockedParent(): void {
		$user = $this->createMock(IUser::class);
		$user->method('getUID')
			->willReturn('jane');

		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn($user);

		$parentNode = $this->createMock(Node::class);
		$parentNode->expects($this->once())
			->method('getPath')
			->willReturn('/sub/folder');
		$parentNode->expects($this->once())
			->method('getId')
			->willReturn(7331);

		$node = $this->createMock(Node::class);
		$node->expects($this->once())
			->method('getPath')
			->willReturn('/sub/folder/abc');
		$node->expects($this->once())
			->method('getId')
			->willReturn(1337);
		$node->expects($this->once())
			->method('getParent')
			->willReturn($parentNode);

		$userRoot = $this->createMock(Folder::class);
		$userRoot->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([$node]);

		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('jane')
			->willReturn($userRoot);

		$lock = new Lock();
		$lock->setToken('correct-token123');

		$this->lockMapper->expects($this->exactly(2))
			->method('getByFileId')
			->withConsecutive([1337], [7331])
			->willReturnOnConsecutiveCalls(
				$this->throwException(new DoesNotExistException('')),
				$lock
			);

		$actual = $this->lockManager->isLocked(42, 'wrong-token456');
		$this->assertTrue($actual);
	}
}
