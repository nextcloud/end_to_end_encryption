<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->


## v1.17.3 - 2026-07-15
### Fixed
* fix: require password confirmation for resetting e2ee [#1897](https://github.com/nextcloud/end_to_end_encryption/pull/1897)

### Changed
* Updated dependencies

## v1.17.2 - 2026-03-27

* feat(api): Hint clients towards using the proper API version [#1522](https://github.com/nextcloud/end_to_end_encryption/pull/1522)
* fix(lock): Write counter after creating the lock [#1535](https://github.com/nextcloud/end_to_end_encryption/pull/1535)
* fix: add throttling to all public page controllers [#1560](https://github.com/nextcloud/end_to_end_encryption/pull/1560)

## Release 1.11.0-beta.1

- Compatibility with NC 25
- Large performance improvement in the dav plugins
- Allow user to delete their own keys from the settings
- Allow admin to limit who (list of groups) can use the app
- Make user agents allowed to interact with e2ee configurable by admin
- Updated translations
