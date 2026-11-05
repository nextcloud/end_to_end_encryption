<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCP\IConfig;
use OCP\IGroupManager;
use OCP\IUser;

class Config {
	public const DEBUG_TOOLS_ALLOWED = 'debug_tools_allowed';
	public const DEBUG_TOOLS_ENABLED = 'debug_tools_enabled';

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

	/**
	 * Whether the administrator allows users to enable the debugging tools.
	 */
	public function isDebugToolsAllowed(): bool {
		return $this->config->getAppValue(Application::APP_ID, self::DEBUG_TOOLS_ALLOWED, 'false') === 'true';
	}

	/**
	 * Whether the debugging tools are active for the given user,
	 * meaning they are allowed by the administrator and enabled by the user.
	 */
	public function isDebugToolsEnabled(string $userId): bool {
		return $this->isDebugToolsAllowed()
			&& $this->config->getUserValue($userId, Application::APP_ID, self::DEBUG_TOOLS_ENABLED, 'false') === 'true';
	}
}
