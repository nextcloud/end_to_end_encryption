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
use OCA\EndToEndEncryption\Connector\Sabre\RedirectRequestPlugin;
use OCA\EndToEndEncryption\EncryptionManager;
use OCA\EndToEndEncryption\IKeyStorage;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\KeyStorage;
use OCA\EndToEndEncryption\Listener\UserDeletedListener;
use OCA\EndToEndEncryption\MetaDataStorage;
use OCA\EndToEndEncryption\Middleware\UserAgentCheckMiddleware;
use OCA\EndToEndEncryption\Middleware\CanUseAppMiddleware;
use OCA\Files_Trashbin\Events\MoveToTrashEvent;
use OCA\Files_Versions\Events\CreateVersionEvent;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\SabrePluginEvent;
use OCP\User\Events\UserDeletedEvent;

class Application extends App implements IBootstrap {
	public const APP_ID = 'end_to_end_encryption';

	/**
	 * Application constructor.
	 *
	 * @param array $urlParams
	 */
	public function __construct(array $urlParams = []) {
		parent::__construct(self::APP_ID, $urlParams);
	}


	/**
	 * @inheritDoc
	 */
	public function register(IRegistrationContext $context): void {
		$context->registerCapability(Capabilities::class);
		$context->registerMiddleware(UserAgentCheckMiddleware::class);
		$context->registerMiddleware(CanUseAppMiddleware::class);
		$context->registerServiceAlias(IKeyStorage::class, KeyStorage::class);
		$context->registerServiceAlias(IMetaDataStorage::class, MetaDataStorage::class);
		$context->registerEventListener(UserDeletedEvent::class, UserDeletedListener::class);
	}

	/**
	 * @inheritDoc
	 */
	public function boot(IBootContext $context): void {
		$eventDispatcher = $context->getServerContainer()->get(IEventDispatcher::class);
		$eventDispatcher->addListener('OCA\DAV\Connector\Sabre::addPlugin', function (SabrePluginEvent $event): void {
			$server = $event->getServer();

			if ($server !== null) {
				// We have to register the LockPlugin here and not info.xml,
				// because info.xml plugins are loaded, after the
				// beforeMethod:* hook has already been emitted.
				$server->addPlugin($this->getContainer()->get(LockPlugin::class));
				$server->addPlugin($this->getContainer()->get(RedirectRequestPlugin::class));
			}
		});

		$eventDispatcher->addListener('OCA\Files_Trashbin::moveToTrash', function (MoveToTrashEvent $event): void {
			/** @var EncryptionManager $encryptionManager */
			$encryptionManager = $this->getContainer()->get(EncryptionManager::class);

			$node = $event->getNode();
			if ($encryptionManager->isEncryptedFile($node)) {
				$event->disableTrashBin();
			}
		});


		$eventDispatcher->addListener('OCA\Files_Versions::createVersion', function (CreateVersionEvent $event): void {
			/** @var EncryptionManager $encryptionManager */
			$encryptionManager = $this->getContainer()->get(EncryptionManager::class);

			$node = $event->getNode();
			if ($encryptionManager->isEncryptedFile($node)) {
				$event->disableVersions();
			}
		});
	}
}
