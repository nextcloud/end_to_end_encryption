<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Settings;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\Config;
use OCA\EndToEndEncryption\IKeyStorage;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\IConfig;
use OCP\IUserSession;
use OCP\Settings\ISettings;

class Personal implements ISettings {
	public function __construct(
		private IKeyStorage $keyStorage,
		private IInitialState $initialState,
		private ?string $userId,
		private IUserSession $userSession,
		private Config $e2eConfig,
		private IConfig $config,
	) {
	}

	public function getForm(): TemplateResponse {
		assert($this->userId !== null, 'We are always logged in inside the setting app');

		$hasKey = $this->keyStorage->publicKeyExists($this->userId)
			&& $this->keyStorage->privateKeyExists($this->userId);
		$this->initialState->provideInitialState('hasKey', $hasKey);

		$this->initialState->provideInitialState(
			'userConfig',
			[
				'e2eeInBrowserEnabled' => $this->config->getUserValue($this->userId, 'end_to_end_encryption', 'e2eeInBrowserEnabled', 'false') === 'true',
			]
		);

		$canUseApp = !$this->e2eConfig->isDisabledForUser($this->userSession->getUser());
		if ($canUseApp) {
			\OCP\Util::addStyle(Application::APP_ID, Application::APP_ID . '-settings-personal');
			\OCP\Util::addScript(Application::APP_ID, Application::APP_ID . '-settings-personal');
		}

		return new TemplateResponse(
			Application::APP_ID,
			'settings',
			['canUseApp' => $canUseApp]
		);
	}

	public function getSection(): string {
		return 'security';
	}

	public function getPriority(): int {
		return 90;
	}
}
