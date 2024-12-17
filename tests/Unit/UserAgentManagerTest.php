<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\UserAgentManager;
use OCP\IConfig;
use OCP\IRequest;
use Test\TestCase;

class UserAgentManagerTest extends TestCase {

	/**
	 * @param string $client
	 * @param bool $expected
	 *
	 * @dataProvider supportsEndToEndEncryptionDataProvider
	 */
	public function testSupportsEndToEndEncryption(string $client, bool $expected): void {
		/** @var IRequest&\PHPUnit\Framework\MockObject\MockObject */
		$request = $this->createMock(IRequest::class);
		$request->expects($this->any())
			->method('getHeader')
			->willReturn('');
		$userAgentManager = new UserAgentManager(\OCP\Server::get(IConfig::class), $request);
		$actual = $userAgentManager->supportsEndToEndEncryption($client);
		$this->assertEquals($expected, $actual);
	}

	/**
	 * @return array
	 */
	public function supportsEndToEndEncryptionDataProvider(): array {
		return [
			// Android
			['Mozilla/5.0 (Android) Nextcloud-android/1.9.9', false],
			['Mozilla/5.0 (Android) Nextcloud-android/2.1.3', false],
			['Mozilla/5.0 (Android) Nextcloud-android/2.3.3', false],
			['Mozilla/5.0 (Android) Nextcloud-android/2.3.4', false],
			['Mozilla/5.0 (Android) Nextcloud-android/2.4.9', false],
			['Mozilla/5.0 (Android) Nextcloud-android/3.0.0', false],
			['Mozilla/5.0 (Android) Nextcloud-android/3.13.0', true],
			['Mozilla/5.0 (Android) Nextcloud-android/3.13.1', true],
			['Mozilla/5.0 (Android) Nextcloud-android/3.14.0', true],
			// Android without version
			['Mozilla/5.0 (Android) Nextcloud-android/beta', false],
			['Mozilla/5.0 (Android) Nextcloud-android/', false],
			['Mozilla/5.0 (Android) Nextcloud-android', false],
			// iOS
			['Mozilla/5.0 (iOS) Nextcloud-iOS/1.9.9', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/2.1.3', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/2.3.3', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/2.3.4', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/2.4.9', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/3.0.0', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/3.0.5', true],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/3.1.0', true],
			// iOS without version
			['Mozilla/5.0 (iOS) Nextcloud-iOS/beta', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS', false],
			// Desktop
			['Mozilla/5.0 (Macintosh) mirall/1.9.9stable (build 20200303) (Nextcloud)', false],
			['Mozilla/5.0 (Macintosh) mirall/2.1.3rc (build 20200303)', false],
			['Mozilla/5.0 (Macintosh) mirall/2.3.3', false],
			['Mozilla/5.0 (Linux) mirall/2.3.4', false],
			['Mozilla/5.0 (Macintosh) csyncoC/2.4.9RC (build 20200303) (Nextcloud)', false],
			['Mozilla/5.0 (Macintosh) mirall/3.0.0 (build 20200303)', true],
			['Mozilla/5.0 (Macintosh) mirall/3.0.1 (build 20200303)', true],
			['Mozilla/5.0 (Macintosh) mirall/3.1.1 (build 20200303)', true],
			// Desktop without version
			['Mozilla/5.0 (Macintosh) mirall/ (build 20200303)', false],
			['Mozilla/5.0 (Macintosh) mirall/', false],
			['Mozilla/5.0 (Macintosh) mirall', false],
		];
	}
}
