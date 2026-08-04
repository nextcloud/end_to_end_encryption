<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Controller;

use OC\User\NoUserException;
use OCA\EndToEndEncryption\AccessManager;
use OCA\EndToEndEncryption\Controller\LockingController;
use OCA\EndToEndEncryption\Exceptions\FileLockedException;
use OCA\EndToEndEncryption\Exceptions\FileNotLockedException;
use OCA\EndToEndEncryption\FileService;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\LockManager;
use OCP\AppFramework\Http\DataResponse;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IL10N;
use OCP\IRequest;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class LockingControllerTest extends TestCase {

	/** @var string */
	private $appName;

	/** @var IRequest|\PHPUnit\Framework\MockObject\MockObject */
	private $request;

	/** @var IMetaDataStorage|\PHPUnit\Framework\MockObject\MockObject */
	private $metaDataStorage;

	/** @var LockManager|\PHPUnit\Framework\MockObject\MockObject */
	private $lockManager;

	/** @var IRootFolder|\PHPUnit\Framework\MockObject\MockObject */
	private $rootFolder;

	/** @var FileService|\PHPUnit\Framework\MockObject\MockObject */
	private $fileService;

	/** @var LoggerInterface|\PHPUnit\Framework\MockObject\MockObject */
	private $logger;

	/** @var IL10N|\PHPUnit\Framework\MockObject\MockObject */
	private $l10n;

	/** @var AccessManager|\PHPUnit\Framework\MockObject\MockObject */
	private $accessManager;

	/** @var LockingController */
	private $controller;

	protected function setUp(): void {
		parent::setUp();

		$this->appName = 'end_to_end_encryption';
		$this->request = $this->createMock(IRequest::class);
		$this->metaDataStorage = $this->createMock(IMetaDataStorage::class);
		$this->lockManager = $this->createMock(LockManager::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->fileService = $this->createMock(FileService::class);
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->l10n = $this->createMock(IL10N::class);
		$this->accessManager = $this->createMock(AccessManager::class);
		// without a share token the owner is the logged in user, otherwise the share owner
		$this->accessManager->method('getOwnerId')
			->willReturnCallback(static fn (int $id, ?string $shareToken = null): string => $shareToken === null ? 'john.doe' : 'jane.doe');

		$this->controller = new LockingController(
			$this->appName,
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
	 * Create a folder node as returned by the user folder
	 *
	 * @param bool $encrypted Whether the folder is end-to-end encrypted
	 * @return Folder|MockObject
	 */
	private function createFolderNode(bool $encrypted) {
		$node = $this->createMock(Folder::class);
		$node->method('isEncrypted')
			->willReturn($encrypted);

		if (!$encrypted) {
			// EncryptionManager::isEncryptedFile traverses up to the root
			$root = $this->createMock(Folder::class);
			$root->method('getPath')
				->willReturn('/');
			$node->method('getParent')
				->willReturn($root);
		}

		return $node;
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
		$node = $this->createFolderNode(true);
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
		$node = $this->createFolderNode(true);
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

		$response = $this->controller->lockFolder($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertSame(423, $response->getStatus());
		$this->assertSame(['message' => 'File already locked'], $response->getData());
	}

	/**
	 * Only end-to-end encrypted folders can be locked
	 */
	public function testLockFolderNotEncrypted(): void {
		$fileId = 42;

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->request->expects($this->once())
			->method('getParam')
			->with('e2e-token', '')
			->willReturn('e2eToken');
		$this->request->expects($this->once())
			->method('getHeader')
			->with('x-nc-e2ee-counter')
			->willReturn('1');

		$userFolder = $this->createMock(Folder::class);
		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('john.doe')
			->willReturn($userFolder);
		$userFolder->expects($this->once())
			->method('getFirstNodeById')
			->with($fileId)
			->willReturn($this->createFolderNode(false));

		$this->lockManager->expects($this->never())
			->method('lockFile');

		$response = $this->controller->lockFolder($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertSame(403, $response->getStatus());
		$this->assertSame(['message' => 'You are not allowed to create the lock'], $response->getData());
	}

	/**
	 * Only end-to-end encrypted folders can be unlocked
	 */
	public function testUnlockFolderNotEncrypted(): void {
		$fileId = 42;

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->request->expects($this->once())
			->method('getHeader')
			->with('e2e-token')
			->willReturn('e2e-token');

		$userFolder = $this->createMock(Folder::class);
		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('john.doe')
			->willReturn($userFolder);
		$userFolder->expects($this->once())
			->method('getFirstNodeById')
			->with($fileId)
			->willReturn($this->createFolderNode(false));

		$this->lockManager->expects($this->never())
			->method('isLocked');
		$this->lockManager->expects($this->never())
			->method('unlockFile');
		$this->metaDataStorage->expects($this->never())
			->method('getTouchedFolders');

		$response = $this->controller->unlockFolder($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertSame(403, $response->getStatus());
		$this->assertSame(['message' => 'You are not allowed to remove the lock'], $response->getData());
	}

	/**
	 * The folder must not be touched if it is not locked by the provided token,
	 * `LockManager::isLocked` returns true in that case (or throws).
	 *
	 * @param bool|\Exception $lockState
	 *
	 * @dataProvider unlockFolderLockStateDataProvider
	 */
	public function testUnlockFolderWithInvalidLockState($lockState): void {
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

		$userFolder = $this->createMock(Folder::class);
		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('john.doe')
			->willReturn($userFolder);
		$userFolder->expects($this->once())
			->method('getFirstNodeById')
			->with($fileId)
			->willReturn($this->createFolderNode(true));

		$isLocked = $this->lockManager->expects($this->once())
			->method('isLocked')
			->with($fileId, $sendE2E, 'john.doe', true);
		if ($lockState instanceof \Exception) {
			$isLocked->willThrowException($lockState);
		} else {
			$isLocked->willReturn($lockState);
		}

		$this->metaDataStorage->expects($this->never())
			->method('getTouchedFolders');
		$this->fileService->expects($this->never())
			->method('finalizeChanges');
		$this->fileService->expects($this->never())
			->method('revertChanges');
		$this->lockManager->expects($this->never())
			->method('unlockFile');

		$response = $this->controller->unlockFolder($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertSame(403, $response->getStatus());
		$this->assertSame(['message' => 'You are not allowed to remove the lock'], $response->getData());
	}

	public function unlockFolderLockStateDataProvider(): array {
		return [
			'locked by another token or not locked at all' => [true],
			'lock state could not be checked' => [new NotFoundException()],
		];
	}

	/**
	 * @param bool $getUserFolderThrows
	 * @param bool $userFolderReturnsNodes
	 * @param bool $abort
	 * @param \Exception|null $unlockException
	 * @param string|null $expectedExceptionClass
	 * @param string|null $expectedExceptionMessage
	 * @param array|null $expectedResponseData
	 * @param int|null $expectedResponseStatus
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
		?array $expectedResponseData,
		?int $expectedResponseStatus,
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
				$node = $this->createFolderNode(true);
				// resolved once for the lock itself and once while handling the touched folder
				$userFolder->expects($this->exactly(2))
					->method('getFirstNodeById')
					->with($fileId)
					->willReturn($node);

				$this->lockManager->expects($this->once())
					->method('isLocked')
					->with($fileId, $sendE2E, 'john.doe', true)
					->willReturn(false);

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
		} elseif ($expectedResponseData !== null) {
			$response = $this->controller->unlockFolder($fileId, null, $abort ? 'true' : '');
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertSame($expectedResponseStatus, $response->getStatus());
			$this->assertSame($expectedResponseData, $response->getData());
		} else {
			$response = $this->controller->unlockFolder($fileId, null, $abort ? 'true' : '');
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals([], $response->getData());
		}
	}

	/**
	 * Locking is denied if the user has no write access, e.g. on a read-only share.
	 */
	public function testLockFolderWithoutPermission(): void {
		$fileId = 42;

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->request->expects($this->once())
			->method('getParam')
			->with('e2e-token', '')
			->willReturn('e2eToken');
		$this->request->expects($this->once())
			->method('getHeader')
			->with('x-nc-e2ee-counter')
			->willReturn('1');

		$userFolder = $this->createMock(Folder::class);
		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('john.doe')
			->willReturn($userFolder);
		$userFolder->expects($this->once())
			->method('getFirstNodeById')
			->with($fileId)
			->willReturn($this->createFolderNode(true));

		$this->accessManager->expects($this->once())
			->method('checkPermissions')
			->with($fileId, true, null)
			->willThrowException(new \InvalidArgumentException('Insufficient permissions on share'));

		$this->lockManager->expects($this->never())
			->method('lockFile');

		$response = $this->controller->lockFolder($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertSame(403, $response->getStatus());
		$this->assertSame(['message' => 'You are not allowed to create the lock'], $response->getData());
	}

	/**
	 * A share token is resolved by the access manager and the permissions
	 * are checked on the share it belongs to.
	 */
	public function testLockFolderWithShareToken(): void {
		$fileId = 42;
		$sendE2E = 'e2eToken';

		$this->request->expects($this->once())
			->method('getParam')
			->with('e2e-token', '')
			->willReturn($sendE2E);
		$this->request->expects($this->once())
			->method('getHeader')
			->with('x-nc-e2ee-counter')
			->willReturn('1');

		$userFolder = $this->createMock(Folder::class);
		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('jane.doe')
			->willReturn($userFolder);
		$userFolder->expects($this->once())
			->method('getFirstNodeById')
			->with($fileId)
			->willReturn($this->createFolderNode(true));

		$this->accessManager->expects($this->once())
			->method('checkPermissions')
			->with($fileId, true, 'shareToken');

		$this->lockManager->expects($this->once())
			->method('lockFile')
			->with($fileId, $sendE2E, 1, 'jane.doe')
			->willReturn('new-token');

		$response = $this->controller->lockFolder($fileId, 'shareToken');
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertSame(['e2e-token' => 'new-token'], $response->getData());
	}

	public function unlockFolderDataProvider(): array {
		return [
			[false, true, false, null, null, null, null, null],
			[false, true, true, null, null, null, null, null],
			[true, false, false, null, null, null, ['message' => 'You are not allowed to remove the lock'], 403],
			[false, false, false, null, null, null, ['message' => 'You are not allowed to remove the lock'], 403],
			[false, true, false, new FileLockedException(), null, null, ['message' => 'You are not allowed to remove the lock'], 403],
			[false, true, false, new FileNotLockedException(), null, null, ['message' => 'File not locked'], 404]
		];
	}
}
