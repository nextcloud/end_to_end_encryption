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
use OCA\EndToEndEncryption\EncryptionManager;
use OCP\Files\Cache\ICache;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\Files\Storage\IStorage;
use OCP\IDBConnection;
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

	protected function setUp(): void {
		parent::setUp();
		$this->rootFolderInterface = $this->createMock(IRootFolder::class);
		$this->rootFolder = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();
		$this->storage = $this->createMock(IStorage::class);
		$this->fileCache = $this->createMock(ICache::class);
		$this->dbConnection = $this->createMock(IDBConnection::class);
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->accessManager = $this->createMock(AccessManager::class);

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
					]
				)
				->onlyMethods($mockedMethods)
				->getMock();
		} else {
			$instance = new EncryptionManager($this->rootFolderInterface, $this->dbConnection, $this->logger, $this->accessManager);
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

		$instance->setEncryptionFlag($fileId);
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

		$instance->removeEncryptionFlag($fileId);
	}

	/**
	 * @dataProvider dataTestIsEncryptedFile
	 *
	 * @param Node&MockObject $node
	 * @param bool $expected
	 */
	public function testIsEncryptedFile($node, $expected): void {
		$instance = $this->getInstance();
		$result = $instance->isEncryptedFile($node);
		$this->assertSame($expected, $result);
	}

	public function dataTestIsEncryptedFile(): array {
		// no node is encrypted
		[$node1_1, $node1_2, $node1_3] = $this->constructNestedNodes();
		$node1_1->expects($this->any())->method('isEncrypted')->willReturn(false);
		$node1_2->expects($this->any())->method('isEncrypted')->willReturn(false);
		$node1_3->expects($this->any())->method('isEncrypted')->willReturn(false);

		//first node is encrypted
		[$node2_1, $node2_2, $node2_3] = $this->constructNestedNodes();
		$node2_1->expects($this->any())->method('isEncrypted')->willReturn(true);
		$node2_2->expects($this->any())->method('isEncrypted')->willReturn(false);
		$node2_3->expects($this->any())->method('isEncrypted')->willReturn(false);

		//parent node is encrypted
		[$node3_1, $node3_2, $node3_3] = $this->constructNestedNodes();
		$node3_1->expects($this->any())->method('isEncrypted')->willReturn(false);
		$node3_2->expects($this->any())->method('isEncrypted')->willReturn(true);
		$node3_3->expects($this->any())->method('isEncrypted')->willReturn(false);

		return [
			[$node1_1, false],
			[$node2_1, true],
			[$node3_1, true],
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
