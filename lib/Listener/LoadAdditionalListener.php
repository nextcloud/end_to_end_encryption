<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Listener;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\AppInfo\ConfigLexicon;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent;
use OCP\AppFramework\Services\IInitialState;
use OCP\Config\IUserConfig;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\FileInfo;
use OCP\Util;

/**
 * @template-implements IEventListener<LoadAdditionalScriptsEvent|BeforeTemplateRenderedEvent>
 */
class LoadAdditionalListener implements IEventListener {

	public function __construct(
		private readonly IInitialState $initialState,
		private readonly ?string $userId,
		private readonly IUserConfig $userConfig,
	) {
	}

	public function handle(Event $event): void {
		if (!($event instanceof LoadAdditionalScriptsEvent) && !($event instanceof BeforeTemplateRenderedEvent)) {
			return;
		}

		if (($event instanceof BeforeTemplateRenderedEvent) && $event->getScope() === BeforeTemplateRenderedEvent::SCOPE_PUBLIC_SHARE_AUTH) {
			return;
		}

		if ($event instanceof BeforeTemplateRenderedEvent) {
			$node = $event->getShare()->getNode();
			if ($node->getType() === FileInfo::TYPE_FOLDER && $node->isEncrypted()) {
				Util::addStyle(Application::APP_ID, 'public-share');
			}
		}

		$browserE2eeEnabled = $this->userId === null
			|| $this->userConfig->getValueBool($this->userId, Application::APP_ID, ConfigLexicon::E2EE_IN_BROWSER_ENABLED);

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
