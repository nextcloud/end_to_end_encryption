<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\EndToEndEncryption\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
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
			$table->addColumn('id', 'bigint', [
				'notnull' => true,
				'length' => 11,
				'unsigned' => true,
			]);
			$table->addColumn('timestamp', 'bigint', [
				'notnull' => true,
				'length' => 11,
				'unsigned' => true,
			]);
			$table->addColumn('token', 'string', [
				'notnull' => true,
				'length' => 256,
			]);
			$table->addUniqueIndex(['id'], 'e2e_unique_lock');
		}

		return $schema;
	}
}
