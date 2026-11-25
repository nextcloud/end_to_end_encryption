<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# End-to-End Encryption WebDAV API

The End-to-End Encryption app exposes additional WebDAV properties for
E2EE-aware clients, including the Nextcloud web client.

For an authenticated user's files, the WebDAV endpoint is:

`https://<nextcloud-server>/remote.php/dav/files/<username>/<path>`

The E2EE properties use the following XML namespace:

`http://nextcloud.org/ns`

This document describes the E2EE-specific WebDAV properties and how clients
can retrieve them. Other E2EE operations, such as managing keys, locks, and
metadata, use the app's OCS API.

## Advertising E2EE support

An E2EE-aware client making a `PROPFIND` request for E2EE content should
advertise its support by sending the following request header:

```http
X-E2EE-SUPPORTED: true
```

The header value must be the lowercase string `true`.

The server can also recognize configured E2EE-capable client user agents.
Explicitly sending the header is recommended for clients that are not included
in the server's configured user-agent list.

The E2EE-specific support check described in this document is implemented for
`PROPFIND` requests. Other WebDAV methods remain subject to their normal
authentication and authorization rules.

## XML namespaces

The examples in this document use these namespace prefixes:

| Prefix | Namespace |
| --- | --- |
| `d` | `DAV:` |
| `nc` | `http://nextcloud.org/ns` |
| `oc` | `http://owncloud.org/ns` |

XML namespace prefixes are arbitrary. Clients should identify properties by
their namespace URI and local name rather than relying on the literal `d`,
`nc`, or `oc` prefixes used in these examples.

## E2EE WebDAV properties

| Property | Applies to | Meaning |
| --- | --- | --- |
| `nc:e2ee-is-encrypted` | Files and folders | `1` when the node is part of an E2EE-enabled path, including an encrypted root folder and its descendants; otherwise `0`. |
| `nc:e2ee-metadata` | Encrypted folders | The encrypted metadata content associated with the folder. |
| `nc:e2ee-metadata-signature` | Encrypted folders | The signature associated with the encrypted metadata. |

The metadata and signature properties are folder-only properties. They are not
provided for individual files.

The following standard WebDAV and Nextcloud properties are commonly needed
when processing E2EE responses:

| Property | Meaning |
| --- | --- |
| `d:resourcetype` | Identifies whether the response node is a collection. |
| `d:displayname` | Contains the node name returned through WebDAV. |
| `oc:fileid` | Contains the Nextcloud file ID. |

To cache folder metadata from a response, an E2EE-aware client needs all of
the following in successful property responses:

- a folder indication from `d:resourcetype`;
- the folder ID from `oc:fileid`;
- `nc:e2ee-metadata`;
- `nc:e2ee-metadata-signature`.

### Folder encryption status property

The server also exposes the folder-only property:

`nc:is-encrypted`

The server uses this property when performing WebDAV access checks and
permission handling. Unlike `nc:e2ee-is-encrypted`, it is not exposed for
individual files.

The current web client does not request this property. E2EE-aware clients
that need to determine the encryption state of individual response nodes
should use `nc:e2ee-is-encrypted`.

## Requesting E2EE properties with PROPFIND

A client making a `PROPFIND` request can request the E2EE properties together
with the standard properties needed to process the response:

```shell
curl 'https://cloud.example.com/remote.php/dav/files/username/E2EE_folder/' \
  --user username:password \
  --request PROPFIND \
  --header 'Content-Type: application/xml' \
  --header 'Depth: 1' \
  --header 'X-E2EE-SUPPORTED: true' \
  --data '<?xml version="1.0" encoding="UTF-8"?>
<d:propfind
    xmlns:d="DAV:"
    xmlns:nc="http://nextcloud.org/ns"
    xmlns:oc="http://owncloud.org/ns">
  <d:prop>
    <d:resourcetype />
    <d:displayname />
    <nc:e2ee-is-encrypted />
    <nc:e2ee-metadata />
    <nc:e2ee-metadata-signature />
    <oc:fileid />
  </d:prop>
</d:propfind>'
```

