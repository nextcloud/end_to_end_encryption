<?php
declare(strict_types=1);
/**
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
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


namespace OCA\EndToEndEncryption\AppInfo;

use OCA\EndToEndEncryption\Capabilities;
use OCA\EndToEndEncryption\Connector\Sabre\LockPlugin;
use OCA\EndToEndEncryption\Connector\Sabre\PropFindPlugin;
use OCA\EndToEndEncryption\EncryptionManager;
use OCA\EndToEndEncryption\LockManager;
use OCA\EndToEndEncryption\UserAgentManager;
use OCA\EndToEndEncryption\UserManager;
use OCA\Files_Trashbin\Events\MoveToTrashEvent;
use OCA\Files_Versions\Events\CreateVersionEvent;
use OCP\AppFramework\App;
use OCP\IUser;
use OCP\IUserManager;
use OCP\SabrePluginEvent;

class Application extends App {

	public const APP_ID = 'end_to_end_encryption';

	/**
	 * Application constructor.
	 *
	 * @param array $urlParams
	 */
	public function __construct(array $urlParams = []) {
		parent::__construct(self::APP_ID, $urlParams);

		$container = $this->getContainer();
		$container->registerCapability(Capabilities::class);
	}

	public function registerEvents():void {
		$eventDispatcher = $this->getContainer()->getServer()->getEventDispatcher();

		$eventDispatcher->addListener('OCA\Files_Trashbin::moveToTrash', function(MoveToTrashEvent $event) {
			/** @var EncryptionManager $encryptionManager */
			$encryptionManager = $this->getContainer()->query(EncryptionManager::class);

			$node = $event->getNode();
			if ($encryptionManager->isEncryptedFile($node)) {
				$event->disableTrashBin();
			}
		});


		$eventDispatcher->addListener('OCA\Files_Versions::createVersion', function(CreateVersionEvent $event) {
			/** @var EncryptionManager $encryptionManager */
			$encryptionManager = $this->getContainer()->query(EncryptionManager::class);

			$node = $event->getNode();
			if ($encryptionManager->isEncryptedFile($node)) {
				$event->disableVersions();
			}
		});

		// listen to user management signals to delete user specific key if a user was deleted
		$this->getContainer()->getServer()->getUserManager()->listen('\OC\User', 'postDelete', function(IUser $user) {
			/** @var UserManager $cseUserManager */
			$cseUserManager = $this->getContainer()->getServer()->query(UserManager::class);
			$cseUserManager->deleteUserKeys($user);
		});
	}

}
