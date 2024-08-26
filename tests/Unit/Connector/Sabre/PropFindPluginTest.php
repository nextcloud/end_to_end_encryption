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

namespace OCA\EndToEndEncryption\Tests\Connector\Sabre;

use OCA\DAV\Connector\Sabre\Directory;
use OCA\DAV\Connector\Sabre\Exception\Forbidden;
use OCA\EndToEndEncryption\Connector\Sabre\PropFindPlugin;
use OCA\EndToEndEncryption\E2EEnabledPathCache;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\Files\IRootFolder;
use OCP\IRequest;
use OCP\IUserSession;
use Sabre\CalDAV\ICalendar;
use Sabre\DAV\PropFind;
use Sabre\DAV\Server;
use Sabre\DAV\Tree;
use Sabre\HTTP\RequestInterface;
use Test\TestCase;

class PropFindPluginTest extends TestCase {

	/** @var IRootFolder|\PHPUnit\Framework\MockObject\MockObject */
	private $rootFolder;

	/** @var IUserSession|\PHPUnit\Framework\MockObject\MockObject */
	private $userSession;

	/** @var UserAgentManager|\PHPUnit\Framework\MockObject\MockObject */
	private $userAgentManager;

	/** @var IRequest|\PHPUnit\Framework\MockObject\MockObject */
	private $request;

	/** @var Server|\PHPUnit\Framework\MockObject\MockObject */
	protected $server;

	/** @var E2EEnabledPathCache|\PHPUnit\Framework\MockObject\MockObject */
	protected $pathCache;

	private PropFindPlugin $plugin;

	protected function setUp(): void {
		parent::setUp();

		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->userSession = $this->createMock(IUserSession::class);
		$this->userAgentManager = $this->createMock(UserAgentManager::class);
		$this->request = $this->createMock(IRequest::class);
		$this->server = $this->createMock(Server::class);
		$this->pathCache = $this->createMock(E2EEnabledPathCache::class);

		$this->plugin = new PropFindPlugin(
			$this->rootFolder,
			$this->userSession,
			$this->userAgentManager,
			$this->request,
			$this->pathCache
		);
	}

	public function testInitialize(): void {
		$server = $this->createMock(Server::class);

		$server->expects($this->atLeast(2))
			->method('on')
			->withConsecutive(
				['afterMethod:PROPFIND', [$this->plugin, 'checkAccess'], 50],
				['propFind', [$this->plugin, 'updateProperty'], 105],
			);

		$this->plugin->initialize($server);
	}

	public function testUpdatePropertyIgnoreCalendar(): void {
		$server = $this->createMock(Server::class);
		$propFind = $this->createMock(PropFind::class);
		$iNode = $this->createMock(ICalendar::class);

		$this->plugin->initialize($server);

		$propFind->expects($this->never())
			->method('get');
		$propFind->expects($this->never())
			->method('set');
		$this->userAgentManager->expects($this->never())
			->method('supportsEndToEndEncryption');
		$this->request->expects($this->never())
			->method('getHeader');

		$iNode->method('getName')
			->willReturn('node-name.file');

		$this->plugin->updateProperty($propFind, $iNode);
	}

	/**
	 * @dataProvider updatePropertyDataProvider
	 *
	 * @param bool $supportedUserAgent
	 * @param bool $fileEncrypted
	 */
	public function testUpdateProperty(bool $supportedUserAgent, bool $fileEncrypted): void {
		$server = $this->createMock(Server::class);
		$propFind = $this->createMock(PropFind::class);
		$iNode = $this->createMock(Directory::class);

		$this->plugin->initialize($server);

		$this->request->expects($this->once())
			->method('getHeader')
			->with('USER_AGENT')
			->willReturn('User-Agent-String');

		$this->userAgentManager->expects($this->once())
			->method('supportsEndToEndEncryption')
			->with('User-Agent-String')
			->willReturn($supportedUserAgent);

		if (!$supportedUserAgent) {
			$propFind->expects($this->once())
				->method('get')
				->with('{http://nextcloud.org/ns}is-encrypted')
				->willReturn($fileEncrypted ? '1' : '0');

			if ($fileEncrypted) {
				$propFind->expects($this->once())
					->method('set')
					->with('{http://owncloud.org/ns}permissions', '', 200);
			} else {
				$propFind->expects($this->never())
					->method('set');
			}
		} else {
			$propFind->expects($this->never())
				->method('get');
			$propFind->expects($this->never())
				->method('set');
		}

		$iNode->method('getName')
			->willReturn('node-name');

		$this->plugin->updateProperty($propFind, $iNode);
	}

	public function updatePropertyDataProvider(): array {
		return [
			[false, false],
			[false, true],
			[true, false],
			[true, true],
		];
	}




	/**
	 * @dataProvider updatePropertyDataProvider
	 *
	 * @param bool $supportedUserAgent
	 * @param bool $fileEncrypted
	 */
	public function testCheckAccess(bool $supportedUserAgent, bool $fileEncrypted): void {
		$server = $this->createMock(Server::class);
		$propFind = $this->createMock(PropFind::class);
		$iNode = $this->createMock(Directory::class);
		$request = $this->createMock(RequestInterface::class);
		$tree = $this->createMock(Tree::class);

		$this->plugin->initialize($server);
		$server->tree = $tree;

		$request->expects($this->once())
			->method('getMethod')
			->willReturn('PROPFIND');

		$this->request->expects($this->once())
			->method('getHeader')
			->with('USER_AGENT')
			->willReturn('User-Agent-String');

		$request->expects($this->exactly(2))
			->method('getPath')
			->willReturn('files/admin/Folder');

		$this->userAgentManager->expects($this->once())
			->method('supportsEndToEndEncryption')
			->with('User-Agent-String')
			->willReturn($supportedUserAgent);

		$tree->expects($this->once())
			->method('getNodeForPath')
			->with('files/admin/Folder')
			->willReturn($iNode);

		$server->expects($this->once())
			->method('getProperties')
			->with('files/admin/Folder', '{http://nextcloud.org/ns}is-encrypted')
			->willReturn([
				'{http://nextcloud.org/ns}is-encrypted' => $fileEncrypted ? '1' : '0'
			]);

		if (!$supportedUserAgent && $fileEncrypted) {
			$this->expectException(Forbidden::class);
			$this->expectExceptionMessage('Client "User-Agent-String" is not allowed to access end-to-end encrypted content');
		}

		$this->plugin->checkAccess($request);
	}

	public function checkAccessDataProvider(): array {
		return [
			[false, false],
			[false, true],
			[true, false],
			[true, true],
		];
	}
}
