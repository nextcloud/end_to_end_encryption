<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\AccessManager;
use OCP\Constants;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\Storage\ISharedStorage;
use OCP\Files\Storage\IStorage;
use OCP\IUser;
use OCP\Share\Exceptions\ShareNotFound;
use OCP\Share\IManager;
use OCP\Share\IShare;
use PHPUnit\Framework\MockObject\Stub;
use Test\TestCase;

class AccessManagerTest extends TestCase {
	private const FILE_ID = 42;
	private const SHARE_TOKEN = 'token123';

	private IRootFolder&Stub $rootFolder;
	private IManager&Stub $shareManager;

	protected function setUp(): void {
		parent::setUp();

		$this->rootFolder = $this->createStub(IRootFolder::class);
		$this->shareManager = $this->createStub(IManager::class);
	}

	private function getAccessManager(?string $userId): AccessManager {
		return new AccessManager(
			$userId,
			$this->rootFolder,
			$this->shareManager,
		);
	}

	/**
	 * Mock the user folders, every user folder resolves `self::FILE_ID` to the given node
	 *
	 * @param array<string, ?Node> $nodeByUser
	 */
	private function mockUserFolders(array $nodeByUser): void {
		$folders = [];
		foreach ($nodeByUser as $userId => $node) {
			$folder = $this->createStub(Folder::class);
			$folder->method('getFirstNodeById')
				->willReturnMap([[self::FILE_ID, $node]]);
			$folders[] = [$userId, $folder];
		}
		$this->rootFolder->method('getUserFolder')
			->willReturnMap($folders);
	}

	private function mockNode(IStorage $storage, ?string $ownerId = null): File&Stub {
		$node = $this->createStub(File::class);
		$node->method('getStorage')->willReturn($storage);
		if ($ownerId !== null) {
			$owner = $this->createStub(IUser::class);
			$owner->method('getUID')->willReturn($ownerId);
			$node->method('getOwner')->willReturn($owner);
		}
		return $node;
	}

	/**
	 * Mock the storage of an incoming share
	 */
	private function mockSharedStorage(IShare $share): ISharedStorage&Stub {
		$storage = $this->createStub(ISharedStorage::class);
		$storage->method('instanceOfStorage')
			->willReturnCallback(static fn (string $class): bool => $class === ISharedStorage::class);
		$storage->method('getShare')->willReturn($share);
		return $storage;
	}

	private function mockLocalStorage(): IStorage&Stub {
		$storage = $this->createStub(IStorage::class);
		$storage->method('instanceOfStorage')->willReturn(false);
		return $storage;
	}

	private function mockShare(?Node $node = null, ?string $owner = null, ?int $permissions = null): IShare&Stub {
		$share = $this->createStub(IShare::class);
		if ($node !== null) {
			$share->method('getNode')->willReturn($node);
		}
		if ($owner !== null) {
			$share->method('getShareOwner')->willReturn($owner);
		}
		if ($permissions !== null) {
			$share->method('getPermissions')->willReturn($permissions);
		}
		return $share;
	}

	public function testGetOwnerIdWithoutUser(): void {
		$accessManager = $this->getAccessManager(null);

		$this->expectException(\InvalidArgumentException::class);
		$this->expectExceptionMessage('No user logged in');
		$accessManager->getOwnerId(self::FILE_ID);
	}

	public function testGetOwnerIdOwnFile(): void {
		$this->mockUserFolders(['alice' => $this->mockNode($this->mockLocalStorage())]);

		$accessManager = $this->getAccessManager('alice');
		$this->assertSame('alice', $accessManager->getOwnerId(self::FILE_ID));
	}

	public function testGetOwnerIdFileNotFound(): void {
		$this->mockUserFolders(['alice' => null]);

		$accessManager = $this->getAccessManager('alice');

		$this->expectException(\InvalidArgumentException::class);
		$this->expectExceptionMessage('File not found');
		$accessManager->getOwnerId(self::FILE_ID);
	}

