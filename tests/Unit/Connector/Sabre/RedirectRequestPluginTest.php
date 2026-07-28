<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Tests\Unit\Connector\Sabre;

use OCA\DAV\Connector\Sabre\File;
use OCA\EndToEndEncryption\Connector\Sabre\RedirectRequestPlugin;
use OCP\Files\IRootFolder;
use OCP\IUserSession;
use Sabre\DAV\Server;
use Sabre\HTTP\RequestInterface;
use Test\TestCase;

class RedirectRequestPluginTest extends TestCase {

	private IRootFolder&\PHPUnit\Framework\MockObject\Stub $rootFolder;
	private IUserSession&\PHPUnit\Framework\MockObject\Stub $userSession;
	private RedirectRequestPlugin $plugin;

	protected function setUp(): void {
		parent::setUp();

		$this->rootFolder = $this->createStub(IRootFolder::class);
		$this->userSession = $this->createStub(IUserSession::class);

		$this->plugin = new RedirectRequestPlugin($this->rootFolder, $this->userSession);
	}

	public function testInitialize(): void {
		$server = $this->createMock(Server::class);

		$calls = [];
		$server->expects($this->exactly(8))
			->method('on')
			->willReturnCallback(function (string $event, callable $callback, int $priority) use (&$calls): void {
				$calls[] = [$event, (new \ReflectionFunction($callback))->getName(), $priority];
			});

		$this->plugin->initialize($server);

		$this->assertEquals([
			['method:MKCOL', 'httpMkColPut', 95],
			['method:PUT', 'httpMkColPut', 95],
			['method:COPY', 'httpCopyMove', 95],
			['method:MOVE', 'httpCopyMove', 95],
			['method:DELETE', 'httpDelete', 95],
			['method:GET', 'httpGetHead', 5],
			['method:HEAD', 'httpGetHead', 5],
			['propFind', 'propFind', 500],
		], $calls);
	}

	public function testHttpCopyMoveInsideE2E(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->onlyMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
			])
			->getMock();

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->any())
			->method('getPath')
			->wilLReturn('/any/random/path/');
		$request->expects($this->once())
			->method('getMethod')
			->willReturn('COPY');
		$request->expects($this->once())
			->method('hasHeader')
			->with('Destination')
			->willReturn(true);
		$request->method('getHeader')
			->willReturnMap([
				['Destination', '/foo/bar/DestinationPath123'],
				['X-Nc-Sabre-Original-Method', null],
			]);
		$request->expects($this->once())
			->method('setHeader')
			->with('Destination', '/foo/bar/DestinationPath123.e2e-to-save');

		$node = $this->createStub(File::class);

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'COPY')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with($node)
			->willReturn(true);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(true);

		$plugin->httpCopyMove($request);
	}

	public function testHttpCopyMoveInsideE2EOriginalMethodDelete(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->onlyMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
			])
			->getMock();

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->any())
			->method('getPath')
			->wilLReturn('/any/random/path/');
		$request->expects($this->once())
			->method('getMethod')
			->willReturn('COPY');
		$request->expects($this->once())
			->method('hasHeader')
			->with('Destination')
			->willReturn(true);
		$request->method('getHeader')
			->willReturnMap([
				['Destination', '/foo/bar/DestinationPath123'],
				['X-Nc-Sabre-Original-Method', 'DELETE'],
			]);
		$request->expects($this->never())
			->method('setHeader');

		$node = $this->createStub(File::class);

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'COPY')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with($node)
			->willReturn(true);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(true);

		$plugin->httpCopyMove($request);
	}

	public function testHttpCopyMoveOutsideE2ENoFile(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->onlyMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
			])
			->getMock();

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->any())
			->method('getPath')
			->wilLReturn('/any/random/path/');
		$request->expects($this->once())
			->method('getMethod')
			->willReturn('COPY');
		$request->expects($this->never())
			->method('setHeader');

		$node = $this->createStub(File::class);

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'COPY')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(false);

		$plugin->httpCopyMove($request);
	}

	public function testHttpCopyMoveOutsideE2E(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->onlyMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
			])
			->getMock();

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->any())
			->method('getPath')
			->wilLReturn('/any/random/path/');
		$request->expects($this->once())
			->method('getMethod')
			->willReturn('COPY');
		$request->expects($this->never())
			->method('setHeader');

		$node = $this->createStub(File::class);

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'COPY')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with($node)
			->willReturn(false);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(true);

		$plugin->httpCopyMove($request);
	}

	public function testHttpMkColPutInsideE2E(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->onlyMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
			])
			->getMock();

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->any())
			->method('getPath')
			->wilLReturn('/any/random/path/');
		$request->expects($this->once())
			->method('getMethod')
			->willReturn('PUT');

		$request->expects($this->once())
			->method('getUrl')
			->willReturn('http://username:password@hostname:9090/path/123/foo?arg=value#anchor');
		$request->expects($this->once())
			->method('setUrl')
			->with('http://username:password@hostname:9090/path/123/foo.e2e-to-save?arg=value#anchor');

		$node = $this->createStub(File::class);

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'PUT')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with($node)
			->willReturn(true);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(true);

		$plugin->httpMkColPut($request);
	}

	public function testHttpMkColPutOutsideE2ENoFile(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->onlyMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
			])
			->getMock();

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->any())
			->method('getPath')
			->wilLReturn('/any/random/path/');
		$request->expects($this->once())
			->method('getMethod')
			->willReturn('PUT');
		$request->expects($this->never())
			->method('setUrl');

		$node = $this->createStub(File::class);

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'PUT')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(false);

		$plugin->httpMkColPut($request);
	}

	public function testHttpMkColPutOutsideE2E(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->onlyMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession,
			])
			->getMock();

		$request = $this->createMock(RequestInterface::class);
		$request->expects($this->any())
			->method('getPath')
			->wilLReturn('/any/random/path/');
		$request->expects($this->once())
			->method('getMethod')
			->willReturn('PUT');
		$request->expects($this->never())
			->method('setUrl');

		$node = $this->createStub(File::class);

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'PUT')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(true);
		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with($node)
			->willReturn(false);

		$plugin->httpMkColPut($request);
	}
}
