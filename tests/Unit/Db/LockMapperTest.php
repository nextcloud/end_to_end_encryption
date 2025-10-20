<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
		$qb->delete('e2e_encryption_lock')->executeStatement();

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

	public function testFindAllLocksOlderThan(): void {
		$lock1 = new Lock();
		$lock1->setId(1);
		$lock1->setTimestamp(123000);
		$lock1->setToken('token123');

		$lock2 = new Lock();
		$lock2->setId(2);
		$lock2->setTimestamp(123010);
		$lock2->setToken('token456');

		$lock3 = new Lock();
		$lock3->setId(3);
		$lock3->setTimestamp(456000);
		$lock3->setToken('token789');

		$lock4 = new Lock();
		$lock4->setId(4);
		$lock4->setTimestamp(456050);
		$lock4->setToken('token123456');

		$this->lockMapper->insert($lock1);
		$this->lockMapper->insert($lock2);
		$this->lockMapper->insert($lock3);
		$this->lockMapper->insert($lock4);

		$lockSet1 = $this->lockMapper->findAllLocksOlderThan(300000);

		$this->assertEquals($lock1->getId(), $lockSet1[0]->getId());
		$this->assertEquals($lock1->getTimestamp(), $lockSet1[0]->getTimestamp());
		$this->assertEquals($lock1->getToken(), $lockSet1[0]->getToken());
		$this->assertEquals($lock2->getId(), $lockSet1[1]->getId());
		$this->assertEquals($lock2->getTimestamp(), $lockSet1[1]->getTimestamp());
		$this->assertEquals($lock2->getToken(), $lockSet1[1]->getToken());

		$lockSet2 = $this->lockMapper->findAllLocksOlderThan(300000, 1);

		$this->assertEquals($lock1->getId(), $lockSet2[0]->getId());
		$this->assertEquals($lock1->getTimestamp(), $lockSet2[0]->getTimestamp());
		$this->assertEquals($lock1->getToken(), $lockSet2[0]->getToken());

		$lockSet3 = $this->lockMapper->findAllLocksOlderThan(300000, 1, 1);

		$this->assertEquals($lock2->getId(), $lockSet3[0]->getId());
		$this->assertEquals($lock2->getTimestamp(), $lockSet3[0]->getTimestamp());
		$this->assertEquals($lock2->getToken(), $lockSet3[0]->getToken());
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
