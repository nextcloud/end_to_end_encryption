<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\EndToEndEncryption;

/**
 * Operations recorded in the audit log.
 *
 * The values are emitted as the `operation` audit log parameter and are
 * consumed by external log processing, so they must never be changed.
 */
enum AuditOperation: string {
	case StorePrivateKey = 'e2ee_store_private_key';
	case DeletePrivateKey = 'e2ee_delete_private_key';
	case StorePublicKey = 'e2ee_store_public_key';
	case DeletePublicKey = 'e2ee_delete_public_key';
	case SetEncryptionFlag = 'e2ee_set_encryption_flag';
	case RemoveEncryptionFlag = 'e2ee_remove_encryption_flag';
	case DeleteEncryptedFolders = 'e2ee_delete_encrypted_folders';
	case DeleteMetadata = 'e2ee_delete_metadata';
}
