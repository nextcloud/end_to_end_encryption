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

use Exception;
use OC\AppFramework\Http;
use OCA\DAV\Connector\Sabre\Directory;
use OCA\DAV\Connector\Sabre\Exception\FileLocked;
use OCA\DAV\Connector\Sabre\Exception\Forbidden;
use OCA\DAV\Connector\Sabre\File;
use OCA\DAV\Upload\FutureFile;
use OCA\EndToEndEncryption\LockManager;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\Files\FileInfo;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\IUserSession;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\INode;
use Sabre\DAV\Server;
use Sabre\DAV\ServerPlugin;
use Sabre\HTTP\RequestInterface;

class LockPlugin extends ServerPlugin {

	/* @var Server */
	private $server;

	/** @var IRootFolder */
	private $rootFolder;

	/** @var IUserSession */
	private $userSession;

	/** @var LockManager */
	private $lockManager;

	/** @var UserAgentManager */
	private $userAgentManager;

	/**
	 * Should plugin be applied to the current node?
	 * Only apply it to files and directories, not to contacts or calendars
	 *
	 * @var array
	 */
	private $applyPlugin;

	/**
	 * LockPlugin constructor.
	 *
	 * @param IRootFolder $rootFolder
	 * @param IUserSession $userSession
	 * @param LockManager $lockManager
	 * @param UserAgentManager $userAgentManager
	 */
	public function __construct(IRootFolder $rootFolder,
								IUserSession $userSession,
								LockManager $lockManager,
								UserAgentManager $userAgentManager
	) {
		$this->rootFolder = $rootFolder;
		$this->userSession = $userSession;
		$this->lockManager = $lockManager;
		$this->userAgentManager = $userAgentManager;
		$this->applyPlugin = [];
	}

	/**
	 * {@inheritdoc}
	 */
	public function initialize(Server $server) {
		$this->server = $server;
		$this->server->on('beforeMethod:*', [$this, 'checkLock'], 200);
	}

	/**
	 * Check if a file is locked for end-to-end encryption before trying to download it
	 *
	 * @param RequestInterface $request
	 * @throws Conflict
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws NotFound
	 */
	public function checkLock(RequestInterface $request): void {
		$node = $this->getNode($request->getPath(), $request->getMethod());
		$url = $request->getAbsoluteUrl();
		$method = $request->getMethod();

		// only apply the plugin to files/directory, not to contacts or calendars
		if (!$this->isFile($url, $node)) {
			return;
		}

		// We don't care if we are not inside an end to end encrypted folder
		if ($method === 'COPY' || $method === 'MOVE') {
			// If this is a COPY or MOVE request, we need to check both
			// the request path as well as the destination of the command
			$destInfo = $this->server->getCopyAndMoveInfo($request);
			$destNode = $this->getNode($destInfo['destination'], $method);

			// If neither is an end to end encrypted folders, we don't care
			if (!$this->isE2EEnabledPath($node->getPath()) && !$this->isE2EEnabledPath($destNode->getPath())) {
				return;
			}
			// Prevent moving or copying stuff from non-encrypted to encrypted folders (only exception is big file chunking)
			if (!($destNode instanceof FutureFile) &&
				$this->isE2EEnabledPath($node->getPath()) xor $this->isE2EEnabledPath($destNode->getPath())) {
				throw new Forbidden('Cannot copy or move files from non-encrypted folders to end to end encrypted folders or vice versa.');
			}
		} elseif (!$this->isE2EEnabledPath($node->getPath())) {
			return;
		}

		// Throw an error, if the user-agent does not support end to end encryption
		$userAgent = $request->getHeader('user-agent');
		if (!$this->isE2EEnabledUserAgent($userAgent)) {
			throw new Forbidden('Client "' . $userAgent . '" is not allowed to access end-to-end encrypted content');
		}

		switch ($method) {
			case 'GET':
				$this->preventReadAccessToLockedFile($node);
				break;

			case 'PROPFIND':
			case 'REPORT':
			case 'HEAD':
				break;

			case 'COPY':
			case 'MOVE':
				$this->verifyTokenOnWriteAccess($node, $request->getHeader('e2e-token'));
				$this->verifyTokenOnWriteAccess($destNode, $request->getHeader('e2e-token'));
				break;

			default:
				$this->verifyTokenOnWriteAccess($node, $request->getHeader('e2e-token'));
				break;
		}
	}

	/**
	 * Make sure that a user is not downloading a locked file
	 * (unless they themselves own the lock)
	 *
	 * @param INode $node
	 * @throws FileLocked
	 */
	protected function preventReadAccessToLockedFile(INode $node): void {
		if ($this->lockManager->isLocked($node->getId(), '')) {
			throw new FileLocked('File is locked', Http::STATUS_FORBIDDEN);
		}
	}

	/**
	 * Make sure that a user does not write into an E2E folder without
	 * having a valid lock
	 *
	 * @param INode $node
	 * @param string|null $token
	 * @throws Forbidden
	 */
	protected function verifyTokenOnWriteAccess(INode $node, ?string $token): void {
		// Write access always requires e2e token
		if ($token === null) {
			throw new Forbidden('Write access to end-to-end encrypted folder requires token - no token sent');
		}

		if ($this->lockManager->isLocked($node->getId(), $token)) {
			throw new FileLocked('Write access to end-to-end encrypted folder requires token - resource not locked or wrong token sent', Http::STATUS_FORBIDDEN);
		}
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
	protected function getNode($path, $method): INode {
		if ($method === 'GET' || $method === 'PROPFIND' || $method === 'HEAD') {
			return $this->server->tree->getNodeForPath($path);
		}

		return $this->getNodeForPath($path);
	}

	/**
	 * Get DAV Node for a given path, if the path doesn't exists we try the parent
	 *
	 * @param $path
	 * @return INode
	 * @throws Conflict
	 */
	protected function getNodeForPath($path): INode {
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
	protected function getFileNode($path): Node {
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
	protected function isFile($url, INode $node): bool {

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

	/**
	 * Checks whether the client supports the latest version of E2E
	 *
	 * @param string $userAgent
	 * @return bool
	 */
	protected function isE2EEnabledUserAgent(string $userAgent):bool {
		return $this->userAgentManager->supportsEndToEndEncryption($userAgent);
	}
}
