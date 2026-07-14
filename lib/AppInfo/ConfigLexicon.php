<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\AppInfo;

use OCP\Config\Lexicon\Entry;
use OCP\Config\Lexicon\ILexicon;
use OCP\Config\Lexicon\Strictness;
use OCP\Config\ValueType;

/**
 * Config Lexicon for end_to_end_encryption app
 */
class ConfigLexicon implements ILexicon {
	public const AUTOMATIC_ROLLBACK_ENABLED = 'automatic_rollback';
	public const AUTOMATIC_ROLLBACK_TTL = 'automatic_rollback_ttl';

	#[\Override]
	public function getStrictness(): Strictness {
		return Strictness::WARNING;
	}

	#[\Override]
	public function getAppConfigs(): array {
		return [
			new Entry(
				key: self::AUTOMATIC_ROLLBACK_ENABLED,
				type: ValueType::BOOL,
				defaultRaw: true,
				definition: 'Enable automatic rollback of encrypted files',
			),
			new Entry(
				key: self::AUTOMATIC_ROLLBACK_TTL,
				type: ValueType::INT,
				defaultRaw: 60 * 60 * 24,
				definition: 'Time-to-live for automatic rollback of encrypted files',
			),
		];
	}

	#[\Override]
	public function getUserConfigs(): array {
		return [
		];
	}
}
