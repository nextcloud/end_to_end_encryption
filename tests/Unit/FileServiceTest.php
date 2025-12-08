<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\FileService;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\Files\Storage\IStorage;
use Test\TestCase;

class FileServiceTest extends TestCase {
	/** @var FileService */
	private $fileService;

	protected function setUp(): void {
		parent::setUp();

		$this->fileService = new FileService();
	}

	public function testRevertChangesEmpty(): void {
		[$folder, [
			$file1,
			$file2,
			$file3,
			$file4,
		]] = $this->getSampleFolderForEmpty();

		$file1->expects($this->never())->method('move');
		$file1->expects($this->never())->method('delete');
		$file2->expects($this->never())->method('move');
		$file2->expects($this->never())->method('delete');
		$file3->expects($this->never())->method('move');
		$file3->expects($this->never())->method('delete');
		$file4->expects($this->never())->method('move');
		$file4->expects($this->never())->method('delete');

		$actual = $this->fileService->revertChanges($folder);
		$this->assertFalse($actual);
	}

	public function testRevertChangesNonEmpty(): void {
		[$folder, [
			$file1,
			$file2,
			$file3,
			$file4,
		]] = $this->getSampleFolderForNonEmpty();

		$file1->expects($this->never())->method('move');
		$file1->expects($this->once())->method('delete');
		$file2->expects($this->never())->method('move');
		$file2->expects($this->once())->method('delete');
		$file3->expects($this->never())->method('move');
		$file3->expects($this->never())->method('delete');
		$file4->expects($this->once())->method('move')->with('/foo/bar/a9473ded85aa51851deb4859cdd53f98');
		$file4->expects($this->never())->method('delete');

		$actual = $this->fileService->revertChanges($folder);
		$this->assertTrue($actual);
	}

	public function testFinalizeChangesEmpty(): void {
		[$folder, [
			$file1,
			$file2,
			$file3,
			$file4,
		]] = $this->getSampleFolderForEmpty();

		$file1->expects($this->never())->method('move');
		$file1->expects($this->never())->method('delete');
		$file2->expects($this->never())->method('move');
		$file2->expects($this->never())->method('delete');
		$file3->expects($this->never())->method('move');
		$file3->expects($this->never())->method('delete');
		$file4->expects($this->never())->method('move');
		$file4->expects($this->never())->method('delete');

		$actual = $this->fileService->finalizeChanges($folder);
		$this->assertFalse($actual);
	}

	public function testFinalizeChangesNonEmpty(): void {
		[$folder, [
			$file1,
			$file2,
			$file3,
			$file4,
		]] = $this->getSampleFolderForNonEmpty();

		$file1->expects($this->once())->method('move')->with('/foo/bar/7215ee9c7d9dc229d2921a40e899ec5f');
		$file1->expects($this->never())->method('delete');
		$file2->expects($this->once())->method('move')->with('/foo/bar/23b58def11b45727d3351702515f86af');
		$file2->expects($this->never())->method('delete');
		$file3->expects($this->never())->method('move');
		$file3->expects($this->never())->method('delete');
		$file4->expects($this->never())->method('move');
		$file4->expects($this->once())->method('delete');

		$actual = $this->fileService->finalizeChanges($folder);
		$this->assertEquals([4], $actual); // file 4 is deleted
	}

	private function getSampleFolderForEmpty(): array {
		$file1 = $this->createMock(Node::class);
		$file1->method('getName')->willReturn('7215ee9c7d9dc229d2921a40e899ec5f');

		$file2 = $this->createMock(Node::class);
		$file2->method('getName')->willReturn('23b58def11b45727d3351702515f86af');

		$file3 = $this->createMock(Node::class);
		$file3->method('getName')->willReturn('1545e945d5c3e7d9fa642d0a57fc8432');

		$file4 = $this->createMock(Node::class);
		$file4->method('getName')->willReturn('a9473ded85aa51851deb4859cdd53f98');

		$folder = $this->createMock(Folder::class);
		$folder->method('getDirectoryListing')->willReturn([
			$file1,
			$file2,
			$file3,
			$file4,
		]);
		$folder->method('getName')->willReturn('root');

		return [
			$folder,
			[
				$file1,
				$file2,
				$file3,
				$file4,
			],
		];
	}

	private function getSampleFolderForNonEmpty(): array {
		$storage = $this->createMock(IStorage::class);

		$file1 = $this->createMock(Node::class);
		$file1->method('getName')->willReturn('7215ee9c7d9dc229d2921a40e899ec5f.e2e-to-save');
		$file1->method('getPath')->willReturn('/foo/bar/7215ee9c7d9dc229d2921a40e899ec5f.e2e-to-save');
		$file1->method('getId')->willReturn(1);

		$file2 = $this->createMock(Node::class);
		$file2->method('getName')->willReturn('23b58def11b45727d3351702515f86af.e2e-to-save');
		$file2->method('getPath')->willReturn('/foo/bar/23b58def11b45727d3351702515f86af.e2e-to-save');
		$file2->method('getId')->willReturn(2);

		$file3 = $this->createMock(Node::class);
		$file3->method('getName')->willReturn('1545e945d5c3e7d9fa642d0a57fc8432');
		$file3->method('getId')->willReturn(3);

		$file4 = $this->createMock(Node::class);
		$file4->method('getName')->willReturn('a9473ded85aa51851deb4859cdd53f98.e2e-to-delete');
		$file4->method('getPath')->willReturn('/foo/bar/a9473ded85aa51851deb4859cdd53f98.e2e-to-delete');
		$file4->method('getStorage')->willReturn($storage);
		$file4->method('getId')->willReturn(4);

		$folder = $this->createMock(Folder::class);
		$folder->method('getDirectoryListing')->willReturn([
			$file1,
			$file2,
			$file3,
			$file4,
		]);
		$folder->method('getName')->willReturn('root');
		$folder->method('getId')->willReturn(99);

		return [
			$folder,
			[
				$file1,
				$file2,
				$file3,
				$file4,
			],
		];
	}
}
