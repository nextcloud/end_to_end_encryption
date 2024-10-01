<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Controller;

use OCA\EndToEndEncryption\Controller\EncryptionController;
use OCA\EndToEndEncryption\EncryptionManager;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\Files\NotFoundException;
use OCP\IRequest;
use Psr\Log\LoggerInterface;
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

	/** @var LoggerInterface|\PHPUnit\Framework\MockObject\MockObject */
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
		$this->logger = $this->createMock(LoggerInterface::class);

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
			->method('critical')
			->with($exception->getMessage(), ['exception' => $exception, 'app' => $this->appName]);

		$response = $this->controller->removeEncryptionFlag($fileId);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([], $response->getData());
	}
}
