<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\UserAgentManager;
use OCP\IConfig;
use Test\TestCase;

class UserAgentManagerTest extends TestCase {

	/**
	 * @param string $client
	 * @param bool $expected
	 *
	 * @dataProvider supportsEndToEndEncryptionDataProvider
	 */
	public function testSupportsEndToEndEncryption(string $client,
		bool $expected): void {
		$supportedUAs = $this->getSupportedUserAgents();
		$userAgentManager = $this->getUserAgentManager(['getSupportedUserAgents']);
		$userAgentManager->expects($this->once())
			->method('getSupportedUserAgents')
			->willReturn($supportedUAs);

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
			['Mozilla/5.0 (Android) Nextcloud-android/2.3.4', true],
			['Mozilla/5.0 (Android) Nextcloud-android/2.4.9', true],
			['Mozilla/5.0 (Android) Nextcloud-android/3.0.0', true],
			// Android without version
			['Mozilla/5.0 (Android) Nextcloud-android/beta', false],
			['Mozilla/5.0 (Android) Nextcloud-android/', false],
			['Mozilla/5.0 (Android) Nextcloud-android', false],
			// iOS
			['Mozilla/5.0 (iOS) Nextcloud-iOS/1.9.9', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/2.1.3', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/2.3.3', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/2.3.4', true],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/2.4.9', true],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/3.0.0', true],
			// iOS without version
			['Mozilla/5.0 (iOS) Nextcloud-iOS/beta', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS/', false],
			['Mozilla/5.0 (iOS) Nextcloud-iOS', false],
			// Desktop
			['Mozilla/5.0 (Macintosh) mirall/1.9.9stable (build 20200303) (Nextcloud)', false],
			['Mozilla/5.0 (Macintosh) mirall/2.1.3rc (build 20200303)', false],
			['Mozilla/5.0 (Macintosh) mirall/2.3.3', false],
			['Mozilla/5.0 (Linux) mirall/2.3.4', true],
			['Mozilla/5.0 (Macintosh) csyncoC/2.4.9RC (build 20200303) (Nextcloud)', true],
			['Mozilla/5.0 (Macintosh) mirall/3.0.0 (build 20200303)', true],
			// Desktop without version
			['Mozilla/5.0 (Macintosh) mirall/ (build 20200303)', false],
			['Mozilla/5.0 (Macintosh) mirall/', false],
			['Mozilla/5.0 (Macintosh) mirall', false],
		];
	}

	private function getUserAgentManager(array $mockedMethods = []) {
		if (empty($mockedMethods)) {
			return new UserAgentManager(\OCP\Server::get(IConfig::class));
		}

		return $this
			->getMockBuilder(UserAgentManager::class)
			->setMethods($mockedMethods)
			->disableOriginalConstructor()
			->getMock();
	}

	/**
	 * This function returns the user agents to test against
	 * It keeps the original regex, but replaces the exact version
	 * so this test suite doesn't break on a simple version bump
	 *
	 * @return array
	 */
	private function getSupportedUserAgents(): array {
		$userAgentManager = new UserAgentManager(\OCP\Server::get(IConfig::class));
		$originalRules = self::invokePrivate($userAgentManager, 'getSupportedUserAgents');

		foreach ($originalRules as $regex => $version) {
			$originalRules[$regex] = '2.3.4';
		}

		return $originalRules;
	}
}
