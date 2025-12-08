<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Controller;

use OC\User\NoUserException;
use OCA\EndToEndEncryption\Controller\LockingController;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\FileService;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\LockManager;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IL10N;
use OCP\IRequest;
use OCP\Share\IManager as ShareManager;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class LockingControllerTest extends TestCase {

	private string $appName;
	private string $userId;
	private IRequest&MockObject $request;
	private IMetaDataStorage&MockObject $metaDataStorage;
	private LockManager&MockObject $lockManager;
	private IRootFolder&MockObject $rootFolder;
	private FileService&MockObject $fileService;
	private LoggerInterface&MockObject $logger;
	private IL10N&MockObject $l10n;
	private ShareManager&MockObject $shareManager;
	private LockingController $controller;

	protected function setUp(): void {
		parent::setUp();

		$this->appName = 'end_to_end_encryption';
		$this->request = $this->createMock(IRequest::class);
		$this->userId = 'john.doe';
		$this->metaDataStorage = $this->createMock(IMetaDataStorage::class);
		$this->lockManager = $this->createMock(LockManager::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->fileService = $this->createMock(FileService::class);
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->l10n = $this->createMock(IL10N::class);
		$this->shareManager = $this->createMock(ShareManager::class);

		$this->controller = new LockingController(
			$this->appName,
			$this->request,
			$this->userId,
			$this->metaDataStorage,
			$this->lockManager,
			$this->rootFolder,
			$this->fileService,
			$this->logger,
			$this->l10n,
			$this->shareManager
		);
	}

	public function testLockFolder(): void {
		$fileId = 42;
		$sendE2E = 'e2eToken';

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->request->expects($this->once())
			->method('getParam')
			->with('e2e-token', '')
			->willReturn($sendE2E);

		$userFolder = $this->createMock(Folder::class);
		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('john.doe')
			->willReturn($userFolder);
		$node = $this->createMock(Folder::class);
		$userFolder->expects($this->once())
			->method('getFirstNodeById')
			->with($fileId)
			->willReturn($node);

		$this->lockManager->expects($this->once())
			->method('lockFile')
			->with($fileId, $sendE2E)
			->willReturn('new-token');
		$this->request->expects($this->once())
			->method('getHeader')
			->with('x-nc-e2ee-counter')
			->willReturn('1');

		$response = $this->controller->lockFolder($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([
			'e2e-token' => 'new-token',
		], $response->getData());
	}

	public function testLockFolderException(): void {
		$fileId = 42;
		$sendE2E = 'e2eToken';
		$this->request->expects($this->once())
			->method('getParam')
			->with('e2e-token', '')
			->willReturn($sendE2E);

		$userFolder = $this->createMock(Folder::class);
		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('john.doe')
			->willReturn($userFolder);
		$node = $this->createMock(Folder::class);
		$userFolder->expects($this->once())
			->method('getFirstNodeById')
			->with($fileId)
			->willReturn($node);

		$this->lockManager->expects($this->once())
			->method('lockFile')
			->with($fileId, $sendE2E)
			->willReturn(null);

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});
		$this->request->expects($this->once())
			->method('getHeader')
			->with('x-nc-e2ee-counter')
			->willReturn('1');

		$this->expectException(OCSForbiddenException::class);
		$this->expectExceptionMessage('File already locked');

		$this->controller->lockFolder($fileId);
	}

	/**
	 * @param bool $getUserFolderThrows
	 * @param bool $userFolderReturnsNodes
	 * @param bool $abort
	 * @param \Exception|null $unlockException
	 * @param string|null $expectedExceptionClass
	 * @param string|null $expectedExceptionMessage
	 *
	 * @dataProvider unlockFolderDataProvider
	 */
	public function testUnlockFolder(
		bool $getUserFolderThrows,
		bool $userFolderReturnsNodes,
		bool $abort,
		?\Exception $unlockException,
		?string $expectedExceptionClass,
		?string $expectedExceptionMessage,
	): void {
		$fileId = 42;
		$sendE2E = 'e2e-token';

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->request->expects($this->once())
			->method('getHeader')
			->with('e2e-token')
			->willReturn($sendE2E);

		if ($getUserFolderThrows) {
			$this->rootFolder->expects($this->once())
				->method('getUserFolder')
				->with('john.doe')
				->willThrowException(new NoUserException());
		} else {
			$userFolder = $this->createMock(Folder::class);
			$this->rootFolder->expects($this->once())
				->method('getUserFolder')
				->with('john.doe')
				->willReturn($userFolder);

			if (!$userFolderReturnsNodes) {
				$userFolder->expects($this->once())
					->method('getFirstNodeById')
					->with($fileId)
					->willReturn(null);
			} else {
				$node = $this->createMock(Folder::class);
				$node->method('getId')
					->willReturn($fileId);
				$node->method('getPath')
					->willReturn('/some/path');
				$userFolder->expects($this->exactly(2))
					->method('getFirstNodeById')
					->with($fileId)
					->willReturn($node);

				$this->metaDataStorage->expects($this->once())
					->method('getTouchedFolders')
					->with('e2e-token')
					->willReturn([$fileId]);

				if ($abort) {
					$this->fileService->expects($this->once())
						->method('revertChanges')
						->with($node);
					$this->metaDataStorage->expects($this->once())
						->method('deleteIntermediateFile')
						->with('john.doe', $fileId);
				} else {
					$this->fileService->expects($this->once())
						->method('finalizeChanges')
						->with($node);
					$this->metaDataStorage->expects($this->once())
						->method('saveIntermediateFile')
						->with('john.doe', $fileId);
				}

				if ($unlockException) {
					$this->lockManager->expects($this->once())
						->method('unlockFile')
						->with($fileId, $sendE2E)
						->willThrowException($unlockException);
				} else {
					$this->lockManager->expects($this->once())
						->method('unlockFile')
						->with($fileId, $sendE2E);
				}
			}
		}

		if ($expectedExceptionClass) {
			$this->expectException($expectedExceptionClass);
			$this->expectExceptionMessage($expectedExceptionMessage);

			$this->controller->unlockFolder($fileId, null, $abort ? 'true' : '');
		} else {
			$response = $this->controller->unlockFolder($fileId, null, $abort ? 'true' : '');
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals([], $response->getData());
		}
	}

	public static function unlockFolderDataProvider(): array {
		return [
			[false, true, false, null, null, null],
			[false, true, true, null, null, null],
			[true, false, false, null, OCSForbiddenException::class, 'You are not allowed to remove the lock'],
			[false, false, false, null, OCSForbiddenException::class, 'You are not allowed to remove the lock'],
			[false, true, false, new FileLockedException(), OCSForbiddenException::class, 'You are not allowed to remove the lock'],
			[false, true, false, new FileNotLockedException(), OCSNotFoundException::class, 'File not locked']
		];
	}
}
