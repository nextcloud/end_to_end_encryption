<?php
/**
 * @copyright Copyright (c) 2018 Bjoern Schiessle <bjoern@schiessle.org>
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

use OCP\IUser;

interface IKeyStorage {

	/**
	 * store public key
	 *
	 * @param string $publicKey
	 * @param string $uid
	 * @return bool
	 *
	 * @throws \Exception
	 */
	public function setPublicKey($publicKey, $uid);

	/**
	 * check if a public key exists
	 *
	 * @param string $uid
	 * @return bool
	 */
	public function publicKeyExists($uid);

	/**
	 * get users public key
	 *
	 * @param string $uid
	 * @return string
	 *
	 * @throws \RuntimeException
	 * @throws NotFoundException
	 */
	public function getPublicKey($uid);


	/**
	 * delete the users public key
	 *
	 * @param string $uid
	 * @return bool
	 *
	 * @throws NotPermittedException
	 * @throws \RuntimeException
	 * @throws NotFoundException
	 */
	public function deletePublicKey($uid);


	/**
	 * store private key
	 *
	 * @param string $privateKey
	 * @param string $uid
	 * @return bool
	 *
	 * @throw KeyExistsException
	 */
	public function setPrivateKey($privateKey, $uid);


	/**
	 * get users private key
	 *
	 * @param string $uid
	 * @return string
	 *
	 * @throws \RuntimeException
	 * @throws NotFoundException
	 * @throws ForbiddenException
	 */
	public function getPrivateKey($uid);

	/**
	 * get users private key
	 *
	 * @param string $uid
	 * @return bool
	 *
	 * @throws NotPermittedException
	 * @throws \RuntimeException
	 * @throws NotFoundException
	 */
	public function deletePrivateKey($uid);
	/**
	 * delete all user private and public key permanently
	 *
	 * @param IUser $user
	 */
	public function deleteUserKeys(IUser $user);

}
