<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OCP\Capabilities\ICapability;
use OCP\IUser;
use OCP\IUserSession;

class Capabilities implements ICapability {
	public function __construct(
		private readonly Config $config,
		private readonly IUserSession $userSession,
		private readonly IKeyStorage $keyStorage,
	) {
	}

	/**
	 * @return array{
	 *     end-to-end-encryption?: array{
	 *         enabled: true,
	 *         api-version: string,
	 *         keys-exist: bool,
	 *	   },
	 * }
	 */
	public function getCapabilities(): array {
		$user = $this->userSession->getUser();
		if (!($user instanceof IUser) || $this->config->isDisabledForUser($user)) {
			return [];
		}

		$keysExist = $this->keyStorage->publicKeyExists($user->getUID())
			&& $this->keyStorage->privateKeyExists($user->getUID());

		return [
			'end-to-end-encryption' => [
				'enabled' => true,
				'api-version' => '2.1',
				'keys-exist' => $keysExist,
			]
		];
	}
}
