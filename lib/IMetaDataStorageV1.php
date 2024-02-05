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
interface IMetaDataStorageV1 {

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
	public function setMetaDataIntoIntermediateFile(string $userId, int $id, string $metaData): void;

	/**
	 * Update meta data file into intermediate file
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws MissingMetaDataException
	 */
	public function updateMetaDataIntoIntermediateFile(string $userId, int $id, string $fileKey): void;

	/**
	 * Moves intermediate metadata file to final file
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws MissingMetaDataException
	 */
	public function saveIntermediateFile(string $userId, int $id): void;

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
}
