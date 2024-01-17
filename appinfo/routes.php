<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
 *
 * @author Bjoern Schiessle <bjoern@schiessle.org>
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


return [
	'ocs' => [
		# v1
		['name' => 'Key#setPrivateKey', 'url' => '/api/v{apiVersion}/private-key', 'verb' => 'POST', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'Key#getPrivateKey', 'url' => '/api/v{apiVersion}/private-key', 'verb' => 'GET', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'Key#deletePrivateKey', 'url' => '/api/v{apiVersion}/private-key', 'verb' => 'DELETE', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'Key#createPublicKey', 'url' => '/api/v{apiVersion}/public-key', 'verb' => 'POST', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'Key#getPublicKeys', 'url' => '/api/v{apiVersion}/public-key', 'verb' => 'GET', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'Key#deletePublicKey', 'url' => '/api/v{apiVersion}/public-key', 'verb' => 'DELETE', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'Key#getPublicServerKey', 'url' => '/api/v{apiVersion}/server-key', 'verb' => 'GET', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'V1\MetaData#setMetaData', 'url' => '/api/v1/meta-data/{id}', 'verb' => 'POST'],
		['name' => 'V1\MetaData#getMetaData', 'url' => '/api/v1/meta-data/{id}', 'verb' => 'GET'],
		['name' => 'V1\MetaData#updateMetaData', 'url' => '/api/v1/meta-data/{id}', 'verb' => 'PUT'],
		['name' => 'V1\MetaData#deleteMetaData', 'url' => '/api/v1/meta-data/{id}', 'verb' => 'DELETE'],
		['name' => 'V1\MetaData#addMetadataFileDrop', 'url' => '/api/v1/meta-data/{id}/filedrop', 'verb' => 'PUT'],
		['name' => 'Encryption#removeEncryptedFolders', 'url' => '/api/v{apiVersion}/encrypted-files', 'verb' => 'DELETE', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'Encryption#setEncryptionFlag', 'url' => '/api/v{apiVersion}/encrypted/{id}', 'verb' => 'PUT', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'Encryption#removeEncryptionFlag', 'url' => '/api/v{apiVersion}/encrypted/{id}', 'verb' => 'DELETE', 'requirements' => array('apiVersion' => '[1-2]')],
		['name' => 'V1\Locking#lockFolder', 'url' => '/api/v1/lock/{id}', 'verb' => 'POST'],
		['name' => 'V1\Locking#unlockFolder', 'url' => '/api/v1/lock/{id}', 'verb' => 'DELETE'],
		# v2
		['name' => 'MetaData#setMetaData', 'url' => '/api/v2/meta-data/{id}', 'verb' => 'POST'],
		['name' => 'MetaData#getMetaData', 'url' => '/api/v2/meta-data/{id}', 'verb' => 'GET'],
		['name' => 'MetaData#updateMetaData', 'url' => '/api/v2/meta-data/{id}', 'verb' => 'PUT'],
		['name' => 'MetaData#deleteMetaData', 'url' => '/api/v2/meta-data/{id}', 'verb' => 'DELETE'],
		['name' => 'MetaData#addMetadataFileDrop', 'url' => '/api/v2/meta-data/{id}/filedrop', 'verb' => 'PUT'],
		['name' => 'Locking#lockFolder', 'url' => '/api/v2/lock/{id}', 'verb' => 'POST'],
		['name' => 'Locking#unlockFolder', 'url' => '/api/v2/lock/{id}', 'verb' => 'DELETE'],
	],
];
