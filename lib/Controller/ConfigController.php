<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Controller;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\AppInfo\ConfigLexicon;
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

		return new JSONResponse([], Http::STATUS_PRECONDITION_FAILED);
	}
}