Use `Depth: 0` to request properties only for the target node. Use `Depth: 1`
to request properties for the target collection and its immediate children.
The exact depth used by a client depends on whether it is fetching one node or
listing a directory.

The Nextcloud web client uses this property set when fetching metadata for a
node and when listing directory contents. It adds
`X-E2EE-SUPPORTED: true` to its intercepted `PROPFIND` requests.

## Response format

A successful WebDAV `PROPFIND` request normally returns a `207 Multi-Status`
response containing one or more `d:response` elements.

Clients should:

1. check the overall HTTP status;
2. process every `d:response` independently;
3. inspect each `d:propstat` status;
4. use properties only from successful `d:propstat` blocks;
5. evaluate the encryption state separately for every response node.

A request for an unencrypted directory can return both unencrypted and
encrypted nodes. For example, an unencrypted directory can contain an
encrypted root folder. A separate request targeting that encrypted root can
return its encrypted descendants.

An encrypted folder response can contain:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<d:multistatus
    xmlns:d="DAV:"
    xmlns:nc="http://nextcloud.org/ns"
    xmlns:oc="http://owncloud.org/ns">
  <d:response>
    <d:href>/remote.php/dav/files/username/E2EE_folder/</d:href>
    <d:propstat>
      <d:prop>
        <d:resourcetype>
          <d:collection />
        </d:resourcetype>
        <d:displayname>E2EE_folder</d:displayname>
        <nc:e2ee-is-encrypted>1</nc:e2ee-is-encrypted>
        <nc:e2ee-metadata>encrypted-metadata-content</nc:e2ee-metadata>
        <nc:e2ee-metadata-signature>metadata-signature</nc:e2ee-metadata-signature>
        <oc:fileid>89</oc:fileid>
      </d:prop>
      <d:status>HTTP/1.1 200 OK</d:status>
    </d:propstat>
  </d:response>
</d:multistatus>
```

The metadata value is opaque client-side encrypted data. The accompanying
signature is used by the client to verify the metadata according to the
End-to-End Encryption specification.

A response for a file inside an encrypted folder can contain:

```xml
<nc:e2ee-is-encrypted>1</nc:e2ee-is-encrypted>
```

The file does not receive the folder-only properties
`nc:e2ee-metadata` and `nc:e2ee-metadata-signature`.

For an unencrypted file or folder, a successful property response normally
contains `nc:e2ee-is-encrypted` with the value `0`.

## Property status and missing values

WebDAV reports property values using `d:propstat` elements. Requested
properties that are unavailable for a particular node can be returned in a
separate `d:propstat` block with a `404 Not Found` status:

```xml
<d:propstat>
  <d:prop>
    <nc:e2ee-metadata />
    <nc:e2ee-metadata-signature />
  </d:prop>
  <d:status>HTTP/1.1 404 Not Found</d:status>
</d:propstat>
```

This can occur when folder-only properties are requested for a file or when
metadata is unavailable for a folder.

Clients must not assume that every requested property is present or that all
properties are returned in the same `200 OK` block. They should inspect every
`d:propstat` element and associate its properties with its status.

## Directory listings and mixed responses

A `PROPFIND` response can contain a mixture of encrypted and unencrypted
nodes. For example, a listing of an unencrypted directory may include:

- unencrypted nodes with `nc:e2ee-is-encrypted` set to `0`;
- an encrypted root folder with `nc:e2ee-is-encrypted` set to `1`.

A separate request targeting the encrypted root can return encrypted
descendants.

Clients should determine the encryption state from each response node rather
than inferring it solely from the requested path.

When the requested node is itself encrypted, its descendants are also part of
the encrypted path. Clients should nevertheless process the property value for
each response node instead of assuming that every response is homogeneous.

When an encrypted root is merely listed as a child of an unencrypted folder,
the Nextcloud web client may defer consuming its metadata until the response
reaches into that root. This avoids decrypting metadata, and potentially
requesting the user's recovery phrase, merely to display the root folder.

## Searching for encrypted folders

The E2EE properties can also be selected in a WebDAV `DAV:basicsearch` request.

The Nextcloud web client uses WebDAV search to discover folders and requests
the following properties for each matching collection:

- `d:resourcetype`;
- `d:displayname`;
- `nc:e2ee-is-encrypted`;
- `nc:e2ee-metadata`;
- `nc:e2ee-metadata-signature`;
- `oc:fileid`.

For example:

```shell
curl 'https://cloud.example.com/remote.php/dav/' \
  --user username:password \
  --request SEARCH \
  --header 'Content-Type: application/xml' \
  --data '<?xml version="1.0" encoding="UTF-8"?>
