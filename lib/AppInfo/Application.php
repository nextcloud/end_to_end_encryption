<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\EndToEndEncryption\AppInfo;

use OCA\DAV\Events\SabrePluginAddEvent;
use OCA\EndToEndEncryption\Capabilities;
use OCA\EndToEndEncryption\Connector\Sabre\LockPlugin;
use OCA\EndToEndEncryption\Connector\Sabre\RedirectRequestPlugin;
use OCA\EndToEndEncryption\E2EEPublicShareTemplateProvider;
use OCA\EndToEndEncryption\EncryptionManager;
use OCA\EndToEndEncryption\IKeyStorage;
use OCA\EndToEndEncryption\IMetaDataStorage;
use OCA\EndToEndEncryption\IMetaDataStorageV1;
use OCA\EndToEndEncryption\KeyStorage;
use OCA\EndToEndEncryption\Listener\AllowBlobMediaInCSPListener;
use OCA\EndToEndEncryption\Listener\LoadAdditionalListener;
use OCA\EndToEndEncryption\Listener\UserDeletedListener;
use OCA\EndToEndEncryption\MetaDataStorage;
use OCA\EndToEndEncryption\MetaDataStorageV1;
use OCA\EndToEndEncryption\Middleware\CanUseAppMiddleware;
use OCA\EndToEndEncryption\Middleware\ClientHasCapabilityMiddleware;
use OCA\EndToEndEncryption\Middleware\UserAgentCheckMiddleware;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCA\Files_Trashbin\Events\MoveToTrashEvent;
use OCA\Files_Versions\Events\CreateVersionEvent;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;
use OCP\User\Events\UserDeletedEvent;
use Override;

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

	#[Override]
	public function register(IRegistrationContext $context): void {
		$context->registerCapability(Capabilities::class);
		$context->registerMiddleware(UserAgentCheckMiddleware::class);
		$context->registerMiddleware(CanUseAppMiddleware::class);
		$context->registerMiddleware(ClientHasCapabilityMiddleware::class);
		$context->registerServiceAlias(IKeyStorage::class, KeyStorage::class);
		$context->registerServiceAlias(IMetaDataStorageV1::class, MetaDataStorageV1::class);
		$context->registerServiceAlias(IMetaDataStorage::class, MetaDataStorage::class);
		$context->registerEventListener(UserDeletedEvent::class, UserDeletedListener::class);
		$context->registerEventListener(LoadAdditionalScriptsEvent::class, LoadAdditionalListener::class);
		$context->registerEventListener(AddContentSecurityPolicyEvent::class, AllowBlobMediaInCSPListener::class);
		$context->registerPublicShareTemplateProvider(E2EEPublicShareTemplateProvider::class);
	}

	#[Override]
	public function boot(IBootContext $context): void {
		$eventDispatcher = $context->getServerContainer()->get(IEventDispatcher::class);
		$eventDispatcher->addListener(SabrePluginAddEvent::class, function (SabrePluginAddEvent $event): void {
			$server = $event->getServer();

			// We have to register the LockPlugin here and not info.xml,
			// because info.xml plugins are loaded, after the
			// beforeMethod:* hook has already been emitted.
			$server->addPlugin($this->getContainer()->get(LockPlugin::class));
			$server->addPlugin($this->getContainer()->get(RedirectRequestPlugin::class));
		});

		$eventDispatcher->addListener(MoveToTrashEvent::class, function (MoveToTrashEvent $event): void {
			/** @var EncryptionManager $encryptionManager */
			$encryptionManager = $this->getContainer()->get(EncryptionManager::class);

			$node = $event->getNode();
			if ($encryptionManager->isEncryptedFile($node)) {
				$event->disableTrashBin();
			}
		});


		$eventDispatcher->addListener(CreateVersionEvent::class, function (CreateVersionEvent $event): void {
			/** @var EncryptionManager $encryptionManager */
			$encryptionManager = $this->getContainer()->get(EncryptionManager::class);

			$node = $event->getNode();
			if ($encryptionManager->isEncryptedFile($node)) {
				$event->disableVersions();
			}
		});
	}
}
