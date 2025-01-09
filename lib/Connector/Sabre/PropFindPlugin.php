<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption\Connector\Sabre;

use OCA\DAV\Connector\Sabre\Directory;
use OCA\DAV\Connector\Sabre\Exception\Forbidden;
use OCA\DAV\Connector\Sabre\File;
use OCA\EndToEndEncryption\E2EEnabledPathCache;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\UserAgentManager;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IRequest;
use OCP\IUserSession;
use Sabre\DAV\INode;
use Sabre\DAV\PropFind;
use Sabre\DAV\Server;
use Sabre\HTTP\RequestInterface;

class PropFindPlugin extends APlugin {
	public const IS_ENCRYPTED_PROPERTYNAME = '{http://nextcloud.org/ns}is-encrypted';
	public const E2EE_IS_ENCRYPTED = '{http://nextcloud.org/ns}e2ee-is-encrypted';
	public const E2EE_METADATA_PROPERTYNAME = '{http://nextcloud.org/ns}e2ee-metadata';
	public const E2EE_METADATA_SIGNATURE_PROPERTYNAME = '{http://nextcloud.org/ns}e2ee-metadata-signature';

	protected ?Server $server = null;

	public function __construct(
		IRootFolder $rootFolder,
		IUserSession $userSession,
		E2EEnabledPathCache $pathCache,
		private UserAgentManager $userAgentManager,
		private IRequest $request,
		private IMetaDataStorage $metaDataStorage,
		private ?Folder $userFolder,
	) {
		parent::__construct($rootFolder, $userSession, $pathCache);
	}

	/**
	 * {@inheritdoc}
	 */
	public function initialize(Server $server) {
		parent::initialize($server);

		$this->server = $server;
		$this->server->on('afterMethod:PROPFIND', [$this, 'checkAccess'], 50);
		$this->server->on('propFind', [$this, 'setE2EEProperties'], 104);
		$this->server->on('propFind', [$this, 'updateProperty'], 105);
	}

	public function setE2EEProperties(PropFind $propFind, \Sabre\DAV\INode $node) {
		if (!($node instanceof Directory || $node instanceof File)) {
			return;
		}

		// Only folders can be e2e encrypted, so we only respond for directories.
		if ($node instanceof Directory) {
			$propFind->handle(self::IS_ENCRYPTED_PROPERTYNAME, function () use ($node) {
				return $node->getFileInfo()->isEncrypted() ? '1' : '0';
			});

			$propFind->handle(self::E2EE_METADATA_PROPERTYNAME, function () use ($node) {
				if ($node->getFileInfo()->isEncrypted()) {
					return $this->metaDataStorage->getMetaData(
						$this->userSession->getUser()->getUID(),
						$node->getId(),
					);
				}
			});

			$propFind->handle(self::E2EE_METADATA_SIGNATURE_PROPERTYNAME, function () use ($node) {
				if ($node->getFileInfo()->isEncrypted()) {
					return $this->metaDataStorage->readSignature($node->getId());
				}
			});
		}

		if ($this->userFolder !== null) {
			$propFind->handle(self::E2EE_IS_ENCRYPTED, function () use ($node) {
				if ($node instanceof File) {
					$isEncrypted = $this->userFolder->getFirstNodeById($node->getFileInfo()->getParentId())->isEncrypted() ? '1' : '0';
				} else {
					$isEncrypted = $node->getFileInfo()->isEncrypted();
				}

				return $isEncrypted ? '1' : '0';
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
			$isEncrypted = $propFind->get(self::IS_ENCRYPTED_PROPERTYNAME);
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
		$encryptionProperty = self::IS_ENCRYPTED_PROPERTYNAME;
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
