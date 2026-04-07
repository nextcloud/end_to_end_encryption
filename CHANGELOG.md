<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Changelog

<!-- All notable changes to this project will be documented in this file so they will be shown in the Nextcloud app store "changes"-section -->

## v2.1.0 - 2026-04-07
### Added
* Allow to convert files uploaded by public end-to-end encrypted file drops to regular files within the browser \([\#1594](https://github.com/nextcloud/end_to_end_encryption/pull/1594)\).

### Fixed
* Validate keys to match expected format before storing them \([\#1597](https://github.com/nextcloud/end_to_end_encryption/pull/1597)\)
* Improved error handling on public API endpoints \([\#1596](https://github.com/nextcloud/end_to_end_encryption/pull/1596)\)
* API endpoints for metadata locking now always return the proper HTTP status code \([\#1595](https://github.com/nextcloud/end_to_end_encryption/pull/1595)\)

### Changed
* Updated dependencies
* Updated translations

## v2.0.2 - 2026-03-27
### Fixed
* fix(sharing): Always enable e2ee proxy in public shares [\#1571](https://github.com/nextcloud/end_to_end_encryption/pull/1571)
* fix(sharing): Delete share keys before its deletion [\#1572](https://github.com/nextcloud/end_to_end_encryption/pull/1572)

## v2.0.1 - 2026-03-27
### Fixed

* feat(api): Hint clients towards using the proper API version [\#1520](https://github.com/nextcloud/end_to_end_encryption/pull/1520)
* fix(keys): Properly handle `shareToken` for public encrypted shares [\#1527](https://github.com/nextcloud/end_to_end_encryption/pull/1527)
* fix: skip trashbin on move [\#1532](https://github.com/nextcloud/end_to_end_encryption/pull/1532)
* fix(lock): Write counter after creating the lock [\#1533](https://github.com/nextcloud/end_to_end_encryption/pull/1533)
* fix: add throttling to all public page controllers [\#1531](https://github.com/nextcloud/end_to_end_encryption/pull/1531)

### Changed

* Updated dependencies

## v2.0.0 - 2026-02-05
### Added
* Setup end-to-end encryption in the web interface.
  When end-to-end encryption is enabled in the browser (see personal settings - security),
  users can setup the end-to-end encryption within the files app.
  For this a new entry in the "+ New" menu was added ("Create new encrypted folder").
* Browser based end-to-end encryption (when enabled in personal security settings):
  * When using a Chromium based browser (like Chrome or Edge),
    then it is now possible to download multiple files or folders.
  * Users can now create subfolder within encrypted folders directly in the files app.
  * Users can now upload end-to-end encrypted files from the files app.
    **Please note: Chunked uploads have to be disabled by the administrator!**
  * Copying encrypted files in the files app is now possible (within the same encrypted root).
  * Deleting encrypted files is now possible in the files app.
  * Moving encrypted files in the files app is now possible (within the same encrypted root).
  * Creating filedrop links for encrypted folders is now possible within the files app.
    (Using the sidebar just like with regular shares).
  * Sharing encrypted root folders is now possible from within the files app.
    Using the files sidebar just like with regular files,
    though shares always have all permissions enabled as per requirements of end-to-end encryption.
  * Allow to create read only shares with users.
  * Its possible to create public shares of end-to-end encrypted folders,
    those shares will have their own encryption keys and which have to be shared with the recipient
    using a secure second channel.

### Changed
* Updated dependencies
* Updated translations
* The frontend is now using Vue 3
* The frontend is now tested with end-to-end integration tests (Playwright)
* Code maintenance

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
* Bump cipher-base to 1.0.6
* Updated development dependencies
