<?php

declare(strict_types=1);
/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\SetupChecks;

use OCA\EndToEndEncryption\SetupChecks\V1MetaDataCheck;
use OCA\EndToEndEncryption\V1MetaDataScanner;
use OCP\IL10N;
use OCP\IUserManager;
use OCP\SetupCheck\SetupResult;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class V1MetaDataCheckTest extends TestCase {
	private V1MetaDataScanner&MockObject $scanner;
	private IUserManager&MockObject $userManager;
	private V1MetaDataCheck $check;

	protected function setUp(): void {
		parent::setUp();

		$this->scanner = $this->createMock(V1MetaDataScanner::class);
		$this->userManager = $this->createMock(IUserManager::class);
		$l10n = $this->createMock(IL10N::class);
		$l10n->method('t')
			->willReturnCallback(static fn (string $text, array $parameters = []): string => vsprintf($text, $parameters));

		$this->check = new V1MetaDataCheck($this->scanner, $this->userManager, $l10n);
	}

	public function testNoV1MetaData(): void {
		$this->scanner->method('findAffectedUsers')
			->willReturn([]);

		$result = $this->check->run();
		$this->assertEquals(SetupResult::SUCCESS, $result->getSeverity());
	}

	public function testV1MetaData(): void {
		$this->scanner->method('findAffectedUsers')
			->willReturn([null, 'alice', 'bob']);
		$this->userManager->method('getDisplayName')
			->willReturnMap([
				['alice', 'Alice'],
				['bob', null],
			]);

		$result = $this->check->run();
		$this->assertEquals(SetupResult::WARNING, $result->getSeverity());
		$this->assertStringContainsString('Affected accounts: {user1}, {user2}', $result->getDescription() ?? '');
		$this->assertStringContainsString('owner could not be determined', $result->getDescription() ?? '');
		$this->assertEquals([
			'user1' => ['type' => 'user', 'id' => 'alice', 'name' => 'Alice'],
			'user2' => ['type' => 'user', 'id' => 'bob', 'name' => 'bob'],
		], $result->getDescriptionParameters());
	}
}
