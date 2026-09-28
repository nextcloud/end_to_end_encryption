<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OCP\EventDispatcher\IEventDispatcher;
use OCP\Log\Audit\CriticalActionPerformedEvent;

class AuditLogger {
	public function __construct(
		private readonly IEventDispatcher $eventDispatcher,
	) {
	}

	/**
	 * Record a critical action in the audit log.
	 *
	 * The operation identifier is appended as the last parameter, so the
	 * placeholders of the message map to $parameters in their given order.
	 *
	 * @param string $message Message template with printf placeholders
	 * @param array<string, string|int> $parameters
	 */
	public function log(AuditOperation $operation, string $message, array $parameters = []): void {
		$parameters['operation'] = $operation->value;
		$this->eventDispatcher->dispatchTyped(new CriticalActionPerformedEvent($message, $parameters));
	}
}
