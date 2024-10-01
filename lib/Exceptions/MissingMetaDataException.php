<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption\Exceptions;

use Exception;
use Throwable;

class MissingMetaDataException extends Exception {

	/**
	 * MissingMetaDataException constructor.
	 *
	 * @param string $message
	 * @param int $code
	 * @param Throwable|null $previous
	 */
	public function __construct(string $message = 'can\'t find meta data file', int $code = 0, ?Throwable $previous = null) {
		parent::__construct($message, $code, $previous);
	}
}
