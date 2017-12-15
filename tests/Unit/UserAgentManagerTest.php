<?php
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

class UserAgentManagerTest extends TestCase {

	/** @var UserAgentManager */
	private $userAgentManager;

	public function setUp() {
		parent::setUp();

		$this->userAgentManager = new UserAgentManager();
	}

	/**
	 * @dataProvider dataTestCheckVersion
	 *
	 * @param string $client
	 * @param string $minVersion
	 * @param bool $expected
	 */
	public function testCheckVersion($client, $minVersion, $expected) {
		$result = $this->invokePrivate($this->userAgentManager, 'checkVersion', [$client, $minVersion]);
		$this->assertSame($expected, $result);
	}

	public function dataTestCheckVersion() {
		return [
			['Mozilla/5.0 (Android) Nextcloud-android/2.1.3', '', true],
			['Mozilla/5.0 (Android) Nextcloud-android/2.1.3', '1.9.3', true],
			['Mozilla/5.0 (Android) Nextcloud-android/2.1.3', '2.1.3', true],
			['Mozilla/5.0 (Android) Nextcloud-android/2.1.3', '2.1.4', false],
			// no valid version should result in false
			['Mozilla/5.0 (Android) Nextcloud-android/', '2.1.4', false],
			['Mozilla/5.0 (Android) Nextcloud-android/zzz', '2.1.4', false],
		];
	}


}
