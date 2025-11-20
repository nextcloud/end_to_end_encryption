<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Changelog

<!-- All notable changes to this project will be documented in this file so they will be shown in the Nextcloud app store "changes"-section -->

## v2.0.0-dev.1 - 2025-11-20
### Added
* Setup end-to-end encryption in the web interface.
  It is now possible to setup end-to-end encryption in the web interface (within the files app),
  and to also create new encrypted folders.
  **Please note: It is not yet possible to create sub-folders and to write or move encrypted files**.

### Changed
* Updated translations
* Updated dependencies
* The frontend is now using Vue 3

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
