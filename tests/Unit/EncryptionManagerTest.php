<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption\Tests\Unit;

use InvalidArgumentException;
use OC\Files\Node\File;
use OCA\EndToEndEncryption\AccessManager;
use OCA\EndToEndEncryption\AuditLogger;
use OCA\EndToEndEncryption\AuditOperation;
use OCA\EndToEndEncryption\EncryptionManager;
use OCP\DB\IResult;
use OCP\DB\QueryBuilder\IExpressionBuilder;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\Cache\ICache;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\Files\Storage\IStorage;
use OCP\IDBConnection;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit_Framework_MockObject_MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class EncryptionManagerTest extends TestCase {

	private IRootFolder&MockObject $rootFolderInterface;
	private Folder&MockObject $rootFolder;
	private IStorage&MockObject $storage;
	private ICache&MockObject $fileCache;
	private IDBConnection&MockObject $dbConnection;
	private LoggerInterface&MockObject $logger;
	private AccessManager&MockObject $accessManager;
	private AuditLogger&MockObject $auditLogger;

	protected function setUp(): void {
		parent::setUp();
		$this->rootFolderInterface = $this->createMock(IRootFolder::class);
		$this->rootFolder = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();
		$this->storage = $this->createMock(IStorage::class);
		$this->fileCache = $this->createMock(ICache::class);
		$this->dbConnection = $this->createMock(IDBConnection::class);
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->accessManager = $this->createMock(AccessManager::class);
		$this->auditLogger = $this->createMock(AuditLogger::class);

		$node = $this->createMock(Node::class);
		$node->method('getStorage')->willReturn($this->storage);
		$this->rootFolder
			->expects($this->any())
			->method('getStorage')
			->willReturn($this->storage);
		$this->rootFolder
			->method('getFirstNodeById')
			->willReturn($node);
		$this->storage
			->expects($this->any())
			->method('getCache')
			->willReturn($this->fileCache);
	}

	/**
	 * get EncryptionManager instance
	 *
	 * @param array $mockedMethods
	 * @return PHPUnit_Framework_MockObject_MockObject|EncryptionManager
	 */
	private function getInstance($mockedMethods = []) {
		if (!empty($mockedMethods)) {
			$instance = $this->getMockBuilder(EncryptionManager::class)
				->setConstructorArgs(
					[
						$this->rootFolderInterface,
						$this->dbConnection,
						$this->logger,
						$this->accessManager,
						$this->auditLogger,
					]
				)
				->onlyMethods($mockedMethods)
				->getMock();
		} else {
			$instance = new EncryptionManager($this->rootFolderInterface, $this->dbConnection, $this->logger, $this->accessManager, $this->auditLogger);
		}

		return $instance;
	}

	public function testSetEncryptionFlag(): void {
		$fileId = 42;
		$instance = $this->getInstance(['isValidFolder']);
		$instance->expects($this->once())->method('isValidFolder')->with($fileId);

		$this->accessManager
			->method('getOwnerId')
			->with($fileId)
			->willReturn('userId');
		$this->rootFolderInterface
			->method('getUserFolder')
			->with('userId')
			->willReturn($this->rootFolder);

		$this->fileCache->expects($this->once())->method('update')->with($fileId, ['encrypted' => '1']);
		$this->auditLogger->expects($this->once())
			->method('log')
			->with(AuditOperation::SetEncryptionFlag, $this->anything(), ['fileId' => $fileId, 'ownerId' => 'userId']);

		$instance->setEncryptionFlag($fileId);
	}

	public function testSetEncryptionFlagInvalidFolderIsNotLogged(): void {
		$instance = $this->getInstance(['isValidFolder']);
		$instance->method('isValidFolder')->willThrowException(new NotFoundException());

		$this->fileCache->expects($this->never())->method('update');
		$this->auditLogger->expects($this->never())->method('log');

		$this->expectException(NotFoundException::class);
		$instance->setEncryptionFlag(42);
	}

	public function testRemoveEncryptionFlag(): void {
		$fileId = 42;
		$instance = $this->getInstance(['isValidFolder']);

		$instance->expects($this->once())->method('isValidFolder')->with($fileId);
		$this->fileCache->expects($this->once())->method('update')->with($fileId, ['encrypted' => '0']);

		$this->accessManager
			->method('getOwnerId')
			->with($fileId)
			->willReturn('userId');
		$this->rootFolderInterface
			->method('getUserFolder')
			->with('userId')
			->willReturn($this->rootFolder);

		$this->auditLogger->expects($this->once())
			->method('log')
			->with(AuditOperation::RemoveEncryptionFlag, $this->anything(), ['fileId' => $fileId, 'ownerId' => 'userId']);

		$instance->removeEncryptionFlag($fileId);
	}

	public function testRemoveEncryptedFolders(): void {
		$expr = $this->createStub(IExpressionBuilder::class);
		$result = $this->createStub(IResult::class);
		$result->method('fetch')->willReturnOnConsecutiveCalls(['fileid' => 1], ['fileid' => 2], false);
		$qb = $this->createStub(IQueryBuilder::class);
		$qb->method('select')->willReturnSelf();
		$qb->method('from')->willReturnSelf();
		$qb->method('where')->willReturnSelf();
		$qb->method('andWhere')->willReturnSelf();
		$qb->method('expr')->willReturn($expr);
		$qb->method('executeQuery')->willReturn($result);
		$this->dbConnection->method('getQueryBuilder')->willReturn($qb);

		$deleted = $this->createMock(Folder::class);
		$deleted->expects($this->once())->method('delete');
		$deleted->method('getId')->willReturn(1);
		$failing = $this->createMock(Folder::class);
		$failing->method('delete')->willThrowException(new \Exception());

		$userFolder = $this->createStub(Folder::class);
		$userFolder->method('getStorage')->willReturn($this->storage);
		$userFolder->method('getById')->willReturnMap([
			[1, [$deleted]],
			[2, [$failing]],
		]);
		$this->rootFolderInterface
			->method('getUserFolder')
			->with('userId')
			->willReturn($userFolder);

		$this->auditLogger->expects($this->once())
			->method('log')
			->with(AuditOperation::DeleteEncryptedFolders, $this->anything(), ['userId' => 'userId', 'deletedCount' => 1]);

		$this->assertSame([1], $this->getInstance()->removeEncryptedFolders('userId'));
	}

	/**
	 *
	 * @param list<bool> $encrypted whether the node, its parent and its grandparent are encrypted
	 */
	#[DataProvider('dataTestIsEncryptedFile')]
	public function testIsEncryptedFile(array $encrypted, bool $expected): void {
		[$node, $parent, $grandParent] = $this->constructNestedNodes();
		$node->method('isEncrypted')->willReturn($encrypted[0]);
		$parent->method('isEncrypted')->willReturn($encrypted[1]);
		$grandParent->method('isEncrypted')->willReturn($encrypted[2]);

		$instance = $this->getInstance();
		$result = $instance->isEncryptedFile($node);
		$this->assertSame($expected, $result);
	}

	public static function dataTestIsEncryptedFile(): array {
		return [
			'no node is encrypted' => [[false, false, false], false],
			'first node is encrypted' => [[true, false, false], true],
			'parent node is encrypted' => [[false, true, false], true],
		];
	}

	/**
	 * @return list<Node&MockObject>
	 */
	public function constructNestedNodes(): array {
		$node1 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();
		$node2 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();
		$node3 = $this->getMockBuilder(Node::class)->disableOriginalConstructor()->getMock();
		$node1->expects($this->any())->method('getParent')->willReturn($node2);
		$node1->expects($this->any())->method('getPath')->willReturn('/data/user');
		$node2->expects($this->any())->method('getParent')->willReturn($node3);
		$node2->expects($this->any())->method('getPath')->willReturn('/data');
		$node3->expects($this->any())->method('getPath')->willReturn('/');

		return [$node1, $node2, $node3];
	}

	public function testIsValidFolderSuccess():void {
		$instance = $this->getInstance();

		$node1 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();

		$this->rootFolderInterface->expects($this->once())
			->method('getFirstNodeById')
			->with(42)
			->willReturn($node1);

		$node1->expects($this->once())
			->method('getDirectoryListing')
			->willReturn([]);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}

	public function testIsValidFolderEmptyResultSet():void {
		$this->expectException(NotFoundException::class);
		$this->expectExceptionMessage('No folder with ID 42');

		$instance = $this->getInstance();
		$this->rootFolderInterface->expects($this->once())
			->method('getFirstNodeById')
			->with(42)
			->willReturn(null);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}

	public function testIsValidFolderNotAFolder():void {
		$this->expectException(NotFoundException::class);
		$this->expectExceptionMessage('No folder with ID 42');

		$instance = $this->getInstance();

		$node1 = $this->getMockBuilder(File::class)->disableOriginalConstructor()->getMock();

		$this->rootFolderInterface->expects($this->once())
			->method('getFirstNodeById')
			->with(42)
			->willReturn($node1);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}

	public function testIsValidFolderNonEmpty():void {
		$this->expectException(NotFoundException::class);
		$this->expectExceptionMessage('Folder with ID 42 not empty');

		$instance = $this->getInstance();

		$node1 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();
		$node2 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();

		$this->rootFolderInterface->expects($this->once())
			->method('getFirstNodeById')
			->with(42)
			->willReturn($node1);

		$node1->expects($this->once())
			->method('getDirectoryListing')
			->willReturn([$node2]);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}

	public function testIsValidNoAccess():void {
		$this->expectException(InvalidArgumentException::class);

		$instance = $this->getInstance();

		$this->accessManager->expects($this->once())
			->method('checkPermissions')
			->with(42, true)
			->willThrowException(new InvalidArgumentException());

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}
}
