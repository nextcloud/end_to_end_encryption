<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Changelog

<!-- All notable changes to this project will be documented in this file so they will be shown in the Nextcloud app store "changes"-section -->

## v1.18.1 - 2026-02-02
### Fixed
* Better encrypted file drop handling

### Changed
* docs: add changelog to inform admins about changes within app store
* Updated translations
* Updated dependencies
  * Bump `@nextcloud/dialogs` to 6.3.2
  * Bump `@nextcloud/files` to 3.12.1
  * Bump `@nextcloud/l10n` to 3.4.1
  * Bump `@nextcloud/logger` to 3.0.3
  * Bump `@nextcloud/vue` to 8.35.3
  * Bump `@peculiar/x509` to 1.12.4
  * Bump `fast-xml-parser` to 5.2.5

## v1.18.0 - 2025-10-14
### Added
* Added support for Nextcloud 32
* Add OpenAPI support
* feat: add documentation about fetching metadata through WebDAV
* feat: optimize keys root folder fetching

### Fixed
* fix: support sha-1 algo for user certificate signature
* fix(docs): slightly improve docs on initializing an encrypted folder
* fix(docs): adjust text because e2ee is now possible in browser
* fix(docs): typos

### Changed
* Updated translations
* Updated dependencies
  * Bump `cipher-base` to 1.0.6
