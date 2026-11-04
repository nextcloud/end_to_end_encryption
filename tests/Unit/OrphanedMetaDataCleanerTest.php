<?php

declare(strict_types=1);
/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\AuditLogger;
use OCA\EndToEndEncryption\MetaDataRoot;
use OCA\EndToEndEncryption\OrphanedMetaDataCleaner;
use OCP\Files\AppData\IAppDataFactory;
use OCP\Files\Cache\IFileAccess;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IConfig;
use OCP\IUserManager;
use OCP\Server;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;
use Test\Traits\UserTrait;

#[Group('DB')]
class OrphanedMetaDataCleanerTest extends TestCase {
	use UserTrait;

	private const string USER = 'e2ee-orphan-owner';
	private const string DELETED_USER = 'e2ee-orphan-deleted';
	private const int DELETED_FILE_ID = 999999999;

	private Folder $metaDataRoot;
	private int $encryptedFolderId;
	private AuditLogger&MockObject $auditLogger;
	private OrphanedMetaDataCleaner $cleaner;

	protected function setUp(): void {
		parent::setUp();

		$this->createUser(self::USER, 'password');
		$userFolder = Server::get(IRootFolder::class)->getUserFolder(self::USER);
		$this->encryptedFolderId = $userFolder->newFolder('encrypted')->getId();

		$appData = Server::get(IAppDataFactory::class)->get(Application::APP_ID);
		try {
			$appData->getFolder('meta-data');
		} catch (NotFoundException) {
			$appData->newFolder('meta-data');
		}

		$metaDataRoot = new MetaDataRoot(Server::get(IRootFolder::class), Server::get(IConfig::class));
		$this->metaDataRoot = $metaDataRoot->getFolder();
		$this->auditLogger = $this->createMock(AuditLogger::class);
		$this->cleaner = new OrphanedMetaDataCleaner(
			$metaDataRoot,
			Server::get(IRootFolder::class),
			Server::get(IFileAccess::class),
			Server::get(IUserManager::class),
			$this->auditLogger,
			$this->createMock(LoggerInterface::class),
		);

		$this->createMetaData((string)$this->encryptedFolderId, ['meta.data', 'meta.data.signature']);
		$this->createMetaData((string)self::DELETED_FILE_ID, ['meta.data', 'meta.data.counter', 'intermediate.meta.data']);
		$this->createMetaData(self::USER . '/files/encrypted', ['meta.data']);
		$this->createMetaData(self::USER . '/files/encrypted/deleted', ['meta.data']);
		$this->createMetaData(self::DELETED_USER . '/files/folder', ['meta.data']);
	}

	protected function tearDown(): void {
		foreach ([(string)$this->encryptedFolderId, (string)self::DELETED_FILE_ID, self::USER, self::DELETED_USER] as $path) {
			if ($this->metaDataRoot->nodeExists($path)) {
				$this->metaDataRoot->get($path)->delete();
			}
		}
		Server::get(IRootFolder::class)->getUserFolder(self::USER)->get('encrypted')->delete();

		parent::tearDown();
	}

	public function testFindOrphanedMetaData(): void {
		$this->assertEqualsCanonicalizing([
			['user' => null, 'fileId' => self::DELETED_FILE_ID, 'path' => (string)self::DELETED_FILE_ID],
			['user' => self::USER, 'fileId' => null, 'path' => self::USER . '/files/encrypted/deleted'],
			['user' => self::DELETED_USER, 'fileId' => null, 'path' => self::DELETED_USER . '/files/folder'],
		], $this->cleaner->findOrphanedMetaData());
	}

	public function testDeleteOrphanedMetaData(): void {
		$this->auditLogger->expects($this->exactly(3))
			->method('log');

		foreach ($this->cleaner->findOrphanedMetaData() as $entry) {
			$this->cleaner->deleteOrphanedMetaData($entry);
		}

		$this->assertSame([], $this->cleaner->findOrphanedMetaData());
		$this->assertFalse($this->metaDataRoot->nodeExists((string)self::DELETED_FILE_ID));
		$this->assertFalse($this->metaDataRoot->nodeExists(self::DELETED_USER));
		$this->assertFalse($this->metaDataRoot->nodeExists(self::USER . '/files/encrypted/deleted'));
		$this->assertTrue($this->metaDataRoot->nodeExists(self::USER . '/files/encrypted/meta.data'));
		$this->assertTrue($this->metaDataRoot->nodeExists($this->encryptedFolderId . '/meta.data'));
		$this->assertTrue($this->metaDataRoot->nodeExists($this->encryptedFolderId . '/meta.data.signature'));
	}

	public function testNoMetaDataRoot(): void {
		$metaDataRoot = $this->createMock(MetaDataRoot::class);
		$metaDataRoot->method('getFolder')
			->willReturn(null);
		$fileAccess = $this->createMock(IFileAccess::class);
		$fileAccess->expects($this->never())
			->method('getByFileIds');

		$cleaner = new OrphanedMetaDataCleaner(
			$metaDataRoot,
			$this->createMock(IRootFolder::class),
			$fileAccess,
			$this->createMock(IUserManager::class),
			$this->auditLogger,
			$this->createMock(LoggerInterface::class),
		);

		$this->assertSame([], $cleaner->findOrphanedMetaData());
	}

	/**
	 * @param list<string> $fileNames
	 */
	private function createMetaData(string $path, array $fileNames): void {
		$folder = $this->metaDataRoot;
		foreach (explode('/', $path) as $name) {
			$folder = $folder->nodeExists($name) ? $folder->get($name) : $folder->newFolder($name);
		}
		foreach ($fileNames as $fileName) {
			$folder->newFile($fileName, '{}');
		}
	}
}
