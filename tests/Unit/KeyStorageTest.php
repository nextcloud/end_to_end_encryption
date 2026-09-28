<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

use OCA\EndToEndEncryption\AuditLogger;
use OCA\EndToEndEncryption\AuditOperation;
use OCA\EndToEndEncryption\Exceptions\KeyExistsException;
use OCA\EndToEndEncryption\KeyStorage;
use OCP\Files\ForbiddenException;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use OCP\IUser;
use OCP\IUserSession;
use OCP\Share\IManager;
use OCP\Share\IShare;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\MockObject\Stub;
use Test\TestCase;

#[AllowMockObjectsWithoutExpectations]
class KeyStorageTest extends TestCase {

	private IAppData&MockObject $appData;
	private IUserSession&MockObject $userSession;
	private IManager&Stub $shareManager;
	private AuditLogger&MockObject $auditLogger;
	private KeyStorage $keyStorage;

	protected function setUp(): void {
		parent::setUp();

		$this->appData = $this->createMock(IAppData::class);
		$this->userSession = $this->createMock(IUserSession::class);
		$this->shareManager = $this->createStub(IManager::class);
		$this->auditLogger = $this->createMock(AuditLogger::class);

		$this->keyStorage = new KeyStorage(
			$this->appData,
			$this->userSession,
			$this->shareManager,
			$this->auditLogger,
		);
	}

	public function testGetPublicKey(): void {
		$node = $this->createMock(ISimpleFile::class);
		$node->expects($this->once())
			->method('getContent')
			->willReturn('public-key-content');

		$publicFolder = $this->createMock(ISimpleFolder::class);
		$publicFolder->expects($this->once())
			->method('getFile')
			->with('jane.public.key')
			->willReturn($node);

		$this->appData->expects($this->once())
			->method('getFolder')
			->willReturn($publicFolder);

		$actual = $this->keyStorage->getPublicKey('jane');
		$this->assertEquals('public-key-content', $actual);
	}

	#[DataProvider('publicKeyExistsDataProvider')]
	public function testPublicKeyExists(bool $exists, bool $expected): void {
		$folder = $this->createMock(ISimpleFolder::class);
		$folder->expects($this->once())
			->method('fileExists')
			->with('jane.public.key')
			->willReturn($exists);

		$this->appData->expects($this->once())
			->method('getFolder')
			->willReturn($folder);

		$actual = $this->keyStorage->publicKeyExists('jane');
		$this->assertEquals($expected, $actual);
	}

	public static function publicKeyExistsDataProvider(): array {
		return [
			[true, true],
			[false, false],
		];
	}

	#[DataProvider('setPublicKeyDataProvider')]
	public function testSetPublicKey(bool $exists, bool $expectsKeyExistsException, bool $expectsNewFile): void {
		$folder = $this->createMock(ISimpleFolder::class);
		$folder->expects($this->once())
			->method('fileExists')
			->with('jane.public.key')
			->willReturn($exists);

		$this->exactly(2);
		$this->appData->expects($this->once())
			->method('getFolder')
			->willReturn($folder);

		if ($expectsNewFile) {
			$node = $this->createMock(ISimpleFile::class);
			$node->expects($this->once())
				->method('putContent')
				->with('public-key-content');

			$folder->expects($this->once())
				->method('newFile')
				->with('jane.public.key')
				->willReturn($node);
		}
		$this->auditLogger->expects($expectsNewFile ? $this->once() : $this->never())
			->method('log')
			->with(AuditOperation::StorePublicKey, $this->anything(), ['userId' => 'jane']);

		if ($expectsKeyExistsException) {
			$this->expectException(KeyExistsException::class);
			$this->expectExceptionMessage('Public key already exists');
		}

		$this->keyStorage->setPublicKey('public-key-content', 'jane');
	}

	public static function setPublicKeyDataProvider(): array {
		return [
			[true,  true,  false],
			[false, false, true],
		];
	}

