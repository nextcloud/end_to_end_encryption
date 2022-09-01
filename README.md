# End-to-End Encryption App

This app provides all the necessary APIs to implement end-to-end encryption
on the client side. Additionally it makes sure that end-to-end encrypted
files are not accessible with the web interface and other WebDAV clients.

Here you can find the [API documentation](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md).

## Limitation

- E2EE is currently not compatible to be used together with server-side encryption

![](doc/screenshots/e2ee-files-listing.png)

## Sysadmin documentation

```php
// config/config.php

    ...,
    // Allow to configure which client are supported (e.g. custom clients)
    'end_to_end_encryption.supported-user-agents' => [
        '/^Mozilla\/5\.0 \(Android\) Nextcloud\-android\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.13.0',
        '/^Mozilla\/5\.0 \([A-Za-z ]+\) (mirall|csyncoC)\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.0.0',
        '/^Mozilla\/5\.0 \(iOS\) Nextcloud\-iOS\/(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)).*$/' => '3.0.5',
    ]
```
