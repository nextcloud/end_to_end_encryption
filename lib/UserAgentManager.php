<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption;

use OCP\IConfig;
use OCP\IRequest;

class UserAgentManager {

	/**
	 * List of user agents that support end-to-end encryption
	 * ['regex-to-identify-user-agent' => 'min-version']
	 *
	 * @var array<string, string>
	 */
	private array $supportedUserAgents;

	public function __construct(
		IConfig $config,
		private IRequest $request,
	) {
		$this->supportedUserAgents = $config->getSystemValue('end_to_end_encryption.supported-user-agents', [
			'/^Mozilla\/5\.0 \(Android\) Nextcloud\-android\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.13.0',
			'/^Mozilla\/5\.0 \([A-Za-z ]+\) (mirall|csyncoC)\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.0.0',
			'/^Mozilla\/5\.0 \(iOS\) Nextcloud\-iOS\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.0.5',
		]);
	}

	/**
	 * Check whether request comes from a client which supports end-to-end encryption
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

		if ($this->request->getHeader('x-e2ee-supported') === 'true') {
			return true;
		}

		return false;
	}

	/**
	 * @return array<string, string>
	 */
	protected function getSupportedUserAgents(): array {
		return $this->supportedUserAgents;
	}
}
