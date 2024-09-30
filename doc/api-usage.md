<!--
  - SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
# How to use the API

Some typical client operation and how to use the API to perform them.

## Initialize a new user

### Assume that a key pair already exists on the server

1. Check server for a existing private/public key (see [Get private key](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#get-private-key) and [Get public keys](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#get-public-keys))
2. If the client could download the keys he ask the user for the password to decrypt the private key
3. Get public system key from server to validate the signature of the users public key.


### Assume that no key pair exists on the server

1. Check server for a existing private/public key (see [Get private key](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#get-private-key) and [Get public keys](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#get-public-keys))
2. no key was found
3. Client generates a private key and a public key
4. Client sends the public key to the server in order to sign it (see [Sign public key](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#sign-public-key)). If signing was successful the signed key will be returned and the client stores it locally
5. Client sends encrypted private key to the server, so that other clients can pick it up (see [Store private key](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#store-private-key)) 

## Mark a folder as encrypted

1. Create a new empty folder
2. mark folder as encrypted (see [Set encryption flag for a folder](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#set-encryption-flag-for-a-folder)).
If a folder is marked as encrypted all content in the folder and sub-folder are considered to be encrypted, no need to mark sub-folders
3. Encrypt all files in the folder and upload them together with the meta-data file
4. unlock folder

## Remove encryption flag

1. lock folder (only needed if the folder is not empty)
2. upload all files unencrypted
3. delete the meta-data file (see [Delete meta-data file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#delete-meta-data-file))
4. unlock the folder

## Upload a file

1. lock the file you want to upload (see [Lock file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#lock-file)) you will get a e2e-token which can be used to restart the process, e.g. if the connection dropped
3. Make sure that you have the latest version of the meta-data file (see [Get meta-data file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#get-meta-data-file))
2. Update the meta-data file and encrypt the file
3. upload the meta-data file and the encrypted file (see [store meta-data file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#store-meta-data-file)) and [update meta-data file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#update-meta-data-file))
4. if everything was successful, unlock the file (see [Unlock file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#unlock-file))

## Share a file

1. lock the file you want to update (see [Lock file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#lock-file))
2. Make sure that you have the latest version of the meta-data file (see [get meta-data file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#get-meta-data-file))
3. Update the meta-data file
4. upload the meta-data file (see [store meta-data file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#store-meta-data-file) and [update meta-data file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#update-meta-data-file))
5. unlock the file (see [Unlock file](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md#unlock-file))

## Unshare a file

same as "Share a file", but in this case the file needs to re-encrypted with a new file key so the client also need to upload a new encrypted file
