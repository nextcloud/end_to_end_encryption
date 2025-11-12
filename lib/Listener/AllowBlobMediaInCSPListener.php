<?php

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

declare(strict_types=1);

namespace OCA\EndToEndEncryption\Listener;

use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;

/**
 * @template-implements IEventListener<Event>
 * We need it to be able to expose decrypted video and audio files in a blob URL.
 */
class AllowBlobMediaInCSPListener implements IEventListener {

	public function handle(Event $event): void {
		if (!($event instanceof AddContentSecurityPolicyEvent)) {
			return;
		}

		$csp = new ContentSecurityPolicy();
		$csp->addAllowedMediaDomain('blob:');
		// Needed for Web Workers that handle gzip compression
		$csp->addAllowedWorkerSrcDomain('blob:');
		$event->addPolicy($csp);
	}
}
