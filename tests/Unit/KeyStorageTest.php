<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit;

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
use Test\TestCase;

class KeyStorageTest extends TestCase {

	/** @var IAppData|\PHPUnit\Framework\MockObject\MockObject */
	private $appData;

	/** @var IUserSession|\PHPUnit\Framework\MockObject\MockObject */
	private $userSession;

	/** @var KeyStorage */
	private $keyStorage;

	protected function setUp(): void {
		parent::setUp();

		$this->appData = $this->createMock(IAppData::class);
		$this->userSession = $this->createMock(IUserSession::class);

		$this->keyStorage = new KeyStorage($this->appData, $this->userSession);
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

	/**
	 * @dataProvider publicKeyExistsDataProvider
	 *
	 * @param bool $exists
	 * @param bool $expected
	 */
	public function testPublicKeyExists(bool $exists, bool $expected): void {
		$keyStorage = new KeyStorage($this->appData, $this->userSession);

		$folder = $this->createMock(ISimpleFolder::class);
		$folder->expects($this->once())
			->method('fileExists')
			->with('jane.public.key')
			->willReturn($exists);

		$this->appData->expects($this->once())
			->method('getFolder')
			->willReturn($folder);

		$actual = $keyStorage->publicKeyExists('jane');
		$this->assertEquals($expected, $actual);
	}

	public function publicKeyExistsDataProvider(): array {
		return [
			[true, true],
			[false, false],
		];
	}

	/**
	 * @dataProvider setPublicKeyDataProvider
	 *
	 * @param bool $exists
	 * @param bool $expectsKeyExistsException
	 * @param bool $expectsNewFile
	 */
	public function testSetPublicKey(bool $exists, bool $expectsKeyExistsException, bool $expectsNewFile): void {
		$keyStorage = new KeyStorage($this->appData, $this->userSession);

		$folder = $this->createMock(ISimpleFolder::class);
		$folder->expects($this->once())
			->method('fileExists')
			->with('jane.public.key')
			->willReturn($exists);

		$matcher = $this->exactly(2);
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
		if ($expectsKeyExistsException) {
			$this->expectException(KeyExistsException::class);
			$this->expectExceptionMessage('Public key already exists');
		}

		$keyStorage->setPublicKey('public-key-content', 'jane');
	}

	public function setPublicKeyDataProvider(): array {
		return [
			[true,  true,  false],
			[false, false, true],
		];
	}

	/**
	 * @dataProvider deletePublicKeyDataProvider
	 *
	 * @param bool $getUserReturnsNull
	 * @param string $userId
	 * @param bool $notFoundException
	 * @param bool $expectsNotPermittedException
	 * @param bool $expectDelete
	 */
	public function testDeletePublicKey(bool $getUserReturnsNull, string $userId, bool $notFoundException, bool $expectsNotPermittedException, bool $expectDelete): void {
		$keyStorage = new KeyStorage($this->appData, $this->userSession);

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

				if ($expectDelete) {
					$folder->expects($this->once())
						->method('getFile')
						->with('correct-userId.public.key')
						->willThrowException(new NotFoundException());
				} else {
					$node = $this->createMock(ISimpleFile::class);

					if ($expectDelete) {
						$node->expects($this->once())
							->method('delete');
					}

					$folder->expects($this->once())
						->method('getFile')
						->with('correct-userId.public.key')
						->willReturn($node);
				}
			}
		}


		if ($expectsNotPermittedException) {
			$this->expectException(NotPermittedException::class);
			$this->expectExceptionMessage('You are not allowed to delete the public key');
		}

