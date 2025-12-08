<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Controller;

use OCA\EndToEndEncryption\Controller\MetaDataController;
use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\LockManager;
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
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class MetaDataControllerTest extends TestCase {

	private string $appName;
	private IRequest&MockObject $request;
	private string $userId;
	private IMetaDataStorage&MockObject $metaDataStorage;
	private LockManager&MockObject $lockManager;
	private LoggerInterface&MockObject $logger;
	private IL10N&MockObject $l10n;
	private ShareManager&MockObject $shareManager;
	private MetaDataController $controller;
	private IRootFolder&MockObject $rootFolder;

	protected function setUp(): void {
		parent::setUp();

		$this->appName = 'end_to_end_encryption';
		$this->request = $this->createMock(IRequest::class);
		$this->userId = 'john.doe';
		$this->metaDataStorage = $this->createMock(IMetaDataStorage::class);
		$this->lockManager = $this->createMock(LockManager::class);
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->l10n = $this->createMock(IL10N::class);
		$this->shareManager = $this->createMock(ShareManager::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);

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
		$this->request->expects($this->any())
			->method('getHeader')
			->willReturnMap([
				['e2e-token', 'e2eeToken'],
				['x-nc-e2ee-signature', 'e2eeSignature'],
			]);

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
		$signature = 'signature';
		$metaData = 'JSON-ENCODED-META-DATA';
		$this->request->expects($this->exactly(2))
			->method('getHeader')
			->willReturnMap([
				['e2e-token', $sendToken],
				['x-nc-e2ee-signature', $signature],
			]);

		$this->lockManager->expects($this->once())
			->method('isLocked')
			->with($fileId, $sendToken)
			->willReturn($isLocked);

		if (!$isLocked) {
			if ($metaDataStorageException) {
				$this->metaDataStorage->expects($this->once())
					->method('updateMetaDataIntoIntermediateFile')
					->with('john.doe', $fileId, $metaData, $sendToken, $signature)
					->willThrowException($metaDataStorageException);
			} else {
				$this->metaDataStorage->expects($this->once())
					->method('updateMetaDataIntoIntermediateFile')
					->with('john.doe', $fileId, $metaData, $sendToken, $signature);
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
				->with('john.doe', $fileId, '{}', 'e2e-token', '')
				->willThrowException($metaDataStorageException);
		} else {
			$this->metaDataStorage->expects($this->once())
				->method('updateMetaDataIntoIntermediateFile')
				->with('john.doe', $fileId, '{}', 'e2e-token', '');
		}

		$this->request->expects($this->once())
			->method('getHeader')
			->with('e2e-token')
			->willReturn('e2e-token');

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
}
