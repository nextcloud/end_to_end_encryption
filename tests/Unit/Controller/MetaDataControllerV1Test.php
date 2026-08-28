<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Controller;

use OCA\EndToEndEncryption\AccessManager;
use OCA\EndToEndEncryption\Controller\V1\MetaDataController;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\IMetaDataStorageV1;
use OCA\EndToEndEncryption\LockManagerV1;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\IRequest;
use OCP\Share\IManager as ShareManager;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class MetaDataControllerV1Test extends TestCase {


	/** @var string */
	private $appName;

	/** @var IRequest|\PHPUnit\Framework\MockObject\MockObject */
	private $request;

	/** @var string */
	private $userId;

	/** @var IMetaDataStorageV1|\PHPUnit\Framework\MockObject\MockObject */
	private $metaDataStorage;

	/** @var LockManagerV1|\PHPUnit\Framework\MockObject\MockObject */
	private $lockManager;

	/** @var LoggerInterface|\PHPUnit\Framework\MockObject\MockObject */
	private $logger;

	/** @var IL10N|\PHPUnit\Framework\MockObject\MockObject */
	private $l10n;

	/** @var ShareManager|\PHPUnit\Framework\MockObject\MockObject */
	private $shareManager;

	/** @var MetaDataController */
	private $controller;

	/** @var IRootFolder */
	private $rootFolder;

	/** @var AccessManager|\PHPUnit\Framework\MockObject\MockObject */
	private $accessManager;

	protected function setUp(): void {
		parent::setUp();

		$this->appName = 'end_to_end_encryption';
		$this->request = $this->createMock(IRequest::class);
		$this->userId = 'john.doe';
		$this->metaDataStorage = $this->createMock(IMetaDataStorageV1::class);
		$this->lockManager = $this->createMock(LockManagerV1::class);
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->l10n = $this->createMock(IL10N::class);
		$this->shareManager = $this->createMock(ShareManager::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->accessManager = $this->createMock(AccessManager::class);
		$this->accessManager->method('getOwnerId')
			->willReturn($this->userId);

		$this->controller = new MetaDataController(
			$this->appName,
			$this->request,
			$this->userId,
			$this->metaDataStorage,
			$this->lockManager,
			$this->logger,
			$this->l10n,
			$this->shareManager,
			$this->rootFolder,
			$this->accessManager,
		);
	}

	/**
	 * @param \Exception|null $metaDataStorageException
	 * @param string|null $expectedException
	 * @param string|null $expectedExceptionMessage
	 * @param bool $expectLogger
	 *
	 * @dataProvider getMetaDataDataProvider
	 */
	public function testGetMetaData(?\Exception $metaDataStorageException,
		?string $expectedException,
		?string $expectedExceptionMessage,
		bool $expectLogger): void {
		$fileId = 42;
		$metaData = 'JSON-ENCODED-META-DATA';
		if ($metaDataStorageException) {
			$this->metaDataStorage->expects($this->once())
				->method('getMetaData')
				->with('john.doe', $fileId)
				->willThrowException($metaDataStorageException);
		} else {
			$this->metaDataStorage->expects($this->once())
				->method('getMetaData')
				->with('john.doe', $fileId)
				->willReturn($metaData);
		}

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		if ($expectLogger) {
			$this->logger->expects($this->once())
				->method('critical')
				->with($metaDataStorageException->getMessage(), ['exception' => $metaDataStorageException, 'app' => $this->appName]);
		}

		if ($expectedException) {
			$this->expectException($expectedException);
			$this->expectExceptionMessage($expectedExceptionMessage);

			$this->controller->getMetaData($fileId);
		} else {
			$response = $this->controller->getMetaData($fileId);
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals([
				'meta-data' => $metaData
			], $response->getData());
		}
	}

	public function getMetaDataDataProvider(): array {
		return [
			[null, null, null, false],
			[new NotFoundException(), OCSNotFoundException::class, 'Could not find metadata for "42"', false],
			[new \Exception(), OCSBadRequestException::class, 'Cannot read metadata', true],
		];
	}

	/**
	 * @param \Exception|null $metaDataStorageException
	 * @param string|null $expectedException
	 * @param string|null $expectedExceptionMessage
	 * @param bool $expectLogger
	 * @param array|null $expectedResponseData
	 * @param int|null $expectedResponseCode
	 *
	 * @dataProvider setMetaDataDataProvider
	 */
	public function testSetMetaData(?\Exception $metaDataStorageException,
		?string $expectedException,
		?string $expectedExceptionMessage,
		bool $expectLogger,
		?array $expectedResponseData,
		?int $expectedResponseCode): void {
		$fileId = 42;
		$metaData = 'JSON-ENCODED-META-DATA';
		if ($metaDataStorageException) {
			$this->metaDataStorage->expects($this->once())
				->method('setMetaDataIntoIntermediateFile')
				->with('john.doe', $fileId, $metaData)
				->willThrowException($metaDataStorageException);
		} else {
			$this->metaDataStorage->expects($this->once())
				->method('setMetaDataIntoIntermediateFile')
				->with('john.doe', $fileId, $metaData);
		}

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		if ($expectLogger) {
			$this->logger->expects($this->once())
				->method('critical')
				->with($metaDataStorageException->getMessage(), ['exception' => $metaDataStorageException, 'app' => $this->appName]);
		}

		if ($expectedException) {
			$this->expectException($expectedException);
			$this->expectExceptionMessage($expectedExceptionMessage);

			$this->controller->setMetaData($fileId, $metaData);
		} else {
			$response = $this->controller->setMetaData($fileId, $metaData);
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals($expectedResponseData, $response->getData());
			$this->assertEquals($expectedResponseCode, $response->getStatus());
		}
	}

	public function setMetaDataDataProvider(): array {
		return [
			[null, null, null, false, ['meta-data' => 'JSON-ENCODED-META-DATA'], 200],
			[new MetaDataExistsException(), null, null, false, [], 409],
			[new NotFoundException('Exception message'), OCSNotFoundException::class, 'Exception message', false, null, null],
			[new \Exception(), OCSBadRequestException::class, 'Cannot store metadata', true, null, null],
		];
	}

	/**
	 * @param bool $isLocked
	 * @param \Exception|null $metaDataStorageException
	 * @param string|null $expectedException
	 * @param string|null $expectedExceptionMessage
	 * @param bool $expectLogger
	 *
	 * @dataProvider updateMetaDataDataProvider
	 */
	public function testUpdateMetaData(bool $isLocked,
		?\Exception $metaDataStorageException,
		?string $expectedException,
		?string $expectedExceptionMessage,
		bool $expectLogger): void {
		$fileId = 42;
		$sendToken = 'sendE2EToken';
		$metaData = 'JSON-ENCODED-META-DATA';
		$this->request->expects($this->once())
			->method('getParam')
			->with('e2e-token')
			->willReturn($sendToken);

		$this->lockManager->expects($this->once())
			->method('isLocked')
			->with($fileId, $sendToken)
			->willReturn($isLocked);

		if (!$isLocked) {
			if ($metaDataStorageException) {
				$this->metaDataStorage->expects($this->once())
					->method('updateMetaDataIntoIntermediateFile')
					->with('john.doe', $fileId, $metaData)
					->willThrowException($metaDataStorageException);
			} else {
				$this->metaDataStorage->expects($this->once())
					->method('updateMetaDataIntoIntermediateFile')
					->with('john.doe', $fileId, $metaData);
			}
		}

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		if ($expectLogger) {
			$this->logger->expects($this->once())
				->method('critical')
				->with($metaDataStorageException->getMessage(), ['exception' => $metaDataStorageException, 'app' => $this->appName]);
		}

		if ($expectedException) {
			$this->expectException($expectedException);
			$this->expectExceptionMessage($expectedExceptionMessage);

			$this->controller->updateMetaData($fileId, $metaData);
		} else {
			$response = $this->controller->updateMetaData($fileId, $metaData);
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals([
				'meta-data' => $metaData,
			], $response->getData());
		}
	}

	public function updateMetaDataDataProvider(): array {
		return [
			[false, null, null, null, false],
			[true, null, OCSForbiddenException::class, 'You are not allowed to edit the file, make sure to first lock it, and then send the right token', false],
			[false, new MissingMetaDataException(), OCSNotFoundException::class, 'Metadata-file does not exist', false],
			[false, new NotFoundException('Exception Message'), OCSNotFoundException::class, 'Exception Message', false],
			[false, new \Exception(), OCSBadRequestException::class, 'Cannot store metadata', true],
		];
	}

	/**
	 * @param \Exception|null $metaDataStorageException
	 * @param string|null $expectedException
	 * @param string|null $expectedExceptionMessage
	 * @param bool $expectLogger
	 *
	 * @dataProvider deleteMetaDataDataProvider
	 */
	public function testDeleteMetaData(?\Exception $metaDataStorageException,
		?string $expectedException,
		?string $expectedExceptionMessage,
		bool $expectLogger): void {
		$fileId = 42;
		if ($metaDataStorageException) {
			$this->metaDataStorage->expects($this->once())
				->method('updateMetaDataIntoIntermediateFile')
				->with('john.doe', $fileId, '{}')
				->willThrowException($metaDataStorageException);
		} else {
			$this->metaDataStorage->expects($this->once())
				->method('updateMetaDataIntoIntermediateFile')
				->with('john.doe', $fileId, '{}');
		}

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		if ($expectLogger) {
			$this->logger->expects($this->once())
				->method('critical')
				->with($metaDataStorageException->getMessage(), ['exception' => $metaDataStorageException, 'app' => $this->appName]);
		}

		if ($expectedException) {
			$this->expectException($expectedException);
			$this->expectExceptionMessage($expectedExceptionMessage);

			$this->controller->deleteMetaData($fileId);
		} else {
			$response = $this->controller->deleteMetaData($fileId);
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals([], $response->getData());
		}
	}

	public function deleteMetaDataDataProvider(): array {
		return [
			[null, null, null, false],
			[new NotFoundException(), OCSNotFoundException::class, 'Could not find metadata for "42"', false],
			[new NotPermittedException(), OCSForbiddenException::class, 'Only the owner can delete the metadata-file', false],
			[new \Exception(), OCSBadRequestException::class, 'Cannot delete metadata', true],
		];
	}

	/**
	 * The lock token can also be passed as a header, like on the v2 API.
	 */
	public function testDeleteMetaDataWithTokenHeader(): void {
		$this->request->method('getParam')
			->willReturn(null);
		$this->request->method('getHeader')
			->with('e2e-token')
			->willReturn('sendE2EToken');

		$this->lockManager->expects($this->once())
			->method('isLocked')
			->with(42, 'sendE2EToken', $this->userId, true)
			->willReturn(false);

		$this->metaDataStorage->expects($this->once())
			->method('updateMetaDataIntoIntermediateFile')
			->with($this->userId, 42, '{}');

		$response = $this->controller->deleteMetaData(42);
		$this->assertEquals([], $response->getData());
	}

	public function testDeleteMetaDataWithoutLock(): void {
		$this->mockL10N();
		$this->request->method('getParam')
			->with('e2e-token')
			->willReturn('sendE2EToken');

		$this->lockManager->expects($this->once())
			->method('isLocked')
			->with(42, 'sendE2EToken', $this->userId, true)
			->willReturn(true);

		$this->metaDataStorage->expects($this->never())
			->method('updateMetaDataIntoIntermediateFile');

		$this->expectException(OCSForbiddenException::class);
		$this->expectExceptionMessage('You are not allowed to edit the file, make sure to first lock it, and then send the right token');
		$this->controller->deleteMetaData(42);
	}

	/**
	 * Write access is required for every operation modifying the metadata.
	 *
	 * @dataProvider writeAccessDataProvider
	 */
	public function testWithoutWritePermission(string $method): void {
		$this->mockL10N();
		$this->accessManager->expects($this->once())
			->method('checkPermissions')
			->with(42, true)
			->willThrowException(new \InvalidArgumentException('Insufficient permissions on share'));

		$this->metaDataStorage->expects($this->never())
			->method('setMetaDataIntoIntermediateFile');
		$this->metaDataStorage->expects($this->never())
			->method('updateMetaDataIntoIntermediateFile');

		$this->expectException(OCSForbiddenException::class);
		$this->expectExceptionMessage('You are not allowed to edit the metadata of this folder');

		match ($method) {
			'setMetaData' => $this->controller->setMetaData(42, 'JSON-ENCODED-META-DATA'),
			'updateMetaData' => $this->controller->updateMetaData(42, 'JSON-ENCODED-META-DATA'),
			'deleteMetaData' => $this->controller->deleteMetaData(42),
		};
	}

	public function writeAccessDataProvider(): array {
		return [
			['setMetaData'],
			['updateMetaData'],
			['deleteMetaData'],
		];
	}

	private function mockL10N(): void {
		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});
	}
}
