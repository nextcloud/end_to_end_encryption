<?php


declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Listener;

use OCA\EndToEndEncryption\IKeyStorage;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Share\Events\ShareDeletedEvent;
use Psr\Log\LoggerInterface;

/**
 * @template-implements IEventListener<ShareDeletedEvent>
 */
class ShareDeletedListener implements IEventListener {

	public function __construct(
		private IKeyStorage $keyStorage,
		private LoggerInterface $logger,
	) {
	}

	public function handle(Event $event): void {
		if (!($event instanceof ShareDeletedEvent)) {
			return;
		}

		$share = $event->getShare();
		$shareToken = $share->getToken();
		if ($shareToken === null) {
			return;
		}

		try {
			$this->keyStorage->deletePrivateKey($share->getShareOwner(), $shareToken);
			$this->keyStorage->deletePublicKey($share->getShareOwner(), $shareToken);
		} catch (\Exception $e) {
			$this->logger->info(
				'Failed to delete keys for deleted share',
				['shareToken' => $shareToken, 'exception' => $e],
			);
		}
	}

}
