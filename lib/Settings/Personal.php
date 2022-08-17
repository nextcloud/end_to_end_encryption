<?php

declare(strict_types=1);

// SPDX-FileCopyrightText: 2022 Carl Schwan <carl@carlschwan.eu>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\EndToEndEncryption\Settings;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCA\EndToEndEncryption\IKeyStorage;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\Settings\ISettings;

class Personal implements ISettings {
	/** @var IKeyStorage */
	private $keyStorage;
	/** @var IInitialState */
	private $initialState;
	/** @var ?string */
	private $userId;

	public function __construct(IKeyStorage $keyStorage, IInitialState $initialState, ?string $userId) {
		$this->keyStorage = $keyStorage;
		$this->initialState = $initialState;
		$this->userId = $userId;
	}

	public function getForm(): TemplateResponse {
		assert($this->userId !== null, "We are always logged in inside the setting app");

		$hasKey = $this->keyStorage->publicKeyExists($this->userId)
			&& $this->keyStorage->privateKeyExists($this->userId);
		$this->initialState->provideInitialState('hasKey', $hasKey);

		return new TemplateResponse(
			Application::APP_ID,
			'settings',
			[]
		);
	}

	public function getSection(): string {
		return 'security';
	}

	public function getPriority(): int {
		return 90;
	}
}