<d:searchrequest
    xmlns:d="DAV:"
    xmlns:nc="http://nextcloud.org/ns"
    xmlns:oc="http://owncloud.org/ns">
  <d:basicsearch>
    <d:select>
      <d:prop>
        <d:resourcetype />
        <d:displayname />
        <nc:e2ee-is-encrypted />
        <nc:e2ee-metadata />
        <nc:e2ee-metadata-signature />
        <oc:fileid />
      </d:prop>
    </d:select>
    <d:from>
      <d:scope>
        <d:href>/files/username/</d:href>
        <d:depth>infinity</d:depth>
      </d:scope>
    </d:from>
    <d:where>
      <d:is-collection />
    </d:where>
    <d:orderby />
  </d:basicsearch>
</d:searchrequest>'
```

The search scope is expressed relative to the WebDAV endpoint. In the
authenticated-files endpoint, `/files/username/` corresponds to the user's
files path.

The server calculates the requested properties for search results through its
general DAV property-generation mechanism. The E2EE-specific access check
described below is registered for `PROPFIND`; it is not automatically applied
to `SEARCH`.

The current web client consumes the selected search properties directly. Its
`PROPFIND` response-rewriting interceptor does not process `SEARCH` responses.

Clients should apply the same namespace and property-status handling rules to
search results as they do to `PROPFIND` responses. They should not assume that
the `PROPFIND`-specific E2EE access check applies to `SEARCH`.

## Access restrictions

When the target of a `PROPFIND` request is an encrypted directory, the server
checks whether the client advertises E2EE support.

If an unrecognized client attempts to access an encrypted directory, the
request is rejected with WebDAV `403 Forbidden`.

A client can advertise E2EE support with:

```http
X-E2EE-SUPPORTED: true
```

Alternatively, the server may recognize the client from its configured
user-agent list.

For unsupported clients, the server can also remove permissions from the
WebDAV property response for encrypted directories. This does not expose
encrypted content to those clients.

The explicit E2EE access check applies to an encrypted directory used as the
`PROPFIND` request target. An unsupported request for an unencrypted directory
is not rejected merely because an encrypted root folder appears among its
children.

This section describes the E2EE-specific `PROPFIND` check. Normal
authentication and authorization rules for other WebDAV methods, including
`SEARCH`, still apply.

## Nextcloud web client behavior

The Nextcloud web client uses the WebDAV properties described above to process
encrypted files and folders in the browser.

For intercepted `PROPFIND` requests, it adds:

```http
X-E2EE-SUPPORTED: true
```

After receiving a `PROPFIND` response, the web client:

1. examines `nc:e2ee-is-encrypted` for each response node;
2. identifies folders using `d:resourcetype`;
3. obtains the folder ID from `oc:fileid`;
4. caches `nc:e2ee-metadata` and
   `nc:e2ee-metadata-signature`;
5. decrypts and verifies the metadata locally;
6. replaces encrypted placeholder names and MIME types with their
   client-side values.

These transformations happen in the client. The server returns the encrypted
metadata and WebDAV representation; it does not replace placeholder names or
MIME types with their plaintext values.

The web client only caches metadata when the response provides a folder, its
file ID, and both the metadata and signature values in successful property
responses.

When using WebDAV `SEARCH`, the web client selects the same E2EE metadata
properties to discover encrypted folders and consumes the returned search
properties directly. The current `SEARCH` path is separate from the browser's
`PROPFIND` response-rewriting interceptor.

## Related documentation

- [OpenAPI specification](../openapi.json)
- [Typical client operations](api-usage.md)
- [End-to-End Encryption specification](https://github.com/nextcloud/end_to_end_encryption_rfc/)
