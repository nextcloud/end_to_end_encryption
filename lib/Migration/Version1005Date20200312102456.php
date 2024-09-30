<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\DB\Types;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Class Version1005Date20200312102456
 *
 * @package OCA\EndToEndEncryption\Migration
 */
class Version1005Date20200312102456 extends SimpleMigrationStep {

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if (!$schema->hasTable('e2e_encryption_lock')) {
			$table = $schema->createTable('e2e_encryption_lock');
			// Id refers to the file id of the locked folder
			// So we don't want autoincrement
			$table->addColumn('id', Types::BIGINT, [
				'notnull' => true,
				'length' => 11,
				'unsigned' => true,
			]);
			$table->addColumn('timestamp', Types::BIGINT, [
				'notnull' => true,
				'length' => 11,
				'unsigned' => true,
			]);
			$table->addColumn('token', Types::STRING, [
				'notnull' => true,
				'length' => 256,
			]);
			$table->addUniqueIndex(['id'], 'e2e_unique_lock');
		}

		return $schema;
	}
}
