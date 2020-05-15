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
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\ILogger;
use Test\TestCase;

class RollbackServiceTest extends TestCase {

	/** @var LockMapper|\PHPUnit\Framework\MockObject\MockObject */
	private $lockMapper;

	/** @var IMetaDataStorage|\PHPUnit\Framework\MockObject\MockObject */
	private $metaDataStorage;

	/** @var FileService|\PHPUnit\Framework\MockObject\MockObject */
	private $fileService;

	/** @var IRootFolder|\PHPUnit\Framework\MockObject\MockObject */
	private $rootFolder;

	/** @var ILogger|\PHPUnit\Framework\MockObject\MockObject */
	private $logger;

	/** @var RollbackService */
	private $rollbackService;

	protected function setUp(): void {
		parent::setUp();

		$this->lockMapper = $this->createMock(LockMapper::class);
		$this->metaDataStorage = $this->createMock(IMetaDataStorage::class);
		$this->fileService = $this->createMock(FileService::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->logger = $this->createMock(ILogger::class);

		$this->rollbackService = new RollbackService($this->lockMapper,
			$this->metaDataStorage,
			$this->fileService,
			$this->rootFolder,
			$this->logger);
	}

	public function testRollbackOlderThan(): void {
		$locks = $this->getSampleLocks();

		$this->lockMapper->expects($this->at(0))
			->method('findAllLocksOlderThan')
			->with(1337, 4)
			->willReturn($locks);

		$node1 = $this->createMock(Folder::class);
		$node1->expects($this->once())
			->method('getMTime')
			->willReturn(1338);

		$node3 = $this->createMock(Folder::class);
		$node3->expects($this->once())
			->method('getMTime')
			->willReturn(150);

		$node4 = $this->createMock(Folder::class);
		$node4->expects($this->once())
			->method('getMTime')
			->willReturn(200);

		$this->rootFolder->expects($this->at(0))
			->method('getById')
			->with(100001)
			->willReturn([$node1]);
		$this->rootFolder->expects($this->at(1))
			->method('getById')
			->with(100002)
			->willReturn([]);
		$this->rootFolder->expects($this->at(2))
			->method('getById')
			->with(100003)
			->willReturn([$node3]);
		$this->rootFolder->expects($this->at(3))
			->method('getById')
			->with(100004)
			->willReturn([$node4]);

		$exception = new \Exception();
		$this->fileService->expects($this->at(0))
			->method('revertChanges')
			->with($node3)
			->willThrowException($exception);

		$this->fileService->expects($this->at(1))
			->method('revertChanges')
			->with($node4);

		$this->metaDataStorage->expects($this->at(0))
			->method('deleteIntermediateFile')
			->with(100004);

		$this->logger->expects($this->once())
			->method('logException')
			->with($exception, ['app' => 'end_to_end_encryption']);

		$this->lockMapper->expects($this->at(1))
			->method('delete')
			->with($locks[3]);

		$this->rollbackService->rollbackOlderThan(1337, 4);
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

		return [
			$lock1,
			$lock2,
			$lock3,
			$lock4,
		];
	}
}
