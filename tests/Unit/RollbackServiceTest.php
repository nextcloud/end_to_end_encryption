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

use OCA\EndToEndEncryption\Db\Lock;
use OCA\EndToEndEncryption\Db\LockMapper;
use OCA\EndToEndEncryption\FileService;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\RollbackService;
use OCP\Files\Config\ICachedMountFileInfo;
use OCP\Files\Config\IUserMountCache;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use Psr\Log\LoggerInterface;
use OCP\IUser;
use Test\TestCase;

class RollbackServiceTest extends TestCase {

	/** @var LockMapper|\PHPUnit\Framework\MockObject\MockObject */
	private $lockMapper;

	/** @var IMetaDataStorage|\PHPUnit\Framework\MockObject\MockObject */
	private $metaDataStorage;

	/** @var FileService|\PHPUnit\Framework\MockObject\MockObject */
	private $fileService;

	/** @var IUserMountCache|\PHPUnit\Framework\MockObject\MockObject */
	private $userMountCache;

	/** @var IRootFolder|\PHPUnit\Framework\MockObject\MockObject */
	private $rootFolder;

	/** @var LoggerInterface|\PHPUnit\Framework\MockObject\MockObject */
	private $logger;

	/** @var RollbackService */
	private $rollbackService;

	protected function setUp(): void {
		parent::setUp();

		$this->lockMapper = $this->createMock(LockMapper::class);
		$this->metaDataStorage = $this->createMock(IMetaDataStorage::class);
		$this->fileService = $this->createMock(FileService::class);
		$this->userMountCache = $this->createMock(IUserMountCache::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->logger = $this->createMock(LoggerInterface::class);

		$this->rollbackService = new RollbackService($this->lockMapper,
			$this->metaDataStorage,
			$this->fileService,
			$this->userMountCache,
			$this->rootFolder,
			$this->logger);
	}

	public function testRollbackOlderThan(): void {
		$locks = $this->getSampleLocks();

		$this->lockMapper->expects($this->once())
			->method('findAllLocksOlderThan')
			->with(1337, 10)
			->willReturn($locks);

		$mountFileInfo2 = $this->createMock(ICachedMountFileInfo::class);
		$mountFileInfo3 = $this->createMock(ICachedMountFileInfo::class);
		$mountFileInfo4 = $this->createMock(ICachedMountFileInfo::class);
		$mountFileInfo5 = $this->createMock(ICachedMountFileInfo::class);
		$mountFileInfo6 = $this->createMock(ICachedMountFileInfo::class);

		$this->userMountCache->expects($this->exactly(6))
			->method('getMountsForFileId')
			->willReturnMap([
				[100001, null, []],
				[100002, null, [$mountFileInfo2]],
				[100003, null, [$mountFileInfo3]],
				[100004, null, [$mountFileInfo4]],
				[100005, null, [$mountFileInfo5]],
				[100006, null, [$mountFileInfo6]],
			]);

		$user2 = $this->createMock(IUser::class);
		$user2->method('getUID')->willReturn('user2');
		$user3 = $this->createMock(IUser::class);
		$user3->method('getUID')->willReturn('user3');
		$user4 = $this->createMock(IUser::class);
		$user4->method('getUID')->willReturn('user4');
		$user5 = $this->createMock(IUser::class);
		$user5->method('getUID')->willReturn('user5');
		$user6 = $this->createMock(IUser::class);
		$user6->method('getUID')->willReturn('user6');

		$mountFileInfo2->method('getUser')->willReturn($user2);
		$mountFileInfo3->method('getUser')->willReturn($user3);
		$mountFileInfo4->method('getUser')->willReturn($user4);
		$mountFileInfo5->method('getUser')->willReturn($user5);
		$mountFileInfo6->method('getUser')->willReturn($user6);

		$userFolder3 = $this->createMock(Folder::class);
		$userFolder4 = $this->createMock(Folder::class);
		$userFolder5 = $this->createMock(Folder::class);
		$userFolder6 = $this->createMock(Folder::class);

		$this->rootFolder->expects($this->at(0))
			->method('getUserFolder')
			->with('user2')
			->willThrowException(new \Exception('User not found'));
		$this->rootFolder->expects($this->at(1))
			->method('getUserFolder')
			->with('user3')
			->willReturn($userFolder3);
		$this->rootFolder->expects($this->at(2))
			->method('getUserFolder')
			->with('user4')
			->willReturn($userFolder4);
		$this->rootFolder->expects($this->at(3))
			->method('getUserFolder')
			->with('user5')
			->willReturn($userFolder5);
		$this->rootFolder->expects($this->at(4))
			->method('getUserFolder')
			->with('user6')
			->willReturn($userFolder6);

		$node3 = $this->createMock(Folder::class);
		$node3->expects($this->once())
			->method('getMTime')
			->willReturn(2000);
		$node4 = $this->createMock(Folder::class);
		$node4->expects($this->once())
			->method('getMTime')
			->willReturn(1336);
		$node5 = $this->createMock(Folder::class);
		$node5->expects($this->once())
			->method('getMTime')
			->willReturn(1335);
		$node6 = $this->createMock(Folder::class);
		$node6->expects($this->once())
			->method('getMTime')
			->willReturn(200);

		$userFolder3->expects($this->once())
			->method('getById')
			->with(100003)
			->willReturn([$node3]);
		$userFolder4->expects($this->once())
			->method('getById')
			->with(100004)
			->willReturn([$node4]);
		$userFolder5->expects($this->once())
			->method('getById')
			->with(100005)
			->willReturn([$node5]);
		$userFolder6->expects($this->once())
			->method('getById')
			->with(100006)
			->willReturn([$node6]);

		$this->fileService->expects($this->at(0))
			->method('revertChanges')
			->with($node4)
			->willThrowException(new \Exception('Exception while reverting changes'));
		$this->fileService->expects($this->at(1))
			->method('revertChanges')
			->with($node5);
		$this->fileService->expects($this->at(2))
			->method('revertChanges')
			->with($node6);

		$this->metaDataStorage->expects($this->at(0))
			->method('deleteIntermediateFile')
			->with('user5', 100005)
			->willThrowException(new \Exception('Exception while deleting intermediate file'));
		$this->metaDataStorage->expects($this->at(1))
			->method('deleteIntermediateFile')
			->with('user6', 100006);

		$this->lockMapper->expects($this->once())
			->method('delete')
			->with($locks[5]);

		$this->logger->expects($this->exactly(3))
			->method('critical');

		$this->rollbackService->rollbackOlderThan(1337, 10);
	}

	private function getSampleLocks(): array {
		$lock1 = new Lock();
		$lock1->setId(100001);

		$lock2 = new Lock();
		$lock2->setId(100002);

		$lock3 = new Lock();
		$lock3->setId(100003);

		$lock4 = new Lock();
		$lock4->setId(100004);

		$lock5 = new Lock();
		$lock5->setId(100005);

		$lock6 = new Lock();
		$lock6->setId(100006);

		return [
			$lock1,
			$lock2,
			$lock3,
			$lock4,
			$lock5,
			$lock6,
		];
	}
}
