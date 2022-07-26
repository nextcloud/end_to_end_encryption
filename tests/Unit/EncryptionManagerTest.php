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


namespace OCA\EndToEndEncryption\Tests\Unit;

use OC\Files\Node\File;
use OCA\EndToEndEncryption\EncryptionManager;
use OCP\Files\Cache\ICache;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\Files\Storage\IStorage;
use OCP\IDBConnection;
use OCP\IUser;
use OCP\IUserSession;
use OCP\Share\IManager;
use OCP\Share\IShare;
use PHPUnit_Framework_MockObject_MockObject;
use Test\TestCase;
use Psr\Log\LoggerInterface;

class EncryptionManagerTest extends TestCase {

	/** @var  IRootFolder|PHPUnit_Framework_MockObject_MockObject */
	private $rootFolderInterface;

	/** @var  Folder|PHPUnit_Framework_MockObject_MockObject */
	private $rootFolder;

	/** @var  IStorage|PHPUnit_Framework_MockObject_MockObject */
	private $storage;

	/** @var  ICache|PHPUnit_Framework_MockObject_MockObject */
	private $fileCache;

	/** @var  IUserSession|PHPUnit_Framework_MockObject_MockObject */
	private $userSession;

	/** @var  IManager|PHPUnit_Framework_MockObject_MockObject */
	private $shareManager;

	/** @var IDBConnection|PHPUnit_Framework_MockObject_MockObject */
	private $dbConnection;

	/** @var LoggerInterface|PHPUnit_Framework_MockObject_MockObject */
	private $logger;

	protected function setUp(): void {
		parent::setUp();
		$this->rootFolderInterface = $this->createMock(IRootFolder::class);
		$this->rootFolder = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();
		$this->storage = $this->createMock(IStorage::class);
		$this->fileCache = $this->createMock(ICache::class);
		$this->userSession = $this->createMock(IUserSession::class);
		$this->shareManager = $this->createMock(IManager::class);
		$this->dbConnection = $this->createMock(IDBConnection::class);
		$this->logger = $this->createMock(LoggerInterface::class);

		$this->rootFolder->expects($this->any())->method('getStorage')->willReturn($this->storage);
		$this->storage->expects($this->any())->method('getCache')->willReturn($this->fileCache);
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
						$this->userSession,
						$this->shareManager,
						$this->dbConnection,
						$this->logger,
					]
				)
				->setMethods($mockedMethods)
				->getMock();
		} else {
			$instance = new EncryptionManager($this->rootFolderInterface, $this->userSession, $this->shareManager, $this->dbConnection, $this->logger);
		}

		return $instance;
	}

	public function testSetEncryptionFlag(): void {
		$fileId = 42;
		$instance = $this->getInstance(['isValidFolder', 'getUserRoot']);

		$instance->expects($this->once())->method('isValidFolder')->with($fileId);
		$instance->expects($this->once())->method('getUserRoot')->willReturn($this->rootFolder);
		$this->fileCache->expects($this->once())->method('update')->with($fileId, ['encrypted' => '1']);

		$instance->setEncryptionFlag($fileId);
	}

	public function testRemoveEncryptionFlag(): void {
		$fileId = 42;
		$instance = $this->getInstance(['isValidFolder', 'getUserRoot']);

		$instance->expects($this->once())->method('isValidFolder')->with($fileId);
		$instance->expects($this->once())->method('getUserRoot')->willReturn($this->rootFolder);
		$this->fileCache->expects($this->once())->method('update')->with($fileId, ['encrypted' => '0']);

		$instance->removeEncryptionFlag($fileId);
	}

	/**
	 * @dataProvider dataTestIsEncryptedFile
	 *
	 * @param Node|PHPUnit_Framework_MockObject_MockObject $node
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
	 * @return PHPUnit_Framework_MockObject_MockObject[]
	 */
	public function constructNestedNodes(): array {
		$node1 = $this->getMockBuilder(Node::class)->disableOriginalConstructor()->getMock();
		$node2 = $this->getMockBuilder(Node::class)->disableOriginalConstructor()->getMock();
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
		$node2 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();

		$this->rootFolderInterface->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([$node1, $node2]);

		$node1->expects($this->once())
			->method('getDirectoryListing')
			->willReturn([]);

		$node2->expects($this->never())
			->method('getDirectoryListing');

		$user = $this->createMock(IUser::class);
		$user->expects($this->once())
			->method('getUID')
			->willReturn('userId123');

		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn($user);

		$this->shareManager->expects($this->at(0))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_USER, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(1))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_GROUP, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(2))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_USERGROUP, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(3))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_LINK, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(4))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_EMAIL, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(5))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_REMOTE, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(6))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_CIRCLE, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(7))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_GUEST, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(8))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_REMOTE_GROUP, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(9))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_ROOM, $node1, false, 1)
			->willReturn([]);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}

	public function testIsValidFolderEmptyResultSet():void {
		$this->expectException(NotFoundException::class);
		$this->expectExceptionMessage('No folder with ID 42');

		$instance = $this->getInstance();
		$this->rootFolderInterface->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([]);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}

	public function testIsValidFolderNotAFolder():void {
		$this->expectException(NotFoundException::class);
		$this->expectExceptionMessage('No folder with ID 42');

		$instance = $this->getInstance();

		$node1 = $this->getMockBuilder(File::class)->disableOriginalConstructor()->getMock();
		$node2 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();

		$this->rootFolderInterface->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([$node1, $node2]);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}

	public function testIsValidFolderNonEmpty():void {
		$this->expectException(NotFoundException::class);
		$this->expectExceptionMessage('Folder with ID 42 not empty');

		$instance = $this->getInstance();

		$node1 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();
		$node2 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();

		$this->rootFolderInterface->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([$node1]);

		$node1->expects($this->once())
			->method('getDirectoryListing')
			->willReturn([$node2]);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}

	public function testIsValidFolderNoUserSession():void {
		$this->expectException(NotFoundException::class);
		$this->expectExceptionMessage('No active user-session');

		$instance = $this->getInstance();

		$node1 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();
		$node2 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();

		$this->rootFolderInterface->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([$node1, $node2]);

		$node1->expects($this->once())
			->method('getDirectoryListing')
			->willReturn([]);

		$node2->expects($this->never())
			->method('getDirectoryListing');

		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn(null);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}

	public function testIsValidFolderShared():void {
		$this->expectException(NotFoundException::class);
		$this->expectExceptionMessage('Folder with ID 42 is shared');

		$instance = $this->getInstance();

		$node1 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();
		$node2 = $this->getMockBuilder(Folder::class)->disableOriginalConstructor()->getMock();

		$this->rootFolderInterface->expects($this->once())
			->method('getById')
			->with(42)
			->willReturn([$node1, $node2]);

		$node1->expects($this->once())
			->method('getDirectoryListing')
			->willReturn([]);

		$node2->expects($this->never())
			->method('getDirectoryListing');

		$user = $this->createMock(IUser::class);
		$user->expects($this->once())
			->method('getUID')
			->willReturn('userId123');

		$this->userSession->expects($this->once())
			->method('getUser')
			->willReturn($user);

		$this->shareManager->expects($this->at(0))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_USER, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(1))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_GROUP, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(2))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_USERGROUP, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(3))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_LINK, $node1, false, 1)
			->willReturn([]);

		$this->shareManager->expects($this->at(4))
			->method('getSharesBy')
			->with('userId123', IShare::TYPE_EMAIL, $node1, false, 1)
			->willReturn(['share123']);

		self::invokePrivate($instance, 'isValidFolder', [42]);
	}
}
