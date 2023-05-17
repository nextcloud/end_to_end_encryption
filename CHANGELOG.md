# Changelog

## v1.13.1-beta.1

* Bump API version in capabilities by @artonge in https://github.com/nextcloud/end_to_end_encryption/pull/398
* chore: Add Nextcloud 27 support on master by @nickvergessen in https://github.com/nextcloud/end_to_end_encryption/pull/397
* fix: remove lock without mountpoint by @kesselb in https://github.com/nextcloud/end_to_end_encryption/pull/400
* docs: fix url for api.md by @kesselb in https://github.com/nextcloud/end_to_end_encryption/pull/426
* ci: enable workflow for oci by @kesselb in https://github.com/nextcloud/end_to_end_encryption/pull/427
* fix: Call to a member function getUser() on null by @kesselb in https://github.com/nextcloud/end_to_end_encryption/pull/425
* Delete locks for nodes in trashbin by @kesselb in https://github.com/nextcloud/end_to_end_encryption/pull/428
* [master] Update nextcloud/ocp dependency by @nextcloud-command in https://github.com/nextcloud/end_to_end_encryption/pull/377
* Remove parent fetching optimisation by @artonge in https://github.com/nextcloud/end_to_end_encryption/pull/430
* Adapt filedrop to v1.2 by @artonge in https://github.com/nextcloud/end_to_end_encryption/pull/435
* [master] Update nextcloud/ocp dependency by @nextcloud-command in https://github.com/nextcloud/end_to_end_encryption/pull/436
* Chore(deps): Bump webpack from 5.75.0 to 5.76.1 by @dependabot in https://github.com/nextcloud/end_to_end_encryption/pull/403

## New Contributors
* @kesselb made their first contribution in https://github.com/nextcloud/end_to_end_encryption/pull/400

**Full Changelog**: https://github.com/nextcloud/end_to_end_encryption/compare/v1.12.4...v1.13.1-beta.1

## Release 1.11.0-beta.1

- Compatibility with NC 25
- Large performance improvement in the dav plugins
- Allow user to delete their own keys from the settings
- Allow admin to limit who (list of groups) can use the app
- Make user agents allowed to interact with e2ee configurable by admin
- Updated translations