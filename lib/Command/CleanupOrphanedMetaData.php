<?php

declare(strict_types=1);
/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Command;

use OCA\EndToEndEncryption\OrphanedMetaDataCleaner;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Removes the metadata of end-to-end encrypted folders that no longer exist.
 */
class CleanupOrphanedMetaData extends Command {
	public function __construct(
		private readonly OrphanedMetaDataCleaner $cleaner,
	) {
		parent::__construct();
	}

	#[\Override]
	protected function configure(): void {
		$this
			->setName('end_to_end_encryption:cleanup-orphaned-metadata')
			->setDescription('Remove the metadata of end-to-end encrypted folders that no longer exist')
			->addOption('dry-run', null, InputOption::VALUE_NONE, 'Only list the orphaned metadata without removing it');
	}

	#[\Override]
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$entries = $this->cleaner->findOrphanedMetaData();
		if ($entries === []) {
			$output->writeln('<info>No orphaned metadata found.</info>');
			return self::SUCCESS;
		}

		(new Table($output))
			->setHeaders(['User', 'File ID', 'Metadata path'])
			->setRows(array_map(static fn (array $entry): array => [
				$entry['user'] ?? '(unknown)',
				$entry['fileId'] ?? '',
				$entry['path'],
			], $entries))
			->render();

		if ($input->getOption('dry-run')) {
			$output->writeln('Found ' . count($entries) . ' orphaned metadata entries, run without --dry-run to remove them.');
			return self::SUCCESS;
		}

		$failed = 0;
		foreach ($entries as $entry) {
			try {
				$this->cleaner->deleteOrphanedMetaData($entry);
			} catch (\Exception $e) {
				$failed++;
				$output->writeln('<error>Could not remove the metadata "' . $entry['path'] . '": ' . $e->getMessage() . '</error>');
			}
		}

		$output->writeln('Removed ' . (count($entries) - $failed) . ' orphaned metadata entries.');
		return $failed === 0 ? self::SUCCESS : self::FAILURE;
	}
}
