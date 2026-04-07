<?php

/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

use OCA\EndToEndEncryption\AppInfo\Application;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\Template\PublicTemplateResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\Constants;
use OCP\Defaults;
use OCP\Files\FileInfo;
use OCP\Files\NotFoundException;
use OCP\IInitialStateService;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\IUserManager;
use OCP\Share\IPublicShareTemplateProvider;
use OCP\Share\IShare;
use OCP\Util;
use Psr\Log\LoggerInterface;

class E2EEPublicShareTemplateProvider implements IPublicShareTemplateProvider {
	public function __construct(
		private IUserManager $userManager,
		private IUrlGenerator $urlGenerator,
		private IL10N $l10n,
		private Defaults $defaults,
		private IInitialStateService $initialState,
		private IKeyStorage $keyStorage,
		private LoggerInterface $logger,
		private MetaDataStorage $metadataStorage,
	) {
	}

	public function shouldRespond(IShare $share): bool {
		$node = $share->getNode();

		return $node->getType() === FileInfo::TYPE_FOLDER
			&& $node->isEncrypted()
			&& ($share->getPermissions() & Constants::PERMISSION_READ) === 0;
	}

	protected function getMetadata(IShare $share): array {
		$shareNode = $share->getNode();

		$owner = $this->userManager->get($share->getShareOwner());
		if ($owner === null) {
			$e = new NotFoundException("Cannot find folder's owner");
			throw $e;
		}

		$topE2eeFolder = $shareNode;
		while ($topE2eeFolder->getParent()->isEncrypted()) {
			$topE2eeFolder = $shareNode->getParent();
		}

		$rawMetadata = $this->metadataStorage->getMetaData($owner->getUID(), $topE2eeFolder->getId());
		return json_decode($rawMetadata, true);
	}

	protected function getPublicKeys(array $metadata): array {
		$userIds = array_map(fn (array $userEntry): string => $userEntry['userId'], $metadata['users']);

		return array_reduce(
			$userIds,
			function (array $acc, string $userId): array {
				$acc[$userId] = $this->keyStorage->getPublicKey($userId);
				return $acc;
			},
			[]
		);
	}

	public function renderPage(IShare $share, string $token, string $path): TemplateResponse {
		$shareNode = $share->getNode();

		try {
			$metadata = $this->getMetadata($share);
			$publicKeys = $this->getPublicKeys($metadata);
		} catch (NotFoundException $e) {
			$this->logger->error($e->getMessage(), ['exception' => $e]);
			return new TemplateResponse(Application::APP_ID, 'error');
		}

		// standard state
		$this->initialState->provideInitialState('files_sharing', 'isPublic', true);
		$this->initialState->provideInitialState('files_sharing', 'sharingToken', $token);
		// app state
		$this->initialState->provideInitialState(Application::APP_ID, 'publicKeys', $publicKeys);
		$this->initialState->provideInitialState(Application::APP_ID, 'fileId', (string)$shareNode->getId()); // explicit cast to string for future snowflake support
		$this->initialState->provideInitialState(Application::APP_ID, 'fileName', $shareNode->getName());
		$this->initialState->provideInitialState(Application::APP_ID, 'metadataVersion', (float)$metadata['version']);

		// OpenGraph Support: http://ogp.me/
		Util::addHeader('meta', ['property' => 'og:title', 'content' => $this->l10n->t('Encrypted share')]);
		Util::addHeader('meta', ['property' => 'og:description', 'content' => $this->defaults->getName() . ($this->defaults->getSlogan() !== '' ? ' - ' . $this->defaults->getSlogan() : '')]);
		Util::addHeader('meta', ['property' => 'og:site_name', 'content' => $this->defaults->getName()]);
		Util::addHeader('meta', ['property' => 'og:url', 'content' => $this->urlGenerator->linkToRouteAbsolute('files_sharing.sharecontroller.showShare', ['token' => $token])]);
		Util::addHeader('meta', ['property' => 'og:type', 'content' => 'object']);

		$csp = new ContentSecurityPolicy();
		$csp->addAllowedFrameDomain('\'self\'');

		\OCP\Util::addStyle(Application::APP_ID, Application::APP_ID . '-filedrop');
		\OCP\Util::addScript(Application::APP_ID, Application::APP_ID . '-filedrop');

		$response = new PublicTemplateResponse(Application::APP_ID, 'filesdrop', []);
		$response->setHeaderTitle($this->l10n->t('Encrypted share'));

		$response->setContentSecurityPolicy($csp);
		return $response;
	}
}