	#[DataProvider('deletePublicKeyDataProvider')]
	public function testDeletePublicKey(bool $getUserReturnsNull, string $userId, bool $notFoundException, bool $expectsNotPermittedException, bool $expectDelete): void {
		if ($getUserReturnsNull) {
			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn(null);
		} else {
			$user = $this->createMock(IUser::class);
			$user->expects($this->once())
				->method('getUID')
				->willReturn('correct-userId');

			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn($user);

			if (!$expectsNotPermittedException) {
				$folder = $this->createMock(ISimpleFolder::class);

				$this->appData->expects($this->once())
					->method('getFolder')
					->willReturn($folder);

				if ($notFoundException) {
					$folder->expects($this->once())
						->method('getFile')
						->with('correct-userId.public.key')
						->willThrowException(new NotFoundException());
				} else {
					$node = $this->createMock(ISimpleFile::class);
					$node->expects($this->once())
						->method('delete');

					$folder->expects($this->once())
						->method('getFile')
						->with('correct-userId.public.key')
						->willReturn($node);
				}
			}
		}

		$this->auditLogger->expects($expectDelete ? $this->once() : $this->never())
			->method('log')
			->with(AuditOperation::DeletePublicKey, $this->anything(), ['userId' => 'correct-userId']);

		if ($expectsNotPermittedException) {
			$this->expectException(NotPermittedException::class);
			$this->expectExceptionMessage('You are not allowed to delete the public key');
		}

		$this->keyStorage->deletePublicKey($userId);
	}

	public static function deletePublicKeyDataProvider(): array {
		return [
			[true,  'wrong-userId',   false, true,  false],
			[false, 'wrong-userId',   false, true,  false],
			[false, 'correct-userId', false, false, true],
			[false, 'correct-userId', true,  false, false],
		];
	}

	#[DataProvider('getPrivateKeyDataProvider')]
	public function testGetPrivateKey(bool $getUserReturnsNull, string $userId, bool $expectsForbiddenException): void {
		if ($getUserReturnsNull) {
			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn(null);
		} else {
			$user = $this->createMock(IUser::class);
			$user->expects($this->once())
				->method('getUID')
				->willReturn('correct-userId');

			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn($user);

			if (!$expectsForbiddenException) {
				$privateFolder = $this->createMock(ISimpleFolder::class);

				$this->appData->expects($this->once())
					->method('getFolder')
					->willReturn($privateFolder);

				$node = $this->createMock(ISimpleFile::class);
				$node->expects($this->once())
					->method('getContent')
					->willReturn('private-key-content');

				$privateFolder->expects($this->once())
					->method('getFile')
					->with('correct-userId.private.key')
					->willReturn($node);
			}
		}

		if ($expectsForbiddenException) {
			$this->expectException(ForbiddenException::class);
			$this->expectExceptionMessage('You are not allowed to access the private key');

			$this->keyStorage->getPrivateKey($userId);
		} else {
			$actual = $this->keyStorage->getPrivateKey($userId);
			$this->assertEquals('private-key-content', $actual);
		}
	}

	public static function getPrivateKeyDataProvider(): array {
		return [
			[true,  'wrong-userId',   true],
			[false, 'wrong-userId',   true],
			[false, 'correct-userId', false],
		];
	}

	#[DataProvider('privateKeyExistsDataProvider')]
	public function testPrivateKeyExists(bool $getUserReturnsNull, string $userId, bool $exists, bool $expected, bool $expectsForbiddenException): void {
		if ($getUserReturnsNull) {
			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn(null);
		} else {
			$user = $this->createMock(IUser::class);
			$user->expects($this->once())
				->method('getUID')
				->willReturn('correct-userId');

			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn($user);

			if (!$expectsForbiddenException) {
				$folder = $this->createMock(ISimpleFolder::class);
				$folder->expects($this->once())
					->method('fileExists')
					->with('correct-userId.private.key')
					->willReturn($exists);

				$this->appData->expects($this->once())
					->method('getFolder')
					->willReturn($folder);
			}
		}

		if ($expectsForbiddenException) {
			$this->expectException(ForbiddenException::class);
			$this->expectExceptionMessage('You are not allowed to access the private key');

			$this->keyStorage->privateKeyExists($userId);
		} else {
			$actual = $this->keyStorage->privateKeyExists($userId);
			$this->assertEquals($expected, $actual);
		}
	}

