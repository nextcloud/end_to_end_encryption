<?php
declare(strict_types=1);
/**
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
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


namespace OCA\EndToEndEncryption\Db;


use OCP\AppFramework\Db\Entity;
use OCP\AppFramework\Db\Mapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

class LockMapper extends Mapper {

	/**
	 * @param IDBConnection $db
	 */
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'e2e_encryption_lock');
	}

	/**
	 * get lock by file id
	 *
	 * @param int $fileId
	 * @return LockEntity
	 * @throws ClientNotFoundException
	 */
	public function getByFileId($fileId): ?LockEntity {
		$qb = $this->db->getQueryBuilder();
		$qb
			->select('*')
			->from($this->tableName)
			->where($qb->expr()->eq('id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$result = $qb->execute();
		$row = $result->fetch();
		$result->closeCursor();
		if($row === false) {
			return null;
		}

		return LockEntity::fromRow($row);
	}

	/**
	 * insert new lock
	 *
	 * @param Entity $entity
	 * @return Entity
	 */
	public function insert(Entity $entity): Entity {

		$properties = $entity->getUpdatedFields();
		$query = $this->db->getQueryBuilder();

		$values = [];

		foreach($properties as $property => $updated) {
			$column = $entity->propertyToColumn($property);
			$getter = 'get' . ucfirst($property);
			$values[$column] = $query->createNamedParameter($entity->$getter());
		}


		$query->insert($this->tableName)->values($values);
		$query->execute();

		return $entity;
	}

}
