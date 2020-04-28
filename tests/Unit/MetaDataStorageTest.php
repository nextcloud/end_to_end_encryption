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

use OC\User\NoUserException;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\MetaDataStorage;
use OCP\Files\Folder;
use OCP\Files\IAppData;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use OCP\Files\SimpleFS\ISimpleRoot;
use OCP\IUser;
use Test\TestCase;

class MetaDataStorageTest extends TestCase {

	/** @var IAppData|\PHPUnit\Framework\MockObject\MockObject */
	private $appData;

	/** @var IRootFolder|\PHPUnit\Framework\MockObject\MockObject */
	private $rootFolder;

	/** @var MetaDataStorage */
	private $metaDataStorage;

	protected function setUp(): void {
		parent::setUp();

		$this->appData = $this->createMock(IAppData::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);

		$this->metaDataStorage = new MetaDataStorage($this->appData, $this->rootFolder);
	}

	public function testGetMetaData(): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorage::class)
			->setMethods([
				'verifyOwner',
				'verifyFolderStructure',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$metaDataStorage->expects($this->once())
			->method('verifyOwner')
			->with(42);
		$metaDataStorage->expects($this->once())
			->method('verifyFolderStructure');

		$metaDataFile = $this->createMock(ISimpleFile::class);
		$metaDataFile->expects($this->once())
			->method('getContent')
			->willReturn('metadata-file-content');

		$metaDataFolder = $this->createMock(ISimpleFolder::class);
		$metaDataFolder->expects($this->once())
			->method('getFile')
			->with('meta.data')
			->willReturn($metaDataFile);

		$this->appData->expects($this->once())
			->method('getFolder')
			->with('/meta-data/42')
			->willReturn($metaDataFolder);

		$actual = $metaDataStorage->getMetaData(42);
		$this->assertEquals('metadata-file-content', $actual);
	}

	/**
	 * @dataProvider setMetaDataDataProvider
	 *
	 * @param bool $folderExists
	 * @param bool $fileExists
	 * @param bool $expectsNewFolder
	 * @param bool $expectsMetaDataExistsException
	 */
	public function testSetMetaData(bool $folderExists, bool $fileExists, bool $expectsNewFolder, bool $expectsMetaDataExistsException): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorage::class)
			->setMethods([
				'verifyOwner',
				'verifyFolderStructure',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$metaDataStorage->expects($this->once())
			->method('verifyOwner')
			->with(42);
		$metaDataStorage->expects($this->once())
			->method('verifyFolderStructure');

		$metaDataFolder = $this->createMock(ISimpleFolder::class);
		if ($folderExists) {
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willReturn($metaDataFolder);
		} else {
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willThrowException(new NotFoundException());
		}

		if ($expectsNewFolder) {
			$this->appData->expects($this->once())
				->method('newFolder')
				->with('/meta-data/42')
				->willReturn($metaDataFolder);
		} else {
			$this->appData->expects($this->never())
				->method('newFolder');
		}

		$metaDataFolder->expects($this->once())
			->method('fileExists')
			->with('meta.data')
			->willReturn($fileExists);

		if ($expectsMetaDataExistsException) {
			$this->expectException(MetaDataExistsException::class);
			$this->expectExceptionMessage('Meta-data file already exists');
		} else {
			$node = $this->createMock(ISimpleFile::class);
			$node->expects($this->once())
				->method('putContent')
				->with('metadata-file-content');

			$metaDataFolder->expects($this->once())
				->method('newFile')
				->with('meta.data')
				->willReturn($node);
		}

		$metaDataStorage->setMetaData(42, 'metadata-file-content');
	}

	public function setMetaDataDataProvider(): array {
		return [
			[false, false, true,  false],
			[true,  false, false, false],
			[true,  true,  false, true],
		];
	}

	/**
	 * @dataProvider updateMetaDataDataProvider
	 *
	 * @param bool $folderExists
	 * @param bool $fileExists
	 * @param bool $expectMissingMetaDataException
	 */
	public function testUpdateMetaData(bool $folderExists, bool $fileExists, bool $expectMissingMetaDataException): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorage::class)
			->setMethods([
				'verifyOwner',
				'verifyFolderStructure',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$metaDataStorage->expects($this->once())
			->method('verifyOwner')
			->with(42);
		$metaDataStorage->expects($this->once())
			->method('verifyFolderStructure');

		$metaDataFolder = $this->createMock(ISimpleFolder::class);
		if ($folderExists) {
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willReturn($metaDataFolder);

			$metaDataFolder->expects($this->once())
				->method('fileExists')
				->with('meta.data')
				->willReturn($fileExists);

			if ($fileExists) {
				$node = $this->createMock(ISimpleFile::class);
				$node->expects($this->once())
					->method('putContent')
					->with('metadata-file-content');

				$metaDataFolder->expects($this->once())
					->method('getFile')
					->with('meta.data')
					->willReturn($node);
			}
		} else {
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willThrowException(new NotFoundException());
		}

		if ($expectMissingMetaDataException) {
			$this->expectException(MissingMetaDataException::class);
			$this->expectExceptionMessage('Meta-data file missing');
		}

		$metaDataStorage->updateMetaData(42, 'metadata-file-content');
	}

	public function updateMetaDataDataProvider(): array {
		return [
			[true,  true,  false],
			[true,  false, true],
			[false, true,  true],
		];
	}

	/**
	 * @dataProvider deleteMetaDataDataProvider
	 *
	 * @param bool $folderExists
	 */
	public function testDeleteMetaData(bool $folderExists): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorage::class)
			->setMethods([
				'verifyOwner',
				'verifyFolderStructure',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$metaDataStorage->expects($this->once())
			->method('verifyOwner')
			->with(42);
		$metaDataStorage->expects($this->once())
			->method('verifyFolderStructure');

		if ($folderExists) {
			$metaDataFolder = $this->createMock(ISimpleFolder::class);
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willReturn($metaDataFolder);

			$metaDataFolder->expects($this->once())
				->method('delete');
		} else {
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willThrowException(new NotFoundException());
		}

		$metaDataStorage->deleteMetaData(42);
	}

	public function deleteMetaDataDataProvider(): array {
		return [
			[true],
			[false],
		];
	}

	/**
	 * @dataProvider verifyOwnerDataProvider
	 *
	 * @param bool $emptyRootFolder
	 * @param bool $noUserException
	 * @param bool $emptyOwnerRoot
	 * @param bool $expectsNotFoundEx
	 * @param string|null $expectedMessage
	 */
	public function testVerifyOwner(bool $emptyRootFolder, bool $noUserException, bool $emptyOwnerRoot, bool $expectsNotFoundEx, ?string $expectedMessage): void {
		if ($emptyRootFolder) {
			$this->rootFolder->expects($this->at(0))
				->method('getById')
				->with(42)
				->willReturn([]);
		} else {
			$user = $this->createMock(IUser::class);
			$user->expects($this->once())
				->method('getUID')
				->willReturn('userId');

			$node = $this->createMock(Node::class);
			$node->expects($this->once())
				->method('getOwner')
				->willReturn($user);

			$this->rootFolder->expects($this->at(0))
				->method('getById')
				->with(42)
				->willReturn([$node]);

			if ($noUserException) {
				$this->rootFolder->expects($this->at(1))
					->method('getUserFolder')
					->with('userId')
					->willThrowException(new NoUserException());
			} else {
				$ownerRoot = $this->createMock(Folder::class);
				$this->rootFolder->expects($this->at(1))
					->method('getUserFolder')
					->with('userId')
					->willReturn($ownerRoot);

				if ($emptyOwnerRoot) {
					$ownerRoot->expects($this->at(0))
						->method('getById')
						->with(42)
						->willReturn([]);
				} else {
					$ownerNode = $this->createMock(Node::class);
					$ownerRoot->expects($this->at(0))
						->method('getById')
						->with(42)
						->willReturn([$ownerNode]);
				}
			}
		}

		if ($expectsNotFoundEx) {
			$this->expectException(NotFoundException::class);
			$this->expectExceptionMessage($expectedMessage);
		}

		self::invokePrivate($this->metaDataStorage, 'verifyOwner', [42]);
	}

	public function verifyOwnerDataProvider(): array {
		return [
			[true,  false, false, true, 'No file with ID 42'],
			[false, true,  false, true, 'No user-root for owner of ID 42'],
			[false, false, true,  true, 'No file for owner with ID 42'],
			[false, false, false, false, null],
		];
	}

	/**
	 * @dataProvider verifyFolderStructureDataProvider
	 *
	 * @param bool $exists
	 * @param bool $expectsNewFolder
	 */
	public function testVerifyFolderStructure(bool $exists, bool $expectsNewFolder): void {
		$appDataRoot = $this->createMock(ISimpleFolder::class);
		$appDataRoot->expects($this->at(0))
			->method('fileExists')
			->with('/meta-data')
			->willReturn($exists);

		if ($expectsNewFolder) {
			$this->appData->expects($this->at(1))
				->method('newFolder')
				->with('/meta-data');
		} else {
			$this->appData->expects($this->never())
				->method('newFolder');
		}

		$this->appData->expects($this->at(0))
			->method('getFolder')
			->with('/')
			->willReturn($appDataRoot);

		self::invokePrivate($this->metaDataStorage, 'verifyFolderStructure');
	}

	public function verifyFolderStructureDataProvider(): array {
		return [
			[true, false],
			[false, true],
		];
	}
}
