<?php

declare(strict_types=1);
/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IConfig;

/**
 * Resolves the app data folder that holds the metadata of all end-to-end encrypted folders.
 */
class MetaDataRoot {
	public function __construct(
		private readonly IRootFolder $rootFolder,
		private readonly IConfig $config,
	) {
	}

	public function getFolder(): ?Folder {
		$instanceId = $this->config->getSystemValueString('instanceid');
		try {
			$folder = $this->rootFolder->get('appdata_' . $instanceId . '/' . Application::APP_ID . '/meta-data');
		} catch (NotFoundException) {
			return null;
		}

		return $folder instanceof Folder ? $folder : null;
	}
}
