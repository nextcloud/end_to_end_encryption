<?php

declare(strict_types=1);

/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\EndToEndEncryption\Controller;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;

trait ThrottleRequestTrait {
	/**
	 * @template S of Http::STATUS_*
	 * @template M of string
	 * @param S $statusCode
	 * @return DataResponse<S, array{message: M}, array{}>
	 */
	private function throttleRequest(int $statusCode, string $message): DataResponse {
		$response = new DataResponse(['message' => $message], $statusCode);
		$response->throttle();
		return $response;
	}
}
