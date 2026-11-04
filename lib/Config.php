<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\AppInfo\ConfigLexicon;
use OCP\Config\IUserConfig;
use OCP\IAppConfig;
use OCP\IConfig;
use OCP\IGroupManager;
use OCP\IUser;

class Config {
	public function __construct(
		private readonly IConfig $config,
		private readonly IGroupManager $groupManager,
		private readonly IAppConfig $appConfig,
		private readonly IUserConfig $userConfig,
	) {
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
		return $this->appConfig->getValueBool(Application::APP_ID, ConfigLexicon::DEBUG_TOOLS_ALLOWED);
	}

	/**
	 * Whether the debugging tools are active for the given user,
	 * meaning they are allowed by the administrator and enabled by the user.
	 */
	public function isDebugToolsEnabled(string $userId): bool {
		return $this->isDebugToolsAllowed()
			&& $this->userConfig->getValueBool($userId, Application::APP_ID, ConfigLexicon::DEBUG_TOOLS_ENABLED);
	}
}
