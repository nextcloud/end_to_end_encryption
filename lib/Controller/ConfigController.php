<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Controller;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\Config;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\FrontpageRoute;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IConfig;
use OCP\IRequest;

class ConfigController extends Controller {

	public function __construct(
		string $appName,
		IRequest $request,
		private IConfig $config,
		private ?string $userId,
		private Config $e2eConfig,
	) {
		parent::__construct($appName, $request);
	}

	#[NoAdminRequired]
	#[FrontpageRoute(verb: 'PUT', url: '/api/v1/config/{key}')]
	public function setUserConfig(string $key, string $value): JSONResponse {
		if (is_null($this->userId)) {
			return new JSONResponse([], Http::STATUS_PRECONDITION_FAILED);
		}

		if (!in_array($key, ['e2eeInBrowserEnabled', Config::DEBUG_TOOLS_ENABLED])) {
			return new JSONResponse([], Http::STATUS_PRECONDITION_FAILED);
		}

		if ($key === Config::DEBUG_TOOLS_ENABLED && $value === 'true' && !$this->e2eConfig->isDebugToolsAllowed()) {
			return new JSONResponse([], Http::STATUS_FORBIDDEN);
		}

		$this->config->setUserValue($this->userId, Application::APP_ID, $key, $value);
		return new JSONResponse([], Http::STATUS_OK);
	}
}
