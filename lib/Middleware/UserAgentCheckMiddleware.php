<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Middleware;

use OCA\EndToEndEncryption\Attributes\E2ERestrictUserAgent;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Middleware;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\IRequest;
use Override;
use ReflectionMethod;

/**
 * Class UserAgentCheckMiddleware
 *
 * @package OCA\EndToEndEncryption\Middleware
 */
class UserAgentCheckMiddleware extends Middleware {
	public function __construct(
		private readonly IRequest $request,
		private readonly UserAgentManager $userAgentManager,
	) {
	}

	/**
	 * @throws OCSForbiddenException
	 */
	#[Override]
	public function beforeController(Controller $controller, string $methodName): void {
		parent::beforeController($controller, $methodName);

		$reflectionMethod = new ReflectionMethod($controller, $methodName);

		if (empty($reflectionMethod->getAttributes(E2ERestrictUserAgent::class))) {
			return;
		}

		$userAgent = $this->request->getHeader('user-agent');

		if ($this->userAgentManager->supportsEndToEndEncryption($userAgent)) {
			return;
		}

		throw new OCSForbiddenException('Client "' . $userAgent . '" is not allowed to access end-to-end encrypted content.');
	}
}
