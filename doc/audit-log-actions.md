<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Audit log actions

Actions of the end-to-end encryption app recorded in the audit log (`admin_audit`).
Every entry carries the event name as its `operation` parameter.
Share keys are identified by the share id, never by the share token.

| Friendly name | Event name | Description |
|---|---|---|
| Store private key | `e2ee_store_private_key` | A user uploaded the encrypted backup of their end-to-end encryption private key, or the private key of one of their shares. |
| Delete private key | `e2ee_delete_private_key` | The end-to-end encryption private key of a user or share was deleted, by the user, because the share was deleted, or because the user account was deleted. |
| Store public key | `e2ee_store_public_key` | A public key certificate was stored for a user or share, either uploaded or signed by the server from a certificate signing request. |
| Delete public key | `e2ee_delete_public_key` | The end-to-end encryption public key of a user or share was deleted, by the user, because the share was deleted, or because the user account was deleted. |
| Mark folder as encrypted | `e2ee_set_encryption_flag` | An empty folder was marked as end-to-end encrypted. |
| Remove folder encryption | `e2ee_remove_encryption_flag` | An empty folder is no longer marked as end-to-end encrypted. |
| Delete all encrypted folders | `e2ee_delete_encrypted_folders` | A user deleted all of their end-to-end encrypted folders when resetting end-to-end encryption. |
| Delete folder metadata | `e2ee_delete_metadata` | The encryption metadata of a folder was deleted, which makes the files in it impossible to decrypt. |
