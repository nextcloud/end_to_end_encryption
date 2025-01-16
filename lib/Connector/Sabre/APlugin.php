<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Connector\Sabre;

use OCA\DAV\Connector\Sabre\Directory;
use OCA\DAV\Connector\Sabre\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IUserSession;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\INode;
use Sabre\DAV\Server;
use Sabre\DAV\ServerPlugin;

abstract class APlugin extends ServerPlugin {
	protected ?Server $server = null;
	protected IRootFolder $rootFolder;
	protected IUserSession $userSession;

	/**
	 * Should plugin be applied to the current node?
	 * Only apply it to files and directories, not to contacts or calendars
	 */
	private array $applyPlugin = [];

	/**
	 * APlugin constructor.
	 */
	public function __construct(
		IRootFolder $rootFolder,
		IUserSession $userSession,
	) {
		$this->rootFolder = $rootFolder;
		$this->userSession = $userSession;
	}

	/**
	 * @inheritDoc
	 */
	public function initialize(Server $server) {
		$this->server = $server;
	}

	/**
	 * Get SabreDAV Node
	 * @throws Conflict
	 * @throws NotFound
	 */
	protected function getNode(string $path, string $method): INode {
		return $this->getNodeForPath($path);
	}

	/**
	 * Get DAV Node for a given path, if the path doesn't exists we try the parent
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
	 * Checks if the path is an E2E folder or inside an E2E folder
	 */
	protected function isE2EEnabledPath(INode $node): bool {
		if ($node instanceof \OCA\DAV\Connector\Sabre\Node) {
			$node = $node->getNode();
			if ($node instanceof Folder) {
				return $node->isEncrypted();
			} else {
				return $node->getParent()->isEncrypted();
			}
		}
		return false;
	}

	/**
	 * Check if we process a file or directory. This plugin should ignore calendars
	 * and contacts
	 */
	protected function isFile(string $url, INode $node): bool {
		if (isset($this->applyPlugin[$url])) {
			return $this->applyPlugin[$url];
		}

		// check if this is a regular file or directory
		$this->applyPlugin[$url] = (($node instanceof File) || ($node instanceof Directory));

		return $this->applyPlugin[$url];
	}
}
