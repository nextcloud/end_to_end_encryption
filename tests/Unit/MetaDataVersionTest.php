<?php

declare(strict_types=1);

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\MetaDataVersion;
use PHPUnit\Framework\Attributes\DataProvider;
use Test\TestCase;

class MetaDataVersionTest extends TestCase {
	#[DataProvider('v1VersionsProvider')]
	public function testV1Versions(mixed $version): void {
		$this->assertTrue(MetaDataVersion::isV1($version));
	}

	/**
	 * @return list<array{mixed}>
	 */
	public static function v1VersionsProvider(): array {
		return [
			[1],
			[1.2],
			['1.2'],
		];
	}

	#[DataProvider('unsupportedVersionsProvider')]
	public function testUnsupportedVersions(mixed $version): void {
		$this->assertFalse(MetaDataVersion::isV1($version));
	}

	/**
	 * @return list<array{mixed}>
	 */
	public static function unsupportedVersionsProvider(): array {
		return [
			['1'],
			['2.0'],
			['2.1'],
			[2.0],
			[null],
		];
	}
}
