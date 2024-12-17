<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Controller;

use OCA\EndToEndEncryption\Controller\KeyController;
use OCA\EndToEndEncryption\Exceptions\KeyExistsException;
use OCA\EndToEndEncryption\IKeyStorage;
use OCA\EndToEndEncryption\SignatureHandler;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCS\OCSNotFoundException;
use OCP\Files\ForbiddenException;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\IRequest;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class KeyControllerTest extends TestCase {

	/** @var string */
	private $appName;

	/** @var IRequest|\PHPUnit\Framework\MockObject\MockObject */
	private $request;

	/** @var string */
	private $userId;

	/** @var IKeyStorage|\PHPUnit\Framework\MockObject\MockObject */
	private $keyStorage;

	/** @var SignatureHandler|\PHPUnit\Framework\MockObject\MockObject */
	private $signatureHandler;

	/** @var LoggerInterface|\PHPUnit\Framework\MockObject\MockObject */
	private $logger;

	/** @var IL10N|\PHPUnit\Framework\MockObject\MockObject */
	private $l10n;

	/** @var KeyController */
	private $controller;

	/** @var string valid CSR (CN set to "admin") */
	private $validCSR = '-----BEGIN CERTIFICATE REQUEST-----
MIIC7jCCAdYCAQAwgagxCzAJBgNVBAYTAlVLMREwDwYDVQQIDAhTb21lcnNldDEU
MBIGA1UEBwwLR2xhc3RvbmJ1cnkxHzAdBgNVBAoMFlRoZSBCcmFpbiBSb29tIExp
bWl0ZWQxHzAdBgNVBAsMFlBIUCBEb2N1bWVudGF0aW9uIFRlYW0xDjAMBgNVBAMM
BWFkbWluMR4wHAYJKoZIhvcNAQkBFg93ZXpAZXhhbXBsZS5jb20wggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDHWU8rWlK3lud/r5OQoilxypgIzbBf5pqM
H0rpYwFv3uctnK5Lt3M+WY45XdJt98Pq8eQ0AbyAf3IuhnpF+X2Ej3QnCenZ0H+B
J6/mZXdo9f7IXa2wH5LtA2cmm1XWQWubN/Jzr9psq+kxbocyGTQhNGeeB2OPcgyl
73eddJNIbFVlNEzbdcBNNsSwKcB+LP/JyJ9e1HZ4af6CHdX2SG1HvO+dICdEuO2E
mC9lM896MJFWwNns5mx453Y1FmxFmAi1zQAAP+AZ5Taqy6yCzqJ9Y4/FDRi1NC5V
stnu9REuPYSS8YgsJwQE/DUd+I+UonkcDfac8PIH5p5YHpMq0ChvAgMBAAGgADAN
BgkqhkiG9w0BAQUFAAOCAQEAh8YVAsAcPR5v7kv96UtkVI4xK6R9BdmVsnisxTpm
g9JVbfji7kpxbSgXfRSozTG3bl9ynrck39/2SoFQGSGrW2iV+drclftSk+uBFb1F
iXYEWJxYSz2CcUeijoBrBsarfmODgOHzmgXmCoOToz2DkdtM7g9INWkC06Do4pTQ
fqA3PS2td1gWqQCQthF9IWOCIxNI16lokVTgNCZKewXsn9Bjm3hsLLeJU9jBXyVN
w7829dr37SuA2kQb86aVpqdL50v3HjCclXd7PfWiYqajuHaIsokBV5ly2IdQo4Cz
AYzYQFPtjsDZ4Tju4VZKM4YpF2GwQgT7zhzDBvywGPqvfw==
-----END CERTIFICATE REQUEST-----
';

	/** @var string */
	private $invalidCSR = "-----BEGIN CERTIFICATE REQUEST-----\nMIIC7jCCAdYCAQAwgagxCzAJBgNVBAYTAlVLMREwDwYDVQQIDAhTb21lcnNldDEU\nMBIGA1UEBwwLR2xhc3RvbmJ1cnkxHzAdBgNVBAoMFlRoZSBCcmFpbiBSb29tIExp\nbWl0ZWQxHzAdBgNVBAsMFlBIUCBEb2N1bWVudGF0aW9uIFRlYW0xDjAMBgNVBAMM\nBWFkbWluMR4wHAYJKoZIhvcNAQkBFg93ZXpAZXhhbXBsZS5jb20wggEiMA0GCSqG\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDHWU8rWlK3lud%2Fr5OQoilxypgIzbBf5pqM\nH0rpYwFv3uctnK5Lt3M%2BWY45XdJt98Pq8eQ0AbyAf3IuhnpF%2BX2Ej3QnCenZ0H%2BB\nJ6%2FmZXdo9f7IXa2wH5LtA2cmm1XWQWubN%2FJzr9psq%2BkxbocyGTQhNGeeB2OPcgyl\n73eddJNIbFVlNEzbdcBNNsSwKcB%2BLP%2FJyJ9e1HZ4af6CHdX2SG1HvO%2BdICdEuO2E\nmC9lM896MJFWwNns5mx453Y1FmxFmAi1zQAAP%2BAZ5Taqy6yCzqJ9Y4%2FFDRi1NC5V\nstnu9REuPYSS8YgsJwQE%2FDUd%2BI%2BUonkcDfac8PIH5p5YHpMq0ChvAgMBAAGgADAN\nBgkqhkiG9w0BAQUFAAOCAQEAh8YVAsAcPR5v7kv96UtkVI4xK6R9BdmVsnisxTpm\ng9JVbfji7kpxbSgXfRSozTG3bl9ynrck39%2F2SoFQGSGrW2iV%2BdrclftSk%2BuBFb1F\niXYEWJxYSz2CcUeijoBrBsarfmODgOHzmgXmCoOToz2DkdtM7g9INWkC06Do4pTQ\nfqA3PS2td1gWqQCQthF9IWOCIxNI16lokVTgNCZKewXsn9Bjm3hsLLeJU9jBXyVN\nw7829dr37SuA2kQb86aVpqdL50v3HjCclXd7PfWiYqajuHaIsokBV5ly2IdQo4Cz\nAYzYQFPtjsDZ4Tju4VZKM4YpF2GwQgT7zhzDBvywGPqvfw%3D%3D\n-----END+CERTIFICATE+REQUEST-----\n";


	protected function setUp(): void {
		parent::setUp();

		$this->appName = 'end_to_end_encryption';
		$this->request = $this->createMock(IRequest::class);
		$this->userId = 'admin';
		$this->keyStorage = $this->createMock(IKeyStorage::class);
		$this->signatureHandler = $this->createMock(SignatureHandler::class);
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->l10n = $this->createMock(IL10N::class);

		$this->controller = new KeyController($this->appName,
			$this->request,
			$this->userId,
			$this->keyStorage,
			$this->signatureHandler,
			$this->logger,
			$this->l10n);
	}

	/**
	 * @param \Exception|null $keyStorageException
	 * @param string|null $expectedException
	 * @param string|null $expectedExceptionMessage
	 * @param bool $expectLogger
	 *
	 * @dataProvider getPrivateKeyDataProvider
	 */
	public function testGetPrivateKey(?\Exception $keyStorageException,
		?string $expectedException,
		?string $expectedExceptionMessage,
		bool $expectLogger): void {
		$privateKey = 'MY-SECRET-PRIVATE-KEY';
		if ($keyStorageException) {
			$this->keyStorage->expects($this->once())
				->method('getPrivateKey')
				->with('admin')
				->willThrowException($keyStorageException);
		} else {
			$this->keyStorage->expects($this->once())
				->method('getPrivateKey')
				->with('admin')
				->willReturn($privateKey);
		}

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		if ($expectLogger) {
			$this->logger->expects($this->once())
				->method('critical')
				->with($keyStorageException->getMessage(), ['exception' => $keyStorageException, 'app' => $this->appName]);
		}

		if ($expectedException) {
			$this->expectException($expectedException);
			$this->expectExceptionMessage($expectedExceptionMessage);

			$this->controller->getPrivateKey();
		} else {
			$response = $this->controller->getPrivateKey();
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals([
				'private-key' => $privateKey,
			], $response->getData());
		}
	}

	public function getPrivateKeyDataProvider(): array {
		return [
			[null, null, null, false],
			[new ForbiddenException('', false), OCSForbiddenException::class, 'This is someone else\'s private key', false],
			[new NotFoundException(), OCSNotFoundException::class, 'Could not find the private key of the user admin', false],
			[new \Exception(), OCSBadRequestException::class, 'Internal error', true],
		];
	}

	/**
	 * @param \Exception|null $keyStorageException
	 * @param string|null $expectedException
	 * @param string|null $expectedExceptionMessage
	 * @param bool $expectLogger
	 *
	 * @dataProvider deletePrivateKeyDataProvider
	 */
	public function testDeletePrivateKey(?\Exception $keyStorageException,
		?string $expectedException,
		?string $expectedExceptionMessage,
		bool $expectLogger): void {
		if ($keyStorageException) {
			$this->keyStorage->expects($this->once())
				->method('deletePrivateKey')
				->with('admin')
				->willThrowException($keyStorageException);
		} else {
			$this->keyStorage->expects($this->once())
				->method('deletePrivateKey')
				->with('admin');
		}

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		if ($expectLogger) {
			$this->logger->expects($this->once())
				->method('critical')
				->with($keyStorageException->getMessage(), ['exception' => $keyStorageException, 'app' => $this->appName]);
		}

		if ($expectedException) {
			$this->expectException($expectedException);
			$this->expectExceptionMessage($expectedExceptionMessage);

			$this->controller->deletePrivateKey();
		} else {
			$response = $this->controller->deletePrivateKey();
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals([], $response->getData());
		}
	}

	public function deletePrivateKeyDataProvider(): array {
		return [
			[null, null, null, false],
			[new NotPermittedException(), OCSForbiddenException::class, 'You are not allowed to delete this private key', false],
			[new NotFoundException(), OCSNotFoundException::class, 'Could not find the private key belonging to the user admin', false],
			[new \Exception(), OCSBadRequestException::class, 'Internal error', true],
		];
	}

	/**
	 * @param \Exception|null $keyStorageException
	 * @param string|null $expectedException
	 * @param string|null $expectedExceptionMessage
	 * @param bool $expectLogger
	 * @param array $expectedData
	 * @param int $expectedStatusCode
	 *
	 * @dataProvider setPrivateKeyDataProvider
	 */
	public function testSetPrivateKey(?\Exception $keyStorageException,
		?string $expectedException,
		?string $expectedExceptionMessage,
		bool $expectLogger,
		?array $expectedData,
		?int $expectedStatusCode): void {
		$privateKey = 'MY-SECRET-PRIVATE-KEY';
		if ($keyStorageException) {
			$this->keyStorage->expects($this->once())
				->method('setPrivateKey')
				->with($privateKey, 'admin')
				->willThrowException($keyStorageException);
		} else {
			$this->keyStorage->expects($this->once())
				->method('setPrivateKey')
				->with($privateKey, 'admin');
		}

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		if ($expectLogger) {
			$this->logger->expects($this->once())
				->method('critical')
				->with($keyStorageException->getMessage(), ['exception' => $keyStorageException, 'app' => $this->appName]);
		}

		if ($expectedException) {
			$this->expectException($expectedException);
			$this->expectExceptionMessage($expectedExceptionMessage);

			$this->controller->setPrivateKey($privateKey);
		} else {
			$response = $this->controller->setPrivateKey($privateKey);
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals($expectedData, $response->getData());
			$this->assertEquals($expectedStatusCode, $response->getStatus());
		}
	}

	public function setPrivateKeyDataProvider(): array {
		return [
			[null, null, null, false, ['private-key' => 'MY-SECRET-PRIVATE-KEY'], 200],
			[new KeyExistsException(), null, null, false, [], 409],
			[new \Exception(), OCSBadRequestException::class, 'Internal error', true, null, null],
		];
	}

	public function testGetPublicKeys(): void {
		$users = '["user1","user2","user3"]';

		$this->keyStorage->expects($this->exactly(4))
			->method('getPublicKey')
			->willReturnMap([
				['user1', 'USER1-PUBLIC-KEY'],
				['user2', 'USER2-PUBLIC-KEY'],
				['user3', 'USER3-PUBLIC-KEY'],
				['admin', 'JOHN.DOE-PUBLIC-KEY'],
			]);

		$response = $this->controller->getPublicKeys($users);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([
			'public-keys' => [
				'user1' => 'USER1-PUBLIC-KEY',
				'user2' => 'USER2-PUBLIC-KEY',
				'user3' => 'USER3-PUBLIC-KEY',
				'admin' => 'JOHN.DOE-PUBLIC-KEY',
			]
		], $response->getData());
	}

	public function testGetPublicKeysInvalidJSON(): void {
		$users = 'INVALID-JSON';

		$this->keyStorage->expects($this->never())
			->method('getPublicKey');

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->expectException(OCSBadRequestException::class);
		$this->expectExceptionMessage('Cannot decode userlist');

		$this->controller->getPublicKeys($users);
	}

	public function testGetPublicKeysNotFoundException(): void {
		$users = '["user1","user2","user3"]';

		$this->keyStorage->expects($this->once())
			->method('getPublicKey')
			->willThrowException(new NotFoundException());

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->expectException(OCSNotFoundException::class);
		$this->expectExceptionMessage('Could not find the public key belonging to the user user1');

		$this->controller->getPublicKeys($users);
	}

	public function testGetPublicKeysGenericException(): void {
		$users = '["user1","user2","user3"]';

		$exception = new \Exception();
		$this->keyStorage->expects($this->once())
			->method('getPublicKey')
			->willThrowException($exception);

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->logger->expects($this->once())
			->method('critical')
			->with($exception->getMessage(), ['exception' => $exception, 'app' => $this->appName]);

		$this->expectException(OCSBadRequestException::class);
		$this->expectExceptionMessage('Internal error');

		$this->controller->getPublicKeys($users);
	}

	public function testCreatePublicKeySuccessful(): void {
		$this->keyStorage->expects($this->once())
			->method('publicKeyExists')
			->with('admin')
			->willReturn(false);

		$this->signatureHandler->expects($this->once())
			->method('sign')
			->with($this->validCSR)
			->willReturn('MY-PUBLIC-KEY');

		$this->keyStorage->expects($this->once())
			->method('setPublicKey')
			->with('MY-PUBLIC-KEY', 'admin');

		$response = $this->controller->createPublicKey($this->validCSR);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([
			'public-key' => 'MY-PUBLIC-KEY',
		], $response->getData());
	}

	public function testCreatePublicKeyInvalidCN(): void {
		$controller = new KeyController($this->appName,
			$this->request,
			'user123',
			$this->keyStorage,
			$this->signatureHandler,
			$this->logger,
			$this->l10n);

		$this->keyStorage->expects($this->once())
			->method('publicKeyExists')
			->with('user123')
			->willReturn(false);

		$this->signatureHandler->expects($this->once())
			->method('sign')
			->with($this->validCSR)
			->willReturn('MY-PUBLIC-KEY');

		$this->keyStorage->expects($this->never())
			->method('setPublicKey');

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->expectException(OCSForbiddenException::class);
		$this->expectExceptionMessage('Common name (CN) does not match the current user');

		$controller->createPublicKey($this->validCSR);
	}

	public function testCreatePublicKeyInvalidCSR(): void {
		$this->keyStorage->expects($this->once())
			->method('publicKeyExists')
			->with('admin')
			->willReturn(false);

		$this->signatureHandler->expects($this->once())
			->method('sign')
			->with($this->invalidCSR)
			->willThrowException(new \BadMethodCallException());

		$this->expectException(OCSBadRequestException::class);

		$this->controller->createPublicKey($this->invalidCSR);
	}

	public function testCreatePublicKeyConflict(): void {
		$this->keyStorage->expects($this->once())
			->method('publicKeyExists')
			->with('admin')
			->willReturn(true);

		$response = $this->controller->createPublicKey($this->validCSR);
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([], $response->getData());
		$this->assertEquals(409, $response->getStatus());
	}

	/**
	 * @param \Exception|null $keyStorageException
	 * @param string|null $expectedException
	 * @param string|null $expectedExceptionMessage
	 * @param bool $expectLogger
	 *
	 * @dataProvider deletePublicKeyDataProvider
	 */
	public function testDeletePublicKey(?\Exception $keyStorageException,
		?string $expectedException,
		?string $expectedExceptionMessage,
		bool $expectLogger): void {
		if ($keyStorageException) {
			$this->keyStorage->expects($this->once())
				->method('deletePublicKey')
				->with('admin')
				->willThrowException($keyStorageException);
		} else {
			$this->keyStorage->expects($this->once())
				->method('deletePublicKey')
				->with('admin');
		}

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		if ($expectLogger) {
			$this->logger->expects($this->once())
				->method('critical')
				->with($keyStorageException->getMessage(), ['exception' => $keyStorageException, 'app' => $this->appName]);
		}

		if ($expectedException) {
			$this->expectException($expectedException);
			$this->expectExceptionMessage($expectedExceptionMessage);

			$this->controller->deletePublicKey();
		} else {
			$response = $this->controller->deletePublicKey();
			$this->assertInstanceOf(DataResponse::class, $response);
			$this->assertEquals([], $response->getData());
		}
	}

	public function deletePublicKeyDataProvider(): array {
		return [
			[null, null, null, false],
			[new NotFoundException(), OCSNotFoundException::class, 'Could not find the public key belonging to admin', false],
			[new NotPermittedException(), OCSForbiddenException::class, 'This is not your public key to delete', false],
			[new \Exception(), OCSBadRequestException::class, 'Internal error', true],
		];
	}

	public function testGetPublicServerKey(): void {
		$publicKey = 'PUBLIC-KEY';
		$this->signatureHandler->expects($this->once())
			->method('getPublicServerKey')
			->wilLReturn($publicKey);

		$response = $this->controller->getPublicServerKey();
		$this->assertInstanceOf(DataResponse::class, $response);
		$this->assertEquals([
			'public-key' => $publicKey,
		], $response->getData());
	}

	public function testGetPublicServerKeyException(): void {
		$exception = new \Exception();
		$this->signatureHandler->expects($this->once())
			->method('getPublicServerKey')
			->willThrowException($exception);

		$this->l10n->expects($this->any())
			->method('t')
			->willReturnCallback(static function ($string, $args) {
				return vsprintf($string, $args);
			});

		$this->logger->expects($this->once())
			->method('critical')
			->with($exception->getMessage());

		$this->expectException(OCSBadRequestException::class);
		$this->expectExceptionMessage('Internal error');

		$this->controller->getPublicServerKey();
	}
}
