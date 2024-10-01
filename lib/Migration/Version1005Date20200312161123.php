<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Class Version1005Date20200312161123
 *
 * @package OCA\EndToEndEncryption\Migration
 */
class Version1005Date20200312161123 extends SimpleMigrationStep {

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable('e2e_encryption_lock')) {
			$table = $schema->getTable('e2e_encryption_lock');

			if ($table->hasIndex('id')) {
				$table->dropIndex('id');
			}

			// deactivated. a newer migration set id as primary key. oci does not allow a primary key and index for the same column.
			//			if (!$table->hasIndex('e2e_unique_lock')) {
			//				$table->addUniqueIndex(['id'], 'e2e_unique_lock');
			//			}
		}

		return $schema;
	}
}
