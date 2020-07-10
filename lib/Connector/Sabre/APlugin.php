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
namespace OCA\EndToEndEncryption\Connector\Sabre;

use OC\AppFramework\Http;
use OCA\DAV\Connector\Sabre\Directory;
use OCA\DAV\Connector\Sabre\Exception\Forbidden;
use OCA\DAV\Connector\Sabre\File;
use OCP\Files\FileInfo;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\IUserSession;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\INode;
use Sabre\DAV\Server;
use Sabre\DAV\ServerPlugin;
use Exception;

abstract class APlugin extends ServerPlugin {

	/* @var Server */
	protected $server;

	/** @var IRootFolder */
	protected $rootFolder;

	/** @var IUserSession */
	protected $userSession;

	/**
	 * Should plugin be applied to the current node?
	 * Only apply it to files and directories, not to contacts or calendars
	 *
	 * @var array
	 */
	private $applyPlugin;

	/**
	 * APlugin constructor.
	 *
	 * @param IRootFolder $rootFolder
	 * @param IUserSession $userSession
	 */
	public function __construct(IRootFolder $rootFolder,
								IUserSession $userSession) {
		$this->rootFolder = $rootFolder;
		$this->userSession = $userSession;

		$this->applyPlugin = [];
	}

	/**
	 * @inheritDoc
	 */
	public function initialize(Server $server) {
		$this->server = $server;
	}

	/**
	 * get SabreDAV Node
	 *
	 * @param string $path
	 * @param string $method
	 * @return INode
	 * @throws Conflict
	 * @throws NotFound
	 */
	protected function getNode(string $path, string $method): INode {
		return $this->getNodeForPath($path);
	}

	/**
	 * Get DAV Node for a given path, if the path doesn't exists we try the parent
	 *
	 * @param $path
	 * @return INode
	 * @throws Conflict
	 */
	protected function getNodeForPath(string $path): INode {
		if ($this->server->tree->nodeExists($path)) {
			return $this->server->tree->getNodeForPath($path);
		}

		// maybe we are in the process in creating a new node, try the parent
		$parent = dirname($path);
		$parent = ($parent === '.') ? '/' : $parent;
		if ($this->server->tree->nodeExists($parent)) {
			return $this->server->tree->getNodeForPath($parent);
		}

		// If neither the actual node, nor the parent exists we throw a exception.
		// According to the WebDAV specification it should result in 409 (conflict)
		throw new Conflict();
	}

	/**
	 * get file system node of requested file
	 *
	 * @param string $path
	 * @return Node
	 *
	 * @throws NotFound
	 */
	protected function getFileNode(string $path): Node {
		$user = $this->userSession->getUser();
		if ($user === null) {
			throw new Forbidden('No user session found');
		}
		$uid = $user->getUID();

		try {
			return $this->rootFolder
				->getUserFolder($uid)
				->get($path);
		} catch (Exception $e) {
			throw new NotFound('file not found', Http::STATUS_NOT_FOUND, $e);
		}
	}

	/**
	 * check if we process a file or directory. This plugin should ignore calendars
	 * and contacts
	 *
	 * @param string $url
	 * @param INode $node
	 * @return bool
	 */
	protected function isFile(string $url, INode $node): bool {
		if (isset($this->applyPlugin[$url])) {
			return $this->applyPlugin[$url];
		}

		// check if this is a regular file or directory
		$this->applyPlugin[$url] = (($node instanceof File) || ($node instanceof Directory));

		return $this->applyPlugin[$url];
	}

	/**
	 * Checks if the path is an E2E folder or inside an E2E folder
	 *
	 * @param string $path
	 * @return bool
	 */
	protected function isE2EEnabledPath(string $path):bool {
		try {
			$node = $this->getFileNode($path);
		} catch (NotFound $e) {
			return false;
		}

		while ($node->isEncrypted() === false || $node->getType() === FileInfo::TYPE_FILE) {
			$node = $node->getParent();

			// Nitpick: This doesn't check if root is E2E,
			// but that's not supported at the moment anyway
			if ($node->getPath() === '/') {
				// top-level folder reached
				return false;
			}
		}

		return true;
	}
}
