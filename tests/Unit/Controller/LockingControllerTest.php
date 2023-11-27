<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
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
use Psr\Log\LoggerInterface;
use Test\TestCase;

class LockingControllerTest extends TestCase {


	/** @var string */
	private $appName;

	/** @var IRequest|\PHPUnit\Framework\MockObject\MockObject */
	private $request;

	/** @var string */
	private $userId;

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

	/** @var ShareManager|\PHPUnit\Framework\MockObject\MockObject */
	private $shareManager;

	/** @var LockingController */
	private $controller;

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
		$sendE2E = '';

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->request->expects($this->once())
			->method('getParam')
			->with('e2e-token', '')
			->willReturn('');

		$userFolder = $this->createMock(Folder::class);
		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('john.doe')
			->willReturn($userFolder);
		$node = $this->createMock(Folder::class);
		$userFolder->expects($this->once())
			->method('getById')
			->with($fileId)
			->willReturn([$node]);

		$this->lockManager->expects($this->once())
			->method('lockFile')
			->with($fileId, $sendE2E)
			->willReturn('new-token');

		$response = $this->controller->lockFolder($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([
			'e2e-token' => 'new-token',
		], $response->getData());
	}

	public function testLockFolderException(): void {
		$fileId = 42;
		$sendE2E = '';
		$this->request->expects($this->once())
			->method('getParam')
			->with('e2e-token', '')
			->willReturn('');

		$userFolder = $this->createMock(Folder::class);
		$this->rootFolder->expects($this->once())
			->method('getUserFolder')
			->with('john.doe')
			->willReturn($userFolder);
		$node = $this->createMock(Folder::class);
		$userFolder->expects($this->once())
			->method('getById')
			->with($fileId)
			->willReturn([$node]);

		$this->lockManager->expects($this->once())
			->method('lockFile')
			->with($fileId, $sendE2E)
			->willReturn(null);

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->expectException(OCSForbiddenException::class);
		$this->expectExceptionMessage('File already locked');

		$this->controller->lockFolder($fileId);
	}

	/**
	 * @param bool $getUserFolderThrows
	 * @param bool $userFolderReturnsNodes
	 * @param \Exception|null $unlockException
	 * @param string|null $expectedExceptionClass
	 * @param string|null $expectedExceptionMessage
	 *
	 * @dataProvider unlockFolderDataProvider
	 */
	public function testUnlockFolder(
		bool $getUserFolderThrows,
		bool $userFolderReturnsNodes,
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
					->method('getById')
					->with($fileId)
					->willReturn([]);
			} else {
				$node = $this->createMock(Folder::class);
				$userFolder->expects($this->once())
					->method('getById')
					->with($fileId)
					->willReturn([$node]);

				$this->fileService->expects($this->once())
					->method('finalizeChanges')
					->with($node);
				$this->metaDataStorage->expects($this->once())
					->method('saveIntermediateFile')
					->with('john.doe', $fileId);

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

			$this->controller->unlockFolder($fileId);
		} else {
			$response = $this->controller->unlockFolder($fileId);
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals([], $response->getData());
		}
	}

	public function unlockFolderDataProvider(): array {
		return [
			[false, true, null, null, null],
			[true, false, null, OCSForbiddenException::class, 'You are not allowed to remove the lock'],
			[false, false, null, OCSForbiddenException::class, 'You are not allowed to remove the lock'],
			[false, true, new FileLockedException(), OCSForbiddenException::class, 'You are not allowed to remove the lock'],
			[false, true, new FileNotLockedException(), OCSNotFoundException::class, 'File not locked']
		];
	}
}
