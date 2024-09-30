<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Middleware;

use OCA\EndToEndEncryption\IMetaDataStorage;
use OCP\AppFramework\Middleware;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\IRequest;

/**
 * Class ClientHasCapabilityMiddleware
 *
 * @package OCA\EndToEndEncryption\Middleware
 */
class ClientHasCapabilityMiddleware extends Middleware {
	public function __construct(
		private IRequest $request,
		private IMetaDataStorage $metadataStorage,
		private ?string $userId,
	) {
	}

	/**
	 * @param \OCP\AppFramework\Controller $controller
	 * @param string $methodName
	 * @throws OCSForbiddenException
	 */
	public function beforeController($controller, $methodName): void {
		parent::beforeController($controller, $methodName);

		$pathInfo = $this->request->getPathInfo();

		if ($pathInfo === false) {
			return;
		}

		if (!str_contains($pathInfo, '/apps/end_to_end_encryption/api/v1/meta-data/')) {
			return;
		}

		$fileId = $this->request->getParam('id');
		$metadata = $this->metadataStorage->getMetaData($this->userId ?? '', (int)$fileId);
		$decodedMetadata = json_decode($metadata, true);

		if ($decodedMetadata['metadata']['version'] === 1) {
			return;
		}

		if ($decodedMetadata['metadata']['version'] === '1.2') {
			return;
		}

		if ($decodedMetadata['metadata']['version'] === 1.2) {
			return;
		}

		throw new OCSForbiddenException('Client version cannot handle the requested encryption version.');
	}
}
