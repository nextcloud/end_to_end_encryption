<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption\Exceptions;

use Exception;
use Throwable;

class FileNotLockedException extends Exception {
	public function __construct(string $message = 'File is not locked', int $code = 0, ?Throwable $previous = null) {
		parent::__construct($message, $code, $previous);
	}
}
