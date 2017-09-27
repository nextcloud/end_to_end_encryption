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
	 *
	 * @var array
	 */
	private $supportedUserAgents;

	public function __construct() {
		$this->supportedUserAgents = [
			Request::USER_AGENT_CLIENT_ANDROID,
			Request::USER_AGENT_CLIENT_DESKTOP,
			Request::USER_AGENT_CLIENT_IOS
		];
	}

	/**
	 * check whether request comes from a client which supports end-to-end encryption
	 *
	 * @param string $client
	 * @return bool
	 */
	public function supportsEndToEndEncryption($client) {
		foreach ($this->supportedUserAgents as $regex) {
			if (preg_match($regex, $client)) {
				return true;
			}
		}

		return false;
	}

}
