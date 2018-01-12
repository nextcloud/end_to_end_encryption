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
			'/^Mozilla\/5\.0 \(Android\) Nextcloud\-android.*$/' => '',
			Request::USER_AGENT_CLIENT_DESKTOP => '',
			'/^Mozilla\/5\.0 \(iOS\) Nextcloud\-iOS.*$/' => '2.20.0',
		];
	}

	/**
	 * check whether request comes from a client which supports end-to-end encryption
	 *
	 * @param string $client
	 * @return bool
	 */
	public function supportsEndToEndEncryption($client) {
		foreach ($this->supportedUserAgents as $regex => $minVersion) {
			if (preg_match($regex, $client)) {
				return $this->checkVersion($client, $minVersion);
			}
		}

		return false;
	}

	/**
	 * check the client version
	 *
	 * @param string $client
	 * @param string $minVersion
	 * @return bool returns true if clientVersion >= minVersion or if no min Version is specified
	 */
	protected function checkVersion($client, $minVersion) {

		// no minVersion given, all client versions are compatible
		if (empty($minVersion)) {
			return true;
		}

		$version = substr( strrchr( $client, '/' ), 1 );
		if(!empty($version) && version_compare($version, $minVersion) > -1) {
			return true;
		}

		return false;

	}

}
