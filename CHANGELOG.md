<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Changelog

<!-- All notable changes to this project will be documented in this file so they will be shown in the Nextcloud app store "changes"-section -->

## v2.0.0-rc.4 - 2025-12-18
### Added
* Setup end-to-end encryption in the web interface.
  When end-to-end encryption is enabled in the browser (see personal settings - security),
  users can setup the end-to-end encryption within the files app.
  For this a new entry in the "+ New" menu was added ("Create new encrypted folder").
* Browser based end-to-end encryption (when enabled in personal security settings):
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

### Fixed
* Fixed locking to allow leaving encrypted root folders properly.

<!-- TODO: Remove this section for the final release -->
Those fixes only affect you if you already used a previous pre-release of v2.
* Do not allow creating nested e2ee root folders.
* Ensure created e2ee folder is not pending in the files app.
* Folders also need the `is-encrypted` attribute to be correctly displayed in the files app.
* Sharing sidebar work now also when `debug` mode is disabled.
* "Do not ask again" toggle of mnemonic dialog is respected.
* fix(sharing): consolidate share tab and ensure user keys are used
* fix(sharing): hide native sharing sections
* fix(sharing): adjusted information about sharing
* fix: ensure new files and folders will be created with unique names

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