	public static function privateKeyExistsDataProvider(): array {
		return [
			[true,  'wrong-userId',   false, false, true],
			[false, 'wrong-userId',   false, false, true],
			[false, 'correct-userId', false, false, false],
			[false, 'correct-userId', true,  true,  false],
		];
	}

	#[DataProvider('setPrivateKeyDataProvider')]
	public function testSetPrivateKey(bool $getUserReturnsNull, string $userId, bool $fileExists, bool $expectsForbiddenException, bool $expectsKeyExistsException, bool $expectsPutContent): void {
		if ($getUserReturnsNull) {
			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn(null);
		} else {
			$user = $this->createMock(IUser::class);
			$user->expects($this->once())
				->method('getUID')
				->willReturn('correct-userId');

			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn($user);

			if (!$expectsForbiddenException) {
				$folder = $this->createMock(ISimpleFolder::class);
				$folder->expects($this->once())
					->method('fileExists')
					->with('correct-userId.private.key')
					->willReturn($fileExists);

				$this->appData->expects($this->once())
					->method('getFolder')
					->willReturn($folder);

				if ($expectsPutContent) {
					$node = $this->createMock(ISimpleFile::class);
					$node->expects($this->once())
						->method('putContent')
						->with('private-key-content');

					$folder->expects($this->once())
						->method('newFile')
						->with('correct-userId.private.key')
						->willReturn($node);
				}
			}
		}

		$this->auditLogger->expects($expectsPutContent ? $this->once() : $this->never())
			->method('log')
			->with(AuditOperation::StorePrivateKey, $this->anything(), ['userId' => 'correct-userId']);

		if ($expectsForbiddenException) {
			$this->expectException(ForbiddenException::class);
			$this->expectExceptionMessage('You are not allowed to write the private key');

			$this->keyStorage->setPrivateKey('private-key-content', $userId);
		} elseif ($expectsKeyExistsException) {
			$this->expectException(KeyExistsException::class);
			$this->expectExceptionMessage('Private key already exists');

			$this->keyStorage->setPrivateKey('private-key-content', $userId);
		} else {
			$this->keyStorage->setPrivateKey('private-key-content', $userId);
		}
	}

	public static function setPrivateKeyDataProvider(): array {
		return [
			[true,  'wrong-userId',   false, true, false, false],
			[false, 'wrong-userId',   false, true, false, false],
			[false, 'correct-userId', false, false, false, true],
			[false, 'correct-userId', true,  false, true,  false],
		];
	}

	#[DataProvider('deletePrivateKeyDataProvider')]
	public function testDeletePrivateKey(bool $getUserReturnsNull, string $userId, bool $fileExists, bool $expectsNotPermittedException, bool $expectsDelete): void {
		if ($getUserReturnsNull) {
			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn(null);
		} else {
			$user = $this->createMock(IUser::class);
			$user->expects($this->once())
				->method('getUID')
				->willReturn('correct-userId');

			$this->userSession->expects($this->once())
				->method('getUser')
				->willReturn($user);

			if (!$expectsNotPermittedException) {
				$folder = $this->createMock(ISimpleFolder::class);
				$this->appData->expects($this->once())
					->method('getFolder')
					->willReturn($folder);

				if ($fileExists) {
					$node = $this->createMock(ISimpleFile::class);
					if ($expectsDelete) {
						$node->expects($this->once())
							->method('delete');
					}

					$folder->expects($this->once())
						->method('getFile')
						->with('correct-userId.private.key')
						->willReturn($node);
				} else {
					$folder->expects($this->once())
						->method('getFile')
						->with('correct-userId.private.key')
						->willThrowException(new NotFoundException());
				}
			}
		}

		$this->auditLogger->expects($expectsDelete ? $this->once() : $this->never())
			->method('log')
			->with(AuditOperation::DeletePrivateKey, $this->anything(), ['userId' => 'correct-userId']);

		if ($expectsNotPermittedException) {
			$this->expectException(NotPermittedException::class);
			$this->expectExceptionMessage('You are not allowed to delete the private key');

			$this->keyStorage->deletePrivateKey($userId);
		} else {
			$this->keyStorage->deletePrivateKey($userId);
		}
	}

