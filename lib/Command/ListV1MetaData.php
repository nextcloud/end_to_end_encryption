<?php

declare(strict_types=1);
/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption\Command;

use OCA\EndToEndEncryption\V1MetaDataScanner;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Lists all end-to-end encrypted folders that still use the legacy v1 metadata format.
 */
class ListV1MetaData extends Command {
	public function __construct(
		private readonly V1MetaDataScanner $scanner,
	) {
		parent::__construct();
	}

	#[\Override]
	protected function configure(): void {
		$this
			->setName('end_to_end_encryption:list-v1-metadata')
			->setDescription('List end-to-end encrypted folders (and their owners) that still use v1 metadata')
			->addOption('users-only', null, InputOption::VALUE_NONE, 'Only list the affected accounts')
			->addOption('json', null, InputOption::VALUE_NONE, 'Output as JSON');
	}

	#[\Override]
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$entries = $this->scanner->findV1MetaData();

		if ($input->getOption('users-only')) {
			$users = array_map(
				static fn (?string $user): string => $user ?? '(unknown)',
				$this->scanner->findAffectedUsers($entries),
			);

			if ($input->getOption('json')) {
				$output->writeln(json_encode($users, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT));
			} else {
				foreach ($users as $user) {
					$output->writeln($user);
				}
			}
			return self::SUCCESS;
		}

		if ($input->getOption('json')) {
			$output->writeln(json_encode($entries, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT));
			return self::SUCCESS;
		}

		if ($entries === []) {
			$output->writeln('<info>No v1 metadata found.</info>');
			return self::SUCCESS;
		}

		(new Table($output))
			->setHeaders(['User', 'File ID', 'Path', 'Version'])
			->setRows(array_map(static fn (array $entry): array => [
				$entry['user'] ?? '(unknown)',
				$entry['fileId'] ?? '',
				$entry['path'] ?? '',
				is_scalar($entry['version']) ? (string)$entry['version'] : 'legacy',
			], $entries))
			->render();

		return self::SUCCESS;
	}
}
