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
use OCP\AppFramework\Services\IInitialState;
use OCP\Defaults;
use OCP\Files\FileInfo;
use OCP\Files\NotFoundException;
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
		private IInitialState $initialState,
		private IKeyStorage $keyStorage,
		private LoggerInterface $logger,
		private MetaDataStorage $metadataStorage,
	) {
	}

	public function shouldRespond(IShare $share): bool {
		$node = $share->getNode();
		return $node->getType() === FileInfo::TYPE_FOLDER && $node->isEncrypted();
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

		$this->initialState->provideInitialState('publicKeys', $publicKeys);
		$this->initialState->provideInitialState('fileId', $shareNode->getId());
		$this->initialState->provideInitialState('token', $token);
		$this->initialState->provideInitialState('fileName', $shareNode->getName());
		$this->initialState->provideInitialState('encryptionVersion', $metadata['version']);

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
