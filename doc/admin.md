<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
# End-to-end encryption: Administrator documentation

This document describes how to install, configure and maintain the end-to-end encryption (E2EE) app on a Nextcloud server.
For setting up and using end-to-end encryption as a user see the [user documentation](user.md).

## Table of contents

- [Installing](#installing)
- [Administration settings](#administration-settings)
- [Configuration](#configuration)
  - [Chunked uploads](#chunked-uploads)
  - [User agent configuration](#user-agent-configuration)
- [Legacy v1 metadata](#legacy-v1-metadata)
  - [Setup check](#setup-check)
- [OCC commands](#occ-commands)
  - [List folders with v1 metadata](#list-folders-with-v1-metadata)
  - [Clean up orphaned metadata](#clean-up-orphaned-metadata)
- [Audit logging](#audit-logging)
- [Recovery](#recovery)

## Installing

1. Make sure the Server-Side Encryption app is disabled (or uninstalled)
2. Install then enable the End-to-End Encryption app on your server. No configuration is required on the server other than this.

Users then set up end-to-end encryption in their clients, see the [user documentation](user.md#setting-up-end-to-end-encryption).

> [!CAUTION]
> The mnemonic of a user is *not* recoverable by a server administrator. If a user loses their mnemonic they *will* lose access to their encrypted data.

## Administration settings

The end-to-end encryption settings are found under *Administration settings -> Security*:

![End-to-end encryption administration settings](https://github.com/nextcloud/end_to_end_encryption/assets/1731941/bca6dec4-66fd-4ffa-a869-d7ef01f4a096)

- **Limit to groups**: When at least one group is selected, only members of the selected groups can use end-to-end encryption.
- **Debugging tools**: Allow users to enable the [debugging tools](user.md#debugging-tools) in their personal settings.
  They add a "Debug encryption" action to encrypted folders in the web interface, which shows the folder metadata and helps to investigate issues with encrypted folders.

## Configuration

### Chunked uploads

> [!CAUTION]
> When the web interface is used for end-to-end encryption then chunked uploads have to be disabled!

### User agent configuration

The default user agent configuration is reasonable for all current official stable client releases, but sometimes needs to be adjusted when running custom or development client builds.

```php
// config/config.php

    ...,
    // Allow to configure which client are supported (e.g. custom clients)
    'end_to_end_encryption.supported-user-agents' => [
        '/^Mozilla\/5\.0 \(Android\) Nextcloud\-android\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.13.0',
        '/^Mozilla\/5\.0 \([A-Za-z ]+\) (mirall|csyncoC)\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.0.0',
        '/^Mozilla\/5\.0 \(iOS\) Nextcloud\-iOS\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.0.5',
    ]
```

## Legacy v1 metadata

> [!WARNING]
> Encrypted folders created with older clients may still use the legacy v1 metadata format.
> Support for v1 metadata will be dropped soon, after which these folders can no longer be accessed.

Affected users need to open their encrypted folders with an up-to-date desktop client, which migrates them to the current v2 metadata format.

### Setup check

The app adds the setup check *End-to-end encryption metadata version* to the administration overview (*Administration settings -> Overview*).
It warns if v1 metadata is still in use and lists the affected accounts, so you can contact them before support for v1 metadata is dropped.

If the owner of some metadata could not be determined, the setup check also reports this.
This usually is metadata of folders that have already been deleted, which can be removed using the [`cleanup-orphaned-metadata`](#clean-up-orphaned-metadata) command.

The setup check can also be run on the command line using `occ setupchecks`.

## OCC commands

### List folders with v1 metadata

```sh
occ end_to_end_encryption:list-v1-metadata [--users-only] [--json]
```

Use this command when the [setup check](#setup-check) warns about v1 metadata to find out which folders are affected,
for example to tell users which folders they need to open with an up-to-date desktop client.
Run it again after the users migrated their folders to verify that no v1 metadata is left.

```sh
# List all folders with v1 metadata (owner, file ID, path and metadata version)
occ end_to_end_encryption:list-v1-metadata

# Only list the affected accounts
occ end_to_end_encryption:list-v1-metadata --users-only

# Output as JSON (can be combined with --users-only)
occ end_to_end_encryption:list-v1-metadata --json
```

Entries with an unknown owner usually belong to metadata of folders that have already been deleted, see [Clean up orphaned metadata](#clean-up-orphaned-metadata).
Metadata stored in the very old path-based layout is reported with the version `legacy`.

### Clean up orphaned metadata

```sh
occ end_to_end_encryption:cleanup-orphaned-metadata [--dry-run]
```

Removes the metadata of end-to-end encrypted folders that no longer exist.
Such orphaned metadata can be left behind when encrypted folders are deleted, it is no longer needed but is still counted by the [setup check](#setup-check) and [`list-v1-metadata`](#list-folders-with-v1-metadata).

Use this command when the setup check reports metadata whose owner could not be determined, or `list-v1-metadata` lists entries with an unknown owner.
Run it with `--dry-run` first to review which metadata would be removed:

```sh
# Only list the orphaned metadata (owner, file ID and metadata path)
occ end_to_end_encryption:cleanup-orphaned-metadata --dry-run

# Remove the orphaned metadata
occ end_to_end_encryption:cleanup-orphaned-metadata
```

The removal is recorded in the audit log, see [Audit logging](#audit-logging).

## Audit logging

Security relevant actions, like storing or deleting encryption keys, are recorded in the audit log when the `admin_audit` app is enabled. All recorded actions and their stable operation identifiers are listed in the [audit log actions documentation](audit-log-actions.md).

## Recovery

There are various recovery scenarios where it may be useful to access (decrypt) files independent of your Nextcloud installation. A separate set of tools called the [`encryption-recovery-tools`](https://github.com/nextcloud/encryption-recovery-tools) can be used for this.
