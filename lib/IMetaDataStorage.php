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
	 * get meta data file
	 *
	 * @param int $id
	 * @return string
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function getMetaData(int $id): string;

	/**
	 * set meta data file into intermediate file
	 *
	 * @param int $id file id
	 * @param string $metaData
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws MetaDataExistsException
	 */
	public function setMetaDataIntoIntermediateFile(int $id, string $metaData): void;

	/**
	 * update meta data file into intermediate file
	 *
	 * @param int $id file id
	 * @param string $fileKey
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws MissingMetaDataException
	 */
	public function updateMetaDataIntoIntermediateFile(int $id, string $fileKey): void;

	/**
	 * Moves intermediate metadata file to final file
	 *
	 * @param int $id file id
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 * @throws MissingMetaDataException
	 */
	public function saveIntermediateFile(int $id): void;

	/**
	 * Delete the previously set intermediate file
	 *
	 * @param int $id file id
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function deleteIntermediateFile(int $id): void;

	/**
	 * delete meta data file (and backup)
	 *
	 * @param int $id
	 *
	 * @throws NotPermittedException
	 * @throws NotFoundException
	 */
	public function deleteMetaData(int $id): void;
}
