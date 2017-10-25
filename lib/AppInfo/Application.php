<?php
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
use OCA\EndToEndEncryption\KeyStorage;
use OCA\EndToEndEncryption\LockManager;
use OCA\EndToEndEncryption\UserAgentManager;
use OCA\EndToEndEncryption\UserManager;
use OCA\Files_Trashbin\Events\MoveToTrashEvent;
use OCA\Files_Versions\Events\CreateVersionEvent;
use OCP\AppFramework\App;
use OCP\SabrePluginEvent;

class Application extends App {

	public function __construct() {
		parent::__construct('end_to_end_encryption');

		$container = $this->getContainer();
		$container->registerCapability(Capabilities::class);
	}

	public function registerEvents() {

		// register sabredav plugin to control client access to encrypted files
		$eventDispatcher = $this->getContainer()->getServer()->getEventDispatcher();
		$eventDispatcher->addListener('OCA\DAV\Connector\Sabre::addPlugin', function(SabrePluginEvent $event) {
			$rootFolder = \OC::$server->getRootFolder();
			$userSession = \OC::$server->getUserSession();
			$lockManager = $this->getContainer()->query(LockManager::class);
			$request = $this->getContainer()->getServer()->getRequest();
			$userAgentManager = $this->getContainer()->query(UserAgentManager::class);
			$urlGenerator = \OC::$server->getURLGenerator();
			$event->getServer()->addPlugin(new LockPlugin($rootFolder, $userSession, $lockManager, $userAgentManager, $urlGenerator));
			$event->getServer()->addPlugin(new PropFindPlugin($userAgentManager, $request));
		});

		/** @var EncryptionManager $encryptionManager */
		$encryptionManager = $this->getContainer()->query(EncryptionManager::class);

		$eventDispatcher->addListener('OCA\Files_Trashbin::moveToTrash', function(MoveToTrashEvent $event) use ($encryptionManager) {
			$node = $event->getNode();
			if ($encryptionManager->isEncryptedFile($node)) {
				$event->disableTrashBin();
			}
		});


		$eventDispatcher->addListener('OCA\Files_Versions::createVersion', function(CreateVersionEvent $event) use ($encryptionManager) {
			$node = $event->getNode();
			if ($encryptionManager->isEncryptedFile($node)) {
				$event->disableVersions();
			}
		});

		// listen to user management signals to delete user specific key if a user was deleted
		$userManager = \OC::$server->getUserManager();
		$keyStorage = new KeyStorage(
			\OC::$server->getAppDataDir('end_to_end_encryption'),
			\OC::$server->getUserSession(),
			\OC::$server->getLogger(),
			\OC::$server->getRootFolder(),
			\OC::$server->getUserManager());
		$cseUserManager = new UserManager($keyStorage);
		$userManager->listen('\OC\User', 'postDelete', [$cseUserManager, 'deleteUserKeys']);
	}

}
