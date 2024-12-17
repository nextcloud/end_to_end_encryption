<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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

		throw new OCSForbiddenException('Client "' . $userAgent . '" is not allowed to access end-to-end encrypted content.');
	}
}
