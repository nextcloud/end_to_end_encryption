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
		['name' => 'Key#setPrivateKey', 'url' => '/api/v1/private-key', 'verb' => 'POST'],
		['name' => 'Key#getPrivateKey', 'url' => '/api/v1/private-key', 'verb' => 'GET'],
		['name' => 'Key#deletePrivateKey', 'url' => '/api/v1/private-key', 'verb' => 'DELETE'],
		['name' => 'Key#createPublicKey', 'url' => '/api/v1/public-key', 'verb' => 'POST'],
		['name' => 'Key#getPublicKeys', 'url' => '/api/v1/public-key', 'verb' => 'GET'],
		['name' => 'Key#deletePublicKey', 'url' => '/api/v1/public-key', 'verb' => 'DELETE'],
		['name' => 'Key#getPublicServerKey', 'url' => '/api/v1/server-key', 'verb' => 'GET'],
		['name' => 'MetaData#setMetaData', 'url' => '/api/v1/meta-data/{id}', 'verb' => 'POST'],
		['name' => 'MetaData#getMetaData', 'url' => '/api/v1/meta-data/{id}', 'verb' => 'GET'],
		['name' => 'MetaData#updateMetaData', 'url' => '/api/v1/meta-data/{id}', 'verb' => 'PUT'],
		['name' => 'MetaData#deleteMetaData', 'url' => '/api/v1/meta-data/{id}', 'verb' => 'DELETE'],
		['name' => 'Encryption#removeEncryptedFolders', 'url' => '/api/v1/encrypted-files', 'verb' => 'DELETE'],
		['name' => 'Encryption#setEncryptionFlag', 'url' => '/api/v1/encrypted/{id}', 'verb' => 'PUT'],
		['name' => 'Encryption#removeEncryptionFlag', 'url' => '/api/v1/encrypted/{id}', 'verb' => 'DELETE'],
		['name' => 'Locking#lockFolder', 'url' => '/api/v1/lock/{id}', 'verb' => 'POST'],
		['name' => 'Locking#unlockFolder', 'url' => '/api/v1/lock/{id}', 'verb' => 'DELETE'],
	],
];