		$keyStorage->deletePublicKey($userId);
	}

	public function deletePublicKeyDataProvider(): array {
		return [
			[true,  'wrong-userId',   false, true,  false],
			[false, 'wrong-userId',   false, true,  false],
			[false, 'correct-userId', false, false, true],
			[false, 'correct-userId', true,  false, false],
		];
	}

	/**
	 * @dataProvider getPrivateKeyDataProvider
	 *
	 * @param bool $getUserReturnsNull
	 * @param string $userId
	 * @param bool $expectsForbiddenException
	 */
	public function testGetPrivateKey(bool $getUserReturnsNull, string $userId, bool $expectsForbiddenException): void {
		$keyStorage = new KeyStorage($this->appData, $this->userSession);

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

			$keyStorage->getPrivateKey($userId);
		} else {
			$actual = $keyStorage->getPrivateKey($userId);
			$this->assertEquals('private-key-content', $actual);
		}
	}

	public function getPrivateKeyDataProvider(): array {
		return [
			[true,  'wrong-userId',   true],
			[false, 'wrong-userId',   true],
			[false, 'correct-userId', false],
		];
	}

	/**
	 * @dataProvider privateKeyExistsDataProvider
	 *
	 * @param bool $getUserReturnsNull
	 * @param string $userId
	 * @param bool $exists
	 * @param bool $expected
	 * @param bool $expectsForbiddenException
	 */
	public function testPrivateKeyExists(bool $getUserReturnsNull, string $userId, bool $exists, bool $expected, bool $expectsForbiddenException): void {
		$keyStorage = new KeyStorage($this->appData, $this->userSession);

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

			$keyStorage->privateKeyExists($userId);
		} else {
			$actual = $keyStorage->privateKeyExists($userId);
			$this->assertEquals($expected, $actual);
		}
	}

	public function privateKeyExistsDataProvider(): array {
		return [
			[true,  'wrong-userId',   false, false, true],
			[false, 'wrong-userId',   false, false, true],
			[false, 'correct-userId', false, false, false],
			[false, 'correct-userId', true,  true,  false],
		];
	}

	/**
	 * @dataProvider setPrivateKeyDataProvider
	 *
	 * @param bool $getUserReturnsNull
	 * @param string $userId
	 * @param bool $fileExists
	 * @param bool $expectsForbiddenException
	 * @param bool $expectsKeyExistsException
	 * @param bool $expectsPutContent
	 */
	public function testSetPrivateKey(bool $getUserReturnsNull, string $userId, bool $fileExists, bool $expectsForbiddenException, bool $expectsKeyExistsException, bool $expectsPutContent): void {
		$keyStorage = new KeyStorage($this->appData, $this->userSession);

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

		if ($expectsForbiddenException) {
			$this->expectException(ForbiddenException::class);
			$this->expectExceptionMessage('You are not allowed to write the private key');

			$keyStorage->setPrivateKey('private-key-content', $userId);
		} elseif ($expectsKeyExistsException) {
			$this->expectException(KeyExistsException::class);
			$this->expectExceptionMessage('Private key already exists');

			$keyStorage->setPrivateKey('private-key-content', $userId);
		} else {
			$keyStorage->setPrivateKey('private-key-content', $userId);
		}
	}

	public function setPrivateKeyDataProvider(): array {
		return [
			[true,  'wrong-userId',   false, true, false, false],
			[false, 'wrong-userId',   false, true, false, false],
			[false, 'correct-userId', false, false, false, true],
			[false, 'correct-userId', true,  false, true,  false],
		];
	}

	/**
	 * @dataProvider deletePrivateKeyDataProvider
	 *
	 * @param bool $getUserReturnsNull
	 * @param string $userId
	 * @param bool $fileExists
	 * @param bool $expectsNotPermittedException
	 * @param bool $expectsDelete
	 */
	public function testDeletePrivateKey(bool $getUserReturnsNull, string $userId, bool $fileExists, bool $expectsNotPermittedException, bool $expectsDelete): void {
		$keyStorage = new KeyStorage($this->appData, $this->userSession);

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

		if ($expectsNotPermittedException) {
			$this->expectException(NotPermittedException::class);
			$this->expectExceptionMessage('You are not allowed to delete the private key');

			$keyStorage->deletePrivateKey($userId);
		} else {
			$keyStorage->deletePrivateKey($userId);
		}
	}

	public function deletePrivateKeyDataProvider(): array {
		return [
			[true,  'wrong-userId',   false, true,  false],
			[false, 'wrong-userId',   false, true,  false],
			[false, 'correct-userId', false, false, false],
			[false, 'correct-userId', true,  false, true],
		];
	}

	/**
	 * @dataProvider deleteUserKeysDataProvider
	 *
	 * @param bool $publicNotFound
	 * @param bool $privateNotFound
	 * @param bool $expectsPublicDelete
	 * @param bool $expectsPrivateDelete
	 */
	public function testDeleteUserKeys(bool $publicNotFound, bool $privateNotFound, bool $expectsPublicDelete, bool $expectsPrivateDelete): void {
		$keyStorage = new KeyStorage($this->appData, $this->userSession);

		$publicKeyFolder = $this->createMock(ISimpleFolder::class);
		$privateKeyFolder = $this->createMock(ISimpleFolder::class);

		$matcher = $this->exactly(2);
		$this->appData->expects($matcher)
			->method('getFolder')
			->willReturnCallback(function (string $value) use ($matcher, $publicKeyFolder, $privateKeyFolder): ISimpleFolder {
				switch ($matcher->getInvocationCount()) {
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

		$user = $this->createMock(IUser::class);
		$user->expects($this->once())
			->method('getUID')
			->willReturn('jane');

		$keyStorage->deleteUserKeys($user);
	}

	public function deleteUserKeysDataProvider(): array {
		return [
			[false, false, true,  true],
			[false, true,  true,  false],
			[true,  false, false, true],
			[true,  true,  false, false],
		];
	}

	/**
	 * @dataProvider getRootFoldersDataProvider
	 */
	public function testGetRootFolders(bool $privateKeyExists, bool $publicKeyExists, bool $expectPrivateNewFolder, bool $expectPublicNewFolder): void {
		$matcher = $this->exactly(2);
		$this->appData->expects($matcher)
			->method('getFolder')
			->willReturnCallback(function (string $value) use ($matcher, $privateKeyExists, $publicKeyExists): ISimpleFolder {
				switch ($matcher->getInvocationCount()) {
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
				->willReturnCallback(function (string $value) use ($matcher, $privateKeyExists, $publicKeyExists): ISimpleFolder {
					switch ($matcher->getInvocationCount()) {
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

	public function getRootFoldersDataProvider(): array {
		return [
			[false, false, true,  true],
			[false, true,  true,  false],
			[true,  false, false, true],
			[true,  true,  false, false],
		];
	}
}
