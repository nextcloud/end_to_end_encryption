<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Connector\Sabre;

use OC\Files\Node\Node;
use OCA\DAV\Connector\Sabre\Directory;
use OCA\DAV\Connector\Sabre\Exception\FileLocked;
use OCA\DAV\Connector\Sabre\Exception\Forbidden;
use OCA\DAV\Connector\Sabre\File;
use OCA\DAV\Upload\FutureFile;
use OCA\EndToEndEncryption\Connector\Sabre\LockPlugin;
use OCA\EndToEndEncryption\LockManager;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IUserSession;
use Sabre\CalDAV\ICalendar;
use Sabre\DAV\INode;
use Sabre\DAV\Server;
use Sabre\HTTP\RequestInterface;
use Test\TestCase;

class LockPluginTest extends TestCase {

	private IRootFolder&\PHPUnit\Framework\MockObject\MockObject $rootFolder;
	private IUserSession&\PHPUnit\Framework\MockObject\MockObject $userSession;
	private LockManager&\PHPUnit\Framework\MockObject\MockObject $lockManager;
	private UserAgentManager&\PHPUnit\Framework\MockObject\MockObject $userAgentManager;
	private LockPlugin $plugin;

	protected function setUp(): void {
		parent::setUp();

		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->userSession = $this->createMock(IUserSession::class);
		$this->lockManager = $this->createMock(LockManager::class);
		$this->userAgentManager = $this->createMock(UserAgentManager::class);

		$this->plugin = new LockPlugin($this->rootFolder, $this->userSession, $this->lockManager, $this->userAgentManager);
	}

	public function testInitialize(): void {
		$server = $this->createMock(Server::class);

		$server->expects($this->exactly(5))
			->method('on')
			->withConsecutive(
				['beforeMethod:DELETE', [$this->plugin, 'checkLock'], 200],
				['beforeMethod:MKCOL', [$this->plugin, 'checkLock'], 200],
				['beforeMethod:PUT', [$this->plugin, 'checkLock'], 200],
				['beforeMethod:COPY', [$this->plugin, 'checkLock'], 200],
				['beforeMethod:MOVE', [$this->plugin, 'checkLock'], 200],
			);

		$this->plugin->initialize($server);
	}

	public function testCheckLockForCalendar(): void {
		$plugin = $this->getMockBuilder(LockPlugin::class)
			->setMethods(['isFile', 'getNode'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
				$this->lockManager,
				$this->userAgentManager,
			])
			->getMock();

		$path = '/path/123';
		$method = 'GET';
		$url = 'url://path/123';
		$node = $this->createMock(INode::class);

		$plugin->expects($this->once())
			->method('isFile')
			->with($url, $node)
			->willReturn(false);

		$plugin->expects($this->once())
			->method('getNode')
			->with($path, $method)
			->willReturn($node);

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->once())
			->method('getPath')
			->willReturn($path);
		$request->expects($this->exactly(2))
			->method('getMethod')
			->willReturn($method);
		$request->expects($this->once())
			->method('getAbsoluteUrl')
			->willReturn($url);

