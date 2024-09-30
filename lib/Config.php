<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption;

use OCP\IConfig;
use OCP\IGroupManager;
use OCP\IUser;

class Config {
	private IConfig $config;
	private IGroupManager $groupManager;

	public function __construct(IConfig $config, IGroupManager $groupManager) {
		$this->config = $config;
		$this->groupManager = $groupManager;
	}

	/**
	 * @return string[]
	 */
	public function getAllowedGroupIds(): array {
		$groups = $this->config->getAppValue('end_to_end_encryption', 'allowed_groups', '[]');
		$groups = json_decode($groups, true);
		return \is_array($groups) ? $groups : [];
	}

	public function isDisabledForUser(IUser $user): bool {
		$allowedGroups = $this->getAllowedGroupIds();
		if (empty($allowedGroups)) {
			return false;
		}

		$userGroups = $this->groupManager->getUserGroupIds($user);
		return empty(array_intersect($allowedGroups, $userGroups));
	}
}