	/**
	 * For an incoming share the share owner is returned, not the current user.
	 */
	public function testGetOwnerIdIncomingShare(): void {
		$storage = $this->mockSharedStorage($this->mockShare());
		$this->mockUserFolders(['alice' => $this->mockNode($storage, 'bob')]);

		$accessManager = $this->getAccessManager('alice');
		$this->assertSame('bob', $accessManager->getOwnerId(self::FILE_ID));
	}

	public function testGetOwnerIdShareTokenOnSharedNode(): void {
		$node = $this->createStub(File::class);
		$node->method('getId')->willReturn(self::FILE_ID);
		$this->shareManager->method('getShareByToken')
			->willReturnMap([[self::SHARE_TOKEN, $this->mockShare($node, 'bob')]]);

		$accessManager = $this->getAccessManager(null);
		$this->assertSame('bob', $accessManager->getOwnerId(self::FILE_ID, self::SHARE_TOKEN));
	}

	public function testGetOwnerIdShareTokenOnChildOfSharedFolder(): void {
		$folder = $this->createStub(Folder::class);
		$folder->method('getId')->willReturn(1);
		$folder->method('getFirstNodeById')
			->willReturnMap([[self::FILE_ID, $this->createStub(File::class)]]);
		$this->shareManager->method('getShareByToken')
			->willReturn($this->mockShare($folder, 'bob'));

		$accessManager = $this->getAccessManager(null);
		$this->assertSame('bob', $accessManager->getOwnerId(self::FILE_ID, self::SHARE_TOKEN));
	}

	public function testGetOwnerIdShareTokenOnForeignFile(): void {
		$folder = $this->createStub(Folder::class);
		$folder->method('getId')->willReturn(1);
		$folder->method('getFirstNodeById')->willReturn(null);
		$this->shareManager->method('getShareByToken')
			->willReturn($this->mockShare($folder, 'bob'));

		$accessManager = $this->getAccessManager(null);

		$this->expectException(\InvalidArgumentException::class);
		$this->expectExceptionMessage('File ID does not belong to the share');
		$accessManager->getOwnerId(self::FILE_ID, self::SHARE_TOKEN);
	}

	/**
	 * A file share can never contain another file id.
	 */
	public function testGetOwnerIdShareTokenOnFileShareWithOtherFileId(): void {
		$node = $this->createStub(File::class);
		$node->method('getId')->willReturn(1);
		$this->shareManager->method('getShareByToken')
			->willReturn($this->mockShare($node, 'bob'));

		$accessManager = $this->getAccessManager(null);

		$this->expectException(\InvalidArgumentException::class);
		$this->expectExceptionMessage('File ID does not belong to the share');
		$accessManager->getOwnerId(self::FILE_ID, self::SHARE_TOKEN);
	}

	public function testGetOwnerIdInvalidShareToken(): void {
		$this->shareManager->method('getShareByToken')
			->willThrowException(new ShareNotFound());

		$accessManager = $this->getAccessManager(null);

		$this->expectException(ShareNotFound::class);
		$accessManager->getOwnerId(self::FILE_ID, self::SHARE_TOKEN);
	}

	/**
	 * The share of a share token is only resolved once.
	 */
	public function testGetOwnerIdCachesShareOfToken(): void {
		$node = $this->createStub(File::class);
		$node->method('getId')->willReturn(self::FILE_ID);

		$shareManager = $this->createMock(IManager::class);
		$shareManager->expects($this->once())
			->method('getShareByToken')
			->with(self::SHARE_TOKEN)
			->willReturn($this->mockShare($node, 'bob'));
		$this->shareManager = $shareManager;

		$accessManager = $this->getAccessManager(null);
		$this->assertSame('bob', $accessManager->getOwnerId(self::FILE_ID, self::SHARE_TOKEN));
		$this->assertSame('bob', $accessManager->getOwnerId(self::FILE_ID, self::SHARE_TOKEN));
	}