	public static function deletePrivateKeyDataProvider(): array {
		return [
			[true,  'wrong-userId',   false, true,  false],
			[false, 'wrong-userId',   false, true,  false],
			[false, 'correct-userId', false, false, false],
			[false, 'correct-userId', true,  false, true],
		];
	}

	#[DataProvider('deleteUserKeysDataProvider')]
	public function testDeleteUserKeys(bool $publicNotFound, bool $privateNotFound, bool $expectsPublicDelete, bool $expectsPrivateDelete): void {
		$publicKeyFolder = $this->createMock(ISimpleFolder::class);
		$privateKeyFolder = $this->createMock(ISimpleFolder::class);

		$matcher = $this->exactly(2);
		$this->appData->expects($matcher)
			->method('getFolder')
			->willReturnCallback(function (string $value) use ($matcher, $publicKeyFolder, $privateKeyFolder): ISimpleFolder {
				switch ($matcher->numberOfInvocations()) {
					case 1:
						$this->assertEquals($value, '/public-keys');
						return $publicKeyFolder;
					case 2:
						$this->assertEquals($value, '/private-keys');
						return $privateKeyFolder;
				}
				$this->fail();
			});

		$publicKeyFile = $this->createMock(ISimpleFile::class);
		$privateKeyFile = $this->createMock(ISimpleFile::class);

		if ($expectsPublicDelete) {
			$publicKeyFile->expects($this->once())
				->method('delete');
		}
		if ($expectsPrivateDelete) {
			$privateKeyFile->expects($this->once())
				->method('delete');
		}

		if ($publicNotFound) {
			$publicKeyFolder->expects($this->once())
				->method('getFile')
				->with('jane.public.key')
				->willThrowException(new NotFoundException());
		} else {
			$publicKeyFolder->expects($this->once())
				->method('getFile')
				->with('jane.public.key')
				->willReturn($publicKeyFile);
		}

		if ($privateNotFound) {
			$privateKeyFolder->expects($this->once())
				->method('getFile')
				->with('jane.private.key')
				->willThrowException(new NotFoundException());
		} else {
			$privateKeyFolder->expects($this->once())
				->method('getFile')
				->with('jane.private.key')
				->willReturn($privateKeyFile);
		}

		$expectedOperations = [];
		if ($expectsPublicDelete) {
			$expectedOperations[] = AuditOperation::DeletePublicKey;
		}
		if ($expectsPrivateDelete) {
			$expectedOperations[] = AuditOperation::DeletePrivateKey;
		}
		$loggedOperations = [];
		$this->auditLogger->expects($this->exactly(count($expectedOperations)))
			->method('log')
			->willReturnCallback(function (AuditOperation $operation, string $message, array $parameters) use (&$loggedOperations): void {
				$this->assertEquals(['userId' => 'jane'], $parameters);
				$loggedOperations[] = $operation;
			});

		$user = $this->createMock(IUser::class);
		$user->expects($this->once())
			->method('getUID')
			->willReturn('jane');

		$this->keyStorage->deleteUserKeys($user);
		$this->assertEquals($expectedOperations, $loggedOperations);
	}

