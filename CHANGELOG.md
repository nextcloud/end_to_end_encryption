<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Changelog

<!-- All notable changes to this project will be documented in this file so they will be shown in the Nextcloud app store "changes"-section -->

## v2.0.0-dev.2 - 2025-12-05
### Added
* Setup end-to-end encryption in the web interface.
  When end-to-end encryption is enabled in the browser (see personal settings - security),
  users can setup the end-to-end encryption within the files app.
  For this a new entry in the "+ New" menu was added ("Create new encrypted folder").
* Browser based end-to-end encryption (when enabled in personal security settings):
  * Users can now create subfolder within encrypted folders directly in the files app.

### Fixed
<!-- TODO: Remove this section for the final release -->
Those fixes only affect you if you already used a previous pre-release of v2.
* Do not allow creating nested e2ee root folders.
* Ensure created e2ee folder is not pending in the files app.
* Folders also need the `is-encrypted` attribute to be correctly displayed in the files app.

### Changed
* Updated dependencies
* Updated translations
* The frontend is now using Vue 3
* The frontend is now tested with end-to-end integration tests (Playwright)

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
