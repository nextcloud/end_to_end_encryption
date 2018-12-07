# End-to-End Encryption App

This app provides all the necessary APIs to implement end-to-end encryption
on the client side. Additionally it makes sure that end-to-end encrypted
files are not accessible with the web interface and other WebDAV clients.

You can replace the key storage with your own implementation by implementing
the OCA\EndToEndEncryption\IKeyStorage interface and set it in the config.php:

`'e2e_encryption_key_storage' => '\OCA\MyApp\MyKeyStorage',`

Here you can find the [API documentation](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api.md).

![](doc/screenshots/e2ee-files-listing.png)
