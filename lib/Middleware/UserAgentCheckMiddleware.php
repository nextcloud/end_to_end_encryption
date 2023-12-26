<?php

declare(strict_types=1);
/**
 * SPDX-License-Identifier: AGPL-3.0+
 *
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
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

namespace OCA\EndToEndEncryption\Middleware;

use OCA\EndToEndEncryption\UserAgentManager;
use OCP\AppFramework\Middleware;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\Utility\IControllerMethodReflector;
use OCP\IRequest;

/**
 * Class UserAgentCheckMiddleware
 *
 * @package OCA\EndToEndEncryption\Middleware
 */
class UserAgentCheckMiddleware extends Middleware {
	private IControllerMethodReflector $reflector;
	private IRequest $request;
	private UserAgentManager $userAgentManager;

	public function __construct(IControllerMethodReflector $reflector,
		IRequest $request,
		UserAgentManager $userAgentManager) {
		$this->reflector = $reflector;
		$this->request = $request;
		$this->userAgentManager = $userAgentManager;
	}

	/**
	 * @param \OCP\AppFramework\Controller $controller
	 * @param string $methodName
	 * @throws OCSForbiddenException
	 */
	public function beforeController($controller, $methodName): void {
		parent::beforeController($controller, $methodName);

		if (!$this->reflector->hasAnnotation('E2ERestrictUserAgent')) {
			return;
		}

		$userAgent = $this->request->getHeader('user-agent');

		if ($this->userAgentManager->supportsEndToEndEncryption($userAgent)) {
			return;
		}

		if ($this->request->getHeader('x-e2ee-supported') === "true") {
			return;
		}

		throw new OCSForbiddenException('Client "' . $userAgent . '" is not allowed to access end-to-end encrypted content.');
	}
}
