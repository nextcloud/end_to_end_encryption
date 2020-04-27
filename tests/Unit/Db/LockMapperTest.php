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
namespace OCA\EndToEndEncryption\Tests\Unit\Db;

use OCA\EndToEndEncryption\Db\Lock;
use OCA\EndToEndEncryption\Db\LockMapper;
use OCP\AppFramework\Db\DoesNotExistException;
use Test\TestCase;

class LockMapperTest extends TestCase {

	/** @var LockMapper */
	private $lockMapper;

	protected function setUp(): void {
		parent::setUp();

		// make sure that DB is empty
		$qb = self::$realDatabase->getQueryBuilder();
		$qb->delete('e2e_encryption_lock')->execute();

		$this->lockMapper = new LockMapper(self::$realDatabase);
	}

	/**
	 * @Db
	 */
	public function testGetByFileId(): void {
		$lock1 = new Lock();
		$lock1->setId(1);
		$lock1->setTimestamp(123);
		$lock1->setToken('token123');

		$lock2 = new Lock();
		$lock2->setId(2);
		$lock2->setTimestamp(456);
		$lock2->setToken('token456');

		$this->lockMapper->insert($lock1);
		$this->lockMapper->insert($lock2);

		$actualLock = $this->lockMapper->getByFileId(2);

		$this->assertEquals($lock2->getId(), $actualLock->getId());
		$this->assertEquals($lock2->getTimestamp(), $actualLock->getTimestamp());
		$this->assertEquals($lock2->getToken(), $actualLock->getToken());
	}

	/**
	 * @Db
	 */
	public function testGetTableName(): void {
		$this->assertEquals('e2e_encryption_lock', $this->lockMapper->getTableName());
	}

	/**
	 * @Db
	 */
	public function testInsertUpdateDelete(): void {
		$lock1 = new Lock();
		$lock1->setId(1);
		$lock1->setTimestamp(123);
		$lock1->setToken('token123');

		$lock2 = new Lock();
		$lock2->setId(2);
		$lock2->setTimestamp(456);
		$lock2->setToken('token456');

		$lock3 = new Lock();
		$lock3->setId(3);
		$lock3->setTimestamp(789);
		$lock3->setToken('token789');

		$lock4 = new Lock();
		$lock4->setId(4);
		$lock4->setTimestamp(123456);
		$lock4->setToken('token123456');

		$this->lockMapper->insert($lock1);
		$this->lockMapper->insert($lock2);
		$this->lockMapper->insert($lock3);
		$this->lockMapper->insert($lock4);

		$testLock = $this->lockMapper->getByFileId(3);
		$this->assertEquals(789, $testLock->getTimestamp());

		$testLock->setTimestamp(789123456);
		$this->lockMapper->update($testLock);

		$testLock2 = $this->lockMapper->getByFileId(3);
		$this->assertEquals(789123456, $testLock2->getTimestamp());

		$this->lockMapper->delete($testLock2);

		$this->expectException(DoesNotExistException::class);
		$this->lockMapper->getByFileId(3);
	}
}
