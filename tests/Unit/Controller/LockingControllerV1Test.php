<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Controller;

use OCA\EndToEndEncryption\AccessManager;
use OCA\EndToEndEncryption\Controller\V1\LockingController;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\FileService;
use OCA\EndToEndEncryption\IMetaDataStorageV1;
use OCA\EndToEndEncryption\LockManagerV1;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IL10N;
use OCP\IRequest;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\MockObject\Stub;
use Psr\Log\LoggerInterface;
use Test\TestCase;

#[AllowMockObjectsWithoutExpectations]
class LockingControllerV1Test extends TestCase {
	private const FILE_ID = 42;
	private const OWNER_ID = 'john.doe';

	private IRequest&MockObject $request;
	private IMetaDataStorageV1&MockObject $metaDataStorage;
	private LockManagerV1&MockObject $lockManager;
	private IRootFolder&MockObject $rootFolder;
	private FileService&MockObject $fileService;
	private LoggerInterface&Stub $logger;
	private IL10N&Stub $l10n;
	private AccessManager&MockObject $accessManager;
	private LockingController $controller;

	protected function setUp(): void {
		parent::setUp();

		$this->request = $this->createMock(IRequest::class);
		$this->metaDataStorage = $this->createMock(IMetaDataStorageV1::class);
		$this->lockManager = $this->createMock(LockManagerV1::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->fileService = $this->createMock(FileService::class);
		$this->logger = $this->createStub(LoggerInterface::class);
		$this->l10n = $this->createStub(IL10N::class);
		$this->l10n->method('t')
			->willReturnCallback(static fn ($string, $args): string => vsprintf($string, $args));
		$this->accessManager = $this->createMock(AccessManager::class);
		$this->accessManager->method('getOwnerId')
			->willReturn(self::OWNER_ID);

		$this->controller = new LockingController(
			'end_to_end_encryption',
			$this->request,
			$this->metaDataStorage,
			$this->lockManager,
			$this->rootFolder,
			$this->fileService,
			$this->logger,
			$this->l10n,
			$this->accessManager,
		);
	}

	/**
	 * Mock the user folder of the owner, resolving the file id to the given node.
	 *
	 * @param int $userFolderId The file id of the user folder itself
	 */
	private function mockUserFolder(?Folder $node, int $userFolderId = 1): Folder&Stub {
		$userFolder = $this->createStub(Folder::class);
		$userFolder->method('getId')
			->willReturn($userFolderId);
		$userFolder->method('getFirstNodeById')
			->willReturnMap([[self::FILE_ID, $node]]);

		$this->rootFolder->method('getUserFolder')
			->with(self::OWNER_ID)
			->willReturn($userFolder);

		return $userFolder;
	}

	private function denyWriteAccess(): void {
		$this->accessManager->method('checkPermissions')
			->with(self::FILE_ID, true)
			->willThrowException(new \InvalidArgumentException('Insufficient permissions on share'));
	}

	public function testLockFolder(): void {
		$this->request->method('getParam')
			->with('e2e-token', '')
			->willReturn('sendE2EToken');
		$this->mockUserFolder($this->createStub(Folder::class));

		$this->lockManager->expects($this->once())
			->method('lockFile')
			->with(self::FILE_ID, 'sendE2EToken', self::OWNER_ID)
			->willReturn('new-token');

		$response = $this->controller->lockFolder(self::FILE_ID);
		$this->assertEquals(['e2e-token' => 'new-token'], $response->getData());
	}

	public function testLockFolderAlreadyLocked(): void {
		$this->request->method('getParam')
			->with('e2e-token', '')
			->willReturn('sendE2EToken');
		$this->mockUserFolder($this->createStub(Folder::class));

		$this->lockManager->expects($this->once())
			->method('lockFile')
			->willReturn(null);

		$this->expectException(OCSForbiddenException::class);
		$this->expectExceptionMessage('File already locked');
		$this->controller->lockFolder(self::FILE_ID);
	}

	public function testLockFolderRoot(): void {
		$this->request->method('getParam')
			->with('e2e-token', '')
			->willReturn('sendE2EToken');
		$this->mockUserFolder($this->createStub(Folder::class), self::FILE_ID);

		$this->lockManager->expects($this->never())
			->method('lockFile');

		$this->expectException(OCSForbiddenException::class);
		$this->expectExceptionMessage('You are not allowed to lock the root');
		$this->controller->lockFolder(self::FILE_ID);
	}

	/**
	 * Read access is not sufficient to acquire the lock of a folder.
	 */
	public function testLockFolderWithoutWritePermission(): void {
		$this->denyWriteAccess();

		$this->lockManager->expects($this->never())
			->method('lockFile');
		$this->metaDataStorage->expects($this->never())
			->method('assertMetadataIsV1');

		$this->expectException(OCSForbiddenException::class);
		$this->expectExceptionMessage('You are not allowed to create the lock');
		$this->controller->lockFolder(self::FILE_ID);
	}

	public function testUnlockFolder(): void {
		$this->request->method('getHeader')
			->with('e2e-token')
			->willReturn('sendE2EToken');
		$node = $this->createStub(Folder::class);
		$this->mockUserFolder($node);

		$this->lockManager->expects($this->once())
			->method('assertLockedByToken')
			->with(self::FILE_ID, 'sendE2EToken');
		$this->fileService->expects($this->once())
			->method('finalizeChanges')
			->with($node);
		$this->metaDataStorage->expects($this->once())
			->method('saveIntermediateFile')
			->with(self::OWNER_ID, self::FILE_ID);
		$this->lockManager->expects($this->once())
			->method('unlockFile')
			->with(self::FILE_ID, 'sendE2EToken');

		$response = $this->controller->unlockFolder(self::FILE_ID);
		$this->assertEquals([], $response->getData());
	}

	/**
	 * No changes may be applied before the lock was verified,
	 * as they can not be rolled back afterwards.
	 */
	#[DataProvider('invalidLockDataProvider')]
	public function testUnlockFolderWithInvalidLock(\Exception $lockException, string $expectedException, string $expectedMessage): void {
		$this->request->method('getHeader')
			->with('e2e-token')
			->willReturn('sendE2EToken');
		$this->mockUserFolder($this->createStub(Folder::class));

		$this->lockManager->expects($this->once())
			->method('assertLockedByToken')
			->with(self::FILE_ID, 'sendE2EToken')
			->willThrowException($lockException);

		$this->fileService->expects($this->never())
			->method('finalizeChanges');
		$this->metaDataStorage->expects($this->never())
			->method('saveIntermediateFile');
		$this->lockManager->expects($this->never())
			->method('unlockFile');

		$this->expectException($expectedException);
		$this->expectExceptionMessage($expectedMessage);
		$this->controller->unlockFolder(self::FILE_ID);
	}

	public static function invalidLockDataProvider(): array {
		return [
			'locked with another token' => [new FileLockedException(), OCSForbiddenException::class, 'You are not allowed to remove the lock'],
			'not locked at all' => [new FileNotLockedException(), OCSNotFoundException::class, 'File not locked'],
		];
	}

	/**
	 * Read access is not sufficient to release the lock of a folder.
	 */
	public function testUnlockFolderWithoutWritePermission(): void {
		$this->denyWriteAccess();

		$this->fileService->expects($this->never())
			->method('finalizeChanges');
		$this->metaDataStorage->expects($this->never())
			->method('saveIntermediateFile');
		$this->lockManager->expects($this->never())
			->method('unlockFile');

		$this->expectException(OCSForbiddenException::class);
		$this->expectExceptionMessage('You are not allowed to remove the lock');
		$this->controller->unlockFolder(self::FILE_ID);
	}
}
