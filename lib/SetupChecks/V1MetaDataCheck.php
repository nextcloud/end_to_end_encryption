<?php

declare(strict_types=1);
/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\SetupChecks;

use OCA\EndToEndEncryption\V1MetaDataScanner;
use OCP\IL10N;
use OCP\IUserManager;
use OCP\SetupCheck\ISetupCheck;
use OCP\SetupCheck\SetupResult;

/**
 * Warns if there are still end-to-end encrypted folders using v1 metadata,
 * as support for v1 metadata will be dropped.
 */
class V1MetaDataCheck implements ISetupCheck {
	public function __construct(
		private readonly V1MetaDataScanner $scanner,
		private readonly IUserManager $userManager,
		private readonly IL10N $l10n,
	) {
	}

	#[\Override]
	public function getName(): string {
		return $this->l10n->t('End-to-end encryption metadata version');
	}

	#[\Override]
	public function getCategory(): string {
		return 'security';
	}

	#[\Override]
	public function run(): SetupResult {
		$users = $this->scanner->findAffectedUsers();
		if ($users === []) {
			return SetupResult::success($this->l10n->t('All end-to-end encrypted folders use the current metadata version.'));
		}

		$placeholders = [];
		$parameters = [];
		$unknownOwners = false;
		foreach ($users as $index => $userId) {
			if ($userId === null) {
				$unknownOwners = true;
				continue;
			}

			$placeholders[] = '{user' . $index . '}';
			$parameters['user' . $index] = [
				'type' => 'user',
				'id' => $userId,
				'name' => $this->userManager->getDisplayName($userId) ?? $userId,
			];
		}

		$description = $this->l10n->t('Some end-to-end encrypted folders still use the legacy v1 metadata format. Support for v1 metadata will be dropped soon, after that these folders can no longer be accessed. The affected accounts need to open their encrypted folders with an up-to-date desktop client to migrate them to v2 metadata.');
		if ($placeholders !== []) {
			$description .= "\n" . $this->l10n->t('Affected accounts: %s', [implode(', ', $placeholders)]);
		}
		if ($unknownOwners) {
			$description .= "\n" . $this->l10n->t('For some metadata the owner could not be determined, it might belong to deleted folders.');
		}
		$description .= "\n" . $this->l10n->t('Run "occ end_to_end_encryption:list-v1-metadata" for a detailed list of affected folders.');

		return SetupResult::warning($description, null, $parameters);
	}
}
