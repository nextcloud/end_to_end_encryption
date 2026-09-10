<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Middleware;

use OCA\EndToEndEncryption\Config;
use OCA\EndToEndEncryption\Middleware\Exceptions\CanNotUseAppException;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\RedirectResponse
use OCP\AppFramework\Http\Response;
use OCP\AppFramework\Middleware;
use OCP\AppFramework\OCS\OCSException;
use OCP\AppFramework\OCSController;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\IUserSession;

class CanUseAppMiddleware extends Middleware {
	public function __construct(
		private readonly IUserSession $userSession,
		private readonly Config $config,
		private readonly IURLGenerator $url,
	) {
	}

	/**
	 * @param Controller $controller
	 * @param string $methodName
	 *
	 * @throws CanNotUseAppException
	 */
	public function beforeController($controller, $methodName): void {
		$user = $this->userSession->getUser();
		if ($user instanceof IUser && $this->config->isDisabledForUser($user)) {
			throw new CanNotUseAppException();
		}
	}

	/**
	 * @param Controller $controller
	 * @param string $methodName
	 * @param \Exception $exception
	 * @throws \Exception
	 * @return Response
	 */
	public function afterException($controller, $methodName, \Exception $exception): Response {
		if ($exception instanceof CanNotUseAppException) {
			if ($controller instanceof OCSController) {
				throw new OCSException($exception->getMessage(), Http::STATUS_FORBIDDEN);
			}

			return new RedirectResponse($this->url->linkToDefaultPageUrl());
		}

		throw $exception;
	}
}
