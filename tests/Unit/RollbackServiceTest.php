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
		$mountFileInfo7 = $this->createMock(ICachedMountFileInfo::class);

		$mountFileInfo7->method('getInternalPath')
			->willReturn('files_trashbin/files/a_deleted_file.jpg.d1682517431');

		$this->userMountCache->expects($this->exactly(7))
			->method('getMountsForFileId')
			->willReturnMap([
				[100001, null, []],
				[100002, null, [$mountFileInfo2]],
				[100003, null, [$mountFileInfo3]],
				[100004, null, [$mountFileInfo4]],
				[100005, null, [$mountFileInfo5]],
				[100006, null, [$mountFileInfo6]],
				[100007, null, [$mountFileInfo7]],
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
		$user7 = $this->createMock(IUser::class);
		$user7->method('getUID')->willReturn('user7');

		$mountFileInfo2->method('getUser')->willReturn($user2);
		$mountFileInfo3->method('getUser')->willReturn($user3);
		$mountFileInfo4->method('getUser')->willReturn($user4);
		$mountFileInfo5->method('getUser')->willReturn($user5);
		$mountFileInfo6->method('getUser')->willReturn($user6);
		$mountFileInfo7->method('getUser')->willReturn($user7);

		$userFolder3 = $this->createMock(Folder::class);
		$userFolder4 = $this->createMock(Folder::class);
		$userFolder5 = $this->createMock(Folder::class);
		$userFolder6 = $this->createMock(Folder::class);
		$userFolder7 = $this->createMock(Folder::class);

		$this->rootFolder->method('getUserFolder')
			->withConsecutive(['user2'], ['user3'], ['user4'], ['user5'], ['user6'], ['user7'])
			->willReturnOnConsecutiveCalls(
				$this->throwException(new \Exception('User not found')),
				$userFolder3,
				$userFolder4,
				$userFolder5,
				$userFolder6,
				$userFolder7
			);

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

		$this->fileService->expects($this->exactly(3))
			->method('revertChanges')
			->withConsecutive([$node4], [$node5], [$node6])
			->willReturnOnConsecutiveCalls(
				$this->throwException(new \Exception('Exception while reverting changes')),
				true,
				true
			);

		$this->metaDataStorage->expects($this->exactly(2))
			->method('deleteIntermediateFile')
			->withConsecutive(['user5', 100005], ['user6', 100006])
			->willReturnOnConsecutiveCalls(
				$this->throwException(new \Exception('Exception while deleting intermediate file')),
				null
			);

		$this->lockMapper->expects($this->exactly(3))
			->method('delete')
			->withConsecutive([$locks[0]], [$locks[5]], [$locks[6]]);

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

		$lock7 = new Lock();
		$lock7->setId(100007);

		return [
			$lock1,
			$lock2,
			$lock3,
			$lock4,
			$lock5,
			$lock6,
			$lock7,
		];
	}
}
