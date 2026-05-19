<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

use Nextcloud\Rector\Set\NextcloudSets;
use Rector\Config\RectorConfig;
use Rector\PHPUnit\Set\PHPUnitSetList;

return RectorConfig::configure()
	->withPaths([
		__DIR__ . '/lib',
		__DIR__ . '/tests',
	])
	->withSkip([
		__DIR__ . '/tests/stubs',
	])
	->withPreparedSets(
		deadCode: true,
		typeDeclarations: true,
	)->withPhpSets(
		php82: true,
	)->withSets([
		NextcloudSets::NEXTCLOUD_33,
		PHPUnitSetList::PHPUNIT_100,
	]);
