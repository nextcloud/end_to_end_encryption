<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\AuditLogger;
use OCA\EndToEndEncryption\AuditOperation;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\Log\Audit\CriticalActionPerformedEvent;
use Test\TestCase;

class AuditLoggerTest extends TestCase {

	public function testLogAppendsOperationAsLastParameter(): void {
		$dispatched = null;
		$eventDispatcher = $this->createMock(IEventDispatcher::class);
		$eventDispatcher->expects($this->once())
			->method('dispatchTyped')
			->willReturnCallback(function (CriticalActionPerformedEvent $event) use (&$dispatched): void {
				$dispatched = $event;
			});

		$auditLogger = new AuditLogger($eventDispatcher);
		$auditLogger->log(AuditOperation::DeletePrivateKey, 'Key of share "%s" owned by "%s" was deleted', ['shareId' => '42', 'userId' => 'jane']);

		$this->assertInstanceOf(CriticalActionPerformedEvent::class, $dispatched);
		$this->assertFalse($dispatched->getObfuscateParameters());
		$this->assertSame(
			['shareId' => '42', 'userId' => 'jane', 'operation' => 'e2ee_delete_private_key'],
			$dispatched->getParameters(),
		);
		// admin_audit renders the message with the parameters in order
		$this->assertSame(
			'Key of share "42" owned by "jane" was deleted',
			vsprintf($dispatched->getLogMessage(), array_values($dispatched->getParameters())),
		);
	}
}
