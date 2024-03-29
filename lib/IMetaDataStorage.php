<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
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
namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\Exceptions\MetaDataExistsException;
use OCA\EndToEndEncryption\Exceptions\MissingMetaDataException;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;

/**
 * Interface IMetaDataStorage
 *
 * @package OCA\EndToEndEncryption
 */
interface IMetaDataStorage {

	/**
	 * Get meta data file
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function getMetaData(string $userId, int $id): string;

	/**
	 * Set meta data file into intermediate file
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws MetaDataExistsException
	 */
	public function setMetaDataIntoIntermediateFile(string $userId, int $id, string $metaData, string $token, string $signature): void;

	/**
	 * Update meta data file into intermediate file
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws MissingMetaDataException
	 */
	public function updateMetaDataIntoIntermediateFile(string $userId, int $id, string $fileKey, string $token, string $signature = ''): void;

	/**
	 * Moves intermediate metadata file to final file
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws MissingMetaDataException
	 */
	public function saveIntermediateFile(string $userId, int $id): void;

	/**
	 * Get the stored signature
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function readSignature(int $id): string;

	/**
	 * Delete the previously set intermediate file
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function deleteIntermediateFile(string $userId, int $id): void;

	/**
	 * Delete meta data file (and backup)
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function deleteMetaData(string $userId, int $id): void;

	/**
	 * Return the list of folders marked as touched.
	 *
	 * @return int[]
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function getTouchedFolders(string $token): array;

	/**
	 * Clear the list of touched folder for a token.
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function clearTouchedFolders(string $token): void;

	/**
	 * Get the latest received counter.
	 */
	public function getCounter(int $id): int;

	/**
	 * Save the latest received counter in an intermediate file.
	 */
	public function saveIntermediateCounter(int $id, int $counter): void;
}
