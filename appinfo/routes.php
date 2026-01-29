<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


return [
	'ocs' => [
		['name' => 'Key#getPrivateKey', 'url' => '/api/v2/private-key', 'verb' => 'GET'],
		['name' => 'Key#setPrivateKey', 'url' => '/api/v2/private-key', 'verb' => 'POST'],
		['name' => 'Key#deletePrivateKey', 'url' => '/api/v2/private-key', 'verb' => 'DELETE'],
		['name' => 'Key#getPublicKeys', 'url' => '/api/v2/public-key', 'verb' => 'GET'],
		['name' => 'Key#setPublicKey', 'url' => '/api/v2/public-key', 'verb' => 'PUT'],
		['name' => 'Key#createPublicKey', 'url' => '/api/v2/public-key', 'verb' => 'POST'],
		['name' => 'Key#deletePublicKey', 'url' => '/api/v2/public-key', 'verb' => 'DELETE'],
		['name' => 'Key#getPublicServerKey', 'url' => '/api/v2/server-key', 'verb' => 'GET'],
		['name' => 'Encryption#removeEncryptedFolders', 'url' => '/api/v2/encrypted-files', 'verb' => 'DELETE'],
		['name' => 'Encryption#setEncryptionFlag', 'url' => '/api/v2/encrypted/{id}', 'verb' => 'PUT'],
		['name' => 'Encryption#removeEncryptionFlag', 'url' => '/api/v2/encrypted/{id}', 'verb' => 'DELETE'],
		['name' => 'MetaData#getMetaData', 'url' => '/api/v2/meta-data/{id}', 'verb' => 'GET'],
		['name' => 'MetaData#setMetaData', 'url' => '/api/v2/meta-data/{id}', 'verb' => 'POST'],
		['name' => 'MetaData#updateMetaData', 'url' => '/api/v2/meta-data/{id}', 'verb' => 'PUT'],
		['name' => 'MetaData#deleteMetaData', 'url' => '/api/v2/meta-data/{id}', 'verb' => 'DELETE'],
		['name' => 'MetaData#addMetadataFileDrop', 'url' => '/api/v2/meta-data/{id}/filedrop', 'verb' => 'PUT'],
		['name' => 'Locking#lockFolder', 'url' => '/api/v2/lock/{id}', 'verb' => 'POST'],
		['name' => 'Locking#unlockFolder', 'url' => '/api/v2/lock/{id}', 'verb' => 'DELETE'],
	],
];
