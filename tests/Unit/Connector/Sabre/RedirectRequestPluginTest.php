<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
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

namespace OCA\EndToEndEncryption\Tests\Unit\Connector\Sabre;

use OCA\DAV\Connector\Sabre\File;
use OCA\EndToEndEncryption\Connector\Sabre\RedirectRequestPlugin;
use OCA\EndToEndEncryption\E2EEnabledPathCache;
use OCP\Files\IRootFolder;
use OCP\IUserSession;
use Sabre\DAV\Server;
use Sabre\HTTP\RequestInterface;
use Test\TestCase;

class RedirectRequestPluginTest extends TestCase {

	/** @var IRootFolder|\PHPUnit\Framework\MockObject\MockObject */
	private $rootFolder;

	/** @var IUserSession|\PHPUnit\Framework\MockObject\MockObject */
	private $userSession;

	/** @var E2EEnabledPathCache|\PHPUnit\Framework\MockObject\MockObject */
	private $pathCache;

	private RedirectRequestPlugin $plugin;

	protected function setUp(): void {
		parent::setUp();

		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->userSession = $this->createMock(IUserSession::class);
		$this->pathCache = $this->createMock(E2EEnabledPathCache::class);

		$this->plugin = new RedirectRequestPlugin($this->rootFolder, $this->userSession, $this->pathCache);
	}

	public function testInitialize(): void {
		$server = $this->createMock(Server::class);

		$server->expects($this->at(0))
			->method('on')
			->with('method:MKCOL', [$this->plugin, 'httpMkColPut'], 95);
		$server->expects($this->at(1))
			->method('on')
			->with('method:PUT', [$this->plugin, 'httpMkColPut'], 95);
		$server->expects($this->at(2))
			->method('on')
			->with('method:COPY', [$this->plugin, 'httpCopyMove'], 95);
		$server->expects($this->at(3))
			->method('on')
			->with('method:MOVE', [$this->plugin, 'httpCopyMove'], 95);
		$server->expects($this->at(4))
			->method('on')
			->with('method:DELETE', [$this->plugin, 'httpDelete'], 95);
		$server->expects($this->at(5))
			->method('on')
			->with('method:GET', [$this->plugin, 'httpGetHead'], 5);
		$server->expects($this->at(6))
			->method('on')
			->with('method:HEAD', [$this->plugin, 'httpGetHead'], 5);
		$server->expects($this->at(7))
			->method('on')
			->with('propFind', [$this->plugin, 'propFind'], 500);

		$this->plugin->initialize($server);
	}

	public function testHttpCopyMoveInsideE2E(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->setMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession
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

		$node = $this->createMock(File::class);
		$node->expects($this->once())
			->method('getPath')
			->willReturn('/random/path/');

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'COPY')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with('/random/path/')
			->willReturn(true);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(true);

		$plugin->httpCopyMove($request);
	}

	public function testHttpCopyMoveInsideE2EOriginalMethodDelete(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->setMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession
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

		$node = $this->createMock(File::class);
		$node->expects($this->once())
			->method('getPath')
			->willReturn('/random/path/');

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'COPY')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with('/random/path/')
			->willReturn(true);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(true);

		$plugin->httpCopyMove($request);
	}

	public function testHttpCopyMoveOutsideE2ENoFile(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->setMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession
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

		$node = $this->createMock(File::class);

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
			->setMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession
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

		$node = $this->createMock(File::class);
		$node->expects($this->once())
			->method('getPath')
			->willReturn('/random/path/');

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'COPY')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with('/random/path/')
			->willReturn(false);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(true);

		$plugin->httpCopyMove($request);
	}

	public function testHttpMkColPutInsideE2E(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->setMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession
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

		$node = $this->createMock(File::class);
		$node->expects($this->once())
			->method('getPath')
			->willReturn('/random/path/');

		$plugin->expects($this->once())
			->method('getNode')
			->with('/any/random/path/', 'PUT')
			->willReturn($node);
		$plugin->expects($this->once())
			->method('isE2EEnabledPath')
			->with('/random/path/')
			->willReturn(true);
		$plugin->expects($this->once())
			->method('isFile')
			->with('/any/random/path/', $node)
			->willReturn(true);

		$plugin->httpMkColPut($request);
	}

	public function testHttpMkColPutOutsideE2ENoFile(): void {
		$plugin = $this->getMockBuilder(RedirectRequestPlugin::class)
			->setMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession
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

		$node = $this->createMock(File::class);

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
			->setMethods(['getNode', 'isE2EEnabledPath', 'isFile'])
			->setConstructorArgs([
				$this->rootFolder,
				$this->userSession
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

		$node = $this->createMock(File::class);
		$node->expects($this->once())
			->method('getPath')
			->willReturn('/random/path/');

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
			->with('/random/path/')
			->willReturn(false);

		$plugin->httpMkColPut($request);
	}
}
