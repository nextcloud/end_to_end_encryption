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


namespace OCA\EndToEndEncryption;

use OC\AppFramework\Http\Request;

class UserAgentManager {

	/**
	 * list of user agents that support end-to-end encryption
	 * ['regex-to-identify-user-agent' => 'min-version']
	 *
	 * @var array
	 */
	private $supportedUserAgents;

	public function __construct() {
		$this->supportedUserAgents = [
			'/^Mozilla\/5\.0 \(Android\) Nextcloud\-android\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.13.0',
			'/^Mozilla\/5\.0 \([A-Za-z ]+\) (mirall|csyncoC)\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.0.0',
			'/^Mozilla\/5\.0 \(iOS\) Nextcloud\-iOS\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.0.5',
		];
	}

	/**
	 * check whether request comes from a client which supports end-to-end encryption
	 *
	 * @param string $client
	 * @return bool
	 */
	public function supportsEndToEndEncryption(string $client): bool {
		$supportedUAs = $this->getSupportedUserAgents();

		foreach ($supportedUAs as $regex => $minVersion) {
			$doesMatch = preg_match($regex, $client, $matches);
			if ($doesMatch === 0) {
				continue;
			}

			if (empty($minVersion)) {
				return true;
			}
			if (!isset($matches['version'])) {
				return false;
			}

			return (version_compare($matches['version'], $minVersion) > -1);
		}

		return false;
	}

	/**
	 * @return array|string[]
	 */
	protected function getSupportedUserAgents(): array {
		return $this->supportedUserAgents;
	}
}
