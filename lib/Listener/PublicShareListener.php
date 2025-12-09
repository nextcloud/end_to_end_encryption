<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Listener;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * @template-implements IEventListener<BeforeTemplateRenderedEvent>
 */
class PublicShareListener implements IEventListener {

	public function handle(Event $event): void {
		if (!($event instanceof BeforeTemplateRenderedEvent)) {
			return;
		}

		if ($event->getScope() === BeforeTemplateRenderedEvent::SCOPE_PUBLIC_SHARE_AUTH) {
			return;
		}

		if (!$event->getShare()->getNode()->isEncrypted()) {
			return;
		}

		Util::addStyle(Application::APP_ID, Application::APP_ID . '-public-share');
		Util::addInitScript(Application::APP_ID, Application::APP_ID . '-public-share');
	}
}