	public function testSetPublicKeyForShareLogsShareIdNotToken(): void {
		$share = $this->createStub(IShare::class);
		$share->method('getId')->willReturn('42');
		$this->shareManager->method('getShareByToken')->willReturn($share);

		$folder = $this->createStub(ISimpleFolder::class);
		$folder->method('fileExists')->willReturn(false);
		$folder->method('newFile')->willReturn($this->createStub(ISimpleFile::class));
		$this->appData->method('getFolder')->willReturn($folder);

		$this->auditLogger->expects($this->once())
			->method('log')
			->with(AuditOperation::StorePublicKey, $this->anything(), ['shareId' => '42', 'userId' => 'jane']);

		$this->keyStorage->setPublicKey('public-key-content', 'jane', 'share-token');
	}

	public function testDeletePrivateKeyForShareLogsShareIdNotToken(): void {
		$user = $this->createStub(IUser::class);
		$user->method('getUID')->willReturn('jane');
		$this->userSession->method('getUser')->willReturn($user);

		$share = $this->createStub(IShare::class);
		$share->method('getShareOwner')->willReturn('jane');
		$share->method('getId')->willReturn('42');
		$this->shareManager->method('getShareByToken')->willReturn($share);

		$folder = $this->createMock(ISimpleFolder::class);
		$folder->expects($this->once())
			->method('getFile')
			->with('share-token.share.private.key')
			->willReturn($this->createStub(ISimpleFile::class));
		$this->appData->method('getFolder')->willReturn($folder);

		$this->auditLogger->expects($this->once())
			->method('log')
			->with(AuditOperation::DeletePrivateKey, $this->anything(), ['shareId' => '42', 'userId' => 'jane']);

		$this->keyStorage->deletePrivateKey('jane', 'share-token');
	}

	public static function deleteUserKeysDataProvider(): array {
		return [
			[false, false, true,  true],
			[false, true,  true,  false],
			[true,  false, false, true],
			[true,  true,  false, false],
		];
	}

	#[DataProvider('getRootFoldersDataProvider')]
	public function testGetRootFolders(bool $privateKeyExists, bool $publicKeyExists, bool $expectPrivateNewFolder, bool $expectPublicNewFolder): void {
		$matcher = $this->exactly(2);
		$this->appData->expects($matcher)
			->method('getFolder')
			->willReturnCallback(function (string $value) use ($matcher, $privateKeyExists, $publicKeyExists): ISimpleFolder {
				switch ($matcher->numberOfInvocations()) {
					case 1:
						$this->assertEquals($value, '/private-keys');
						if ($privateKeyExists) {
							return $this->createMock(ISimpleFolder::class);
						} else {
							throw new NotFoundException();
						}
						// no break
					case 2:
						$this->assertEquals($value, '/public-keys');
						if ($publicKeyExists) {
							return $this->createMock(ISimpleFolder::class);
						} else {
							throw new NotFoundException();
						}
				}
				$this->fail();
			});

		if ($expectPrivateNewFolder && $expectPublicNewFolder) {
			$matcher = $this->exactly(2);
			$this->appData->expects($matcher)
				->method('newFolder')
				->willReturnCallback(function (string $value) use ($matcher): ISimpleFolder {
					switch ($matcher->numberOfInvocations()) {
						case 1:
							$this->assertEquals($value, '/private-keys');
							return $this->createMock(ISimpleFolder::class);
						case 2:
							$this->assertEquals($value, '/public-keys');
							return $this->createMock(ISimpleFolder::class);
					}
					$this->fail();
				});
		} elseif ($expectPrivateNewFolder) {
			$this->appData->expects($this->once())
				->method('newFolder')
				->with('/private-keys');
		} elseif ($expectPublicNewFolder) {
			$this->appData->expects($this->once())
				->method('newFolder')
				->with('/public-keys');
		} else {
			$this->appData->expects($this->never())
				->method('newFolder');
		}

		self::invokePrivate($this->keyStorage, 'getPrivateKeysRootFolder');
		self::invokePrivate($this->keyStorage, 'getPublicKeysRootFolder');
	}

	public static function getRootFoldersDataProvider(): array {
		return [
			[false, false, true,  true],
			[false, true,  true,  false],
			[true,  false, false, true],
			[true,  true,  false, false],
		];
	}
}
