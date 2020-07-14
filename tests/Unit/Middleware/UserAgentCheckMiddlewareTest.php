<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
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
	public function testBeforeController(bool $hasAnnotation, bool $supportsE2E, bool $expectException) {
		$this->request->expects($this->once())
			->method('getHeader')
			->with('user-agent')
			->willReturn('user-agent-string');

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
			[false, false, false],
			[false, true, false],
			[true, false, true],
			[true, true, false],
		];
	}
}
