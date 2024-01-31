# End-to-End Encryption API

This are the available OCS API calls for clients to implement end-to-end encryption.
A more general documentation how to use the API can be found [here](https://github.com/nextcloud/end_to_end_encryption/blob/master/doc/api-usage.md).
- [End-to-End Encryption API](#end-to-end-encryption-api)
- [Base URL for all API calls](#base-url-for-all-api-calls)
  - [List files and folders with encryption status](#list-files-and-folders-with-encryption-status)
  - [Store private key](#store-private-key)
  - [Get private key](#get-private-key)
  - [Delete private key](#delete-private-key)
  - [Sign public key](#sign-public-key)
  - [Get public keys](#get-public-keys)
  - [Delete public keys](#delete-public-keys)
  - [Lock file](#lock-file)
  - [Get meta-data file](#get-meta-data-file)
  - [Update meta-data file](#update-meta-data-file)
  - [Update filedrop property of meta-data file](#update-filedrop-property-of-meta-data-file)
  - [Delete meta-data file](#delete-meta-data-file)
  - [Get server public key](#get-server-public-key)
  - [Set encryption flag for a folder](#set-encryption-flag-for-a-folder)
  - [Remove encryption flag for a folder](#remove-encryption-flag-for-a-folder)



# Base URL for all API calls

Base URL: `https://<nextcloud-server>/ocs/v2.php/apps/end_to_end_encryption/api/v1`

## List files and folders with encryption status

PROPFIND: `https://<nextcloud>/remote.php/webdav/<folder>/`

**Data:**

xml body:
````xml
<d:propfind xmlns:d="DAV:">
    <d:prop xmlns:nc="http://nextcloud.org/ns">
        <nc:is-encrypted/>
    </d:prop>
</d:propfind>
````

**Results:**

207 Multi-Status: xml with all files/folders and attributes

400 bad request: unpredictable internal error

**Response body on success**

````xml
...
<d:response>
    <d:href>/remote.php/webdav/folder/0/</d:href>
    <d:propstat>
        <d:prop>
            <nc:is-encrypted>1</nc:is-encrypted>
        </d:prop>
        <d:status>HTTP/1.1 200 OK</d:status>
    </d:propstat>
</d:response>
...
````

**Example curl call:**

`curl -X PROPFIND https://<user>:<password>@<nextcloud>/remote.php/webdav/<folder>/ -d '<d:propfind xmlns:d="DAV:"> <d:prop xmlns:nc="http://nextcloud.org/ns"> <nc:is-encrypted/> </d:prop> </d:propfind>' -H "Content-Type=application/xml" -H OCS-APIRequest=true`


## Store private key

POST: `<base-url>/private-key`

**Data:**

privateKey: the users private key

**Results:**

200 OK: private key stored successfully

409 conflict: if a private key for the user already exists

400 bad request: unpredictable internal error

**Response body on success**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <private-key>encrypted-private-key</private-key>
 </data>
</ocs>
````

**Example curl call:**

`curl -X POST https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/private-key -d privateKey="<urlencoded-private-key>" -H "OCS-APIRequest:true"`


## Get private key

GET: `<base-url>/private-key`

**Results:**

200 ok: body contains the private key

403 forbidden: if the user can't access the private key

404 not found: if the private key doesn't exist

400 bad request: unpredictable internal error

**Response body on success**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <private-key>encrypted-private-key</private-key>
 </data>
</ocs>
````

**Example curl call:**

`curl -X GET https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/private-key -H "OCS-APIRequest:true"`


## Delete private key

DELETE: `<base-url>/private-key`

**Results:**

200 ok: private key was deleted

409 forbidden: if the user is not allowed to delete the private key

404 not found: if the private key doesn't exist

400 bad request: unpredictable internal error

**Response body on success**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
 </data>
</ocs>
````

**Example curl call:**

`curl -X DELETE https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/private-key -H "OCS-APIRequest:true"`


## Sign public key

POST: `<base-url>/public-key`

**Data:**

csr: certificate signing request, created on the client for the server to sign
the public key (CN must be the same as the corresponding Nextcloud user name)

**Results:**

200 OK: public key was successfully signed and stored, body contains the public key

409 conflict: if a public key for the user already exists

403 forbidden: CN doesn't match the user name

400 bad request: unpredictable internal error


**Response body on success**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <public-key>public-key</public-key>
 </data>
</ocs>
````

**Example curl call:**

`curl -X POST https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/public-key -H "OCS-APIRequest:true" -d csr="<urlencoded-csr>"
`

## Get public keys

GET: `<base-url>/public-key`

**Data:**

users: Json encoded list of users for which the server should return the public keys
(can be kept empty if you just want your own public key)

**Results:**

200 ok: response body contains the public keys

404 not found: if one or more public keys couldn't be found

400 bad request: unpredictable internal error


**Response body on success**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <public-keys>
   <user1>user1-public-key</user1>
   <user2>user2-public-key</user2>
   <user3>user3-public-key</user3>
   ...
  </public-keys>
 </data>
</ocs>
````

**Example curl call:**

```shell
# Fetch the public key of the logged in user.
curl \
    --header 'OCS-APIRequest: true' \
    https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/public-key

# Fetch the public keys of a list of users.
curl \
    --header 'OCS-APIRequest: true' \
    --data users='["alice","bob"]' \
    --get \
    https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/public-key
```

## Delete public keys

DELETE: `<base-url>/public-key`

**Results:**

200 ok: public key was deleted

403 forbidden: if the user is not allowed to delete the public key

404 not found: public key doesn't exist

400 bad request: unpredictable internal error


**Response body on success**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
 </data>
</ocs>
````

**Example curl call:**

`curl -X DELETE https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/public-key -H "OCS-APIRequest:true"`

## Lock file

You need to lock the file before you start to write/update an encrypted file and/or
the meta data file.

POST: `<base-url>/lock/<file-id>`

**Data:**

e2e-token: if you re-try a previously failed upload, use the token from the first try, otherwise you can skip it

**Results:**

200 OK: file locked successful

403 forbidden: file already locked and by a different client (wrong token)

400 bad request: unpredictable internal error

**Response body on success**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <e2e-token>fdkjfjdhgkjdhkjghdfhgk</e2e-token>
 </data>
</ocs>
````


**Example curl call:**

First try:

````shell
curl https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/lock/10 \
    -X POST \
    -H "OCS-APIRequest:true" \
    -H "X-NC-E2EE-COUNTER:<incremented-counter-from-the-metadata>
```

Retry:

`curl -X POST https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/lock/<file-id> -H "OCS-APIRequest:true"` -d e2e-token="<e2e-token-from-previous-try>"
curl https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/lock/10 \
    -X POST \
    -H "OCS-APIRequest:true" \
    -d "e2e-token:<e2e-token-from-previous-try> \
    -H "X-NC-E2EE-COUNTER:<incremented-counter-from-the-metadata>
```

## Unlock file

unlock the file again after the file and the meta data was updated correctly. The e2e-token needs to be added to the header, see example below

DELETE: `<base-url>/lock/<file-id>`

**Results:**

200 OK: file unlocked successful

403 forbidden: wrong token, you are not allowed to unlock the file

400 bad request: unpredictable internal error

**Response body on success**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
</ocs>
````

**Example curl call:**

Unlock:

````shell
curl https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/lock/10 \
    -X DELETE \
    -H "OCS-APIRequest:true" \
    -H "e2e-token:<e2e-token-received-during-lock-operation>
```

Unlock and drop pending changes:

````shell
curl https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/lock/10?abort=true \
    -X DELETE \
    -H "OCS-APIRequest:true" \
    -H "e2e-token:<e2e-token-received-during-lock-operation>
```

## Store meta-data file

POST: `<base-url>/meta-data/<file-id>`

**Data:**

metaData: content of the encrypted meta-data file

**Results:**

200 OK: Meta data stored successfully

404 not found: can't find file with given file-id

409 conflict: if a meta-data file for the file already exists

400 bad request: unpredictable internal error

**Response body on success**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <meta-data>encrypted-meta-data</meta-data>
 </data>
</ocs>
````

**Example curl call:**

```bash
curl "https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/meta-data/<file-id>" \
    -X POST \
    -H "OCS-APIRequest:true" \
    -H "e2e-token:<e2e-token-received-during-lock-operation>" \
    -d metaData="<encrypted-meta-data>"
```

## Get meta-data file

GET: `<base-url>/meta-data/<file-id>`

**Results:**

200 ok: response body contains the meta data

404 not found: if the meta-data file doesn't exist

400 bad request: unpredictable internal error

**Result body on success:**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <meta-data>encrypted-meta-data</meta-data>
 </data>
</ocs>
````

**Example curl call:**

`curl -X GET https://<user>:<password>@nextcloud/ocs/v2.php/apps/end_to_end_encryption/api/v1/meta-data/<file-id> -H "OCS-APIRequest:true"`

## Update meta-data file

PUT: `<base-url>/meta-data/<file-id>`

**Data:**

metaData: the encrypted meta-data file
e2e-token: token to authenticate that you are the client who currently manipulates the file

**Results:**

200 ok: meta data successfully updated

404 not found: if the meta-data file doesn't exist or if the user can't access
the file with the given file-id

403 forbidden: if the file was not locked or the client sends the wrong e2e-token

400 bad request: unpredictable internal error

**Result body on success:**
````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <meta-data>encrypted-meta-data</meta-data>
 </data>
</ocs>
````


**Example curl call:**

```bash
curl "https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/meta-data/<file-id>" \
    -X PUT \
    -H "OCS-APIRequest:true" \
    -H "e2e-token:<e2e-token-received-during-lock-operation>" \
    -H "X-NC-E2EE-SIGNATURE:<metadata-signature>" \
    -d metaData="<encrypted-meta-data>"
```

## Update filedrop property of meta-data file

PUT: `<base-url>/meta-data/<file-id>/filedrop`

**Data:**

fileDrop: the filedrop object
e2e-token: token to authenticate that you are the client who currently manipulates the file

**Results:**

200 ok: filedrop successfully updated

404 not found: if the meta-data file doesn't exist or if the user can't access
the file with the given file-id

403 forbidden: if the file was not locked or the client sends the wrong e2e-token

400 bad request: unpredictable internal error

**Result body on success:**
````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <meta-data>encrypted-meta-data</meta-data>
 </data>
</ocs>
````


**Example curl call:**

`curl -X PUT https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/meta-data/<file-id>/filedrop -H "OCS-APIRequest:true"` -d "fileDrop=<filedrop-property>&e2e-token=<e2e-token-received-during-lock-operation>"

## Delete meta-data file

DELETE: `<base-url>/meta-data/<file-id>`

**Results:**

200 ok: meta data file deleted successfully

404 not found: if the meta-data file doesn't exist

409 you are not allowed to delete the meta data file (only the owner can do it)

400 bad request: unpredictable internal error

**Result body on success:**

````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
 </data>
</ocs>
````

**Example curl call:**

```bash
curl "https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/meta-data/<file-id>" \
    -X DELETE \
    -H "OCS-APIRequest:true" \
    -H "e2e-token:<e2e-token-received-during-lock-operation>"
```

## Get server public key

This is the key, used to sign the users public keys. By retrieving the server's
public key the clients can check the signature of the users public keys.

GET: `<base-url>/server-key`

**Results:**

200 ok: body contains the server public key

400 bad request: unpredictable internal error

**Result body on success:**
````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <public-key>server-public-key</public-key>
 </data>
</ocs>
````

**Example curl call:**

`curl -X GET https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/server-key -H "OCS-APIRequest:true"`

## Set encryption flag for a folder

Mark a folder as end-to-end encrypted.

PUT: `<base-url>/encrypted/<file-id>`

200 ok

404 not found: if the ID could not be resolved to a valid folder

**Result body on success:**
````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
 </data>
</ocs>
````
**Example curl call:**

`curl -X PUT https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/encrypted/<file-id> -H "OCS-APIRequest:true"`

## Remove encryption flag for a folder

Remove encryption flag for a folder if the folder is no longer end-to-end encrypted.

DELETE: `<base-url>/encrypted/<file-id>`

200 ok

404 not found: if the ID could not be resolved to a valid folder

**Result body on success:**
````xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>200</statuscode>
  <message>OK</message>
 </meta>
 <data>
 </data>
</ocs>
````

**Example curl call:**

`curl -X DELETE https://<user>:<password>@<nextcloud>/ocs/v2.php/apps/end_to_end_encryption/api/v1/encrypted/<file-id> -H "OCS-APIRequest:true"`
