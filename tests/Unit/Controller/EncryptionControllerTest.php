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

namespace OCA\EndToEndEncryption\Tests\Controller;

use OCA\EndToEndEncryption\Controller\EncryptionController;
use OCA\EndToEndEncryption\EncryptionManager;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\Files\NotFoundException;
use OCP\ILogger;
use OCP\IRequest;
use Test\TestCase;

class EncryptionControllerTest extends TestCase {

	/** @var string */
	private $appName;

	/** @var IRequest|\PHPUnit\Framework\MockObject\MockObject */
	private $request;

	/** @var string */
	private $userId;

	/** @var IMetaDataStorage|\PHPUnit\Framework\MockObject\MockObject */
	private $metaDataStorage;

	/** @var EncryptionManager|\PHPUnit\Framework\MockObject\MockObject */
	private $encryptionManager;

	/** @var ILogger|\PHPUnit\Framework\MockObject\MockObject */
	private $logger;

	/** @var EncryptionController */
	private $controller;

	protected function setUp(): void {
		parent::setUp();

		$this->appName = 'end_to_end_encryption';
		$this->request = $this->createMock(IRequest::class);
		$this->userId = 'john.doe';
		$this->metaDataStorage = $this->createMock(IMetaDataStorage::class);
		$this->encryptionManager = $this->createMock(EncryptionManager::class);
		$this->logger = $this->createMock(ILogger::class);

		$this->controller = new EncryptionController($this->appName,
			$this->request,
			$this->userId,
			$this->metaDataStorage,
			$this->encryptionManager,
			$this->logger);
	}

	public function testSetEncryptionFlag(): void {
		$fileId = 42;

		$this->encryptionManager->expects($this->once())
			->method('setEncryptionFlag')
			->with($fileId);

		$response = $this->controller->setEncryptionFlag($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([], $response->getData());
	}

	public function testSetEncryptionFlagWithException(): void {
		$fileId = 42;

		$this->encryptionManager->expects($this->once())
			->method('setEncryptionFlag')
			->with($fileId)
			->willThrowException(new NotFoundException('Exception Message'));

		$this->expectException(OCSNotFoundException::class);
		$this->expectExceptionMessage('Exception Message');

		$this->controller->setEncryptionFlag($fileId);
	}

	public function testRemoveEncryptionFlag(): void {
		$fileId = 42;

		$this->encryptionManager->expects($this->once())
			->method('removeEncryptionFlag')
			->with($fileId);
		$this->metaDataStorage->expects($this->once())
			->method('deleteMetaData')
			->with($this->userId, $fileId);

		$response = $this->controller->removeEncryptionFlag($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([], $response->getData());
	}

	public function testRemoveEncryptionEncryptionManagerException(): void {
		$fileId = 42;

		$this->encryptionManager->expects($this->once())
			->method('removeEncryptionFlag')
			->with($fileId)
			->willThrowException(new NotFoundException('Exception Message'));
		$this->metaDataStorage->expects($this->never())
			->method('deleteMetaData')
			->with($this->userId, $fileId);

		$this->expectException(OCSNotFoundException::class);
		$this->expectExceptionMessage('Exception Message');

		$this->controller->removeEncryptionFlag($fileId);
	}

	public function testRemoveEncryptionMetaDataException(): void {
		$fileId = 42;

		$this->encryptionManager->expects($this->once())
			->method('removeEncryptionFlag')
			->with($fileId);
		$exception = new \Exception();
		$this->metaDataStorage->expects($this->once())
			->method('deleteMetaData')
			->with($this->userId, $fileId)
			->willThrowException($exception);

		$this->logger->expects($this->once())
			->method('logException')
			->with($exception, ['app' => $this->appName]);

		$response = $this->controller->removeEncryptionFlag($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([], $response->getData());
	}
}
