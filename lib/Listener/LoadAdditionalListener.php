<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Listener;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent;
use OCP\AppFramework\Services\IInitialState;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\IConfig;
use OCP\Util;

/**
 * @template-implements IEventListener<LoadAdditionalScriptsEvent|BeforeTemplateRenderedEvent>
 */
class LoadAdditionalListener implements IEventListener {

	public function __construct(
		private IInitialState $initialState,
		private IConfig $config,
		private ?string $userId,
	) {
	}

	public function handle(Event $event): void {
		if (!($event instanceof LoadAdditionalScriptsEvent) && !($event instanceof BeforeTemplateRenderedEvent)) {
			return;
		}

		if (($event instanceof BeforeTemplateRenderedEvent) && $event->getScope() === BeforeTemplateRenderedEvent::SCOPE_PUBLIC_SHARE_AUTH) {
			return;
		}

		$browserE2eeEnabled = $this->userId === null
			|| $this->config->getUserValue($this->userId, 'end_to_end_encryption', 'e2eeInBrowserEnabled', 'false') === 'true';

		$this->initialState->provideInitialState(
			'userConfig',
			[
				'e2eeInBrowserEnabled' => $browserE2eeEnabled,
			]
		);

		Util::addStyle(Application::APP_ID, Application::APP_ID . '-files');
		Util::addInitScript(Application::APP_ID, Application::APP_ID . '-files');
	}
}