	public function testCheckPermissionsOwnFile(): void {
		$this->mockUserFolders(['alice' => $this->mockNode($this->mockLocalStorage())]);

		$accessManager = $this->getAccessManager('alice');
		$accessManager->checkPermissions(self::FILE_ID);
		$this->addToAssertionCount(1);
	}

	public function testCheckPermissionsFileNotFound(): void {
		$this->mockUserFolders(['alice' => null]);

		$accessManager = $this->getAccessManager('alice');

		$this->expectException(\InvalidArgumentException::class);
		$this->expectExceptionMessage('File not found');
		$accessManager->checkPermissions(self::FILE_ID);
	}

	/**
	 * The permissions of an incoming share are enforced.
	 */
	public function testCheckPermissionsIncomingReadOnlyShare(): void {
		$storage = $this->mockSharedStorage($this->mockShare(permissions: Constants::PERMISSION_READ));
		$node = $this->mockNode($storage, 'bob');
		$this->mockUserFolders(['alice' => $node, 'bob' => $node]);

		$accessManager = $this->getAccessManager('alice');

		// reading is allowed
		$accessManager->checkPermissions(self::FILE_ID, false);

		$this->expectException(\InvalidArgumentException::class);
		$this->expectExceptionMessage('Insufficient permissions on share');
		$accessManager->checkPermissions(self::FILE_ID);
	}

	public function testCheckPermissionsIncomingWritableShare(): void {
		$permissions = Constants::PERMISSION_READ | Constants::PERMISSION_UPDATE;
		$storage = $this->mockSharedStorage($this->mockShare(permissions: $permissions));
		$node = $this->mockNode($storage, 'bob');
		$this->mockUserFolders(['alice' => $node, 'bob' => $node]);

		$accessManager = $this->getAccessManager('alice');
		$accessManager->checkPermissions(self::FILE_ID);
		$this->addToAssertionCount(1);
	}

	/**
	 * For an incoming share the file is looked up in the folder of the share owner.
	 */
	public function testCheckPermissionsIncomingShareFileNotFoundForOwner(): void {
		$storage = $this->mockSharedStorage($this->mockShare(permissions: Constants::PERMISSION_ALL));
		$this->mockUserFolders([
			'alice' => $this->mockNode($storage, 'bob'),
			'bob' => null,
		]);

		$accessManager = $this->getAccessManager('alice');

		$this->expectException(\InvalidArgumentException::class);
		$this->expectExceptionMessage('File not found');
		$accessManager->checkPermissions(self::FILE_ID);
	}

	public function testCheckPermissionsShareTokenReadOnly(): void {
		$node = $this->createStub(File::class);
		$node->method('getId')->willReturn(self::FILE_ID);
		$this->shareManager->method('getShareByToken')
			->willReturn($this->mockShare($node, 'bob', Constants::PERMISSION_READ));
		$this->mockUserFolders(['bob' => $node]);

		$accessManager = $this->getAccessManager(null);

		// reading is allowed
		$accessManager->checkPermissions(self::FILE_ID, false, self::SHARE_TOKEN);

		$this->expectException(\InvalidArgumentException::class);
		$this->expectExceptionMessage('Insufficient permissions on share');
		$accessManager->checkPermissions(self::FILE_ID, true, self::SHARE_TOKEN);
	}

	public function testCheckPermissionsShareTokenWritable(): void {
		$node = $this->createStub(File::class);
		$node->method('getId')->willReturn(self::FILE_ID);
		$this->shareManager->method('getShareByToken')
			->willReturn($this->mockShare($node, 'bob', Constants::PERMISSION_ALL));
		$this->mockUserFolders(['bob' => $node]);

		$accessManager = $this->getAccessManager(null);
		$accessManager->checkPermissions(self::FILE_ID, true, self::SHARE_TOKEN);
		$this->addToAssertionCount(1);
	}
}
