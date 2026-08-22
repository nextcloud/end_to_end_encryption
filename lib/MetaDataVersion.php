<?php

declare(strict_types=1);

namespace OCA\EndToEndEncryption;

final class MetadataVersion {
	/**
	 * These are the legacy values emitted by v1 clients.
	 *
	 * The strict comparison is intentional:
	 * - 1       is supported
	 * - 1.2     is supported
	 * - '1.2'   is supported
	 * - '1'     is not silently treated as a supported legacy value
	 *
	 * @var list<int|float|string>
	 */
	private const LEGACY_V1_VERSIONS = [1, 1.2, '1.2'];

	public static function isV1(mixed $version): bool {
		return in_array($version, self::LEGACY_V1_VERSIONS, true);
	}
}
