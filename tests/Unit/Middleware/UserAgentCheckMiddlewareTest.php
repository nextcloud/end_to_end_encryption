<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\Middleware;

use OCA\EndToEndEncryption\Attributes\E2ERestrictUserAgent;
use OCA\EndToEndEncryption\Middleware\UserAgentCheckMiddleware;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\IRequest;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class HasAnnotationController extends Controller {
	#[E2ERestrictUserAgent]
	public function methodName(): DataResponse {
		return new DataResponse();
	}
}

class HasNoAnnotationController extends Controller {
	public function methodName(): DataResponse {
		return new DataResponse();
	}
}

class UserAgentCheckMiddlewareTest extends TestCase {
	private IRequest&MockObject $request;
	private UserAgentManager&MockObject $userAgentManager;
	private UserAgentCheckMiddleware $middleware;

	protected function setUp(): void {
		parent::setUp();

		$this->request = $this->createMock(IRequest::class);
		$this->userAgentManager = $this->createMock(UserAgentManager::class);

		$this->middleware = new UserAgentCheckMiddleware($this->request, $this->userAgentManager);
	}

	/**
	 * @dataProvider beforeControllerDataProvider
	 */
	public function testBeforeController(bool $hasAnnotation, bool $supportsE2E, bool $expectException, bool $forceSupport): void {
		$this->request->expects($hasAnnotation ? $this->once() : $this->never())
			->method('getHeader')
			->willReturnMap([
				['user-agent', 'user-agent-string'],
				['x-e2ee-supported', (string)$forceSupport]
			]);

		$this->userAgentManager->method('supportsEndToEndEncryption')
			->with('user-agent-string')
			->willReturn($supportsE2E);

		if ($expectException) {
			$this->expectException(OCSForbiddenException::class);
			$this->expectExceptionMessage('Client "user-agent-string" is not allowed to access end-to-end encrypted content.');
		}

		$controller = $hasAnnotation ? new HasAnnotationController('myapp', $this->request) : new HasNoAnnotationController('myapp', $this->request);

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
