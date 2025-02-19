<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption\Db;

use OCP\AppFramework\Db\Entity;
use OCP\DB\Types;

/**
 * @method int getId()
 * @method void setId(int $id)
 * @method int getTimestamp()
 * @method void setTimestamp(int $timestamp)
 * @method string getToken()
 * @method void setToken(string $token)
 */
class Lock extends Entity {
	protected ?int $timestamp = null;
	protected ?string $token = null;

	public function __construct() {
		$this->addType('id', Types::INTEGER);
		$this->addType('timestamp', Types::INTEGER);
		$this->addType('token', Types::STRING);
	}
}
