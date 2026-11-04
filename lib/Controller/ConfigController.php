<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Controller;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\AppInfo\ConfigLexicon;
use OCA\EndToEndEncryption\Config;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\FrontpageRoute;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Config\IUserConfig;
use OCP\IRequest;

class ConfigController extends Controller {

	public function __construct(
		string $appName,
		IRequest $request,
		private readonly ?string $userId,
		private readonly IUserConfig $userConfig,
		private readonly Config $config,
	) {
		parent::__construct($appName, $request);
	}

	#[NoAdminRequired]
	#[FrontpageRoute(verb: 'PUT', url: '/api/v1/config/{key}')]
	public function setUserConfig(string $key, string $value): JSONResponse {
		if (is_null($this->userId)) {
			return new JSONResponse([], Http::STATUS_PRECONDITION_FAILED);
		}

		if ($key === ConfigLexicon::E2EE_IN_BROWSER_ENABLED) {
			$this->userConfig->setValueBool($this->userId, Application::APP_ID, $key, $value === 'true');
			return new JSONResponse([], Http::STATUS_OK);
		}

		if ($key === ConfigLexicon::DEBUG_TOOLS_ENABLED) {
			$enabled = $value === 'true';
			if ($enabled && !$this->config->isDebugToolsAllowed()) {
				return new JSONResponse([], Http::STATUS_FORBIDDEN);
			}

			$this->userConfig->setValueBool($this->userId, Application::APP_ID, $key, $enabled);
			return new JSONResponse([], Http::STATUS_OK);
		}

		return new JSONResponse([], Http::STATUS_PRECONDITION_FAILED);
	}
}
