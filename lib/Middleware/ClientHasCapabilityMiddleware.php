<?php

declare(strict_types=1);
/**
 * SPDX-License-Identifier: AGPL-3.0+
 *
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
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

		if ($decodedMetadata['metadata']['version'] === "1.2") {
			return;
		}

		if ($decodedMetadata['metadata']['version'] === 1.2) {
			return;
		}

		throw new OCSForbiddenException('Client version cannot handle the requested encryption version.');
	}
}
