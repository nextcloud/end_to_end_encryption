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

use OCA\EndToEndEncryption\UserAgentManager;
use Test\TestCase;
use OCP\IConfig;

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
			return new UserAgentManager(\OC::$erver->get(IConfig::class));
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
		$userAgentManager = new UserAgentManager(\OC::$server->get(IConfig::class));
		$originalRules = self::invokePrivate($userAgentManager, 'getSupportedUserAgents');

		foreach ($originalRules as $regex => $version) {
			$originalRules[$regex] = '2.3.4';
		}

		return $originalRules;
	}
}