		// Just call to make sure it doesn't throw any Exception
		$plugin->checkLock($request);
	}

	/**
	 * @dataProvider nonCopyMoveMethodDataProvider
	 *
	 * @param string $method
	 */
	public function testCheckLockNonCopyMoveNoE2EPath(string $method):void {
		$plugin = $this->getMockBuilder(LockPlugin::class)
			->setMethods(['isFile', 'getNode', 'isE2EEnabledPath'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
				$this->lockManager,
				$this->userAgentManager,
			])
			->getMock();

		$path = '/path/123';
		$url = 'url://path/123';
		$node = $this->createMock(File::class);

		$plugin->expects($this->once())
			->method('isFile')
			->with($url, $node)
			->willReturn(true);

		$plugin->expects($this->once())
			->method('getNode')
			->with($path, $method)
			->willReturn($node);

		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with($node)
			->willReturn(false);

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->once())
			->method('getPath')
			->willReturn($path);
		$request->expects($this->exactly(2))
			->method('getMethod')
			->willReturn($method);
		$request->expects($this->once())
			->method('getAbsoluteUrl')
			->willReturn($url);

		// Just call to make sure it doesn't throw any Exception
		$plugin->checkLock($request);
	}

	/**
	 * @dataProvider nonCopyMoveMethodDataProvider
	 *
	 * @param string $method
	 */
	public function testCheckLockBlockUnsupportedClients(string $method): void {
		$plugin = $this->getMockBuilder(LockPlugin::class)
			->setMethods(['isFile', 'getNode', 'isE2EEnabledPath', 'isE2EEnabledUserAgent'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
				$this->lockManager,
				$this->userAgentManager,
			])
			->getMock();

		$path = '/path/123';
		$url = 'url://path/123';
		$node = $this->createMock(File::class);
		$userAgentString = 'User-Agent-String';

		$plugin->expects($this->once())
			->method('isFile')
			->with($url, $node)
			->willReturn(true);

		$plugin->expects($this->once())
			->method('getNode')
			->with($path, $method)
			->willReturn($node);

		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with($node)
			->willReturn(true);

		$plugin->expects($this->once())
			->method('isE2EEnabledUserAgent')
			->with($userAgentString)
			->willReturn(false);

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->once())
			->method('getPath')
			->willReturn($path);
		$request->expects($this->exactly(2))
			->method('getMethod')
			->willReturn($method);
		$request->expects($this->once())
			->method('getAbsoluteUrl')
			->willReturn($url);
		$request->expects($this->once())
			->method('getHeader')
			->with('user-agent')
			->willReturn($userAgentString);

		$this->expectException(Forbidden::class);
		$this->expectExceptionMessage('Client "User-Agent-String" is not allowed to access end-to-end encrypted content');

		$plugin->checkLock($request);
	}

	public function nonCopyMoveMethodDataProvider(): array {
		return [
			['GET'],
			['PROPFIND'],
			['REPORT'],
			['HEAD'],
			['PUT'],
			['POST'],
			['PROPPATCH'],
			['DELETE'],
		];
	}

	/**
	 * @dataProvider writeMethodDataProvider
	 *
	 * @param string $method
	 * @param string|null $token
	 * @param bool $isLocked
	 * @param bool $expectsForbidden
	 * @param bool $expectsFileLocked
	 */
	public function testCheckLockForWrite(string $method,
		?string $token,
		bool $isLocked,
		bool $expectsForbidden,
		bool $expectsFileLocked): void {
		$plugin = $this->getMockBuilder(LockPlugin::class)
			->setMethods(['isFile', 'getNode', 'isE2EEnabledPath', 'isE2EEnabledUserAgent'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
				$this->lockManager,
				$this->userAgentManager,
			])
			->getMock();

		$path = '/path/123';
		$url = 'url://path/123';
		$node = $this->createMock(File::class);
		$userAgentString = 'User-Agent-String';

		if ($expectsForbidden) {
			$node->expects($this->never())
				->method('getId');
		} else {
			$node->expects($this->once())
				->method('getId')
				->willReturn(42);
		}

		$plugin->expects($this->once())
			->method('isFile')
			->with($url, $node)
			->willReturn(true);

		$plugin->expects($this->once())
			->method('getNode')
			->with($path, $method)
			->willReturn($node);

		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with($node)
			->willReturn(true);

		$plugin->expects($this->once())
			->method('isE2EEnabledUserAgent')
			->with($userAgentString)
			->willReturn(true);

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->once())
			->method('getPath')
			->willReturn($path);
		$request->expects($this->exactly(2))
			->method('getMethod')
			->willReturn($method);
		$request->expects($this->once())
			->method('getAbsoluteUrl')
			->willReturn($url);
		$request->expects($this->once())
			->method('hasHeader')
			->with('e2e-token')
			->willReturn(true);
		$request->method('getHeader')
			->willReturnMap([
				['user-agent', $userAgentString],
				['e2e-token', $token],
			]);

		if ($expectsForbidden) {
			$this->lockManager->expects($this->never())
				->method('isLocked');
		} else {
			$this->lockManager->expects($this->once())
				->method('isLocked')
				->willReturn($isLocked);
		}

		if ($expectsForbidden) {
			$this->expectException(Forbidden::class);
			$this->expectExceptionMessage('Write access to end-to-end encrypted folder requires token - no token sent');
		}
		if ($expectsFileLocked) {
			$this->expectException(FileLocked::class);
			$this->expectExceptionMessage('Write access to end-to-end encrypted folder requires token - resource not locked or wrong token sent');
		}

		$plugin->checkLock($request);
	}

	public function writeMethodDataProvider(): array {
		return [
			['PUT', null, false, true, false],
			['PUT', 'token123', false, false, false],
			['PUT', 'token123', true, false, true],
			['POST', null, false, true, false],
			['POST', 'token123', false, false, false],
			['POST', 'token123', true, false, true],
			['PROPPATCH', null, false, true, false],
			['PROPPATCH', 'token123', false, false, false],
			['PROPPATCH', 'token123', true, false, true],
			['DELETE', null, false, true, false],
			['DELETE', 'token123', false, false, false],
			['DELETE', 'token123', true, false, true],
		];
	}

	/**
	 * @dataProvider checkLockForWriteCopyMoveDataProvider
	 *
	 * @param string $method
	 * @param string|null $token
	 * @param bool $isSrcE2E
	 * @param bool $isDestE2E
	 * @param bool $isSrcFutureFile
	 * @param bool $isSrcLocked
	 * @param bool $isDestLocked
	 * @param bool $expectsReturn
	 * @param bool $expectsForbidden1
	 * @param bool $expectsForbidden2
	 * @param bool $expectsFileLocked
	 */
	public function testCheckLockForWriteCopyMove(string $method,
		?string $token,
		bool $isSrcE2E,
		bool $isDestE2E,
		bool $isSrcFutureFile,
		bool $isSrcLocked,
		bool $isDestLocked,
		bool $expectsReturn,
		bool $expectsForbidden1,
		bool $expectsForbidden2,
		bool $expectsFileLocked): void {
		$plugin = $this->getMockBuilder(LockPlugin::class)
			->setMethods(['isFile', 'getNode', 'isE2EEnabledPath', 'isE2EEnabledUserAgent'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
				$this->lockManager,
				$this->userAgentManager,
			])
			->getMock();

		if ($isSrcFutureFile) {
			$srcNode = $this->createMock(FutureFile::class);
		} else {
			$srcNode = $this->createMock(File::class);
			$srcNode->method('getId')->willReturn(42);
		}
		$destNode = $this->createMock(File::class);
		$destNode->method('getId')->willReturn(1337);

		$path = '/path/123';
		$url = 'url://path/123';
		$userAgentString = 'User-Agent-String';

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->once())
			->method('getPath')
			->willReturn($path);
		$request->expects($this->exactly(2))
			->method('getMethod')
			->willReturn($method);
		$request->expects($this->once())
			->method('getAbsoluteUrl')
			->willReturn($url);
		$request->method('hasHeader')
			->with('e2e-token')
			->willReturn(true);
		$request->method('getHeader')
			->willReturnMap([
				['user-agent', $userAgentString],
				['e2e-token', $token],
			]);

		$plugin->expects($this->once())
			->method('isFile')
			->with($url, $srcNode)
			->willReturn(true);

		$plugin->method('getNode')
			->willReturnMap([
				[$path, $method, $srcNode],
				['/path/dest/', $method, $destNode],
			]);

		$plugin->method('isE2EEnabledPath')
			->willReturnMap([
				[$srcNode, $isSrcE2E],
				[$destNode, $isDestE2E],
			]);

		$plugin->method('isE2EEnabledUserAgent')
			->with($userAgentString)
			->willReturn(true);

		$this->lockManager->method('isLocked')
			->willReturnMap([
				[42, $token, null, true, $isSrcLocked],
				[1337, $token, null, true, $isDestLocked],
			]);

		$server = $this->createMock(Server::class);
		$server->expects($this->once())
			->method('getCopyAndMoveInfo')
			->with($request)
			->willReturn(['destination' => '/path/dest/']);

		if ($expectsForbidden1) {
			$this->expectException(Forbidden::class);
			$this->expectExceptionMessage('Cannot copy or move files from non-encrypted folders to end to end encrypted folders or vice versa.');
		}
		if ($expectsForbidden2) {
			$this->expectException(Forbidden::class);
			$this->expectExceptionMessage('Write access to end-to-end encrypted folder requires token - no token sent');
		}
		if ($expectsFileLocked) {
			$this->expectException(FileLocked::class);
			$this->expectExceptionMessage('Write access to end-to-end encrypted folder requires token - resource not locked or wrong token sent');
		}

		$plugin->initialize($server);
		$plugin->checkLock($request);
	}

	public function checkLockForWriteCopyMoveDataProvider(): array {
		return [
			// Neither src nor dest is e2e
			['COPY', 'token123', false, false, false, false, false, true, false, false, false],
			['MOVE', 'token123', false, false, false, false, false, true, false, false, false],
			// Mix of E2E and non-E2E
			['COPY', 'token123', false, true,  false, false, false, false, true, false, false],
			['COPY', 'token123', true,  false, false, false, false, false, true, false, false],
			['MOVE', 'token123', false, true,  false, false, false, false, true, false, false],
			['MOVE', 'token123', true,  false, false, false, false, false, true, false, false],
			// Mix of E2E and non-E2E, but src is FutureFile
			['MOVE', 'token123', false, true, true, false, false, false, false, false, false],
			['MOVE', null,       false, true, true, false, false, false, false, true,  false],
			['MOVE', 'token123', false, true, true, false, true,  false, false, false, true],
			['MOVE', null,       false, true, true, false, true,  false, false, true,  false],
			// Both are E2E:
			['COPY', 'token123', true, true, false, false, false, false, false, false, false],
			['COPY', null,       true, true, false, false, false, false, false, true,  false],
			['COPY', 'token123', true, true, false, false, true,  false, false, false, true],
			['COPY', null,       true, true, false, false, true,  false, false, true,  false],
			['COPY', 'token123', true, true, false, true,  false, false, false, false, true],
			['COPY', null,       true, true, false, true,  false, false, false, true,  false],
			['COPY', 'token123', true, true, false, true,  true,  false, false, false, true],
			['COPY', null,       true, true, false, true,  true,  false, false, true,  false],
			['MOVE', 'token123', true, true, false, false, false, false, false, false, false],
			['MOVE', null,       true, true, false, false, false, false, false, true,  false],
			['MOVE', 'token123', true, true, false, false, true,  false, false, false, true],
			['MOVE', null,       true, true, false, false, true,  false, false, true,  false],
			['MOVE', 'token123', true, true, false, true,  false, false, false, false, true],
			['MOVE', null,       true, true, false, true,  false, false, false, true,  false],
			['MOVE', 'token123', true, true, false, true,  true,  false, false, false, true],
			['MOVE', null,       true, true, false, true,  true,  false, false, true,  false],
		];
	}

	public function testIsFileCalendar(): void {
		$node = $this->createMock(ICalendar::class);

		$actual = self::invokePrivate($this->plugin, 'isFile', ['path123', $node]);
		$this->assertFalse($actual);
	}

	public function testIsFileFile(): void {
		$node = $this->createMock(File::class);

		$actual = self::invokePrivate($this->plugin, 'isFile', ['path123', $node]);
		$this->assertTrue($actual);
	}

	public function testIsFileDirectory(): void {
		$node = $this->createMock(Directory::class);

		$actual = self::invokePrivate($this->plugin, 'isFile', ['path123', $node]);
		$this->assertTrue($actual);
	}

	public function testIsE2EEnabledPathEncryptedFolder():void {
		$plugin = $this->getMockBuilder(LockPlugin::class)
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
				$this->lockManager,
				$this->userAgentManager,
			])
			->getMock();

		$node = $this->createMock(Folder::class);
		$node->expects($this->once())
			->method('isEncrypted')
			->willReturn(true);

		$davNode = $this->createMock(\OCA\DAV\Connector\Sabre\Node::class);
		$davNode->method('getNode')->willReturn($node);

		$actual = self::invokePrivate($plugin, 'isE2EEnabledPath', [$davNode]);
		$this->assertTrue($actual);
	}

	public function testIsE2EEnabledPathParentEncrypted():void {
		$plugin = $this->getMockBuilder(LockPlugin::class)
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
				$this->lockManager,
				$this->userAgentManager,
			])
			->getMock();

		$parentNode = $this->createMock(Folder::class);
		$parentNode->expects($this->once())
			->method('isEncrypted')
			->willReturn(true);
		$parentNode->method('getId')
			->willReturn(1);

		$fileNode = $this->createMock(Node::class);
		$fileNode->expects($this->once())
			->method('getParent')
			->willReturn($parentNode);

		$davNode = $this->createMock(\OCA\DAV\Connector\Sabre\Node::class);
		$davNode->method('getNode')->willReturn($fileNode);

		$actual = self::invokePrivate($plugin, 'isE2EEnabledPath', [$davNode]);
		$this->assertTrue($actual);
	}

	public function testIsE2EEnabledPathNonEncrypted():void {
		$plugin = $this->getMockBuilder(LockPlugin::class)
			->setMethods(['getFileNode'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
				$this->lockManager,
				$this->userAgentManager,
			])
			->getMock();

		$parentNode = $this->createMock(Folder::class);
		$parentNode->expects($this->once())
			->method('isEncrypted')
			->willReturn(false);

		$fileNode = $this->createMock(Node::class);
		$fileNode->expects($this->once())
			->method('getParent')
			->willReturn($parentNode);

		$davNode = $this->createMock(\OCA\DAV\Connector\Sabre\Node::class);
		$davNode->method('getNode')->willReturn($fileNode);

		$actual = self::invokePrivate($plugin, 'isE2EEnabledPath', [$davNode]);
		$this->assertFalse($actual);
	}

	/**
	 * @dataProvider isE2EEnabledUserAgentDataProvider
	 *
	 * @param bool $supportsE2E
	 */
	public function testIsE2EEnabledUserAgent(bool $supportsE2E): void {
		$this->userAgentManager->expects($this->once())
			->method('supportsEndToEndEncryption')
			->with('User-Agent-String')
			->willReturn($supportsE2E);

		$result = self::invokePrivate($this->plugin, 'isE2EEnabledUserAgent', ['User-Agent-String']);
		$this->assertEquals($result, $supportsE2E);
	}

	public function isE2EEnabledUserAgentDataProvider(): array {
		return [
			[true],
			[false],
		];
	}
}
