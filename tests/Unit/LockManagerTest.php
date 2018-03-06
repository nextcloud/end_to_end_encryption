<?php
/**
 * @copyright Copyright (c) 2018 Bjoern Schiessle <bjoern@schiessle.org>
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

use OCA\EndToEndEncryption\Db\LockMapper;
use OCA\EndToEndEncryption\LockManager;
use OCP\IDBConnection;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

/**
 * Class LockManagerTest
 *
 * @group DB
 */
class LockManagerTest extends TestCase {

	/** @var IDBConnection */
	private $connection;

	public function setUp() {
		parent::setUp();

		$this->connection = \OC::$server->getDatabaseConnection();

		// make sure that DB is empty
		$qb = $this->connection->getQueryBuilder();
		$qb->delete('e2e_encryption_lock')->execute();
	}

	/**
	 * @param array $mockedMethods
	 * @return LockManager|MockObject
	 */
	private function getLockManager(array $mockedMethods = []) {
		$lockMapper = new LockMapper($this->connection);
		if (empty($mockedMethods)) {
			return new LockManager(
				$lockMapper,
				\OC::$server->getSecureRandom(),
				\OC::$server->getRootFolder(),
				\OC::$server->getUserSession()
			);
		}

		return $this->getMockBuilder(LockManager::class)
			->setConstructorArgs(
				[
					$lockMapper,
					\OC::$server->getSecureRandom(),
					\OC::$server->getRootFolder(),
					\OC::$server->getUserSession()
				]
			)->setMethods($mockedMethods)->getMock();
	}


	public function testLockFileUnlockFile() {

		$lockManager = $this->getLockManager(['isLocked', 'getTimestamp']);
		$lockManager->expects($this->any())->method('isLocked')->willReturn(false);
		$lockManager->expects($this->any())->method('getTimestamp')->willReturn(1234567);

		// check if db is empty
		$qb = $this->connection->getQueryBuilder();
		$result = $qb->select('*')->from('e2e_encryption_lock')->execute();
		$this->assertEmpty($result->fetchAll(),'We need to start with an empty e2e_encryption_lock table');

		$token = $lockManager->lockFile(42);

		// make sure that we got a valid token back
		$this->assertTrue(is_string($token));
		$this->assertSame(64, strlen($token));

		//check if it is really stored in the database
		$qb = $this->connection->getQueryBuilder();
		$result = $qb->select('*')->from('e2e_encryption_lock')->execute();
		$data = $result->fetchAll();
		$this->assertSame(1, count($data));
		$this->assertSame(1234567, (int)$data[0]['timestamp']);
		$this->assertSame(42, (int)$data[0]['id']);
		$this->assertSame($token, $data[0]['token']);

		// try to lock a already locked file with a unknown token
		$this->assertEmpty($lockManager->lockFile(42));

		// try to lock with the known token
		$this->assertSame($token, $lockManager->lockFile(42, $token));

		// unlock file
		$lockManager->unlockFile(42, $token);

		//check if db is empty again
		$qb = $this->connection->getQueryBuilder();
		$result = $qb->select('*')->from('e2e_encryption_lock')->execute();
		$this->assertEmpty($result->fetchAll(), 'After all operations the e2e_encryption_lock table should be empty again');

	}


}
