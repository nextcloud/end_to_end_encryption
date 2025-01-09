(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode("/*!\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n.toastify.dialogs {\n  min-width: 200px;\n  background: none;\n  background-color: var(--color-main-background);\n  color: var(--color-main-text);\n  box-shadow: 0 0 6px 0 var(--color-box-shadow);\n  padding: 0 12px;\n  margin-top: 45px;\n  position: fixed;\n  z-index: 10100;\n  border-radius: var(--border-radius);\n  display: flex;\n  align-items: center;\n}\n.toastify.dialogs .toast-undo-container {\n  display: flex;\n  align-items: center;\n}\n.toastify.dialogs .toast-undo-button,\n.toastify.dialogs .toast-close {\n  position: static;\n  overflow: hidden;\n  box-sizing: border-box;\n  min-width: 44px;\n  height: 100%;\n  padding: 12px;\n  white-space: nowrap;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-color: transparent;\n  min-height: 0;\n}\n.toastify.dialogs .toast-undo-button.toast-close,\n.toastify.dialogs .toast-close.toast-close {\n  text-indent: 0;\n  opacity: 0.4;\n  border: none;\n  min-height: 44px;\n  margin-left: 10px;\n  font-size: 0;\n  /* dark theme overrides for Nextcloud 25 and later */\n}\n.toastify.dialogs .toast-undo-button.toast-close::before,\n.toastify.dialogs .toast-close.toast-close::before {\n  background-image: url(\"data:image/svg+xml,%3csvg%20viewBox='0%200%2016%2016'%20height='16'%20width='16'%20xmlns='http://www.w3.org/2000/svg'%20xml:space='preserve'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2'%3e%3cpath%20d='M6.4%2019%205%2017.6l5.6-5.6L5%206.4%206.4%205l5.6%205.6L17.6%205%2019%206.4%2013.4%2012l5.6%205.6-1.4%201.4-5.6-5.6L6.4%2019Z'%20style='fill-rule:nonzero'%20transform='matrix(.85714%200%200%20.85714%20-2.286%20-2.286)'/%3e%3c/svg%3e\");\n  content: \" \";\n  filter: var(--background-invert-if-dark);\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n}\n.toastify.dialogs .toast-undo-button.toast-undo-button,\n.toastify.dialogs .toast-close.toast-undo-button {\n  margin: 3px;\n  height: calc(100% - 2 * 3px);\n  margin-left: 12px;\n}\n.toastify.dialogs .toast-undo-button:hover, .toastify.dialogs .toast-undo-button:focus, .toastify.dialogs .toast-undo-button:active,\n.toastify.dialogs .toast-close:hover,\n.toastify.dialogs .toast-close:focus,\n.toastify.dialogs .toast-close:active {\n  cursor: pointer;\n  opacity: 1;\n}\n.toastify.dialogs.toastify-top {\n  right: 10px;\n}\n.toastify.dialogs.toast-with-click {\n  cursor: pointer;\n}\n.toastify.dialogs.toast-error {\n  border-left: 3px solid var(--color-error);\n}\n.toastify.dialogs.toast-info {\n  border-left: 3px solid var(--color-primary);\n}\n.toastify.dialogs.toast-warning {\n  border-left: 3px solid var(--color-warning);\n}\n.toastify.dialogs.toast-success {\n  border-left: 3px solid var(--color-success);\n}\n.toastify.dialogs.toast-undo {\n  border-left: 3px solid var(--color-success);\n}\n\n/* dark theme overrides for Nextcloud 24 and earlier */\n.theme--dark .toastify.dialogs .toast-close {\n  /* close icon style */\n}\n.theme--dark .toastify.dialogs .toast-close.toast-close::before {\n  background-image: url(\"data:image/svg+xml,%3csvg%20viewBox='0%200%2016%2016'%20height='16'%20width='16'%20xmlns='http://www.w3.org/2000/svg'%20xml:space='preserve'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2'%3e%3cpath%20d='M6.4%2019%205%2017.6l5.6-5.6L5%206.4%206.4%205l5.6%205.6L17.6%205%2019%206.4%2013.4%2012l5.6%205.6-1.4%201.4-5.6-5.6L6.4%2019Z'%20style='fill:%23fff;fill-rule:nonzero'%20transform='matrix(.85714%200%200%20.85714%20-2.286%20-2.286)'/%3e%3c/svg%3e\");\n}\n.nc-generic-dialog .dialog__actions {\n	justify-content: space-between;\n	min-width: calc(100% - 12px);\n}\n/*!\n * SPDX-FileCopyrightText: 2023-2024 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * Icon styling of the file list row preview or fallback icon\n * (leading icon on the name row and header)\n */\n._file-picker__file-icon_19mjt_9 {\n  width: 32px;\n  height: 32px;\n  min-width: 32px;\n  min-height: 32px;\n  background-repeat: no-repeat;\n  background-size: contain;\n  display: flex;\n  justify-content: center;\n}/*!\n * SPDX-FileCopyrightText: 2023-2024 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\ntr.file-picker__row[data-v-15187afc] {\n  height: var(--row-height, 50px);\n}\ntr.file-picker__row td[data-v-15187afc] {\n  cursor: pointer;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  border-bottom: none;\n}\ntr.file-picker__row td.row-checkbox[data-v-15187afc] {\n  padding: 0 2px;\n}\ntr.file-picker__row td[data-v-15187afc]:not(.row-checkbox) {\n  padding-inline: 14px 0;\n}\ntr.file-picker__row td.row-size[data-v-15187afc] {\n  text-align: end;\n  padding-inline: 0 14px;\n}\ntr.file-picker__row td.row-name[data-v-15187afc] {\n  padding-inline: 2px 0;\n}\n@keyframes gradient-15187afc {\n0% {\n    background-position: 0% 50%;\n}\n50% {\n    background-position: 100% 50%;\n}\n100% {\n    background-position: 0% 50%;\n}\n}\n.loading-row .row-checkbox[data-v-15187afc] {\n  text-align: center !important;\n}\n.loading-row span[data-v-15187afc] {\n  display: inline-block;\n  height: 24px;\n  background: linear-gradient(to right, var(--color-background-darker), var(--color-text-maxcontrast), var(--color-background-darker));\n  background-size: 600px 100%;\n  border-radius: var(--border-radius);\n  animation: gradient-15187afc 12s ease infinite;\n}\n.loading-row .row-wrapper[data-v-15187afc] {\n  display: inline-flex;\n  align-items: center;\n}\n.loading-row .row-checkbox span[data-v-15187afc] {\n  width: 24px;\n}\n.loading-row .row-name span[data-v-15187afc]:last-of-type {\n  margin-inline-start: 6px;\n  width: 130px;\n}\n.loading-row .row-size span[data-v-15187afc] {\n  width: 80px;\n}\n.loading-row .row-modified span[data-v-15187afc] {\n  width: 90px;\n}/*!\n * SPDX-FileCopyrightText: 2023-2024 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\ntr.file-picker__row[data-v-cb12dccb] {\n  height: var(--row-height, 50px);\n}\ntr.file-picker__row td[data-v-cb12dccb] {\n  cursor: pointer;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  border-bottom: none;\n}\ntr.file-picker__row td.row-checkbox[data-v-cb12dccb] {\n  padding: 0 2px;\n}\ntr.file-picker__row td[data-v-cb12dccb]:not(.row-checkbox) {\n  padding-inline: 14px 0;\n}\ntr.file-picker__row td.row-size[data-v-cb12dccb] {\n  text-align: end;\n  padding-inline: 0 14px;\n}\ntr.file-picker__row td.row-name[data-v-cb12dccb] {\n  padding-inline: 2px 0;\n}\n.file-picker__row--selected[data-v-cb12dccb] {\n  background-color: var(--color-background-dark);\n}\n.file-picker__row[data-v-cb12dccb]:hover {\n  background-color: var(--color-background-hover);\n}\n.file-picker__name-container[data-v-cb12dccb] {\n  display: flex;\n  justify-content: start;\n  align-items: center;\n  height: 100%;\n}\n.file-picker__file-name[data-v-cb12dccb] {\n  padding-inline-start: 6px;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.file-picker__file-extension[data-v-cb12dccb] {\n  color: var(--color-text-maxcontrast);\n  min-width: fit-content;\n}.file-picker__header-preview[data-v-006fdbd0] {\n  width: 22px;\n  height: 32px;\n  flex: 0 0 auto;\n}\n.file-picker__files[data-v-006fdbd0] {\n  margin: 2px;\n  margin-inline-start: 12px;\n  overflow: scroll auto;\n}\n.file-picker__files table[data-v-006fdbd0] {\n  width: 100%;\n  max-height: 100%;\n  table-layout: fixed;\n}\n.file-picker__files th[data-v-006fdbd0] {\n  position: sticky;\n  z-index: 1;\n  top: 0;\n  background-color: var(--color-main-background);\n  padding: 2px;\n}\n.file-picker__files th .header-wrapper[data-v-006fdbd0] {\n  display: flex;\n}\n.file-picker__files th.row-checkbox[data-v-006fdbd0] {\n  width: 44px;\n}\n.file-picker__files th.row-name[data-v-006fdbd0] {\n  width: 230px;\n}\n.file-picker__files th.row-size[data-v-006fdbd0] {\n  width: 100px;\n}\n.file-picker__files th.row-modified[data-v-006fdbd0] {\n  width: 120px;\n}\n.file-picker__files th[data-v-006fdbd0]:not(.row-size) .button-vue__wrapper {\n  justify-content: start;\n  flex-direction: row-reverse;\n}\n.file-picker__files th[data-v-006fdbd0]:not(.row-size) .button-vue {\n  padding-inline: 16px 4px;\n}\n.file-picker__files th.row-size[data-v-006fdbd0] .button-vue__wrapper {\n  justify-content: end;\n}\n.file-picker__files th[data-v-006fdbd0] .button-vue__wrapper {\n  color: var(--color-text-maxcontrast);\n}\n.file-picker__files th[data-v-006fdbd0] .button-vue__wrapper .button-vue__text {\n  font-weight: normal;\n}.file-picker__breadcrumbs[data-v-b357227a] {\n  flex-grow: 0 !important;\n}.file-picker__side[data-v-b42054b8] {\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  gap: 0.5rem;\n  min-width: 200px;\n  padding: 2px;\n  margin-block-start: 7px;\n  overflow: auto;\n}\n.file-picker__side[data-v-b42054b8] .button-vue__wrapper {\n  justify-content: start;\n}\n.file-picker__filter-input[data-v-b42054b8] {\n  margin-block: 7px;\n  max-width: 260px;\n}\n@media (max-width: 736px) {\n.file-picker__side[data-v-b42054b8] {\n    flex-direction: row;\n    min-width: unset;\n}\n}\n@media (max-width: 512px) {\n.file-picker__side[data-v-b42054b8] {\n    flex-direction: row;\n    min-width: unset;\n}\n.file-picker__filter-input[data-v-b42054b8] {\n    max-width: unset;\n}\n}/* Ensure focus outline is visible */\n.file-picker__navigation {\n  padding-inline: 8px 2px;\n}\n.file-picker__navigation, .file-picker__navigation * {\n  box-sizing: border-box;\n}\n.file-picker__navigation .v-select.select {\n  min-width: 220px;\n}\n@media (min-width: 513px) and (max-width: 736px) {\n.file-picker__navigation {\n    gap: 11px;\n}\n}\n@media (max-width: 512px) {\n.file-picker__navigation {\n    flex-direction: column-reverse !important;\n}\n}.file-picker__view[data-v-20b719ba] {\n  height: 50px;\n  display: flex;\n  justify-content: start;\n  align-items: center;\n}\n.file-picker__view h3[data-v-20b719ba] {\n  font-weight: bold;\n  height: fit-content;\n  margin: 0;\n}\n.file-picker__main[data-v-20b719ba] {\n  box-sizing: border-box;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  flex: 1;\n  padding-inline: 2px;\n}\n.file-picker__main *[data-v-20b719ba] {\n  box-sizing: border-box;\n}\n[data-v-20b719ba] .file-picker {\n  height: min(80vh, 800px) !important;\n}\n@media (max-width: 512px) {\n[data-v-20b719ba] .file-picker {\n    height: calc(100% - 16px - var(--default-clickable-area)) !important;\n}\n}\n[data-v-20b719ba] .file-picker__content {\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-e4fac465] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.input-field[data-v-e4fac465] {\n  --input-border-radius: var(--border-radius-element, var(--border-radius-large));\n  --input-padding-start: var(--border-radius-large);\n  --input-padding-end: var(--border-radius-large);\n  position: relative;\n  width: 100%;\n  margin-block-start: 6px;\n}\n.input-field--disabled[data-v-e4fac465] {\n  opacity: 0.4;\n  filter: saturate(0.4);\n}\n.input-field--label-outside[data-v-e4fac465] {\n  margin-block-start: 0;\n}\n.input-field--leading-icon[data-v-e4fac465] {\n  --input-padding-start: calc(var(--default-clickable-area) - var(--default-grid-baseline));\n}\n.input-field--trailing-icon[data-v-e4fac465] {\n  --input-padding-end: calc(var(--default-clickable-area) - var(--default-grid-baseline));\n}\n.input-field--pill[data-v-e4fac465] {\n  --input-border-radius: var(--border-radius-pill);\n}\n.input-field__main-wrapper[data-v-e4fac465] {\n  height: var(--default-clickable-area);\n  position: relative;\n}\n.input-field__input[data-v-e4fac465] {\n  --input-border-width-offset: calc(var(--border-width-input-focused, 2px) - var(--border-width-input, 2px));\n  background-color: var(--color-main-background);\n  color: var(--color-main-text);\n  border: var(--border-width-input, 2px) solid var(--color-border-maxcontrast);\n  border-radius: var(--input-border-radius);\n  cursor: pointer;\n  -webkit-appearance: textfield !important;\n  -moz-appearance: textfield !important;\n  appearance: textfield !important;\n  font-size: var(--default-font-size);\n  text-overflow: ellipsis;\n  height: calc(var(--default-clickable-area) - 2 * var(--input-border-width-offset)) !important;\n  width: 100%;\n  padding-inline: calc(var(--input-padding-start) + var(--input-border-width-offset)) calc(var(--input-padding-end) + var(--input-border-width-offset));\n  padding-block: var(--input-border-width-offset);\n}\n.input-field__input[data-v-e4fac465]::placeholder {\n  color: var(--color-text-maxcontrast);\n}\n.input-field__input[data-v-e4fac465]:active:not([disabled]), .input-field__input[data-v-e4fac465]:hover:not([disabled]), .input-field__input[data-v-e4fac465]:focus:not([disabled]) {\n  border-color: var(--color-main-text);\n  border-width: var(--border-width-input-focused, 2px);\n  box-shadow: 0 0 0 2px var(--color-main-background) !important;\n  --input-border-width-offset: 0px;\n}\n.input-field__input:focus + .input-field__label[data-v-e4fac465], .input-field__input:hover:not(:placeholder-shown) + .input-field__label[data-v-e4fac465] {\n  color: var(--color-main-text);\n}\n.input-field__input[data-v-e4fac465]:focus {\n  cursor: text;\n}\n.input-field__input[data-v-e4fac465]:disabled {\n  cursor: default;\n}\n.input-field__input[data-v-e4fac465]:focus-visible {\n  box-shadow: unset !important;\n}\n.input-field__input--success[data-v-e4fac465] {\n  border-color: var(--color-success) !important;\n}\n.input-field__input--success[data-v-e4fac465]:focus-visible {\n  box-shadow: rgb(248, 250, 252) 0px 0px 0px 2px, var(--color-primary-element) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;\n}\n.input-field__input--error[data-v-e4fac465], .input-field__input[data-v-e4fac465]:invalid {\n  border-color: var(--color-error) !important;\n}\n.input-field__input--error[data-v-e4fac465]:focus-visible, .input-field__input[data-v-e4fac465]:invalid:focus-visible {\n  box-shadow: rgb(248, 250, 252) 0px 0px 0px 2px, var(--color-primary-element) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;\n}\n.input-field:not(.input-field--label-outside) .input-field__input[data-v-e4fac465]:not(:focus)::placeholder {\n  opacity: 0;\n}\n.input-field__label[data-v-e4fac465] {\n  --input-label-font-size: var(--default-font-size);\n  position: absolute;\n  margin-inline: var(--input-padding-start) var(--input-padding-end);\n  max-width: fit-content;\n  font-size: var(--input-label-font-size);\n  inset-block-start: calc((var(--default-clickable-area) - 1lh) / 2);\n  inset-inline: var(--border-width-input-focused, 2px);\n  color: var(--color-text-maxcontrast);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  pointer-events: none;\n  transition: height var(--animation-quick), inset-block-start var(--animation-quick), font-size var(--animation-quick), color var(--animation-quick), background-color var(--animation-quick) var(--animation-slow);\n}\n.input-field__input:focus + .input-field__label[data-v-e4fac465], .input-field__input:not(:placeholder-shown) + .input-field__label[data-v-e4fac465] {\n  --input-label-font-size: 13px;\n  line-height: 1.5;\n  inset-block-start: calc(-1.5 * var(--input-label-font-size) / 2);\n  font-weight: 500;\n  border-radius: var(--default-grid-baseline) var(--default-grid-baseline) 0 0;\n  background-color: var(--color-main-background);\n  padding-inline: var(--default-grid-baseline);\n  margin-inline: calc(var(--input-padding-start) - var(--default-grid-baseline)) calc(var(--input-padding-end) - var(--default-grid-baseline));\n  transition: height var(--animation-quick), inset-block-start var(--animation-quick), font-size var(--animation-quick), color var(--animation-quick);\n}\n.input-field__icon[data-v-e4fac465] {\n  position: absolute;\n  height: var(--default-clickable-area);\n  width: var(--default-clickable-area);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  opacity: 0.7;\n  inset-block-end: 0;\n}\n.input-field__icon--leading[data-v-e4fac465] {\n  inset-inline-start: 0px;\n}\n.input-field__icon--trailing[data-v-e4fac465] {\n  inset-inline-end: 0px;\n}\n.input-field__trailing-button[data-v-e4fac465] {\n  --button-size: calc(var(--default-clickable-area) - 2 * var(--border-width-input-focused, 2px)) !important;\n  --button-radius: calc(var(--input-border-radius) - var(--border-width-input-focused, 2px));\n}\n.input-field__trailing-button.button-vue[data-v-e4fac465] {\n  position: absolute;\n  top: var(--border-width-input-focused, 2px);\n  inset-inline-end: var(--border-width-input-focused, 2px);\n}\n.input-field__trailing-button.button-vue[data-v-e4fac465]:focus-visible {\n  box-shadow: none !important;\n}\n.input-field__helper-text-message[data-v-e4fac465] {\n  padding-block: 4px;\n  padding-inline: var(--border-radius-large);\n  display: flex;\n  align-items: center;\n  color: var(--color-text-maxcontrast);\n}\n.input-field__helper-text-message__icon[data-v-e4fac465] {\n  margin-inline-end: 8px;\n}\n.input-field__helper-text-message--error[data-v-e4fac465] {\n  color: var(--color-error-text);\n}\n.input-field__helper-text-message--success[data-v-e4fac465] {\n  color: var(--color-success-text);\n}"));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _t2, _e2, _n, _r, _o, _i, _s, _a2, _u, _c, _l, _vt_instances, h_fn, _vt_static, p_fn, d_fn, f_fn;
const appName = "end_to_end_encryption";
const appVersion = "1.17.0-beta.2";
import { p as process$1, g as global, l as loadState, a as getLoggerBuilder, b as getCurrentUser, U as U$1, o as onRequestTokenUpdate, c as getRequestToken, d as cancelableClient, v as v$1, n as normalizeComponent, N as NcButton, G as GenRandomId, r as register, C as Close, t as t$1, e as t48, f as t17, h as defineComponent, i as ref$1, j as computed, k as translate, m as NcDialog, q as NcNoteCard, s as normalizeComponent$1, u as spawnDialog, w as pathBrowserify } from "./_plugin-vue2_normalizer-BdKAaywK.chunk.mjs";
import { f as fromBER, B as BufferSourceConverter, s as stringToArrayBuffer, a as arrayBufferToString, O as OctetString$1, N as Null, I as Integer, S as Sequence, g as getParametersValue, A as Any, b as ObjectIdentifier, c as clearProps, d as compareSchema, e as BitString$1, C as Constructed, R as Repeated, h as Choice, P as Primitive, i as Convert, j as Set$1, G as GeneralizedTime, k as Boolean$1, u as utilConcatBuf, l as isEqualBuffer, m as RawData, t as toBase64, n as fromBase64, o as nearestPowerOf2, p as utilFromBase, q as utilToBase, r as bufferToHexCodes, E as Enumerated, U as UTCTime, v as Utf8String, w as BmpString, x as UniversalString, y as NumericString, z as PrintableString, T as TeletexString, V as VideotexString, D as IA5String, F as GraphicString, H as VisibleString, J as GeneralString, K as CharacterString, X as X509Certificate, L as ArrowRight } from "./ArrowRight-CY2b9hgN-T6xkfnFS.chunk.mjs";
import { u as useModelMigration } from "./useModelMigration-EhAWvqDD-BpHklyZH.chunk.mjs";
import { N as NcCheckboxRadioSwitch } from "./NcCheckboxRadioSwitch-R1y0mLbC-PPdao6TU.chunk.mjs";
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
var toStringTag = typeof Symbol !== "undefined" ? Symbol.toStringTag : "@@toStringTag";
var _internals = /* @__PURE__ */ new WeakMap();
var _promise = /* @__PURE__ */ new WeakMap();
class CancelablePromiseInternal {
  constructor(_ref) {
    var {
      executor = () => {
      },
      internals = defaultInternals(),
      promise = new Promise((resolve2, reject2) => executor(resolve2, reject2, (onCancel) => {
        internals.onCancelList.push(onCancel);
      }))
    } = _ref;
    _classPrivateFieldInitSpec(this, _internals, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _promise, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, toStringTag, "CancelablePromise");
    this.cancel = this.cancel.bind(this);
    _classPrivateFieldSet(this, _internals, internals);
    _classPrivateFieldSet(this, _promise, promise || new Promise((resolve2, reject2) => executor(resolve2, reject2, (onCancel) => {
      internals.onCancelList.push(onCancel);
    })));
  }
  then(onfulfilled, onrejected) {
    return makeCancelable(_classPrivateFieldGet(this, _promise).then(createCallback(onfulfilled, _classPrivateFieldGet(this, _internals)), createCallback(onrejected, _classPrivateFieldGet(this, _internals))), _classPrivateFieldGet(this, _internals));
  }
  catch(onrejected) {
    return makeCancelable(_classPrivateFieldGet(this, _promise).catch(createCallback(onrejected, _classPrivateFieldGet(this, _internals))), _classPrivateFieldGet(this, _internals));
  }
  finally(onfinally, runWhenCanceled) {
    if (runWhenCanceled) {
      _classPrivateFieldGet(this, _internals).onCancelList.push(onfinally);
    }
    return makeCancelable(_classPrivateFieldGet(this, _promise).finally(createCallback(() => {
      if (onfinally) {
        if (runWhenCanceled) {
          _classPrivateFieldGet(this, _internals).onCancelList = _classPrivateFieldGet(this, _internals).onCancelList.filter((callback) => callback !== onfinally);
        }
        return onfinally();
      }
    }, _classPrivateFieldGet(this, _internals))), _classPrivateFieldGet(this, _internals));
  }
  cancel() {
    _classPrivateFieldGet(this, _internals).isCanceled = true;
    var callbacks = _classPrivateFieldGet(this, _internals).onCancelList;
    _classPrivateFieldGet(this, _internals).onCancelList = [];
    for (var callback of callbacks) {
      if (typeof callback === "function") {
        try {
          callback();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  isCanceled() {
    return _classPrivateFieldGet(this, _internals).isCanceled === true;
  }
}
class CancelablePromise extends CancelablePromiseInternal {
  constructor(executor) {
    super({
      executor
    });
  }
}
_defineProperty(CancelablePromise, "all", function all(iterable) {
  return makeAllCancelable(iterable, Promise.all(iterable));
});
_defineProperty(CancelablePromise, "allSettled", function allSettled(iterable) {
  return makeAllCancelable(iterable, Promise.allSettled(iterable));
});
_defineProperty(CancelablePromise, "any", function any(iterable) {
  return makeAllCancelable(iterable, Promise.any(iterable));
});
_defineProperty(CancelablePromise, "race", function race(iterable) {
  return makeAllCancelable(iterable, Promise.race(iterable));
});
_defineProperty(CancelablePromise, "resolve", function resolve(value) {
  return cancelable(Promise.resolve(value));
});
_defineProperty(CancelablePromise, "reject", function reject(reason) {
  return cancelable(Promise.reject(reason));
});
_defineProperty(CancelablePromise, "isCancelable", isCancelablePromise);
function cancelable(promise) {
  return makeCancelable(promise, defaultInternals());
}
function isCancelablePromise(promise) {
  return promise instanceof CancelablePromise || promise instanceof CancelablePromiseInternal;
}
function createCallback(onResult, internals) {
  if (onResult) {
    return (arg) => {
      if (!internals.isCanceled) {
        var result = onResult(arg);
        if (isCancelablePromise(result)) {
          internals.onCancelList.push(result.cancel);
        }
        return result;
      }
      return arg;
    };
  }
}
function makeCancelable(promise, internals) {
  return new CancelablePromiseInternal({
    internals,
    promise
  });
}
function makeAllCancelable(iterable, promise) {
  var internals = defaultInternals();
  internals.onCancelList.push(() => {
    for (var resolvable of iterable) {
      if (isCancelablePromise(resolvable)) {
        resolvable.cancel();
      }
    }
  });
  return new CancelablePromiseInternal({
    internals,
    promise
  });
}
function defaultInternals() {
  return {
    isCanceled: false,
    onCancelList: []
  };
}
var define_process_env_default$1 = {};
/*! For license information please see index.js.LICENSE.txt */
var t = { 2: (t2) => {
  function e2(t3, e3, o2) {
    t3 instanceof RegExp && (t3 = n2(t3, o2)), e3 instanceof RegExp && (e3 = n2(e3, o2));
    var i2 = r2(t3, e3, o2);
    return i2 && { start: i2[0], end: i2[1], pre: o2.slice(0, i2[0]), body: o2.slice(i2[0] + t3.length, i2[1]), post: o2.slice(i2[1] + e3.length) };
  }
  function n2(t3, e3) {
    var n3 = e3.match(t3);
    return n3 ? n3[0] : null;
  }
  function r2(t3, e3, n3) {
    var r3, o2, i2, s2, a2, u2 = n3.indexOf(t3), c2 = n3.indexOf(e3, u2 + 1), l2 = u2;
    if (u2 >= 0 && c2 > 0) {
      for (r3 = [], i2 = n3.length; l2 >= 0 && !a2; ) l2 == u2 ? (r3.push(l2), u2 = n3.indexOf(t3, l2 + 1)) : 1 == r3.length ? a2 = [r3.pop(), c2] : ((o2 = r3.pop()) < i2 && (i2 = o2, s2 = c2), c2 = n3.indexOf(e3, l2 + 1)), l2 = u2 < c2 && u2 >= 0 ? u2 : c2;
      r3.length && (a2 = [i2, s2]);
    }
    return a2;
  }
  t2.exports = e2, e2.range = r2;
}, 101: function(t2, e2, n2) {
  var r2;
  t2 = n2.nmd(t2), function(o2) {
    var i2 = (t2 && t2.exports, "object" == typeof global && global);
    i2.global !== i2 && i2.window;
    var s2 = function(t3) {
      this.message = t3;
    };
    (s2.prototype = new Error()).name = "InvalidCharacterError";
    var a2 = function(t3) {
      throw new s2(t3);
    }, u2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", c2 = /[\t\n\f\r ]/g, l2 = { encode: function(t3) {
      t3 = String(t3), /[^\0-\xFF]/.test(t3) && a2("The string to be encoded contains characters outside of the Latin1 range.");
      for (var e3, n3, r3, o3, i3 = t3.length % 3, s3 = "", c3 = -1, l3 = t3.length - i3; ++c3 < l3; ) e3 = t3.charCodeAt(c3) << 16, n3 = t3.charCodeAt(++c3) << 8, r3 = t3.charCodeAt(++c3), s3 += u2.charAt((o3 = e3 + n3 + r3) >> 18 & 63) + u2.charAt(o3 >> 12 & 63) + u2.charAt(o3 >> 6 & 63) + u2.charAt(63 & o3);
      return 2 == i3 ? (e3 = t3.charCodeAt(c3) << 8, n3 = t3.charCodeAt(++c3), s3 += u2.charAt((o3 = e3 + n3) >> 10) + u2.charAt(o3 >> 4 & 63) + u2.charAt(o3 << 2 & 63) + "=") : 1 == i3 && (o3 = t3.charCodeAt(c3), s3 += u2.charAt(o3 >> 2) + u2.charAt(o3 << 4 & 63) + "=="), s3;
    }, decode: function(t3) {
      var e3 = (t3 = String(t3).replace(c2, "")).length;
      e3 % 4 == 0 && (e3 = (t3 = t3.replace(/==?$/, "")).length), (e3 % 4 == 1 || /[^+a-zA-Z0-9/]/.test(t3)) && a2("Invalid character: the string to be decoded is not correctly encoded.");
      for (var n3, r3, o3 = 0, i3 = "", s3 = -1; ++s3 < e3; ) r3 = u2.indexOf(t3.charAt(s3)), n3 = o3 % 4 ? 64 * n3 + r3 : r3, o3++ % 4 && (i3 += String.fromCharCode(255 & n3 >> (-2 * o3 & 6)));
      return i3;
    }, version: "1.0.0" };
    void 0 === (r2 = function() {
      return l2;
    }.call(e2, n2, e2, t2)) || (t2.exports = r2);
  }();
}, 172: (t2, e2) => {
  e2.d = function(t3) {
    if (!t3) return 0;
    for (var e3 = (t3 = t3.toString()).length, n2 = t3.length; n2--; ) {
      var r2 = t3.charCodeAt(n2);
      56320 <= r2 && r2 <= 57343 && n2--, 127 < r2 && r2 <= 2047 ? e3++ : 2047 < r2 && r2 <= 65535 && (e3 += 2);
    }
    return e3;
  };
}, 526: (t2) => {
  var e2 = { utf8: { stringToBytes: function(t3) {
    return e2.bin.stringToBytes(unescape(encodeURIComponent(t3)));
  }, bytesToString: function(t3) {
    return decodeURIComponent(escape(e2.bin.bytesToString(t3)));
  } }, bin: { stringToBytes: function(t3) {
    for (var e3 = [], n2 = 0; n2 < t3.length; n2++) e3.push(255 & t3.charCodeAt(n2));
    return e3;
  }, bytesToString: function(t3) {
    for (var e3 = [], n2 = 0; n2 < t3.length; n2++) e3.push(String.fromCharCode(t3[n2]));
    return e3.join("");
  } } };
  t2.exports = e2;
}, 298: (t2) => {
  var e2, n2;
  e2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n2 = { rotl: function(t3, e3) {
    return t3 << e3 | t3 >>> 32 - e3;
  }, rotr: function(t3, e3) {
    return t3 << 32 - e3 | t3 >>> e3;
  }, endian: function(t3) {
    if (t3.constructor == Number) return 16711935 & n2.rotl(t3, 8) | 4278255360 & n2.rotl(t3, 24);
    for (var e3 = 0; e3 < t3.length; e3++) t3[e3] = n2.endian(t3[e3]);
    return t3;
  }, randomBytes: function(t3) {
    for (var e3 = []; t3 > 0; t3--) e3.push(Math.floor(256 * Math.random()));
    return e3;
  }, bytesToWords: function(t3) {
    for (var e3 = [], n3 = 0, r2 = 0; n3 < t3.length; n3++, r2 += 8) e3[r2 >>> 5] |= t3[n3] << 24 - r2 % 32;
    return e3;
  }, wordsToBytes: function(t3) {
    for (var e3 = [], n3 = 0; n3 < 32 * t3.length; n3 += 8) e3.push(t3[n3 >>> 5] >>> 24 - n3 % 32 & 255);
    return e3;
  }, bytesToHex: function(t3) {
    for (var e3 = [], n3 = 0; n3 < t3.length; n3++) e3.push((t3[n3] >>> 4).toString(16)), e3.push((15 & t3[n3]).toString(16));
    return e3.join("");
  }, hexToBytes: function(t3) {
    for (var e3 = [], n3 = 0; n3 < t3.length; n3 += 2) e3.push(parseInt(t3.substr(n3, 2), 16));
    return e3;
  }, bytesToBase64: function(t3) {
    for (var n3 = [], r2 = 0; r2 < t3.length; r2 += 3) for (var o2 = t3[r2] << 16 | t3[r2 + 1] << 8 | t3[r2 + 2], i2 = 0; i2 < 4; i2++) 8 * r2 + 6 * i2 <= 8 * t3.length ? n3.push(e2.charAt(o2 >>> 6 * (3 - i2) & 63)) : n3.push("=");
    return n3.join("");
  }, base64ToBytes: function(t3) {
    t3 = t3.replace(/[^A-Z0-9+\/]/gi, "");
    for (var n3 = [], r2 = 0, o2 = 0; r2 < t3.length; o2 = ++r2 % 4) 0 != o2 && n3.push((e2.indexOf(t3.charAt(r2 - 1)) & Math.pow(2, -2 * o2 + 8) - 1) << 2 * o2 | e2.indexOf(t3.charAt(r2)) >>> 6 - 2 * o2);
    return n3;
  } }, t2.exports = n2;
}, 635: (t2, e2, n2) => {
  const r2 = n2(31), o2 = n2(338), i2 = n2(221);
  t2.exports = { XMLParser: o2, XMLValidator: r2, XMLBuilder: i2 };
}, 705: (t2, e2) => {
  const n2 = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", r2 = "[" + n2 + "][" + n2 + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*", o2 = new RegExp("^" + r2 + "$");
  e2.isExist = function(t3) {
    return void 0 !== t3;
  }, e2.isEmptyObject = function(t3) {
    return 0 === Object.keys(t3).length;
  }, e2.merge = function(t3, e3, n3) {
    if (e3) {
      const r3 = Object.keys(e3), o3 = r3.length;
      for (let i2 = 0; i2 < o3; i2++) t3[r3[i2]] = "strict" === n3 ? [e3[r3[i2]]] : e3[r3[i2]];
    }
  }, e2.getValue = function(t3) {
    return e2.isExist(t3) ? t3 : "";
  }, e2.isName = function(t3) {
    return !(null == o2.exec(t3));
  }, e2.getAllMatches = function(t3, e3) {
    const n3 = [];
    let r3 = e3.exec(t3);
    for (; r3; ) {
      const o3 = [];
      o3.startIndex = e3.lastIndex - r3[0].length;
      const i2 = r3.length;
      for (let t4 = 0; t4 < i2; t4++) o3.push(r3[t4]);
      n3.push(o3), r3 = e3.exec(t3);
    }
    return n3;
  }, e2.nameRegexp = r2;
}, 31: (t2, e2, n2) => {
  const r2 = n2(705), o2 = { allowBooleanAttributes: false, unpairedTags: [] };
  function i2(t3) {
    return " " === t3 || "	" === t3 || "\n" === t3 || "\r" === t3;
  }
  function s2(t3, e3) {
    const n3 = e3;
    for (; e3 < t3.length; e3++) if ("?" != t3[e3] && " " != t3[e3]) ;
    else {
      const r3 = t3.substr(n3, e3 - n3);
      if (e3 > 5 && "xml" === r3) return d2("InvalidXml", "XML declaration allowed only at the start of the document.", m2(t3, e3));
      if ("?" == t3[e3] && ">" == t3[e3 + 1]) {
        e3++;
        break;
      }
    }
    return e3;
  }
  function a2(t3, e3) {
    if (t3.length > e3 + 5 && "-" === t3[e3 + 1] && "-" === t3[e3 + 2]) {
      for (e3 += 3; e3 < t3.length; e3++) if ("-" === t3[e3] && "-" === t3[e3 + 1] && ">" === t3[e3 + 2]) {
        e3 += 2;
        break;
      }
    } else if (t3.length > e3 + 8 && "D" === t3[e3 + 1] && "O" === t3[e3 + 2] && "C" === t3[e3 + 3] && "T" === t3[e3 + 4] && "Y" === t3[e3 + 5] && "P" === t3[e3 + 6] && "E" === t3[e3 + 7]) {
      let n3 = 1;
      for (e3 += 8; e3 < t3.length; e3++) if ("<" === t3[e3]) n3++;
      else if (">" === t3[e3] && (n3--, 0 === n3)) break;
    } else if (t3.length > e3 + 9 && "[" === t3[e3 + 1] && "C" === t3[e3 + 2] && "D" === t3[e3 + 3] && "A" === t3[e3 + 4] && "T" === t3[e3 + 5] && "A" === t3[e3 + 6] && "[" === t3[e3 + 7]) {
      for (e3 += 8; e3 < t3.length; e3++) if ("]" === t3[e3] && "]" === t3[e3 + 1] && ">" === t3[e3 + 2]) {
        e3 += 2;
        break;
      }
    }
    return e3;
  }
  e2.validate = function(t3, e3) {
    e3 = Object.assign({}, o2, e3);
    const n3 = [];
    let u3 = false, c3 = false;
    "\uFEFF" === t3[0] && (t3 = t3.substr(1));
    for (let o3 = 0; o3 < t3.length; o3++) if ("<" === t3[o3] && "?" === t3[o3 + 1]) {
      if (o3 += 2, o3 = s2(t3, o3), o3.err) return o3;
    } else {
      if ("<" !== t3[o3]) {
        if (i2(t3[o3])) continue;
        return d2("InvalidChar", "char '" + t3[o3] + "' is not expected.", m2(t3, o3));
      }
      {
        let g3 = o3;
        if (o3++, "!" === t3[o3]) {
          o3 = a2(t3, o3);
          continue;
        }
        {
          let y3 = false;
          "/" === t3[o3] && (y3 = true, o3++);
          let v2 = "";
          for (; o3 < t3.length && ">" !== t3[o3] && " " !== t3[o3] && "	" !== t3[o3] && "\n" !== t3[o3] && "\r" !== t3[o3]; o3++) v2 += t3[o3];
          if (v2 = v2.trim(), "/" === v2[v2.length - 1] && (v2 = v2.substring(0, v2.length - 1), o3--), h3 = v2, !r2.isName(h3)) {
            let e4;
            return e4 = 0 === v2.trim().length ? "Invalid space after '<'." : "Tag '" + v2 + "' is an invalid name.", d2("InvalidTag", e4, m2(t3, o3));
          }
          const b2 = l2(t3, o3);
          if (false === b2) return d2("InvalidAttr", "Attributes for '" + v2 + "' have open quote.", m2(t3, o3));
          let w2 = b2.value;
          if (o3 = b2.index, "/" === w2[w2.length - 1]) {
            const n4 = o3 - w2.length;
            w2 = w2.substring(0, w2.length - 1);
            const r3 = p2(w2, e3);
            if (true !== r3) return d2(r3.err.code, r3.err.msg, m2(t3, n4 + r3.err.line));
            u3 = true;
          } else if (y3) {
            if (!b2.tagClosed) return d2("InvalidTag", "Closing tag '" + v2 + "' doesn't have proper closing.", m2(t3, o3));
            if (w2.trim().length > 0) return d2("InvalidTag", "Closing tag '" + v2 + "' can't have attributes or invalid starting.", m2(t3, g3));
            if (0 === n3.length) return d2("InvalidTag", "Closing tag '" + v2 + "' has not been opened.", m2(t3, g3));
            {
              const e4 = n3.pop();
              if (v2 !== e4.tagName) {
                let n4 = m2(t3, e4.tagStartPos);
                return d2("InvalidTag", "Expected closing tag '" + e4.tagName + "' (opened in line " + n4.line + ", col " + n4.col + ") instead of closing tag '" + v2 + "'.", m2(t3, g3));
              }
              0 == n3.length && (c3 = true);
            }
          } else {
            const r3 = p2(w2, e3);
            if (true !== r3) return d2(r3.err.code, r3.err.msg, m2(t3, o3 - w2.length + r3.err.line));
            if (true === c3) return d2("InvalidXml", "Multiple possible root nodes found.", m2(t3, o3));
            -1 !== e3.unpairedTags.indexOf(v2) || n3.push({ tagName: v2, tagStartPos: g3 }), u3 = true;
          }
          for (o3++; o3 < t3.length; o3++) if ("<" === t3[o3]) {
            if ("!" === t3[o3 + 1]) {
              o3++, o3 = a2(t3, o3);
              continue;
            }
            if ("?" !== t3[o3 + 1]) break;
            if (o3 = s2(t3, ++o3), o3.err) return o3;
          } else if ("&" === t3[o3]) {
            const e4 = f2(t3, o3);
            if (-1 == e4) return d2("InvalidChar", "char '&' is not expected.", m2(t3, o3));
            o3 = e4;
          } else if (true === c3 && !i2(t3[o3])) return d2("InvalidXml", "Extra text at the end", m2(t3, o3));
          "<" === t3[o3] && o3--;
        }
      }
    }
    var h3;
    return u3 ? 1 == n3.length ? d2("InvalidTag", "Unclosed tag '" + n3[0].tagName + "'.", m2(t3, n3[0].tagStartPos)) : !(n3.length > 0) || d2("InvalidXml", "Invalid '" + JSON.stringify(n3.map((t4) => t4.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 }) : d2("InvalidXml", "Start tag expected.", 1);
  };
  const u2 = '"', c2 = "'";
  function l2(t3, e3) {
    let n3 = "", r3 = "", o3 = false;
    for (; e3 < t3.length; e3++) {
      if (t3[e3] === u2 || t3[e3] === c2) "" === r3 ? r3 = t3[e3] : r3 !== t3[e3] || (r3 = "");
      else if (">" === t3[e3] && "" === r3) {
        o3 = true;
        break;
      }
      n3 += t3[e3];
    }
    return "" === r3 && { value: n3, index: e3, tagClosed: o3 };
  }
  const h2 = new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g");
  function p2(t3, e3) {
    const n3 = r2.getAllMatches(t3, h2), o3 = {};
    for (let t4 = 0; t4 < n3.length; t4++) {
      if (0 === n3[t4][1].length) return d2("InvalidAttr", "Attribute '" + n3[t4][2] + "' has no space in starting.", y2(n3[t4]));
      if (void 0 !== n3[t4][3] && void 0 === n3[t4][4]) return d2("InvalidAttr", "Attribute '" + n3[t4][2] + "' is without value.", y2(n3[t4]));
      if (void 0 === n3[t4][3] && !e3.allowBooleanAttributes) return d2("InvalidAttr", "boolean attribute '" + n3[t4][2] + "' is not allowed.", y2(n3[t4]));
      const r3 = n3[t4][2];
      if (!g2(r3)) return d2("InvalidAttr", "Attribute '" + r3 + "' is an invalid name.", y2(n3[t4]));
      if (o3.hasOwnProperty(r3)) return d2("InvalidAttr", "Attribute '" + r3 + "' is repeated.", y2(n3[t4]));
      o3[r3] = 1;
    }
    return true;
  }
  function f2(t3, e3) {
    if (";" === t3[++e3]) return -1;
    if ("#" === t3[e3]) return function(t4, e4) {
      let n4 = /\d/;
      for ("x" === t4[e4] && (e4++, n4 = /[\da-fA-F]/); e4 < t4.length; e4++) {
        if (";" === t4[e4]) return e4;
        if (!t4[e4].match(n4)) break;
      }
      return -1;
    }(t3, ++e3);
    let n3 = 0;
    for (; e3 < t3.length; e3++, n3++) if (!(t3[e3].match(/\w/) && n3 < 20)) {
      if (";" === t3[e3]) break;
      return -1;
    }
    return e3;
  }
  function d2(t3, e3, n3) {
    return { err: { code: t3, msg: e3, line: n3.line || n3, col: n3.col } };
  }
  function g2(t3) {
    return r2.isName(t3);
  }
  function m2(t3, e3) {
    const n3 = t3.substring(0, e3).split(/\r?\n/);
    return { line: n3.length, col: n3[n3.length - 1].length + 1 };
  }
  function y2(t3) {
    return t3.startIndex + t3[1].length;
  }
}, 221: (t2, e2, n2) => {
  const r2 = n2(87), o2 = { attributeNamePrefix: "@_", attributesGroupName: false, textNodeName: "#text", ignoreAttributes: true, cdataPropName: false, format: false, indentBy: "  ", suppressEmptyNode: false, suppressUnpairedNode: true, suppressBooleanAttributes: true, tagValueProcessor: function(t3, e3) {
    return e3;
  }, attributeValueProcessor: function(t3, e3) {
    return e3;
  }, preserveOrder: false, commentPropName: false, unpairedTags: [], entities: [{ regex: new RegExp("&", "g"), val: "&amp;" }, { regex: new RegExp(">", "g"), val: "&gt;" }, { regex: new RegExp("<", "g"), val: "&lt;" }, { regex: new RegExp("'", "g"), val: "&apos;" }, { regex: new RegExp('"', "g"), val: "&quot;" }], processEntities: true, stopNodes: [], oneListGroup: false };
  function i2(t3) {
    this.options = Object.assign({}, o2, t3), this.options.ignoreAttributes || this.options.attributesGroupName ? this.isAttribute = function() {
      return false;
    } : (this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = u2), this.processTextOrObjNode = s2, this.options.format ? (this.indentate = a2, this.tagEndChar = ">\n", this.newLine = "\n") : (this.indentate = function() {
      return "";
    }, this.tagEndChar = ">", this.newLine = "");
  }
  function s2(t3, e3, n3) {
    const r3 = this.j2x(t3, n3 + 1);
    return void 0 !== t3[this.options.textNodeName] && 1 === Object.keys(t3).length ? this.buildTextValNode(t3[this.options.textNodeName], e3, r3.attrStr, n3) : this.buildObjectNode(r3.val, e3, r3.attrStr, n3);
  }
  function a2(t3) {
    return this.options.indentBy.repeat(t3);
  }
  function u2(t3) {
    return !(!t3.startsWith(this.options.attributeNamePrefix) || t3 === this.options.textNodeName) && t3.substr(this.attrPrefixLen);
  }
  i2.prototype.build = function(t3) {
    return this.options.preserveOrder ? r2(t3, this.options) : (Array.isArray(t3) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (t3 = { [this.options.arrayNodeName]: t3 }), this.j2x(t3, 0).val);
  }, i2.prototype.j2x = function(t3, e3) {
    let n3 = "", r3 = "";
    for (let o3 in t3) if (Object.prototype.hasOwnProperty.call(t3, o3)) if (void 0 === t3[o3]) this.isAttribute(o3) && (r3 += "");
    else if (null === t3[o3]) this.isAttribute(o3) ? r3 += "" : "?" === o3[0] ? r3 += this.indentate(e3) + "<" + o3 + "?" + this.tagEndChar : r3 += this.indentate(e3) + "<" + o3 + "/" + this.tagEndChar;
    else if (t3[o3] instanceof Date) r3 += this.buildTextValNode(t3[o3], o3, "", e3);
    else if ("object" != typeof t3[o3]) {
      const i3 = this.isAttribute(o3);
      if (i3) n3 += this.buildAttrPairStr(i3, "" + t3[o3]);
      else if (o3 === this.options.textNodeName) {
        let e4 = this.options.tagValueProcessor(o3, "" + t3[o3]);
        r3 += this.replaceEntitiesValue(e4);
      } else r3 += this.buildTextValNode(t3[o3], o3, "", e3);
    } else if (Array.isArray(t3[o3])) {
      const n4 = t3[o3].length;
      let i3 = "", s3 = "";
      for (let a3 = 0; a3 < n4; a3++) {
        const n5 = t3[o3][a3];
        if (void 0 === n5) ;
        else if (null === n5) "?" === o3[0] ? r3 += this.indentate(e3) + "<" + o3 + "?" + this.tagEndChar : r3 += this.indentate(e3) + "<" + o3 + "/" + this.tagEndChar;
        else if ("object" == typeof n5) if (this.options.oneListGroup) {
          const t4 = this.j2x(n5, e3 + 1);
          i3 += t4.val, this.options.attributesGroupName && n5.hasOwnProperty(this.options.attributesGroupName) && (s3 += t4.attrStr);
        } else i3 += this.processTextOrObjNode(n5, o3, e3);
        else if (this.options.oneListGroup) {
          let t4 = this.options.tagValueProcessor(o3, n5);
          t4 = this.replaceEntitiesValue(t4), i3 += t4;
        } else i3 += this.buildTextValNode(n5, o3, "", e3);
      }
      this.options.oneListGroup && (i3 = this.buildObjectNode(i3, o3, s3, e3)), r3 += i3;
    } else if (this.options.attributesGroupName && o3 === this.options.attributesGroupName) {
      const e4 = Object.keys(t3[o3]), r4 = e4.length;
      for (let i3 = 0; i3 < r4; i3++) n3 += this.buildAttrPairStr(e4[i3], "" + t3[o3][e4[i3]]);
    } else r3 += this.processTextOrObjNode(t3[o3], o3, e3);
    return { attrStr: n3, val: r3 };
  }, i2.prototype.buildAttrPairStr = function(t3, e3) {
    return e3 = this.options.attributeValueProcessor(t3, "" + e3), e3 = this.replaceEntitiesValue(e3), this.options.suppressBooleanAttributes && "true" === e3 ? " " + t3 : " " + t3 + '="' + e3 + '"';
  }, i2.prototype.buildObjectNode = function(t3, e3, n3, r3) {
    if ("" === t3) return "?" === e3[0] ? this.indentate(r3) + "<" + e3 + n3 + "?" + this.tagEndChar : this.indentate(r3) + "<" + e3 + n3 + this.closeTag(e3) + this.tagEndChar;
    {
      let o3 = "</" + e3 + this.tagEndChar, i3 = "";
      return "?" === e3[0] && (i3 = "?", o3 = ""), !n3 && "" !== n3 || -1 !== t3.indexOf("<") ? false !== this.options.commentPropName && e3 === this.options.commentPropName && 0 === i3.length ? this.indentate(r3) + "<!--".concat(t3, "-->") + this.newLine : this.indentate(r3) + "<" + e3 + n3 + i3 + this.tagEndChar + t3 + this.indentate(r3) + o3 : this.indentate(r3) + "<" + e3 + n3 + i3 + ">" + t3 + o3;
    }
  }, i2.prototype.closeTag = function(t3) {
    let e3 = "";
    return -1 !== this.options.unpairedTags.indexOf(t3) ? this.options.suppressUnpairedNode || (e3 = "/") : e3 = this.options.suppressEmptyNode ? "/" : "></".concat(t3), e3;
  }, i2.prototype.buildTextValNode = function(t3, e3, n3, r3) {
    if (false !== this.options.cdataPropName && e3 === this.options.cdataPropName) return this.indentate(r3) + "<![CDATA[".concat(t3, "]]>") + this.newLine;
    if (false !== this.options.commentPropName && e3 === this.options.commentPropName) return this.indentate(r3) + "<!--".concat(t3, "-->") + this.newLine;
    if ("?" === e3[0]) return this.indentate(r3) + "<" + e3 + n3 + "?" + this.tagEndChar;
    {
      let o3 = this.options.tagValueProcessor(e3, t3);
      return o3 = this.replaceEntitiesValue(o3), "" === o3 ? this.indentate(r3) + "<" + e3 + n3 + this.closeTag(e3) + this.tagEndChar : this.indentate(r3) + "<" + e3 + n3 + ">" + o3 + "</" + e3 + this.tagEndChar;
    }
  }, i2.prototype.replaceEntitiesValue = function(t3) {
    if (t3 && t3.length > 0 && this.options.processEntities) for (let e3 = 0; e3 < this.options.entities.length; e3++) {
      const n3 = this.options.entities[e3];
      t3 = t3.replace(n3.regex, n3.val);
    }
    return t3;
  }, t2.exports = i2;
}, 87: (t2) => {
  function e2(t3, s2, a2, u2) {
    let c2 = "", l2 = false;
    for (let h2 = 0; h2 < t3.length; h2++) {
      const p2 = t3[h2], f2 = n2(p2);
      if (void 0 === f2) continue;
      let d2 = "";
      if (d2 = 0 === a2.length ? f2 : "".concat(a2, ".").concat(f2), f2 === s2.textNodeName) {
        let t4 = p2[f2];
        o2(d2, s2) || (t4 = s2.tagValueProcessor(f2, t4), t4 = i2(t4, s2)), l2 && (c2 += u2), c2 += t4, l2 = false;
        continue;
      }
      if (f2 === s2.cdataPropName) {
        l2 && (c2 += u2), c2 += "<![CDATA[".concat(p2[f2][0][s2.textNodeName], "]]>"), l2 = false;
        continue;
      }
      if (f2 === s2.commentPropName) {
        c2 += u2 + "<!--".concat(p2[f2][0][s2.textNodeName], "-->"), l2 = true;
        continue;
      }
      if ("?" === f2[0]) {
        const t4 = r2(p2[":@"], s2), e3 = "?xml" === f2 ? "" : u2;
        let n3 = p2[f2][0][s2.textNodeName];
        n3 = 0 !== n3.length ? " " + n3 : "", c2 += e3 + "<".concat(f2).concat(n3).concat(t4, "?>"), l2 = true;
        continue;
      }
      let g2 = u2;
      "" !== g2 && (g2 += s2.indentBy);
      const m2 = u2 + "<".concat(f2).concat(r2(p2[":@"], s2)), y2 = e2(p2[f2], s2, d2, g2);
      -1 !== s2.unpairedTags.indexOf(f2) ? s2.suppressUnpairedNode ? c2 += m2 + ">" : c2 += m2 + "/>" : y2 && 0 !== y2.length || !s2.suppressEmptyNode ? y2 && y2.endsWith(">") ? c2 += m2 + ">".concat(y2).concat(u2, "</").concat(f2, ">") : (c2 += m2 + ">", y2 && "" !== u2 && (y2.includes("/>") || y2.includes("</")) ? c2 += u2 + s2.indentBy + y2 + u2 : c2 += y2, c2 += "</".concat(f2, ">")) : c2 += m2 + "/>", l2 = true;
    }
    return c2;
  }
  function n2(t3) {
    const e3 = Object.keys(t3);
    for (let n3 = 0; n3 < e3.length; n3++) {
      const r3 = e3[n3];
      if (t3.hasOwnProperty(r3) && ":@" !== r3) return r3;
    }
  }
  function r2(t3, e3) {
    let n3 = "";
    if (t3 && !e3.ignoreAttributes) for (let r3 in t3) {
      if (!t3.hasOwnProperty(r3)) continue;
      let o3 = e3.attributeValueProcessor(r3, t3[r3]);
      o3 = i2(o3, e3), true === o3 && e3.suppressBooleanAttributes ? n3 += " ".concat(r3.substr(e3.attributeNamePrefix.length)) : n3 += " ".concat(r3.substr(e3.attributeNamePrefix.length), '="').concat(o3, '"');
    }
    return n3;
  }
  function o2(t3, e3) {
    let n3 = (t3 = t3.substr(0, t3.length - e3.textNodeName.length - 1)).substr(t3.lastIndexOf(".") + 1);
    for (let r3 in e3.stopNodes) if (e3.stopNodes[r3] === t3 || e3.stopNodes[r3] === "*." + n3) return true;
    return false;
  }
  function i2(t3, e3) {
    if (t3 && t3.length > 0 && e3.processEntities) for (let n3 = 0; n3 < e3.entities.length; n3++) {
      const r3 = e3.entities[n3];
      t3 = t3.replace(r3.regex, r3.val);
    }
    return t3;
  }
  t2.exports = function(t3, n3) {
    let r3 = "";
    return n3.format && n3.indentBy.length > 0 && (r3 = "\n"), e2(t3, n3, "", r3);
  };
}, 193: (t2, e2, n2) => {
  const r2 = n2(705);
  function o2(t3, e3) {
    let n3 = "";
    for (; e3 < t3.length && "'" !== t3[e3] && '"' !== t3[e3]; e3++) n3 += t3[e3];
    if (n3 = n3.trim(), -1 !== n3.indexOf(" ")) throw new Error("External entites are not supported");
    const r3 = t3[e3++];
    let o3 = "";
    for (; e3 < t3.length && t3[e3] !== r3; e3++) o3 += t3[e3];
    return [n3, o3, e3];
  }
  function i2(t3, e3) {
    return "!" === t3[e3 + 1] && "-" === t3[e3 + 2] && "-" === t3[e3 + 3];
  }
  function s2(t3, e3) {
    return "!" === t3[e3 + 1] && "E" === t3[e3 + 2] && "N" === t3[e3 + 3] && "T" === t3[e3 + 4] && "I" === t3[e3 + 5] && "T" === t3[e3 + 6] && "Y" === t3[e3 + 7];
  }
  function a2(t3, e3) {
    return "!" === t3[e3 + 1] && "E" === t3[e3 + 2] && "L" === t3[e3 + 3] && "E" === t3[e3 + 4] && "M" === t3[e3 + 5] && "E" === t3[e3 + 6] && "N" === t3[e3 + 7] && "T" === t3[e3 + 8];
  }
  function u2(t3, e3) {
    return "!" === t3[e3 + 1] && "A" === t3[e3 + 2] && "T" === t3[e3 + 3] && "T" === t3[e3 + 4] && "L" === t3[e3 + 5] && "I" === t3[e3 + 6] && "S" === t3[e3 + 7] && "T" === t3[e3 + 8];
  }
  function c2(t3, e3) {
    return "!" === t3[e3 + 1] && "N" === t3[e3 + 2] && "O" === t3[e3 + 3] && "T" === t3[e3 + 4] && "A" === t3[e3 + 5] && "T" === t3[e3 + 6] && "I" === t3[e3 + 7] && "O" === t3[e3 + 8] && "N" === t3[e3 + 9];
  }
  function l2(t3) {
    if (r2.isName(t3)) return t3;
    throw new Error("Invalid entity name ".concat(t3));
  }
  t2.exports = function(t3, e3) {
    const n3 = {};
    if ("O" !== t3[e3 + 3] || "C" !== t3[e3 + 4] || "T" !== t3[e3 + 5] || "Y" !== t3[e3 + 6] || "P" !== t3[e3 + 7] || "E" !== t3[e3 + 8]) throw new Error("Invalid Tag instead of DOCTYPE");
    {
      e3 += 9;
      let r3 = 1, h2 = false, p2 = false, f2 = "";
      for (; e3 < t3.length; e3++) if ("<" !== t3[e3] || p2) if (">" === t3[e3]) {
        if (p2 ? "-" === t3[e3 - 1] && "-" === t3[e3 - 2] && (p2 = false, r3--) : r3--, 0 === r3) break;
      } else "[" === t3[e3] ? h2 = true : f2 += t3[e3];
      else {
        if (h2 && s2(t3, e3)) e3 += 7, [entityName, val, e3] = o2(t3, e3 + 1), -1 === val.indexOf("&") && (n3[l2(entityName)] = { regx: RegExp("&".concat(entityName, ";"), "g"), val });
        else if (h2 && a2(t3, e3)) e3 += 8;
        else if (h2 && u2(t3, e3)) e3 += 8;
        else if (h2 && c2(t3, e3)) e3 += 9;
        else {
          if (!i2) throw new Error("Invalid DOCTYPE");
          p2 = true;
        }
        r3++, f2 = "";
      }
      if (0 !== r3) throw new Error("Unclosed DOCTYPE");
    }
    return { entities: n3, i: e3 };
  };
}, 63: (t2, e2) => {
  const n2 = { preserveOrder: false, attributeNamePrefix: "@_", attributesGroupName: false, textNodeName: "#text", ignoreAttributes: true, removeNSPrefix: false, allowBooleanAttributes: false, parseTagValue: true, parseAttributeValue: false, trimValues: true, cdataPropName: false, numberParseOptions: { hex: true, leadingZeros: true, eNotation: true }, tagValueProcessor: function(t3, e3) {
    return e3;
  }, attributeValueProcessor: function(t3, e3) {
    return e3;
  }, stopNodes: [], alwaysCreateTextNode: false, isArray: () => false, commentPropName: false, unpairedTags: [], processEntities: true, htmlEntities: false, ignoreDeclaration: false, ignorePiTags: false, transformTagName: false, transformAttributeName: false, updateTag: function(t3, e3, n3) {
    return t3;
  } };
  e2.buildOptions = function(t3) {
    return Object.assign({}, n2, t3);
  }, e2.defaultOptions = n2;
}, 299: (t2, e2, n2) => {
  const r2 = n2(705), o2 = n2(365), i2 = n2(193), s2 = n2(494);
  function a2(t3) {
    const e3 = Object.keys(t3);
    for (let n3 = 0; n3 < e3.length; n3++) {
      const r3 = e3[n3];
      this.lastEntities[r3] = { regex: new RegExp("&" + r3 + ";", "g"), val: t3[r3] };
    }
  }
  function u2(t3, e3, n3, r3, o3, i3, s3) {
    if (void 0 !== t3 && (this.options.trimValues && !r3 && (t3 = t3.trim()), t3.length > 0)) {
      s3 || (t3 = this.replaceEntitiesValue(t3));
      const r4 = this.options.tagValueProcessor(e3, t3, n3, o3, i3);
      return null == r4 ? t3 : typeof r4 != typeof t3 || r4 !== t3 ? r4 : this.options.trimValues || t3.trim() === t3 ? w2(t3, this.options.parseTagValue, this.options.numberParseOptions) : t3;
    }
  }
  function c2(t3) {
    if (this.options.removeNSPrefix) {
      const e3 = t3.split(":"), n3 = "/" === t3.charAt(0) ? "/" : "";
      if ("xmlns" === e3[0]) return "";
      2 === e3.length && (t3 = n3 + e3[1]);
    }
    return t3;
  }
  const l2 = new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])([\\s\\S]*?)\\3)?", "gm");
  function h2(t3, e3, n3) {
    if (!this.options.ignoreAttributes && "string" == typeof t3) {
      const n4 = r2.getAllMatches(t3, l2), o3 = n4.length, i3 = {};
      for (let t4 = 0; t4 < o3; t4++) {
        const r3 = this.resolveNameSpace(n4[t4][1]);
        let o4 = n4[t4][4], s3 = this.options.attributeNamePrefix + r3;
        if (r3.length) if (this.options.transformAttributeName && (s3 = this.options.transformAttributeName(s3)), "__proto__" === s3 && (s3 = "#__proto__"), void 0 !== o4) {
          this.options.trimValues && (o4 = o4.trim()), o4 = this.replaceEntitiesValue(o4);
          const t5 = this.options.attributeValueProcessor(r3, o4, e3);
          i3[s3] = null == t5 ? o4 : typeof t5 != typeof o4 || t5 !== o4 ? t5 : w2(o4, this.options.parseAttributeValue, this.options.numberParseOptions);
        } else this.options.allowBooleanAttributes && (i3[s3] = true);
      }
      if (!Object.keys(i3).length) return;
      if (this.options.attributesGroupName) {
        const t4 = {};
        return t4[this.options.attributesGroupName] = i3, t4;
      }
      return i3;
    }
  }
  const p2 = function(t3) {
    t3 = t3.replace(/\r\n?/g, "\n");
    const e3 = new o2("!xml");
    let n3 = e3, r3 = "", s3 = "";
    for (let a3 = 0; a3 < t3.length; a3++) if ("<" === t3[a3]) if ("/" === t3[a3 + 1]) {
      const e4 = y2(t3, ">", a3, "Closing Tag is not closed.");
      let o3 = t3.substring(a3 + 2, e4).trim();
      if (this.options.removeNSPrefix) {
        const t4 = o3.indexOf(":");
        -1 !== t4 && (o3 = o3.substr(t4 + 1));
      }
      this.options.transformTagName && (o3 = this.options.transformTagName(o3)), n3 && (r3 = this.saveTextToParentTag(r3, n3, s3));
      const i3 = s3.substring(s3.lastIndexOf(".") + 1);
      if (o3 && -1 !== this.options.unpairedTags.indexOf(o3)) throw new Error("Unpaired tag can not be used as closing tag: </".concat(o3, ">"));
      let u3 = 0;
      i3 && -1 !== this.options.unpairedTags.indexOf(i3) ? (u3 = s3.lastIndexOf(".", s3.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : u3 = s3.lastIndexOf("."), s3 = s3.substring(0, u3), n3 = this.tagsNodeStack.pop(), r3 = "", a3 = e4;
    } else if ("?" === t3[a3 + 1]) {
      let e4 = v2(t3, a3, false, "?>");
      if (!e4) throw new Error("Pi Tag is not closed.");
      if (r3 = this.saveTextToParentTag(r3, n3, s3), this.options.ignoreDeclaration && "?xml" === e4.tagName || this.options.ignorePiTags) ;
      else {
        const t4 = new o2(e4.tagName);
        t4.add(this.options.textNodeName, ""), e4.tagName !== e4.tagExp && e4.attrExpPresent && (t4[":@"] = this.buildAttributesMap(e4.tagExp, s3, e4.tagName)), this.addChild(n3, t4, s3);
      }
      a3 = e4.closeIndex + 1;
    } else if ("!--" === t3.substr(a3 + 1, 3)) {
      const e4 = y2(t3, "-->", a3 + 4, "Comment is not closed.");
      if (this.options.commentPropName) {
        const o3 = t3.substring(a3 + 4, e4 - 2);
        r3 = this.saveTextToParentTag(r3, n3, s3), n3.add(this.options.commentPropName, [{ [this.options.textNodeName]: o3 }]);
      }
      a3 = e4;
    } else if ("!D" === t3.substr(a3 + 1, 2)) {
      const e4 = i2(t3, a3);
      this.docTypeEntities = e4.entities, a3 = e4.i;
    } else if ("![" === t3.substr(a3 + 1, 2)) {
      const e4 = y2(t3, "]]>", a3, "CDATA is not closed.") - 2, o3 = t3.substring(a3 + 9, e4);
      r3 = this.saveTextToParentTag(r3, n3, s3);
      let i3 = this.parseTextData(o3, n3.tagname, s3, true, false, true, true);
      null == i3 && (i3 = ""), this.options.cdataPropName ? n3.add(this.options.cdataPropName, [{ [this.options.textNodeName]: o3 }]) : n3.add(this.options.textNodeName, i3), a3 = e4 + 2;
    } else {
      let i3 = v2(t3, a3, this.options.removeNSPrefix), u3 = i3.tagName;
      const c3 = i3.rawTagName;
      let l3 = i3.tagExp, h3 = i3.attrExpPresent, p3 = i3.closeIndex;
      this.options.transformTagName && (u3 = this.options.transformTagName(u3)), n3 && r3 && "!xml" !== n3.tagname && (r3 = this.saveTextToParentTag(r3, n3, s3, false));
      const f3 = n3;
      if (f3 && -1 !== this.options.unpairedTags.indexOf(f3.tagname) && (n3 = this.tagsNodeStack.pop(), s3 = s3.substring(0, s3.lastIndexOf("."))), u3 !== e3.tagname && (s3 += s3 ? "." + u3 : u3), this.isItStopNode(this.options.stopNodes, s3, u3)) {
        let e4 = "";
        if (l3.length > 0 && l3.lastIndexOf("/") === l3.length - 1) "/" === u3[u3.length - 1] ? (u3 = u3.substr(0, u3.length - 1), s3 = s3.substr(0, s3.length - 1), l3 = u3) : l3 = l3.substr(0, l3.length - 1), a3 = i3.closeIndex;
        else if (-1 !== this.options.unpairedTags.indexOf(u3)) a3 = i3.closeIndex;
        else {
          const n4 = this.readStopNodeData(t3, c3, p3 + 1);
          if (!n4) throw new Error("Unexpected end of ".concat(c3));
          a3 = n4.i, e4 = n4.tagContent;
        }
        const r4 = new o2(u3);
        u3 !== l3 && h3 && (r4[":@"] = this.buildAttributesMap(l3, s3, u3)), e4 && (e4 = this.parseTextData(e4, u3, s3, true, h3, true, true)), s3 = s3.substr(0, s3.lastIndexOf(".")), r4.add(this.options.textNodeName, e4), this.addChild(n3, r4, s3);
      } else {
        if (l3.length > 0 && l3.lastIndexOf("/") === l3.length - 1) {
          "/" === u3[u3.length - 1] ? (u3 = u3.substr(0, u3.length - 1), s3 = s3.substr(0, s3.length - 1), l3 = u3) : l3 = l3.substr(0, l3.length - 1), this.options.transformTagName && (u3 = this.options.transformTagName(u3));
          const t4 = new o2(u3);
          u3 !== l3 && h3 && (t4[":@"] = this.buildAttributesMap(l3, s3, u3)), this.addChild(n3, t4, s3), s3 = s3.substr(0, s3.lastIndexOf("."));
        } else {
          const t4 = new o2(u3);
          this.tagsNodeStack.push(n3), u3 !== l3 && h3 && (t4[":@"] = this.buildAttributesMap(l3, s3, u3)), this.addChild(n3, t4, s3), n3 = t4;
        }
        r3 = "", a3 = p3;
      }
    }
    else r3 += t3[a3];
    return e3.child;
  };
  function f2(t3, e3, n3) {
    const r3 = this.options.updateTag(e3.tagname, n3, e3[":@"]);
    false === r3 || ("string" == typeof r3 ? (e3.tagname = r3, t3.addChild(e3)) : t3.addChild(e3));
  }
  const d2 = function(t3) {
    if (this.options.processEntities) {
      for (let e3 in this.docTypeEntities) {
        const n3 = this.docTypeEntities[e3];
        t3 = t3.replace(n3.regx, n3.val);
      }
      for (let e3 in this.lastEntities) {
        const n3 = this.lastEntities[e3];
        t3 = t3.replace(n3.regex, n3.val);
      }
      if (this.options.htmlEntities) for (let e3 in this.htmlEntities) {
        const n3 = this.htmlEntities[e3];
        t3 = t3.replace(n3.regex, n3.val);
      }
      t3 = t3.replace(this.ampEntity.regex, this.ampEntity.val);
    }
    return t3;
  };
  function g2(t3, e3, n3, r3) {
    return t3 && (void 0 === r3 && (r3 = 0 === Object.keys(e3.child).length), void 0 !== (t3 = this.parseTextData(t3, e3.tagname, n3, false, !!e3[":@"] && 0 !== Object.keys(e3[":@"]).length, r3)) && "" !== t3 && e3.add(this.options.textNodeName, t3), t3 = ""), t3;
  }
  function m2(t3, e3, n3) {
    const r3 = "*." + n3;
    for (const n4 in t3) {
      const o3 = t3[n4];
      if (r3 === o3 || e3 === o3) return true;
    }
    return false;
  }
  function y2(t3, e3, n3, r3) {
    const o3 = t3.indexOf(e3, n3);
    if (-1 === o3) throw new Error(r3);
    return o3 + e3.length - 1;
  }
  function v2(t3, e3, n3) {
    const r3 = function(t4, e4) {
      let n4, r4 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ">", o4 = "";
      for (let i4 = e4; i4 < t4.length; i4++) {
        let e5 = t4[i4];
        if (n4) e5 === n4 && (n4 = "");
        else if ('"' === e5 || "'" === e5) n4 = e5;
        else if (e5 === r4[0]) {
          if (!r4[1]) return { data: o4, index: i4 };
          if (t4[i4 + 1] === r4[1]) return { data: o4, index: i4 };
        } else "	" === e5 && (e5 = " ");
        o4 += e5;
      }
    }(t3, e3 + 1, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : ">");
    if (!r3) return;
    let o3 = r3.data;
    const i3 = r3.index, s3 = o3.search(/\s/);
    let a3 = o3, u3 = true;
    -1 !== s3 && (a3 = o3.substring(0, s3), o3 = o3.substring(s3 + 1).trimStart());
    const c3 = a3;
    if (n3) {
      const t4 = a3.indexOf(":");
      -1 !== t4 && (a3 = a3.substr(t4 + 1), u3 = a3 !== r3.data.substr(t4 + 1));
    }
    return { tagName: a3, tagExp: o3, closeIndex: i3, attrExpPresent: u3, rawTagName: c3 };
  }
  function b2(t3, e3, n3) {
    const r3 = n3;
    let o3 = 1;
    for (; n3 < t3.length; n3++) if ("<" === t3[n3]) if ("/" === t3[n3 + 1]) {
      const i3 = y2(t3, ">", n3, "".concat(e3, " is not closed"));
      if (t3.substring(n3 + 2, i3).trim() === e3 && (o3--, 0 === o3)) return { tagContent: t3.substring(r3, n3), i: i3 };
      n3 = i3;
    } else if ("?" === t3[n3 + 1]) n3 = y2(t3, "?>", n3 + 1, "StopNode is not closed.");
    else if ("!--" === t3.substr(n3 + 1, 3)) n3 = y2(t3, "-->", n3 + 3, "StopNode is not closed.");
    else if ("![" === t3.substr(n3 + 1, 2)) n3 = y2(t3, "]]>", n3, "StopNode is not closed.") - 2;
    else {
      const r4 = v2(t3, n3, ">");
      r4 && ((r4 && r4.tagName) === e3 && "/" !== r4.tagExp[r4.tagExp.length - 1] && o3++, n3 = r4.closeIndex);
    }
  }
  function w2(t3, e3, n3) {
    if (e3 && "string" == typeof t3) {
      const e4 = t3.trim();
      return "true" === e4 || "false" !== e4 && s2(t3, n3);
    }
    return r2.isExist(t3) ? t3 : "";
  }
  t2.exports = class {
    constructor(t3) {
      this.options = t3, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = { apos: { regex: /&(apos|#39|#x27);/g, val: "'" }, gt: { regex: /&(gt|#62|#x3E);/g, val: ">" }, lt: { regex: /&(lt|#60|#x3C);/g, val: "<" }, quot: { regex: /&(quot|#34|#x22);/g, val: '"' } }, this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" }, this.htmlEntities = { space: { regex: /&(nbsp|#160);/g, val: " " }, cent: { regex: /&(cent|#162);/g, val: "¢" }, pound: { regex: /&(pound|#163);/g, val: "£" }, yen: { regex: /&(yen|#165);/g, val: "¥" }, euro: { regex: /&(euro|#8364);/g, val: "€" }, copyright: { regex: /&(copy|#169);/g, val: "©" }, reg: { regex: /&(reg|#174);/g, val: "®" }, inr: { regex: /&(inr|#8377);/g, val: "₹" }, num_dec: { regex: /&#([0-9]{1,7});/g, val: (t4, e3) => String.fromCharCode(Number.parseInt(e3, 10)) }, num_hex: { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (t4, e3) => String.fromCharCode(Number.parseInt(e3, 16)) } }, this.addExternalEntities = a2, this.parseXml = p2, this.parseTextData = u2, this.resolveNameSpace = c2, this.buildAttributesMap = h2, this.isItStopNode = m2, this.replaceEntitiesValue = d2, this.readStopNodeData = b2, this.saveTextToParentTag = g2, this.addChild = f2;
    }
  };
}, 338: (t2, e2, n2) => {
  const { buildOptions: r2 } = n2(63), o2 = n2(299), { prettify: i2 } = n2(728), s2 = n2(31);
  t2.exports = class {
    constructor(t3) {
      this.externalEntities = {}, this.options = r2(t3);
    }
    parse(t3, e3) {
      if ("string" == typeof t3) ;
      else {
        if (!t3.toString) throw new Error("XML data is accepted in String or Bytes[] form.");
        t3 = t3.toString();
      }
      if (e3) {
        true === e3 && (e3 = {});
        const n4 = s2.validate(t3, e3);
        if (true !== n4) throw Error("".concat(n4.err.msg, ":").concat(n4.err.line, ":").concat(n4.err.col));
      }
      const n3 = new o2(this.options);
      n3.addExternalEntities(this.externalEntities);
      const r3 = n3.parseXml(t3);
      return this.options.preserveOrder || void 0 === r3 ? r3 : i2(r3, this.options);
    }
    addEntity(t3, e3) {
      if (-1 !== e3.indexOf("&")) throw new Error("Entity value can't have '&'");
      if (-1 !== t3.indexOf("&") || -1 !== t3.indexOf(";")) throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      if ("&" === e3) throw new Error("An entity with value '&' is not permitted");
      this.externalEntities[t3] = e3;
    }
  };
}, 728: (t2, e2) => {
  function n2(t3, e3, s2) {
    let a2;
    const u2 = {};
    for (let c2 = 0; c2 < t3.length; c2++) {
      const l2 = t3[c2], h2 = r2(l2);
      let p2 = "";
      if (p2 = void 0 === s2 ? h2 : s2 + "." + h2, h2 === e3.textNodeName) void 0 === a2 ? a2 = l2[h2] : a2 += "" + l2[h2];
      else {
        if (void 0 === h2) continue;
        if (l2[h2]) {
          let t4 = n2(l2[h2], e3, p2);
          const r3 = i2(t4, e3);
          l2[":@"] ? o2(t4, l2[":@"], p2, e3) : 1 !== Object.keys(t4).length || void 0 === t4[e3.textNodeName] || e3.alwaysCreateTextNode ? 0 === Object.keys(t4).length && (e3.alwaysCreateTextNode ? t4[e3.textNodeName] = "" : t4 = "") : t4 = t4[e3.textNodeName], void 0 !== u2[h2] && u2.hasOwnProperty(h2) ? (Array.isArray(u2[h2]) || (u2[h2] = [u2[h2]]), u2[h2].push(t4)) : e3.isArray(h2, p2, r3) ? u2[h2] = [t4] : u2[h2] = t4;
        }
      }
    }
    return "string" == typeof a2 ? a2.length > 0 && (u2[e3.textNodeName] = a2) : void 0 !== a2 && (u2[e3.textNodeName] = a2), u2;
  }
  function r2(t3) {
    const e3 = Object.keys(t3);
    for (let t4 = 0; t4 < e3.length; t4++) {
      const n3 = e3[t4];
      if (":@" !== n3) return n3;
    }
  }
  function o2(t3, e3, n3, r3) {
    if (e3) {
      const o3 = Object.keys(e3), i3 = o3.length;
      for (let s2 = 0; s2 < i3; s2++) {
        const i4 = o3[s2];
        r3.isArray(i4, n3 + "." + i4, true, true) ? t3[i4] = [e3[i4]] : t3[i4] = e3[i4];
      }
    }
  }
  function i2(t3, e3) {
    const { textNodeName: n3 } = e3, r3 = Object.keys(t3).length;
    return 0 === r3 || !(1 !== r3 || !t3[n3] && "boolean" != typeof t3[n3] && 0 !== t3[n3]);
  }
  e2.prettify = function(t3, e3) {
    return n2(t3, e3);
  };
}, 365: (t2) => {
  t2.exports = class {
    constructor(t3) {
      this.tagname = t3, this.child = [], this[":@"] = {};
    }
    add(t3, e2) {
      "__proto__" === t3 && (t3 = "#__proto__"), this.child.push({ [t3]: e2 });
    }
    addChild(t3) {
      "__proto__" === t3.tagname && (t3.tagname = "#__proto__"), t3[":@"] && Object.keys(t3[":@"]).length > 0 ? this.child.push({ [t3.tagname]: t3.child, ":@": t3[":@"] }) : this.child.push({ [t3.tagname]: t3.child });
    }
  };
}, 135: (t2) => {
  function e2(t3) {
    return !!t3.constructor && "function" == typeof t3.constructor.isBuffer && t3.constructor.isBuffer(t3);
  }
  t2.exports = function(t3) {
    return null != t3 && (e2(t3) || function(t4) {
      return "function" == typeof t4.readFloatLE && "function" == typeof t4.slice && e2(t4.slice(0, 0));
    }(t3) || !!t3._isBuffer);
  };
}, 542: (t2, e2, n2) => {
  !function() {
    var e3 = n2(298), r2 = n2(526).utf8, o2 = n2(135), i2 = n2(526).bin, s2 = function(t3, n3) {
      t3.constructor == String ? t3 = n3 && "binary" === n3.encoding ? i2.stringToBytes(t3) : r2.stringToBytes(t3) : o2(t3) ? t3 = Array.prototype.slice.call(t3, 0) : Array.isArray(t3) || t3.constructor === Uint8Array || (t3 = t3.toString());
      for (var a2 = e3.bytesToWords(t3), u2 = 8 * t3.length, c2 = 1732584193, l2 = -271733879, h2 = -1732584194, p2 = 271733878, f2 = 0; f2 < a2.length; f2++) a2[f2] = 16711935 & (a2[f2] << 8 | a2[f2] >>> 24) | 4278255360 & (a2[f2] << 24 | a2[f2] >>> 8);
      a2[u2 >>> 5] |= 128 << u2 % 32, a2[14 + (u2 + 64 >>> 9 << 4)] = u2;
      var d2 = s2._ff, g2 = s2._gg, m2 = s2._hh, y2 = s2._ii;
      for (f2 = 0; f2 < a2.length; f2 += 16) {
        var v2 = c2, b2 = l2, w2 = h2, x2 = p2;
        c2 = d2(c2, l2, h2, p2, a2[f2 + 0], 7, -680876936), p2 = d2(p2, c2, l2, h2, a2[f2 + 1], 12, -389564586), h2 = d2(h2, p2, c2, l2, a2[f2 + 2], 17, 606105819), l2 = d2(l2, h2, p2, c2, a2[f2 + 3], 22, -1044525330), c2 = d2(c2, l2, h2, p2, a2[f2 + 4], 7, -176418897), p2 = d2(p2, c2, l2, h2, a2[f2 + 5], 12, 1200080426), h2 = d2(h2, p2, c2, l2, a2[f2 + 6], 17, -1473231341), l2 = d2(l2, h2, p2, c2, a2[f2 + 7], 22, -45705983), c2 = d2(c2, l2, h2, p2, a2[f2 + 8], 7, 1770035416), p2 = d2(p2, c2, l2, h2, a2[f2 + 9], 12, -1958414417), h2 = d2(h2, p2, c2, l2, a2[f2 + 10], 17, -42063), l2 = d2(l2, h2, p2, c2, a2[f2 + 11], 22, -1990404162), c2 = d2(c2, l2, h2, p2, a2[f2 + 12], 7, 1804603682), p2 = d2(p2, c2, l2, h2, a2[f2 + 13], 12, -40341101), h2 = d2(h2, p2, c2, l2, a2[f2 + 14], 17, -1502002290), c2 = g2(c2, l2 = d2(l2, h2, p2, c2, a2[f2 + 15], 22, 1236535329), h2, p2, a2[f2 + 1], 5, -165796510), p2 = g2(p2, c2, l2, h2, a2[f2 + 6], 9, -1069501632), h2 = g2(h2, p2, c2, l2, a2[f2 + 11], 14, 643717713), l2 = g2(l2, h2, p2, c2, a2[f2 + 0], 20, -373897302), c2 = g2(c2, l2, h2, p2, a2[f2 + 5], 5, -701558691), p2 = g2(p2, c2, l2, h2, a2[f2 + 10], 9, 38016083), h2 = g2(h2, p2, c2, l2, a2[f2 + 15], 14, -660478335), l2 = g2(l2, h2, p2, c2, a2[f2 + 4], 20, -405537848), c2 = g2(c2, l2, h2, p2, a2[f2 + 9], 5, 568446438), p2 = g2(p2, c2, l2, h2, a2[f2 + 14], 9, -1019803690), h2 = g2(h2, p2, c2, l2, a2[f2 + 3], 14, -187363961), l2 = g2(l2, h2, p2, c2, a2[f2 + 8], 20, 1163531501), c2 = g2(c2, l2, h2, p2, a2[f2 + 13], 5, -1444681467), p2 = g2(p2, c2, l2, h2, a2[f2 + 2], 9, -51403784), h2 = g2(h2, p2, c2, l2, a2[f2 + 7], 14, 1735328473), c2 = m2(c2, l2 = g2(l2, h2, p2, c2, a2[f2 + 12], 20, -1926607734), h2, p2, a2[f2 + 5], 4, -378558), p2 = m2(p2, c2, l2, h2, a2[f2 + 8], 11, -2022574463), h2 = m2(h2, p2, c2, l2, a2[f2 + 11], 16, 1839030562), l2 = m2(l2, h2, p2, c2, a2[f2 + 14], 23, -35309556), c2 = m2(c2, l2, h2, p2, a2[f2 + 1], 4, -1530992060), p2 = m2(p2, c2, l2, h2, a2[f2 + 4], 11, 1272893353), h2 = m2(h2, p2, c2, l2, a2[f2 + 7], 16, -155497632), l2 = m2(l2, h2, p2, c2, a2[f2 + 10], 23, -1094730640), c2 = m2(c2, l2, h2, p2, a2[f2 + 13], 4, 681279174), p2 = m2(p2, c2, l2, h2, a2[f2 + 0], 11, -358537222), h2 = m2(h2, p2, c2, l2, a2[f2 + 3], 16, -722521979), l2 = m2(l2, h2, p2, c2, a2[f2 + 6], 23, 76029189), c2 = m2(c2, l2, h2, p2, a2[f2 + 9], 4, -640364487), p2 = m2(p2, c2, l2, h2, a2[f2 + 12], 11, -421815835), h2 = m2(h2, p2, c2, l2, a2[f2 + 15], 16, 530742520), c2 = y2(c2, l2 = m2(l2, h2, p2, c2, a2[f2 + 2], 23, -995338651), h2, p2, a2[f2 + 0], 6, -198630844), p2 = y2(p2, c2, l2, h2, a2[f2 + 7], 10, 1126891415), h2 = y2(h2, p2, c2, l2, a2[f2 + 14], 15, -1416354905), l2 = y2(l2, h2, p2, c2, a2[f2 + 5], 21, -57434055), c2 = y2(c2, l2, h2, p2, a2[f2 + 12], 6, 1700485571), p2 = y2(p2, c2, l2, h2, a2[f2 + 3], 10, -1894986606), h2 = y2(h2, p2, c2, l2, a2[f2 + 10], 15, -1051523), l2 = y2(l2, h2, p2, c2, a2[f2 + 1], 21, -2054922799), c2 = y2(c2, l2, h2, p2, a2[f2 + 8], 6, 1873313359), p2 = y2(p2, c2, l2, h2, a2[f2 + 15], 10, -30611744), h2 = y2(h2, p2, c2, l2, a2[f2 + 6], 15, -1560198380), l2 = y2(l2, h2, p2, c2, a2[f2 + 13], 21, 1309151649), c2 = y2(c2, l2, h2, p2, a2[f2 + 4], 6, -145523070), p2 = y2(p2, c2, l2, h2, a2[f2 + 11], 10, -1120210379), h2 = y2(h2, p2, c2, l2, a2[f2 + 2], 15, 718787259), l2 = y2(l2, h2, p2, c2, a2[f2 + 9], 21, -343485551), c2 = c2 + v2 >>> 0, l2 = l2 + b2 >>> 0, h2 = h2 + w2 >>> 0, p2 = p2 + x2 >>> 0;
      }
      return e3.endian([c2, l2, h2, p2]);
    };
    s2._ff = function(t3, e4, n3, r3, o3, i3, s3) {
      var a2 = t3 + (e4 & n3 | ~e4 & r3) + (o3 >>> 0) + s3;
      return (a2 << i3 | a2 >>> 32 - i3) + e4;
    }, s2._gg = function(t3, e4, n3, r3, o3, i3, s3) {
      var a2 = t3 + (e4 & r3 | n3 & ~r3) + (o3 >>> 0) + s3;
      return (a2 << i3 | a2 >>> 32 - i3) + e4;
    }, s2._hh = function(t3, e4, n3, r3, o3, i3, s3) {
      var a2 = t3 + (e4 ^ n3 ^ r3) + (o3 >>> 0) + s3;
      return (a2 << i3 | a2 >>> 32 - i3) + e4;
    }, s2._ii = function(t3, e4, n3, r3, o3, i3, s3) {
      var a2 = t3 + (n3 ^ (e4 | ~r3)) + (o3 >>> 0) + s3;
      return (a2 << i3 | a2 >>> 32 - i3) + e4;
    }, s2._blocksize = 16, s2._digestsize = 16, t2.exports = function(t3, n3) {
      if (null == t3) throw new Error("Illegal argument " + t3);
      var r3 = e3.wordsToBytes(s2(t3, n3));
      return n3 && n3.asBytes ? r3 : n3 && n3.asString ? i2.bytesToString(r3) : e3.bytesToHex(r3);
    };
  }();
}, 285: (t2, e2, n2) => {
  var r2 = n2(2);
  t2.exports = function(t3) {
    return t3 ? ("{}" === t3.substr(0, 2) && (t3 = "\\{\\}" + t3.substr(2)), m2(function(t4) {
      return t4.split("\\\\").join(o2).split("\\{").join(i2).split("\\}").join(s2).split("\\,").join(a2).split("\\.").join(u2);
    }(t3), true).map(l2)) : [];
  };
  var o2 = "\0SLASH" + Math.random() + "\0", i2 = "\0OPEN" + Math.random() + "\0", s2 = "\0CLOSE" + Math.random() + "\0", a2 = "\0COMMA" + Math.random() + "\0", u2 = "\0PERIOD" + Math.random() + "\0";
  function c2(t3) {
    return parseInt(t3, 10) == t3 ? parseInt(t3, 10) : t3.charCodeAt(0);
  }
  function l2(t3) {
    return t3.split(o2).join("\\").split(i2).join("{").split(s2).join("}").split(a2).join(",").split(u2).join(".");
  }
  function h2(t3) {
    if (!t3) return [""];
    var e3 = [], n3 = r2("{", "}", t3);
    if (!n3) return t3.split(",");
    var o3 = n3.pre, i3 = n3.body, s3 = n3.post, a3 = o3.split(",");
    a3[a3.length - 1] += "{" + i3 + "}";
    var u3 = h2(s3);
    return s3.length && (a3[a3.length - 1] += u3.shift(), a3.push.apply(a3, u3)), e3.push.apply(e3, a3), e3;
  }
  function p2(t3) {
    return "{" + t3 + "}";
  }
  function f2(t3) {
    return /^-?0\d/.test(t3);
  }
  function d2(t3, e3) {
    return t3 <= e3;
  }
  function g2(t3, e3) {
    return t3 >= e3;
  }
  function m2(t3, e3) {
    var n3 = [], o3 = r2("{", "}", t3);
    if (!o3) return [t3];
    var i3 = o3.pre, a3 = o3.post.length ? m2(o3.post, false) : [""];
    if (/\$$/.test(o3.pre)) for (var u3 = 0; u3 < a3.length; u3++) {
      var l3 = i3 + "{" + o3.body + "}" + a3[u3];
      n3.push(l3);
    }
    else {
      var y2, v2, b2 = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(o3.body), w2 = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(o3.body), x2 = b2 || w2, N2 = o3.body.indexOf(",") >= 0;
      if (!x2 && !N2) return o3.post.match(/,.*\}/) ? m2(t3 = o3.pre + "{" + o3.body + s2 + o3.post) : [t3];
      if (x2) y2 = o3.body.split(/\.\./);
      else if (1 === (y2 = h2(o3.body)).length && 1 === (y2 = m2(y2[0], false).map(p2)).length) return a3.map(function(t4) {
        return o3.pre + y2[0] + t4;
      });
      if (x2) {
        var P2 = c2(y2[0]), A2 = c2(y2[1]), O2 = Math.max(y2[0].length, y2[1].length), E2 = 3 == y2.length ? Math.abs(c2(y2[2])) : 1, T2 = d2;
        A2 < P2 && (E2 *= -1, T2 = g2);
        var j2 = y2.some(f2);
        v2 = [];
        for (var S2 = P2; T2(S2, A2); S2 += E2) {
          var $2;
          if (w2) "\\" === ($2 = String.fromCharCode(S2)) && ($2 = "");
          else if ($2 = String(S2), j2) {
            var C2 = O2 - $2.length;
            if (C2 > 0) {
              var I2 = new Array(C2 + 1).join("0");
              $2 = S2 < 0 ? "-" + I2 + $2.slice(1) : I2 + $2;
            }
          }
          v2.push($2);
        }
      } else {
        v2 = [];
        for (var k2 = 0; k2 < y2.length; k2++) v2.push.apply(v2, m2(y2[k2], false));
      }
      for (k2 = 0; k2 < v2.length; k2++) for (u3 = 0; u3 < a3.length; u3++) l3 = i3 + v2[k2] + a3[u3], (!e3 || x2 || l3) && n3.push(l3);
    }
    return n3;
  }
}, 829: (t2) => {
  function e2(t3) {
    return e2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t4) {
      return typeof t4;
    } : function(t4) {
      return t4 && "function" == typeof Symbol && t4.constructor === Symbol && t4 !== Symbol.prototype ? "symbol" : typeof t4;
    }, e2(t3);
  }
  function n2(t3) {
    var e3 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
    return n2 = function(t4) {
      if (null === t4 || (n3 = t4, -1 === Function.toString.call(n3).indexOf("[native code]"))) return t4;
      var n3;
      if ("function" != typeof t4) throw new TypeError("Super expression must either be null or a function");
      if (void 0 !== e3) {
        if (e3.has(t4)) return e3.get(t4);
        e3.set(t4, s3);
      }
      function s3() {
        return r2(t4, arguments, i2(this).constructor);
      }
      return s3.prototype = Object.create(t4.prototype, { constructor: { value: s3, enumerable: false, writable: true, configurable: true } }), o2(s3, t4);
    }, n2(t3);
  }
  function r2(t3, e3, n3) {
    return r2 = function() {
      if ("undefined" == typeof Reflect || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if ("function" == typeof Proxy) return true;
      try {
        return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
        })), true;
      } catch (t4) {
        return false;
      }
    }() ? Reflect.construct : function(t4, e4, n4) {
      var r3 = [null];
      r3.push.apply(r3, e4);
      var i3 = new (Function.bind.apply(t4, r3))();
      return n4 && o2(i3, n4.prototype), i3;
    }, r2.apply(null, arguments);
  }
  function o2(t3, e3) {
    return o2 = Object.setPrototypeOf || function(t4, e4) {
      return t4.__proto__ = e4, t4;
    }, o2(t3, e3);
  }
  function i2(t3) {
    return i2 = Object.setPrototypeOf ? Object.getPrototypeOf : function(t4) {
      return t4.__proto__ || Object.getPrototypeOf(t4);
    }, i2(t3);
  }
  var s2 = function(t3) {
    function n3(t4) {
      var r3;
      return function(t5, e3) {
        if (!(t5 instanceof e3)) throw new TypeError("Cannot call a class as a function");
      }(this, n3), (r3 = function(t5, n4) {
        return !n4 || "object" !== e2(n4) && "function" != typeof n4 ? function(t6) {
          if (void 0 === t6) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return t6;
        }(t5) : n4;
      }(this, i2(n3).call(this, t4))).name = "ObjectPrototypeMutationError", r3;
    }
    return function(t4, e3) {
      if ("function" != typeof e3 && null !== e3) throw new TypeError("Super expression must either be null or a function");
      t4.prototype = Object.create(e3 && e3.prototype, { constructor: { value: t4, writable: true, configurable: true } }), e3 && o2(t4, e3);
    }(n3, t3), n3;
  }(n2(Error));
  function a2(t3, n3) {
    for (var r3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {
    }, o3 = n3.split("."), i3 = o3.length, s3 = function(e3) {
      var n4 = o3[e3];
      if (!t3) return { v: void 0 };
      if ("+" === n4) {
        if (Array.isArray(t3)) return { v: t3.map(function(n5, i5) {
          var s4 = o3.slice(e3 + 1);
          return s4.length > 0 ? a2(n5, s4.join("."), r3) : r3(t3, i5, o3, e3);
        }) };
        var i4 = o3.slice(0, e3).join(".");
        throw new Error("Object at wildcard (".concat(i4, ") is not an array"));
      }
      t3 = r3(t3, n4, o3, e3);
    }, u3 = 0; u3 < i3; u3++) {
      var c2 = s3(u3);
      if ("object" === e2(c2)) return c2.v;
    }
    return t3;
  }
  function u2(t3, e3) {
    return t3.length === e3 + 1;
  }
  t2.exports = { set: function(t3, n3, r3) {
    if ("object" != e2(t3) || null === t3) return t3;
    if (void 0 === n3) return t3;
    if ("number" == typeof n3) return t3[n3] = r3, t3[n3];
    try {
      return a2(t3, n3, function(t4, e3, n4, o3) {
        if (t4 === Reflect.getPrototypeOf({})) throw new s2("Attempting to mutate Object.prototype");
        if (!t4[e3]) {
          var i3 = Number.isInteger(Number(n4[o3 + 1])), a3 = "+" === n4[o3 + 1];
          t4[e3] = i3 || a3 ? [] : {};
        }
        return u2(n4, o3) && (t4[e3] = r3), t4[e3];
      });
    } catch (e3) {
      if (e3 instanceof s2) throw e3;
      return t3;
    }
  }, get: function(t3, n3) {
    if ("object" != e2(t3) || null === t3) return t3;
    if (void 0 === n3) return t3;
    if ("number" == typeof n3) return t3[n3];
    try {
      return a2(t3, n3, function(t4, e3) {
        return t4[e3];
      });
    } catch (e3) {
      return t3;
    }
  }, has: function(t3, n3) {
    var r3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    if ("object" != e2(t3) || null === t3) return false;
    if (void 0 === n3) return false;
    if ("number" == typeof n3) return n3 in t3;
    try {
      var o3 = false;
      return a2(t3, n3, function(t4, e3, n4, i3) {
        if (!u2(n4, i3)) return t4 && t4[e3];
        o3 = r3.own ? t4.hasOwnProperty(e3) : e3 in t4;
      }), o3;
    } catch (t4) {
      return false;
    }
  }, hasOwn: function(t3, e3, n3) {
    return this.has(t3, e3, n3 || { own: true });
  }, isIn: function(t3, n3, r3) {
    var o3 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
    if ("object" != e2(t3) || null === t3) return false;
    if (void 0 === n3) return false;
    try {
      var i3 = false, s3 = false;
      return a2(t3, n3, function(t4, n4, o4, a3) {
        return i3 = i3 || t4 === r3 || !!t4 && t4[n4] === r3, s3 = u2(o4, a3) && "object" === e2(t4) && n4 in t4, t4 && t4[n4];
      }), o3.validPath ? i3 && s3 : i3;
    } catch (t4) {
      return false;
    }
  }, ObjectPrototypeMutationError: s2 };
}, 47: (t2, e2, n2) => {
  var r2 = n2(410), o2 = function(t3) {
    return "string" == typeof t3;
  };
  function i2(t3, e3) {
    for (var n3 = [], r3 = 0; r3 < t3.length; r3++) {
      var o3 = t3[r3];
      o3 && "." !== o3 && (".." === o3 ? n3.length && ".." !== n3[n3.length - 1] ? n3.pop() : e3 && n3.push("..") : n3.push(o3));
    }
    return n3;
  }
  var s2 = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, a2 = {};
  function u2(t3) {
    return s2.exec(t3).slice(1);
  }
  a2.resolve = function() {
    for (var t3 = "", e3 = false, n3 = arguments.length - 1; n3 >= -1 && !e3; n3--) {
      var r3 = n3 >= 0 ? arguments[n3] : process$1.cwd();
      if (!o2(r3)) throw new TypeError("Arguments to path.resolve must be strings");
      r3 && (t3 = r3 + "/" + t3, e3 = "/" === r3.charAt(0));
    }
    return (e3 ? "/" : "") + (t3 = i2(t3.split("/"), !e3).join("/")) || ".";
  }, a2.normalize = function(t3) {
    var e3 = a2.isAbsolute(t3), n3 = "/" === t3.substr(-1);
    return (t3 = i2(t3.split("/"), !e3).join("/")) || e3 || (t3 = "."), t3 && n3 && (t3 += "/"), (e3 ? "/" : "") + t3;
  }, a2.isAbsolute = function(t3) {
    return "/" === t3.charAt(0);
  }, a2.join = function() {
    for (var t3 = "", e3 = 0; e3 < arguments.length; e3++) {
      var n3 = arguments[e3];
      if (!o2(n3)) throw new TypeError("Arguments to path.join must be strings");
      n3 && (t3 += t3 ? "/" + n3 : n3);
    }
    return a2.normalize(t3);
  }, a2.relative = function(t3, e3) {
    function n3(t4) {
      for (var e4 = 0; e4 < t4.length && "" === t4[e4]; e4++) ;
      for (var n4 = t4.length - 1; n4 >= 0 && "" === t4[n4]; n4--) ;
      return e4 > n4 ? [] : t4.slice(e4, n4 + 1);
    }
    t3 = a2.resolve(t3).substr(1), e3 = a2.resolve(e3).substr(1);
    for (var r3 = n3(t3.split("/")), o3 = n3(e3.split("/")), i3 = Math.min(r3.length, o3.length), s3 = i3, u3 = 0; u3 < i3; u3++) if (r3[u3] !== o3[u3]) {
      s3 = u3;
      break;
    }
    var c2 = [];
    for (u3 = s3; u3 < r3.length; u3++) c2.push("..");
    return (c2 = c2.concat(o3.slice(s3))).join("/");
  }, a2._makeLong = function(t3) {
    return t3;
  }, a2.dirname = function(t3) {
    var e3 = u2(t3), n3 = e3[0], r3 = e3[1];
    return n3 || r3 ? (r3 && (r3 = r3.substr(0, r3.length - 1)), n3 + r3) : ".";
  }, a2.basename = function(t3, e3) {
    var n3 = u2(t3)[2];
    return e3 && n3.substr(-1 * e3.length) === e3 && (n3 = n3.substr(0, n3.length - e3.length)), n3;
  }, a2.extname = function(t3) {
    return u2(t3)[3];
  }, a2.format = function(t3) {
    if (!r2.isObject(t3)) throw new TypeError("Parameter 'pathObject' must be an object, not " + typeof t3);
    var e3 = t3.root || "";
    if (!o2(e3)) throw new TypeError("'pathObject.root' must be a string or undefined, not " + typeof t3.root);
    return (t3.dir ? t3.dir + a2.sep : "") + (t3.base || "");
  }, a2.parse = function(t3) {
    if (!o2(t3)) throw new TypeError("Parameter 'pathString' must be a string, not " + typeof t3);
    var e3 = u2(t3);
    if (!e3 || 4 !== e3.length) throw new TypeError("Invalid path '" + t3 + "'");
    return e3[1] = e3[1] || "", e3[2] = e3[2] || "", e3[3] = e3[3] || "", { root: e3[0], dir: e3[0] + e3[1].slice(0, e3[1].length - 1), base: e3[2], ext: e3[3], name: e3[2].slice(0, e3[2].length - e3[3].length) };
  }, a2.sep = "/", a2.delimiter = ":", t2.exports = a2;
}, 647: (t2, e2) => {
  var n2 = Object.prototype.hasOwnProperty;
  function r2(t3) {
    try {
      return decodeURIComponent(t3.replace(/\+/g, " "));
    } catch (t4) {
      return null;
    }
  }
  function o2(t3) {
    try {
      return encodeURIComponent(t3);
    } catch (t4) {
      return null;
    }
  }
  e2.stringify = function(t3, e3) {
    e3 = e3 || "";
    var r3, i2, s2 = [];
    for (i2 in "string" != typeof e3 && (e3 = "?"), t3) if (n2.call(t3, i2)) {
      if ((r3 = t3[i2]) || null != r3 && !isNaN(r3) || (r3 = ""), i2 = o2(i2), r3 = o2(r3), null === i2 || null === r3) continue;
      s2.push(i2 + "=" + r3);
    }
    return s2.length ? e3 + s2.join("&") : "";
  }, e2.parse = function(t3) {
    for (var e3, n3 = /([^=?#&]+)=?([^&]*)/g, o3 = {}; e3 = n3.exec(t3); ) {
      var i2 = r2(e3[1]), s2 = r2(e3[2]);
      null === i2 || null === s2 || i2 in o3 || (o3[i2] = s2);
    }
    return o3;
  };
}, 670: (t2) => {
  t2.exports = function(t3, e2) {
    if (e2 = e2.split(":")[0], !(t3 = +t3)) return false;
    switch (e2) {
      case "http":
      case "ws":
        return 80 !== t3;
      case "https":
      case "wss":
        return 443 !== t3;
      case "ftp":
        return 21 !== t3;
      case "gopher":
        return 70 !== t3;
      case "file":
        return false;
    }
    return 0 !== t3;
  };
}, 494: (t2) => {
  const e2 = /^[-+]?0x[a-fA-F0-9]+$/, n2 = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
  !Number.parseInt && window.parseInt && (Number.parseInt = window.parseInt), !Number.parseFloat && window.parseFloat && (Number.parseFloat = window.parseFloat);
  const r2 = { hex: true, leadingZeros: true, decimalPoint: ".", eNotation: true };
  t2.exports = function(t3) {
    let o2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    if (o2 = Object.assign({}, r2, o2), !t3 || "string" != typeof t3) return t3;
    let i2 = t3.trim();
    if (void 0 !== o2.skipLike && o2.skipLike.test(i2)) return t3;
    if (o2.hex && e2.test(i2)) return Number.parseInt(i2, 16);
    {
      const e3 = n2.exec(i2);
      if (e3) {
        const n3 = e3[1], r3 = e3[2];
        let a2 = (s2 = e3[3]) && -1 !== s2.indexOf(".") ? ("." === (s2 = s2.replace(/0+$/, "")) ? s2 = "0" : "." === s2[0] ? s2 = "0" + s2 : "." === s2[s2.length - 1] && (s2 = s2.substr(0, s2.length - 1)), s2) : s2;
        const u2 = e3[4] || e3[6];
        if (!o2.leadingZeros && r3.length > 0 && n3 && "." !== i2[2]) return t3;
        if (!o2.leadingZeros && r3.length > 0 && !n3 && "." !== i2[1]) return t3;
        {
          const e4 = Number(i2), s3 = "" + e4;
          return -1 !== s3.search(/[eE]/) || u2 ? o2.eNotation ? e4 : t3 : -1 !== i2.indexOf(".") ? "0" === s3 && "" === a2 || s3 === a2 || n3 && s3 === "-" + a2 ? e4 : t3 : r3 ? a2 === s3 || n3 + a2 === s3 ? e4 : t3 : i2 === s3 || i2 === n3 + s3 ? e4 : t3;
        }
      }
      return t3;
    }
    var s2;
  };
}, 737: (t2, e2, n2) => {
  var r2 = n2(670), o2 = n2(647), i2 = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/, s2 = /[\n\r\t]/g, a2 = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//, u2 = /:\d+$/, c2 = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i, l2 = /^[a-zA-Z]:/;
  function h2(t3) {
    return (t3 || "").toString().replace(i2, "");
  }
  var p2 = [["#", "hash"], ["?", "query"], function(t3, e3) {
    return g2(e3.protocol) ? t3.replace(/\\/g, "/") : t3;
  }, ["/", "pathname"], ["@", "auth", 1], [NaN, "host", void 0, 1, 1], [/:(\d*)$/, "port", void 0, 1], [NaN, "hostname", void 0, 1, 1]], f2 = { hash: 1, query: 1 };
  function d2(t3) {
    var e3, n3 = ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}).location || {}, r3 = {}, o3 = typeof (t3 = t3 || n3);
    if ("blob:" === t3.protocol) r3 = new y2(unescape(t3.pathname), {});
    else if ("string" === o3) for (e3 in r3 = new y2(t3, {}), f2) delete r3[e3];
    else if ("object" === o3) {
      for (e3 in t3) e3 in f2 || (r3[e3] = t3[e3]);
      void 0 === r3.slashes && (r3.slashes = a2.test(t3.href));
    }
    return r3;
  }
  function g2(t3) {
    return "file:" === t3 || "ftp:" === t3 || "http:" === t3 || "https:" === t3 || "ws:" === t3 || "wss:" === t3;
  }
  function m2(t3, e3) {
    t3 = (t3 = h2(t3)).replace(s2, ""), e3 = e3 || {};
    var n3, r3 = c2.exec(t3), o3 = r3[1] ? r3[1].toLowerCase() : "", i3 = !!r3[2], a3 = !!r3[3], u3 = 0;
    return i3 ? a3 ? (n3 = r3[2] + r3[3] + r3[4], u3 = r3[2].length + r3[3].length) : (n3 = r3[2] + r3[4], u3 = r3[2].length) : a3 ? (n3 = r3[3] + r3[4], u3 = r3[3].length) : n3 = r3[4], "file:" === o3 ? u3 >= 2 && (n3 = n3.slice(2)) : g2(o3) ? n3 = r3[4] : o3 ? i3 && (n3 = n3.slice(2)) : u3 >= 2 && g2(e3.protocol) && (n3 = r3[4]), { protocol: o3, slashes: i3 || g2(o3), slashesCount: u3, rest: n3 };
  }
  function y2(t3, e3, n3) {
    if (t3 = (t3 = h2(t3)).replace(s2, ""), !(this instanceof y2)) return new y2(t3, e3, n3);
    var i3, a3, u3, c3, f3, v2, b2 = p2.slice(), w2 = typeof e3, x2 = this, N2 = 0;
    for ("object" !== w2 && "string" !== w2 && (n3 = e3, e3 = null), n3 && "function" != typeof n3 && (n3 = o2.parse), i3 = !(a3 = m2(t3 || "", e3 = d2(e3))).protocol && !a3.slashes, x2.slashes = a3.slashes || i3 && e3.slashes, x2.protocol = a3.protocol || e3.protocol || "", t3 = a3.rest, ("file:" === a3.protocol && (2 !== a3.slashesCount || l2.test(t3)) || !a3.slashes && (a3.protocol || a3.slashesCount < 2 || !g2(x2.protocol))) && (b2[3] = [/(.*)/, "pathname"]); N2 < b2.length; N2++) "function" != typeof (c3 = b2[N2]) ? (u3 = c3[0], v2 = c3[1], u3 != u3 ? x2[v2] = t3 : "string" == typeof u3 ? ~(f3 = "@" === u3 ? t3.lastIndexOf(u3) : t3.indexOf(u3)) && ("number" == typeof c3[2] ? (x2[v2] = t3.slice(0, f3), t3 = t3.slice(f3 + c3[2])) : (x2[v2] = t3.slice(f3), t3 = t3.slice(0, f3))) : (f3 = u3.exec(t3)) && (x2[v2] = f3[1], t3 = t3.slice(0, f3.index)), x2[v2] = x2[v2] || i3 && c3[3] && e3[v2] || "", c3[4] && (x2[v2] = x2[v2].toLowerCase())) : t3 = c3(t3, x2);
    n3 && (x2.query = n3(x2.query)), i3 && e3.slashes && "/" !== x2.pathname.charAt(0) && ("" !== x2.pathname || "" !== e3.pathname) && (x2.pathname = function(t4, e4) {
      if ("" === t4) return e4;
      for (var n4 = (e4 || "/").split("/").slice(0, -1).concat(t4.split("/")), r3 = n4.length, o3 = n4[r3 - 1], i4 = false, s3 = 0; r3--; ) "." === n4[r3] ? n4.splice(r3, 1) : ".." === n4[r3] ? (n4.splice(r3, 1), s3++) : s3 && (0 === r3 && (i4 = true), n4.splice(r3, 1), s3--);
      return i4 && n4.unshift(""), "." !== o3 && ".." !== o3 || n4.push(""), n4.join("/");
    }(x2.pathname, e3.pathname)), "/" !== x2.pathname.charAt(0) && g2(x2.protocol) && (x2.pathname = "/" + x2.pathname), r2(x2.port, x2.protocol) || (x2.host = x2.hostname, x2.port = ""), x2.username = x2.password = "", x2.auth && (~(f3 = x2.auth.indexOf(":")) ? (x2.username = x2.auth.slice(0, f3), x2.username = encodeURIComponent(decodeURIComponent(x2.username)), x2.password = x2.auth.slice(f3 + 1), x2.password = encodeURIComponent(decodeURIComponent(x2.password))) : x2.username = encodeURIComponent(decodeURIComponent(x2.auth)), x2.auth = x2.password ? x2.username + ":" + x2.password : x2.username), x2.origin = "file:" !== x2.protocol && g2(x2.protocol) && x2.host ? x2.protocol + "//" + x2.host : "null", x2.href = x2.toString();
  }
  y2.prototype = { set: function(t3, e3, n3) {
    var i3 = this;
    switch (t3) {
      case "query":
        "string" == typeof e3 && e3.length && (e3 = (n3 || o2.parse)(e3)), i3[t3] = e3;
        break;
      case "port":
        i3[t3] = e3, r2(e3, i3.protocol) ? e3 && (i3.host = i3.hostname + ":" + e3) : (i3.host = i3.hostname, i3[t3] = "");
        break;
      case "hostname":
        i3[t3] = e3, i3.port && (e3 += ":" + i3.port), i3.host = e3;
        break;
      case "host":
        i3[t3] = e3, u2.test(e3) ? (e3 = e3.split(":"), i3.port = e3.pop(), i3.hostname = e3.join(":")) : (i3.hostname = e3, i3.port = "");
        break;
      case "protocol":
        i3.protocol = e3.toLowerCase(), i3.slashes = !n3;
        break;
      case "pathname":
      case "hash":
        if (e3) {
          var s3 = "pathname" === t3 ? "/" : "#";
          i3[t3] = e3.charAt(0) !== s3 ? s3 + e3 : e3;
        } else i3[t3] = e3;
        break;
      case "username":
      case "password":
        i3[t3] = encodeURIComponent(e3);
        break;
      case "auth":
        var a3 = e3.indexOf(":");
        ~a3 ? (i3.username = e3.slice(0, a3), i3.username = encodeURIComponent(decodeURIComponent(i3.username)), i3.password = e3.slice(a3 + 1), i3.password = encodeURIComponent(decodeURIComponent(i3.password))) : i3.username = encodeURIComponent(decodeURIComponent(e3));
    }
    for (var c3 = 0; c3 < p2.length; c3++) {
      var l3 = p2[c3];
      l3[4] && (i3[l3[1]] = i3[l3[1]].toLowerCase());
    }
    return i3.auth = i3.password ? i3.username + ":" + i3.password : i3.username, i3.origin = "file:" !== i3.protocol && g2(i3.protocol) && i3.host ? i3.protocol + "//" + i3.host : "null", i3.href = i3.toString(), i3;
  }, toString: function(t3) {
    t3 && "function" == typeof t3 || (t3 = o2.stringify);
    var e3, n3 = this, r3 = n3.host, i3 = n3.protocol;
    i3 && ":" !== i3.charAt(i3.length - 1) && (i3 += ":");
    var s3 = i3 + (n3.protocol && n3.slashes || g2(n3.protocol) ? "//" : "");
    return n3.username ? (s3 += n3.username, n3.password && (s3 += ":" + n3.password), s3 += "@") : n3.password ? (s3 += ":" + n3.password, s3 += "@") : "file:" !== n3.protocol && g2(n3.protocol) && !r3 && "/" !== n3.pathname && (s3 += "@"), (":" === r3[r3.length - 1] || u2.test(n3.hostname) && !n3.port) && (r3 += ":"), s3 += r3 + n3.pathname, (e3 = "object" == typeof n3.query ? t3(n3.query) : n3.query) && (s3 += "?" !== e3.charAt(0) ? "?" + e3 : e3), n3.hash && (s3 += n3.hash), s3;
  } }, y2.extractProtocol = m2, y2.location = d2, y2.trimLeft = h2, y2.qs = o2, t2.exports = y2;
}, 410: () => {
}, 388: () => {
}, 805: () => {
}, 345: () => {
}, 800: () => {
} }, e = {};
function n(r2) {
  var o2 = e[r2];
  if (void 0 !== o2) return o2.exports;
  var i2 = e[r2] = { id: r2, loaded: false, exports: {} };
  return t[r2].call(i2.exports, i2, i2.exports, n), i2.loaded = true, i2.exports;
}
n.n = (t2) => {
  var e2 = t2 && t2.__esModule ? () => t2.default : () => t2;
  return n.d(e2, { a: e2 }), e2;
}, n.d = (t2, e2) => {
  for (var r2 in e2) n.o(e2, r2) && !n.o(t2, r2) && Object.defineProperty(t2, r2, { enumerable: true, get: e2[r2] });
}, n.o = (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2), n.nmd = (t2) => (t2.paths = [], t2.children || (t2.children = []), t2);
var r = {};
n.d(r, { hT: () => C, O4: () => I, Kd: () => S, YK: () => $, UU: () => en, Gu: () => F, ky: () => oe, h4: () => ne, ch: () => re, hq: () => Xt, i5: () => ie });
var o = n(737), i = n.n(o);
function s(t2) {
  if (!a(t2)) throw new Error("Parameter was not an error");
}
function a(t2) {
  return !!t2 && "object" == typeof t2 && "[object Error]" === (e2 = t2, Object.prototype.toString.call(e2)) || t2 instanceof Error;
  var e2;
}
class u extends Error {
  constructor(t2, e2) {
    const n2 = [...arguments], { options: r2, shortMessage: o2 } = function(t3) {
      let e3, n3 = "";
      if (0 === t3.length) e3 = {};
      else if (a(t3[0])) e3 = { cause: t3[0] }, n3 = t3.slice(1).join(" ") || "";
      else if (t3[0] && "object" == typeof t3[0]) e3 = Object.assign({}, t3[0]), n3 = t3.slice(1).join(" ") || "";
      else {
        if ("string" != typeof t3[0]) throw new Error("Invalid arguments passed to Layerr");
        e3 = {}, n3 = n3 = t3.join(" ") || "";
      }
      return { options: e3, shortMessage: n3 };
    }(n2);
    let i2 = o2;
    if (r2.cause && (i2 = "".concat(i2, ": ").concat(r2.cause.message)), super(i2), this.message = i2, r2.name && "string" == typeof r2.name ? this.name = r2.name : this.name = "Layerr", r2.cause && Object.defineProperty(this, "_cause", { value: r2.cause }), Object.defineProperty(this, "_info", { value: {} }), r2.info && "object" == typeof r2.info && Object.assign(this._info, r2.info), Error.captureStackTrace) {
      const t3 = r2.constructorOpt || this.constructor;
      Error.captureStackTrace(this, t3);
    }
  }
  static cause(t2) {
    return s(t2), t2._cause && a(t2._cause) ? t2._cause : null;
  }
  static fullStack(t2) {
    var _a3;
    s(t2);
    const e2 = u.cause(t2);
    return e2 ? "".concat(t2.stack, "\ncaused by: ").concat(u.fullStack(e2)) : (_a3 = t2.stack) != null ? _a3 : "";
  }
  static info(t2) {
    s(t2);
    const e2 = {}, n2 = u.cause(t2);
    return n2 && Object.assign(e2, u.info(n2)), t2._info && Object.assign(e2, t2._info), e2;
  }
  toString() {
    let t2 = this.name || this.constructor.name || this.constructor.prototype.name;
    return this.message && (t2 = "".concat(t2, ": ").concat(this.message)), t2;
  }
}
var c = n(47), l = n.n(c);
const h = "__PATH_SEPARATOR_POSIX__", p = "__PATH_SEPARATOR_WINDOWS__";
function f(t2) {
  try {
    const e2 = t2.replace(/\//g, h).replace(/\\\\/g, p);
    return encodeURIComponent(e2).split(p).join("\\\\").split(h).join("/");
  } catch (t3) {
    throw new u(t3, "Failed encoding path");
  }
}
function d(t2) {
  return t2.startsWith("/") ? t2 : "/" + t2;
}
function g(t2) {
  let e2 = t2;
  return "/" !== e2[0] && (e2 = "/" + e2), /^.+\/$/.test(e2) && (e2 = e2.substr(0, e2.length - 1)), e2;
}
function m(t2) {
  let e2 = new (i())(t2).pathname;
  return e2.length <= 0 && (e2 = "/"), g(e2);
}
function y() {
  for (var t2 = arguments.length, e2 = new Array(t2), n2 = 0; n2 < t2; n2++) e2[n2] = arguments[n2];
  return function() {
    return function(t3) {
      var e3 = [];
      if (0 === t3.length) return "";
      if ("string" != typeof t3[0]) throw new TypeError("Url must be a string. Received " + t3[0]);
      if (t3[0].match(/^[^/:]+:\/*$/) && t3.length > 1) {
        var n3 = t3.shift();
        t3[0] = n3 + t3[0];
      }
      t3[0].match(/^file:\/\/\//) ? t3[0] = t3[0].replace(/^([^/:]+):\/*/, "$1:///") : t3[0] = t3[0].replace(/^([^/:]+):\/*/, "$1://");
      for (var r2 = 0; r2 < t3.length; r2++) {
        var o2 = t3[r2];
        if ("string" != typeof o2) throw new TypeError("Url must be a string. Received " + o2);
        "" !== o2 && (r2 > 0 && (o2 = o2.replace(/^[\/]+/, "")), o2 = r2 < t3.length - 1 ? o2.replace(/[\/]+$/, "") : o2.replace(/[\/]+$/, "/"), e3.push(o2));
      }
      var i2 = e3.join("/"), s2 = (i2 = i2.replace(/\/(\?|&|#[^!])/g, "$1")).split("?");
      return s2.shift() + (s2.length > 0 ? "?" : "") + s2.join("&");
    }("object" == typeof arguments[0] ? arguments[0] : [].slice.call(arguments));
  }(e2.reduce((t3, e3, n3) => ((0 === n3 || "/" !== e3 || "/" === e3 && "/" !== t3[t3.length - 1]) && t3.push(e3), t3), []));
}
var v = n(542), b = n.n(v);
const w = "abcdef0123456789";
function x(t2, e2) {
  const n2 = t2.url.replace("//", ""), r2 = -1 == n2.indexOf("/") ? "/" : n2.slice(n2.indexOf("/")), o2 = t2.method ? t2.method.toUpperCase() : "GET", i2 = !!/(^|,)\s*auth\s*($|,)/.test(e2.qop) && "auth", s2 = "00000000".concat(e2.nc).slice(-8), a2 = function(t3, e3, n3, r3, o3, i3, s3) {
    const a3 = s3 || b()("".concat(e3, ":").concat(n3, ":").concat(r3));
    return t3 && "md5-sess" === t3.toLowerCase() ? b()("".concat(a3, ":").concat(o3, ":").concat(i3)) : a3;
  }(e2.algorithm, e2.username, e2.realm, e2.password, e2.nonce, e2.cnonce, e2.ha1), u2 = b()("".concat(o2, ":").concat(r2)), c2 = i2 ? b()("".concat(a2, ":").concat(e2.nonce, ":").concat(s2, ":").concat(e2.cnonce, ":").concat(i2, ":").concat(u2)) : b()("".concat(a2, ":").concat(e2.nonce, ":").concat(u2)), l2 = { username: e2.username, realm: e2.realm, nonce: e2.nonce, uri: r2, qop: i2, response: c2, nc: s2, cnonce: e2.cnonce, algorithm: e2.algorithm, opaque: e2.opaque }, h2 = [];
  for (const t3 in l2) l2[t3] && ("qop" === t3 || "nc" === t3 || "algorithm" === t3 ? h2.push("".concat(t3, "=").concat(l2[t3])) : h2.push("".concat(t3, '="').concat(l2[t3], '"')));
  return "Digest ".concat(h2.join(", "));
}
function N(t2) {
  return "digest" === (t2.headers && t2.headers.get("www-authenticate") || "").split(/\s/)[0].toLowerCase();
}
var P = n(101), A = n.n(P);
function O(t2) {
  return A().decode(t2);
}
function E(t2, e2) {
  var n2;
  return "Basic ".concat((n2 = "".concat(t2, ":").concat(e2), A().encode(n2)));
}
const T = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : "undefined" != typeof window ? window : globalThis, j = T.fetch.bind(T), S = T.Request, $ = T.Response;
let C = function(t2) {
  return t2.Auto = "auto", t2.Digest = "digest", t2.None = "none", t2.Password = "password", t2.Token = "token", t2;
}({}), I = function(t2) {
  return t2.DataTypeNoLength = "data-type-no-length", t2.InvalidAuthType = "invalid-auth-type", t2.InvalidOutputFormat = "invalid-output-format", t2.LinkUnsupportedAuthType = "link-unsupported-auth", t2.InvalidUpdateRange = "invalid-update-range", t2.NotSupported = "not-supported", t2;
}({});
function k(t2, e2, n2, r2, o2) {
  switch (t2.authType) {
    case C.Auto:
      e2 && n2 && (t2.headers.Authorization = E(e2, n2));
      break;
    case C.Digest:
      t2.digest = /* @__PURE__ */ function(t3, e3, n3) {
        return { username: t3, password: e3, ha1: n3, nc: 0, algorithm: "md5", hasDigestAuth: false };
      }(e2, n2, o2);
      break;
    case C.None:
      break;
    case C.Password:
      t2.headers.Authorization = E(e2, n2);
      break;
    case C.Token:
      t2.headers.Authorization = "".concat((i2 = r2).token_type, " ").concat(i2.access_token);
      break;
    default:
      throw new u({ info: { code: I.InvalidAuthType } }, "Invalid auth type: ".concat(t2.authType));
  }
  var i2;
}
n(345), n(800);
const R = "@@HOTPATCHER", L = () => {
};
function _(t2) {
  return { original: t2, methods: [t2], final: false };
}
class M {
  constructor() {
    this._configuration = { registry: {}, getEmptyAction: "null" }, this.__type__ = R;
  }
  get configuration() {
    return this._configuration;
  }
  get getEmptyAction() {
    return this.configuration.getEmptyAction;
  }
  set getEmptyAction(t2) {
    this.configuration.getEmptyAction = t2;
  }
  control(t2) {
    let e2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    if (!t2 || t2.__type__ !== R) throw new Error("Failed taking control of target HotPatcher instance: Invalid type or object");
    return Object.keys(t2.configuration.registry).forEach((n2) => {
      this.configuration.registry.hasOwnProperty(n2) ? e2 && (this.configuration.registry[n2] = Object.assign({}, t2.configuration.registry[n2])) : this.configuration.registry[n2] = Object.assign({}, t2.configuration.registry[n2]);
    }), t2._configuration = this.configuration, this;
  }
  execute(t2) {
    const e2 = this.get(t2) || L;
    for (var n2 = arguments.length, r2 = new Array(n2 > 1 ? n2 - 1 : 0), o2 = 1; o2 < n2; o2++) r2[o2 - 1] = arguments[o2];
    return e2(...r2);
  }
  get(t2) {
    const e2 = this.configuration.registry[t2];
    if (!e2) switch (this.getEmptyAction) {
      case "null":
        return null;
      case "throw":
        throw new Error("Failed handling method request: No method provided for override: ".concat(t2));
      default:
        throw new Error("Failed handling request which resulted in an empty method: Invalid empty-action specified: ".concat(this.getEmptyAction));
    }
    return function() {
      for (var t3 = arguments.length, e3 = new Array(t3), n2 = 0; n2 < t3; n2++) e3[n2] = arguments[n2];
      if (0 === e3.length) throw new Error("Failed creating sequence: No functions provided");
      return function() {
        for (var t4 = arguments.length, n3 = new Array(t4), r2 = 0; r2 < t4; r2++) n3[r2] = arguments[r2];
        let o2 = n3;
        const i2 = this;
        for (; e3.length > 0; ) o2 = [e3.shift().apply(i2, o2)];
        return o2[0];
      };
    }(...e2.methods);
  }
  isPatched(t2) {
    return !!this.configuration.registry[t2];
  }
  patch(t2, e2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    const { chain: r2 = false } = n2;
    if (this.configuration.registry[t2] && this.configuration.registry[t2].final) throw new Error("Failed patching '".concat(t2, "': Method marked as being final"));
    if ("function" != typeof e2) throw new Error("Failed patching '".concat(t2, "': Provided method is not a function"));
    if (r2) this.configuration.registry[t2] ? this.configuration.registry[t2].methods.push(e2) : this.configuration.registry[t2] = _(e2);
    else if (this.isPatched(t2)) {
      const { original: n3 } = this.configuration.registry[t2];
      this.configuration.registry[t2] = Object.assign(_(e2), { original: n3 });
    } else this.configuration.registry[t2] = _(e2);
    return this;
  }
  patchInline(t2, e2) {
    this.isPatched(t2) || this.patch(t2, e2);
    for (var n2 = arguments.length, r2 = new Array(n2 > 2 ? n2 - 2 : 0), o2 = 2; o2 < n2; o2++) r2[o2 - 2] = arguments[o2];
    return this.execute(t2, ...r2);
  }
  plugin(t2) {
    for (var e2 = arguments.length, n2 = new Array(e2 > 1 ? e2 - 1 : 0), r2 = 1; r2 < e2; r2++) n2[r2 - 1] = arguments[r2];
    return n2.forEach((e3) => {
      this.patch(t2, e3, { chain: true });
    }), this;
  }
  restore(t2) {
    if (!this.isPatched(t2)) throw new Error("Failed restoring method: No method present for key: ".concat(t2));
    if ("function" != typeof this.configuration.registry[t2].original) throw new Error("Failed restoring method: Original method not found or of invalid type for key: ".concat(t2));
    return this.configuration.registry[t2].methods = [this.configuration.registry[t2].original], this;
  }
  setFinal(t2) {
    if (!this.configuration.registry.hasOwnProperty(t2)) throw new Error("Failed marking '".concat(t2, "' as final: No method found for key"));
    return this.configuration.registry[t2].final = true, this;
  }
}
let U = null;
function F() {
  return U || (U = new M()), U;
}
function D(t2) {
  return function(t3) {
    if ("object" != typeof t3 || null === t3 || "[object Object]" != Object.prototype.toString.call(t3)) return false;
    if (null === Object.getPrototypeOf(t3)) return true;
    let e2 = t3;
    for (; null !== Object.getPrototypeOf(e2); ) e2 = Object.getPrototypeOf(e2);
    return Object.getPrototypeOf(t3) === e2;
  }(t2) ? Object.assign({}, t2) : Object.setPrototypeOf(Object.assign({}, t2), Object.getPrototypeOf(t2));
}
function B() {
  for (var t2 = arguments.length, e2 = new Array(t2), n2 = 0; n2 < t2; n2++) e2[n2] = arguments[n2];
  let r2 = null, o2 = [...e2];
  for (; o2.length > 0; ) {
    const t3 = o2.shift();
    r2 = r2 ? W(r2, t3) : D(t3);
  }
  return r2;
}
function W(t2, e2) {
  const n2 = D(t2);
  return Object.keys(e2).forEach((t3) => {
    n2.hasOwnProperty(t3) ? Array.isArray(e2[t3]) ? n2[t3] = Array.isArray(n2[t3]) ? [...n2[t3], ...e2[t3]] : [...e2[t3]] : "object" == typeof e2[t3] && e2[t3] ? n2[t3] = "object" == typeof n2[t3] && n2[t3] ? W(n2[t3], e2[t3]) : D(e2[t3]) : n2[t3] = e2[t3] : n2[t3] = e2[t3];
  }), n2;
}
function V(t2) {
  const e2 = {};
  for (const n2 of t2.keys()) e2[n2] = t2.get(n2);
  return e2;
}
function z() {
  for (var t2 = arguments.length, e2 = new Array(t2), n2 = 0; n2 < t2; n2++) e2[n2] = arguments[n2];
  if (0 === e2.length) return {};
  const r2 = {};
  return e2.reduce((t3, e3) => (Object.keys(e3).forEach((n3) => {
    const o2 = n3.toLowerCase();
    r2.hasOwnProperty(o2) ? t3[r2[o2]] = e3[n3] : (r2[o2] = n3, t3[n3] = e3[n3]);
  }), t3), {});
}
n(805);
const G = "function" == typeof ArrayBuffer, { toString: q } = Object.prototype;
function H(t2) {
  return G && (t2 instanceof ArrayBuffer || "[object ArrayBuffer]" === q.call(t2));
}
function X$1(t2) {
  return null != t2 && null != t2.constructor && "function" == typeof t2.constructor.isBuffer && t2.constructor.isBuffer(t2);
}
function Z(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}
function Y$1(t2, e2, n2) {
  return t2 && t2.then || (t2 = Promise.resolve(t2)), e2 ? t2.then(e2) : t2;
}
const K = Z(function(t2) {
  const e2 = t2._digest;
  return delete t2._digest, e2.hasDigestAuth && (t2 = B(t2, { headers: { Authorization: x(t2, e2) } })), Y$1(et(t2), function(n2) {
    let r2 = false;
    return o2 = function(t3) {
      return r2 ? t3 : n2;
    }, (i2 = function() {
      if (401 == n2.status) return e2.hasDigestAuth = function(t3, e3) {
        if (!N(t3)) return false;
        const n3 = /([a-z0-9_-]+)=(?:"([^"]+)"|([a-z0-9_-]+))/gi;
        for (; ; ) {
          const r3 = t3.headers && t3.headers.get("www-authenticate") || "", o3 = n3.exec(r3);
          if (!o3) break;
          e3[o3[1]] = o3[2] || o3[3];
        }
        return e3.nc += 1, e3.cnonce = function() {
          let t4 = "";
          for (let e4 = 0; e4 < 32; ++e4) t4 = "".concat(t4).concat(w[Math.floor(16 * Math.random())]);
          return t4;
        }(), true;
      }(n2, e2), function() {
        if (e2.hasDigestAuth) return Y$1(et(t2 = B(t2, { headers: { Authorization: x(t2, e2) } })), function(t3) {
          return 401 == t3.status ? e2.hasDigestAuth = false : e2.nc++, r2 = true, t3;
        });
      }();
      e2.nc++;
    }()) && i2.then ? i2.then(o2) : o2(i2);
    var o2, i2;
  });
}), J = Z(function(t2, e2) {
  return Y$1(et(t2), function(n2) {
    return n2.ok ? (e2.authType = C.Password, n2) : 401 == n2.status && N(n2) ? (e2.authType = C.Digest, k(e2, e2.username, e2.password, void 0, void 0), t2._digest = e2.digest, K(t2)) : n2;
  });
}), Q = Z(function(t2, e2) {
  return e2.authType === C.Auto ? J(t2, e2) : t2._digest ? K(t2) : et(t2);
});
function tt(t2, e2, n2) {
  const r2 = D(t2);
  return r2.headers = z(e2.headers, r2.headers || {}, n2.headers || {}), void 0 !== n2.data && (r2.data = n2.data), n2.signal && (r2.signal = n2.signal), e2.httpAgent && (r2.httpAgent = e2.httpAgent), e2.httpsAgent && (r2.httpsAgent = e2.httpsAgent), e2.digest && (r2._digest = e2.digest), "boolean" == typeof e2.withCredentials && (r2.withCredentials = e2.withCredentials), r2;
}
function et(t2) {
  const e2 = F();
  return e2.patchInline("request", (t3) => e2.patchInline("fetch", j, t3.url, function(t4) {
    let e3 = {};
    const n2 = { method: t4.method };
    if (t4.headers && (e3 = z(e3, t4.headers)), void 0 !== t4.data) {
      const [r2, o2] = function(t5) {
        if ("string" == typeof t5) return [t5, {}];
        if (X$1(t5)) return [t5, {}];
        if (H(t5)) return [t5, {}];
        if (t5 && "object" == typeof t5) return [JSON.stringify(t5), { "content-type": "application/json" }];
        throw new Error("Unable to convert request body: Unexpected body type: " + typeof t5);
      }(t4.data);
      n2.body = r2, e3 = z(e3, o2);
    }
    return t4.signal && (n2.signal = t4.signal), t4.withCredentials && (n2.credentials = "include"), n2.headers = e3, n2;
  }(t3)), t2);
}
var nt = n(285);
const rt = (t2) => {
  if ("string" != typeof t2) throw new TypeError("invalid pattern");
  if (t2.length > 65536) throw new TypeError("pattern is too long");
}, ot = { "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true], "[:alpha:]": ["\\p{L}\\p{Nl}", true], "[:ascii:]": ["\\x00-\\x7f", false], "[:blank:]": ["\\p{Zs}\\t", true], "[:cntrl:]": ["\\p{Cc}", true], "[:digit:]": ["\\p{Nd}", true], "[:graph:]": ["\\p{Z}\\p{C}", true, true], "[:lower:]": ["\\p{Ll}", true], "[:print:]": ["\\p{C}", true], "[:punct:]": ["\\p{P}", true], "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true], "[:upper:]": ["\\p{Lu}", true], "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true], "[:xdigit:]": ["A-Fa-f0-9", false] }, it = (t2) => t2.replace(/[[\]\\-]/g, "\\$&"), st = (t2) => t2.join(""), at = (t2, e2) => {
  const n2 = e2;
  if ("[" !== t2.charAt(n2)) throw new Error("not in a brace expression");
  const r2 = [], o2 = [];
  let i2 = n2 + 1, s2 = false, a2 = false, u2 = false, c2 = false, l2 = n2, h2 = "";
  t: for (; i2 < t2.length; ) {
    const e3 = t2.charAt(i2);
    if ("!" !== e3 && "^" !== e3 || i2 !== n2 + 1) {
      if ("]" === e3 && s2 && !u2) {
        l2 = i2 + 1;
        break;
      }
      if (s2 = true, "\\" !== e3 || u2) {
        if ("[" === e3 && !u2) {
          for (const [e4, [s3, u3, c3]] of Object.entries(ot)) if (t2.startsWith(e4, i2)) {
            if (h2) return ["$.", false, t2.length - n2, true];
            i2 += e4.length, c3 ? o2.push(s3) : r2.push(s3), a2 = a2 || u3;
            continue t;
          }
        }
        u2 = false, h2 ? (e3 > h2 ? r2.push(it(h2) + "-" + it(e3)) : e3 === h2 && r2.push(it(e3)), h2 = "", i2++) : t2.startsWith("-]", i2 + 1) ? (r2.push(it(e3 + "-")), i2 += 2) : t2.startsWith("-", i2 + 1) ? (h2 = e3, i2 += 2) : (r2.push(it(e3)), i2++);
      } else u2 = true, i2++;
    } else c2 = true, i2++;
  }
  if (l2 < i2) return ["", false, 0, false];
  if (!r2.length && !o2.length) return ["$.", false, t2.length - n2, true];
  if (0 === o2.length && 1 === r2.length && /^\\?.$/.test(r2[0]) && !c2) {
    return [(p2 = 2 === r2[0].length ? r2[0].slice(-1) : r2[0], p2.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")), false, l2 - n2, false];
  }
  var p2;
  const f2 = "[" + (c2 ? "^" : "") + st(r2) + "]", d2 = "[" + (c2 ? "" : "^") + st(o2) + "]";
  return [r2.length && o2.length ? "(" + f2 + "|" + d2 + ")" : r2.length ? f2 : d2, a2, l2 - n2, true];
}, ut = function(t2) {
  let { windowsPathsNoEscape: e2 = false } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
  return e2 ? t2.replace(/\[([^\/\\])\]/g, "$1") : t2.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
}, ct = /* @__PURE__ */ new Set(["!", "?", "+", "*", "@"]), lt = (t2) => ct.has(t2), ht = "(?!\\.)", pt = /* @__PURE__ */ new Set(["[", "."]), ft = /* @__PURE__ */ new Set(["..", "."]), dt = new Set("().*{}+?[]^$\\!"), gt = "[^/]", mt = gt + "*?", yt = gt + "+?";
const _vt = class _vt {
  constructor(t2, e2) {
    __privateAdd(this, _vt_instances);
    __publicField(this, "type");
    __privateAdd(this, _t2);
    __privateAdd(this, _e2);
    __privateAdd(this, _n, false);
    __privateAdd(this, _r, []);
    __privateAdd(this, _o);
    __privateAdd(this, _i);
    __privateAdd(this, _s);
    __privateAdd(this, _a2, false);
    __privateAdd(this, _u);
    __privateAdd(this, _c);
    __privateAdd(this, _l, false);
    let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    this.type = t2, t2 && __privateSet(this, _e2, true), __privateSet(this, _o, e2), __privateSet(this, _t2, __privateGet(this, _o) ? __privateGet(__privateGet(this, _o), _t2) : this), __privateSet(this, _u, __privateGet(this, _t2) === this ? n2 : __privateGet(__privateGet(this, _t2), _u)), __privateSet(this, _s, __privateGet(this, _t2) === this ? [] : __privateGet(__privateGet(this, _t2), _s)), "!" !== t2 || __privateGet(__privateGet(this, _t2), _a2) || __privateGet(this, _s).push(this), __privateSet(this, _i, __privateGet(this, _o) ? __privateGet(__privateGet(this, _o), _r).length : 0);
  }
  get hasMagic() {
    if (void 0 !== __privateGet(this, _e2)) return __privateGet(this, _e2);
    for (const t2 of __privateGet(this, _r)) if ("string" != typeof t2 && (t2.type || t2.hasMagic)) return __privateSet(this, _e2, true);
    return __privateGet(this, _e2);
  }
  toString() {
    return void 0 !== __privateGet(this, _c) ? __privateGet(this, _c) : this.type ? __privateSet(this, _c, this.type + "(" + __privateGet(this, _r).map((t2) => String(t2)).join("|") + ")") : __privateSet(this, _c, __privateGet(this, _r).map((t2) => String(t2)).join(""));
  }
  push() {
    for (var t2 = arguments.length, e2 = new Array(t2), n2 = 0; n2 < t2; n2++) e2[n2] = arguments[n2];
    for (const t3 of e2) if ("" !== t3) {
      if ("string" != typeof t3 && !(t3 instanceof _vt && __privateGet(t3, _o) === this)) throw new Error("invalid part: " + t3);
      __privateGet(this, _r).push(t3);
    }
  }
  toJSON() {
    var _a3;
    const t2 = null === this.type ? __privateGet(this, _r).slice().map((t3) => "string" == typeof t3 ? t3 : t3.toJSON()) : [this.type, ...__privateGet(this, _r).map((t3) => t3.toJSON())];
    return this.isStart() && !this.type && t2.unshift([]), this.isEnd() && (this === __privateGet(this, _t2) || __privateGet(__privateGet(this, _t2), _a2) && "!" === ((_a3 = __privateGet(this, _o)) == null ? void 0 : _a3.type)) && t2.push({}), t2;
  }
  isStart() {
    var _a3;
    if (__privateGet(this, _t2) === this) return true;
    if (!((_a3 = __privateGet(this, _o)) == null ? void 0 : _a3.isStart())) return false;
    if (0 === __privateGet(this, _i)) return true;
    const t2 = __privateGet(this, _o);
    for (let e2 = 0; e2 < __privateGet(this, _i); e2++) {
      const n2 = __privateGet(t2, _r)[e2];
      if (!(n2 instanceof _vt && "!" === n2.type)) return false;
    }
    return true;
  }
  isEnd() {
    var _a3, _b, _c2;
    if (__privateGet(this, _t2) === this) return true;
    if ("!" === ((_a3 = __privateGet(this, _o)) == null ? void 0 : _a3.type)) return true;
    if (!((_b = __privateGet(this, _o)) == null ? void 0 : _b.isEnd())) return false;
    if (!this.type) return (_c2 = __privateGet(this, _o)) == null ? void 0 : _c2.isEnd();
    const t2 = __privateGet(this, _o) ? __privateGet(__privateGet(this, _o), _r).length : 0;
    return __privateGet(this, _i) === t2 - 1;
  }
  copyIn(t2) {
    "string" == typeof t2 ? this.push(t2) : this.push(t2.clone(this));
  }
  clone(t2) {
    const e2 = new _vt(this.type, t2);
    for (const t3 of __privateGet(this, _r)) e2.copyIn(t3);
    return e2;
  }
  static fromGlob(t2) {
    var _a3;
    let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    const n2 = new _vt(null, void 0, e2);
    return __privateMethod(_a3 = _vt, _vt_static, p_fn).call(_a3, t2, n2, 0, e2), n2;
  }
  toMMPattern() {
    if (this !== __privateGet(this, _t2)) return __privateGet(this, _t2).toMMPattern();
    const t2 = this.toString(), [e2, n2, r2, o2] = this.toRegExpSource();
    if (!(r2 || __privateGet(this, _e2) || __privateGet(this, _u).nocase && !__privateGet(this, _u).nocaseMagicOnly && t2.toUpperCase() !== t2.toLowerCase())) return n2;
    const i2 = (__privateGet(this, _u).nocase ? "i" : "") + (o2 ? "u" : "");
    return Object.assign(new RegExp("^".concat(e2, "$"), i2), { _src: e2, _glob: t2 });
  }
  get options() {
    return __privateGet(this, _u);
  }
  toRegExpSource(t2) {
    var _a3;
    const e2 = t2 != null ? t2 : !!__privateGet(this, _u).dot;
    if (__privateGet(this, _t2) === this && __privateMethod(this, _vt_instances, h_fn).call(this), !this.type) {
      const n3 = this.isStart() && this.isEnd(), r3 = __privateGet(this, _r).map((e3) => {
        var _a4;
        const [r4, o4, i4, s3] = "string" == typeof e3 ? __privateMethod(_a4 = _vt, _vt_static, f_fn).call(_a4, e3, __privateGet(this, _e2), n3) : e3.toRegExpSource(t2);
        return __privateSet(this, _e2, __privateGet(this, _e2) || i4), __privateSet(this, _n, __privateGet(this, _n) || s3), r4;
      }).join("");
      let o3 = "";
      if (this.isStart() && "string" == typeof __privateGet(this, _r)[0] && (1 !== __privateGet(this, _r).length || !ft.has(__privateGet(this, _r)[0]))) {
        const n4 = pt, i4 = e2 && n4.has(r3.charAt(0)) || r3.startsWith("\\.") && n4.has(r3.charAt(2)) || r3.startsWith("\\.\\.") && n4.has(r3.charAt(4)), s3 = !e2 && !t2 && n4.has(r3.charAt(0));
        o3 = i4 ? "(?!(?:^|/)\\.\\.?(?:$|/))" : s3 ? ht : "";
      }
      let i3 = "";
      return this.isEnd() && __privateGet(__privateGet(this, _t2), _a2) && "!" === ((_a3 = __privateGet(this, _o)) == null ? void 0 : _a3.type) && (i3 = "(?:$|\\/)"), [o3 + r3 + i3, ut(r3), __privateSet(this, _e2, !!__privateGet(this, _e2)), __privateGet(this, _n)];
    }
    const n2 = "*" === this.type || "+" === this.type, r2 = "!" === this.type ? "(?:(?!(?:" : "(?:";
    let o2 = __privateMethod(this, _vt_instances, d_fn).call(this, e2);
    if (this.isStart() && this.isEnd() && !o2 && "!" !== this.type) {
      const t3 = this.toString();
      return __privateSet(this, _r, [t3]), this.type = null, __privateSet(this, _e2, void 0), [t3, ut(this.toString()), false, false];
    }
    let i2 = !n2 || t2 || e2 ? "" : __privateMethod(this, _vt_instances, d_fn).call(this, true);
    i2 === o2 && (i2 = ""), i2 && (o2 = "(?:".concat(o2, ")(?:").concat(i2, ")*?"));
    let s2 = "";
    return s2 = "!" === this.type && __privateGet(this, _l) ? (this.isStart() && !e2 ? ht : "") + yt : r2 + o2 + ("!" === this.type ? "))" + (!this.isStart() || e2 || t2 ? "" : ht) + mt + ")" : "@" === this.type ? ")" : "?" === this.type ? ")?" : "+" === this.type && i2 ? ")" : "*" === this.type && i2 ? ")?" : ")".concat(this.type)), [s2, ut(o2), __privateSet(this, _e2, !!__privateGet(this, _e2)), __privateGet(this, _n)];
  }
};
_t2 = new WeakMap();
_e2 = new WeakMap();
_n = new WeakMap();
_r = new WeakMap();
_o = new WeakMap();
_i = new WeakMap();
_s = new WeakMap();
_a2 = new WeakMap();
_u = new WeakMap();
_c = new WeakMap();
_l = new WeakMap();
_vt_instances = new WeakSet();
h_fn = function() {
  if (this !== __privateGet(this, _t2)) throw new Error("should only call on root");
  if (__privateGet(this, _a2)) return this;
  let t2;
  for (this.toString(), __privateSet(this, _a2, true); t2 = __privateGet(this, _s).pop(); ) {
    if ("!" !== t2.type) continue;
    let e2 = t2, n2 = __privateGet(e2, _o);
    for (; n2; ) {
      for (let r2 = __privateGet(e2, _i) + 1; !n2.type && r2 < __privateGet(n2, _r).length; r2++) for (const e3 of __privateGet(t2, _r)) {
        if ("string" == typeof e3) throw new Error("string part in extglob AST??");
        e3.copyIn(__privateGet(n2, _r)[r2]);
      }
      e2 = n2, n2 = __privateGet(e2, _o);
    }
  }
  return this;
};
_vt_static = new WeakSet();
p_fn = function(t2, e2, n2, r2) {
  var _a3, _b;
  let o2 = false, i2 = false, s2 = -1, a2 = false;
  if (null === e2.type) {
    let u3 = n2, c3 = "";
    for (; u3 < t2.length; ) {
      const n3 = t2.charAt(u3++);
      if (o2 || "\\" === n3) o2 = !o2, c3 += n3;
      else if (i2) u3 === s2 + 1 ? "^" !== n3 && "!" !== n3 || (a2 = true) : "]" !== n3 || u3 === s2 + 2 && a2 || (i2 = false), c3 += n3;
      else if ("[" !== n3) if (r2.noext || !lt(n3) || "(" !== t2.charAt(u3)) c3 += n3;
      else {
        e2.push(c3), c3 = "";
        const o3 = new _vt(n3, e2);
        u3 = __privateMethod(_a3 = _vt, _vt_static, p_fn).call(_a3, t2, o3, u3, r2), e2.push(o3);
      }
      else i2 = true, s2 = u3, a2 = false, c3 += n3;
    }
    return e2.push(c3), u3;
  }
  let u2 = n2 + 1, c2 = new _vt(null, e2);
  const l2 = [];
  let h2 = "";
  for (; u2 < t2.length; ) {
    const n3 = t2.charAt(u2++);
    if (o2 || "\\" === n3) o2 = !o2, h2 += n3;
    else if (i2) u2 === s2 + 1 ? "^" !== n3 && "!" !== n3 || (a2 = true) : "]" !== n3 || u2 === s2 + 2 && a2 || (i2 = false), h2 += n3;
    else if ("[" !== n3) if (lt(n3) && "(" === t2.charAt(u2)) {
      c2.push(h2), h2 = "";
      const e3 = new _vt(n3, c2);
      c2.push(e3), u2 = __privateMethod(_b = _vt, _vt_static, p_fn).call(_b, t2, e3, u2, r2);
    } else if ("|" !== n3) {
      if (")" === n3) return "" === h2 && 0 === __privateGet(e2, _r).length && __privateSet(e2, _l, true), c2.push(h2), h2 = "", e2.push(...l2, c2), u2;
      h2 += n3;
    } else c2.push(h2), h2 = "", l2.push(c2), c2 = new _vt(null, e2);
    else i2 = true, s2 = u2, a2 = false, h2 += n3;
  }
  return e2.type = null, __privateSet(e2, _e2, void 0), __privateSet(e2, _r, [t2.substring(n2 - 1)]), u2;
};
d_fn = function(t2) {
  return __privateGet(this, _r).map((e2) => {
    if ("string" == typeof e2) throw new Error("string type in extglob ast??");
    const [n2, r2, o2, i2] = e2.toRegExpSource(t2);
    return __privateSet(this, _n, __privateGet(this, _n) || i2), n2;
  }).filter((t3) => !(this.isStart() && this.isEnd() && !t3)).join("|");
};
f_fn = function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], r2 = false, o2 = "", i2 = false;
  for (let s2 = 0; s2 < t2.length; s2++) {
    const a2 = t2.charAt(s2);
    if (r2) r2 = false, o2 += (dt.has(a2) ? "\\" : "") + a2;
    else if ("\\" !== a2) {
      if ("[" === a2) {
        const [n3, r3, a3, u2] = at(t2, s2);
        if (a3) {
          o2 += n3, i2 = i2 || r3, s2 += a3 - 1, e2 = e2 || u2;
          continue;
        }
      }
      "*" !== a2 ? "?" !== a2 ? o2 += a2.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : (o2 += gt, e2 = true) : (o2 += n2 && "*" === t2 ? yt : mt, e2 = true);
    } else s2 === t2.length - 1 ? o2 += "\\\\" : r2 = true;
  }
  return [o2, ut(t2), !!e2, i2];
};
__privateAdd(_vt, _vt_static);
let vt = _vt;
const bt = function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  return rt(e2), !(!n2.nocomment && "#" === e2.charAt(0)) && new Gt(e2, n2).match(t2);
}, wt = /^\*+([^+@!?\*\[\(]*)$/, xt = (t2) => (e2) => !e2.startsWith(".") && e2.endsWith(t2), Nt = (t2) => (e2) => e2.endsWith(t2), Pt = (t2) => (t2 = t2.toLowerCase(), (e2) => !e2.startsWith(".") && e2.toLowerCase().endsWith(t2)), At = (t2) => (t2 = t2.toLowerCase(), (e2) => e2.toLowerCase().endsWith(t2)), Ot = /^\*+\.\*+$/, Et = (t2) => !t2.startsWith(".") && t2.includes("."), Tt = (t2) => "." !== t2 && ".." !== t2 && t2.includes("."), jt = /^\.\*+$/, St = (t2) => "." !== t2 && ".." !== t2 && t2.startsWith("."), $t = /^\*+$/, Ct = (t2) => 0 !== t2.length && !t2.startsWith("."), It = (t2) => 0 !== t2.length && "." !== t2 && ".." !== t2, kt = /^\?+([^+@!?\*\[\(]*)?$/, Rt = (t2) => {
  let [e2, n2 = ""] = t2;
  const r2 = Ut([e2]);
  return n2 ? (n2 = n2.toLowerCase(), (t3) => r2(t3) && t3.toLowerCase().endsWith(n2)) : r2;
}, Lt = (t2) => {
  let [e2, n2 = ""] = t2;
  const r2 = Ft([e2]);
  return n2 ? (n2 = n2.toLowerCase(), (t3) => r2(t3) && t3.toLowerCase().endsWith(n2)) : r2;
}, _t = (t2) => {
  let [e2, n2 = ""] = t2;
  const r2 = Ft([e2]);
  return n2 ? (t3) => r2(t3) && t3.endsWith(n2) : r2;
}, Mt = (t2) => {
  let [e2, n2 = ""] = t2;
  const r2 = Ut([e2]);
  return n2 ? (t3) => r2(t3) && t3.endsWith(n2) : r2;
}, Ut = (t2) => {
  let [e2] = t2;
  const n2 = e2.length;
  return (t3) => t3.length === n2 && !t3.startsWith(".");
}, Ft = (t2) => {
  let [e2] = t2;
  const n2 = e2.length;
  return (t3) => t3.length === n2 && "." !== t3 && ".." !== t3;
}, Dt = "object" == typeof process$1 && process$1 ? "object" == typeof define_process_env_default$1 && define_process_env_default$1 && define_process_env_default$1.__MINIMATCH_TESTING_PLATFORM__ || process$1.platform : "posix";
bt.sep = "win32" === Dt ? "\\" : "/";
const Bt = Symbol("globstar **");
bt.GLOBSTAR = Bt, bt.filter = function(t2) {
  let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
  return (n2) => bt(n2, t2, e2);
};
const Wt = function(t2) {
  let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
  return Object.assign({}, t2, e2);
};
bt.defaults = (t2) => {
  if (!t2 || "object" != typeof t2 || !Object.keys(t2).length) return bt;
  const e2 = bt;
  return Object.assign(function(n2, r2) {
    return e2(n2, r2, Wt(t2, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}));
  }, { Minimatch: class extends e2.Minimatch {
    constructor(e3) {
      super(e3, Wt(t2, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}));
    }
    static defaults(n2) {
      return e2.defaults(Wt(t2, n2)).Minimatch;
    }
  }, AST: class extends e2.AST {
    constructor(e3, n2) {
      super(e3, n2, Wt(t2, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}));
    }
    static fromGlob(n2) {
      let r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return e2.AST.fromGlob(n2, Wt(t2, r2));
    }
  }, unescape: function(n2) {
    let r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return e2.unescape(n2, Wt(t2, r2));
  }, escape: function(n2) {
    let r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return e2.escape(n2, Wt(t2, r2));
  }, filter: function(n2) {
    let r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return e2.filter(n2, Wt(t2, r2));
  }, defaults: (n2) => e2.defaults(Wt(t2, n2)), makeRe: function(n2) {
    let r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return e2.makeRe(n2, Wt(t2, r2));
  }, braceExpand: function(n2) {
    let r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return e2.braceExpand(n2, Wt(t2, r2));
  }, match: function(n2, r2) {
    let o2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    return e2.match(n2, r2, Wt(t2, o2));
  }, sep: e2.sep, GLOBSTAR: Bt });
};
const Vt = function(t2) {
  let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
  return rt(t2), e2.nobrace || !/\{(?:(?!\{).)*\}/.test(t2) ? [t2] : nt(t2);
};
bt.braceExpand = Vt, bt.makeRe = function(t2) {
  return new Gt(t2, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).makeRe();
}, bt.match = function(t2, e2) {
  const n2 = new Gt(e2, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {});
  return t2 = t2.filter((t3) => n2.match(t3)), n2.options.nonull && !t2.length && t2.push(e2), t2;
};
const zt = /[?*]|[+@!]\(.*?\)|\[|\]/;
class Gt {
  constructor(t2) {
    __publicField(this, "options");
    __publicField(this, "set");
    __publicField(this, "pattern");
    __publicField(this, "windowsPathsNoEscape");
    __publicField(this, "nonegate");
    __publicField(this, "negate");
    __publicField(this, "comment");
    __publicField(this, "empty");
    __publicField(this, "preserveMultipleSlashes");
    __publicField(this, "partial");
    __publicField(this, "globSet");
    __publicField(this, "globParts");
    __publicField(this, "nocase");
    __publicField(this, "isWindows");
    __publicField(this, "platform");
    __publicField(this, "windowsNoMagicRoot");
    __publicField(this, "regexp");
    let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    rt(t2), e2 = e2 || {}, this.options = e2, this.pattern = t2, this.platform = e2.platform || Dt, this.isWindows = "win32" === this.platform, this.windowsPathsNoEscape = !!e2.windowsPathsNoEscape || false === e2.allowWindowsEscape, this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")), this.preserveMultipleSlashes = !!e2.preserveMultipleSlashes, this.regexp = null, this.negate = false, this.nonegate = !!e2.nonegate, this.comment = false, this.empty = false, this.partial = !!e2.partial, this.nocase = !!this.options.nocase, this.windowsNoMagicRoot = void 0 !== e2.windowsNoMagicRoot ? e2.windowsNoMagicRoot : !(!this.isWindows || !this.nocase), this.globSet = [], this.globParts = [], this.set = [], this.make();
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) return true;
    for (const t2 of this.set) for (const e2 of t2) if ("string" != typeof e2) return true;
    return false;
  }
  debug() {
  }
  make() {
    const t2 = this.pattern, e2 = this.options;
    if (!e2.nocomment && "#" === t2.charAt(0)) return void (this.comment = true);
    if (!t2) return void (this.empty = true);
    this.parseNegate(), this.globSet = [...new Set(this.braceExpand())], e2.debug && (this.debug = function() {
      return console.error(...arguments);
    }), this.debug(this.pattern, this.globSet);
    const n2 = this.globSet.map((t3) => this.slashSplit(t3));
    this.globParts = this.preprocess(n2), this.debug(this.pattern, this.globParts);
    let r2 = this.globParts.map((t3, e3, n3) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        const e4 = !("" !== t3[0] || "" !== t3[1] || "?" !== t3[2] && zt.test(t3[2]) || zt.test(t3[3])), n4 = /^[a-z]:/i.test(t3[0]);
        if (e4) return [...t3.slice(0, 4), ...t3.slice(4).map((t4) => this.parse(t4))];
        if (n4) return [t3[0], ...t3.slice(1).map((t4) => this.parse(t4))];
      }
      return t3.map((t4) => this.parse(t4));
    });
    if (this.debug(this.pattern, r2), this.set = r2.filter((t3) => -1 === t3.indexOf(false)), this.isWindows) for (let t3 = 0; t3 < this.set.length; t3++) {
      const e3 = this.set[t3];
      "" === e3[0] && "" === e3[1] && "?" === this.globParts[t3][2] && "string" == typeof e3[3] && /^[a-z]:$/i.test(e3[3]) && (e3[2] = "?");
    }
    this.debug(this.pattern, this.set);
  }
  preprocess(t2) {
    if (this.options.noglobstar) for (let e3 = 0; e3 < t2.length; e3++) for (let n2 = 0; n2 < t2[e3].length; n2++) "**" === t2[e3][n2] && (t2[e3][n2] = "*");
    const { optimizationLevel: e2 = 1 } = this.options;
    return e2 >= 2 ? (t2 = this.firstPhasePreProcess(t2), t2 = this.secondPhasePreProcess(t2)) : t2 = e2 >= 1 ? this.levelOneOptimize(t2) : this.adjascentGlobstarOptimize(t2), t2;
  }
  adjascentGlobstarOptimize(t2) {
    return t2.map((t3) => {
      let e2 = -1;
      for (; -1 !== (e2 = t3.indexOf("**", e2 + 1)); ) {
        let n2 = e2;
        for (; "**" === t3[n2 + 1]; ) n2++;
        n2 !== e2 && t3.splice(e2, n2 - e2);
      }
      return t3;
    });
  }
  levelOneOptimize(t2) {
    return t2.map((t3) => 0 === (t3 = t3.reduce((t4, e2) => {
      const n2 = t4[t4.length - 1];
      return "**" === e2 && "**" === n2 ? t4 : ".." === e2 && n2 && ".." !== n2 && "." !== n2 && "**" !== n2 ? (t4.pop(), t4) : (t4.push(e2), t4);
    }, [])).length ? [""] : t3);
  }
  levelTwoFileOptimize(t2) {
    Array.isArray(t2) || (t2 = this.slashSplit(t2));
    let e2 = false;
    do {
      if (e2 = false, !this.preserveMultipleSlashes) {
        for (let n3 = 1; n3 < t2.length - 1; n3++) {
          const r2 = t2[n3];
          1 === n3 && "" === r2 && "" === t2[0] || "." !== r2 && "" !== r2 || (e2 = true, t2.splice(n3, 1), n3--);
        }
        "." !== t2[0] || 2 !== t2.length || "." !== t2[1] && "" !== t2[1] || (e2 = true, t2.pop());
      }
      let n2 = 0;
      for (; -1 !== (n2 = t2.indexOf("..", n2 + 1)); ) {
        const r2 = t2[n2 - 1];
        r2 && "." !== r2 && ".." !== r2 && "**" !== r2 && (e2 = true, t2.splice(n2 - 1, 2), n2 -= 2);
      }
    } while (e2);
    return 0 === t2.length ? [""] : t2;
  }
  firstPhasePreProcess(t2) {
    let e2 = false;
    do {
      e2 = false;
      for (let n2 of t2) {
        let r2 = -1;
        for (; -1 !== (r2 = n2.indexOf("**", r2 + 1)); ) {
          let o3 = r2;
          for (; "**" === n2[o3 + 1]; ) o3++;
          o3 > r2 && n2.splice(r2 + 1, o3 - r2);
          let i2 = n2[r2 + 1];
          const s2 = n2[r2 + 2], a2 = n2[r2 + 3];
          if (".." !== i2) continue;
          if (!s2 || "." === s2 || ".." === s2 || !a2 || "." === a2 || ".." === a2) continue;
          e2 = true, n2.splice(r2, 1);
          const u2 = n2.slice(0);
          u2[r2] = "**", t2.push(u2), r2--;
        }
        if (!this.preserveMultipleSlashes) {
          for (let t3 = 1; t3 < n2.length - 1; t3++) {
            const r3 = n2[t3];
            1 === t3 && "" === r3 && "" === n2[0] || "." !== r3 && "" !== r3 || (e2 = true, n2.splice(t3, 1), t3--);
          }
          "." !== n2[0] || 2 !== n2.length || "." !== n2[1] && "" !== n2[1] || (e2 = true, n2.pop());
        }
        let o2 = 0;
        for (; -1 !== (o2 = n2.indexOf("..", o2 + 1)); ) {
          const t3 = n2[o2 - 1];
          if (t3 && "." !== t3 && ".." !== t3 && "**" !== t3) {
            e2 = true;
            const t4 = 1 === o2 && "**" === n2[o2 + 1] ? ["."] : [];
            n2.splice(o2 - 1, 2, ...t4), 0 === n2.length && n2.push(""), o2 -= 2;
          }
        }
      }
    } while (e2);
    return t2;
  }
  secondPhasePreProcess(t2) {
    for (let e2 = 0; e2 < t2.length - 1; e2++) for (let n2 = e2 + 1; n2 < t2.length; n2++) {
      const r2 = this.partsMatch(t2[e2], t2[n2], !this.preserveMultipleSlashes);
      if (r2) {
        t2[e2] = [], t2[n2] = r2;
        break;
      }
    }
    return t2.filter((t3) => t3.length);
  }
  partsMatch(t2, e2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], r2 = 0, o2 = 0, i2 = [], s2 = "";
    for (; r2 < t2.length && o2 < e2.length; ) if (t2[r2] === e2[o2]) i2.push("b" === s2 ? e2[o2] : t2[r2]), r2++, o2++;
    else if (n2 && "**" === t2[r2] && e2[o2] === t2[r2 + 1]) i2.push(t2[r2]), r2++;
    else if (n2 && "**" === e2[o2] && t2[r2] === e2[o2 + 1]) i2.push(e2[o2]), o2++;
    else if ("*" !== t2[r2] || !e2[o2] || !this.options.dot && e2[o2].startsWith(".") || "**" === e2[o2]) {
      if ("*" !== e2[o2] || !t2[r2] || !this.options.dot && t2[r2].startsWith(".") || "**" === t2[r2]) return false;
      if ("a" === s2) return false;
      s2 = "b", i2.push(e2[o2]), r2++, o2++;
    } else {
      if ("b" === s2) return false;
      s2 = "a", i2.push(t2[r2]), r2++, o2++;
    }
    return t2.length === e2.length && i2;
  }
  parseNegate() {
    if (this.nonegate) return;
    const t2 = this.pattern;
    let e2 = false, n2 = 0;
    for (let r2 = 0; r2 < t2.length && "!" === t2.charAt(r2); r2++) e2 = !e2, n2++;
    n2 && (this.pattern = t2.slice(n2)), this.negate = e2;
  }
  matchOne(t2, e2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
    const r2 = this.options;
    if (this.isWindows) {
      const n3 = "string" == typeof t2[0] && /^[a-z]:$/i.test(t2[0]), r3 = !n3 && "" === t2[0] && "" === t2[1] && "?" === t2[2] && /^[a-z]:$/i.test(t2[3]), o3 = "string" == typeof e2[0] && /^[a-z]:$/i.test(e2[0]), i3 = r3 ? 3 : n3 ? 0 : void 0, s3 = !o3 && "" === e2[0] && "" === e2[1] && "?" === e2[2] && "string" == typeof e2[3] && /^[a-z]:$/i.test(e2[3]) ? 3 : o3 ? 0 : void 0;
      if ("number" == typeof i3 && "number" == typeof s3) {
        const [n4, r4] = [t2[i3], e2[s3]];
        n4.toLowerCase() === r4.toLowerCase() && (e2[s3] = n4, s3 > i3 ? e2 = e2.slice(s3) : i3 > s3 && (t2 = t2.slice(i3)));
      }
    }
    const { optimizationLevel: o2 = 1 } = this.options;
    o2 >= 2 && (t2 = this.levelTwoFileOptimize(t2)), this.debug("matchOne", this, { file: t2, pattern: e2 }), this.debug("matchOne", t2.length, e2.length);
    for (var i2 = 0, s2 = 0, a2 = t2.length, u2 = e2.length; i2 < a2 && s2 < u2; i2++, s2++) {
      this.debug("matchOne loop");
      var c2 = e2[s2], l2 = t2[i2];
      if (this.debug(e2, c2, l2), false === c2) return false;
      if (c2 === Bt) {
        this.debug("GLOBSTAR", [e2, c2, l2]);
        var h2 = i2, p2 = s2 + 1;
        if (p2 === u2) {
          for (this.debug("** at the end"); i2 < a2; i2++) if ("." === t2[i2] || ".." === t2[i2] || !r2.dot && "." === t2[i2].charAt(0)) return false;
          return true;
        }
        for (; h2 < a2; ) {
          var f2 = t2[h2];
          if (this.debug("\nglobstar while", t2, h2, e2, p2, f2), this.matchOne(t2.slice(h2), e2.slice(p2), n2)) return this.debug("globstar found match!", h2, a2, f2), true;
          if ("." === f2 || ".." === f2 || !r2.dot && "." === f2.charAt(0)) {
            this.debug("dot detected!", t2, h2, e2, p2);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), h2++;
        }
        return !(!n2 || (this.debug("\n>>> no match, partial?", t2, h2, e2, p2), h2 !== a2));
      }
      let o3;
      if ("string" == typeof c2 ? (o3 = l2 === c2, this.debug("string match", c2, l2, o3)) : (o3 = c2.test(l2), this.debug("pattern match", c2, l2, o3)), !o3) return false;
    }
    if (i2 === a2 && s2 === u2) return true;
    if (i2 === a2) return n2;
    if (s2 === u2) return i2 === a2 - 1 && "" === t2[i2];
    throw new Error("wtf?");
  }
  braceExpand() {
    return Vt(this.pattern, this.options);
  }
  parse(t2) {
    rt(t2);
    const e2 = this.options;
    if ("**" === t2) return Bt;
    if ("" === t2) return "";
    let n2, r2 = null;
    (n2 = t2.match($t)) ? r2 = e2.dot ? It : Ct : (n2 = t2.match(wt)) ? r2 = (e2.nocase ? e2.dot ? At : Pt : e2.dot ? Nt : xt)(n2[1]) : (n2 = t2.match(kt)) ? r2 = (e2.nocase ? e2.dot ? Lt : Rt : e2.dot ? _t : Mt)(n2) : (n2 = t2.match(Ot)) ? r2 = e2.dot ? Tt : Et : (n2 = t2.match(jt)) && (r2 = St);
    const o2 = vt.fromGlob(t2, this.options).toMMPattern();
    return r2 && "object" == typeof o2 && Reflect.defineProperty(o2, "test", { value: r2 }), o2;
  }
  makeRe() {
    if (this.regexp || false === this.regexp) return this.regexp;
    const t2 = this.set;
    if (!t2.length) return this.regexp = false, this.regexp;
    const e2 = this.options, n2 = e2.noglobstar ? "[^/]*?" : e2.dot ? "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?" : "(?:(?!(?:\\/|^)\\.).)*?", r2 = new Set(e2.nocase ? ["i"] : []);
    let o2 = t2.map((t3) => {
      const e3 = t3.map((t4) => {
        if (t4 instanceof RegExp) for (const e4 of t4.flags.split("")) r2.add(e4);
        return "string" == typeof t4 ? t4.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : t4 === Bt ? Bt : t4._src;
      });
      return e3.forEach((t4, r3) => {
        const o3 = e3[r3 + 1], i3 = e3[r3 - 1];
        t4 === Bt && i3 !== Bt && (void 0 === i3 ? void 0 !== o3 && o3 !== Bt ? e3[r3 + 1] = "(?:\\/|" + n2 + "\\/)?" + o3 : e3[r3] = n2 : void 0 === o3 ? e3[r3 - 1] = i3 + "(?:\\/|" + n2 + ")?" : o3 !== Bt && (e3[r3 - 1] = i3 + "(?:\\/|\\/" + n2 + "\\/)" + o3, e3[r3 + 1] = Bt));
      }), e3.filter((t4) => t4 !== Bt).join("/");
    }).join("|");
    const [i2, s2] = t2.length > 1 ? ["(?:", ")"] : ["", ""];
    o2 = "^" + i2 + o2 + s2 + "$", this.negate && (o2 = "^(?!" + o2 + ").+$");
    try {
      this.regexp = new RegExp(o2, [...r2].join(""));
    } catch (t3) {
      this.regexp = false;
    }
    return this.regexp;
  }
  slashSplit(t2) {
    return this.preserveMultipleSlashes ? t2.split("/") : this.isWindows && /^\/\/[^\/]+/.test(t2) ? ["", ...t2.split(/\/+/)] : t2.split(/\/+/);
  }
  match(t2) {
    let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.partial;
    if (this.debug("match", t2, this.pattern), this.comment) return false;
    if (this.empty) return "" === t2;
    if ("/" === t2 && e2) return true;
    const n2 = this.options;
    this.isWindows && (t2 = t2.split("\\").join("/"));
    const r2 = this.slashSplit(t2);
    this.debug(this.pattern, "split", r2);
    const o2 = this.set;
    this.debug(this.pattern, "set", o2);
    let i2 = r2[r2.length - 1];
    if (!i2) for (let t3 = r2.length - 2; !i2 && t3 >= 0; t3--) i2 = r2[t3];
    for (let t3 = 0; t3 < o2.length; t3++) {
      const s2 = o2[t3];
      let a2 = r2;
      if (n2.matchBase && 1 === s2.length && (a2 = [i2]), this.matchOne(a2, s2, e2)) return !!n2.flipNegate || !this.negate;
    }
    return !n2.flipNegate && this.negate;
  }
  static defaults(t2) {
    return bt.defaults(t2).Minimatch;
  }
}
function qt(t2) {
  const e2 = new Error("".concat(arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", "Invalid response: ").concat(t2.status, " ").concat(t2.statusText));
  return e2.status = t2.status, e2.response = t2, e2;
}
function Ht(t2, e2) {
  const { status: n2 } = e2;
  if (401 === n2 && t2.digest) return e2;
  if (n2 >= 400) throw qt(e2);
  return e2;
}
function Xt(t2, e2) {
  return arguments.length > 2 && void 0 !== arguments[2] && arguments[2] ? { data: e2, headers: t2.headers ? V(t2.headers) : {}, status: t2.status, statusText: t2.statusText } : e2;
}
bt.AST = vt, bt.Minimatch = Gt, bt.escape = function(t2) {
  let { windowsPathsNoEscape: e2 = false } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
  return e2 ? t2.replace(/[?*()[\]]/g, "[$&]") : t2.replace(/[?*()[\]\\]/g, "\\$&");
}, bt.unescape = ut;
const Zt = (Yt = function(t2, e2, n2) {
  let r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
  const o2 = tt({ url: y(t2.remoteURL, f(e2)), method: "COPY", headers: { Destination: y(t2.remoteURL, f(n2)), Overwrite: false === r2.overwrite ? "F" : "T", Depth: r2.shallow ? "0" : "infinity" } }, t2, r2);
  return s2 = function(e3) {
    Ht(t2, e3);
  }, (i2 = Q(o2, t2)) && i2.then || (i2 = Promise.resolve(i2)), s2 ? i2.then(s2) : i2;
  var i2, s2;
}, function() {
  for (var t2 = [], e2 = 0; e2 < arguments.length; e2++) t2[e2] = arguments[e2];
  try {
    return Promise.resolve(Yt.apply(this, t2));
  } catch (t3) {
    return Promise.reject(t3);
  }
});
var Yt, Kt = n(635), Jt = n(829), Qt = n.n(Jt), te = function(t2) {
  return t2.Array = "array", t2.Object = "object", t2.Original = "original", t2;
}(te || {});
function ee(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : te.Original;
  const r2 = Qt().get(t2, e2);
  return "array" === n2 && false === Array.isArray(r2) ? [r2] : "object" === n2 && Array.isArray(r2) ? r2[0] : r2;
}
function ne(t2) {
  return new Promise((e2) => {
    e2(function(t3) {
      const { multistatus: e3 } = t3;
      if ("" === e3) return { multistatus: { response: [] } };
      if (!e3) throw new Error("Invalid response: No root multistatus found");
      const n2 = { multistatus: Array.isArray(e3) ? e3[0] : e3 };
      return Qt().set(n2, "multistatus.response", ee(n2, "multistatus.response", te.Array)), Qt().set(n2, "multistatus.response", Qt().get(n2, "multistatus.response").map((t4) => function(t5) {
        const e4 = Object.assign({}, t5);
        return e4.status ? Qt().set(e4, "status", ee(e4, "status", te.Object)) : (Qt().set(e4, "propstat", ee(e4, "propstat", te.Object)), Qt().set(e4, "propstat.prop", ee(e4, "propstat.prop", te.Object))), e4;
      }(t4))), n2;
    }(new Kt.XMLParser({ removeNSPrefix: true, numberParseOptions: { hex: true, leadingZeros: false } }).parse(t2)));
  });
}
function re(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
  const { getlastmodified: r2 = null, getcontentlength: o2 = "0", resourcetype: i2 = null, getcontenttype: s2 = null, getetag: a2 = null } = t2, u2 = i2 && "object" == typeof i2 && void 0 !== i2.collection ? "directory" : "file", c2 = { filename: e2, basename: l().basename(e2), lastmod: r2, size: parseInt(o2, 10), type: u2, etag: "string" == typeof a2 ? a2.replace(/"/g, "") : null };
  return "file" === u2 && (c2.mime = s2 && "string" == typeof s2 ? s2.split(";")[0] : ""), n2 && (void 0 !== t2.displayname && (t2.displayname = String(t2.displayname)), c2.props = t2), c2;
}
function oe(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], r2 = null;
  try {
    t2.multistatus.response[0].propstat && (r2 = t2.multistatus.response[0]);
  } catch (t3) {
  }
  if (!r2) throw new Error("Failed getting item stat: bad response");
  const { propstat: { prop: o2, status: i2 } } = r2, [s2, a2, u2] = i2.split(" ", 3), c2 = parseInt(a2, 10);
  if (c2 >= 400) {
    const t3 = new Error("Invalid response: ".concat(c2, " ").concat(u2));
    throw t3.status = c2, t3;
  }
  return re(o2, g(e2), n2);
}
function ie(t2) {
  switch (String(t2)) {
    case "-3":
      return "unlimited";
    case "-2":
    case "-1":
      return "unknown";
    default:
      return parseInt(String(t2), 10);
  }
}
function se(t2, e2, n2) {
  return t2 && t2.then || (t2 = Promise.resolve(t2)), e2 ? t2.then(e2) : t2;
}
const ae = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const { details: r2 = false } = n2, o2 = tt({ url: y(t2.remoteURL, f(e2)), method: "PROPFIND", headers: { Accept: "text/plain,application/xml", Depth: "0" } }, t2, n2);
  return se(Q(o2, t2), function(n3) {
    return Ht(t2, n3), se(n3.text(), function(t3) {
      return se(ne(t3), function(t4) {
        const o3 = oe(t4, e2, r2);
        return Xt(n3, o3, r2);
      });
    });
  });
});
function ue(t2, e2, n2) {
  return t2 && t2.then || (t2 = Promise.resolve(t2)), e2 ? t2.then(e2) : t2;
}
const ce = le(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const r2 = function(t3) {
    if (!t3 || "/" === t3) return [];
    let e3 = t3;
    const n3 = [];
    do {
      n3.push(e3), e3 = l().dirname(e3);
    } while (e3 && "/" !== e3);
    return n3;
  }(g(e2));
  r2.sort((t3, e3) => t3.length > e3.length ? 1 : e3.length > t3.length ? -1 : 0);
  let o2 = false;
  return function(t3, e3, n3) {
    if ("function" == typeof t3[fe]) {
      let l2 = function(t4) {
        try {
          for (; !(r3 = s2.next()).done; ) if ((t4 = e3(r3.value)) && t4.then) {
            if (!me(t4)) return void t4.then(l2, i2 || (i2 = de.bind(null, o3 = new ge(), 2)));
            t4 = t4.v;
          }
          o3 ? de(o3, 1, t4) : o3 = t4;
        } catch (t5) {
          de(o3 || (o3 = new ge()), 2, t5);
        }
      };
      var r3, o3, i2, s2 = t3[fe]();
      if (l2(), s2.return) {
        var a2 = function(t4) {
          try {
            r3.done || s2.return();
          } catch (t5) {
          }
          return t4;
        };
        if (o3 && o3.then) return o3.then(a2, function(t4) {
          throw a2(t4);
        });
        a2();
      }
      return o3;
    }
    if (!("length" in t3)) throw new TypeError("Object is not iterable");
    for (var u2 = [], c2 = 0; c2 < t3.length; c2++) u2.push(t3[c2]);
    return function(t4, e4, n4) {
      var r4, o4, i3 = -1;
      return function s3(a3) {
        try {
          for (; ++i3 < t4.length && (!n4 || !n4()); ) if ((a3 = e4(i3)) && a3.then) {
            if (!me(a3)) return void a3.then(s3, o4 || (o4 = de.bind(null, r4 = new ge(), 2)));
            a3 = a3.v;
          }
          r4 ? de(r4, 1, a3) : r4 = a3;
        } catch (t5) {
          de(r4 || (r4 = new ge()), 2, t5);
        }
      }(), r4;
    }(u2, function(t4) {
      return e3(u2[t4]);
    }, n3);
  }(r2, function(r3) {
    return i2 = function() {
      return function(n3, o3) {
        try {
          var i3 = ue(ae(t2, r3), function(t3) {
            if ("directory" !== t3.type) throw new Error("Path includes a file: ".concat(e2));
          });
        } catch (t3) {
          return o3(t3);
        }
        return i3 && i3.then ? i3.then(void 0, o3) : i3;
      }(0, function(e3) {
        const i3 = e3;
        return function() {
          if (404 === i3.status) return o2 = true, pe(ye(t2, r3, __spreadProps(__spreadValues({}, n2), { recursive: false })));
          throw e3;
        }();
      });
    }, (s2 = function() {
      if (o2) return pe(ye(t2, r3, __spreadProps(__spreadValues({}, n2), { recursive: false })));
    }()) && s2.then ? s2.then(i2) : i2();
    var i2, s2;
  }, function() {
    return false;
  });
});
function le(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}
function he() {
}
function pe(t2, e2) {
  return t2 && t2.then ? t2.then(he) : Promise.resolve();
}
const fe = "undefined" != typeof Symbol ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
function de(t2, e2, n2) {
  if (!t2.s) {
    if (n2 instanceof ge) {
      if (!n2.s) return void (n2.o = de.bind(null, t2, e2));
      1 & e2 && (e2 = n2.s), n2 = n2.v;
    }
    if (n2 && n2.then) return void n2.then(de.bind(null, t2, e2), de.bind(null, t2, 2));
    t2.s = e2, t2.v = n2;
    const r2 = t2.o;
    r2 && r2(t2);
  }
}
const ge = function() {
  function t2() {
  }
  return t2.prototype.then = function(e2, n2) {
    const r2 = new t2(), o2 = this.s;
    if (o2) {
      const t3 = 1 & o2 ? e2 : n2;
      if (t3) {
        try {
          de(r2, 1, t3(this.v));
        } catch (t4) {
          de(r2, 2, t4);
        }
        return r2;
      }
      return this;
    }
    return this.o = function(t3) {
      try {
        const o3 = t3.v;
        1 & t3.s ? de(r2, 1, e2 ? e2(o3) : o3) : n2 ? de(r2, 1, n2(o3)) : de(r2, 2, o3);
      } catch (t4) {
        de(r2, 2, t4);
      }
    }, r2;
  }, t2;
}();
function me(t2) {
  return t2 instanceof ge && 1 & t2.s;
}
const ye = le(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  if (true === n2.recursive) return ce(t2, e2, n2);
  const r2 = tt({ url: y(t2.remoteURL, (o2 = f(e2), o2.endsWith("/") ? o2 : o2 + "/")), method: "MKCOL" }, t2, n2);
  var o2;
  return ue(Q(r2, t2), function(e3) {
    Ht(t2, e3);
  });
});
var ve = n(388), be = n.n(ve);
const we = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const r2 = {};
  if ("object" == typeof n2.range && "number" == typeof n2.range.start) {
    let t3 = "bytes=".concat(n2.range.start, "-");
    "number" == typeof n2.range.end && (t3 = "".concat(t3).concat(n2.range.end)), r2.Range = t3;
  }
  const o2 = tt({ url: y(t2.remoteURL, f(e2)), method: "GET", headers: r2 }, t2, n2);
  return s2 = function(e3) {
    if (Ht(t2, e3), r2.Range && 206 !== e3.status) {
      const t3 = new Error("Invalid response code for partial request: ".concat(e3.status));
      throw t3.status = e3.status, t3;
    }
    return n2.callback && setTimeout(() => {
      n2.callback(e3);
    }, 0), e3.body;
  }, (i2 = Q(o2, t2)) && i2.then || (i2 = Promise.resolve(i2)), s2 ? i2.then(s2) : i2;
  var i2, s2;
}), xe = () => {
}, Ne = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2, n2) {
  n2.url || (n2.url = y(t2.remoteURL, f(e2)));
  const r2 = tt(n2, t2, {});
  return i2 = function(e3) {
    return Ht(t2, e3), e3;
  }, (o2 = Q(r2, t2)) && o2.then || (o2 = Promise.resolve(o2)), i2 ? o2.then(i2) : o2;
  var o2, i2;
}), Pe = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const r2 = tt({ url: y(t2.remoteURL, f(e2)), method: "DELETE" }, t2, n2);
  return i2 = function(e3) {
    Ht(t2, e3);
  }, (o2 = Q(r2, t2)) && o2.then || (o2 = Promise.resolve(o2)), i2 ? o2.then(i2) : o2;
  var o2, i2;
}), Ae = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  return function(r2, o2) {
    try {
      var i2 = (s2 = ae(t2, e2, n2), a2 = function() {
        return true;
      }, u2 ? a2 ? a2(s2) : s2 : (s2 && s2.then || (s2 = Promise.resolve(s2)), a2 ? s2.then(a2) : s2));
    } catch (t3) {
      return o2(t3);
    }
    var s2, a2, u2;
    return i2 && i2.then ? i2.then(void 0, o2) : i2;
  }(0, function(t3) {
    if (404 === t3.status) return false;
    throw t3;
  });
});
function Oe(t2, e2, n2) {
  return t2 && t2.then || (t2 = Promise.resolve(t2)), e2 ? t2.then(e2) : t2;
}
const Ee = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const r2 = tt({ url: y(t2.remoteURL, f(e2), "/"), method: "PROPFIND", headers: { Accept: "text/plain,application/xml", Depth: n2.deep ? "infinity" : "1" } }, t2, n2);
  return Oe(Q(r2, t2), function(r3) {
    return Ht(t2, r3), Oe(r3.text(), function(o2) {
      if (!o2) throw new Error("Failed parsing directory contents: Empty response");
      return Oe(ne(o2), function(o3) {
        const i2 = d(e2);
        let s2 = function(t3, e3, n3) {
          let r4 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], o4 = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
          const i3 = l().join(e3, "/"), { multistatus: { response: s3 } } = t3, a2 = s3.map((t4) => {
            const e4 = function(t5) {
              try {
                return t5.replace(/^https?:\/\/[^\/]+/, "");
              } catch (t6) {
                throw new u(t6, "Failed normalising HREF");
              }
            }(t4.href), { propstat: { prop: n4 } } = t4;
            return re(n4, "/" === i3 ? decodeURIComponent(g(e4)) : g(l().relative(decodeURIComponent(i3), decodeURIComponent(e4))), r4);
          });
          return o4 ? a2 : a2.filter((t4) => t4.basename && ("file" === t4.type || t4.filename !== n3.replace(/\/$/, "")));
        }(o3, d(t2.remoteBasePath || t2.remotePath), i2, n2.details, n2.includeSelf);
        return n2.glob && (s2 = function(t3, e3) {
          return t3.filter((t4) => bt(t4.filename, e3, { matchBase: true }));
        }(s2, n2.glob)), Xt(r3, s2, n2.details);
      });
    });
  });
});
function Te(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}
const je = Te(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const r2 = tt({ url: y(t2.remoteURL, f(e2)), method: "GET", headers: { Accept: "text/plain" }, transformResponse: [Ie] }, t2, n2);
  return Se(Q(r2, t2), function(e3) {
    return Ht(t2, e3), Se(e3.text(), function(t3) {
      return Xt(e3, t3, n2.details);
    });
  });
});
function Se(t2, e2, n2) {
  return t2 && t2.then || (t2 = Promise.resolve(t2)), e2 ? t2.then(e2) : t2;
}
const $e = Te(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const r2 = tt({ url: y(t2.remoteURL, f(e2)), method: "GET" }, t2, n2);
  return Se(Q(r2, t2), function(e3) {
    let r3;
    return Ht(t2, e3), function(t3, e4) {
      var n3 = t3();
      return n3 && n3.then ? n3.then(e4) : e4();
    }(function() {
      return Se(e3.arrayBuffer(), function(t3) {
        r3 = t3;
      });
    }, function() {
      return Xt(e3, r3, n2.details);
    });
  });
}), Ce = Te(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const { format: r2 = "binary" } = n2;
  if ("binary" !== r2 && "text" !== r2) throw new u({ info: { code: I.InvalidOutputFormat } }, "Invalid output format: ".concat(r2));
  return "text" === r2 ? je(t2, e2, n2) : $e(t2, e2, n2);
}), Ie = (t2) => t2;
function ke(t2) {
  return new Kt.XMLBuilder({ attributeNamePrefix: "@_", format: true, ignoreAttributes: false, suppressEmptyNode: true }).build(Re({ lockinfo: { "@_xmlns:d": "DAV:", lockscope: { exclusive: {} }, locktype: { write: {} }, owner: { href: t2 } } }, "d"));
}
function Re(t2, e2) {
  const n2 = __spreadValues({}, t2);
  for (const t3 in n2) n2.hasOwnProperty(t3) && (n2[t3] && "object" == typeof n2[t3] && -1 === t3.indexOf(":") ? (n2["".concat(e2, ":").concat(t3)] = Re(n2[t3], e2), delete n2[t3]) : false === /^@_/.test(t3) && (n2["".concat(e2, ":").concat(t3)] = n2[t3], delete n2[t3]));
  return n2;
}
function Le(t2, e2, n2) {
  return t2 && t2.then || (t2 = Promise.resolve(t2)), e2 ? t2.then(e2) : t2;
}
function _e(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}
const Me = _e(function(t2, e2, n2) {
  let r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
  const o2 = tt({ url: y(t2.remoteURL, f(e2)), method: "UNLOCK", headers: { "Lock-Token": n2 } }, t2, r2);
  return Le(Q(o2, t2), function(e3) {
    if (Ht(t2, e3), 204 !== e3.status && 200 !== e3.status) throw qt(e3);
  });
}), Ue = _e(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const { refreshToken: r2, timeout: o2 = Fe } = n2, i2 = { Accept: "text/plain,application/xml", Timeout: o2 };
  r2 && (i2.If = r2);
  const s2 = tt({ url: y(t2.remoteURL, f(e2)), method: "LOCK", headers: i2, data: ke(t2.contactHref) }, t2, n2);
  return Le(Q(s2, t2), function(e3) {
    return Ht(t2, e3), Le(e3.text(), function(t3) {
      const n3 = (i3 = t3, new Kt.XMLParser({ removeNSPrefix: true, parseAttributeValue: true, parseTagValue: true }).parse(i3)), r3 = Qt().get(n3, "prop.lockdiscovery.activelock.locktoken.href"), o3 = Qt().get(n3, "prop.lockdiscovery.activelock.timeout");
      var i3;
      if (!r3) throw qt(e3, "No lock token received: ");
      return { token: r3, serverTimeout: o3 };
    });
  });
}), Fe = "Infinite, Second-4100000000";
function De(t2, e2, n2) {
  return t2 && t2.then || (t2 = Promise.resolve(t2)), e2 ? t2.then(e2) : t2;
}
const Be = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2) {
  let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
  const n2 = e2.path || "/", r2 = tt({ url: y(t2.remoteURL, n2), method: "PROPFIND", headers: { Accept: "text/plain,application/xml", Depth: "0" } }, t2, e2);
  return De(Q(r2, t2), function(n3) {
    return Ht(t2, n3), De(n3.text(), function(t3) {
      return De(ne(t3), function(t4) {
        const r3 = function(t5) {
          try {
            const [e3] = t5.multistatus.response, { propstat: { prop: { "quota-used-bytes": n4, "quota-available-bytes": r4 } } } = e3;
            return void 0 !== n4 && void 0 !== r4 ? { used: parseInt(String(n4), 10), available: ie(r4) } : null;
          } catch (t6) {
          }
          return null;
        }(t4);
        return Xt(n3, r3, e2.details);
      });
    });
  });
});
function We(t2, e2, n2) {
  return t2 && t2.then || (t2 = Promise.resolve(t2)), e2 ? t2.then(e2) : t2;
}
const Ve = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const { details: r2 = false } = n2, o2 = tt({ url: y(t2.remoteURL, f(e2)), method: "SEARCH", headers: { Accept: "text/plain,application/xml", "Content-Type": t2.headers["Content-Type"] || "application/xml; charset=utf-8" } }, t2, n2);
  return We(Q(o2, t2), function(n3) {
    return Ht(t2, n3), We(n3.text(), function(t3) {
      return We(ne(t3), function(t4) {
        const o3 = function(t5, e3, n4) {
          const r3 = { truncated: false, results: [] };
          return r3.truncated = t5.multistatus.response.some((t6) => {
            var _a3, _b;
            return "507" === ((_b = (t6.status || ((_a3 = t6.propstat) == null ? void 0 : _a3.status)).split(" ", 3)) == null ? void 0 : _b[1]) && t6.href.replace(/\/$/, "").endsWith(f(e3).replace(/\/$/, ""));
          }), t5.multistatus.response.forEach((t6) => {
            if (void 0 === t6.propstat) return;
            const e4 = t6.href.split("/").map(decodeURIComponent).join("/");
            r3.results.push(re(t6.propstat.prop, e4, n4));
          }), r3;
        }(t4, e2, r2);
        return Xt(n3, o3, r2);
      });
    });
  });
}), ze = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2, n2) {
  let r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
  const o2 = tt({ url: y(t2.remoteURL, f(e2)), method: "MOVE", headers: { Destination: y(t2.remoteURL, f(n2)), Overwrite: false === r2.overwrite ? "F" : "T" } }, t2, r2);
  return s2 = function(e3) {
    Ht(t2, e3);
  }, (i2 = Q(o2, t2)) && i2.then || (i2 = Promise.resolve(i2)), s2 ? i2.then(s2) : i2;
  var i2, s2;
});
var Ge = n(172);
const qe = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2, n2) {
  let r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
  const { contentLength: o2 = true, overwrite: i2 = true } = r2, s2 = { "Content-Type": "application/octet-stream" };
  false === o2 || (s2["Content-Length"] = "number" == typeof o2 ? "".concat(o2) : "".concat(function(t3) {
    if (H(t3)) return t3.byteLength;
    if (X$1(t3)) return t3.length;
    if ("string" == typeof t3) return (0, Ge.d)(t3);
    throw new u({ info: { code: I.DataTypeNoLength } }, "Cannot calculate data length: Invalid type");
  }(n2))), i2 || (s2["If-None-Match"] = "*");
  const a2 = tt({ url: y(t2.remoteURL, f(e2)), method: "PUT", headers: s2, data: n2 }, t2, r2);
  return l2 = function(e3) {
    try {
      Ht(t2, e3);
    } catch (t3) {
      const e4 = t3;
      if (412 !== e4.status || i2) throw e4;
      return false;
    }
    return true;
  }, (c2 = Q(a2, t2)) && c2.then || (c2 = Promise.resolve(c2)), l2 ? c2.then(l2) : c2;
  var c2, l2;
}), He = /* @__PURE__ */ function(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}(function(t2, e2) {
  let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  const r2 = tt({ url: y(t2.remoteURL, f(e2)), method: "OPTIONS" }, t2, n2);
  return i2 = function(e3) {
    var _a3, _b;
    try {
      Ht(t2, e3);
    } catch (t3) {
      throw t3;
    }
    return { compliance: ((_a3 = e3.headers.get("DAV")) != null ? _a3 : "").split(",").map((t3) => t3.trim()), server: (_b = e3.headers.get("Server")) != null ? _b : "" };
  }, (o2 = Q(r2, t2)) && o2.then || (o2 = Promise.resolve(o2)), i2 ? o2.then(i2) : o2;
  var o2, i2;
});
function Xe(t2, e2, n2) {
  return t2 && t2.then || (t2 = Promise.resolve(t2)), e2 ? t2.then(e2) : t2;
}
const Ze = Je(function(t2, e2, n2, r2, o2) {
  let i2 = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {};
  if (n2 > r2 || n2 < 0) throw new u({ info: { code: I.InvalidUpdateRange } }, "Invalid update range ".concat(n2, " for partial update"));
  const s2 = { "Content-Type": "application/octet-stream", "Content-Length": "" + (r2 - n2 + 1), "Content-Range": "bytes ".concat(n2, "-").concat(r2, "/*") }, a2 = tt({ url: y(t2.remoteURL, f(e2)), method: "PUT", headers: s2, data: o2 }, t2, i2);
  return Xe(Q(a2, t2), function(e3) {
    Ht(t2, e3);
  });
});
function Ye(t2, e2) {
  var n2 = t2();
  return n2 && n2.then ? n2.then(e2) : e2(n2);
}
const Ke = Je(function(t2, e2, n2, r2, o2) {
  let i2 = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {};
  if (n2 > r2 || n2 < 0) throw new u({ info: { code: I.InvalidUpdateRange } }, "Invalid update range ".concat(n2, " for partial update"));
  const s2 = { "Content-Type": "application/x-sabredav-partialupdate", "Content-Length": "" + (r2 - n2 + 1), "X-Update-Range": "bytes=".concat(n2, "-").concat(r2) }, a2 = tt({ url: y(t2.remoteURL, f(e2)), method: "PATCH", headers: s2, data: o2 }, t2, i2);
  return Xe(Q(a2, t2), function(e3) {
    Ht(t2, e3);
  });
});
function Je(t2) {
  return function() {
    for (var e2 = [], n2 = 0; n2 < arguments.length; n2++) e2[n2] = arguments[n2];
    try {
      return Promise.resolve(t2.apply(this, e2));
    } catch (t3) {
      return Promise.reject(t3);
    }
  };
}
const Qe = Je(function(t2, e2, n2, r2, o2) {
  let i2 = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {};
  return Xe(He(t2, e2, i2), function(s2) {
    let a2 = false;
    return Ye(function() {
      if (s2.compliance.includes("sabredav-partialupdate")) return Xe(Ke(t2, e2, n2, r2, o2, i2), function(t3) {
        return a2 = true, t3;
      });
    }, function(c2) {
      let l2 = false;
      return a2 ? c2 : Ye(function() {
        if (s2.server.includes("Apache") && s2.compliance.includes("<http://apache.org/dav/propset/fs/1>")) return Xe(Ze(t2, e2, n2, r2, o2, i2), function(t3) {
          return l2 = true, t3;
        });
      }, function(t3) {
        if (l2) return t3;
        throw new u({ info: { code: I.NotSupported } }, "Not supported");
      });
    });
  });
}), tn = "https://github.com/perry-mitchell/webdav-client/blob/master/LOCK_CONTACT.md";
function en(t2) {
  let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
  const { authType: n2 = null, remoteBasePath: r2, contactHref: o2 = tn, ha1: i2, headers: s2 = {}, httpAgent: a2, httpsAgent: c2, password: l2, token: h2, username: p2, withCredentials: d2 } = e2;
  let g2 = n2;
  g2 || (g2 = p2 || l2 ? C.Password : C.None);
  const v2 = { authType: g2, remoteBasePath: r2, contactHref: o2, ha1: i2, headers: Object.assign({}, s2), httpAgent: a2, httpsAgent: c2, password: l2, remotePath: m(t2), remoteURL: t2, token: h2, username: p2, withCredentials: d2 };
  return k(v2, p2, l2, h2, i2), { copyFile: (t3, e3, n3) => Zt(v2, t3, e3, n3), createDirectory: (t3, e3) => ye(v2, t3, e3), createReadStream: (t3, e3) => function(t4, e4) {
    let n3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    const r3 = new (be()).PassThrough();
    return we(t4, e4, n3).then((t5) => {
      t5.pipe(r3);
    }).catch((t5) => {
      r3.emit("error", t5);
    }), r3;
  }(v2, t3, e3), createWriteStream: (t3, e3, n3) => function(t4, e4) {
    let n4 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, r3 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : xe;
    const o3 = new (be()).PassThrough(), i3 = {};
    false === n4.overwrite && (i3["If-None-Match"] = "*");
    const s3 = tt({ url: y(t4.remoteURL, f(e4)), method: "PUT", headers: i3, data: o3, maxRedirects: 0 }, t4, n4);
    return Q(s3, t4).then((e5) => Ht(t4, e5)).then((t5) => {
      setTimeout(() => {
        r3(t5);
      }, 0);
    }).catch((t5) => {
      o3.emit("error", t5);
    }), o3;
  }(v2, t3, e3, n3), customRequest: (t3, e3) => Ne(v2, t3, e3), deleteFile: (t3, e3) => Pe(v2, t3, e3), exists: (t3, e3) => Ae(v2, t3, e3), getDirectoryContents: (t3, e3) => Ee(v2, t3, e3), getFileContents: (t3, e3) => Ce(v2, t3, e3), getFileDownloadLink: (t3) => function(t4, e3) {
    let n3 = y(t4.remoteURL, f(e3));
    const r3 = /^https:/i.test(n3) ? "https" : "http";
    switch (t4.authType) {
      case C.None:
        break;
      case C.Password: {
        const e4 = O(t4.headers.Authorization.replace(/^Basic /i, "").trim());
        n3 = n3.replace(/^https?:\/\//, "".concat(r3, "://").concat(e4, "@"));
        break;
      }
      default:
        throw new u({ info: { code: I.LinkUnsupportedAuthType } }, "Unsupported auth type for file link: ".concat(t4.authType));
    }
    return n3;
  }(v2, t3), getFileUploadLink: (t3) => function(t4, e3) {
    let n3 = "".concat(y(t4.remoteURL, f(e3)), "?Content-Type=application/octet-stream");
    const r3 = /^https:/i.test(n3) ? "https" : "http";
    switch (t4.authType) {
      case C.None:
        break;
      case C.Password: {
        const e4 = O(t4.headers.Authorization.replace(/^Basic /i, "").trim());
        n3 = n3.replace(/^https?:\/\//, "".concat(r3, "://").concat(e4, "@"));
        break;
      }
      default:
        throw new u({ info: { code: I.LinkUnsupportedAuthType } }, "Unsupported auth type for file link: ".concat(t4.authType));
    }
    return n3;
  }(v2, t3), getHeaders: () => Object.assign({}, v2.headers), getQuota: (t3) => Be(v2, t3), lock: (t3, e3) => Ue(v2, t3, e3), moveFile: (t3, e3, n3) => ze(v2, t3, e3, n3), putFileContents: (t3, e3, n3) => qe(v2, t3, e3, n3), partialUpdateFileContents: (t3, e3, n3, r3, o3) => Qe(v2, t3, e3, n3, r3, o3), getDAVCompliance: (t3) => He(v2, t3), search: (t3, e3) => Ve(v2, t3, e3), setHeaders: (t3) => {
    v2.headers = Object.assign({}, t3);
  }, stat: (t3, e3) => ae(v2, t3, e3), unlock: (t3, e3, n3) => Me(v2, t3, e3, n3) };
}
r.hT;
r.O4;
r.Kd;
r.YK;
var an = r.UU, un = r.Gu, cn = r.ky, ln = r.h4;
r.ch;
r.hq;
r.i5;
function isPublicShare() {
  var _a3;
  return (_a3 = loadState("files_sharing", "isPublic", null)) != null ? _a3 : document.querySelector(
    'input#isPublic[type="hidden"][name="isPublic"][value="1"]'
  ) !== null;
}
function getSharingToken() {
  var _a3, _b, _c2;
  return (_c2 = (_b = loadState("files_sharing", "sharingToken", null)) != null ? _b : (_a3 = document.querySelector('input#sharingToken[type="hidden"]')) == null ? void 0 : _a3.value) != null ? _c2 : null;
}
const logger$1 = getLoggerBuilder().setApp("@nextcloud/files").detectUser().build();
var Permission = /* @__PURE__ */ ((Permission2) => {
  Permission2[Permission2["NONE"] = 0] = "NONE";
  Permission2[Permission2["CREATE"] = 4] = "CREATE";
  Permission2[Permission2["READ"] = 1] = "READ";
  Permission2[Permission2["UPDATE"] = 2] = "UPDATE";
  Permission2[Permission2["DELETE"] = 8] = "DELETE";
  Permission2[Permission2["SHARE"] = 16] = "SHARE";
  Permission2[Permission2["ALL"] = 31] = "ALL";
  return Permission2;
})(Permission || {});
var FileType = /* @__PURE__ */ ((FileType2) => {
  FileType2["Folder"] = "folder";
  FileType2["File"] = "file";
  return FileType2;
})(FileType || {});
const defaultDavProperties = [
  "d:getcontentlength",
  "d:getcontenttype",
  "d:getetag",
  "d:getlastmodified",
  "d:creationdate",
  "d:displayname",
  "d:quota-available-bytes",
  "d:resourcetype",
  "nc:has-preview",
  "nc:is-encrypted",
  "nc:mount-type",
  "oc:comments-unread",
  "oc:favorite",
  "oc:fileid",
  "oc:owner-display-name",
  "oc:owner-id",
  "oc:permissions",
  "oc:size"
];
const defaultDavNamespaces = {
  d: "DAV:",
  nc: "http://nextcloud.org/ns",
  oc: "http://owncloud.org/ns",
  ocs: "http://open-collaboration-services.org/ns"
};
const registerDavProperty = function(prop, namespace = { nc: "http://nextcloud.org/ns" }) {
  if (typeof window._nc_dav_properties === "undefined") {
    window._nc_dav_properties = [...defaultDavProperties];
    window._nc_dav_namespaces = __spreadValues({}, defaultDavNamespaces);
  }
  const namespaces = __spreadValues(__spreadValues({}, window._nc_dav_namespaces), namespace);
  if (window._nc_dav_properties.find((search) => search === prop)) {
    logger$1.warn("".concat(prop, " already registered"), { prop });
    return false;
  }
  if (prop.startsWith("<") || prop.split(":").length !== 2) {
    logger$1.error("".concat(prop, " is not valid. See example: 'oc:fileid'"), { prop });
    return false;
  }
  const ns = prop.split(":")[0];
  if (!namespaces[ns]) {
    logger$1.error("".concat(prop, " namespace unknown"), { prop, namespaces });
    return false;
  }
  window._nc_dav_properties.push(prop);
  window._nc_dav_namespaces = namespaces;
  return true;
};
const getDavProperties = function() {
  if (typeof window._nc_dav_properties === "undefined") {
    window._nc_dav_properties = [...defaultDavProperties];
  }
  return window._nc_dav_properties.map((prop) => "<".concat(prop, " />")).join(" ");
};
const getDavNameSpaces = function() {
  if (typeof window._nc_dav_namespaces === "undefined") {
    window._nc_dav_namespaces = __spreadValues({}, defaultDavNamespaces);
  }
  return Object.keys(window._nc_dav_namespaces).map((ns) => {
    var _a3;
    return "xmlns:".concat(ns, '="').concat((_a3 = window._nc_dav_namespaces) == null ? void 0 : _a3[ns], '"');
  }).join(" ");
};
const getDefaultPropfind = function() {
  return '<?xml version="1.0"?>\n		<d:propfind '.concat(getDavNameSpaces(), ">\n			<d:prop>\n				").concat(getDavProperties(), "\n			</d:prop>\n		</d:propfind>");
};
function getRootPath() {
  var _a3;
  if (isPublicShare()) {
    return "/files/".concat(getSharingToken());
  }
  return "/files/".concat((_a3 = getCurrentUser()) == null ? void 0 : _a3.uid);
}
getRootPath();
function getRemoteURL() {
  const url = U$1("dav");
  if (isPublicShare()) {
    return url.replace("remote.php", "public.php");
  }
  return url;
}
const defaultRemoteURL = getRemoteURL();
const getClient = function(remoteURL = defaultRemoteURL, headers = {}) {
  const client = an(remoteURL, { headers });
  function setHeaders(token) {
    client.setHeaders(__spreadProps(__spreadValues({}, headers), {
      // Add this so the server knows it is an request from the browser
      "X-Requested-With": "XMLHttpRequest",
      // Inject user auth
      requesttoken: token != null ? token : ""
    }));
  }
  onRequestTokenUpdate(setHeaders);
  setHeaders(getRequestToken());
  const patcher = un();
  patcher.patch("fetch", (url, options) => {
    const headers2 = options.headers;
    if (headers2 == null ? void 0 : headers2.method) {
      options.method = headers2.method;
      delete headers2.method;
    }
    return fetch(url, options);
  });
  return client;
};
var define_process_env_default = {};
var DefaultType = /* @__PURE__ */ ((DefaultType2) => {
  DefaultType2["DEFAULT"] = "default";
  DefaultType2["HIDDEN"] = "hidden";
  return DefaultType2;
})(DefaultType || {});
class FileAction {
  constructor(action) {
    __publicField(this, "_action");
    this.validateAction(action);
    this._action = action;
  }
  get id() {
    return this._action.id;
  }
  get displayName() {
    return this._action.displayName;
  }
  get title() {
    return this._action.title;
  }
  get iconSvgInline() {
    return this._action.iconSvgInline;
  }
  get enabled() {
    return this._action.enabled;
  }
  get exec() {
    return this._action.exec;
  }
  get execBatch() {
    return this._action.execBatch;
  }
  get order() {
    return this._action.order;
  }
  get parent() {
    return this._action.parent;
  }
  get default() {
    return this._action.default;
  }
  get destructive() {
    return this._action.destructive;
  }
  get inline() {
    return this._action.inline;
  }
  get renderInline() {
    return this._action.renderInline;
  }
  validateAction(action) {
    if (!action.id || typeof action.id !== "string") {
      throw new Error("Invalid id");
    }
    if (!action.displayName || typeof action.displayName !== "function") {
      throw new Error("Invalid displayName function");
    }
    if ("title" in action && typeof action.title !== "function") {
      throw new Error("Invalid title function");
    }
    if (!action.iconSvgInline || typeof action.iconSvgInline !== "function") {
      throw new Error("Invalid iconSvgInline function");
    }
    if (!action.exec || typeof action.exec !== "function") {
      throw new Error("Invalid exec function");
    }
    if ("enabled" in action && typeof action.enabled !== "function") {
      throw new Error("Invalid enabled function");
    }
    if ("execBatch" in action && typeof action.execBatch !== "function") {
      throw new Error("Invalid execBatch function");
    }
    if ("order" in action && typeof action.order !== "number") {
      throw new Error("Invalid order");
    }
    if (action.destructive !== void 0 && typeof action.destructive !== "boolean") {
      throw new Error("Invalid destructive flag");
    }
    if ("parent" in action && typeof action.parent !== "string") {
      throw new Error("Invalid parent");
    }
    if (action.default && !Object.values(DefaultType).includes(action.default)) {
      throw new Error("Invalid default");
    }
    if ("inline" in action && typeof action.inline !== "function") {
      throw new Error("Invalid inline function");
    }
    if ("renderInline" in action && typeof action.renderInline !== "function") {
      throw new Error("Invalid renderInline function");
    }
  }
}
const registerFileAction = function(action) {
  if (typeof window._nc_fileactions === "undefined") {
    window._nc_fileactions = [];
    logger$1.debug("FileActions initialized");
  }
  if (window._nc_fileactions.find((search) => search.id === action.id)) {
    logger$1.error("FileAction ".concat(action.id, " already registered"), { action });
    return;
  }
  window._nc_fileactions.push(action);
};
const getFileActions = function() {
  if (typeof window._nc_fileactions === "undefined") {
    window._nc_fileactions = [];
    logger$1.debug("FileActions initialized");
  }
  return window._nc_fileactions;
};
var util$3$1 = {};
(function(exports) {
  const nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
  const nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
  const nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
  const regexName = new RegExp("^" + nameRegexp + "$");
  const getAllMatches = function(string, regex) {
    const matches = [];
    let match = regex.exec(string);
    while (match) {
      const allmatches = [];
      allmatches.startIndex = regex.lastIndex - match[0].length;
      const len = match.length;
      for (let index = 0; index < len; index++) {
        allmatches.push(match[index]);
      }
      matches.push(allmatches);
      match = regex.exec(string);
    }
    return matches;
  };
  const isName = function(string) {
    const match = regexName.exec(string);
    return !(match === null || typeof match === "undefined");
  };
  exports.isExist = function(v2) {
    return typeof v2 !== "undefined";
  };
  exports.isEmptyObject = function(obj) {
    return Object.keys(obj).length === 0;
  };
  exports.merge = function(target, a2, arrayMode) {
    if (a2) {
      const keys = Object.keys(a2);
      const len = keys.length;
      for (let i2 = 0; i2 < len; i2++) {
        if (arrayMode === "strict") {
          target[keys[i2]] = [a2[keys[i2]]];
        } else {
          target[keys[i2]] = a2[keys[i2]];
        }
      }
    }
  };
  exports.getValue = function(v2) {
    if (exports.isExist(v2)) {
      return v2;
    } else {
      return "";
    }
  };
  exports.isName = isName;
  exports.getAllMatches = getAllMatches;
  exports.nameRegexp = nameRegexp;
})(util$3$1);
if (!Number.parseInt && window.parseInt) {
  Number.parseInt = window.parseInt;
}
if (!Number.parseFloat && window.parseFloat) {
  Number.parseFloat = window.parseFloat;
}
const debug$1 = typeof process$1 === "object" && define_process_env_default && define_process_env_default.NODE_DEBUG && /\bsemver\b/i.test(define_process_env_default.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
};
var debug_1 = debug$1;
const SEMVER_SPEC_VERSION = "2.0.0";
const MAX_LENGTH$1 = 256;
const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991;
const MAX_SAFE_COMPONENT_LENGTH = 16;
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH$1 - 6;
const RELEASE_TYPES = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var constants = {
  MAX_LENGTH: MAX_LENGTH$1,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
var re$1 = { exports: {} };
(function(module, exports) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: MAX_SAFE_COMPONENT_LENGTH2,
    MAX_SAFE_BUILD_LENGTH: MAX_SAFE_BUILD_LENGTH2,
    MAX_LENGTH: MAX_LENGTH2
  } = constants;
  const debug2 = debug_1;
  exports = module.exports = {};
  const re2 = exports.re = [];
  const safeRe = exports.safeRe = [];
  const src = exports.src = [];
  const t3 = exports.t = {};
  let R2 = 0;
  const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
  const safeRegexReplacements = [
    ["\\s", 1],
    ["\\d", MAX_LENGTH2],
    [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH2]
  ];
  const makeSafeRegex = (value) => {
    for (const [token, max] of safeRegexReplacements) {
      value = value.split("".concat(token, "*")).join("".concat(token, "{0,").concat(max, "}")).split("".concat(token, "+")).join("".concat(token, "{1,").concat(max, "}"));
    }
    return value;
  };
  const createToken = (name, value, isGlobal) => {
    const safe = makeSafeRegex(value);
    const index = R2++;
    debug2(name, index, value);
    t3[name] = index;
    src[index] = value;
    re2[index] = new RegExp(value, isGlobal ? "g" : void 0);
    safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
  };
  createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
  createToken("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-]".concat(LETTERDASHNUMBER, "*"));
  createToken("MAINVERSION", "(".concat(src[t3.NUMERICIDENTIFIER], ")\\.(").concat(src[t3.NUMERICIDENTIFIER], ")\\.(").concat(src[t3.NUMERICIDENTIFIER], ")"));
  createToken("MAINVERSIONLOOSE", "(".concat(src[t3.NUMERICIDENTIFIERLOOSE], ")\\.(").concat(src[t3.NUMERICIDENTIFIERLOOSE], ")\\.(").concat(src[t3.NUMERICIDENTIFIERLOOSE], ")"));
  createToken("PRERELEASEIDENTIFIER", "(?:".concat(src[t3.NUMERICIDENTIFIER], "|").concat(src[t3.NONNUMERICIDENTIFIER], ")"));
  createToken("PRERELEASEIDENTIFIERLOOSE", "(?:".concat(src[t3.NUMERICIDENTIFIERLOOSE], "|").concat(src[t3.NONNUMERICIDENTIFIER], ")"));
  createToken("PRERELEASE", "(?:-(".concat(src[t3.PRERELEASEIDENTIFIER], "(?:\\.").concat(src[t3.PRERELEASEIDENTIFIER], ")*))"));
  createToken("PRERELEASELOOSE", "(?:-?(".concat(src[t3.PRERELEASEIDENTIFIERLOOSE], "(?:\\.").concat(src[t3.PRERELEASEIDENTIFIERLOOSE], ")*))"));
  createToken("BUILDIDENTIFIER", "".concat(LETTERDASHNUMBER, "+"));
  createToken("BUILD", "(?:\\+(".concat(src[t3.BUILDIDENTIFIER], "(?:\\.").concat(src[t3.BUILDIDENTIFIER], ")*))"));
  createToken("FULLPLAIN", "v?".concat(src[t3.MAINVERSION]).concat(src[t3.PRERELEASE], "?").concat(src[t3.BUILD], "?"));
  createToken("FULL", "^".concat(src[t3.FULLPLAIN], "$"));
  createToken("LOOSEPLAIN", "[v=\\s]*".concat(src[t3.MAINVERSIONLOOSE]).concat(src[t3.PRERELEASELOOSE], "?").concat(src[t3.BUILD], "?"));
  createToken("LOOSE", "^".concat(src[t3.LOOSEPLAIN], "$"));
  createToken("GTLT", "((?:<|>)?=?)");
  createToken("XRANGEIDENTIFIERLOOSE", "".concat(src[t3.NUMERICIDENTIFIERLOOSE], "|x|X|\\*"));
  createToken("XRANGEIDENTIFIER", "".concat(src[t3.NUMERICIDENTIFIER], "|x|X|\\*"));
  createToken("XRANGEPLAIN", "[v=\\s]*(".concat(src[t3.XRANGEIDENTIFIER], ")(?:\\.(").concat(src[t3.XRANGEIDENTIFIER], ")(?:\\.(").concat(src[t3.XRANGEIDENTIFIER], ")(?:").concat(src[t3.PRERELEASE], ")?").concat(src[t3.BUILD], "?)?)?"));
  createToken("XRANGEPLAINLOOSE", "[v=\\s]*(".concat(src[t3.XRANGEIDENTIFIERLOOSE], ")(?:\\.(").concat(src[t3.XRANGEIDENTIFIERLOOSE], ")(?:\\.(").concat(src[t3.XRANGEIDENTIFIERLOOSE], ")(?:").concat(src[t3.PRERELEASELOOSE], ")?").concat(src[t3.BUILD], "?)?)?"));
  createToken("XRANGE", "^".concat(src[t3.GTLT], "\\s*").concat(src[t3.XRANGEPLAIN], "$"));
  createToken("XRANGELOOSE", "^".concat(src[t3.GTLT], "\\s*").concat(src[t3.XRANGEPLAINLOOSE], "$"));
  createToken("COERCEPLAIN", "".concat("(^|[^\\d])(\\d{1,").concat(MAX_SAFE_COMPONENT_LENGTH2, "})(?:\\.(\\d{1,").concat(MAX_SAFE_COMPONENT_LENGTH2, "}))?(?:\\.(\\d{1,").concat(MAX_SAFE_COMPONENT_LENGTH2, "}))?"));
  createToken("COERCE", "".concat(src[t3.COERCEPLAIN], "(?:$|[^\\d])"));
  createToken("COERCEFULL", src[t3.COERCEPLAIN] + "(?:".concat(src[t3.PRERELEASE], ")?(?:").concat(src[t3.BUILD], ")?(?:$|[^\\d])"));
  createToken("COERCERTL", src[t3.COERCE], true);
  createToken("COERCERTLFULL", src[t3.COERCEFULL], true);
  createToken("LONETILDE", "(?:~>?)");
  createToken("TILDETRIM", "(\\s*)".concat(src[t3.LONETILDE], "\\s+"), true);
  exports.tildeTrimReplace = "$1~";
  createToken("TILDE", "^".concat(src[t3.LONETILDE]).concat(src[t3.XRANGEPLAIN], "$"));
  createToken("TILDELOOSE", "^".concat(src[t3.LONETILDE]).concat(src[t3.XRANGEPLAINLOOSE], "$"));
  createToken("LONECARET", "(?:\\^)");
  createToken("CARETTRIM", "(\\s*)".concat(src[t3.LONECARET], "\\s+"), true);
  exports.caretTrimReplace = "$1^";
  createToken("CARET", "^".concat(src[t3.LONECARET]).concat(src[t3.XRANGEPLAIN], "$"));
  createToken("CARETLOOSE", "^".concat(src[t3.LONECARET]).concat(src[t3.XRANGEPLAINLOOSE], "$"));
  createToken("COMPARATORLOOSE", "^".concat(src[t3.GTLT], "\\s*(").concat(src[t3.LOOSEPLAIN], ")$|^$"));
  createToken("COMPARATOR", "^".concat(src[t3.GTLT], "\\s*(").concat(src[t3.FULLPLAIN], ")$|^$"));
  createToken("COMPARATORTRIM", "(\\s*)".concat(src[t3.GTLT], "\\s*(").concat(src[t3.LOOSEPLAIN], "|").concat(src[t3.XRANGEPLAIN], ")"), true);
  exports.comparatorTrimReplace = "$1$2$3";
  createToken("HYPHENRANGE", "^\\s*(".concat(src[t3.XRANGEPLAIN], ")\\s+-\\s+(").concat(src[t3.XRANGEPLAIN], ")\\s*$"));
  createToken("HYPHENRANGELOOSE", "^\\s*(".concat(src[t3.XRANGEPLAINLOOSE], ")\\s+-\\s+(").concat(src[t3.XRANGEPLAINLOOSE], ")\\s*$"));
  createToken("STAR", "(<|>)?=?\\s*\\*");
  createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(re$1, re$1.exports);
var validator$2 = {};
var util$3 = {};
(function(exports) {
  const nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
  const nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
  const nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
  const regexName = new RegExp("^" + nameRegexp + "$");
  const getAllMatches = function(string, regex) {
    const matches = [];
    let match = regex.exec(string);
    while (match) {
      const allmatches = [];
      allmatches.startIndex = regex.lastIndex - match[0].length;
      const len = match.length;
      for (let index = 0; index < len; index++) {
        allmatches.push(match[index]);
      }
      matches.push(allmatches);
      match = regex.exec(string);
    }
    return matches;
  };
  const isName = function(string) {
    const match = regexName.exec(string);
    return !(match === null || typeof match === "undefined");
  };
  exports.isExist = function(v2) {
    return typeof v2 !== "undefined";
  };
  exports.isEmptyObject = function(obj) {
    return Object.keys(obj).length === 0;
  };
  exports.merge = function(target, a2, arrayMode) {
    if (a2) {
      const keys = Object.keys(a2);
      const len = keys.length;
      for (let i2 = 0; i2 < len; i2++) {
        if (arrayMode === "strict") {
          target[keys[i2]] = [a2[keys[i2]]];
        } else {
          target[keys[i2]] = a2[keys[i2]];
        }
      }
    }
  };
  exports.getValue = function(v2) {
    if (exports.isExist(v2)) {
      return v2;
    } else {
      return "";
    }
  };
  exports.isName = isName;
  exports.getAllMatches = getAllMatches;
  exports.nameRegexp = nameRegexp;
})(util$3);
const util$2 = util$3;
const defaultOptions$2 = {
  allowBooleanAttributes: false,
  //A tag can have attributes without any value
  unpairedTags: []
};
validator$2.validate = function(xmlData, options) {
  options = Object.assign({}, defaultOptions$2, options);
  const tags = [];
  let tagFound = false;
  let reachedRoot = false;
  if (xmlData[0] === "\uFEFF") {
    xmlData = xmlData.substr(1);
  }
  for (let i2 = 0; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === "<" && xmlData[i2 + 1] === "?") {
      i2 += 2;
      i2 = readPI(xmlData, i2);
      if (i2.err) return i2;
    } else if (xmlData[i2] === "<") {
      let tagStartPos = i2;
      i2++;
      if (xmlData[i2] === "!") {
        i2 = readCommentAndCDATA(xmlData, i2);
        continue;
      } else {
        let closingTag = false;
        if (xmlData[i2] === "/") {
          closingTag = true;
          i2++;
        }
        let tagName = "";
        for (; i2 < xmlData.length && xmlData[i2] !== ">" && xmlData[i2] !== " " && xmlData[i2] !== "	" && xmlData[i2] !== "\n" && xmlData[i2] !== "\r"; i2++) {
          tagName += xmlData[i2];
        }
        tagName = tagName.trim();
        if (tagName[tagName.length - 1] === "/") {
          tagName = tagName.substring(0, tagName.length - 1);
          i2--;
        }
        if (!validateTagName(tagName)) {
          let msg;
          if (tagName.trim().length === 0) {
            msg = "Invalid space after '<'.";
          } else {
            msg = "Tag '" + tagName + "' is an invalid name.";
          }
          return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i2));
        }
        const result = readAttributeStr(xmlData, i2);
        if (result === false) {
          return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i2));
        }
        let attrStr = result.value;
        i2 = result.index;
        if (attrStr[attrStr.length - 1] === "/") {
          const attrStrStart = i2 - attrStr.length;
          attrStr = attrStr.substring(0, attrStr.length - 1);
          const isValid = validateAttributeString(attrStr, options);
          if (isValid === true) {
            tagFound = true;
          } else {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i2));
          } else if (attrStr.trim().length > 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
          } else if (tags.length === 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
          } else {
            const otg = tags.pop();
            if (tagName !== otg.tagName) {
              let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
              return getErrorObject(
                "InvalidTag",
                "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                getLineNumberForPosition(xmlData, tagStartPos)
              );
            }
            if (tags.length == 0) {
              reachedRoot = true;
            }
          }
        } else {
          const isValid = validateAttributeString(attrStr, options);
          if (isValid !== true) {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i2 - attrStr.length + isValid.err.line));
          }
          if (reachedRoot === true) {
            return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i2));
          } else if (options.unpairedTags.indexOf(tagName) !== -1) ;
          else {
            tags.push({ tagName, tagStartPos });
          }
          tagFound = true;
        }
        for (i2++; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<") {
            if (xmlData[i2 + 1] === "!") {
              i2++;
              i2 = readCommentAndCDATA(xmlData, i2);
              continue;
            } else if (xmlData[i2 + 1] === "?") {
              i2 = readPI(xmlData, ++i2);
              if (i2.err) return i2;
            } else {
              break;
            }
          } else if (xmlData[i2] === "&") {
            const afterAmp = validateAmpersand(xmlData, i2);
            if (afterAmp == -1)
              return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i2));
            i2 = afterAmp;
          } else {
            if (reachedRoot === true && !isWhiteSpace(xmlData[i2])) {
              return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i2));
            }
          }
        }
        if (xmlData[i2] === "<") {
          i2--;
        }
      }
    } else {
      if (isWhiteSpace(xmlData[i2])) {
        continue;
      }
      return getErrorObject("InvalidChar", "char '" + xmlData[i2] + "' is not expected.", getLineNumberForPosition(xmlData, i2));
    }
  }
  if (!tagFound) {
    return getErrorObject("InvalidXml", "Start tag expected.", 1);
  } else if (tags.length == 1) {
    return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
  } else if (tags.length > 0) {
    return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t2) => t2.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
  }
  return true;
};
function isWhiteSpace(char) {
  return char === " " || char === "	" || char === "\n" || char === "\r";
}
function readPI(xmlData, i2) {
  const start = i2;
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] == "?" || xmlData[i2] == " ") {
      const tagname = xmlData.substr(start, i2 - start);
      if (i2 > 5 && tagname === "xml") {
        return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i2));
      } else if (xmlData[i2] == "?" && xmlData[i2 + 1] == ">") {
        i2++;
        break;
      } else {
        continue;
      }
    }
  }
  return i2;
}
function readCommentAndCDATA(xmlData, i2) {
  if (xmlData.length > i2 + 5 && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === "-") {
    for (i2 += 3; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "-" && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === ">") {
        i2 += 2;
        break;
      }
    }
  } else if (xmlData.length > i2 + 8 && xmlData[i2 + 1] === "D" && xmlData[i2 + 2] === "O" && xmlData[i2 + 3] === "C" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "Y" && xmlData[i2 + 6] === "P" && xmlData[i2 + 7] === "E") {
    let angleBracketsCount = 1;
    for (i2 += 8; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "<") {
        angleBracketsCount++;
      } else if (xmlData[i2] === ">") {
        angleBracketsCount--;
        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (xmlData.length > i2 + 9 && xmlData[i2 + 1] === "[" && xmlData[i2 + 2] === "C" && xmlData[i2 + 3] === "D" && xmlData[i2 + 4] === "A" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "A" && xmlData[i2 + 7] === "[") {
    for (i2 += 8; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "]" && xmlData[i2 + 1] === "]" && xmlData[i2 + 2] === ">") {
        i2 += 2;
        break;
      }
    }
  }
  return i2;
}
const doubleQuote = '"';
const singleQuote = "'";
function readAttributeStr(xmlData, i2) {
  let attrStr = "";
  let startChar = "";
  let tagClosed = false;
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === doubleQuote || xmlData[i2] === singleQuote) {
      if (startChar === "") {
        startChar = xmlData[i2];
      } else if (startChar !== xmlData[i2]) ;
      else {
        startChar = "";
      }
    } else if (xmlData[i2] === ">") {
      if (startChar === "") {
        tagClosed = true;
        break;
      }
    }
    attrStr += xmlData[i2];
  }
  if (startChar !== "") {
    return false;
  }
  return {
    value: attrStr,
    index: i2,
    tagClosed
  };
}
const validAttrStrRegxp = new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g");
function validateAttributeString(attrStr, options) {
  const matches = util$2.getAllMatches(attrStr, validAttrStrRegxp);
  const attrNames = {};
  for (let i2 = 0; i2 < matches.length; i2++) {
    if (matches[i2][1].length === 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' has no space in starting.", getPositionFromMatch(matches[i2]));
    } else if (matches[i2][3] !== void 0 && matches[i2][4] === void 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' is without value.", getPositionFromMatch(matches[i2]));
    } else if (matches[i2][3] === void 0 && !options.allowBooleanAttributes) {
      return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i2][2] + "' is not allowed.", getPositionFromMatch(matches[i2]));
    }
    const attrName = matches[i2][2];
    if (!validateAttrName(attrName)) {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i2]));
    }
    if (!attrNames.hasOwnProperty(attrName)) {
      attrNames[attrName] = 1;
    } else {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i2]));
    }
  }
  return true;
}
function validateNumberAmpersand(xmlData, i2) {
  let re2 = /\d/;
  if (xmlData[i2] === "x") {
    i2++;
    re2 = /[\da-fA-F]/;
  }
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === ";")
      return i2;
    if (!xmlData[i2].match(re2))
      break;
  }
  return -1;
}
function validateAmpersand(xmlData, i2) {
  i2++;
  if (xmlData[i2] === ";")
    return -1;
  if (xmlData[i2] === "#") {
    i2++;
    return validateNumberAmpersand(xmlData, i2);
  }
  let count = 0;
  for (; i2 < xmlData.length; i2++, count++) {
    if (xmlData[i2].match(/\w/) && count < 20)
      continue;
    if (xmlData[i2] === ";")
      break;
    return -1;
  }
  return i2;
}
function getErrorObject(code, message, lineNumber) {
  return {
    err: {
      code,
      msg: message,
      line: lineNumber.line || lineNumber,
      col: lineNumber.col
    }
  };
}
function validateAttrName(attrName) {
  return util$2.isName(attrName);
}
function validateTagName(tagname) {
  return util$2.isName(tagname);
}
function getLineNumberForPosition(xmlData, index) {
  const lines = xmlData.substring(0, index).split(/\r?\n/);
  return {
    line: lines.length,
    // column number is last line's length + 1, because column numbering starts at 1:
    col: lines[lines.length - 1].length + 1
  };
}
function getPositionFromMatch(match) {
  return match.startIndex + match[1].length;
}
var OptionsBuilder = {};
const defaultOptions$1 = {
  preserveOrder: false,
  attributeNamePrefix: "@_",
  attributesGroupName: false,
  textNodeName: "#text",
  ignoreAttributes: true,
  removeNSPrefix: false,
  // remove NS from tag name or attribute name if true
  allowBooleanAttributes: false,
  //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseTagValue: true,
  parseAttributeValue: false,
  trimValues: true,
  //Trim string values of tag and attributes
  cdataPropName: false,
  numberParseOptions: {
    hex: true,
    leadingZeros: true,
    eNotation: true
  },
  tagValueProcessor: function(tagName, val2) {
    return val2;
  },
  attributeValueProcessor: function(attrName, val2) {
    return val2;
  },
  stopNodes: [],
  //nested tags will not be parsed even for errors
  alwaysCreateTextNode: false,
  isArray: () => false,
  commentPropName: false,
  unpairedTags: [],
  processEntities: true,
  htmlEntities: false,
  ignoreDeclaration: false,
  ignorePiTags: false,
  transformTagName: false,
  transformAttributeName: false,
  updateTag: function(tagName, jPath, attrs) {
    return tagName;
  }
  // skipEmptyListItem: false
};
const buildOptions$1 = function(options) {
  return Object.assign({}, defaultOptions$1, options);
};
OptionsBuilder.buildOptions = buildOptions$1;
OptionsBuilder.defaultOptions = defaultOptions$1;
class XmlNode {
  constructor(tagname) {
    this.tagname = tagname;
    this.child = [];
    this[":@"] = {};
  }
  add(key, val2) {
    if (key === "__proto__") key = "#__proto__";
    this.child.push({ [key]: val2 });
  }
  addChild(node) {
    if (node.tagname === "__proto__") node.tagname = "#__proto__";
    if (node[":@"] && Object.keys(node[":@"]).length > 0) {
      this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
    } else {
      this.child.push({ [node.tagname]: node.child });
    }
  }
}
var xmlNode$1 = XmlNode;
const util$1 = util$3;
function readDocType$1(xmlData, i2) {
  const entities = {};
  if (xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "C" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "Y" && xmlData[i2 + 7] === "P" && xmlData[i2 + 8] === "E") {
    i2 = i2 + 9;
    let angleBracketsCount = 1;
    let hasBody = false, comment = false;
    let exp = "";
    for (; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "<" && !comment) {
        if (hasBody && isEntity(xmlData, i2)) {
          i2 += 7;
          [entityName, val, i2] = readEntityExp(xmlData, i2 + 1);
          if (val.indexOf("&") === -1)
            entities[validateEntityName(entityName)] = {
              regx: RegExp("&".concat(entityName, ";"), "g"),
              val
            };
        } else if (hasBody && isElement(xmlData, i2)) i2 += 8;
        else if (hasBody && isAttlist(xmlData, i2)) i2 += 8;
        else if (hasBody && isNotation(xmlData, i2)) i2 += 9;
        else if (isComment) comment = true;
        else throw new Error("Invalid DOCTYPE");
        angleBracketsCount++;
        exp = "";
      } else if (xmlData[i2] === ">") {
        if (comment) {
          if (xmlData[i2 - 1] === "-" && xmlData[i2 - 2] === "-") {
            comment = false;
            angleBracketsCount--;
          }
        } else {
          angleBracketsCount--;
        }
        if (angleBracketsCount === 0) {
          break;
        }
      } else if (xmlData[i2] === "[") {
        hasBody = true;
      } else {
        exp += xmlData[i2];
      }
    }
    if (angleBracketsCount !== 0) {
      throw new Error("Unclosed DOCTYPE");
    }
  } else {
    throw new Error("Invalid Tag instead of DOCTYPE");
  }
  return { entities, i: i2 };
}
function readEntityExp(xmlData, i2) {
  let entityName2 = "";
  for (; i2 < xmlData.length && (xmlData[i2] !== "'" && xmlData[i2] !== '"'); i2++) {
    entityName2 += xmlData[i2];
  }
  entityName2 = entityName2.trim();
  if (entityName2.indexOf(" ") !== -1) throw new Error("External entites are not supported");
  const startChar = xmlData[i2++];
  let val2 = "";
  for (; i2 < xmlData.length && xmlData[i2] !== startChar; i2++) {
    val2 += xmlData[i2];
  }
  return [entityName2, val2, i2];
}
function isComment(xmlData, i2) {
  if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "-" && xmlData[i2 + 3] === "-") return true;
  return false;
}
function isEntity(xmlData, i2) {
  if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "N" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "I" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "Y") return true;
  return false;
}
function isElement(xmlData, i2) {
  if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "L" && xmlData[i2 + 4] === "E" && xmlData[i2 + 5] === "M" && xmlData[i2 + 6] === "E" && xmlData[i2 + 7] === "N" && xmlData[i2 + 8] === "T") return true;
  return false;
}
function isAttlist(xmlData, i2) {
  if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "A" && xmlData[i2 + 3] === "T" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "L" && xmlData[i2 + 6] === "I" && xmlData[i2 + 7] === "S" && xmlData[i2 + 8] === "T") return true;
  return false;
}
function isNotation(xmlData, i2) {
  if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "N" && xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "A" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "I" && xmlData[i2 + 8] === "O" && xmlData[i2 + 9] === "N") return true;
  return false;
}
function validateEntityName(name) {
  if (util$1.isName(name))
    return name;
  else
    throw new Error("Invalid entity name ".concat(name));
}
var DocTypeReader = readDocType$1;
const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
const numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
if (!Number.parseInt && window.parseInt) {
  Number.parseInt = window.parseInt;
}
if (!Number.parseFloat && window.parseFloat) {
  Number.parseFloat = window.parseFloat;
}
const consider = {
  hex: true,
  leadingZeros: true,
  decimalPoint: ".",
  eNotation: true
  //skipLike: /regex/
};
function toNumber$1(str, options = {}) {
  options = Object.assign({}, consider, options);
  if (!str || typeof str !== "string") return str;
  let trimmedStr = str.trim();
  if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
  else if (options.hex && hexRegex.test(trimmedStr)) {
    return Number.parseInt(trimmedStr, 16);
  } else {
    const match = numRegex.exec(trimmedStr);
    if (match) {
      const sign = match[1];
      const leadingZeros = match[2];
      let numTrimmedByZeros = trimZeros(match[3]);
      const eNotation = match[4] || match[6];
      if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str;
      else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str;
      else {
        const num = Number(trimmedStr);
        const numStr = "" + num;
        if (numStr.search(/[eE]/) !== -1) {
          if (options.eNotation) return num;
          else return str;
        } else if (eNotation) {
          if (options.eNotation) return num;
          else return str;
        } else if (trimmedStr.indexOf(".") !== -1) {
          if (numStr === "0" && numTrimmedByZeros === "") return num;
          else if (numStr === numTrimmedByZeros) return num;
          else if (sign && numStr === "-" + numTrimmedByZeros) return num;
          else return str;
        }
        if (leadingZeros) {
          if (numTrimmedByZeros === numStr) return num;
          else if (sign + numTrimmedByZeros === numStr) return num;
          else return str;
        }
        if (trimmedStr === numStr) return num;
        else if (trimmedStr === sign + numStr) return num;
        return str;
      }
    } else {
      return str;
    }
  }
}
function trimZeros(numStr) {
  if (numStr && numStr.indexOf(".") !== -1) {
    numStr = numStr.replace(/0+$/, "");
    if (numStr === ".") numStr = "0";
    else if (numStr[0] === ".") numStr = "0" + numStr;
    else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
    return numStr;
  }
  return numStr;
}
var strnum = toNumber$1;
function getIgnoreAttributesFn$2(ignoreAttributes2) {
  if (typeof ignoreAttributes2 === "function") {
    return ignoreAttributes2;
  }
  if (Array.isArray(ignoreAttributes2)) {
    return (attrName) => {
      for (const pattern of ignoreAttributes2) {
        if (typeof pattern === "string" && attrName === pattern) {
          return true;
        }
        if (pattern instanceof RegExp && pattern.test(attrName)) {
          return true;
        }
      }
    };
  }
  return () => false;
}
var ignoreAttributes = getIgnoreAttributesFn$2;
const util = util$3;
const xmlNode = xmlNode$1;
const readDocType = DocTypeReader;
const toNumber = strnum;
const getIgnoreAttributesFn$1 = ignoreAttributes;
let OrderedObjParser$1 = class OrderedObjParser {
  constructor(options) {
    this.options = options;
    this.currentNode = null;
    this.tagsNodeStack = [];
    this.docTypeEntities = {};
    this.lastEntities = {
      "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
      "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
      "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
      "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
    };
    this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
    this.htmlEntities = {
      "space": { regex: /&(nbsp|#160);/g, val: " " },
      // "lt" : { regex: /&(lt|#60);/g, val: "<" },
      // "gt" : { regex: /&(gt|#62);/g, val: ">" },
      // "amp" : { regex: /&(amp|#38);/g, val: "&" },
      // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
      // "apos" : { regex: /&(apos|#39);/g, val: "'" },
      "cent": { regex: /&(cent|#162);/g, val: "¢" },
      "pound": { regex: /&(pound|#163);/g, val: "£" },
      "yen": { regex: /&(yen|#165);/g, val: "¥" },
      "euro": { regex: /&(euro|#8364);/g, val: "€" },
      "copyright": { regex: /&(copy|#169);/g, val: "©" },
      "reg": { regex: /&(reg|#174);/g, val: "®" },
      "inr": { regex: /&(inr|#8377);/g, val: "₹" },
      "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_2, str) => String.fromCharCode(Number.parseInt(str, 10)) },
      "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_2, str) => String.fromCharCode(Number.parseInt(str, 16)) }
    };
    this.addExternalEntities = addExternalEntities;
    this.parseXml = parseXml;
    this.parseTextData = parseTextData;
    this.resolveNameSpace = resolveNameSpace;
    this.buildAttributesMap = buildAttributesMap;
    this.isItStopNode = isItStopNode;
    this.replaceEntitiesValue = replaceEntitiesValue$1;
    this.readStopNodeData = readStopNodeData;
    this.saveTextToParentTag = saveTextToParentTag;
    this.addChild = addChild;
    this.ignoreAttributesFn = getIgnoreAttributesFn$1(this.options.ignoreAttributes);
  }
};
function addExternalEntities(externalEntities) {
  const entKeys = Object.keys(externalEntities);
  for (let i2 = 0; i2 < entKeys.length; i2++) {
    const ent = entKeys[i2];
    this.lastEntities[ent] = {
      regex: new RegExp("&" + ent + ";", "g"),
      val: externalEntities[ent]
    };
  }
}
function parseTextData(val2, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
  if (val2 !== void 0) {
    if (this.options.trimValues && !dontTrim) {
      val2 = val2.trim();
    }
    if (val2.length > 0) {
      if (!escapeEntities) val2 = this.replaceEntitiesValue(val2);
      const newval = this.options.tagValueProcessor(tagName, val2, jPath, hasAttributes, isLeafNode);
      if (newval === null || newval === void 0) {
        return val2;
      } else if (typeof newval !== typeof val2 || newval !== val2) {
        return newval;
      } else if (this.options.trimValues) {
        return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
      } else {
        const trimmedVal = val2.trim();
        if (trimmedVal === val2) {
          return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
        } else {
          return val2;
        }
      }
    }
  }
}
function resolveNameSpace(tagname) {
  if (this.options.removeNSPrefix) {
    const tags = tagname.split(":");
    const prefix = tagname.charAt(0) === "/" ? "/" : "";
    if (tags[0] === "xmlns") {
      return "";
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}
const attrsRegx = new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])([\\s\\S]*?)\\3)?", "gm");
function buildAttributesMap(attrStr, jPath, tagName) {
  if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
    const matches = util.getAllMatches(attrStr, attrsRegx);
    const len = matches.length;
    const attrs = {};
    for (let i2 = 0; i2 < len; i2++) {
      const attrName = this.resolveNameSpace(matches[i2][1]);
      if (this.ignoreAttributesFn(attrName, jPath)) {
        continue;
      }
      let oldVal = matches[i2][4];
      let aName = this.options.attributeNamePrefix + attrName;
      if (attrName.length) {
        if (this.options.transformAttributeName) {
          aName = this.options.transformAttributeName(aName);
        }
        if (aName === "__proto__") aName = "#__proto__";
        if (oldVal !== void 0) {
          if (this.options.trimValues) {
            oldVal = oldVal.trim();
          }
          oldVal = this.replaceEntitiesValue(oldVal);
          const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
          if (newVal === null || newVal === void 0) {
            attrs[aName] = oldVal;
          } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
            attrs[aName] = newVal;
          } else {
            attrs[aName] = parseValue(
              oldVal,
              this.options.parseAttributeValue,
              this.options.numberParseOptions
            );
          }
        } else if (this.options.allowBooleanAttributes) {
          attrs[aName] = true;
        }
      }
    }
    if (!Object.keys(attrs).length) {
      return;
    }
    if (this.options.attributesGroupName) {
      const attrCollection = {};
      attrCollection[this.options.attributesGroupName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}
const parseXml = function(xmlData) {
  xmlData = xmlData.replace(/\r\n?/g, "\n");
  const xmlObj = new xmlNode("!xml");
  let currentNode = xmlObj;
  let textData = "";
  let jPath = "";
  for (let i2 = 0; i2 < xmlData.length; i2++) {
    const ch = xmlData[i2];
    if (ch === "<") {
      if (xmlData[i2 + 1] === "/") {
        const closeIndex = findClosingIndex(xmlData, ">", i2, "Closing Tag is not closed.");
        let tagName = xmlData.substring(i2 + 2, closeIndex).trim();
        if (this.options.removeNSPrefix) {
          const colonIndex = tagName.indexOf(":");
          if (colonIndex !== -1) {
            tagName = tagName.substr(colonIndex + 1);
          }
        }
        if (this.options.transformTagName) {
          tagName = this.options.transformTagName(tagName);
        }
        if (currentNode) {
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
        }
        const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
        if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
          throw new Error("Unpaired tag can not be used as closing tag: </".concat(tagName, ">"));
        }
        let propIndex = 0;
        if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
          propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
          this.tagsNodeStack.pop();
        } else {
          propIndex = jPath.lastIndexOf(".");
        }
        jPath = jPath.substring(0, propIndex);
        currentNode = this.tagsNodeStack.pop();
        textData = "";
        i2 = closeIndex;
      } else if (xmlData[i2 + 1] === "?") {
        let tagData = readTagExp(xmlData, i2, false, "?>");
        if (!tagData) throw new Error("Pi Tag is not closed.");
        textData = this.saveTextToParentTag(textData, currentNode, jPath);
        if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) ;
        else {
          const childNode = new xmlNode(tagData.tagName);
          childNode.add(this.options.textNodeName, "");
          if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
            childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
          }
          this.addChild(currentNode, childNode, jPath);
        }
        i2 = tagData.closeIndex + 1;
      } else if (xmlData.substr(i2 + 1, 3) === "!--") {
        const endIndex = findClosingIndex(xmlData, "-->", i2 + 4, "Comment is not closed.");
        if (this.options.commentPropName) {
          const comment = xmlData.substring(i2 + 4, endIndex - 2);
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
        }
        i2 = endIndex;
      } else if (xmlData.substr(i2 + 1, 2) === "!D") {
        const result = readDocType(xmlData, i2);
        this.docTypeEntities = result.entities;
        i2 = result.i;
      } else if (xmlData.substr(i2 + 1, 2) === "![") {
        const closeIndex = findClosingIndex(xmlData, "]]>", i2, "CDATA is not closed.") - 2;
        const tagExp = xmlData.substring(i2 + 9, closeIndex);
        textData = this.saveTextToParentTag(textData, currentNode, jPath);
        let val2 = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
        if (val2 == void 0) val2 = "";
        if (this.options.cdataPropName) {
          currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
        } else {
          currentNode.add(this.options.textNodeName, val2);
        }
        i2 = closeIndex + 2;
      } else {
        let result = readTagExp(xmlData, i2, this.options.removeNSPrefix);
        let tagName = result.tagName;
        const rawTagName = result.rawTagName;
        let tagExp = result.tagExp;
        let attrExpPresent = result.attrExpPresent;
        let closeIndex = result.closeIndex;
        if (this.options.transformTagName) {
          tagName = this.options.transformTagName(tagName);
        }
        if (currentNode && textData) {
          if (currentNode.tagname !== "!xml") {
            textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
          }
        }
        const lastTag = currentNode;
        if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
          currentNode = this.tagsNodeStack.pop();
          jPath = jPath.substring(0, jPath.lastIndexOf("."));
        }
        if (tagName !== xmlObj.tagname) {
          jPath += jPath ? "." + tagName : tagName;
        }
        if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
          let tagContent = "";
          if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substr(0, tagName.length - 1);
              jPath = jPath.substr(0, jPath.length - 1);
              tagExp = tagName;
            } else {
              tagExp = tagExp.substr(0, tagExp.length - 1);
            }
            i2 = result.closeIndex;
          } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
            i2 = result.closeIndex;
          } else {
            const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
            if (!result2) throw new Error("Unexpected end of ".concat(rawTagName));
            i2 = result2.i;
            tagContent = result2.tagContent;
          }
          const childNode = new xmlNode(tagName);
          if (tagName !== tagExp && attrExpPresent) {
            childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
          }
          if (tagContent) {
            tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
          }
          jPath = jPath.substr(0, jPath.lastIndexOf("."));
          childNode.add(this.options.textNodeName, tagContent);
          this.addChild(currentNode, childNode, jPath);
        } else {
          if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substr(0, tagName.length - 1);
              jPath = jPath.substr(0, jPath.length - 1);
              tagExp = tagName;
            } else {
              tagExp = tagExp.substr(0, tagExp.length - 1);
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            const childNode = new xmlNode(tagName);
            if (tagName !== tagExp && attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            this.addChild(currentNode, childNode, jPath);
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
          } else {
            const childNode = new xmlNode(tagName);
            this.tagsNodeStack.push(currentNode);
            if (tagName !== tagExp && attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            this.addChild(currentNode, childNode, jPath);
            currentNode = childNode;
          }
          textData = "";
          i2 = closeIndex;
        }
      }
    } else {
      textData += xmlData[i2];
    }
  }
  return xmlObj.child;
};
function addChild(currentNode, childNode, jPath) {
  const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
  if (result === false) ;
  else if (typeof result === "string") {
    childNode.tagname = result;
    currentNode.addChild(childNode);
  } else {
    currentNode.addChild(childNode);
  }
}
const replaceEntitiesValue$1 = function(val2) {
  if (this.options.processEntities) {
    for (let entityName2 in this.docTypeEntities) {
      const entity = this.docTypeEntities[entityName2];
      val2 = val2.replace(entity.regx, entity.val);
    }
    for (let entityName2 in this.lastEntities) {
      const entity = this.lastEntities[entityName2];
      val2 = val2.replace(entity.regex, entity.val);
    }
    if (this.options.htmlEntities) {
      for (let entityName2 in this.htmlEntities) {
        const entity = this.htmlEntities[entityName2];
        val2 = val2.replace(entity.regex, entity.val);
      }
    }
    val2 = val2.replace(this.ampEntity.regex, this.ampEntity.val);
  }
  return val2;
};
function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
  if (textData) {
    if (isLeafNode === void 0) isLeafNode = Object.keys(currentNode.child).length === 0;
    textData = this.parseTextData(
      textData,
      currentNode.tagname,
      jPath,
      false,
      currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
      isLeafNode
    );
    if (textData !== void 0 && textData !== "")
      currentNode.add(this.options.textNodeName, textData);
    textData = "";
  }
  return textData;
}
function isItStopNode(stopNodes, jPath, currentTagName) {
  const allNodesExp = "*." + currentTagName;
  for (const stopNodePath in stopNodes) {
    const stopNodeExp = stopNodes[stopNodePath];
    if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
  }
  return false;
}
function tagExpWithClosingIndex(xmlData, i2, closingChar = ">") {
  let attrBoundary;
  let tagExp = "";
  for (let index = i2; index < xmlData.length; index++) {
    let ch = xmlData[index];
    if (attrBoundary) {
      if (ch === attrBoundary) attrBoundary = "";
    } else if (ch === '"' || ch === "'") {
      attrBoundary = ch;
    } else if (ch === closingChar[0]) {
      if (closingChar[1]) {
        if (xmlData[index + 1] === closingChar[1]) {
          return {
            data: tagExp,
            index
          };
        }
      } else {
        return {
          data: tagExp,
          index
        };
      }
    } else if (ch === "	") {
      ch = " ";
    }
    tagExp += ch;
  }
}
function findClosingIndex(xmlData, str, i2, errMsg) {
  const closingIndex = xmlData.indexOf(str, i2);
  if (closingIndex === -1) {
    throw new Error(errMsg);
  } else {
    return closingIndex + str.length - 1;
  }
}
function readTagExp(xmlData, i2, removeNSPrefix, closingChar = ">") {
  const result = tagExpWithClosingIndex(xmlData, i2 + 1, closingChar);
  if (!result) return;
  let tagExp = result.data;
  const closeIndex = result.index;
  const separatorIndex = tagExp.search(/\s/);
  let tagName = tagExp;
  let attrExpPresent = true;
  if (separatorIndex !== -1) {
    tagName = tagExp.substring(0, separatorIndex);
    tagExp = tagExp.substring(separatorIndex + 1).trimStart();
  }
  const rawTagName = tagName;
  if (removeNSPrefix) {
    const colonIndex = tagName.indexOf(":");
    if (colonIndex !== -1) {
      tagName = tagName.substr(colonIndex + 1);
      attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
    }
  }
  return {
    tagName,
    tagExp,
    closeIndex,
    attrExpPresent,
    rawTagName
  };
}
function readStopNodeData(xmlData, tagName, i2) {
  const startIndex = i2;
  let openTagCount = 1;
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === "<") {
      if (xmlData[i2 + 1] === "/") {
        const closeIndex = findClosingIndex(xmlData, ">", i2, "".concat(tagName, " is not closed"));
        let closeTagName = xmlData.substring(i2 + 2, closeIndex).trim();
        if (closeTagName === tagName) {
          openTagCount--;
          if (openTagCount === 0) {
            return {
              tagContent: xmlData.substring(startIndex, i2),
              i: closeIndex
            };
          }
        }
        i2 = closeIndex;
      } else if (xmlData[i2 + 1] === "?") {
        const closeIndex = findClosingIndex(xmlData, "?>", i2 + 1, "StopNode is not closed.");
        i2 = closeIndex;
      } else if (xmlData.substr(i2 + 1, 3) === "!--") {
        const closeIndex = findClosingIndex(xmlData, "-->", i2 + 3, "StopNode is not closed.");
        i2 = closeIndex;
      } else if (xmlData.substr(i2 + 1, 2) === "![") {
        const closeIndex = findClosingIndex(xmlData, "]]>", i2, "StopNode is not closed.") - 2;
        i2 = closeIndex;
      } else {
        const tagData = readTagExp(xmlData, i2, ">");
        if (tagData) {
          const openTagName = tagData && tagData.tagName;
          if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
            openTagCount++;
          }
          i2 = tagData.closeIndex;
        }
      }
    }
  }
}
function parseValue(val2, shouldParse, options) {
  if (shouldParse && typeof val2 === "string") {
    const newval = val2.trim();
    if (newval === "true") return true;
    else if (newval === "false") return false;
    else return toNumber(val2, options);
  } else {
    if (util.isExist(val2)) {
      return val2;
    } else {
      return "";
    }
  }
}
var OrderedObjParser_1 = OrderedObjParser$1;
var node2json = {};
function prettify$1(node, options) {
  return compress(node, options);
}
function compress(arr, options, jPath) {
  let text;
  const compressedObj = {};
  for (let i2 = 0; i2 < arr.length; i2++) {
    const tagObj = arr[i2];
    const property = propName$1(tagObj);
    let newJpath = "";
    if (jPath === void 0) newJpath = property;
    else newJpath = jPath + "." + property;
    if (property === options.textNodeName) {
      if (text === void 0) text = tagObj[property];
      else text += "" + tagObj[property];
    } else if (property === void 0) {
      continue;
    } else if (tagObj[property]) {
      let val2 = compress(tagObj[property], options, newJpath);
      const isLeaf = isLeafTag(val2, options);
      if (tagObj[":@"]) {
        assignAttributes(val2, tagObj[":@"], newJpath, options);
      } else if (Object.keys(val2).length === 1 && val2[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
        val2 = val2[options.textNodeName];
      } else if (Object.keys(val2).length === 0) {
        if (options.alwaysCreateTextNode) val2[options.textNodeName] = "";
        else val2 = "";
      }
      if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
        if (!Array.isArray(compressedObj[property])) {
          compressedObj[property] = [compressedObj[property]];
        }
        compressedObj[property].push(val2);
      } else {
        if (options.isArray(property, newJpath, isLeaf)) {
          compressedObj[property] = [val2];
        } else {
          compressedObj[property] = val2;
        }
      }
    }
  }
  if (typeof text === "string") {
    if (text.length > 0) compressedObj[options.textNodeName] = text;
  } else if (text !== void 0) compressedObj[options.textNodeName] = text;
  return compressedObj;
}
function propName$1(obj) {
  const keys = Object.keys(obj);
  for (let i2 = 0; i2 < keys.length; i2++) {
    const key = keys[i2];
    if (key !== ":@") return key;
  }
}
function assignAttributes(obj, attrMap, jpath, options) {
  if (attrMap) {
    const keys = Object.keys(attrMap);
    const len = keys.length;
    for (let i2 = 0; i2 < len; i2++) {
      const atrrName = keys[i2];
      if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
        obj[atrrName] = [attrMap[atrrName]];
      } else {
        obj[atrrName] = attrMap[atrrName];
      }
    }
  }
}
function isLeafTag(obj, options) {
  const { textNodeName } = options;
  const propCount = Object.keys(obj).length;
  if (propCount === 0) {
    return true;
  }
  if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
    return true;
  }
  return false;
}
node2json.prettify = prettify$1;
const { buildOptions } = OptionsBuilder;
const OrderedObjParser2 = OrderedObjParser_1;
const { prettify } = node2json;
const validator$1 = validator$2;
let XMLParser$1 = class XMLParser {
  constructor(options) {
    this.externalEntities = {};
    this.options = buildOptions(options);
  }
  /**
   * Parse XML dats to JS object 
   * @param {string|Buffer} xmlData 
   * @param {boolean|Object} validationOption 
   */
  parse(xmlData, validationOption) {
    if (typeof xmlData === "string") ;
    else if (xmlData.toString) {
      xmlData = xmlData.toString();
    } else {
      throw new Error("XML data is accepted in String or Bytes[] form.");
    }
    if (validationOption) {
      if (validationOption === true) validationOption = {};
      const result = validator$1.validate(xmlData, validationOption);
      if (result !== true) {
        throw Error("".concat(result.err.msg, ":").concat(result.err.line, ":").concat(result.err.col));
      }
    }
    const orderedObjParser = new OrderedObjParser2(this.options);
    orderedObjParser.addExternalEntities(this.externalEntities);
    const orderedResult = orderedObjParser.parseXml(xmlData);
    if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
    else return prettify(orderedResult, this.options);
  }
  /**
   * Add Entity which is not by default supported by this library
   * @param {string} key 
   * @param {string} value 
   */
  addEntity(key, value) {
    if (value.indexOf("&") !== -1) {
      throw new Error("Entity value can't have '&'");
    } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
      throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    } else if (value === "&") {
      throw new Error("An entity with value '&' is not permitted");
    } else {
      this.externalEntities[key] = value;
    }
  }
};
var XMLParser_1 = XMLParser$1;
const EOL = "\n";
function toXml(jArray, options) {
  let indentation = "";
  if (options.format && options.indentBy.length > 0) {
    indentation = EOL;
  }
  return arrToStr(jArray, options, "", indentation);
}
function arrToStr(arr, options, jPath, indentation) {
  let xmlStr = "";
  let isPreviousElementTag = false;
  for (let i2 = 0; i2 < arr.length; i2++) {
    const tagObj = arr[i2];
    const tagName = propName(tagObj);
    if (tagName === void 0) continue;
    let newJPath = "";
    if (jPath.length === 0) newJPath = tagName;
    else newJPath = "".concat(jPath, ".").concat(tagName);
    if (tagName === options.textNodeName) {
      let tagText = tagObj[tagName];
      if (!isStopNode(newJPath, options)) {
        tagText = options.tagValueProcessor(tagName, tagText);
        tagText = replaceEntitiesValue(tagText, options);
      }
      if (isPreviousElementTag) {
        xmlStr += indentation;
      }
      xmlStr += tagText;
      isPreviousElementTag = false;
      continue;
    } else if (tagName === options.cdataPropName) {
      if (isPreviousElementTag) {
        xmlStr += indentation;
      }
      xmlStr += "<![CDATA[".concat(tagObj[tagName][0][options.textNodeName], "]]>");
      isPreviousElementTag = false;
      continue;
    } else if (tagName === options.commentPropName) {
      xmlStr += indentation + "<!--".concat(tagObj[tagName][0][options.textNodeName], "-->");
      isPreviousElementTag = true;
      continue;
    } else if (tagName[0] === "?") {
      const attStr2 = attr_to_str(tagObj[":@"], options);
      const tempInd = tagName === "?xml" ? "" : indentation;
      let piTextNodeName = tagObj[tagName][0][options.textNodeName];
      piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
      xmlStr += tempInd + "<".concat(tagName).concat(piTextNodeName).concat(attStr2, "?>");
      isPreviousElementTag = true;
      continue;
    }
    let newIdentation = indentation;
    if (newIdentation !== "") {
      newIdentation += options.indentBy;
    }
    const attStr = attr_to_str(tagObj[":@"], options);
    const tagStart = indentation + "<".concat(tagName).concat(attStr);
    const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
    if (options.unpairedTags.indexOf(tagName) !== -1) {
      if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
      else xmlStr += tagStart + "/>";
    } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
      xmlStr += tagStart + "/>";
    } else if (tagValue && tagValue.endsWith(">")) {
      xmlStr += tagStart + ">".concat(tagValue).concat(indentation, "</").concat(tagName, ">");
    } else {
      xmlStr += tagStart + ">";
      if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
        xmlStr += indentation + options.indentBy + tagValue + indentation;
      } else {
        xmlStr += tagValue;
      }
      xmlStr += "</".concat(tagName, ">");
    }
    isPreviousElementTag = true;
  }
  return xmlStr;
}
function propName(obj) {
  const keys = Object.keys(obj);
  for (let i2 = 0; i2 < keys.length; i2++) {
    const key = keys[i2];
    if (!obj.hasOwnProperty(key)) continue;
    if (key !== ":@") return key;
  }
}
function attr_to_str(attrMap, options) {
  let attrStr = "";
  if (attrMap && !options.ignoreAttributes) {
    for (let attr in attrMap) {
      if (!attrMap.hasOwnProperty(attr)) continue;
      let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
      attrVal = replaceEntitiesValue(attrVal, options);
      if (attrVal === true && options.suppressBooleanAttributes) {
        attrStr += " ".concat(attr.substr(options.attributeNamePrefix.length));
      } else {
        attrStr += " ".concat(attr.substr(options.attributeNamePrefix.length), '="').concat(attrVal, '"');
      }
    }
  }
  return attrStr;
}
function isStopNode(jPath, options) {
  jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
  let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
  for (let index in options.stopNodes) {
    if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
  }
  return false;
}
function replaceEntitiesValue(textValue, options) {
  if (textValue && textValue.length > 0 && options.processEntities) {
    for (let i2 = 0; i2 < options.entities.length; i2++) {
      const entity = options.entities[i2];
      textValue = textValue.replace(entity.regex, entity.val);
    }
  }
  return textValue;
}
var orderedJs2Xml = toXml;
const buildFromOrderedJs = orderedJs2Xml;
const getIgnoreAttributesFn = ignoreAttributes;
const defaultOptions = {
  attributeNamePrefix: "@_",
  attributesGroupName: false,
  textNodeName: "#text",
  ignoreAttributes: true,
  cdataPropName: false,
  format: false,
  indentBy: "  ",
  suppressEmptyNode: false,
  suppressUnpairedNode: true,
  suppressBooleanAttributes: true,
  tagValueProcessor: function(key, a2) {
    return a2;
  },
  attributeValueProcessor: function(attrName, a2) {
    return a2;
  },
  preserveOrder: false,
  commentPropName: false,
  unpairedTags: [],
  entities: [
    { regex: new RegExp("&", "g"), val: "&amp;" },
    //it must be on top
    { regex: new RegExp(">", "g"), val: "&gt;" },
    { regex: new RegExp("<", "g"), val: "&lt;" },
    { regex: new RegExp("'", "g"), val: "&apos;" },
    { regex: new RegExp('"', "g"), val: "&quot;" }
  ],
  processEntities: true,
  stopNodes: [],
  // transformTagName: false,
  // transformAttributeName: false,
  oneListGroup: false
};
function Builder(options) {
  this.options = Object.assign({}, defaultOptions, options);
  if (this.options.ignoreAttributes === true || this.options.attributesGroupName) {
    this.isAttribute = function() {
      return false;
    };
  } else {
    this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
    this.attrPrefixLen = this.options.attributeNamePrefix.length;
    this.isAttribute = isAttribute;
  }
  this.processTextOrObjNode = processTextOrObjNode;
  if (this.options.format) {
    this.indentate = indentate;
    this.tagEndChar = ">\n";
    this.newLine = "\n";
  } else {
    this.indentate = function() {
      return "";
    };
    this.tagEndChar = ">";
    this.newLine = "";
  }
}
Builder.prototype.build = function(jObj) {
  if (this.options.preserveOrder) {
    return buildFromOrderedJs(jObj, this.options);
  } else {
    if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
      jObj = {
        [this.options.arrayNodeName]: jObj
      };
    }
    return this.j2x(jObj, 0, []).val;
  }
};
Builder.prototype.j2x = function(jObj, level, ajPath) {
  let attrStr = "";
  let val2 = "";
  const jPath = ajPath.join(".");
  for (let key in jObj) {
    if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
    if (typeof jObj[key] === "undefined") {
      if (this.isAttribute(key)) {
        val2 += "";
      }
    } else if (jObj[key] === null) {
      if (this.isAttribute(key)) {
        val2 += "";
      } else if (key[0] === "?") {
        val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
      } else {
        val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
      }
    } else if (jObj[key] instanceof Date) {
      val2 += this.buildTextValNode(jObj[key], key, "", level);
    } else if (typeof jObj[key] !== "object") {
      const attr = this.isAttribute(key);
      if (attr && !this.ignoreAttributesFn(attr, jPath)) {
        attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
      } else if (!attr) {
        if (key === this.options.textNodeName) {
          let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
          val2 += this.replaceEntitiesValue(newval);
        } else {
          val2 += this.buildTextValNode(jObj[key], key, "", level);
        }
      }
    } else if (Array.isArray(jObj[key])) {
      const arrLen = jObj[key].length;
      let listTagVal = "";
      let listTagAttr = "";
      for (let j2 = 0; j2 < arrLen; j2++) {
        const item = jObj[key][j2];
        if (typeof item === "undefined") ;
        else if (item === null) {
          if (key[0] === "?") val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          else val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        } else if (typeof item === "object") {
          if (this.options.oneListGroup) {
            const result = this.j2x(item, level + 1, ajPath.concat(key));
            listTagVal += result.val;
            if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
              listTagAttr += result.attrStr;
            }
          } else {
            listTagVal += this.processTextOrObjNode(item, key, level, ajPath);
          }
        } else {
          if (this.options.oneListGroup) {
            let textValue = this.options.tagValueProcessor(key, item);
            textValue = this.replaceEntitiesValue(textValue);
            listTagVal += textValue;
          } else {
            listTagVal += this.buildTextValNode(item, key, "", level);
          }
        }
      }
      if (this.options.oneListGroup) {
        listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
      }
      val2 += listTagVal;
    } else {
      if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
        const Ks = Object.keys(jObj[key]);
        const L2 = Ks.length;
        for (let j2 = 0; j2 < L2; j2++) {
          attrStr += this.buildAttrPairStr(Ks[j2], "" + jObj[key][Ks[j2]]);
        }
      } else {
        val2 += this.processTextOrObjNode(jObj[key], key, level, ajPath);
      }
    }
  }
  return { attrStr, val: val2 };
};
Builder.prototype.buildAttrPairStr = function(attrName, val2) {
  val2 = this.options.attributeValueProcessor(attrName, "" + val2);
  val2 = this.replaceEntitiesValue(val2);
  if (this.options.suppressBooleanAttributes && val2 === "true") {
    return " " + attrName;
  } else return " " + attrName + '="' + val2 + '"';
};
function processTextOrObjNode(object, key, level, ajPath) {
  const result = this.j2x(object, level + 1, ajPath.concat(key));
  if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
    return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
  } else {
    return this.buildObjectNode(result.val, key, result.attrStr, level);
  }
}
Builder.prototype.buildObjectNode = function(val2, key, attrStr, level) {
  if (val2 === "") {
    if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
    else {
      return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
    }
  } else {
    let tagEndExp = "</" + key + this.tagEndChar;
    let piClosingChar = "";
    if (key[0] === "?") {
      piClosingChar = "?";
      tagEndExp = "";
    }
    if ((attrStr || attrStr === "") && val2.indexOf("<") === -1) {
      return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val2 + tagEndExp;
    } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
      return this.indentate(level) + "<!--".concat(val2, "-->") + this.newLine;
    } else {
      return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val2 + this.indentate(level) + tagEndExp;
    }
  }
};
Builder.prototype.closeTag = function(key) {
  let closeTag = "";
  if (this.options.unpairedTags.indexOf(key) !== -1) {
    if (!this.options.suppressUnpairedNode) closeTag = "/";
  } else if (this.options.suppressEmptyNode) {
    closeTag = "/";
  } else {
    closeTag = "></".concat(key);
  }
  return closeTag;
};
Builder.prototype.buildTextValNode = function(val2, key, attrStr, level) {
  if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
    return this.indentate(level) + "<![CDATA[".concat(val2, "]]>") + this.newLine;
  } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
    return this.indentate(level) + "<!--".concat(val2, "-->") + this.newLine;
  } else if (key[0] === "?") {
    return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
  } else {
    let textValue = this.options.tagValueProcessor(key, val2);
    textValue = this.replaceEntitiesValue(textValue);
    if (textValue === "") {
      return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
    } else {
      return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
    }
  }
};
Builder.prototype.replaceEntitiesValue = function(textValue) {
  if (textValue && textValue.length > 0 && this.options.processEntities) {
    for (let i2 = 0; i2 < this.options.entities.length; i2++) {
      const entity = this.options.entities[i2];
      textValue = textValue.replace(entity.regex, entity.val);
    }
  }
  return textValue;
};
function indentate(level) {
  return this.options.indentBy.repeat(level);
}
function isAttribute(name) {
  if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
    return name.substr(this.attrPrefixLen);
  } else {
    return false;
  }
}
var json2xml = Builder;
const validator = validator$2;
const XMLParser2 = XMLParser_1;
const XMLBuilder = json2xml;
var fxp = {
  XMLParser: XMLParser2,
  XMLValidator: validator,
  XMLBuilder
};
function isRootMetadata(metadata) {
  return metadata.users !== void 0;
}
const getLogger = (user) => {
  if (user === null) {
    return getLoggerBuilder().setApp("end_to_end_encryption").build();
  }
  return getLoggerBuilder().setApp("end_to_end_encryption").setUid(user.uid).build();
};
const logger = getLogger(getCurrentUser());
class ByteStream {
  constructor(parameters = {}) {
    if ("view" in parameters) {
      this.fromUint8Array(parameters.view);
    } else if ("buffer" in parameters) {
      this.fromArrayBuffer(parameters.buffer);
    } else if ("string" in parameters) {
      this.fromString(parameters.string);
    } else if ("hexstring" in parameters) {
      this.fromHexString(parameters.hexstring);
    } else {
      if ("length" in parameters && parameters.length > 0) {
        this.length = parameters.length;
        if (parameters.stub) {
          for (let i2 = 0; i2 < this._view.length; i2++) {
            this._view[i2] = parameters.stub;
          }
        }
      } else {
        this.length = 0;
      }
    }
  }
  set buffer(value) {
    this._buffer = value;
    this._view = new Uint8Array(this._buffer);
  }
  get buffer() {
    return this._buffer;
  }
  set view(value) {
    this._buffer = new ArrayBuffer(value.length);
    this._view = new Uint8Array(this._buffer);
    this._view.set(value);
  }
  get view() {
    return this._view;
  }
  get length() {
    return this.view.byteLength;
  }
  set length(value) {
    this._buffer = new ArrayBuffer(value);
    this._view = new Uint8Array(this._buffer);
  }
  clear() {
    this._buffer = new ArrayBuffer(0);
    this._view = new Uint8Array(this._buffer);
  }
  fromArrayBuffer(array) {
    this._buffer = array;
    this._view = new Uint8Array(this._buffer);
  }
  fromUint8Array(array) {
    this.fromArrayBuffer(new Uint8Array(array).buffer);
  }
  fromString(string) {
    const stringLength = string.length;
    this.length = stringLength;
    for (let i2 = 0; i2 < stringLength; i2++)
      this.view[i2] = string.charCodeAt(i2);
  }
  toString(start = 0, length = this.view.length - start) {
    let result = "";
    if (start >= this.view.length || start < 0) {
      start = 0;
    }
    if (length >= this.view.length || length < 0) {
      length = this.view.length - start;
    }
    for (let i2 = start; i2 < start + length; i2++)
      result += String.fromCharCode(this.view[i2]);
    return result;
  }
  fromHexString(hexString) {
    const stringLength = hexString.length;
    this.buffer = new ArrayBuffer(stringLength >> 1);
    this.view = new Uint8Array(this.buffer);
    const hexMap = /* @__PURE__ */ new Map();
    hexMap.set("0", 0);
    hexMap.set("1", 1);
    hexMap.set("2", 2);
    hexMap.set("3", 3);
    hexMap.set("4", 4);
    hexMap.set("5", 5);
    hexMap.set("6", 6);
    hexMap.set("7", 7);
    hexMap.set("8", 8);
    hexMap.set("9", 9);
    hexMap.set("A", 10);
    hexMap.set("a", 10);
    hexMap.set("B", 11);
    hexMap.set("b", 11);
    hexMap.set("C", 12);
    hexMap.set("c", 12);
    hexMap.set("D", 13);
    hexMap.set("d", 13);
    hexMap.set("E", 14);
    hexMap.set("e", 14);
    hexMap.set("F", 15);
    hexMap.set("f", 15);
    let j2 = 0;
    let temp = 0;
    for (let i2 = 0; i2 < stringLength; i2++) {
      if (!(i2 % 2)) {
        temp = hexMap.get(hexString.charAt(i2)) << 4;
      } else {
        temp |= hexMap.get(hexString.charAt(i2));
        this.view[j2] = temp;
        j2++;
      }
    }
  }
  toHexString(start = 0, length = this.view.length - start) {
    let result = "";
    if (start >= this.view.length || start < 0) {
      start = 0;
    }
    if (length >= this.view.length || length < 0) {
      length = this.view.length - start;
    }
    for (let i2 = start; i2 < start + length; i2++) {
      const str = this.view[i2].toString(16).toUpperCase();
      result = result + (str.length == 1 ? "0" : "") + str;
    }
    return result;
  }
  copy(start = 0, length = this.length - start) {
    if (!start && !this.length) {
      return new ByteStream();
    }
    if (start < 0 || start > this.length - 1) {
      throw new Error("Wrong start position: ".concat(start));
    }
    const stream = new ByteStream({
      buffer: this._buffer.slice(start, start + length)
    });
    return stream;
  }
  slice(start = 0, end = this.length) {
    if (!start && !this.length) {
      return new ByteStream();
    }
    if (start < 0 || start > this.length - 1) {
      throw new Error("Wrong start position: ".concat(start));
    }
    const stream = new ByteStream({
      buffer: this._buffer.slice(start, end)
    });
    return stream;
  }
  realloc(size) {
    const buffer = new ArrayBuffer(size);
    const view = new Uint8Array(buffer);
    if (size > this._view.length)
      view.set(this._view);
    else {
      view.set(new Uint8Array(this._buffer, 0, size));
    }
    this._buffer = buffer;
    this._view = new Uint8Array(this._buffer);
  }
  append(stream) {
    const initialSize = this.length;
    const streamViewLength = stream.length;
    const subarrayView = stream._view.subarray();
    this.realloc(initialSize + streamViewLength);
    this._view.set(subarrayView, initialSize);
  }
  insert(stream, start = 0, length = this.length - start) {
    if (start > this.length - 1)
      return false;
    if (length > this.length - start) {
      length = this.length - start;
    }
    if (length > stream.length) {
      length = stream.length;
    }
    if (length == stream.length)
      this._view.set(stream._view, start);
    else {
      this._view.set(stream._view.subarray(0, length), start);
    }
    return true;
  }
  isEqual(stream) {
    if (this.length != stream.length)
      return false;
    for (let i2 = 0; i2 < stream.length; i2++) {
      if (this.view[i2] != stream.view[i2])
        return false;
    }
    return true;
  }
  isEqualView(view) {
    if (view.length != this.view.length)
      return false;
    for (let i2 = 0; i2 < view.length; i2++) {
      if (this.view[i2] != view[i2])
        return false;
    }
    return true;
  }
  findPattern(pattern, start_, length_, backward_) {
    const { start, length, backward } = this.prepareFindParameters(start_, length_, backward_);
    const patternLength = pattern.length;
    if (patternLength > length) {
      return -1;
    }
    const patternArray = [];
    for (let i2 = 0; i2 < patternLength; i2++)
      patternArray.push(pattern.view[i2]);
    for (let i2 = 0; i2 <= length - patternLength; i2++) {
      let equal = true;
      const equalStart = backward ? start - patternLength - i2 : start + i2;
      for (let j2 = 0; j2 < patternLength; j2++) {
        if (this.view[j2 + equalStart] != patternArray[j2]) {
          equal = false;
          break;
        }
      }
      if (equal) {
        return backward ? start - patternLength - i2 : start + patternLength + i2;
      }
    }
    return -1;
  }
  findFirstIn(patterns, start_, length_, backward_) {
    const { start, length, backward } = this.prepareFindParameters(start_, length_, backward_);
    const result = {
      id: -1,
      position: backward ? 0 : start + length,
      length: 0
    };
    for (let i2 = 0; i2 < patterns.length; i2++) {
      const position = this.findPattern(patterns[i2], start, length, backward);
      if (position != -1) {
        let valid = false;
        const patternLength = patterns[i2].length;
        if (backward) {
          if (position - patternLength >= result.position - result.length)
            valid = true;
        } else {
          if (position - patternLength <= result.position - result.length)
            valid = true;
        }
        if (valid) {
          result.position = position;
          result.id = i2;
          result.length = patternLength;
        }
      }
    }
    return result;
  }
  findAllIn(patterns, start_, length_) {
    let { start, length } = this.prepareFindParameters(start_, length_);
    const result = [];
    let patternFound = {
      id: -1,
      position: start
    };
    do {
      const position = patternFound.position;
      patternFound = this.findFirstIn(patterns, patternFound.position, length);
      if (patternFound.id == -1) {
        break;
      }
      length -= patternFound.position - position;
      result.push({
        id: patternFound.id,
        position: patternFound.position
      });
    } while (true);
    return result;
  }
  findAllPatternIn(pattern, start_, length_) {
    const { start, length } = this.prepareFindParameters(start_, length_);
    const result = [];
    const patternLength = pattern.length;
    if (patternLength > length) {
      return -1;
    }
    const patternArray = Array.from(pattern.view);
    for (let i2 = 0; i2 <= length - patternLength; i2++) {
      let equal = true;
      const equalStart = start + i2;
      for (let j2 = 0; j2 < patternLength; j2++) {
        if (this.view[j2 + equalStart] != patternArray[j2]) {
          equal = false;
          break;
        }
      }
      if (equal) {
        result.push(start + patternLength + i2);
        i2 += patternLength - 1;
      }
    }
    return result;
  }
  findFirstNotIn(patterns, start_, length_, backward_) {
    let { start, length, backward } = this.prepareFindParameters(start_, length_, backward_);
    const result = {
      left: {
        id: -1,
        position: start
      },
      right: {
        id: -1,
        position: 0
      },
      value: new ByteStream()
    };
    let currentLength = length;
    while (currentLength > 0) {
      result.right = this.findFirstIn(patterns, backward ? start - length + currentLength : start + length - currentLength, currentLength, backward);
      if (result.right.id == -1) {
        length = currentLength;
        if (backward) {
          start -= length;
        } else {
          start = result.left.position;
        }
        result.value = new ByteStream({
          buffer: this._buffer.slice(start, start + length)
        });
        break;
      }
      if (result.right.position != (backward ? result.left.position - patterns[result.right.id].length : result.left.position + patterns[result.right.id].length)) {
        if (backward) {
          start = result.right.position + patterns[result.right.id].length;
          length = result.left.position - result.right.position - patterns[result.right.id].length;
        } else {
          start = result.left.position;
          length = result.right.position - result.left.position - patterns[result.right.id].length;
        }
        result.value = new ByteStream({
          buffer: this._buffer.slice(start, start + length)
        });
        break;
      }
      result.left = result.right;
      currentLength -= patterns[result.right.id].length;
    }
    if (backward) {
      const temp = result.right;
      result.right = result.left;
      result.left = temp;
    }
    return result;
  }
  findAllNotIn(patterns, start_, length_) {
    let { start, length } = this.prepareFindParameters(start_, length_);
    const result = [];
    let patternFound = {
      left: {
        id: -1,
        position: start
      },
      right: {
        id: -1,
        position: start
      },
      value: new ByteStream()
    };
    do {
      const position = patternFound.right.position;
      patternFound = this.findFirstNotIn(patterns, patternFound.right.position, length);
      length -= patternFound.right.position - position;
      result.push({
        left: {
          id: patternFound.left.id,
          position: patternFound.left.position
        },
        right: {
          id: patternFound.right.id,
          position: patternFound.right.position
        },
        value: patternFound.value
      });
    } while (patternFound.right.id != -1);
    return result;
  }
  findFirstSequence(patterns, start_, length_, backward_) {
    let { start, length, backward } = this.prepareFindParameters(start_, length_, backward_);
    const firstIn = this.skipNotPatterns(patterns, start, length, backward);
    if (firstIn == -1) {
      return {
        position: -1,
        value: new ByteStream()
      };
    }
    const firstNotIn = this.skipPatterns(patterns, firstIn, length - (backward ? start - firstIn : firstIn - start), backward);
    if (backward) {
      start = firstNotIn;
      length = firstIn - firstNotIn;
    } else {
      start = firstIn;
      length = firstNotIn - firstIn;
    }
    const value = new ByteStream({
      buffer: this._buffer.slice(start, start + length)
    });
    return {
      position: firstNotIn,
      value
    };
  }
  findAllSequences(patterns, start_, length_) {
    let { start, length } = this.prepareFindParameters(start_, length_);
    const result = [];
    let patternFound = {
      position: start,
      value: new ByteStream()
    };
    do {
      const position = patternFound.position;
      patternFound = this.findFirstSequence(patterns, patternFound.position, length);
      if (patternFound.position != -1) {
        length -= patternFound.position - position;
        result.push({
          position: patternFound.position,
          value: patternFound.value
        });
      }
    } while (patternFound.position != -1);
    return result;
  }
  findPairedPatterns(leftPattern, rightPattern, start_, length_) {
    const result = [];
    if (leftPattern.isEqual(rightPattern))
      return result;
    const { start, length } = this.prepareFindParameters(start_, length_);
    let currentPositionLeft = 0;
    const leftPatterns = this.findAllPatternIn(leftPattern, start, length);
    if (!Array.isArray(leftPatterns) || leftPatterns.length == 0) {
      return result;
    }
    const rightPatterns = this.findAllPatternIn(rightPattern, start, length);
    if (!Array.isArray(rightPatterns) || rightPatterns.length == 0) {
      return result;
    }
    while (currentPositionLeft < leftPatterns.length) {
      if (rightPatterns.length == 0) {
        break;
      }
      if (leftPatterns[0] == rightPatterns[0]) {
        result.push({
          left: leftPatterns[0],
          right: rightPatterns[0]
        });
        leftPatterns.splice(0, 1);
        rightPatterns.splice(0, 1);
        continue;
      }
      if (leftPatterns[currentPositionLeft] > rightPatterns[0]) {
        break;
      }
      while (leftPatterns[currentPositionLeft] < rightPatterns[0]) {
        currentPositionLeft++;
        if (currentPositionLeft >= leftPatterns.length) {
          break;
        }
      }
      result.push({
        left: leftPatterns[currentPositionLeft - 1],
        right: rightPatterns[0]
      });
      leftPatterns.splice(currentPositionLeft - 1, 1);
      rightPatterns.splice(0, 1);
      currentPositionLeft = 0;
    }
    result.sort((a2, b2) => a2.left - b2.left);
    return result;
  }
  findPairedArrays(inputLeftPatterns, inputRightPatterns, start_, length_) {
    const { start, length } = this.prepareFindParameters(start_, length_);
    const result = [];
    let currentPositionLeft = 0;
    const leftPatterns = this.findAllIn(inputLeftPatterns, start, length);
    if (leftPatterns.length == 0)
      return result;
    const rightPatterns = this.findAllIn(inputRightPatterns, start, length);
    if (rightPatterns.length == 0)
      return result;
    while (currentPositionLeft < leftPatterns.length) {
      if (rightPatterns.length == 0) {
        break;
      }
      if (leftPatterns[0].position == rightPatterns[0].position) {
        result.push({
          left: leftPatterns[0],
          right: rightPatterns[0]
        });
        leftPatterns.splice(0, 1);
        rightPatterns.splice(0, 1);
        continue;
      }
      if (leftPatterns[currentPositionLeft].position > rightPatterns[0].position) {
        break;
      }
      while (leftPatterns[currentPositionLeft].position < rightPatterns[0].position) {
        currentPositionLeft++;
        if (currentPositionLeft >= leftPatterns.length) {
          break;
        }
      }
      result.push({
        left: leftPatterns[currentPositionLeft - 1],
        right: rightPatterns[0]
      });
      leftPatterns.splice(currentPositionLeft - 1, 1);
      rightPatterns.splice(0, 1);
      currentPositionLeft = 0;
    }
    result.sort((a2, b2) => a2.left.position - b2.left.position);
    return result;
  }
  replacePattern(searchPattern, replacePattern, start_, length_, findAllResult = null) {
    let result = [];
    let i2;
    const output = {
      status: -1,
      searchPatternPositions: [],
      replacePatternPositions: []
    };
    const { start, length } = this.prepareFindParameters(start_, length_);
    if (findAllResult == null) {
      result = this.findAllIn([searchPattern], start, length);
      if (result.length == 0) {
        return output;
      }
    } else {
      result = findAllResult;
    }
    output.searchPatternPositions.push(...Array.from(result, (element) => element.position));
    const patternDifference = searchPattern.length - replacePattern.length;
    const changedBuffer = new ArrayBuffer(this.view.length - result.length * patternDifference);
    const changedView = new Uint8Array(changedBuffer);
    changedView.set(new Uint8Array(this.buffer, 0, start));
    for (i2 = 0; i2 < result.length; i2++) {
      const currentPosition = i2 == 0 ? start : result[i2 - 1].position;
      changedView.set(new Uint8Array(this.buffer, currentPosition, result[i2].position - searchPattern.length - currentPosition), currentPosition - i2 * patternDifference);
      changedView.set(replacePattern.view, result[i2].position - searchPattern.length - i2 * patternDifference);
      output.replacePatternPositions.push(result[i2].position - searchPattern.length - i2 * patternDifference);
    }
    i2--;
    changedView.set(new Uint8Array(this.buffer, result[i2].position, this.length - result[i2].position), result[i2].position - searchPattern.length + replacePattern.length - i2 * patternDifference);
    this.buffer = changedBuffer;
    this.view = new Uint8Array(this.buffer);
    output.status = 1;
    return output;
  }
  skipPatterns(patterns, start_, length_, backward_) {
    const { start, length, backward } = this.prepareFindParameters(start_, length_, backward_);
    let result = start;
    for (let k2 = 0; k2 < patterns.length; k2++) {
      const patternLength = patterns[k2].length;
      const equalStart = backward ? result - patternLength : result;
      let equal = true;
      for (let j2 = 0; j2 < patternLength; j2++) {
        if (this.view[j2 + equalStart] != patterns[k2].view[j2]) {
          equal = false;
          break;
        }
      }
      if (equal) {
        k2 = -1;
        if (backward) {
          result -= patternLength;
          if (result <= 0)
            return result;
        } else {
          result += patternLength;
          if (result >= start + length)
            return result;
        }
      }
    }
    return result;
  }
  skipNotPatterns(patterns, start_, length_, backward_) {
    const { start, length, backward } = this.prepareFindParameters(start_, length_, backward_);
    let result = -1;
    for (let i2 = 0; i2 < length; i2++) {
      for (let k2 = 0; k2 < patterns.length; k2++) {
        const patternLength = patterns[k2].length;
        const equalStart = backward ? start - i2 - patternLength : start + i2;
        let equal = true;
        for (let j2 = 0; j2 < patternLength; j2++) {
          if (this.view[j2 + equalStart] != patterns[k2].view[j2]) {
            equal = false;
            break;
          }
        }
        if (equal) {
          result = backward ? start - i2 : start + i2;
          break;
        }
      }
      if (result != -1) {
        break;
      }
    }
    return result;
  }
  prepareFindParameters(start = null, length = null, backward = false) {
    if (start === null) {
      start = backward ? this.length : 0;
    }
    if (start > this.length) {
      start = this.length;
    }
    if (backward) {
      if (length === null) {
        length = start;
      }
      if (length > start) {
        length = start;
      }
    } else {
      if (length === null) {
        length = this.length - start;
      }
      if (length > this.length - start) {
        length = this.length - start;
      }
    }
    return { start, length, backward };
  }
}
const pow2_24 = 16777216;
class SeqStream {
  constructor(parameters = {}) {
    this._stream = new ByteStream();
    this._length = 0;
    this._start = 0;
    this.backward = false;
    this.appendBlock = 0;
    this.prevLength = 0;
    this.prevStart = 0;
    if ("view" in parameters) {
      this.stream = new ByteStream({ view: parameters.view });
    } else if ("buffer" in parameters) {
      this.stream = new ByteStream({ buffer: parameters.buffer });
    } else if ("string" in parameters) {
      this.stream = new ByteStream({ string: parameters.string });
    } else if ("hexstring" in parameters) {
      this.stream = new ByteStream({ hexstring: parameters.hexstring });
    } else if ("stream" in parameters) {
      this.stream = parameters.stream.slice();
    } else {
      this.stream = new ByteStream();
    }
    if ("backward" in parameters && parameters.backward) {
      this.backward = parameters.backward;
      this._start = this.stream.length;
    }
    if ("length" in parameters && parameters.length > 0) {
      this._length = parameters.length;
    }
    if ("start" in parameters && parameters.start && parameters.start > 0) {
      this._start = parameters.start;
    }
    if ("appendBlock" in parameters && parameters.appendBlock && parameters.appendBlock > 0) {
      this.appendBlock = parameters.appendBlock;
    }
  }
  set stream(value) {
    this._stream = value;
    this.prevLength = this._length;
    this._length = value.length;
    this.prevStart = this._start;
    this._start = 0;
  }
  get stream() {
    return this._stream;
  }
  set length(value) {
    this.prevLength = this._length;
    this._length = value;
  }
  get length() {
    if (this.appendBlock) {
      return this.start;
    }
    return this._length;
  }
  set start(value) {
    if (value > this.stream.length)
      return;
    this.prevStart = this._start;
    this.prevLength = this._length;
    this._length -= this.backward ? this._start - value : value - this._start;
    this._start = value;
  }
  get start() {
    return this._start;
  }
  get buffer() {
    return this._stream.buffer.slice(0, this._length);
  }
  resetPosition() {
    this._start = this.prevStart;
    this._length = this.prevLength;
  }
  findPattern(pattern, gap = null) {
    if (gap == null || gap > this.length) {
      gap = this.length;
    }
    const result = this.stream.findPattern(pattern, this.start, this.length, this.backward);
    if (result == -1)
      return result;
    if (this.backward) {
      if (result < this.start - pattern.length - gap) {
        return -1;
      }
    } else {
      if (result > this.start + pattern.length + gap) {
        return -1;
      }
    }
    this.start = result;
    return result;
  }
  findFirstIn(patterns, gap = null) {
    if (gap == null || gap > this.length) {
      gap = this.length;
    }
    const result = this.stream.findFirstIn(patterns, this.start, this.length, this.backward);
    if (result.id == -1)
      return result;
    if (this.backward) {
      if (result.position < this.start - patterns[result.id].length - gap) {
        return {
          id: -1,
          position: this.backward ? 0 : this.start + this.length
        };
      }
    } else {
      if (result.position > this.start + patterns[result.id].length + gap) {
        return {
          id: -1,
          position: this.backward ? 0 : this.start + this.length
        };
      }
    }
    this.start = result.position;
    return result;
  }
  findAllIn(patterns) {
    const start = this.backward ? this.start - this.length : this.start;
    return this.stream.findAllIn(patterns, start, this.length);
  }
  findFirstNotIn(patterns, gap = null) {
    if (gap == null || gap > this._length) {
      gap = this._length;
    }
    const result = this._stream.findFirstNotIn(patterns, this._start, this._length, this.backward);
    if (result.left.id == -1 && result.right.id == -1) {
      return result;
    }
    if (this.backward) {
      if (result.right.id != -1) {
        if (result.right.position < this._start - patterns[result.right.id].length - gap) {
          return {
            left: {
              id: -1,
              position: this._start
            },
            right: {
              id: -1,
              position: 0
            },
            value: new ByteStream()
          };
        }
      }
    } else {
      if (result.left.id != -1) {
        if (result.left.position > this._start + patterns[result.left.id].length + gap) {
          return {
            left: {
              id: -1,
              position: this._start
            },
            right: {
              id: -1,
              position: 0
            },
            value: new ByteStream()
          };
        }
      }
    }
    if (this.backward) {
      if (result.left.id == -1) {
        this.start = 0;
      } else {
        this.start = result.left.position;
      }
    } else {
      if (result.right.id == -1) {
        this.start = this._start + this._length;
      } else {
        this.start = result.right.position;
      }
    }
    return result;
  }
  findAllNotIn(patterns) {
    const start = this.backward ? this._start - this._length : this._start;
    return this._stream.findAllNotIn(patterns, start, this._length);
  }
  findFirstSequence(patterns, length = null, gap = null) {
    if (length == null || length > this._length) {
      length = this._length;
    }
    if (gap == null || gap > length) {
      gap = length;
    }
    const result = this._stream.findFirstSequence(patterns, this._start, length, this.backward);
    if (result.value.length == 0) {
      return result;
    }
    if (this.backward) {
      if (result.position < this._start - result.value.length - gap) {
        return {
          position: -1,
          value: new ByteStream()
        };
      }
    } else {
      if (result.position > this._start + result.value.length + gap) {
        return {
          position: -1,
          value: new ByteStream()
        };
      }
    }
    this.start = result.position;
    return result;
  }
  findAllSequences(patterns) {
    const start = this.backward ? this.start - this.length : this.start;
    return this.stream.findAllSequences(patterns, start, this.length);
  }
  findPairedPatterns(leftPattern, rightPattern, gap = null) {
    if (gap == null || gap > this.length) {
      gap = this.length;
    }
    const start = this.backward ? this.start - this.length : this.start;
    const result = this.stream.findPairedPatterns(leftPattern, rightPattern, start, this.length);
    if (result.length) {
      if (this.backward) {
        if (result[0].right < this.start - rightPattern.length - gap) {
          return [];
        }
      } else {
        if (result[0].left > this.start + leftPattern.length + gap) {
          return [];
        }
      }
    }
    return result;
  }
  findPairedArrays(leftPatterns, rightPatterns, gap = null) {
    if (gap == null || gap > this.length) {
      gap = this.length;
    }
    const start = this.backward ? this.start - this.length : this.start;
    const result = this.stream.findPairedArrays(leftPatterns, rightPatterns, start, this.length);
    if (result.length) {
      if (this.backward) {
        if (result[0].right.position < this.start - rightPatterns[result[0].right.id].length - gap) {
          return [];
        }
      } else {
        if (result[0].left.position > this.start + leftPatterns[result[0].left.id].length + gap) {
          return [];
        }
      }
    }
    return result;
  }
  replacePattern(searchPattern, replacePattern) {
    const start = this.backward ? this.start - this.length : this.start;
    return this.stream.replacePattern(searchPattern, replacePattern, start, this.length);
  }
  skipPatterns(patterns) {
    const result = this.stream.skipPatterns(patterns, this.start, this.length, this.backward);
    this.start = result;
    return result;
  }
  skipNotPatterns(patterns) {
    const result = this.stream.skipNotPatterns(patterns, this.start, this.length, this.backward);
    if (result == -1)
      return -1;
    this.start = result;
    return result;
  }
  append(stream) {
    this.beforeAppend(stream.length);
    this._stream.view.set(stream.view, this._start);
    this._length += stream.length * 2;
    this.start = this._start + stream.length;
    this.prevLength -= stream.length * 2;
  }
  appendView(view) {
    this.beforeAppend(view.length);
    this._stream.view.set(view, this._start);
    this._length += view.length * 2;
    this.start = this._start + view.length;
    this.prevLength -= view.length * 2;
  }
  appendChar(char) {
    this.beforeAppend(1);
    this._stream.view[this._start] = char;
    this._length += 2;
    this.start = this._start + 1;
    this.prevLength -= 2;
  }
  appendUint16(number) {
    this.beforeAppend(2);
    const value = new Uint16Array([number]);
    const view = new Uint8Array(value.buffer);
    this.stream.view[this._start] = view[1];
    this._stream.view[this._start + 1] = view[0];
    this._length += 4;
    this.start = this._start + 2;
    this.prevLength -= 4;
  }
  appendUint24(number) {
    this.beforeAppend(3);
    const value = new Uint32Array([number]);
    const view = new Uint8Array(value.buffer);
    this._stream.view[this._start] = view[2];
    this._stream.view[this._start + 1] = view[1];
    this._stream.view[this._start + 2] = view[0];
    this._length += 6;
    this.start = this._start + 3;
    this.prevLength -= 6;
  }
  appendUint32(number) {
    this.beforeAppend(4);
    const value = new Uint32Array([number]);
    const view = new Uint8Array(value.buffer);
    this._stream.view[this._start] = view[3];
    this._stream.view[this._start + 1] = view[2];
    this._stream.view[this._start + 2] = view[1];
    this._stream.view[this._start + 3] = view[0];
    this._length += 8;
    this.start = this._start + 4;
    this.prevLength -= 8;
  }
  appendInt16(number) {
    this.beforeAppend(2);
    const value = new Int16Array([number]);
    const view = new Uint8Array(value.buffer);
    this._stream.view[this._start] = view[1];
    this._stream.view[this._start + 1] = view[0];
    this._length += 4;
    this.start = this._start + 2;
    this.prevLength -= 4;
  }
  appendInt32(number) {
    this.beforeAppend(4);
    const value = new Int32Array([number]);
    const view = new Uint8Array(value.buffer);
    this._stream.view[this._start] = view[3];
    this._stream.view[this._start + 1] = view[2];
    this._stream.view[this._start + 2] = view[1];
    this._stream.view[this._start + 3] = view[0];
    this._length += 8;
    this.start = this._start + 4;
    this.prevLength -= 8;
  }
  getBlock(size, changeLength = true) {
    if (this._length <= 0) {
      return new Uint8Array(0);
    }
    if (this._length < size) {
      size = this._length;
    }
    let result;
    if (this.backward) {
      const view = this._stream.view.subarray(this._length - size, this._length);
      result = new Uint8Array(size);
      for (let i2 = 0; i2 < size; i2++) {
        result[size - 1 - i2] = view[i2];
      }
    } else {
      result = this._stream.view.subarray(this._start, this._start + size);
    }
    if (changeLength) {
      this.start += this.backward ? -1 * size : size;
    }
    return result;
  }
  getUint16(changeLength = true) {
    const block = this.getBlock(2, changeLength);
    if (block.length < 2)
      return 0;
    return block[0] << 8 | block[1];
  }
  getInt16(changeLength = true) {
    const num = this.getUint16(changeLength);
    const negative = 32768;
    if (num & negative) {
      return -(negative - (num ^ negative));
    }
    return num;
  }
  getUint24(changeLength = true) {
    const block = this.getBlock(4, changeLength);
    if (block.length < 3)
      return 0;
    return block[0] << 16 | block[1] << 8 | block[2];
  }
  getUint32(changeLength = true) {
    const block = this.getBlock(4, changeLength);
    if (block.length < 4)
      return 0;
    return block[0] * pow2_24 + (block[1] << 16) + (block[2] << 8) + block[3];
  }
  getInt32(changeLength = true) {
    const num = this.getUint32(changeLength);
    const negative = 2147483648;
    if (num & negative) {
      return -(negative - (num ^ negative));
    }
    return num;
  }
  beforeAppend(size) {
    if (this._start + size > this._stream.length) {
      if (size > this.appendBlock) {
        this.appendBlock = size + SeqStream.APPEND_BLOCK;
      }
      this._stream.realloc(this._stream.length + this.appendBlock);
    }
  }
}
SeqStream.APPEND_BLOCK = 1e3;
function isBytes(a2) {
  return a2 instanceof Uint8Array || ArrayBuffer.isView(a2) && a2.constructor.name === "Uint8Array";
}
function abytes(b2, ...lengths) {
  if (!isBytes(b2))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b2.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b2.length);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
const rotr = (word, shift) => word << 32 - shift | word >>> shift;
const rotl = (word, shift) => word << shift | word >>> 32 - shift >>> 0;
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("utf8ToBytes expected string, got " + typeof str);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
class Hash {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function setBigUint64(view, byteOffset, value, isLE) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h2 = isLE ? 4 : 0;
  const l2 = isLE ? 0 : 4;
  view.setUint32(byteOffset + h2, wh, isLE);
  view.setUint32(byteOffset + l2, wl, isLE);
}
const Chi = (a2, b2, c2) => a2 & b2 ^ ~a2 & c2;
const Maj = (a2, b2, c2) => a2 & b2 ^ a2 & c2 ^ b2 & c2;
class HashMD extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state2 = this.get();
    if (outLen > state2.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state2[i2], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
}
const SHA1_IV = /* @__PURE__ */ new Uint32Array([
  1732584193,
  4023233417,
  2562383102,
  271733878,
  3285377520
]);
const SHA1_W = /* @__PURE__ */ new Uint32Array(80);
let SHA1$1 = class SHA1 extends HashMD {
  constructor() {
    super(64, 20, 8, false);
    this.A = SHA1_IV[0] | 0;
    this.B = SHA1_IV[1] | 0;
    this.C = SHA1_IV[2] | 0;
    this.D = SHA1_IV[3] | 0;
    this.E = SHA1_IV[4] | 0;
  }
  get() {
    const { A: A2, B: B2, C: C2, D: D2, E: E2 } = this;
    return [A2, B2, C2, D2, E2];
  }
  set(A2, B2, C2, D2, E2) {
    this.A = A2 | 0;
    this.B = B2 | 0;
    this.C = C2 | 0;
    this.D = D2 | 0;
    this.E = E2 | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA1_W[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 80; i2++)
      SHA1_W[i2] = rotl(SHA1_W[i2 - 3] ^ SHA1_W[i2 - 8] ^ SHA1_W[i2 - 14] ^ SHA1_W[i2 - 16], 1);
    let { A: A2, B: B2, C: C2, D: D2, E: E2 } = this;
    for (let i2 = 0; i2 < 80; i2++) {
      let F2, K2;
      if (i2 < 20) {
        F2 = Chi(B2, C2, D2);
        K2 = 1518500249;
      } else if (i2 < 40) {
        F2 = B2 ^ C2 ^ D2;
        K2 = 1859775393;
      } else if (i2 < 60) {
        F2 = Maj(B2, C2, D2);
        K2 = 2400959708;
      } else {
        F2 = B2 ^ C2 ^ D2;
        K2 = 3395469782;
      }
      const T2 = rotl(A2, 5) + F2 + E2 + K2 + SHA1_W[i2] | 0;
      E2 = D2;
      D2 = C2;
      C2 = rotl(B2, 30);
      B2 = A2;
      A2 = T2;
    }
    A2 = A2 + this.A | 0;
    B2 = B2 + this.B | 0;
    C2 = C2 + this.C | 0;
    D2 = D2 + this.D | 0;
    E2 = E2 + this.E | 0;
    this.set(A2, B2, C2, D2, E2);
  }
  roundClean() {
    SHA1_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
const sha1 = /* @__PURE__ */ wrapConstructor(() => new SHA1$1());
const SHA256_K = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
const SHA256_IV = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
let SHA256$1 = class SHA256 extends HashMD {
  constructor() {
    super(64, 32, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A: A2, B: B2, C: C2, D: D2, E: E2, F: F2, G: G2, H: H2 } = this;
    return [A2, B2, C2, D2, E2, F2, G2, H2];
  }
  // prettier-ignore
  set(A2, B2, C2, D2, E2, F2, G2, H2) {
    this.A = A2 | 0;
    this.B = B2 | 0;
    this.C = C2 | 0;
    this.D = D2 | 0;
    this.E = E2 | 0;
    this.F = F2 | 0;
    this.G = G2 | 0;
    this.H = H2 | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W[i2 - 15];
      const W2 = SHA256_W[i2 - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i2] = s1 + SHA256_W[i2 - 7] + s0 + SHA256_W[i2 - 16] | 0;
    }
    let { A: A2, B: B2, C: C2, D: D2, E: E2, F: F2, G: G2, H: H2 } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr(E2, 6) ^ rotr(E2, 11) ^ rotr(E2, 25);
      const T1 = H2 + sigma1 + Chi(E2, F2, G2) + SHA256_K[i2] + SHA256_W[i2] | 0;
      const sigma0 = rotr(A2, 2) ^ rotr(A2, 13) ^ rotr(A2, 22);
      const T2 = sigma0 + Maj(A2, B2, C2) | 0;
      H2 = G2;
      G2 = F2;
      F2 = E2;
      E2 = D2 + T1 | 0;
      D2 = C2;
      C2 = B2;
      B2 = A2;
      A2 = T1 + T2 | 0;
    }
    A2 = A2 + this.A | 0;
    B2 = B2 + this.B | 0;
    C2 = C2 + this.C | 0;
    D2 = D2 + this.D | 0;
    E2 = E2 + this.E | 0;
    F2 = F2 + this.F | 0;
    G2 = G2 + this.G | 0;
    H2 = H2 + this.H | 0;
    this.set(A2, B2, C2, D2, E2, F2, G2, H2);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
const sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256$1());
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n2, le2 = false) {
  if (le2)
    return { h: Number(n2 & U32_MASK64), l: Number(n2 >> _32n & U32_MASK64) };
  return { h: Number(n2 >> _32n & U32_MASK64) | 0, l: Number(n2 & U32_MASK64) | 0 };
}
function split(lst, le2 = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i2 = 0; i2 < lst.length; i2++) {
    const { h: h2, l: l2 } = fromBig(lst[i2], le2);
    [Ah[i2], Al[i2]] = [h2, l2];
  }
  return [Ah, Al];
}
const toBig = (h2, l2) => BigInt(h2 >>> 0) << _32n | BigInt(l2 >>> 0);
const shrSH = (h2, _l2, s2) => h2 >>> s2;
const shrSL = (h2, l2, s2) => h2 << 32 - s2 | l2 >>> s2;
const rotrSH = (h2, l2, s2) => h2 >>> s2 | l2 << 32 - s2;
const rotrSL = (h2, l2, s2) => h2 << 32 - s2 | l2 >>> s2;
const rotrBH = (h2, l2, s2) => h2 << 64 - s2 | l2 >>> s2 - 32;
const rotrBL = (h2, l2, s2) => h2 >>> s2 - 32 | l2 << 64 - s2;
const rotr32H = (_h, l2) => l2;
const rotr32L = (h2, _l2) => h2;
const rotlSH = (h2, l2, s2) => h2 << s2 | l2 >>> 32 - s2;
const rotlSL = (h2, l2, s2) => l2 << s2 | h2 >>> 32 - s2;
const rotlBH = (h2, l2, s2) => l2 << s2 - 32 | h2 >>> 64 - s2;
const rotlBL = (h2, l2, s2) => h2 << s2 - 32 | l2 >>> 64 - s2;
function add(Ah, Al, Bh, Bl) {
  const l2 = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l2 / 2 ** 32 | 0) | 0, l: l2 | 0 };
}
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
const u64 = {
  fromBig,
  split,
  toBig,
  shrSH,
  shrSL,
  rotrSH,
  rotrSL,
  rotrBH,
  rotrBL,
  rotr32H,
  rotr32L,
  rotlSH,
  rotlSL,
  rotlBH,
  rotlBL,
  add,
  add3L,
  add3H,
  add4L,
  add4H,
  add5H,
  add5L
};
const [SHA512_Kh, SHA512_Kl] = /* @__PURE__ */ (() => u64.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n2) => BigInt(n2))))();
const SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
const SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
let SHA512$1 = class SHA512 extends HashMD {
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4) {
      SHA512_W_H[i2] = view.getUint32(offset);
      SHA512_W_L[i2] = view.getUint32(offset += 4);
    }
    for (let i2 = 16; i2 < 80; i2++) {
      const W15h = SHA512_W_H[i2 - 15] | 0;
      const W15l = SHA512_W_L[i2 - 15] | 0;
      const s0h = u64.rotrSH(W15h, W15l, 1) ^ u64.rotrSH(W15h, W15l, 8) ^ u64.shrSH(W15h, W15l, 7);
      const s0l = u64.rotrSL(W15h, W15l, 1) ^ u64.rotrSL(W15h, W15l, 8) ^ u64.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i2 - 2] | 0;
      const W2l = SHA512_W_L[i2 - 2] | 0;
      const s1h = u64.rotrSH(W2h, W2l, 19) ^ u64.rotrBH(W2h, W2l, 61) ^ u64.shrSH(W2h, W2l, 6);
      const s1l = u64.rotrSL(W2h, W2l, 19) ^ u64.rotrBL(W2h, W2l, 61) ^ u64.shrSL(W2h, W2l, 6);
      const SUMl = u64.add4L(s0l, s1l, SHA512_W_L[i2 - 7], SHA512_W_L[i2 - 16]);
      const SUMh = u64.add4H(SUMl, s0h, s1h, SHA512_W_H[i2 - 7], SHA512_W_H[i2 - 16]);
      SHA512_W_H[i2] = SUMh | 0;
      SHA512_W_L[i2] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i2 = 0; i2 < 80; i2++) {
      const sigma1h = u64.rotrSH(Eh, El, 14) ^ u64.rotrSH(Eh, El, 18) ^ u64.rotrBH(Eh, El, 41);
      const sigma1l = u64.rotrSL(Eh, El, 14) ^ u64.rotrSL(Eh, El, 18) ^ u64.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = u64.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i2], SHA512_W_L[i2]);
      const T1h = u64.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i2], SHA512_W_H[i2]);
      const T1l = T1ll | 0;
      const sigma0h = u64.rotrSH(Ah, Al, 28) ^ u64.rotrBH(Ah, Al, 34) ^ u64.rotrBH(Ah, Al, 39);
      const sigma0l = u64.rotrSL(Ah, Al, 28) ^ u64.rotrBL(Ah, Al, 34) ^ u64.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = u64.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = u64.add3L(T1l, sigma0l, MAJl);
      Ah = u64.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = u64.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = u64.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = u64.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = u64.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = u64.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = u64.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = u64.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = u64.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H.fill(0);
    SHA512_W_L.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
let SHA384$1 = class SHA384 extends SHA512$1 {
  constructor() {
    super();
    this.Ah = 3418070365 | 0;
    this.Al = 3238371032 | 0;
    this.Bh = 1654270250 | 0;
    this.Bl = 914150663 | 0;
    this.Ch = 2438529370 | 0;
    this.Cl = 812702999 | 0;
    this.Dh = 355462360 | 0;
    this.Dl = 4144912697 | 0;
    this.Eh = 1731405415 | 0;
    this.El = 4290775857 | 0;
    this.Fh = 2394180231 | 0;
    this.Fl = 1750603025 | 0;
    this.Gh = 3675008525 | 0;
    this.Gl = 1694076839 | 0;
    this.Hh = 1203062813 | 0;
    this.Hl = 3204075428 | 0;
    this.outputLen = 48;
  }
};
const sha512 = /* @__PURE__ */ wrapConstructor(() => new SHA512$1());
const sha384 = /* @__PURE__ */ wrapConstructor(() => new SHA384$1());
const EMPTY_BUFFER = new ArrayBuffer(0);
const EMPTY_STRING = "";
class ArgumentError extends TypeError {
  constructor() {
    super(...arguments);
    this.name = ArgumentError.NAME;
  }
  static isType(value, type) {
    if (typeof type === "string") {
      if (type === "Array" && Array.isArray(value)) {
        return true;
      } else if (type === "ArrayBuffer" && value instanceof ArrayBuffer) {
        return true;
      } else if (type === "ArrayBufferView" && ArrayBuffer.isView(value)) {
        return true;
      } else if (typeof value === type) {
        return true;
      }
    } else if (value instanceof type) {
      return true;
    }
    return false;
  }
  static assert(value, name, ...types) {
    for (const type of types) {
      if (this.isType(value, type)) {
        return;
      }
    }
    const typeNames = types.map((o2) => o2 instanceof Function && "name" in o2 ? o2.name : "".concat(o2));
    throw new ArgumentError("Parameter '".concat(name, "' is not of type ").concat(typeNames.length > 1 ? "(".concat(typeNames.join(" or "), ")") : typeNames[0]));
  }
}
ArgumentError.NAME = "ArgumentError";
class ParameterError extends TypeError {
  static assert(...args) {
    let target = null;
    let params;
    let fields;
    if (typeof args[0] === "string") {
      target = args[0];
      params = args[1];
      fields = args.slice(2);
    } else {
      params = args[0];
      fields = args.slice(1);
    }
    ArgumentError.assert(params, "parameters", "object");
    for (const field of fields) {
      const value = params[field];
      if (value === void 0 || value === null) {
        throw new ParameterError(field, target);
      }
    }
  }
  static assertEmpty(value, name, target) {
    if (value === void 0 || value === null) {
      throw new ParameterError(name, target);
    }
  }
  constructor(field, target = null, message) {
    super();
    this.name = ParameterError.NAME;
    this.field = field;
    if (target) {
      this.target = target;
    }
    if (message) {
      this.message = message;
    } else {
      this.message = "Absent mandatory parameter '".concat(field, "' ").concat(target ? " in '".concat(target, "'") : EMPTY_STRING);
    }
  }
}
ParameterError.NAME = "ParameterError";
class AsnError extends Error {
  static assertSchema(asn1, target) {
    if (!asn1.verified) {
      throw new Error("Object's schema was not verified against input data for ".concat(target));
    }
  }
  static assert(asn, target) {
    if (asn.offset === -1) {
      throw new AsnError("Error during parsing of ASN.1 data. Data is not correct for '".concat(target, "'."));
    }
  }
  constructor(message) {
    super(message);
    this.name = "AsnError";
  }
}
class PkiObject {
  static blockName() {
    return this.CLASS_NAME;
  }
  static fromBER(raw) {
    const asn1 = fromBER(raw);
    AsnError.assert(asn1, this.name);
    try {
      return new this({ schema: asn1.result });
    } catch (e2) {
      throw new AsnError("Cannot create '".concat(this.CLASS_NAME, "' from ASN.1 object"));
    }
  }
  static defaultValues(memberName) {
    throw new Error("Invalid member name for ".concat(this.CLASS_NAME, " class: ").concat(memberName));
  }
  static schema(parameters = {}) {
    throw new Error("Method '".concat(this.CLASS_NAME, ".schema' should be overridden"));
  }
  get className() {
    return this.constructor.CLASS_NAME;
  }
  toString(encoding = "hex") {
    let schema;
    try {
      schema = this.toSchema();
    } catch (e2) {
      schema = this.toSchema(true);
    }
    return Convert.ToString(schema.toBER(), encoding);
  }
}
PkiObject.CLASS_NAME = "PkiObject";
function stringPrep(inputString) {
  let isSpace = false;
  let cutResult = EMPTY_STRING;
  const result = inputString.trim();
  for (let i2 = 0; i2 < result.length; i2++) {
    if (result.charCodeAt(i2) === 32) {
      if (isSpace === false)
        isSpace = true;
    } else {
      if (isSpace) {
        cutResult += " ";
        isSpace = false;
      }
      cutResult += result[i2];
    }
  }
  return cutResult.toLowerCase();
}
const TYPE$5 = "type";
const VALUE$6 = "value";
class AttributeTypeAndValue extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.type = getParametersValue(parameters, TYPE$5, AttributeTypeAndValue.defaultValues(TYPE$5));
    this.value = getParametersValue(parameters, VALUE$6, AttributeTypeAndValue.defaultValues(VALUE$6));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TYPE$5:
        return EMPTY_STRING;
      case VALUE$6:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.type || EMPTY_STRING }),
        new Any({ name: names.value || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      TYPE$5,
      "typeValue"
    ]);
    const asn1 = compareSchema(schema, schema, AttributeTypeAndValue.schema({
      names: {
        type: TYPE$5,
        value: "typeValue"
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.type = asn1.result.type.valueBlock.toString();
    this.value = asn1.result.typeValue;
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.type }),
        this.value
      ]
    });
  }
  toJSON() {
    const _object = {
      type: this.type
    };
    if (Object.keys(this.value).length !== 0) {
      _object.value = this.value.toJSON();
    } else {
      _object.value = this.value;
    }
    return _object;
  }
  isEqual(compareTo) {
    const stringBlockNames = [
      Utf8String.blockName(),
      BmpString.blockName(),
      UniversalString.blockName(),
      NumericString.blockName(),
      PrintableString.blockName(),
      TeletexString.blockName(),
      VideotexString.blockName(),
      IA5String.blockName(),
      GraphicString.blockName(),
      VisibleString.blockName(),
      GeneralString.blockName(),
      CharacterString.blockName()
    ];
    if (compareTo instanceof ArrayBuffer) {
      return BufferSourceConverter.isEqual(this.value.valueBeforeDecodeView, compareTo);
    }
    if (compareTo.constructor.blockName() === AttributeTypeAndValue.blockName()) {
      if (this.type !== compareTo.type)
        return false;
      const isStringPair = [false, false];
      const thisName = this.value.constructor.blockName();
      for (const name of stringBlockNames) {
        if (thisName === name) {
          isStringPair[0] = true;
        }
        if (compareTo.value.constructor.blockName() === name) {
          isStringPair[1] = true;
        }
      }
      if (isStringPair[0] !== isStringPair[1]) {
        return false;
      }
      const isString = isStringPair[0] && isStringPair[1];
      if (isString) {
        const value1 = stringPrep(this.value.valueBlock.value);
        const value2 = stringPrep(compareTo.value.valueBlock.value);
        if (value1.localeCompare(value2) !== 0)
          return false;
      } else {
        if (!BufferSourceConverter.isEqual(this.value.valueBeforeDecodeView, compareTo.value.valueBeforeDecodeView))
          return false;
      }
      return true;
    }
    return false;
  }
}
AttributeTypeAndValue.CLASS_NAME = "AttributeTypeAndValue";
const TYPE_AND_VALUES = "typesAndValues";
const VALUE_BEFORE_DECODE = "valueBeforeDecode";
const RDN = "RDN";
class RelativeDistinguishedNames extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.typesAndValues = getParametersValue(parameters, TYPE_AND_VALUES, RelativeDistinguishedNames.defaultValues(TYPE_AND_VALUES));
    this.valueBeforeDecode = getParametersValue(parameters, VALUE_BEFORE_DECODE, RelativeDistinguishedNames.defaultValues(VALUE_BEFORE_DECODE));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TYPE_AND_VALUES:
        return [];
      case VALUE_BEFORE_DECODE:
        return EMPTY_BUFFER;
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case TYPE_AND_VALUES:
        return memberValue.length === 0;
      case VALUE_BEFORE_DECODE:
        return memberValue.byteLength === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.repeatedSequence || EMPTY_STRING,
          value: new Set$1({
            value: [
              new Repeated({
                name: names.repeatedSet || EMPTY_STRING,
                value: AttributeTypeAndValue.schema(names.typeAndValue || {})
              })
            ]
          })
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      RDN,
      TYPE_AND_VALUES
    ]);
    const asn1 = compareSchema(schema, schema, RelativeDistinguishedNames.schema({
      names: {
        blockName: RDN,
        repeatedSet: TYPE_AND_VALUES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (TYPE_AND_VALUES in asn1.result) {
      this.typesAndValues = Array.from(asn1.result.typesAndValues, (element) => new AttributeTypeAndValue({ schema: element }));
    }
    this.valueBeforeDecode = asn1.result.RDN.valueBeforeDecodeView.slice().buffer;
  }
  toSchema() {
    if (this.valueBeforeDecode.byteLength === 0) {
      return new Sequence({
        value: [new Set$1({
          value: Array.from(this.typesAndValues, (o2) => o2.toSchema())
        })]
      });
    }
    const asn1 = fromBER(this.valueBeforeDecode);
    AsnError.assert(asn1, "RelativeDistinguishedNames");
    if (!(asn1.result instanceof Sequence)) {
      throw new Error("ASN.1 result should be SEQUENCE");
    }
    return asn1.result;
  }
  toJSON() {
    return {
      typesAndValues: Array.from(this.typesAndValues, (o2) => o2.toJSON())
    };
  }
  isEqual(compareTo) {
    if (compareTo instanceof RelativeDistinguishedNames) {
      if (this.typesAndValues.length !== compareTo.typesAndValues.length)
        return false;
      for (const [index, typeAndValue] of this.typesAndValues.entries()) {
        if (typeAndValue.isEqual(compareTo.typesAndValues[index]) === false)
          return false;
      }
      return true;
    }
    if (compareTo instanceof ArrayBuffer) {
      return isEqualBuffer(this.valueBeforeDecode, compareTo);
    }
    return false;
  }
}
RelativeDistinguishedNames.CLASS_NAME = "RelativeDistinguishedNames";
const TYPE$4 = "type";
const VALUE$5 = "value";
function builtInStandardAttributes(parameters = {}, optional = false) {
  const names = getParametersValue(parameters, "names", {});
  return new Sequence({
    optional,
    value: [
      new Constructed({
        optional: true,
        idBlock: {
          tagClass: 2,
          tagNumber: 1
        },
        name: names.country_name || EMPTY_STRING,
        value: [
          new Choice({
            value: [
              new NumericString(),
              new PrintableString()
            ]
          })
        ]
      }),
      new Constructed({
        optional: true,
        idBlock: {
          tagClass: 2,
          tagNumber: 2
        },
        name: names.administration_domain_name || EMPTY_STRING,
        value: [
          new Choice({
            value: [
              new NumericString(),
              new PrintableString()
            ]
          })
        ]
      }),
      new Primitive({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        name: names.network_address || EMPTY_STRING,
        isHexOnly: true
      }),
      new Primitive({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        name: names.terminal_identifier || EMPTY_STRING,
        isHexOnly: true
      }),
      new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 2
        },
        name: names.private_domain_name || EMPTY_STRING,
        value: [
          new Choice({
            value: [
              new NumericString(),
              new PrintableString()
            ]
          })
        ]
      }),
      new Primitive({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 3
        },
        name: names.organization_name || EMPTY_STRING,
        isHexOnly: true
      }),
      new Primitive({
        optional: true,
        name: names.numeric_user_identifier || EMPTY_STRING,
        idBlock: {
          tagClass: 3,
          tagNumber: 4
        },
        isHexOnly: true
      }),
      new Constructed({
        optional: true,
        name: names.personal_name || EMPTY_STRING,
        idBlock: {
          tagClass: 3,
          tagNumber: 5
        },
        value: [
          new Primitive({
            idBlock: {
              tagClass: 3,
              tagNumber: 0
            },
            isHexOnly: true
          }),
          new Primitive({
            optional: true,
            idBlock: {
              tagClass: 3,
              tagNumber: 1
            },
            isHexOnly: true
          }),
          new Primitive({
            optional: true,
            idBlock: {
              tagClass: 3,
              tagNumber: 2
            },
            isHexOnly: true
          }),
          new Primitive({
            optional: true,
            idBlock: {
              tagClass: 3,
              tagNumber: 3
            },
            isHexOnly: true
          })
        ]
      }),
      new Constructed({
        optional: true,
        name: names.organizational_unit_names || EMPTY_STRING,
        idBlock: {
          tagClass: 3,
          tagNumber: 6
        },
        value: [
          new Repeated({
            value: new PrintableString()
          })
        ]
      })
    ]
  });
}
function builtInDomainDefinedAttributes(optional = false) {
  return new Sequence({
    optional,
    value: [
      new PrintableString(),
      new PrintableString()
    ]
  });
}
function extensionAttributes(optional = false) {
  return new Set$1({
    optional,
    value: [
      new Primitive({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        isHexOnly: true
      }),
      new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: [new Any()]
      })
    ]
  });
}
class GeneralName extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.type = getParametersValue(parameters, TYPE$4, GeneralName.defaultValues(TYPE$4));
    this.value = getParametersValue(parameters, VALUE$5, GeneralName.defaultValues(VALUE$5));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TYPE$4:
        return 9;
      case VALUE$5:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case TYPE$4:
        return memberValue === GeneralName.defaultValues(memberName);
      case VALUE$5:
        return Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Choice({
      value: [
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          name: names.blockName || EMPTY_STRING,
          value: [
            new ObjectIdentifier(),
            new Constructed({
              idBlock: {
                tagClass: 3,
                tagNumber: 0
              },
              value: [new Any()]
            })
          ]
        }),
        new Primitive({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          }
        }),
        new Primitive({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          }
        }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 3
          },
          name: names.blockName || EMPTY_STRING,
          value: [
            builtInStandardAttributes(names.builtInStandardAttributes || {}, false),
            builtInDomainDefinedAttributes(true),
            extensionAttributes(true)
          ]
        }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 4
          },
          name: names.blockName || EMPTY_STRING,
          value: [RelativeDistinguishedNames.schema(names.directoryName || {})]
        }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 5
          },
          name: names.blockName || EMPTY_STRING,
          value: [
            new Constructed({
              optional: true,
              idBlock: {
                tagClass: 3,
                tagNumber: 0
              },
              value: [
                new Choice({
                  value: [
                    new TeletexString(),
                    new PrintableString(),
                    new UniversalString(),
                    new Utf8String(),
                    new BmpString()
                  ]
                })
              ]
            }),
            new Constructed({
              idBlock: {
                tagClass: 3,
                tagNumber: 1
              },
              value: [
                new Choice({
                  value: [
                    new TeletexString(),
                    new PrintableString(),
                    new UniversalString(),
                    new Utf8String(),
                    new BmpString()
                  ]
                })
              ]
            })
          ]
        }),
        new Primitive({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 6
          }
        }),
        new Primitive({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 7
          }
        }),
        new Primitive({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 8
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      "blockName",
      "otherName",
      "rfc822Name",
      "dNSName",
      "x400Address",
      "directoryName",
      "ediPartyName",
      "uniformResourceIdentifier",
      "iPAddress",
      "registeredID"
    ]);
    const asn1 = compareSchema(schema, schema, GeneralName.schema({
      names: {
        blockName: "blockName",
        otherName: "otherName",
        rfc822Name: "rfc822Name",
        dNSName: "dNSName",
        x400Address: "x400Address",
        directoryName: {
          names: {
            blockName: "directoryName"
          }
        },
        ediPartyName: "ediPartyName",
        uniformResourceIdentifier: "uniformResourceIdentifier",
        iPAddress: "iPAddress",
        registeredID: "registeredID"
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.type = asn1.result.blockName.idBlock.tagNumber;
    switch (this.type) {
      case 0:
        this.value = asn1.result.blockName;
        break;
      case 1:
      case 2:
      case 6:
        {
          const value = asn1.result.blockName;
          value.idBlock.tagClass = 1;
          value.idBlock.tagNumber = 22;
          const valueBER = value.toBER(false);
          const asnValue = fromBER(valueBER);
          AsnError.assert(asnValue, "GeneralName value");
          this.value = asnValue.result.valueBlock.value;
        }
        break;
      case 3:
        this.value = asn1.result.blockName;
        break;
      case 4:
        this.value = new RelativeDistinguishedNames({ schema: asn1.result.directoryName });
        break;
      case 5:
        this.value = asn1.result.ediPartyName;
        break;
      case 7:
        this.value = new OctetString$1({ valueHex: asn1.result.blockName.valueBlock.valueHex });
        break;
      case 8:
        {
          const value = asn1.result.blockName;
          value.idBlock.tagClass = 1;
          value.idBlock.tagNumber = 6;
          const valueBER = value.toBER(false);
          const asnValue = fromBER(valueBER);
          AsnError.assert(asnValue, "GeneralName registeredID");
          this.value = asnValue.result.valueBlock.toString();
        }
        break;
    }
  }
  toSchema() {
    switch (this.type) {
      case 0:
      case 3:
      case 5:
        return new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: this.type
          },
          value: [
            this.value
          ]
        });
      case 1:
      case 2:
      case 6: {
        const value = new IA5String({ value: this.value });
        value.idBlock.tagClass = 3;
        value.idBlock.tagNumber = this.type;
        return value;
      }
      case 4:
        return new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 4
          },
          value: [this.value.toSchema()]
        });
      case 7: {
        const value = this.value;
        value.idBlock.tagClass = 3;
        value.idBlock.tagNumber = this.type;
        return value;
      }
      case 8: {
        const value = new ObjectIdentifier({ value: this.value });
        value.idBlock.tagClass = 3;
        value.idBlock.tagNumber = this.type;
        return value;
      }
      default:
        return GeneralName.schema();
    }
  }
  toJSON() {
    const _object = {
      type: this.type,
      value: EMPTY_STRING
    };
    if (typeof this.value === "string")
      _object.value = this.value;
    else {
      try {
        _object.value = this.value.toJSON();
      } catch (ex) {
      }
    }
    return _object;
  }
}
GeneralName.CLASS_NAME = "GeneralName";
const ACCESS_METHOD = "accessMethod";
const ACCESS_LOCATION = "accessLocation";
const CLEAR_PROPS$1v = [
  ACCESS_METHOD,
  ACCESS_LOCATION
];
class AccessDescription extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.accessMethod = getParametersValue(parameters, ACCESS_METHOD, AccessDescription.defaultValues(ACCESS_METHOD));
    this.accessLocation = getParametersValue(parameters, ACCESS_LOCATION, AccessDescription.defaultValues(ACCESS_LOCATION));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ACCESS_METHOD:
        return EMPTY_STRING;
      case ACCESS_LOCATION:
        return new GeneralName();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.accessMethod || EMPTY_STRING }),
        GeneralName.schema(names.accessLocation || {})
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1v);
    const asn1 = compareSchema(schema, schema, AccessDescription.schema({
      names: {
        accessMethod: ACCESS_METHOD,
        accessLocation: {
          names: {
            blockName: ACCESS_LOCATION
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.accessMethod = asn1.result.accessMethod.valueBlock.toString();
    this.accessLocation = new GeneralName({ schema: asn1.result.accessLocation });
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.accessMethod }),
        this.accessLocation.toSchema()
      ]
    });
  }
  toJSON() {
    return {
      accessMethod: this.accessMethod,
      accessLocation: this.accessLocation.toJSON()
    };
  }
}
AccessDescription.CLASS_NAME = "AccessDescription";
const SECONDS = "seconds";
const MILLIS = "millis";
const MICROS = "micros";
class Accuracy extends PkiObject {
  constructor(parameters = {}) {
    super();
    if (SECONDS in parameters) {
      this.seconds = getParametersValue(parameters, SECONDS, Accuracy.defaultValues(SECONDS));
    }
    if (MILLIS in parameters) {
      this.millis = getParametersValue(parameters, MILLIS, Accuracy.defaultValues(MILLIS));
    }
    if (MICROS in parameters) {
      this.micros = getParametersValue(parameters, MICROS, Accuracy.defaultValues(MICROS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case SECONDS:
      case MILLIS:
      case MICROS:
        return 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case SECONDS:
      case MILLIS:
      case MICROS:
        return memberValue === Accuracy.defaultValues(memberName);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      optional: true,
      value: [
        new Integer({
          optional: true,
          name: names.seconds || EMPTY_STRING
        }),
        new Primitive({
          name: names.millis || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          }
        }),
        new Primitive({
          name: names.micros || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      SECONDS,
      MILLIS,
      MICROS
    ]);
    const asn1 = compareSchema(schema, schema, Accuracy.schema({
      names: {
        seconds: SECONDS,
        millis: MILLIS,
        micros: MICROS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if ("seconds" in asn1.result) {
      this.seconds = asn1.result.seconds.valueBlock.valueDec;
    }
    if ("millis" in asn1.result) {
      const intMillis = new Integer({ valueHex: asn1.result.millis.valueBlock.valueHex });
      this.millis = intMillis.valueBlock.valueDec;
    }
    if ("micros" in asn1.result) {
      const intMicros = new Integer({ valueHex: asn1.result.micros.valueBlock.valueHex });
      this.micros = intMicros.valueBlock.valueDec;
    }
  }
  toSchema() {
    const outputArray = [];
    if (this.seconds !== void 0)
      outputArray.push(new Integer({ value: this.seconds }));
    if (this.millis !== void 0) {
      const intMillis = new Integer({ value: this.millis });
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        valueHex: intMillis.valueBlock.valueHexView
      }));
    }
    if (this.micros !== void 0) {
      const intMicros = new Integer({ value: this.micros });
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        valueHex: intMicros.valueBlock.valueHexView
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const _object = {};
    if (this.seconds !== void 0)
      _object.seconds = this.seconds;
    if (this.millis !== void 0)
      _object.millis = this.millis;
    if (this.micros !== void 0)
      _object.micros = this.micros;
    return _object;
  }
}
Accuracy.CLASS_NAME = "Accuracy";
const ALGORITHM_ID = "algorithmId";
const ALGORITHM_PARAMS = "algorithmParams";
const ALGORITHM$2 = "algorithm";
const PARAMS = "params";
const CLEAR_PROPS$1u = [
  ALGORITHM$2,
  PARAMS
];
class AlgorithmIdentifier extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.algorithmId = getParametersValue(parameters, ALGORITHM_ID, AlgorithmIdentifier.defaultValues(ALGORITHM_ID));
    if (ALGORITHM_PARAMS in parameters) {
      this.algorithmParams = getParametersValue(parameters, ALGORITHM_PARAMS, AlgorithmIdentifier.defaultValues(ALGORITHM_PARAMS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ALGORITHM_ID:
        return EMPTY_STRING;
      case ALGORITHM_PARAMS:
        return new Any();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case ALGORITHM_ID:
        return memberValue === EMPTY_STRING;
      case ALGORITHM_PARAMS:
        return memberValue instanceof Any;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      optional: names.optional || false,
      value: [
        new ObjectIdentifier({ name: names.algorithmIdentifier || EMPTY_STRING }),
        new Any({ name: names.algorithmParams || EMPTY_STRING, optional: true })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1u);
    const asn1 = compareSchema(schema, schema, AlgorithmIdentifier.schema({
      names: {
        algorithmIdentifier: ALGORITHM$2,
        algorithmParams: PARAMS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.algorithmId = asn1.result.algorithm.valueBlock.toString();
    if (PARAMS in asn1.result) {
      this.algorithmParams = asn1.result.params;
    }
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new ObjectIdentifier({ value: this.algorithmId }));
    if (this.algorithmParams && !(this.algorithmParams instanceof Any)) {
      outputArray.push(this.algorithmParams);
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const object = {
      algorithmId: this.algorithmId
    };
    if (this.algorithmParams && !(this.algorithmParams instanceof Any)) {
      object.algorithmParams = this.algorithmParams.toJSON();
    }
    return object;
  }
  isEqual(algorithmIdentifier) {
    if (!(algorithmIdentifier instanceof AlgorithmIdentifier)) {
      return false;
    }
    if (this.algorithmId !== algorithmIdentifier.algorithmId) {
      return false;
    }
    if (this.algorithmParams) {
      if (algorithmIdentifier.algorithmParams) {
        return JSON.stringify(this.algorithmParams) === JSON.stringify(algorithmIdentifier.algorithmParams);
      }
      return false;
    }
    if (algorithmIdentifier.algorithmParams) {
      return false;
    }
    return true;
  }
}
AlgorithmIdentifier.CLASS_NAME = "AlgorithmIdentifier";
const ALT_NAMES = "altNames";
const CLEAR_PROPS$1t = [
  ALT_NAMES
];
class AltName extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.altNames = getParametersValue(parameters, ALT_NAMES, AltName.defaultValues(ALT_NAMES));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ALT_NAMES:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.altNames || EMPTY_STRING,
          value: GeneralName.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1t);
    const asn1 = compareSchema(schema, schema, AltName.schema({
      names: {
        altNames: ALT_NAMES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (ALT_NAMES in asn1.result) {
      this.altNames = Array.from(asn1.result.altNames, (element) => new GeneralName({ schema: element }));
    }
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.altNames, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      altNames: Array.from(this.altNames, (o2) => o2.toJSON())
    };
  }
}
AltName.CLASS_NAME = "AltName";
const TYPE$3 = "type";
const VALUES$1 = "values";
const CLEAR_PROPS$1s = [
  TYPE$3,
  VALUES$1
];
class Attribute extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.type = getParametersValue(parameters, TYPE$3, Attribute.defaultValues(TYPE$3));
    this.values = getParametersValue(parameters, VALUES$1, Attribute.defaultValues(VALUES$1));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TYPE$3:
        return EMPTY_STRING;
      case VALUES$1:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case TYPE$3:
        return memberValue === EMPTY_STRING;
      case VALUES$1:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.type || EMPTY_STRING }),
        new Set$1({
          name: names.setName || EMPTY_STRING,
          value: [
            new Repeated({
              name: names.values || EMPTY_STRING,
              value: new Any()
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1s);
    const asn1 = compareSchema(schema, schema, Attribute.schema({
      names: {
        type: TYPE$3,
        values: VALUES$1
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.type = asn1.result.type.valueBlock.toString();
    this.values = asn1.result.values;
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.type }),
        new Set$1({
          value: this.values
        })
      ]
    });
  }
  toJSON() {
    return {
      type: this.type,
      values: Array.from(this.values, (o2) => o2.toJSON())
    };
  }
}
Attribute.CLASS_NAME = "Attribute";
const NOT_BEFORE_TIME = "notBeforeTime";
const NOT_AFTER_TIME = "notAfterTime";
const CLEAR_PROPS$1r = [
  NOT_BEFORE_TIME,
  NOT_AFTER_TIME
];
class AttCertValidityPeriod extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.notBeforeTime = getParametersValue(parameters, NOT_BEFORE_TIME, AttCertValidityPeriod.defaultValues(NOT_BEFORE_TIME));
    this.notAfterTime = getParametersValue(parameters, NOT_AFTER_TIME, AttCertValidityPeriod.defaultValues(NOT_AFTER_TIME));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case NOT_BEFORE_TIME:
      case NOT_AFTER_TIME:
        return new Date(0, 0, 0);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new GeneralizedTime({ name: names.notBeforeTime || EMPTY_STRING }),
        new GeneralizedTime({ name: names.notAfterTime || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1r);
    const asn1 = compareSchema(schema, schema, AttCertValidityPeriod.schema({
      names: {
        notBeforeTime: NOT_BEFORE_TIME,
        notAfterTime: NOT_AFTER_TIME
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.notBeforeTime = asn1.result.notBeforeTime.toDate();
    this.notAfterTime = asn1.result.notAfterTime.toDate();
  }
  toSchema() {
    return new Sequence({
      value: [
        new GeneralizedTime({ valueDate: this.notBeforeTime }),
        new GeneralizedTime({ valueDate: this.notAfterTime })
      ]
    });
  }
  toJSON() {
    return {
      notBeforeTime: this.notBeforeTime,
      notAfterTime: this.notAfterTime
    };
  }
}
AttCertValidityPeriod.CLASS_NAME = "AttCertValidityPeriod";
const NAMES = "names";
const GENERAL_NAMES = "generalNames";
class GeneralNames extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.names = getParametersValue(parameters, NAMES, GeneralNames.defaultValues(NAMES));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case "names":
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}, optional = false) {
    const names = getParametersValue(parameters, NAMES, {});
    return new Sequence({
      optional,
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.generalNames || EMPTY_STRING,
          value: GeneralName.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      NAMES,
      GENERAL_NAMES
    ]);
    const asn1 = compareSchema(schema, schema, GeneralNames.schema({
      names: {
        blockName: NAMES,
        generalNames: GENERAL_NAMES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.names = Array.from(asn1.result.generalNames, (element) => new GeneralName({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.names, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      names: Array.from(this.names, (o2) => o2.toJSON())
    };
  }
}
GeneralNames.CLASS_NAME = "GeneralNames";
const id_SubjectDirectoryAttributes = "2.5.29.9";
const id_SubjectKeyIdentifier = "2.5.29.14";
const id_KeyUsage = "2.5.29.15";
const id_PrivateKeyUsagePeriod = "2.5.29.16";
const id_SubjectAltName = "2.5.29.17";
const id_IssuerAltName = "2.5.29.18";
const id_BasicConstraints = "2.5.29.19";
const id_CRLNumber = "2.5.29.20";
const id_BaseCRLNumber = "2.5.29.27";
const id_CRLReason = "2.5.29.21";
const id_InvalidityDate = "2.5.29.24";
const id_IssuingDistributionPoint = "2.5.29.28";
const id_CertificateIssuer = "2.5.29.29";
const id_NameConstraints = "2.5.29.30";
const id_CRLDistributionPoints = "2.5.29.31";
const id_FreshestCRL = "2.5.29.46";
const id_CertificatePolicies = "2.5.29.32";
const id_AnyPolicy = "2.5.29.32.0";
const id_MicrosoftAppPolicies = "1.3.6.1.4.1.311.21.10";
const id_PolicyMappings = "2.5.29.33";
const id_AuthorityKeyIdentifier = "2.5.29.35";
const id_PolicyConstraints = "2.5.29.36";
const id_ExtKeyUsage = "2.5.29.37";
const id_InhibitAnyPolicy = "2.5.29.54";
const id_AuthorityInfoAccess = "1.3.6.1.5.5.7.1.1";
const id_SubjectInfoAccess = "1.3.6.1.5.5.7.1.11";
const id_SignedCertificateTimestampList = "1.3.6.1.4.1.11129.2.4.2";
const id_MicrosoftCertTemplateV2 = "1.3.6.1.4.1.311.21.7";
const id_MicrosoftCaVersion = "1.3.6.1.4.1.311.21.1";
const id_QCStatements = "1.3.6.1.5.5.7.1.3";
const id_ContentType_Data = "1.2.840.113549.1.7.1";
const id_ContentType_SignedData = "1.2.840.113549.1.7.2";
const id_ContentType_EnvelopedData = "1.2.840.113549.1.7.3";
const id_ContentType_EncryptedData = "1.2.840.113549.1.7.6";
const id_eContentType_TSTInfo = "1.2.840.113549.1.9.16.1.4";
const id_CertBag_X509Certificate = "1.2.840.113549.1.9.22.1";
const id_CertBag_SDSICertificate = "1.2.840.113549.1.9.22.2";
const id_CertBag_AttributeCertificate = "1.2.840.113549.1.9.22.3";
const id_CRLBag_X509CRL = "1.2.840.113549.1.9.23.1";
const id_pkix = "1.3.6.1.5.5.7";
const id_ad = "".concat(id_pkix, ".48");
const id_PKIX_OCSP_Basic = "".concat(id_ad, ".1.1");
const KEY_IDENTIFIER$1 = "keyIdentifier";
const AUTHORITY_CERT_ISSUER = "authorityCertIssuer";
const AUTHORITY_CERT_SERIAL_NUMBER = "authorityCertSerialNumber";
const CLEAR_PROPS$1q = [
  KEY_IDENTIFIER$1,
  AUTHORITY_CERT_ISSUER,
  AUTHORITY_CERT_SERIAL_NUMBER
];
class AuthorityKeyIdentifier extends PkiObject {
  constructor(parameters = {}) {
    super();
    if (KEY_IDENTIFIER$1 in parameters) {
      this.keyIdentifier = getParametersValue(parameters, KEY_IDENTIFIER$1, AuthorityKeyIdentifier.defaultValues(KEY_IDENTIFIER$1));
    }
    if (AUTHORITY_CERT_ISSUER in parameters) {
      this.authorityCertIssuer = getParametersValue(parameters, AUTHORITY_CERT_ISSUER, AuthorityKeyIdentifier.defaultValues(AUTHORITY_CERT_ISSUER));
    }
    if (AUTHORITY_CERT_SERIAL_NUMBER in parameters) {
      this.authorityCertSerialNumber = getParametersValue(parameters, AUTHORITY_CERT_SERIAL_NUMBER, AuthorityKeyIdentifier.defaultValues(AUTHORITY_CERT_SERIAL_NUMBER));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case KEY_IDENTIFIER$1:
        return new OctetString$1();
      case AUTHORITY_CERT_ISSUER:
        return [];
      case AUTHORITY_CERT_SERIAL_NUMBER:
        return new Integer();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Primitive({
          name: names.keyIdentifier || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          }
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [
            new Repeated({
              name: names.authorityCertIssuer || EMPTY_STRING,
              value: GeneralName.schema()
            })
          ]
        }),
        new Primitive({
          name: names.authorityCertSerialNumber || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1q);
    const asn1 = compareSchema(schema, schema, AuthorityKeyIdentifier.schema({
      names: {
        keyIdentifier: KEY_IDENTIFIER$1,
        authorityCertIssuer: AUTHORITY_CERT_ISSUER,
        authorityCertSerialNumber: AUTHORITY_CERT_SERIAL_NUMBER
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (KEY_IDENTIFIER$1 in asn1.result)
      this.keyIdentifier = new OctetString$1({ valueHex: asn1.result.keyIdentifier.valueBlock.valueHex });
    if (AUTHORITY_CERT_ISSUER in asn1.result)
      this.authorityCertIssuer = Array.from(asn1.result.authorityCertIssuer, (o2) => new GeneralName({ schema: o2 }));
    if (AUTHORITY_CERT_SERIAL_NUMBER in asn1.result)
      this.authorityCertSerialNumber = new Integer({ valueHex: asn1.result.authorityCertSerialNumber.valueBlock.valueHex });
  }
  toSchema() {
    const outputArray = [];
    if (this.keyIdentifier) {
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        valueHex: this.keyIdentifier.valueBlock.valueHexView
      }));
    }
    if (this.authorityCertIssuer) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: Array.from(this.authorityCertIssuer, (o2) => o2.toSchema())
      }));
    }
    if (this.authorityCertSerialNumber) {
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 2
        },
        valueHex: this.authorityCertSerialNumber.valueBlock.valueHexView
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const object = {};
    if (this.keyIdentifier) {
      object.keyIdentifier = this.keyIdentifier.toJSON();
    }
    if (this.authorityCertIssuer) {
      object.authorityCertIssuer = Array.from(this.authorityCertIssuer, (o2) => o2.toJSON());
    }
    if (this.authorityCertSerialNumber) {
      object.authorityCertSerialNumber = this.authorityCertSerialNumber.toJSON();
    }
    return object;
  }
}
AuthorityKeyIdentifier.CLASS_NAME = "AuthorityKeyIdentifier";
const PATH_LENGTH_CONSTRAINT = "pathLenConstraint";
const CA = "cA";
class BasicConstraints extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.cA = getParametersValue(parameters, CA, false);
    if (PATH_LENGTH_CONSTRAINT in parameters) {
      this.pathLenConstraint = getParametersValue(parameters, PATH_LENGTH_CONSTRAINT, 0);
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CA:
        return false;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Boolean$1({
          optional: true,
          name: names.cA || EMPTY_STRING
        }),
        new Integer({
          optional: true,
          name: names.pathLenConstraint || EMPTY_STRING
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      CA,
      PATH_LENGTH_CONSTRAINT
    ]);
    const asn1 = compareSchema(schema, schema, BasicConstraints.schema({
      names: {
        cA: CA,
        pathLenConstraint: PATH_LENGTH_CONSTRAINT
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (CA in asn1.result) {
      this.cA = asn1.result.cA.valueBlock.value;
    }
    if (PATH_LENGTH_CONSTRAINT in asn1.result) {
      if (asn1.result.pathLenConstraint.valueBlock.isHexOnly) {
        this.pathLenConstraint = asn1.result.pathLenConstraint;
      } else {
        this.pathLenConstraint = asn1.result.pathLenConstraint.valueBlock.valueDec;
      }
    }
  }
  toSchema() {
    const outputArray = [];
    if (this.cA !== BasicConstraints.defaultValues(CA))
      outputArray.push(new Boolean$1({ value: this.cA }));
    if (PATH_LENGTH_CONSTRAINT in this) {
      if (this.pathLenConstraint instanceof Integer) {
        outputArray.push(this.pathLenConstraint);
      } else {
        outputArray.push(new Integer({ value: this.pathLenConstraint }));
      }
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const object = {};
    if (this.cA !== BasicConstraints.defaultValues(CA)) {
      object.cA = this.cA;
    }
    if (PATH_LENGTH_CONSTRAINT in this) {
      if (this.pathLenConstraint instanceof Integer) {
        object.pathLenConstraint = this.pathLenConstraint.toJSON();
      } else {
        object.pathLenConstraint = this.pathLenConstraint;
      }
    }
    return object;
  }
}
BasicConstraints.CLASS_NAME = "BasicConstraints";
const CERTIFICATE_INDEX = "certificateIndex";
const KEY_INDEX = "keyIndex";
class CAVersion extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.certificateIndex = getParametersValue(parameters, CERTIFICATE_INDEX, CAVersion.defaultValues(CERTIFICATE_INDEX));
    this.keyIndex = getParametersValue(parameters, KEY_INDEX, CAVersion.defaultValues(KEY_INDEX));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CERTIFICATE_INDEX:
      case KEY_INDEX:
        return 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema() {
    return new Integer();
  }
  fromSchema(schema) {
    if (schema.constructor.blockName() !== Integer.blockName()) {
      throw new Error("Object's schema was not verified against input data for CAVersion");
    }
    let value = schema.valueBlock.valueHex.slice(0);
    const valueView = new Uint8Array(value);
    switch (true) {
      case value.byteLength < 4:
        {
          const tempValue = new ArrayBuffer(4);
          const tempValueView = new Uint8Array(tempValue);
          tempValueView.set(valueView, 4 - value.byteLength);
          value = tempValue.slice(0);
        }
        break;
      case value.byteLength > 4:
        {
          const tempValue = new ArrayBuffer(4);
          const tempValueView = new Uint8Array(tempValue);
          tempValueView.set(valueView.slice(0, 4));
          value = tempValue.slice(0);
        }
        break;
    }
    const keyIndexBuffer = value.slice(0, 2);
    const keyIndexView8 = new Uint8Array(keyIndexBuffer);
    let temp = keyIndexView8[0];
    keyIndexView8[0] = keyIndexView8[1];
    keyIndexView8[1] = temp;
    const keyIndexView16 = new Uint16Array(keyIndexBuffer);
    this.keyIndex = keyIndexView16[0];
    const certificateIndexBuffer = value.slice(2);
    const certificateIndexView8 = new Uint8Array(certificateIndexBuffer);
    temp = certificateIndexView8[0];
    certificateIndexView8[0] = certificateIndexView8[1];
    certificateIndexView8[1] = temp;
    const certificateIndexView16 = new Uint16Array(certificateIndexBuffer);
    this.certificateIndex = certificateIndexView16[0];
  }
  toSchema() {
    const certificateIndexBuffer = new ArrayBuffer(2);
    const certificateIndexView = new Uint16Array(certificateIndexBuffer);
    certificateIndexView[0] = this.certificateIndex;
    const certificateIndexView8 = new Uint8Array(certificateIndexBuffer);
    let temp = certificateIndexView8[0];
    certificateIndexView8[0] = certificateIndexView8[1];
    certificateIndexView8[1] = temp;
    const keyIndexBuffer = new ArrayBuffer(2);
    const keyIndexView = new Uint16Array(keyIndexBuffer);
    keyIndexView[0] = this.keyIndex;
    const keyIndexView8 = new Uint8Array(keyIndexBuffer);
    temp = keyIndexView8[0];
    keyIndexView8[0] = keyIndexView8[1];
    keyIndexView8[1] = temp;
    return new Integer({
      valueHex: utilConcatBuf(keyIndexBuffer, certificateIndexBuffer)
    });
  }
  toJSON() {
    return {
      certificateIndex: this.certificateIndex,
      keyIndex: this.keyIndex
    };
  }
}
CAVersion.CLASS_NAME = "CAVersion";
const POLICY_QUALIFIER_ID = "policyQualifierId";
const QUALIFIER = "qualifier";
const CLEAR_PROPS$1p = [
  POLICY_QUALIFIER_ID,
  QUALIFIER
];
class PolicyQualifierInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.policyQualifierId = getParametersValue(parameters, POLICY_QUALIFIER_ID, PolicyQualifierInfo.defaultValues(POLICY_QUALIFIER_ID));
    this.qualifier = getParametersValue(parameters, QUALIFIER, PolicyQualifierInfo.defaultValues(QUALIFIER));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case POLICY_QUALIFIER_ID:
        return EMPTY_STRING;
      case QUALIFIER:
        return new Any();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.policyQualifierId || EMPTY_STRING }),
        new Any({ name: names.qualifier || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1p);
    const asn1 = compareSchema(schema, schema, PolicyQualifierInfo.schema({
      names: {
        policyQualifierId: POLICY_QUALIFIER_ID,
        qualifier: QUALIFIER
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.policyQualifierId = asn1.result.policyQualifierId.valueBlock.toString();
    this.qualifier = asn1.result.qualifier;
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.policyQualifierId }),
        this.qualifier
      ]
    });
  }
  toJSON() {
    return {
      policyQualifierId: this.policyQualifierId,
      qualifier: this.qualifier.toJSON()
    };
  }
}
PolicyQualifierInfo.CLASS_NAME = "PolicyQualifierInfo";
const POLICY_IDENTIFIER = "policyIdentifier";
const POLICY_QUALIFIERS = "policyQualifiers";
const CLEAR_PROPS$1o = [
  POLICY_IDENTIFIER,
  POLICY_QUALIFIERS
];
class PolicyInformation extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.policyIdentifier = getParametersValue(parameters, POLICY_IDENTIFIER, PolicyInformation.defaultValues(POLICY_IDENTIFIER));
    if (POLICY_QUALIFIERS in parameters) {
      this.policyQualifiers = getParametersValue(parameters, POLICY_QUALIFIERS, PolicyInformation.defaultValues(POLICY_QUALIFIERS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case POLICY_IDENTIFIER:
        return EMPTY_STRING;
      case POLICY_QUALIFIERS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.policyIdentifier || EMPTY_STRING }),
        new Sequence({
          optional: true,
          value: [
            new Repeated({
              name: names.policyQualifiers || EMPTY_STRING,
              value: PolicyQualifierInfo.schema()
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1o);
    const asn1 = compareSchema(schema, schema, PolicyInformation.schema({
      names: {
        policyIdentifier: POLICY_IDENTIFIER,
        policyQualifiers: POLICY_QUALIFIERS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.policyIdentifier = asn1.result.policyIdentifier.valueBlock.toString();
    if (POLICY_QUALIFIERS in asn1.result) {
      this.policyQualifiers = Array.from(asn1.result.policyQualifiers, (element) => new PolicyQualifierInfo({ schema: element }));
    }
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new ObjectIdentifier({ value: this.policyIdentifier }));
    if (this.policyQualifiers) {
      outputArray.push(new Sequence({
        value: Array.from(this.policyQualifiers, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      policyIdentifier: this.policyIdentifier
    };
    if (this.policyQualifiers)
      res.policyQualifiers = Array.from(this.policyQualifiers, (o2) => o2.toJSON());
    return res;
  }
}
PolicyInformation.CLASS_NAME = "PolicyInformation";
const CERTIFICATE_POLICIES = "certificatePolicies";
const CLEAR_PROPS$1n = [
  CERTIFICATE_POLICIES
];
class CertificatePolicies extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.certificatePolicies = getParametersValue(parameters, CERTIFICATE_POLICIES, CertificatePolicies.defaultValues(CERTIFICATE_POLICIES));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CERTIFICATE_POLICIES:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.certificatePolicies || EMPTY_STRING,
          value: PolicyInformation.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1n);
    const asn1 = compareSchema(schema, schema, CertificatePolicies.schema({
      names: {
        certificatePolicies: CERTIFICATE_POLICIES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.certificatePolicies = Array.from(asn1.result.certificatePolicies, (element) => new PolicyInformation({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.certificatePolicies, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      certificatePolicies: Array.from(this.certificatePolicies, (o2) => o2.toJSON())
    };
  }
}
CertificatePolicies.CLASS_NAME = "CertificatePolicies";
const TEMPLATE_ID = "templateID";
const TEMPLATE_MAJOR_VERSION = "templateMajorVersion";
const TEMPLATE_MINOR_VERSION = "templateMinorVersion";
const CLEAR_PROPS$1m = [
  TEMPLATE_ID,
  TEMPLATE_MAJOR_VERSION,
  TEMPLATE_MINOR_VERSION
];
class CertificateTemplate extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.templateID = getParametersValue(parameters, TEMPLATE_ID, CertificateTemplate.defaultValues(TEMPLATE_ID));
    if (TEMPLATE_MAJOR_VERSION in parameters) {
      this.templateMajorVersion = getParametersValue(parameters, TEMPLATE_MAJOR_VERSION, CertificateTemplate.defaultValues(TEMPLATE_MAJOR_VERSION));
    }
    if (TEMPLATE_MINOR_VERSION in parameters) {
      this.templateMinorVersion = getParametersValue(parameters, TEMPLATE_MINOR_VERSION, CertificateTemplate.defaultValues(TEMPLATE_MINOR_VERSION));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TEMPLATE_ID:
        return EMPTY_STRING;
      case TEMPLATE_MAJOR_VERSION:
      case TEMPLATE_MINOR_VERSION:
        return 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.templateID || EMPTY_STRING }),
        new Integer({
          name: names.templateMajorVersion || EMPTY_STRING,
          optional: true
        }),
        new Integer({
          name: names.templateMinorVersion || EMPTY_STRING,
          optional: true
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1m);
    const asn1 = compareSchema(schema, schema, CertificateTemplate.schema({
      names: {
        templateID: TEMPLATE_ID,
        templateMajorVersion: TEMPLATE_MAJOR_VERSION,
        templateMinorVersion: TEMPLATE_MINOR_VERSION
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.templateID = asn1.result.templateID.valueBlock.toString();
    if (TEMPLATE_MAJOR_VERSION in asn1.result) {
      this.templateMajorVersion = asn1.result.templateMajorVersion.valueBlock.valueDec;
    }
    if (TEMPLATE_MINOR_VERSION in asn1.result) {
      this.templateMinorVersion = asn1.result.templateMinorVersion.valueBlock.valueDec;
    }
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new ObjectIdentifier({ value: this.templateID }));
    if (TEMPLATE_MAJOR_VERSION in this) {
      outputArray.push(new Integer({ value: this.templateMajorVersion }));
    }
    if (TEMPLATE_MINOR_VERSION in this) {
      outputArray.push(new Integer({ value: this.templateMinorVersion }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      templateID: this.templateID
    };
    if (TEMPLATE_MAJOR_VERSION in this)
      res.templateMajorVersion = this.templateMajorVersion;
    if (TEMPLATE_MINOR_VERSION in this)
      res.templateMinorVersion = this.templateMinorVersion;
    return res;
  }
}
const DISTRIBUTION_POINT$1 = "distributionPoint";
const DISTRIBUTION_POINT_NAMES$1 = "distributionPointNames";
const REASONS = "reasons";
const CRL_ISSUER = "cRLIssuer";
const CRL_ISSUER_NAMES = "cRLIssuerNames";
const CLEAR_PROPS$1l = [
  DISTRIBUTION_POINT$1,
  DISTRIBUTION_POINT_NAMES$1,
  REASONS,
  CRL_ISSUER,
  CRL_ISSUER_NAMES
];
class DistributionPoint extends PkiObject {
  constructor(parameters = {}) {
    super();
    if (DISTRIBUTION_POINT$1 in parameters) {
      this.distributionPoint = getParametersValue(parameters, DISTRIBUTION_POINT$1, DistributionPoint.defaultValues(DISTRIBUTION_POINT$1));
    }
    if (REASONS in parameters) {
      this.reasons = getParametersValue(parameters, REASONS, DistributionPoint.defaultValues(REASONS));
    }
    if (CRL_ISSUER in parameters) {
      this.cRLIssuer = getParametersValue(parameters, CRL_ISSUER, DistributionPoint.defaultValues(CRL_ISSUER));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case DISTRIBUTION_POINT$1:
        return [];
      case REASONS:
        return new BitString$1();
      case CRL_ISSUER:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            new Choice({
              value: [
                new Constructed({
                  name: names.distributionPoint || EMPTY_STRING,
                  optional: true,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: 0
                  },
                  value: [
                    new Repeated({
                      name: names.distributionPointNames || EMPTY_STRING,
                      value: GeneralName.schema()
                    })
                  ]
                }),
                new Constructed({
                  name: names.distributionPoint || EMPTY_STRING,
                  optional: true,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: 1
                  },
                  value: RelativeDistinguishedNames.schema().valueBlock.value
                })
              ]
            })
          ]
        }),
        new Primitive({
          name: names.reasons || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          }
        }),
        new Constructed({
          name: names.cRLIssuer || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          },
          value: [
            new Repeated({
              name: names.cRLIssuerNames || EMPTY_STRING,
              value: GeneralName.schema()
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1l);
    const asn1 = compareSchema(schema, schema, DistributionPoint.schema({
      names: {
        distributionPoint: DISTRIBUTION_POINT$1,
        distributionPointNames: DISTRIBUTION_POINT_NAMES$1,
        reasons: REASONS,
        cRLIssuer: CRL_ISSUER,
        cRLIssuerNames: CRL_ISSUER_NAMES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (DISTRIBUTION_POINT$1 in asn1.result) {
      if (asn1.result.distributionPoint.idBlock.tagNumber === 0) {
        this.distributionPoint = Array.from(asn1.result.distributionPointNames, (element) => new GeneralName({ schema: element }));
      }
      if (asn1.result.distributionPoint.idBlock.tagNumber === 1) {
        this.distributionPoint = new RelativeDistinguishedNames({
          schema: new Sequence({
            value: asn1.result.distributionPoint.valueBlock.value
          })
        });
      }
    }
    if (REASONS in asn1.result) {
      this.reasons = new BitString$1({ valueHex: asn1.result.reasons.valueBlock.valueHex });
    }
    if (CRL_ISSUER in asn1.result) {
      this.cRLIssuer = Array.from(asn1.result.cRLIssuerNames, (element) => new GeneralName({ schema: element }));
    }
  }
  toSchema() {
    const outputArray = [];
    if (this.distributionPoint) {
      let internalValue;
      if (this.distributionPoint instanceof Array) {
        internalValue = new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: Array.from(this.distributionPoint, (o2) => o2.toSchema())
        });
      } else {
        internalValue = new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [this.distributionPoint.toSchema()]
        });
      }
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [internalValue]
      }));
    }
    if (this.reasons) {
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        valueHex: this.reasons.valueBlock.valueHexView
      }));
    }
    if (this.cRLIssuer) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 2
        },
        value: Array.from(this.cRLIssuer, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const object = {};
    if (this.distributionPoint) {
      if (this.distributionPoint instanceof Array) {
        object.distributionPoint = Array.from(this.distributionPoint, (o2) => o2.toJSON());
      } else {
        object.distributionPoint = this.distributionPoint.toJSON();
      }
    }
    if (this.reasons) {
      object.reasons = this.reasons.toJSON();
    }
    if (this.cRLIssuer) {
      object.cRLIssuer = Array.from(this.cRLIssuer, (o2) => o2.toJSON());
    }
    return object;
  }
}
DistributionPoint.CLASS_NAME = "DistributionPoint";
const DISTRIBUTION_POINTS = "distributionPoints";
const CLEAR_PROPS$1k = [
  DISTRIBUTION_POINTS
];
class CRLDistributionPoints extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.distributionPoints = getParametersValue(parameters, DISTRIBUTION_POINTS, CRLDistributionPoints.defaultValues(DISTRIBUTION_POINTS));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case DISTRIBUTION_POINTS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.distributionPoints || EMPTY_STRING,
          value: DistributionPoint.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1k);
    const asn1 = compareSchema(schema, schema, CRLDistributionPoints.schema({
      names: {
        distributionPoints: DISTRIBUTION_POINTS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.distributionPoints = Array.from(asn1.result.distributionPoints, (element) => new DistributionPoint({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.distributionPoints, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      distributionPoints: Array.from(this.distributionPoints, (o2) => o2.toJSON())
    };
  }
}
CRLDistributionPoints.CLASS_NAME = "CRLDistributionPoints";
const KEY_PURPOSES = "keyPurposes";
const CLEAR_PROPS$1j = [
  KEY_PURPOSES
];
class ExtKeyUsage extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.keyPurposes = getParametersValue(parameters, KEY_PURPOSES, ExtKeyUsage.defaultValues(KEY_PURPOSES));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case KEY_PURPOSES:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.keyPurposes || EMPTY_STRING,
          value: new ObjectIdentifier()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1j);
    const asn1 = compareSchema(schema, schema, ExtKeyUsage.schema({
      names: {
        keyPurposes: KEY_PURPOSES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.keyPurposes = Array.from(asn1.result.keyPurposes, (element) => element.valueBlock.toString());
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.keyPurposes, (element) => new ObjectIdentifier({ value: element }))
    });
  }
  toJSON() {
    return {
      keyPurposes: Array.from(this.keyPurposes)
    };
  }
}
ExtKeyUsage.CLASS_NAME = "ExtKeyUsage";
const ACCESS_DESCRIPTIONS = "accessDescriptions";
class InfoAccess extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.accessDescriptions = getParametersValue(parameters, ACCESS_DESCRIPTIONS, InfoAccess.defaultValues(ACCESS_DESCRIPTIONS));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ACCESS_DESCRIPTIONS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.accessDescriptions || EMPTY_STRING,
          value: AccessDescription.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      ACCESS_DESCRIPTIONS
    ]);
    const asn1 = compareSchema(schema, schema, InfoAccess.schema({
      names: {
        accessDescriptions: ACCESS_DESCRIPTIONS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.accessDescriptions = Array.from(asn1.result.accessDescriptions, (element) => new AccessDescription({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.accessDescriptions, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      accessDescriptions: Array.from(this.accessDescriptions, (o2) => o2.toJSON())
    };
  }
}
InfoAccess.CLASS_NAME = "InfoAccess";
const DISTRIBUTION_POINT = "distributionPoint";
const DISTRIBUTION_POINT_NAMES = "distributionPointNames";
const ONLY_CONTAINS_USER_CERTS = "onlyContainsUserCerts";
const ONLY_CONTAINS_CA_CERTS = "onlyContainsCACerts";
const ONLY_SOME_REASON = "onlySomeReasons";
const INDIRECT_CRL = "indirectCRL";
const ONLY_CONTAINS_ATTRIBUTE_CERTS = "onlyContainsAttributeCerts";
const CLEAR_PROPS$1i = [
  DISTRIBUTION_POINT,
  DISTRIBUTION_POINT_NAMES,
  ONLY_CONTAINS_USER_CERTS,
  ONLY_CONTAINS_CA_CERTS,
  ONLY_SOME_REASON,
  INDIRECT_CRL,
  ONLY_CONTAINS_ATTRIBUTE_CERTS
];
class IssuingDistributionPoint extends PkiObject {
  constructor(parameters = {}) {
    super();
    if (DISTRIBUTION_POINT in parameters) {
      this.distributionPoint = getParametersValue(parameters, DISTRIBUTION_POINT, IssuingDistributionPoint.defaultValues(DISTRIBUTION_POINT));
    }
    this.onlyContainsUserCerts = getParametersValue(parameters, ONLY_CONTAINS_USER_CERTS, IssuingDistributionPoint.defaultValues(ONLY_CONTAINS_USER_CERTS));
    this.onlyContainsCACerts = getParametersValue(parameters, ONLY_CONTAINS_CA_CERTS, IssuingDistributionPoint.defaultValues(ONLY_CONTAINS_CA_CERTS));
    if (ONLY_SOME_REASON in parameters) {
      this.onlySomeReasons = getParametersValue(parameters, ONLY_SOME_REASON, IssuingDistributionPoint.defaultValues(ONLY_SOME_REASON));
    }
    this.indirectCRL = getParametersValue(parameters, INDIRECT_CRL, IssuingDistributionPoint.defaultValues(INDIRECT_CRL));
    this.onlyContainsAttributeCerts = getParametersValue(parameters, ONLY_CONTAINS_ATTRIBUTE_CERTS, IssuingDistributionPoint.defaultValues(ONLY_CONTAINS_ATTRIBUTE_CERTS));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case DISTRIBUTION_POINT:
        return [];
      case ONLY_CONTAINS_USER_CERTS:
        return false;
      case ONLY_CONTAINS_CA_CERTS:
        return false;
      case ONLY_SOME_REASON:
        return 0;
      case INDIRECT_CRL:
        return false;
      case ONLY_CONTAINS_ATTRIBUTE_CERTS:
        return false;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            new Choice({
              value: [
                new Constructed({
                  name: names.distributionPoint || EMPTY_STRING,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: 0
                  },
                  value: [
                    new Repeated({
                      name: names.distributionPointNames || EMPTY_STRING,
                      value: GeneralName.schema()
                    })
                  ]
                }),
                new Constructed({
                  name: names.distributionPoint || EMPTY_STRING,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: 1
                  },
                  value: RelativeDistinguishedNames.schema().valueBlock.value
                })
              ]
            })
          ]
        }),
        new Primitive({
          name: names.onlyContainsUserCerts || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          }
        }),
        new Primitive({
          name: names.onlyContainsCACerts || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          }
        }),
        new Primitive({
          name: names.onlySomeReasons || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 3
          }
        }),
        new Primitive({
          name: names.indirectCRL || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 4
          }
        }),
        new Primitive({
          name: names.onlyContainsAttributeCerts || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 5
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1i);
    const asn1 = compareSchema(schema, schema, IssuingDistributionPoint.schema({
      names: {
        distributionPoint: DISTRIBUTION_POINT,
        distributionPointNames: DISTRIBUTION_POINT_NAMES,
        onlyContainsUserCerts: ONLY_CONTAINS_USER_CERTS,
        onlyContainsCACerts: ONLY_CONTAINS_CA_CERTS,
        onlySomeReasons: ONLY_SOME_REASON,
        indirectCRL: INDIRECT_CRL,
        onlyContainsAttributeCerts: ONLY_CONTAINS_ATTRIBUTE_CERTS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (DISTRIBUTION_POINT in asn1.result) {
      switch (true) {
        case asn1.result.distributionPoint.idBlock.tagNumber === 0:
          this.distributionPoint = Array.from(asn1.result.distributionPointNames, (element) => new GeneralName({ schema: element }));
          break;
        case asn1.result.distributionPoint.idBlock.tagNumber === 1:
          {
            this.distributionPoint = new RelativeDistinguishedNames({
              schema: new Sequence({
                value: asn1.result.distributionPoint.valueBlock.value
              })
            });
          }
          break;
        default:
          throw new Error("Unknown tagNumber for distributionPoint: {$asn1.result.distributionPoint.idBlock.tagNumber}");
      }
    }
    if (ONLY_CONTAINS_USER_CERTS in asn1.result) {
      const view = new Uint8Array(asn1.result.onlyContainsUserCerts.valueBlock.valueHex);
      this.onlyContainsUserCerts = view[0] !== 0;
    }
    if (ONLY_CONTAINS_CA_CERTS in asn1.result) {
      const view = new Uint8Array(asn1.result.onlyContainsCACerts.valueBlock.valueHex);
      this.onlyContainsCACerts = view[0] !== 0;
    }
    if (ONLY_SOME_REASON in asn1.result) {
      const view = new Uint8Array(asn1.result.onlySomeReasons.valueBlock.valueHex);
      this.onlySomeReasons = view[0];
    }
    if (INDIRECT_CRL in asn1.result) {
      const view = new Uint8Array(asn1.result.indirectCRL.valueBlock.valueHex);
      this.indirectCRL = view[0] !== 0;
    }
    if (ONLY_CONTAINS_ATTRIBUTE_CERTS in asn1.result) {
      const view = new Uint8Array(asn1.result.onlyContainsAttributeCerts.valueBlock.valueHex);
      this.onlyContainsAttributeCerts = view[0] !== 0;
    }
  }
  toSchema() {
    const outputArray = [];
    if (this.distributionPoint) {
      let value;
      if (this.distributionPoint instanceof Array) {
        value = new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: Array.from(this.distributionPoint, (o2) => o2.toSchema())
        });
      } else {
        value = this.distributionPoint.toSchema();
        value.idBlock.tagClass = 3;
        value.idBlock.tagNumber = 1;
      }
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [value]
      }));
    }
    if (this.onlyContainsUserCerts !== IssuingDistributionPoint.defaultValues(ONLY_CONTAINS_USER_CERTS)) {
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        valueHex: new Uint8Array([255]).buffer
      }));
    }
    if (this.onlyContainsCACerts !== IssuingDistributionPoint.defaultValues(ONLY_CONTAINS_CA_CERTS)) {
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 2
        },
        valueHex: new Uint8Array([255]).buffer
      }));
    }
    if (this.onlySomeReasons !== void 0) {
      const buffer = new ArrayBuffer(1);
      const view = new Uint8Array(buffer);
      view[0] = this.onlySomeReasons;
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 3
        },
        valueHex: buffer
      }));
    }
    if (this.indirectCRL !== IssuingDistributionPoint.defaultValues(INDIRECT_CRL)) {
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 4
        },
        valueHex: new Uint8Array([255]).buffer
      }));
    }
    if (this.onlyContainsAttributeCerts !== IssuingDistributionPoint.defaultValues(ONLY_CONTAINS_ATTRIBUTE_CERTS)) {
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 5
        },
        valueHex: new Uint8Array([255]).buffer
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const obj = {};
    if (this.distributionPoint) {
      if (this.distributionPoint instanceof Array) {
        obj.distributionPoint = Array.from(this.distributionPoint, (o2) => o2.toJSON());
      } else {
        obj.distributionPoint = this.distributionPoint.toJSON();
      }
    }
    if (this.onlyContainsUserCerts !== IssuingDistributionPoint.defaultValues(ONLY_CONTAINS_USER_CERTS)) {
      obj.onlyContainsUserCerts = this.onlyContainsUserCerts;
    }
    if (this.onlyContainsCACerts !== IssuingDistributionPoint.defaultValues(ONLY_CONTAINS_CA_CERTS)) {
      obj.onlyContainsCACerts = this.onlyContainsCACerts;
    }
    if (ONLY_SOME_REASON in this) {
      obj.onlySomeReasons = this.onlySomeReasons;
    }
    if (this.indirectCRL !== IssuingDistributionPoint.defaultValues(INDIRECT_CRL)) {
      obj.indirectCRL = this.indirectCRL;
    }
    if (this.onlyContainsAttributeCerts !== IssuingDistributionPoint.defaultValues(ONLY_CONTAINS_ATTRIBUTE_CERTS)) {
      obj.onlyContainsAttributeCerts = this.onlyContainsAttributeCerts;
    }
    return obj;
  }
}
IssuingDistributionPoint.CLASS_NAME = "IssuingDistributionPoint";
const BASE = "base";
const MINIMUM = "minimum";
const MAXIMUM = "maximum";
const CLEAR_PROPS$1h = [
  BASE,
  MINIMUM,
  MAXIMUM
];
class GeneralSubtree extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.base = getParametersValue(parameters, BASE, GeneralSubtree.defaultValues(BASE));
    this.minimum = getParametersValue(parameters, MINIMUM, GeneralSubtree.defaultValues(MINIMUM));
    if (MAXIMUM in parameters) {
      this.maximum = getParametersValue(parameters, MAXIMUM, GeneralSubtree.defaultValues(MAXIMUM));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case BASE:
        return new GeneralName();
      case MINIMUM:
        return 0;
      case MAXIMUM:
        return 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        GeneralName.schema(names.base || {}),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Integer({ name: names.minimum || EMPTY_STRING })]
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [new Integer({ name: names.maximum || EMPTY_STRING })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1h);
    const asn1 = compareSchema(schema, schema, GeneralSubtree.schema({
      names: {
        base: {
          names: {
            blockName: BASE
          }
        },
        minimum: MINIMUM,
        maximum: MAXIMUM
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.base = new GeneralName({ schema: asn1.result.base });
    if (MINIMUM in asn1.result) {
      if (asn1.result.minimum.valueBlock.isHexOnly)
        this.minimum = asn1.result.minimum;
      else
        this.minimum = asn1.result.minimum.valueBlock.valueDec;
    }
    if (MAXIMUM in asn1.result) {
      if (asn1.result.maximum.valueBlock.isHexOnly)
        this.maximum = asn1.result.maximum;
      else
        this.maximum = asn1.result.maximum.valueBlock.valueDec;
    }
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.base.toSchema());
    if (this.minimum !== 0) {
      let valueMinimum = 0;
      if (this.minimum instanceof Integer) {
        valueMinimum = this.minimum;
      } else {
        valueMinimum = new Integer({ value: this.minimum });
      }
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [valueMinimum]
      }));
    }
    if (MAXIMUM in this) {
      let valueMaximum = 0;
      if (this.maximum instanceof Integer) {
        valueMaximum = this.maximum;
      } else {
        valueMaximum = new Integer({ value: this.maximum });
      }
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: [valueMaximum]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      base: this.base.toJSON()
    };
    if (this.minimum !== 0) {
      if (typeof this.minimum === "number") {
        res.minimum = this.minimum;
      } else {
        res.minimum = this.minimum.toJSON();
      }
    }
    if (this.maximum !== void 0) {
      if (typeof this.maximum === "number") {
        res.maximum = this.maximum;
      } else {
        res.maximum = this.maximum.toJSON();
      }
    }
    return res;
  }
}
GeneralSubtree.CLASS_NAME = "GeneralSubtree";
const PERMITTED_SUBTREES = "permittedSubtrees";
const EXCLUDED_SUBTREES = "excludedSubtrees";
const CLEAR_PROPS$1g = [
  PERMITTED_SUBTREES,
  EXCLUDED_SUBTREES
];
class NameConstraints extends PkiObject {
  constructor(parameters = {}) {
    super();
    if (PERMITTED_SUBTREES in parameters) {
      this.permittedSubtrees = getParametersValue(parameters, PERMITTED_SUBTREES, NameConstraints.defaultValues(PERMITTED_SUBTREES));
    }
    if (EXCLUDED_SUBTREES in parameters) {
      this.excludedSubtrees = getParametersValue(parameters, EXCLUDED_SUBTREES, NameConstraints.defaultValues(EXCLUDED_SUBTREES));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case PERMITTED_SUBTREES:
      case EXCLUDED_SUBTREES:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            new Repeated({
              name: names.permittedSubtrees || EMPTY_STRING,
              value: GeneralSubtree.schema()
            })
          ]
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [
            new Repeated({
              name: names.excludedSubtrees || EMPTY_STRING,
              value: GeneralSubtree.schema()
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1g);
    const asn1 = compareSchema(schema, schema, NameConstraints.schema({
      names: {
        permittedSubtrees: PERMITTED_SUBTREES,
        excludedSubtrees: EXCLUDED_SUBTREES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (PERMITTED_SUBTREES in asn1.result)
      this.permittedSubtrees = Array.from(asn1.result.permittedSubtrees, (element) => new GeneralSubtree({ schema: element }));
    if (EXCLUDED_SUBTREES in asn1.result)
      this.excludedSubtrees = Array.from(asn1.result.excludedSubtrees, (element) => new GeneralSubtree({ schema: element }));
  }
  toSchema() {
    const outputArray = [];
    if (this.permittedSubtrees) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: Array.from(this.permittedSubtrees, (o2) => o2.toSchema())
      }));
    }
    if (this.excludedSubtrees) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: Array.from(this.excludedSubtrees, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const object = {};
    if (this.permittedSubtrees) {
      object.permittedSubtrees = Array.from(this.permittedSubtrees, (o2) => o2.toJSON());
    }
    if (this.excludedSubtrees) {
      object.excludedSubtrees = Array.from(this.excludedSubtrees, (o2) => o2.toJSON());
    }
    return object;
  }
}
NameConstraints.CLASS_NAME = "NameConstraints";
const REQUIRE_EXPLICIT_POLICY = "requireExplicitPolicy";
const INHIBIT_POLICY_MAPPING = "inhibitPolicyMapping";
const CLEAR_PROPS$1f = [
  REQUIRE_EXPLICIT_POLICY,
  INHIBIT_POLICY_MAPPING
];
class PolicyConstraints extends PkiObject {
  constructor(parameters = {}) {
    super();
    if (REQUIRE_EXPLICIT_POLICY in parameters) {
      this.requireExplicitPolicy = getParametersValue(parameters, REQUIRE_EXPLICIT_POLICY, PolicyConstraints.defaultValues(REQUIRE_EXPLICIT_POLICY));
    }
    if (INHIBIT_POLICY_MAPPING in parameters) {
      this.inhibitPolicyMapping = getParametersValue(parameters, INHIBIT_POLICY_MAPPING, PolicyConstraints.defaultValues(INHIBIT_POLICY_MAPPING));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case REQUIRE_EXPLICIT_POLICY:
        return 0;
      case INHIBIT_POLICY_MAPPING:
        return 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Primitive({
          name: names.requireExplicitPolicy || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          }
        }),
        new Primitive({
          name: names.inhibitPolicyMapping || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1f);
    const asn1 = compareSchema(schema, schema, PolicyConstraints.schema({
      names: {
        requireExplicitPolicy: REQUIRE_EXPLICIT_POLICY,
        inhibitPolicyMapping: INHIBIT_POLICY_MAPPING
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (REQUIRE_EXPLICIT_POLICY in asn1.result) {
      const field1 = asn1.result.requireExplicitPolicy;
      field1.idBlock.tagClass = 1;
      field1.idBlock.tagNumber = 2;
      const ber1 = field1.toBER(false);
      const int1 = fromBER(ber1);
      AsnError.assert(int1, "Integer");
      this.requireExplicitPolicy = int1.result.valueBlock.valueDec;
    }
    if (INHIBIT_POLICY_MAPPING in asn1.result) {
      const field2 = asn1.result.inhibitPolicyMapping;
      field2.idBlock.tagClass = 1;
      field2.idBlock.tagNumber = 2;
      const ber2 = field2.toBER(false);
      const int2 = fromBER(ber2);
      AsnError.assert(int2, "Integer");
      this.inhibitPolicyMapping = int2.result.valueBlock.valueDec;
    }
  }
  toSchema() {
    const outputArray = [];
    if (REQUIRE_EXPLICIT_POLICY in this) {
      const int1 = new Integer({ value: this.requireExplicitPolicy });
      int1.idBlock.tagClass = 3;
      int1.idBlock.tagNumber = 0;
      outputArray.push(int1);
    }
    if (INHIBIT_POLICY_MAPPING in this) {
      const int2 = new Integer({ value: this.inhibitPolicyMapping });
      int2.idBlock.tagClass = 3;
      int2.idBlock.tagNumber = 1;
      outputArray.push(int2);
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {};
    if (REQUIRE_EXPLICIT_POLICY in this) {
      res.requireExplicitPolicy = this.requireExplicitPolicy;
    }
    if (INHIBIT_POLICY_MAPPING in this) {
      res.inhibitPolicyMapping = this.inhibitPolicyMapping;
    }
    return res;
  }
}
PolicyConstraints.CLASS_NAME = "PolicyConstraints";
const ISSUER_DOMAIN_POLICY = "issuerDomainPolicy";
const SUBJECT_DOMAIN_POLICY = "subjectDomainPolicy";
const CLEAR_PROPS$1e = [
  ISSUER_DOMAIN_POLICY,
  SUBJECT_DOMAIN_POLICY
];
class PolicyMapping extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.issuerDomainPolicy = getParametersValue(parameters, ISSUER_DOMAIN_POLICY, PolicyMapping.defaultValues(ISSUER_DOMAIN_POLICY));
    this.subjectDomainPolicy = getParametersValue(parameters, SUBJECT_DOMAIN_POLICY, PolicyMapping.defaultValues(SUBJECT_DOMAIN_POLICY));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ISSUER_DOMAIN_POLICY:
        return EMPTY_STRING;
      case SUBJECT_DOMAIN_POLICY:
        return EMPTY_STRING;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.issuerDomainPolicy || EMPTY_STRING }),
        new ObjectIdentifier({ name: names.subjectDomainPolicy || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1e);
    const asn1 = compareSchema(schema, schema, PolicyMapping.schema({
      names: {
        issuerDomainPolicy: ISSUER_DOMAIN_POLICY,
        subjectDomainPolicy: SUBJECT_DOMAIN_POLICY
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.issuerDomainPolicy = asn1.result.issuerDomainPolicy.valueBlock.toString();
    this.subjectDomainPolicy = asn1.result.subjectDomainPolicy.valueBlock.toString();
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.issuerDomainPolicy }),
        new ObjectIdentifier({ value: this.subjectDomainPolicy })
      ]
    });
  }
  toJSON() {
    return {
      issuerDomainPolicy: this.issuerDomainPolicy,
      subjectDomainPolicy: this.subjectDomainPolicy
    };
  }
}
PolicyMapping.CLASS_NAME = "PolicyMapping";
const MAPPINGS = "mappings";
const CLEAR_PROPS$1d = [
  MAPPINGS
];
class PolicyMappings extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.mappings = getParametersValue(parameters, MAPPINGS, PolicyMappings.defaultValues(MAPPINGS));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case MAPPINGS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.mappings || EMPTY_STRING,
          value: PolicyMapping.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1d);
    const asn1 = compareSchema(schema, schema, PolicyMappings.schema({
      names: {
        mappings: MAPPINGS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.mappings = Array.from(asn1.result.mappings, (element) => new PolicyMapping({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.mappings, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      mappings: Array.from(this.mappings, (o2) => o2.toJSON())
    };
  }
}
PolicyMappings.CLASS_NAME = "PolicyMappings";
const NOT_BEFORE$1 = "notBefore";
const NOT_AFTER$1 = "notAfter";
const CLEAR_PROPS$1c = [
  NOT_BEFORE$1,
  NOT_AFTER$1
];
class PrivateKeyUsagePeriod extends PkiObject {
  constructor(parameters = {}) {
    super();
    if (NOT_BEFORE$1 in parameters) {
      this.notBefore = getParametersValue(parameters, NOT_BEFORE$1, PrivateKeyUsagePeriod.defaultValues(NOT_BEFORE$1));
    }
    if (NOT_AFTER$1 in parameters) {
      this.notAfter = getParametersValue(parameters, NOT_AFTER$1, PrivateKeyUsagePeriod.defaultValues(NOT_AFTER$1));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case NOT_BEFORE$1:
        return /* @__PURE__ */ new Date();
      case NOT_AFTER$1:
        return /* @__PURE__ */ new Date();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Primitive({
          name: names.notBefore || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          }
        }),
        new Primitive({
          name: names.notAfter || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1c);
    const asn1 = compareSchema(schema, schema, PrivateKeyUsagePeriod.schema({
      names: {
        notBefore: NOT_BEFORE$1,
        notAfter: NOT_AFTER$1
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (NOT_BEFORE$1 in asn1.result) {
      const localNotBefore = new GeneralizedTime();
      localNotBefore.fromBuffer(asn1.result.notBefore.valueBlock.valueHex);
      this.notBefore = localNotBefore.toDate();
    }
    if (NOT_AFTER$1 in asn1.result) {
      const localNotAfter = new GeneralizedTime({ valueHex: asn1.result.notAfter.valueBlock.valueHex });
      localNotAfter.fromBuffer(asn1.result.notAfter.valueBlock.valueHex);
      this.notAfter = localNotAfter.toDate();
    }
  }
  toSchema() {
    const outputArray = [];
    if (NOT_BEFORE$1 in this) {
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        valueHex: new GeneralizedTime({ valueDate: this.notBefore }).valueBlock.valueHexView
      }));
    }
    if (NOT_AFTER$1 in this) {
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        valueHex: new GeneralizedTime({ valueDate: this.notAfter }).valueBlock.valueHexView
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {};
    if (this.notBefore) {
      res.notBefore = this.notBefore;
    }
    if (this.notAfter) {
      res.notAfter = this.notAfter;
    }
    return res;
  }
}
PrivateKeyUsagePeriod.CLASS_NAME = "PrivateKeyUsagePeriod";
const ID = "id";
const TYPE$2 = "type";
const VALUES = "values";
const QC_STATEMENT_CLEAR_PROPS = [
  ID,
  TYPE$2
];
const QC_STATEMENTS_CLEAR_PROPS = [
  VALUES
];
class QCStatement extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.id = getParametersValue(parameters, ID, QCStatement.defaultValues(ID));
    if (TYPE$2 in parameters) {
      this.type = getParametersValue(parameters, TYPE$2, QCStatement.defaultValues(TYPE$2));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ID:
        return EMPTY_STRING;
      case TYPE$2:
        return new Null();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case ID:
        return memberValue === EMPTY_STRING;
      case TYPE$2:
        return memberValue instanceof Null;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.id || EMPTY_STRING }),
        new Any({
          name: names.type || EMPTY_STRING,
          optional: true
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, QC_STATEMENT_CLEAR_PROPS);
    const asn1 = compareSchema(schema, schema, QCStatement.schema({
      names: {
        id: ID,
        type: TYPE$2
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.id = asn1.result.id.valueBlock.toString();
    if (TYPE$2 in asn1.result)
      this.type = asn1.result.type;
  }
  toSchema() {
    const value = [
      new ObjectIdentifier({ value: this.id })
    ];
    if (TYPE$2 in this)
      value.push(this.type);
    return new Sequence({
      value
    });
  }
  toJSON() {
    const object = {
      id: this.id
    };
    if (this.type) {
      object.type = this.type.toJSON();
    }
    return object;
  }
}
QCStatement.CLASS_NAME = "QCStatement";
class QCStatements extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.values = getParametersValue(parameters, VALUES, QCStatements.defaultValues(VALUES));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VALUES:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VALUES:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.values || EMPTY_STRING,
          value: QCStatement.schema(names.value || {})
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, QC_STATEMENTS_CLEAR_PROPS);
    const asn1 = compareSchema(schema, schema, QCStatements.schema({
      names: {
        values: VALUES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.values = Array.from(asn1.result.values, (element) => new QCStatement({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.values, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      values: Array.from(this.values, (o2) => o2.toJSON())
    };
  }
}
QCStatements.CLASS_NAME = "QCStatements";
var _a;
class ECNamedCurves {
  static register(name, id, size) {
    this.namedCurves[name.toLowerCase()] = this.namedCurves[id] = { name, id, size };
  }
  static find(nameOrId) {
    return this.namedCurves[nameOrId.toLowerCase()] || null;
  }
}
_a = ECNamedCurves;
ECNamedCurves.namedCurves = {};
(() => {
  _a.register("P-256", "1.2.840.10045.3.1.7", 32);
  _a.register("P-384", "1.3.132.0.34", 48);
  _a.register("P-521", "1.3.132.0.35", 66);
  _a.register("brainpoolP256r1", "1.3.36.3.3.2.8.1.1.7", 32);
  _a.register("brainpoolP384r1", "1.3.36.3.3.2.8.1.1.11", 48);
  _a.register("brainpoolP512r1", "1.3.36.3.3.2.8.1.1.13", 64);
})();
const X = "x";
const Y = "y";
const NAMED_CURVE$1 = "namedCurve";
class ECPublicKey extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.x = getParametersValue(parameters, X, ECPublicKey.defaultValues(X));
    this.y = getParametersValue(parameters, Y, ECPublicKey.defaultValues(Y));
    this.namedCurve = getParametersValue(parameters, NAMED_CURVE$1, ECPublicKey.defaultValues(NAMED_CURVE$1));
    if (parameters.json) {
      this.fromJSON(parameters.json);
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case X:
      case Y:
        return EMPTY_BUFFER;
      case NAMED_CURVE$1:
        return EMPTY_STRING;
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case X:
      case Y:
        return memberValue instanceof ArrayBuffer && isEqualBuffer(memberValue, ECPublicKey.defaultValues(memberName));
      case NAMED_CURVE$1:
        return typeof memberValue === "string" && memberValue === ECPublicKey.defaultValues(memberName);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema() {
    return new RawData();
  }
  fromSchema(schema1) {
    const view = BufferSourceConverter.toUint8Array(schema1);
    if (view[0] !== 4) {
      throw new Error("Object's schema was not verified against input data for ECPublicKey");
    }
    const namedCurve = ECNamedCurves.find(this.namedCurve);
    if (!namedCurve) {
      throw new Error("Incorrect curve OID: ".concat(this.namedCurve));
    }
    const coordinateLength = namedCurve.size;
    if (view.byteLength !== coordinateLength * 2 + 1) {
      throw new Error("Object's schema was not verified against input data for ECPublicKey");
    }
    this.namedCurve = namedCurve.name;
    this.x = view.slice(1, coordinateLength + 1).buffer;
    this.y = view.slice(1 + coordinateLength, coordinateLength * 2 + 1).buffer;
  }
  toSchema() {
    return new RawData({
      data: utilConcatBuf(new Uint8Array([4]).buffer, this.x, this.y)
    });
  }
  toJSON() {
    const namedCurve = ECNamedCurves.find(this.namedCurve);
    return {
      crv: namedCurve ? namedCurve.name : this.namedCurve,
      x: toBase64(arrayBufferToString(this.x), true, true, false),
      y: toBase64(arrayBufferToString(this.y), true, true, false)
    };
  }
  fromJSON(json) {
    ParameterError.assert("json", json, "crv", "x", "y");
    let coordinateLength = 0;
    const namedCurve = ECNamedCurves.find(json.crv);
    if (namedCurve) {
      this.namedCurve = namedCurve.id;
      coordinateLength = namedCurve.size;
    }
    const xConvertBuffer = stringToArrayBuffer(fromBase64(json.x, true));
    if (xConvertBuffer.byteLength < coordinateLength) {
      this.x = new ArrayBuffer(coordinateLength);
      const view = new Uint8Array(this.x);
      const convertBufferView = new Uint8Array(xConvertBuffer);
      view.set(convertBufferView, 1);
    } else {
      this.x = xConvertBuffer.slice(0, coordinateLength);
    }
    const yConvertBuffer = stringToArrayBuffer(fromBase64(json.y, true));
    if (yConvertBuffer.byteLength < coordinateLength) {
      this.y = new ArrayBuffer(coordinateLength);
      const view = new Uint8Array(this.y);
      const convertBufferView = new Uint8Array(yConvertBuffer);
      view.set(convertBufferView, 1);
    } else {
      this.y = yConvertBuffer.slice(0, coordinateLength);
    }
  }
}
ECPublicKey.CLASS_NAME = "ECPublicKey";
const MODULUS$1 = "modulus";
const PUBLIC_EXPONENT$1 = "publicExponent";
const CLEAR_PROPS$1b = [MODULUS$1, PUBLIC_EXPONENT$1];
class RSAPublicKey extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.modulus = getParametersValue(parameters, MODULUS$1, RSAPublicKey.defaultValues(MODULUS$1));
    this.publicExponent = getParametersValue(parameters, PUBLIC_EXPONENT$1, RSAPublicKey.defaultValues(PUBLIC_EXPONENT$1));
    if (parameters.json) {
      this.fromJSON(parameters.json);
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case MODULUS$1:
        return new Integer();
      case PUBLIC_EXPONENT$1:
        return new Integer();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.modulus || EMPTY_STRING }),
        new Integer({ name: names.publicExponent || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1b);
    const asn1 = compareSchema(schema, schema, RSAPublicKey.schema({
      names: {
        modulus: MODULUS$1,
        publicExponent: PUBLIC_EXPONENT$1
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.modulus = asn1.result.modulus.convertFromDER(256);
    this.publicExponent = asn1.result.publicExponent;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.modulus.convertToDER(),
        this.publicExponent
      ]
    });
  }
  toJSON() {
    return {
      n: Convert.ToBase64Url(this.modulus.valueBlock.valueHexView),
      e: Convert.ToBase64Url(this.publicExponent.valueBlock.valueHexView)
    };
  }
  fromJSON(json) {
    ParameterError.assert("json", json, "n", "e");
    const array = stringToArrayBuffer(fromBase64(json.n, true));
    this.modulus = new Integer({ valueHex: array.slice(0, Math.pow(2, nearestPowerOf2(array.byteLength))) });
    this.publicExponent = new Integer({ valueHex: stringToArrayBuffer(fromBase64(json.e, true)).slice(0, 3) });
  }
}
RSAPublicKey.CLASS_NAME = "RSAPublicKey";
const ALGORITHM$1 = "algorithm";
const SUBJECT_PUBLIC_KEY = "subjectPublicKey";
const CLEAR_PROPS$1a = [ALGORITHM$1, SUBJECT_PUBLIC_KEY];
class PublicKeyInfo extends PkiObject {
  get parsedKey() {
    if (this._parsedKey === void 0) {
      switch (this.algorithm.algorithmId) {
        case "1.2.840.10045.2.1":
          if ("algorithmParams" in this.algorithm) {
            if (this.algorithm.algorithmParams.constructor.blockName() === ObjectIdentifier.blockName()) {
              try {
                this._parsedKey = new ECPublicKey({
                  namedCurve: this.algorithm.algorithmParams.valueBlock.toString(),
                  schema: this.subjectPublicKey.valueBlock.valueHexView
                });
              } catch (ex) {
              }
            }
          }
          break;
        case "1.2.840.113549.1.1.1":
          {
            const publicKeyASN1 = fromBER(this.subjectPublicKey.valueBlock.valueHexView);
            if (publicKeyASN1.offset !== -1) {
              try {
                this._parsedKey = new RSAPublicKey({ schema: publicKeyASN1.result });
              } catch (ex) {
              }
            }
          }
          break;
      }
      this._parsedKey || (this._parsedKey = null);
    }
    return this._parsedKey || void 0;
  }
  set parsedKey(value) {
    this._parsedKey = value;
  }
  constructor(parameters = {}) {
    super();
    this.algorithm = getParametersValue(parameters, ALGORITHM$1, PublicKeyInfo.defaultValues(ALGORITHM$1));
    this.subjectPublicKey = getParametersValue(parameters, SUBJECT_PUBLIC_KEY, PublicKeyInfo.defaultValues(SUBJECT_PUBLIC_KEY));
    const parsedKey = getParametersValue(parameters, "parsedKey", null);
    if (parsedKey) {
      this.parsedKey = parsedKey;
    }
    if (parameters.json) {
      this.fromJSON(parameters.json);
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ALGORITHM$1:
        return new AlgorithmIdentifier();
      case SUBJECT_PUBLIC_KEY:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AlgorithmIdentifier.schema(names.algorithm || {}),
        new BitString$1({ name: names.subjectPublicKey || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1a);
    const asn1 = compareSchema(schema, schema, PublicKeyInfo.schema({
      names: {
        algorithm: {
          names: {
            blockName: ALGORITHM$1
          }
        },
        subjectPublicKey: SUBJECT_PUBLIC_KEY
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.algorithm = new AlgorithmIdentifier({ schema: asn1.result.algorithm });
    this.subjectPublicKey = asn1.result.subjectPublicKey;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.algorithm.toSchema(),
        this.subjectPublicKey
      ]
    });
  }
  toJSON() {
    if (!this.parsedKey) {
      return {
        algorithm: this.algorithm.toJSON(),
        subjectPublicKey: this.subjectPublicKey.toJSON()
      };
    }
    const jwk = {};
    switch (this.algorithm.algorithmId) {
      case "1.2.840.10045.2.1":
        jwk.kty = "EC";
        break;
      case "1.2.840.113549.1.1.1":
        jwk.kty = "RSA";
        break;
    }
    const publicKeyJWK = this.parsedKey.toJSON();
    Object.assign(jwk, publicKeyJWK);
    return jwk;
  }
  fromJSON(json) {
    if ("kty" in json) {
      switch (json.kty.toUpperCase()) {
        case "EC":
          this.parsedKey = new ECPublicKey({ json });
          this.algorithm = new AlgorithmIdentifier({
            algorithmId: "1.2.840.10045.2.1",
            algorithmParams: new ObjectIdentifier({ value: this.parsedKey.namedCurve })
          });
          break;
        case "RSA":
          this.parsedKey = new RSAPublicKey({ json });
          this.algorithm = new AlgorithmIdentifier({
            algorithmId: "1.2.840.113549.1.1.1",
            algorithmParams: new Null()
          });
          break;
        default:
          throw new Error('Invalid value for "kty" parameter: '.concat(json.kty));
      }
      this.subjectPublicKey = new BitString$1({ valueHex: this.parsedKey.toSchema().toBER(false) });
    }
  }
  async importKey(publicKey, crypto2 = getCrypto(true)) {
    try {
      if (!publicKey) {
        throw new Error("Need to provide publicKey input parameter");
      }
      const exportedKey = await crypto2.exportKey("spki", publicKey);
      const asn1 = fromBER(exportedKey);
      try {
        this.fromSchema(asn1.result);
      } catch (exception) {
        throw new Error("Error during initializing object from schema");
      }
    } catch (e2) {
      const message = e2 instanceof Error ? e2.message : "".concat(e2);
      throw new Error("Error during exporting public key: ".concat(message));
    }
  }
}
PublicKeyInfo.CLASS_NAME = "PublicKeyInfo";
const VERSION$l = "version";
const PRIVATE_KEY$1 = "privateKey";
const NAMED_CURVE = "namedCurve";
const PUBLIC_KEY$1 = "publicKey";
const CLEAR_PROPS$19 = [
  VERSION$l,
  PRIVATE_KEY$1,
  NAMED_CURVE,
  PUBLIC_KEY$1
];
class ECPrivateKey extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$l, ECPrivateKey.defaultValues(VERSION$l));
    this.privateKey = getParametersValue(parameters, PRIVATE_KEY$1, ECPrivateKey.defaultValues(PRIVATE_KEY$1));
    if (NAMED_CURVE in parameters) {
      this.namedCurve = getParametersValue(parameters, NAMED_CURVE, ECPrivateKey.defaultValues(NAMED_CURVE));
    }
    if (PUBLIC_KEY$1 in parameters) {
      this.publicKey = getParametersValue(parameters, PUBLIC_KEY$1, ECPrivateKey.defaultValues(PUBLIC_KEY$1));
    }
    if (parameters.json) {
      this.fromJSON(parameters.json);
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$l:
        return 1;
      case PRIVATE_KEY$1:
        return new OctetString$1();
      case NAMED_CURVE:
        return EMPTY_STRING;
      case PUBLIC_KEY$1:
        return new ECPublicKey();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$l:
        return memberValue === ECPrivateKey.defaultValues(memberName);
      case PRIVATE_KEY$1:
        return memberValue.isEqual(ECPrivateKey.defaultValues(memberName));
      case NAMED_CURVE:
        return memberValue === EMPTY_STRING;
      case PUBLIC_KEY$1:
        return ECPublicKey.compareWithDefault(NAMED_CURVE, memberValue.namedCurve) && ECPublicKey.compareWithDefault("x", memberValue.x) && ECPublicKey.compareWithDefault("y", memberValue.y);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        new OctetString$1({ name: names.privateKey || EMPTY_STRING }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            new ObjectIdentifier({ name: names.namedCurve || EMPTY_STRING })
          ]
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [
            new BitString$1({ name: names.publicKey || EMPTY_STRING })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$19);
    const asn1 = compareSchema(schema, schema, ECPrivateKey.schema({
      names: {
        version: VERSION$l,
        privateKey: PRIVATE_KEY$1,
        namedCurve: NAMED_CURVE,
        publicKey: PUBLIC_KEY$1
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    this.privateKey = asn1.result.privateKey;
    if (NAMED_CURVE in asn1.result) {
      this.namedCurve = asn1.result.namedCurve.valueBlock.toString();
    }
    if (PUBLIC_KEY$1 in asn1.result) {
      const publicKeyData = { schema: asn1.result.publicKey.valueBlock.valueHex };
      if (NAMED_CURVE in this) {
        publicKeyData.namedCurve = this.namedCurve;
      }
      this.publicKey = new ECPublicKey(publicKeyData);
    }
  }
  toSchema() {
    const outputArray = [
      new Integer({ value: this.version }),
      this.privateKey
    ];
    if (this.namedCurve) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [
          new ObjectIdentifier({ value: this.namedCurve })
        ]
      }));
    }
    if (this.publicKey) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: [
          new BitString$1({ valueHex: this.publicKey.toSchema().toBER(false) })
        ]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    if (!this.namedCurve || ECPrivateKey.compareWithDefault(NAMED_CURVE, this.namedCurve)) {
      throw new Error('Not enough information for making JSON: absent "namedCurve" value');
    }
    const curve = ECNamedCurves.find(this.namedCurve);
    const privateKeyJSON = {
      crv: curve ? curve.name : this.namedCurve,
      d: Convert.ToBase64Url(this.privateKey.valueBlock.valueHexView)
    };
    if (this.publicKey) {
      const publicKeyJSON = this.publicKey.toJSON();
      privateKeyJSON.x = publicKeyJSON.x;
      privateKeyJSON.y = publicKeyJSON.y;
    }
    return privateKeyJSON;
  }
  fromJSON(json) {
    ParameterError.assert("json", json, "crv", "d");
    let coordinateLength = 0;
    const curve = ECNamedCurves.find(json.crv);
    if (curve) {
      this.namedCurve = curve.id;
      coordinateLength = curve.size;
    }
    const convertBuffer = Convert.FromBase64Url(json.d);
    if (convertBuffer.byteLength < coordinateLength) {
      const buffer = new ArrayBuffer(coordinateLength);
      const view = new Uint8Array(buffer);
      const convertBufferView = new Uint8Array(convertBuffer);
      view.set(convertBufferView, 1);
      this.privateKey = new OctetString$1({ valueHex: buffer });
    } else {
      this.privateKey = new OctetString$1({ valueHex: convertBuffer.slice(0, coordinateLength) });
    }
    if (json.x && json.y) {
      this.publicKey = new ECPublicKey({ json });
    }
  }
}
ECPrivateKey.CLASS_NAME = "ECPrivateKey";
const PRIME = "prime";
const EXPONENT = "exponent";
const COEFFICIENT$1 = "coefficient";
const CLEAR_PROPS$18 = [
  PRIME,
  EXPONENT,
  COEFFICIENT$1
];
class OtherPrimeInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.prime = getParametersValue(parameters, PRIME, OtherPrimeInfo.defaultValues(PRIME));
    this.exponent = getParametersValue(parameters, EXPONENT, OtherPrimeInfo.defaultValues(EXPONENT));
    this.coefficient = getParametersValue(parameters, COEFFICIENT$1, OtherPrimeInfo.defaultValues(COEFFICIENT$1));
    if (parameters.json) {
      this.fromJSON(parameters.json);
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case PRIME:
        return new Integer();
      case EXPONENT:
        return new Integer();
      case COEFFICIENT$1:
        return new Integer();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.prime || EMPTY_STRING }),
        new Integer({ name: names.exponent || EMPTY_STRING }),
        new Integer({ name: names.coefficient || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$18);
    const asn1 = compareSchema(schema, schema, OtherPrimeInfo.schema({
      names: {
        prime: PRIME,
        exponent: EXPONENT,
        coefficient: COEFFICIENT$1
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.prime = asn1.result.prime.convertFromDER();
    this.exponent = asn1.result.exponent.convertFromDER();
    this.coefficient = asn1.result.coefficient.convertFromDER();
  }
  toSchema() {
    return new Sequence({
      value: [
        this.prime.convertToDER(),
        this.exponent.convertToDER(),
        this.coefficient.convertToDER()
      ]
    });
  }
  toJSON() {
    return {
      r: Convert.ToBase64Url(this.prime.valueBlock.valueHexView),
      d: Convert.ToBase64Url(this.exponent.valueBlock.valueHexView),
      t: Convert.ToBase64Url(this.coefficient.valueBlock.valueHexView)
    };
  }
  fromJSON(json) {
    ParameterError.assert("json", json, "r", "d", "r");
    this.prime = new Integer({ valueHex: Convert.FromBase64Url(json.r) });
    this.exponent = new Integer({ valueHex: Convert.FromBase64Url(json.d) });
    this.coefficient = new Integer({ valueHex: Convert.FromBase64Url(json.t) });
  }
}
OtherPrimeInfo.CLASS_NAME = "OtherPrimeInfo";
const VERSION$k = "version";
const MODULUS = "modulus";
const PUBLIC_EXPONENT = "publicExponent";
const PRIVATE_EXPONENT = "privateExponent";
const PRIME1 = "prime1";
const PRIME2 = "prime2";
const EXPONENT1 = "exponent1";
const EXPONENT2 = "exponent2";
const COEFFICIENT = "coefficient";
const OTHER_PRIME_INFOS = "otherPrimeInfos";
const CLEAR_PROPS$17 = [
  VERSION$k,
  MODULUS,
  PUBLIC_EXPONENT,
  PRIVATE_EXPONENT,
  PRIME1,
  PRIME2,
  EXPONENT1,
  EXPONENT2,
  COEFFICIENT,
  OTHER_PRIME_INFOS
];
class RSAPrivateKey extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$k, RSAPrivateKey.defaultValues(VERSION$k));
    this.modulus = getParametersValue(parameters, MODULUS, RSAPrivateKey.defaultValues(MODULUS));
    this.publicExponent = getParametersValue(parameters, PUBLIC_EXPONENT, RSAPrivateKey.defaultValues(PUBLIC_EXPONENT));
    this.privateExponent = getParametersValue(parameters, PRIVATE_EXPONENT, RSAPrivateKey.defaultValues(PRIVATE_EXPONENT));
    this.prime1 = getParametersValue(parameters, PRIME1, RSAPrivateKey.defaultValues(PRIME1));
    this.prime2 = getParametersValue(parameters, PRIME2, RSAPrivateKey.defaultValues(PRIME2));
    this.exponent1 = getParametersValue(parameters, EXPONENT1, RSAPrivateKey.defaultValues(EXPONENT1));
    this.exponent2 = getParametersValue(parameters, EXPONENT2, RSAPrivateKey.defaultValues(EXPONENT2));
    this.coefficient = getParametersValue(parameters, COEFFICIENT, RSAPrivateKey.defaultValues(COEFFICIENT));
    if (OTHER_PRIME_INFOS in parameters) {
      this.otherPrimeInfos = getParametersValue(parameters, OTHER_PRIME_INFOS, RSAPrivateKey.defaultValues(OTHER_PRIME_INFOS));
    }
    if (parameters.json) {
      this.fromJSON(parameters.json);
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$k:
        return 0;
      case MODULUS:
        return new Integer();
      case PUBLIC_EXPONENT:
        return new Integer();
      case PRIVATE_EXPONENT:
        return new Integer();
      case PRIME1:
        return new Integer();
      case PRIME2:
        return new Integer();
      case EXPONENT1:
        return new Integer();
      case EXPONENT2:
        return new Integer();
      case COEFFICIENT:
        return new Integer();
      case OTHER_PRIME_INFOS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        new Integer({ name: names.modulus || EMPTY_STRING }),
        new Integer({ name: names.publicExponent || EMPTY_STRING }),
        new Integer({ name: names.privateExponent || EMPTY_STRING }),
        new Integer({ name: names.prime1 || EMPTY_STRING }),
        new Integer({ name: names.prime2 || EMPTY_STRING }),
        new Integer({ name: names.exponent1 || EMPTY_STRING }),
        new Integer({ name: names.exponent2 || EMPTY_STRING }),
        new Integer({ name: names.coefficient || EMPTY_STRING }),
        new Sequence({
          optional: true,
          value: [
            new Repeated({
              name: names.otherPrimeInfosName || EMPTY_STRING,
              value: OtherPrimeInfo.schema(names.otherPrimeInfo || {})
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$17);
    const asn1 = compareSchema(schema, schema, RSAPrivateKey.schema({
      names: {
        version: VERSION$k,
        modulus: MODULUS,
        publicExponent: PUBLIC_EXPONENT,
        privateExponent: PRIVATE_EXPONENT,
        prime1: PRIME1,
        prime2: PRIME2,
        exponent1: EXPONENT1,
        exponent2: EXPONENT2,
        coefficient: COEFFICIENT,
        otherPrimeInfo: {
          names: {
            blockName: OTHER_PRIME_INFOS
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    this.modulus = asn1.result.modulus.convertFromDER(256);
    this.publicExponent = asn1.result.publicExponent;
    this.privateExponent = asn1.result.privateExponent.convertFromDER(256);
    this.prime1 = asn1.result.prime1.convertFromDER(128);
    this.prime2 = asn1.result.prime2.convertFromDER(128);
    this.exponent1 = asn1.result.exponent1.convertFromDER(128);
    this.exponent2 = asn1.result.exponent2.convertFromDER(128);
    this.coefficient = asn1.result.coefficient.convertFromDER(128);
    if (OTHER_PRIME_INFOS in asn1.result)
      this.otherPrimeInfos = Array.from(asn1.result.otherPrimeInfos, (element) => new OtherPrimeInfo({ schema: element }));
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new Integer({ value: this.version }));
    outputArray.push(this.modulus.convertToDER());
    outputArray.push(this.publicExponent);
    outputArray.push(this.privateExponent.convertToDER());
    outputArray.push(this.prime1.convertToDER());
    outputArray.push(this.prime2.convertToDER());
    outputArray.push(this.exponent1.convertToDER());
    outputArray.push(this.exponent2.convertToDER());
    outputArray.push(this.coefficient.convertToDER());
    if (this.otherPrimeInfos) {
      outputArray.push(new Sequence({
        value: Array.from(this.otherPrimeInfos, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const jwk = {
      n: Convert.ToBase64Url(this.modulus.valueBlock.valueHexView),
      e: Convert.ToBase64Url(this.publicExponent.valueBlock.valueHexView),
      d: Convert.ToBase64Url(this.privateExponent.valueBlock.valueHexView),
      p: Convert.ToBase64Url(this.prime1.valueBlock.valueHexView),
      q: Convert.ToBase64Url(this.prime2.valueBlock.valueHexView),
      dp: Convert.ToBase64Url(this.exponent1.valueBlock.valueHexView),
      dq: Convert.ToBase64Url(this.exponent2.valueBlock.valueHexView),
      qi: Convert.ToBase64Url(this.coefficient.valueBlock.valueHexView)
    };
    if (this.otherPrimeInfos) {
      jwk.oth = Array.from(this.otherPrimeInfos, (o2) => o2.toJSON());
    }
    return jwk;
  }
  fromJSON(json) {
    ParameterError.assert("json", json, "n", "e", "d", "p", "q", "dp", "dq", "qi");
    this.modulus = new Integer({ valueHex: Convert.FromBase64Url(json.n) });
    this.publicExponent = new Integer({ valueHex: Convert.FromBase64Url(json.e) });
    this.privateExponent = new Integer({ valueHex: Convert.FromBase64Url(json.d) });
    this.prime1 = new Integer({ valueHex: Convert.FromBase64Url(json.p) });
    this.prime2 = new Integer({ valueHex: Convert.FromBase64Url(json.q) });
    this.exponent1 = new Integer({ valueHex: Convert.FromBase64Url(json.dp) });
    this.exponent2 = new Integer({ valueHex: Convert.FromBase64Url(json.dq) });
    this.coefficient = new Integer({ valueHex: Convert.FromBase64Url(json.qi) });
    if (json.oth) {
      this.otherPrimeInfos = Array.from(json.oth, (element) => new OtherPrimeInfo({ json: element }));
    }
  }
}
RSAPrivateKey.CLASS_NAME = "RSAPrivateKey";
const VERSION$j = "version";
const PRIVATE_KEY_ALGORITHM = "privateKeyAlgorithm";
const PRIVATE_KEY = "privateKey";
const ATTRIBUTES$5 = "attributes";
const PARSED_KEY = "parsedKey";
const CLEAR_PROPS$16 = [
  VERSION$j,
  PRIVATE_KEY_ALGORITHM,
  PRIVATE_KEY,
  ATTRIBUTES$5
];
class PrivateKeyInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$j, PrivateKeyInfo.defaultValues(VERSION$j));
    this.privateKeyAlgorithm = getParametersValue(parameters, PRIVATE_KEY_ALGORITHM, PrivateKeyInfo.defaultValues(PRIVATE_KEY_ALGORITHM));
    this.privateKey = getParametersValue(parameters, PRIVATE_KEY, PrivateKeyInfo.defaultValues(PRIVATE_KEY));
    if (ATTRIBUTES$5 in parameters) {
      this.attributes = getParametersValue(parameters, ATTRIBUTES$5, PrivateKeyInfo.defaultValues(ATTRIBUTES$5));
    }
    if (PARSED_KEY in parameters) {
      this.parsedKey = getParametersValue(parameters, PARSED_KEY, PrivateKeyInfo.defaultValues(PARSED_KEY));
    }
    if (parameters.json) {
      this.fromJSON(parameters.json);
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$j:
        return 0;
      case PRIVATE_KEY_ALGORITHM:
        return new AlgorithmIdentifier();
      case PRIVATE_KEY:
        return new OctetString$1();
      case ATTRIBUTES$5:
        return [];
      case PARSED_KEY:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        AlgorithmIdentifier.schema(names.privateKeyAlgorithm || {}),
        new OctetString$1({ name: names.privateKey || EMPTY_STRING }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            new Repeated({
              name: names.attributes || EMPTY_STRING,
              value: Attribute.schema()
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$16);
    const asn1 = compareSchema(schema, schema, PrivateKeyInfo.schema({
      names: {
        version: VERSION$j,
        privateKeyAlgorithm: {
          names: {
            blockName: PRIVATE_KEY_ALGORITHM
          }
        },
        privateKey: PRIVATE_KEY,
        attributes: ATTRIBUTES$5
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    this.privateKeyAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.privateKeyAlgorithm });
    this.privateKey = asn1.result.privateKey;
    if (ATTRIBUTES$5 in asn1.result)
      this.attributes = Array.from(asn1.result.attributes, (element) => new Attribute({ schema: element }));
    switch (this.privateKeyAlgorithm.algorithmId) {
      case "1.2.840.113549.1.1.1":
        {
          const privateKeyASN1 = fromBER(this.privateKey.valueBlock.valueHexView);
          if (privateKeyASN1.offset !== -1)
            this.parsedKey = new RSAPrivateKey({ schema: privateKeyASN1.result });
        }
        break;
      case "1.2.840.10045.2.1":
        if ("algorithmParams" in this.privateKeyAlgorithm) {
          if (this.privateKeyAlgorithm.algorithmParams instanceof ObjectIdentifier) {
            const privateKeyASN1 = fromBER(this.privateKey.valueBlock.valueHexView);
            if (privateKeyASN1.offset !== -1) {
              this.parsedKey = new ECPrivateKey({
                namedCurve: this.privateKeyAlgorithm.algorithmParams.valueBlock.toString(),
                schema: privateKeyASN1.result
              });
            }
          }
        }
        break;
    }
  }
  toSchema() {
    const outputArray = [
      new Integer({ value: this.version }),
      this.privateKeyAlgorithm.toSchema(),
      this.privateKey
    ];
    if (this.attributes) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: Array.from(this.attributes, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    if (!this.parsedKey) {
      const object = {
        version: this.version,
        privateKeyAlgorithm: this.privateKeyAlgorithm.toJSON(),
        privateKey: this.privateKey.toJSON()
      };
      if (this.attributes) {
        object.attributes = Array.from(this.attributes, (o2) => o2.toJSON());
      }
      return object;
    }
    const jwk = {};
    switch (this.privateKeyAlgorithm.algorithmId) {
      case "1.2.840.10045.2.1":
        jwk.kty = "EC";
        break;
      case "1.2.840.113549.1.1.1":
        jwk.kty = "RSA";
        break;
    }
    const publicKeyJWK = this.parsedKey.toJSON();
    Object.assign(jwk, publicKeyJWK);
    return jwk;
  }
  fromJSON(json) {
    if ("kty" in json) {
      switch (json.kty.toUpperCase()) {
        case "EC":
          this.parsedKey = new ECPrivateKey({ json });
          this.privateKeyAlgorithm = new AlgorithmIdentifier({
            algorithmId: "1.2.840.10045.2.1",
            algorithmParams: new ObjectIdentifier({ value: this.parsedKey.namedCurve })
          });
          break;
        case "RSA":
          this.parsedKey = new RSAPrivateKey({ json });
          this.privateKeyAlgorithm = new AlgorithmIdentifier({
            algorithmId: "1.2.840.113549.1.1.1",
            algorithmParams: new Null()
          });
          break;
        default:
          throw new Error('Invalid value for "kty" parameter: '.concat(json.kty));
      }
      this.privateKey = new OctetString$1({ valueHex: this.parsedKey.toSchema().toBER(false) });
    }
  }
}
PrivateKeyInfo.CLASS_NAME = "PrivateKeyInfo";
const CONTENT_TYPE$1 = "contentType";
const CONTENT_ENCRYPTION_ALGORITHM = "contentEncryptionAlgorithm";
const ENCRYPTED_CONTENT = "encryptedContent";
const CLEAR_PROPS$15 = [
  CONTENT_TYPE$1,
  CONTENT_ENCRYPTION_ALGORITHM,
  ENCRYPTED_CONTENT
];
const PIECE_SIZE = 1024;
class EncryptedContentInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.contentType = getParametersValue(parameters, CONTENT_TYPE$1, EncryptedContentInfo.defaultValues(CONTENT_TYPE$1));
    this.contentEncryptionAlgorithm = getParametersValue(parameters, CONTENT_ENCRYPTION_ALGORITHM, EncryptedContentInfo.defaultValues(CONTENT_ENCRYPTION_ALGORITHM));
    if (ENCRYPTED_CONTENT in parameters && parameters.encryptedContent) {
      this.encryptedContent = parameters.encryptedContent;
      if (this.encryptedContent.idBlock.tagClass === 1 && this.encryptedContent.idBlock.tagNumber === 4) {
        if (this.encryptedContent.idBlock.isConstructed === false && !parameters.disableSplit) {
          const constrString = new OctetString$1({
            idBlock: { isConstructed: true },
            isConstructed: true
          });
          let offset = 0;
          const valueHex = this.encryptedContent.valueBlock.valueHexView.slice().buffer;
          let length = valueHex.byteLength;
          while (length > 0) {
            const pieceView = new Uint8Array(valueHex, offset, offset + PIECE_SIZE > valueHex.byteLength ? valueHex.byteLength - offset : PIECE_SIZE);
            const _array = new ArrayBuffer(pieceView.length);
            const _view = new Uint8Array(_array);
            for (let i2 = 0; i2 < _view.length; i2++)
              _view[i2] = pieceView[i2];
            constrString.valueBlock.value.push(new OctetString$1({ valueHex: _array }));
            length -= pieceView.length;
            offset += pieceView.length;
          }
          this.encryptedContent = constrString;
        }
      }
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CONTENT_TYPE$1:
        return EMPTY_STRING;
      case CONTENT_ENCRYPTION_ALGORITHM:
        return new AlgorithmIdentifier();
      case ENCRYPTED_CONTENT:
        return new OctetString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case CONTENT_TYPE$1:
        return memberValue === EMPTY_STRING;
      case CONTENT_ENCRYPTION_ALGORITHM:
        return memberValue.algorithmId === EMPTY_STRING && "algorithmParams" in memberValue === false;
      case ENCRYPTED_CONTENT:
        return memberValue.isEqual(EncryptedContentInfo.defaultValues(ENCRYPTED_CONTENT));
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.contentType || EMPTY_STRING }),
        AlgorithmIdentifier.schema(names.contentEncryptionAlgorithm || {}),
        new Choice({
          value: [
            new Constructed({
              name: names.encryptedContent || EMPTY_STRING,
              idBlock: {
                tagClass: 3,
                tagNumber: 0
              },
              value: [
                new Repeated({
                  value: new OctetString$1()
                })
              ]
            }),
            new Primitive({
              name: names.encryptedContent || EMPTY_STRING,
              idBlock: {
                tagClass: 3,
                tagNumber: 0
              }
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$15);
    const asn1 = compareSchema(schema, schema, EncryptedContentInfo.schema({
      names: {
        contentType: CONTENT_TYPE$1,
        contentEncryptionAlgorithm: {
          names: {
            blockName: CONTENT_ENCRYPTION_ALGORITHM
          }
        },
        encryptedContent: ENCRYPTED_CONTENT
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.contentType = asn1.result.contentType.valueBlock.toString();
    this.contentEncryptionAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.contentEncryptionAlgorithm });
    if (ENCRYPTED_CONTENT in asn1.result) {
      this.encryptedContent = asn1.result.encryptedContent;
      this.encryptedContent.idBlock.tagClass = 1;
      this.encryptedContent.idBlock.tagNumber = 4;
    }
  }
  toSchema() {
    const sequenceLengthBlock = {
      isIndefiniteForm: false
    };
    const outputArray = [];
    outputArray.push(new ObjectIdentifier({ value: this.contentType }));
    outputArray.push(this.contentEncryptionAlgorithm.toSchema());
    if (this.encryptedContent) {
      sequenceLengthBlock.isIndefiniteForm = this.encryptedContent.idBlock.isConstructed;
      const encryptedValue = this.encryptedContent;
      encryptedValue.idBlock.tagClass = 3;
      encryptedValue.idBlock.tagNumber = 0;
      encryptedValue.lenBlock.isIndefiniteForm = this.encryptedContent.idBlock.isConstructed;
      outputArray.push(encryptedValue);
    }
    return new Sequence({
      lenBlock: sequenceLengthBlock,
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      contentType: this.contentType,
      contentEncryptionAlgorithm: this.contentEncryptionAlgorithm.toJSON()
    };
    if (this.encryptedContent) {
      res.encryptedContent = this.encryptedContent.toJSON();
    }
    return res;
  }
  getEncryptedContent() {
    if (!this.encryptedContent) {
      throw new Error("Parameter 'encryptedContent' is undefined");
    }
    return OctetString$1.prototype.getValue.call(this.encryptedContent);
  }
}
EncryptedContentInfo.CLASS_NAME = "EncryptedContentInfo";
const HASH_ALGORITHM$4 = "hashAlgorithm";
const MASK_GEN_ALGORITHM$1 = "maskGenAlgorithm";
const SALT_LENGTH = "saltLength";
const TRAILER_FIELD = "trailerField";
const CLEAR_PROPS$14 = [
  HASH_ALGORITHM$4,
  MASK_GEN_ALGORITHM$1,
  SALT_LENGTH,
  TRAILER_FIELD
];
class RSASSAPSSParams extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.hashAlgorithm = getParametersValue(parameters, HASH_ALGORITHM$4, RSASSAPSSParams.defaultValues(HASH_ALGORITHM$4));
    this.maskGenAlgorithm = getParametersValue(parameters, MASK_GEN_ALGORITHM$1, RSASSAPSSParams.defaultValues(MASK_GEN_ALGORITHM$1));
    this.saltLength = getParametersValue(parameters, SALT_LENGTH, RSASSAPSSParams.defaultValues(SALT_LENGTH));
    this.trailerField = getParametersValue(parameters, TRAILER_FIELD, RSASSAPSSParams.defaultValues(TRAILER_FIELD));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case HASH_ALGORITHM$4:
        return new AlgorithmIdentifier({
          algorithmId: "1.3.14.3.2.26",
          algorithmParams: new Null()
        });
      case MASK_GEN_ALGORITHM$1:
        return new AlgorithmIdentifier({
          algorithmId: "1.2.840.113549.1.1.8",
          algorithmParams: new AlgorithmIdentifier({
            algorithmId: "1.3.14.3.2.26",
            algorithmParams: new Null()
          }).toSchema()
        });
      case SALT_LENGTH:
        return 20;
      case TRAILER_FIELD:
        return 1;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          optional: true,
          value: [AlgorithmIdentifier.schema(names.hashAlgorithm || {})]
        }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          optional: true,
          value: [AlgorithmIdentifier.schema(names.maskGenAlgorithm || {})]
        }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          },
          optional: true,
          value: [new Integer({ name: names.saltLength || EMPTY_STRING })]
        }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 3
          },
          optional: true,
          value: [new Integer({ name: names.trailerField || EMPTY_STRING })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$14);
    const asn1 = compareSchema(schema, schema, RSASSAPSSParams.schema({
      names: {
        hashAlgorithm: {
          names: {
            blockName: HASH_ALGORITHM$4
          }
        },
        maskGenAlgorithm: {
          names: {
            blockName: MASK_GEN_ALGORITHM$1
          }
        },
        saltLength: SALT_LENGTH,
        trailerField: TRAILER_FIELD
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (HASH_ALGORITHM$4 in asn1.result)
      this.hashAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.hashAlgorithm });
    if (MASK_GEN_ALGORITHM$1 in asn1.result)
      this.maskGenAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.maskGenAlgorithm });
    if (SALT_LENGTH in asn1.result)
      this.saltLength = asn1.result.saltLength.valueBlock.valueDec;
    if (TRAILER_FIELD in asn1.result)
      this.trailerField = asn1.result.trailerField.valueBlock.valueDec;
  }
  toSchema() {
    const outputArray = [];
    if (!this.hashAlgorithm.isEqual(RSASSAPSSParams.defaultValues(HASH_ALGORITHM$4))) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [this.hashAlgorithm.toSchema()]
      }));
    }
    if (!this.maskGenAlgorithm.isEqual(RSASSAPSSParams.defaultValues(MASK_GEN_ALGORITHM$1))) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: [this.maskGenAlgorithm.toSchema()]
      }));
    }
    if (this.saltLength !== RSASSAPSSParams.defaultValues(SALT_LENGTH)) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 2
        },
        value: [new Integer({ value: this.saltLength })]
      }));
    }
    if (this.trailerField !== RSASSAPSSParams.defaultValues(TRAILER_FIELD)) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 3
        },
        value: [new Integer({ value: this.trailerField })]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {};
    if (!this.hashAlgorithm.isEqual(RSASSAPSSParams.defaultValues(HASH_ALGORITHM$4))) {
      res.hashAlgorithm = this.hashAlgorithm.toJSON();
    }
    if (!this.maskGenAlgorithm.isEqual(RSASSAPSSParams.defaultValues(MASK_GEN_ALGORITHM$1))) {
      res.maskGenAlgorithm = this.maskGenAlgorithm.toJSON();
    }
    if (this.saltLength !== RSASSAPSSParams.defaultValues(SALT_LENGTH)) {
      res.saltLength = this.saltLength;
    }
    if (this.trailerField !== RSASSAPSSParams.defaultValues(TRAILER_FIELD)) {
      res.trailerField = this.trailerField;
    }
    return res;
  }
}
RSASSAPSSParams.CLASS_NAME = "RSASSAPSSParams";
const SALT = "salt";
const ITERATION_COUNT = "iterationCount";
const KEY_LENGTH = "keyLength";
const PRF = "prf";
const CLEAR_PROPS$13 = [
  SALT,
  ITERATION_COUNT,
  KEY_LENGTH,
  PRF
];
class PBKDF2Params extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.salt = getParametersValue(parameters, SALT, PBKDF2Params.defaultValues(SALT));
    this.iterationCount = getParametersValue(parameters, ITERATION_COUNT, PBKDF2Params.defaultValues(ITERATION_COUNT));
    if (KEY_LENGTH in parameters) {
      this.keyLength = getParametersValue(parameters, KEY_LENGTH, PBKDF2Params.defaultValues(KEY_LENGTH));
    }
    if (PRF in parameters) {
      this.prf = getParametersValue(parameters, PRF, PBKDF2Params.defaultValues(PRF));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case SALT:
        return {};
      case ITERATION_COUNT:
        return -1;
      case KEY_LENGTH:
        return 0;
      case PRF:
        return new AlgorithmIdentifier({
          algorithmId: "1.3.14.3.2.26",
          algorithmParams: new Null()
        });
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Choice({
          value: [
            new OctetString$1({ name: names.saltPrimitive || EMPTY_STRING }),
            AlgorithmIdentifier.schema(names.saltConstructed || {})
          ]
        }),
        new Integer({ name: names.iterationCount || EMPTY_STRING }),
        new Integer({
          name: names.keyLength || EMPTY_STRING,
          optional: true
        }),
        AlgorithmIdentifier.schema(names.prf || {
          names: {
            optional: true
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$13);
    const asn1 = compareSchema(schema, schema, PBKDF2Params.schema({
      names: {
        saltPrimitive: SALT,
        saltConstructed: {
          names: {
            blockName: SALT
          }
        },
        iterationCount: ITERATION_COUNT,
        keyLength: KEY_LENGTH,
        prf: {
          names: {
            blockName: PRF,
            optional: true
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.salt = asn1.result.salt;
    this.iterationCount = asn1.result.iterationCount.valueBlock.valueDec;
    if (KEY_LENGTH in asn1.result)
      this.keyLength = asn1.result.keyLength.valueBlock.valueDec;
    if (PRF in asn1.result)
      this.prf = new AlgorithmIdentifier({ schema: asn1.result.prf });
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.salt);
    outputArray.push(new Integer({ value: this.iterationCount }));
    if (KEY_LENGTH in this) {
      if (PBKDF2Params.defaultValues(KEY_LENGTH) !== this.keyLength)
        outputArray.push(new Integer({ value: this.keyLength }));
    }
    if (this.prf) {
      if (PBKDF2Params.defaultValues(PRF).isEqual(this.prf) === false)
        outputArray.push(this.prf.toSchema());
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      salt: this.salt.toJSON(),
      iterationCount: this.iterationCount
    };
    if (KEY_LENGTH in this) {
      if (PBKDF2Params.defaultValues(KEY_LENGTH) !== this.keyLength)
        res.keyLength = this.keyLength;
    }
    if (this.prf) {
      if (PBKDF2Params.defaultValues(PRF).isEqual(this.prf) === false)
        res.prf = this.prf.toJSON();
    }
    return res;
  }
}
PBKDF2Params.CLASS_NAME = "PBKDF2Params";
const KEY_DERIVATION_FUNC = "keyDerivationFunc";
const ENCRYPTION_SCHEME = "encryptionScheme";
const CLEAR_PROPS$12 = [
  KEY_DERIVATION_FUNC,
  ENCRYPTION_SCHEME
];
class PBES2Params extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.keyDerivationFunc = getParametersValue(parameters, KEY_DERIVATION_FUNC, PBES2Params.defaultValues(KEY_DERIVATION_FUNC));
    this.encryptionScheme = getParametersValue(parameters, ENCRYPTION_SCHEME, PBES2Params.defaultValues(ENCRYPTION_SCHEME));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case KEY_DERIVATION_FUNC:
        return new AlgorithmIdentifier();
      case ENCRYPTION_SCHEME:
        return new AlgorithmIdentifier();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AlgorithmIdentifier.schema(names.keyDerivationFunc || {}),
        AlgorithmIdentifier.schema(names.encryptionScheme || {})
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$12);
    const asn1 = compareSchema(schema, schema, PBES2Params.schema({
      names: {
        keyDerivationFunc: {
          names: {
            blockName: KEY_DERIVATION_FUNC
          }
        },
        encryptionScheme: {
          names: {
            blockName: ENCRYPTION_SCHEME
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.keyDerivationFunc = new AlgorithmIdentifier({ schema: asn1.result.keyDerivationFunc });
    this.encryptionScheme = new AlgorithmIdentifier({ schema: asn1.result.encryptionScheme });
  }
  toSchema() {
    return new Sequence({
      value: [
        this.keyDerivationFunc.toSchema(),
        this.encryptionScheme.toSchema()
      ]
    });
  }
  toJSON() {
    return {
      keyDerivationFunc: this.keyDerivationFunc.toJSON(),
      encryptionScheme: this.encryptionScheme.toJSON()
    };
  }
}
PBES2Params.CLASS_NAME = "PBES2Params";
class AbstractCryptoEngine {
  constructor(parameters) {
    this.crypto = parameters.crypto;
    this.subtle = "webkitSubtle" in parameters.crypto ? parameters.crypto.webkitSubtle : parameters.crypto.subtle;
    this.name = getParametersValue(parameters, "name", EMPTY_STRING);
  }
  async encrypt(...args) {
    return this.subtle.encrypt(...args);
  }
  async decrypt(...args) {
    return this.subtle.decrypt(...args);
  }
  sign(...args) {
    return this.subtle.sign(...args);
  }
  async verify(...args) {
    return this.subtle.verify(...args);
  }
  async digest(...args) {
    return this.subtle.digest(...args);
  }
  async generateKey(...args) {
    return this.subtle.generateKey(...args);
  }
  async deriveKey(...args) {
    return this.subtle.deriveKey(...args);
  }
  async deriveBits(...args) {
    return this.subtle.deriveBits(...args);
  }
  async wrapKey(...args) {
    return this.subtle.wrapKey(...args);
  }
  async unwrapKey(...args) {
    return this.subtle.unwrapKey(...args);
  }
  exportKey(...args) {
    return this.subtle.exportKey(...args);
  }
  importKey(...args) {
    return this.subtle.importKey(...args);
  }
  getRandomValues(array) {
    return this.crypto.getRandomValues(array);
  }
}
async function makePKCS12B2Key(hashAlgorithm, keyLength, password, salt, iterationCount) {
  let u2;
  let v2;
  let md;
  switch (hashAlgorithm.toUpperCase()) {
    case "SHA-1":
      u2 = 20;
      v2 = 64;
      md = sha1;
      break;
    case "SHA-256":
      u2 = 32;
      v2 = 64;
      md = sha256;
      break;
    case "SHA-384":
      u2 = 48;
      v2 = 128;
      md = sha384;
      break;
    case "SHA-512":
      u2 = 64;
      v2 = 128;
      md = sha512;
      break;
    default:
      throw new Error("Unsupported hashing algorithm");
  }
  const originalPassword = new Uint8Array(password);
  let decodedPassword = new TextDecoder().decode(password);
  const encodedPassword = new TextEncoder().encode(decodedPassword);
  if (encodedPassword.some((byte, i2) => byte !== originalPassword[i2])) {
    decodedPassword = String.fromCharCode(...originalPassword);
  }
  const passwordTransformed = new Uint8Array(decodedPassword.length * 2 + 2);
  const passwordView = new DataView(passwordTransformed.buffer);
  for (let i2 = 0; i2 < decodedPassword.length; i2++) {
    passwordView.setUint16(i2 * 2, decodedPassword.charCodeAt(i2), false);
  }
  passwordView.setUint16(decodedPassword.length * 2, 0, false);
  const D2 = new Uint8Array(v2).fill(3);
  const saltView = new Uint8Array(salt);
  const S2 = new Uint8Array(v2 * Math.ceil(saltView.length / v2)).map((_2, i2) => saltView[i2 % saltView.length]);
  const P2 = new Uint8Array(v2 * Math.ceil(passwordTransformed.length / v2)).map((_2, i2) => passwordTransformed[i2 % passwordTransformed.length]);
  let I2 = new Uint8Array(S2.length + P2.length);
  I2.set(S2);
  I2.set(P2, S2.length);
  const c2 = Math.ceil((keyLength >> 3) / u2);
  const result = [];
  for (let i2 = 0; i2 < c2; i2++) {
    let A2 = new Uint8Array(D2.length + I2.length);
    A2.set(D2);
    A2.set(I2, D2.length);
    for (let j2 = 0; j2 < iterationCount; j2++) {
      A2 = md(A2);
    }
    const B2 = new Uint8Array(v2).map((_2, i3) => A2[i3 % A2.length]);
    const k2 = Math.ceil(saltView.length / v2) + Math.ceil(passwordTransformed.length / v2);
    const iRound = [];
    for (let j2 = 0; j2 < k2; j2++) {
      const chunk = Array.from(I2.slice(j2 * v2, (j2 + 1) * v2));
      let x2 = 511;
      for (let l2 = B2.length - 1; l2 >= 0; l2--) {
        x2 >>= 8;
        x2 += B2[l2] + (chunk[l2] || 0);
        chunk[l2] = x2 & 255;
      }
      iRound.push(...chunk);
    }
    I2 = new Uint8Array(iRound);
    result.push(...A2);
  }
  return new Uint8Array(result.slice(0, keyLength >> 3)).buffer;
}
function prepareAlgorithm(data) {
  const res = typeof data === "string" ? { name: data } : data;
  if ("hash" in res) {
    return __spreadProps(__spreadValues({}, res), {
      hash: prepareAlgorithm(res.hash)
    });
  }
  return res;
}
class CryptoEngine extends AbstractCryptoEngine {
  async importKey(format, keyData, algorithm, extractable, keyUsages) {
    var _a3, _b, _c2, _d, _e3, _f;
    let jwk = {};
    const alg = prepareAlgorithm(algorithm);
    switch (format.toLowerCase()) {
      case "raw":
        return this.subtle.importKey("raw", keyData, algorithm, extractable, keyUsages);
      case "spki":
        {
          const asn1 = fromBER(BufferSourceConverter.toArrayBuffer(keyData));
          AsnError.assert(asn1, "keyData");
          const publicKeyInfo = new PublicKeyInfo();
          try {
            publicKeyInfo.fromSchema(asn1.result);
          } catch (e2) {
            throw new ArgumentError("Incorrect keyData");
          }
          switch (alg.name.toUpperCase()) {
            case "RSA-PSS": {
              if (!alg.hash) {
                throw new ParameterError("hash", "algorithm.hash", "Incorrect hash algorithm: Hash algorithm is missed");
              }
              switch (alg.hash.name.toUpperCase()) {
                case "SHA-1":
                  jwk.alg = "PS1";
                  break;
                case "SHA-256":
                  jwk.alg = "PS256";
                  break;
                case "SHA-384":
                  jwk.alg = "PS384";
                  break;
                case "SHA-512":
                  jwk.alg = "PS512";
                  break;
                default:
                  throw new Error("Incorrect hash algorithm: ".concat(alg.hash.name.toUpperCase()));
              }
            }
            case "RSASSA-PKCS1-V1_5":
              {
                keyUsages = ["verify"];
                jwk.kty = "RSA";
                jwk.ext = extractable;
                jwk.key_ops = keyUsages;
                if (publicKeyInfo.algorithm.algorithmId !== "1.2.840.113549.1.1.1")
                  throw new Error("Incorrect public key algorithm: ".concat(publicKeyInfo.algorithm.algorithmId));
                if (!jwk.alg) {
                  if (!alg.hash) {
                    throw new ParameterError("hash", "algorithm.hash", "Incorrect hash algorithm: Hash algorithm is missed");
                  }
                  switch (alg.hash.name.toUpperCase()) {
                    case "SHA-1":
                      jwk.alg = "RS1";
                      break;
                    case "SHA-256":
                      jwk.alg = "RS256";
                      break;
                    case "SHA-384":
                      jwk.alg = "RS384";
                      break;
                    case "SHA-512":
                      jwk.alg = "RS512";
                      break;
                    default:
                      throw new Error("Incorrect hash algorithm: ".concat(alg.hash.name.toUpperCase()));
                  }
                }
                const publicKeyJSON = publicKeyInfo.toJSON();
                Object.assign(jwk, publicKeyJSON);
              }
              break;
            case "ECDSA":
              keyUsages = ["verify"];
            case "ECDH":
              {
                jwk = {
                  kty: "EC",
                  ext: extractable,
                  key_ops: keyUsages
                };
                if (publicKeyInfo.algorithm.algorithmId !== "1.2.840.10045.2.1") {
                  throw new Error("Incorrect public key algorithm: ".concat(publicKeyInfo.algorithm.algorithmId));
                }
                const publicKeyJSON = publicKeyInfo.toJSON();
                Object.assign(jwk, publicKeyJSON);
              }
              break;
            case "RSA-OAEP":
              {
                jwk.kty = "RSA";
                jwk.ext = extractable;
                jwk.key_ops = keyUsages;
                if (this.name.toLowerCase() === "safari")
                  jwk.alg = "RSA-OAEP";
                else {
                  if (!alg.hash) {
                    throw new ParameterError("hash", "algorithm.hash", "Incorrect hash algorithm: Hash algorithm is missed");
                  }
                  switch (alg.hash.name.toUpperCase()) {
                    case "SHA-1":
                      jwk.alg = "RSA-OAEP";
                      break;
                    case "SHA-256":
                      jwk.alg = "RSA-OAEP-256";
                      break;
                    case "SHA-384":
                      jwk.alg = "RSA-OAEP-384";
                      break;
                    case "SHA-512":
                      jwk.alg = "RSA-OAEP-512";
                      break;
                    default:
                      throw new Error("Incorrect hash algorithm: ".concat(alg.hash.name.toUpperCase()));
                  }
                }
                const publicKeyJSON = publicKeyInfo.toJSON();
                Object.assign(jwk, publicKeyJSON);
              }
              break;
            case "RSAES-PKCS1-V1_5":
              {
                jwk.kty = "RSA";
                jwk.ext = extractable;
                jwk.key_ops = keyUsages;
                jwk.alg = "PS1";
                const publicKeyJSON = publicKeyInfo.toJSON();
                Object.assign(jwk, publicKeyJSON);
              }
              break;
            default:
              throw new Error("Incorrect algorithm name: ".concat(alg.name.toUpperCase()));
          }
        }
        break;
      case "pkcs8":
        {
          const privateKeyInfo = new PrivateKeyInfo();
          const asn1 = fromBER(BufferSourceConverter.toArrayBuffer(keyData));
          AsnError.assert(asn1, "keyData");
          try {
            privateKeyInfo.fromSchema(asn1.result);
          } catch (ex) {
            throw new Error("Incorrect keyData");
          }
          if (!privateKeyInfo.parsedKey)
            throw new Error("Incorrect keyData");
          switch (alg.name.toUpperCase()) {
            case "RSA-PSS": {
              switch ((_a3 = alg.hash) === null || _a3 === void 0 ? void 0 : _a3.name.toUpperCase()) {
                case "SHA-1":
                  jwk.alg = "PS1";
                  break;
                case "SHA-256":
                  jwk.alg = "PS256";
                  break;
                case "SHA-384":
                  jwk.alg = "PS384";
                  break;
                case "SHA-512":
                  jwk.alg = "PS512";
                  break;
                default:
                  throw new Error("Incorrect hash algorithm: ".concat((_b = alg.hash) === null || _b === void 0 ? void 0 : _b.name.toUpperCase()));
              }
            }
            case "RSASSA-PKCS1-V1_5":
              {
                keyUsages = ["sign"];
                jwk.kty = "RSA";
                jwk.ext = extractable;
                jwk.key_ops = keyUsages;
                if (privateKeyInfo.privateKeyAlgorithm.algorithmId !== "1.2.840.113549.1.1.1")
                  throw new Error("Incorrect private key algorithm: ".concat(privateKeyInfo.privateKeyAlgorithm.algorithmId));
                if ("alg" in jwk === false) {
                  switch ((_c2 = alg.hash) === null || _c2 === void 0 ? void 0 : _c2.name.toUpperCase()) {
                    case "SHA-1":
                      jwk.alg = "RS1";
                      break;
                    case "SHA-256":
                      jwk.alg = "RS256";
                      break;
                    case "SHA-384":
                      jwk.alg = "RS384";
                      break;
                    case "SHA-512":
                      jwk.alg = "RS512";
                      break;
                    default:
                      throw new Error("Incorrect hash algorithm: ".concat((_d = alg.hash) === null || _d === void 0 ? void 0 : _d.name.toUpperCase()));
                  }
                }
                const privateKeyJSON = privateKeyInfo.toJSON();
                Object.assign(jwk, privateKeyJSON);
              }
              break;
            case "ECDSA":
              keyUsages = ["sign"];
            case "ECDH":
              {
                jwk = {
                  kty: "EC",
                  ext: extractable,
                  key_ops: keyUsages
                };
                if (privateKeyInfo.privateKeyAlgorithm.algorithmId !== "1.2.840.10045.2.1")
                  throw new Error("Incorrect algorithm: ".concat(privateKeyInfo.privateKeyAlgorithm.algorithmId));
                const privateKeyJSON = privateKeyInfo.toJSON();
                Object.assign(jwk, privateKeyJSON);
              }
              break;
            case "RSA-OAEP":
              {
                jwk.kty = "RSA";
                jwk.ext = extractable;
                jwk.key_ops = keyUsages;
                if (this.name.toLowerCase() === "safari")
                  jwk.alg = "RSA-OAEP";
                else {
                  switch ((_e3 = alg.hash) === null || _e3 === void 0 ? void 0 : _e3.name.toUpperCase()) {
                    case "SHA-1":
                      jwk.alg = "RSA-OAEP";
                      break;
                    case "SHA-256":
                      jwk.alg = "RSA-OAEP-256";
                      break;
                    case "SHA-384":
                      jwk.alg = "RSA-OAEP-384";
                      break;
                    case "SHA-512":
                      jwk.alg = "RSA-OAEP-512";
                      break;
                    default:
                      throw new Error("Incorrect hash algorithm: ".concat((_f = alg.hash) === null || _f === void 0 ? void 0 : _f.name.toUpperCase()));
                  }
                }
                const privateKeyJSON = privateKeyInfo.toJSON();
                Object.assign(jwk, privateKeyJSON);
              }
              break;
            case "RSAES-PKCS1-V1_5":
              {
                keyUsages = ["decrypt"];
                jwk.kty = "RSA";
                jwk.ext = extractable;
                jwk.key_ops = keyUsages;
                jwk.alg = "PS1";
                const privateKeyJSON = privateKeyInfo.toJSON();
                Object.assign(jwk, privateKeyJSON);
              }
              break;
            default:
              throw new Error("Incorrect algorithm name: ".concat(alg.name.toUpperCase()));
          }
        }
        break;
      case "jwk":
        jwk = keyData;
        break;
      default:
        throw new Error("Incorrect format: ".concat(format));
    }
    if (this.name.toLowerCase() === "safari") {
      try {
        return this.subtle.importKey("jwk", stringToArrayBuffer(JSON.stringify(jwk)), algorithm, extractable, keyUsages);
      } catch (e2) {
        return this.subtle.importKey("jwk", jwk, algorithm, extractable, keyUsages);
      }
    }
    return this.subtle.importKey("jwk", jwk, algorithm, extractable, keyUsages);
  }
  async exportKey(format, key) {
    let jwk = await this.subtle.exportKey("jwk", key);
    if (this.name.toLowerCase() === "safari") {
      if (jwk instanceof ArrayBuffer) {
        jwk = JSON.parse(arrayBufferToString(jwk));
      }
    }
    switch (format.toLowerCase()) {
      case "raw":
        return this.subtle.exportKey("raw", key);
      case "spki": {
        const publicKeyInfo = new PublicKeyInfo();
        try {
          publicKeyInfo.fromJSON(jwk);
        } catch (ex) {
          throw new Error("Incorrect key data");
        }
        return publicKeyInfo.toSchema().toBER(false);
      }
      case "pkcs8": {
        const privateKeyInfo = new PrivateKeyInfo();
        try {
          privateKeyInfo.fromJSON(jwk);
        } catch (ex) {
          throw new Error("Incorrect key data");
        }
        return privateKeyInfo.toSchema().toBER(false);
      }
      case "jwk":
        return jwk;
      default:
        throw new Error("Incorrect format: ".concat(format));
    }
  }
  async convert(inputFormat, outputFormat, keyData, algorithm, extractable, keyUsages) {
    if (inputFormat.toLowerCase() === outputFormat.toLowerCase()) {
      return keyData;
    }
    const key = await this.importKey(inputFormat, keyData, algorithm, extractable, keyUsages);
    return this.exportKey(outputFormat, key);
  }
  getAlgorithmByOID(oid, safety = false, target) {
    switch (oid) {
      case "1.2.840.113549.1.1.1":
        return {
          name: "RSAES-PKCS1-v1_5"
        };
      case "1.2.840.113549.1.1.5":
        return {
          name: "RSASSA-PKCS1-v1_5",
          hash: {
            name: "SHA-1"
          }
        };
      case "1.2.840.113549.1.1.11":
        return {
          name: "RSASSA-PKCS1-v1_5",
          hash: {
            name: "SHA-256"
          }
        };
      case "1.2.840.113549.1.1.12":
        return {
          name: "RSASSA-PKCS1-v1_5",
          hash: {
            name: "SHA-384"
          }
        };
      case "1.2.840.113549.1.1.13":
        return {
          name: "RSASSA-PKCS1-v1_5",
          hash: {
            name: "SHA-512"
          }
        };
      case "1.2.840.113549.1.1.10":
        return {
          name: "RSA-PSS"
        };
      case "1.2.840.113549.1.1.7":
        return {
          name: "RSA-OAEP"
        };
      case "1.2.840.10045.2.1":
      case "1.2.840.10045.4.1":
        return {
          name: "ECDSA",
          hash: {
            name: "SHA-1"
          }
        };
      case "1.2.840.10045.4.3.2":
        return {
          name: "ECDSA",
          hash: {
            name: "SHA-256"
          }
        };
      case "1.2.840.10045.4.3.3":
        return {
          name: "ECDSA",
          hash: {
            name: "SHA-384"
          }
        };
      case "1.2.840.10045.4.3.4":
        return {
          name: "ECDSA",
          hash: {
            name: "SHA-512"
          }
        };
      case "1.3.133.16.840.63.0.2":
        return {
          name: "ECDH",
          kdf: "SHA-1"
        };
      case "1.3.132.1.11.1":
        return {
          name: "ECDH",
          kdf: "SHA-256"
        };
      case "1.3.132.1.11.2":
        return {
          name: "ECDH",
          kdf: "SHA-384"
        };
      case "1.3.132.1.11.3":
        return {
          name: "ECDH",
          kdf: "SHA-512"
        };
      case "2.16.840.1.101.3.4.1.2":
        return {
          name: "AES-CBC",
          length: 128
        };
      case "2.16.840.1.101.3.4.1.22":
        return {
          name: "AES-CBC",
          length: 192
        };
      case "2.16.840.1.101.3.4.1.42":
        return {
          name: "AES-CBC",
          length: 256
        };
      case "2.16.840.1.101.3.4.1.6":
        return {
          name: "AES-GCM",
          length: 128
        };
      case "2.16.840.1.101.3.4.1.26":
        return {
          name: "AES-GCM",
          length: 192
        };
      case "2.16.840.1.101.3.4.1.46":
        return {
          name: "AES-GCM",
          length: 256
        };
      case "2.16.840.1.101.3.4.1.4":
        return {
          name: "AES-CFB",
          length: 128
        };
      case "2.16.840.1.101.3.4.1.24":
        return {
          name: "AES-CFB",
          length: 192
        };
      case "2.16.840.1.101.3.4.1.44":
        return {
          name: "AES-CFB",
          length: 256
        };
      case "2.16.840.1.101.3.4.1.5":
        return {
          name: "AES-KW",
          length: 128
        };
      case "2.16.840.1.101.3.4.1.25":
        return {
          name: "AES-KW",
          length: 192
        };
      case "2.16.840.1.101.3.4.1.45":
        return {
          name: "AES-KW",
          length: 256
        };
      case "1.2.840.113549.2.7":
        return {
          name: "HMAC",
          hash: {
            name: "SHA-1"
          }
        };
      case "1.2.840.113549.2.9":
        return {
          name: "HMAC",
          hash: {
            name: "SHA-256"
          }
        };
      case "1.2.840.113549.2.10":
        return {
          name: "HMAC",
          hash: {
            name: "SHA-384"
          }
        };
      case "1.2.840.113549.2.11":
        return {
          name: "HMAC",
          hash: {
            name: "SHA-512"
          }
        };
      case "1.2.840.113549.1.9.16.3.5":
        return {
          name: "DH"
        };
      case "1.3.14.3.2.26":
        return {
          name: "SHA-1"
        };
      case "2.16.840.1.101.3.4.2.1":
        return {
          name: "SHA-256"
        };
      case "2.16.840.1.101.3.4.2.2":
        return {
          name: "SHA-384"
        };
      case "2.16.840.1.101.3.4.2.3":
        return {
          name: "SHA-512"
        };
      case "1.2.840.113549.1.5.12":
        return {
          name: "PBKDF2"
        };
      case "1.2.840.10045.3.1.7":
        return {
          name: "P-256"
        };
      case "1.3.132.0.34":
        return {
          name: "P-384"
        };
      case "1.3.132.0.35":
        return {
          name: "P-521"
        };
    }
    if (safety) {
      throw new Error("Unsupported algorithm identifier ".concat(target ? "for ".concat(target, " ") : EMPTY_STRING, ": ").concat(oid));
    }
    return {};
  }
  getOIDByAlgorithm(algorithm, safety = false, target) {
    let result = EMPTY_STRING;
    switch (algorithm.name.toUpperCase()) {
      case "RSAES-PKCS1-V1_5":
        result = "1.2.840.113549.1.1.1";
        break;
      case "RSASSA-PKCS1-V1_5":
        switch (algorithm.hash.name.toUpperCase()) {
          case "SHA-1":
            result = "1.2.840.113549.1.1.5";
            break;
          case "SHA-256":
            result = "1.2.840.113549.1.1.11";
            break;
          case "SHA-384":
            result = "1.2.840.113549.1.1.12";
            break;
          case "SHA-512":
            result = "1.2.840.113549.1.1.13";
            break;
        }
        break;
      case "RSA-PSS":
        result = "1.2.840.113549.1.1.10";
        break;
      case "RSA-OAEP":
        result = "1.2.840.113549.1.1.7";
        break;
      case "ECDSA":
        switch (algorithm.hash.name.toUpperCase()) {
          case "SHA-1":
            result = "1.2.840.10045.4.1";
            break;
          case "SHA-256":
            result = "1.2.840.10045.4.3.2";
            break;
          case "SHA-384":
            result = "1.2.840.10045.4.3.3";
            break;
          case "SHA-512":
            result = "1.2.840.10045.4.3.4";
            break;
        }
        break;
      case "ECDH":
        switch (algorithm.kdf.toUpperCase()) {
          case "SHA-1":
            result = "1.3.133.16.840.63.0.2";
            break;
          case "SHA-256":
            result = "1.3.132.1.11.1";
            break;
          case "SHA-384":
            result = "1.3.132.1.11.2";
            break;
          case "SHA-512":
            result = "1.3.132.1.11.3";
            break;
        }
        break;
      case "AES-CTR":
        break;
      case "AES-CBC":
        switch (algorithm.length) {
          case 128:
            result = "2.16.840.1.101.3.4.1.2";
            break;
          case 192:
            result = "2.16.840.1.101.3.4.1.22";
            break;
          case 256:
            result = "2.16.840.1.101.3.4.1.42";
            break;
        }
        break;
      case "AES-CMAC":
        break;
      case "AES-GCM":
        switch (algorithm.length) {
          case 128:
            result = "2.16.840.1.101.3.4.1.6";
            break;
          case 192:
            result = "2.16.840.1.101.3.4.1.26";
            break;
          case 256:
            result = "2.16.840.1.101.3.4.1.46";
            break;
        }
        break;
      case "AES-CFB":
        switch (algorithm.length) {
          case 128:
            result = "2.16.840.1.101.3.4.1.4";
            break;
          case 192:
            result = "2.16.840.1.101.3.4.1.24";
            break;
          case 256:
            result = "2.16.840.1.101.3.4.1.44";
            break;
        }
        break;
      case "AES-KW":
        switch (algorithm.length) {
          case 128:
            result = "2.16.840.1.101.3.4.1.5";
            break;
          case 192:
            result = "2.16.840.1.101.3.4.1.25";
            break;
          case 256:
            result = "2.16.840.1.101.3.4.1.45";
            break;
        }
        break;
      case "HMAC":
        switch (algorithm.hash.name.toUpperCase()) {
          case "SHA-1":
            result = "1.2.840.113549.2.7";
            break;
          case "SHA-256":
            result = "1.2.840.113549.2.9";
            break;
          case "SHA-384":
            result = "1.2.840.113549.2.10";
            break;
          case "SHA-512":
            result = "1.2.840.113549.2.11";
            break;
        }
        break;
      case "DH":
        result = "1.2.840.113549.1.9.16.3.5";
        break;
      case "SHA-1":
        result = "1.3.14.3.2.26";
        break;
      case "SHA-256":
        result = "2.16.840.1.101.3.4.2.1";
        break;
      case "SHA-384":
        result = "2.16.840.1.101.3.4.2.2";
        break;
      case "SHA-512":
        result = "2.16.840.1.101.3.4.2.3";
        break;
      case "CONCAT":
        break;
      case "HKDF":
        break;
      case "PBKDF2":
        result = "1.2.840.113549.1.5.12";
        break;
      case "P-256":
        result = "1.2.840.10045.3.1.7";
        break;
      case "P-384":
        result = "1.3.132.0.34";
        break;
      case "P-521":
        result = "1.3.132.0.35";
        break;
    }
    if (!result && safety) {
      throw new Error("Unsupported algorithm ".concat(target ? "for ".concat(target, " ") : EMPTY_STRING, ": ").concat(algorithm.name));
    }
    return result;
  }
  getAlgorithmParameters(algorithmName, operation) {
    let result = {
      algorithm: {},
      usages: []
    };
    switch (algorithmName.toUpperCase()) {
      case "RSAES-PKCS1-V1_5":
      case "RSASSA-PKCS1-V1_5":
        switch (operation.toLowerCase()) {
          case "generatekey":
            result = {
              algorithm: {
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: {
                  name: "SHA-256"
                }
              },
              usages: ["sign", "verify"]
            };
            break;
          case "verify":
          case "sign":
          case "importkey":
            result = {
              algorithm: {
                name: "RSASSA-PKCS1-v1_5",
                hash: {
                  name: "SHA-256"
                }
              },
              usages: ["verify"]
            };
            break;
          case "exportkey":
          default:
            return {
              algorithm: {
                name: "RSASSA-PKCS1-v1_5"
              },
              usages: []
            };
        }
        break;
      case "RSA-PSS":
        switch (operation.toLowerCase()) {
          case "sign":
          case "verify":
            result = {
              algorithm: {
                name: "RSA-PSS",
                hash: {
                  name: "SHA-1"
                },
                saltLength: 20
              },
              usages: ["sign", "verify"]
            };
            break;
          case "generatekey":
            result = {
              algorithm: {
                name: "RSA-PSS",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: {
                  name: "SHA-1"
                }
              },
              usages: ["sign", "verify"]
            };
            break;
          case "importkey":
            result = {
              algorithm: {
                name: "RSA-PSS",
                hash: {
                  name: "SHA-1"
                }
              },
              usages: ["verify"]
            };
            break;
          case "exportkey":
          default:
            return {
              algorithm: {
                name: "RSA-PSS"
              },
              usages: []
            };
        }
        break;
      case "RSA-OAEP":
        switch (operation.toLowerCase()) {
          case "encrypt":
          case "decrypt":
            result = {
              algorithm: {
                name: "RSA-OAEP"
              },
              usages: ["encrypt", "decrypt"]
            };
            break;
          case "generatekey":
            result = {
              algorithm: {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: {
                  name: "SHA-256"
                }
              },
              usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
            };
            break;
          case "importkey":
            result = {
              algorithm: {
                name: "RSA-OAEP",
                hash: {
                  name: "SHA-256"
                }
              },
              usages: ["encrypt"]
            };
            break;
          case "exportkey":
          default:
            return {
              algorithm: {
                name: "RSA-OAEP"
              },
              usages: []
            };
        }
        break;
      case "ECDSA":
        switch (operation.toLowerCase()) {
          case "generatekey":
            result = {
              algorithm: {
                name: "ECDSA",
                namedCurve: "P-256"
              },
              usages: ["sign", "verify"]
            };
            break;
          case "importkey":
            result = {
              algorithm: {
                name: "ECDSA",
                namedCurve: "P-256"
              },
              usages: ["verify"]
            };
            break;
          case "verify":
          case "sign":
            result = {
              algorithm: {
                name: "ECDSA",
                hash: {
                  name: "SHA-256"
                }
              },
              usages: ["sign"]
            };
            break;
          default:
            return {
              algorithm: {
                name: "ECDSA"
              },
              usages: []
            };
        }
        break;
      case "ECDH":
        switch (operation.toLowerCase()) {
          case "exportkey":
          case "importkey":
          case "generatekey":
            result = {
              algorithm: {
                name: "ECDH",
                namedCurve: "P-256"
              },
              usages: ["deriveKey", "deriveBits"]
            };
            break;
          case "derivekey":
          case "derivebits":
            result = {
              algorithm: {
                name: "ECDH",
                namedCurve: "P-256",
                public: []
              },
              usages: ["encrypt", "decrypt"]
            };
            break;
          default:
            return {
              algorithm: {
                name: "ECDH"
              },
              usages: []
            };
        }
        break;
      case "AES-CTR":
        switch (operation.toLowerCase()) {
          case "importkey":
          case "exportkey":
          case "generatekey":
            result = {
              algorithm: {
                name: "AES-CTR",
                length: 256
              },
              usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
            };
            break;
          case "decrypt":
          case "encrypt":
            result = {
              algorithm: {
                name: "AES-CTR",
                counter: new Uint8Array(16),
                length: 10
              },
              usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
            };
            break;
          default:
            return {
              algorithm: {
                name: "AES-CTR"
              },
              usages: []
            };
        }
        break;
      case "AES-CBC":
        switch (operation.toLowerCase()) {
          case "importkey":
          case "exportkey":
          case "generatekey":
            result = {
              algorithm: {
                name: "AES-CBC",
                length: 256
              },
              usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
            };
            break;
          case "decrypt":
          case "encrypt":
            result = {
              algorithm: {
                name: "AES-CBC",
                iv: this.getRandomValues(new Uint8Array(16))
              },
              usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
            };
            break;
          default:
            return {
              algorithm: {
                name: "AES-CBC"
              },
              usages: []
            };
        }
        break;
      case "AES-GCM":
        switch (operation.toLowerCase()) {
          case "importkey":
          case "exportkey":
          case "generatekey":
            result = {
              algorithm: {
                name: "AES-GCM",
                length: 256
              },
              usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
            };
            break;
          case "decrypt":
          case "encrypt":
            result = {
              algorithm: {
                name: "AES-GCM",
                iv: this.getRandomValues(new Uint8Array(16))
              },
              usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
            };
            break;
          default:
            return {
              algorithm: {
                name: "AES-GCM"
              },
              usages: []
            };
        }
        break;
      case "AES-KW":
        switch (operation.toLowerCase()) {
          case "importkey":
          case "exportkey":
          case "generatekey":
          case "wrapkey":
          case "unwrapkey":
            result = {
              algorithm: {
                name: "AES-KW",
                length: 256
              },
              usages: ["wrapKey", "unwrapKey"]
            };
            break;
          default:
            return {
              algorithm: {
                name: "AES-KW"
              },
              usages: []
            };
        }
        break;
      case "HMAC":
        switch (operation.toLowerCase()) {
          case "sign":
          case "verify":
            result = {
              algorithm: {
                name: "HMAC"
              },
              usages: ["sign", "verify"]
            };
            break;
          case "importkey":
          case "exportkey":
          case "generatekey":
            result = {
              algorithm: {
                name: "HMAC",
                length: 32,
                hash: {
                  name: "SHA-256"
                }
              },
              usages: ["sign", "verify"]
            };
            break;
          default:
            return {
              algorithm: {
                name: "HMAC"
              },
              usages: []
            };
        }
        break;
      case "HKDF":
        switch (operation.toLowerCase()) {
          case "derivekey":
            result = {
              algorithm: {
                name: "HKDF",
                hash: "SHA-256",
                salt: new Uint8Array([]),
                info: new Uint8Array([])
              },
              usages: ["encrypt", "decrypt"]
            };
            break;
          default:
            return {
              algorithm: {
                name: "HKDF"
              },
              usages: []
            };
        }
        break;
      case "PBKDF2":
        switch (operation.toLowerCase()) {
          case "derivekey":
            result = {
              algorithm: {
                name: "PBKDF2",
                hash: { name: "SHA-256" },
                salt: new Uint8Array([]),
                iterations: 1e4
              },
              usages: ["encrypt", "decrypt"]
            };
            break;
          default:
            return {
              algorithm: {
                name: "PBKDF2"
              },
              usages: []
            };
        }
        break;
    }
    return result;
  }
  getHashAlgorithm(signatureAlgorithm) {
    let result = EMPTY_STRING;
    switch (signatureAlgorithm.algorithmId) {
      case "1.2.840.10045.4.1":
      case "1.2.840.113549.1.1.5":
        result = "SHA-1";
        break;
      case "1.2.840.10045.4.3.2":
      case "1.2.840.113549.1.1.11":
        result = "SHA-256";
        break;
      case "1.2.840.10045.4.3.3":
      case "1.2.840.113549.1.1.12":
        result = "SHA-384";
        break;
      case "1.2.840.10045.4.3.4":
      case "1.2.840.113549.1.1.13":
        result = "SHA-512";
        break;
      case "1.2.840.113549.1.1.10":
        {
          try {
            const params = new RSASSAPSSParams({ schema: signatureAlgorithm.algorithmParams });
            if (params.hashAlgorithm) {
              const algorithm = this.getAlgorithmByOID(params.hashAlgorithm.algorithmId);
              if ("name" in algorithm) {
                result = algorithm.name;
              } else {
                return EMPTY_STRING;
              }
            } else
              result = "SHA-1";
          } catch (e2) {
          }
        }
        break;
    }
    return result;
  }
  async encryptEncryptedContentInfo(parameters) {
    ParameterError.assert(parameters, "password", "contentEncryptionAlgorithm", "hmacHashAlgorithm", "iterationCount", "contentToEncrypt", "contentToEncrypt", "contentType");
    const contentEncryptionOID = this.getOIDByAlgorithm(parameters.contentEncryptionAlgorithm, true, "contentEncryptionAlgorithm");
    const pbkdf2OID = this.getOIDByAlgorithm({
      name: "PBKDF2"
    }, true, "PBKDF2");
    const hmacOID = this.getOIDByAlgorithm({
      name: "HMAC",
      hash: {
        name: parameters.hmacHashAlgorithm
      }
    }, true, "hmacHashAlgorithm");
    const ivBuffer = new ArrayBuffer(16);
    const ivView = new Uint8Array(ivBuffer);
    this.getRandomValues(ivView);
    const saltBuffer = new ArrayBuffer(64);
    const saltView = new Uint8Array(saltBuffer);
    this.getRandomValues(saltView);
    const contentView = new Uint8Array(parameters.contentToEncrypt);
    const pbkdf2Params = new PBKDF2Params({
      salt: new OctetString$1({ valueHex: saltBuffer }),
      iterationCount: parameters.iterationCount,
      prf: new AlgorithmIdentifier({
        algorithmId: hmacOID,
        algorithmParams: new Null()
      })
    });
    const passwordView = new Uint8Array(parameters.password);
    const pbkdfKey = await this.importKey("raw", passwordView, "PBKDF2", false, ["deriveKey"]);
    const derivedKey = await this.deriveKey({
      name: "PBKDF2",
      hash: {
        name: parameters.hmacHashAlgorithm
      },
      salt: saltView,
      iterations: parameters.iterationCount
    }, pbkdfKey, parameters.contentEncryptionAlgorithm, false, ["encrypt"]);
    const encryptedData = await this.encrypt({
      name: parameters.contentEncryptionAlgorithm.name,
      iv: ivView
    }, derivedKey, contentView);
    const pbes2Parameters = new PBES2Params({
      keyDerivationFunc: new AlgorithmIdentifier({
        algorithmId: pbkdf2OID,
        algorithmParams: pbkdf2Params.toSchema()
      }),
      encryptionScheme: new AlgorithmIdentifier({
        algorithmId: contentEncryptionOID,
        algorithmParams: new OctetString$1({ valueHex: ivBuffer })
      })
    });
    return new EncryptedContentInfo({
      contentType: parameters.contentType,
      contentEncryptionAlgorithm: new AlgorithmIdentifier({
        algorithmId: "1.2.840.113549.1.5.13",
        algorithmParams: pbes2Parameters.toSchema()
      }),
      encryptedContent: new OctetString$1({ valueHex: encryptedData })
    });
  }
  async decryptEncryptedContentInfo(parameters) {
    ParameterError.assert(parameters, "password", "encryptedContentInfo");
    if (parameters.encryptedContentInfo.contentEncryptionAlgorithm.algorithmId !== "1.2.840.113549.1.5.13")
      throw new Error('Unknown "contentEncryptionAlgorithm": '.concat(parameters.encryptedContentInfo.contentEncryptionAlgorithm.algorithmId));
    let pbes2Parameters;
    try {
      pbes2Parameters = new PBES2Params({ schema: parameters.encryptedContentInfo.contentEncryptionAlgorithm.algorithmParams });
    } catch (ex) {
      throw new Error('Incorrectly encoded "pbes2Parameters"');
    }
    let pbkdf2Params;
    try {
      pbkdf2Params = new PBKDF2Params({ schema: pbes2Parameters.keyDerivationFunc.algorithmParams });
    } catch (ex) {
      throw new Error('Incorrectly encoded "pbkdf2Params"');
    }
    const contentEncryptionAlgorithm = this.getAlgorithmByOID(pbes2Parameters.encryptionScheme.algorithmId, true);
    const ivBuffer = pbes2Parameters.encryptionScheme.algorithmParams.valueBlock.valueHex;
    const ivView = new Uint8Array(ivBuffer);
    const saltBuffer = pbkdf2Params.salt.valueBlock.valueHex;
    const saltView = new Uint8Array(saltBuffer);
    const iterationCount = pbkdf2Params.iterationCount;
    let hmacHashAlgorithm = "SHA-1";
    if (pbkdf2Params.prf) {
      const algorithm = this.getAlgorithmByOID(pbkdf2Params.prf.algorithmId, true);
      hmacHashAlgorithm = algorithm.hash.name;
    }
    const pbkdfKey = await this.importKey("raw", parameters.password, "PBKDF2", false, ["deriveKey"]);
    const result = await this.deriveKey({
      name: "PBKDF2",
      hash: {
        name: hmacHashAlgorithm
      },
      salt: saltView,
      iterations: iterationCount
    }, pbkdfKey, contentEncryptionAlgorithm, false, ["decrypt"]);
    const dataBuffer = parameters.encryptedContentInfo.getEncryptedContent();
    return this.decrypt({
      name: contentEncryptionAlgorithm.name,
      iv: ivView
    }, result, dataBuffer);
  }
  async stampDataWithPassword(parameters) {
    if (parameters instanceof Object === false)
      throw new Error('Parameters must have type "Object"');
    ParameterError.assert(parameters, "password", "hashAlgorithm", "iterationCount", "salt", "contentToStamp");
    let length;
    switch (parameters.hashAlgorithm.toLowerCase()) {
      case "sha-1":
        length = 160;
        break;
      case "sha-256":
        length = 256;
        break;
      case "sha-384":
        length = 384;
        break;
      case "sha-512":
        length = 512;
        break;
      default:
        throw new Error('Incorrect "parameters.hashAlgorithm" parameter: '.concat(parameters.hashAlgorithm));
    }
    const hmacAlgorithm = {
      name: "HMAC",
      length,
      hash: {
        name: parameters.hashAlgorithm
      }
    };
    const pkcsKey = await makePKCS12B2Key(parameters.hashAlgorithm, length, parameters.password, parameters.salt, parameters.iterationCount);
    const hmacKey = await this.importKey("raw", new Uint8Array(pkcsKey), hmacAlgorithm, false, ["sign"]);
    return this.sign(hmacAlgorithm, hmacKey, new Uint8Array(parameters.contentToStamp));
  }
  async verifyDataStampedWithPassword(parameters) {
    ParameterError.assert(parameters, "password", "hashAlgorithm", "salt", "iterationCount", "contentToVerify", "signatureToVerify");
    let length = 0;
    switch (parameters.hashAlgorithm.toLowerCase()) {
      case "sha-1":
        length = 160;
        break;
      case "sha-256":
        length = 256;
        break;
      case "sha-384":
        length = 384;
        break;
      case "sha-512":
        length = 512;
        break;
      default:
        throw new Error('Incorrect "parameters.hashAlgorithm" parameter: '.concat(parameters.hashAlgorithm));
    }
    const hmacAlgorithm = {
      name: "HMAC",
      length,
      hash: {
        name: parameters.hashAlgorithm
      }
    };
    const pkcsKey = await makePKCS12B2Key(parameters.hashAlgorithm, length, parameters.password, parameters.salt, parameters.iterationCount);
    const hmacKey = await this.importKey("raw", new Uint8Array(pkcsKey), hmacAlgorithm, false, ["verify"]);
    return this.verify(hmacAlgorithm, hmacKey, new Uint8Array(parameters.signatureToVerify), new Uint8Array(parameters.contentToVerify));
  }
  async getSignatureParameters(privateKey, hashAlgorithm = "SHA-1") {
    this.getOIDByAlgorithm({ name: hashAlgorithm }, true, "hashAlgorithm");
    const signatureAlgorithm = new AlgorithmIdentifier();
    const parameters = this.getAlgorithmParameters(privateKey.algorithm.name, "sign");
    if (!Object.keys(parameters.algorithm).length) {
      throw new Error("Parameter 'algorithm' is empty");
    }
    const algorithm = parameters.algorithm;
    if ("hash" in privateKey.algorithm && privateKey.algorithm.hash && privateKey.algorithm.hash.name) {
      algorithm.hash.name = privateKey.algorithm.hash.name;
    } else {
      algorithm.hash.name = hashAlgorithm;
    }
    switch (privateKey.algorithm.name.toUpperCase()) {
      case "RSASSA-PKCS1-V1_5":
      case "ECDSA":
        signatureAlgorithm.algorithmId = this.getOIDByAlgorithm(algorithm, true);
        break;
      case "RSA-PSS":
        {
          switch (algorithm.hash.name.toUpperCase()) {
            case "SHA-256":
              algorithm.saltLength = 32;
              break;
            case "SHA-384":
              algorithm.saltLength = 48;
              break;
            case "SHA-512":
              algorithm.saltLength = 64;
              break;
          }
          const paramsObject = {};
          if (algorithm.hash.name.toUpperCase() !== "SHA-1") {
            const hashAlgorithmOID = this.getOIDByAlgorithm({ name: algorithm.hash.name }, true, "hashAlgorithm");
            paramsObject.hashAlgorithm = new AlgorithmIdentifier({
              algorithmId: hashAlgorithmOID,
              algorithmParams: new Null()
            });
            paramsObject.maskGenAlgorithm = new AlgorithmIdentifier({
              algorithmId: "1.2.840.113549.1.1.8",
              algorithmParams: paramsObject.hashAlgorithm.toSchema()
            });
          }
          if (algorithm.saltLength !== 20)
            paramsObject.saltLength = algorithm.saltLength;
          const pssParameters = new RSASSAPSSParams(paramsObject);
          signatureAlgorithm.algorithmId = "1.2.840.113549.1.1.10";
          signatureAlgorithm.algorithmParams = pssParameters.toSchema();
        }
        break;
      default:
        throw new Error("Unsupported signature algorithm: ".concat(privateKey.algorithm.name));
    }
    return {
      signatureAlgorithm,
      parameters
    };
  }
  async signWithPrivateKey(data, privateKey, parameters) {
    const signature = await this.sign(parameters.algorithm, privateKey, data);
    if (parameters.algorithm.name === "ECDSA") {
      return createCMSECDSASignature(signature);
    }
    return signature;
  }
  fillPublicKeyParameters(publicKeyInfo, signatureAlgorithm) {
    const parameters = {};
    const shaAlgorithm = this.getHashAlgorithm(signatureAlgorithm);
    if (shaAlgorithm === EMPTY_STRING)
      throw new Error("Unsupported signature algorithm: ".concat(signatureAlgorithm.algorithmId));
    let algorithmId;
    if (signatureAlgorithm.algorithmId === "1.2.840.113549.1.1.10")
      algorithmId = signatureAlgorithm.algorithmId;
    else
      algorithmId = publicKeyInfo.algorithm.algorithmId;
    const algorithmObject = this.getAlgorithmByOID(algorithmId, true);
    parameters.algorithm = this.getAlgorithmParameters(algorithmObject.name, "importKey");
    if ("hash" in parameters.algorithm.algorithm)
      parameters.algorithm.algorithm.hash.name = shaAlgorithm;
    if (algorithmObject.name === "ECDSA") {
      const publicKeyAlgorithm = publicKeyInfo.algorithm;
      if (!publicKeyAlgorithm.algorithmParams) {
        throw new Error("Algorithm parameters for ECDSA public key are missed");
      }
      const publicKeyAlgorithmParams = publicKeyAlgorithm.algorithmParams;
      if ("idBlock" in publicKeyAlgorithm.algorithmParams) {
        if (!(publicKeyAlgorithmParams.idBlock.tagClass === 1 && publicKeyAlgorithmParams.idBlock.tagNumber === 6)) {
          throw new Error("Incorrect type for ECDSA public key parameters");
        }
      }
      const curveObject = this.getAlgorithmByOID(publicKeyAlgorithmParams.valueBlock.toString(), true);
      parameters.algorithm.algorithm.namedCurve = curveObject.name;
    }
    return parameters;
  }
  async getPublicKey(publicKeyInfo, signatureAlgorithm, parameters) {
    if (!parameters) {
      parameters = this.fillPublicKeyParameters(publicKeyInfo, signatureAlgorithm);
    }
    const publicKeyInfoBuffer = publicKeyInfo.toSchema().toBER(false);
    return this.importKey("spki", publicKeyInfoBuffer, parameters.algorithm.algorithm, true, parameters.algorithm.usages);
  }
  async verifyWithPublicKey(data, signature, publicKeyInfo, signatureAlgorithm, shaAlgorithm) {
    let publicKey;
    if (!shaAlgorithm) {
      shaAlgorithm = this.getHashAlgorithm(signatureAlgorithm);
      if (!shaAlgorithm)
        throw new Error("Unsupported signature algorithm: ".concat(signatureAlgorithm.algorithmId));
      publicKey = await this.getPublicKey(publicKeyInfo, signatureAlgorithm);
    } else {
      const parameters = {};
      let algorithmId;
      if (signatureAlgorithm.algorithmId === "1.2.840.113549.1.1.10")
        algorithmId = signatureAlgorithm.algorithmId;
      else
        algorithmId = publicKeyInfo.algorithm.algorithmId;
      const algorithmObject = this.getAlgorithmByOID(algorithmId, true);
      parameters.algorithm = this.getAlgorithmParameters(algorithmObject.name, "importKey");
      if ("hash" in parameters.algorithm.algorithm)
        parameters.algorithm.algorithm.hash.name = shaAlgorithm;
      if (algorithmObject.name === "ECDSA") {
        let algorithmParamsChecked = false;
        if ("algorithmParams" in publicKeyInfo.algorithm === true) {
          if ("idBlock" in publicKeyInfo.algorithm.algorithmParams) {
            if (publicKeyInfo.algorithm.algorithmParams.idBlock.tagClass === 1 && publicKeyInfo.algorithm.algorithmParams.idBlock.tagNumber === 6)
              algorithmParamsChecked = true;
          }
        }
        if (algorithmParamsChecked === false) {
          throw new Error("Incorrect type for ECDSA public key parameters");
        }
        const curveObject = this.getAlgorithmByOID(publicKeyInfo.algorithm.algorithmParams.valueBlock.toString(), true);
        parameters.algorithm.algorithm.namedCurve = curveObject.name;
      }
      publicKey = await this.getPublicKey(publicKeyInfo, null, parameters);
    }
    const algorithm = this.getAlgorithmParameters(publicKey.algorithm.name, "verify");
    if ("hash" in algorithm.algorithm)
      algorithm.algorithm.hash.name = shaAlgorithm;
    let signatureValue = signature.valueBlock.valueHexView;
    if (publicKey.algorithm.name === "ECDSA") {
      const namedCurve = ECNamedCurves.find(publicKey.algorithm.namedCurve);
      if (!namedCurve) {
        throw new Error("Unsupported named curve in use");
      }
      const asn1 = fromBER(signatureValue);
      AsnError.assert(asn1, "Signature value");
      signatureValue = createECDSASignatureFromCMS(asn1.result, namedCurve.size);
    }
    if (publicKey.algorithm.name === "RSA-PSS") {
      const pssParameters = new RSASSAPSSParams({ schema: signatureAlgorithm.algorithmParams });
      if ("saltLength" in pssParameters)
        algorithm.algorithm.saltLength = pssParameters.saltLength;
      else
        algorithm.algorithm.saltLength = 20;
      let hashAlgo = "SHA-1";
      if ("hashAlgorithm" in pssParameters) {
        const hashAlgorithm = this.getAlgorithmByOID(pssParameters.hashAlgorithm.algorithmId, true);
        hashAlgo = hashAlgorithm.name;
      }
      algorithm.algorithm.hash.name = hashAlgo;
    }
    return this.verify(algorithm.algorithm, publicKey, signatureValue, data);
  }
}
let engine = {
  name: "none",
  crypto: null
};
function isCryptoEngine(engine2) {
  return engine2 && typeof engine2 === "object" && "crypto" in engine2 ? true : false;
}
function setEngine(name, ...args) {
  let crypto2 = null;
  if (args.length < 2) {
    if (args.length) {
      crypto2 = args[0];
    } else {
      crypto2 = typeof self !== "undefined" && self.crypto ? new CryptoEngine({ name: "browser", crypto: self.crypto }) : null;
    }
  } else {
    const cryptoArg = args[0];
    const subtleArg = args[1];
    if (isCryptoEngine(subtleArg)) {
      crypto2 = subtleArg;
    } else if (isCryptoEngine(cryptoArg)) {
      crypto2 = cryptoArg;
    } else if ("subtle" in cryptoArg && "getRandomValues" in cryptoArg) {
      crypto2 = new CryptoEngine({
        crypto: cryptoArg
      });
    }
  }
  if (typeof process$1 !== "undefined" && "pid" in process$1 && typeof global !== "undefined" && typeof window === "undefined") {
    if (typeof global[process$1.pid] === "undefined") {
      global[process$1.pid] = {};
    } else {
      if (typeof global[process$1.pid] !== "object") {
        throw new Error("Name global.".concat(process$1.pid, " already exists and it is not an object"));
      }
    }
    if (typeof global[process$1.pid].pkijs === "undefined") {
      global[process$1.pid].pkijs = {};
    } else {
      if (typeof global[process$1.pid].pkijs !== "object") {
        throw new Error("Name global.".concat(process$1.pid, ".pkijs already exists and it is not an object"));
      }
    }
    global[process$1.pid].pkijs.engine = {
      name,
      crypto: crypto2
    };
  } else {
    engine = {
      name,
      crypto: crypto2
    };
  }
}
function getEngine() {
  if (typeof process$1 !== "undefined" && "pid" in process$1 && typeof global !== "undefined" && typeof window === "undefined") {
    let _engine;
    try {
      _engine = global[process$1.pid].pkijs.engine;
    } catch (ex) {
      throw new Error("Please call 'setEngine' before call to 'getEngine'");
    }
    return _engine;
  }
  return engine;
}
function getCrypto(safety = false) {
  const _engine = getEngine();
  if (!_engine.crypto && safety) {
    throw new Error("Unable to create WebCrypto object");
  }
  return _engine.crypto;
}
function createCMSECDSASignature(signatureBuffer) {
  if (signatureBuffer.byteLength % 2 !== 0)
    return EMPTY_BUFFER;
  const length = signatureBuffer.byteLength / 2;
  const rBuffer = new ArrayBuffer(length);
  const rView = new Uint8Array(rBuffer);
  rView.set(new Uint8Array(signatureBuffer, 0, length));
  const rInteger = new Integer({ valueHex: rBuffer });
  const sBuffer = new ArrayBuffer(length);
  const sView = new Uint8Array(sBuffer);
  sView.set(new Uint8Array(signatureBuffer, length, length));
  const sInteger = new Integer({ valueHex: sBuffer });
  return new Sequence({
    value: [
      rInteger.convertToDER(),
      sInteger.convertToDER()
    ]
  }).toBER(false);
}
function createECDSASignatureFromCMS(cmsSignature, pointSize) {
  if (!(cmsSignature instanceof Sequence && cmsSignature.valueBlock.value.length === 2 && cmsSignature.valueBlock.value[0] instanceof Integer && cmsSignature.valueBlock.value[1] instanceof Integer))
    return EMPTY_BUFFER;
  const rValueView = cmsSignature.valueBlock.value[0].convertFromDER().valueBlock.valueHexView;
  const sValueView = cmsSignature.valueBlock.value[1].convertFromDER().valueBlock.valueHexView;
  const res = new Uint8Array(pointSize * 2);
  res.set(rValueView, pointSize - rValueView.byteLength);
  res.set(sValueView, 2 * pointSize - sValueView.byteLength);
  return res.buffer;
}
async function kdfWithCounter(hashFunction, zBuffer, Counter, SharedInfo, crypto2) {
  switch (hashFunction.toUpperCase()) {
    case "SHA-1":
    case "SHA-256":
    case "SHA-384":
    case "SHA-512":
      break;
    default:
      throw new ArgumentError("Unknown hash function: ".concat(hashFunction));
  }
  ArgumentError.assert(zBuffer, "zBuffer", "ArrayBuffer");
  if (zBuffer.byteLength === 0)
    throw new ArgumentError("'zBuffer' has zero length, error");
  ArgumentError.assert(SharedInfo, "SharedInfo", "ArrayBuffer");
  if (Counter > 255)
    throw new ArgumentError("Please set 'Counter' argument to value less or equal to 255");
  const counterBuffer = new ArrayBuffer(4);
  const counterView = new Uint8Array(counterBuffer);
  counterView[0] = 0;
  counterView[1] = 0;
  counterView[2] = 0;
  counterView[3] = Counter;
  let combinedBuffer = EMPTY_BUFFER;
  combinedBuffer = utilConcatBuf(combinedBuffer, zBuffer);
  combinedBuffer = utilConcatBuf(combinedBuffer, counterBuffer);
  combinedBuffer = utilConcatBuf(combinedBuffer, SharedInfo);
  const result = await crypto2.digest({ name: hashFunction }, combinedBuffer);
  return {
    counter: Counter,
    result
  };
}
async function kdf(hashFunction, Zbuffer, keydatalen, SharedInfo, crypto2 = getCrypto(true)) {
  let hashLength = 0;
  let maxCounter = 1;
  switch (hashFunction.toUpperCase()) {
    case "SHA-1":
      hashLength = 160;
      break;
    case "SHA-256":
      hashLength = 256;
      break;
    case "SHA-384":
      hashLength = 384;
      break;
    case "SHA-512":
      hashLength = 512;
      break;
    default:
      throw new ArgumentError("Unknown hash function: ".concat(hashFunction));
  }
  ArgumentError.assert(Zbuffer, "Zbuffer", "ArrayBuffer");
  if (Zbuffer.byteLength === 0)
    throw new ArgumentError("'Zbuffer' has zero length, error");
  ArgumentError.assert(SharedInfo, "SharedInfo", "ArrayBuffer");
  const quotient = keydatalen / hashLength;
  if (Math.floor(quotient) > 0) {
    maxCounter = Math.floor(quotient);
    if (quotient - maxCounter > 0)
      maxCounter++;
  }
  const incomingResult = [];
  for (let i2 = 1; i2 <= maxCounter; i2++)
    incomingResult.push(await kdfWithCounter(hashFunction, Zbuffer, i2, SharedInfo, crypto2));
  let combinedBuffer = EMPTY_BUFFER;
  let currentCounter = 1;
  let found = true;
  while (found) {
    found = false;
    for (const result of incomingResult) {
      if (result.counter === currentCounter) {
        combinedBuffer = utilConcatBuf(combinedBuffer, result.result);
        found = true;
        break;
      }
    }
    currentCounter++;
  }
  keydatalen >>= 3;
  if (combinedBuffer.byteLength > keydatalen) {
    const newBuffer = new ArrayBuffer(keydatalen);
    const newView = new Uint8Array(newBuffer);
    const combinedView = new Uint8Array(combinedBuffer);
    for (let i2 = 0; i2 < keydatalen; i2++)
      newView[i2] = combinedView[i2];
    return newBuffer;
  }
  return combinedBuffer;
}
const VERSION$i = "version";
const LOG_ID = "logID";
const EXTENSIONS$6 = "extensions";
const TIMESTAMP = "timestamp";
const HASH_ALGORITHM$3 = "hashAlgorithm";
const SIGNATURE_ALGORITHM$8 = "signatureAlgorithm";
const SIGNATURE$7 = "signature";
const NONE = "none";
const MD5 = "md5";
const SHA12 = "sha1";
const SHA224 = "sha224";
const SHA2562 = "sha256";
const SHA3842 = "sha384";
const SHA5122 = "sha512";
const ANONYMOUS = "anonymous";
const RSA = "rsa";
const DSA = "dsa";
const ECDSA = "ecdsa";
class SignedCertificateTimestamp extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$i, SignedCertificateTimestamp.defaultValues(VERSION$i));
    this.logID = getParametersValue(parameters, LOG_ID, SignedCertificateTimestamp.defaultValues(LOG_ID));
    this.timestamp = getParametersValue(parameters, TIMESTAMP, SignedCertificateTimestamp.defaultValues(TIMESTAMP));
    this.extensions = getParametersValue(parameters, EXTENSIONS$6, SignedCertificateTimestamp.defaultValues(EXTENSIONS$6));
    this.hashAlgorithm = getParametersValue(parameters, HASH_ALGORITHM$3, SignedCertificateTimestamp.defaultValues(HASH_ALGORITHM$3));
    this.signatureAlgorithm = getParametersValue(parameters, SIGNATURE_ALGORITHM$8, SignedCertificateTimestamp.defaultValues(SIGNATURE_ALGORITHM$8));
    this.signature = getParametersValue(parameters, SIGNATURE$7, SignedCertificateTimestamp.defaultValues(SIGNATURE$7));
    if ("stream" in parameters && parameters.stream) {
      this.fromStream(parameters.stream);
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$i:
        return 0;
      case LOG_ID:
      case EXTENSIONS$6:
        return EMPTY_BUFFER;
      case TIMESTAMP:
        return /* @__PURE__ */ new Date(0);
      case HASH_ALGORITHM$3:
      case SIGNATURE_ALGORITHM$8:
        return EMPTY_STRING;
      case SIGNATURE$7:
        return new Any();
      default:
        return super.defaultValues(memberName);
    }
  }
  fromSchema(schema) {
    if (schema instanceof RawData === false)
      throw new Error("Object's schema was not verified against input data for SignedCertificateTimestamp");
    const seqStream = new SeqStream({
      stream: new ByteStream({
        buffer: schema.data
      })
    });
    this.fromStream(seqStream);
  }
  fromStream(stream) {
    const blockLength = stream.getUint16();
    this.version = stream.getBlock(1)[0];
    if (this.version === 0) {
      this.logID = new Uint8Array(stream.getBlock(32)).buffer.slice(0);
      this.timestamp = new Date(utilFromBase(new Uint8Array(stream.getBlock(8)), 8));
      const extensionsLength = stream.getUint16();
      this.extensions = new Uint8Array(stream.getBlock(extensionsLength)).buffer.slice(0);
      switch (stream.getBlock(1)[0]) {
        case 0:
          this.hashAlgorithm = NONE;
          break;
        case 1:
          this.hashAlgorithm = MD5;
          break;
        case 2:
          this.hashAlgorithm = SHA12;
          break;
        case 3:
          this.hashAlgorithm = SHA224;
          break;
        case 4:
          this.hashAlgorithm = SHA2562;
          break;
        case 5:
          this.hashAlgorithm = SHA3842;
          break;
        case 6:
          this.hashAlgorithm = SHA5122;
          break;
        default:
          throw new Error("Object's stream was not correct for SignedCertificateTimestamp");
      }
      switch (stream.getBlock(1)[0]) {
        case 0:
          this.signatureAlgorithm = ANONYMOUS;
          break;
        case 1:
          this.signatureAlgorithm = RSA;
          break;
        case 2:
          this.signatureAlgorithm = DSA;
          break;
        case 3:
          this.signatureAlgorithm = ECDSA;
          break;
        default:
          throw new Error("Object's stream was not correct for SignedCertificateTimestamp");
      }
      const signatureLength = stream.getUint16();
      const signatureData = new Uint8Array(stream.getBlock(signatureLength)).buffer.slice(0);
      const asn1 = fromBER(signatureData);
      AsnError.assert(asn1, "SignedCertificateTimestamp");
      this.signature = asn1.result;
      if (blockLength !== 47 + extensionsLength + signatureLength) {
        throw new Error("Object's stream was not correct for SignedCertificateTimestamp");
      }
    }
  }
  toSchema() {
    const stream = this.toStream();
    return new RawData({ data: stream.stream.buffer });
  }
  toStream() {
    const stream = new SeqStream();
    stream.appendUint16(47 + this.extensions.byteLength + this.signature.valueBeforeDecodeView.byteLength);
    stream.appendChar(this.version);
    stream.appendView(new Uint8Array(this.logID));
    const timeBuffer = new ArrayBuffer(8);
    const timeView = new Uint8Array(timeBuffer);
    const baseArray = utilToBase(this.timestamp.valueOf(), 8);
    timeView.set(new Uint8Array(baseArray), 8 - baseArray.byteLength);
    stream.appendView(timeView);
    stream.appendUint16(this.extensions.byteLength);
    if (this.extensions.byteLength)
      stream.appendView(new Uint8Array(this.extensions));
    let _hashAlgorithm;
    switch (this.hashAlgorithm.toLowerCase()) {
      case NONE:
        _hashAlgorithm = 0;
        break;
      case MD5:
        _hashAlgorithm = 1;
        break;
      case SHA12:
        _hashAlgorithm = 2;
        break;
      case SHA224:
        _hashAlgorithm = 3;
        break;
      case SHA2562:
        _hashAlgorithm = 4;
        break;
      case SHA3842:
        _hashAlgorithm = 5;
        break;
      case SHA5122:
        _hashAlgorithm = 6;
        break;
      default:
        throw new Error("Incorrect data for hashAlgorithm: ".concat(this.hashAlgorithm));
    }
    stream.appendChar(_hashAlgorithm);
    let _signatureAlgorithm;
    switch (this.signatureAlgorithm.toLowerCase()) {
      case ANONYMOUS:
        _signatureAlgorithm = 0;
        break;
      case RSA:
        _signatureAlgorithm = 1;
        break;
      case DSA:
        _signatureAlgorithm = 2;
        break;
      case ECDSA:
        _signatureAlgorithm = 3;
        break;
      default:
        throw new Error("Incorrect data for signatureAlgorithm: ".concat(this.signatureAlgorithm));
    }
    stream.appendChar(_signatureAlgorithm);
    const _signature = this.signature.toBER(false);
    stream.appendUint16(_signature.byteLength);
    stream.appendView(new Uint8Array(_signature));
    return stream;
  }
  toJSON() {
    return {
      version: this.version,
      logID: bufferToHexCodes(this.logID),
      timestamp: this.timestamp,
      extensions: bufferToHexCodes(this.extensions),
      hashAlgorithm: this.hashAlgorithm,
      signatureAlgorithm: this.signatureAlgorithm,
      signature: this.signature.toJSON()
    };
  }
  async verify(logs, data, dataType = 0, crypto2 = getCrypto(true)) {
    const logId = toBase64(arrayBufferToString(this.logID));
    let publicKeyBase64 = null;
    const stream = new SeqStream();
    for (const log of logs) {
      if (log.log_id === logId) {
        publicKeyBase64 = log.key;
        break;
      }
    }
    if (!publicKeyBase64) {
      throw new Error("Public key not found for CT with logId: ".concat(logId));
    }
    const pki = stringToArrayBuffer(fromBase64(publicKeyBase64));
    const publicKeyInfo = PublicKeyInfo.fromBER(pki);
    stream.appendChar(0);
    stream.appendChar(0);
    const timeBuffer = new ArrayBuffer(8);
    const timeView = new Uint8Array(timeBuffer);
    const baseArray = utilToBase(this.timestamp.valueOf(), 8);
    timeView.set(new Uint8Array(baseArray), 8 - baseArray.byteLength);
    stream.appendView(timeView);
    stream.appendUint16(dataType);
    if (dataType === 0)
      stream.appendUint24(data.byteLength);
    stream.appendView(new Uint8Array(data));
    stream.appendUint16(this.extensions.byteLength);
    if (this.extensions.byteLength !== 0)
      stream.appendView(new Uint8Array(this.extensions));
    return crypto2.verifyWithPublicKey(stream.buffer.slice(0, stream.length), new OctetString$1({ valueHex: this.signature.toBER(false) }), publicKeyInfo, { algorithmId: EMPTY_STRING }, "SHA-256");
  }
}
SignedCertificateTimestamp.CLASS_NAME = "SignedCertificateTimestamp";
const TIMESTAMPS = "timestamps";
class SignedCertificateTimestampList extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.timestamps = getParametersValue(parameters, TIMESTAMPS, SignedCertificateTimestampList.defaultValues(TIMESTAMPS));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TIMESTAMPS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case TIMESTAMPS:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    var _a3;
    const names = getParametersValue(parameters, "names", {});
    (_a3 = names.optional) !== null && _a3 !== void 0 ? _a3 : names.optional = false;
    return new OctetString$1({
      name: names.blockName || "SignedCertificateTimestampList",
      optional: names.optional
    });
  }
  fromSchema(schema) {
    if (schema instanceof OctetString$1 === false) {
      throw new Error("Object's schema was not verified against input data for SignedCertificateTimestampList");
    }
    const seqStream = new SeqStream({
      stream: new ByteStream({
        buffer: schema.valueBlock.valueHex
      })
    });
    const dataLength = seqStream.getUint16();
    if (dataLength !== seqStream.length) {
      throw new Error("Object's schema was not verified against input data for SignedCertificateTimestampList");
    }
    while (seqStream.length) {
      this.timestamps.push(new SignedCertificateTimestamp({ stream: seqStream }));
    }
  }
  toSchema() {
    const stream = new SeqStream();
    let overallLength = 0;
    const timestampsData = [];
    for (const timestamp of this.timestamps) {
      const timestampStream = timestamp.toStream();
      timestampsData.push(timestampStream);
      overallLength += timestampStream.stream.buffer.byteLength;
    }
    stream.appendUint16(overallLength);
    for (const timestamp of timestampsData) {
      stream.appendView(timestamp.stream.view);
    }
    return new OctetString$1({ valueHex: stream.stream.buffer.slice(0) });
  }
  toJSON() {
    return {
      timestamps: Array.from(this.timestamps, (o2) => o2.toJSON())
    };
  }
}
SignedCertificateTimestampList.CLASS_NAME = "SignedCertificateTimestampList";
const ATTRIBUTES$4 = "attributes";
const CLEAR_PROPS$11 = [
  ATTRIBUTES$4
];
class SubjectDirectoryAttributes extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.attributes = getParametersValue(parameters, ATTRIBUTES$4, SubjectDirectoryAttributes.defaultValues(ATTRIBUTES$4));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ATTRIBUTES$4:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.attributes || EMPTY_STRING,
          value: Attribute.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$11);
    const asn1 = compareSchema(schema, schema, SubjectDirectoryAttributes.schema({
      names: {
        attributes: ATTRIBUTES$4
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.attributes = Array.from(asn1.result.attributes, (element) => new Attribute({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.attributes, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      attributes: Array.from(this.attributes, (o2) => o2.toJSON())
    };
  }
}
SubjectDirectoryAttributes.CLASS_NAME = "SubjectDirectoryAttributes";
class ExtensionValueFactory {
  static getItems() {
    if (!this.types) {
      this.types = {};
      ExtensionValueFactory.register(id_SubjectAltName, "SubjectAltName", AltName);
      ExtensionValueFactory.register(id_IssuerAltName, "IssuerAltName", AltName);
      ExtensionValueFactory.register(id_AuthorityKeyIdentifier, "AuthorityKeyIdentifier", AuthorityKeyIdentifier);
      ExtensionValueFactory.register(id_BasicConstraints, "BasicConstraints", BasicConstraints);
      ExtensionValueFactory.register(id_MicrosoftCaVersion, "MicrosoftCaVersion", CAVersion);
      ExtensionValueFactory.register(id_CertificatePolicies, "CertificatePolicies", CertificatePolicies);
      ExtensionValueFactory.register(id_MicrosoftAppPolicies, "CertificatePoliciesMicrosoft", CertificatePolicies);
      ExtensionValueFactory.register(id_MicrosoftCertTemplateV2, "MicrosoftCertTemplateV2", CertificateTemplate);
      ExtensionValueFactory.register(id_CRLDistributionPoints, "CRLDistributionPoints", CRLDistributionPoints);
      ExtensionValueFactory.register(id_FreshestCRL, "FreshestCRL", CRLDistributionPoints);
      ExtensionValueFactory.register(id_ExtKeyUsage, "ExtKeyUsage", ExtKeyUsage);
      ExtensionValueFactory.register(id_CertificateIssuer, "CertificateIssuer", GeneralNames);
      ExtensionValueFactory.register(id_AuthorityInfoAccess, "AuthorityInfoAccess", InfoAccess);
      ExtensionValueFactory.register(id_SubjectInfoAccess, "SubjectInfoAccess", InfoAccess);
      ExtensionValueFactory.register(id_IssuingDistributionPoint, "IssuingDistributionPoint", IssuingDistributionPoint);
      ExtensionValueFactory.register(id_NameConstraints, "NameConstraints", NameConstraints);
      ExtensionValueFactory.register(id_PolicyConstraints, "PolicyConstraints", PolicyConstraints);
      ExtensionValueFactory.register(id_PolicyMappings, "PolicyMappings", PolicyMappings);
      ExtensionValueFactory.register(id_PrivateKeyUsagePeriod, "PrivateKeyUsagePeriod", PrivateKeyUsagePeriod);
      ExtensionValueFactory.register(id_QCStatements, "QCStatements", QCStatements);
      ExtensionValueFactory.register(id_SignedCertificateTimestampList, "SignedCertificateTimestampList", SignedCertificateTimestampList);
      ExtensionValueFactory.register(id_SubjectDirectoryAttributes, "SubjectDirectoryAttributes", SubjectDirectoryAttributes);
    }
    return this.types;
  }
  static fromBER(id, raw) {
    const asn1 = fromBER(raw);
    if (asn1.offset === -1) {
      return null;
    }
    const item = this.find(id);
    if (item) {
      try {
        return new item.type({ schema: asn1.result });
      } catch (ex) {
        const res = new item.type();
        res.parsingError = "Incorrectly formatted value of extension ".concat(item.name, " (").concat(id, ")");
        return res;
      }
    }
    return asn1.result;
  }
  static find(id) {
    const types = this.getItems();
    return types[id] || null;
  }
  static register(id, name, type) {
    this.getItems()[id] = { name, type };
  }
}
const EXTN_ID = "extnID";
const CRITICAL = "critical";
const EXTN_VALUE = "extnValue";
const PARSED_VALUE$5 = "parsedValue";
const CLEAR_PROPS$10 = [
  EXTN_ID,
  CRITICAL,
  EXTN_VALUE
];
class Extension extends PkiObject {
  get parsedValue() {
    if (this._parsedValue === void 0) {
      const parsedValue = ExtensionValueFactory.fromBER(this.extnID, this.extnValue.valueBlock.valueHexView);
      this._parsedValue = parsedValue;
    }
    return this._parsedValue || void 0;
  }
  set parsedValue(value) {
    this._parsedValue = value;
  }
  constructor(parameters = {}) {
    super();
    this.extnID = getParametersValue(parameters, EXTN_ID, Extension.defaultValues(EXTN_ID));
    this.critical = getParametersValue(parameters, CRITICAL, Extension.defaultValues(CRITICAL));
    if (EXTN_VALUE in parameters) {
      this.extnValue = new OctetString$1({ valueHex: parameters.extnValue });
    } else {
      this.extnValue = Extension.defaultValues(EXTN_VALUE);
    }
    if (PARSED_VALUE$5 in parameters) {
      this.parsedValue = getParametersValue(parameters, PARSED_VALUE$5, Extension.defaultValues(PARSED_VALUE$5));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case EXTN_ID:
        return EMPTY_STRING;
      case CRITICAL:
        return false;
      case EXTN_VALUE:
        return new OctetString$1();
      case PARSED_VALUE$5:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.extnID || EMPTY_STRING }),
        new Boolean$1({
          name: names.critical || EMPTY_STRING,
          optional: true
        }),
        new OctetString$1({ name: names.extnValue || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$10);
    const asn1 = compareSchema(schema, schema, Extension.schema({
      names: {
        extnID: EXTN_ID,
        critical: CRITICAL,
        extnValue: EXTN_VALUE
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.extnID = asn1.result.extnID.valueBlock.toString();
    if (CRITICAL in asn1.result) {
      this.critical = asn1.result.critical.valueBlock.value;
    }
    this.extnValue = asn1.result.extnValue;
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new ObjectIdentifier({ value: this.extnID }));
    if (this.critical !== Extension.defaultValues(CRITICAL)) {
      outputArray.push(new Boolean$1({ value: this.critical }));
    }
    outputArray.push(this.extnValue);
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const object = {
      extnID: this.extnID,
      extnValue: this.extnValue.toJSON()
    };
    if (this.critical !== Extension.defaultValues(CRITICAL)) {
      object.critical = this.critical;
    }
    if (this.parsedValue && this.parsedValue.toJSON) {
      object.parsedValue = this.parsedValue.toJSON();
    }
    return object;
  }
}
Extension.CLASS_NAME = "Extension";
const EXTENSIONS$5 = "extensions";
const CLEAR_PROPS$$ = [
  EXTENSIONS$5
];
class Extensions extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.extensions = getParametersValue(parameters, EXTENSIONS$5, Extensions.defaultValues(EXTENSIONS$5));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case EXTENSIONS$5:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}, optional = false) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      optional,
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.extensions || EMPTY_STRING,
          value: Extension.schema(names.extension || {})
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$$);
    const asn1 = compareSchema(schema, schema, Extensions.schema({
      names: {
        extensions: EXTENSIONS$5
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.extensions = Array.from(asn1.result.extensions, (element) => new Extension({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.extensions, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      extensions: this.extensions.map((o2) => o2.toJSON())
    };
  }
}
Extensions.CLASS_NAME = "Extensions";
const ISSUER$5 = "issuer";
const SERIAL_NUMBER$6 = "serialNumber";
const ISSUER_UID = "issuerUID";
const CLEAR_PROPS$_ = [
  ISSUER$5,
  SERIAL_NUMBER$6,
  ISSUER_UID
];
class IssuerSerial extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.issuer = getParametersValue(parameters, ISSUER$5, IssuerSerial.defaultValues(ISSUER$5));
    this.serialNumber = getParametersValue(parameters, SERIAL_NUMBER$6, IssuerSerial.defaultValues(SERIAL_NUMBER$6));
    if (ISSUER_UID in parameters) {
      this.issuerUID = getParametersValue(parameters, ISSUER_UID, IssuerSerial.defaultValues(ISSUER_UID));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ISSUER$5:
        return new GeneralNames();
      case SERIAL_NUMBER$6:
        return new Integer();
      case ISSUER_UID:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        GeneralNames.schema(names.issuer || {}),
        new Integer({ name: names.serialNumber || EMPTY_STRING }),
        new BitString$1({
          optional: true,
          name: names.issuerUID || EMPTY_STRING
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$_);
    const asn1 = compareSchema(schema, schema, IssuerSerial.schema({
      names: {
        issuer: {
          names: {
            blockName: ISSUER$5
          }
        },
        serialNumber: SERIAL_NUMBER$6,
        issuerUID: ISSUER_UID
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.issuer = new GeneralNames({ schema: asn1.result.issuer });
    this.serialNumber = asn1.result.serialNumber;
    if (ISSUER_UID in asn1.result)
      this.issuerUID = asn1.result.issuerUID;
  }
  toSchema() {
    const result = new Sequence({
      value: [
        this.issuer.toSchema(),
        this.serialNumber
      ]
    });
    if (this.issuerUID) {
      result.valueBlock.value.push(this.issuerUID);
    }
    return result;
  }
  toJSON() {
    const result = {
      issuer: this.issuer.toJSON(),
      serialNumber: this.serialNumber.toJSON()
    };
    if (this.issuerUID) {
      result.issuerUID = this.issuerUID.toJSON();
    }
    return result;
  }
}
IssuerSerial.CLASS_NAME = "IssuerSerial";
const VERSION$h = "version";
const BASE_CERTIFICATE_ID$2 = "baseCertificateID";
const SUBJECT_NAME = "subjectName";
const ISSUER$4 = "issuer";
const SIGNATURE$6 = "signature";
const SERIAL_NUMBER$5 = "serialNumber";
const ATTR_CERT_VALIDITY_PERIOD$1 = "attrCertValidityPeriod";
const ATTRIBUTES$3 = "attributes";
const ISSUER_UNIQUE_ID$2 = "issuerUniqueID";
const EXTENSIONS$4 = "extensions";
const CLEAR_PROPS$Z = [
  VERSION$h,
  BASE_CERTIFICATE_ID$2,
  SUBJECT_NAME,
  ISSUER$4,
  SIGNATURE$6,
  SERIAL_NUMBER$5,
  ATTR_CERT_VALIDITY_PERIOD$1,
  ATTRIBUTES$3,
  ISSUER_UNIQUE_ID$2,
  EXTENSIONS$4
];
class AttributeCertificateInfoV1 extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$h, AttributeCertificateInfoV1.defaultValues(VERSION$h));
    if (BASE_CERTIFICATE_ID$2 in parameters) {
      this.baseCertificateID = getParametersValue(parameters, BASE_CERTIFICATE_ID$2, AttributeCertificateInfoV1.defaultValues(BASE_CERTIFICATE_ID$2));
    }
    if (SUBJECT_NAME in parameters) {
      this.subjectName = getParametersValue(parameters, SUBJECT_NAME, AttributeCertificateInfoV1.defaultValues(SUBJECT_NAME));
    }
    this.issuer = getParametersValue(parameters, ISSUER$4, AttributeCertificateInfoV1.defaultValues(ISSUER$4));
    this.signature = getParametersValue(parameters, SIGNATURE$6, AttributeCertificateInfoV1.defaultValues(SIGNATURE$6));
    this.serialNumber = getParametersValue(parameters, SERIAL_NUMBER$5, AttributeCertificateInfoV1.defaultValues(SERIAL_NUMBER$5));
    this.attrCertValidityPeriod = getParametersValue(parameters, ATTR_CERT_VALIDITY_PERIOD$1, AttributeCertificateInfoV1.defaultValues(ATTR_CERT_VALIDITY_PERIOD$1));
    this.attributes = getParametersValue(parameters, ATTRIBUTES$3, AttributeCertificateInfoV1.defaultValues(ATTRIBUTES$3));
    if (ISSUER_UNIQUE_ID$2 in parameters)
      this.issuerUniqueID = getParametersValue(parameters, ISSUER_UNIQUE_ID$2, AttributeCertificateInfoV1.defaultValues(ISSUER_UNIQUE_ID$2));
    if (EXTENSIONS$4 in parameters) {
      this.extensions = getParametersValue(parameters, EXTENSIONS$4, AttributeCertificateInfoV1.defaultValues(EXTENSIONS$4));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$h:
        return 0;
      case BASE_CERTIFICATE_ID$2:
        return new IssuerSerial();
      case SUBJECT_NAME:
        return new GeneralNames();
      case ISSUER$4:
        return new GeneralNames();
      case SIGNATURE$6:
        return new AlgorithmIdentifier();
      case SERIAL_NUMBER$5:
        return new Integer();
      case ATTR_CERT_VALIDITY_PERIOD$1:
        return new AttCertValidityPeriod();
      case ATTRIBUTES$3:
        return [];
      case ISSUER_UNIQUE_ID$2:
        return new BitString$1();
      case EXTENSIONS$4:
        return new Extensions();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        new Choice({
          value: [
            new Constructed({
              name: names.baseCertificateID || EMPTY_STRING,
              idBlock: {
                tagClass: 3,
                tagNumber: 0
              },
              value: IssuerSerial.schema().valueBlock.value
            }),
            new Constructed({
              name: names.subjectName || EMPTY_STRING,
              idBlock: {
                tagClass: 3,
                tagNumber: 1
              },
              value: GeneralNames.schema().valueBlock.value
            })
          ]
        }),
        GeneralNames.schema({
          names: {
            blockName: names.issuer || EMPTY_STRING
          }
        }),
        AlgorithmIdentifier.schema(names.signature || {}),
        new Integer({ name: names.serialNumber || EMPTY_STRING }),
        AttCertValidityPeriod.schema(names.attrCertValidityPeriod || {}),
        new Sequence({
          name: names.attributes || EMPTY_STRING,
          value: [
            new Repeated({
              value: Attribute.schema()
            })
          ]
        }),
        new BitString$1({
          optional: true,
          name: names.issuerUniqueID || EMPTY_STRING
        }),
        Extensions.schema(names.extensions || {}, true)
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$Z);
    const asn1 = compareSchema(schema, schema, AttributeCertificateInfoV1.schema({
      names: {
        version: VERSION$h,
        baseCertificateID: BASE_CERTIFICATE_ID$2,
        subjectName: SUBJECT_NAME,
        issuer: ISSUER$4,
        signature: {
          names: {
            blockName: SIGNATURE$6
          }
        },
        serialNumber: SERIAL_NUMBER$5,
        attrCertValidityPeriod: {
          names: {
            blockName: ATTR_CERT_VALIDITY_PERIOD$1
          }
        },
        attributes: ATTRIBUTES$3,
        issuerUniqueID: ISSUER_UNIQUE_ID$2,
        extensions: {
          names: {
            blockName: EXTENSIONS$4
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    if (BASE_CERTIFICATE_ID$2 in asn1.result) {
      this.baseCertificateID = new IssuerSerial({
        schema: new Sequence({
          value: asn1.result.baseCertificateID.valueBlock.value
        })
      });
    }
    if (SUBJECT_NAME in asn1.result) {
      this.subjectName = new GeneralNames({
        schema: new Sequence({
          value: asn1.result.subjectName.valueBlock.value
        })
      });
    }
    this.issuer = asn1.result.issuer;
    this.signature = new AlgorithmIdentifier({ schema: asn1.result.signature });
    this.serialNumber = asn1.result.serialNumber;
    this.attrCertValidityPeriod = new AttCertValidityPeriod({ schema: asn1.result.attrCertValidityPeriod });
    this.attributes = Array.from(asn1.result.attributes.valueBlock.value, (element) => new Attribute({ schema: element }));
    if (ISSUER_UNIQUE_ID$2 in asn1.result) {
      this.issuerUniqueID = asn1.result.issuerUniqueID;
    }
    if (EXTENSIONS$4 in asn1.result) {
      this.extensions = new Extensions({ schema: asn1.result.extensions });
    }
  }
  toSchema() {
    const result = new Sequence({
      value: [new Integer({ value: this.version })]
    });
    if (this.baseCertificateID) {
      result.valueBlock.value.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: this.baseCertificateID.toSchema().valueBlock.value
      }));
    }
    if (this.subjectName) {
      result.valueBlock.value.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: this.subjectName.toSchema().valueBlock.value
      }));
    }
    result.valueBlock.value.push(this.issuer.toSchema());
    result.valueBlock.value.push(this.signature.toSchema());
    result.valueBlock.value.push(this.serialNumber);
    result.valueBlock.value.push(this.attrCertValidityPeriod.toSchema());
    result.valueBlock.value.push(new Sequence({
      value: Array.from(this.attributes, (o2) => o2.toSchema())
    }));
    if (this.issuerUniqueID) {
      result.valueBlock.value.push(this.issuerUniqueID);
    }
    if (this.extensions) {
      result.valueBlock.value.push(this.extensions.toSchema());
    }
    return result;
  }
  toJSON() {
    const result = {
      version: this.version
    };
    if (this.baseCertificateID) {
      result.baseCertificateID = this.baseCertificateID.toJSON();
    }
    if (this.subjectName) {
      result.subjectName = this.subjectName.toJSON();
    }
    result.issuer = this.issuer.toJSON();
    result.signature = this.signature.toJSON();
    result.serialNumber = this.serialNumber.toJSON();
    result.attrCertValidityPeriod = this.attrCertValidityPeriod.toJSON();
    result.attributes = Array.from(this.attributes, (o2) => o2.toJSON());
    if (this.issuerUniqueID) {
      result.issuerUniqueID = this.issuerUniqueID.toJSON();
    }
    if (this.extensions) {
      result.extensions = this.extensions.toJSON();
    }
    return result;
  }
}
AttributeCertificateInfoV1.CLASS_NAME = "AttributeCertificateInfoV1";
const ACINFO$1 = "acinfo";
const SIGNATURE_ALGORITHM$7 = "signatureAlgorithm";
const SIGNATURE_VALUE$4 = "signatureValue";
const CLEAR_PROPS$Y = [
  ACINFO$1,
  SIGNATURE_VALUE$4,
  SIGNATURE_ALGORITHM$7
];
class AttributeCertificateV1 extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.acinfo = getParametersValue(parameters, ACINFO$1, AttributeCertificateV1.defaultValues(ACINFO$1));
    this.signatureAlgorithm = getParametersValue(parameters, SIGNATURE_ALGORITHM$7, AttributeCertificateV1.defaultValues(SIGNATURE_ALGORITHM$7));
    this.signatureValue = getParametersValue(parameters, SIGNATURE_VALUE$4, AttributeCertificateV1.defaultValues(SIGNATURE_VALUE$4));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ACINFO$1:
        return new AttributeCertificateInfoV1();
      case SIGNATURE_ALGORITHM$7:
        return new AlgorithmIdentifier();
      case SIGNATURE_VALUE$4:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AttributeCertificateInfoV1.schema(names.acinfo || {}),
        AlgorithmIdentifier.schema(names.signatureAlgorithm || {}),
        new BitString$1({ name: names.signatureValue || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$Y);
    const asn1 = compareSchema(schema, schema, AttributeCertificateV1.schema({
      names: {
        acinfo: {
          names: {
            blockName: ACINFO$1
          }
        },
        signatureAlgorithm: {
          names: {
            blockName: SIGNATURE_ALGORITHM$7
          }
        },
        signatureValue: SIGNATURE_VALUE$4
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.acinfo = new AttributeCertificateInfoV1({ schema: asn1.result.acinfo });
    this.signatureAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.signatureAlgorithm });
    this.signatureValue = asn1.result.signatureValue;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.acinfo.toSchema(),
        this.signatureAlgorithm.toSchema(),
        this.signatureValue
      ]
    });
  }
  toJSON() {
    return {
      acinfo: this.acinfo.toJSON(),
      signatureAlgorithm: this.signatureAlgorithm.toJSON(),
      signatureValue: this.signatureValue.toJSON()
    };
  }
}
AttributeCertificateV1.CLASS_NAME = "AttributeCertificateV1";
const DIGESTED_OBJECT_TYPE = "digestedObjectType";
const OTHER_OBJECT_TYPE_ID = "otherObjectTypeID";
const DIGEST_ALGORITHM$2 = "digestAlgorithm";
const OBJECT_DIGEST = "objectDigest";
const CLEAR_PROPS$X = [
  DIGESTED_OBJECT_TYPE,
  OTHER_OBJECT_TYPE_ID,
  DIGEST_ALGORITHM$2,
  OBJECT_DIGEST
];
class ObjectDigestInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.digestedObjectType = getParametersValue(parameters, DIGESTED_OBJECT_TYPE, ObjectDigestInfo.defaultValues(DIGESTED_OBJECT_TYPE));
    if (OTHER_OBJECT_TYPE_ID in parameters) {
      this.otherObjectTypeID = getParametersValue(parameters, OTHER_OBJECT_TYPE_ID, ObjectDigestInfo.defaultValues(OTHER_OBJECT_TYPE_ID));
    }
    this.digestAlgorithm = getParametersValue(parameters, DIGEST_ALGORITHM$2, ObjectDigestInfo.defaultValues(DIGEST_ALGORITHM$2));
    this.objectDigest = getParametersValue(parameters, OBJECT_DIGEST, ObjectDigestInfo.defaultValues(OBJECT_DIGEST));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case DIGESTED_OBJECT_TYPE:
        return new Enumerated();
      case OTHER_OBJECT_TYPE_ID:
        return new ObjectIdentifier();
      case DIGEST_ALGORITHM$2:
        return new AlgorithmIdentifier();
      case OBJECT_DIGEST:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Enumerated({ name: names.digestedObjectType || EMPTY_STRING }),
        new ObjectIdentifier({
          optional: true,
          name: names.otherObjectTypeID || EMPTY_STRING
        }),
        AlgorithmIdentifier.schema(names.digestAlgorithm || {}),
        new BitString$1({ name: names.objectDigest || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$X);
    const asn1 = compareSchema(schema, schema, ObjectDigestInfo.schema({
      names: {
        digestedObjectType: DIGESTED_OBJECT_TYPE,
        otherObjectTypeID: OTHER_OBJECT_TYPE_ID,
        digestAlgorithm: {
          names: {
            blockName: DIGEST_ALGORITHM$2
          }
        },
        objectDigest: OBJECT_DIGEST
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.digestedObjectType = asn1.result.digestedObjectType;
    if (OTHER_OBJECT_TYPE_ID in asn1.result) {
      this.otherObjectTypeID = asn1.result.otherObjectTypeID;
    }
    this.digestAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.digestAlgorithm });
    this.objectDigest = asn1.result.objectDigest;
  }
  toSchema() {
    const result = new Sequence({
      value: [this.digestedObjectType]
    });
    if (this.otherObjectTypeID) {
      result.valueBlock.value.push(this.otherObjectTypeID);
    }
    result.valueBlock.value.push(this.digestAlgorithm.toSchema());
    result.valueBlock.value.push(this.objectDigest);
    return result;
  }
  toJSON() {
    const result = {
      digestedObjectType: this.digestedObjectType.toJSON(),
      digestAlgorithm: this.digestAlgorithm.toJSON(),
      objectDigest: this.objectDigest.toJSON()
    };
    if (this.otherObjectTypeID) {
      result.otherObjectTypeID = this.otherObjectTypeID.toJSON();
    }
    return result;
  }
}
ObjectDigestInfo.CLASS_NAME = "ObjectDigestInfo";
const ISSUER_NAME = "issuerName";
const BASE_CERTIFICATE_ID$1 = "baseCertificateID";
const OBJECT_DIGEST_INFO$1 = "objectDigestInfo";
const CLEAR_PROPS$W = [
  ISSUER_NAME,
  BASE_CERTIFICATE_ID$1,
  OBJECT_DIGEST_INFO$1
];
class V2Form extends PkiObject {
  constructor(parameters = {}) {
    super();
    if (ISSUER_NAME in parameters) {
      this.issuerName = getParametersValue(parameters, ISSUER_NAME, V2Form.defaultValues(ISSUER_NAME));
    }
    if (BASE_CERTIFICATE_ID$1 in parameters) {
      this.baseCertificateID = getParametersValue(parameters, BASE_CERTIFICATE_ID$1, V2Form.defaultValues(BASE_CERTIFICATE_ID$1));
    }
    if (OBJECT_DIGEST_INFO$1 in parameters) {
      this.objectDigestInfo = getParametersValue(parameters, OBJECT_DIGEST_INFO$1, V2Form.defaultValues(OBJECT_DIGEST_INFO$1));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ISSUER_NAME:
        return new GeneralNames();
      case BASE_CERTIFICATE_ID$1:
        return new IssuerSerial();
      case OBJECT_DIGEST_INFO$1:
        return new ObjectDigestInfo();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        GeneralNames.schema({
          names: {
            blockName: names.issuerName
          }
        }, true),
        new Constructed({
          optional: true,
          name: names.baseCertificateID || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: IssuerSerial.schema().valueBlock.value
        }),
        new Constructed({
          optional: true,
          name: names.objectDigestInfo || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: ObjectDigestInfo.schema().valueBlock.value
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$W);
    const asn1 = compareSchema(schema, schema, V2Form.schema({
      names: {
        issuerName: ISSUER_NAME,
        baseCertificateID: BASE_CERTIFICATE_ID$1,
        objectDigestInfo: OBJECT_DIGEST_INFO$1
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (ISSUER_NAME in asn1.result)
      this.issuerName = new GeneralNames({ schema: asn1.result.issuerName });
    if (BASE_CERTIFICATE_ID$1 in asn1.result) {
      this.baseCertificateID = new IssuerSerial({
        schema: new Sequence({
          value: asn1.result.baseCertificateID.valueBlock.value
        })
      });
    }
    if (OBJECT_DIGEST_INFO$1 in asn1.result) {
      this.objectDigestInfo = new ObjectDigestInfo({
        schema: new Sequence({
          value: asn1.result.objectDigestInfo.valueBlock.value
        })
      });
    }
  }
  toSchema() {
    const result = new Sequence();
    if (this.issuerName)
      result.valueBlock.value.push(this.issuerName.toSchema());
    if (this.baseCertificateID) {
      result.valueBlock.value.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: this.baseCertificateID.toSchema().valueBlock.value
      }));
    }
    if (this.objectDigestInfo) {
      result.valueBlock.value.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: this.objectDigestInfo.toSchema().valueBlock.value
      }));
    }
    return result;
  }
  toJSON() {
    const result = {};
    if (this.issuerName) {
      result.issuerName = this.issuerName.toJSON();
    }
    if (this.baseCertificateID) {
      result.baseCertificateID = this.baseCertificateID.toJSON();
    }
    if (this.objectDigestInfo) {
      result.objectDigestInfo = this.objectDigestInfo.toJSON();
    }
    return result;
  }
}
V2Form.CLASS_NAME = "V2Form";
const BASE_CERTIFICATE_ID = "baseCertificateID";
const ENTITY_NAME = "entityName";
const OBJECT_DIGEST_INFO = "objectDigestInfo";
const CLEAR_PROPS$V = [
  BASE_CERTIFICATE_ID,
  ENTITY_NAME,
  OBJECT_DIGEST_INFO
];
class Holder extends PkiObject {
  constructor(parameters = {}) {
    super();
    if (BASE_CERTIFICATE_ID in parameters) {
      this.baseCertificateID = getParametersValue(parameters, BASE_CERTIFICATE_ID, Holder.defaultValues(BASE_CERTIFICATE_ID));
    }
    if (ENTITY_NAME in parameters) {
      this.entityName = getParametersValue(parameters, ENTITY_NAME, Holder.defaultValues(ENTITY_NAME));
    }
    if (OBJECT_DIGEST_INFO in parameters) {
      this.objectDigestInfo = getParametersValue(parameters, OBJECT_DIGEST_INFO, Holder.defaultValues(OBJECT_DIGEST_INFO));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case BASE_CERTIFICATE_ID:
        return new IssuerSerial();
      case ENTITY_NAME:
        return new GeneralNames();
      case OBJECT_DIGEST_INFO:
        return new ObjectDigestInfo();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Constructed({
          optional: true,
          name: names.baseCertificateID || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: IssuerSerial.schema().valueBlock.value
        }),
        new Constructed({
          optional: true,
          name: names.entityName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: GeneralNames.schema().valueBlock.value
        }),
        new Constructed({
          optional: true,
          name: names.objectDigestInfo || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          },
          value: ObjectDigestInfo.schema().valueBlock.value
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$V);
    const asn1 = compareSchema(schema, schema, Holder.schema({
      names: {
        baseCertificateID: BASE_CERTIFICATE_ID,
        entityName: ENTITY_NAME,
        objectDigestInfo: OBJECT_DIGEST_INFO
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (BASE_CERTIFICATE_ID in asn1.result) {
      this.baseCertificateID = new IssuerSerial({
        schema: new Sequence({
          value: asn1.result.baseCertificateID.valueBlock.value
        })
      });
    }
    if (ENTITY_NAME in asn1.result) {
      this.entityName = new GeneralNames({
        schema: new Sequence({
          value: asn1.result.entityName.valueBlock.value
        })
      });
    }
    if (OBJECT_DIGEST_INFO in asn1.result) {
      this.objectDigestInfo = new ObjectDigestInfo({
        schema: new Sequence({
          value: asn1.result.objectDigestInfo.valueBlock.value
        })
      });
    }
  }
  toSchema() {
    const result = new Sequence();
    if (this.baseCertificateID) {
      result.valueBlock.value.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: this.baseCertificateID.toSchema().valueBlock.value
      }));
    }
    if (this.entityName) {
      result.valueBlock.value.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: this.entityName.toSchema().valueBlock.value
      }));
    }
    if (this.objectDigestInfo) {
      result.valueBlock.value.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 2
        },
        value: this.objectDigestInfo.toSchema().valueBlock.value
      }));
    }
    return result;
  }
  toJSON() {
    const result = {};
    if (this.baseCertificateID) {
      result.baseCertificateID = this.baseCertificateID.toJSON();
    }
    if (this.entityName) {
      result.entityName = this.entityName.toJSON();
    }
    if (this.objectDigestInfo) {
      result.objectDigestInfo = this.objectDigestInfo.toJSON();
    }
    return result;
  }
}
Holder.CLASS_NAME = "Holder";
const VERSION$g = "version";
const HOLDER = "holder";
const ISSUER$3 = "issuer";
const SIGNATURE$5 = "signature";
const SERIAL_NUMBER$4 = "serialNumber";
const ATTR_CERT_VALIDITY_PERIOD = "attrCertValidityPeriod";
const ATTRIBUTES$2 = "attributes";
const ISSUER_UNIQUE_ID$1 = "issuerUniqueID";
const EXTENSIONS$3 = "extensions";
const CLEAR_PROPS$U = [
  VERSION$g,
  HOLDER,
  ISSUER$3,
  SIGNATURE$5,
  SERIAL_NUMBER$4,
  ATTR_CERT_VALIDITY_PERIOD,
  ATTRIBUTES$2,
  ISSUER_UNIQUE_ID$1,
  EXTENSIONS$3
];
class AttributeCertificateInfoV2 extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$g, AttributeCertificateInfoV2.defaultValues(VERSION$g));
    this.holder = getParametersValue(parameters, HOLDER, AttributeCertificateInfoV2.defaultValues(HOLDER));
    this.issuer = getParametersValue(parameters, ISSUER$3, AttributeCertificateInfoV2.defaultValues(ISSUER$3));
    this.signature = getParametersValue(parameters, SIGNATURE$5, AttributeCertificateInfoV2.defaultValues(SIGNATURE$5));
    this.serialNumber = getParametersValue(parameters, SERIAL_NUMBER$4, AttributeCertificateInfoV2.defaultValues(SERIAL_NUMBER$4));
    this.attrCertValidityPeriod = getParametersValue(parameters, ATTR_CERT_VALIDITY_PERIOD, AttributeCertificateInfoV2.defaultValues(ATTR_CERT_VALIDITY_PERIOD));
    this.attributes = getParametersValue(parameters, ATTRIBUTES$2, AttributeCertificateInfoV2.defaultValues(ATTRIBUTES$2));
    if (ISSUER_UNIQUE_ID$1 in parameters) {
      this.issuerUniqueID = getParametersValue(parameters, ISSUER_UNIQUE_ID$1, AttributeCertificateInfoV2.defaultValues(ISSUER_UNIQUE_ID$1));
    }
    if (EXTENSIONS$3 in parameters) {
      this.extensions = getParametersValue(parameters, EXTENSIONS$3, AttributeCertificateInfoV2.defaultValues(EXTENSIONS$3));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$g:
        return 1;
      case HOLDER:
        return new Holder();
      case ISSUER$3:
        return {};
      case SIGNATURE$5:
        return new AlgorithmIdentifier();
      case SERIAL_NUMBER$4:
        return new Integer();
      case ATTR_CERT_VALIDITY_PERIOD:
        return new AttCertValidityPeriod();
      case ATTRIBUTES$2:
        return [];
      case ISSUER_UNIQUE_ID$1:
        return new BitString$1();
      case EXTENSIONS$3:
        return new Extensions();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        Holder.schema(names.holder || {}),
        new Choice({
          value: [
            GeneralNames.schema({
              names: {
                blockName: names.issuer || EMPTY_STRING
              }
            }),
            new Constructed({
              name: names.issuer || EMPTY_STRING,
              idBlock: {
                tagClass: 3,
                tagNumber: 0
              },
              value: V2Form.schema().valueBlock.value
            })
          ]
        }),
        AlgorithmIdentifier.schema(names.signature || {}),
        new Integer({ name: names.serialNumber || EMPTY_STRING }),
        AttCertValidityPeriod.schema(names.attrCertValidityPeriod || {}),
        new Sequence({
          name: names.attributes || EMPTY_STRING,
          value: [
            new Repeated({
              value: Attribute.schema()
            })
          ]
        }),
        new BitString$1({
          optional: true,
          name: names.issuerUniqueID || EMPTY_STRING
        }),
        Extensions.schema(names.extensions || {}, true)
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$U);
    const asn1 = compareSchema(schema, schema, AttributeCertificateInfoV2.schema({
      names: {
        version: VERSION$g,
        holder: {
          names: {
            blockName: HOLDER
          }
        },
        issuer: ISSUER$3,
        signature: {
          names: {
            blockName: SIGNATURE$5
          }
        },
        serialNumber: SERIAL_NUMBER$4,
        attrCertValidityPeriod: {
          names: {
            blockName: ATTR_CERT_VALIDITY_PERIOD
          }
        },
        attributes: ATTRIBUTES$2,
        issuerUniqueID: ISSUER_UNIQUE_ID$1,
        extensions: {
          names: {
            blockName: EXTENSIONS$3
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    this.holder = new Holder({ schema: asn1.result.holder });
    switch (asn1.result.issuer.idBlock.tagClass) {
      case 3:
        this.issuer = new V2Form({
          schema: new Sequence({
            value: asn1.result.issuer.valueBlock.value
          })
        });
        break;
      case 1:
      default:
        throw new Error("Incorrect value for 'issuer' in AttributeCertificateInfoV2");
    }
    this.signature = new AlgorithmIdentifier({ schema: asn1.result.signature });
    this.serialNumber = asn1.result.serialNumber;
    this.attrCertValidityPeriod = new AttCertValidityPeriod({ schema: asn1.result.attrCertValidityPeriod });
    this.attributes = Array.from(asn1.result.attributes.valueBlock.value, (element) => new Attribute({ schema: element }));
    if (ISSUER_UNIQUE_ID$1 in asn1.result) {
      this.issuerUniqueID = asn1.result.issuerUniqueID;
    }
    if (EXTENSIONS$3 in asn1.result) {
      this.extensions = new Extensions({ schema: asn1.result.extensions });
    }
  }
  toSchema() {
    const result = new Sequence({
      value: [
        new Integer({ value: this.version }),
        this.holder.toSchema(),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: this.issuer.toSchema().valueBlock.value
        }),
        this.signature.toSchema(),
        this.serialNumber,
        this.attrCertValidityPeriod.toSchema(),
        new Sequence({
          value: Array.from(this.attributes, (o2) => o2.toSchema())
        })
      ]
    });
    if (this.issuerUniqueID) {
      result.valueBlock.value.push(this.issuerUniqueID);
    }
    if (this.extensions) {
      result.valueBlock.value.push(this.extensions.toSchema());
    }
    return result;
  }
  toJSON() {
    const result = {
      version: this.version,
      holder: this.holder.toJSON(),
      issuer: this.issuer.toJSON(),
      signature: this.signature.toJSON(),
      serialNumber: this.serialNumber.toJSON(),
      attrCertValidityPeriod: this.attrCertValidityPeriod.toJSON(),
      attributes: Array.from(this.attributes, (o2) => o2.toJSON())
    };
    if (this.issuerUniqueID) {
      result.issuerUniqueID = this.issuerUniqueID.toJSON();
    }
    if (this.extensions) {
      result.extensions = this.extensions.toJSON();
    }
    return result;
  }
}
AttributeCertificateInfoV2.CLASS_NAME = "AttributeCertificateInfoV2";
const ACINFO = "acinfo";
const SIGNATURE_ALGORITHM$6 = "signatureAlgorithm";
const SIGNATURE_VALUE$3 = "signatureValue";
const CLEAR_PROPS$T = [
  ACINFO,
  SIGNATURE_ALGORITHM$6,
  SIGNATURE_VALUE$3
];
class AttributeCertificateV2 extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.acinfo = getParametersValue(parameters, ACINFO, AttributeCertificateV2.defaultValues(ACINFO));
    this.signatureAlgorithm = getParametersValue(parameters, SIGNATURE_ALGORITHM$6, AttributeCertificateV2.defaultValues(SIGNATURE_ALGORITHM$6));
    this.signatureValue = getParametersValue(parameters, SIGNATURE_VALUE$3, AttributeCertificateV2.defaultValues(SIGNATURE_VALUE$3));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ACINFO:
        return new AttributeCertificateInfoV2();
      case SIGNATURE_ALGORITHM$6:
        return new AlgorithmIdentifier();
      case SIGNATURE_VALUE$3:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AttributeCertificateInfoV2.schema(names.acinfo || {}),
        AlgorithmIdentifier.schema(names.signatureAlgorithm || {}),
        new BitString$1({ name: names.signatureValue || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$T);
    const asn1 = compareSchema(schema, schema, AttributeCertificateV2.schema({
      names: {
        acinfo: {
          names: {
            blockName: ACINFO
          }
        },
        signatureAlgorithm: {
          names: {
            blockName: SIGNATURE_ALGORITHM$6
          }
        },
        signatureValue: SIGNATURE_VALUE$3
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.acinfo = new AttributeCertificateInfoV2({ schema: asn1.result.acinfo });
    this.signatureAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.signatureAlgorithm });
    this.signatureValue = asn1.result.signatureValue;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.acinfo.toSchema(),
        this.signatureAlgorithm.toSchema(),
        this.signatureValue
      ]
    });
  }
  toJSON() {
    return {
      acinfo: this.acinfo.toJSON(),
      signatureAlgorithm: this.signatureAlgorithm.toJSON(),
      signatureValue: this.signatureValue.toJSON()
    };
  }
}
AttributeCertificateV2.CLASS_NAME = "AttributeCertificateV2";
const CONTENT_TYPE = "contentType";
const CONTENT = "content";
const CLEAR_PROPS$S = [CONTENT_TYPE, CONTENT];
class ContentInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.contentType = getParametersValue(parameters, CONTENT_TYPE, ContentInfo.defaultValues(CONTENT_TYPE));
    this.content = getParametersValue(parameters, CONTENT, ContentInfo.defaultValues(CONTENT));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CONTENT_TYPE:
        return EMPTY_STRING;
      case CONTENT:
        return new Any();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case CONTENT_TYPE:
        return typeof memberValue === "string" && memberValue === this.defaultValues(CONTENT_TYPE);
      case CONTENT:
        return memberValue instanceof Any;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    if ("optional" in names === false) {
      names.optional = false;
    }
    return new Sequence({
      name: names.blockName || "ContentInfo",
      optional: names.optional,
      value: [
        new ObjectIdentifier({ name: names.contentType || CONTENT_TYPE }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Any({ name: names.content || CONTENT })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$S);
    const asn1 = compareSchema(schema, schema, ContentInfo.schema());
    AsnError.assertSchema(asn1, this.className);
    this.contentType = asn1.result.contentType.valueBlock.toString();
    this.content = asn1.result.content;
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.contentType }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [this.content]
        })
      ]
    });
  }
  toJSON() {
    const object = {
      contentType: this.contentType
    };
    if (!(this.content instanceof Any)) {
      object.content = this.content.toJSON();
    }
    return object;
  }
}
ContentInfo.CLASS_NAME = "ContentInfo";
ContentInfo.DATA = id_ContentType_Data;
ContentInfo.SIGNED_DATA = id_ContentType_SignedData;
ContentInfo.ENVELOPED_DATA = id_ContentType_EnvelopedData;
ContentInfo.ENCRYPTED_DATA = id_ContentType_EncryptedData;
const TYPE$1 = "type";
const VALUE$4 = "value";
const UTC_TIME_NAME = "utcTimeName";
const GENERAL_TIME_NAME = "generalTimeName";
const CLEAR_PROPS$R = [UTC_TIME_NAME, GENERAL_TIME_NAME];
var TimeType;
(function(TimeType2) {
  TimeType2[TimeType2["UTCTime"] = 0] = "UTCTime";
  TimeType2[TimeType2["GeneralizedTime"] = 1] = "GeneralizedTime";
  TimeType2[TimeType2["empty"] = 2] = "empty";
})(TimeType || (TimeType = {}));
class Time extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.type = getParametersValue(parameters, TYPE$1, Time.defaultValues(TYPE$1));
    this.value = getParametersValue(parameters, VALUE$4, Time.defaultValues(VALUE$4));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TYPE$1:
        return 0;
      case VALUE$4:
        return new Date(0, 0, 0);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}, optional = false) {
    const names = getParametersValue(parameters, "names", {});
    return new Choice({
      optional,
      value: [
        new UTCTime({ name: names.utcTimeName || EMPTY_STRING }),
        new GeneralizedTime({ name: names.generalTimeName || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$R);
    const asn1 = compareSchema(schema, schema, Time.schema({
      names: {
        utcTimeName: UTC_TIME_NAME,
        generalTimeName: GENERAL_TIME_NAME
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (UTC_TIME_NAME in asn1.result) {
      this.type = 0;
      this.value = asn1.result.utcTimeName.toDate();
    }
    if (GENERAL_TIME_NAME in asn1.result) {
      this.type = 1;
      this.value = asn1.result.generalTimeName.toDate();
    }
  }
  toSchema() {
    if (this.type === 0) {
      return new UTCTime({ valueDate: this.value });
    } else if (this.type === 1) {
      return new GeneralizedTime({ valueDate: this.value });
    }
    return {};
  }
  toJSON() {
    return {
      type: this.type,
      value: this.value
    };
  }
}
Time.CLASS_NAME = "Time";
const TBS$4 = "tbs";
const VERSION$f = "version";
const SERIAL_NUMBER$3 = "serialNumber";
const SIGNATURE$4 = "signature";
const ISSUER$2 = "issuer";
const NOT_BEFORE = "notBefore";
const NOT_AFTER = "notAfter";
const SUBJECT$1 = "subject";
const SUBJECT_PUBLIC_KEY_INFO = "subjectPublicKeyInfo";
const ISSUER_UNIQUE_ID = "issuerUniqueID";
const SUBJECT_UNIQUE_ID = "subjectUniqueID";
const EXTENSIONS$2 = "extensions";
const SIGNATURE_ALGORITHM$5 = "signatureAlgorithm";
const SIGNATURE_VALUE$2 = "signatureValue";
const TBS_CERTIFICATE = "tbsCertificate";
const TBS_CERTIFICATE_VERSION = "".concat(TBS_CERTIFICATE, ".").concat(VERSION$f);
const TBS_CERTIFICATE_SERIAL_NUMBER = "".concat(TBS_CERTIFICATE, ".").concat(SERIAL_NUMBER$3);
const TBS_CERTIFICATE_SIGNATURE = "".concat(TBS_CERTIFICATE, ".").concat(SIGNATURE$4);
const TBS_CERTIFICATE_ISSUER = "".concat(TBS_CERTIFICATE, ".").concat(ISSUER$2);
const TBS_CERTIFICATE_NOT_BEFORE = "".concat(TBS_CERTIFICATE, ".").concat(NOT_BEFORE);
const TBS_CERTIFICATE_NOT_AFTER = "".concat(TBS_CERTIFICATE, ".").concat(NOT_AFTER);
const TBS_CERTIFICATE_SUBJECT = "".concat(TBS_CERTIFICATE, ".").concat(SUBJECT$1);
const TBS_CERTIFICATE_SUBJECT_PUBLIC_KEY = "".concat(TBS_CERTIFICATE, ".").concat(SUBJECT_PUBLIC_KEY_INFO);
const TBS_CERTIFICATE_ISSUER_UNIQUE_ID = "".concat(TBS_CERTIFICATE, ".").concat(ISSUER_UNIQUE_ID);
const TBS_CERTIFICATE_SUBJECT_UNIQUE_ID = "".concat(TBS_CERTIFICATE, ".").concat(SUBJECT_UNIQUE_ID);
const TBS_CERTIFICATE_EXTENSIONS = "".concat(TBS_CERTIFICATE, ".").concat(EXTENSIONS$2);
const CLEAR_PROPS$Q = [
  TBS_CERTIFICATE,
  TBS_CERTIFICATE_VERSION,
  TBS_CERTIFICATE_SERIAL_NUMBER,
  TBS_CERTIFICATE_SIGNATURE,
  TBS_CERTIFICATE_ISSUER,
  TBS_CERTIFICATE_NOT_BEFORE,
  TBS_CERTIFICATE_NOT_AFTER,
  TBS_CERTIFICATE_SUBJECT,
  TBS_CERTIFICATE_SUBJECT_PUBLIC_KEY,
  TBS_CERTIFICATE_ISSUER_UNIQUE_ID,
  TBS_CERTIFICATE_SUBJECT_UNIQUE_ID,
  TBS_CERTIFICATE_EXTENSIONS,
  SIGNATURE_ALGORITHM$5,
  SIGNATURE_VALUE$2
];
function tbsCertificate(parameters = {}) {
  const names = getParametersValue(parameters, "names", {});
  return new Sequence({
    name: names.blockName || TBS_CERTIFICATE,
    value: [
      new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [
          new Integer({ name: names.tbsCertificateVersion || TBS_CERTIFICATE_VERSION })
        ]
      }),
      new Integer({ name: names.tbsCertificateSerialNumber || TBS_CERTIFICATE_SERIAL_NUMBER }),
      AlgorithmIdentifier.schema(names.signature || {
        names: {
          blockName: TBS_CERTIFICATE_SIGNATURE
        }
      }),
      RelativeDistinguishedNames.schema(names.issuer || {
        names: {
          blockName: TBS_CERTIFICATE_ISSUER
        }
      }),
      new Sequence({
        name: names.tbsCertificateValidity || "tbsCertificate.validity",
        value: [
          Time.schema(names.notBefore || {
            names: {
              utcTimeName: TBS_CERTIFICATE_NOT_BEFORE,
              generalTimeName: TBS_CERTIFICATE_NOT_BEFORE
            }
          }),
          Time.schema(names.notAfter || {
            names: {
              utcTimeName: TBS_CERTIFICATE_NOT_AFTER,
              generalTimeName: TBS_CERTIFICATE_NOT_AFTER
            }
          })
        ]
      }),
      RelativeDistinguishedNames.schema(names.subject || {
        names: {
          blockName: TBS_CERTIFICATE_SUBJECT
        }
      }),
      PublicKeyInfo.schema(names.subjectPublicKeyInfo || {
        names: {
          blockName: TBS_CERTIFICATE_SUBJECT_PUBLIC_KEY
        }
      }),
      new Primitive({
        name: names.tbsCertificateIssuerUniqueID || TBS_CERTIFICATE_ISSUER_UNIQUE_ID,
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        }
      }),
      new Primitive({
        name: names.tbsCertificateSubjectUniqueID || TBS_CERTIFICATE_SUBJECT_UNIQUE_ID,
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 2
        }
      }),
      new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 3
        },
        value: [Extensions.schema(names.extensions || {
          names: {
            blockName: TBS_CERTIFICATE_EXTENSIONS
          }
        })]
      })
    ]
  });
}
class Certificate extends PkiObject {
  get tbs() {
    return BufferSourceConverter.toArrayBuffer(this.tbsView);
  }
  set tbs(value) {
    this.tbsView = new Uint8Array(value);
  }
  constructor(parameters = {}) {
    super();
    this.tbsView = new Uint8Array(getParametersValue(parameters, TBS$4, Certificate.defaultValues(TBS$4)));
    this.version = getParametersValue(parameters, VERSION$f, Certificate.defaultValues(VERSION$f));
    this.serialNumber = getParametersValue(parameters, SERIAL_NUMBER$3, Certificate.defaultValues(SERIAL_NUMBER$3));
    this.signature = getParametersValue(parameters, SIGNATURE$4, Certificate.defaultValues(SIGNATURE$4));
    this.issuer = getParametersValue(parameters, ISSUER$2, Certificate.defaultValues(ISSUER$2));
    this.notBefore = getParametersValue(parameters, NOT_BEFORE, Certificate.defaultValues(NOT_BEFORE));
    this.notAfter = getParametersValue(parameters, NOT_AFTER, Certificate.defaultValues(NOT_AFTER));
    this.subject = getParametersValue(parameters, SUBJECT$1, Certificate.defaultValues(SUBJECT$1));
    this.subjectPublicKeyInfo = getParametersValue(parameters, SUBJECT_PUBLIC_KEY_INFO, Certificate.defaultValues(SUBJECT_PUBLIC_KEY_INFO));
    if (ISSUER_UNIQUE_ID in parameters) {
      this.issuerUniqueID = getParametersValue(parameters, ISSUER_UNIQUE_ID, Certificate.defaultValues(ISSUER_UNIQUE_ID));
    }
    if (SUBJECT_UNIQUE_ID in parameters) {
      this.subjectUniqueID = getParametersValue(parameters, SUBJECT_UNIQUE_ID, Certificate.defaultValues(SUBJECT_UNIQUE_ID));
    }
    if (EXTENSIONS$2 in parameters) {
      this.extensions = getParametersValue(parameters, EXTENSIONS$2, Certificate.defaultValues(EXTENSIONS$2));
    }
    this.signatureAlgorithm = getParametersValue(parameters, SIGNATURE_ALGORITHM$5, Certificate.defaultValues(SIGNATURE_ALGORITHM$5));
    this.signatureValue = getParametersValue(parameters, SIGNATURE_VALUE$2, Certificate.defaultValues(SIGNATURE_VALUE$2));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TBS$4:
        return EMPTY_BUFFER;
      case VERSION$f:
        return 0;
      case SERIAL_NUMBER$3:
        return new Integer();
      case SIGNATURE$4:
        return new AlgorithmIdentifier();
      case ISSUER$2:
        return new RelativeDistinguishedNames();
      case NOT_BEFORE:
        return new Time();
      case NOT_AFTER:
        return new Time();
      case SUBJECT$1:
        return new RelativeDistinguishedNames();
      case SUBJECT_PUBLIC_KEY_INFO:
        return new PublicKeyInfo();
      case ISSUER_UNIQUE_ID:
        return EMPTY_BUFFER;
      case SUBJECT_UNIQUE_ID:
        return EMPTY_BUFFER;
      case EXTENSIONS$2:
        return [];
      case SIGNATURE_ALGORITHM$5:
        return new AlgorithmIdentifier();
      case SIGNATURE_VALUE$2:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        tbsCertificate(names.tbsCertificate),
        AlgorithmIdentifier.schema(names.signatureAlgorithm || {
          names: {
            blockName: SIGNATURE_ALGORITHM$5
          }
        }),
        new BitString$1({ name: names.signatureValue || SIGNATURE_VALUE$2 })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$Q);
    const asn1 = compareSchema(schema, schema, Certificate.schema({
      names: {
        tbsCertificate: {
          names: {
            extensions: {
              names: {
                extensions: TBS_CERTIFICATE_EXTENSIONS
              }
            }
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.tbsView = asn1.result.tbsCertificate.valueBeforeDecodeView;
    if (TBS_CERTIFICATE_VERSION in asn1.result)
      this.version = asn1.result[TBS_CERTIFICATE_VERSION].valueBlock.valueDec;
    this.serialNumber = asn1.result[TBS_CERTIFICATE_SERIAL_NUMBER];
    this.signature = new AlgorithmIdentifier({ schema: asn1.result[TBS_CERTIFICATE_SIGNATURE] });
    this.issuer = new RelativeDistinguishedNames({ schema: asn1.result[TBS_CERTIFICATE_ISSUER] });
    this.notBefore = new Time({ schema: asn1.result[TBS_CERTIFICATE_NOT_BEFORE] });
    this.notAfter = new Time({ schema: asn1.result[TBS_CERTIFICATE_NOT_AFTER] });
    this.subject = new RelativeDistinguishedNames({ schema: asn1.result[TBS_CERTIFICATE_SUBJECT] });
    this.subjectPublicKeyInfo = new PublicKeyInfo({ schema: asn1.result[TBS_CERTIFICATE_SUBJECT_PUBLIC_KEY] });
    if (TBS_CERTIFICATE_ISSUER_UNIQUE_ID in asn1.result)
      this.issuerUniqueID = asn1.result[TBS_CERTIFICATE_ISSUER_UNIQUE_ID].valueBlock.valueHex;
    if (TBS_CERTIFICATE_SUBJECT_UNIQUE_ID in asn1.result)
      this.subjectUniqueID = asn1.result[TBS_CERTIFICATE_SUBJECT_UNIQUE_ID].valueBlock.valueHex;
    if (TBS_CERTIFICATE_EXTENSIONS in asn1.result)
      this.extensions = Array.from(asn1.result[TBS_CERTIFICATE_EXTENSIONS], (element) => new Extension({ schema: element }));
    this.signatureAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.signatureAlgorithm });
    this.signatureValue = asn1.result.signatureValue;
  }
  encodeTBS() {
    const outputArray = [];
    if (VERSION$f in this && this.version !== Certificate.defaultValues(VERSION$f)) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [
          new Integer({ value: this.version })
        ]
      }));
    }
    outputArray.push(this.serialNumber);
    outputArray.push(this.signature.toSchema());
    outputArray.push(this.issuer.toSchema());
    outputArray.push(new Sequence({
      value: [
        this.notBefore.toSchema(),
        this.notAfter.toSchema()
      ]
    }));
    outputArray.push(this.subject.toSchema());
    outputArray.push(this.subjectPublicKeyInfo.toSchema());
    if (this.issuerUniqueID) {
      outputArray.push(new Primitive({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        valueHex: this.issuerUniqueID
      }));
    }
    if (this.subjectUniqueID) {
      outputArray.push(new Primitive({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 2
        },
        valueHex: this.subjectUniqueID
      }));
    }
    if (this.extensions) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 3
        },
        value: [new Sequence({
          value: Array.from(this.extensions, (o2) => o2.toSchema())
        })]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toSchema(encodeFlag = false) {
    let tbsSchema;
    if (encodeFlag === false) {
      if (!this.tbsView.byteLength) {
        return Certificate.schema().value[0];
      }
      const asn1 = fromBER(this.tbsView);
      AsnError.assert(asn1, "TBS Certificate");
      tbsSchema = asn1.result;
    } else {
      tbsSchema = this.encodeTBS();
    }
    return new Sequence({
      value: [
        tbsSchema,
        this.signatureAlgorithm.toSchema(),
        this.signatureValue
      ]
    });
  }
  toJSON() {
    const res = {
      tbs: Convert.ToHex(this.tbsView),
      version: this.version,
      serialNumber: this.serialNumber.toJSON(),
      signature: this.signature.toJSON(),
      issuer: this.issuer.toJSON(),
      notBefore: this.notBefore.toJSON(),
      notAfter: this.notAfter.toJSON(),
      subject: this.subject.toJSON(),
      subjectPublicKeyInfo: this.subjectPublicKeyInfo.toJSON(),
      signatureAlgorithm: this.signatureAlgorithm.toJSON(),
      signatureValue: this.signatureValue.toJSON()
    };
    if (VERSION$f in this && this.version !== Certificate.defaultValues(VERSION$f)) {
      res.version = this.version;
    }
    if (this.issuerUniqueID) {
      res.issuerUniqueID = Convert.ToHex(this.issuerUniqueID);
    }
    if (this.subjectUniqueID) {
      res.subjectUniqueID = Convert.ToHex(this.subjectUniqueID);
    }
    if (this.extensions) {
      res.extensions = Array.from(this.extensions, (o2) => o2.toJSON());
    }
    return res;
  }
  async getPublicKey(parameters, crypto2 = getCrypto(true)) {
    return crypto2.getPublicKey(this.subjectPublicKeyInfo, this.signatureAlgorithm, parameters);
  }
  async getKeyHash(hashAlgorithm = "SHA-1", crypto2 = getCrypto(true)) {
    return crypto2.digest({ name: hashAlgorithm }, this.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHexView);
  }
  async sign(privateKey, hashAlgorithm = "SHA-1", crypto2 = getCrypto(true)) {
    if (!privateKey) {
      throw new Error("Need to provide a private key for signing");
    }
    const signatureParameters = await crypto2.getSignatureParameters(privateKey, hashAlgorithm);
    const parameters = signatureParameters.parameters;
    this.signature = signatureParameters.signatureAlgorithm;
    this.signatureAlgorithm = signatureParameters.signatureAlgorithm;
    this.tbsView = new Uint8Array(this.encodeTBS().toBER());
    const signature = await crypto2.signWithPrivateKey(this.tbsView, privateKey, parameters);
    this.signatureValue = new BitString$1({ valueHex: signature });
  }
  async verify(issuerCertificate, crypto2 = getCrypto(true)) {
    let subjectPublicKeyInfo;
    if (issuerCertificate) {
      subjectPublicKeyInfo = issuerCertificate.subjectPublicKeyInfo;
    } else if (this.issuer.isEqual(this.subject)) {
      subjectPublicKeyInfo = this.subjectPublicKeyInfo;
    }
    if (!(subjectPublicKeyInfo instanceof PublicKeyInfo)) {
      throw new Error("Please provide issuer certificate as a parameter");
    }
    return crypto2.verifyWithPublicKey(this.tbsView, this.signatureValue, subjectPublicKeyInfo, this.signatureAlgorithm);
  }
}
Certificate.CLASS_NAME = "Certificate";
function checkCA(cert, signerCert = null) {
  if (signerCert && cert.issuer.isEqual(signerCert.issuer) && cert.serialNumber.isEqual(signerCert.serialNumber)) {
    return null;
  }
  let isCA = false;
  if (cert.extensions) {
    for (const extension of cert.extensions) {
      if (extension.extnID === id_BasicConstraints && extension.parsedValue instanceof BasicConstraints) {
        if (extension.parsedValue.cA) {
          isCA = true;
          break;
        }
      }
    }
  }
  if (isCA) {
    return cert;
  }
  return null;
}
const CERT_ID$1 = "certId";
const CERT_VALUE = "certValue";
const PARSED_VALUE$4 = "parsedValue";
const CLEAR_PROPS$P = [
  CERT_ID$1,
  CERT_VALUE
];
class CertBag extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.certId = getParametersValue(parameters, CERT_ID$1, CertBag.defaultValues(CERT_ID$1));
    this.certValue = getParametersValue(parameters, CERT_VALUE, CertBag.defaultValues(CERT_VALUE));
    if (PARSED_VALUE$4 in parameters) {
      this.parsedValue = getParametersValue(parameters, PARSED_VALUE$4, CertBag.defaultValues(PARSED_VALUE$4));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CERT_ID$1:
        return EMPTY_STRING;
      case CERT_VALUE:
        return new Any();
      case PARSED_VALUE$4:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case CERT_ID$1:
        return memberValue === EMPTY_STRING;
      case CERT_VALUE:
        return memberValue instanceof Any;
      case PARSED_VALUE$4:
        return memberValue instanceof Object && Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.id || "id" }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Any({ name: names.value || "value" })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$P);
    const asn1 = compareSchema(schema, schema, CertBag.schema({
      names: {
        id: CERT_ID$1,
        value: CERT_VALUE
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.certId = asn1.result.certId.valueBlock.toString();
    this.certValue = asn1.result.certValue;
    const certValueHex = this.certValue.valueBlock.valueHexView;
    switch (this.certId) {
      case id_CertBag_X509Certificate:
        {
          try {
            this.parsedValue = Certificate.fromBER(certValueHex);
          } catch (ex) {
            AttributeCertificateV2.fromBER(certValueHex);
          }
        }
        break;
      case id_CertBag_AttributeCertificate:
        {
          this.parsedValue = AttributeCertificateV2.fromBER(certValueHex);
        }
        break;
      case id_CertBag_SDSICertificate:
      default:
        throw new Error("Incorrect CERT_ID value in CertBag: ".concat(this.certId));
    }
  }
  toSchema() {
    if (PARSED_VALUE$4 in this) {
      if ("acinfo" in this.parsedValue) {
        this.certId = id_CertBag_AttributeCertificate;
      } else {
        this.certId = id_CertBag_X509Certificate;
      }
      this.certValue = new OctetString$1({ valueHex: this.parsedValue.toSchema().toBER(false) });
    }
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.certId }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: ["toSchema" in this.certValue ? this.certValue.toSchema() : this.certValue]
        })
      ]
    });
  }
  toJSON() {
    return {
      certId: this.certId,
      certValue: this.certValue.toJSON()
    };
  }
}
CertBag.CLASS_NAME = "CertBag";
const USER_CERTIFICATE = "userCertificate";
const REVOCATION_DATE = "revocationDate";
const CRL_ENTRY_EXTENSIONS = "crlEntryExtensions";
const CLEAR_PROPS$O = [
  USER_CERTIFICATE,
  REVOCATION_DATE,
  CRL_ENTRY_EXTENSIONS
];
class RevokedCertificate extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.userCertificate = getParametersValue(parameters, USER_CERTIFICATE, RevokedCertificate.defaultValues(USER_CERTIFICATE));
    this.revocationDate = getParametersValue(parameters, REVOCATION_DATE, RevokedCertificate.defaultValues(REVOCATION_DATE));
    if (CRL_ENTRY_EXTENSIONS in parameters) {
      this.crlEntryExtensions = getParametersValue(parameters, CRL_ENTRY_EXTENSIONS, RevokedCertificate.defaultValues(CRL_ENTRY_EXTENSIONS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case USER_CERTIFICATE:
        return new Integer();
      case REVOCATION_DATE:
        return new Time();
      case CRL_ENTRY_EXTENSIONS:
        return new Extensions();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.userCertificate || USER_CERTIFICATE }),
        Time.schema({
          names: {
            utcTimeName: names.revocationDate || REVOCATION_DATE,
            generalTimeName: names.revocationDate || REVOCATION_DATE
          }
        }),
        Extensions.schema({
          names: {
            blockName: names.crlEntryExtensions || CRL_ENTRY_EXTENSIONS
          }
        }, true)
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$O);
    const asn1 = compareSchema(schema, schema, RevokedCertificate.schema());
    AsnError.assertSchema(asn1, this.className);
    this.userCertificate = asn1.result.userCertificate;
    this.revocationDate = new Time({ schema: asn1.result.revocationDate });
    if (CRL_ENTRY_EXTENSIONS in asn1.result) {
      this.crlEntryExtensions = new Extensions({ schema: asn1.result.crlEntryExtensions });
    }
  }
  toSchema() {
    const outputArray = [
      this.userCertificate,
      this.revocationDate.toSchema()
    ];
    if (this.crlEntryExtensions) {
      outputArray.push(this.crlEntryExtensions.toSchema());
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      userCertificate: this.userCertificate.toJSON(),
      revocationDate: this.revocationDate.toJSON()
    };
    if (this.crlEntryExtensions) {
      res.crlEntryExtensions = this.crlEntryExtensions.toJSON();
    }
    return res;
  }
}
RevokedCertificate.CLASS_NAME = "RevokedCertificate";
const TBS$3 = "tbs";
const VERSION$e = "version";
const SIGNATURE$3 = "signature";
const ISSUER$1 = "issuer";
const THIS_UPDATE$1 = "thisUpdate";
const NEXT_UPDATE$1 = "nextUpdate";
const REVOKED_CERTIFICATES = "revokedCertificates";
const CRL_EXTENSIONS = "crlExtensions";
const SIGNATURE_ALGORITHM$4 = "signatureAlgorithm";
const SIGNATURE_VALUE$1 = "signatureValue";
const TBS_CERT_LIST = "tbsCertList";
const TBS_CERT_LIST_VERSION = "".concat(TBS_CERT_LIST, ".version");
const TBS_CERT_LIST_SIGNATURE = "".concat(TBS_CERT_LIST, ".signature");
const TBS_CERT_LIST_ISSUER = "".concat(TBS_CERT_LIST, ".issuer");
const TBS_CERT_LIST_THIS_UPDATE = "".concat(TBS_CERT_LIST, ".thisUpdate");
const TBS_CERT_LIST_NEXT_UPDATE = "".concat(TBS_CERT_LIST, ".nextUpdate");
const TBS_CERT_LIST_REVOKED_CERTIFICATES = "".concat(TBS_CERT_LIST, ".revokedCertificates");
const TBS_CERT_LIST_EXTENSIONS = "".concat(TBS_CERT_LIST, ".extensions");
const CLEAR_PROPS$N = [
  TBS_CERT_LIST,
  TBS_CERT_LIST_VERSION,
  TBS_CERT_LIST_SIGNATURE,
  TBS_CERT_LIST_ISSUER,
  TBS_CERT_LIST_THIS_UPDATE,
  TBS_CERT_LIST_NEXT_UPDATE,
  TBS_CERT_LIST_REVOKED_CERTIFICATES,
  TBS_CERT_LIST_EXTENSIONS,
  SIGNATURE_ALGORITHM$4,
  SIGNATURE_VALUE$1
];
function tbsCertList(parameters = {}) {
  const names = getParametersValue(parameters, "names", {});
  return new Sequence({
    name: names.blockName || TBS_CERT_LIST,
    value: [
      new Integer({
        optional: true,
        name: names.tbsCertListVersion || TBS_CERT_LIST_VERSION,
        value: 2
      }),
      AlgorithmIdentifier.schema(names.signature || {
        names: {
          blockName: TBS_CERT_LIST_SIGNATURE
        }
      }),
      RelativeDistinguishedNames.schema(names.issuer || {
        names: {
          blockName: TBS_CERT_LIST_ISSUER
        }
      }),
      Time.schema(names.tbsCertListThisUpdate || {
        names: {
          utcTimeName: TBS_CERT_LIST_THIS_UPDATE,
          generalTimeName: TBS_CERT_LIST_THIS_UPDATE
        }
      }),
      Time.schema(names.tbsCertListNextUpdate || {
        names: {
          utcTimeName: TBS_CERT_LIST_NEXT_UPDATE,
          generalTimeName: TBS_CERT_LIST_NEXT_UPDATE
        }
      }, true),
      new Sequence({
        optional: true,
        value: [
          new Repeated({
            name: names.tbsCertListRevokedCertificates || TBS_CERT_LIST_REVOKED_CERTIFICATES,
            value: new Sequence({
              value: [
                new Integer(),
                Time.schema(),
                Extensions.schema({}, true)
              ]
            })
          })
        ]
      }),
      new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [Extensions.schema(names.crlExtensions || {
          names: {
            blockName: TBS_CERT_LIST_EXTENSIONS
          }
        })]
      })
    ]
  });
}
const WELL_KNOWN_EXTENSIONS = [
  id_AuthorityKeyIdentifier,
  id_IssuerAltName,
  id_CRLNumber,
  id_BaseCRLNumber,
  id_IssuingDistributionPoint,
  id_FreshestCRL,
  id_AuthorityInfoAccess,
  id_CRLReason,
  id_InvalidityDate,
  id_CertificateIssuer
];
class CertificateRevocationList extends PkiObject {
  get tbs() {
    return BufferSourceConverter.toArrayBuffer(this.tbsView);
  }
  set tbs(value) {
    this.tbsView = new Uint8Array(value);
  }
  constructor(parameters = {}) {
    super();
    this.tbsView = new Uint8Array(getParametersValue(parameters, TBS$3, CertificateRevocationList.defaultValues(TBS$3)));
    this.version = getParametersValue(parameters, VERSION$e, CertificateRevocationList.defaultValues(VERSION$e));
    this.signature = getParametersValue(parameters, SIGNATURE$3, CertificateRevocationList.defaultValues(SIGNATURE$3));
    this.issuer = getParametersValue(parameters, ISSUER$1, CertificateRevocationList.defaultValues(ISSUER$1));
    this.thisUpdate = getParametersValue(parameters, THIS_UPDATE$1, CertificateRevocationList.defaultValues(THIS_UPDATE$1));
    if (NEXT_UPDATE$1 in parameters) {
      this.nextUpdate = getParametersValue(parameters, NEXT_UPDATE$1, CertificateRevocationList.defaultValues(NEXT_UPDATE$1));
    }
    if (REVOKED_CERTIFICATES in parameters) {
      this.revokedCertificates = getParametersValue(parameters, REVOKED_CERTIFICATES, CertificateRevocationList.defaultValues(REVOKED_CERTIFICATES));
    }
    if (CRL_EXTENSIONS in parameters) {
      this.crlExtensions = getParametersValue(parameters, CRL_EXTENSIONS, CertificateRevocationList.defaultValues(CRL_EXTENSIONS));
    }
    this.signatureAlgorithm = getParametersValue(parameters, SIGNATURE_ALGORITHM$4, CertificateRevocationList.defaultValues(SIGNATURE_ALGORITHM$4));
    this.signatureValue = getParametersValue(parameters, SIGNATURE_VALUE$1, CertificateRevocationList.defaultValues(SIGNATURE_VALUE$1));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TBS$3:
        return EMPTY_BUFFER;
      case VERSION$e:
        return 0;
      case SIGNATURE$3:
        return new AlgorithmIdentifier();
      case ISSUER$1:
        return new RelativeDistinguishedNames();
      case THIS_UPDATE$1:
        return new Time();
      case NEXT_UPDATE$1:
        return new Time();
      case REVOKED_CERTIFICATES:
        return [];
      case CRL_EXTENSIONS:
        return new Extensions();
      case SIGNATURE_ALGORITHM$4:
        return new AlgorithmIdentifier();
      case SIGNATURE_VALUE$1:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || "CertificateList",
      value: [
        tbsCertList(parameters),
        AlgorithmIdentifier.schema(names.signatureAlgorithm || {
          names: {
            blockName: SIGNATURE_ALGORITHM$4
          }
        }),
        new BitString$1({ name: names.signatureValue || SIGNATURE_VALUE$1 })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$N);
    const asn1 = compareSchema(schema, schema, CertificateRevocationList.schema());
    AsnError.assertSchema(asn1, this.className);
    this.tbsView = asn1.result.tbsCertList.valueBeforeDecodeView;
    if (TBS_CERT_LIST_VERSION in asn1.result) {
      this.version = asn1.result[TBS_CERT_LIST_VERSION].valueBlock.valueDec;
    }
    this.signature = new AlgorithmIdentifier({ schema: asn1.result[TBS_CERT_LIST_SIGNATURE] });
    this.issuer = new RelativeDistinguishedNames({ schema: asn1.result[TBS_CERT_LIST_ISSUER] });
    this.thisUpdate = new Time({ schema: asn1.result[TBS_CERT_LIST_THIS_UPDATE] });
    if (TBS_CERT_LIST_NEXT_UPDATE in asn1.result) {
      this.nextUpdate = new Time({ schema: asn1.result[TBS_CERT_LIST_NEXT_UPDATE] });
    }
    if (TBS_CERT_LIST_REVOKED_CERTIFICATES in asn1.result) {
      this.revokedCertificates = Array.from(asn1.result[TBS_CERT_LIST_REVOKED_CERTIFICATES], (element) => new RevokedCertificate({ schema: element }));
    }
    if (TBS_CERT_LIST_EXTENSIONS in asn1.result) {
      this.crlExtensions = new Extensions({ schema: asn1.result[TBS_CERT_LIST_EXTENSIONS] });
    }
    this.signatureAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.signatureAlgorithm });
    this.signatureValue = asn1.result.signatureValue;
  }
  encodeTBS() {
    const outputArray = [];
    if (this.version !== CertificateRevocationList.defaultValues(VERSION$e)) {
      outputArray.push(new Integer({ value: this.version }));
    }
    outputArray.push(this.signature.toSchema());
    outputArray.push(this.issuer.toSchema());
    outputArray.push(this.thisUpdate.toSchema());
    if (this.nextUpdate) {
      outputArray.push(this.nextUpdate.toSchema());
    }
    if (this.revokedCertificates) {
      outputArray.push(new Sequence({
        value: Array.from(this.revokedCertificates, (o2) => o2.toSchema())
      }));
    }
    if (this.crlExtensions) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [
          this.crlExtensions.toSchema()
        ]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toSchema(encodeFlag = false) {
    let tbsSchema;
    if (!encodeFlag) {
      if (!this.tbsView.byteLength) {
        return CertificateRevocationList.schema();
      }
      const asn1 = fromBER(this.tbsView);
      AsnError.assert(asn1, "TBS Certificate Revocation List");
      tbsSchema = asn1.result;
    } else {
      tbsSchema = this.encodeTBS();
    }
    return new Sequence({
      value: [
        tbsSchema,
        this.signatureAlgorithm.toSchema(),
        this.signatureValue
      ]
    });
  }
  toJSON() {
    const res = {
      tbs: Convert.ToHex(this.tbsView),
      version: this.version,
      signature: this.signature.toJSON(),
      issuer: this.issuer.toJSON(),
      thisUpdate: this.thisUpdate.toJSON(),
      signatureAlgorithm: this.signatureAlgorithm.toJSON(),
      signatureValue: this.signatureValue.toJSON()
    };
    if (this.version !== CertificateRevocationList.defaultValues(VERSION$e))
      res.version = this.version;
    if (this.nextUpdate) {
      res.nextUpdate = this.nextUpdate.toJSON();
    }
    if (this.revokedCertificates) {
      res.revokedCertificates = Array.from(this.revokedCertificates, (o2) => o2.toJSON());
    }
    if (this.crlExtensions) {
      res.crlExtensions = this.crlExtensions.toJSON();
    }
    return res;
  }
  isCertificateRevoked(certificate) {
    if (!this.issuer.isEqual(certificate.issuer)) {
      return false;
    }
    if (!this.revokedCertificates) {
      return false;
    }
    for (const revokedCertificate of this.revokedCertificates) {
      if (revokedCertificate.userCertificate.isEqual(certificate.serialNumber)) {
        return true;
      }
    }
    return false;
  }
  async sign(privateKey, hashAlgorithm = "SHA-1", crypto2 = getCrypto(true)) {
    if (!privateKey) {
      throw new Error("Need to provide a private key for signing");
    }
    const signatureParameters = await crypto2.getSignatureParameters(privateKey, hashAlgorithm);
    const { parameters } = signatureParameters;
    this.signature = signatureParameters.signatureAlgorithm;
    this.signatureAlgorithm = signatureParameters.signatureAlgorithm;
    this.tbsView = new Uint8Array(this.encodeTBS().toBER());
    const signature = await crypto2.signWithPrivateKey(this.tbsView, privateKey, parameters);
    this.signatureValue = new BitString$1({ valueHex: signature });
  }
  async verify(parameters = {}, crypto2 = getCrypto(true)) {
    let subjectPublicKeyInfo;
    if (parameters.issuerCertificate) {
      subjectPublicKeyInfo = parameters.issuerCertificate.subjectPublicKeyInfo;
      if (!this.issuer.isEqual(parameters.issuerCertificate.subject)) {
        return false;
      }
    }
    if (parameters.publicKeyInfo) {
      subjectPublicKeyInfo = parameters.publicKeyInfo;
    }
    if (!subjectPublicKeyInfo) {
      throw new Error("Issuer's certificate must be provided as an input parameter");
    }
    if (this.crlExtensions) {
      for (const extension of this.crlExtensions.extensions) {
        if (extension.critical) {
          if (!WELL_KNOWN_EXTENSIONS.includes(extension.extnID))
            return false;
        }
      }
    }
    return crypto2.verifyWithPublicKey(this.tbsView, this.signatureValue, subjectPublicKeyInfo, this.signatureAlgorithm);
  }
}
CertificateRevocationList.CLASS_NAME = "CertificateRevocationList";
const CRL_ID = "crlId";
const CRL_VALUE = "crlValue";
const PARSED_VALUE$3 = "parsedValue";
const CLEAR_PROPS$M = [
  CRL_ID,
  CRL_VALUE
];
class CRLBag extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.crlId = getParametersValue(parameters, CRL_ID, CRLBag.defaultValues(CRL_ID));
    this.crlValue = getParametersValue(parameters, CRL_VALUE, CRLBag.defaultValues(CRL_VALUE));
    if (PARSED_VALUE$3 in parameters) {
      this.parsedValue = getParametersValue(parameters, PARSED_VALUE$3, CRLBag.defaultValues(PARSED_VALUE$3));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CRL_ID:
        return EMPTY_STRING;
      case CRL_VALUE:
        return new Any();
      case PARSED_VALUE$3:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case CRL_ID:
        return memberValue === EMPTY_STRING;
      case CRL_VALUE:
        return memberValue instanceof Any;
      case PARSED_VALUE$3:
        return memberValue instanceof Object && Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.id || "id" }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Any({ name: names.value || "value" })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$M);
    const asn1 = compareSchema(schema, schema, CRLBag.schema({
      names: {
        id: CRL_ID,
        value: CRL_VALUE
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.crlId = asn1.result.crlId.valueBlock.toString();
    this.crlValue = asn1.result.crlValue;
    switch (this.crlId) {
      case id_CRLBag_X509CRL:
        {
          this.parsedValue = CertificateRevocationList.fromBER(this.certValue.valueBlock.valueHex);
        }
        break;
      default:
        throw new Error("Incorrect CRL_ID value in CRLBag: ".concat(this.crlId));
    }
  }
  toSchema() {
    if (this.parsedValue) {
      this.crlId = id_CRLBag_X509CRL;
      this.crlValue = new OctetString$1({ valueHex: this.parsedValue.toSchema().toBER(false) });
    }
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.crlId }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [this.crlValue.toSchema()]
        })
      ]
    });
  }
  toJSON() {
    return {
      crlId: this.crlId,
      crlValue: this.crlValue.toJSON()
    };
  }
}
CRLBag.CLASS_NAME = "CRLBag";
const VERSION$d = "version";
const ENCRYPTED_CONTENT_INFO$1 = "encryptedContentInfo";
const UNPROTECTED_ATTRS$1 = "unprotectedAttrs";
const CLEAR_PROPS$L = [
  VERSION$d,
  ENCRYPTED_CONTENT_INFO$1,
  UNPROTECTED_ATTRS$1
];
class EncryptedData extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$d, EncryptedData.defaultValues(VERSION$d));
    this.encryptedContentInfo = getParametersValue(parameters, ENCRYPTED_CONTENT_INFO$1, EncryptedData.defaultValues(ENCRYPTED_CONTENT_INFO$1));
    if (UNPROTECTED_ATTRS$1 in parameters) {
      this.unprotectedAttrs = getParametersValue(parameters, UNPROTECTED_ATTRS$1, EncryptedData.defaultValues(UNPROTECTED_ATTRS$1));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$d:
        return 0;
      case ENCRYPTED_CONTENT_INFO$1:
        return new EncryptedContentInfo();
      case UNPROTECTED_ATTRS$1:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$d:
        return memberValue === 0;
      case ENCRYPTED_CONTENT_INFO$1:
        return EncryptedContentInfo.compareWithDefault("contentType", memberValue.contentType) && EncryptedContentInfo.compareWithDefault("contentEncryptionAlgorithm", memberValue.contentEncryptionAlgorithm) && EncryptedContentInfo.compareWithDefault("encryptedContent", memberValue.encryptedContent);
      case UNPROTECTED_ATTRS$1:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        EncryptedContentInfo.schema(names.encryptedContentInfo || {}),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [
            new Repeated({
              name: names.unprotectedAttrs || EMPTY_STRING,
              value: Attribute.schema()
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$L);
    const asn1 = compareSchema(schema, schema, EncryptedData.schema({
      names: {
        version: VERSION$d,
        encryptedContentInfo: {
          names: {
            blockName: ENCRYPTED_CONTENT_INFO$1
          }
        },
        unprotectedAttrs: UNPROTECTED_ATTRS$1
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    this.encryptedContentInfo = new EncryptedContentInfo({ schema: asn1.result.encryptedContentInfo });
    if (UNPROTECTED_ATTRS$1 in asn1.result)
      this.unprotectedAttrs = Array.from(asn1.result.unprotectedAttrs, (element) => new Attribute({ schema: element }));
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new Integer({ value: this.version }));
    outputArray.push(this.encryptedContentInfo.toSchema());
    if (this.unprotectedAttrs) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: Array.from(this.unprotectedAttrs, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      version: this.version,
      encryptedContentInfo: this.encryptedContentInfo.toJSON()
    };
    if (this.unprotectedAttrs)
      res.unprotectedAttrs = Array.from(this.unprotectedAttrs, (o2) => o2.toJSON());
    return res;
  }
  async encrypt(parameters, crypto2 = getCrypto(true)) {
    ArgumentError.assert(parameters, "parameters", "object");
    const encryptParams = __spreadProps(__spreadValues({}, parameters), {
      contentType: "1.2.840.113549.1.7.1"
    });
    this.encryptedContentInfo = await crypto2.encryptEncryptedContentInfo(encryptParams);
  }
  async decrypt(parameters, crypto2 = getCrypto(true)) {
    ArgumentError.assert(parameters, "parameters", "object");
    const decryptParams = __spreadProps(__spreadValues({}, parameters), {
      encryptedContentInfo: this.encryptedContentInfo
    });
    return crypto2.decryptEncryptedContentInfo(decryptParams);
  }
}
EncryptedData.CLASS_NAME = "EncryptedData";
const ENCRYPTION_ALGORITHM = "encryptionAlgorithm";
const ENCRYPTED_DATA = "encryptedData";
const PARSED_VALUE$2 = "parsedValue";
const CLEAR_PROPS$K = [
  ENCRYPTION_ALGORITHM,
  ENCRYPTED_DATA
];
class PKCS8ShroudedKeyBag extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.encryptionAlgorithm = getParametersValue(parameters, ENCRYPTION_ALGORITHM, PKCS8ShroudedKeyBag.defaultValues(ENCRYPTION_ALGORITHM));
    this.encryptedData = getParametersValue(parameters, ENCRYPTED_DATA, PKCS8ShroudedKeyBag.defaultValues(ENCRYPTED_DATA));
    if (PARSED_VALUE$2 in parameters) {
      this.parsedValue = getParametersValue(parameters, PARSED_VALUE$2, PKCS8ShroudedKeyBag.defaultValues(PARSED_VALUE$2));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ENCRYPTION_ALGORITHM:
        return new AlgorithmIdentifier();
      case ENCRYPTED_DATA:
        return new OctetString$1();
      case PARSED_VALUE$2:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case ENCRYPTION_ALGORITHM:
        return AlgorithmIdentifier.compareWithDefault("algorithmId", memberValue.algorithmId) && "algorithmParams" in memberValue === false;
      case ENCRYPTED_DATA:
        return memberValue.isEqual(PKCS8ShroudedKeyBag.defaultValues(memberName));
      case PARSED_VALUE$2:
        return memberValue instanceof Object && Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AlgorithmIdentifier.schema(names.encryptionAlgorithm || {
          names: {
            blockName: ENCRYPTION_ALGORITHM
          }
        }),
        new Choice({
          value: [
            new OctetString$1({ name: names.encryptedData || ENCRYPTED_DATA }),
            new OctetString$1({
              idBlock: {
                isConstructed: true
              },
              name: names.encryptedData || ENCRYPTED_DATA
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$K);
    const asn1 = compareSchema(schema, schema, PKCS8ShroudedKeyBag.schema({
      names: {
        encryptionAlgorithm: {
          names: {
            blockName: ENCRYPTION_ALGORITHM
          }
        },
        encryptedData: ENCRYPTED_DATA
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.encryptionAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.encryptionAlgorithm });
    this.encryptedData = asn1.result.encryptedData;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.encryptionAlgorithm.toSchema(),
        this.encryptedData
      ]
    });
  }
  toJSON() {
    return {
      encryptionAlgorithm: this.encryptionAlgorithm.toJSON(),
      encryptedData: this.encryptedData.toJSON()
    };
  }
  async parseInternalValues(parameters, crypto2 = getCrypto(true)) {
    const cmsEncrypted = new EncryptedData({
      encryptedContentInfo: new EncryptedContentInfo({
        contentEncryptionAlgorithm: this.encryptionAlgorithm,
        encryptedContent: this.encryptedData
      })
    });
    const decryptedData = await cmsEncrypted.decrypt(parameters, crypto2);
    this.parsedValue = PrivateKeyInfo.fromBER(decryptedData);
  }
  async makeInternalValues(parameters, crypto2 = getCrypto(true)) {
    if (!this.parsedValue) {
      throw new Error('Please initialize "parsedValue" first');
    }
    const cmsEncrypted = new EncryptedData();
    const encryptParams = __spreadProps(__spreadValues({}, parameters), {
      contentToEncrypt: this.parsedValue.toSchema().toBER(false)
    });
    await cmsEncrypted.encrypt(encryptParams, crypto2);
    if (!cmsEncrypted.encryptedContentInfo.encryptedContent) {
      throw new Error("The filed `encryptedContent` in EncryptedContentInfo is empty");
    }
    this.encryptionAlgorithm = cmsEncrypted.encryptedContentInfo.contentEncryptionAlgorithm;
    this.encryptedData = cmsEncrypted.encryptedContentInfo.encryptedContent;
  }
}
PKCS8ShroudedKeyBag.CLASS_NAME = "PKCS8ShroudedKeyBag";
const SECRET_TYPE_ID = "secretTypeId";
const SECRET_VALUE = "secretValue";
const CLEAR_PROPS$J = [
  SECRET_TYPE_ID,
  SECRET_VALUE
];
class SecretBag extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.secretTypeId = getParametersValue(parameters, SECRET_TYPE_ID, SecretBag.defaultValues(SECRET_TYPE_ID));
    this.secretValue = getParametersValue(parameters, SECRET_VALUE, SecretBag.defaultValues(SECRET_VALUE));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case SECRET_TYPE_ID:
        return EMPTY_STRING;
      case SECRET_VALUE:
        return new Any();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case SECRET_TYPE_ID:
        return memberValue === EMPTY_STRING;
      case SECRET_VALUE:
        return memberValue instanceof Any;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.id || "id" }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Any({ name: names.value || "value" })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$J);
    const asn1 = compareSchema(schema, schema, SecretBag.schema({
      names: {
        id: SECRET_TYPE_ID,
        value: SECRET_VALUE
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.secretTypeId = asn1.result.secretTypeId.valueBlock.toString();
    this.secretValue = asn1.result.secretValue;
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.secretTypeId }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [this.secretValue.toSchema()]
        })
      ]
    });
  }
  toJSON() {
    return {
      secretTypeId: this.secretTypeId,
      secretValue: this.secretValue.toJSON()
    };
  }
}
SecretBag.CLASS_NAME = "SecretBag";
class SafeBagValueFactory {
  static getItems() {
    if (!this.items) {
      this.items = {};
      SafeBagValueFactory.register("1.2.840.113549.1.12.10.1.1", PrivateKeyInfo);
      SafeBagValueFactory.register("1.2.840.113549.1.12.10.1.2", PKCS8ShroudedKeyBag);
      SafeBagValueFactory.register("1.2.840.113549.1.12.10.1.3", CertBag);
      SafeBagValueFactory.register("1.2.840.113549.1.12.10.1.4", CRLBag);
      SafeBagValueFactory.register("1.2.840.113549.1.12.10.1.5", SecretBag);
      SafeBagValueFactory.register("1.2.840.113549.1.12.10.1.6", SafeContents);
    }
    return this.items;
  }
  static register(id, type) {
    this.getItems()[id] = type;
  }
  static find(id) {
    return this.getItems()[id] || null;
  }
}
const BAG_ID = "bagId";
const BAG_VALUE = "bagValue";
const BAG_ATTRIBUTES = "bagAttributes";
const CLEAR_PROPS$I = [
  BAG_ID,
  BAG_VALUE,
  BAG_ATTRIBUTES
];
class SafeBag extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.bagId = getParametersValue(parameters, BAG_ID, SafeBag.defaultValues(BAG_ID));
    this.bagValue = getParametersValue(parameters, BAG_VALUE, SafeBag.defaultValues(BAG_VALUE));
    if (BAG_ATTRIBUTES in parameters) {
      this.bagAttributes = getParametersValue(parameters, BAG_ATTRIBUTES, SafeBag.defaultValues(BAG_ATTRIBUTES));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case BAG_ID:
        return EMPTY_STRING;
      case BAG_VALUE:
        return new Any();
      case BAG_ATTRIBUTES:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case BAG_ID:
        return memberValue === EMPTY_STRING;
      case BAG_VALUE:
        return memberValue instanceof Any;
      case BAG_ATTRIBUTES:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.bagId || BAG_ID }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Any({ name: names.bagValue || BAG_VALUE })]
        }),
        new Set$1({
          optional: true,
          value: [
            new Repeated({
              name: names.bagAttributes || BAG_ATTRIBUTES,
              value: Attribute.schema()
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$I);
    const asn1 = compareSchema(schema, schema, SafeBag.schema({
      names: {
        bagId: BAG_ID,
        bagValue: BAG_VALUE,
        bagAttributes: BAG_ATTRIBUTES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.bagId = asn1.result.bagId.valueBlock.toString();
    const bagType = SafeBagValueFactory.find(this.bagId);
    if (!bagType) {
      throw new Error("Invalid BAG_ID for SafeBag: ".concat(this.bagId));
    }
    this.bagValue = new bagType({ schema: asn1.result.bagValue });
    if (BAG_ATTRIBUTES in asn1.result) {
      this.bagAttributes = Array.from(asn1.result.bagAttributes, (element) => new Attribute({ schema: element }));
    }
  }
  toSchema() {
    const outputArray = [
      new ObjectIdentifier({ value: this.bagId }),
      new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [this.bagValue.toSchema()]
      })
    ];
    if (this.bagAttributes) {
      outputArray.push(new Set$1({
        value: Array.from(this.bagAttributes, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const output = {
      bagId: this.bagId,
      bagValue: this.bagValue.toJSON()
    };
    if (this.bagAttributes) {
      output.bagAttributes = Array.from(this.bagAttributes, (o2) => o2.toJSON());
    }
    return output;
  }
}
SafeBag.CLASS_NAME = "SafeBag";
const SAFE_BUGS = "safeBags";
class SafeContents extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.safeBags = getParametersValue(parameters, SAFE_BUGS, SafeContents.defaultValues(SAFE_BUGS));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case SAFE_BUGS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case SAFE_BUGS:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.safeBags || EMPTY_STRING,
          value: SafeBag.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      SAFE_BUGS
    ]);
    const asn1 = compareSchema(schema, schema, SafeContents.schema({
      names: {
        safeBags: SAFE_BUGS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.safeBags = Array.from(asn1.result.safeBags, (element) => new SafeBag({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.safeBags, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      safeBags: Array.from(this.safeBags, (o2) => o2.toJSON())
    };
  }
}
SafeContents.CLASS_NAME = "SafeContents";
const OTHER_CERT_FORMAT = "otherCertFormat";
const OTHER_CERT = "otherCert";
const CLEAR_PROPS$H = [
  OTHER_CERT_FORMAT,
  OTHER_CERT
];
class OtherCertificateFormat extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.otherCertFormat = getParametersValue(parameters, OTHER_CERT_FORMAT, OtherCertificateFormat.defaultValues(OTHER_CERT_FORMAT));
    this.otherCert = getParametersValue(parameters, OTHER_CERT, OtherCertificateFormat.defaultValues(OTHER_CERT));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case OTHER_CERT_FORMAT:
        return EMPTY_STRING;
      case OTHER_CERT:
        return new Any();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.otherCertFormat || OTHER_CERT_FORMAT }),
        new Any({ name: names.otherCert || OTHER_CERT })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$H);
    const asn1 = compareSchema(schema, schema, OtherCertificateFormat.schema());
    AsnError.assertSchema(asn1, this.className);
    this.otherCertFormat = asn1.result.otherCertFormat.valueBlock.toString();
    this.otherCert = asn1.result.otherCert;
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.otherCertFormat }),
        this.otherCert
      ]
    });
  }
  toJSON() {
    const res = {
      otherCertFormat: this.otherCertFormat
    };
    if (!(this.otherCert instanceof Any)) {
      res.otherCert = this.otherCert.toJSON();
    }
    return res;
  }
}
const CERTIFICATES$1 = "certificates";
const CLEAR_PROPS$G = [
  CERTIFICATES$1
];
class CertificateSet extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.certificates = getParametersValue(parameters, CERTIFICATES$1, CertificateSet.defaultValues(CERTIFICATES$1));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CERTIFICATES$1:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Set$1({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.certificates || CERTIFICATES$1,
          value: new Choice({
            value: [
              Certificate.schema(),
              new Constructed({
                idBlock: {
                  tagClass: 3,
                  tagNumber: 0
                },
                value: [
                  new Any()
                ]
              }),
              new Constructed({
                idBlock: {
                  tagClass: 3,
                  tagNumber: 1
                },
                value: [
                  new Sequence()
                ]
              }),
              new Constructed({
                idBlock: {
                  tagClass: 3,
                  tagNumber: 2
                },
                value: AttributeCertificateV2.schema().valueBlock.value
              }),
              new Constructed({
                idBlock: {
                  tagClass: 3,
                  tagNumber: 3
                },
                value: OtherCertificateFormat.schema().valueBlock.value
              })
            ]
          })
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$G);
    const asn1 = compareSchema(schema, schema, CertificateSet.schema());
    AsnError.assertSchema(asn1, this.className);
    this.certificates = Array.from(asn1.result.certificates || [], (element) => {
      const initialTagNumber = element.idBlock.tagNumber;
      if (element.idBlock.tagClass === 1)
        return new Certificate({ schema: element });
      const elementSequence = new Sequence({
        value: element.valueBlock.value
      });
      switch (initialTagNumber) {
        case 1:
          if (elementSequence.valueBlock.value[0].valueBlock.value[0].valueBlock.valueDec === 1) {
            return new AttributeCertificateV2({ schema: elementSequence });
          } else {
            return new AttributeCertificateV1({ schema: elementSequence });
          }
        case 2:
          return new AttributeCertificateV2({ schema: elementSequence });
        case 3:
          return new OtherCertificateFormat({ schema: elementSequence });
      }
      return element;
    });
  }
  toSchema() {
    return new Set$1({
      value: Array.from(this.certificates, (element) => {
        switch (true) {
          case element instanceof Certificate:
            return element.toSchema();
          case element instanceof AttributeCertificateV1:
            return new Constructed({
              idBlock: {
                tagClass: 3,
                tagNumber: 1
              },
              value: element.toSchema().valueBlock.value
            });
          case element instanceof AttributeCertificateV2:
            return new Constructed({
              idBlock: {
                tagClass: 3,
                tagNumber: 2
              },
              value: element.toSchema().valueBlock.value
            });
          case element instanceof OtherCertificateFormat:
            return new Constructed({
              idBlock: {
                tagClass: 3,
                tagNumber: 3
              },
              value: element.toSchema().valueBlock.value
            });
        }
        return element.toSchema();
      })
    });
  }
  toJSON() {
    return {
      certificates: Array.from(this.certificates, (o2) => o2.toJSON())
    };
  }
}
CertificateSet.CLASS_NAME = "CertificateSet";
const OTHER_REV_INFO_FORMAT = "otherRevInfoFormat";
const OTHER_REV_INFO = "otherRevInfo";
const CLEAR_PROPS$F = [
  OTHER_REV_INFO_FORMAT,
  OTHER_REV_INFO
];
class OtherRevocationInfoFormat extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.otherRevInfoFormat = getParametersValue(parameters, OTHER_REV_INFO_FORMAT, OtherRevocationInfoFormat.defaultValues(OTHER_REV_INFO_FORMAT));
    this.otherRevInfo = getParametersValue(parameters, OTHER_REV_INFO, OtherRevocationInfoFormat.defaultValues(OTHER_REV_INFO));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case OTHER_REV_INFO_FORMAT:
        return EMPTY_STRING;
      case OTHER_REV_INFO:
        return new Any();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.otherRevInfoFormat || OTHER_REV_INFO_FORMAT }),
        new Any({ name: names.otherRevInfo || OTHER_REV_INFO })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$F);
    const asn1 = compareSchema(schema, schema, OtherRevocationInfoFormat.schema());
    AsnError.assertSchema(asn1, this.className);
    this.otherRevInfoFormat = asn1.result.otherRevInfoFormat.valueBlock.toString();
    this.otherRevInfo = asn1.result.otherRevInfo;
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.otherRevInfoFormat }),
        this.otherRevInfo
      ]
    });
  }
  toJSON() {
    const res = {
      otherRevInfoFormat: this.otherRevInfoFormat
    };
    if (!(this.otherRevInfo instanceof Any)) {
      res.otherRevInfo = this.otherRevInfo.toJSON();
    }
    return res;
  }
}
OtherRevocationInfoFormat.CLASS_NAME = "OtherRevocationInfoFormat";
const CRLS$3 = "crls";
const OTHER_REVOCATION_INFOS = "otherRevocationInfos";
const CLEAR_PROPS$E = [
  CRLS$3
];
class RevocationInfoChoices extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.crls = getParametersValue(parameters, CRLS$3, RevocationInfoChoices.defaultValues(CRLS$3));
    this.otherRevocationInfos = getParametersValue(parameters, OTHER_REVOCATION_INFOS, RevocationInfoChoices.defaultValues(OTHER_REVOCATION_INFOS));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CRLS$3:
        return [];
      case OTHER_REVOCATION_INFOS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Set$1({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.crls || EMPTY_STRING,
          value: new Choice({
            value: [
              CertificateRevocationList.schema(),
              new Constructed({
                idBlock: {
                  tagClass: 3,
                  tagNumber: 1
                },
                value: [
                  new ObjectIdentifier(),
                  new Any()
                ]
              })
            ]
          })
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$E);
    const asn1 = compareSchema(schema, schema, RevocationInfoChoices.schema({
      names: {
        crls: CRLS$3
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (asn1.result.crls) {
      for (const element of asn1.result.crls) {
        if (element.idBlock.tagClass === 1)
          this.crls.push(new CertificateRevocationList({ schema: element }));
        else
          this.otherRevocationInfos.push(new OtherRevocationInfoFormat({ schema: element }));
      }
    }
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(...Array.from(this.crls, (o2) => o2.toSchema()));
    outputArray.push(...Array.from(this.otherRevocationInfos, (element) => {
      const schema = element.toSchema();
      schema.idBlock.tagClass = 3;
      schema.idBlock.tagNumber = 1;
      return schema;
    }));
    return new Set$1({
      value: outputArray
    });
  }
  toJSON() {
    return {
      crls: Array.from(this.crls, (o2) => o2.toJSON()),
      otherRevocationInfos: Array.from(this.otherRevocationInfos, (o2) => o2.toJSON())
    };
  }
}
RevocationInfoChoices.CLASS_NAME = "RevocationInfoChoices";
const CERTS$3 = "certs";
const CRLS$2 = "crls";
const CLEAR_PROPS$D = [
  CERTS$3,
  CRLS$2
];
class OriginatorInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.crls = getParametersValue(parameters, CRLS$2, OriginatorInfo.defaultValues(CRLS$2));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CERTS$3:
        return new CertificateSet();
      case CRLS$2:
        return new RevocationInfoChoices();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case CERTS$3:
        return memberValue.certificates.length === 0;
      case CRLS$2:
        return memberValue.crls.length === 0 && memberValue.otherRevocationInfos.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Constructed({
          name: names.certs || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: CertificateSet.schema().valueBlock.value
        }),
        new Constructed({
          name: names.crls || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: RevocationInfoChoices.schema().valueBlock.value
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$D);
    const asn1 = compareSchema(schema, schema, OriginatorInfo.schema({
      names: {
        certs: CERTS$3,
        crls: CRLS$2
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (CERTS$3 in asn1.result) {
      this.certs = new CertificateSet({
        schema: new Set$1({
          value: asn1.result.certs.valueBlock.value
        })
      });
    }
    if (CRLS$2 in asn1.result) {
      this.crls = new RevocationInfoChoices({
        schema: new Set$1({
          value: asn1.result.crls.valueBlock.value
        })
      });
    }
  }
  toSchema() {
    const sequenceValue = [];
    if (this.certs) {
      sequenceValue.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: this.certs.toSchema().valueBlock.value
      }));
    }
    if (this.crls) {
      sequenceValue.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: this.crls.toSchema().valueBlock.value
      }));
    }
    return new Sequence({
      value: sequenceValue
    });
  }
  toJSON() {
    const res = {};
    if (this.certs) {
      res.certs = this.certs.toJSON();
    }
    if (this.crls) {
      res.crls = this.crls.toJSON();
    }
    return res;
  }
}
OriginatorInfo.CLASS_NAME = "OriginatorInfo";
const ISSUER = "issuer";
const SERIAL_NUMBER$2 = "serialNumber";
const CLEAR_PROPS$C = [
  ISSUER,
  SERIAL_NUMBER$2
];
class IssuerAndSerialNumber extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.issuer = getParametersValue(parameters, ISSUER, IssuerAndSerialNumber.defaultValues(ISSUER));
    this.serialNumber = getParametersValue(parameters, SERIAL_NUMBER$2, IssuerAndSerialNumber.defaultValues(SERIAL_NUMBER$2));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ISSUER:
        return new RelativeDistinguishedNames();
      case SERIAL_NUMBER$2:
        return new Integer();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        RelativeDistinguishedNames.schema(names.issuer || {}),
        new Integer({ name: names.serialNumber || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$C);
    const asn1 = compareSchema(schema, schema, IssuerAndSerialNumber.schema({
      names: {
        issuer: {
          names: {
            blockName: ISSUER
          }
        },
        serialNumber: SERIAL_NUMBER$2
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.issuer = new RelativeDistinguishedNames({ schema: asn1.result.issuer });
    this.serialNumber = asn1.result.serialNumber;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.issuer.toSchema(),
        this.serialNumber
      ]
    });
  }
  toJSON() {
    return {
      issuer: this.issuer.toJSON(),
      serialNumber: this.serialNumber.toJSON()
    };
  }
}
IssuerAndSerialNumber.CLASS_NAME = "IssuerAndSerialNumber";
const VARIANT$3 = "variant";
const VALUE$3 = "value";
const CLEAR_PROPS$B = [
  "blockName"
];
class RecipientIdentifier extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.variant = getParametersValue(parameters, VARIANT$3, RecipientIdentifier.defaultValues(VARIANT$3));
    if (VALUE$3 in parameters) {
      this.value = getParametersValue(parameters, VALUE$3, RecipientIdentifier.defaultValues(VALUE$3));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VARIANT$3:
        return -1;
      case VALUE$3:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VARIANT$3:
        return memberValue === -1;
      case VALUE$3:
        return Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Choice({
      value: [
        IssuerAndSerialNumber.schema({
          names: {
            blockName: names.blockName || EMPTY_STRING
          }
        }),
        new Primitive({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$B);
    const asn1 = compareSchema(schema, schema, RecipientIdentifier.schema({
      names: {
        blockName: "blockName"
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (asn1.result.blockName.idBlock.tagClass === 1) {
      this.variant = 1;
      this.value = new IssuerAndSerialNumber({ schema: asn1.result.blockName });
    } else {
      this.variant = 2;
      this.value = new OctetString$1({ valueHex: asn1.result.blockName.valueBlock.valueHex });
    }
  }
  toSchema() {
    switch (this.variant) {
      case 1:
        if (!(this.value instanceof IssuerAndSerialNumber)) {
          throw new Error("Incorrect type of RecipientIdentifier.value. It should be IssuerAndSerialNumber.");
        }
        return this.value.toSchema();
      case 2:
        if (!(this.value instanceof OctetString$1)) {
          throw new Error("Incorrect type of RecipientIdentifier.value. It should be ASN.1 OctetString.");
        }
        return new Primitive({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          valueHex: this.value.valueBlock.valueHexView
        });
      default:
        return new Any();
    }
  }
  toJSON() {
    const res = {
      variant: this.variant
    };
    if ((this.variant === 1 || this.variant === 2) && this.value) {
      res.value = this.value.toJSON();
    }
    return res;
  }
}
RecipientIdentifier.CLASS_NAME = "RecipientIdentifier";
const VERSION$c = "version";
const RID$1 = "rid";
const KEY_ENCRYPTION_ALGORITHM$3 = "keyEncryptionAlgorithm";
const ENCRYPTED_KEY$3 = "encryptedKey";
const RECIPIENT_CERTIFICATE$1 = "recipientCertificate";
const CLEAR_PROPS$A = [
  VERSION$c,
  RID$1,
  KEY_ENCRYPTION_ALGORITHM$3,
  ENCRYPTED_KEY$3
];
class KeyTransRecipientInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$c, KeyTransRecipientInfo.defaultValues(VERSION$c));
    this.rid = getParametersValue(parameters, RID$1, KeyTransRecipientInfo.defaultValues(RID$1));
    this.keyEncryptionAlgorithm = getParametersValue(parameters, KEY_ENCRYPTION_ALGORITHM$3, KeyTransRecipientInfo.defaultValues(KEY_ENCRYPTION_ALGORITHM$3));
    this.encryptedKey = getParametersValue(parameters, ENCRYPTED_KEY$3, KeyTransRecipientInfo.defaultValues(ENCRYPTED_KEY$3));
    this.recipientCertificate = getParametersValue(parameters, RECIPIENT_CERTIFICATE$1, KeyTransRecipientInfo.defaultValues(RECIPIENT_CERTIFICATE$1));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$c:
        return -1;
      case RID$1:
        return {};
      case KEY_ENCRYPTION_ALGORITHM$3:
        return new AlgorithmIdentifier();
      case ENCRYPTED_KEY$3:
        return new OctetString$1();
      case RECIPIENT_CERTIFICATE$1:
        return new Certificate();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$c:
        return memberValue === KeyTransRecipientInfo.defaultValues(VERSION$c);
      case RID$1:
        return Object.keys(memberValue).length === 0;
      case KEY_ENCRYPTION_ALGORITHM$3:
      case ENCRYPTED_KEY$3:
        return memberValue.isEqual(KeyTransRecipientInfo.defaultValues(memberName));
      case RECIPIENT_CERTIFICATE$1:
        return false;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        RecipientIdentifier.schema(names.rid || {}),
        AlgorithmIdentifier.schema(names.keyEncryptionAlgorithm || {}),
        new OctetString$1({ name: names.encryptedKey || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$A);
    const asn1 = compareSchema(schema, schema, KeyTransRecipientInfo.schema({
      names: {
        version: VERSION$c,
        rid: {
          names: {
            blockName: RID$1
          }
        },
        keyEncryptionAlgorithm: {
          names: {
            blockName: KEY_ENCRYPTION_ALGORITHM$3
          }
        },
        encryptedKey: ENCRYPTED_KEY$3
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    if (asn1.result.rid.idBlock.tagClass === 3) {
      this.rid = new OctetString$1({ valueHex: asn1.result.rid.valueBlock.valueHex });
    } else {
      this.rid = new IssuerAndSerialNumber({ schema: asn1.result.rid });
    }
    this.keyEncryptionAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.keyEncryptionAlgorithm });
    this.encryptedKey = asn1.result.encryptedKey;
  }
  toSchema() {
    const outputArray = [];
    if (this.rid instanceof IssuerAndSerialNumber) {
      this.version = 0;
      outputArray.push(new Integer({ value: this.version }));
      outputArray.push(this.rid.toSchema());
    } else {
      this.version = 2;
      outputArray.push(new Integer({ value: this.version }));
      outputArray.push(new Primitive({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        valueHex: this.rid.valueBlock.valueHexView
      }));
    }
    outputArray.push(this.keyEncryptionAlgorithm.toSchema());
    outputArray.push(this.encryptedKey);
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    return {
      version: this.version,
      rid: this.rid.toJSON(),
      keyEncryptionAlgorithm: this.keyEncryptionAlgorithm.toJSON(),
      encryptedKey: this.encryptedKey.toJSON()
    };
  }
}
KeyTransRecipientInfo.CLASS_NAME = "KeyTransRecipientInfo";
const ALGORITHM = "algorithm";
const PUBLIC_KEY = "publicKey";
const CLEAR_PROPS$z = [
  ALGORITHM,
  PUBLIC_KEY
];
class OriginatorPublicKey extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.algorithm = getParametersValue(parameters, ALGORITHM, OriginatorPublicKey.defaultValues(ALGORITHM));
    this.publicKey = getParametersValue(parameters, PUBLIC_KEY, OriginatorPublicKey.defaultValues(PUBLIC_KEY));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ALGORITHM:
        return new AlgorithmIdentifier();
      case PUBLIC_KEY:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case ALGORITHM:
      case PUBLIC_KEY:
        return memberValue.isEqual(OriginatorPublicKey.defaultValues(memberName));
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AlgorithmIdentifier.schema(names.algorithm || {}),
        new BitString$1({ name: names.publicKey || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$z);
    const asn1 = compareSchema(schema, schema, OriginatorPublicKey.schema({
      names: {
        algorithm: {
          names: {
            blockName: ALGORITHM
          }
        },
        publicKey: PUBLIC_KEY
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.algorithm = new AlgorithmIdentifier({ schema: asn1.result.algorithm });
    this.publicKey = asn1.result.publicKey;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.algorithm.toSchema(),
        this.publicKey
      ]
    });
  }
  toJSON() {
    return {
      algorithm: this.algorithm.toJSON(),
      publicKey: this.publicKey.toJSON()
    };
  }
}
OriginatorPublicKey.CLASS_NAME = "OriginatorPublicKey";
const VARIANT$2 = "variant";
const VALUE$2 = "value";
const CLEAR_PROPS$y = [
  "blockName"
];
class OriginatorIdentifierOrKey extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.variant = getParametersValue(parameters, VARIANT$2, OriginatorIdentifierOrKey.defaultValues(VARIANT$2));
    if (VALUE$2 in parameters) {
      this.value = getParametersValue(parameters, VALUE$2, OriginatorIdentifierOrKey.defaultValues(VALUE$2));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VARIANT$2:
        return -1;
      case VALUE$2:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VARIANT$2:
        return memberValue === -1;
      case VALUE$2:
        return Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Choice({
      value: [
        IssuerAndSerialNumber.schema({
          names: {
            blockName: names.blockName || EMPTY_STRING
          }
        }),
        new Primitive({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          name: names.blockName || EMPTY_STRING
        }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          name: names.blockName || EMPTY_STRING,
          value: OriginatorPublicKey.schema().valueBlock.value
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$y);
    const asn1 = compareSchema(schema, schema, OriginatorIdentifierOrKey.schema({
      names: {
        blockName: "blockName"
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (asn1.result.blockName.idBlock.tagClass === 1) {
      this.variant = 1;
      this.value = new IssuerAndSerialNumber({ schema: asn1.result.blockName });
    } else {
      if (asn1.result.blockName.idBlock.tagNumber === 0) {
        asn1.result.blockName.idBlock.tagClass = 1;
        asn1.result.blockName.idBlock.tagNumber = 4;
        this.variant = 2;
        this.value = asn1.result.blockName;
      } else {
        this.variant = 3;
        this.value = new OriginatorPublicKey({
          schema: new Sequence({
            value: asn1.result.blockName.valueBlock.value
          })
        });
      }
    }
  }
  toSchema() {
    switch (this.variant) {
      case 1:
        return this.value.toSchema();
      case 2:
        this.value.idBlock.tagClass = 3;
        this.value.idBlock.tagNumber = 0;
        return this.value;
      case 3: {
        const _schema = this.value.toSchema();
        _schema.idBlock.tagClass = 3;
        _schema.idBlock.tagNumber = 1;
        return _schema;
      }
      default:
        return new Any();
    }
  }
  toJSON() {
    const res = {
      variant: this.variant
    };
    if (this.variant === 1 || this.variant === 2 || this.variant === 3) {
      res.value = this.value.toJSON();
    }
    return res;
  }
}
OriginatorIdentifierOrKey.CLASS_NAME = "OriginatorIdentifierOrKey";
const KEY_ATTR_ID = "keyAttrId";
const KEY_ATTR = "keyAttr";
const CLEAR_PROPS$x = [
  KEY_ATTR_ID,
  KEY_ATTR
];
class OtherKeyAttribute extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.keyAttrId = getParametersValue(parameters, KEY_ATTR_ID, OtherKeyAttribute.defaultValues(KEY_ATTR_ID));
    if (KEY_ATTR in parameters) {
      this.keyAttr = getParametersValue(parameters, KEY_ATTR, OtherKeyAttribute.defaultValues(KEY_ATTR));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case KEY_ATTR_ID:
        return EMPTY_STRING;
      case KEY_ATTR:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case KEY_ATTR_ID:
        return typeof memberValue === "string" && memberValue === EMPTY_STRING;
      case KEY_ATTR:
        return Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      optional: names.optional || true,
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.keyAttrId || EMPTY_STRING }),
        new Any({
          optional: true,
          name: names.keyAttr || EMPTY_STRING
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$x);
    const asn1 = compareSchema(schema, schema, OtherKeyAttribute.schema({
      names: {
        keyAttrId: KEY_ATTR_ID,
        keyAttr: KEY_ATTR
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.keyAttrId = asn1.result.keyAttrId.valueBlock.toString();
    if (KEY_ATTR in asn1.result) {
      this.keyAttr = asn1.result.keyAttr;
    }
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new ObjectIdentifier({ value: this.keyAttrId }));
    if (KEY_ATTR in this) {
      outputArray.push(this.keyAttr);
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      keyAttrId: this.keyAttrId
    };
    if (KEY_ATTR in this) {
      res.keyAttr = this.keyAttr.toJSON();
    }
    return res;
  }
}
OtherKeyAttribute.CLASS_NAME = "OtherKeyAttribute";
const SUBJECT_KEY_IDENTIFIER = "subjectKeyIdentifier";
const DATE$1 = "date";
const OTHER$1 = "other";
const CLEAR_PROPS$w = [
  SUBJECT_KEY_IDENTIFIER,
  DATE$1,
  OTHER$1
];
class RecipientKeyIdentifier extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.subjectKeyIdentifier = getParametersValue(parameters, SUBJECT_KEY_IDENTIFIER, RecipientKeyIdentifier.defaultValues(SUBJECT_KEY_IDENTIFIER));
    if (DATE$1 in parameters) {
      this.date = getParametersValue(parameters, DATE$1, RecipientKeyIdentifier.defaultValues(DATE$1));
    }
    if (OTHER$1 in parameters) {
      this.other = getParametersValue(parameters, OTHER$1, RecipientKeyIdentifier.defaultValues(OTHER$1));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case SUBJECT_KEY_IDENTIFIER:
        return new OctetString$1();
      case DATE$1:
        return new GeneralizedTime();
      case OTHER$1:
        return new OtherKeyAttribute();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case SUBJECT_KEY_IDENTIFIER:
        return memberValue.isEqual(RecipientKeyIdentifier.defaultValues(SUBJECT_KEY_IDENTIFIER));
      case DATE$1:
        return memberValue.year === 0 && memberValue.month === 0 && memberValue.day === 0 && memberValue.hour === 0 && memberValue.minute === 0 && memberValue.second === 0 && memberValue.millisecond === 0;
      case OTHER$1:
        return memberValue.keyAttrId === EMPTY_STRING && "keyAttr" in memberValue === false;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new OctetString$1({ name: names.subjectKeyIdentifier || EMPTY_STRING }),
        new GeneralizedTime({
          optional: true,
          name: names.date || EMPTY_STRING
        }),
        OtherKeyAttribute.schema(names.other || {})
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$w);
    const asn1 = compareSchema(schema, schema, RecipientKeyIdentifier.schema({
      names: {
        subjectKeyIdentifier: SUBJECT_KEY_IDENTIFIER,
        date: DATE$1,
        other: {
          names: {
            blockName: OTHER$1
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.subjectKeyIdentifier = asn1.result.subjectKeyIdentifier;
    if (DATE$1 in asn1.result)
      this.date = asn1.result.date;
    if (OTHER$1 in asn1.result)
      this.other = new OtherKeyAttribute({ schema: asn1.result.other });
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.subjectKeyIdentifier);
    if (this.date) {
      outputArray.push(this.date);
    }
    if (this.other) {
      outputArray.push(this.other.toSchema());
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      subjectKeyIdentifier: this.subjectKeyIdentifier.toJSON()
    };
    if (this.date) {
      res.date = this.date.toJSON();
    }
    if (this.other) {
      res.other = this.other.toJSON();
    }
    return res;
  }
}
RecipientKeyIdentifier.CLASS_NAME = "RecipientKeyIdentifier";
const VARIANT$1 = "variant";
const VALUE$1 = "value";
const CLEAR_PROPS$v = [
  "blockName"
];
class KeyAgreeRecipientIdentifier extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.variant = getParametersValue(parameters, VARIANT$1, KeyAgreeRecipientIdentifier.defaultValues(VARIANT$1));
    this.value = getParametersValue(parameters, VALUE$1, KeyAgreeRecipientIdentifier.defaultValues(VALUE$1));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VARIANT$1:
        return -1;
      case VALUE$1:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VARIANT$1:
        return memberValue === -1;
      case VALUE$1:
        return Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Choice({
      value: [
        IssuerAndSerialNumber.schema(names.issuerAndSerialNumber || {
          names: {
            blockName: names.blockName || EMPTY_STRING
          }
        }),
        new Constructed({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: RecipientKeyIdentifier.schema(names.rKeyId || {
            names: {
              blockName: names.blockName || EMPTY_STRING
            }
          }).valueBlock.value
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$v);
    const asn1 = compareSchema(schema, schema, KeyAgreeRecipientIdentifier.schema({
      names: {
        blockName: "blockName"
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (asn1.result.blockName.idBlock.tagClass === 1) {
      this.variant = 1;
      this.value = new IssuerAndSerialNumber({ schema: asn1.result.blockName });
    } else {
      this.variant = 2;
      this.value = new RecipientKeyIdentifier({
        schema: new Sequence({
          value: asn1.result.blockName.valueBlock.value
        })
      });
    }
  }
  toSchema() {
    switch (this.variant) {
      case 1:
        return this.value.toSchema();
      case 2:
        return new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: this.value.toSchema().valueBlock.value
        });
      default:
        return new Any();
    }
  }
  toJSON() {
    const res = {
      variant: this.variant
    };
    if (this.variant === 1 || this.variant === 2) {
      res.value = this.value.toJSON();
    }
    return res;
  }
}
KeyAgreeRecipientIdentifier.CLASS_NAME = "KeyAgreeRecipientIdentifier";
const RID = "rid";
const ENCRYPTED_KEY$2 = "encryptedKey";
const CLEAR_PROPS$u = [
  RID,
  ENCRYPTED_KEY$2
];
class RecipientEncryptedKey extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.rid = getParametersValue(parameters, RID, RecipientEncryptedKey.defaultValues(RID));
    this.encryptedKey = getParametersValue(parameters, ENCRYPTED_KEY$2, RecipientEncryptedKey.defaultValues(ENCRYPTED_KEY$2));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case RID:
        return new KeyAgreeRecipientIdentifier();
      case ENCRYPTED_KEY$2:
        return new OctetString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case RID:
        return memberValue.variant === -1 && "value" in memberValue === false;
      case ENCRYPTED_KEY$2:
        return memberValue.isEqual(RecipientEncryptedKey.defaultValues(ENCRYPTED_KEY$2));
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        KeyAgreeRecipientIdentifier.schema(names.rid || {}),
        new OctetString$1({ name: names.encryptedKey || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$u);
    const asn1 = compareSchema(schema, schema, RecipientEncryptedKey.schema({
      names: {
        rid: {
          names: {
            blockName: RID
          }
        },
        encryptedKey: ENCRYPTED_KEY$2
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.rid = new KeyAgreeRecipientIdentifier({ schema: asn1.result.rid });
    this.encryptedKey = asn1.result.encryptedKey;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.rid.toSchema(),
        this.encryptedKey
      ]
    });
  }
  toJSON() {
    return {
      rid: this.rid.toJSON(),
      encryptedKey: this.encryptedKey.toJSON()
    };
  }
}
RecipientEncryptedKey.CLASS_NAME = "RecipientEncryptedKey";
const ENCRYPTED_KEYS = "encryptedKeys";
const RECIPIENT_ENCRYPTED_KEYS = "RecipientEncryptedKeys";
const CLEAR_PROPS$t = [
  RECIPIENT_ENCRYPTED_KEYS
];
class RecipientEncryptedKeys extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.encryptedKeys = getParametersValue(parameters, ENCRYPTED_KEYS, RecipientEncryptedKeys.defaultValues(ENCRYPTED_KEYS));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ENCRYPTED_KEYS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case ENCRYPTED_KEYS:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.RecipientEncryptedKeys || EMPTY_STRING,
          value: RecipientEncryptedKey.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$t);
    const asn1 = compareSchema(schema, schema, RecipientEncryptedKeys.schema({
      names: {
        RecipientEncryptedKeys: RECIPIENT_ENCRYPTED_KEYS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.encryptedKeys = Array.from(asn1.result.RecipientEncryptedKeys, (element) => new RecipientEncryptedKey({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.encryptedKeys, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      encryptedKeys: Array.from(this.encryptedKeys, (o2) => o2.toJSON())
    };
  }
}
RecipientEncryptedKeys.CLASS_NAME = "RecipientEncryptedKeys";
const VERSION$b = "version";
const ORIGINATOR = "originator";
const UKM = "ukm";
const KEY_ENCRYPTION_ALGORITHM$2 = "keyEncryptionAlgorithm";
const RECIPIENT_ENCRYPTED_KEY = "recipientEncryptedKeys";
const RECIPIENT_CERTIFICATE = "recipientCertificate";
const RECIPIENT_PUBLIC_KEY = "recipientPublicKey";
const CLEAR_PROPS$s = [
  VERSION$b,
  ORIGINATOR,
  UKM,
  KEY_ENCRYPTION_ALGORITHM$2,
  RECIPIENT_ENCRYPTED_KEY
];
class KeyAgreeRecipientInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$b, KeyAgreeRecipientInfo.defaultValues(VERSION$b));
    this.originator = getParametersValue(parameters, ORIGINATOR, KeyAgreeRecipientInfo.defaultValues(ORIGINATOR));
    if (UKM in parameters) {
      this.ukm = getParametersValue(parameters, UKM, KeyAgreeRecipientInfo.defaultValues(UKM));
    }
    this.keyEncryptionAlgorithm = getParametersValue(parameters, KEY_ENCRYPTION_ALGORITHM$2, KeyAgreeRecipientInfo.defaultValues(KEY_ENCRYPTION_ALGORITHM$2));
    this.recipientEncryptedKeys = getParametersValue(parameters, RECIPIENT_ENCRYPTED_KEY, KeyAgreeRecipientInfo.defaultValues(RECIPIENT_ENCRYPTED_KEY));
    this.recipientCertificate = getParametersValue(parameters, RECIPIENT_CERTIFICATE, KeyAgreeRecipientInfo.defaultValues(RECIPIENT_CERTIFICATE));
    this.recipientPublicKey = getParametersValue(parameters, RECIPIENT_PUBLIC_KEY, KeyAgreeRecipientInfo.defaultValues(RECIPIENT_PUBLIC_KEY));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$b:
        return 0;
      case ORIGINATOR:
        return new OriginatorIdentifierOrKey();
      case UKM:
        return new OctetString$1();
      case KEY_ENCRYPTION_ALGORITHM$2:
        return new AlgorithmIdentifier();
      case RECIPIENT_ENCRYPTED_KEY:
        return new RecipientEncryptedKeys();
      case RECIPIENT_CERTIFICATE:
        return new Certificate();
      case RECIPIENT_PUBLIC_KEY:
        return null;
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$b:
        return memberValue === 0;
      case ORIGINATOR:
        return memberValue.variant === -1 && "value" in memberValue === false;
      case UKM:
        return memberValue.isEqual(KeyAgreeRecipientInfo.defaultValues(UKM));
      case KEY_ENCRYPTION_ALGORITHM$2:
        return memberValue.algorithmId === EMPTY_STRING && "algorithmParams" in memberValue === false;
      case RECIPIENT_ENCRYPTED_KEY:
        return memberValue.encryptedKeys.length === 0;
      case RECIPIENT_CERTIFICATE:
        return false;
      case RECIPIENT_PUBLIC_KEY:
        return false;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            OriginatorIdentifierOrKey.schema(names.originator || {})
          ]
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [new OctetString$1({ name: names.ukm || EMPTY_STRING })]
        }),
        AlgorithmIdentifier.schema(names.keyEncryptionAlgorithm || {}),
        RecipientEncryptedKeys.schema(names.recipientEncryptedKeys || {})
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$s);
    const asn1 = compareSchema(schema, schema, KeyAgreeRecipientInfo.schema({
      names: {
        version: VERSION$b,
        originator: {
          names: {
            blockName: ORIGINATOR
          }
        },
        ukm: UKM,
        keyEncryptionAlgorithm: {
          names: {
            blockName: KEY_ENCRYPTION_ALGORITHM$2
          }
        },
        recipientEncryptedKeys: {
          names: {
            blockName: RECIPIENT_ENCRYPTED_KEY
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    this.originator = new OriginatorIdentifierOrKey({ schema: asn1.result.originator });
    if (UKM in asn1.result)
      this.ukm = asn1.result.ukm;
    this.keyEncryptionAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.keyEncryptionAlgorithm });
    this.recipientEncryptedKeys = new RecipientEncryptedKeys({ schema: asn1.result.recipientEncryptedKeys });
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new Integer({ value: this.version }));
    outputArray.push(new Constructed({
      idBlock: {
        tagClass: 3,
        tagNumber: 0
      },
      value: [this.originator.toSchema()]
    }));
    if (this.ukm) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: [this.ukm]
      }));
    }
    outputArray.push(this.keyEncryptionAlgorithm.toSchema());
    outputArray.push(this.recipientEncryptedKeys.toSchema());
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      version: this.version,
      originator: this.originator.toJSON(),
      keyEncryptionAlgorithm: this.keyEncryptionAlgorithm.toJSON(),
      recipientEncryptedKeys: this.recipientEncryptedKeys.toJSON()
    };
    if (this.ukm) {
      res.ukm = this.ukm.toJSON();
    }
    return res;
  }
}
KeyAgreeRecipientInfo.CLASS_NAME = "KeyAgreeRecipientInfo";
const KEY_IDENTIFIER = "keyIdentifier";
const DATE = "date";
const OTHER = "other";
const CLEAR_PROPS$r = [
  KEY_IDENTIFIER,
  DATE,
  OTHER
];
class KEKIdentifier extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.keyIdentifier = getParametersValue(parameters, KEY_IDENTIFIER, KEKIdentifier.defaultValues(KEY_IDENTIFIER));
    if (DATE in parameters) {
      this.date = getParametersValue(parameters, DATE, KEKIdentifier.defaultValues(DATE));
    }
    if (OTHER in parameters) {
      this.other = getParametersValue(parameters, OTHER, KEKIdentifier.defaultValues(OTHER));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case KEY_IDENTIFIER:
        return new OctetString$1();
      case DATE:
        return new GeneralizedTime();
      case OTHER:
        return new OtherKeyAttribute();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case KEY_IDENTIFIER:
        return memberValue.isEqual(KEKIdentifier.defaultValues(KEY_IDENTIFIER));
      case DATE:
        return memberValue.year === 0 && memberValue.month === 0 && memberValue.day === 0 && memberValue.hour === 0 && memberValue.minute === 0 && memberValue.second === 0 && memberValue.millisecond === 0;
      case OTHER:
        return memberValue.compareWithDefault("keyAttrId", memberValue.keyAttrId) && "keyAttr" in memberValue === false;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new OctetString$1({ name: names.keyIdentifier || EMPTY_STRING }),
        new GeneralizedTime({
          optional: true,
          name: names.date || EMPTY_STRING
        }),
        OtherKeyAttribute.schema(names.other || {})
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$r);
    const asn1 = compareSchema(schema, schema, KEKIdentifier.schema({
      names: {
        keyIdentifier: KEY_IDENTIFIER,
        date: DATE,
        other: {
          names: {
            blockName: OTHER
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.keyIdentifier = asn1.result.keyIdentifier;
    if (DATE in asn1.result)
      this.date = asn1.result.date;
    if (OTHER in asn1.result)
      this.other = new OtherKeyAttribute({ schema: asn1.result.other });
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.keyIdentifier);
    if (this.date) {
      outputArray.push(this.date);
    }
    if (this.other) {
      outputArray.push(this.other.toSchema());
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      keyIdentifier: this.keyIdentifier.toJSON()
    };
    if (this.date) {
      res.date = this.date;
    }
    if (this.other) {
      res.other = this.other.toJSON();
    }
    return res;
  }
}
KEKIdentifier.CLASS_NAME = "KEKIdentifier";
const VERSION$a = "version";
const KEK_ID = "kekid";
const KEY_ENCRYPTION_ALGORITHM$1 = "keyEncryptionAlgorithm";
const ENCRYPTED_KEY$1 = "encryptedKey";
const PER_DEFINED_KEK = "preDefinedKEK";
const CLEAR_PROPS$q = [
  VERSION$a,
  KEK_ID,
  KEY_ENCRYPTION_ALGORITHM$1,
  ENCRYPTED_KEY$1
];
class KEKRecipientInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$a, KEKRecipientInfo.defaultValues(VERSION$a));
    this.kekid = getParametersValue(parameters, KEK_ID, KEKRecipientInfo.defaultValues(KEK_ID));
    this.keyEncryptionAlgorithm = getParametersValue(parameters, KEY_ENCRYPTION_ALGORITHM$1, KEKRecipientInfo.defaultValues(KEY_ENCRYPTION_ALGORITHM$1));
    this.encryptedKey = getParametersValue(parameters, ENCRYPTED_KEY$1, KEKRecipientInfo.defaultValues(ENCRYPTED_KEY$1));
    this.preDefinedKEK = getParametersValue(parameters, PER_DEFINED_KEK, KEKRecipientInfo.defaultValues(PER_DEFINED_KEK));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$a:
        return 0;
      case KEK_ID:
        return new KEKIdentifier();
      case KEY_ENCRYPTION_ALGORITHM$1:
        return new AlgorithmIdentifier();
      case ENCRYPTED_KEY$1:
        return new OctetString$1();
      case PER_DEFINED_KEK:
        return EMPTY_BUFFER;
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case "KEKRecipientInfo":
        return memberValue === KEKRecipientInfo.defaultValues(VERSION$a);
      case KEK_ID:
        return memberValue.compareWithDefault("keyIdentifier", memberValue.keyIdentifier) && "date" in memberValue === false && "other" in memberValue === false;
      case KEY_ENCRYPTION_ALGORITHM$1:
        return memberValue.algorithmId === EMPTY_STRING && "algorithmParams" in memberValue === false;
      case ENCRYPTED_KEY$1:
        return memberValue.isEqual(KEKRecipientInfo.defaultValues(ENCRYPTED_KEY$1));
      case PER_DEFINED_KEK:
        return memberValue.byteLength === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        KEKIdentifier.schema(names.kekid || {}),
        AlgorithmIdentifier.schema(names.keyEncryptionAlgorithm || {}),
        new OctetString$1({ name: names.encryptedKey || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$q);
    const asn1 = compareSchema(schema, schema, KEKRecipientInfo.schema({
      names: {
        version: VERSION$a,
        kekid: {
          names: {
            blockName: KEK_ID
          }
        },
        keyEncryptionAlgorithm: {
          names: {
            blockName: KEY_ENCRYPTION_ALGORITHM$1
          }
        },
        encryptedKey: ENCRYPTED_KEY$1
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    this.kekid = new KEKIdentifier({ schema: asn1.result.kekid });
    this.keyEncryptionAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.keyEncryptionAlgorithm });
    this.encryptedKey = asn1.result.encryptedKey;
  }
  toSchema() {
    return new Sequence({
      value: [
        new Integer({ value: this.version }),
        this.kekid.toSchema(),
        this.keyEncryptionAlgorithm.toSchema(),
        this.encryptedKey
      ]
    });
  }
  toJSON() {
    return {
      version: this.version,
      kekid: this.kekid.toJSON(),
      keyEncryptionAlgorithm: this.keyEncryptionAlgorithm.toJSON(),
      encryptedKey: this.encryptedKey.toJSON()
    };
  }
}
KEKRecipientInfo.CLASS_NAME = "KEKRecipientInfo";
const VERSION$9 = "version";
const KEY_DERIVATION_ALGORITHM = "keyDerivationAlgorithm";
const KEY_ENCRYPTION_ALGORITHM = "keyEncryptionAlgorithm";
const ENCRYPTED_KEY = "encryptedKey";
const PASSWORD = "password";
const CLEAR_PROPS$p = [
  VERSION$9,
  KEY_DERIVATION_ALGORITHM,
  KEY_ENCRYPTION_ALGORITHM,
  ENCRYPTED_KEY
];
class PasswordRecipientinfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$9, PasswordRecipientinfo.defaultValues(VERSION$9));
    if (KEY_DERIVATION_ALGORITHM in parameters) {
      this.keyDerivationAlgorithm = getParametersValue(parameters, KEY_DERIVATION_ALGORITHM, PasswordRecipientinfo.defaultValues(KEY_DERIVATION_ALGORITHM));
    }
    this.keyEncryptionAlgorithm = getParametersValue(parameters, KEY_ENCRYPTION_ALGORITHM, PasswordRecipientinfo.defaultValues(KEY_ENCRYPTION_ALGORITHM));
    this.encryptedKey = getParametersValue(parameters, ENCRYPTED_KEY, PasswordRecipientinfo.defaultValues(ENCRYPTED_KEY));
    this.password = getParametersValue(parameters, PASSWORD, PasswordRecipientinfo.defaultValues(PASSWORD));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$9:
        return -1;
      case KEY_DERIVATION_ALGORITHM:
        return new AlgorithmIdentifier();
      case KEY_ENCRYPTION_ALGORITHM:
        return new AlgorithmIdentifier();
      case ENCRYPTED_KEY:
        return new OctetString$1();
      case PASSWORD:
        return EMPTY_BUFFER;
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$9:
        return memberValue === -1;
      case KEY_DERIVATION_ALGORITHM:
      case KEY_ENCRYPTION_ALGORITHM:
        return memberValue.algorithmId === EMPTY_STRING && "algorithmParams" in memberValue === false;
      case ENCRYPTED_KEY:
        return memberValue.isEqual(PasswordRecipientinfo.defaultValues(ENCRYPTED_KEY));
      case PASSWORD:
        return memberValue.byteLength === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        new Constructed({
          name: names.keyDerivationAlgorithm || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: AlgorithmIdentifier.schema().valueBlock.value
        }),
        AlgorithmIdentifier.schema(names.keyEncryptionAlgorithm || {}),
        new OctetString$1({ name: names.encryptedKey || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$p);
    const asn1 = compareSchema(schema, schema, PasswordRecipientinfo.schema({
      names: {
        version: VERSION$9,
        keyDerivationAlgorithm: KEY_DERIVATION_ALGORITHM,
        keyEncryptionAlgorithm: {
          names: {
            blockName: KEY_ENCRYPTION_ALGORITHM
          }
        },
        encryptedKey: ENCRYPTED_KEY
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    if (KEY_DERIVATION_ALGORITHM in asn1.result) {
      this.keyDerivationAlgorithm = new AlgorithmIdentifier({
        schema: new Sequence({
          value: asn1.result.keyDerivationAlgorithm.valueBlock.value
        })
      });
    }
    this.keyEncryptionAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.keyEncryptionAlgorithm });
    this.encryptedKey = asn1.result.encryptedKey;
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new Integer({ value: this.version }));
    if (this.keyDerivationAlgorithm) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: this.keyDerivationAlgorithm.toSchema().valueBlock.value
      }));
    }
    outputArray.push(this.keyEncryptionAlgorithm.toSchema());
    outputArray.push(this.encryptedKey);
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      version: this.version,
      keyEncryptionAlgorithm: this.keyEncryptionAlgorithm.toJSON(),
      encryptedKey: this.encryptedKey.toJSON()
    };
    if (this.keyDerivationAlgorithm) {
      res.keyDerivationAlgorithm = this.keyDerivationAlgorithm.toJSON();
    }
    return res;
  }
}
PasswordRecipientinfo.CLASS_NAME = "PasswordRecipientInfo";
const ORI_TYPE = "oriType";
const ORI_VALUE = "oriValue";
const CLEAR_PROPS$o = [
  ORI_TYPE,
  ORI_VALUE
];
class OtherRecipientInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.oriType = getParametersValue(parameters, ORI_TYPE, OtherRecipientInfo.defaultValues(ORI_TYPE));
    this.oriValue = getParametersValue(parameters, ORI_VALUE, OtherRecipientInfo.defaultValues(ORI_VALUE));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case ORI_TYPE:
        return EMPTY_STRING;
      case ORI_VALUE:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case ORI_TYPE:
        return memberValue === EMPTY_STRING;
      case ORI_VALUE:
        return Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.oriType || EMPTY_STRING }),
        new Any({ name: names.oriValue || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$o);
    const asn1 = compareSchema(schema, schema, OtherRecipientInfo.schema({
      names: {
        oriType: ORI_TYPE,
        oriValue: ORI_VALUE
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.oriType = asn1.result.oriType.valueBlock.toString();
    this.oriValue = asn1.result.oriValue;
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.oriType }),
        this.oriValue
      ]
    });
  }
  toJSON() {
    const res = {
      oriType: this.oriType
    };
    if (!OtherRecipientInfo.compareWithDefault(ORI_VALUE, this.oriValue)) {
      res.oriValue = this.oriValue.toJSON();
    }
    return res;
  }
}
OtherRecipientInfo.CLASS_NAME = "OtherRecipientInfo";
const VARIANT = "variant";
const VALUE = "value";
const CLEAR_PROPS$n = [
  "blockName"
];
class RecipientInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.variant = getParametersValue(parameters, VARIANT, RecipientInfo.defaultValues(VARIANT));
    if (VALUE in parameters) {
      this.value = getParametersValue(parameters, VALUE, RecipientInfo.defaultValues(VALUE));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VARIANT:
        return -1;
      case VALUE:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VARIANT:
        return memberValue === RecipientInfo.defaultValues(memberName);
      case VALUE:
        return Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Choice({
      value: [
        KeyTransRecipientInfo.schema({
          names: {
            blockName: names.blockName || EMPTY_STRING
          }
        }),
        new Constructed({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: KeyAgreeRecipientInfo.schema().valueBlock.value
        }),
        new Constructed({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          },
          value: KEKRecipientInfo.schema().valueBlock.value
        }),
        new Constructed({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 3
          },
          value: PasswordRecipientinfo.schema().valueBlock.value
        }),
        new Constructed({
          name: names.blockName || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 4
          },
          value: OtherRecipientInfo.schema().valueBlock.value
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$n);
    const asn1 = compareSchema(schema, schema, RecipientInfo.schema({
      names: {
        blockName: "blockName"
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (asn1.result.blockName.idBlock.tagClass === 1) {
      this.variant = 1;
      this.value = new KeyTransRecipientInfo({ schema: asn1.result.blockName });
    } else {
      const blockSequence = new Sequence({
        value: asn1.result.blockName.valueBlock.value
      });
      switch (asn1.result.blockName.idBlock.tagNumber) {
        case 1:
          this.variant = 2;
          this.value = new KeyAgreeRecipientInfo({ schema: blockSequence });
          break;
        case 2:
          this.variant = 3;
          this.value = new KEKRecipientInfo({ schema: blockSequence });
          break;
        case 3:
          this.variant = 4;
          this.value = new PasswordRecipientinfo({ schema: blockSequence });
          break;
        case 4:
          this.variant = 5;
          this.value = new OtherRecipientInfo({ schema: blockSequence });
          break;
        default:
          throw new Error("Incorrect structure of RecipientInfo block");
      }
    }
  }
  toSchema() {
    ParameterError.assertEmpty(this.value, "value", "RecipientInfo");
    const _schema = this.value.toSchema();
    switch (this.variant) {
      case 1:
        return _schema;
      case 2:
      case 3:
      case 4:
        _schema.idBlock.tagClass = 3;
        _schema.idBlock.tagNumber = this.variant - 1;
        return _schema;
      default:
        return new Any();
    }
  }
  toJSON() {
    const res = {
      variant: this.variant
    };
    if (this.value && this.variant >= 1 && this.variant <= 4) {
      res.value = this.value.toJSON();
    }
    return res;
  }
}
RecipientInfo.CLASS_NAME = "RecipientInfo";
const HASH_ALGORITHM$2 = "hashAlgorithm";
const MASK_GEN_ALGORITHM = "maskGenAlgorithm";
const P_SOURCE_ALGORITHM = "pSourceAlgorithm";
const CLEAR_PROPS$m = [
  HASH_ALGORITHM$2,
  MASK_GEN_ALGORITHM,
  P_SOURCE_ALGORITHM
];
class RSAESOAEPParams extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.hashAlgorithm = getParametersValue(parameters, HASH_ALGORITHM$2, RSAESOAEPParams.defaultValues(HASH_ALGORITHM$2));
    this.maskGenAlgorithm = getParametersValue(parameters, MASK_GEN_ALGORITHM, RSAESOAEPParams.defaultValues(MASK_GEN_ALGORITHM));
    this.pSourceAlgorithm = getParametersValue(parameters, P_SOURCE_ALGORITHM, RSAESOAEPParams.defaultValues(P_SOURCE_ALGORITHM));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case HASH_ALGORITHM$2:
        return new AlgorithmIdentifier({
          algorithmId: "1.3.14.3.2.26",
          algorithmParams: new Null()
        });
      case MASK_GEN_ALGORITHM:
        return new AlgorithmIdentifier({
          algorithmId: "1.2.840.113549.1.1.8",
          algorithmParams: new AlgorithmIdentifier({
            algorithmId: "1.3.14.3.2.26",
            algorithmParams: new Null()
          }).toSchema()
        });
      case P_SOURCE_ALGORITHM:
        return new AlgorithmIdentifier({
          algorithmId: "1.2.840.113549.1.1.9",
          algorithmParams: new OctetString$1({ valueHex: new Uint8Array([218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9]).buffer })
        });
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          optional: true,
          value: [AlgorithmIdentifier.schema(names.hashAlgorithm || {})]
        }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          optional: true,
          value: [AlgorithmIdentifier.schema(names.maskGenAlgorithm || {})]
        }),
        new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          },
          optional: true,
          value: [AlgorithmIdentifier.schema(names.pSourceAlgorithm || {})]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$m);
    const asn1 = compareSchema(schema, schema, RSAESOAEPParams.schema({
      names: {
        hashAlgorithm: {
          names: {
            blockName: HASH_ALGORITHM$2
          }
        },
        maskGenAlgorithm: {
          names: {
            blockName: MASK_GEN_ALGORITHM
          }
        },
        pSourceAlgorithm: {
          names: {
            blockName: P_SOURCE_ALGORITHM
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    if (HASH_ALGORITHM$2 in asn1.result)
      this.hashAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.hashAlgorithm });
    if (MASK_GEN_ALGORITHM in asn1.result)
      this.maskGenAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.maskGenAlgorithm });
    if (P_SOURCE_ALGORITHM in asn1.result)
      this.pSourceAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.pSourceAlgorithm });
  }
  toSchema() {
    const outputArray = [];
    if (!this.hashAlgorithm.isEqual(RSAESOAEPParams.defaultValues(HASH_ALGORITHM$2))) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [this.hashAlgorithm.toSchema()]
      }));
    }
    if (!this.maskGenAlgorithm.isEqual(RSAESOAEPParams.defaultValues(MASK_GEN_ALGORITHM))) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: [this.maskGenAlgorithm.toSchema()]
      }));
    }
    if (!this.pSourceAlgorithm.isEqual(RSAESOAEPParams.defaultValues(P_SOURCE_ALGORITHM))) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 2
        },
        value: [this.pSourceAlgorithm.toSchema()]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {};
    if (!this.hashAlgorithm.isEqual(RSAESOAEPParams.defaultValues(HASH_ALGORITHM$2))) {
      res.hashAlgorithm = this.hashAlgorithm.toJSON();
    }
    if (!this.maskGenAlgorithm.isEqual(RSAESOAEPParams.defaultValues(MASK_GEN_ALGORITHM))) {
      res.maskGenAlgorithm = this.maskGenAlgorithm.toJSON();
    }
    if (!this.pSourceAlgorithm.isEqual(RSAESOAEPParams.defaultValues(P_SOURCE_ALGORITHM))) {
      res.pSourceAlgorithm = this.pSourceAlgorithm.toJSON();
    }
    return res;
  }
}
RSAESOAEPParams.CLASS_NAME = "RSAESOAEPParams";
const KEY_INFO = "keyInfo";
const ENTITY_U_INFO = "entityUInfo";
const SUPP_PUB_INFO = "suppPubInfo";
const CLEAR_PROPS$l = [
  KEY_INFO,
  ENTITY_U_INFO,
  SUPP_PUB_INFO
];
class ECCCMSSharedInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.keyInfo = getParametersValue(parameters, KEY_INFO, ECCCMSSharedInfo.defaultValues(KEY_INFO));
    if (ENTITY_U_INFO in parameters) {
      this.entityUInfo = getParametersValue(parameters, ENTITY_U_INFO, ECCCMSSharedInfo.defaultValues(ENTITY_U_INFO));
    }
    this.suppPubInfo = getParametersValue(parameters, SUPP_PUB_INFO, ECCCMSSharedInfo.defaultValues(SUPP_PUB_INFO));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case KEY_INFO:
        return new AlgorithmIdentifier();
      case ENTITY_U_INFO:
        return new OctetString$1();
      case SUPP_PUB_INFO:
        return new OctetString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case KEY_INFO:
      case ENTITY_U_INFO:
      case SUPP_PUB_INFO:
        return memberValue.isEqual(ECCCMSSharedInfo.defaultValues(memberName));
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AlgorithmIdentifier.schema(names.keyInfo || {}),
        new Constructed({
          name: names.entityUInfo || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          optional: true,
          value: [new OctetString$1()]
        }),
        new Constructed({
          name: names.suppPubInfo || EMPTY_STRING,
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          },
          value: [new OctetString$1()]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$l);
    const asn1 = compareSchema(schema, schema, ECCCMSSharedInfo.schema({
      names: {
        keyInfo: {
          names: {
            blockName: KEY_INFO
          }
        },
        entityUInfo: ENTITY_U_INFO,
        suppPubInfo: SUPP_PUB_INFO
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.keyInfo = new AlgorithmIdentifier({ schema: asn1.result.keyInfo });
    if (ENTITY_U_INFO in asn1.result)
      this.entityUInfo = asn1.result.entityUInfo.valueBlock.value[0];
    this.suppPubInfo = asn1.result.suppPubInfo.valueBlock.value[0];
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.keyInfo.toSchema());
    if (this.entityUInfo) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [this.entityUInfo]
      }));
    }
    outputArray.push(new Constructed({
      idBlock: {
        tagClass: 3,
        tagNumber: 2
      },
      value: [this.suppPubInfo]
    }));
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      keyInfo: this.keyInfo.toJSON(),
      suppPubInfo: this.suppPubInfo.toJSON()
    };
    if (this.entityUInfo) {
      res.entityUInfo = this.entityUInfo.toJSON();
    }
    return res;
  }
}
ECCCMSSharedInfo.CLASS_NAME = "ECCCMSSharedInfo";
const VERSION$8 = "version";
const ORIGINATOR_INFO = "originatorInfo";
const RECIPIENT_INFOS = "recipientInfos";
const ENCRYPTED_CONTENT_INFO = "encryptedContentInfo";
const UNPROTECTED_ATTRS = "unprotectedAttrs";
const CLEAR_PROPS$k = [
  VERSION$8,
  ORIGINATOR_INFO,
  RECIPIENT_INFOS,
  ENCRYPTED_CONTENT_INFO,
  UNPROTECTED_ATTRS
];
const defaultEncryptionParams = {
  kdfAlgorithm: "SHA-512",
  kekEncryptionLength: 256
};
const curveLengthByName = {
  "P-256": 256,
  "P-384": 384,
  "P-521": 528
};
class EnvelopedData extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$8, EnvelopedData.defaultValues(VERSION$8));
    if (ORIGINATOR_INFO in parameters) {
      this.originatorInfo = getParametersValue(parameters, ORIGINATOR_INFO, EnvelopedData.defaultValues(ORIGINATOR_INFO));
    }
    this.recipientInfos = getParametersValue(parameters, RECIPIENT_INFOS, EnvelopedData.defaultValues(RECIPIENT_INFOS));
    this.encryptedContentInfo = getParametersValue(parameters, ENCRYPTED_CONTENT_INFO, EnvelopedData.defaultValues(ENCRYPTED_CONTENT_INFO));
    if (UNPROTECTED_ATTRS in parameters) {
      this.unprotectedAttrs = getParametersValue(parameters, UNPROTECTED_ATTRS, EnvelopedData.defaultValues(UNPROTECTED_ATTRS));
    }
    this.policy = {
      disableSplit: !!parameters.disableSplit
    };
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$8:
        return 0;
      case ORIGINATOR_INFO:
        return new OriginatorInfo();
      case RECIPIENT_INFOS:
        return [];
      case ENCRYPTED_CONTENT_INFO:
        return new EncryptedContentInfo();
      case UNPROTECTED_ATTRS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$8:
        return memberValue === EnvelopedData.defaultValues(memberName);
      case ORIGINATOR_INFO:
        return memberValue.certs.certificates.length === 0 && memberValue.crls.crls.length === 0;
      case RECIPIENT_INFOS:
      case UNPROTECTED_ATTRS:
        return memberValue.length === 0;
      case ENCRYPTED_CONTENT_INFO:
        return EncryptedContentInfo.compareWithDefault("contentType", memberValue.contentType) && (EncryptedContentInfo.compareWithDefault("contentEncryptionAlgorithm", memberValue.contentEncryptionAlgorithm) && EncryptedContentInfo.compareWithDefault("encryptedContent", memberValue.encryptedContent));
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || EMPTY_STRING }),
        new Constructed({
          name: names.originatorInfo || EMPTY_STRING,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: OriginatorInfo.schema().valueBlock.value
        }),
        new Set$1({
          value: [
            new Repeated({
              name: names.recipientInfos || EMPTY_STRING,
              value: RecipientInfo.schema()
            })
          ]
        }),
        EncryptedContentInfo.schema(names.encryptedContentInfo || {}),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [
            new Repeated({
              name: names.unprotectedAttrs || EMPTY_STRING,
              value: Attribute.schema()
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$k);
    const asn1 = compareSchema(schema, schema, EnvelopedData.schema({
      names: {
        version: VERSION$8,
        originatorInfo: ORIGINATOR_INFO,
        recipientInfos: RECIPIENT_INFOS,
        encryptedContentInfo: {
          names: {
            blockName: ENCRYPTED_CONTENT_INFO
          }
        },
        unprotectedAttrs: UNPROTECTED_ATTRS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    if (ORIGINATOR_INFO in asn1.result) {
      this.originatorInfo = new OriginatorInfo({
        schema: new Sequence({
          value: asn1.result.originatorInfo.valueBlock.value
        })
      });
    }
    this.recipientInfos = Array.from(asn1.result.recipientInfos, (o2) => new RecipientInfo({ schema: o2 }));
    this.encryptedContentInfo = new EncryptedContentInfo({ schema: asn1.result.encryptedContentInfo });
    if (UNPROTECTED_ATTRS in asn1.result)
      this.unprotectedAttrs = Array.from(asn1.result.unprotectedAttrs, (o2) => new Attribute({ schema: o2 }));
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new Integer({ value: this.version }));
    if (this.originatorInfo) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: this.originatorInfo.toSchema().valueBlock.value
      }));
    }
    outputArray.push(new Set$1({
      value: Array.from(this.recipientInfos, (o2) => o2.toSchema())
    }));
    outputArray.push(this.encryptedContentInfo.toSchema());
    if (this.unprotectedAttrs) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: Array.from(this.unprotectedAttrs, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      version: this.version,
      recipientInfos: Array.from(this.recipientInfos, (o2) => o2.toJSON()),
      encryptedContentInfo: this.encryptedContentInfo.toJSON()
    };
    if (this.originatorInfo)
      res.originatorInfo = this.originatorInfo.toJSON();
    if (this.unprotectedAttrs)
      res.unprotectedAttrs = Array.from(this.unprotectedAttrs, (o2) => o2.toJSON());
    return res;
  }
  addRecipientByCertificate(certificate, parameters, variant, crypto2 = getCrypto(true)) {
    const encryptionParameters = Object.assign({ useOAEP: true, oaepHashAlgorithm: "SHA-512" }, defaultEncryptionParams, parameters || {});
    if (certificate.subjectPublicKeyInfo.algorithm.algorithmId.indexOf("1.2.840.113549") !== -1)
      variant = 1;
    else {
      if (certificate.subjectPublicKeyInfo.algorithm.algorithmId.indexOf("1.2.840.10045") !== -1)
        variant = 2;
      else
        throw new Error("Unknown type of certificate's public key: ".concat(certificate.subjectPublicKeyInfo.algorithm.algorithmId));
    }
    switch (variant) {
      case 1:
        {
          let algorithmId;
          let algorithmParams;
          if (encryptionParameters.useOAEP === true) {
            algorithmId = crypto2.getOIDByAlgorithm({
              name: "RSA-OAEP"
            }, true, "keyEncryptionAlgorithm");
            const hashOID = crypto2.getOIDByAlgorithm({
              name: encryptionParameters.oaepHashAlgorithm
            }, true, "RSAES-OAEP-params");
            const hashAlgorithm = new AlgorithmIdentifier({
              algorithmId: hashOID,
              algorithmParams: new Null()
            });
            const rsaOAEPParams = new RSAESOAEPParams({
              hashAlgorithm,
              maskGenAlgorithm: new AlgorithmIdentifier({
                algorithmId: "1.2.840.113549.1.1.8",
                algorithmParams: hashAlgorithm.toSchema()
              })
            });
            algorithmParams = rsaOAEPParams.toSchema();
          } else {
            algorithmId = crypto2.getOIDByAlgorithm({
              name: "RSAES-PKCS1-v1_5"
            });
            if (algorithmId === EMPTY_STRING)
              throw new Error("Can not find OID for RSAES-PKCS1-v1_5");
            algorithmParams = new Null();
          }
          const keyInfo = new KeyTransRecipientInfo({
            version: 0,
            rid: new IssuerAndSerialNumber({
              issuer: certificate.issuer,
              serialNumber: certificate.serialNumber
            }),
            keyEncryptionAlgorithm: new AlgorithmIdentifier({
              algorithmId,
              algorithmParams
            }),
            recipientCertificate: certificate
          });
          this.recipientInfos.push(new RecipientInfo({
            variant: 1,
            value: keyInfo
          }));
        }
        break;
      case 2:
        {
          const recipientIdentifier = new KeyAgreeRecipientIdentifier({
            variant: 1,
            value: new IssuerAndSerialNumber({
              issuer: certificate.issuer,
              serialNumber: certificate.serialNumber
            })
          });
          this._addKeyAgreeRecipientInfo(recipientIdentifier, encryptionParameters, { recipientCertificate: certificate }, crypto2);
        }
        break;
      default:
        throw new Error('Unknown "variant" value: '.concat(variant));
    }
    return true;
  }
  addRecipientByPreDefinedData(preDefinedData, parameters = {}, variant, crypto2 = getCrypto(true)) {
    ArgumentError.assert(preDefinedData, "preDefinedData", "ArrayBuffer");
    if (!preDefinedData.byteLength) {
      throw new Error("Pre-defined data could have zero length");
    }
    if (!parameters.keyIdentifier) {
      const keyIdentifierBuffer = new ArrayBuffer(16);
      const keyIdentifierView = new Uint8Array(keyIdentifierBuffer);
      crypto2.getRandomValues(keyIdentifierView);
      parameters.keyIdentifier = keyIdentifierBuffer;
    }
    if (!parameters.hmacHashAlgorithm)
      parameters.hmacHashAlgorithm = "SHA-512";
    if (parameters.iterationCount === void 0) {
      parameters.iterationCount = 2048;
    }
    if (!parameters.keyEncryptionAlgorithm) {
      parameters.keyEncryptionAlgorithm = {
        name: "AES-KW",
        length: 256
      };
    }
    if (!parameters.keyEncryptionAlgorithmParams)
      parameters.keyEncryptionAlgorithmParams = new Null();
    switch (variant) {
      case 1:
        {
          const kekOID = crypto2.getOIDByAlgorithm(parameters.keyEncryptionAlgorithm, true, "keyEncryptionAlgorithm");
          const keyInfo = new KEKRecipientInfo({
            version: 4,
            kekid: new KEKIdentifier({
              keyIdentifier: new OctetString$1({ valueHex: parameters.keyIdentifier })
            }),
            keyEncryptionAlgorithm: new AlgorithmIdentifier({
              algorithmId: kekOID,
              algorithmParams: parameters.keyEncryptionAlgorithmParams
            }),
            preDefinedKEK: preDefinedData
          });
          this.recipientInfos.push(new RecipientInfo({
            variant: 3,
            value: keyInfo
          }));
        }
        break;
      case 2:
        {
          const pbkdf2OID = crypto2.getOIDByAlgorithm({ name: "PBKDF2" }, true, "keyDerivationAlgorithm");
          const saltBuffer = new ArrayBuffer(64);
          const saltView = new Uint8Array(saltBuffer);
          crypto2.getRandomValues(saltView);
          const hmacOID = crypto2.getOIDByAlgorithm({
            name: "HMAC",
            hash: {
              name: parameters.hmacHashAlgorithm
            }
          }, true, "hmacHashAlgorithm");
          const pbkdf2Params = new PBKDF2Params({
            salt: new OctetString$1({ valueHex: saltBuffer }),
            iterationCount: parameters.iterationCount,
            prf: new AlgorithmIdentifier({
              algorithmId: hmacOID,
              algorithmParams: new Null()
            })
          });
          const kekOID = crypto2.getOIDByAlgorithm(parameters.keyEncryptionAlgorithm, true, "keyEncryptionAlgorithm");
          const keyInfo = new PasswordRecipientinfo({
            version: 0,
            keyDerivationAlgorithm: new AlgorithmIdentifier({
              algorithmId: pbkdf2OID,
              algorithmParams: pbkdf2Params.toSchema()
            }),
            keyEncryptionAlgorithm: new AlgorithmIdentifier({
              algorithmId: kekOID,
              algorithmParams: parameters.keyEncryptionAlgorithmParams
            }),
            password: preDefinedData
          });
          this.recipientInfos.push(new RecipientInfo({
            variant: 4,
            value: keyInfo
          }));
        }
        break;
      default:
        throw new Error('Unknown value for "variant": '.concat(variant));
    }
  }
  addRecipientByKeyIdentifier(key, keyId, parameters, crypto2 = getCrypto(true)) {
    const encryptionParameters = Object.assign({}, defaultEncryptionParams, parameters || {});
    const recipientIdentifier = new KeyAgreeRecipientIdentifier({
      variant: 2,
      value: new RecipientKeyIdentifier({
        subjectKeyIdentifier: new OctetString$1({ valueHex: keyId })
      })
    });
    this._addKeyAgreeRecipientInfo(recipientIdentifier, encryptionParameters, { recipientPublicKey: key }, crypto2);
  }
  _addKeyAgreeRecipientInfo(recipientIdentifier, encryptionParameters, extraRecipientInfoParams, crypto2 = getCrypto(true)) {
    const encryptedKey = new RecipientEncryptedKey({
      rid: recipientIdentifier
    });
    const aesKWoid = crypto2.getOIDByAlgorithm({
      name: "AES-KW",
      length: encryptionParameters.kekEncryptionLength
    }, true, "keyEncryptionAlgorithm");
    const aesKW = new AlgorithmIdentifier({
      algorithmId: aesKWoid
    });
    const ecdhOID = crypto2.getOIDByAlgorithm({
      name: "ECDH",
      kdf: encryptionParameters.kdfAlgorithm
    }, true, "KeyAgreeRecipientInfo");
    const ukmBuffer = new ArrayBuffer(64);
    const ukmView = new Uint8Array(ukmBuffer);
    crypto2.getRandomValues(ukmView);
    const recipientInfoParams = {
      version: 3,
      ukm: new OctetString$1({ valueHex: ukmBuffer }),
      keyEncryptionAlgorithm: new AlgorithmIdentifier({
        algorithmId: ecdhOID,
        algorithmParams: aesKW.toSchema()
      }),
      recipientEncryptedKeys: new RecipientEncryptedKeys({
        encryptedKeys: [encryptedKey]
      })
    };
    const keyInfo = new KeyAgreeRecipientInfo(Object.assign(recipientInfoParams, extraRecipientInfoParams));
    this.recipientInfos.push(new RecipientInfo({
      variant: 2,
      value: keyInfo
    }));
  }
  async encrypt(contentEncryptionAlgorithm, contentToEncrypt, crypto2 = getCrypto(true)) {
    const ivBuffer = new ArrayBuffer(16);
    const ivView = new Uint8Array(ivBuffer);
    crypto2.getRandomValues(ivView);
    const contentView = new Uint8Array(contentToEncrypt);
    const contentEncryptionOID = crypto2.getOIDByAlgorithm(contentEncryptionAlgorithm, true, "contentEncryptionAlgorithm");
    const sessionKey = await crypto2.generateKey(contentEncryptionAlgorithm, true, ["encrypt"]);
    const encryptedContent = await crypto2.encrypt({
      name: contentEncryptionAlgorithm.name,
      iv: ivView
    }, sessionKey, contentView);
    const exportedSessionKey = await crypto2.exportKey("raw", sessionKey);
    this.version = 2;
    this.encryptedContentInfo = new EncryptedContentInfo({
      disableSplit: this.policy.disableSplit,
      contentType: "1.2.840.113549.1.7.1",
      contentEncryptionAlgorithm: new AlgorithmIdentifier({
        algorithmId: contentEncryptionOID,
        algorithmParams: new OctetString$1({ valueHex: ivBuffer })
      }),
      encryptedContent: new OctetString$1({ valueHex: encryptedContent })
    });
    const SubKeyAgreeRecipientInfo = async (index) => {
      const recipientInfo = this.recipientInfos[index].value;
      let recipientCurve;
      let recipientPublicKey;
      if (recipientInfo.recipientPublicKey) {
        recipientCurve = recipientInfo.recipientPublicKey.algorithm.namedCurve;
        recipientPublicKey = recipientInfo.recipientPublicKey;
      } else if (recipientInfo.recipientCertificate) {
        const curveObject = recipientInfo.recipientCertificate.subjectPublicKeyInfo.algorithm.algorithmParams;
        if (curveObject.constructor.blockName() !== ObjectIdentifier.blockName())
          throw new Error('Incorrect "recipientCertificate" for index '.concat(index));
        const curveOID = curveObject.valueBlock.toString();
        switch (curveOID) {
          case "1.2.840.10045.3.1.7":
            recipientCurve = "P-256";
            break;
          case "1.3.132.0.34":
            recipientCurve = "P-384";
            break;
          case "1.3.132.0.35":
            recipientCurve = "P-521";
            break;
          default:
            throw new Error("Incorrect curve OID for index ".concat(index));
        }
        recipientPublicKey = await recipientInfo.recipientCertificate.getPublicKey({
          algorithm: {
            algorithm: {
              name: "ECDH",
              namedCurve: recipientCurve
            },
            usages: []
          }
        }, crypto2);
      } else {
        throw new Error("Unsupported RecipientInfo");
      }
      const recipientCurveLength = curveLengthByName[recipientCurve];
      const ecdhKeys = await crypto2.generateKey({ name: "ECDH", namedCurve: recipientCurve }, true, ["deriveBits"]);
      const exportedECDHPublicKey = await crypto2.exportKey("spki", ecdhKeys.publicKey);
      const derivedBits = await crypto2.deriveBits({
        name: "ECDH",
        public: recipientPublicKey
      }, ecdhKeys.privateKey, recipientCurveLength);
      const aesKWAlgorithm = new AlgorithmIdentifier({ schema: recipientInfo.keyEncryptionAlgorithm.algorithmParams });
      const kwAlgorithm = crypto2.getAlgorithmByOID(aesKWAlgorithm.algorithmId, true, "aesKWAlgorithm");
      let kwLength = kwAlgorithm.length;
      const kwLengthBuffer = new ArrayBuffer(4);
      const kwLengthView = new Uint8Array(kwLengthBuffer);
      for (let j2 = 3; j2 >= 0; j2--) {
        kwLengthView[j2] = kwLength;
        kwLength >>= 8;
      }
      const eccInfo = new ECCCMSSharedInfo({
        keyInfo: new AlgorithmIdentifier({
          algorithmId: aesKWAlgorithm.algorithmId
        }),
        entityUInfo: recipientInfo.ukm,
        suppPubInfo: new OctetString$1({ valueHex: kwLengthBuffer })
      });
      const encodedInfo = eccInfo.toSchema().toBER(false);
      const ecdhAlgorithm = crypto2.getAlgorithmByOID(recipientInfo.keyEncryptionAlgorithm.algorithmId, true, "ecdhAlgorithm");
      const derivedKeyRaw = await kdf(ecdhAlgorithm.kdf, derivedBits, kwAlgorithm.length, encodedInfo, crypto2);
      const awsKW = await crypto2.importKey("raw", derivedKeyRaw, { name: "AES-KW" }, true, ["wrapKey"]);
      const wrappedKey = await crypto2.wrapKey("raw", sessionKey, awsKW, { name: "AES-KW" });
      const originator = new OriginatorIdentifierOrKey();
      originator.variant = 3;
      originator.value = OriginatorPublicKey.fromBER(exportedECDHPublicKey);
      recipientInfo.originator = originator;
      recipientInfo.recipientEncryptedKeys.encryptedKeys[0].encryptedKey = new OctetString$1({ valueHex: wrappedKey });
      return { ecdhPrivateKey: ecdhKeys.privateKey };
    };
    const SubKeyTransRecipientInfo = async (index) => {
      const recipientInfo = this.recipientInfos[index].value;
      const algorithmParameters = crypto2.getAlgorithmByOID(recipientInfo.keyEncryptionAlgorithm.algorithmId, true, "keyEncryptionAlgorithm");
      if (algorithmParameters.name === "RSA-OAEP") {
        const schema = recipientInfo.keyEncryptionAlgorithm.algorithmParams;
        const rsaOAEPParams = new RSAESOAEPParams({ schema });
        algorithmParameters.hash = crypto2.getAlgorithmByOID(rsaOAEPParams.hashAlgorithm.algorithmId);
        if ("name" in algorithmParameters.hash === false)
          throw new Error("Incorrect OID for hash algorithm: ".concat(rsaOAEPParams.hashAlgorithm.algorithmId));
      }
      try {
        const publicKey = await recipientInfo.recipientCertificate.getPublicKey({
          algorithm: {
            algorithm: algorithmParameters,
            usages: ["encrypt", "wrapKey"]
          }
        }, crypto2);
        const encryptedKey = await crypto2.encrypt(publicKey.algorithm, publicKey, exportedSessionKey);
        recipientInfo.encryptedKey = new OctetString$1({ valueHex: encryptedKey });
      } catch (e2) {
      }
    };
    const SubKEKRecipientInfo = async (index) => {
      const recipientInfo = this.recipientInfos[index].value;
      const kekAlgorithm = crypto2.getAlgorithmByOID(recipientInfo.keyEncryptionAlgorithm.algorithmId, true, "kekAlgorithm");
      const kekKey = await crypto2.importKey("raw", new Uint8Array(recipientInfo.preDefinedKEK), kekAlgorithm, true, ["wrapKey"]);
      const wrappedKey = await crypto2.wrapKey("raw", sessionKey, kekKey, kekAlgorithm);
      recipientInfo.encryptedKey = new OctetString$1({ valueHex: wrappedKey });
    };
    const SubPasswordRecipientinfo = async (index) => {
      const recipientInfo = this.recipientInfos[index].value;
      let pbkdf2Params;
      if (!recipientInfo.keyDerivationAlgorithm)
        throw new Error('Please append encoded "keyDerivationAlgorithm"');
      if (!recipientInfo.keyDerivationAlgorithm.algorithmParams)
        throw new Error('Incorrectly encoded "keyDerivationAlgorithm"');
      try {
        pbkdf2Params = new PBKDF2Params({ schema: recipientInfo.keyDerivationAlgorithm.algorithmParams });
      } catch (ex) {
        throw new Error('Incorrectly encoded "keyDerivationAlgorithm"');
      }
      const passwordView = new Uint8Array(recipientInfo.password);
      const derivationKey = await crypto2.importKey("raw", passwordView, "PBKDF2", false, ["deriveKey"]);
      const kekAlgorithm = crypto2.getAlgorithmByOID(recipientInfo.keyEncryptionAlgorithm.algorithmId, true, "kekAlgorithm");
      let hmacHashAlgorithm = "SHA-1";
      if (pbkdf2Params.prf) {
        const prfAlgorithm = crypto2.getAlgorithmByOID(pbkdf2Params.prf.algorithmId, true, "prfAlgorithm");
        hmacHashAlgorithm = prfAlgorithm.hash.name;
      }
      const saltView = new Uint8Array(pbkdf2Params.salt.valueBlock.valueHex);
      const iterations = pbkdf2Params.iterationCount;
      const derivedKey = await crypto2.deriveKey({
        name: "PBKDF2",
        hash: {
          name: hmacHashAlgorithm
        },
        salt: saltView,
        iterations
      }, derivationKey, kekAlgorithm, true, ["wrapKey"]);
      const wrappedKey = await crypto2.wrapKey("raw", sessionKey, derivedKey, kekAlgorithm);
      recipientInfo.encryptedKey = new OctetString$1({ valueHex: wrappedKey });
    };
    const res = [];
    for (let i2 = 0; i2 < this.recipientInfos.length; i2++) {
      switch (this.recipientInfos[i2].variant) {
        case 1:
          res.push(await SubKeyTransRecipientInfo(i2));
          break;
        case 2:
          res.push(await SubKeyAgreeRecipientInfo(i2));
          break;
        case 3:
          res.push(await SubKEKRecipientInfo(i2));
          break;
        case 4:
          res.push(await SubPasswordRecipientinfo(i2));
          break;
        default:
          throw new Error("Unknown recipient type in array with index ".concat(i2));
      }
    }
    return res;
  }
  async decrypt(recipientIndex, parameters, crypto2 = getCrypto(true)) {
    const decryptionParameters = parameters || {};
    if (recipientIndex + 1 > this.recipientInfos.length) {
      throw new Error('Maximum value for "index" is: '.concat(this.recipientInfos.length - 1));
    }
    const SubKeyAgreeRecipientInfo = async (index) => {
      const recipientInfo = this.recipientInfos[index].value;
      let curveOID;
      let recipientCurve;
      let recipientCurveLength;
      const originator = recipientInfo.originator;
      if (decryptionParameters.recipientCertificate) {
        const curveObject = decryptionParameters.recipientCertificate.subjectPublicKeyInfo.algorithm.algorithmParams;
        if (curveObject.constructor.blockName() !== ObjectIdentifier.blockName()) {
          throw new Error('Incorrect "recipientCertificate" for index '.concat(index));
        }
        curveOID = curveObject.valueBlock.toString();
      } else if (originator.value.algorithm.algorithmParams) {
        const curveObject = originator.value.algorithm.algorithmParams;
        if (curveObject.constructor.blockName() !== ObjectIdentifier.blockName()) {
          throw new Error("Incorrect originator for index ".concat(index));
        }
        curveOID = curveObject.valueBlock.toString();
      } else {
        throw new Error('Parameter "recipientCertificate" is mandatory for "KeyAgreeRecipientInfo" if algorithm params are missing from originator');
      }
      if (!decryptionParameters.recipientPrivateKey)
        throw new Error('Parameter "recipientPrivateKey" is mandatory for "KeyAgreeRecipientInfo"');
      switch (curveOID) {
        case "1.2.840.10045.3.1.7":
          recipientCurve = "P-256";
          recipientCurveLength = 256;
          break;
        case "1.3.132.0.34":
          recipientCurve = "P-384";
          recipientCurveLength = 384;
          break;
        case "1.3.132.0.35":
          recipientCurve = "P-521";
          recipientCurveLength = 528;
          break;
        default:
          throw new Error("Incorrect curve OID for index ".concat(index));
      }
      let ecdhPrivateKey;
      let keyCrypto = crypto2;
      if (BufferSourceConverter.isBufferSource(decryptionParameters.recipientPrivateKey)) {
        ecdhPrivateKey = await crypto2.importKey("pkcs8", decryptionParameters.recipientPrivateKey, {
          name: "ECDH",
          namedCurve: recipientCurve
        }, true, ["deriveBits"]);
      } else {
        ecdhPrivateKey = decryptionParameters.recipientPrivateKey;
        if ("crypto" in decryptionParameters && decryptionParameters.crypto) {
          keyCrypto = decryptionParameters.crypto.subtle;
        }
      }
      if ("algorithmParams" in originator.value.algorithm === false)
        originator.value.algorithm.algorithmParams = new ObjectIdentifier({ value: curveOID });
      const buffer = originator.value.toSchema().toBER(false);
      const ecdhPublicKey = await crypto2.importKey("spki", buffer, {
        name: "ECDH",
        namedCurve: recipientCurve
      }, true, []);
      const sharedSecret = await keyCrypto.deriveBits({
        name: "ECDH",
        public: ecdhPublicKey
      }, ecdhPrivateKey, recipientCurveLength);
      async function applyKDF(includeAlgorithmParams) {
        includeAlgorithmParams = includeAlgorithmParams || false;
        const aesKWAlgorithm = new AlgorithmIdentifier({ schema: recipientInfo.keyEncryptionAlgorithm.algorithmParams });
        const kwAlgorithm = crypto2.getAlgorithmByOID(aesKWAlgorithm.algorithmId, true, "kwAlgorithm");
        let kwLength = kwAlgorithm.length;
        const kwLengthBuffer = new ArrayBuffer(4);
        const kwLengthView = new Uint8Array(kwLengthBuffer);
        for (let j2 = 3; j2 >= 0; j2--) {
          kwLengthView[j2] = kwLength;
          kwLength >>= 8;
        }
        const keyInfoAlgorithm = {
          algorithmId: aesKWAlgorithm.algorithmId
        };
        if (includeAlgorithmParams) {
          keyInfoAlgorithm.algorithmParams = new Null();
        }
        const eccInfo = new ECCCMSSharedInfo({
          keyInfo: new AlgorithmIdentifier(keyInfoAlgorithm),
          entityUInfo: recipientInfo.ukm,
          suppPubInfo: new OctetString$1({ valueHex: kwLengthBuffer })
        });
        const encodedInfo = eccInfo.toSchema().toBER(false);
        const ecdhAlgorithm = crypto2.getAlgorithmByOID(recipientInfo.keyEncryptionAlgorithm.algorithmId, true, "ecdhAlgorithm");
        if (!ecdhAlgorithm.name) {
          throw new Error("Incorrect OID for key encryption algorithm: ".concat(recipientInfo.keyEncryptionAlgorithm.algorithmId));
        }
        return kdf(ecdhAlgorithm.kdf, sharedSecret, kwAlgorithm.length, encodedInfo, crypto2);
      }
      const kdfResult = await applyKDF();
      const importAesKwKey = async (kdfResult2) => {
        return crypto2.importKey("raw", kdfResult2, { name: "AES-KW" }, true, ["unwrapKey"]);
      };
      const aesKwKey = await importAesKwKey(kdfResult);
      const unwrapSessionKey = async (aesKwKey2) => {
        const algorithmId2 = this.encryptedContentInfo.contentEncryptionAlgorithm.algorithmId;
        const contentEncryptionAlgorithm2 = crypto2.getAlgorithmByOID(algorithmId2, true, "contentEncryptionAlgorithm");
        return crypto2.unwrapKey("raw", recipientInfo.recipientEncryptedKeys.encryptedKeys[0].encryptedKey.valueBlock.valueHexView, aesKwKey2, { name: "AES-KW" }, contentEncryptionAlgorithm2, true, ["decrypt"]);
      };
      try {
        return await unwrapSessionKey(aesKwKey);
      } catch (e2) {
        const kdfResult2 = await applyKDF(true);
        const aesKwKey2 = await importAesKwKey(kdfResult2);
        return unwrapSessionKey(aesKwKey2);
      }
    };
    const SubKeyTransRecipientInfo = async (index) => {
      const recipientInfo = this.recipientInfos[index].value;
      if (!decryptionParameters.recipientPrivateKey) {
        throw new Error('Parameter "recipientPrivateKey" is mandatory for "KeyTransRecipientInfo"');
      }
      const algorithmParameters = crypto2.getAlgorithmByOID(recipientInfo.keyEncryptionAlgorithm.algorithmId, true, "keyEncryptionAlgorithm");
      if (algorithmParameters.name === "RSA-OAEP") {
        const schema = recipientInfo.keyEncryptionAlgorithm.algorithmParams;
        const rsaOAEPParams = new RSAESOAEPParams({ schema });
        algorithmParameters.hash = crypto2.getAlgorithmByOID(rsaOAEPParams.hashAlgorithm.algorithmId);
        if ("name" in algorithmParameters.hash === false)
          throw new Error("Incorrect OID for hash algorithm: ".concat(rsaOAEPParams.hashAlgorithm.algorithmId));
      }
      let privateKey;
      let keyCrypto = crypto2;
      if (BufferSourceConverter.isBufferSource(decryptionParameters.recipientPrivateKey)) {
        privateKey = await crypto2.importKey("pkcs8", decryptionParameters.recipientPrivateKey, algorithmParameters, true, ["decrypt"]);
      } else {
        privateKey = decryptionParameters.recipientPrivateKey;
        if ("crypto" in decryptionParameters && decryptionParameters.crypto) {
          keyCrypto = decryptionParameters.crypto.subtle;
        }
      }
      const sessionKey = await keyCrypto.decrypt(privateKey.algorithm, privateKey, recipientInfo.encryptedKey.valueBlock.valueHexView);
      const algorithmId2 = this.encryptedContentInfo.contentEncryptionAlgorithm.algorithmId;
      const contentEncryptionAlgorithm2 = crypto2.getAlgorithmByOID(algorithmId2, true, "contentEncryptionAlgorithm");
      if ("name" in contentEncryptionAlgorithm2 === false)
        throw new Error('Incorrect "contentEncryptionAlgorithm": '.concat(algorithmId2));
      return crypto2.importKey("raw", sessionKey, contentEncryptionAlgorithm2, true, ["decrypt"]);
    };
    const SubKEKRecipientInfo = async (index) => {
      const recipientInfo = this.recipientInfos[index].value;
      if (!decryptionParameters.preDefinedData)
        throw new Error('Parameter "preDefinedData" is mandatory for "KEKRecipientInfo"');
      const kekAlgorithm = crypto2.getAlgorithmByOID(recipientInfo.keyEncryptionAlgorithm.algorithmId, true, "kekAlgorithm");
      const importedKey = await crypto2.importKey("raw", decryptionParameters.preDefinedData, kekAlgorithm, true, ["unwrapKey"]);
      const algorithmId2 = this.encryptedContentInfo.contentEncryptionAlgorithm.algorithmId;
      const contentEncryptionAlgorithm2 = crypto2.getAlgorithmByOID(algorithmId2, true, "contentEncryptionAlgorithm");
      if (!contentEncryptionAlgorithm2.name) {
        throw new Error('Incorrect "contentEncryptionAlgorithm": '.concat(algorithmId2));
      }
      return crypto2.unwrapKey("raw", recipientInfo.encryptedKey.valueBlock.valueHexView, importedKey, kekAlgorithm, contentEncryptionAlgorithm2, true, ["decrypt"]);
    };
    const SubPasswordRecipientinfo = async (index) => {
      const recipientInfo = this.recipientInfos[index].value;
      let pbkdf2Params;
      if (!decryptionParameters.preDefinedData) {
        throw new Error('Parameter "preDefinedData" is mandatory for "KEKRecipientInfo"');
      }
      if (!recipientInfo.keyDerivationAlgorithm) {
        throw new Error('Please append encoded "keyDerivationAlgorithm"');
      }
      if (!recipientInfo.keyDerivationAlgorithm.algorithmParams) {
        throw new Error('Incorrectly encoded "keyDerivationAlgorithm"');
      }
      try {
        pbkdf2Params = new PBKDF2Params({ schema: recipientInfo.keyDerivationAlgorithm.algorithmParams });
      } catch (ex) {
        throw new Error('Incorrectly encoded "keyDerivationAlgorithm"');
      }
      const pbkdf2Key = await crypto2.importKey("raw", decryptionParameters.preDefinedData, "PBKDF2", false, ["deriveKey"]);
      const kekAlgorithm = crypto2.getAlgorithmByOID(recipientInfo.keyEncryptionAlgorithm.algorithmId, true, "keyEncryptionAlgorithm");
      const hmacHashAlgorithm = pbkdf2Params.prf ? crypto2.getAlgorithmByOID(pbkdf2Params.prf.algorithmId, true, "prfAlgorithm").hash.name : "SHA-1";
      const saltView = new Uint8Array(pbkdf2Params.salt.valueBlock.valueHex);
      const iterations = pbkdf2Params.iterationCount;
      const kekKey = await crypto2.deriveKey({
        name: "PBKDF2",
        hash: {
          name: hmacHashAlgorithm
        },
        salt: saltView,
        iterations
      }, pbkdf2Key, kekAlgorithm, true, ["unwrapKey"]);
      const algorithmId2 = this.encryptedContentInfo.contentEncryptionAlgorithm.algorithmId;
      const contentEncryptionAlgorithm2 = crypto2.getAlgorithmByOID(algorithmId2, true, "contentEncryptionAlgorithm");
      return crypto2.unwrapKey("raw", recipientInfo.encryptedKey.valueBlock.valueHexView, kekKey, kekAlgorithm, contentEncryptionAlgorithm2, true, ["decrypt"]);
    };
    let unwrappedKey;
    switch (this.recipientInfos[recipientIndex].variant) {
      case 1:
        unwrappedKey = await SubKeyTransRecipientInfo(recipientIndex);
        break;
      case 2:
        unwrappedKey = await SubKeyAgreeRecipientInfo(recipientIndex);
        break;
      case 3:
        unwrappedKey = await SubKEKRecipientInfo(recipientIndex);
        break;
      case 4:
        unwrappedKey = await SubPasswordRecipientinfo(recipientIndex);
        break;
      default:
        throw new Error("Unknown recipient type in array with index ".concat(recipientIndex));
    }
    const algorithmId = this.encryptedContentInfo.contentEncryptionAlgorithm.algorithmId;
    const contentEncryptionAlgorithm = crypto2.getAlgorithmByOID(algorithmId, true, "contentEncryptionAlgorithm");
    const ivBuffer = this.encryptedContentInfo.contentEncryptionAlgorithm.algorithmParams.valueBlock.valueHex;
    const ivView = new Uint8Array(ivBuffer);
    if (!this.encryptedContentInfo.encryptedContent) {
      throw new Error("Required property `encryptedContent` is empty");
    }
    const dataBuffer = this.encryptedContentInfo.getEncryptedContent();
    return crypto2.decrypt({
      name: contentEncryptionAlgorithm.name,
      iv: ivView
    }, unwrappedKey, dataBuffer);
  }
}
EnvelopedData.CLASS_NAME = "EnvelopedData";
const SAFE_CONTENTS = "safeContents";
const PARSED_VALUE$1 = "parsedValue";
const CONTENT_INFOS = "contentInfos";
class AuthenticatedSafe extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.safeContents = getParametersValue(parameters, SAFE_CONTENTS, AuthenticatedSafe.defaultValues(SAFE_CONTENTS));
    if (PARSED_VALUE$1 in parameters) {
      this.parsedValue = getParametersValue(parameters, PARSED_VALUE$1, AuthenticatedSafe.defaultValues(PARSED_VALUE$1));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case SAFE_CONTENTS:
        return [];
      case PARSED_VALUE$1:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case SAFE_CONTENTS:
        return memberValue.length === 0;
      case PARSED_VALUE$1:
        return memberValue instanceof Object && Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Repeated({
          name: names.contentInfos || EMPTY_STRING,
          value: ContentInfo.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      CONTENT_INFOS
    ]);
    const asn1 = compareSchema(schema, schema, AuthenticatedSafe.schema({
      names: {
        contentInfos: CONTENT_INFOS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.safeContents = Array.from(asn1.result.contentInfos, (element) => new ContentInfo({ schema: element }));
  }
  toSchema() {
    return new Sequence({
      value: Array.from(this.safeContents, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    return {
      safeContents: Array.from(this.safeContents, (o2) => o2.toJSON())
    };
  }
  async parseInternalValues(parameters, crypto2 = getCrypto(true)) {
    ParameterError.assert(parameters, SAFE_CONTENTS);
    ArgumentError.assert(parameters.safeContents, SAFE_CONTENTS, "Array");
    if (parameters.safeContents.length !== this.safeContents.length) {
      throw new ArgumentError('Length of "parameters.safeContents" must be equal to "this.safeContents.length"');
    }
    this.parsedValue = {
      safeContents: []
    };
    for (const [index, content] of this.safeContents.entries()) {
      const safeContent = parameters.safeContents[index];
      const errorTarget = "parameters.safeContents[".concat(index, "]");
      switch (content.contentType) {
        case id_ContentType_Data:
          {
            ArgumentError.assert(content.content, "this.safeContents[j].content", OctetString$1);
            const authSafeContent = content.content.getValue();
            this.parsedValue.safeContents.push({
              privacyMode: 0,
              value: SafeContents.fromBER(authSafeContent)
            });
          }
          break;
        case id_ContentType_EnvelopedData:
          {
            const cmsEnveloped = new EnvelopedData({ schema: content.content });
            ParameterError.assert(errorTarget, safeContent, "recipientCertificate", "recipientKey");
            const envelopedData = safeContent;
            const recipientCertificate = envelopedData.recipientCertificate;
            const recipientKey = envelopedData.recipientKey;
            const decrypted = await cmsEnveloped.decrypt(0, {
              recipientCertificate,
              recipientPrivateKey: recipientKey
            }, crypto2);
            this.parsedValue.safeContents.push({
              privacyMode: 2,
              value: SafeContents.fromBER(decrypted)
            });
          }
          break;
        case id_ContentType_EncryptedData:
          {
            const cmsEncrypted = new EncryptedData({ schema: content.content });
            ParameterError.assert(errorTarget, safeContent, "password");
            const password = safeContent.password;
            const decrypted = await cmsEncrypted.decrypt({
              password
            }, crypto2);
            this.parsedValue.safeContents.push({
              privacyMode: 1,
              value: SafeContents.fromBER(decrypted)
            });
          }
          break;
        default:
          throw new Error('Unknown "contentType" for AuthenticatedSafe: " '.concat(content.contentType));
      }
    }
  }
  async makeInternalValues(parameters, crypto2 = getCrypto(true)) {
    if (!this.parsedValue) {
      throw new Error('Please run "parseValues" first or add "parsedValue" manually');
    }
    ArgumentError.assert(this.parsedValue, "this.parsedValue", "object");
    ArgumentError.assert(this.parsedValue.safeContents, "this.parsedValue.safeContents", "Array");
    ArgumentError.assert(parameters, "parameters", "object");
    ParameterError.assert(parameters, "safeContents");
    ArgumentError.assert(parameters.safeContents, "parameters.safeContents", "Array");
    if (parameters.safeContents.length !== this.parsedValue.safeContents.length) {
      throw new ArgumentError('Length of "parameters.safeContents" must be equal to "this.parsedValue.safeContents"');
    }
    this.safeContents = [];
    for (const [index, content] of this.parsedValue.safeContents.entries()) {
      ParameterError.assert("content", content, "privacyMode", "value");
      ArgumentError.assert(content.value, "content.value", SafeContents);
      switch (content.privacyMode) {
        case 0:
          {
            const contentBuffer = content.value.toSchema().toBER(false);
            this.safeContents.push(new ContentInfo({
              contentType: "1.2.840.113549.1.7.1",
              content: new OctetString$1({ valueHex: contentBuffer })
            }));
          }
          break;
        case 1:
          {
            const cmsEncrypted = new EncryptedData();
            const currentParameters = parameters.safeContents[index];
            currentParameters.contentToEncrypt = content.value.toSchema().toBER(false);
            await cmsEncrypted.encrypt(currentParameters, crypto2);
            this.safeContents.push(new ContentInfo({
              contentType: "1.2.840.113549.1.7.6",
              content: cmsEncrypted.toSchema()
            }));
          }
          break;
        case 2:
          {
            const cmsEnveloped = new EnvelopedData();
            const contentToEncrypt = content.value.toSchema().toBER(false);
            const safeContent = parameters.safeContents[index];
            ParameterError.assert("parameters.safeContents[".concat(index, "]"), safeContent, "encryptingCertificate", "encryptionAlgorithm");
            switch (true) {
              case safeContent.encryptionAlgorithm.name.toLowerCase() === "aes-cbc":
              case safeContent.encryptionAlgorithm.name.toLowerCase() === "aes-gcm":
                break;
              default:
                throw new Error('Incorrect parameter "encryptionAlgorithm" in "parameters.safeContents[i]": '.concat(safeContent.encryptionAlgorithm));
            }
            switch (true) {
              case safeContent.encryptionAlgorithm.length === 128:
              case safeContent.encryptionAlgorithm.length === 192:
              case safeContent.encryptionAlgorithm.length === 256:
                break;
              default:
                throw new Error('Incorrect parameter "encryptionAlgorithm.length" in "parameters.safeContents[i]": '.concat(safeContent.encryptionAlgorithm.length));
            }
            const encryptionAlgorithm = safeContent.encryptionAlgorithm;
            cmsEnveloped.addRecipientByCertificate(safeContent.encryptingCertificate, {}, void 0, crypto2);
            await cmsEnveloped.encrypt(encryptionAlgorithm, contentToEncrypt, crypto2);
            this.safeContents.push(new ContentInfo({
              contentType: "1.2.840.113549.1.7.3",
              content: cmsEnveloped.toSchema()
            }));
          }
          break;
        default:
          throw new Error('Incorrect value for "content.privacyMode": '.concat(content.privacyMode));
      }
    }
    return this;
  }
}
AuthenticatedSafe.CLASS_NAME = "AuthenticatedSafe";
const HASH_ALGORITHM$1 = "hashAlgorithm";
const ISSUER_NAME_HASH = "issuerNameHash";
const ISSUER_KEY_HASH = "issuerKeyHash";
const SERIAL_NUMBER$1 = "serialNumber";
const CLEAR_PROPS$j = [
  HASH_ALGORITHM$1,
  ISSUER_NAME_HASH,
  ISSUER_KEY_HASH,
  SERIAL_NUMBER$1
];
class CertID extends PkiObject {
  static async create(certificate, parameters, crypto2 = getCrypto(true)) {
    const certID = new CertID();
    await certID.createForCertificate(certificate, parameters, crypto2);
    return certID;
  }
  constructor(parameters = {}) {
    super();
    this.hashAlgorithm = getParametersValue(parameters, HASH_ALGORITHM$1, CertID.defaultValues(HASH_ALGORITHM$1));
    this.issuerNameHash = getParametersValue(parameters, ISSUER_NAME_HASH, CertID.defaultValues(ISSUER_NAME_HASH));
    this.issuerKeyHash = getParametersValue(parameters, ISSUER_KEY_HASH, CertID.defaultValues(ISSUER_KEY_HASH));
    this.serialNumber = getParametersValue(parameters, SERIAL_NUMBER$1, CertID.defaultValues(SERIAL_NUMBER$1));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case HASH_ALGORITHM$1:
        return new AlgorithmIdentifier();
      case ISSUER_NAME_HASH:
      case ISSUER_KEY_HASH:
        return new OctetString$1();
      case SERIAL_NUMBER$1:
        return new Integer();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case HASH_ALGORITHM$1:
        return memberValue.algorithmId === EMPTY_STRING && "algorithmParams" in memberValue === false;
      case ISSUER_NAME_HASH:
      case ISSUER_KEY_HASH:
      case SERIAL_NUMBER$1:
        return memberValue.isEqual(CertID.defaultValues(SERIAL_NUMBER$1));
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AlgorithmIdentifier.schema(names.hashAlgorithmObject || {
          names: {
            blockName: names.hashAlgorithm || EMPTY_STRING
          }
        }),
        new OctetString$1({ name: names.issuerNameHash || EMPTY_STRING }),
        new OctetString$1({ name: names.issuerKeyHash || EMPTY_STRING }),
        new Integer({ name: names.serialNumber || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$j);
    const asn1 = compareSchema(schema, schema, CertID.schema({
      names: {
        hashAlgorithm: HASH_ALGORITHM$1,
        issuerNameHash: ISSUER_NAME_HASH,
        issuerKeyHash: ISSUER_KEY_HASH,
        serialNumber: SERIAL_NUMBER$1
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.hashAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.hashAlgorithm });
    this.issuerNameHash = asn1.result.issuerNameHash;
    this.issuerKeyHash = asn1.result.issuerKeyHash;
    this.serialNumber = asn1.result.serialNumber;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.hashAlgorithm.toSchema(),
        this.issuerNameHash,
        this.issuerKeyHash,
        this.serialNumber
      ]
    });
  }
  toJSON() {
    return {
      hashAlgorithm: this.hashAlgorithm.toJSON(),
      issuerNameHash: this.issuerNameHash.toJSON(),
      issuerKeyHash: this.issuerKeyHash.toJSON(),
      serialNumber: this.serialNumber.toJSON()
    };
  }
  isEqual(certificateID) {
    if (this.hashAlgorithm.algorithmId !== certificateID.hashAlgorithm.algorithmId) {
      return false;
    }
    if (!BufferSourceConverter.isEqual(this.issuerNameHash.valueBlock.valueHexView, certificateID.issuerNameHash.valueBlock.valueHexView)) {
      return false;
    }
    if (!BufferSourceConverter.isEqual(this.issuerKeyHash.valueBlock.valueHexView, certificateID.issuerKeyHash.valueBlock.valueHexView)) {
      return false;
    }
    if (!this.serialNumber.isEqual(certificateID.serialNumber)) {
      return false;
    }
    return true;
  }
  async createForCertificate(certificate, parameters, crypto2 = getCrypto(true)) {
    ParameterError.assert(parameters, HASH_ALGORITHM$1, "issuerCertificate");
    const hashOID = crypto2.getOIDByAlgorithm({ name: parameters.hashAlgorithm }, true, "hashAlgorithm");
    this.hashAlgorithm = new AlgorithmIdentifier({
      algorithmId: hashOID,
      algorithmParams: new Null()
    });
    const issuerCertificate = parameters.issuerCertificate;
    this.serialNumber = certificate.serialNumber;
    const hashIssuerName = await crypto2.digest({ name: parameters.hashAlgorithm }, issuerCertificate.subject.toSchema().toBER(false));
    this.issuerNameHash = new OctetString$1({ valueHex: hashIssuerName });
    const issuerKeyBuffer = issuerCertificate.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHexView;
    const hashIssuerKey = await crypto2.digest({ name: parameters.hashAlgorithm }, issuerKeyBuffer);
    this.issuerKeyHash = new OctetString$1({ valueHex: hashIssuerKey });
  }
}
CertID.CLASS_NAME = "CertID";
const CERT_ID = "certID";
const CERT_STATUS = "certStatus";
const THIS_UPDATE = "thisUpdate";
const NEXT_UPDATE = "nextUpdate";
const SINGLE_EXTENSIONS = "singleExtensions";
const CLEAR_PROPS$i = [
  CERT_ID,
  CERT_STATUS,
  THIS_UPDATE,
  NEXT_UPDATE,
  SINGLE_EXTENSIONS
];
class SingleResponse extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.certID = getParametersValue(parameters, CERT_ID, SingleResponse.defaultValues(CERT_ID));
    this.certStatus = getParametersValue(parameters, CERT_STATUS, SingleResponse.defaultValues(CERT_STATUS));
    this.thisUpdate = getParametersValue(parameters, THIS_UPDATE, SingleResponse.defaultValues(THIS_UPDATE));
    if (NEXT_UPDATE in parameters) {
      this.nextUpdate = getParametersValue(parameters, NEXT_UPDATE, SingleResponse.defaultValues(NEXT_UPDATE));
    }
    if (SINGLE_EXTENSIONS in parameters) {
      this.singleExtensions = getParametersValue(parameters, SINGLE_EXTENSIONS, SingleResponse.defaultValues(SINGLE_EXTENSIONS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case CERT_ID:
        return new CertID();
      case CERT_STATUS:
        return {};
      case THIS_UPDATE:
      case NEXT_UPDATE:
        return new Date(0, 0, 0);
      case SINGLE_EXTENSIONS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case CERT_ID:
        return CertID.compareWithDefault("hashAlgorithm", memberValue.hashAlgorithm) && CertID.compareWithDefault("issuerNameHash", memberValue.issuerNameHash) && CertID.compareWithDefault("issuerKeyHash", memberValue.issuerKeyHash) && CertID.compareWithDefault("serialNumber", memberValue.serialNumber);
      case CERT_STATUS:
        return Object.keys(memberValue).length === 0;
      case THIS_UPDATE:
      case NEXT_UPDATE:
        return memberValue === SingleResponse.defaultValues(memberName);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        CertID.schema(names.certID || {}),
        new Choice({
          value: [
            new Primitive({
              name: names.certStatus || EMPTY_STRING,
              idBlock: {
                tagClass: 3,
                tagNumber: 0
              }
            }),
            new Constructed({
              name: names.certStatus || EMPTY_STRING,
              idBlock: {
                tagClass: 3,
                tagNumber: 1
              },
              value: [
                new GeneralizedTime(),
                new Constructed({
                  optional: true,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: 0
                  },
                  value: [new Enumerated()]
                })
              ]
            }),
            new Primitive({
              name: names.certStatus || EMPTY_STRING,
              idBlock: {
                tagClass: 3,
                tagNumber: 2
              },
              lenBlock: { length: 1 }
            })
          ]
        }),
        new GeneralizedTime({ name: names.thisUpdate || EMPTY_STRING }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new GeneralizedTime({ name: names.nextUpdate || EMPTY_STRING })]
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [Extensions.schema(names.singleExtensions || {})]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$i);
    const asn1 = compareSchema(schema, schema, SingleResponse.schema({
      names: {
        certID: {
          names: {
            blockName: CERT_ID
          }
        },
        certStatus: CERT_STATUS,
        thisUpdate: THIS_UPDATE,
        nextUpdate: NEXT_UPDATE,
        singleExtensions: {
          names: {
            blockName: SINGLE_EXTENSIONS
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.certID = new CertID({ schema: asn1.result.certID });
    this.certStatus = asn1.result.certStatus;
    this.thisUpdate = asn1.result.thisUpdate.toDate();
    if (NEXT_UPDATE in asn1.result)
      this.nextUpdate = asn1.result.nextUpdate.toDate();
    if (SINGLE_EXTENSIONS in asn1.result)
      this.singleExtensions = Array.from(asn1.result.singleExtensions.valueBlock.value, (element) => new Extension({ schema: element }));
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.certID.toSchema());
    outputArray.push(this.certStatus);
    outputArray.push(new GeneralizedTime({ valueDate: this.thisUpdate }));
    if (this.nextUpdate) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [new GeneralizedTime({ valueDate: this.nextUpdate })]
      }));
    }
    if (this.singleExtensions) {
      outputArray.push(new Sequence({
        value: Array.from(this.singleExtensions, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      certID: this.certID.toJSON(),
      certStatus: this.certStatus.toJSON(),
      thisUpdate: this.thisUpdate
    };
    if (this.nextUpdate) {
      res.nextUpdate = this.nextUpdate;
    }
    if (this.singleExtensions) {
      res.singleExtensions = Array.from(this.singleExtensions, (o2) => o2.toJSON());
    }
    return res;
  }
}
SingleResponse.CLASS_NAME = "SingleResponse";
const TBS$2 = "tbs";
const VERSION$7 = "version";
const RESPONDER_ID = "responderID";
const PRODUCED_AT = "producedAt";
const RESPONSES = "responses";
const RESPONSE_EXTENSIONS = "responseExtensions";
const RESPONSE_DATA = "ResponseData";
const RESPONSE_DATA_VERSION = "".concat(RESPONSE_DATA, ".").concat(VERSION$7);
const RESPONSE_DATA_RESPONDER_ID = "".concat(RESPONSE_DATA, ".").concat(RESPONDER_ID);
const RESPONSE_DATA_PRODUCED_AT = "".concat(RESPONSE_DATA, ".").concat(PRODUCED_AT);
const RESPONSE_DATA_RESPONSES = "".concat(RESPONSE_DATA, ".").concat(RESPONSES);
const RESPONSE_DATA_RESPONSE_EXTENSIONS = "".concat(RESPONSE_DATA, ".").concat(RESPONSE_EXTENSIONS);
const CLEAR_PROPS$h = [
  RESPONSE_DATA,
  RESPONSE_DATA_VERSION,
  RESPONSE_DATA_RESPONDER_ID,
  RESPONSE_DATA_PRODUCED_AT,
  RESPONSE_DATA_RESPONSES,
  RESPONSE_DATA_RESPONSE_EXTENSIONS
];
class ResponseData extends PkiObject {
  get tbs() {
    return BufferSourceConverter.toArrayBuffer(this.tbsView);
  }
  set tbs(value) {
    this.tbsView = new Uint8Array(value);
  }
  constructor(parameters = {}) {
    super();
    this.tbsView = new Uint8Array(getParametersValue(parameters, TBS$2, ResponseData.defaultValues(TBS$2)));
    if (VERSION$7 in parameters) {
      this.version = getParametersValue(parameters, VERSION$7, ResponseData.defaultValues(VERSION$7));
    }
    this.responderID = getParametersValue(parameters, RESPONDER_ID, ResponseData.defaultValues(RESPONDER_ID));
    this.producedAt = getParametersValue(parameters, PRODUCED_AT, ResponseData.defaultValues(PRODUCED_AT));
    this.responses = getParametersValue(parameters, RESPONSES, ResponseData.defaultValues(RESPONSES));
    if (RESPONSE_EXTENSIONS in parameters) {
      this.responseExtensions = getParametersValue(parameters, RESPONSE_EXTENSIONS, ResponseData.defaultValues(RESPONSE_EXTENSIONS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$7:
        return 0;
      case TBS$2:
        return EMPTY_BUFFER;
      case RESPONDER_ID:
        return {};
      case PRODUCED_AT:
        return new Date(0, 0, 0);
      case RESPONSES:
      case RESPONSE_EXTENSIONS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case TBS$2:
        return memberValue.byteLength === 0;
      case RESPONDER_ID:
        return Object.keys(memberValue).length === 0;
      case PRODUCED_AT:
        return memberValue === ResponseData.defaultValues(memberName);
      case RESPONSES:
      case RESPONSE_EXTENSIONS:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || RESPONSE_DATA,
      value: [
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Integer({ name: names.version || RESPONSE_DATA_VERSION })]
        }),
        new Choice({
          value: [
            new Constructed({
              name: names.responderID || RESPONSE_DATA_RESPONDER_ID,
              idBlock: {
                tagClass: 3,
                tagNumber: 1
              },
              value: [RelativeDistinguishedNames.schema(names.ResponseDataByName || {
                names: {
                  blockName: "ResponseData.byName"
                }
              })]
            }),
            new Constructed({
              name: names.responderID || RESPONSE_DATA_RESPONDER_ID,
              idBlock: {
                tagClass: 3,
                tagNumber: 2
              },
              value: [new OctetString$1({ name: names.ResponseDataByKey || "ResponseData.byKey" })]
            })
          ]
        }),
        new GeneralizedTime({ name: names.producedAt || RESPONSE_DATA_PRODUCED_AT }),
        new Sequence({
          value: [
            new Repeated({
              name: RESPONSE_DATA_RESPONSES,
              value: SingleResponse.schema(names.response || {})
            })
          ]
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [Extensions.schema(names.extensions || {
            names: {
              blockName: RESPONSE_DATA_RESPONSE_EXTENSIONS
            }
          })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$h);
    const asn1 = compareSchema(schema, schema, ResponseData.schema());
    AsnError.assertSchema(asn1, this.className);
    this.tbsView = asn1.result.ResponseData.valueBeforeDecodeView;
    if (RESPONSE_DATA_VERSION in asn1.result)
      this.version = asn1.result[RESPONSE_DATA_VERSION].valueBlock.valueDec;
    if (asn1.result[RESPONSE_DATA_RESPONDER_ID].idBlock.tagNumber === 1)
      this.responderID = new RelativeDistinguishedNames({ schema: asn1.result[RESPONSE_DATA_RESPONDER_ID].valueBlock.value[0] });
    else
      this.responderID = asn1.result[RESPONSE_DATA_RESPONDER_ID].valueBlock.value[0];
    this.producedAt = asn1.result[RESPONSE_DATA_PRODUCED_AT].toDate();
    this.responses = Array.from(asn1.result[RESPONSE_DATA_RESPONSES], (element) => new SingleResponse({ schema: element }));
    if (RESPONSE_DATA_RESPONSE_EXTENSIONS in asn1.result)
      this.responseExtensions = Array.from(asn1.result[RESPONSE_DATA_RESPONSE_EXTENSIONS].valueBlock.value, (element) => new Extension({ schema: element }));
  }
  toSchema(encodeFlag = false) {
    let tbsSchema;
    if (encodeFlag === false) {
      if (!this.tbsView.byteLength) {
        return ResponseData.schema();
      }
      const asn1 = fromBER(this.tbsView);
      AsnError.assert(asn1, "TBS Response Data");
      tbsSchema = asn1.result;
    } else {
      const outputArray = [];
      if (VERSION$7 in this) {
        outputArray.push(new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Integer({ value: this.version })]
        }));
      }
      if (this.responderID instanceof RelativeDistinguishedNames) {
        outputArray.push(new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [this.responderID.toSchema()]
        }));
      } else {
        outputArray.push(new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          },
          value: [this.responderID]
        }));
      }
      outputArray.push(new GeneralizedTime({ valueDate: this.producedAt }));
      outputArray.push(new Sequence({
        value: Array.from(this.responses, (o2) => o2.toSchema())
      }));
      if (this.responseExtensions) {
        outputArray.push(new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [new Sequence({
            value: Array.from(this.responseExtensions, (o2) => o2.toSchema())
          })]
        }));
      }
      tbsSchema = new Sequence({
        value: outputArray
      });
    }
    return tbsSchema;
  }
  toJSON() {
    const res = {};
    if (VERSION$7 in this) {
      res.version = this.version;
    }
    if (this.responderID) {
      res.responderID = this.responderID;
    }
    if (this.producedAt) {
      res.producedAt = this.producedAt;
    }
    if (this.responses) {
      res.responses = Array.from(this.responses, (o2) => o2.toJSON());
    }
    if (this.responseExtensions) {
      res.responseExtensions = Array.from(this.responseExtensions, (o2) => o2.toJSON());
    }
    return res;
  }
}
ResponseData.CLASS_NAME = "ResponseData";
const TRUSTED_CERTS = "trustedCerts";
const CERTS$2 = "certs";
const CRLS$1 = "crls";
const OCSPS$1 = "ocsps";
const CHECK_DATE = "checkDate";
const FIND_ORIGIN = "findOrigin";
const FIND_ISSUER = "findIssuer";
var ChainValidationCode;
(function(ChainValidationCode2) {
  ChainValidationCode2[ChainValidationCode2["unknown"] = -1] = "unknown";
  ChainValidationCode2[ChainValidationCode2["success"] = 0] = "success";
  ChainValidationCode2[ChainValidationCode2["noRevocation"] = 11] = "noRevocation";
  ChainValidationCode2[ChainValidationCode2["noPath"] = 60] = "noPath";
  ChainValidationCode2[ChainValidationCode2["noValidPath"] = 97] = "noValidPath";
})(ChainValidationCode || (ChainValidationCode = {}));
class ChainValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = ChainValidationError.NAME;
    this.code = code;
    this.message = message;
  }
}
ChainValidationError.NAME = "ChainValidationError";
function isTrusted(cert, trustedList) {
  for (let i2 = 0; i2 < trustedList.length; i2++) {
    if (BufferSourceConverter.isEqual(cert.tbsView, trustedList[i2].tbsView)) {
      return true;
    }
  }
  return false;
}
class CertificateChainValidationEngine {
  constructor(parameters = {}) {
    this.trustedCerts = getParametersValue(parameters, TRUSTED_CERTS, this.defaultValues(TRUSTED_CERTS));
    this.certs = getParametersValue(parameters, CERTS$2, this.defaultValues(CERTS$2));
    this.crls = getParametersValue(parameters, CRLS$1, this.defaultValues(CRLS$1));
    this.ocsps = getParametersValue(parameters, OCSPS$1, this.defaultValues(OCSPS$1));
    this.checkDate = getParametersValue(parameters, CHECK_DATE, this.defaultValues(CHECK_DATE));
    this.findOrigin = getParametersValue(parameters, FIND_ORIGIN, this.defaultValues(FIND_ORIGIN));
    this.findIssuer = getParametersValue(parameters, FIND_ISSUER, this.defaultValues(FIND_ISSUER));
  }
  static defaultFindOrigin(certificate, validationEngine) {
    if (certificate.tbsView.byteLength === 0) {
      certificate.tbsView = new Uint8Array(certificate.encodeTBS().toBER());
    }
    for (const localCert of validationEngine.certs) {
      if (localCert.tbsView.byteLength === 0) {
        localCert.tbsView = new Uint8Array(localCert.encodeTBS().toBER());
      }
      if (BufferSourceConverter.isEqual(certificate.tbsView, localCert.tbsView))
        return "Intermediate Certificates";
    }
    for (const trustedCert of validationEngine.trustedCerts) {
      if (trustedCert.tbsView.byteLength === 0)
        trustedCert.tbsView = new Uint8Array(trustedCert.encodeTBS().toBER());
      if (BufferSourceConverter.isEqual(certificate.tbsView, trustedCert.tbsView))
        return "Trusted Certificates";
    }
    return "Unknown";
  }
  async defaultFindIssuer(certificate, validationEngine, crypto2 = getCrypto(true)) {
    const result = [];
    let keyIdentifier = null;
    let authorityCertIssuer = null;
    let authorityCertSerialNumber = null;
    if (certificate.subject.isEqual(certificate.issuer)) {
      try {
        const verificationResult = await certificate.verify(void 0, crypto2);
        if (verificationResult) {
          return [certificate];
        }
      } catch (ex) {
      }
    }
    if (certificate.extensions) {
      for (const extension of certificate.extensions) {
        if (extension.extnID === id_AuthorityKeyIdentifier && extension.parsedValue instanceof AuthorityKeyIdentifier) {
          if (extension.parsedValue.keyIdentifier) {
            keyIdentifier = extension.parsedValue.keyIdentifier;
          } else {
            if (extension.parsedValue.authorityCertIssuer) {
              authorityCertIssuer = extension.parsedValue.authorityCertIssuer;
            }
            if (extension.parsedValue.authorityCertSerialNumber) {
              authorityCertSerialNumber = extension.parsedValue.authorityCertSerialNumber;
            }
          }
          break;
        }
      }
    }
    function checkCertificate(possibleIssuer) {
      if (keyIdentifier !== null) {
        if (possibleIssuer.extensions) {
          let extensionFound = false;
          for (const extension of possibleIssuer.extensions) {
            if (extension.extnID === id_SubjectKeyIdentifier && extension.parsedValue) {
              extensionFound = true;
              if (BufferSourceConverter.isEqual(extension.parsedValue.valueBlock.valueHex, keyIdentifier.valueBlock.valueHexView)) {
                result.push(possibleIssuer);
              }
              break;
            }
          }
          if (extensionFound) {
            return;
          }
        }
      }
      let authorityCertSerialNumberEqual = false;
      if (authorityCertSerialNumber !== null)
        authorityCertSerialNumberEqual = possibleIssuer.serialNumber.isEqual(authorityCertSerialNumber);
      if (authorityCertIssuer !== null) {
        if (possibleIssuer.subject.isEqual(authorityCertIssuer)) {
          if (authorityCertSerialNumberEqual)
            result.push(possibleIssuer);
        }
      } else {
        if (certificate.issuer.isEqual(possibleIssuer.subject))
          result.push(possibleIssuer);
      }
    }
    for (const trustedCert of validationEngine.trustedCerts) {
      checkCertificate(trustedCert);
    }
    for (const intermediateCert of validationEngine.certs) {
      checkCertificate(intermediateCert);
    }
    for (let i2 = result.length - 1; i2 >= 0; i2--) {
      try {
        const verificationResult = await certificate.verify(result[i2], crypto2);
        if (verificationResult === false)
          result.splice(i2, 1);
      } catch (ex) {
        result.splice(i2, 1);
      }
    }
    return result;
  }
  defaultValues(memberName) {
    switch (memberName) {
      case TRUSTED_CERTS:
        return [];
      case CERTS$2:
        return [];
      case CRLS$1:
        return [];
      case OCSPS$1:
        return [];
      case CHECK_DATE:
        return /* @__PURE__ */ new Date();
      case FIND_ORIGIN:
        return CertificateChainValidationEngine.defaultFindOrigin;
      case FIND_ISSUER:
        return this.defaultFindIssuer;
      default:
        throw new Error("Invalid member name for CertificateChainValidationEngine class: ".concat(memberName));
    }
  }
  async sort(passedWhenNotRevValues = false, crypto2 = getCrypto(true)) {
    const localCerts = [];
    const buildPath = async (certificate, crypto3) => {
      const result2 = [];
      function checkUnique(array) {
        let unique = true;
        for (let i2 = 0; i2 < array.length; i2++) {
          for (let j2 = 0; j2 < array.length; j2++) {
            if (j2 === i2)
              continue;
            if (array[i2] === array[j2]) {
              unique = false;
              break;
            }
          }
          if (!unique)
            break;
        }
        return unique;
      }
      if (isTrusted(certificate, this.trustedCerts)) {
        return [[certificate]];
      }
      const findIssuerResult = await this.findIssuer(certificate, this, crypto3);
      if (findIssuerResult.length === 0) {
        throw new Error("No valid certificate paths found");
      }
      for (let i2 = 0; i2 < findIssuerResult.length; i2++) {
        if (BufferSourceConverter.isEqual(findIssuerResult[i2].tbsView, certificate.tbsView)) {
          result2.push([findIssuerResult[i2]]);
          continue;
        }
        const buildPathResult = await buildPath(findIssuerResult[i2], crypto3);
        for (let j2 = 0; j2 < buildPathResult.length; j2++) {
          const copy = buildPathResult[j2].slice();
          copy.splice(0, 0, findIssuerResult[i2]);
          if (checkUnique(copy))
            result2.push(copy);
          else
            result2.push(buildPathResult[j2]);
        }
      }
      return result2;
    };
    const findCRL = async (certificate) => {
      const issuerCertificates = [];
      const crls = [];
      const crlsAndCertificates = [];
      issuerCertificates.push(...localCerts.filter((element) => certificate.issuer.isEqual(element.subject)));
      if (issuerCertificates.length === 0) {
        return {
          status: 1,
          statusMessage: "No certificate's issuers"
        };
      }
      crls.push(...this.crls.filter((o2) => o2.issuer.isEqual(certificate.issuer)));
      if (crls.length === 0) {
        return {
          status: 2,
          statusMessage: "No CRLs for specific certificate issuer"
        };
      }
      for (let i2 = 0; i2 < crls.length; i2++) {
        const crl = crls[i2];
        if (crl.nextUpdate && crl.nextUpdate.value < this.checkDate) {
          continue;
        }
        for (let j2 = 0; j2 < issuerCertificates.length; j2++) {
          try {
            const result2 = await crls[i2].verify({ issuerCertificate: issuerCertificates[j2] }, crypto2);
            if (result2) {
              crlsAndCertificates.push({
                crl: crls[i2],
                certificate: issuerCertificates[j2]
              });
              break;
            }
          } catch (ex) {
          }
        }
      }
      if (crlsAndCertificates.length) {
        return {
          status: 0,
          statusMessage: EMPTY_STRING,
          result: crlsAndCertificates
        };
      }
      return {
        status: 3,
        statusMessage: "No valid CRLs found"
      };
    };
    const findOCSP = async (certificate, issuerCertificate) => {
      const hashAlgorithm = crypto2.getAlgorithmByOID(certificate.signatureAlgorithm.algorithmId);
      if (!hashAlgorithm.name) {
        return 1;
      }
      if (!hashAlgorithm.hash) {
        return 1;
      }
      for (let i2 = 0; i2 < this.ocsps.length; i2++) {
        const ocsp = this.ocsps[i2];
        const result2 = await ocsp.getCertificateStatus(certificate, issuerCertificate, crypto2);
        if (result2.isForCertificate) {
          if (result2.status === 0)
            return 0;
          return 1;
        }
      }
      return 2;
    };
    async function checkForCA(certificate, needToCheckCRL = false) {
      let isCA = false;
      let mustBeCA = false;
      let keyUsagePresent = false;
      let cRLSign = false;
      if (certificate.extensions) {
        for (let j2 = 0; j2 < certificate.extensions.length; j2++) {
          const extension = certificate.extensions[j2];
          if (extension.critical && !extension.parsedValue) {
            return {
              result: false,
              resultCode: 6,
              resultMessage: "Unable to parse critical certificate extension: ".concat(extension.extnID)
            };
          }
          if (extension.extnID === id_KeyUsage) {
            keyUsagePresent = true;
            const view = new Uint8Array(extension.parsedValue.valueBlock.valueHex);
            if ((view[0] & 4) === 4)
              mustBeCA = true;
            if ((view[0] & 2) === 2)
              cRLSign = true;
          }
          if (extension.extnID === id_BasicConstraints) {
            if ("cA" in extension.parsedValue) {
              if (extension.parsedValue.cA === true)
                isCA = true;
            }
          }
        }
        if (mustBeCA === true && isCA === false) {
          return {
            result: false,
            resultCode: 3,
            resultMessage: 'Unable to build certificate chain - using "keyCertSign" flag set without BasicConstraints'
          };
        }
        if (keyUsagePresent === true && isCA === true && mustBeCA === false) {
          return {
            result: false,
            resultCode: 4,
            resultMessage: 'Unable to build certificate chain - "keyCertSign" flag was not set'
          };
        }
        if (isCA === true && keyUsagePresent === true && (needToCheckCRL && cRLSign === false)) {
          return {
            result: false,
            resultCode: 5,
            resultMessage: 'Unable to build certificate chain - intermediate certificate must have "cRLSign" key usage flag'
          };
        }
      }
      if (isCA === false) {
        return {
          result: false,
          resultCode: 7,
          resultMessage: "Unable to build certificate chain - more than one possible end-user certificate"
        };
      }
      return {
        result: true,
        resultCode: 0,
        resultMessage: EMPTY_STRING
      };
    }
    const basicCheck = async (path, checkDate) => {
      for (let i2 = 0; i2 < path.length; i2++) {
        if (path[i2].notBefore.value > checkDate || path[i2].notAfter.value < checkDate) {
          return {
            result: false,
            resultCode: 8,
            resultMessage: "The certificate is either not yet valid or expired"
          };
        }
      }
      if (path.length < 2) {
        return {
          result: false,
          resultCode: 9,
          resultMessage: "Too short certificate path"
        };
      }
      for (let i2 = path.length - 2; i2 >= 0; i2--) {
        if (path[i2].issuer.isEqual(path[i2].subject) === false) {
          if (path[i2].issuer.isEqual(path[i2 + 1].subject) === false) {
            return {
              result: false,
              resultCode: 10,
              resultMessage: "Incorrect name chaining"
            };
          }
        }
      }
      if (this.crls.length !== 0 || this.ocsps.length !== 0) {
        for (let i2 = 0; i2 < path.length - 1; i2++) {
          let ocspResult = 2;
          let crlResult = {
            status: 0,
            statusMessage: EMPTY_STRING
          };
          if (this.ocsps.length !== 0) {
            ocspResult = await findOCSP(path[i2], path[i2 + 1]);
            switch (ocspResult) {
              case 0:
                continue;
              case 1:
                return {
                  result: false,
                  resultCode: 12,
                  resultMessage: "One of certificates was revoked via OCSP response"
                };
            }
          }
          if (this.crls.length !== 0) {
            crlResult = await findCRL(path[i2]);
            if (crlResult.status === 0 && crlResult.result) {
              for (let j2 = 0; j2 < crlResult.result.length; j2++) {
                const isCertificateRevoked = crlResult.result[j2].crl.isCertificateRevoked(path[i2]);
                if (isCertificateRevoked) {
                  return {
                    result: false,
                    resultCode: 12,
                    resultMessage: "One of certificates had been revoked"
                  };
                }
                const isCertificateCA = await checkForCA(crlResult.result[j2].certificate, true);
                if (isCertificateCA.result === false) {
                  return {
                    result: false,
                    resultCode: 13,
                    resultMessage: "CRL issuer certificate is not a CA certificate or does not have crlSign flag"
                  };
                }
              }
            } else {
              if (passedWhenNotRevValues === false) {
                throw new ChainValidationError(ChainValidationCode.noRevocation, "No revocation values found for one of certificates: ".concat(crlResult.statusMessage));
              }
            }
          } else {
            if (ocspResult === 2) {
              return {
                result: false,
                resultCode: 11,
                resultMessage: "No revocation values found for one of certificates"
              };
            }
          }
          if (ocspResult === 2 && crlResult.status === 2 && passedWhenNotRevValues) {
            const issuerCertificate = path[i2 + 1];
            let extensionFound = false;
            if (issuerCertificate.extensions) {
              for (const extension of issuerCertificate.extensions) {
                switch (extension.extnID) {
                  case id_CRLDistributionPoints:
                  case id_FreshestCRL:
                  case id_AuthorityInfoAccess:
                    extensionFound = true;
                    break;
                }
              }
            }
            if (extensionFound) {
              throw new ChainValidationError(ChainValidationCode.noRevocation, "No revocation values found for one of certificates: ".concat(crlResult.statusMessage));
            }
          }
        }
      }
      for (const [i2, cert] of path.entries()) {
        if (!i2) {
          continue;
        }
        const result2 = await checkForCA(cert);
        if (!result2.result) {
          return {
            result: false,
            resultCode: 14,
            resultMessage: "One of intermediate certificates is not a CA certificate"
          };
        }
      }
      return {
        result: true
      };
    };
    localCerts.push(...this.trustedCerts);
    localCerts.push(...this.certs);
    for (let i2 = 0; i2 < localCerts.length; i2++) {
      for (let j2 = 0; j2 < localCerts.length; j2++) {
        if (i2 === j2)
          continue;
        if (BufferSourceConverter.isEqual(localCerts[i2].tbsView, localCerts[j2].tbsView)) {
          localCerts.splice(j2, 1);
          i2 = 0;
          break;
        }
      }
    }
    const leafCert = localCerts[localCerts.length - 1];
    let result;
    const certificatePath = [leafCert];
    result = await buildPath(leafCert, crypto2);
    if (result.length === 0) {
      throw new ChainValidationError(ChainValidationCode.noPath, "Unable to find certificate path");
    }
    for (let i2 = result.length - 1; i2 >= 0; i2--) {
      let found = false;
      for (let j2 = 0; j2 < result[i2].length; j2++) {
        const certificate = result[i2][j2];
        for (let k2 = 0; k2 < this.trustedCerts.length; k2++) {
          if (BufferSourceConverter.isEqual(certificate.tbsView, this.trustedCerts[k2].tbsView)) {
            found = true;
            break;
          }
        }
        if (found)
          break;
      }
      if (!found) {
        result.splice(i2, 1);
      }
    }
    if (result.length === 0) {
      throw new ChainValidationError(ChainValidationCode.noValidPath, "No valid certificate paths found");
    }
    let shortestLength = result[0].length;
    let shortestIndex = 0;
    for (let i2 = 0; i2 < result.length; i2++) {
      if (result[i2].length < shortestLength) {
        shortestLength = result[i2].length;
        shortestIndex = i2;
      }
    }
    for (let i2 = 0; i2 < result[shortestIndex].length; i2++)
      certificatePath.push(result[shortestIndex][i2]);
    result = await basicCheck(certificatePath, this.checkDate);
    if (result.result === false)
      throw result;
    return certificatePath;
  }
  async verify(parameters = {}, crypto2 = getCrypto(true)) {
    function compareDNSName(name, constraint) {
      const namePrepared = stringPrep(name);
      const constraintPrepared = stringPrep(constraint);
      const nameSplitted = namePrepared.split(".");
      const constraintSplitted = constraintPrepared.split(".");
      const nameLen = nameSplitted.length;
      const constrLen = constraintSplitted.length;
      if (nameLen === 0 || constrLen === 0 || nameLen < constrLen) {
        return false;
      }
      for (let i2 = 0; i2 < nameLen; i2++) {
        if (nameSplitted[i2].length === 0) {
          return false;
        }
      }
      for (let i2 = 0; i2 < constrLen; i2++) {
        if (constraintSplitted[i2].length === 0) {
          if (i2 === 0) {
            if (constrLen === 1) {
              return false;
            }
            continue;
          }
          return false;
        }
      }
      for (let i2 = 0; i2 < constrLen; i2++) {
        if (constraintSplitted[constrLen - 1 - i2].length === 0) {
          continue;
        }
        if (nameSplitted[nameLen - 1 - i2].localeCompare(constraintSplitted[constrLen - 1 - i2]) !== 0) {
          return false;
        }
      }
      return true;
    }
    function compareRFC822Name(name, constraint) {
      const namePrepared = stringPrep(name);
      const constraintPrepared = stringPrep(constraint);
      const nameSplitted = namePrepared.split("@");
      const constraintSplitted = constraintPrepared.split("@");
      if (nameSplitted.length === 0 || constraintSplitted.length === 0 || nameSplitted.length < constraintSplitted.length)
        return false;
      if (constraintSplitted.length === 1) {
        const result = compareDNSName(nameSplitted[1], constraintSplitted[0]);
        if (result) {
          const ns = nameSplitted[1].split(".");
          const cs = constraintSplitted[0].split(".");
          if (cs[0].length === 0)
            return true;
          return ns.length === cs.length;
        }
        return false;
      }
      return namePrepared.localeCompare(constraintPrepared) === 0;
    }
    function compareUniformResourceIdentifier(name, constraint) {
      let namePrepared = stringPrep(name);
      const constraintPrepared = stringPrep(constraint);
      const ns = namePrepared.split("/");
      const cs = constraintPrepared.split("/");
      if (cs.length > 1)
        return false;
      if (ns.length > 1) {
        for (let i2 = 0; i2 < ns.length; i2++) {
          if (ns[i2].length > 0 && ns[i2].charAt(ns[i2].length - 1) !== ":") {
            const nsPort = ns[i2].split(":");
            namePrepared = nsPort[0];
            break;
          }
        }
      }
      const result = compareDNSName(namePrepared, constraintPrepared);
      if (result) {
        const nameSplitted = namePrepared.split(".");
        const constraintSplitted = constraintPrepared.split(".");
        if (constraintSplitted[0].length === 0)
          return true;
        return nameSplitted.length === constraintSplitted.length;
      }
      return false;
    }
    function compareIPAddress(name, constraint) {
      const nameView = name.valueBlock.valueHexView;
      const constraintView = constraint.valueBlock.valueHexView;
      if (nameView.length === 4 && constraintView.length === 8) {
        for (let i2 = 0; i2 < 4; i2++) {
          if ((nameView[i2] ^ constraintView[i2]) & constraintView[i2 + 4])
            return false;
        }
        return true;
      }
      if (nameView.length === 16 && constraintView.length === 32) {
        for (let i2 = 0; i2 < 16; i2++) {
          if ((nameView[i2] ^ constraintView[i2]) & constraintView[i2 + 16])
            return false;
        }
        return true;
      }
      return false;
    }
    function compareDirectoryName(name, constraint) {
      if (name.typesAndValues.length === 0 || constraint.typesAndValues.length === 0)
        return true;
      if (name.typesAndValues.length < constraint.typesAndValues.length)
        return false;
      let result = true;
      let nameStart = 0;
      for (let i2 = 0; i2 < constraint.typesAndValues.length; i2++) {
        let localResult = false;
        for (let j2 = nameStart; j2 < name.typesAndValues.length; j2++) {
          localResult = name.typesAndValues[j2].isEqual(constraint.typesAndValues[i2]);
          if (name.typesAndValues[j2].type === constraint.typesAndValues[i2].type)
            result = result && localResult;
          if (localResult === true) {
            if (nameStart === 0 || nameStart === j2) {
              nameStart = j2 + 1;
              break;
            } else
              return false;
          }
        }
        if (localResult === false)
          return false;
      }
      return nameStart === 0 ? false : result;
    }
    try {
      if (this.certs.length === 0)
        throw new Error("Empty certificate array");
      const passedWhenNotRevValues = parameters.passedWhenNotRevValues || false;
      const initialPolicySet = parameters.initialPolicySet || [id_AnyPolicy];
      const initialExplicitPolicy = parameters.initialExplicitPolicy || false;
      const initialPolicyMappingInhibit = parameters.initialPolicyMappingInhibit || false;
      const initialInhibitPolicy = parameters.initialInhibitPolicy || false;
      const initialPermittedSubtreesSet = parameters.initialPermittedSubtreesSet || [];
      const initialExcludedSubtreesSet = parameters.initialExcludedSubtreesSet || [];
      const initialRequiredNameForms = parameters.initialRequiredNameForms || [];
      let explicitPolicyIndicator = initialExplicitPolicy;
      let policyMappingInhibitIndicator = initialPolicyMappingInhibit;
      let inhibitAnyPolicyIndicator = initialInhibitPolicy;
      const pendingConstraints = [
        false,
        false,
        false
      ];
      let explicitPolicyPending = 0;
      let policyMappingInhibitPending = 0;
      let inhibitAnyPolicyPending = 0;
      let permittedSubtrees = initialPermittedSubtreesSet;
      let excludedSubtrees = initialExcludedSubtreesSet;
      const requiredNameForms = initialRequiredNameForms;
      let pathDepth = 1;
      this.certs = await this.sort(passedWhenNotRevValues, crypto2);
      const allPolicies = [];
      allPolicies.push(id_AnyPolicy);
      const policiesAndCerts = [];
      const anyPolicyArray = new Array(this.certs.length - 1);
      for (let ii = 0; ii < this.certs.length - 1; ii++)
        anyPolicyArray[ii] = true;
      policiesAndCerts.push(anyPolicyArray);
      const policyMappings = new Array(this.certs.length - 1);
      const certPolicies = new Array(this.certs.length - 1);
      let explicitPolicyStart = explicitPolicyIndicator ? this.certs.length - 1 : -1;
      for (let i2 = this.certs.length - 2; i2 >= 0; i2--, pathDepth++) {
        const cert = this.certs[i2];
        if (cert.extensions) {
          for (let j2 = 0; j2 < cert.extensions.length; j2++) {
            const extension = cert.extensions[j2];
            if (extension.extnID === id_CertificatePolicies) {
              certPolicies[i2] = extension.parsedValue;
              for (let s2 = 0; s2 < allPolicies.length; s2++) {
                if (allPolicies[s2] === id_AnyPolicy) {
                  delete policiesAndCerts[s2][i2];
                  break;
                }
              }
              for (let k2 = 0; k2 < extension.parsedValue.certificatePolicies.length; k2++) {
                let policyIndex = -1;
                const policyId = extension.parsedValue.certificatePolicies[k2].policyIdentifier;
                for (let s2 = 0; s2 < allPolicies.length; s2++) {
                  if (policyId === allPolicies[s2]) {
                    policyIndex = s2;
                    break;
                  }
                }
                if (policyIndex === -1) {
                  allPolicies.push(policyId);
                  const certArray = new Array(this.certs.length - 1);
                  certArray[i2] = true;
                  policiesAndCerts.push(certArray);
                } else
                  policiesAndCerts[policyIndex][i2] = true;
              }
            }
            if (extension.extnID === id_PolicyMappings) {
              if (policyMappingInhibitIndicator) {
                return {
                  result: false,
                  resultCode: 98,
                  resultMessage: "Policy mapping prohibited"
                };
              }
              policyMappings[i2] = extension.parsedValue;
            }
            if (extension.extnID === id_PolicyConstraints) {
              if (explicitPolicyIndicator === false) {
                if (extension.parsedValue.requireExplicitPolicy === 0) {
                  explicitPolicyIndicator = true;
                  explicitPolicyStart = i2;
                } else {
                  if (pendingConstraints[0] === false) {
                    pendingConstraints[0] = true;
                    explicitPolicyPending = extension.parsedValue.requireExplicitPolicy;
                  } else
                    explicitPolicyPending = explicitPolicyPending > extension.parsedValue.requireExplicitPolicy ? extension.parsedValue.requireExplicitPolicy : explicitPolicyPending;
                }
                if (extension.parsedValue.inhibitPolicyMapping === 0)
                  policyMappingInhibitIndicator = true;
                else {
                  if (pendingConstraints[1] === false) {
                    pendingConstraints[1] = true;
                    policyMappingInhibitPending = extension.parsedValue.inhibitPolicyMapping + 1;
                  } else
                    policyMappingInhibitPending = policyMappingInhibitPending > extension.parsedValue.inhibitPolicyMapping + 1 ? extension.parsedValue.inhibitPolicyMapping + 1 : policyMappingInhibitPending;
                }
              }
            }
            if (extension.extnID === id_InhibitAnyPolicy) {
              if (inhibitAnyPolicyIndicator === false) {
                if (extension.parsedValue.valueBlock.valueDec === 0)
                  inhibitAnyPolicyIndicator = true;
                else {
                  if (pendingConstraints[2] === false) {
                    pendingConstraints[2] = true;
                    inhibitAnyPolicyPending = extension.parsedValue.valueBlock.valueDec;
                  } else
                    inhibitAnyPolicyPending = inhibitAnyPolicyPending > extension.parsedValue.valueBlock.valueDec ? extension.parsedValue.valueBlock.valueDec : inhibitAnyPolicyPending;
                }
              }
            }
          }
          if (inhibitAnyPolicyIndicator === true) {
            let policyIndex = -1;
            for (let searchAnyPolicy = 0; searchAnyPolicy < allPolicies.length; searchAnyPolicy++) {
              if (allPolicies[searchAnyPolicy] === id_AnyPolicy) {
                policyIndex = searchAnyPolicy;
                break;
              }
            }
            if (policyIndex !== -1)
              delete policiesAndCerts[0][i2];
          }
          if (explicitPolicyIndicator === false) {
            if (pendingConstraints[0] === true) {
              explicitPolicyPending--;
              if (explicitPolicyPending === 0) {
                explicitPolicyIndicator = true;
                explicitPolicyStart = i2;
                pendingConstraints[0] = false;
              }
            }
          }
          if (policyMappingInhibitIndicator === false) {
            if (pendingConstraints[1] === true) {
              policyMappingInhibitPending--;
              if (policyMappingInhibitPending === 0) {
                policyMappingInhibitIndicator = true;
                pendingConstraints[1] = false;
              }
            }
          }
          if (inhibitAnyPolicyIndicator === false) {
            if (pendingConstraints[2] === true) {
              inhibitAnyPolicyPending--;
              if (inhibitAnyPolicyPending === 0) {
                inhibitAnyPolicyIndicator = true;
                pendingConstraints[2] = false;
              }
            }
          }
        }
      }
      for (let i2 = 0; i2 < this.certs.length - 1; i2++) {
        if (i2 < this.certs.length - 2 && typeof policyMappings[i2 + 1] !== "undefined") {
          for (let k2 = 0; k2 < policyMappings[i2 + 1].mappings.length; k2++) {
            if (policyMappings[i2 + 1].mappings[k2].issuerDomainPolicy === id_AnyPolicy || policyMappings[i2 + 1].mappings[k2].subjectDomainPolicy === id_AnyPolicy) {
              return {
                result: false,
                resultCode: 99,
                resultMessage: 'The "anyPolicy" should not be a part of policy mapping scheme'
              };
            }
            let issuerDomainPolicyIndex = -1;
            let subjectDomainPolicyIndex = -1;
            for (let n2 = 0; n2 < allPolicies.length; n2++) {
              if (allPolicies[n2] === policyMappings[i2 + 1].mappings[k2].issuerDomainPolicy)
                issuerDomainPolicyIndex = n2;
              if (allPolicies[n2] === policyMappings[i2 + 1].mappings[k2].subjectDomainPolicy)
                subjectDomainPolicyIndex = n2;
            }
            if (typeof policiesAndCerts[issuerDomainPolicyIndex][i2] !== "undefined")
              delete policiesAndCerts[issuerDomainPolicyIndex][i2];
            for (let j2 = 0; j2 < certPolicies[i2].certificatePolicies.length; j2++) {
              if (policyMappings[i2 + 1].mappings[k2].subjectDomainPolicy === certPolicies[i2].certificatePolicies[j2].policyIdentifier) {
                if (issuerDomainPolicyIndex !== -1 && subjectDomainPolicyIndex !== -1) {
                  for (let m2 = 0; m2 <= i2; m2++) {
                    if (typeof policiesAndCerts[subjectDomainPolicyIndex][m2] !== "undefined") {
                      policiesAndCerts[issuerDomainPolicyIndex][m2] = true;
                      delete policiesAndCerts[subjectDomainPolicyIndex][m2];
                    }
                  }
                }
              }
            }
          }
        }
      }
      for (let i2 = 0; i2 < allPolicies.length; i2++) {
        if (allPolicies[i2] === id_AnyPolicy) {
          for (let j2 = 0; j2 < explicitPolicyStart; j2++)
            delete policiesAndCerts[i2][j2];
        }
      }
      const authConstrPolicies = [];
      for (let i2 = 0; i2 < policiesAndCerts.length; i2++) {
        let found = true;
        for (let j2 = 0; j2 < this.certs.length - 1; j2++) {
          let anyPolicyFound = false;
          if (j2 < explicitPolicyStart && allPolicies[i2] === id_AnyPolicy && allPolicies.length > 1) {
            found = false;
            break;
          }
          if (typeof policiesAndCerts[i2][j2] === "undefined") {
            if (j2 >= explicitPolicyStart) {
              for (let k2 = 0; k2 < allPolicies.length; k2++) {
                if (allPolicies[k2] === id_AnyPolicy) {
                  if (policiesAndCerts[k2][j2] === true)
                    anyPolicyFound = true;
                  break;
                }
              }
            }
            if (!anyPolicyFound) {
              found = false;
              break;
            }
          }
        }
        if (found === true)
          authConstrPolicies.push(allPolicies[i2]);
      }
      let userConstrPolicies = [];
      if (initialPolicySet.length === 1 && initialPolicySet[0] === id_AnyPolicy && explicitPolicyIndicator === false)
        userConstrPolicies = initialPolicySet;
      else {
        if (authConstrPolicies.length === 1 && authConstrPolicies[0] === id_AnyPolicy)
          userConstrPolicies = initialPolicySet;
        else {
          for (let i2 = 0; i2 < authConstrPolicies.length; i2++) {
            for (let j2 = 0; j2 < initialPolicySet.length; j2++) {
              if (initialPolicySet[j2] === authConstrPolicies[i2] || initialPolicySet[j2] === id_AnyPolicy) {
                userConstrPolicies.push(authConstrPolicies[i2]);
                break;
              }
            }
          }
        }
      }
      const policyResult = {
        result: userConstrPolicies.length > 0,
        resultCode: 0,
        resultMessage: userConstrPolicies.length > 0 ? EMPTY_STRING : 'Zero "userConstrPolicies" array, no intersections with "authConstrPolicies"',
        authConstrPolicies,
        userConstrPolicies,
        explicitPolicyIndicator,
        policyMappings,
        certificatePath: this.certs
      };
      if (userConstrPolicies.length === 0)
        return policyResult;
      if (policyResult.result === false)
        return policyResult;
      pathDepth = 1;
      for (let i2 = this.certs.length - 2; i2 >= 0; i2--, pathDepth++) {
        const cert = this.certs[i2];
        let subjectAltNames = [];
        let certPermittedSubtrees = [];
        let certExcludedSubtrees = [];
        if (cert.extensions) {
          for (let j2 = 0; j2 < cert.extensions.length; j2++) {
            const extension = cert.extensions[j2];
            if (extension.extnID === id_NameConstraints) {
              if ("permittedSubtrees" in extension.parsedValue)
                certPermittedSubtrees = certPermittedSubtrees.concat(extension.parsedValue.permittedSubtrees);
              if ("excludedSubtrees" in extension.parsedValue)
                certExcludedSubtrees = certExcludedSubtrees.concat(extension.parsedValue.excludedSubtrees);
            }
            if (extension.extnID === id_SubjectAltName)
              subjectAltNames = subjectAltNames.concat(extension.parsedValue.altNames);
          }
        }
        let formFound = requiredNameForms.length <= 0;
        for (let j2 = 0; j2 < requiredNameForms.length; j2++) {
          switch (requiredNameForms[j2].base.type) {
            case 4:
              {
                if (requiredNameForms[j2].base.value.typesAndValues.length !== cert.subject.typesAndValues.length)
                  continue;
                formFound = true;
                for (let k2 = 0; k2 < cert.subject.typesAndValues.length; k2++) {
                  if (cert.subject.typesAndValues[k2].type !== requiredNameForms[j2].base.value.typesAndValues[k2].type) {
                    formFound = false;
                    break;
                  }
                }
                if (formFound === true)
                  break;
              }
              break;
            default:
          }
        }
        if (formFound === false) {
          policyResult.result = false;
          policyResult.resultCode = 21;
          policyResult.resultMessage = "No necessary name form found";
          throw policyResult;
        }
        const constrGroups = [
          [],
          [],
          [],
          [],
          []
        ];
        for (let j2 = 0; j2 < permittedSubtrees.length; j2++) {
          switch (permittedSubtrees[j2].base.type) {
            case 1:
              constrGroups[0].push(permittedSubtrees[j2]);
              break;
            case 2:
              constrGroups[1].push(permittedSubtrees[j2]);
              break;
            case 4:
              constrGroups[2].push(permittedSubtrees[j2]);
              break;
            case 6:
              constrGroups[3].push(permittedSubtrees[j2]);
              break;
            case 7:
              constrGroups[4].push(permittedSubtrees[j2]);
              break;
            default:
          }
        }
        for (let p2 = 0; p2 < 5; p2++) {
          let groupPermitted = false;
          let valueExists = false;
          const group = constrGroups[p2];
          for (let j2 = 0; j2 < group.length; j2++) {
            switch (p2) {
              case 0:
                if (subjectAltNames.length > 0) {
                  for (let k2 = 0; k2 < subjectAltNames.length; k2++) {
                    if (subjectAltNames[k2].type === 1) {
                      valueExists = true;
                      groupPermitted = groupPermitted || compareRFC822Name(subjectAltNames[k2].value, group[j2].base.value);
                    }
                  }
                } else {
                  for (let k2 = 0; k2 < cert.subject.typesAndValues.length; k2++) {
                    if (cert.subject.typesAndValues[k2].type === "1.2.840.113549.1.9.1" || cert.subject.typesAndValues[k2].type === "0.9.2342.19200300.100.1.3") {
                      valueExists = true;
                      groupPermitted = groupPermitted || compareRFC822Name(cert.subject.typesAndValues[k2].value.valueBlock.value, group[j2].base.value);
                    }
                  }
                }
                break;
              case 1:
                if (subjectAltNames.length > 0) {
                  for (let k2 = 0; k2 < subjectAltNames.length; k2++) {
                    if (subjectAltNames[k2].type === 2) {
                      valueExists = true;
                      groupPermitted = groupPermitted || compareDNSName(subjectAltNames[k2].value, group[j2].base.value);
                    }
                  }
                }
                break;
              case 2:
                valueExists = true;
                groupPermitted = compareDirectoryName(cert.subject, group[j2].base.value);
                break;
              case 3:
                if (subjectAltNames.length > 0) {
                  for (let k2 = 0; k2 < subjectAltNames.length; k2++) {
                    if (subjectAltNames[k2].type === 6) {
                      valueExists = true;
                      groupPermitted = groupPermitted || compareUniformResourceIdentifier(subjectAltNames[k2].value, group[j2].base.value);
                    }
                  }
                }
                break;
              case 4:
                if (subjectAltNames.length > 0) {
                  for (let k2 = 0; k2 < subjectAltNames.length; k2++) {
                    if (subjectAltNames[k2].type === 7) {
                      valueExists = true;
                      groupPermitted = groupPermitted || compareIPAddress(subjectAltNames[k2].value, group[j2].base.value);
                    }
                  }
                }
                break;
              default:
            }
            if (groupPermitted)
              break;
          }
          if (groupPermitted === false && group.length > 0 && valueExists) {
            policyResult.result = false;
            policyResult.resultCode = 41;
            policyResult.resultMessage = 'Failed to meet "permitted sub-trees" name constraint';
            throw policyResult;
          }
        }
        let excluded = false;
        for (let j2 = 0; j2 < excludedSubtrees.length; j2++) {
          switch (excludedSubtrees[j2].base.type) {
            case 1:
              if (subjectAltNames.length >= 0) {
                for (let k2 = 0; k2 < subjectAltNames.length; k2++) {
                  if (subjectAltNames[k2].type === 1)
                    excluded = excluded || compareRFC822Name(subjectAltNames[k2].value, excludedSubtrees[j2].base.value);
                }
              } else {
                for (let k2 = 0; k2 < cert.subject.typesAndValues.length; k2++) {
                  if (cert.subject.typesAndValues[k2].type === "1.2.840.113549.1.9.1" || cert.subject.typesAndValues[k2].type === "0.9.2342.19200300.100.1.3")
                    excluded = excluded || compareRFC822Name(cert.subject.typesAndValues[k2].value.valueBlock.value, excludedSubtrees[j2].base.value);
                }
              }
              break;
            case 2:
              if (subjectAltNames.length > 0) {
                for (let k2 = 0; k2 < subjectAltNames.length; k2++) {
                  if (subjectAltNames[k2].type === 2)
                    excluded = excluded || compareDNSName(subjectAltNames[k2].value, excludedSubtrees[j2].base.value);
                }
              }
              break;
            case 4:
              excluded = excluded || compareDirectoryName(cert.subject, excludedSubtrees[j2].base.value);
              break;
            case 6:
              if (subjectAltNames.length > 0) {
                for (let k2 = 0; k2 < subjectAltNames.length; k2++) {
                  if (subjectAltNames[k2].type === 6)
                    excluded = excluded || compareUniformResourceIdentifier(subjectAltNames[k2].value, excludedSubtrees[j2].base.value);
                }
              }
              break;
            case 7:
              if (subjectAltNames.length > 0) {
                for (let k2 = 0; k2 < subjectAltNames.length; k2++) {
                  if (subjectAltNames[k2].type === 7)
                    excluded = excluded || compareIPAddress(subjectAltNames[k2].value, excludedSubtrees[j2].base.value);
                }
              }
              break;
            default:
          }
          if (excluded)
            break;
        }
        if (excluded === true) {
          policyResult.result = false;
          policyResult.resultCode = 42;
          policyResult.resultMessage = 'Failed to meet "excluded sub-trees" name constraint';
          throw policyResult;
        }
        permittedSubtrees = permittedSubtrees.concat(certPermittedSubtrees);
        excludedSubtrees = excludedSubtrees.concat(certExcludedSubtrees);
      }
      return policyResult;
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof ChainValidationError) {
          return {
            result: false,
            resultCode: error.code,
            resultMessage: error.message,
            error
          };
        }
        return {
          result: false,
          resultCode: ChainValidationCode.unknown,
          resultMessage: error.message,
          error
        };
      }
      if (error && typeof error === "object" && "resultMessage" in error) {
        return error;
      }
      return {
        result: false,
        resultCode: -1,
        resultMessage: "".concat(error)
      };
    }
  }
}
const TBS_RESPONSE_DATA = "tbsResponseData";
const SIGNATURE_ALGORITHM$3 = "signatureAlgorithm";
const SIGNATURE$2 = "signature";
const CERTS$1 = "certs";
const BASIC_OCSP_RESPONSE = "BasicOCSPResponse";
const BASIC_OCSP_RESPONSE_TBS_RESPONSE_DATA = "".concat(BASIC_OCSP_RESPONSE, ".").concat(TBS_RESPONSE_DATA);
const BASIC_OCSP_RESPONSE_SIGNATURE_ALGORITHM = "".concat(BASIC_OCSP_RESPONSE, ".").concat(SIGNATURE_ALGORITHM$3);
const BASIC_OCSP_RESPONSE_SIGNATURE = "".concat(BASIC_OCSP_RESPONSE, ".").concat(SIGNATURE$2);
const BASIC_OCSP_RESPONSE_CERTS = "".concat(BASIC_OCSP_RESPONSE, ".").concat(CERTS$1);
const CLEAR_PROPS$g = [
  BASIC_OCSP_RESPONSE_TBS_RESPONSE_DATA,
  BASIC_OCSP_RESPONSE_SIGNATURE_ALGORITHM,
  BASIC_OCSP_RESPONSE_SIGNATURE,
  BASIC_OCSP_RESPONSE_CERTS
];
class BasicOCSPResponse extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.tbsResponseData = getParametersValue(parameters, TBS_RESPONSE_DATA, BasicOCSPResponse.defaultValues(TBS_RESPONSE_DATA));
    this.signatureAlgorithm = getParametersValue(parameters, SIGNATURE_ALGORITHM$3, BasicOCSPResponse.defaultValues(SIGNATURE_ALGORITHM$3));
    this.signature = getParametersValue(parameters, SIGNATURE$2, BasicOCSPResponse.defaultValues(SIGNATURE$2));
    if (CERTS$1 in parameters) {
      this.certs = getParametersValue(parameters, CERTS$1, BasicOCSPResponse.defaultValues(CERTS$1));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TBS_RESPONSE_DATA:
        return new ResponseData();
      case SIGNATURE_ALGORITHM$3:
        return new AlgorithmIdentifier();
      case SIGNATURE$2:
        return new BitString$1();
      case CERTS$1:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case "type": {
        let comparisonResult = ResponseData.compareWithDefault("tbs", memberValue.tbs) && ResponseData.compareWithDefault("responderID", memberValue.responderID) && ResponseData.compareWithDefault("producedAt", memberValue.producedAt) && ResponseData.compareWithDefault("responses", memberValue.responses);
        if ("responseExtensions" in memberValue)
          comparisonResult = comparisonResult && ResponseData.compareWithDefault("responseExtensions", memberValue.responseExtensions);
        return comparisonResult;
      }
      case SIGNATURE_ALGORITHM$3:
        return memberValue.algorithmId === EMPTY_STRING && "algorithmParams" in memberValue === false;
      case SIGNATURE$2:
        return memberValue.isEqual(BasicOCSPResponse.defaultValues(memberName));
      case CERTS$1:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || BASIC_OCSP_RESPONSE,
      value: [
        ResponseData.schema(names.tbsResponseData || {
          names: {
            blockName: BASIC_OCSP_RESPONSE_TBS_RESPONSE_DATA
          }
        }),
        AlgorithmIdentifier.schema(names.signatureAlgorithm || {
          names: {
            blockName: BASIC_OCSP_RESPONSE_SIGNATURE_ALGORITHM
          }
        }),
        new BitString$1({ name: names.signature || BASIC_OCSP_RESPONSE_SIGNATURE }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            new Sequence({
              value: [new Repeated({
                name: BASIC_OCSP_RESPONSE_CERTS,
                value: Certificate.schema(names.certs || {})
              })]
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$g);
    const asn1 = compareSchema(schema, schema, BasicOCSPResponse.schema());
    AsnError.assertSchema(asn1, this.className);
    this.tbsResponseData = new ResponseData({ schema: asn1.result[BASIC_OCSP_RESPONSE_TBS_RESPONSE_DATA] });
    this.signatureAlgorithm = new AlgorithmIdentifier({ schema: asn1.result[BASIC_OCSP_RESPONSE_SIGNATURE_ALGORITHM] });
    this.signature = asn1.result[BASIC_OCSP_RESPONSE_SIGNATURE];
    if (BASIC_OCSP_RESPONSE_CERTS in asn1.result) {
      this.certs = Array.from(asn1.result[BASIC_OCSP_RESPONSE_CERTS], (element) => new Certificate({ schema: element }));
    }
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.tbsResponseData.toSchema());
    outputArray.push(this.signatureAlgorithm.toSchema());
    outputArray.push(this.signature);
    if (this.certs) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [
          new Sequence({
            value: Array.from(this.certs, (o2) => o2.toSchema())
          })
        ]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      tbsResponseData: this.tbsResponseData.toJSON(),
      signatureAlgorithm: this.signatureAlgorithm.toJSON(),
      signature: this.signature.toJSON()
    };
    if (this.certs) {
      res.certs = Array.from(this.certs, (o2) => o2.toJSON());
    }
    return res;
  }
  async getCertificateStatus(certificate, issuerCertificate, crypto2 = getCrypto(true)) {
    const result = {
      isForCertificate: false,
      status: 2
    };
    const hashesObject = {};
    const certIDs = [];
    for (const response of this.tbsResponseData.responses) {
      const hashAlgorithm = crypto2.getAlgorithmByOID(response.certID.hashAlgorithm.algorithmId, true, "CertID.hashAlgorithm");
      if (!hashesObject[hashAlgorithm.name]) {
        hashesObject[hashAlgorithm.name] = 1;
        const certID = new CertID();
        certIDs.push(certID);
        await certID.createForCertificate(certificate, {
          hashAlgorithm: hashAlgorithm.name,
          issuerCertificate
        }, crypto2);
      }
    }
    for (const response of this.tbsResponseData.responses) {
      for (const id of certIDs) {
        if (response.certID.isEqual(id)) {
          result.isForCertificate = true;
          try {
            switch (response.certStatus.idBlock.isConstructed) {
              case true:
                if (response.certStatus.idBlock.tagNumber === 1)
                  result.status = 1;
                break;
              case false:
                switch (response.certStatus.idBlock.tagNumber) {
                  case 0:
                    result.status = 0;
                    break;
                  case 2:
                    result.status = 2;
                    break;
                  default:
                }
                break;
              default:
            }
          } catch (ex) {
          }
          return result;
        }
      }
    }
    return result;
  }
  async sign(privateKey, hashAlgorithm = "SHA-1", crypto2 = getCrypto(true)) {
    if (!privateKey) {
      throw new Error("Need to provide a private key for signing");
    }
    const signatureParams = await crypto2.getSignatureParameters(privateKey, hashAlgorithm);
    const algorithm = signatureParams.parameters.algorithm;
    if (!("name" in algorithm)) {
      throw new Error("Empty algorithm");
    }
    this.signatureAlgorithm = signatureParams.signatureAlgorithm;
    this.tbsResponseData.tbsView = new Uint8Array(this.tbsResponseData.toSchema(true).toBER());
    const signature = await crypto2.signWithPrivateKey(this.tbsResponseData.tbsView, privateKey, { algorithm });
    this.signature = new BitString$1({ valueHex: signature });
  }
  async verify(params = {}, crypto2 = getCrypto(true)) {
    let signerCert = null;
    let certIndex = -1;
    const trustedCerts = params.trustedCerts || [];
    if (!this.certs) {
      throw new Error("No certificates attached to the BasicOCSPResponse");
    }
    switch (true) {
      case this.tbsResponseData.responderID instanceof RelativeDistinguishedNames:
        for (const [index, certificate] of this.certs.entries()) {
          if (certificate.subject.isEqual(this.tbsResponseData.responderID)) {
            certIndex = index;
            break;
          }
        }
        break;
      case this.tbsResponseData.responderID instanceof OctetString$1:
        for (const [index, cert] of this.certs.entries()) {
          const hash = await crypto2.digest({ name: "sha-1" }, cert.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHexView);
          if (isEqualBuffer(hash, this.tbsResponseData.responderID.valueBlock.valueHex)) {
            certIndex = index;
            break;
          }
        }
        break;
      default:
        throw new Error("Wrong value for responderID");
    }
    if (certIndex === -1)
      throw new Error("Correct certificate was not found in OCSP response");
    signerCert = this.certs[certIndex];
    const additionalCerts = [signerCert];
    for (const cert of this.certs) {
      const caCert = await checkCA(cert, signerCert);
      if (caCert) {
        additionalCerts.push(caCert);
      }
    }
    const certChain = new CertificateChainValidationEngine({
      certs: additionalCerts,
      trustedCerts
    });
    const verificationResult = await certChain.verify({}, crypto2);
    if (!verificationResult.result) {
      throw new Error("Validation of signer's certificate failed");
    }
    return crypto2.verifyWithPublicKey(this.tbsResponseData.tbsView, this.signature, this.certs[certIndex].subjectPublicKeyInfo, this.signatureAlgorithm);
  }
}
BasicOCSPResponse.CLASS_NAME = "BasicOCSPResponse";
const TBS$1 = "tbs";
const VERSION$6 = "version";
const SUBJECT = "subject";
const SPKI = "subjectPublicKeyInfo";
const ATTRIBUTES$1 = "attributes";
const SIGNATURE_ALGORITHM$2 = "signatureAlgorithm";
const SIGNATURE_VALUE = "signatureValue";
const CSR_INFO = "CertificationRequestInfo";
const CSR_INFO_VERSION = "".concat(CSR_INFO, ".version");
const CSR_INFO_SUBJECT = "".concat(CSR_INFO, ".subject");
const CSR_INFO_SPKI = "".concat(CSR_INFO, ".subjectPublicKeyInfo");
const CSR_INFO_ATTRS = "".concat(CSR_INFO, ".attributes");
const CLEAR_PROPS$f = [
  CSR_INFO,
  CSR_INFO_VERSION,
  CSR_INFO_SUBJECT,
  CSR_INFO_SPKI,
  CSR_INFO_ATTRS,
  SIGNATURE_ALGORITHM$2,
  SIGNATURE_VALUE
];
function CertificationRequestInfo(parameters = {}) {
  const names = getParametersValue(parameters, "names", {});
  return new Sequence({
    name: names.CertificationRequestInfo || CSR_INFO,
    value: [
      new Integer({ name: names.CertificationRequestInfoVersion || CSR_INFO_VERSION }),
      RelativeDistinguishedNames.schema(names.subject || {
        names: {
          blockName: CSR_INFO_SUBJECT
        }
      }),
      PublicKeyInfo.schema({
        names: {
          blockName: CSR_INFO_SPKI
        }
      }),
      new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [
          new Repeated({
            optional: true,
            name: names.CertificationRequestInfoAttributes || CSR_INFO_ATTRS,
            value: Attribute.schema(names.attributes || {})
          })
        ]
      })
    ]
  });
}
class CertificationRequest extends PkiObject {
  get tbs() {
    return BufferSourceConverter.toArrayBuffer(this.tbsView);
  }
  set tbs(value) {
    this.tbsView = new Uint8Array(value);
  }
  constructor(parameters = {}) {
    super();
    this.tbsView = new Uint8Array(getParametersValue(parameters, TBS$1, CertificationRequest.defaultValues(TBS$1)));
    this.version = getParametersValue(parameters, VERSION$6, CertificationRequest.defaultValues(VERSION$6));
    this.subject = getParametersValue(parameters, SUBJECT, CertificationRequest.defaultValues(SUBJECT));
    this.subjectPublicKeyInfo = getParametersValue(parameters, SPKI, CertificationRequest.defaultValues(SPKI));
    if (ATTRIBUTES$1 in parameters) {
      this.attributes = getParametersValue(parameters, ATTRIBUTES$1, CertificationRequest.defaultValues(ATTRIBUTES$1));
    }
    this.signatureAlgorithm = getParametersValue(parameters, SIGNATURE_ALGORITHM$2, CertificationRequest.defaultValues(SIGNATURE_ALGORITHM$2));
    this.signatureValue = getParametersValue(parameters, SIGNATURE_VALUE, CertificationRequest.defaultValues(SIGNATURE_VALUE));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TBS$1:
        return EMPTY_BUFFER;
      case VERSION$6:
        return 0;
      case SUBJECT:
        return new RelativeDistinguishedNames();
      case SPKI:
        return new PublicKeyInfo();
      case ATTRIBUTES$1:
        return [];
      case SIGNATURE_ALGORITHM$2:
        return new AlgorithmIdentifier();
      case SIGNATURE_VALUE:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      value: [
        CertificationRequestInfo(names.certificationRequestInfo || {}),
        new Sequence({
          name: names.signatureAlgorithm || SIGNATURE_ALGORITHM$2,
          value: [
            new ObjectIdentifier(),
            new Any({ optional: true })
          ]
        }),
        new BitString$1({ name: names.signatureValue || SIGNATURE_VALUE })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$f);
    const asn1 = compareSchema(schema, schema, CertificationRequest.schema());
    AsnError.assertSchema(asn1, this.className);
    this.tbsView = asn1.result.CertificationRequestInfo.valueBeforeDecodeView;
    this.version = asn1.result[CSR_INFO_VERSION].valueBlock.valueDec;
    this.subject = new RelativeDistinguishedNames({ schema: asn1.result[CSR_INFO_SUBJECT] });
    this.subjectPublicKeyInfo = new PublicKeyInfo({ schema: asn1.result[CSR_INFO_SPKI] });
    if (CSR_INFO_ATTRS in asn1.result) {
      this.attributes = Array.from(asn1.result[CSR_INFO_ATTRS], (element) => new Attribute({ schema: element }));
    }
    this.signatureAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.signatureAlgorithm });
    this.signatureValue = asn1.result.signatureValue;
  }
  encodeTBS() {
    const outputArray = [
      new Integer({ value: this.version }),
      this.subject.toSchema(),
      this.subjectPublicKeyInfo.toSchema()
    ];
    if (ATTRIBUTES$1 in this) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: Array.from(this.attributes || [], (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toSchema(encodeFlag = false) {
    let tbsSchema;
    if (encodeFlag === false) {
      if (this.tbsView.byteLength === 0) {
        return CertificationRequest.schema();
      }
      const asn1 = fromBER(this.tbsView);
      AsnError.assert(asn1, "PKCS#10 Certificate Request");
      tbsSchema = asn1.result;
    } else {
      tbsSchema = this.encodeTBS();
    }
    return new Sequence({
      value: [
        tbsSchema,
        this.signatureAlgorithm.toSchema(),
        this.signatureValue
      ]
    });
  }
  toJSON() {
    const object = {
      tbs: Convert.ToHex(this.tbsView),
      version: this.version,
      subject: this.subject.toJSON(),
      subjectPublicKeyInfo: this.subjectPublicKeyInfo.toJSON(),
      signatureAlgorithm: this.signatureAlgorithm.toJSON(),
      signatureValue: this.signatureValue.toJSON()
    };
    if (ATTRIBUTES$1 in this) {
      object.attributes = Array.from(this.attributes || [], (o2) => o2.toJSON());
    }
    return object;
  }
  async sign(privateKey, hashAlgorithm = "SHA-1", crypto2 = getCrypto(true)) {
    if (!privateKey) {
      throw new Error("Need to provide a private key for signing");
    }
    const signatureParams = await crypto2.getSignatureParameters(privateKey, hashAlgorithm);
    const parameters = signatureParams.parameters;
    this.signatureAlgorithm = signatureParams.signatureAlgorithm;
    this.tbsView = new Uint8Array(this.encodeTBS().toBER());
    const signature = await crypto2.signWithPrivateKey(this.tbsView, privateKey, parameters);
    this.signatureValue = new BitString$1({ valueHex: signature });
  }
  async verify(crypto2 = getCrypto(true)) {
    return crypto2.verifyWithPublicKey(this.tbsView, this.signatureValue, this.subjectPublicKeyInfo, this.signatureAlgorithm);
  }
  async getPublicKey(parameters, crypto2 = getCrypto(true)) {
    return crypto2.getPublicKey(this.subjectPublicKeyInfo, this.signatureAlgorithm, parameters);
  }
}
CertificationRequest.CLASS_NAME = "CertificationRequest";
const DIGEST_ALGORITHM$1 = "digestAlgorithm";
const DIGEST = "digest";
const CLEAR_PROPS$e = [
  DIGEST_ALGORITHM$1,
  DIGEST
];
class DigestInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.digestAlgorithm = getParametersValue(parameters, DIGEST_ALGORITHM$1, DigestInfo.defaultValues(DIGEST_ALGORITHM$1));
    this.digest = getParametersValue(parameters, DIGEST, DigestInfo.defaultValues(DIGEST));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case DIGEST_ALGORITHM$1:
        return new AlgorithmIdentifier();
      case DIGEST:
        return new OctetString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case DIGEST_ALGORITHM$1:
        return AlgorithmIdentifier.compareWithDefault("algorithmId", memberValue.algorithmId) && "algorithmParams" in memberValue === false;
      case DIGEST:
        return memberValue.isEqual(DigestInfo.defaultValues(memberName));
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AlgorithmIdentifier.schema(names.digestAlgorithm || {
          names: {
            blockName: DIGEST_ALGORITHM$1
          }
        }),
        new OctetString$1({ name: names.digest || DIGEST })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$e);
    const asn1 = compareSchema(schema, schema, DigestInfo.schema({
      names: {
        digestAlgorithm: {
          names: {
            blockName: DIGEST_ALGORITHM$1
          }
        },
        digest: DIGEST
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.digestAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.digestAlgorithm });
    this.digest = asn1.result.digest;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.digestAlgorithm.toSchema(),
        this.digest
      ]
    });
  }
  toJSON() {
    return {
      digestAlgorithm: this.digestAlgorithm.toJSON(),
      digest: this.digest.toJSON()
    };
  }
}
DigestInfo.CLASS_NAME = "DigestInfo";
const E_CONTENT_TYPE = "eContentType";
const E_CONTENT = "eContent";
const CLEAR_PROPS$d = [
  E_CONTENT_TYPE,
  E_CONTENT
];
class EncapsulatedContentInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.eContentType = getParametersValue(parameters, E_CONTENT_TYPE, EncapsulatedContentInfo.defaultValues(E_CONTENT_TYPE));
    if (E_CONTENT in parameters) {
      this.eContent = getParametersValue(parameters, E_CONTENT, EncapsulatedContentInfo.defaultValues(E_CONTENT));
      if (this.eContent.idBlock.tagClass === 1 && this.eContent.idBlock.tagNumber === 4) {
        if (this.eContent.idBlock.isConstructed === false) {
          const constrString = new OctetString$1({
            idBlock: { isConstructed: true },
            isConstructed: true
          });
          let offset = 0;
          const viewHex = this.eContent.valueBlock.valueHexView.slice().buffer;
          let length = viewHex.byteLength;
          while (length > 0) {
            const pieceView = new Uint8Array(viewHex, offset, offset + 65536 > viewHex.byteLength ? viewHex.byteLength - offset : 65536);
            const _array = new ArrayBuffer(pieceView.length);
            const _view = new Uint8Array(_array);
            for (let i2 = 0; i2 < _view.length; i2++) {
              _view[i2] = pieceView[i2];
            }
            constrString.valueBlock.value.push(new OctetString$1({ valueHex: _array }));
            length -= pieceView.length;
            offset += pieceView.length;
          }
          this.eContent = constrString;
        }
      }
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case E_CONTENT_TYPE:
        return EMPTY_STRING;
      case E_CONTENT:
        return new OctetString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case E_CONTENT_TYPE:
        return memberValue === EMPTY_STRING;
      case E_CONTENT: {
        if (memberValue.idBlock.tagClass === 1 && memberValue.idBlock.tagNumber === 4)
          return memberValue.isEqual(EncapsulatedContentInfo.defaultValues(E_CONTENT));
        return false;
      }
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.eContentType || EMPTY_STRING }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            new Any({ name: names.eContent || EMPTY_STRING })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$d);
    const asn1 = compareSchema(schema, schema, EncapsulatedContentInfo.schema({
      names: {
        eContentType: E_CONTENT_TYPE,
        eContent: E_CONTENT
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.eContentType = asn1.result.eContentType.valueBlock.toString();
    if (E_CONTENT in asn1.result)
      this.eContent = asn1.result.eContent;
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new ObjectIdentifier({ value: this.eContentType }));
    if (this.eContent) {
      if (EncapsulatedContentInfo.compareWithDefault(E_CONTENT, this.eContent) === false) {
        outputArray.push(new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [this.eContent]
        }));
      }
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      eContentType: this.eContentType
    };
    if (this.eContent && EncapsulatedContentInfo.compareWithDefault(E_CONTENT, this.eContent) === false) {
      res.eContent = this.eContent.toJSON();
    }
    return res;
  }
}
EncapsulatedContentInfo.CLASS_NAME = "EncapsulatedContentInfo";
const MAC = "mac";
const MAC_SALT = "macSalt";
const ITERATIONS = "iterations";
const CLEAR_PROPS$c = [
  MAC,
  MAC_SALT,
  ITERATIONS
];
class MacData extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.mac = getParametersValue(parameters, MAC, MacData.defaultValues(MAC));
    this.macSalt = getParametersValue(parameters, MAC_SALT, MacData.defaultValues(MAC_SALT));
    if (ITERATIONS in parameters) {
      this.iterations = getParametersValue(parameters, ITERATIONS, MacData.defaultValues(ITERATIONS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case MAC:
        return new DigestInfo();
      case MAC_SALT:
        return new OctetString$1();
      case ITERATIONS:
        return 1;
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case MAC:
        return DigestInfo.compareWithDefault("digestAlgorithm", memberValue.digestAlgorithm) && DigestInfo.compareWithDefault("digest", memberValue.digest);
      case MAC_SALT:
        return memberValue.isEqual(MacData.defaultValues(memberName));
      case ITERATIONS:
        return memberValue === MacData.defaultValues(memberName);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      optional: names.optional || true,
      value: [
        DigestInfo.schema(names.mac || {
          names: {
            blockName: MAC
          }
        }),
        new OctetString$1({ name: names.macSalt || MAC_SALT }),
        new Integer({
          optional: true,
          name: names.iterations || ITERATIONS
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$c);
    const asn1 = compareSchema(schema, schema, MacData.schema({
      names: {
        mac: {
          names: {
            blockName: MAC
          }
        },
        macSalt: MAC_SALT,
        iterations: ITERATIONS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.mac = new DigestInfo({ schema: asn1.result.mac });
    this.macSalt = asn1.result.macSalt;
    if (ITERATIONS in asn1.result)
      this.iterations = asn1.result.iterations.valueBlock.valueDec;
  }
  toSchema() {
    const outputArray = [
      this.mac.toSchema(),
      this.macSalt
    ];
    if (this.iterations !== void 0) {
      outputArray.push(new Integer({ value: this.iterations }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      mac: this.mac.toJSON(),
      macSalt: this.macSalt.toJSON()
    };
    if (this.iterations !== void 0) {
      res.iterations = this.iterations;
    }
    return res;
  }
}
MacData.CLASS_NAME = "MacData";
const HASH_ALGORITHM = "hashAlgorithm";
const HASHED_MESSAGE = "hashedMessage";
const CLEAR_PROPS$b = [
  HASH_ALGORITHM,
  HASHED_MESSAGE
];
class MessageImprint extends PkiObject {
  static async create(hashAlgorithm, message, crypto2 = getCrypto(true)) {
    const hashAlgorithmOID = crypto2.getOIDByAlgorithm({ name: hashAlgorithm }, true, "hashAlgorithm");
    const hashedMessage = await crypto2.digest(hashAlgorithm, message);
    const res = new MessageImprint({
      hashAlgorithm: new AlgorithmIdentifier({
        algorithmId: hashAlgorithmOID,
        algorithmParams: new Null()
      }),
      hashedMessage: new OctetString$1({ valueHex: hashedMessage })
    });
    return res;
  }
  constructor(parameters = {}) {
    super();
    this.hashAlgorithm = getParametersValue(parameters, HASH_ALGORITHM, MessageImprint.defaultValues(HASH_ALGORITHM));
    this.hashedMessage = getParametersValue(parameters, HASHED_MESSAGE, MessageImprint.defaultValues(HASHED_MESSAGE));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case HASH_ALGORITHM:
        return new AlgorithmIdentifier();
      case HASHED_MESSAGE:
        return new OctetString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case HASH_ALGORITHM:
        return memberValue.algorithmId === EMPTY_STRING && "algorithmParams" in memberValue === false;
      case HASHED_MESSAGE:
        return memberValue.isEqual(MessageImprint.defaultValues(memberName)) === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AlgorithmIdentifier.schema(names.hashAlgorithm || {}),
        new OctetString$1({ name: names.hashedMessage || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$b);
    const asn1 = compareSchema(schema, schema, MessageImprint.schema({
      names: {
        hashAlgorithm: {
          names: {
            blockName: HASH_ALGORITHM
          }
        },
        hashedMessage: HASHED_MESSAGE
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.hashAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.hashAlgorithm });
    this.hashedMessage = asn1.result.hashedMessage;
  }
  toSchema() {
    return new Sequence({
      value: [
        this.hashAlgorithm.toSchema(),
        this.hashedMessage
      ]
    });
  }
  toJSON() {
    return {
      hashAlgorithm: this.hashAlgorithm.toJSON(),
      hashedMessage: this.hashedMessage.toJSON()
    };
  }
}
MessageImprint.CLASS_NAME = "MessageImprint";
const REQ_CERT = "reqCert";
const SINGLE_REQUEST_EXTENSIONS = "singleRequestExtensions";
const CLEAR_PROPS$a = [
  REQ_CERT,
  SINGLE_REQUEST_EXTENSIONS
];
let Request$1 = class Request2 extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.reqCert = getParametersValue(parameters, REQ_CERT, Request2.defaultValues(REQ_CERT));
    if (SINGLE_REQUEST_EXTENSIONS in parameters) {
      this.singleRequestExtensions = getParametersValue(parameters, SINGLE_REQUEST_EXTENSIONS, Request2.defaultValues(SINGLE_REQUEST_EXTENSIONS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case REQ_CERT:
        return new CertID();
      case SINGLE_REQUEST_EXTENSIONS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case REQ_CERT:
        return memberValue.isEqual(Request2.defaultValues(memberName));
      case SINGLE_REQUEST_EXTENSIONS:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        CertID.schema(names.reqCert || {}),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [Extension.schema(names.extensions || {
            names: {
              blockName: names.singleRequestExtensions || EMPTY_STRING
            }
          })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$a);
    const asn1 = compareSchema(schema, schema, Request2.schema({
      names: {
        reqCert: {
          names: {
            blockName: REQ_CERT
          }
        },
        extensions: {
          names: {
            blockName: SINGLE_REQUEST_EXTENSIONS
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.reqCert = new CertID({ schema: asn1.result.reqCert });
    if (SINGLE_REQUEST_EXTENSIONS in asn1.result) {
      this.singleRequestExtensions = Array.from(asn1.result.singleRequestExtensions.valueBlock.value, (element) => new Extension({ schema: element }));
    }
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.reqCert.toSchema());
    if (this.singleRequestExtensions) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [
          new Sequence({
            value: Array.from(this.singleRequestExtensions, (o2) => o2.toSchema())
          })
        ]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      reqCert: this.reqCert.toJSON()
    };
    if (this.singleRequestExtensions) {
      res.singleRequestExtensions = Array.from(this.singleRequestExtensions, (o2) => o2.toJSON());
    }
    return res;
  }
};
Request$1.CLASS_NAME = "Request";
const TBS = "tbs";
const VERSION$5 = "version";
const REQUESTOR_NAME = "requestorName";
const REQUEST_LIST = "requestList";
const REQUEST_EXTENSIONS = "requestExtensions";
const TBS_REQUEST$1 = "TBSRequest";
const TBS_REQUEST_VERSION = "".concat(TBS_REQUEST$1, ".").concat(VERSION$5);
const TBS_REQUEST_REQUESTOR_NAME = "".concat(TBS_REQUEST$1, ".").concat(REQUESTOR_NAME);
const TBS_REQUEST_REQUESTS = "".concat(TBS_REQUEST$1, ".requests");
const TBS_REQUEST_REQUEST_EXTENSIONS = "".concat(TBS_REQUEST$1, ".").concat(REQUEST_EXTENSIONS);
const CLEAR_PROPS$9 = [
  TBS_REQUEST$1,
  TBS_REQUEST_VERSION,
  TBS_REQUEST_REQUESTOR_NAME,
  TBS_REQUEST_REQUESTS,
  TBS_REQUEST_REQUEST_EXTENSIONS
];
class TBSRequest extends PkiObject {
  get tbs() {
    return BufferSourceConverter.toArrayBuffer(this.tbsView);
  }
  set tbs(value) {
    this.tbsView = new Uint8Array(value);
  }
  constructor(parameters = {}) {
    super();
    this.tbsView = new Uint8Array(getParametersValue(parameters, TBS, TBSRequest.defaultValues(TBS)));
    if (VERSION$5 in parameters) {
      this.version = getParametersValue(parameters, VERSION$5, TBSRequest.defaultValues(VERSION$5));
    }
    if (REQUESTOR_NAME in parameters) {
      this.requestorName = getParametersValue(parameters, REQUESTOR_NAME, TBSRequest.defaultValues(REQUESTOR_NAME));
    }
    this.requestList = getParametersValue(parameters, REQUEST_LIST, TBSRequest.defaultValues(REQUEST_LIST));
    if (REQUEST_EXTENSIONS in parameters) {
      this.requestExtensions = getParametersValue(parameters, REQUEST_EXTENSIONS, TBSRequest.defaultValues(REQUEST_EXTENSIONS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TBS:
        return EMPTY_BUFFER;
      case VERSION$5:
        return 0;
      case REQUESTOR_NAME:
        return new GeneralName();
      case REQUEST_LIST:
      case REQUEST_EXTENSIONS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case TBS:
        return memberValue.byteLength === 0;
      case VERSION$5:
        return memberValue === TBSRequest.defaultValues(memberName);
      case REQUESTOR_NAME:
        return memberValue.type === GeneralName.defaultValues("type") && Object.keys(memberValue.value).length === 0;
      case REQUEST_LIST:
      case REQUEST_EXTENSIONS:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || TBS_REQUEST$1,
      value: [
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Integer({ name: names.TBSRequestVersion || TBS_REQUEST_VERSION })]
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [GeneralName.schema(names.requestorName || {
            names: {
              blockName: TBS_REQUEST_REQUESTOR_NAME
            }
          })]
        }),
        new Sequence({
          name: names.requestList || "TBSRequest.requestList",
          value: [
            new Repeated({
              name: names.requests || TBS_REQUEST_REQUESTS,
              value: Request$1.schema(names.requestNames || {})
            })
          ]
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          },
          value: [Extensions.schema(names.extensions || {
            names: {
              blockName: names.requestExtensions || TBS_REQUEST_REQUEST_EXTENSIONS
            }
          })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$9);
    const asn1 = compareSchema(schema, schema, TBSRequest.schema());
    AsnError.assertSchema(asn1, this.className);
    this.tbsView = asn1.result.TBSRequest.valueBeforeDecodeView;
    if (TBS_REQUEST_VERSION in asn1.result)
      this.version = asn1.result[TBS_REQUEST_VERSION].valueBlock.valueDec;
    if (TBS_REQUEST_REQUESTOR_NAME in asn1.result)
      this.requestorName = new GeneralName({ schema: asn1.result[TBS_REQUEST_REQUESTOR_NAME] });
    this.requestList = Array.from(asn1.result[TBS_REQUEST_REQUESTS], (element) => new Request$1({ schema: element }));
    if (TBS_REQUEST_REQUEST_EXTENSIONS in asn1.result)
      this.requestExtensions = Array.from(asn1.result[TBS_REQUEST_REQUEST_EXTENSIONS].valueBlock.value, (element) => new Extension({ schema: element }));
  }
  toSchema(encodeFlag = false) {
    let tbsSchema;
    if (encodeFlag === false) {
      if (this.tbsView.byteLength === 0)
        return TBSRequest.schema();
      const asn1 = fromBER(this.tbsView);
      AsnError.assert(asn1, "TBS Request");
      if (!(asn1.result instanceof Sequence)) {
        throw new Error("ASN.1 result should be SEQUENCE");
      }
      tbsSchema = asn1.result;
    } else {
      const outputArray = [];
      if (this.version !== void 0) {
        outputArray.push(new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Integer({ value: this.version })]
        }));
      }
      if (this.requestorName) {
        outputArray.push(new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [this.requestorName.toSchema()]
        }));
      }
      outputArray.push(new Sequence({
        value: Array.from(this.requestList, (o2) => o2.toSchema())
      }));
      if (this.requestExtensions) {
        outputArray.push(new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: 2
          },
          value: [
            new Sequence({
              value: Array.from(this.requestExtensions, (o2) => o2.toSchema())
            })
          ]
        }));
      }
      tbsSchema = new Sequence({
        value: outputArray
      });
    }
    return tbsSchema;
  }
  toJSON() {
    const res = {};
    if (this.version != void 0)
      res.version = this.version;
    if (this.requestorName) {
      res.requestorName = this.requestorName.toJSON();
    }
    res.requestList = Array.from(this.requestList, (o2) => o2.toJSON());
    if (this.requestExtensions) {
      res.requestExtensions = Array.from(this.requestExtensions, (o2) => o2.toJSON());
    }
    return res;
  }
}
TBSRequest.CLASS_NAME = "TBSRequest";
const SIGNATURE_ALGORITHM$1 = "signatureAlgorithm";
const SIGNATURE$1 = "signature";
const CERTS = "certs";
class Signature extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.signatureAlgorithm = getParametersValue(parameters, SIGNATURE_ALGORITHM$1, Signature.defaultValues(SIGNATURE_ALGORITHM$1));
    this.signature = getParametersValue(parameters, SIGNATURE$1, Signature.defaultValues(SIGNATURE$1));
    if (CERTS in parameters) {
      this.certs = getParametersValue(parameters, CERTS, Signature.defaultValues(CERTS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case SIGNATURE_ALGORITHM$1:
        return new AlgorithmIdentifier();
      case SIGNATURE$1:
        return new BitString$1();
      case CERTS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case SIGNATURE_ALGORITHM$1:
        return memberValue.algorithmId === EMPTY_STRING && "algorithmParams" in memberValue === false;
      case SIGNATURE$1:
        return memberValue.isEqual(Signature.defaultValues(memberName));
      case CERTS:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        AlgorithmIdentifier.schema(names.signatureAlgorithm || {}),
        new BitString$1({ name: names.signature || EMPTY_STRING }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            new Sequence({
              value: [new Repeated({
                name: names.certs || EMPTY_STRING,
                value: Certificate.schema({})
              })]
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      SIGNATURE_ALGORITHM$1,
      SIGNATURE$1,
      CERTS
    ]);
    const asn1 = compareSchema(schema, schema, Signature.schema({
      names: {
        signatureAlgorithm: {
          names: {
            blockName: SIGNATURE_ALGORITHM$1
          }
        },
        signature: SIGNATURE$1,
        certs: CERTS
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.signatureAlgorithm = new AlgorithmIdentifier({ schema: asn1.result.signatureAlgorithm });
    this.signature = asn1.result.signature;
    if (CERTS in asn1.result)
      this.certs = Array.from(asn1.result.certs, (element) => new Certificate({ schema: element }));
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.signatureAlgorithm.toSchema());
    outputArray.push(this.signature);
    if (this.certs) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [
          new Sequence({
            value: Array.from(this.certs, (o2) => o2.toSchema())
          })
        ]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      signatureAlgorithm: this.signatureAlgorithm.toJSON(),
      signature: this.signature.toJSON()
    };
    if (this.certs) {
      res.certs = Array.from(this.certs, (o2) => o2.toJSON());
    }
    return res;
  }
}
Signature.CLASS_NAME = "Signature";
const TBS_REQUEST = "tbsRequest";
const OPTIONAL_SIGNATURE = "optionalSignature";
const CLEAR_PROPS$8 = [
  TBS_REQUEST,
  OPTIONAL_SIGNATURE
];
class OCSPRequest extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.tbsRequest = getParametersValue(parameters, TBS_REQUEST, OCSPRequest.defaultValues(TBS_REQUEST));
    if (OPTIONAL_SIGNATURE in parameters) {
      this.optionalSignature = getParametersValue(parameters, OPTIONAL_SIGNATURE, OCSPRequest.defaultValues(OPTIONAL_SIGNATURE));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TBS_REQUEST:
        return new TBSRequest();
      case OPTIONAL_SIGNATURE:
        return new Signature();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case TBS_REQUEST:
        return TBSRequest.compareWithDefault("tbs", memberValue.tbs) && TBSRequest.compareWithDefault("version", memberValue.version) && TBSRequest.compareWithDefault("requestorName", memberValue.requestorName) && TBSRequest.compareWithDefault("requestList", memberValue.requestList) && TBSRequest.compareWithDefault("requestExtensions", memberValue.requestExtensions);
      case OPTIONAL_SIGNATURE:
        return Signature.compareWithDefault("signatureAlgorithm", memberValue.signatureAlgorithm) && Signature.compareWithDefault("signature", memberValue.signature) && Signature.compareWithDefault("certs", memberValue.certs);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || "OCSPRequest",
      value: [
        TBSRequest.schema(names.tbsRequest || {
          names: {
            blockName: TBS_REQUEST
          }
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            Signature.schema(names.optionalSignature || {
              names: {
                blockName: OPTIONAL_SIGNATURE
              }
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$8);
    const asn1 = compareSchema(schema, schema, OCSPRequest.schema());
    AsnError.assertSchema(asn1, this.className);
    this.tbsRequest = new TBSRequest({ schema: asn1.result.tbsRequest });
    if (OPTIONAL_SIGNATURE in asn1.result)
      this.optionalSignature = new Signature({ schema: asn1.result.optionalSignature });
  }
  toSchema(encodeFlag = false) {
    const outputArray = [];
    outputArray.push(this.tbsRequest.toSchema(encodeFlag));
    if (this.optionalSignature)
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [
          this.optionalSignature.toSchema()
        ]
      }));
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      tbsRequest: this.tbsRequest.toJSON()
    };
    if (this.optionalSignature) {
      res.optionalSignature = this.optionalSignature.toJSON();
    }
    return res;
  }
  async createForCertificate(certificate, parameters, crypto2 = getCrypto(true)) {
    const certID = new CertID();
    await certID.createForCertificate(certificate, parameters, crypto2);
    this.tbsRequest.requestList.push(new Request$1({
      reqCert: certID
    }));
  }
  async sign(privateKey, hashAlgorithm = "SHA-1", crypto2 = getCrypto(true)) {
    ParameterError.assertEmpty(privateKey, "privateKey", "OCSPRequest.sign method");
    if (!this.optionalSignature) {
      throw new Error('Need to create "optionalSignature" field before signing');
    }
    const signatureParams = await crypto2.getSignatureParameters(privateKey, hashAlgorithm);
    const parameters = signatureParams.parameters;
    this.optionalSignature.signatureAlgorithm = signatureParams.signatureAlgorithm;
    const tbs = this.tbsRequest.toSchema(true).toBER(false);
    const signature = await crypto2.signWithPrivateKey(tbs, privateKey, parameters);
    this.optionalSignature.signature = new BitString$1({ valueHex: signature });
  }
  verify() {
  }
}
OCSPRequest.CLASS_NAME = "OCSPRequest";
const RESPONSE_TYPE = "responseType";
const RESPONSE = "response";
const CLEAR_PROPS$7 = [
  RESPONSE_TYPE,
  RESPONSE
];
class ResponseBytes extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.responseType = getParametersValue(parameters, RESPONSE_TYPE, ResponseBytes.defaultValues(RESPONSE_TYPE));
    this.response = getParametersValue(parameters, RESPONSE, ResponseBytes.defaultValues(RESPONSE));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case RESPONSE_TYPE:
        return EMPTY_STRING;
      case RESPONSE:
        return new OctetString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case RESPONSE_TYPE:
        return memberValue === EMPTY_STRING;
      case RESPONSE:
        return memberValue.isEqual(ResponseBytes.defaultValues(memberName));
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new ObjectIdentifier({ name: names.responseType || EMPTY_STRING }),
        new OctetString$1({ name: names.response || EMPTY_STRING })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$7);
    const asn1 = compareSchema(schema, schema, ResponseBytes.schema({
      names: {
        responseType: RESPONSE_TYPE,
        response: RESPONSE
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.responseType = asn1.result.responseType.valueBlock.toString();
    this.response = asn1.result.response;
  }
  toSchema() {
    return new Sequence({
      value: [
        new ObjectIdentifier({ value: this.responseType }),
        this.response
      ]
    });
  }
  toJSON() {
    return {
      responseType: this.responseType,
      response: this.response.toJSON()
    };
  }
}
ResponseBytes.CLASS_NAME = "ResponseBytes";
const RESPONSE_STATUS = "responseStatus";
const RESPONSE_BYTES = "responseBytes";
class OCSPResponse extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.responseStatus = getParametersValue(parameters, RESPONSE_STATUS, OCSPResponse.defaultValues(RESPONSE_STATUS));
    if (RESPONSE_BYTES in parameters) {
      this.responseBytes = getParametersValue(parameters, RESPONSE_BYTES, OCSPResponse.defaultValues(RESPONSE_BYTES));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case RESPONSE_STATUS:
        return new Enumerated();
      case RESPONSE_BYTES:
        return new ResponseBytes();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case RESPONSE_STATUS:
        return memberValue.isEqual(OCSPResponse.defaultValues(memberName));
      case RESPONSE_BYTES:
        return ResponseBytes.compareWithDefault("responseType", memberValue.responseType) && ResponseBytes.compareWithDefault("response", memberValue.response);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || "OCSPResponse",
      value: [
        new Enumerated({ name: names.responseStatus || RESPONSE_STATUS }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [
            ResponseBytes.schema(names.responseBytes || {
              names: {
                blockName: RESPONSE_BYTES
              }
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, [
      RESPONSE_STATUS,
      RESPONSE_BYTES
    ]);
    const asn1 = compareSchema(schema, schema, OCSPResponse.schema());
    AsnError.assertSchema(asn1, this.className);
    this.responseStatus = asn1.result.responseStatus;
    if (RESPONSE_BYTES in asn1.result)
      this.responseBytes = new ResponseBytes({ schema: asn1.result.responseBytes });
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.responseStatus);
    if (this.responseBytes) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [this.responseBytes.toSchema()]
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      responseStatus: this.responseStatus.toJSON()
    };
    if (this.responseBytes) {
      res.responseBytes = this.responseBytes.toJSON();
    }
    return res;
  }
  async getCertificateStatus(certificate, issuerCertificate, crypto2 = getCrypto(true)) {
    let basicResponse;
    const result = {
      isForCertificate: false,
      status: 2
    };
    if (!this.responseBytes)
      return result;
    if (this.responseBytes.responseType !== id_PKIX_OCSP_Basic)
      return result;
    try {
      const asn1Basic = fromBER(this.responseBytes.response.valueBlock.valueHexView);
      AsnError.assert(asn1Basic, "Basic OCSP response");
      basicResponse = new BasicOCSPResponse({ schema: asn1Basic.result });
    } catch (ex) {
      return result;
    }
    return basicResponse.getCertificateStatus(certificate, issuerCertificate, crypto2);
  }
  async sign(privateKey, hashAlgorithm, crypto2 = getCrypto(true)) {
    var _a3;
    if (this.responseBytes && this.responseBytes.responseType === id_PKIX_OCSP_Basic) {
      const basicResponse = BasicOCSPResponse.fromBER(this.responseBytes.response.valueBlock.valueHexView);
      return basicResponse.sign(privateKey, hashAlgorithm, crypto2);
    }
    throw new Error("Unknown ResponseBytes type: ".concat(((_a3 = this.responseBytes) === null || _a3 === void 0 ? void 0 : _a3.responseType) || "Unknown"));
  }
  async verify(issuerCertificate = null, crypto2 = getCrypto(true)) {
    var _a3;
    if (RESPONSE_BYTES in this === false)
      throw new Error("Empty ResponseBytes field");
    if (this.responseBytes && this.responseBytes.responseType === id_PKIX_OCSP_Basic) {
      const basicResponse = BasicOCSPResponse.fromBER(this.responseBytes.response.valueBlock.valueHexView);
      if (issuerCertificate !== null) {
        if (!basicResponse.certs) {
          basicResponse.certs = [];
        }
        basicResponse.certs.push(issuerCertificate);
      }
      return basicResponse.verify({}, crypto2);
    }
    throw new Error("Unknown ResponseBytes type: ".concat(((_a3 = this.responseBytes) === null || _a3 === void 0 ? void 0 : _a3.responseType) || "Unknown"));
  }
}
OCSPResponse.CLASS_NAME = "OCSPResponse";
const TYPE = "type";
const ATTRIBUTES = "attributes";
const ENCODED_VALUE = "encodedValue";
const CLEAR_PROPS$6 = [
  ATTRIBUTES
];
class SignedAndUnsignedAttributes extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.type = getParametersValue(parameters, TYPE, SignedAndUnsignedAttributes.defaultValues(TYPE));
    this.attributes = getParametersValue(parameters, ATTRIBUTES, SignedAndUnsignedAttributes.defaultValues(ATTRIBUTES));
    this.encodedValue = getParametersValue(parameters, ENCODED_VALUE, SignedAndUnsignedAttributes.defaultValues(ENCODED_VALUE));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case TYPE:
        return -1;
      case ATTRIBUTES:
        return [];
      case ENCODED_VALUE:
        return EMPTY_BUFFER;
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case TYPE:
        return memberValue === SignedAndUnsignedAttributes.defaultValues(TYPE);
      case ATTRIBUTES:
        return memberValue.length === 0;
      case ENCODED_VALUE:
        return memberValue.byteLength === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Constructed({
      name: names.blockName || EMPTY_STRING,
      optional: true,
      idBlock: {
        tagClass: 3,
        tagNumber: names.tagNumber || 0
      },
      value: [
        new Repeated({
          name: names.attributes || EMPTY_STRING,
          value: Attribute.schema()
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$6);
    const asn1 = compareSchema(schema, schema, SignedAndUnsignedAttributes.schema({
      names: {
        tagNumber: this.type,
        attributes: ATTRIBUTES
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.type = asn1.result.idBlock.tagNumber;
    this.encodedValue = BufferSourceConverter.toArrayBuffer(asn1.result.valueBeforeDecodeView);
    const encodedView = new Uint8Array(this.encodedValue);
    encodedView[0] = 49;
    if (ATTRIBUTES in asn1.result === false) {
      if (this.type === 0)
        throw new Error("Wrong structure of SignedUnsignedAttributes");
      else
        return;
    }
    this.attributes = Array.from(asn1.result.attributes, (element) => new Attribute({ schema: element }));
  }
  toSchema() {
    if (SignedAndUnsignedAttributes.compareWithDefault(TYPE, this.type) || SignedAndUnsignedAttributes.compareWithDefault(ATTRIBUTES, this.attributes))
      throw new Error('Incorrectly initialized "SignedAndUnsignedAttributes" class');
    return new Constructed({
      optional: true,
      idBlock: {
        tagClass: 3,
        tagNumber: this.type
      },
      value: Array.from(this.attributes, (o2) => o2.toSchema())
    });
  }
  toJSON() {
    if (SignedAndUnsignedAttributes.compareWithDefault(TYPE, this.type) || SignedAndUnsignedAttributes.compareWithDefault(ATTRIBUTES, this.attributes))
      throw new Error('Incorrectly initialized "SignedAndUnsignedAttributes" class');
    return {
      type: this.type,
      attributes: Array.from(this.attributes, (o2) => o2.toJSON())
    };
  }
}
SignedAndUnsignedAttributes.CLASS_NAME = "SignedAndUnsignedAttributes";
const VERSION$4 = "version";
const SID = "sid";
const DIGEST_ALGORITHM = "digestAlgorithm";
const SIGNED_ATTRS = "signedAttrs";
const SIGNATURE_ALGORITHM = "signatureAlgorithm";
const SIGNATURE = "signature";
const UNSIGNED_ATTRS = "unsignedAttrs";
const SIGNER_INFO = "SignerInfo";
const SIGNER_INFO_VERSION = "".concat(SIGNER_INFO, ".").concat(VERSION$4);
const SIGNER_INFO_SID = "".concat(SIGNER_INFO, ".").concat(SID);
const SIGNER_INFO_DIGEST_ALGORITHM = "".concat(SIGNER_INFO, ".").concat(DIGEST_ALGORITHM);
const SIGNER_INFO_SIGNED_ATTRS = "".concat(SIGNER_INFO, ".").concat(SIGNED_ATTRS);
const SIGNER_INFO_SIGNATURE_ALGORITHM = "".concat(SIGNER_INFO, ".").concat(SIGNATURE_ALGORITHM);
const SIGNER_INFO_SIGNATURE = "".concat(SIGNER_INFO, ".").concat(SIGNATURE);
const SIGNER_INFO_UNSIGNED_ATTRS = "".concat(SIGNER_INFO, ".").concat(UNSIGNED_ATTRS);
const CLEAR_PROPS$5 = [
  SIGNER_INFO_VERSION,
  SIGNER_INFO_SID,
  SIGNER_INFO_DIGEST_ALGORITHM,
  SIGNER_INFO_SIGNED_ATTRS,
  SIGNER_INFO_SIGNATURE_ALGORITHM,
  SIGNER_INFO_SIGNATURE,
  SIGNER_INFO_UNSIGNED_ATTRS
];
class SignerInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$4, SignerInfo.defaultValues(VERSION$4));
    this.sid = getParametersValue(parameters, SID, SignerInfo.defaultValues(SID));
    this.digestAlgorithm = getParametersValue(parameters, DIGEST_ALGORITHM, SignerInfo.defaultValues(DIGEST_ALGORITHM));
    if (SIGNED_ATTRS in parameters) {
      this.signedAttrs = getParametersValue(parameters, SIGNED_ATTRS, SignerInfo.defaultValues(SIGNED_ATTRS));
    }
    this.signatureAlgorithm = getParametersValue(parameters, SIGNATURE_ALGORITHM, SignerInfo.defaultValues(SIGNATURE_ALGORITHM));
    this.signature = getParametersValue(parameters, SIGNATURE, SignerInfo.defaultValues(SIGNATURE));
    if (UNSIGNED_ATTRS in parameters) {
      this.unsignedAttrs = getParametersValue(parameters, UNSIGNED_ATTRS, SignerInfo.defaultValues(UNSIGNED_ATTRS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$4:
        return 0;
      case SID:
        return new Any();
      case DIGEST_ALGORITHM:
        return new AlgorithmIdentifier();
      case SIGNED_ATTRS:
        return new SignedAndUnsignedAttributes({ type: 0 });
      case SIGNATURE_ALGORITHM:
        return new AlgorithmIdentifier();
      case SIGNATURE:
        return new OctetString$1();
      case UNSIGNED_ATTRS:
        return new SignedAndUnsignedAttributes({ type: 1 });
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$4:
        return SignerInfo.defaultValues(VERSION$4) === memberValue;
      case SID:
        return memberValue instanceof Any;
      case DIGEST_ALGORITHM:
        if (memberValue instanceof AlgorithmIdentifier === false)
          return false;
        return memberValue.isEqual(SignerInfo.defaultValues(DIGEST_ALGORITHM));
      case SIGNED_ATTRS:
        return SignedAndUnsignedAttributes.compareWithDefault("type", memberValue.type) && SignedAndUnsignedAttributes.compareWithDefault("attributes", memberValue.attributes) && SignedAndUnsignedAttributes.compareWithDefault("encodedValue", memberValue.encodedValue);
      case SIGNATURE_ALGORITHM:
        if (memberValue instanceof AlgorithmIdentifier === false)
          return false;
        return memberValue.isEqual(SignerInfo.defaultValues(SIGNATURE_ALGORITHM));
      case SIGNATURE:
      case UNSIGNED_ATTRS:
        return SignedAndUnsignedAttributes.compareWithDefault("type", memberValue.type) && SignedAndUnsignedAttributes.compareWithDefault("attributes", memberValue.attributes) && SignedAndUnsignedAttributes.compareWithDefault("encodedValue", memberValue.encodedValue);
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: SIGNER_INFO,
      value: [
        new Integer({ name: names.version || SIGNER_INFO_VERSION }),
        new Choice({
          value: [
            IssuerAndSerialNumber.schema(names.sidSchema || {
              names: {
                blockName: SIGNER_INFO_SID
              }
            }),
            new Choice({
              value: [
                new Constructed({
                  optional: true,
                  name: names.sid || SIGNER_INFO_SID,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: 0
                  },
                  value: [new OctetString$1()]
                }),
                new Primitive({
                  optional: true,
                  name: names.sid || SIGNER_INFO_SID,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: 0
                  }
                })
              ]
            })
          ]
        }),
        AlgorithmIdentifier.schema(names.digestAlgorithm || {
          names: {
            blockName: SIGNER_INFO_DIGEST_ALGORITHM
          }
        }),
        SignedAndUnsignedAttributes.schema(names.signedAttrs || {
          names: {
            blockName: SIGNER_INFO_SIGNED_ATTRS,
            tagNumber: 0
          }
        }),
        AlgorithmIdentifier.schema(names.signatureAlgorithm || {
          names: {
            blockName: SIGNER_INFO_SIGNATURE_ALGORITHM
          }
        }),
        new OctetString$1({ name: names.signature || SIGNER_INFO_SIGNATURE }),
        SignedAndUnsignedAttributes.schema(names.unsignedAttrs || {
          names: {
            blockName: SIGNER_INFO_UNSIGNED_ATTRS,
            tagNumber: 1
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$5);
    const asn1 = compareSchema(schema, schema, SignerInfo.schema());
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result[SIGNER_INFO_VERSION].valueBlock.valueDec;
    const currentSid = asn1.result[SIGNER_INFO_SID];
    if (currentSid.idBlock.tagClass === 1)
      this.sid = new IssuerAndSerialNumber({ schema: currentSid });
    else
      this.sid = currentSid;
    this.digestAlgorithm = new AlgorithmIdentifier({ schema: asn1.result[SIGNER_INFO_DIGEST_ALGORITHM] });
    if (SIGNER_INFO_SIGNED_ATTRS in asn1.result)
      this.signedAttrs = new SignedAndUnsignedAttributes({ type: 0, schema: asn1.result[SIGNER_INFO_SIGNED_ATTRS] });
    this.signatureAlgorithm = new AlgorithmIdentifier({ schema: asn1.result[SIGNER_INFO_SIGNATURE_ALGORITHM] });
    this.signature = asn1.result[SIGNER_INFO_SIGNATURE];
    if (SIGNER_INFO_UNSIGNED_ATTRS in asn1.result)
      this.unsignedAttrs = new SignedAndUnsignedAttributes({ type: 1, schema: asn1.result[SIGNER_INFO_UNSIGNED_ATTRS] });
  }
  toSchema() {
    if (SignerInfo.compareWithDefault(SID, this.sid))
      throw new Error('Incorrectly initialized "SignerInfo" class');
    const outputArray = [];
    outputArray.push(new Integer({ value: this.version }));
    if (this.sid instanceof IssuerAndSerialNumber)
      outputArray.push(this.sid.toSchema());
    else
      outputArray.push(this.sid);
    outputArray.push(this.digestAlgorithm.toSchema());
    if (this.signedAttrs) {
      if (SignerInfo.compareWithDefault(SIGNED_ATTRS, this.signedAttrs) === false)
        outputArray.push(this.signedAttrs.toSchema());
    }
    outputArray.push(this.signatureAlgorithm.toSchema());
    outputArray.push(this.signature);
    if (this.unsignedAttrs) {
      if (SignerInfo.compareWithDefault(UNSIGNED_ATTRS, this.unsignedAttrs) === false)
        outputArray.push(this.unsignedAttrs.toSchema());
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    if (SignerInfo.compareWithDefault(SID, this.sid)) {
      throw new Error('Incorrectly initialized "SignerInfo" class');
    }
    const res = {
      version: this.version,
      digestAlgorithm: this.digestAlgorithm.toJSON(),
      signatureAlgorithm: this.signatureAlgorithm.toJSON(),
      signature: this.signature.toJSON()
    };
    if (!(this.sid instanceof Any))
      res.sid = this.sid.toJSON();
    if (this.signedAttrs && SignerInfo.compareWithDefault(SIGNED_ATTRS, this.signedAttrs) === false) {
      res.signedAttrs = this.signedAttrs.toJSON();
    }
    if (this.unsignedAttrs && SignerInfo.compareWithDefault(UNSIGNED_ATTRS, this.unsignedAttrs) === false) {
      res.unsignedAttrs = this.unsignedAttrs.toJSON();
    }
    return res;
  }
}
SignerInfo.CLASS_NAME = "SignerInfo";
const VERSION$3 = "version";
const POLICY = "policy";
const MESSAGE_IMPRINT$1 = "messageImprint";
const SERIAL_NUMBER = "serialNumber";
const GEN_TIME = "genTime";
const ORDERING = "ordering";
const NONCE$1 = "nonce";
const ACCURACY = "accuracy";
const TSA = "tsa";
const EXTENSIONS$1 = "extensions";
const TST_INFO = "TSTInfo";
const TST_INFO_VERSION = "".concat(TST_INFO, ".").concat(VERSION$3);
const TST_INFO_POLICY = "".concat(TST_INFO, ".").concat(POLICY);
const TST_INFO_MESSAGE_IMPRINT = "".concat(TST_INFO, ".").concat(MESSAGE_IMPRINT$1);
const TST_INFO_SERIAL_NUMBER = "".concat(TST_INFO, ".").concat(SERIAL_NUMBER);
const TST_INFO_GEN_TIME = "".concat(TST_INFO, ".").concat(GEN_TIME);
const TST_INFO_ACCURACY = "".concat(TST_INFO, ".").concat(ACCURACY);
const TST_INFO_ORDERING = "".concat(TST_INFO, ".").concat(ORDERING);
const TST_INFO_NONCE = "".concat(TST_INFO, ".").concat(NONCE$1);
const TST_INFO_TSA = "".concat(TST_INFO, ".").concat(TSA);
const TST_INFO_EXTENSIONS = "".concat(TST_INFO, ".").concat(EXTENSIONS$1);
const CLEAR_PROPS$4 = [
  TST_INFO_VERSION,
  TST_INFO_POLICY,
  TST_INFO_MESSAGE_IMPRINT,
  TST_INFO_SERIAL_NUMBER,
  TST_INFO_GEN_TIME,
  TST_INFO_ACCURACY,
  TST_INFO_ORDERING,
  TST_INFO_NONCE,
  TST_INFO_TSA,
  TST_INFO_EXTENSIONS
];
class TSTInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$3, TSTInfo.defaultValues(VERSION$3));
    this.policy = getParametersValue(parameters, POLICY, TSTInfo.defaultValues(POLICY));
    this.messageImprint = getParametersValue(parameters, MESSAGE_IMPRINT$1, TSTInfo.defaultValues(MESSAGE_IMPRINT$1));
    this.serialNumber = getParametersValue(parameters, SERIAL_NUMBER, TSTInfo.defaultValues(SERIAL_NUMBER));
    this.genTime = getParametersValue(parameters, GEN_TIME, TSTInfo.defaultValues(GEN_TIME));
    if (ACCURACY in parameters) {
      this.accuracy = getParametersValue(parameters, ACCURACY, TSTInfo.defaultValues(ACCURACY));
    }
    if (ORDERING in parameters) {
      this.ordering = getParametersValue(parameters, ORDERING, TSTInfo.defaultValues(ORDERING));
    }
    if (NONCE$1 in parameters) {
      this.nonce = getParametersValue(parameters, NONCE$1, TSTInfo.defaultValues(NONCE$1));
    }
    if (TSA in parameters) {
      this.tsa = getParametersValue(parameters, TSA, TSTInfo.defaultValues(TSA));
    }
    if (EXTENSIONS$1 in parameters) {
      this.extensions = getParametersValue(parameters, EXTENSIONS$1, TSTInfo.defaultValues(EXTENSIONS$1));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$3:
        return 0;
      case POLICY:
        return EMPTY_STRING;
      case MESSAGE_IMPRINT$1:
        return new MessageImprint();
      case SERIAL_NUMBER:
        return new Integer();
      case GEN_TIME:
        return new Date(0, 0, 0);
      case ACCURACY:
        return new Accuracy();
      case ORDERING:
        return false;
      case NONCE$1:
        return new Integer();
      case TSA:
        return new GeneralName();
      case EXTENSIONS$1:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$3:
      case POLICY:
      case GEN_TIME:
      case ORDERING:
        return memberValue === TSTInfo.defaultValues(ORDERING);
      case MESSAGE_IMPRINT$1:
        return MessageImprint.compareWithDefault(HASH_ALGORITHM, memberValue.hashAlgorithm) && MessageImprint.compareWithDefault(HASHED_MESSAGE, memberValue.hashedMessage);
      case SERIAL_NUMBER:
      case NONCE$1:
        return memberValue.isEqual(TSTInfo.defaultValues(NONCE$1));
      case ACCURACY:
        return Accuracy.compareWithDefault(SECONDS, memberValue.seconds) && Accuracy.compareWithDefault(MILLIS, memberValue.millis) && Accuracy.compareWithDefault(MICROS, memberValue.micros);
      case TSA:
        return GeneralName.compareWithDefault(TYPE$4, memberValue.type) && GeneralName.compareWithDefault(VALUE$5, memberValue.value);
      case EXTENSIONS$1:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || TST_INFO,
      value: [
        new Integer({ name: names.version || TST_INFO_VERSION }),
        new ObjectIdentifier({ name: names.policy || TST_INFO_POLICY }),
        MessageImprint.schema(names.messageImprint || {
          names: {
            blockName: TST_INFO_MESSAGE_IMPRINT
          }
        }),
        new Integer({ name: names.serialNumber || TST_INFO_SERIAL_NUMBER }),
        new GeneralizedTime({ name: names.genTime || TST_INFO_GEN_TIME }),
        Accuracy.schema(names.accuracy || {
          names: {
            blockName: TST_INFO_ACCURACY
          }
        }),
        new Boolean$1({
          name: names.ordering || TST_INFO_ORDERING,
          optional: true
        }),
        new Integer({
          name: names.nonce || TST_INFO_NONCE,
          optional: true
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [GeneralName.schema(names.tsa || {
            names: {
              blockName: TST_INFO_TSA
            }
          })]
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: [
            new Repeated({
              name: names.extensions || TST_INFO_EXTENSIONS,
              value: Extension.schema(names.extension || {})
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$4);
    const asn1 = compareSchema(schema, schema, TSTInfo.schema());
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result[TST_INFO_VERSION].valueBlock.valueDec;
    this.policy = asn1.result[TST_INFO_POLICY].valueBlock.toString();
    this.messageImprint = new MessageImprint({ schema: asn1.result[TST_INFO_MESSAGE_IMPRINT] });
    this.serialNumber = asn1.result[TST_INFO_SERIAL_NUMBER];
    this.genTime = asn1.result[TST_INFO_GEN_TIME].toDate();
    if (TST_INFO_ACCURACY in asn1.result)
      this.accuracy = new Accuracy({ schema: asn1.result[TST_INFO_ACCURACY] });
    if (TST_INFO_ORDERING in asn1.result)
      this.ordering = asn1.result[TST_INFO_ORDERING].valueBlock.value;
    if (TST_INFO_NONCE in asn1.result)
      this.nonce = asn1.result[TST_INFO_NONCE];
    if (TST_INFO_TSA in asn1.result)
      this.tsa = new GeneralName({ schema: asn1.result[TST_INFO_TSA] });
    if (TST_INFO_EXTENSIONS in asn1.result)
      this.extensions = Array.from(asn1.result[TST_INFO_EXTENSIONS], (element) => new Extension({ schema: element }));
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new Integer({ value: this.version }));
    outputArray.push(new ObjectIdentifier({ value: this.policy }));
    outputArray.push(this.messageImprint.toSchema());
    outputArray.push(this.serialNumber);
    outputArray.push(new GeneralizedTime({ valueDate: this.genTime }));
    if (this.accuracy)
      outputArray.push(this.accuracy.toSchema());
    if (this.ordering !== void 0)
      outputArray.push(new Boolean$1({ value: this.ordering }));
    if (this.nonce)
      outputArray.push(this.nonce);
    if (this.tsa) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: [this.tsa.toSchema()]
      }));
    }
    if (this.extensions) {
      outputArray.push(new Constructed({
        optional: true,
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: Array.from(this.extensions, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      version: this.version,
      policy: this.policy,
      messageImprint: this.messageImprint.toJSON(),
      serialNumber: this.serialNumber.toJSON(),
      genTime: this.genTime
    };
    if (this.accuracy)
      res.accuracy = this.accuracy.toJSON();
    if (this.ordering !== void 0)
      res.ordering = this.ordering;
    if (this.nonce)
      res.nonce = this.nonce.toJSON();
    if (this.tsa)
      res.tsa = this.tsa.toJSON();
    if (this.extensions)
      res.extensions = Array.from(this.extensions, (o2) => o2.toJSON());
    return res;
  }
  async verify(params, crypto2 = getCrypto(true)) {
    if (!params.data) {
      throw new Error('"data" is a mandatory attribute for TST_INFO verification');
    }
    const data = params.data;
    if (params.notBefore) {
      if (this.genTime < params.notBefore)
        throw new Error("Generation time for TSTInfo object is less than notBefore value");
    }
    if (params.notAfter) {
      if (this.genTime > params.notAfter)
        throw new Error("Generation time for TSTInfo object is more than notAfter value");
    }
    const shaAlgorithm = crypto2.getAlgorithmByOID(this.messageImprint.hashAlgorithm.algorithmId, true, "MessageImprint.hashAlgorithm");
    const hash = await crypto2.digest(shaAlgorithm.name, new Uint8Array(data));
    return BufferSourceConverter.isEqual(hash, this.messageImprint.hashedMessage.valueBlock.valueHexView);
  }
}
TSTInfo.CLASS_NAME = "TSTInfo";
const VERSION$2 = "version";
const DIGEST_ALGORITHMS = "digestAlgorithms";
const ENCAP_CONTENT_INFO = "encapContentInfo";
const CERTIFICATES = "certificates";
const CRLS = "crls";
const SIGNER_INFOS = "signerInfos";
const OCSPS = "ocsps";
const SIGNED_DATA = "SignedData";
const SIGNED_DATA_VERSION = "".concat(SIGNED_DATA, ".").concat(VERSION$2);
const SIGNED_DATA_DIGEST_ALGORITHMS = "".concat(SIGNED_DATA, ".").concat(DIGEST_ALGORITHMS);
const SIGNED_DATA_ENCAP_CONTENT_INFO = "".concat(SIGNED_DATA, ".").concat(ENCAP_CONTENT_INFO);
const SIGNED_DATA_CERTIFICATES = "".concat(SIGNED_DATA, ".").concat(CERTIFICATES);
const SIGNED_DATA_CRLS = "".concat(SIGNED_DATA, ".").concat(CRLS);
const SIGNED_DATA_SIGNER_INFOS = "".concat(SIGNED_DATA, ".").concat(SIGNER_INFOS);
const CLEAR_PROPS$3 = [
  SIGNED_DATA_VERSION,
  SIGNED_DATA_DIGEST_ALGORITHMS,
  SIGNED_DATA_ENCAP_CONTENT_INFO,
  SIGNED_DATA_CERTIFICATES,
  SIGNED_DATA_CRLS,
  SIGNED_DATA_SIGNER_INFOS
];
class SignedDataVerifyError extends Error {
  constructor({ message, code = 0, date = /* @__PURE__ */ new Date(), signatureVerified = null, signerCertificate = null, signerCertificateVerified = null, timestampSerial = null, certificatePath = [] }) {
    super(message);
    this.name = "SignedDataVerifyError";
    this.date = date;
    this.code = code;
    this.timestampSerial = timestampSerial;
    this.signatureVerified = signatureVerified;
    this.signerCertificate = signerCertificate;
    this.signerCertificateVerified = signerCertificateVerified;
    this.certificatePath = certificatePath;
  }
}
class SignedData extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$2, SignedData.defaultValues(VERSION$2));
    this.digestAlgorithms = getParametersValue(parameters, DIGEST_ALGORITHMS, SignedData.defaultValues(DIGEST_ALGORITHMS));
    this.encapContentInfo = getParametersValue(parameters, ENCAP_CONTENT_INFO, SignedData.defaultValues(ENCAP_CONTENT_INFO));
    if (CERTIFICATES in parameters) {
      this.certificates = getParametersValue(parameters, CERTIFICATES, SignedData.defaultValues(CERTIFICATES));
    }
    if (CRLS in parameters) {
      this.crls = getParametersValue(parameters, CRLS, SignedData.defaultValues(CRLS));
    }
    if (OCSPS in parameters) {
      this.ocsps = getParametersValue(parameters, OCSPS, SignedData.defaultValues(OCSPS));
    }
    this.signerInfos = getParametersValue(parameters, SIGNER_INFOS, SignedData.defaultValues(SIGNER_INFOS));
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$2:
        return 0;
      case DIGEST_ALGORITHMS:
        return [];
      case ENCAP_CONTENT_INFO:
        return new EncapsulatedContentInfo();
      case CERTIFICATES:
        return [];
      case CRLS:
        return [];
      case OCSPS:
        return [];
      case SIGNER_INFOS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$2:
        return memberValue === SignedData.defaultValues(VERSION$2);
      case ENCAP_CONTENT_INFO:
        return EncapsulatedContentInfo.compareWithDefault("eContentType", memberValue.eContentType) && EncapsulatedContentInfo.compareWithDefault("eContent", memberValue.eContent);
      case DIGEST_ALGORITHMS:
      case CERTIFICATES:
      case CRLS:
      case OCSPS:
      case SIGNER_INFOS:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    if (names.optional === void 0) {
      names.optional = false;
    }
    return new Sequence({
      name: names.blockName || SIGNED_DATA,
      optional: names.optional,
      value: [
        new Integer({ name: names.version || SIGNED_DATA_VERSION }),
        new Set$1({
          value: [
            new Repeated({
              name: names.digestAlgorithms || SIGNED_DATA_DIGEST_ALGORITHMS,
              value: AlgorithmIdentifier.schema()
            })
          ]
        }),
        EncapsulatedContentInfo.schema(names.encapContentInfo || {
          names: {
            blockName: SIGNED_DATA_ENCAP_CONTENT_INFO
          }
        }),
        new Constructed({
          name: names.certificates || SIGNED_DATA_CERTIFICATES,
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: CertificateSet.schema().valueBlock.value
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 1
          },
          value: RevocationInfoChoices.schema(names.crls || {
            names: {
              crls: SIGNED_DATA_CRLS
            }
          }).valueBlock.value
        }),
        new Set$1({
          value: [
            new Repeated({
              name: names.signerInfos || SIGNED_DATA_SIGNER_INFOS,
              value: SignerInfo.schema()
            })
          ]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$3);
    const asn1 = compareSchema(schema, schema, SignedData.schema());
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result[SIGNED_DATA_VERSION].valueBlock.valueDec;
    if (SIGNED_DATA_DIGEST_ALGORITHMS in asn1.result)
      this.digestAlgorithms = Array.from(asn1.result[SIGNED_DATA_DIGEST_ALGORITHMS], (algorithm) => new AlgorithmIdentifier({ schema: algorithm }));
    this.encapContentInfo = new EncapsulatedContentInfo({ schema: asn1.result[SIGNED_DATA_ENCAP_CONTENT_INFO] });
    if (SIGNED_DATA_CERTIFICATES in asn1.result) {
      const certificateSet = new CertificateSet({
        schema: new Set$1({
          value: asn1.result[SIGNED_DATA_CERTIFICATES].valueBlock.value
        })
      });
      this.certificates = certificateSet.certificates.slice(0);
    }
    if (SIGNED_DATA_CRLS in asn1.result) {
      this.crls = Array.from(asn1.result[SIGNED_DATA_CRLS], (crl) => {
        if (crl.idBlock.tagClass === 1)
          return new CertificateRevocationList({ schema: crl });
        crl.idBlock.tagClass = 1;
        crl.idBlock.tagNumber = 16;
        return new OtherRevocationInfoFormat({ schema: crl });
      });
    }
    if (SIGNED_DATA_SIGNER_INFOS in asn1.result)
      this.signerInfos = Array.from(asn1.result[SIGNED_DATA_SIGNER_INFOS], (signerInfoSchema) => new SignerInfo({ schema: signerInfoSchema }));
  }
  toSchema(encodeFlag = false) {
    const outputArray = [];
    if (this.certificates && this.certificates.length && this.certificates.some((o2) => o2 instanceof OtherCertificateFormat) || this.crls && this.crls.length && this.crls.some((o2) => o2 instanceof OtherRevocationInfoFormat)) {
      this.version = 5;
    } else if (this.certificates && this.certificates.length && this.certificates.some((o2) => o2 instanceof AttributeCertificateV2)) {
      this.version = 4;
    } else if (this.certificates && this.certificates.length && this.certificates.some((o2) => o2 instanceof AttributeCertificateV1) || this.signerInfos.some((o2) => o2.version === 3) || this.encapContentInfo.eContentType !== SignedData.ID_DATA) {
      this.version = 3;
    } else {
      this.version = 1;
    }
    outputArray.push(new Integer({ value: this.version }));
    outputArray.push(new Set$1({
      value: Array.from(this.digestAlgorithms, (algorithm) => algorithm.toSchema())
    }));
    outputArray.push(this.encapContentInfo.toSchema());
    if (this.certificates) {
      const certificateSet = new CertificateSet({ certificates: this.certificates });
      const certificateSetSchema = certificateSet.toSchema();
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: certificateSetSchema.valueBlock.value
      }));
    }
    if (this.crls) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
        },
        value: Array.from(this.crls, (crl) => {
          if (crl instanceof OtherRevocationInfoFormat) {
            const crlSchema = crl.toSchema();
            crlSchema.idBlock.tagClass = 3;
            crlSchema.idBlock.tagNumber = 1;
            return crlSchema;
          }
          return crl.toSchema(encodeFlag);
        })
      }));
    }
    outputArray.push(new Set$1({
      value: Array.from(this.signerInfos, (signerInfo) => signerInfo.toSchema())
    }));
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      version: this.version,
      digestAlgorithms: Array.from(this.digestAlgorithms, (algorithm) => algorithm.toJSON()),
      encapContentInfo: this.encapContentInfo.toJSON(),
      signerInfos: Array.from(this.signerInfos, (signerInfo) => signerInfo.toJSON())
    };
    if (this.certificates) {
      res.certificates = Array.from(this.certificates, (certificate) => certificate.toJSON());
    }
    if (this.crls) {
      res.crls = Array.from(this.crls, (crl) => crl.toJSON());
    }
    return res;
  }
  async verify({ signer = -1, data = EMPTY_BUFFER, trustedCerts = [], checkDate = /* @__PURE__ */ new Date(), checkChain = false, passedWhenNotRevValues = false, extendedMode = false, findOrigin = null, findIssuer = null } = {}, crypto2 = getCrypto(true)) {
    let signerCert = null;
    let timestampSerial = null;
    try {
      let messageDigestValue = EMPTY_BUFFER;
      let shaAlgorithm = EMPTY_STRING;
      let certificatePath = [];
      const signerInfo = this.signerInfos[signer];
      if (!signerInfo) {
        throw new SignedDataVerifyError({
          date: checkDate,
          code: 1,
          message: "Unable to get signer by supplied index"
        });
      }
      if (!this.certificates) {
        throw new SignedDataVerifyError({
          date: checkDate,
          code: 2,
          message: "No certificates attached to this signed data"
        });
      }
      if (signerInfo.sid instanceof IssuerAndSerialNumber) {
        for (const certificate of this.certificates) {
          if (!(certificate instanceof Certificate))
            continue;
          if (certificate.issuer.isEqual(signerInfo.sid.issuer) && certificate.serialNumber.isEqual(signerInfo.sid.serialNumber)) {
            signerCert = certificate;
            break;
          }
        }
      } else {
        const sid = signerInfo.sid;
        const keyId = sid.idBlock.isConstructed ? sid.valueBlock.value[0].valueBlock.valueHex : sid.valueBlock.valueHex;
        for (const certificate of this.certificates) {
          if (!(certificate instanceof Certificate)) {
            continue;
          }
          const digest = await crypto2.digest({ name: "sha-1" }, certificate.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHexView);
          if (isEqualBuffer(digest, keyId)) {
            signerCert = certificate;
            break;
          }
        }
      }
      if (!signerCert) {
        throw new SignedDataVerifyError({
          date: checkDate,
          code: 3,
          message: "Unable to find signer certificate"
        });
      }
      if (this.encapContentInfo.eContentType === id_eContentType_TSTInfo) {
        if (!this.encapContentInfo.eContent) {
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 15,
            message: "Error during verification: TSTInfo eContent is empty",
            signatureVerified: null,
            signerCertificate: signerCert,
            timestampSerial,
            signerCertificateVerified: true
          });
        }
        let tstInfo;
        try {
          tstInfo = TSTInfo.fromBER(this.encapContentInfo.eContent.valueBlock.valueHexView);
        } catch (ex) {
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 15,
            message: "Error during verification: TSTInfo wrong ASN.1 schema ",
            signatureVerified: null,
            signerCertificate: signerCert,
            timestampSerial,
            signerCertificateVerified: true
          });
        }
        checkDate = tstInfo.genTime;
        timestampSerial = tstInfo.serialNumber.valueBlock.valueHexView.slice();
        if (data.byteLength === 0) {
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 4,
            message: "Missed detached data input array"
          });
        }
        if (!await tstInfo.verify({ data }, crypto2)) {
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 15,
            message: "Error during verification: TSTInfo verification is failed",
            signatureVerified: false,
            signerCertificate: signerCert,
            timestampSerial,
            signerCertificateVerified: true
          });
        }
      }
      if (checkChain) {
        const certs = this.certificates.filter((certificate) => certificate instanceof Certificate && !!checkCA(certificate, signerCert));
        const chainParams = {
          checkDate,
          certs,
          trustedCerts
        };
        if (findIssuer) {
          chainParams.findIssuer = findIssuer;
        }
        if (findOrigin) {
          chainParams.findOrigin = findOrigin;
        }
        const chainEngine = new CertificateChainValidationEngine(chainParams);
        chainEngine.certs.push(signerCert);
        if (this.crls) {
          for (const crl of this.crls) {
            if ("thisUpdate" in crl)
              chainEngine.crls.push(crl);
            else {
              if (crl.otherRevInfoFormat === id_PKIX_OCSP_Basic)
                chainEngine.ocsps.push(new BasicOCSPResponse({ schema: crl.otherRevInfo }));
            }
          }
        }
        if (this.ocsps) {
          chainEngine.ocsps.push(...this.ocsps);
        }
        const verificationResult = await chainEngine.verify({ passedWhenNotRevValues }, crypto2).catch((e2) => {
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 5,
            message: "Validation of signer's certificate failed with error: ".concat(e2 instanceof Object ? e2.resultMessage : e2),
            signerCertificate: signerCert,
            signerCertificateVerified: false
          });
        });
        if (verificationResult.certificatePath) {
          certificatePath = verificationResult.certificatePath;
        }
        if (!verificationResult.result)
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 5,
            message: "Validation of signer's certificate failed: ".concat(verificationResult.resultMessage),
            signerCertificate: signerCert,
            signerCertificateVerified: false
          });
      }
      const signerInfoHashAlgorithm = crypto2.getAlgorithmByOID(signerInfo.digestAlgorithm.algorithmId);
      if (!("name" in signerInfoHashAlgorithm)) {
        throw new SignedDataVerifyError({
          date: checkDate,
          code: 7,
          message: "Unsupported signature algorithm: ".concat(signerInfo.digestAlgorithm.algorithmId),
          signerCertificate: signerCert,
          signerCertificateVerified: true
        });
      }
      shaAlgorithm = signerInfoHashAlgorithm.name;
      const eContent = this.encapContentInfo.eContent;
      if (eContent) {
        if (eContent.idBlock.tagClass === 1 && eContent.idBlock.tagNumber === 4) {
          data = eContent.getValue();
        } else
          data = eContent.valueBlock.valueBeforeDecodeView;
      } else {
        if (data.byteLength === 0) {
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 8,
            message: "Missed detached data input array",
            signerCertificate: signerCert,
            signerCertificateVerified: true
          });
        }
      }
      if (signerInfo.signedAttrs) {
        let foundContentType = false;
        let foundMessageDigest = false;
        for (const attribute of signerInfo.signedAttrs.attributes) {
          if (attribute.type === "1.2.840.113549.1.9.3")
            foundContentType = true;
          if (attribute.type === "1.2.840.113549.1.9.4") {
            foundMessageDigest = true;
            messageDigestValue = attribute.values[0].valueBlock.valueHex;
          }
          if (foundContentType && foundMessageDigest)
            break;
        }
        if (foundContentType === false) {
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 9,
            message: 'Attribute "content-type" is a mandatory attribute for "signed attributes"',
            signerCertificate: signerCert,
            signerCertificateVerified: true
          });
        }
        if (foundMessageDigest === false) {
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 10,
            message: 'Attribute "message-digest" is a mandatory attribute for "signed attributes"',
            signatureVerified: null,
            signerCertificate: signerCert,
            signerCertificateVerified: true
          });
        }
      }
      if (signerInfo.signedAttrs) {
        const messageDigest = await crypto2.digest(shaAlgorithm, new Uint8Array(data));
        if (!isEqualBuffer(messageDigest, messageDigestValue)) {
          throw new SignedDataVerifyError({
            date: checkDate,
            code: 15,
            message: "Error during verification: Message digest doesn't match",
            signatureVerified: null,
            signerCertificate: signerCert,
            timestampSerial,
            signerCertificateVerified: true
          });
        }
        data = signerInfo.signedAttrs.encodedValue;
      }
      const verifyResult = signerInfo.signatureAlgorithm.algorithmId === "1.2.840.113549.1.1.1" ? await crypto2.verifyWithPublicKey(data, signerInfo.signature, signerCert.subjectPublicKeyInfo, signerInfo.signatureAlgorithm, shaAlgorithm) : await crypto2.verifyWithPublicKey(data, signerInfo.signature, signerCert.subjectPublicKeyInfo, signerInfo.signatureAlgorithm);
      if (extendedMode) {
        return {
          date: checkDate,
          code: 14,
          message: EMPTY_STRING,
          signatureVerified: verifyResult,
          signerCertificate: signerCert,
          timestampSerial,
          signerCertificateVerified: true,
          certificatePath
        };
      } else {
        return verifyResult;
      }
    } catch (e2) {
      if (e2 instanceof SignedDataVerifyError) {
        throw e2;
      }
      throw new SignedDataVerifyError({
        date: checkDate,
        code: 15,
        message: "Error during verification: ".concat(e2 instanceof Error ? e2.message : e2),
        signatureVerified: null,
        signerCertificate: signerCert,
        timestampSerial,
        signerCertificateVerified: true
      });
    }
  }
  async sign(privateKey, signerIndex, hashAlgorithm = "SHA-1", data = EMPTY_BUFFER, crypto2 = getCrypto(true)) {
    var _a3;
    if (!privateKey)
      throw new Error("Need to provide a private key for signing");
    const signerInfo = this.signerInfos[signerIndex];
    if (!signerInfo) {
      throw new RangeError("SignerInfo index is out of range");
    }
    if (!((_a3 = signerInfo.signedAttrs) === null || _a3 === void 0 ? void 0 : _a3.attributes.length) && "hash" in privateKey.algorithm && "hash" in privateKey.algorithm && privateKey.algorithm.hash) {
      hashAlgorithm = privateKey.algorithm.hash.name;
    }
    const hashAlgorithmOID = crypto2.getOIDByAlgorithm({ name: hashAlgorithm }, true, "hashAlgorithm");
    if (this.digestAlgorithms.filter((algorithm) => algorithm.algorithmId === hashAlgorithmOID).length === 0) {
      this.digestAlgorithms.push(new AlgorithmIdentifier({
        algorithmId: hashAlgorithmOID,
        algorithmParams: new Null()
      }));
    }
    signerInfo.digestAlgorithm = new AlgorithmIdentifier({
      algorithmId: hashAlgorithmOID,
      algorithmParams: new Null()
    });
    const signatureParams = await crypto2.getSignatureParameters(privateKey, hashAlgorithm);
    const parameters = signatureParams.parameters;
    signerInfo.signatureAlgorithm = signatureParams.signatureAlgorithm;
    if (signerInfo.signedAttrs) {
      if (signerInfo.signedAttrs.encodedValue.byteLength !== 0)
        data = signerInfo.signedAttrs.encodedValue;
      else {
        data = signerInfo.signedAttrs.toSchema().toBER();
        const view = BufferSourceConverter.toUint8Array(data);
        view[0] = 49;
      }
    } else {
      const eContent = this.encapContentInfo.eContent;
      if (eContent) {
        if (eContent.idBlock.tagClass === 1 && eContent.idBlock.tagNumber === 4) {
          data = eContent.getValue();
        } else
          data = eContent.valueBlock.valueBeforeDecodeView;
      } else {
        if (data.byteLength === 0)
          throw new Error("Missed detached data input array");
      }
    }
    const signature = await crypto2.signWithPrivateKey(data, privateKey, parameters);
    signerInfo.signature = new OctetString$1({ valueHex: signature });
  }
}
SignedData.CLASS_NAME = "SignedData";
SignedData.ID_DATA = id_ContentType_Data;
const VERSION$1 = "version";
const AUTH_SAFE = "authSafe";
const MAC_DATA = "macData";
const PARSED_VALUE = "parsedValue";
const CLERA_PROPS = [
  VERSION$1,
  AUTH_SAFE,
  MAC_DATA
];
class PFX extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION$1, PFX.defaultValues(VERSION$1));
    this.authSafe = getParametersValue(parameters, AUTH_SAFE, PFX.defaultValues(AUTH_SAFE));
    if (MAC_DATA in parameters) {
      this.macData = getParametersValue(parameters, MAC_DATA, PFX.defaultValues(MAC_DATA));
    }
    if (PARSED_VALUE in parameters) {
      this.parsedValue = getParametersValue(parameters, PARSED_VALUE, PFX.defaultValues(PARSED_VALUE));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION$1:
        return 3;
      case AUTH_SAFE:
        return new ContentInfo();
      case MAC_DATA:
        return new MacData();
      case PARSED_VALUE:
        return {};
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION$1:
        return memberValue === PFX.defaultValues(memberName);
      case AUTH_SAFE:
        return ContentInfo.compareWithDefault("contentType", memberValue.contentType) && ContentInfo.compareWithDefault("content", memberValue.content);
      case MAC_DATA:
        return MacData.compareWithDefault("mac", memberValue.mac) && MacData.compareWithDefault("macSalt", memberValue.macSalt) && MacData.compareWithDefault("iterations", memberValue.iterations);
      case PARSED_VALUE:
        return memberValue instanceof Object && Object.keys(memberValue).length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.version || VERSION$1 }),
        ContentInfo.schema(names.authSafe || {
          names: {
            blockName: AUTH_SAFE
          }
        }),
        MacData.schema(names.macData || {
          names: {
            blockName: MAC_DATA,
            optional: true
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLERA_PROPS);
    const asn1 = compareSchema(schema, schema, PFX.schema({
      names: {
        version: VERSION$1,
        authSafe: {
          names: {
            blockName: AUTH_SAFE
          }
        },
        macData: {
          names: {
            blockName: MAC_DATA
          }
        }
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result.version.valueBlock.valueDec;
    this.authSafe = new ContentInfo({ schema: asn1.result.authSafe });
    if (MAC_DATA in asn1.result)
      this.macData = new MacData({ schema: asn1.result.macData });
  }
  toSchema() {
    const outputArray = [
      new Integer({ value: this.version }),
      this.authSafe.toSchema()
    ];
    if (this.macData) {
      outputArray.push(this.macData.toSchema());
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const output = {
      version: this.version,
      authSafe: this.authSafe.toJSON()
    };
    if (this.macData) {
      output.macData = this.macData.toJSON();
    }
    return output;
  }
  async makeInternalValues(parameters = {}, crypto2 = getCrypto(true)) {
    ArgumentError.assert(parameters, "parameters", "object");
    if (!this.parsedValue) {
      throw new Error('Please call "parseValues" function first in order to make "parsedValue" data');
    }
    ParameterError.assertEmpty(this.parsedValue.integrityMode, "integrityMode", "parsedValue");
    ParameterError.assertEmpty(this.parsedValue.authenticatedSafe, "authenticatedSafe", "parsedValue");
    switch (this.parsedValue.integrityMode) {
      case 0:
        {
          if (!("iterations" in parameters))
            throw new ParameterError("iterations");
          ParameterError.assertEmpty(parameters.pbkdf2HashAlgorithm, "pbkdf2HashAlgorithm");
          ParameterError.assertEmpty(parameters.hmacHashAlgorithm, "hmacHashAlgorithm");
          ParameterError.assertEmpty(parameters.password, "password");
          const saltBuffer = new ArrayBuffer(64);
          const saltView = new Uint8Array(saltBuffer);
          crypto2.getRandomValues(saltView);
          const data = this.parsedValue.authenticatedSafe.toSchema().toBER(false);
          this.authSafe = new ContentInfo({
            contentType: ContentInfo.DATA,
            content: new OctetString$1({ valueHex: data })
          });
          const result = await crypto2.stampDataWithPassword({
            password: parameters.password,
            hashAlgorithm: parameters.hmacHashAlgorithm,
            salt: saltBuffer,
            iterationCount: parameters.iterations,
            contentToStamp: data
          });
          this.macData = new MacData({
            mac: new DigestInfo({
              digestAlgorithm: new AlgorithmIdentifier({
                algorithmId: crypto2.getOIDByAlgorithm({ name: parameters.hmacHashAlgorithm }, true, "hmacHashAlgorithm")
              }),
              digest: new OctetString$1({ valueHex: result })
            }),
            macSalt: new OctetString$1({ valueHex: saltBuffer }),
            iterations: parameters.iterations
          });
        }
        break;
      case 1:
        {
          if (!("signingCertificate" in parameters)) {
            throw new ParameterError("signingCertificate");
          }
          ParameterError.assertEmpty(parameters.privateKey, "privateKey");
          ParameterError.assertEmpty(parameters.hashAlgorithm, "hashAlgorithm");
          const toBeSigned = this.parsedValue.authenticatedSafe.toSchema().toBER(false);
          const cmsSigned = new SignedData({
            version: 1,
            encapContentInfo: new EncapsulatedContentInfo({
              eContentType: "1.2.840.113549.1.7.1",
              eContent: new OctetString$1({ valueHex: toBeSigned })
            }),
            certificates: [parameters.signingCertificate]
          });
          const result = await crypto2.digest({ name: parameters.hashAlgorithm }, new Uint8Array(toBeSigned));
          const signedAttr = [];
          signedAttr.push(new Attribute({
            type: "1.2.840.113549.1.9.3",
            values: [
              new ObjectIdentifier({ value: "1.2.840.113549.1.7.1" })
            ]
          }));
          signedAttr.push(new Attribute({
            type: "1.2.840.113549.1.9.5",
            values: [
              new UTCTime({ valueDate: /* @__PURE__ */ new Date() })
            ]
          }));
          signedAttr.push(new Attribute({
            type: "1.2.840.113549.1.9.4",
            values: [
              new OctetString$1({ valueHex: result })
            ]
          }));
          cmsSigned.signerInfos.push(new SignerInfo({
            version: 1,
            sid: new IssuerAndSerialNumber({
              issuer: parameters.signingCertificate.issuer,
              serialNumber: parameters.signingCertificate.serialNumber
            }),
            signedAttrs: new SignedAndUnsignedAttributes({
              type: 0,
              attributes: signedAttr
            })
          }));
          await cmsSigned.sign(parameters.privateKey, 0, parameters.hashAlgorithm, void 0, crypto2);
          this.authSafe = new ContentInfo({
            contentType: "1.2.840.113549.1.7.2",
            content: cmsSigned.toSchema(true)
          });
        }
        break;
      default:
        throw new Error('Parameter "integrityMode" has unknown value: '.concat(this.parsedValue.integrityMode));
    }
  }
  async parseInternalValues(parameters, crypto2 = getCrypto(true)) {
    ArgumentError.assert(parameters, "parameters", "object");
    if (parameters.checkIntegrity === void 0) {
      parameters.checkIntegrity = true;
    }
    this.parsedValue = {};
    switch (this.authSafe.contentType) {
      case ContentInfo.DATA:
        {
          ParameterError.assertEmpty(parameters.password, "password");
          this.parsedValue.integrityMode = 0;
          ArgumentError.assert(this.authSafe.content, "authSafe.content", OctetString$1);
          const authSafeContent = this.authSafe.content.getValue();
          this.parsedValue.authenticatedSafe = AuthenticatedSafe.fromBER(authSafeContent);
          if (parameters.checkIntegrity) {
            if (!this.macData) {
              throw new Error('Absent "macData" value, can not check PKCS#12 data integrity');
            }
            const hashAlgorithm = crypto2.getAlgorithmByOID(this.macData.mac.digestAlgorithm.algorithmId, true, "digestAlgorithm");
            const result = await crypto2.verifyDataStampedWithPassword({
              password: parameters.password,
              hashAlgorithm: hashAlgorithm.name,
              salt: BufferSourceConverter.toArrayBuffer(this.macData.macSalt.valueBlock.valueHexView),
              iterationCount: this.macData.iterations || 1,
              contentToVerify: authSafeContent,
              signatureToVerify: BufferSourceConverter.toArrayBuffer(this.macData.mac.digest.valueBlock.valueHexView)
            });
            if (!result) {
              throw new Error("Integrity for the PKCS#12 data is broken!");
            }
          }
        }
        break;
      case ContentInfo.SIGNED_DATA:
        {
          this.parsedValue.integrityMode = 1;
          const cmsSigned = new SignedData({ schema: this.authSafe.content });
          const eContent = cmsSigned.encapContentInfo.eContent;
          ParameterError.assert(eContent, "eContent", "cmsSigned.encapContentInfo");
          ArgumentError.assert(eContent, "eContent", OctetString$1);
          const data = eContent.getValue();
          this.parsedValue.authenticatedSafe = AuthenticatedSafe.fromBER(data);
          const ok = await cmsSigned.verify({ signer: 0, checkChain: false }, crypto2);
          if (!ok) {
            throw new Error("Integrity for the PKCS#12 data is broken!");
          }
        }
        break;
      default:
        throw new Error('Incorrect value for "this.authSafe.contentType": '.concat(this.authSafe.contentType));
    }
  }
}
PFX.CLASS_NAME = "PFX";
const STATUS$1 = "status";
const STATUS_STRINGS = "statusStrings";
const FAIL_INFO = "failInfo";
const CLEAR_PROPS$2 = [
  STATUS$1,
  STATUS_STRINGS,
  FAIL_INFO
];
var PKIStatus;
(function(PKIStatus2) {
  PKIStatus2[PKIStatus2["granted"] = 0] = "granted";
  PKIStatus2[PKIStatus2["grantedWithMods"] = 1] = "grantedWithMods";
  PKIStatus2[PKIStatus2["rejection"] = 2] = "rejection";
  PKIStatus2[PKIStatus2["waiting"] = 3] = "waiting";
  PKIStatus2[PKIStatus2["revocationWarning"] = 4] = "revocationWarning";
  PKIStatus2[PKIStatus2["revocationNotification"] = 5] = "revocationNotification";
})(PKIStatus || (PKIStatus = {}));
class PKIStatusInfo extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.status = getParametersValue(parameters, STATUS$1, PKIStatusInfo.defaultValues(STATUS$1));
    if (STATUS_STRINGS in parameters) {
      this.statusStrings = getParametersValue(parameters, STATUS_STRINGS, PKIStatusInfo.defaultValues(STATUS_STRINGS));
    }
    if (FAIL_INFO in parameters) {
      this.failInfo = getParametersValue(parameters, FAIL_INFO, PKIStatusInfo.defaultValues(FAIL_INFO));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case STATUS$1:
        return 2;
      case STATUS_STRINGS:
        return [];
      case FAIL_INFO:
        return new BitString$1();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case STATUS$1:
        return memberValue === PKIStatusInfo.defaultValues(memberName);
      case STATUS_STRINGS:
        return memberValue.length === 0;
      case FAIL_INFO:
        return memberValue.isEqual(PKIStatusInfo.defaultValues(memberName));
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || EMPTY_STRING,
      value: [
        new Integer({ name: names.status || EMPTY_STRING }),
        new Sequence({
          optional: true,
          value: [
            new Repeated({
              name: names.statusStrings || EMPTY_STRING,
              value: new Utf8String()
            })
          ]
        }),
        new BitString$1({
          name: names.failInfo || EMPTY_STRING,
          optional: true
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$2);
    const asn1 = compareSchema(schema, schema, PKIStatusInfo.schema({
      names: {
        status: STATUS$1,
        statusStrings: STATUS_STRINGS,
        failInfo: FAIL_INFO
      }
    }));
    AsnError.assertSchema(asn1, this.className);
    const _status = asn1.result.status;
    if (_status.valueBlock.isHexOnly === true || _status.valueBlock.valueDec < 0 || _status.valueBlock.valueDec > 5)
      throw new Error('PKIStatusInfo "status" has invalid value');
    this.status = _status.valueBlock.valueDec;
    if (STATUS_STRINGS in asn1.result)
      this.statusStrings = asn1.result.statusStrings;
    if (FAIL_INFO in asn1.result)
      this.failInfo = asn1.result.failInfo;
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new Integer({ value: this.status }));
    if (this.statusStrings) {
      outputArray.push(new Sequence({
        optional: true,
        value: this.statusStrings
      }));
    }
    if (this.failInfo) {
      outputArray.push(this.failInfo);
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      status: this.status
    };
    if (this.statusStrings) {
      res.statusStrings = Array.from(this.statusStrings, (o2) => o2.toJSON());
    }
    if (this.failInfo) {
      res.failInfo = this.failInfo.toJSON();
    }
    return res;
  }
}
PKIStatusInfo.CLASS_NAME = "PKIStatusInfo";
const VERSION = "version";
const MESSAGE_IMPRINT = "messageImprint";
const REQ_POLICY = "reqPolicy";
const NONCE = "nonce";
const CERT_REQ = "certReq";
const EXTENSIONS = "extensions";
const TIME_STAMP_REQ = "TimeStampReq";
const TIME_STAMP_REQ_VERSION = "".concat(TIME_STAMP_REQ, ".").concat(VERSION);
const TIME_STAMP_REQ_MESSAGE_IMPRINT = "".concat(TIME_STAMP_REQ, ".").concat(MESSAGE_IMPRINT);
const TIME_STAMP_REQ_POLICY = "".concat(TIME_STAMP_REQ, ".").concat(REQ_POLICY);
const TIME_STAMP_REQ_NONCE = "".concat(TIME_STAMP_REQ, ".").concat(NONCE);
const TIME_STAMP_REQ_CERT_REQ = "".concat(TIME_STAMP_REQ, ".").concat(CERT_REQ);
const TIME_STAMP_REQ_EXTENSIONS = "".concat(TIME_STAMP_REQ, ".").concat(EXTENSIONS);
const CLEAR_PROPS$1 = [
  TIME_STAMP_REQ_VERSION,
  TIME_STAMP_REQ_MESSAGE_IMPRINT,
  TIME_STAMP_REQ_POLICY,
  TIME_STAMP_REQ_NONCE,
  TIME_STAMP_REQ_CERT_REQ,
  TIME_STAMP_REQ_EXTENSIONS
];
class TimeStampReq extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.version = getParametersValue(parameters, VERSION, TimeStampReq.defaultValues(VERSION));
    this.messageImprint = getParametersValue(parameters, MESSAGE_IMPRINT, TimeStampReq.defaultValues(MESSAGE_IMPRINT));
    if (REQ_POLICY in parameters) {
      this.reqPolicy = getParametersValue(parameters, REQ_POLICY, TimeStampReq.defaultValues(REQ_POLICY));
    }
    if (NONCE in parameters) {
      this.nonce = getParametersValue(parameters, NONCE, TimeStampReq.defaultValues(NONCE));
    }
    if (CERT_REQ in parameters) {
      this.certReq = getParametersValue(parameters, CERT_REQ, TimeStampReq.defaultValues(CERT_REQ));
    }
    if (EXTENSIONS in parameters) {
      this.extensions = getParametersValue(parameters, EXTENSIONS, TimeStampReq.defaultValues(EXTENSIONS));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case VERSION:
        return 0;
      case MESSAGE_IMPRINT:
        return new MessageImprint();
      case REQ_POLICY:
        return EMPTY_STRING;
      case NONCE:
        return new Integer();
      case CERT_REQ:
        return false;
      case EXTENSIONS:
        return [];
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case VERSION:
      case REQ_POLICY:
      case CERT_REQ:
        return memberValue === TimeStampReq.defaultValues(memberName);
      case MESSAGE_IMPRINT:
        return MessageImprint.compareWithDefault("hashAlgorithm", memberValue.hashAlgorithm) && MessageImprint.compareWithDefault("hashedMessage", memberValue.hashedMessage);
      case NONCE:
        return memberValue.isEqual(TimeStampReq.defaultValues(memberName));
      case EXTENSIONS:
        return memberValue.length === 0;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || TIME_STAMP_REQ,
      value: [
        new Integer({ name: names.version || TIME_STAMP_REQ_VERSION }),
        MessageImprint.schema(names.messageImprint || {
          names: {
            blockName: TIME_STAMP_REQ_MESSAGE_IMPRINT
          }
        }),
        new ObjectIdentifier({
          name: names.reqPolicy || TIME_STAMP_REQ_POLICY,
          optional: true
        }),
        new Integer({
          name: names.nonce || TIME_STAMP_REQ_NONCE,
          optional: true
        }),
        new Boolean$1({
          name: names.certReq || TIME_STAMP_REQ_CERT_REQ,
          optional: true
        }),
        new Constructed({
          optional: true,
          idBlock: {
            tagClass: 3,
            tagNumber: 0
          },
          value: [new Repeated({
            name: names.extensions || TIME_STAMP_REQ_EXTENSIONS,
            value: Extension.schema()
          })]
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS$1);
    const asn1 = compareSchema(schema, schema, TimeStampReq.schema());
    AsnError.assertSchema(asn1, this.className);
    this.version = asn1.result[TIME_STAMP_REQ_VERSION].valueBlock.valueDec;
    this.messageImprint = new MessageImprint({ schema: asn1.result[TIME_STAMP_REQ_MESSAGE_IMPRINT] });
    if (TIME_STAMP_REQ_POLICY in asn1.result)
      this.reqPolicy = asn1.result[TIME_STAMP_REQ_POLICY].valueBlock.toString();
    if (TIME_STAMP_REQ_NONCE in asn1.result)
      this.nonce = asn1.result[TIME_STAMP_REQ_NONCE];
    if (TIME_STAMP_REQ_CERT_REQ in asn1.result)
      this.certReq = asn1.result[TIME_STAMP_REQ_CERT_REQ].valueBlock.value;
    if (TIME_STAMP_REQ_EXTENSIONS in asn1.result)
      this.extensions = Array.from(asn1.result[TIME_STAMP_REQ_EXTENSIONS], (element) => new Extension({ schema: element }));
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(new Integer({ value: this.version }));
    outputArray.push(this.messageImprint.toSchema());
    if (this.reqPolicy)
      outputArray.push(new ObjectIdentifier({ value: this.reqPolicy }));
    if (this.nonce)
      outputArray.push(this.nonce);
    if (CERT_REQ in this && TimeStampReq.compareWithDefault(CERT_REQ, this.certReq) === false)
      outputArray.push(new Boolean$1({ value: this.certReq }));
    if (this.extensions) {
      outputArray.push(new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
        },
        value: Array.from(this.extensions, (o2) => o2.toSchema())
      }));
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      version: this.version,
      messageImprint: this.messageImprint.toJSON()
    };
    if (this.reqPolicy !== void 0)
      res.reqPolicy = this.reqPolicy;
    if (this.nonce !== void 0)
      res.nonce = this.nonce.toJSON();
    if (this.certReq !== void 0 && TimeStampReq.compareWithDefault(CERT_REQ, this.certReq) === false)
      res.certReq = this.certReq;
    if (this.extensions) {
      res.extensions = Array.from(this.extensions, (o2) => o2.toJSON());
    }
    return res;
  }
}
TimeStampReq.CLASS_NAME = "TimeStampReq";
const STATUS = "status";
const TIME_STAMP_TOKEN = "timeStampToken";
const TIME_STAMP_RESP = "TimeStampResp";
const TIME_STAMP_RESP_STATUS = "".concat(TIME_STAMP_RESP, ".").concat(STATUS);
const TIME_STAMP_RESP_TOKEN = "".concat(TIME_STAMP_RESP, ".").concat(TIME_STAMP_TOKEN);
const CLEAR_PROPS = [
  TIME_STAMP_RESP_STATUS,
  TIME_STAMP_RESP_TOKEN
];
class TimeStampResp extends PkiObject {
  constructor(parameters = {}) {
    super();
    this.status = getParametersValue(parameters, STATUS, TimeStampResp.defaultValues(STATUS));
    if (TIME_STAMP_TOKEN in parameters) {
      this.timeStampToken = getParametersValue(parameters, TIME_STAMP_TOKEN, TimeStampResp.defaultValues(TIME_STAMP_TOKEN));
    }
    if (parameters.schema) {
      this.fromSchema(parameters.schema);
    }
  }
  static defaultValues(memberName) {
    switch (memberName) {
      case STATUS:
        return new PKIStatusInfo();
      case TIME_STAMP_TOKEN:
        return new ContentInfo();
      default:
        return super.defaultValues(memberName);
    }
  }
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case STATUS:
        return PKIStatusInfo.compareWithDefault(STATUS, memberValue.status) && "statusStrings" in memberValue === false && "failInfo" in memberValue === false;
      case TIME_STAMP_TOKEN:
        return memberValue.contentType === EMPTY_STRING && memberValue.content instanceof Any;
      default:
        return super.defaultValues(memberName);
    }
  }
  static schema(parameters = {}) {
    const names = getParametersValue(parameters, "names", {});
    return new Sequence({
      name: names.blockName || TIME_STAMP_RESP,
      value: [
        PKIStatusInfo.schema(names.status || {
          names: {
            blockName: TIME_STAMP_RESP_STATUS
          }
        }),
        ContentInfo.schema(names.timeStampToken || {
          names: {
            blockName: TIME_STAMP_RESP_TOKEN,
            optional: true
          }
        })
      ]
    });
  }
  fromSchema(schema) {
    clearProps(schema, CLEAR_PROPS);
    const asn1 = compareSchema(schema, schema, TimeStampResp.schema());
    AsnError.assertSchema(asn1, this.className);
    this.status = new PKIStatusInfo({ schema: asn1.result[TIME_STAMP_RESP_STATUS] });
    if (TIME_STAMP_RESP_TOKEN in asn1.result)
      this.timeStampToken = new ContentInfo({ schema: asn1.result[TIME_STAMP_RESP_TOKEN] });
  }
  toSchema() {
    const outputArray = [];
    outputArray.push(this.status.toSchema());
    if (this.timeStampToken) {
      outputArray.push(this.timeStampToken.toSchema());
    }
    return new Sequence({
      value: outputArray
    });
  }
  toJSON() {
    const res = {
      status: this.status.toJSON()
    };
    if (this.timeStampToken) {
      res.timeStampToken = this.timeStampToken.toJSON();
    }
    return res;
  }
  async sign(privateKey, hashAlgorithm, crypto2 = getCrypto(true)) {
    this.assertContentType();
    const signed = new SignedData({ schema: this.timeStampToken.content });
    return signed.sign(privateKey, 0, hashAlgorithm, void 0, crypto2);
  }
  async verify(verificationParameters = { signer: 0, trustedCerts: [], data: EMPTY_BUFFER }, crypto2 = getCrypto(true)) {
    this.assertContentType();
    const signed = new SignedData({ schema: this.timeStampToken.content });
    return signed.verify(verificationParameters, crypto2);
  }
  assertContentType() {
    if (!this.timeStampToken) {
      throw new Error("timeStampToken is absent in TSP response");
    }
    if (this.timeStampToken.contentType !== id_ContentType_SignedData) {
      throw new Error("Wrong format of timeStampToken: ".concat(this.timeStampToken.contentType));
    }
  }
}
TimeStampResp.CLASS_NAME = "TimeStampResp";
function initCryptoEngine() {
  if (typeof self !== "undefined") {
    if ("crypto" in self) {
      let engineName = "webcrypto";
      if ("webkitSubtle" in self.crypto) {
        engineName = "safari";
      }
      setEngine(engineName, new CryptoEngine({ name: engineName, crypto }));
    }
  } else if (typeof crypto !== "undefined" && "webcrypto" in crypto) {
    const name = "NodeJS ^15";
    const nodeCrypto = crypto.webcrypto;
    setEngine(name, new CryptoEngine({ name, crypto: nodeCrypto }));
  }
}
initCryptoEngine();
function bufferToString(buffer) {
  return String.fromCharCode(...buffer);
}
function stringToBuffer(str) {
  return Uint8Array.from(str, (c2) => c2.charCodeAt(0));
}
function bufferToHex(buffer) {
  return Array.from(buffer).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function base64ToBuffer(base64Str) {
  return stringToBuffer(atob(base64Str));
}
function pemToBuffer(pem) {
  const pemContents = pem.replace(/-----BEGIN ((PRIVATE KEY)|(PUBLIC KEY)|(CERTIFICATE))-----/, "").replace(/-----END ((PRIVATE KEY)|(PUBLIC KEY)|(CERTIFICATE))-----/, "").replace(/\n/g, "");
  return base64ToBuffer(pemContents);
}
var __defProp$1 = Object.defineProperty;
var __defProps2 = Object.defineProperties;
var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp$1.call(b2, prop))
      __defNormalProp$1(a2, prop, b2[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b2)) {
      if (__propIsEnum$1.call(b2, prop))
        __defNormalProp$1(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps2 = (a2, b2) => __defProps2(a2, __getOwnPropDescs2(b2));
async function decryptWithAES(content, key, options = {}) {
  return await self.crypto.subtle.decrypt(
    __spreadValues$1({ name: "AES-GCM" }, options),
    key,
    content
  );
}
async function decryptWithRSA(content, key) {
  return await self.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    key,
    content
  );
}
async function loadAESPrivateKey(key) {
  return await self.crypto.subtle.importKey(
    "raw",
    key,
    {
      name: "AES-GCM",
      length: 128
    },
    true,
    ["decrypt", "encrypt"]
  );
}
async function loadServerPublicKey(key) {
  return await self.crypto.subtle.importKey(
    "spki",
    key,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
      // TODO: get from server?
    },
    true,
    ["verify"]
  );
}
async function loadRSAPrivateKey(key) {
  return await self.crypto.subtle.importKey(
    "pkcs8",
    key,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["decrypt"]
  );
}
async function exportAESKey(key) {
  return new Uint8Array(await self.crypto.subtle.exportKey("raw", key));
}
async function sha256Hash(buffer) {
  const hashBuffer = await self.crypto.subtle.digest("SHA-256", buffer);
  return bufferToHex(new Uint8Array(hashBuffer));
}
async function validateCertificateSignature(certificate, publicKey) {
  const cert = new X509Certificate(certificate);
  return cert.verify({ publicKey }, getPatchedCrypto());
}
function getPatchedCrypto() {
  return __spreadProps2(__spreadValues$1({}, self.crypto), {
    subtle: __spreadProps2(__spreadValues$1({}, self.crypto.subtle), {
      async verify(algorithm, key, signature, data) {
        return self.crypto.subtle.verify(algorithm, key, new Uint8Array(signature), new Uint8Array(data));
      }
    })
  });
}
async function validateCMSSignature(signedData, cmsBuffer, users) {
  const cmsContent = ContentInfo.fromBER(cmsBuffer);
  const originalSignedData = new SignedData({ schema: cmsContent.content });
  const signerInfo = originalSignedData.signerInfos[0];
  const signerUserId = signerInfo.sid.issuer.typesAndValues.find(
    ({ type }) => type === "2.5.4.3"
    /** Common name OID */
  ).value.valueBlock.value;
  const signer = users.find(({ userId }) => userId === signerUserId);
  if (signer === void 0) {
    throw new Error("Signer not found in the users array");
  }
  const signerCertificate = Certificate.fromBER(pemToBuffer(signer.certificate));
  const verificationResult = await originalSignedData.verify(
    {
      signer: 0,
      trustedCerts: [signerCertificate],
      data: signedData,
      checkChain: true
    },
    getPatchedCryptoEngine()
  );
  return verificationResult;
}
class CustomCryptoEngine extends CryptoEngine {
  verify(algorithm, key, signature, data) {
    return super.verify(algorithm, key, signature, new Uint8Array(data));
  }
}
function getPatchedCryptoEngine() {
  return new CustomCryptoEngine({ crypto: self.crypto });
}
var __defProp2 = Object.defineProperty;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp2.call(b2, prop))
      __defNormalProp2(a2, prop, b2[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b2)) {
      if (__propIsEnum2.call(b2, prop))
        __defNormalProp2(a2, prop, b2[prop]);
    }
  return a2;
};
async function decryptPrivateKey(privateKeyInfo, mnemonic) {
  logger.debug("Decrypting private key", { privateKeyInfo, mnemonic });
  const mnemonicPrivateKeys = await Promise.all([
    await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt, { hash: "SHA-256", iterations: 6e5 }),
    await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt, { hash: "SHA-1", iterations: 1024 }),
    await mnemonicToPrivateKey(mnemonic, privateKeyInfo.salt, { hash: "SHA-1", iterations: 6e5 })
  ]);
  for (const mnemonicPrivateKey of mnemonicPrivateKeys) {
    try {
      const rawPrivateKey = await decryptWithAES(
        privateKeyInfo.encryptedPrivateKey,
        mnemonicPrivateKey,
        { iv: privateKeyInfo.iv, tagLength: 128 }
      );
      const pemKey = atob(bufferToString(new Uint8Array(rawPrivateKey)));
      return loadRSAPrivateKey(pemToBuffer(pemKey));
    } catch (e2) {
    }
  }
  throw new Error("Failed to decrypt private key");
}
async function mnemonicToPrivateKey(mnemonic, salt, params) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(mnemonic.replaceAll(" ", "")),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return await crypto.subtle.deriveKey(
    __spreadValues2({
      name: "PBKDF2",
      salt
    }, params),
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt", "encrypt"]
  );
}
const API_ROOT = "apps/end_to_end_encryption/api/v2";
const Url = {
  PrivateKey: API_ROOT + "/private-key",
  Metadata: API_ROOT + "/meta-data/{fileId}",
  ServerKey: API_ROOT + "/server-key"
};
async function getPrivateKey() {
  const response = await cancelableClient.get(
    v$1(Url.PrivateKey),
    { headers: { "X-E2EE-SUPPORTED": "true" } }
  );
  const encryptedPrivateKeyInfo = response.data.ocs.data["private-key"];
  const [encryptedPrivateKey, iv, salt] = encryptedPrivateKeyInfo.split("|");
  return {
    encryptedPrivateKey: base64ToBuffer(encryptedPrivateKey),
    iv: base64ToBuffer(iv),
    salt: base64ToBuffer(salt)
  };
}
async function getServerPublicKey() {
  const response = await cancelableClient.get(
    v$1(Url.ServerKey),
    { headers: { "X-E2EE-SUPPORTED": "true" } }
  );
  return await loadServerPublicKey(pemToBuffer(response.data.ocs.data["public-key"]));
}
const _sfc_main$5 = {
  name: "AlertCircleOutlineIcon",
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
  var _vm = this, _c2 = _vm._self._c;
  return _c2("span", _vm._b({ staticClass: "material-design-icon alert-circle-outline-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c2("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c2("path", { attrs: { "d": "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" } }, [_vm.title ? _c2("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$5 = [];
var __component__$5 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$5,
  _sfc_render$5,
  _sfc_staticRenderFns$5,
  false,
  null,
  null
);
const AlertCircle = __component__$5.exports;
const _sfc_main$4 = {
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
var _sfc_render$4 = function render2() {
  var _vm = this, _c2 = _vm._self._c;
  return _c2("span", _vm._b({ staticClass: "material-design-icon check-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c2("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c2("path", { attrs: { "d": "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" } }, [_vm.title ? _c2("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  null
);
const Check = __component__$4.exports;
const _sfc_main$3 = {
  name: "NcInputField",
  components: {
    NcButton,
    AlertCircle,
    Check
  },
  inheritAttrs: false,
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    /**
     * Removed in v9 - use `modelValue` (`v-model`) instead
     * @deprecated
     */
    value: {
      type: [String, Number],
      default: void 0
    },
    /**
     * The value of the input field
     * If type is 'number' and a number is passed as value than the type of `update:modelValue` will also be 'number'
     */
    modelValue: {
      type: [String, Number],
      default: void 0
    },
    /**
     * The type of the input element
     */
    type: {
      type: String,
      default: "text",
      validator: (value) => [
        "text",
        "password",
        "email",
        "tel",
        "url",
        "search",
        "number"
      ].includes(value)
    },
    /**
     * The input label, always provide one for accessibility purposes.
     * This will also be used as a placeholder unless the placeholder
     * prop is populated with a different string.
     *
     * Note: If the background color is not `--color-main-background` consider using an external label instead (see `labelOutside`).
     */
    label: {
      type: String,
      default: void 0
    },
    /**
     * Pass in true if you want to use an external label. This is useful
     * if you need a label that looks different from the one provided by
     * this component
     */
    labelOutside: {
      type: Boolean,
      default: false
    },
    /**
     * The placeholder of the input. This defaults as the string that's
     * passed into the label prop. In order to remove the placeholder,
     * pass in an empty string.
     */
    placeholder: {
      type: String,
      default: void 0
    },
    /**
     * Controls whether to display the trailing button.
     */
    showTrailingButton: {
      type: Boolean,
      default: false
    },
    /**
     * Label of the trailing button
     *
     * Required when showTrailingButton is set
     */
    trailingButtonLabel: {
      type: String,
      default: ""
    },
    /**
     * Toggles the success state of the component. Adds a checkmark icon.
     * this cannot be used together with canClear.
     */
    success: {
      type: Boolean,
      default: false
    },
    /**
     * Toggles the error state of the component. Adds an error icon.
     * this cannot be used together with canClear.
     */
    error: {
      type: Boolean,
      default: false
    },
    /**
     * Additional helper text message
     *
     * This will be displayed beneath the input field. In case the field is
     * also marked as having an error, the text will be displayed in red.
     */
    helperText: {
      type: String,
      default: ""
    },
    /**
     * Disable the input field
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Specifies whether the input should have a pill form.
     * By default, input has rounded corners.
     */
    pill: {
      type: Boolean,
      default: false
    },
    /**
     * Class to add to the input field.
     * Necessary to use NcInputField in the NcActionInput component.
     */
    inputClass: {
      type: [Object, String],
      default: ""
    }
  },
  emits: [
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    "update:value",
    "update:modelValue",
    /** Same as update:modelValue for Vue 2 compatibility */
    "update:model-value",
    "trailing-button-click"
  ],
  setup() {
    const model = useModelMigration("value", "update:value", true);
    return {
      model
    };
  },
  computed: {
    computedId() {
      return this.$attrs.id && this.$attrs.id !== "" ? this.$attrs.id : this.inputName;
    },
    inputName() {
      return "input" + GenRandomId();
    },
    hasLeadingIcon() {
      return this.$slots.default;
    },
    hasTrailingIcon() {
      return this.success;
    },
    hasPlaceholder() {
      return this.placeholder !== "" && this.placeholder !== void 0;
    },
    computedPlaceholder() {
      return this.hasPlaceholder ? this.placeholder : this.label;
    },
    isValidLabel() {
      const isValidLabel = this.label || this.labelOutside;
      if (!isValidLabel) {
        console.warn("You need to add a label to the NcInputField component. Either use the prop label or use an external one, as per the example in the documentation.");
      }
      return isValidLabel;
    },
    ariaDescribedby() {
      const ariaDescribedby = [];
      if (this.helperText.length > 0) {
        ariaDescribedby.push("".concat(this.inputName, "-helper-text"));
      }
      if (this.$attrs["aria-describedby"]) {
        ariaDescribedby.push(this.$attrs["aria-describedby"]);
      }
      return ariaDescribedby.join(" ") || null;
    }
  },
  methods: {
    /**
     * Focus the input element
     *
     * @public
     */
    focus() {
      this.$refs.input.focus();
    },
    /**
     * Select all the text in the input
     *
     * @public
     */
    select() {
      this.$refs.input.select();
    },
    handleInput(event) {
      const newValue = this.type === "number" && typeof this.model === "number" ? parseFloat(event.target.value, 10) : event.target.value;
      this.model = newValue;
    },
    handleTrailingButtonClick(event) {
      this.$emit("trailing-button-click", event);
    }
  }
};
var _sfc_render$3 = function render3() {
  var _a3;
  var _vm = this, _c2 = _vm._self._c;
  return _c2("div", { staticClass: "input-field", class: {
    "input-field--disabled": _vm.disabled,
    "input-field--label-outside": _vm.labelOutside || !_vm.isValidLabel,
    "input-field--leading-icon": _vm.hasLeadingIcon,
    "input-field--trailing-icon": _vm.showTrailingButton || _vm.hasTrailingIcon,
    "input-field--pill": _vm.pill
  } }, [_c2("div", { staticClass: "input-field__main-wrapper" }, [_c2("input", _vm._g(_vm._b({ ref: "input", staticClass: "input-field__input", class: [
    _vm.inputClass,
    {
      "input-field__input--success": _vm.success,
      "input-field__input--error": _vm.error
    }
  ], attrs: { "id": _vm.computedId, "type": _vm.type, "disabled": _vm.disabled, "placeholder": _vm.computedPlaceholder, "aria-describedby": _vm.ariaDescribedby, "aria-live": "polite" }, domProps: { "value": (_a3 = _vm.model) == null ? void 0 : _a3.toString() }, on: { "input": _vm.handleInput } }, "input", _vm.$attrs, false), _vm.$listeners)), !_vm.labelOutside && _vm.isValidLabel ? _c2("label", { staticClass: "input-field__label", attrs: { "for": _vm.computedId } }, [_vm._v(" " + _vm._s(_vm.label) + " ")]) : _vm._e(), _c2("div", { directives: [{ name: "show", rawName: "v-show", value: _vm.hasLeadingIcon, expression: "hasLeadingIcon" }], staticClass: "input-field__icon input-field__icon--leading" }, [_vm._t("default")], 2), _vm.showTrailingButton ? _c2("NcButton", { staticClass: "input-field__trailing-button", attrs: { "type": "tertiary-no-background", "aria-label": _vm.trailingButtonLabel, "disabled": _vm.disabled }, on: { "click": _vm.handleTrailingButtonClick }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_vm._t("trailing-button-icon")];
  }, proxy: true }], null, true) }) : _vm.success || _vm.error ? _c2("div", { staticClass: "input-field__icon input-field__icon--trailing" }, [_vm.success ? _c2("Check", { staticStyle: { "color": "var(--color-success-text)" }, attrs: { "size": 20 } }) : _vm.error ? _c2("AlertCircle", { staticStyle: { "color": "var(--color-error-text)" }, attrs: { "size": 20 } }) : _vm._e()], 1) : _vm._e()], 1), _vm.helperText.length > 0 ? _c2("p", { staticClass: "input-field__helper-text-message", class: {
    "input-field__helper-text-message--error": _vm.error,
    "input-field__helper-text-message--success": _vm.success
  }, attrs: { "id": "".concat(_vm.inputName, "-helper-text") } }, [_vm.success ? _c2("Check", { staticClass: "input-field__helper-text-message__icon", attrs: { "size": 18 } }) : _vm.error ? _c2("AlertCircle", { staticClass: "input-field__helper-text-message__icon", attrs: { "size": 18 } }) : _vm._e(), _vm._v(" " + _vm._s(_vm.helperText) + " ")], 1) : _vm._e()]);
};
var _sfc_staticRenderFns$3 = [];
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  "e4fac465"
);
const NcInputField = __component__$3.exports;
const _sfc_main$1 = {
  name: "UndoVariantIcon",
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
var _sfc_render$1 = function render4() {
  var _vm = this, _c2 = _vm._self._c;
  return _c2("span", _vm._b({ staticClass: "material-design-icon undo-variant-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c2("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c2("path", { attrs: { "d": "M13.5,7A6.5,6.5 0 0,1 20,13.5A6.5,6.5 0 0,1 13.5,20H10V18H13.5C16,18 18,16 18,13.5C18,11 16,9 13.5,9H7.83L10.91,12.09L9.5,13.5L4,8L9.5,2.5L10.92,3.91L7.83,7H13.5M6,18H8V20H6V18Z" } }, [_vm.title ? _c2("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$1 = [];
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  null
);
const Undo = __component__$1.exports;
register(t17, t48);
const NcInputFieldProps = new Set(Object.keys(NcInputField.props));
const _sfc_main$2 = {
  name: "NcTextField",
  components: {
    NcInputField,
    Close,
    ArrowRight,
    Undo
  },
  // Allow forwarding all attributes
  inheritAttrs: false,
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: __spreadProps(__spreadValues({
    /**
     * Any [NcInputField](#/Components/NcFields?id=ncinputfield) props
     */
    // Not an actual prop but needed to show in vue-styleguidist docs
    // eslint-disable-next-line
    " ": {}
  }, NcInputField.props), {
    /**
     * The `aria-label` to set on the trailing button
     * If no explicit value is set it will default to the one matching the `trailingButtonIcon`:
     * @default 'Clear text'|'Save changes'|'Undo changes'
     */
    trailingButtonLabel: {
      type: String,
      default: ""
    },
    // Custom props
    /**
     * Specifies which material design icon should be used for the trailing
     * button.
     * @type {'close'|'arrowRight'|'undo'}
     */
    trailingButtonIcon: {
      type: String,
      default: "close",
      validator: (value) => [
        "close",
        "arrowRight",
        "undo"
      ].includes(value)
    }
  }),
  emits: [
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    "update:value",
    "update:modelValue",
    /** Same as update:modelValue for Vue 2 compatibility */
    "update:model-value"
  ],
  setup() {
    const model = useModelMigration("value", "update:value");
    return {
      model
    };
  },
  computed: {
    propsAndAttrsToForward() {
      const predefinedLabels = {
        undo: t$1("Undo changes"),
        close: t$1("Clear text"),
        arrowRight: t$1("Save changes")
      };
      return __spreadProps(__spreadValues(__spreadValues({}, this.$attrs), Object.fromEntries(
        Object.entries(this.$props).filter(([key]) => NcInputFieldProps.has(key))
      )), {
        // Adjust aria-label for predefined trailing buttons
        trailingButtonLabel: this.trailingButtonLabel || predefinedLabels[this.trailingButtonIcon]
      });
    }
  },
  methods: {
    /**
     * Focus the input element
     *
     * @public
     */
    focus() {
      this.$refs.inputField.focus();
    },
    /**
     * Select all the text in the input
     *
     * @public
     */
    select() {
      this.$refs.inputField.select();
    }
  }
};
var _sfc_render$2 = function render22() {
  var _vm = this, _c2 = _vm._self._c;
  return _c2("NcInputField", _vm._g(_vm._b({ ref: "inputField", scopedSlots: _vm._u([_vm.type !== "search" ? { key: "trailing-button-icon", fn: function() {
    return [_vm.trailingButtonIcon === "close" ? _c2("Close", { attrs: { "size": 20 } }) : _vm.trailingButtonIcon === "arrowRight" ? _c2("ArrowRight", { attrs: { "size": 20 } }) : _vm.trailingButtonIcon === "undo" ? _c2("Undo", { attrs: { "size": 20 } }) : _vm._e()];
  }, proxy: true } : null], null, true) }, "NcInputField", _vm.propsAndAttrsToForward, false), _vm.$listeners), [_vm._t("default")], 2);
};
var _sfc_staticRenderFns$2 = [];
var __component__$2 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  null
);
const NcTextField = __component__$2.exports;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MnemonicPromptDialog",
  emits: ["close"],
  setup(__props, { emit }) {
    const dialogRef = ref$1();
    const mnemonic = ref$1("");
    const confirmToggle = ref$1(false);
    const isFormValid = computed(() => confirmToggle.value === true && mnemonic.value.trim().split(/\s+/g).length === 12);
    function submit() {
      emit("close", mnemonic.value);
    }
    const buttons = computed(() => [
      {
        label: translate("end_to_en_encryption", "Submit"),
        nativeType: "submit",
        type: "primary",
        disabled: !isFormValid.value,
        callback: submit
      }
    ]);
    return { __sfc: true, emit, dialogRef, mnemonic, confirmToggle, isFormValid, submit, buttons, t: translate, NcDialog, NcTextField, NcNoteCard, NcCheckboxRadioSwitch };
  }
});
var _sfc_render = function render5() {
  var _vm = this, _c2 = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c2(_setup.NcDialog, { ref: "dialogRef", attrs: { "name": _setup.t("end_to_end_encryption", "Enter your 12 words mnemonic"), "buttons": _setup.buttons, "is-form": true }, on: { "submit": _setup.submit } }, [_c2(_setup.NcNoteCard, { attrs: { "type": "warning", "show-alert": true, "heading": _setup.t("end_to_end_encryption", "Decrypting your files in the browser can weaken security") } }, [_vm._v(" " + _vm._s(_setup.t("end_to_end_encryption", "The server could serve malicious source code to extract the secret that protects your files.")) + " "), _c2(_setup.NcCheckboxRadioSwitch, { attrs: { "required": true, "data-cy-e2ee-mnemonic-prompt": "i_understand_the_risks", "type": "switch" }, model: { value: _setup.confirmToggle, callback: function($$v) {
    _setup.confirmToggle = $$v;
  }, expression: "confirmToggle" } }, [_vm._v(" " + _vm._s(_setup.t("end_to_end_encryption", "I understand the risks")) + " ")])], 1), _c2(_setup.NcTextField, { attrs: { "value": _setup.mnemonic, "required": "true", "pattern": "^(\\w+\\s+){11}\\w+$", "label": _setup.t("end_to_end_encryption", "Mnemonic"), "autofocus": true }, on: { "update:value": function($event) {
    _setup.mnemonic = $event;
  } } })], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  null
);
__component__.options.__file = "/home/louis/workspace/nextcloud/instances/master/apps-extra/end_to_end_encryption/src/components/MnemonicPromptDialog.vue";
const MnemonicPromptDialog = __component__.exports;
async function promptUserForMnemonic() {
  const promiseWithResolvers = Promise.withResolvers();
  spawnDialog(
    MnemonicPromptDialog,
    void 0,
    (mnemonic) => {
      if (mnemonic !== void 0) {
        promiseWithResolvers.resolve(mnemonic);
      } else {
        promiseWithResolvers.reject();
      }
    }
  );
  return promiseWithResolvers.promise;
}
async function decryptMetadataInfo(metadata, metadataPrivateKey) {
  logger.debug("Decrypting metadata info", { metadata });
  const [encryptedMetadata, iv] = metadata.metadata.ciphertext.split("|");
  const compressedMetadataInfo = await decryptWithAES(
    base64ToBuffer(encryptedMetadata),
    metadataPrivateKey,
    { iv: base64ToBuffer(iv) }
  );
  const metadataInfo = JSON.parse(await unzipBuffer(compressedMetadataInfo));
  validateKeyChecksums(metadataInfo, metadata);
  await validateMetadataKeyChecksum(metadataInfo, metadataPrivateKey);
  return metadataInfo;
}
function validateKeyChecksums(metadataInfo, metadata) {
  var _a3, _b;
  if (((_a3 = metadataInfo.keyChecksums) == null ? void 0 : _a3.length) !== ((_b = metadata.users) == null ? void 0 : _b.length)) {
    throw new Error("Key checksums length does not match users length");
  }
}
async function validateMetadataKeyChecksum(metadataInfo, metadataPrivateKey) {
  if (metadataInfo.keyChecksums === void 0) {
    return;
  }
  const privateKeyBuffer = await exportAESKey(metadataPrivateKey);
  const privateKeyHash = await sha256Hash(privateKeyBuffer);
  if (!metadataInfo.keyChecksums.includes(privateKeyHash)) {
    throw new Error("Key checksum is not in keyChecksums");
  }
}
async function unzipBuffer(buffer) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer));
      controller.close();
    }
  });
  const decompressedStream = stream.pipeThrough(new DecompressionStream("gzip"));
  return await new Response(decompressedStream).text();
}
async function getMetadataPrivateKey(metadata, userId, privateKey) {
  var _a3;
  logger.debug("Getting metadata private key", { metadata, userId });
  const userInfo = (_a3 = metadata.users) == null ? void 0 : _a3.find((user) => user.userId === userId);
  if (!userInfo) {
    throw new Error("User not found in metadata");
  }
  const encryptedMetadataPrivateKey = base64ToBuffer(userInfo.encryptedMetadataKey);
  const rawMetadataPrivateKey = await decryptWithRSA(encryptedMetadataPrivateKey, privateKey);
  return await loadAESPrivateKey(new Uint8Array(rawMetadataPrivateKey));
}
async function validateMetadataSignature(metadata, signature, rootMetadata) {
  const signedData = JSON.stringify(metadata, (key, value) => {
    if (key === "filedrop") {
      return void 0;
    }
    return value;
  });
  const verificationResult = await validateCMSSignature(
    stringToBuffer(btoa(signedData)),
    base64ToBuffer(signature),
    rootMetadata.users
  );
  if (!verificationResult) {
    throw new Error("Metadata signature verification failed");
  }
  return verificationResult;
}
async function validateUserCertificates(metadata, serverPublicKey) {
  const verifications = metadata.users.map(async ({ userId, certificate }) => {
    const result = await validateCertificateSignature(certificate, serverPublicKey);
    if (!result) {
      throw new Error("Certificate verification failed for user ".concat(userId));
    }
    return result;
  });
  return await Promise.all(verifications);
}
const davClient = getClient();
const state = {
  _userPrivateKey: void 0,
  _serverPublicKey: void 0,
  _metadataCache: {},
  async getUserPrivateKey() {
    var _a3;
    (_a3 = this._userPrivateKey) != null ? _a3 : this._userPrivateKey = await decryptPrivateKey(await getPrivateKey(), await promptUserForMnemonic());
    return this._userPrivateKey;
  },
  async getServerPublicKey() {
    var _a3;
    (_a3 = this._serverPublicKey) != null ? _a3 : this._serverPublicKey = await getServerPublicKey();
    return this._serverPublicKey;
  },
  async getMetadata(path) {
    if (this._metadataCache[path]) {
      logger.debug("Found metadata in cache", { path, state });
      return this._metadataCache[path];
    }
    logger.debug("Fetching PROPFIND for metadata", { path, state });
    await davClient.stat(decodeURI(path).replace("remote.php/dav/", ""), { details: true, data: getDefaultPropfind() });
    if (this._metadataCache[path]) {
      logger.debug("Found metadata in cache after PROPFIND", { path, state });
      return this._metadataCache[path];
    }
    throw new Error("Could not find metadata for ".concat(path));
  },
  async setMetadata(path, rawMetadata, metadataSignature) {
    const metadata = JSON.parse(rawMetadata);
    if (isRootMetadata(metadata)) {
      await validateMetadataSignature(metadata, metadataSignature, metadata);
      await validateUserCertificates(metadata, await this.getServerPublicKey());
    } else {
      await validateMetadataSignature(metadata, metadataSignature, await this.getRootMetadata(pathBrowserify.dirname(path)));
    }
    this._metadataCache[path] = metadata;
    logger.debug("Added metadata in cache", { path, state });
  },
  async getMetadataInfo(path) {
    const metadata = await this.getMetadata(path);
    const rootMetadata = await this.getRootMetadata(path);
    const currentUser = getCurrentUser();
    if (currentUser === null) {
      throw new Error("No user logged in");
    }
    return decryptMetadataInfo(
      metadata,
      await getMetadataPrivateKey(rootMetadata, currentUser.uid, await state.getUserPrivateKey())
    );
  },
  async getRootMetadata(path) {
    const cachedRootMetadata = Object.entries(state._metadataCache).filter(([metadataPath]) => path.startsWith(metadataPath)).map(([, metadata]) => metadata).find((metadata) => isRootMetadata(metadata));
    if (cachedRootMetadata) {
      logger.debug("Found root metadata in cache", { path, state });
      return cachedRootMetadata;
    }
    logger.debug("Looking for root metadata", { path, state });
    while (path !== "/") {
      const metadata = await state.getMetadata(path);
      if (isRootMetadata(metadata)) {
        logger.debug("Fetched root metadata", { path, state });
        return metadata;
      }
      path = pathBrowserify.dirname(path);
    }
    throw new Error("Found no root metadata for ".concat(path));
  }
};
let originalFetch;
function setupWebDavDecryptionProxy() {
  originalFetch = window.fetch;
  logger.debug("Setting up WebDAV decryption proxy");
  window.fetch = async (input, config = {}) => {
    let request = new Request(input, config);
    if (!(request.url.includes("/remote.php/dav/files/") && (request.method === "GET" || request.method === "PROPFIND"))) {
      return originalFetch(request);
    }
    logger.debug("Proxying ".concat(request.method, " ").concat(request.url), { request });
    const headers = new Headers(request.headers);
    headers.set("X-E2EE-SUPPORTED", "true");
    request = new Request(request, { headers });
    switch (request.method) {
      case "PROPFIND":
        return handlePropFind(request);
      case "GET":
      default:
        return handleGet(request);
    }
  };
}
async function handleGet(request) {
  const path = new URL(request.url).pathname;
  const responsePromise = originalFetch(request);
  try {
    const metadataInfo = await state.getMetadataInfo(pathBrowserify.dirname(path));
    const fileInfo = metadataInfo.files[pathBrowserify.basename(request.url)];
    if (fileInfo === void 0) {
      logger.debug("Could not find file in metadata", { path, metadataInfo });
      throw new Error("Could not find file in metadata");
    }
    logger.debug("Fetching encrypted file", { request });
    return await decryptFile(await responsePromise, fileInfo);
  } catch (error) {
    return await responsePromise;
  }
}
async function handlePropFind(request) {
  var _a3;
  logger.debug("Fetching raw PROPFIND", { request });
  const response = await originalFetch(request);
  const path = new URL(request.url).pathname;
  const body = await response.text();
  const xml = await ln(body);
  const stat = cn(xml, path, true);
  if (((_a3 = stat.props) == null ? void 0 : _a3["e2ee-is-encrypted"]) !== 1) {
    logger.debug("Node is not e2ee", { xml });
    return new Response(body, response);
  }
  if (stat.type === "directory") {
    const rawMetadata = stat.props["e2ee-metadata"];
    const metadataSignature = stat.props["e2ee-metadata-signature"];
    if (rawMetadata !== void 0 && metadataSignature !== void 0) {
      await state.setMetadata(
        path,
        rawMetadata,
        metadataSignature
      );
    }
    const metadata = await state.getMetadata(path);
    const metadataInfo = await state.getMetadataInfo(path);
    if (isRootMetadata(metadata)) {
      replacePlaceholdersInPropfind(xml, path, metadataInfo);
    } else {
      const parentMetadataInfo = await state.getMetadataInfo(pathBrowserify.dirname(path));
      replacePlaceholdersInPropfind(xml, path, metadataInfo, parentMetadataInfo);
    }
  } else if (stat.type === "file") {
    const parentMetadataInfo = await state.getMetadataInfo(pathBrowserify.dirname(path));
    if (parentMetadataInfo === void 0) {
      logger.debug("Cannot find metadata for parent folder", { path });
      return new Response(body, response);
    }
    replacePlaceholdersInPropfind(xml, path, void 0, parentMetadataInfo);
  }
  return new Response(new fxp.XMLBuilder().build(xml), response);
}
function replacePlaceholdersInPropfind(xml, path, decryptedMetadata, decryptedParentMetadata) {
  logger.debug("Updating PROPFIND info", { path, decryptedMetadata, decryptedParentMetadata, xml });
  xml.multistatus.response.forEach((childNode) => {
    if (childNode.propstat === void 0) {
      return;
    }
    const relevantMetadataInfo = childNode.href === path ? decryptedParentMetadata : decryptedMetadata;
    if (relevantMetadataInfo === void 0) {
      return;
    }
    const identifier = childNode.propstat.prop.displayname;
    let name = identifier;
    if (relevantMetadataInfo.files[identifier]) {
      name = relevantMetadataInfo.files[identifier].filename;
      childNode.propstat.prop.getcontenttype = relevantMetadataInfo.files[identifier].mimetype;
    } else if (relevantMetadataInfo.folders[identifier]) {
      name = relevantMetadataInfo.folders[identifier];
      childNode.propstat.prop.getcontenttype = "httpd/unix-directory";
    }
    childNode.propstat.prop.displayname = name;
    childNode.propstat.prop.permissions = childNode.propstat.prop.permissions.replace(/(R)|(D)|(N)|(V)|(W)|(CK)/g, "");
  });
}
async function decryptFile(response, fileEncryptionInfo) {
  const decryptedFileContent = await decryptWithAES(
    new Uint8Array(await response.arrayBuffer()),
    await loadAESPrivateKey(base64ToBuffer(fileEncryptionInfo.key)),
    { iv: base64ToBuffer(fileEncryptionInfo.nonce) }
  );
  return new Response(decryptedFileContent, response);
}
const ArrowDownSvg = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-arrow-down" viewBox="0 0 24 24"><path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" /></svg>';
/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
function isDownloadable(node) {
  if ((node.permissions & Permission.READ) === 0) {
    return false;
  }
  if (node.attributes["share-attributes"]) {
    const shareAttributes = JSON.parse(node.attributes["share-attributes"] || "[]");
    const downloadAttribute = shareAttributes.find(({ scope, key }) => scope === "permissions" && key === "download");
    if (downloadAttribute !== void 0) {
      return downloadAttribute.value === true;
    }
  }
  return true;
}
async function downloadNodes([file]) {
  const response = await fetch(file.encodedSource);
  const decryptedFileContent = await response.arrayBuffer();
  const blob = new Blob([decryptedFileContent], { type: file.mime });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = file.displayname;
  link.click();
}
const downloadUnencryptedAction = new FileAction({
  id: "download_unencrypted",
  default: DefaultType.DEFAULT,
  displayName: () => translate("files", "Download unencrypted"),
  iconSvgInline: () => ArrowDownSvg,
  enabled(nodes) {
    if (nodes.length !== 1) {
      return false;
    }
    if (nodes.some((node) => node.attributes["e2ee-is-encrypted"] === 1)) {
      return false;
    }
    if (nodes.some((node) => !node.isDavRessource)) {
      return false;
    }
    if (nodes.some((node) => node.type !== FileType.File)) {
      return false;
    }
    return nodes.every(isDownloadable);
  },
  async exec(node) {
    downloadNodes([node]);
    return null;
  },
  order: 30
});
const userConfig = loadState("end_to_end_encryption", "userConfig", { e2eeInBrowserEnabled: false });
if (userConfig.e2eeInBrowserEnabled) {
  setupWebDavDecryptionProxy();
  registerDavProperty("nc:e2ee-metadata", { nc: "http://nextcloud.org/ns" });
  registerDavProperty("nc:e2ee-metadata-signature", { nc: "http://nextcloud.org/ns" });
  registerFileAction(downloadUnencryptedAction);
  disableFileAction("download");
  disableFileAction("move-copy");
}
function disableFileAction(actionId) {
  logger.debug("Disabling file action", { actionId });
  const actions = getFileActions();
  const action = actions.find((action2) => action2.id === actionId);
  const originalEnabled = action._action.enabled;
  action._action.enabled = (nodes, view) => {
    if (nodes.some((node) => node.attributes["e2ee-is-encrypted"] === 1)) {
      return false;
    }
    return originalEnabled(nodes, view);
  };
}
//# sourceMappingURL=end_to_end_encryption-files.mjs.map
