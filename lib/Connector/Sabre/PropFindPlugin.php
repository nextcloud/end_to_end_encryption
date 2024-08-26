<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
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


namespace OCA\EndToEndEncryption\Connector\Sabre;

use OCA\DAV\Connector\Sabre\Directory;
use OCA\DAV\Connector\Sabre\Exception\Forbidden;
use OCA\EndToEndEncryption\E2EEnabledPathCache;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\Files\IRootFolder;
use OCP\IRequest;
use OCP\IUserSession;
use Sabre\DAV\INode;
use Sabre\DAV\PropFind;
use Sabre\DAV\Server;
use Sabre\HTTP\RequestInterface;

class PropFindPlugin extends APlugin {
	public const IS_ENCRYPTED_PROPERTYNAME = '{http://nextcloud.org/ns}is-encrypted';

	private UserAgentManager $userAgentManager;
	private IRequest $request;
	protected ?Server $server = null;

	public function __construct(IRootFolder $rootFolder,
		IUserSession $userSession,
		UserAgentManager $userAgentManager,
		IRequest $request,
		E2EEnabledPathCache $pathCache) {
		parent::__construct($rootFolder, $userSession, $pathCache);
		$this->userAgentManager = $userAgentManager;
		$this->request = $request;
	}

	/**
	 * {@inheritdoc}
	 */
	public function initialize(Server $server) {
		parent::initialize($server);

		$this->server = $server;
		$this->server->on('afterMethod:PROPFIND', [$this, 'checkAccess'], 50);
		$this->server->on('propFind', [$this, 'setEncryptedProperty'], 104);
		$this->server->on('propFind', [$this, 'updateProperty'], 105);
	}

	public function setEncryptedProperty(PropFind $propFind, \Sabre\DAV\INode $node) {
		// Only folders can be e2e encrypted, so we only respond for directories.
		if ($node instanceof Directory) {
			$propFind->handle(self::IS_ENCRYPTED_PROPERTYNAME, function () use ($node) {
				return $node->getFileInfo()->isEncrypted() ? '1' : '0';
			});
		}
	}

	/**
	 * Remove permissions of end-to-end encrypted files for unsupported clients
	 *
	 * @param PropFind $propFind
	 * @param INode $node
	 */
	public function updateProperty(PropFind $propFind, INode $node): void {
		// only apply the plugin to files/directory, not to contacts or calendars
		if (!$this->isFile($node->getName(), $node)) {
			return;
		}

		$userAgent = $this->request->getHeader('USER_AGENT');
		$supportE2EEncryption = $this->userAgentManager->supportsEndToEndEncryption($userAgent);
		if (!$supportE2EEncryption && $node instanceof Directory) {
			// encrypted files have only read permissions
			$isEncrypted = $propFind->get('{http://nextcloud.org/ns}is-encrypted');
			if ($isEncrypted === '1') {
				$propFind->set('{http://owncloud.org/ns}permissions', '', 200);
			}
		}
	}

	public function checkAccess(RequestInterface $request) {
		if ($request->getMethod() !== 'PROPFIND') {
			return;
		}

		// Check client support
		$encryptionProperty = '{http://nextcloud.org/ns}is-encrypted';
		$userAgent = $this->request->getHeader('USER_AGENT');
		$supportE2EEncryption = $this->userAgentManager->supportsEndToEndEncryption($userAgent);

		// Check node encryption status
		$node = $this->server->tree->getNodeForPath($request->getPath());
		$isEncrypted = $this->server->getProperties($request->getPath(), $encryptionProperty);

		if (!$supportE2EEncryption
			&& $node instanceof Directory
			&& array_key_exists($encryptionProperty, $isEncrypted)
			&& $isEncrypted[$encryptionProperty] === '1') {
			throw new Forbidden('Client "' . $userAgent . '" is not allowed to access end-to-end encrypted content');
		}
	}
}
