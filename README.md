# End-to-End Encryption App

This app provides all the necessary APIs to implement End-to-End encryption
on the client side. Additionally it makes sure that End-to-End encrypted
files are not accessible with the web interface and other WebDAV clients.

## Documentation

### Client API

Here you can find the [API documentation](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md). Also some [typical client operations and how to use the API to perform them](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api-usage.md) are documented too.

### Server-side Encryption

- E2EE is currently not compatible with server-side encryption and thus should **not** be used with the server-side `encryption` app enabled

### Configuring

#### User agent configuraiton

The default user agent configuration is reasonable for all current official stable client releases, but sometimes needs to be adjusted when running custom or development client builds.

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

### Recovery

There are various recovery scenarios where it may be useful to access (decrypt) your files independent of your Nextcloud installation. A separate set of tools called the [`encryption-recovery-tools`](https://github.com/nextcloud/encryption-recovery-tools) can be used for this.
