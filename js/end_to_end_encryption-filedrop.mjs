(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode('/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-089eb524] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.app-details-toggle[data-v-089eb524] {\n  position: sticky;\n  width: var(--default-clickable-area);\n  height: var(--default-clickable-area);\n  padding: calc((var(--default-clickable-area) - 16px) / 2);\n  cursor: pointer;\n  opacity: 0.6;\n  transform: rotate(180deg);\n  background-color: var(--color-main-background);\n  z-index: 2000;\n  top: var(--app-navigation-padding);\n  inset-inline-start: calc(var(--default-clickable-area) + var(--app-navigation-padding) * 2);\n}\n.app-details-toggle--mobile[data-v-089eb524] {\n  inset-inline-start: var(--app-navigation-padding);\n}\n.app-details-toggle[data-v-089eb524]:active, .app-details-toggle[data-v-089eb524]:hover, .app-details-toggle[data-v-089eb524]:focus {\n  opacity: 1;\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-7b4bc577] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.app-content[data-v-7b4bc577] {\n  position: initial;\n  z-index: 1000;\n  flex-basis: 100vw;\n  height: 100%;\n  margin: 0 !important;\n  background-color: var(--color-main-background);\n  min-width: 0;\n}\n.app-content[data-v-7b4bc577]:not(.app-content--has-list) {\n  overflow: auto;\n}\n.app-content-wrapper[data-v-7b4bc577] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.app-content-wrapper--no-split.app-content-wrapper--show-list[data-v-7b4bc577]  .app-content-list {\n  display: flex;\n}\n.app-content-wrapper--no-split.app-content-wrapper--show-list[data-v-7b4bc577]  .app-content-details {\n  display: none;\n}\n.app-content-wrapper--no-split.app-content-wrapper--show-details[data-v-7b4bc577]  .app-content-list {\n  display: none;\n}\n.app-content-wrapper--no-split.app-content-wrapper--show-details[data-v-7b4bc577]  .app-content-details {\n  display: block;\n}\n[data-v-7b4bc577] .splitpanes.default-theme .app-content-list {\n  max-width: none;\n  /* Thin scrollbar is hard to catch on resizable columns */\n  scrollbar-width: auto;\n}\n[data-v-7b4bc577] .splitpanes.default-theme .splitpanes__pane {\n  background-color: transparent;\n  transition: none;\n}\n[data-v-7b4bc577] .splitpanes.default-theme .splitpanes__pane-list {\n  min-width: 300px;\n  position: sticky;\n}\n@media only screen and (width < 1024px) {\n[data-v-7b4bc577] .splitpanes.default-theme .splitpanes__pane-list {\n    display: none;\n}\n}\n[data-v-7b4bc577] .splitpanes.default-theme .splitpanes__pane-details {\n  overflow-y: auto;\n}\n@media only screen and (width < 1024px) {\n[data-v-7b4bc577] .splitpanes.default-theme .splitpanes__pane-details {\n    min-width: 100%;\n}\n}\n[data-v-7b4bc577] .splitpanes.default-theme .splitpanes__splitter {\n  background-color: var(--color-main-background);\n}\n[data-v-7b4bc577] .splitpanes.default-theme .splitpanes__splitter::before,[data-v-7b4bc577] .splitpanes.default-theme .splitpanes__splitter::after {\n  background-color: var(--color-border);\n}\n[data-v-7b4bc577] .splitpanes.default-theme.splitpanes--vertical .splitpanes__splitter {\n  border-left: 1px solid var(--color-border);\n}\n[data-v-7b4bc577] .splitpanes.default-theme.splitpanes--horizontal .splitpanes__splitter {\n  border-top: 1px solid var(--color-border);\n}\n.app-content-wrapper--show-list[data-v-7b4bc577] .app-content-list {\n  max-width: none;\n}.splitpanes{display:-webkit-box;display:-ms-flexbox;display:flex;width:100%;height:100%}.splitpanes--vertical{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row}.splitpanes--horizontal{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.splitpanes--dragging *{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.splitpanes__pane{width:100%;height:100%;overflow:hidden}.splitpanes--vertical .splitpanes__pane{-webkit-transition:width .2s ease-out;-o-transition:width .2s ease-out;transition:width .2s ease-out}.splitpanes--horizontal .splitpanes__pane{-webkit-transition:height .2s ease-out;-o-transition:height .2s ease-out;transition:height .2s ease-out}.splitpanes--dragging .splitpanes__pane{-webkit-transition:none;-o-transition:none;transition:none}.splitpanes__splitter{-ms-touch-action:none;touch-action:none}.splitpanes--vertical>.splitpanes__splitter{min-width:1px;cursor:col-resize}.splitpanes--horizontal>.splitpanes__splitter{min-height:1px;cursor:row-resize}.splitpanes.default-theme .splitpanes__pane{background-color:#f2f2f2}.splitpanes.default-theme .splitpanes__splitter{background-color:#fff;-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;-ms-flex-negative:0;flex-shrink:0}.splitpanes.default-theme .splitpanes__splitter:before,.splitpanes.default-theme .splitpanes__splitter:after{content:"";position:absolute;top:50%;left:50%;background-color:#00000026;-webkit-transition:background-color .3s;-o-transition:background-color .3s;transition:background-color .3s}.splitpanes.default-theme .splitpanes__splitter:hover:before,.splitpanes.default-theme .splitpanes__splitter:hover:after{background-color:#00000040}.splitpanes.default-theme .splitpanes__splitter:first-child{cursor:auto}.default-theme.splitpanes .splitpanes .splitpanes__splitter{z-index:1}.default-theme.splitpanes--vertical>.splitpanes__splitter,.default-theme .splitpanes--vertical>.splitpanes__splitter{width:7px;border-left:1px solid #eee;margin-left:-1px}.default-theme.splitpanes--vertical>.splitpanes__splitter:before,.default-theme.splitpanes--vertical>.splitpanes__splitter:after,.default-theme .splitpanes--vertical>.splitpanes__splitter:before,.default-theme .splitpanes--vertical>.splitpanes__splitter:after{-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);width:1px;height:30px}.default-theme.splitpanes--vertical>.splitpanes__splitter:before,.default-theme .splitpanes--vertical>.splitpanes__splitter:before{margin-left:-2px}.default-theme.splitpanes--vertical>.splitpanes__splitter:after,.default-theme .splitpanes--vertical>.splitpanes__splitter:after{margin-left:1px}.default-theme.splitpanes--horizontal>.splitpanes__splitter,.default-theme .splitpanes--horizontal>.splitpanes__splitter{height:7px;border-top:1px solid #eee;margin-top:-1px}.default-theme.splitpanes--horizontal>.splitpanes__splitter:before,.default-theme.splitpanes--horizontal>.splitpanes__splitter:after,.default-theme .splitpanes--horizontal>.splitpanes__splitter:before,.default-theme .splitpanes--horizontal>.splitpanes__splitter:after{-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translate(-50%);width:30px;height:1px}.default-theme.splitpanes--horizontal>.splitpanes__splitter:before,.default-theme .splitpanes--horizontal>.splitpanes__splitter:before{margin-top:-2px}.default-theme.splitpanes--horizontal>.splitpanes__splitter:after,.default-theme .splitpanes--horizontal>.splitpanes__splitter:after{margin-top:1px}\n/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n#skip-actions.vue-skip-actions:focus-within {\n  top: 0 !important;\n  left: 0 !important;\n  width: 100vw;\n  height: 100vh;\n  padding: var(--body-container-margin) !important;\n  backdrop-filter: brightness(50%);\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-d8f0539f] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.vue-skip-actions__container[data-v-d8f0539f] {\n  background-color: var(--color-main-background);\n  border-radius: var(--border-radius-large);\n  padding: 22px;\n}\n.vue-skip-actions__headline[data-v-d8f0539f] {\n  font-weight: bold;\n  font-size: 20px;\n  line-height: 30px;\n  margin-bottom: 12px;\n}\n.vue-skip-actions__buttons[data-v-d8f0539f] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n.vue-skip-actions__buttons > *[data-v-d8f0539f] {\n  flex: 1 0 fit-content;\n}\n.vue-skip-actions__image[data-v-d8f0539f] {\n  margin-top: 12px;\n}\n.content[data-v-d8f0539f] {\n  box-sizing: border-box;\n  margin: var(--body-container-margin);\n  margin-top: var(--header-height);\n  display: flex;\n  width: calc(100% - var(--body-container-margin) * 2);\n  border-radius: var(--body-container-radius);\n  height: var(--body-height);\n  overflow: hidden;\n  padding: 0;\n}\n.content[data-v-d8f0539f]:not(.with-sidebar--full) {\n  position: fixed;\n}\n.content[data-v-d8f0539f] * {\n  box-sizing: border-box;\n}#app-content-vue[data-v-e15028e4] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n#app-content-vue .uploader-form[data-v-e15028e4] {\n  width: 700px;\n  height: 700px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}\n#app-content-vue .uploader-form.highlight[data-v-e15028e4] {\n  border: 4px solid var(--color-primary);\n  border-radius: var(--border-radius-large);\n  background: var(--color-primary-element-light-hover);\n}\n#app-content-vue .uploader-form__label[data-v-e15028e4] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  font-weight: bold;\n  font-size: 20px;\n  text-align: center;\n  position: sticky;\n}\n#app-content-vue .uploader-form__icon[data-v-e15028e4] {\n  margin-bottom: 12px;\n  height: 48px;\n  width: 48px;\n  background-size: 48px;\n}\n#app-content-vue .uploader-form__input[data-v-e15028e4] {\n  margin-top: 20px;\n}\n#app-content-vue .uploader-form__input input[data-v-e15028e4] {\n  display: none;\n}\n#app-content-vue .uploader-form__file-list[data-v-e15028e4] {\n  margin-top: 12px;\n  height: 100%;\n  overflow: scroll;\n  padding: 0 32px;\n}\n#app-content-vue .uploader-form__file-list__item[data-v-e15028e4] {\n  display: flex;\n  align-items: center;\n}\n#app-content-vue .uploader-form__file-list__item .material-design-icon[data-v-e15028e4] {\n  margin-right: 8px;\n}\n#app-content-vue .uploader-form__file-list__item .loading-icon[data-v-e15028e4] svg {\n  animation: rotate var(--animation-duration, 0.8s) linear infinite;\n}'));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const appName = "end_to_end_encryption";
const appVersion = "1.17.0-beta.2";
import { v, d as cancelableClient, a5 as path, M as f, s as normalizeComponent$1, n as normalizeComponent$2, r as register, W as getBuilder_1, a6 as t26, a7 as useSwipe, a8 as emit, a9 as VTooltip, N as NcButton, aa as isRTL, t, V as Vue, ab as t29, $ as NcIconSvgWrapper, B as NcLoadingIcon, l as loadState, y as showError, k as translate } from "./_plugin-vue2_normalizer-BdKAaywK.chunk.mjs";
import { X as X509Certificate, L as ArrowRight } from "./ArrowRight-CY2b9hgN-T6xkfnFS.chunk.mjs";
import { l as logger } from "./logger-kgPHxwTN.chunk.mjs";
import { u as useIsMobile } from "./useIsMobile-BmkGobDA.chunk.mjs";
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const native = {
  randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
async function getFileDropEntry(encryptionInfo, publicKeys) {
  const compressedEncryptionInfo = await compress(JSON.stringify(encryptionInfo));
  logger.debug("[FileDrop] Encryption info compressed (".concat(encryptionInfo.filename, ")"), { encryptionInfo, compressedEncryptionInfo });
  const encryptionParams = await getRandomEncryptionParams();
  const { content, tag } = await encryptWithAES(
    encryptionParams,
    new Uint8Array(compressedEncryptionInfo)
  );
  logger.debug("[FileDrop] Encryption info encrypted (".concat(encryptionInfo.filename, ")"), { content, tag, encryptionParams });
  logger.debug("[FileDrop] Encryption info base64ed (".concat(encryptionInfo.filename, ")"), { ciphertext: bufferToBase64(content) });
  return {
    ciphertext: bufferToBase64(content),
    nonce: bufferToBase64(encryptionParams.initializationVector),
    authenticationTag: bufferToBase64(tag),
    users: await encryptRandomKeyForUsers(publicKeys, encryptionParams)
  };
}
async function uploadFileDrop(encryptionVersion, folderId, fileDrops, shareToken) {
  const ocsUrl = v(
    "apps/end_to_end_encryption/api/v{encryptionVersion}/meta-data/{folderId}",
    {
      encryptionVersion,
      folderId
    }
  );
  const { data: { ocs: { meta } } } = await cancelableClient.put(
    "".concat(ocsUrl, "/filedrop"),
    {
      filedrop: JSON.stringify(fileDrops)
    },
    {
      headers: {
        "x-e2ee-supported": true
      },
      params: {
        shareToken
      }
    }
  );
  if (meta.statuscode !== 200) {
    throw new Error("Failed to upload metadata: ".concat(meta.message));
  }
}
async function compress(str) {
  const stream = new Blob([str]).stream();
  const compressedStream = stream.pipeThrough(
    // eslint-disable-next-line no-undef
    new CompressionStream("gzip")
  );
  const chunks = [];
  const reader = compressedStream.getReader();
  while (true) {
    const { value } = await reader.read();
    if (value === void 0) {
      break;
    }
    chunks.push(value);
  }
  return new Uint8Array(await new Blob(chunks).arrayBuffer());
}
async function encryptRandomKeyForUsers(usersPublicKeys, encryptionParams) {
  return Promise.all(Object.entries(usersPublicKeys).map(async ([userId, publicKey]) => {
    const rawKey = await window.crypto.subtle.exportKey("raw", encryptionParams.key);
    const encryptedFileDropKey = await encryptStringAsymmetric(
      publicKey,
      rawKey
    );
    return { userId, encryptedFiledropKey: bufferToBase64(encryptedFileDropKey) };
  }));
}
function getTag(encrypted) {
  return encrypted.slice(encrypted.byteLength - 16);
}
async function getRandomAESKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 128
    },
    true,
    ["encrypt", "decrypt"]
  );
}
async function getRandomEncryptionParams() {
  return {
    key: await getRandomAESKey(),
    initializationVector: window.crypto.getRandomValues(new Uint8Array(16))
  };
}
async function encryptWithAES({ key, initializationVector }, content) {
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: initializationVector },
    key,
    content
  );
  return {
    content: encrypted,
    tag: getTag(encrypted)
  };
}
async function encryptFile(file) {
  const blob = await file.arrayBuffer();
  const encryptionParams = await getRandomEncryptionParams();
  const { content, tag } = await encryptWithAES(encryptionParams, new Uint8Array(blob));
  logger.debug("[FileDrop] File encrypted: ".concat(file.name), { file, content, tag, encryptionParams, rawKey: bufferToBase64(await window.crypto.subtle.exportKey("raw", encryptionParams.key)) });
  return {
    encryptedFileContent: content,
    encryptionInfo: {
      filename: file.name,
      mimetype: file.type || "application/octet-stream",
      nonce: bufferToBase64(encryptionParams.initializationVector),
      key: bufferToBase64(await window.crypto.subtle.exportKey("raw", encryptionParams.key)),
      authenticationTag: bufferToBase64(tag)
    }
  };
}
async function importPublicKey(pem) {
  const cert = new X509Certificate(pem);
  return await window.crypto.subtle.importKey(
    "spki",
    cert.publicKey.rawData,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["encrypt"]
  );
}
async function encryptStringAsymmetric(publicKey, buffer) {
  return await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    await importPublicKey(publicKey),
    buffer
  );
}
async function uploadFile(davEndpoint, fileName, content, shareToken) {
  await cancelableClient.put(
    path.join(f(), davEndpoint, fileName),
    content,
    {
      headers: {
        Authorization: "Basic ".concat(btoa("".concat(shareToken, ":")))
      }
    }
  );
}
const _sfc_main$5 = {
  name: "CheckIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$5 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon check-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$5 = [];
_sfc_render$5._withStripped = true;
var __component__$6 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$5,
  _sfc_render$5,
  _sfc_staticRenderFns$5,
  false,
  null,
  null
);
__component__$6.options.__file = "/home/louis/workspace/nextcloud/instances/master/apps-extra/end_to_end_encryption/node_modules/vue-material-design-icons/Check.vue";
const IconCheck = __component__$6.exports;
const _sfc_main$4 = {
  name: "AlertCircleIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$4 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon alert-circle-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$4 = [];
_sfc_render$4._withStripped = true;
var __component__$5 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  null
);
__component__$5.options.__file = "/home/louis/workspace/nextcloud/instances/master/apps-extra/end_to_end_encryption/node_modules/vue-material-design-icons/AlertCircle.vue";
const IconAlertCircle = __component__$5.exports;
const _sfc_main$3 = {
  name: "ArrowLeftIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$3 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon arrow-left-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$3 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent$2(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  null
);
const ArrowLeft = __component__$4.exports;
var __defProp2 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function normalizeComponent(scriptExports, render23, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
  var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
  if (render23) {
    options.render = render23;
    options.staticRenderFns = staticRenderFns2;
    options._compiled = true;
  }
  var hook;
  if (injectStyles) {
    hook = injectStyles;
  }
  if (hook) {
    if (options.functional) {
      options._injectStyles = hook;
      var originalRender = options.render;
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }
  return {
    exports: scriptExports,
    options
  };
}
const __vue2_script$1 = {
  name: "splitpanes",
  props: {
    horizontal: { type: Boolean },
    pushOtherPanes: { type: Boolean, default: true },
    dblClickSplitter: { type: Boolean, default: true },
    rtl: { type: Boolean, default: false },
    firstSplitter: { type: Boolean }
  },
  provide() {
    return {
      requestUpdate: this.requestUpdate,
      onPaneAdd: this.onPaneAdd,
      onPaneRemove: this.onPaneRemove,
      onPaneClick: this.onPaneClick
    };
  },
  data: () => ({
    container: null,
    ready: false,
    panes: [],
    touch: {
      mouseDown: false,
      dragging: false,
      activeSplitter: null
    },
    splitterTaps: {
      splitter: null,
      timeoutId: null
    }
  }),
  computed: {
    panesCount() {
      return this.panes.length;
    },
    indexedPanes() {
      return this.panes.reduce((obj, pane2) => (obj[pane2.id] = pane2) && obj, {});
    }
  },
  methods: {
    updatePaneComponents() {
      this.panes.forEach((pane2) => {
        pane2.update && pane2.update({
          [this.horizontal ? "height" : "width"]: "".concat(this.indexedPanes[pane2.id].size, "%")
        });
      });
    },
    bindEvents() {
      document.addEventListener("mousemove", this.onMouseMove, { passive: false });
      document.addEventListener("mouseup", this.onMouseUp);
      if ("ontouchstart" in window) {
        document.addEventListener("touchmove", this.onMouseMove, { passive: false });
        document.addEventListener("touchend", this.onMouseUp);
      }
    },
    unbindEvents() {
      document.removeEventListener("mousemove", this.onMouseMove, { passive: false });
      document.removeEventListener("mouseup", this.onMouseUp);
      if ("ontouchstart" in window) {
        document.removeEventListener("touchmove", this.onMouseMove, { passive: false });
        document.removeEventListener("touchend", this.onMouseUp);
      }
    },
    onMouseDown(event, splitterIndex) {
      this.bindEvents();
      this.touch.mouseDown = true;
      this.touch.activeSplitter = splitterIndex;
    },
    onMouseMove(event) {
      if (this.touch.mouseDown) {
        event.preventDefault();
        this.touch.dragging = true;
        this.calculatePanesSize(this.getCurrentMouseDrag(event));
        this.$emit("resize", this.panes.map((pane2) => ({ min: pane2.min, max: pane2.max, size: pane2.size })));
      }
    },
    onMouseUp() {
      if (this.touch.dragging) {
        this.$emit("resized", this.panes.map((pane2) => ({ min: pane2.min, max: pane2.max, size: pane2.size })));
      }
      this.touch.mouseDown = false;
      setTimeout(() => {
        this.touch.dragging = false;
        this.unbindEvents();
      }, 100);
    },
    onSplitterClick(event, splitterIndex) {
      if ("ontouchstart" in window) {
        event.preventDefault();
        if (this.dblClickSplitter) {
          if (this.splitterTaps.splitter === splitterIndex) {
            clearTimeout(this.splitterTaps.timeoutId);
            this.splitterTaps.timeoutId = null;
            this.onSplitterDblClick(event, splitterIndex);
            this.splitterTaps.splitter = null;
          } else {
            this.splitterTaps.splitter = splitterIndex;
            this.splitterTaps.timeoutId = setTimeout(() => {
              this.splitterTaps.splitter = null;
            }, 500);
          }
        }
      }
      if (!this.touch.dragging)
        this.$emit("splitter-click", this.panes[splitterIndex]);
    },
    onSplitterDblClick(event, splitterIndex) {
      let totalMinSizes = 0;
      this.panes = this.panes.map((pane2, i) => {
        pane2.size = i === splitterIndex ? pane2.max : pane2.min;
        if (i !== splitterIndex)
          totalMinSizes += pane2.min;
        return pane2;
      });
      this.panes[splitterIndex].size -= totalMinSizes;
      this.$emit("pane-maximize", this.panes[splitterIndex]);
    },
    onPaneClick(event, paneId) {
      this.$emit("pane-click", this.indexedPanes[paneId]);
    },
    getCurrentMouseDrag(event) {
      const rect = this.container.getBoundingClientRect();
      const { clientX, clientY } = "ontouchstart" in window && event.touches ? event.touches[0] : event;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    },
    getCurrentDragPercentage(drag) {
      drag = drag[this.horizontal ? "y" : "x"];
      const containerSize = this.container[this.horizontal ? "clientHeight" : "clientWidth"];
      if (this.rtl && !this.horizontal)
        drag = containerSize - drag;
      return drag * 100 / containerSize;
    },
    calculatePanesSize(drag) {
      const splitterIndex = this.touch.activeSplitter;
      let sums = {
        prevPanesSize: this.sumPrevPanesSize(splitterIndex),
        nextPanesSize: this.sumNextPanesSize(splitterIndex),
        prevReachedMinPanes: 0,
        nextReachedMinPanes: 0
      };
      const minDrag = 0 + (this.pushOtherPanes ? 0 : sums.prevPanesSize);
      const maxDrag = 100 - (this.pushOtherPanes ? 0 : sums.nextPanesSize);
      const dragPercentage = Math.max(Math.min(this.getCurrentDragPercentage(drag), maxDrag), minDrag);
      let panesToResize = [splitterIndex, splitterIndex + 1];
      let paneBefore = this.panes[panesToResize[0]] || null;
      let paneAfter = this.panes[panesToResize[1]] || null;
      const paneBeforeMaxReached = paneBefore.max < 100 && dragPercentage >= paneBefore.max + sums.prevPanesSize;
      const paneAfterMaxReached = paneAfter.max < 100 && dragPercentage <= 100 - (paneAfter.max + this.sumNextPanesSize(splitterIndex + 1));
      if (paneBeforeMaxReached || paneAfterMaxReached) {
        if (paneBeforeMaxReached) {
          paneBefore.size = paneBefore.max;
          paneAfter.size = Math.max(100 - paneBefore.max - sums.prevPanesSize - sums.nextPanesSize, 0);
        } else {
          paneBefore.size = Math.max(100 - paneAfter.max - sums.prevPanesSize - this.sumNextPanesSize(splitterIndex + 1), 0);
          paneAfter.size = paneAfter.max;
        }
        return;
      }
      if (this.pushOtherPanes) {
        const vars = this.doPushOtherPanes(sums, dragPercentage);
        if (!vars)
          return;
        ({ sums, panesToResize } = vars);
        paneBefore = this.panes[panesToResize[0]] || null;
        paneAfter = this.panes[panesToResize[1]] || null;
      }
      if (paneBefore !== null) {
        paneBefore.size = Math.min(Math.max(dragPercentage - sums.prevPanesSize - sums.prevReachedMinPanes, paneBefore.min), paneBefore.max);
      }
      if (paneAfter !== null) {
        paneAfter.size = Math.min(Math.max(100 - dragPercentage - sums.nextPanesSize - sums.nextReachedMinPanes, paneAfter.min), paneAfter.max);
      }
    },
    doPushOtherPanes(sums, dragPercentage) {
      const splitterIndex = this.touch.activeSplitter;
      const panesToResize = [splitterIndex, splitterIndex + 1];
      if (dragPercentage < sums.prevPanesSize + this.panes[panesToResize[0]].min) {
        panesToResize[0] = this.findPrevExpandedPane(splitterIndex).index;
        sums.prevReachedMinPanes = 0;
        if (panesToResize[0] < splitterIndex) {
          this.panes.forEach((pane2, i) => {
            if (i > panesToResize[0] && i <= splitterIndex) {
              pane2.size = pane2.min;
              sums.prevReachedMinPanes += pane2.min;
            }
          });
        }
        sums.prevPanesSize = this.sumPrevPanesSize(panesToResize[0]);
        if (panesToResize[0] === void 0) {
          sums.prevReachedMinPanes = 0;
          this.panes[0].size = this.panes[0].min;
          this.panes.forEach((pane2, i) => {
            if (i > 0 && i <= splitterIndex) {
              pane2.size = pane2.min;
              sums.prevReachedMinPanes += pane2.min;
            }
          });
          this.panes[panesToResize[1]].size = 100 - sums.prevReachedMinPanes - this.panes[0].min - sums.prevPanesSize - sums.nextPanesSize;
          return null;
        }
      }
      if (dragPercentage > 100 - sums.nextPanesSize - this.panes[panesToResize[1]].min) {
        panesToResize[1] = this.findNextExpandedPane(splitterIndex).index;
        sums.nextReachedMinPanes = 0;
        if (panesToResize[1] > splitterIndex + 1) {
          this.panes.forEach((pane2, i) => {
            if (i > splitterIndex && i < panesToResize[1]) {
              pane2.size = pane2.min;
              sums.nextReachedMinPanes += pane2.min;
            }
          });
        }
        sums.nextPanesSize = this.sumNextPanesSize(panesToResize[1] - 1);
        if (panesToResize[1] === void 0) {
          sums.nextReachedMinPanes = 0;
          this.panes[this.panesCount - 1].size = this.panes[this.panesCount - 1].min;
          this.panes.forEach((pane2, i) => {
            if (i < this.panesCount - 1 && i >= splitterIndex + 1) {
              pane2.size = pane2.min;
              sums.nextReachedMinPanes += pane2.min;
            }
          });
          this.panes[panesToResize[0]].size = 100 - sums.prevPanesSize - sums.nextReachedMinPanes - this.panes[this.panesCount - 1].min - sums.nextPanesSize;
          return null;
        }
      }
      return { sums, panesToResize };
    },
    sumPrevPanesSize(splitterIndex) {
      return this.panes.reduce((total, pane2, i) => total + (i < splitterIndex ? pane2.size : 0), 0);
    },
    sumNextPanesSize(splitterIndex) {
      return this.panes.reduce((total, pane2, i) => total + (i > splitterIndex + 1 ? pane2.size : 0), 0);
    },
    findPrevExpandedPane(splitterIndex) {
      const pane2 = [...this.panes].reverse().find((p) => p.index < splitterIndex && p.size > p.min);
      return pane2 || {};
    },
    findNextExpandedPane(splitterIndex) {
      const pane2 = this.panes.find((p) => p.index > splitterIndex + 1 && p.size > p.min);
      return pane2 || {};
    },
    checkSplitpanesNodes() {
      const children = Array.from(this.container.children);
      children.forEach((child) => {
        const isPane = child.classList.contains("splitpanes__pane");
        const isSplitter = child.classList.contains("splitpanes__splitter");
        if (!isPane && !isSplitter) {
          child.parentNode.removeChild(child);
          console.warn("Splitpanes: Only <pane> elements are allowed at the root of <splitpanes>. One of your DOM nodes was removed.");
          return;
        }
      });
    },
    addSplitter(paneIndex, nextPaneNode, isVeryFirst = false) {
      const splitterIndex = paneIndex - 1;
      const elm = document.createElement("div");
      elm.classList.add("splitpanes__splitter");
      if (!isVeryFirst) {
        elm.onmousedown = (event) => this.onMouseDown(event, splitterIndex);
        if (typeof window !== "undefined" && "ontouchstart" in window) {
          elm.ontouchstart = (event) => this.onMouseDown(event, splitterIndex);
        }
        elm.onclick = (event) => this.onSplitterClick(event, splitterIndex + 1);
      }
      if (this.dblClickSplitter) {
        elm.ondblclick = (event) => this.onSplitterDblClick(event, splitterIndex + 1);
      }
      nextPaneNode.parentNode.insertBefore(elm, nextPaneNode);
    },
    removeSplitter(node) {
      node.onmousedown = void 0;
      node.onclick = void 0;
      node.ondblclick = void 0;
      node.parentNode.removeChild(node);
    },
    redoSplitters() {
      const children = Array.from(this.container.children);
      children.forEach((el) => {
        if (el.className.includes("splitpanes__splitter"))
          this.removeSplitter(el);
      });
      let paneIndex = 0;
      children.forEach((el) => {
        if (el.className.includes("splitpanes__pane")) {
          if (!paneIndex && this.firstSplitter)
            this.addSplitter(paneIndex, el, true);
          else if (paneIndex)
            this.addSplitter(paneIndex, el);
          paneIndex++;
        }
      });
    },
    requestUpdate(_a) {
      var _b = _a, { target } = _b, args = __objRest(_b, ["target"]);
      const pane2 = this.indexedPanes[target._uid];
      Object.entries(args).forEach(([key, value]) => pane2[key] = value);
    },
    onPaneAdd(pane2) {
      let index = -1;
      Array.from(pane2.$el.parentNode.children).some((el) => {
        if (el.className.includes("splitpanes__pane"))
          index++;
        return el === pane2.$el;
      });
      const min = parseFloat(pane2.minSize);
      const max = parseFloat(pane2.maxSize);
      this.panes.splice(index, 0, {
        id: pane2._uid,
        index,
        min: isNaN(min) ? 0 : min,
        max: isNaN(max) ? 100 : max,
        size: pane2.size === null ? null : parseFloat(pane2.size),
        givenSize: pane2.size,
        update: pane2.update
      });
      this.panes.forEach((p, i) => p.index = i);
      if (this.ready) {
        this.$nextTick(() => {
          this.redoSplitters();
          this.resetPaneSizes({ addedPane: this.panes[index] });
          this.$emit("pane-add", { index, panes: this.panes.map((pane3) => ({ min: pane3.min, max: pane3.max, size: pane3.size })) });
        });
      }
    },
    onPaneRemove(pane2) {
      const index = this.panes.findIndex((p) => p.id === pane2._uid);
      const removed = this.panes.splice(index, 1)[0];
      this.panes.forEach((p, i) => p.index = i);
      this.$nextTick(() => {
        this.redoSplitters();
        this.resetPaneSizes({ removedPane: __spreadProps(__spreadValues2({}, removed), { index }) });
        this.$emit("pane-remove", { removed, panes: this.panes.map((pane3) => ({ min: pane3.min, max: pane3.max, size: pane3.size })) });
      });
    },
    resetPaneSizes(changedPanes = {}) {
      if (!changedPanes.addedPane && !changedPanes.removedPane)
        this.initialPanesSizing();
      else if (this.panes.some((pane2) => pane2.givenSize !== null || pane2.min || pane2.max < 100))
        this.equalizeAfterAddOrRemove(changedPanes);
      else
        this.equalize();
      if (this.ready)
        this.$emit("resized", this.panes.map((pane2) => ({ min: pane2.min, max: pane2.max, size: pane2.size })));
    },
    equalize() {
      const equalSpace = 100 / this.panesCount;
      let leftToAllocate = 0;
      let ungrowable = [];
      let unshrinkable = [];
      this.panes.forEach((pane2) => {
        pane2.size = Math.max(Math.min(equalSpace, pane2.max), pane2.min);
        leftToAllocate -= pane2.size;
        if (pane2.size >= pane2.max)
          ungrowable.push(pane2.id);
        if (pane2.size <= pane2.min)
          unshrinkable.push(pane2.id);
      });
      if (leftToAllocate > 0.1)
        this.readjustSizes(leftToAllocate, ungrowable, unshrinkable);
    },
    initialPanesSizing() {
      100 / this.panesCount;
      let leftToAllocate = 100;
      let ungrowable = [];
      let unshrinkable = [];
      let definedSizes = 0;
      this.panes.forEach((pane2) => {
        leftToAllocate -= pane2.size;
        if (pane2.size !== null)
          definedSizes++;
        if (pane2.size >= pane2.max)
          ungrowable.push(pane2.id);
        if (pane2.size <= pane2.min)
          unshrinkable.push(pane2.id);
      });
      let leftToAllocate2 = 100;
      if (leftToAllocate > 0.1) {
        this.panes.forEach((pane2) => {
          if (pane2.size === null) {
            pane2.size = Math.max(Math.min(leftToAllocate / (this.panesCount - definedSizes), pane2.max), pane2.min);
          }
          leftToAllocate2 -= pane2.size;
        });
        if (leftToAllocate2 > 0.1)
          this.readjustSizes(leftToAllocate, ungrowable, unshrinkable);
      }
    },
    equalizeAfterAddOrRemove({ addedPane, removedPane } = {}) {
      let equalSpace = 100 / this.panesCount;
      let leftToAllocate = 0;
      let ungrowable = [];
      let unshrinkable = [];
      if (addedPane && addedPane.givenSize !== null) {
        equalSpace = (100 - addedPane.givenSize) / (this.panesCount - 1);
      }
      this.panes.forEach((pane2) => {
        leftToAllocate -= pane2.size;
        if (pane2.size >= pane2.max)
          ungrowable.push(pane2.id);
        if (pane2.size <= pane2.min)
          unshrinkable.push(pane2.id);
      });
      if (Math.abs(leftToAllocate) < 0.1)
        return;
      this.panes.forEach((pane2) => {
        if (addedPane && addedPane.givenSize !== null && addedPane.id === pane2.id)
          ;
        else
          pane2.size = Math.max(Math.min(equalSpace, pane2.max), pane2.min);
        leftToAllocate -= pane2.size;
        if (pane2.size >= pane2.max)
          ungrowable.push(pane2.id);
        if (pane2.size <= pane2.min)
          unshrinkable.push(pane2.id);
      });
      if (leftToAllocate > 0.1)
        this.readjustSizes(leftToAllocate, ungrowable, unshrinkable);
    },
    readjustSizes(leftToAllocate, ungrowable, unshrinkable) {
      let equalSpaceToAllocate;
      if (leftToAllocate > 0)
        equalSpaceToAllocate = leftToAllocate / (this.panesCount - ungrowable.length);
      else
        equalSpaceToAllocate = leftToAllocate / (this.panesCount - unshrinkable.length);
      this.panes.forEach((pane2, i) => {
        if (leftToAllocate > 0 && !ungrowable.includes(pane2.id)) {
          const newPaneSize = Math.max(Math.min(pane2.size + equalSpaceToAllocate, pane2.max), pane2.min);
          const allocated = newPaneSize - pane2.size;
          leftToAllocate -= allocated;
          pane2.size = newPaneSize;
        } else if (!unshrinkable.includes(pane2.id)) {
          const newPaneSize = Math.max(Math.min(pane2.size + equalSpaceToAllocate, pane2.max), pane2.min);
          const allocated = newPaneSize - pane2.size;
          leftToAllocate -= allocated;
          pane2.size = newPaneSize;
        }
        pane2.update({
          [this.horizontal ? "height" : "width"]: "".concat(this.indexedPanes[pane2.id].size, "%")
        });
      });
      if (Math.abs(leftToAllocate) > 0.1) {
        this.$nextTick(() => {
          if (this.ready) {
            console.warn("Splitpanes: Could not resize panes correctly due to their constraints.");
          }
        });
      }
    }
  },
  watch: {
    panes: {
      deep: true,
      immediate: false,
      handler() {
        this.updatePaneComponents();
      }
    },
    horizontal() {
      this.updatePaneComponents();
    },
    firstSplitter() {
      this.redoSplitters();
    },
    dblClickSplitter(enable) {
      const splitters = [...this.container.querySelectorAll(".splitpanes__splitter")];
      splitters.forEach((splitter, i) => {
        splitter.ondblclick = enable ? (event) => this.onSplitterDblClick(event, i) : void 0;
      });
    }
  },
  beforeDestroy() {
    this.ready = false;
  },
  mounted() {
    this.container = this.$refs.container;
    this.checkSplitpanesNodes();
    this.redoSplitters();
    this.resetPaneSizes();
    this.$emit("ready");
    this.ready = true;
  },
  render(h) {
    return h("div", {
      ref: "container",
      class: [
        "splitpanes",
        "splitpanes--".concat(this.horizontal ? "horizontal" : "vertical"),
        {
          "splitpanes--dragging": this.touch.dragging
        }
      ]
    }, this.$slots.default);
  }
};
let __vue2_render, __vue2_staticRenderFns;
const __cssModules$1 = {};
var __component__$1$2 = /* @__PURE__ */ normalizeComponent(__vue2_script$1, __vue2_render, __vue2_staticRenderFns, false, __vue2_injectStyles$1);
function __vue2_injectStyles$1(context) {
  for (let o in __cssModules$1) {
    this[o] = __cssModules$1[o];
  }
}
var splitpanes = /* @__PURE__ */ function() {
  return __component__$1$2.exports;
}();
var render4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "splitpanes__pane", style: _vm.style, on: { "click": function($event) {
    return _vm.onPaneClick($event, _vm._uid);
  } } }, [_vm._t("default")], 2);
};
var staticRenderFns = [];
const __vue2_script = {
  name: "pane",
  inject: ["requestUpdate", "onPaneAdd", "onPaneRemove", "onPaneClick"],
  props: {
    size: { type: [Number, String], default: null },
    minSize: { type: [Number, String], default: 0 },
    maxSize: { type: [Number, String], default: 100 }
  },
  data: () => ({
    style: {}
  }),
  mounted() {
    this.onPaneAdd(this);
  },
  beforeDestroy() {
    this.onPaneRemove(this);
  },
  methods: {
    update(style) {
      this.style = style;
    }
  },
  computed: {
    sizeNumber() {
      return this.size || this.size === 0 ? parseFloat(this.size) : null;
    },
    minSizeNumber() {
      return parseFloat(this.minSize);
    },
    maxSizeNumber() {
      return parseFloat(this.maxSize);
    }
  },
  watch: {
    sizeNumber(size) {
      this.requestUpdate({ target: this, size });
    },
    minSizeNumber(min) {
      this.requestUpdate({ target: this, min });
    },
    maxSizeNumber(max) {
      this.requestUpdate({ target: this, max });
    }
  }
};
const __cssModules = {};
var __component__$3 = /* @__PURE__ */ normalizeComponent(__vue2_script, render4, staticRenderFns, false, __vue2_injectStyles);
function __vue2_injectStyles(context) {
  for (let o in __cssModules) {
    this[o] = __cssModules[o];
  }
}
var pane = /* @__PURE__ */ function() {
  return __component__$3.exports;
}();
register(t26);
const _sfc_main$1$1 = {
  name: "NcAppDetailsToggle",
  directives: {
    tooltip: VTooltip
  },
  components: {
    NcButton,
    ArrowRight,
    ArrowLeft
  },
  setup() {
    return {
      isRTL: isRTL(),
      isMobile: useIsMobile()
    };
  },
  computed: {
    title() {
      return t("Go back to the list");
    }
  },
  watch: {
    isMobile: {
      immediate: true,
      handler() {
        this.toggleAppNavigationButton(this.isMobile);
      }
    }
  },
  beforeDestroy() {
    if (this.isMobile) {
      this.toggleAppNavigationButton(false);
    }
  },
  methods: {
    toggleAppNavigationButton(hide = true) {
      const appNavigationToggle = document.querySelector(".app-navigation .app-navigation-toggle");
      if (appNavigationToggle) {
        appNavigationToggle.style.display = hide ? "none" : null;
        if (hide === true) {
          emit("toggle-navigation", { open: false });
        }
      }
    }
  }
};
var _sfc_render$1$1 = function render5() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcButton", { directives: [{ name: "tooltip", rawName: "v-tooltip", value: _vm.title, expression: "title" }], staticClass: "app-details-toggle", class: { "app-details-toggle--mobile": _vm.isMobile }, attrs: { "type": "tertiary", "aria-label": _vm.title }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_vm.isRTL ? _c("ArrowLeft", { attrs: { "size": 20 } }) : _c("ArrowRight", { attrs: { "size": 20 } })];
  }, proxy: true }]) });
};
var _sfc_staticRenderFns$1$1 = [];
var __component__$1$1 = /* @__PURE__ */ normalizeComponent$2(
  _sfc_main$1$1,
  _sfc_render$1$1,
  _sfc_staticRenderFns$1$1,
  false,
  null,
  "089eb524"
);
const NcAppDetailsToggle = __component__$1$1.exports;
const browserStorage = getBuilder_1("nextcloud").persist().build();
const _sfc_main$2 = {
  name: "NcAppContent",
  components: {
    NcAppDetailsToggle,
    Pane: pane,
    Splitpanes: splitpanes
  },
  props: {
    /**
     * Allows to disable the control by swipe of the app navigation open state
     */
    allowSwipeNavigation: {
      type: Boolean,
      default: true
    },
    /**
     * Allows you to set the default width of the resizable list in % on vertical-split
     * Allows you to set the default height of the resizable list in % on horizontal-split
     * Must be between listMinWidth and listMaxWidth
     */
    listSize: {
      type: Number,
      default: 20
    },
    /**
     * Allows you to set the minimum width of the list column in % on vertical-split
     * Allows you to set the minimum height of the list column in % on horizontal-split
     */
    listMinWidth: {
      type: Number,
      default: 15
    },
    /**
     * Allows you to set the maximum width of the list column in % on vertical-split
     * Allows you to set the maximum height of the list column in % on horizontal-split
     */
    listMaxWidth: {
      type: Number,
      default: 40
    },
    /**
     * Specify the config key for the pane config sizes
     * Default is the global var appName if you use the webpack-vue-config
     */
    paneConfigKey: {
      type: String,
      default: ""
    },
    /**
     * When in mobile view, only the list or the details are shown
     * If you provide a list, you need to provide a variable
     * that will be set to true by the user when an element of
     * the list gets selected. The details will then show a back
     * arrow to return to the list that will update this prop to false.
     */
    showDetails: {
      type: Boolean,
      default: true
    },
    /**
     * Specify the `<h1>` page heading
     */
    pageHeading: {
      type: String,
      default: null
    },
    /**
     * Content layout used when there is a list together with content:
     * - `vertical-split` - a 2-column layout with list and default content separated vertically
     * - `no-split` - a single column layout; List is shown when `showDetails` is `false`, otherwise the default slot content is shown with a back button to return to the list.
     * - 'horizontal-split' - a 2-column layout with list and default content separated horizontally
     * On mobile screen `no-split` layout is forced.
     */
    layout: {
      type: String,
      default: "vertical-split",
      validator(value) {
        return ["no-split", "vertical-split", "horizontal-split"].includes(value);
      }
    }
  },
  emits: [
    "update:showDetails",
    "resize:list"
  ],
  setup() {
    return {
      isMobile: useIsMobile()
    };
  },
  data() {
    return {
      contentHeight: 0,
      hasList: false,
      hasContent: false,
      swiping: {},
      listPaneSize: this.restorePaneConfig()
    };
  },
  computed: {
    paneConfigID() {
      if (this.paneConfigKey !== "") {
        return "pane-list-size-".concat(this.paneConfigKey);
      }
      try {
        return "pane-list-size-".concat(appName);
      } catch (e) {
        console.info("[INFO] AppContent:", "falling back to global nextcloud pane config");
        return "pane-list-size-nextcloud";
      }
    },
    detailsPaneSize() {
      if (this.listPaneSize) {
        return 100 - this.listPaneSize;
      }
      return this.paneDefaults.details.size;
    },
    paneDefaults() {
      return {
        list: {
          size: this.listSize,
          min: this.listMinWidth,
          max: this.listMaxWidth
        },
        // set the inverse values of the details column
        // based on the provided (or default) values of the list column
        details: {
          size: 100 - this.listSize,
          min: 100 - this.listMaxWidth,
          max: 100 - this.listMinWidth
        }
      };
    }
  },
  updated() {
    this.checkSlots();
  },
  mounted() {
    if (this.allowSwipeNavigation) {
      this.swiping = useSwipe(this.$el, {
        onSwipeEnd: this.handleSwipe
      });
    }
    this.checkSlots();
    this.restorePaneConfig();
  },
  methods: {
    /**
     * handle the swipe event
     *
     * @param {TouchEvent} e The touch event
     * @param {import('@vueuse/core').SwipeDirection} direction The swipe direction of the event
     */
    handleSwipe(e, direction) {
      const minSwipeX = 70;
      const touchZone = 300;
      if (Math.abs(this.swiping.lengthX) > minSwipeX) {
        if (this.swiping.coordsStart.x < touchZone / 2 && direction === "right") {
          emit("toggle-navigation", {
            open: true
          });
        } else if (this.swiping.coordsStart.x < touchZone * 1.5 && direction === "left") {
          emit("toggle-navigation", {
            open: false
          });
        }
      }
    },
    handlePaneResize(event) {
      const listPaneSize = parseInt(event[0].size, 10);
      browserStorage.setItem(this.paneConfigID, JSON.stringify(listPaneSize));
      this.listPaneSize = listPaneSize;
      this.$emit("resize:list", { size: listPaneSize });
      console.debug("AppContent pane config", listPaneSize);
    },
    // $slots is not reactive, we need to update this manually
    checkSlots() {
      this.hasList = !!this.$scopedSlots.list;
      this.hasContent = !!this.$scopedSlots.default;
    },
    // browserStorage is not reactive, we need to update this manually
    restorePaneConfig() {
      const listPaneSize = parseInt(browserStorage.getItem(this.paneConfigID), 10);
      if (!isNaN(listPaneSize) && listPaneSize !== this.listPaneSize) {
        console.debug("AppContent pane config", listPaneSize);
        this.listPaneSize = listPaneSize;
        return listPaneSize;
      }
    },
    /**
     * The user clicked the back arrow from the details view
     */
    hideDetails() {
      this.$emit("update:showDetails", false);
    }
  }
};
var _sfc_render$2 = function render22() {
  var _vm = this, _c = _vm._self._c;
  return _c("main", { staticClass: "app-content no-snapper", class: { "app-content--has-list": _vm.hasList }, attrs: { "id": "app-content-vue" } }, [_vm.pageHeading ? _c("h1", { staticClass: "hidden-visually" }, [_vm._v(" " + _vm._s(_vm.pageHeading) + " ")]) : _vm._e(), _vm.hasList ? [_vm.isMobile || _vm.layout === "no-split" ? _c("div", { staticClass: "app-content-wrapper app-content-wrapper--no-split", class: {
    "app-content-wrapper--show-details": _vm.showDetails,
    "app-content-wrapper--show-list": !_vm.showDetails,
    "app-content-wrapper--mobile": _vm.isMobile
  } }, [_vm.showDetails ? _c("NcAppDetailsToggle", { nativeOn: { "click": function($event) {
    $event.stopPropagation();
    $event.preventDefault();
    return _vm.hideDetails.apply(null, arguments);
  } } }) : _vm._e(), !_vm.showDetails ? _vm._t("list") : _vm._t("default")], 2) : _vm.layout === "vertical-split" || _vm.layout === "horizontal-split" ? _c("div", { staticClass: "app-content-wrapper" }, [_c("Splitpanes", { staticClass: "default-theme", class: {
    "splitpanes--horizontal": _vm.layout === "horizontal-split",
    "splitpanes--vertical": _vm.layout === "vertical-split"
  }, attrs: { "horizontal": _vm.layout === "horizontal-split" }, on: { "resized": _vm.handlePaneResize } }, [_c("Pane", { staticClass: "splitpanes__pane-list", attrs: { "size": _vm.listPaneSize || _vm.paneDefaults.list.size, "min-size": _vm.paneDefaults.list.min, "max-size": _vm.paneDefaults.list.max } }, [_vm._t("list")], 2), _c("Pane", { staticClass: "splitpanes__pane-details", attrs: { "size": _vm.detailsPaneSize, "min-size": _vm.paneDefaults.details.min, "max-size": _vm.paneDefaults.details.max } }, [_vm._t("default")], 2)], 1)], 1) : _vm._e()] : _vm._e(), !_vm.hasList ? _vm._t("default") : _vm._e()], 2);
};
var _sfc_staticRenderFns$2 = [];
var __component__$2 = /* @__PURE__ */ normalizeComponent$2(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  "7b4bc577"
);
const NcAppContent = __component__$2.exports;
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
  let id = "";
  let i = size | 0;
  while (i--) {
    id += urlAlphabet[Math.random() * 64 | 0];
  }
  return id;
};
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
var config = {
  selector: "vue-portal-target-".concat(nanoid())
};
var setSelector = function setSelector2(selector) {
  return config.selector = selector;
};
var isBrowser = typeof window !== "undefined" && (typeof document === "undefined" ? "undefined" : _typeof(document)) !== void 0;
var TargetContainer = Vue.extend({
  // as an abstract component, it doesn't appear in
  // the $parent chain of components.
  // which means the next parent of any component rendered inside of this oen
  // will be the parent from which is was sent
  // @ts-expect-error
  abstract: true,
  name: "PortalOutlet",
  props: ["nodes", "tag"],
  data: function data(vm) {
    return {
      updatedNodes: vm.nodes
    };
  },
  render: function render6(h) {
    var nodes = this.updatedNodes && this.updatedNodes();
    if (!nodes) return h();
    return nodes.length === 1 && !nodes[0].text ? nodes : h(this.tag || "DIV", nodes);
  },
  destroyed: function destroyed() {
    var el = this.$el;
    el && el.parentNode.removeChild(el);
  }
});
var Portal = Vue.extend({
  name: "VueSimplePortal",
  props: {
    disabled: {
      type: Boolean
    },
    prepend: {
      type: Boolean
    },
    selector: {
      type: String,
      default: function _default() {
        return "#".concat(config.selector);
      }
    },
    tag: {
      type: String,
      default: "DIV"
    }
  },
  render: function render7(h) {
    if (this.disabled) {
      var nodes = this.$scopedSlots && this.$scopedSlots.default();
      if (!nodes) return h();
      return nodes.length < 2 && !nodes[0].text ? nodes : h(this.tag, nodes);
    }
    return h();
  },
  created: function created() {
    if (!this.getTargetEl()) {
      this.insertTargetEl();
    }
  },
  updated: function updated() {
    var _this = this;
    this.$nextTick(function() {
      if (!_this.disabled && _this.slotFn !== _this.$scopedSlots.default) {
        _this.container.updatedNodes = _this.$scopedSlots.default;
      }
      _this.slotFn = _this.$scopedSlots.default;
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.unmount();
  },
  watch: {
    disabled: {
      immediate: true,
      handler: function handler(disabled) {
        disabled ? this.unmount() : this.$nextTick(this.mount);
      }
    }
  },
  methods: {
    // This returns the element into which the content should be mounted.
    getTargetEl: function getTargetEl() {
      if (!isBrowser) return;
      return document.querySelector(this.selector);
    },
    insertTargetEl: function insertTargetEl() {
      if (!isBrowser) return;
      var parent = document.querySelector("body");
      var child = document.createElement(this.tag);
      child.id = this.selector.substring(1);
      parent.appendChild(child);
    },
    mount: function mount() {
      if (!isBrowser) return;
      var targetEl = this.getTargetEl();
      var el = document.createElement("DIV");
      if (this.prepend && targetEl.firstChild) {
        targetEl.insertBefore(el, targetEl.firstChild);
      } else {
        targetEl.appendChild(el);
      }
      this.container = new TargetContainer({
        el,
        parent: this,
        propsData: {
          tag: this.tag,
          nodes: this.$scopedSlots.default
        }
      });
    },
    unmount: function unmount() {
      if (this.container) {
        this.container.$destroy();
        delete this.container;
      }
    }
  }
});
function install(_Vue) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  _Vue.component(options.name || "portal", Portal);
  if (options.defaultSelector) {
    setSelector(options.defaultSelector);
  }
}
if (typeof window !== "undefined" && window.Vue && window.Vue === Vue) {
  Vue.use(install);
}
register(t29);
const contentSvg = '<!--\n  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors\n  - SPDX-License-Identifier: AGPL-3.0-or-later\n-->\n<svg width="395" height="314" viewBox="0 0 395 314" fill="none" xmlns="http://www.w3.org/2000/svg">\n<rect width="395" height="314" rx="11" fill="#439DCD"/>\n<rect x="13" y="51" width="366" height="248" rx="8" fill="white"/>\n<rect x="22" y="111" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="127" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="63" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="191" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="143" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="79" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="159" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="95" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="175" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<path d="M288 145C277.56 147.8 265.32 149 254 149C242.68 149 230.44 147.8 220 145L218 153C225.44 155 234 156.32 242 157V209H250V185H258V209H266V157C274 156.32 282.56 155 290 153L288 145ZM254 145C258.4 145 262 141.4 262 137C262 132.6 258.4 129 254 129C249.6 129 246 132.6 246 137C246 141.4 249.6 145 254 145Z" fill="#DEDEDE"/>\n<path d="M43.5358 13C38.6641 13 34.535 16.2415 33.2552 20.6333C32.143 18.3038 29.7327 16.6718 26.9564 16.6718C23.1385 16.6718 20 19.7521 20 23.4993C20 27.2465 23.1385 30.3282 26.9564 30.3282C29.7327 30.3282 32.1429 28.6952 33.2552 26.3653C34.535 30.7575 38.6641 34 43.5358 34C48.3715 34 52.4796 30.8064 53.7921 26.4637C54.9249 28.7407 57.3053 30.3282 60.0421 30.3282C63.8601 30.3282 67 27.2465 67 23.4993C67 19.7521 63.8601 16.6718 60.0421 16.6718C57.3053 16.6718 54.9249 18.2583 53.7921 20.5349C52.4796 16.1926 48.3715 13 43.5358 13ZM43.5358 17.0079C47.2134 17.0079 50.1512 19.8899 50.1512 23.4993C50.1512 27.1087 47.2134 29.9921 43.5358 29.9921C39.8583 29.9921 36.9218 27.1087 36.9218 23.4993C36.9218 19.8899 39.8583 17.0079 43.5358 17.0079ZM26.9564 20.6797C28.5677 20.6797 29.8307 21.9179 29.8307 23.4993C29.8307 25.0807 28.5677 26.3203 26.9564 26.3203C25.3452 26.3203 24.0836 25.0807 24.0836 23.4993C24.0836 21.9179 25.3452 20.6797 26.9564 20.6797ZM60.0421 20.6797C61.6534 20.6797 62.9164 21.9179 62.9164 23.4993C62.9164 25.0807 61.6534 26.3203 60.0421 26.3203C58.4309 26.3203 57.1693 25.0807 57.1693 23.4993C57.1693 21.9179 58.4309 20.6797 60.0421 20.6797Z" fill="white"/>\n<rect x="79" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="99" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="119" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="139" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="159" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="179" y="20" width="8" height="8" rx="4" fill="white"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37258 0 0 5.37259 0 12V302C0 308.627 5.37259 314 12 314H383C389.627 314 395 308.627 395 302V12C395 5.37258 389.627 0 383 0H12ZM140 44C132.268 44 126 50.268 126 58V292C126 299.732 132.268 306 140 306H372C379.732 306 386 299.732 386 292V58C386 50.268 379.732 44 372 44H140Z" fill="black" fill-opacity="0.35"/>\n</svg>\n';
const navigationSvg = '<!--\n  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors\n  - SPDX-License-Identifier: AGPL-3.0-or-later\n-->\n<svg width="395" height="314" viewBox="0 0 395 314" fill="none" xmlns="http://www.w3.org/2000/svg">\n<rect width="395" height="314" rx="11" fill="#439DCD"/>\n<rect x="13" y="51" width="366" height="248" rx="8" fill="white"/>\n<rect x="22" y="111" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="127" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="63" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="191" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="143" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="79" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="159" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="95" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="175" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<path d="M288 145C277.56 147.8 265.32 149 254 149C242.68 149 230.44 147.8 220 145L218 153C225.44 155 234 156.32 242 157V209H250V185H258V209H266V157C274 156.32 282.56 155 290 153L288 145ZM254 145C258.4 145 262 141.4 262 137C262 132.6 258.4 129 254 129C249.6 129 246 132.6 246 137C246 141.4 249.6 145 254 145Z" fill="#DEDEDE"/>\n<path d="M43.5358 13C38.6641 13 34.535 16.2415 33.2552 20.6333C32.143 18.3038 29.7327 16.6718 26.9564 16.6718C23.1385 16.6718 20 19.7521 20 23.4993C20 27.2465 23.1385 30.3282 26.9564 30.3282C29.7327 30.3282 32.1429 28.6952 33.2552 26.3653C34.535 30.7575 38.6641 34 43.5358 34C48.3715 34 52.4796 30.8064 53.7921 26.4637C54.9249 28.7407 57.3053 30.3282 60.0421 30.3282C63.8601 30.3282 67 27.2465 67 23.4993C67 19.7521 63.8601 16.6718 60.0421 16.6718C57.3053 16.6718 54.9249 18.2583 53.7921 20.5349C52.4796 16.1926 48.3715 13 43.5358 13ZM43.5358 17.0079C47.2134 17.0079 50.1512 19.8899 50.1512 23.4993C50.1512 27.1087 47.2134 29.9921 43.5358 29.9921C39.8583 29.9921 36.9218 27.1087 36.9218 23.4993C36.9218 19.8899 39.8583 17.0079 43.5358 17.0079ZM26.9564 20.6797C28.5677 20.6797 29.8307 21.9179 29.8307 23.4993C29.8307 25.0807 28.5677 26.3203 26.9564 26.3203C25.3452 26.3203 24.0836 25.0807 24.0836 23.4993C24.0836 21.9179 25.3452 20.6797 26.9564 20.6797ZM60.0421 20.6797C61.6534 20.6797 62.9164 21.9179 62.9164 23.4993C62.9164 25.0807 61.6534 26.3203 60.0421 26.3203C58.4309 26.3203 57.1693 25.0807 57.1693 23.4993C57.1693 21.9179 58.4309 20.6797 60.0421 20.6797Z" fill="white"/>\n<rect x="79" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="99" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="119" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="139" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="159" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="179" y="20" width="8" height="8" rx="4" fill="white"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37258 0 0 5.37259 0 12V302C0 308.627 5.37259 314 12 314H383C389.627 314 395 308.627 395 302V12C395 5.37258 389.627 0 383 0H12ZM112 44C119.732 44 126 50.268 126 58V292C126 299.732 119.732 306 112 306H20C12.268 306 6 299.732 6 292V58C6 50.268 12.268 44 20 44H112Z" fill="black" fill-opacity="0.35"/>\n</svg>\n';
const _sfc_main$1 = {
  name: "NcContent",
  components: {
    NcButton,
    NcIconSvgWrapper,
    Teleport: Portal
  },
  provide() {
    return {
      "NcContent:setHasAppNavigation": this.setAppNavigation,
      "NcContent:selector": "#content-vue"
    };
  },
  props: {
    appName: {
      type: String,
      required: true
    }
  },
  setup() {
    const isMobile = useIsMobile();
    return {
      isMobile
    };
  },
  data() {
    return {
      hasAppNavigation: false,
      currentFocus: ""
      // unknown
    };
  },
  computed: {
    currentImage() {
      if (this.currentFocus === "navigation") {
        return navigationSvg;
      }
      return contentSvg;
    }
  },
  beforeMount() {
    const container = document.getElementById("skip-actions");
    if (container) {
      container.innerHTML = "";
      container.classList.add("vue-skip-actions");
    }
  },
  methods: {
    t,
    openAppNavigation() {
      emit("toggle-navigation", { open: true });
      this.$nextTick(() => {
        window.location.hash = "app-navigation-vue";
        document.getElementById("app-navigation-vue").focus();
      });
    },
    setAppNavigation(value) {
      this.hasAppNavigation = value;
      if (this.currentFocus === "") {
        this.currentFocus = "navigation";
      }
    }
  }
};
var _sfc_render$1 = function render8() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { class: ["content", "app-".concat(_vm.appName.toLowerCase())], attrs: { "id": "content-vue" } }, [_c("Teleport", { attrs: { "selector": "#skip-actions" } }, [_c("div", { staticClass: "vue-skip-actions__container" }, [_c("div", { staticClass: "vue-skip-actions__headline" }, [_vm._v(" " + _vm._s(_vm.t("Keyboard navigation help")) + " ")]), _c("div", { staticClass: "vue-skip-actions__buttons" }, [_c("NcButton", { directives: [{ name: "show", rawName: "v-show", value: _vm.hasAppNavigation, expression: "hasAppNavigation" }], attrs: { "type": "tertiary", "href": "#app-navigation-vue" }, on: { "click": function($event) {
    $event.preventDefault();
    return _vm.openAppNavigation.apply(null, arguments);
  }, "focusin": function($event) {
    _vm.currentFocus = "navigation";
  }, "mouseover": function($event) {
    _vm.currentFocus = "navigation";
  } } }, [_vm._v(" " + _vm._s(_vm.t("Skip to app navigation")) + " ")]), _c("NcButton", { attrs: { "type": "tertiary", "href": "#app-content-vue" }, on: { "focusin": function($event) {
    _vm.currentFocus = "content";
  }, "mouseover": function($event) {
    _vm.currentFocus = "content";
  } } }, [_vm._v(" " + _vm._s(_vm.t("Skip to main content")) + " ")])], 1), _c("NcIconSvgWrapper", { directives: [{ name: "show", rawName: "v-show", value: !_vm.isMobile, expression: "!isMobile" }], staticClass: "vue-skip-actions__image", attrs: { "svg": _vm.currentImage, "size": "auto" } })], 1), _vm._v("  ")]), _vm._t("default")], 2);
};
var _sfc_staticRenderFns$1 = [];
var __component__$1 = /* @__PURE__ */ normalizeComponent$2(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "d8f0539f"
);
const NcContent = __component__$1.exports;
const UploadStep = {
  NONE: "none",
  ENCRYPTING: "encrypting",
  UPLOADING: "uploading",
  UPLOADED: "uploaded",
  UPLOADING_METADATA: "uploading_metadata",
  DONE: "done"
};
const _sfc_main = {
  name: "FileDrop",
  components: {
    NcContent,
    NcAppContent,
    NcLoadingIcon,
    IconCheck,
    IconAlertCircle
  },
  data() {
    return {
      /** @type {string} */
      shareToken: loadState("end_to_end_encryption", "token"),
      /** @type {number} */
      folderId: loadState("end_to_end_encryption", "fileId"),
      /** @type {{[userId: string]: string}} */
      publicKeys: loadState("end_to_end_encryption", "publicKeys"),
      /** @type {string} */
      fileName: loadState("end_to_end_encryption", "fileName"),
      /** @type {1|2} */
      encryptionVersion: Number.parseInt(loadState("end_to_end_encryption", "encryptionVersion")),
      /** @type {{file: File, step: string, error: boolean}[]} */
      uploadedFiles: [],
      loading: false,
      UploadStep,
      highlightDropZone: false
    };
  },
  methods: {
    /**
     * @param {DragEvent} event
     */
    handleDragOver(event) {
      var _a;
      if (!((_a = event.dataTransfer) == null ? void 0 : _a.types.includes("Files"))) {
        return;
      }
      event.dataTransfer.dropEffect = "copy";
      this.highlightDropZone = true;
    },
    /**
     * @param {DragEvent} event
     */
    handleDrop(event) {
      var _a;
      if (!((_a = event.dataTransfer) == null ? void 0 : _a.types.includes("Files"))) {
        return;
      }
      this.filesChange(event.dataTransfer.files);
      this.highlightDropZone = false;
    },
    /**
     * @param {FileList?} fileList
     */
    async filesChange(fileList) {
      if (!(fileList == null ? void 0 : fileList.length)) {
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      let progresses = [];
      try {
        progresses = await Promise.all(
          Array.from(fileList).map((file) => this.uploadFile(file))
        );
        logger.debug("[FileDrop] Files uploaded", { progresses });
      } catch (exception) {
        logger.error("[FileDrop] Error while uploading files", { exception });
        showError(this.t("end_to_end_encryption", "Error while uploading files"));
        progresses.forEach((progress) => {
          progress.error = true;
        });
      }
      try {
        progresses.filter(({ error }) => !error).forEach((progress) => {
          progress.step = UploadStep.UPLOADING_METADATA;
        });
        const fileDrops = progresses.filter(({ error }) => !error).reduce((fileDropEntries, { fileDrop }) => __spreadValues(__spreadValues({}, fileDropEntries), fileDrop), {});
        logger.debug("[FileDrop] FileDrop entries computed", { fileDrops });
        await uploadFileDrop(this.encryptionVersion, this.folderId, fileDrops, this.shareToken);
      } catch (exception) {
        logger.error("[FileDrop] Error while uploading metadata", { exception });
        showError(this.t("end_to_end_encryption", "Error while uploading metadata"));
        progresses.forEach((progress) => {
          progress.error = true;
        });
      }
      progresses.filter(({ error }) => !error).forEach((progress) => {
        progress.step = UploadStep.DONE;
      });
      this.loading = false;
    },
    /**
     * @param {File} unencryptedFile
     * @return {Promise<UploadProgress>}
     */
    async uploadFile(unencryptedFile) {
      const progress = { file: unencryptedFile, step: UploadStep.NONE, error: false, fileDrop: {} };
      this.uploadedFiles.push(progress);
      try {
        progress.step = UploadStep.ENCRYPTING;
        const { encryptedFileContent, encryptionInfo } = await encryptFile(unencryptedFile);
        const encryptedFileName = v4().replaceAll("-", "");
        progress.fileDrop[encryptedFileName] = await getFileDropEntry(encryptionInfo, this.publicKeys);
        logger.debug("[FileDrop] Filedrop entry computed: ".concat(unencryptedFile.name), { fileDropEntry: progress.fileDrop[encryptedFileName] });
        progress.step = UploadStep.UPLOADING;
        await uploadFile("/public.php/dav/files/".concat(this.shareToken), encryptedFileName, encryptedFileContent, this.shareToken);
        progress.step = UploadStep.UPLOADED;
        logger.debug("[FileDrop] File uploaded: ".concat(unencryptedFile.name), { encryptedFileContent, encryptionInfo, encryptedFileName, shareToken: this.shareToken });
      } catch (exception) {
        progress.error = true;
        logger.error("[FileDrop] Fail to upload the file (".concat(progress.step, ")"), { exception });
      }
      return progress;
    },
    t: translate
  }
};
var _sfc_render = function render9() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcContent", { attrs: { "app-name": "end_to_end_encryption" } }, [_c("NcAppContent", { nativeOn: { "drop": function($event) {
    $event.preventDefault();
    return _vm.handleDrop.apply(null, arguments);
  }, "dragover": function($event) {
    $event.preventDefault();
    return _vm.handleDragOver.apply(null, arguments);
  }, "dragleave": function($event) {
    _vm.highlightDropZone = false;
  } } }, [_c("div", { staticClass: "uploader-form", class: { highlight: _vm.highlightDropZone } }, [_c("div", { staticClass: "uploader-form__label" }, [_c("div", { staticClass: "uploader-form__icon icon-folder" }), _vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "Upload encrypted files to {fileName}", { fileName: _vm.fileName })) + " "), _c("label", { staticClass: "uploader-form__input button primary", class: { loading: _vm.loading } }, [_vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "Select or drop files")) + " "), _c("input", { attrs: { "type": "file", "multiple": "", "disabled": _vm.loading }, on: { "change": function($event) {
    var _a;
    return _vm.filesChange((_a = $event.target) == null ? void 0 : _a.files);
  } } })])]), _c("ul", { staticClass: "uploader-form__file-list" }, _vm._l(_vm.uploadedFiles, function({ file, step, error }, index) {
    return _c("li", { key: index, staticClass: "uploader-form__file-list__item" }, [error ? _c("IconAlertCircle", { attrs: { "size": 20 } }) : step === _vm.UploadStep.DONE ? _c("IconCheck", { attrs: { "size": 20 } }) : _c("NcLoadingIcon"), _c("b", [_vm._v(_vm._s(file.name))])], 1);
  }), 0)])])], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "e15028e4"
);
__component__.options.__file = "/home/louis/workspace/nextcloud/instances/master/apps-extra/end_to_end_encryption/src/views/FileDrop.vue";
const FileDrop = __component__.exports;
const View = Vue.extend(FileDrop);
new View({}).$mount("#content");
//# sourceMappingURL=end_to_end_encryption-filedrop.mjs.map
