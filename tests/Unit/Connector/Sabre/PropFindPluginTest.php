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
use OCA\EndToEndEncryption\Connector\Sabre\PropFindPlugin;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\IRequest;
use Sabre\CalDAV\ICalendar;
use Sabre\DAV\PropFind;
use Sabre\DAV\Server;
use Test\TestCase;

class PropFindPluginTest extends TestCase {

	/** @var UserAgentManager|\PHPUnit\Framework\MockObject\MockObject */
	private $userAgentManager;

	/** @var  IRequest|\PHPUnit\Framework\MockObject\MockObject */
	private $request;

	/** @var PropFindPlugin */
	private $plugin;

	protected function setUp(): void {
		parent::setUp();

		$this->userAgentManager = $this->createMock(UserAgentManager::class);
		$this->request = $this->createMock(IRequest::class);

		$this->plugin = new PropFindPlugin($this->userAgentManager, $this->request);
	}

	public function testInitialize(): void {
		$server = $this->createMock(Server::class);

		$server->expects($this->at(0))
			->method('on')
			->with('propFind', [$this->plugin, 'updateProperty']);

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

		$this->request->expects($this->at(0))
			->method('getHeader')
			->with('USER_AGENT')
			->willReturn('User-Agent-String');

		$this->userAgentManager->expects($this->at(0))
			->method('supportsEndToEndEncryption')
			->with('User-Agent-String')
			->willReturn($supportedUserAgent);

		if (!$supportedUserAgent) {
			$propFind->expects($this->at(0))
				->method('get')
				->with('{http://nextcloud.org/ns}is-encrypted')
				->willReturn($fileEncrypted ? '1' : '0');

			if ($fileEncrypted) {
				$propFind->expects($this->at(1))
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
}
