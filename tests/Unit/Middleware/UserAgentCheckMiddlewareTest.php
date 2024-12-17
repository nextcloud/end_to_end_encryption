<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\Middleware;

use OCA\EndToEndEncryption\Middleware\UserAgentCheckMiddleware;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\Utility\IControllerMethodReflector;
use OCP\IRequest;
use Test\TestCase;

class UserAgentCheckMiddlewareTest extends TestCase {

	/** @var IControllerMethodReflector|\PHPUnit\Framework\MockObject\MockObject */
	private $reflector;

	/** @var IRequest|\PHPUnit\Framework\MockObject\MockObject */
	private $request;

	/** @var UserAgentManager|\PHPUnit\Framework\MockObject\MockObject */
	private $userAgentManager;

	/** @var UserAgentCheckMiddleware */
	private $middleware;

	protected function setUp(): void {
		parent::setUp();

		$this->reflector = $this->createMock(IControllerMethodReflector::class);
		$this->request = $this->createMock(IRequest::class);
		$this->userAgentManager = $this->createMock(UserAgentManager::class);

		$this->middleware = new UserAgentCheckMiddleware($this->reflector, $this->request, $this->userAgentManager);
	}

	/**
	 * @param bool $hasAnnotation
	 * @param bool $supportsE2E
	 * @param bool $expectException
	 *
	 * @dataProvider beforeControllerDataProvider
	 */
	public function testBeforeController(bool $hasAnnotation, bool $supportsE2E, bool $expectException, bool $forceSupport) {
		$this->request->expects($hasAnnotation ? $this->once() : $this->never())
			->method('getHeader')
			->willReturnMap([
				['user-agent', 'user-agent-string'],
				['x-e2ee-supported', (string)$forceSupport]
			]);

		$this->reflector->method('hasAnnotation')
			->with('E2ERestrictUserAgent')
			->willReturn($hasAnnotation);
		$this->userAgentManager->method('supportsEndToEndEncryption')
			->with('user-agent-string')
			->willReturn($supportsE2E);

		if ($expectException) {
			$this->expectException(OCSForbiddenException::class);
			$this->expectExceptionMessage('Client "user-agent-string" is not allowed to access end-to-end encrypted content.');
		}

		$controller = $this->createMock(Controller::class);

		$this->middleware->beforeController($controller, 'methodName');
	}

	public function beforeControllerDataProvider(): array {
		return [
			[false, false, false, false],
			[false, true, false, false],
			[true, false, true, false],
			[true, true, false, false],
		];
	}
}
