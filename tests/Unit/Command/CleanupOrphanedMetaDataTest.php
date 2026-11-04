<?php

declare(strict_types=1);
/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\Command;

use OCA\EndToEndEncryption\Command\CleanupOrphanedMetaData;
use OCA\EndToEndEncryption\OrphanedMetaDataCleaner;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;
use Test\TestCase;

class CleanupOrphanedMetaDataTest extends TestCase {
	private const array ENTRIES = [
		['user' => null, 'fileId' => 42, 'path' => '42'],
		['user' => 'alice', 'fileId' => null, 'path' => 'alice/files/folder'],
	];

	private OrphanedMetaDataCleaner&MockObject $cleaner;
	private CommandTester $commandTester;

	protected function setUp(): void {
		parent::setUp();

		$this->cleaner = $this->createMock(OrphanedMetaDataCleaner::class);
		$this->commandTester = new CommandTester(new CleanupOrphanedMetaData($this->cleaner));
	}

	public function testNoOrphanedMetaData(): void {
		$this->cleaner->method('findOrphanedMetaData')
			->willReturn([]);
		$this->cleaner->expects($this->never())
			->method('deleteOrphanedMetaData');

		$this->assertSame(Command::SUCCESS, $this->commandTester->execute([]));
		$this->assertStringContainsString('No orphaned metadata found.', $this->commandTester->getDisplay());
	}

	public function testDryRun(): void {
		$this->cleaner->method('findOrphanedMetaData')
			->willReturn(self::ENTRIES);
		$this->cleaner->expects($this->never())
			->method('deleteOrphanedMetaData');

		$this->assertSame(Command::SUCCESS, $this->commandTester->execute(['--dry-run' => true]));
		$display = $this->commandTester->getDisplay();
		$this->assertStringContainsString('(unknown)', $display);
		$this->assertStringContainsString('alice/files/folder', $display);
		$this->assertStringContainsString('Found 2 orphaned metadata entries', $display);
	}

	public function testCleanup(): void {
		$this->cleaner->method('findOrphanedMetaData')
			->willReturn(self::ENTRIES);
		$deleted = [];
		$this->cleaner->expects($this->exactly(2))
			->method('deleteOrphanedMetaData')
			->willReturnCallback(static function (array $entry) use (&$deleted): void {
				$deleted[] = $entry;
			});

		$this->assertSame(Command::SUCCESS, $this->commandTester->execute([]));
		$this->assertSame(self::ENTRIES, $deleted);
		$this->assertStringContainsString('Removed 2 orphaned metadata entries.', $this->commandTester->getDisplay());
	}

	public function testCleanupFailure(): void {
		$this->cleaner->method('findOrphanedMetaData')
			->willReturn(self::ENTRIES);
		$this->cleaner->expects($this->exactly(2))
			->method('deleteOrphanedMetaData')
			->willReturnCallback(static function (array $entry): void {
				if ($entry['fileId'] === 42) {
					throw new \RuntimeException('Permission denied');
				}
			});

		$this->assertSame(Command::FAILURE, $this->commandTester->execute([]));
		$display = $this->commandTester->getDisplay();
		$this->assertStringContainsString('Could not remove the metadata "42": Permission denied', $display);
		$this->assertStringContainsString('Removed 1 orphaned metadata entries.', $display);
	}
}
