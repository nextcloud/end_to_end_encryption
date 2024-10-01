<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use Exception;
use OC\User\NoUserException;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\MetaDataStorageV1;
use OCP\Files\Folder;
use OCP\Files\IAppData;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use Test\TestCase;

class MetaDataStorageV1Test extends TestCase {

	/** @var IAppData|\PHPUnit\Framework\MockObject\MockObject */
	private $appData;

	/** @var IRootFolder|\PHPUnit\Framework\MockObject\MockObject */
	private $rootFolder;

	/** @var MetaDataStorageV1 */
	private $metaDataStorage;

	protected function setUp(): void {
		parent::setUp();

		$this->appData = $this->createMock(IAppData::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);

		$this->metaDataStorage = new MetaDataStorageV1($this->appData, $this->rootFolder);
	}

	/**
	 * @param bool $hasLegacyFile
	 * @param string $expectedOutput
	 *
	 * @dataProvider getMetaDataDataProvider
	 */
	public function testGetMetaData(bool $hasLegacyFile, string $expectedOutput): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorageV1::class)
			->setMethods([
				'verifyOwner',
				'verifyFolderStructure',
				'getLegacyFile',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$metaDataStorage->expects($this->once())
			->method('verifyOwner')
			->with('userId', 42);
		$metaDataStorage->expects($this->once())
			->method('verifyFolderStructure');

		if ($hasLegacyFile) {
			$legacyMetaDataFile = $this->createMock(ISimpleFile::class);
			$legacyMetaDataFile->expects($this->once())
				->method('getContent')
				->willReturn('legacy-metadata-file-content');
			$metaDataStorage->expects($this->once())
				->method('getLegacyFile')
				->with('userId', 42)
				->willReturn($legacyMetaDataFile);

			$this->appData->expects($this->never())
				->method('getFolder')
				->with('/meta-data/42');
		} else {
			$metaDataStorage->expects($this->once())
				->method('getLegacyFile')
				->with('userId', 42)
				->willReturn(null);

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
		}

		$actual = $metaDataStorage->getMetaData('userId', 42);
		$this->assertEquals($expectedOutput, $actual);
	}

	public function getMetaDataDataProvider(): array {
		return [
			[true, 'legacy-metadata-file-content'],
			[false, 'metadata-file-content'],
		];
	}

	/**
	 * @dataProvider setMetaDataIntoIntermediateFileDataProvider
	 *
	 * @param bool $hasLegacyMetadataFile
	 * @param bool $folderExists
	 * @param bool $fileExists
	 * @param bool $intermediateFileExists
	 * @param bool $expectsNewFolder
	 * @param bool $expectsMetaDataExistsException
	 */
	public function testSetMetaDataIntoIntermediateFile(bool $hasLegacyMetadataFile, bool $folderExists, bool $fileExists, bool $intermediateFileExists, bool $expectsNewFolder, bool $expectsMetaDataExistsException): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorageV1::class)
			->setMethods([
				'verifyOwner',
				'verifyFolderStructure',
				'getLegacyFile',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$metaDataStorage->expects($this->once())
			->method('verifyOwner')
			->with('userId', 42);
		$metaDataStorage->expects($this->once())
			->method('verifyFolderStructure');

		if ($hasLegacyMetadataFile) {
			$legacyMetaDataFile = $this->createMock(ISimpleFile::class);
			$metaDataStorage->expects($this->once())
				->method('getLegacyFile')
				->with('userId', 42)
				->willReturn($legacyMetaDataFile);
		} else {
			$metaDataStorage->expects($this->once())
				->method('getLegacyFile')
				->with('userId', 42)
				->willReturn(null);

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


			if ($fileExists) {
				$metaDataFolder->expects($this->once())
					->method('fileExists')
					->with('meta.data')
					->willReturn($fileExists);
			} else {
				$metaDataFolder->expects($this->exactly(2))
					->method('fileExists')
					->withConsecutive(['meta.data'], ['intermediate.meta.data'])
					->willReturnOnConsecutiveCalls($fileExists, $intermediateFileExists);
			}
		}

		if ($expectsMetaDataExistsException) {
			$this->expectException(MetaDataExistsException::class);

			if ($hasLegacyMetadataFile) {
				$this->expectExceptionMessage('Legacy Meta-data file already exists');
			} elseif ($fileExists) {
				$this->expectExceptionMessage('Meta-data file already exists');
			} elseif ($intermediateFileExists) {
				$this->expectExceptionMessage('Intermediate meta-data file already exists');
			}
		} else {
			$node = $this->createMock(ISimpleFile::class);
			$node->expects($this->once())
				->method('putContent')
				->with('metadata-file-content');

			$metaDataFolder->expects($this->once())
				->method('newFile')
				->with('intermediate.meta.data')
				->willReturn($node);
		}

		$metaDataStorage->setMetaDataIntoIntermediateFile('userId', 42, 'metadata-file-content');
	}

	public function setMetaDataIntoIntermediateFileDataProvider(): array {
		return [
			[true, false, false, false, false, true],
			[false, false, false, false, true,  false],
			[false, true,  false, true,  false, true],
			[false, true,  false, false, false, false],
			[false, true,  true,  true,  false, true],
			[false, true,  true,  false, false, true],
		];
	}

	/**
	 * @dataProvider updateMetaDataIntoIntermediateFileDataProvider
	 *
	 * @param bool $hasLegacyMetadataFile
	 * @param bool $folderExists
	 * @param bool $fileExists
	 * @param bool $intermediateFileExists
	 * @param bool $expectMissingMetaDataException
	 */
	public function testUpdateMetaDataIntoIntermediateFile(bool $hasLegacyMetadataFile, bool $folderExists, bool $fileExists, bool $intermediateFileExists, bool $expectMissingMetaDataException): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorageV1::class)
			->setMethods([
				'verifyOwner',
				'verifyFolderStructure',
				'getLegacyFile',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$metaDataStorage->expects($this->once())
			->method('verifyOwner')
			->with('userId', 42);
		$metaDataStorage->expects($this->once())
			->method('verifyFolderStructure');

		if ($hasLegacyMetadataFile) {
			$metaDataStorage->expects($this->once())
				->method('getLegacyFile')
				->with('userId', 42)
				->willReturn($this->createMock(ISimpleFile::class));
		} else {
			$metaDataStorage->expects($this->once())
				->method('getLegacyFile')
				->with('userId', 42)
				->willReturn(null);
		}

		$metaDataFolder = $this->createMock(ISimpleFolder::class);
		if ($folderExists) {
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willReturn($metaDataFolder);

			if (!$hasLegacyMetadataFile) {
				$metaDataFolder->expects($this->once())
					->method('fileExists')
					->with('meta.data')
					->willReturn($fileExists);
			}
		} else {
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willThrowException(new NotFoundException());

			if ($hasLegacyMetadataFile) {
				$this->appData->expects($this->once())
					->method('newFolder')
					->with('/meta-data/42')
					->willReturn($metaDataFolder);
			}
		}

		if ($expectMissingMetaDataException) {
			$this->expectException(MissingMetaDataException::class);
			$this->expectExceptionMessage('Meta-data file missing');
		} else {
			$intermediateFile = $this->createMock(ISimpleFile::class);
			$intermediateFile->expects($this->once())
				->method('putContent')
				->with('metadata-file-content');

			if ($intermediateFileExists) {
				$metaDataFolder->expects($this->once())
					->method('getFile')
					->with('intermediate.meta.data')
					->willReturn($intermediateFile);
			} else {
				$metaDataFolder->expects($this->once())
					->method('getFile')
					->with('intermediate.meta.data')
					->willThrowException(new NotFoundException());

				$metaDataFolder->expects($this->once())
					->method('newFile')
					->with('intermediate.meta.data')
					->willReturn($intermediateFile);
			}
		}

		$metaDataStorage->updateMetaDataIntoIntermediateFile('userId', 42, 'metadata-file-content');
	}

	public function updateMetaDataIntoIntermediateFileDataProvider(): array {
		return [
			[false, true,  true,  true,  false],
			[false, true,  true,  false, false],
			[false, true,  false, false, true],
			[false, false, true,  false, true],
			[true, false, false, false, false],
			[true, true, false, true, false],
			[true, true, false, false, false],
		];
	}

	/**
	 * @dataProvider deleteMetaDataDataProvider
	 *
	 * @param bool $folderExists
	 */
	public function testDeleteMetaData(bool $folderExists): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorageV1::class)
			->setMethods([
				'verifyOwner',
				'verifyFolderStructure',
				'cleanupLegacyFile',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$metaDataStorage->expects($this->once())
			->method('verifyOwner')
			->with('userId', 42);
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
			$metaDataStorage->expects($this->once())
				->method('cleanupLegacyFile')
				->with('userId', 42);
		} else {
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willThrowException(new NotFoundException());
		}

		$metaDataStorage->deleteMetaData('userId', 42);
	}

	public function deleteMetaDataDataProvider(): array {
		return [
			[true],
			[false],
		];
	}

	/**
	 * @dataProvider saveIntermediateFileDataProvider
	 *
	 * @param bool $folderExists
	 * @param bool $intermediateFileExists
	 * @param bool $intermediateFileIsEmpty
	 * @param bool $finalFileExists
	 * @param bool $expectsException
	 */
	public function testSaveIntermediateFile(bool $folderExists, bool $intermediateFileExists, bool $intermediateFileIsEmpty, bool $finalFileExists, bool $expectsException): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorageV1::class)
			->setMethods([
				'verifyOwner',
				'verifyFolderStructure',
				'cleanupLegacyFile',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$metaDataStorage->expects($this->once())
			->method('verifyOwner')
			->with('userId', 42);
		$metaDataStorage->expects($this->once())
			->method('verifyFolderStructure');

		if ($folderExists) {
			$metaDataFolder = $this->createMock(ISimpleFolder::class);
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willReturn($metaDataFolder);

			$metaDataFolder->expects($this->once())
				->method('fileExists')
				->with('intermediate.meta.data')
				->willReturn($intermediateFileExists);

			if ($intermediateFileExists) {
				$intermediateFile = $this->createMock(ISimpleFile::class);
				if ($intermediateFileIsEmpty) {
					$intermediateFile->expects($this->once())
						->method('getContent')
						->willReturn('{}');

					$metaDataFolder->expects($this->once())
						->method('getFile')
						->with('intermediate.meta.data')
						->willReturn($intermediateFile);

					$metaDataFolder->expects($this->once())
						->method('delete');
				} else {
					$intermediateFile->expects($this->exactly(2))
						->method('getContent')
						->willReturn('intermediate-file-content');

					$finalFile = $this->createMock(ISimpleFile::class);
					$finalFile->expects($this->once())
						->method('putContent')
						->with('intermediate-file-content');

					if ($finalFileExists) {
						$metaDataFolder->expects($this->exactly(2))
							->method('getFile')
							->withConsecutive(['intermediate.meta.data'], ['meta.data'])
							->willReturn($intermediateFile, $finalFile);
					} else {
						$metaDataFolder->expects($this->exactly(2))
							->method('getFile')
							->withConsecutive(['intermediate.meta.data'], ['meta.data'])
							->willReturnOnConsecutiveCalls(
								$intermediateFile,
								$this->throwException(new NotFoundException()),
							);

						$metaDataFolder->expects($this->once())
							->method('newFile')
							->with('meta.data')
							->willReturn($finalFile);
					}

					$intermediateFile->expects($this->once())
						->method('delete');
				}

				$metaDataStorage->expects($this->once())
					->method('cleanupLegacyFile')
					->with('userId', 42);
			}
		} else {
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willThrowException(new NotFoundException());
		}

		if ($expectsException) {
			$this->expectException(MissingMetaDataException::class);
			$this->expectExceptionMessage('Intermediate meta-data file missing');
		}

		$metaDataStorage->saveIntermediateFile('userId', 42);
	}

	public function saveIntermediateFileDataProvider(): array {
		return [
			[false, false, false, false, true],
			[true, false, false, false, true],
			[true, true, false, true, false],
			[true, true, true, true, false],
			[true, true, false, false, false],
			[true, true, true, false, false],
		];
	}

	/**
	 * @dataProvider deleteIntermediateFileDataProvider
	 *
	 * @param bool $folderExists
	 * @param bool $fileExists
	 */
	public function testDeleteIntermediateFile(bool $folderExists, bool $fileExists): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorageV1::class)
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
			->with('userId', 42);
		$metaDataStorage->expects($this->once())
			->method('verifyFolderStructure');

		if ($folderExists) {
			$metaDataFolder = $this->createMock(ISimpleFolder::class);
			$this->appData->expects($this->once())
				->method('getFolder')
				->with('/meta-data/42')
				->willReturn($metaDataFolder);

			$metaDataFolder->expects($this->once())
				->method('fileExists')
				->with('intermediate.meta.data')
				->willReturn($fileExists);

			if ($fileExists) {
				$intermediateFile = $this->createMock(ISimpleFile::class);
				$intermediateFile->expects($this->once())
					->method('delete');

				$metaDataFolder->expects($this->once())
					->method('getFile')
					->with('intermediate.meta.data')
					->willReturn($intermediateFile);
			}
		}

		$metaDataStorage->deleteIntermediateFile('userId', 42);
	}

	public function deleteIntermediateFileDataProvider(): array {
		return [
			[false, false],
			[true,  false],
			[true,  true],
		];
	}

	/**
	 * @dataProvider verifyOwnerDataProvider
	 *
	 * @param bool $noUserException
	 * @param bool $emptyOwnerRoot
	 * @param bool $expectsNotFoundEx
	 * @param string|null $expectedMessage
	 */
	public function testVerifyOwner(bool $noUserException, bool $emptyOwnerRoot, bool $expectsNotFoundEx, ?string $expectedMessage): void {
		if ($noUserException) {
			$this->rootFolder->expects($this->once())
				->method('getUserFolder')
				->with('userId')
				->willThrowException(new NoUserException());
		} else {
			$ownerRoot = $this->createMock(Folder::class);
			$this->rootFolder->expects($this->once())
				->method('getUserFolder')
				->with('userId')
				->willReturn($ownerRoot);

			if ($emptyOwnerRoot) {
				$ownerRoot->expects($this->once())
					->method('getById')
					->with(42)
					->willReturn([]);
			} else {
				$ownerNode = $this->createMock(Node::class);
				$ownerRoot->expects($this->once())
					->method('getById')
					->with(42)
					->willReturn([$ownerNode]);
			}
		}

		if ($expectsNotFoundEx) {
			$this->expectException(NotFoundException::class);
			$this->expectExceptionMessage($expectedMessage);
		}

		self::invokePrivate($this->metaDataStorage, 'verifyOwner', ['userId', 42]);
	}

	public function verifyOwnerDataProvider(): array {
		return [
			[true,  false, true, 'No user-root for userId'],
			[false, true,  true, 'No file for owner with ID 42'],
			[false, false, false, null],
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
		$appDataRoot->expects($this->once())
			->method('fileExists')
			->with('/meta-data')
			->willReturn($exists);

		if ($expectsNewFolder) {
			$this->appData->expects($this->once())
				->method('newFolder')
				->with('/meta-data');
		} else {
			$this->appData->expects($this->never())
				->method('newFolder');
		}

		$this->appData->expects($this->once())
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

	/**
	 * @param Exception|null $legacyOwnerException
	 * @param Exception|null $getFolderException
	 * @param Exception|null $getFileException
	 * @param bool $expectsNull
	 *
	 * @dataProvider getLegacyFileDataProvider
	 */
	public function testGetLegacyFile(?Exception $legacyOwnerException,
		?Exception $getFolderException,
		?Exception $getFileException,
		bool $expectsNull): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorageV1::class)
			->setMethods([
				'getLegacyOwnerPath',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$legacyFolder = $this->createMock(ISimpleFolder::class);
		$legacyFile = $this->createMock(ISimpleFile::class);
		if ($legacyOwnerException) {
			$metaDataStorage->expects($this->once())
				->method('getLegacyOwnerPath')
				->with('john.doe', 42)
				->willThrowException($legacyOwnerException);
		} else {
			$metaDataStorage->expects($this->once())
				->method('getLegacyOwnerPath')
				->with('john.doe', 42)
				->willReturn('legacy-path-to-metadata-folder');

			if ($getFolderException) {
				$this->appData->expects($this->once())
					->method('getFolder')
					->with('/meta-data/legacy-path-to-metadata-folder')
					->willThrowException($getFolderException);
			} else {
				$this->appData->expects($this->once())
					->method('getFolder')
					->with('/meta-data/legacy-path-to-metadata-folder')
					->willReturn($legacyFolder);

				if ($getFileException) {
					$legacyFolder->expects($this->once())
						->method('getFile')
						->with('meta.data')
						->willThrowException($getFileException);
				} else {
					$legacyFolder->expects($this->once())
						->method('getFile')
						->with('meta.data')
						->willReturn($legacyFile);
				}
			}
		}

		$actual = self::invokePrivate($metaDataStorage, 'getLegacyFile', ['john.doe', 42]);
		if ($expectsNull) {
			$this->assertNull($actual);
		} else {
			$this->assertEquals($legacyFile, $actual);
		}
	}

	public function getLegacyFileDataProvider(): array {
		return [
			[new NotFoundException(), null, null, true],
			[null, new NotFoundException(), null, true],
			[null, null, new NotFoundException(), true],
			[null, null, null, false],
		];
	}

	/**
	 * @param Exception|null $legacyOwnerException
	 * @param Exception|null $getFolderException
	 * @param bool $expectsDelete
	 *
	 * @dataProvider cleanupLegacyFileDataProvider
	 */
	public function testCleanupLegacyFile(?Exception $legacyOwnerException,
		?Exception $getFolderException,
		bool $expectsDelete): void {
		$metaDataStorage = $this->getMockBuilder(MetaDataStorageV1::class)
			->setMethods([
				'getLegacyOwnerPath',
			])
			->setConstructorArgs([
				$this->appData,
				$this->rootFolder,
			])
			->getMock();

		$legacyFolder = $this->createMock(ISimpleFolder::class);
		if ($legacyOwnerException) {
			$metaDataStorage->expects($this->once())
				->method('getLegacyOwnerPath')
				->with('john.doe', 42)
				->willThrowException($legacyOwnerException);
		} else {
			$metaDataStorage->expects($this->once())
				->method('getLegacyOwnerPath')
				->with('john.doe', 42)
				->willReturn('legacy-path-to-metadata-folder');

			if ($getFolderException) {
				$this->appData->expects($this->once())
					->method('getFolder')
					->with('/meta-data/legacy-path-to-metadata-folder')
					->willThrowException($getFolderException);
			} else {
				$this->appData->expects($this->once())
					->method('getFolder')
					->with('/meta-data/legacy-path-to-metadata-folder')
					->willReturn($legacyFolder);
			}
		}

		if ($expectsDelete) {
			$legacyFolder->expects($this->once())
				->method('delete');
		} else {
			$legacyFolder->expects($this->never())
				->method('delete');
		}

		self::invokePrivate($metaDataStorage, 'cleanupLegacyFile', ['john.doe', 42]);
	}

	public function cleanupLegacyFileDataProvider(): array {
		return [
			[new NotFoundException(), null, false],
			[null, new NotFoundException(), false],
			[null, null, true],
		];
	}
}
