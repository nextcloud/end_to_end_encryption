<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption\Connector\Sabre;

use OCA\DAV\Connector\Sabre\Directory;
use OCA\DAV\Connector\Sabre\Exception\FileLocked;
use OCA\DAV\Connector\Sabre\Exception\Forbidden;
use OCA\DAV\Connector\Sabre\File;
use OCA\DAV\Upload\FutureFile;
use OCA\EndToEndEncryption\LockManager;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\AppFramework\Http;
use OCP\Files\IRootFolder;
use OCP\IUserSession;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\INode;
use Sabre\DAV\Server;
use Sabre\HTTP\RequestInterface;

class LockPlugin extends APlugin {
	private LockManager $lockManager;
	private UserAgentManager $userAgentManager;

	public function __construct(IRootFolder $rootFolder,
		IUserSession $userSession,
		LockManager $lockManager,
		UserAgentManager $userAgentManager,
	) {
		parent::__construct($rootFolder, $userSession);
		$this->lockManager = $lockManager;
		$this->userAgentManager = $userAgentManager;
	}

	/**
	 * {@inheritdoc}
	 */
	public function initialize(Server $server) {
		parent::initialize($server);

		$this->server->on('beforeMethod:DELETE', [$this, 'checkLock'], 200);
		$this->server->on('beforeMethod:MKCOL', [$this, 'checkLock'], 200);
		$this->server->on('beforeMethod:PUT', [$this, 'checkLock'], 200);

		$this->server->on('beforeMethod:COPY', [$this, 'checkLock'], 200);
		$this->server->on('beforeMethod:MOVE', [$this, 'checkLock'], 200);
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
		/** @var File|Directory|FutureFile $node */

		// We don't care if we are not inside an end to end encrypted folder
		if ($method === 'COPY' || $method === 'MOVE') {
			// If this is a COPY or MOVE request, we need to check both
			// the request path as well as the destination of the command
			$destInfo = $this->server->getCopyAndMoveInfo($request);
			/** @var File|Directory $destNode */
			$destNode = $this->getNode($destInfo['destination'], $method);

			if ($node instanceof FutureFile) {
				if ($this->isE2EEnabledPath($destNode) === false) {
					return;
				}
			} else {
				// If neither is an end to end encrypted folders, we don't care
				if (!$this->isE2EEnabledPath($node) && !$this->isE2EEnabledPath($destNode)) {
					return;
				}

				// allow to leave an encrypted root folder
				if ($request->getHeader('X-Nc-Sabre-Original-Method') === 'DELETE' && !$this->isE2EEnabledPath($destNode)) {
					return;
				}

				// Prevent moving or copying stuff from non-encrypted to encrypted folders
				// if original operation is not a DELETE
				if ($this->isE2EEnabledPath($node) !== $this->isE2EEnabledPath($destNode)
					&& $request->getHeader('X-Nc-Sabre-Original-Method') !== 'DELETE'
				) {
					throw new Forbidden('Cannot copy or move files from non-encrypted folders to end to end encrypted folders or vice versa.');
				}
			}
		} elseif (!$this->isE2EEnabledPath($node)) {
			return;
		}

		// Throw an error, if the user-agent does not support end to end encryption
		$userAgent = $request->getHeader('user-agent');
		if (!$this->isE2EEnabledUserAgent($userAgent)) {
			throw new Forbidden('Client "' . $userAgent . '" is not allowed to access end-to-end encrypted content');
		}

		$e2eToken = null;
		if ($request->hasHeader('e2e-token')) {
			$e2eToken = $request->getHeader('e2e-token');
		} else {
			$queryParams = $request->getQueryParameters();
			if (array_key_exists('e2e-token', $queryParams)) {
				$e2eToken = $queryParams['e2e-token'];
			}
		}

		switch ($method) {
			case 'COPY':
			case 'MOVE':
				$node instanceof FutureFile || $this->verifyTokenOnWriteAccess($node, $e2eToken);
				$this->verifyTokenOnWriteAccess($destNode, $e2eToken);
				break;

			default:
				$this->verifyTokenOnWriteAccess($node, $e2eToken);
				break;
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

		if ($this->lockManager->isLocked($node->getId(), $token, null, true)) {
			throw new FileLocked('Write access to end-to-end encrypted folder requires token - resource not locked or wrong token sent', Http::STATUS_FORBIDDEN);
		}
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
