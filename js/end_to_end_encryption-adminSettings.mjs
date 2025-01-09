(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode("/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\nbody {\n  /**\n   * Set custom vue-select CSS variables.\n   * Needs to be on the body (not :root) for theming to apply (see nextcloud/server#36462)\n   */\n  /* Search Input */\n  --vs-search-input-color: var(--color-main-text);\n  --vs-search-input-bg: var(--color-main-background);\n  --vs-search-input-placeholder-color: var(--color-text-maxcontrast);\n  /* Font */\n  --vs-font-size: var(--default-font-size);\n  --vs-line-height: var(--default-line-height);\n  /* Disabled State */\n  --vs-state-disabled-bg: var(--color-background-hover);\n  --vs-state-disabled-color: var(--color-text-maxcontrast);\n  --vs-state-disabled-controls-color: var(--color-text-maxcontrast);\n  --vs-state-disabled-cursor: not-allowed;\n  --vs-disabled-bg: var(--color-background-hover);\n  --vs-disabled-color: var(--color-text-maxcontrast);\n  --vs-disabled-cursor: not-allowed;\n  /* Borders */\n  --vs-border-color: var(--color-border-maxcontrast);\n  --vs-border-width: var(--border-width-input, 2px) !important;\n  --vs-border-style: solid;\n  --vs-border-radius: var(--border-radius-large);\n  /* Component Controls: Clear, Open Indicator */\n  --vs-controls-color: var(--color-main-text);\n  /* Selected */\n  --vs-selected-bg: var(--color-background-hover);\n  --vs-selected-color: var(--color-main-text);\n  --vs-selected-border-color: var(--vs-border-color);\n  --vs-selected-border-style: var(--vs-border-style);\n  --vs-selected-border-width: var(--vs-border-width);\n  /* Dropdown */\n  --vs-dropdown-bg: var(--color-main-background);\n  --vs-dropdown-color: var(--color-main-text);\n  --vs-dropdown-z-index: 9999;\n  --vs-dropdown-box-shadow: 0px 2px 2px 0px var(--color-box-shadow);\n  /* Options */\n  --vs-dropdown-option-padding: 8px 20px;\n  /* Active State */\n  --vs-dropdown-option--active-bg: var(--color-background-hover);\n  --vs-dropdown-option--active-color: var(--color-main-text);\n  /* Keyboard Focus State */\n  --vs-dropdown-option--kb-focus-box-shadow: inset 0px 0px 0px 2px var(--vs-border-color);\n  /* Deselect State */\n  --vs-dropdown-option--deselect-bg: var(--color-error);\n  --vs-dropdown-option--deselect-color: #fff;\n  /* Transitions */\n  --vs-transition-duration: 0ms;\n  /* Actions */\n  --vs-actions-padding: 0 8px 0 4px;\n}\n.v-select.select {\n  /* Override default vue-select styles */\n  min-height: var(--default-clickable-area);\n  min-width: 260px;\n  margin: 0 0 var(--default-grid-baseline);\n}\n.v-select.select.vs--open {\n  --vs-border-width: var(--border-width-input-focused, 2px);\n}\n.v-select.select .select__label {\n  display: block;\n  margin-bottom: 2px;\n}\n.v-select.select .vs__selected {\n  height: calc(var(--default-clickable-area) - 2 * var(--vs-border-width) - var(--default-grid-baseline));\n  margin: calc(var(--default-grid-baseline) / 2);\n  padding-block: 0;\n  padding-inline: 12px 8px;\n  border-radius: 16px !important;\n  background: var(--color-primary-element-light);\n  border: none;\n}\n.v-select.select.vs--open .vs__selected:first-of-type {\n  margin-inline-start: calc(var(--default-grid-baseline) / 2 - (var(--border-width-input-focused, 2px) - var(--border-width-input, 2px))) !important;\n}\n.v-select.select .vs__search {\n  text-overflow: ellipsis;\n  color: var(--color-main-text);\n  min-height: unset !important;\n  height: calc(var(--default-clickable-area) - 2 * var(--vs-border-width)) !important;\n}\n.v-select.select .vs__search::placeholder {\n  color: var(--color-text-maxcontrast);\n}\n.v-select.select .vs__search, .v-select.select .vs__search:focus {\n  margin: 0;\n}\n.v-select.select .vs__dropdown-toggle {\n  position: relative;\n  max-height: 100px;\n  padding: 0;\n  overflow-y: auto;\n}\n.v-select.select .vs__actions {\n  position: sticky;\n  top: 0;\n}\n.v-select.select .vs__clear {\n  margin-right: 2px;\n}\n.v-select.select.vs--open .vs__dropdown-toggle {\n  border-width: var(--border-width-input-focused);\n  outline: 2px solid var(--color-main-background);\n  border-color: var(--color-main-text);\n  border-bottom-color: transparent;\n}\n.v-select.select:not(.vs--disabled, .vs--open) .vs__dropdown-toggle:hover {\n  outline: 2px solid var(--color-main-background);\n  border-color: var(--color-main-text);\n}\n.v-select.select.vs--disabled .vs__search,\n.v-select.select.vs--disabled .vs__selected {\n  color: var(--color-text-maxcontrast);\n}\n.v-select.select.vs--disabled .vs__clear,\n.v-select.select.vs--disabled .vs__deselect {\n  display: none;\n}\n.v-select.select--no-wrap .vs__selected-options {\n  flex-wrap: nowrap;\n  overflow: auto;\n  min-width: unset;\n}\n.v-select.select--no-wrap .vs__selected-options .vs__selected {\n  min-width: unset;\n}\n.v-select.select--drop-up.vs--open .vs__dropdown-toggle {\n  border-radius: 0 0 var(--vs-border-radius) var(--vs-border-radius);\n  border-top-color: transparent;\n  border-bottom-color: var(--color-main-text);\n}\n.v-select.select .vs__selected-options {\n  min-height: calc(var(--default-clickable-area) - 2 * var(--vs-border-width));\n  padding: 0 5px;\n}\n.v-select.select .vs__selected-options .vs__selected ~ .vs__search[readonly] {\n  position: absolute;\n}\n.v-select.select.vs--single.vs--loading .vs__selected, .v-select.select.vs--single.vs--open .vs__selected {\n  max-width: 100%;\n  opacity: 1;\n  color: var(--color-text-maxcontrast);\n}\n.v-select.select.vs--single .vs__selected-options {\n  flex-wrap: nowrap;\n}\n.v-select.select.vs--single .vs__selected {\n  background: unset !important;\n}\n.vs__dropdown-menu {\n  border-width: var(--border-width-input-focused) !important;\n  border-color: var(--color-main-text) !important;\n  outline: none !important;\n  box-shadow: -2px 0 0 var(--color-main-background), 0 2px 0 var(--color-main-background), 2px 0 0 var(--color-main-background), !important;\n  padding: 4px !important;\n}\n.vs__dropdown-menu--floating {\n  /* Fallback styles overidden by programmatically set inline styles */\n  width: max-content;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.vs__dropdown-menu--floating-placement-top {\n  border-radius: var(--vs-border-radius) var(--vs-border-radius) 0 0 !important;\n  border-top-style: var(--vs-border-style) !important;\n  border-bottom-style: none !important;\n  box-shadow: 0 -2px 0 var(--color-main-background), -2px 0 0 var(--color-main-background), 2px 0 0 var(--color-main-background), !important;\n}\n.vs__dropdown-menu .vs__dropdown-option {\n  border-radius: 6px !important;\n}\n.vs__dropdown-menu .vs__no-options {\n  color: var(--color-text-lighter) !important;\n}\n.user-select .vs__selected {\n  padding-inline: 0 5px !important;\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-f6384352] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.name-parts[data-v-f6384352] {\n  display: flex;\n  max-width: 100%;\n  cursor: inherit;\n}\n.name-parts__first[data-v-f6384352] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.name-parts__first[data-v-f6384352], .name-parts__last[data-v-f6384352] {\n  white-space: pre;\n  cursor: inherit;\n}\n.name-parts__first strong[data-v-f6384352], .name-parts__last strong[data-v-f6384352] {\n  font-weight: bold;\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-a519576f] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.mention-bubble--primary .mention-bubble__content[data-v-a519576f] {\n  color: var(--color-primary-element-text);\n  background-color: var(--color-primary-element);\n}\n.mention-bubble__wrapper[data-v-a519576f] {\n  max-width: 150px;\n  height: 18px;\n  vertical-align: text-bottom;\n  display: inline-flex;\n  align-items: center;\n}\n.mention-bubble__content[data-v-a519576f] {\n  display: inline-flex;\n  overflow: hidden;\n  align-items: center;\n  max-width: 100%;\n  height: 20px;\n  -webkit-user-select: none;\n  user-select: none;\n  padding-right: 6px;\n  padding-left: 2px;\n  border-radius: 10px;\n  background-color: var(--color-background-dark);\n}\n.mention-bubble__icon[data-v-a519576f] {\n  position: relative;\n  width: 16px;\n  height: 16px;\n  border-radius: 8px;\n  background-color: var(--color-background-darker);\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 12px;\n}\n.mention-bubble__icon--with-avatar[data-v-a519576f] {\n  color: inherit;\n  background-size: cover;\n}\n.mention-bubble__title[data-v-a519576f] {\n  overflow: hidden;\n  margin-left: 2px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.mention-bubble__title[data-v-a519576f]::before {\n  content: attr(title);\n}\n.mention-bubble__select[data-v-a519576f] {\n  position: absolute;\n  z-index: -1;\n  left: -100vw;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-a0f4d73a] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.option[data-v-a0f4d73a] {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  height: var(--height);\n  cursor: inherit;\n}\n.option__avatar[data-v-a0f4d73a] {\n  margin-right: var(--margin);\n}\n.option__details[data-v-a0f4d73a] {\n  display: flex;\n  flex: 1 1;\n  flex-direction: column;\n  justify-content: center;\n  min-width: 0;\n}\n.option__lineone[data-v-a0f4d73a] {\n  color: var(--color-main-text);\n}\n.option__linetwo[data-v-a0f4d73a] {\n  color: var(--color-text-maxcontrast);\n}\n.option__lineone[data-v-a0f4d73a], .option__linetwo[data-v-a0f4d73a] {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  line-height: 1.2;\n}\n.option__lineone strong[data-v-a0f4d73a], .option__linetwo strong[data-v-a0f4d73a] {\n  font-weight: bold;\n}\n.option--compact .option__lineone[data-v-a0f4d73a] {\n  font-size: 14px;\n}\n.option--compact .option__linetwo[data-v-a0f4d73a] {\n  font-size: 11px;\n  line-height: 1.5;\n  margin-top: -4px;\n}\n.option__icon[data-v-a0f4d73a] {\n  width: var(--default-clickable-area);\n  height: var(--default-clickable-area);\n  color: var(--color-text-maxcontrast);\n}\n.option__icon.icon[data-v-a0f4d73a] {\n  flex: 0 0 var(--default-clickable-area);\n  opacity: 0.7;\n  background-position: center;\n  background-size: 16px;\n}\n.option__details[data-v-a0f4d73a], .option__lineone[data-v-a0f4d73a], .option__linetwo[data-v-a0f4d73a], .option__icon[data-v-a0f4d73a] {\n  cursor: inherit;\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-e7e86f59] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.avatardiv[data-v-e7e86f59] {\n  position: relative;\n  display: inline-block;\n  width: var(--size);\n  height: var(--size);\n}\n.avatardiv--unknown[data-v-e7e86f59] {\n  position: relative;\n  background-color: var(--color-main-background);\n  white-space: normal;\n}\n.avatardiv[data-v-e7e86f59]:not(.avatardiv--unknown) {\n  background-color: var(--color-main-background) !important;\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05) inset;\n}\n.avatardiv--with-menu[data-v-e7e86f59] {\n  cursor: pointer;\n}\n.avatardiv--with-menu .action-item[data-v-e7e86f59] {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.avatardiv--with-menu[data-v-e7e86f59] .action-item__menutoggle {\n  cursor: pointer;\n  opacity: 0;\n}\n.avatardiv--with-menu[data-v-e7e86f59]:focus-within .action-item__menutoggle, .avatardiv--with-menu[data-v-e7e86f59]:hover .action-item__menutoggle, .avatardiv--with-menu.avatardiv--with-menu-loading[data-v-e7e86f59] .action-item__menutoggle {\n  opacity: 1;\n}\n.avatardiv--with-menu:focus-within img[data-v-e7e86f59], .avatardiv--with-menu:hover img[data-v-e7e86f59], .avatardiv--with-menu.avatardiv--with-menu-loading img[data-v-e7e86f59] {\n  opacity: 0.3;\n}\n.avatardiv--with-menu[data-v-e7e86f59] .action-item__menutoggle,\n.avatardiv--with-menu img[data-v-e7e86f59] {\n  transition: opacity var(--animation-quick);\n}\n.avatardiv--with-menu[data-v-e7e86f59]  .button-vue,\n.avatardiv--with-menu[data-v-e7e86f59]  .button-vue__icon {\n  height: var(--size);\n  min-height: var(--size);\n  width: var(--size) !important;\n  min-width: var(--size);\n}\n.avatardiv--with-menu[data-v-e7e86f59] >  .button-vue, .avatardiv--with-menu[data-v-e7e86f59] >  .action-item .button-vue {\n  --button-radius: calc(var(--size) / 2);\n}\n.avatardiv .avatardiv__initials-wrapper[data-v-e7e86f59] {\n  display: block;\n  height: var(--size);\n  width: var(--size);\n  background-color: var(--color-main-background);\n  border-radius: calc(var(--size) / 2);\n}\n.avatardiv .avatardiv__initials-wrapper .avatardiv__initials[data-v-e7e86f59] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: block;\n  width: 100%;\n  text-align: center;\n  font-weight: normal;\n}\n.avatardiv img[data-v-e7e86f59] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.avatardiv .material-design-icon[data-v-e7e86f59] {\n  width: var(--size);\n  height: var(--size);\n}\n.avatardiv .avatardiv__user-status[data-v-e7e86f59] {\n  box-sizing: border-box;\n  position: absolute;\n  right: -4px;\n  bottom: -4px;\n  min-height: 14px;\n  min-width: 14px;\n  max-height: 18px;\n  max-width: 18px;\n  height: 40%;\n  width: 40%;\n  line-height: 1;\n  font-size: clamp(var(--font-size-small, 13px), 85%, var(--default-font-size));\n  border: 2px solid var(--color-main-background);\n  background-color: var(--color-main-background);\n  background-repeat: no-repeat;\n  background-size: 16px;\n  background-position: center;\n  border-radius: 50%;\n}\n.acli:hover .avatardiv .avatardiv__user-status[data-v-e7e86f59] {\n  border-color: var(--color-background-hover);\n  background-color: var(--color-background-hover);\n}\n.acli.active .avatardiv .avatardiv__user-status[data-v-e7e86f59] {\n  border-color: var(--color-primary-element-light);\n  background-color: var(--color-primary-element-light);\n}\n.avatardiv .avatardiv__user-status--icon[data-v-e7e86f59] {\n  border: none;\n  background-color: transparent;\n}\n.avatardiv .popovermenu-wrapper[data-v-e7e86f59] {\n  position: relative;\n  display: inline-block;\n}\n.avatar-class-icon[data-v-e7e86f59] {\n  display: block;\n  border-radius: calc(var(--size) / 2);\n  background-color: var(--color-background-darker);\n  height: 100%;\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-30c015f0] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\nli.action.active[data-v-30c015f0] {\n  background-color: var(--color-background-hover);\n  border-radius: 6px;\n  padding: 0;\n}\n.action-link[data-v-30c015f0] {\n  display: flex;\n  align-items: flex-start;\n  width: 100%;\n  height: auto;\n  margin: 0;\n  padding: 0;\n  padding-right: calc((var(--default-clickable-area) - 16px) / 2);\n  box-sizing: border-box;\n  cursor: pointer;\n  white-space: nowrap;\n  color: var(--color-main-text);\n  border: 0;\n  border-radius: 0;\n  background-color: transparent;\n  box-shadow: none;\n  font-weight: normal;\n  font-size: var(--default-font-size);\n  line-height: var(--default-clickable-area);\n}\n.action-link > span[data-v-30c015f0] {\n  cursor: pointer;\n  white-space: nowrap;\n}\n.action-link__icon[data-v-30c015f0] {\n  width: var(--default-clickable-area);\n  height: var(--default-clickable-area);\n  opacity: 1;\n  background-position: calc((var(--default-clickable-area) - 16px) / 2) center;\n  background-size: 16px;\n  background-repeat: no-repeat;\n}\n.action-link[data-v-30c015f0] .material-design-icon {\n  width: var(--default-clickable-area);\n  height: var(--default-clickable-area);\n  opacity: 1;\n}\n.action-link[data-v-30c015f0] .material-design-icon .material-design-icon__svg {\n  vertical-align: middle;\n}\n.action-link__longtext-wrapper[data-v-30c015f0], .action-link__longtext[data-v-30c015f0] {\n  max-width: 220px;\n  line-height: 1.6em;\n  padding: calc((var(--default-clickable-area) - 1.6em) / 2) 0;\n  cursor: pointer;\n  text-align: start;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.action-link__longtext[data-v-30c015f0] {\n  cursor: pointer;\n  white-space: pre-wrap !important;\n}\n.action-link__name[data-v-30c015f0] {\n  font-weight: bold;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  max-width: 100%;\n  display: inline-block;\n}\n.action-link__menu-icon[data-v-30c015f0] {\n  margin-left: auto;\n  margin-right: calc((var(--default-clickable-area) - 16px) / 2 * -1);\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-579c6b4d] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\nli.action.active[data-v-579c6b4d] {\n  background-color: var(--color-background-hover);\n  border-radius: 6px;\n  padding: 0;\n}\n.action-router[data-v-579c6b4d] {\n  display: flex;\n  align-items: flex-start;\n  width: 100%;\n  height: auto;\n  margin: 0;\n  padding: 0;\n  padding-right: calc((var(--default-clickable-area) - 16px) / 2);\n  box-sizing: border-box;\n  cursor: pointer;\n  white-space: nowrap;\n  color: var(--color-main-text);\n  border: 0;\n  border-radius: 0;\n  background-color: transparent;\n  box-shadow: none;\n  font-weight: normal;\n  font-size: var(--default-font-size);\n  line-height: var(--default-clickable-area);\n}\n.action-router > span[data-v-579c6b4d] {\n  cursor: pointer;\n  white-space: nowrap;\n}\n.action-router__icon[data-v-579c6b4d] {\n  width: var(--default-clickable-area);\n  height: var(--default-clickable-area);\n  opacity: 1;\n  background-position: calc((var(--default-clickable-area) - 16px) / 2) center;\n  background-size: 16px;\n  background-repeat: no-repeat;\n}\n.action-router[data-v-579c6b4d] .material-design-icon {\n  width: var(--default-clickable-area);\n  height: var(--default-clickable-area);\n  opacity: 1;\n}\n.action-router[data-v-579c6b4d] .material-design-icon .material-design-icon__svg {\n  vertical-align: middle;\n}\n.action-router__longtext-wrapper[data-v-579c6b4d], .action-router__longtext[data-v-579c6b4d] {\n  max-width: 220px;\n  line-height: 1.6em;\n  padding: calc((var(--default-clickable-area) - 1.6em) / 2) 0;\n  cursor: pointer;\n  text-align: start;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.action-router__longtext[data-v-579c6b4d] {\n  cursor: pointer;\n  white-space: pre-wrap !important;\n}\n.action-router__name[data-v-579c6b4d] {\n  font-weight: bold;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  max-width: 100%;\n  display: inline-block;\n}\n.action-router__menu-icon[data-v-579c6b4d] {\n  margin-left: auto;\n  margin-right: calc((var(--default-clickable-area) - 16px) / 2 * -1);\n}\n.action--disabled[data-v-579c6b4d] {\n  pointer-events: none;\n  opacity: 0.5;\n}\n.action--disabled[data-v-579c6b4d]:hover, .action--disabled[data-v-579c6b4d]:focus {\n  cursor: default;\n  opacity: 0.5;\n}\n.action--disabled *[data-v-579c6b4d] {\n  opacity: 1 !important;\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-824615f4] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\nli.action.active[data-v-824615f4] {\n  background-color: var(--color-background-hover);\n  border-radius: 6px;\n  padding: 0;\n}\n.action-text[data-v-824615f4] {\n  display: flex;\n  align-items: flex-start;\n  width: 100%;\n  height: auto;\n  margin: 0;\n  padding: 0;\n  padding-right: calc((var(--default-clickable-area) - 16px) / 2);\n  box-sizing: border-box;\n  cursor: pointer;\n  white-space: nowrap;\n  color: var(--color-main-text);\n  border: 0;\n  border-radius: 0;\n  background-color: transparent;\n  box-shadow: none;\n  font-weight: normal;\n  font-size: var(--default-font-size);\n  line-height: var(--default-clickable-area);\n}\n.action-text > span[data-v-824615f4] {\n  cursor: pointer;\n  white-space: nowrap;\n}\n.action-text__icon[data-v-824615f4] {\n  width: var(--default-clickable-area);\n  height: var(--default-clickable-area);\n  opacity: 1;\n  background-position: calc((var(--default-clickable-area) - 16px) / 2) center;\n  background-size: 16px;\n  background-repeat: no-repeat;\n}\n.action-text[data-v-824615f4] .material-design-icon {\n  width: var(--default-clickable-area);\n  height: var(--default-clickable-area);\n  opacity: 1;\n}\n.action-text[data-v-824615f4] .material-design-icon .material-design-icon__svg {\n  vertical-align: middle;\n}\n.action-text__longtext-wrapper[data-v-824615f4], .action-text__longtext[data-v-824615f4] {\n  max-width: 220px;\n  line-height: 1.6em;\n  padding: calc((var(--default-clickable-area) - 1.6em) / 2) 0;\n  cursor: pointer;\n  text-align: start;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.action-text__longtext[data-v-824615f4] {\n  cursor: pointer;\n  white-space: pre-wrap !important;\n}\n.action-text__name[data-v-824615f4] {\n  font-weight: bold;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  max-width: 100%;\n  display: inline-block;\n}\n.action-text__menu-icon[data-v-824615f4] {\n  margin-left: auto;\n  margin-right: calc((var(--default-clickable-area) - 16px) / 2 * -1);\n}\n.action--disabled[data-v-824615f4] {\n  pointer-events: none;\n  opacity: 0.5;\n}\n.action--disabled[data-v-824615f4]:hover, .action--disabled[data-v-824615f4]:focus {\n  cursor: default;\n  opacity: 0.5;\n}\n.action--disabled *[data-v-824615f4] {\n  opacity: 1 !important;\n}\n.action-text[data-v-824615f4],\n.action-text span[data-v-824615f4] {\n  cursor: default;\n}/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-0555d8d0] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.user-status-icon[data-v-0555d8d0] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-width: 16px;\n  min-height: 16px;\n  max-width: 20px;\n  max-height: 20px;\n}\n.user-status-icon--invisible[data-v-0555d8d0] {\n  filter: var(--background-invert-if-dark);\n}:host,:root{--vs-colors--lightest:rgba(60,60,60,0.26);--vs-colors--light:rgba(60,60,60,0.5);--vs-colors--dark:#333;--vs-colors--darkest:rgba(0,0,0,0.15);--vs-search-input-color:inherit;--vs-search-input-bg:#fff;--vs-search-input-placeholder-color:inherit;--vs-font-size:1rem;--vs-line-height:1.4;--vs-state-disabled-bg:#f8f8f8;--vs-state-disabled-color:var(--vs-colors--light);--vs-state-disabled-controls-color:var(--vs-colors--light);--vs-state-disabled-cursor:not-allowed;--vs-border-color:var(--vs-colors--lightest);--vs-border-width:1px;--vs-border-style:solid;--vs-border-radius:4px;--vs-actions-padding:4px 6px 0 3px;--vs-controls-color:var(--vs-colors--light);--vs-controls-size:1;--vs-controls--deselect-text-shadow:0 1px 0 #fff;--vs-selected-bg:#f0f0f0;--vs-selected-color:var(--vs-colors--dark);--vs-selected-border-color:var(--vs-border-color);--vs-selected-border-style:var(--vs-border-style);--vs-selected-border-width:var(--vs-border-width);--vs-dropdown-bg:#fff;--vs-dropdown-color:inherit;--vs-dropdown-z-index:1000;--vs-dropdown-min-width:160px;--vs-dropdown-max-height:350px;--vs-dropdown-box-shadow:0px 3px 6px 0px var(--vs-colors--darkest);--vs-dropdown-option-bg:#000;--vs-dropdown-option-color:var(--vs-dropdown-color);--vs-dropdown-option-padding:3px 20px;--vs-dropdown-option--active-bg:#136cfb;--vs-dropdown-option--active-color:#fff;--vs-dropdown-option--kb-focus-box-shadow:inset 0px 0px 0px 2px #949494;--vs-dropdown-option--deselect-bg:#fb5858;--vs-dropdown-option--deselect-color:#fff;--vs-transition-timing-function:cubic-bezier(1,-0.115,0.975,0.855);--vs-transition-duration:150ms}.v-select{font-family:inherit;position:relative}.v-select,.v-select *{box-sizing:border-box}:root{--vs-transition-timing-function:cubic-bezier(1,0.5,0.8,1);--vs-transition-duration:0.15s}@-webkit-keyframes vSelectSpinner{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes vSelectSpinner{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.vs__fade-enter-active,.vs__fade-leave-active{pointer-events:none;transition:opacity var(--vs-transition-duration) var(--vs-transition-timing-function)}.vs__fade-enter,.vs__fade-leave-to{opacity:0}:root{--vs-disabled-bg:var(--vs-state-disabled-bg);--vs-disabled-color:var(--vs-state-disabled-color);--vs-disabled-cursor:var(--vs-state-disabled-cursor)}.vs--disabled .vs__clear,.vs--disabled .vs__dropdown-toggle,.vs--disabled .vs__open-indicator,.vs--disabled .vs__open-indicator-button,.vs--disabled .vs__search,.vs--disabled .vs__selected{background-color:var(--vs-disabled-bg);cursor:var(--vs-disabled-cursor)}.v-select[dir=rtl] .vs__actions{padding:0 3px 0 6px}.v-select[dir=rtl] .vs__clear{margin-left:6px;margin-right:0}.v-select[dir=rtl] .vs__deselect{margin-left:0;margin-right:2px}.v-select[dir=rtl] .vs__dropdown-menu{text-align:right}.vs__dropdown-toggle{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--vs-search-input-bg);border:var(--vs-border-width) var(--vs-border-style) var(--vs-border-color);border-radius:var(--vs-border-radius);display:flex;padding:0 0 4px;white-space:normal}.vs__selected-options{display:flex;flex-basis:100%;flex-grow:1;flex-wrap:wrap;min-width:0;padding:0 2px;position:relative}.vs__actions{align-items:center;display:flex;padding:var(--vs-actions-padding)}.vs--searchable .vs__dropdown-toggle{cursor:text}.vs--unsearchable .vs__dropdown-toggle{cursor:pointer}.vs--open .vs__dropdown-toggle{border-bottom-color:transparent;border-bottom-left-radius:0;border-bottom-right-radius:0}.vs__open-indicator-button{background-color:transparent;border:0;cursor:pointer;padding:0}.vs__open-indicator{fill:var(--vs-controls-color);transform:scale(var(--vs-controls-size));transition:transform var(--vs-transition-duration) var(--vs-transition-timing-function);transition-timing-function:var(--vs-transition-timing-function)}.vs--open .vs__open-indicator{transform:rotate(180deg) scale(var(--vs-controls-size))}.vs--loading .vs__open-indicator{opacity:0}.vs__clear{fill:var(--vs-controls-color);background-color:transparent;border:0;cursor:pointer;margin-right:8px;padding:0}.vs__dropdown-menu{background:var(--vs-dropdown-bg);border:var(--vs-border-width) var(--vs-border-style) var(--vs-border-color);border-radius:0 0 var(--vs-border-radius) var(--vs-border-radius);border-top-style:none;box-shadow:var(--vs-dropdown-box-shadow);box-sizing:border-box;color:var(--vs-dropdown-color);display:block;left:0;list-style:none;margin:0;max-height:var(--vs-dropdown-max-height);min-width:var(--vs-dropdown-min-width);overflow-y:auto;padding:5px 0;position:absolute;text-align:left;top:calc(100% - var(--vs-border-width));width:100%;z-index:var(--vs-dropdown-z-index)}.vs__no-options{text-align:center}.vs__dropdown-option{clear:both;color:var(--vs-dropdown-option-color);cursor:pointer;display:block;line-height:1.42857143;padding:var(--vs-dropdown-option-padding);white-space:nowrap}.vs__dropdown-option--highlight{background:var(--vs-dropdown-option--active-bg);color:var(--vs-dropdown-option--active-color)}.vs__dropdown-option--kb-focus{box-shadow:var(--vs-dropdown-option--kb-focus-box-shadow)}.vs__dropdown-option--deselect{background:var(--vs-dropdown-option--deselect-bg);color:var(--vs-dropdown-option--deselect-color)}.vs__dropdown-option--disabled{background:var(--vs-state-disabled-bg);color:var(--vs-state-disabled-color);cursor:var(--vs-state-disabled-cursor)}.vs__selected{align-items:center;background-color:var(--vs-selected-bg);border:var(--vs-selected-border-width) var(--vs-selected-border-style) var(--vs-selected-border-color);border-radius:var(--vs-border-radius);color:var(--vs-selected-color);display:flex;line-height:var(--vs-line-height);margin:4px 2px 0;min-width:0;padding:0 .25em;z-index:0}.vs__deselect{fill:var(--vs-controls-color);-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:0;cursor:pointer;display:inline-flex;margin-left:4px;padding:0;text-shadow:var(--vs-controls--deselect-text-shadow)}.vs--single .vs__selected{background-color:transparent;border-color:transparent}.vs--single.vs--loading .vs__selected,.vs--single.vs--open .vs__selected{max-width:100%;opacity:.4;position:absolute}.vs--single.vs--searching .vs__selected{display:none}.vs__search::-webkit-search-cancel-button{display:none}.vs__search::-ms-clear,.vs__search::-webkit-search-decoration,.vs__search::-webkit-search-results-button,.vs__search::-webkit-search-results-decoration{display:none}.vs__search,.vs__search:focus{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:1px solid transparent;border-left:none;box-shadow:none;color:var(--vs-search-input-color);flex-grow:1;font-size:var(--vs-font-size);line-height:var(--vs-line-height);margin:4px 0 0;max-width:100%;outline:none;padding:0 7px;width:0;z-index:1}.vs__search::-moz-placeholder{color:var(--vs-search-input-placeholder-color)}.vs__search:-ms-input-placeholder{color:var(--vs-search-input-placeholder-color)}.vs__search::placeholder{color:var(--vs-search-input-placeholder-color)}.vs--unsearchable .vs__search{opacity:1}.vs--unsearchable:not(.vs--disabled) .vs__search{cursor:pointer}.vs--single.vs--searching:not(.vs--open):not(.vs--loading) .vs__search{opacity:.2}.vs__spinner{align-self:center;-webkit-animation:vSelectSpinner 1.1s linear infinite;animation:vSelectSpinner 1.1s linear infinite;border:.9em solid hsla(0,0%,39%,.1);border-left-color:rgba(60,60,60,.45);font-size:5px;opacity:0;overflow:hidden;text-indent:-9999em;transform:translateZ(0) scale(var(--vs-controls--spinner-size,var(--vs-controls-size)));transition:opacity .1s}.vs__spinner,.vs__spinner:after{border-radius:50%;height:5em;transform:scale(var(--vs-controls--spinner-size,var(--vs-controls-size)));width:5em}.vs--loading .vs__spinner{opacity:1}\n\n/*# sourceMappingURL=vue-select.css.map*/.admin-e2ee__headline[data-v-03024419] {\n  margin-block: 0.5em 1em;\n}\n.admin-e2ee__group-select[data-v-03024419] {\n  max-width: 300px;\n}\n.admin-e2ee__save-button[data-v-03024419] {\n  margin-block-start: 1em;\n}"));
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const appName = "end_to_end_encryption";
const appVersion = "1.17.0-beta.2";
import { l as loadState, E as commonjsGlobal, n as normalizeComponent, r as register, F as t11, H as t49, t as t$1, d as cancelableClient, v, I as t3, J as getDefaultExportFromCjs, _, i as ref$1, K as readonly, L as w, M as f, V as Vue, O as unref, P as toRef$1, Q as customRef, R as getCurrentScope, S as onScopeDispose, T as watch, j as computed, W as getBuilder_1, X as t10, b as getCurrentUser, Y as DotsHorizontal, Z as NcActions, N as NcButton, $ as NcIconSvgWrapper, B as NcLoadingIcon, a0 as subscribe, a1 as unsubscribe, C as Close, G as GenRandomId, a2 as t16, a as getLoggerBuilder, x as showSuccess, s as normalizeComponent$1, k as translate, z as translatePlural } from "./_plugin-vue2_normalizer-BdKAaywK.chunk.mjs";
import "./useIsMobile-BmkGobDA.chunk.mjs";
import { u as useModelMigration } from "./useModelMigration-EhAWvqDD-BpHklyZH.chunk.mjs";
import { N as NcSettingsSection } from "./NcSettingsSection-B7SqDXbX-81sIi28k.chunk.mjs";
function e() {
  try {
    return loadState("core", "capabilities");
  } catch (e2) {
    return console.debug("Could not find capabilities initial state fall back to _oc_capabilities"), "_oc_capabilities" in window ? window._oc_capabilities : {};
  }
}
var vueSelect = { exports: {} };
(function(module, exports) {
  !function(e2, t2) {
    module.exports = t2();
  }("undefined" != typeof self ? self : commonjsGlobal, function() {
    return (() => {
      var e2 = { 646: (e3) => {
        e3.exports = function(e4) {
          if (Array.isArray(e4)) {
            for (var t4 = 0, n2 = new Array(e4.length); t4 < e4.length; t4++) n2[t4] = e4[t4];
            return n2;
          }
        };
      }, 713: (e3) => {
        e3.exports = function(e4, t4, n2) {
          return t4 in e4 ? Object.defineProperty(e4, t4, { value: n2, enumerable: true, configurable: true, writable: true }) : e4[t4] = n2, e4;
        };
      }, 860: (e3) => {
        e3.exports = function(e4) {
          if (Symbol.iterator in Object(e4) || "[object Arguments]" === Object.prototype.toString.call(e4)) return Array.from(e4);
        };
      }, 206: (e3) => {
        e3.exports = function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance");
        };
      }, 319: (e3, t4, n2) => {
        var o2 = n2(646), i = n2(860), s = n2(206);
        e3.exports = function(e4) {
          return o2(e4) || i(e4) || s();
        };
      }, 8: (e3) => {
        function t4(n2) {
          return "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? e3.exports = t4 = function(e4) {
            return typeof e4;
          } : e3.exports = t4 = function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, t4(n2);
        }
        e3.exports = t4;
      } }, t2 = {};
      function n(o2) {
        var i = t2[o2];
        if (void 0 !== i) return i.exports;
        var s = t2[o2] = { exports: {} };
        return e2[o2](s, s.exports, n), s.exports;
      }
      n.n = (e3) => {
        var t4 = e3 && e3.__esModule ? () => e3.default : () => e3;
        return n.d(t4, { a: t4 }), t4;
      }, n.d = (e3, t4) => {
        for (var o2 in t4) n.o(t4, o2) && !n.o(e3, o2) && Object.defineProperty(e3, o2, { enumerable: true, get: t4[o2] });
      }, n.o = (e3, t4) => Object.prototype.hasOwnProperty.call(e3, t4), n.r = (e3) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e3, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e3, "__esModule", { value: true });
      };
      var o = {};
      return (() => {
        n.r(o), n.d(o, { VueSelect: () => m, default: () => _2, mixins: () => O });
        var e3 = n(319), t4 = n.n(e3), i = n(8), s = n.n(i), r = n(713), a = n.n(r);
        const l = { props: { autoscroll: { type: Boolean, default: true } }, watch: { typeAheadPointer: function() {
          this.autoscroll && this.maybeAdjustScroll();
        }, open: function(e4) {
          var t5 = this;
          this.autoscroll && e4 && this.$nextTick(function() {
            return t5.maybeAdjustScroll();
          });
        } }, methods: { maybeAdjustScroll: function() {
          var e4, t5 = (null === (e4 = this.$refs.dropdownMenu) || void 0 === e4 ? void 0 : e4.children[this.typeAheadPointer]) || false;
          if (t5) {
            var n2 = this.getDropdownViewport(), o2 = t5.getBoundingClientRect(), i2 = o2.top, s2 = o2.bottom, r2 = o2.height;
            if (i2 < n2.top) return this.$refs.dropdownMenu.scrollTop = t5.offsetTop;
            if (s2 > n2.bottom) return this.$refs.dropdownMenu.scrollTop = t5.offsetTop - (n2.height - r2);
          }
        }, getDropdownViewport: function() {
          return this.$refs.dropdownMenu ? this.$refs.dropdownMenu.getBoundingClientRect() : { height: 0, top: 0, bottom: 0 };
        } } }, c = { data: function() {
          return { typeAheadPointer: -1 };
        }, watch: { filteredOptions: function() {
          if (this.resetFocusOnOptionsChange) {
            for (var e4 = 0; e4 < this.filteredOptions.length; e4++) if (this.selectable(this.filteredOptions[e4])) {
              this.typeAheadPointer = e4;
              break;
            }
          }
        }, open: function(e4) {
          e4 && this.typeAheadToLastSelected();
        }, selectedValue: function() {
          this.open && this.typeAheadToLastSelected();
        } }, methods: { typeAheadUp: function() {
          for (var e4 = this.typeAheadPointer - 1; e4 >= 0; e4--) if (this.selectable(this.filteredOptions[e4])) {
            this.typeAheadPointer = e4;
            break;
          }
        }, typeAheadDown: function() {
          for (var e4 = this.typeAheadPointer + 1; e4 < this.filteredOptions.length; e4++) if (this.selectable(this.filteredOptions[e4])) {
            this.typeAheadPointer = e4;
            break;
          }
        }, typeAheadSelect: function() {
          var e4 = this.filteredOptions[this.typeAheadPointer];
          e4 && this.selectable(e4) && this.select(e4);
        }, typeAheadToLastSelected: function() {
          var e4 = 0 !== this.selectedValue.length ? this.filteredOptions.indexOf(this.selectedValue[this.selectedValue.length - 1]) : -1;
          -1 !== e4 && (this.typeAheadPointer = e4);
        } } }, u = { props: { loading: { type: Boolean, default: false } }, data: function() {
          return { mutableLoading: false };
        }, watch: { search: function() {
          this.$emit("search", this.search, this.toggleLoading);
        }, loading: function(e4) {
          this.mutableLoading = e4;
        } }, methods: { toggleLoading: function() {
          var e4 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
          return this.mutableLoading = null == e4 ? !this.mutableLoading : e4;
        } } };
        function p(e4, t5, n2, o2, i2, s2, r2, a2) {
          var l2, c2 = "function" == typeof e4 ? e4.options : e4;
          if (t5 && (c2.render = t5, c2.staticRenderFns = n2, c2._compiled = true), l2) ;
          return { exports: e4, options: c2 };
        }
        const d = { Deselect: p({}, function() {
          var e4 = this.$createElement, t5 = this._self._c || e4;
          return t5("svg", { attrs: { xmlns: "http://www.w3.org/2000/svg", width: "10", height: "10" } }, [t5("path", { attrs: { d: "M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z" } })]);
        }, []).exports, OpenIndicator: p({}, function() {
          var e4 = this.$createElement, t5 = this._self._c || e4;
          return t5("svg", { attrs: { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "10" } }, [t5("path", { attrs: { d: "M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z" } })]);
        }, []).exports }, h = { inserted: function(e4, t5, n2) {
          var o2 = n2.context;
          if (o2.appendToBody) {
            document.body.appendChild(e4);
            var i2 = o2.$refs.toggle.getBoundingClientRect(), s2 = i2.height, r2 = i2.top, a2 = i2.left, l2 = i2.width, c2 = window.scrollX || window.pageXOffset, u2 = window.scrollY || window.pageYOffset;
            e4.unbindPosition = o2.calculatePosition(e4, o2, { width: l2 + "px", left: c2 + a2 + "px", top: u2 + r2 + s2 + "px" });
          }
        }, unbind: function(e4, t5, n2) {
          n2.context.appendToBody && (e4.unbindPosition && "function" == typeof e4.unbindPosition && e4.unbindPosition(), e4.parentNode && e4.parentNode.removeChild(e4));
        } };
        const f2 = function(e4) {
          var t5 = {};
          return Object.keys(e4).sort().forEach(function(n2) {
            t5[n2] = e4[n2];
          }), JSON.stringify(t5);
        };
        var y = 0;
        const b = function() {
          return ++y;
        };
        function g(e4, t5) {
          var n2 = Object.keys(e4);
          if (Object.getOwnPropertySymbols) {
            var o2 = Object.getOwnPropertySymbols(e4);
            t5 && (o2 = o2.filter(function(t6) {
              return Object.getOwnPropertyDescriptor(e4, t6).enumerable;
            })), n2.push.apply(n2, o2);
          }
          return n2;
        }
        function v2(e4) {
          for (var t5 = 1; t5 < arguments.length; t5++) {
            var n2 = null != arguments[t5] ? arguments[t5] : {};
            t5 % 2 ? g(Object(n2), true).forEach(function(t6) {
              a()(e4, t6, n2[t6]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(n2)) : g(Object(n2)).forEach(function(t6) {
              Object.defineProperty(e4, t6, Object.getOwnPropertyDescriptor(n2, t6));
            });
          }
          return e4;
        }
        const m = p({ components: v2({}, d), directives: { appendToBody: h }, mixins: [l, c, u], props: { value: {}, components: { type: Object, default: function() {
          return {};
        } }, options: { type: Array, default: function() {
          return [];
        } }, limit: { type: Number, default: null }, disabled: { type: Boolean, default: false }, clearable: { type: Boolean, default: true }, deselectFromDropdown: { type: Boolean, default: false }, searchable: { type: Boolean, default: true }, multiple: { type: Boolean, default: false }, placeholder: { type: String, default: "" }, transition: { type: String, default: "vs__fade" }, clearSearchOnSelect: { type: Boolean, default: true }, closeOnSelect: { type: Boolean, default: true }, label: { type: String, default: "label" }, ariaLabelCombobox: { type: String, default: "Search for options" }, ariaLabelListbox: { type: String, default: "Options" }, ariaLabelClearSelected: { type: String, default: "Clear selected" }, ariaLabelDeselectOption: { type: Function, default: function(e4) {
          return "Deselect ".concat(e4);
        } }, autocomplete: { type: String, default: "off" }, reduce: { type: Function, default: function(e4) {
          return e4;
        } }, selectable: { type: Function, default: function(e4) {
          return true;
        } }, getOptionLabel: { type: Function, default: function(e4) {
          return "object" === s()(e4) ? e4.hasOwnProperty(this.label) ? e4[this.label] : console.warn('[vue-select warn]: Label key "option.'.concat(this.label, '" does not') + " exist in options object ".concat(JSON.stringify(e4), ".\n") + "https://vue-select.org/api/props.html#getoptionlabel") : e4;
        } }, getOptionKey: { type: Function, default: function(e4) {
          if ("object" !== s()(e4)) return e4;
          try {
            return e4.hasOwnProperty("id") ? e4.id : f2(e4);
          } catch (t5) {
            return console.warn("[vue-select warn]: Could not stringify this option to generate unique key. Please provide'getOptionKey' prop to return a unique key for each option.\nhttps://vue-select.org/api/props.html#getoptionkey", e4, t5);
          }
        } }, onTab: { type: Function, default: function() {
          this.selectOnTab && !this.isComposing && this.typeAheadSelect();
        } }, taggable: { type: Boolean, default: false }, tabindex: { type: Number, default: null }, pushTags: { type: Boolean, default: false }, filterable: { type: Boolean, default: true }, filterBy: { type: Function, default: function(e4, t5, n2) {
          return (t5 || "").toLocaleLowerCase().indexOf(n2.toLocaleLowerCase()) > -1;
        } }, filter: { type: Function, default: function(e4, t5) {
          var n2 = this;
          return e4.filter(function(e5) {
            var o2 = n2.getOptionLabel(e5);
            return "number" == typeof o2 && (o2 = o2.toString()), n2.filterBy(e5, o2, t5);
          });
        } }, createOption: { type: Function, default: function(e4) {
          return "object" === s()(this.optionList[0]) ? a()({}, this.label, e4) : e4;
        } }, resetFocusOnOptionsChange: { type: Boolean, default: true }, resetOnOptionsChange: { default: false, validator: function(e4) {
          return ["function", "boolean"].includes(s()(e4));
        } }, clearSearchOnBlur: { type: Function, default: function(e4) {
          var t5 = e4.clearSearchOnSelect, n2 = e4.multiple;
          return t5 && !n2;
        } }, noDrop: { type: Boolean, default: false }, inputId: { type: String }, dir: { type: String, default: "auto" }, selectOnTab: { type: Boolean, default: false }, selectOnKeyCodes: { type: Array, default: function() {
          return [13];
        } }, searchInputQuerySelector: { type: String, default: "[type=search]" }, mapKeydown: { type: Function, default: function(e4, t5) {
          return e4;
        } }, appendToBody: { type: Boolean, default: false }, calculatePosition: { type: Function, default: function(e4, t5, n2) {
          var o2 = n2.width, i2 = n2.top, s2 = n2.left;
          e4.style.top = i2, e4.style.left = s2, e4.style.width = o2;
        } }, dropdownShouldOpen: { type: Function, default: function(e4) {
          var t5 = e4.noDrop, n2 = e4.open, o2 = e4.mutableLoading;
          return !t5 && (n2 && !o2);
        } }, keyboardFocusBorder: { type: Boolean, default: false }, uid: { type: [String, Number], default: function() {
          return b();
        } } }, data: function() {
          return { search: "", open: false, isComposing: false, isKeyboardNavigation: false, pushedTags: [], _value: [] };
        }, computed: { isTrackingValues: function() {
          return void 0 === this.value || this.$options.propsData.hasOwnProperty("reduce");
        }, selectedValue: function() {
          var e4 = this.value;
          return this.isTrackingValues && (e4 = this.$data._value), null != e4 && "" !== e4 ? [].concat(e4) : [];
        }, optionList: function() {
          return this.options.concat(this.pushTags ? this.pushedTags : []);
        }, searchEl: function() {
          return this.$scopedSlots.search ? this.$refs.selectedOptions.querySelector(this.searchInputQuerySelector) : this.$refs.search;
        }, scope: function() {
          var e4 = this, t5 = { search: this.search, loading: this.loading, searching: this.searching, filteredOptions: this.filteredOptions };
          return { search: { attributes: v2({ id: this.inputId, disabled: this.disabled, placeholder: this.searchPlaceholder, tabindex: this.tabindex, readonly: !this.searchable, role: "combobox", "aria-autocomplete": "list", "aria-label": this.ariaLabelCombobox, "aria-controls": "vs-".concat(this.uid, "__listbox"), "aria-owns": "vs-".concat(this.uid, "__listbox"), "aria-expanded": this.dropdownOpen.toString(), ref: "search", type: "search", autocomplete: this.autocomplete, value: this.search }, this.dropdownOpen && this.filteredOptions[this.typeAheadPointer] ? { "aria-activedescendant": "vs-".concat(this.uid, "__option-").concat(this.typeAheadPointer) } : {}), events: { compositionstart: function() {
            return e4.isComposing = true;
          }, compositionend: function() {
            return e4.isComposing = false;
          }, keydown: this.onSearchKeyDown, keypress: this.onSearchKeyPress, blur: this.onSearchBlur, focus: this.onSearchFocus, input: function(t6) {
            return e4.search = t6.target.value;
          } } }, spinner: { loading: this.mutableLoading }, noOptions: { search: this.search, loading: this.mutableLoading, searching: this.searching }, openIndicator: { attributes: { ref: "openIndicator", role: "presentation", class: "vs__open-indicator" } }, listHeader: t5, listFooter: t5, header: v2({}, t5, { deselect: this.deselect }), footer: v2({}, t5, { deselect: this.deselect }) };
        }, childComponents: function() {
          return v2({}, d, {}, this.components);
        }, stateClasses: function() {
          return { "vs--open": this.dropdownOpen, "vs--single": !this.multiple, "vs--multiple": this.multiple, "vs--searching": this.searching && !this.noDrop, "vs--searchable": this.searchable && !this.noDrop, "vs--unsearchable": !this.searchable, "vs--loading": this.mutableLoading, "vs--disabled": this.disabled };
        }, searching: function() {
          return !!this.search;
        }, dropdownOpen: function() {
          return this.dropdownShouldOpen(this);
        }, searchPlaceholder: function() {
          return this.isValueEmpty && this.placeholder ? this.placeholder : void 0;
        }, filteredOptions: function() {
          var e4 = this, t5 = function(t6) {
            return null !== e4.limit ? t6.slice(0, e4.limit) : t6;
          }, n2 = [].concat(this.optionList);
          if (!this.filterable && !this.taggable) return t5(n2);
          var o2 = this.search.length ? this.filter(n2, this.search, this) : n2;
          if (this.taggable && this.search.length) {
            var i2 = this.createOption(this.search);
            this.optionExists(i2) || o2.unshift(i2);
          }
          return t5(o2);
        }, isValueEmpty: function() {
          return 0 === this.selectedValue.length;
        }, showClearButton: function() {
          return !this.multiple && this.clearable && !this.open && !this.isValueEmpty;
        } }, watch: { options: function(e4, t5) {
          var n2 = this;
          !this.taggable && ("function" == typeof n2.resetOnOptionsChange ? n2.resetOnOptionsChange(e4, t5, n2.selectedValue) : n2.resetOnOptionsChange) && this.clearSelection(), this.value && this.isTrackingValues && this.setInternalValueFromOptions(this.value);
        }, value: { immediate: true, handler: function(e4) {
          this.isTrackingValues && this.setInternalValueFromOptions(e4);
        } }, multiple: function() {
          this.clearSelection();
        }, open: function(e4) {
          this.$emit(e4 ? "open" : "close");
        }, search: function(e4) {
          e4.length && (this.open = true);
        } }, created: function() {
          this.mutableLoading = this.loading, this.$on("option:created", this.pushTag);
        }, methods: { setInternalValueFromOptions: function(e4) {
          var t5 = this;
          Array.isArray(e4) ? this.$data._value = e4.map(function(e5) {
            return t5.findOptionFromReducedValue(e5);
          }) : this.$data._value = this.findOptionFromReducedValue(e4);
        }, select: function(e4) {
          this.$emit("option:selecting", e4), this.isOptionSelected(e4) ? this.deselectFromDropdown && (this.clearable || this.multiple && this.selectedValue.length > 1) && this.deselect(e4) : (this.taggable && !this.optionExists(e4) && this.$emit("option:created", e4), this.multiple && (e4 = this.selectedValue.concat(e4)), this.updateValue(e4), this.$emit("option:selected", e4)), this.onAfterSelect(e4);
        }, deselect: function(e4) {
          var t5 = this;
          this.$emit("option:deselecting", e4), this.updateValue(this.selectedValue.filter(function(n2) {
            return !t5.optionComparator(n2, e4);
          })), this.$emit("option:deselected", e4);
        }, keyboardDeselect: function(e4, t5) {
          var n2, o2;
          this.deselect(e4);
          var i2 = null === (n2 = this.$refs.deselectButtons) || void 0 === n2 ? void 0 : n2[t5 + 1], s2 = null === (o2 = this.$refs.deselectButtons) || void 0 === o2 ? void 0 : o2[t5 - 1], r2 = null != i2 ? i2 : s2;
          r2 ? r2.focus() : this.searchEl.focus();
        }, clearSelection: function() {
          this.updateValue(this.multiple ? [] : null), this.searchEl.focus();
        }, onAfterSelect: function(e4) {
          var t5 = this;
          this.closeOnSelect && (this.open = !this.open), this.clearSearchOnSelect && (this.search = ""), this.noDrop && this.multiple && this.$nextTick(function() {
            return t5.$refs.search.focus();
          });
        }, updateValue: function(e4) {
          var t5 = this;
          void 0 === this.value && (this.$data._value = e4), null !== e4 && (e4 = Array.isArray(e4) ? e4.map(function(e5) {
            return t5.reduce(e5);
          }) : this.reduce(e4)), this.$emit("input", e4);
        }, toggleDropdown: function(e4) {
          var n2 = e4.target !== this.searchEl;
          n2 && e4.preventDefault();
          var o2 = [].concat(t4()(this.$refs.deselectButtons || []), t4()([this.$refs.clearButton]));
          void 0 === this.searchEl || o2.filter(Boolean).some(function(t5) {
            return t5.contains(e4.target) || t5 === e4.target;
          }) ? e4.preventDefault() : this.open && n2 ? this.searchEl.blur() : this.disabled || (this.open = true, this.searchEl.focus());
        }, isOptionSelected: function(e4) {
          var t5 = this;
          return this.selectedValue.some(function(n2) {
            return t5.optionComparator(n2, e4);
          });
        }, isOptionDeselectable: function(e4) {
          return this.isOptionSelected(e4) && this.deselectFromDropdown;
        }, hasKeyboardFocusBorder: function(e4) {
          return !(!this.keyboardFocusBorder || !this.isKeyboardNavigation) && e4 === this.typeAheadPointer;
        }, optionComparator: function(e4, t5) {
          return this.getOptionKey(e4) === this.getOptionKey(t5);
        }, findOptionFromReducedValue: function(e4) {
          var n2 = this, o2 = [].concat(t4()(this.options), t4()(this.pushedTags)).filter(function(t5) {
            return JSON.stringify(n2.reduce(t5)) === JSON.stringify(e4);
          });
          return 1 === o2.length ? o2[0] : o2.find(function(e5) {
            return n2.optionComparator(e5, n2.$data._value);
          }) || e4;
        }, closeSearchOptions: function() {
          this.open = false, this.$emit("search:blur");
        }, maybeDeleteValue: function() {
          if (!this.searchEl.value.length && this.selectedValue && this.selectedValue.length && this.clearable) {
            var e4 = null;
            this.multiple && (e4 = t4()(this.selectedValue.slice(0, this.selectedValue.length - 1))), this.updateValue(e4);
          }
        }, optionExists: function(e4) {
          var t5 = this;
          return this.optionList.some(function(n2) {
            return t5.optionComparator(n2, e4);
          });
        }, optionAriaSelected: function(e4) {
          return this.selectable(e4) ? String(this.isOptionSelected(e4)) : null;
        }, normalizeOptionForSlot: function(e4) {
          return "object" === s()(e4) ? e4 : a()({}, this.label, e4);
        }, pushTag: function(e4) {
          this.pushedTags.push(e4);
        }, onEscape: function() {
          this.search.length ? this.search = "" : this.open = false;
        }, onSearchBlur: function() {
          if (!this.mousedown || this.searching) {
            var e4 = this.clearSearchOnSelect, t5 = this.multiple;
            return this.clearSearchOnBlur({ clearSearchOnSelect: e4, multiple: t5 }) && (this.search = ""), void this.closeSearchOptions();
          }
          this.mousedown = false, 0 !== this.search.length || 0 !== this.options.length || this.closeSearchOptions();
        }, onSearchFocus: function() {
          this.open = true, this.$emit("search:focus");
        }, onMousedown: function() {
          this.mousedown = true;
        }, onMouseUp: function() {
          this.mousedown = false;
        }, onMouseMove: function(e4, t5) {
          this.isKeyboardNavigation = false, this.selectable(e4) && (this.typeAheadPointer = t5);
        }, onSearchKeyDown: function(e4) {
          var t5 = this, n2 = function(e5) {
            if (e5.preventDefault(), t5.open) return !t5.isComposing && t5.typeAheadSelect();
            t5.open = true;
          }, o2 = { 8: function(e5) {
            return t5.maybeDeleteValue();
          }, 9: function(e5) {
            return t5.onTab();
          }, 27: function(e5) {
            return t5.onEscape();
          }, 38: function(e5) {
            if (e5.preventDefault(), t5.isKeyboardNavigation = true, t5.open) return t5.typeAheadUp();
            t5.open = true;
          }, 40: function(e5) {
            if (e5.preventDefault(), t5.isKeyboardNavigation = true, t5.open) return t5.typeAheadDown();
            t5.open = true;
          } };
          this.selectOnKeyCodes.forEach(function(e5) {
            return o2[e5] = n2;
          });
          var i2 = this.mapKeydown(o2, this);
          if ("function" == typeof i2[e4.keyCode]) return i2[e4.keyCode](e4);
        }, onSearchKeyPress: function(e4) {
          this.open || 32 !== e4.keyCode || (e4.preventDefault(), this.open = true);
        } } }, function() {
          var e4 = this, t5 = e4.$createElement, n2 = e4._self._c || t5;
          return n2("div", { staticClass: "v-select", class: e4.stateClasses, attrs: { id: "v-select-" + e4.uid, dir: e4.dir } }, [e4._t("header", null, null, e4.scope.header), e4._v(" "), n2("div", { ref: "toggle", staticClass: "vs__dropdown-toggle" }, [n2("div", { ref: "selectedOptions", staticClass: "vs__selected-options", on: { mousedown: e4.toggleDropdown } }, [e4._l(e4.selectedValue, function(t6, o2) {
            return e4._t("selected-option-container", [n2("span", { key: e4.getOptionKey(t6), staticClass: "vs__selected" }, [e4._t("selected-option", [e4._v("\n            " + e4._s(e4.getOptionLabel(t6)) + "\n          ")], null, e4.normalizeOptionForSlot(t6)), e4._v(" "), e4.multiple ? n2("button", { ref: "deselectButtons", refInFor: true, staticClass: "vs__deselect", attrs: { disabled: e4.disabled, type: "button", title: e4.ariaLabelDeselectOption(e4.getOptionLabel(t6)), "aria-label": e4.ariaLabelDeselectOption(e4.getOptionLabel(t6)) }, on: { mousedown: function(n3) {
              return n3.stopPropagation(), e4.deselect(t6);
            }, keydown: function(n3) {
              return !n3.type.indexOf("key") && e4._k(n3.keyCode, "enter", 13, n3.key, "Enter") ? null : e4.keyboardDeselect(t6, o2);
            } } }, [n2(e4.childComponents.Deselect, { tag: "component" })], 1) : e4._e()], 2)], { option: e4.normalizeOptionForSlot(t6), deselect: e4.deselect, multiple: e4.multiple, disabled: e4.disabled });
          }), e4._v(" "), e4._t("search", [n2("input", e4._g(e4._b({ staticClass: "vs__search" }, "input", e4.scope.search.attributes, false), e4.scope.search.events))], null, e4.scope.search)], 2), e4._v(" "), n2("div", { ref: "actions", staticClass: "vs__actions" }, [n2("button", { directives: [{ name: "show", rawName: "v-show", value: e4.showClearButton, expression: "showClearButton" }], ref: "clearButton", staticClass: "vs__clear", attrs: { disabled: e4.disabled, type: "button", title: e4.ariaLabelClearSelected, "aria-label": e4.ariaLabelClearSelected }, on: { click: e4.clearSelection } }, [n2(e4.childComponents.Deselect, { tag: "component" })], 1), e4._v(" "), e4.noDrop ? e4._e() : n2("button", { ref: "openIndicatorButton", staticClass: "vs__open-indicator-button", attrs: { type: "button", tabindex: "-1", "aria-labelledby": "vs-" + e4.uid + "__listbox", "aria-controls": "vs-" + e4.uid + "__listbox", "aria-expanded": e4.dropdownOpen.toString() }, on: { mousedown: e4.toggleDropdown } }, [e4._t("open-indicator", [n2(e4.childComponents.OpenIndicator, e4._b({ tag: "component" }, "component", e4.scope.openIndicator.attributes, false))], null, e4.scope.openIndicator)], 2), e4._v(" "), e4._t("spinner", [n2("div", { directives: [{ name: "show", rawName: "v-show", value: e4.mutableLoading, expression: "mutableLoading" }], staticClass: "vs__spinner" }, [e4._v("Loading...")])], null, e4.scope.spinner)], 2)]), e4._v(" "), n2("transition", { attrs: { name: e4.transition } }, [e4.dropdownOpen ? n2("ul", { directives: [{ name: "append-to-body", rawName: "v-append-to-body" }], key: "vs-" + e4.uid + "__listbox", ref: "dropdownMenu", staticClass: "vs__dropdown-menu", attrs: { id: "vs-" + e4.uid + "__listbox", role: "listbox", "aria-label": e4.ariaLabelListbox, "aria-multiselectable": e4.multiple, tabindex: "-1" }, on: { mousedown: function(t6) {
            return t6.preventDefault(), e4.onMousedown(t6);
          }, mouseup: e4.onMouseUp } }, [e4._t("list-header", null, null, e4.scope.listHeader), e4._v(" "), e4._l(e4.filteredOptions, function(t6, o2) {
            return n2("li", { key: e4.getOptionKey(t6), staticClass: "vs__dropdown-option", class: { "vs__dropdown-option--deselect": e4.isOptionDeselectable(t6) && o2 === e4.typeAheadPointer, "vs__dropdown-option--selected": e4.isOptionSelected(t6), "vs__dropdown-option--highlight": o2 === e4.typeAheadPointer, "vs__dropdown-option--kb-focus": e4.hasKeyboardFocusBorder(o2), "vs__dropdown-option--disabled": !e4.selectable(t6) }, attrs: { id: "vs-" + e4.uid + "__option-" + o2, role: "option", "aria-selected": e4.optionAriaSelected(t6) }, on: { mousemove: function(n3) {
              return e4.onMouseMove(t6, o2);
            }, click: function(n3) {
              n3.preventDefault(), n3.stopPropagation(), e4.selectable(t6) && e4.select(t6);
            } } }, [e4._t("option", [e4._v("\n          " + e4._s(e4.getOptionLabel(t6)) + "\n        ")], null, e4.normalizeOptionForSlot(t6))], 2);
          }), e4._v(" "), 0 === e4.filteredOptions.length ? n2("li", { staticClass: "vs__no-options" }, [e4._t("no-options", [e4._v("\n          Sorry, no matching options.\n        ")], null, e4.scope.noOptions)], 2) : e4._e(), e4._v(" "), e4._t("list-footer", null, null, e4.scope.listFooter)], 2) : n2("ul", { staticStyle: { display: "none", visibility: "hidden" }, attrs: { id: "vs-" + e4.uid + "__listbox", role: "listbox", "aria-label": e4.ariaLabelListbox } })]), e4._v(" "), e4._t("footer", null, null, e4.scope.footer)], 2);
        }, []).exports, O = { ajax: u, pointer: c, pointerScroll: l }, _2 = m;
      })(), o;
    })();
  });
})(vueSelect);
var vueSelectExports = vueSelect.exports;
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v2) => ({
  x: v2,
  y: v2
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return __spreadValues({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, padding);
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = __spreadProps(__spreadValues({}, middlewareData), {
      [name]: __spreadValues(__spreadValues({}, middlewareData[name]), data)
    });
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const flip$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const _a = evaluate(options, state), {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true
      } = _a, detectOverflowOptions = __objRest(_a, [
        "mainAxis",
        "crossAxis",
        "fallbackPlacements",
        "fallbackStrategy",
        "fallbackAxisSideDirection",
        "flipAlignment"
      ]);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : __spreadValues({
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null
  }, rawValue);
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$1 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: __spreadProps(__spreadValues({}, diffCoords), {
          placement
        })
      };
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const _a = evaluate(options, state), {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        }
      } = _a, detectOverflowOptions = __objRest(_a, [
        "mainAxis",
        "crossAxis",
        "limiter"
      ]);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn(__spreadProps(__spreadValues({}, state), {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      }));
      return __spreadProps(__spreadValues({}, limitedCoords), {
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      });
    }
  };
};
const limitShift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset: offset2 = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset2, state);
      const computedOffset = typeof rawOffset === "number" ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : __spreadValues({
        mainAxis: 0,
        crossAxis: 0
      }, rawOffset);
      if (checkMainAxis) {
        const len = mainAxis === "y" ? "height" : "width";
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === "y" ? "width" : "height";
        const isOriginSide = ["top", "left"].includes(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e2) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = currentWin.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = currentWin.frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = __spreadProps(__spreadValues({}, clippingAncestor), {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    });
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const x = rect.left + scroll.scrollLeft - offsets.x;
  const y = rect.top + scroll.scrollTop - offsets.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, __spreadProps(__spreadValues({}, options), {
        // Handle <iframe>s
        root: root.ownerDocument
      }));
    } catch (e2) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset = offset$1;
const shift = shift$1;
const flip = flip$1;
const limitShift = limitShift$1;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = __spreadValues({
    platform
  }, options);
  const platformWithCache = __spreadProps(__spreadValues({}, mergedOptions.platform), {
    _c: cache
  });
  return computePosition$1(reference, floating, __spreadProps(__spreadValues({}, mergedOptions), {
    platform: platformWithCache
  }));
};
const _sfc_main$a = {
  name: "ChevronDownIcon",
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
var _sfc_render$a = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon chevron-down-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$a = [];
var __component__$a = /* @__PURE__ */ normalizeComponent(
  _sfc_main$a,
  _sfc_render$a,
  _sfc_staticRenderFns$a,
  false,
  null,
  null
);
const ChevronDown = __component__$a.exports;
const FindRanges = (text, search) => {
  const ranges = [];
  let currentIndex = 0;
  let index = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex);
  let i = 0;
  while (index > -1 && i < text.length) {
    currentIndex = index + search.length;
    ranges.push({ start: index, end: currentIndex });
    index = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex);
    i++;
  }
  return ranges;
};
const _sfc_main$9 = {
  name: "NcHighlight",
  props: {
    /**
     * The string to display
     */
    text: {
      type: String,
      default: ""
    },
    /**
     * The string to match and highlight
     */
    search: {
      type: String,
      default: ""
    },
    /**
     * The ranges to highlight, takes precedence over the search prop.
     */
    highlight: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    /**
     * The indice ranges which should be highlighted.
     * If an array with ranges is provided, we use it. Otherwise
     * we calculate it based on the provided substring to highlight.
     *
     * @return {Array} The array of ranges to highlight
     */
    ranges() {
      let ranges = [];
      if (!this.search && this.highlight.length === 0) {
        return ranges;
      }
      if (this.highlight.length > 0) {
        ranges = this.highlight;
      } else {
        ranges = FindRanges(this.text, this.search);
      }
      ranges.forEach((range, i) => {
        if (range.end < range.start) {
          ranges[i] = {
            start: range.end,
            end: range.start
          };
        }
      });
      ranges = ranges.reduce((validRanges, range) => {
        if (range.start < this.text.length && range.end > 0) {
          validRanges.push({
            start: range.start < 0 ? 0 : range.start,
            end: range.end > this.text.length ? this.text.length : range.end
          });
        }
        return validRanges;
      }, []);
      ranges.sort((a, b) => {
        return a.start - b.start;
      });
      ranges = ranges.reduce((mergedRanges, range) => {
        if (!mergedRanges.length) {
          mergedRanges.push(range);
        } else {
          const idx = mergedRanges.length - 1;
          if (mergedRanges[idx].end >= range.start) {
            mergedRanges[idx] = {
              start: mergedRanges[idx].start,
              end: Math.max(mergedRanges[idx].end, range.end)
            };
          } else {
            mergedRanges.push(range);
          }
        }
        return mergedRanges;
      }, []);
      return ranges;
    },
    /**
     * Calculate the different chunks to show based on the ranges to highlight.
     *
     * @return {Array} The chunks
     */
    chunks() {
      if (this.ranges.length === 0) {
        return [{
          start: 0,
          end: this.text.length,
          highlight: false,
          text: this.text
        }];
      }
      const chunks = [];
      let currentIndex = 0;
      let currentRange = 0;
      while (currentIndex < this.text.length) {
        const range = this.ranges[currentRange];
        if (range.start === currentIndex) {
          chunks.push(__spreadProps(__spreadValues({}, range), {
            highlight: true,
            text: this.text.slice(range.start, range.end)
          }));
          currentRange++;
          currentIndex = range.end;
          if (currentRange >= this.ranges.length && currentIndex < this.text.length) {
            chunks.push({
              start: currentIndex,
              end: this.text.length,
              highlight: false,
              text: this.text.slice(currentIndex)
            });
            currentIndex = this.text.length;
          }
          continue;
        }
        chunks.push({
          start: currentIndex,
          end: range.start,
          highlight: false,
          text: this.text.slice(currentIndex, range.start)
        });
        currentIndex = range.start;
      }
      return chunks;
    }
  },
  /**
   * The render function to display the component
   *
   * @param {Function} h The function to create VNodes
   * @return {object} The created VNode
   */
  render(h) {
    if (!this.ranges.length) {
      return h("span", {}, this.text);
    }
    return h("span", {}, this.chunks.map((chunk) => {
      return chunk.highlight ? h("strong", {}, chunk.text) : chunk.text;
    }));
  }
};
const _sfc_render$9 = null;
const _sfc_staticRenderFns$9 = null;
var __component__$9 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$9,
  _sfc_render$9,
  _sfc_staticRenderFns$9,
  false,
  null,
  null
);
const NcHighlight = __component__$9.exports;
const _sfc_main$8 = {
  name: "NcEllipsisedOption",
  components: {
    NcHighlight
  },
  props: {
    /**
     * The text to be display in one line. If it is longer than 10 characters, it is be truncated with ellipsis in the end but keeping up to 10 last characters to fit the parent container.
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * The search value to highlight in the text
     */
    search: {
      type: String,
      default: ""
    }
  },
  computed: {
    needsTruncate() {
      return this.name && this.name.length >= 10;
    },
    /**
     * Index at which to split the name if it is longer than 10 characters.
     *
     * @return {number} The position at which to split
     */
    split() {
      return this.name.length - Math.min(Math.floor(this.name.length / 2), 10);
    },
    part1() {
      if (this.needsTruncate) {
        return this.name.slice(0, this.split);
      }
      return this.name;
    },
    part2() {
      if (this.needsTruncate) {
        return this.name.slice(this.split);
      }
      return "";
    },
    /**
     * The ranges to highlight. Since we split the string for ellipsising,
     * the Highlight component cannot figure this out itself and needs the ranges provided.
     *
     * @return {Array} The array with the ranges to highlight
     */
    highlight1() {
      if (!this.search) {
        return [];
      }
      return FindRanges(this.name, this.search);
    },
    /**
     * We shift the ranges for the second part by the position of the split.
     * Ranges out of the string length are discarded by the Highlight component,
     * so we don't need to take care of this here.
     *
     * @return {Array} The array with the ranges to highlight
     */
    highlight2() {
      return this.highlight1.map((range) => {
        return {
          start: range.start - this.split,
          end: range.end - this.split
        };
      });
    }
  }
};
var _sfc_render$8 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", { staticClass: "name-parts", attrs: { "dir": "auto", "title": _vm.name } }, [_c("NcHighlight", { staticClass: "name-parts__first", attrs: { "text": _vm.part1, "search": _vm.search, "highlight": _vm.highlight1 } }), _vm.part2 ? _c("NcHighlight", { staticClass: "name-parts__last", attrs: { "text": _vm.part2, "search": _vm.search, "highlight": _vm.highlight2 } }) : _vm._e()], 1);
};
var _sfc_staticRenderFns$8 = [];
var __component__$8 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$8,
  _sfc_render$8,
  _sfc_staticRenderFns$8,
  false,
  null,
  "f6384352"
);
const NcEllipsisedOption = __component__$8.exports;
const ActionGlobalMixin = {
  beforeUpdate() {
    this.text = this.getText();
  },
  data() {
    return {
      // $slots are not reactive.
      // We need to update  the content manually
      text: this.getText()
    };
  },
  computed: {
    isLongText() {
      return this.text && this.text.trim().length > 20;
    }
  },
  methods: {
    getText() {
      return this.$slots.default ? this.$slots.default[0].text.trim() : "";
    }
  }
};
const GetParent = function(context, name) {
  let parent = context.$parent;
  while (parent) {
    if (parent.$options.name === name) {
      return parent;
    }
    parent = parent.$parent;
  }
};
const ActionTextMixin = {
  mixins: [ActionGlobalMixin],
  props: {
    /**
     * Icon to show with the action, can be either a CSS class or an URL
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * The main text content of the entry.
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * The title attribute of the element.
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * Whether we close the Actions menu after the click
     */
    closeAfterClick: {
      type: Boolean,
      default: false
    },
    /**
     * Aria label for the button. Not needed if the button has text.
     */
    ariaLabel: {
      type: String,
      default: null
    },
    /**
     * @deprecated To be removed in @nextcloud/vue 9. Migration guide: remove ariaHidden prop from NcAction* components.
     * @todo Add a check in @nextcloud/vue 9 that this prop is not provided,
     * otherwise root element will inherit incorrect aria-hidden.
     */
    ariaHidden: {
      type: Boolean,
      default: null
    }
  },
  emits: [
    "click"
  ],
  computed: {
    /**
     * Check if icon prop is an URL
     * @return {boolean} Whether the icon prop is an URL
     */
    isIconUrl() {
      try {
        return !!new URL(this.icon, this.icon.startsWith("/") ? window.location.origin : void 0);
      } catch (error) {
        return false;
      }
    }
  },
  methods: {
    onClick(event) {
      this.$emit("click", event);
      if (this.closeAfterClick) {
        const parent = GetParent(this, "NcActions");
        if (parent && parent.closeMenu) {
          parent.closeMenu(false);
        }
      }
    }
  }
};
const _sfc_main$7 = {
  name: "NcActionLink",
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: "NcActions:isSemanticMenu",
      default: false
    }
  },
  props: {
    /**
     * destionation to link to
     */
    href: {
      type: String,
      default: "#",
      required: true,
      validator: (value) => {
        try {
          return new URL(value);
        } catch (error) {
          return value.startsWith("#") || value.startsWith("/");
        }
      }
    },
    /**
     * download the link instead of opening
     */
    download: {
      type: String,
      default: null
    },
    /**
     * target to open the link
     */
    target: {
      type: String,
      default: "_self",
      validator: (value) => {
        return value && (!value.startsWith("_") || ["_blank", "_self", "_parent", "_top"].indexOf(value) > -1);
      }
    },
    /**
     * Declares a native tooltip when not null
     */
    title: {
      type: String,
      default: null
    },
    /**
     * @deprecated To be removed in @nextcloud/vue 9. Migration guide: remove ariaHidden prop from NcAction* components.
     * @todo Add a check in @nextcloud/vue 9 that this prop is not provided,
     * otherwise root element will inherit incorrect aria-hidden.
     */
    ariaHidden: {
      type: Boolean,
      default: null
    }
  }
};
var _sfc_render$7 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", { staticClass: "action", attrs: { "role": _vm.isInSemanticMenu && "presentation" } }, [_c("a", { staticClass: "action-link focusable", attrs: { "download": _vm.download, "href": _vm.href, "aria-label": _vm.ariaLabel, "target": _vm.target, "title": _vm.title, "rel": "nofollow noreferrer noopener", "role": _vm.isInSemanticMenu && "menuitem" }, on: { "click": _vm.onClick } }, [_vm._t("icon", function() {
    return [_c("span", { staticClass: "action-link__icon", class: [_vm.isIconUrl ? "action-link__icon--url" : _vm.icon], style: { backgroundImage: _vm.isIconUrl ? "url(".concat(_vm.icon, ")") : null }, attrs: { "aria-hidden": "true" } })];
  }), _vm.name ? _c("span", { staticClass: "action-link__longtext-wrapper" }, [_c("strong", { staticClass: "action-link__name" }, [_vm._v(" " + _vm._s(_vm.name) + " ")]), _c("br"), _c("span", { staticClass: "action-link__longtext", domProps: { "textContent": _vm._s(_vm.text) } })]) : _vm.isLongText ? _c("span", { staticClass: "action-link__longtext", domProps: { "textContent": _vm._s(_vm.text) } }) : _c("span", { staticClass: "action-link__text" }, [_vm._v(_vm._s(_vm.text))]), _vm._e()], 2)]);
};
var _sfc_staticRenderFns$7 = [];
var __component__$7 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$7,
  _sfc_render$7,
  _sfc_staticRenderFns$7,
  false,
  null,
  "30c015f0"
);
const NcActionLink = __component__$7.exports;
const _sfc_main$6 = {
  name: "NcActionRouter",
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: "NcActions:isSemanticMenu",
      default: false
    }
  },
  props: {
    /**
     * router-link to prop [https://router.vuejs.org/api/#to](https://router.vuejs.org/api/#to)
     */
    to: {
      type: [String, Object],
      default: "",
      required: true
    },
    /**
     * router-link exact prop [https://router.vuejs.org/api/#exact](https://router.vuejs.org/api/#exact)
     */
    exact: {
      type: Boolean,
      default: false
    }
  }
};
var _sfc_render$6 = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", { staticClass: "action", attrs: { "role": _vm.isInSemanticMenu && "presentation" } }, [_c("RouterLink", { staticClass: "action-router focusable", attrs: { "to": _vm.to, "aria-label": _vm.ariaLabel, "exact": _vm.exact, "title": _vm.title, "rel": "nofollow noreferrer noopener", "role": _vm.isInSemanticMenu && "menuitem" }, nativeOn: { "click": function($event) {
    return _vm.onClick.apply(null, arguments);
  } } }, [_vm._t("icon", function() {
    return [_c("span", { staticClass: "action-router__icon", class: [_vm.isIconUrl ? "action-router__icon--url" : _vm.icon], style: { backgroundImage: _vm.isIconUrl ? "url(".concat(_vm.icon, ")") : null }, attrs: { "aria-hidden": "true" } })];
  }), _vm.name ? _c("span", { staticClass: "action-router__longtext-wrapper" }, [_c("strong", { staticClass: "action-router__name" }, [_vm._v(" " + _vm._s(_vm.name) + " ")]), _c("br"), _c("span", { staticClass: "action-router__longtext", domProps: { "textContent": _vm._s(_vm.text) } })]) : _vm.isLongText ? _c("span", { staticClass: "action-router__longtext", domProps: { "textContent": _vm._s(_vm.text) } }) : _c("span", { staticClass: "action-router__text" }, [_vm._v(_vm._s(_vm.text))]), _vm._e()], 2)], 1);
};
var _sfc_staticRenderFns$6 = [];
var __component__$6 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$6,
  _sfc_render$6,
  _sfc_staticRenderFns$6,
  false,
  null,
  "579c6b4d"
);
const NcActionRouter = __component__$6.exports;
const _sfc_main$5 = {
  name: "NcActionText",
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: "NcActions:isSemanticMenu",
      default: false
    }
  }
};
var _sfc_render$5 = function render5() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", { staticClass: "action", attrs: { "role": _vm.isInSemanticMenu && "presentation" } }, [_c("span", { staticClass: "action-text", on: { "click": _vm.onClick } }, [_vm._t("icon", function() {
    return [_vm.icon !== "" ? _c("span", { staticClass: "action-text__icon", class: [_vm.isIconUrl ? "action-text__icon--url" : _vm.icon], style: { backgroundImage: _vm.isIconUrl ? "url(".concat(_vm.icon, ")") : null }, attrs: { "aria-hidden": "true" } }) : _vm._e()];
  }), _vm.name ? _c("span", { staticClass: "action-text__longtext-wrapper" }, [_c("strong", { staticClass: "action-text__name" }, [_vm._v(" " + _vm._s(_vm.name) + " ")]), _c("br"), _c("span", { staticClass: "action-text__longtext", domProps: { "textContent": _vm._s(_vm.text) } })]) : _vm.isLongText ? _c("span", { staticClass: "action-text__longtext", domProps: { "textContent": _vm._s(_vm.text) } }) : _c("span", { staticClass: "action-text__text" }, [_vm._v(_vm._s(_vm.text))]), _vm._e()], 2)]);
};
var _sfc_staticRenderFns$5 = [];
var __component__$5 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$5,
  _sfc_render$5,
  _sfc_staticRenderFns$5,
  false,
  null,
  "824615f4"
);
const NcActionText = __component__$5.exports;
const onlineSvg = '<!--\n  - SPDX-FileCopyrightText: 2020 Google Inc.\n  - SPDX-License-Identifier: Apache-2.0\n-->\n<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n	<path fill="var(--color-success)" d="M4.8 11.2h6.4V4.8H4.8v6.4zM8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />\n</svg>\n';
const awaySvg = '<!--\n  - SPDX-FileCopyrightText: 2020 Google Inc.\n  - SPDX-License-Identifier: Apache-2.0\n-->\n<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n	<path fill="none" d="M-4-4h24v24H-4z" />\n	<path fill="var(--color-warning)" d="M6.9.1C3 .6-.1 4-.1 8c0 4.4 3.6 8 8 8 4 0 7.4-3 8-6.9-1.2 1.3-2.9 2.1-4.7 2.1-3.5 0-6.4-2.9-6.4-6.4 0-1.9.8-3.6 2.1-4.7z" />\n</svg>\n';
const dndSvg = '<!--\n  - SPDX-FileCopyrightText: 2020 Google Inc.\n  - SPDX-License-Identifier: Apache-2.0\n-->\n<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n	<path fill="none" d="M-4-4h24v24H-4V-4z" />\n	<path fill="var(--color-error)" d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />\n	<path fill="#fdffff" d="M5 6.5h6c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5H5c-.8 0-1.5-.7-1.5-1.5S4.2 6.5 5 6.5z" />\n</svg>\n';
const invisibleSvg = '<!--\n  - SPDX-FileCopyrightText: 2020 Google Inc.\n  - SPDX-License-Identifier: Apache-2.0\n-->\n<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n	<path fill="none" d="M-4-4h24v24H-4V-4z" />\n	<path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3.2c2.7 0 4.8 2.1 4.8 4.8s-2.1 4.8-4.8 4.8S3.2 10.7 3.2 8 5.3 3.2 8 3.2z" />\n</svg>\n';
register(t11);
const getUserStatusText = (status) => {
  switch (status) {
    case "away":
      return t$1("away");
    case "busy":
      return t$1("busy");
    case "dnd":
      return t$1("do not disturb");
    case "online":
      return t$1("online");
    case "invisible":
      return t$1("invisible");
    case "offline":
      return t$1("offline");
    default:
      return status;
  }
};
register(t49);
const _sfc_main$4 = {
  name: "NcUserStatusIcon",
  props: {
    /**
     * Set the user id to fetch the status
     */
    user: {
      type: String,
      default: null
    },
    /**
     * Set the status
     *
     * @type {'online' | 'away' | 'busy' | 'dnd' | 'invisible' | 'offline'}
     */
    status: {
      type: String,
      default: null,
      validator: (value) => [
        "online",
        "away",
        "busy",
        "dnd",
        "invisible",
        "offline"
      ].includes(value)
    },
    /**
     * Set the `aria-hidden` attribute
     *
     * @type {'true' | 'false'}
     */
    ariaHidden: {
      type: String,
      default: null,
      validator: (value) => [
        "true",
        "false"
      ].includes(value)
    }
  },
  data() {
    return {
      fetchedUserStatus: null
    };
  },
  computed: {
    activeStatus() {
      var _a;
      return (_a = this.status) != null ? _a : this.fetchedUserStatus;
    },
    activeSvg() {
      var _a;
      const matchSvg = {
        online: onlineSvg,
        away: awaySvg,
        busy: awaySvg,
        dnd: dndSvg,
        invisible: invisibleSvg,
        offline: invisibleSvg
      };
      return (_a = matchSvg[this.activeStatus]) != null ? _a : null;
    },
    ariaLabel() {
      if (this.ariaHidden === "true") {
        return null;
      }
      return t$1("User status: {status}", { status: getUserStatusText(this.activeStatus) });
    }
  },
  watch: {
    user: {
      immediate: true,
      async handler(user, _oldUser) {
        var _a, _b, _c, _d;
        if (!user || !((_b = (_a = e()) == null ? void 0 : _a.user_status) == null ? void 0 : _b.enabled)) {
          this.fetchedUserStatus = null;
          return;
        }
        try {
          const { data } = await cancelableClient.get(v("/apps/user_status/api/v1/statuses/{user}", { user }));
          this.fetchedUserStatus = (_d = (_c = data.ocs) == null ? void 0 : _c.data) == null ? void 0 : _d.status;
        } catch (error) {
          this.fetchedUserStatus = null;
        }
      }
    }
  }
};
var _sfc_render$4 = function render6() {
  var _vm = this, _c = _vm._self._c;
  return _vm.activeStatus ? _c("span", { staticClass: "user-status-icon", class: {
    "user-status-icon--invisible": ["invisible", "offline"].includes(_vm.status)
  }, attrs: { "role": "img", "aria-hidden": _vm.ariaHidden, "aria-label": _vm.ariaLabel }, domProps: { "innerHTML": _vm._s(_vm.activeSvg) } }) : _vm._e();
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  "0555d8d0"
);
const NcUserStatusIcon = __component__$4.exports;
register(t3);
class Color {
  /**
   * @param {number} r The red value
   * @param {number} g The green value
   * @param {number} b The blue value
   * @param {string} [name] The name of the color
   */
  constructor(r, g, b, name) {
    this.r = r;
    this.g = g;
    this.b = b;
    if (name) {
      this.name = name;
    }
  }
  get color() {
    const toHex = (num) => "00".concat(num.toString(16)).slice(-2);
    return "#".concat(toHex(this.r)).concat(toHex(this.g)).concat(toHex(this.b));
  }
}
function stepCalc(steps, ends) {
  const step = new Array(3);
  step[0] = (ends[1].r - ends[0].r) / steps;
  step[1] = (ends[1].g - ends[0].g) / steps;
  step[2] = (ends[1].b - ends[0].b) / steps;
  return step;
}
function mixPalette(steps, color1, color2) {
  const palette = [];
  palette.push(color1);
  const step = stepCalc(steps, [color1, color2]);
  for (let i = 1; i < steps; i++) {
    const r = Math.floor(color1.r + step[0] * i);
    const g = Math.floor(color1.g + step[1] * i);
    const b = Math.floor(color1.b + step[2] * i);
    palette.push(new Color(r, g, b));
  }
  return palette;
}
[
  new Color(182, 70, 157, t$1("Purple")),
  new Color(
    191,
    103,
    139,
    t$1("Rosy brown")
    // TRANSLATORS: A color name for RGB(191, 103, 139)
  ),
  new Color(
    201,
    136,
    121,
    t$1("Feldspar")
    // TRANSLATORS: A color name for RGB(201, 136, 121)
  ),
  new Color(
    211,
    169,
    103,
    t$1("Whiskey")
    // TRANSLATORS: A color name for RGB(211, 169, 103)
  ),
  new Color(
    221,
    203,
    85,
    t$1("Gold")
  ),
  new Color(
    165,
    184,
    114,
    t$1("Olivine")
    // TRANSLATORS: A color name for RGB(165, 184, 114)
  ),
  new Color(
    110,
    166,
    143,
    t$1("Acapulco")
    // TRANSLATORS: A color name for RGB(110, 166, 143)
  ),
  new Color(
    55,
    148,
    172,
    t$1("Boston Blue")
    // TRANSLATORS: A color name for RGB(55, 148, 172)
  ),
  new Color(
    0,
    130,
    201,
    t$1("Nextcloud blue")
  ),
  new Color(
    45,
    115,
    190,
    t$1("Mariner")
    // TRANSLATORS: A color name for RGB(45, 115, 190)
  ),
  new Color(
    91,
    100,
    179,
    t$1("Blue Violet")
    // TRANSLATORS: A color name for RGB(91, 100, 179)
  ),
  new Color(
    136,
    85,
    168,
    t$1("Deluge")
    // TRANSLATORS: A color name for RGB(136, 85, 168)
  )
];
function GenColors(steps) {
  const red = new Color(182, 70, 157, t$1("Purple"));
  const yellow = new Color(221, 203, 85, t$1("Gold"));
  const blue = new Color(0, 130, 201, t$1("Nextcloud blue"));
  const palette1 = mixPalette(steps, red, yellow);
  const palette2 = mixPalette(steps, yellow, blue);
  const palette3 = mixPalette(steps, blue, red);
  return palette1.concat(palette2).concat(palette3);
}
var md5$1 = { exports: {} };
var crypt = { exports: {} };
(function() {
  var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt$1 = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return n << b | n >>> 32 - b;
    },
    // Bit-wise rotation right
    rotr: function(n, b) {
      return n << 32 - b | n >>> b;
    },
    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      if (n.constructor == Number) {
        return crypt$1.rotl(n, 8) & 16711935 | crypt$1.rotl(n, 24) & 4278255360;
      }
      for (var i = 0; i < n.length; i++)
        n[i] = crypt$1.endian(n[i]);
      return n;
    },
    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },
    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << 24 - b % 32;
      return words;
    },
    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
      return bytes;
    },
    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 15).toString(16));
      }
      return hex.join("");
    },
    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },
    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
          else
            base64.push("=");
      }
      return base64.join("");
    },
    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
      for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
      }
      return bytes;
    }
  };
  crypt.exports = crypt$1;
})();
var cryptExports = crypt.exports;
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },
    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },
  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 255);
      return bytes;
    },
    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join("");
    }
  }
};
var charenc_1 = charenc;
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var isBuffer_1 = function(obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
};
function isBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
}
(function() {
  var crypt2 = cryptExports, utf8 = charenc_1.utf8, isBuffer2 = isBuffer_1, bin = charenc_1.bin, md52 = function(message, options) {
    if (message.constructor == String)
      if (options && options.encoding === "binary")
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer2(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    var m = crypt2.bytesToWords(message), l = message.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (var i = 0; i < m.length; i++) {
      m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
    }
    m[l >>> 5] |= 128 << l % 32;
    m[(l + 64 >>> 9 << 4) + 14] = l;
    var FF = md52._ff, GG = md52._gg, HH = md52._hh, II = md52._ii;
    for (var i = 0; i < m.length; i += 16) {
      var aa = a, bb = b, cc = c, dd = d;
      a = FF(a, b, c, d, m[i + 0], 7, -680876936);
      d = FF(d, a, b, c, m[i + 1], 12, -389564586);
      c = FF(c, d, a, b, m[i + 2], 17, 606105819);
      b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i + 4], 7, -176418897);
      d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
      c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i + 7], 22, -45705983);
      a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
      d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i + 10], 17, -42063);
      b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
      a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
      d = FF(d, a, b, c, m[i + 13], 12, -40341101);
      c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
      b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
      a = GG(a, b, c, d, m[i + 1], 5, -165796510);
      d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
      c = GG(c, d, a, b, m[i + 11], 14, 643717713);
      b = GG(b, c, d, a, m[i + 0], 20, -373897302);
      a = GG(a, b, c, d, m[i + 5], 5, -701558691);
      d = GG(d, a, b, c, m[i + 10], 9, 38016083);
      c = GG(c, d, a, b, m[i + 15], 14, -660478335);
      b = GG(b, c, d, a, m[i + 4], 20, -405537848);
      a = GG(a, b, c, d, m[i + 9], 5, 568446438);
      d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
      c = GG(c, d, a, b, m[i + 3], 14, -187363961);
      b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
      a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
      d = GG(d, a, b, c, m[i + 2], 9, -51403784);
      c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
      b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
      a = HH(a, b, c, d, m[i + 5], 4, -378558);
      d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
      b = HH(b, c, d, a, m[i + 14], 23, -35309556);
      a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
      d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
      c = HH(c, d, a, b, m[i + 7], 16, -155497632);
      b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
      a = HH(a, b, c, d, m[i + 13], 4, 681279174);
      d = HH(d, a, b, c, m[i + 0], 11, -358537222);
      c = HH(c, d, a, b, m[i + 3], 16, -722521979);
      b = HH(b, c, d, a, m[i + 6], 23, 76029189);
      a = HH(a, b, c, d, m[i + 9], 4, -640364487);
      d = HH(d, a, b, c, m[i + 12], 11, -421815835);
      c = HH(c, d, a, b, m[i + 15], 16, 530742520);
      b = HH(b, c, d, a, m[i + 2], 23, -995338651);
      a = II(a, b, c, d, m[i + 0], 6, -198630844);
      d = II(d, a, b, c, m[i + 7], 10, 1126891415);
      c = II(c, d, a, b, m[i + 14], 15, -1416354905);
      b = II(b, c, d, a, m[i + 5], 21, -57434055);
      a = II(a, b, c, d, m[i + 12], 6, 1700485571);
      d = II(d, a, b, c, m[i + 3], 10, -1894986606);
      c = II(c, d, a, b, m[i + 10], 15, -1051523);
      b = II(b, c, d, a, m[i + 1], 21, -2054922799);
      a = II(a, b, c, d, m[i + 8], 6, 1873313359);
      d = II(d, a, b, c, m[i + 15], 10, -30611744);
      c = II(c, d, a, b, m[i + 6], 15, -1560198380);
      b = II(b, c, d, a, m[i + 13], 21, 1309151649);
      a = II(a, b, c, d, m[i + 4], 6, -145523070);
      d = II(d, a, b, c, m[i + 11], 10, -1120210379);
      c = II(c, d, a, b, m[i + 2], 15, 718787259);
      b = II(b, c, d, a, m[i + 9], 21, -343485551);
      a = a + aa >>> 0;
      b = b + bb >>> 0;
      c = c + cc >>> 0;
      d = d + dd >>> 0;
    }
    return crypt2.endian([a, b, c, d]);
  };
  md52._ff = function(a, b, c, d, x, s, t2) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t2;
    return (n << s | n >>> 32 - s) + b;
  };
  md52._gg = function(a, b, c, d, x, s, t2) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t2;
    return (n << s | n >>> 32 - s) + b;
  };
  md52._hh = function(a, b, c, d, x, s, t2) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t2;
    return (n << s | n >>> 32 - s) + b;
  };
  md52._ii = function(a, b, c, d, x, s, t2) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t2;
    return (n << s | n >>> 32 - s) + b;
  };
  md52._blocksize = 16;
  md52._digestsize = 16;
  md5$1.exports = function(message, options) {
    if (message === void 0 || message === null)
      throw new Error("Illegal argument " + message);
    var digestbytes = crypt2.wordsToBytes(md52(message, options));
    return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt2.bytesToHex(digestbytes);
  };
})();
var md5Exports = md5$1.exports;
const md5 = /* @__PURE__ */ getDefaultExportFromCjs(md5Exports);
const usernameToColor = function(username) {
  let hash = username.toLowerCase();
  if (hash.match(/^([0-9a-f]{4}-?){8}$/) === null) {
    hash = md5(hash);
  }
  hash = hash.replace(/[^0-9a-f]/g, "");
  const steps = 6;
  const finalPalette = GenColors(steps);
  function hashToInt(hash2, maximum) {
    let finalInt = 0;
    const result = [];
    for (let i = 0; i < hash2.length; i++) {
      result.push(parseInt(hash2.charAt(i), 16) % 16);
    }
    for (const j in result) {
      finalInt += result[j];
    }
    return parseInt(parseInt(finalInt, 10) % maximum, 10);
  }
  return finalPalette[hashToInt(hash, steps * 3)];
};
const getAvatarUrl = (user, size, isGuest) => {
  const darkTheme = window.getComputedStyle(document.body).getPropertyValue("--background-invert-if-dark") === "invert(100%)";
  return _("/avatar" + (isGuest ? "/guest" : "") + "/{user}/{size}" + (darkTheme ? "/dark" : ""), {
    user,
    size
  });
};
const checkIfIsFullscreen = () => window.outerHeight === screen.height;
const isFullscreen = ref$1(checkIfIsFullscreen());
window.addEventListener("resize", () => {
  isFullscreen.value = checkIfIsFullscreen();
});
readonly(isFullscreen);
const encodedTlds = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4vianca6w0s2x0a2z0ure5ba0by2idu3namex3narepublic11d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2ntley5rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0cast4mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dabur3d1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0ardian6cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6logistics9properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3ncaster6d0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2psy3ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2tura4vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9dnavy5lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0america6xi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0a1b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp2w2ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4finity6ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2";
const encodedUtlds = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2";
const assign = (target, properties) => {
  for (const key in properties) {
    target[key] = properties[key];
  }
  return target;
};
const numeric = "numeric";
const ascii = "ascii";
const alpha = "alpha";
const asciinumeric = "asciinumeric";
const alphanumeric = "alphanumeric";
const domain = "domain";
const emoji = "emoji";
const scheme = "scheme";
const slashscheme = "slashscheme";
const whitespace = "whitespace";
function registerGroup(name, groups) {
  if (!(name in groups)) {
    groups[name] = [];
  }
  return groups[name];
}
function addToGroups(t2, flags, groups) {
  if (flags[numeric]) {
    flags[asciinumeric] = true;
    flags[alphanumeric] = true;
  }
  if (flags[ascii]) {
    flags[asciinumeric] = true;
    flags[alpha] = true;
  }
  if (flags[asciinumeric]) {
    flags[alphanumeric] = true;
  }
  if (flags[alpha]) {
    flags[alphanumeric] = true;
  }
  if (flags[alphanumeric]) {
    flags[domain] = true;
  }
  if (flags[emoji]) {
    flags[domain] = true;
  }
  for (const k in flags) {
    const group = registerGroup(k, groups);
    if (group.indexOf(t2) < 0) {
      group.push(t2);
    }
  }
}
function flagsForToken(t2, groups) {
  const result = {};
  for (const c in groups) {
    if (groups[c].indexOf(t2) >= 0) {
      result[c] = true;
    }
  }
  return result;
}
function State(token) {
  if (token === void 0) {
    token = null;
  }
  this.j = {};
  this.jr = [];
  this.jd = null;
  this.t = token;
}
State.groups = {};
State.prototype = {
  accepts() {
    return !!this.t;
  },
  /**
   * Follow an existing transition from the given input to the next state.
   * Does not mutate.
   * @param {string} input character or token type to transition on
   * @returns {?State<T>} the next state, if any
   */
  go(input) {
    const state = this;
    const nextState = state.j[input];
    if (nextState) {
      return nextState;
    }
    for (let i = 0; i < state.jr.length; i++) {
      const regex = state.jr[i][0];
      const nextState2 = state.jr[i][1];
      if (nextState2 && regex.test(input)) {
        return nextState2;
      }
    }
    return state.jd;
  },
  /**
   * Whether the state has a transition for the given input. Set the second
   * argument to true to only look for an exact match (and not a default or
   * regular-expression-based transition)
   * @param {string} input
   * @param {boolean} exactOnly
   */
  has(input, exactOnly) {
    if (exactOnly === void 0) {
      exactOnly = false;
    }
    return exactOnly ? input in this.j : !!this.go(input);
  },
  /**
   * Short for "transition all"; create a transition from the array of items
   * in the given list to the same final resulting state.
   * @param {string | string[]} inputs Group of inputs to transition on
   * @param {Transition<T> | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   */
  ta(inputs, next, flags, groups) {
    for (let i = 0; i < inputs.length; i++) {
      this.tt(inputs[i], next, flags, groups);
    }
  },
  /**
   * Short for "take regexp transition"; defines a transition for this state
   * when it encounters a token which matches the given regular expression
   * @param {RegExp} regexp Regular expression transition (populate first)
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  tr(regexp, next, flags, groups) {
    groups = groups || State.groups;
    let nextState;
    if (next && next.j) {
      nextState = next;
    } else {
      nextState = new State(next);
      if (flags && groups) {
        addToGroups(next, flags, groups);
      }
    }
    this.jr.push([regexp, nextState]);
    return nextState;
  },
  /**
   * Short for "take transitions", will take as many sequential transitions as
   * the length of the given input and returns the
   * resulting final state.
   * @param {string | string[]} input
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  ts(input, next, flags, groups) {
    let state = this;
    const len = input.length;
    if (!len) {
      return state;
    }
    for (let i = 0; i < len - 1; i++) {
      state = state.tt(input[i]);
    }
    return state.tt(input[len - 1], next, flags, groups);
  },
  /**
   * Short for "take transition", this is a method for building/working with
   * state machines.
   *
   * If a state already exists for the given input, returns it.
   *
   * If a token is specified, that state will emit that token when reached by
   * the linkify engine.
   *
   * If no state exists, it will be initialized with some default transitions
   * that resemble existing default transitions.
   *
   * If a state is given for the second argument, that state will be
   * transitioned to on the given input regardless of what that input
   * previously did.
   *
   * Specify a token group flags to define groups that this token belongs to.
   * The token will be added to corresponding entires in the given groups
   * object.
   *
   * @param {string} input character, token type to transition on
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of groups
   * @returns {State<T>} taken after the given input
   */
  tt(input, next, flags, groups) {
    groups = groups || State.groups;
    const state = this;
    if (next && next.j) {
      state.j[input] = next;
      return next;
    }
    const t2 = next;
    let nextState, templateState = state.go(input);
    if (templateState) {
      nextState = new State();
      assign(nextState.j, templateState.j);
      nextState.jr.push.apply(nextState.jr, templateState.jr);
      nextState.jd = templateState.jd;
      nextState.t = templateState.t;
    } else {
      nextState = new State();
    }
    if (t2) {
      if (groups) {
        if (nextState.t && typeof nextState.t === "string") {
          const allFlags = assign(flagsForToken(nextState.t, groups), flags);
          addToGroups(t2, allFlags, groups);
        } else if (flags) {
          addToGroups(t2, flags, groups);
        }
      }
      nextState.t = t2;
    }
    state.j[input] = nextState;
    return nextState;
  }
};
const ta = (state, input, next, flags, groups) => state.ta(input, next, flags, groups);
const tr = (state, regexp, next, flags, groups) => state.tr(regexp, next, flags, groups);
const ts = (state, input, next, flags, groups) => state.ts(input, next, flags, groups);
const tt = (state, input, next, flags, groups) => state.tt(input, next, flags, groups);
const WORD = "WORD";
const UWORD = "UWORD";
const LOCALHOST = "LOCALHOST";
const TLD = "TLD";
const UTLD = "UTLD";
const SCHEME = "SCHEME";
const SLASH_SCHEME = "SLASH_SCHEME";
const NUM = "NUM";
const WS = "WS";
const NL$1 = "NL";
const OPENBRACE = "OPENBRACE";
const CLOSEBRACE = "CLOSEBRACE";
const OPENBRACKET = "OPENBRACKET";
const CLOSEBRACKET = "CLOSEBRACKET";
const OPENPAREN = "OPENPAREN";
const CLOSEPAREN = "CLOSEPAREN";
const OPENANGLEBRACKET = "OPENANGLEBRACKET";
const CLOSEANGLEBRACKET = "CLOSEANGLEBRACKET";
const FULLWIDTHLEFTPAREN = "FULLWIDTHLEFTPAREN";
const FULLWIDTHRIGHTPAREN = "FULLWIDTHRIGHTPAREN";
const LEFTCORNERBRACKET = "LEFTCORNERBRACKET";
const RIGHTCORNERBRACKET = "RIGHTCORNERBRACKET";
const LEFTWHITECORNERBRACKET = "LEFTWHITECORNERBRACKET";
const RIGHTWHITECORNERBRACKET = "RIGHTWHITECORNERBRACKET";
const FULLWIDTHLESSTHAN = "FULLWIDTHLESSTHAN";
const FULLWIDTHGREATERTHAN = "FULLWIDTHGREATERTHAN";
const AMPERSAND = "AMPERSAND";
const APOSTROPHE = "APOSTROPHE";
const ASTERISK = "ASTERISK";
const AT = "AT";
const BACKSLASH = "BACKSLASH";
const BACKTICK = "BACKTICK";
const CARET = "CARET";
const COLON = "COLON";
const COMMA = "COMMA";
const DOLLAR = "DOLLAR";
const DOT = "DOT";
const EQUALS = "EQUALS";
const EXCLAMATION = "EXCLAMATION";
const HYPHEN = "HYPHEN";
const PERCENT = "PERCENT";
const PIPE = "PIPE";
const PLUS = "PLUS";
const POUND = "POUND";
const QUERY = "QUERY";
const QUOTE = "QUOTE";
const SEMI = "SEMI";
const SLASH = "SLASH";
const TILDE = "TILDE";
const UNDERSCORE = "UNDERSCORE";
const EMOJI$1 = "EMOJI";
const SYM = "SYM";
var tk = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  WORD,
  UWORD,
  LOCALHOST,
  TLD,
  UTLD,
  SCHEME,
  SLASH_SCHEME,
  NUM,
  WS,
  NL: NL$1,
  OPENBRACE,
  CLOSEBRACE,
  OPENBRACKET,
  CLOSEBRACKET,
  OPENPAREN,
  CLOSEPAREN,
  OPENANGLEBRACKET,
  CLOSEANGLEBRACKET,
  FULLWIDTHLEFTPAREN,
  FULLWIDTHRIGHTPAREN,
  LEFTCORNERBRACKET,
  RIGHTCORNERBRACKET,
  LEFTWHITECORNERBRACKET,
  RIGHTWHITECORNERBRACKET,
  FULLWIDTHLESSTHAN,
  FULLWIDTHGREATERTHAN,
  AMPERSAND,
  APOSTROPHE,
  ASTERISK,
  AT,
  BACKSLASH,
  BACKTICK,
  CARET,
  COLON,
  COMMA,
  DOLLAR,
  DOT,
  EQUALS,
  EXCLAMATION,
  HYPHEN,
  PERCENT,
  PIPE,
  PLUS,
  POUND,
  QUERY,
  QUOTE,
  SEMI,
  SLASH,
  TILDE,
  UNDERSCORE,
  EMOJI: EMOJI$1,
  SYM
});
const ASCII_LETTER = /[a-z]/;
const LETTER = new RegExp("\\p{L}", "u");
const EMOJI = new RegExp("\\p{Emoji}", "u");
const DIGIT = /\d/;
const SPACE = /\s/;
const NL = "\n";
const EMOJI_VARIATION = "️";
const EMOJI_JOINER = "‍";
let tlds = null, utlds = null;
function init$2(customSchemes) {
  if (customSchemes === void 0) {
    customSchemes = [];
  }
  const groups = {};
  State.groups = groups;
  const Start = new State();
  if (tlds == null) {
    tlds = decodeTlds(encodedTlds);
  }
  if (utlds == null) {
    utlds = decodeTlds(encodedUtlds);
  }
  tt(Start, "'", APOSTROPHE);
  tt(Start, "{", OPENBRACE);
  tt(Start, "}", CLOSEBRACE);
  tt(Start, "[", OPENBRACKET);
  tt(Start, "]", CLOSEBRACKET);
  tt(Start, "(", OPENPAREN);
  tt(Start, ")", CLOSEPAREN);
  tt(Start, "<", OPENANGLEBRACKET);
  tt(Start, ">", CLOSEANGLEBRACKET);
  tt(Start, "（", FULLWIDTHLEFTPAREN);
  tt(Start, "）", FULLWIDTHRIGHTPAREN);
  tt(Start, "「", LEFTCORNERBRACKET);
  tt(Start, "」", RIGHTCORNERBRACKET);
  tt(Start, "『", LEFTWHITECORNERBRACKET);
  tt(Start, "』", RIGHTWHITECORNERBRACKET);
  tt(Start, "＜", FULLWIDTHLESSTHAN);
  tt(Start, "＞", FULLWIDTHGREATERTHAN);
  tt(Start, "&", AMPERSAND);
  tt(Start, "*", ASTERISK);
  tt(Start, "@", AT);
  tt(Start, "`", BACKTICK);
  tt(Start, "^", CARET);
  tt(Start, ":", COLON);
  tt(Start, ",", COMMA);
  tt(Start, "$", DOLLAR);
  tt(Start, ".", DOT);
  tt(Start, "=", EQUALS);
  tt(Start, "!", EXCLAMATION);
  tt(Start, "-", HYPHEN);
  tt(Start, "%", PERCENT);
  tt(Start, "|", PIPE);
  tt(Start, "+", PLUS);
  tt(Start, "#", POUND);
  tt(Start, "?", QUERY);
  tt(Start, '"', QUOTE);
  tt(Start, "/", SLASH);
  tt(Start, ";", SEMI);
  tt(Start, "~", TILDE);
  tt(Start, "_", UNDERSCORE);
  tt(Start, "\\", BACKSLASH);
  const Num = tr(Start, DIGIT, NUM, {
    [numeric]: true
  });
  tr(Num, DIGIT, Num);
  const Word = tr(Start, ASCII_LETTER, WORD, {
    [ascii]: true
  });
  tr(Word, ASCII_LETTER, Word);
  const UWord = tr(Start, LETTER, UWORD, {
    [alpha]: true
  });
  tr(UWord, ASCII_LETTER);
  tr(UWord, LETTER, UWord);
  const Ws = tr(Start, SPACE, WS, {
    [whitespace]: true
  });
  tt(Start, NL, NL$1, {
    [whitespace]: true
  });
  tt(Ws, NL);
  tr(Ws, SPACE, Ws);
  const Emoji = tr(Start, EMOJI, EMOJI$1, {
    [emoji]: true
  });
  tr(Emoji, EMOJI, Emoji);
  tt(Emoji, EMOJI_VARIATION, Emoji);
  const EmojiJoiner = tt(Emoji, EMOJI_JOINER);
  tr(EmojiJoiner, EMOJI, Emoji);
  const wordjr = [[ASCII_LETTER, Word]];
  const uwordjr = [[ASCII_LETTER, null], [LETTER, UWord]];
  for (let i = 0; i < tlds.length; i++) {
    fastts(Start, tlds[i], TLD, WORD, wordjr);
  }
  for (let i = 0; i < utlds.length; i++) {
    fastts(Start, utlds[i], UTLD, UWORD, uwordjr);
  }
  addToGroups(TLD, {
    tld: true,
    ascii: true
  }, groups);
  addToGroups(UTLD, {
    utld: true,
    alpha: true
  }, groups);
  fastts(Start, "file", SCHEME, WORD, wordjr);
  fastts(Start, "mailto", SCHEME, WORD, wordjr);
  fastts(Start, "http", SLASH_SCHEME, WORD, wordjr);
  fastts(Start, "https", SLASH_SCHEME, WORD, wordjr);
  fastts(Start, "ftp", SLASH_SCHEME, WORD, wordjr);
  fastts(Start, "ftps", SLASH_SCHEME, WORD, wordjr);
  addToGroups(SCHEME, {
    scheme: true,
    ascii: true
  }, groups);
  addToGroups(SLASH_SCHEME, {
    slashscheme: true,
    ascii: true
  }, groups);
  customSchemes = customSchemes.sort((a, b) => a[0] > b[0] ? 1 : -1);
  for (let i = 0; i < customSchemes.length; i++) {
    const sch = customSchemes[i][0];
    const optionalSlashSlash = customSchemes[i][1];
    const flags = optionalSlashSlash ? {
      [scheme]: true
    } : {
      [slashscheme]: true
    };
    if (sch.indexOf("-") >= 0) {
      flags[domain] = true;
    } else if (!ASCII_LETTER.test(sch)) {
      flags[numeric] = true;
    } else if (DIGIT.test(sch)) {
      flags[asciinumeric] = true;
    } else {
      flags[ascii] = true;
    }
    ts(Start, sch, sch, flags);
  }
  ts(Start, "localhost", LOCALHOST, {
    ascii: true
  });
  Start.jd = new State(SYM);
  return {
    start: Start,
    tokens: assign({
      groups
    }, tk)
  };
}
function run$1(start, str) {
  const iterable = stringToArray(str.replace(/[A-Z]/g, (c) => c.toLowerCase()));
  const charCount = iterable.length;
  const tokens = [];
  let cursor = 0;
  let charCursor = 0;
  while (charCursor < charCount) {
    let state = start;
    let nextState = null;
    let tokenLength = 0;
    let latestAccepting = null;
    let sinceAccepts = -1;
    let charsSinceAccepts = -1;
    while (charCursor < charCount && (nextState = state.go(iterable[charCursor]))) {
      state = nextState;
      if (state.accepts()) {
        sinceAccepts = 0;
        charsSinceAccepts = 0;
        latestAccepting = state;
      } else if (sinceAccepts >= 0) {
        sinceAccepts += iterable[charCursor].length;
        charsSinceAccepts++;
      }
      tokenLength += iterable[charCursor].length;
      cursor += iterable[charCursor].length;
      charCursor++;
    }
    cursor -= sinceAccepts;
    charCursor -= charsSinceAccepts;
    tokenLength -= sinceAccepts;
    tokens.push({
      t: latestAccepting.t,
      // token type/name
      v: str.slice(cursor - tokenLength, cursor),
      // string value
      s: cursor - tokenLength,
      // start index
      e: cursor
      // end index (excluding)
    });
  }
  return tokens;
}
function stringToArray(str) {
  const result = [];
  const len = str.length;
  let index = 0;
  while (index < len) {
    let first = str.charCodeAt(index);
    let second;
    let char = first < 55296 || first > 56319 || index + 1 === len || (second = str.charCodeAt(index + 1)) < 56320 || second > 57343 ? str[index] : str.slice(index, index + 2);
    result.push(char);
    index += char.length;
  }
  return result;
}
function fastts(state, input, t2, defaultt, jr) {
  let next;
  const len = input.length;
  for (let i = 0; i < len - 1; i++) {
    const char = input[i];
    if (state.j[char]) {
      next = state.j[char];
    } else {
      next = new State(defaultt);
      next.jr = jr.slice();
      state.j[char] = next;
    }
    state = next;
  }
  next = new State(t2);
  next.jr = jr.slice();
  state.j[input[len - 1]] = next;
  return next;
}
function decodeTlds(encoded) {
  const words = [];
  const stack = [];
  let i = 0;
  let digits = "0123456789";
  while (i < encoded.length) {
    let popDigitCount = 0;
    while (digits.indexOf(encoded[i + popDigitCount]) >= 0) {
      popDigitCount++;
    }
    if (popDigitCount > 0) {
      words.push(stack.join(""));
      for (let popCount = parseInt(encoded.substring(i, i + popDigitCount), 10); popCount > 0; popCount--) {
        stack.pop();
      }
      i += popDigitCount;
    } else {
      stack.push(encoded[i]);
      i++;
    }
  }
  return words;
}
const defaults = {
  defaultProtocol: "http",
  events: null,
  format: noop$1,
  formatHref: noop$1,
  nl2br: false,
  tagName: "a",
  target: null,
  rel: null,
  validate: true,
  truncate: Infinity,
  className: null,
  attributes: null,
  ignoreTags: [],
  render: null
};
function Options(opts, defaultRender2) {
  if (defaultRender2 === void 0) {
    defaultRender2 = null;
  }
  let o = assign({}, defaults);
  if (opts) {
    o = assign(o, opts instanceof Options ? opts.o : opts);
  }
  const ignoredTags = o.ignoreTags;
  const uppercaseIgnoredTags = [];
  for (let i = 0; i < ignoredTags.length; i++) {
    uppercaseIgnoredTags.push(ignoredTags[i].toUpperCase());
  }
  this.o = o;
  if (defaultRender2) {
    this.defaultRender = defaultRender2;
  }
  this.ignoreTags = uppercaseIgnoredTags;
}
Options.prototype = {
  o: defaults,
  /**
   * @type string[]
   */
  ignoreTags: [],
  /**
   * @param {IntermediateRepresentation} ir
   * @returns {any}
   */
  defaultRender(ir) {
    return ir;
  },
  /**
   * Returns true or false based on whether a token should be displayed as a
   * link based on the user options.
   * @param {MultiToken} token
   * @returns {boolean}
   */
  check(token) {
    return this.get("validate", token.toString(), token);
  },
  // Private methods
  /**
   * Resolve an option's value based on the value of the option and the given
   * params. If operator and token are specified and the target option is
   * callable, automatically calls the function with the given argument.
   * @template {keyof Opts} K
   * @param {K} key Name of option to use
   * @param {string} [operator] will be passed to the target option if it's a
   * function. If not specified, RAW function value gets returned
   * @param {MultiToken} [token] The token from linkify.tokenize
   * @returns {Opts[K] | any}
   */
  get(key, operator, token) {
    const isCallable = operator != null;
    let option = this.o[key];
    if (!option) {
      return option;
    }
    if (typeof option === "object") {
      option = token.t in option ? option[token.t] : defaults[key];
      if (typeof option === "function" && isCallable) {
        option = option(operator, token);
      }
    } else if (typeof option === "function" && isCallable) {
      option = option(operator, token.t, token);
    }
    return option;
  },
  /**
   * @template {keyof Opts} L
   * @param {L} key Name of options object to use
   * @param {string} [operator]
   * @param {MultiToken} [token]
   * @returns {Opts[L] | any}
   */
  getObj(key, operator, token) {
    let obj = this.o[key];
    if (typeof obj === "function" && operator != null) {
      obj = obj(operator, token.t, token);
    }
    return obj;
  },
  /**
   * Convert the given token to a rendered element that may be added to the
   * calling-interface's DOM
   * @param {MultiToken} token Token to render to an HTML element
   * @returns {any} Render result; e.g., HTML string, DOM element, React
   *   Component, etc.
   */
  render(token) {
    const ir = token.render(this);
    const renderFn = this.get("render", null, token) || this.defaultRender;
    return renderFn(ir, token.t, token);
  }
};
function noop$1(val) {
  return val;
}
function MultiToken(value, tokens) {
  this.t = "token";
  this.v = value;
  this.tk = tokens;
}
MultiToken.prototype = {
  isLink: false,
  /**
   * Return the string this token represents.
   * @return {string}
   */
  toString() {
    return this.v;
  },
  /**
   * What should the value for this token be in the `href` HTML attribute?
   * Returns the `.toString` value by default.
   * @param {string} [scheme]
   * @return {string}
  */
  toHref(scheme2) {
    return this.toString();
  },
  /**
   * @param {Options} options Formatting options
   * @returns {string}
   */
  toFormattedString(options) {
    const val = this.toString();
    const truncate = options.get("truncate", val, this);
    const formatted = options.get("format", val, this);
    return truncate && formatted.length > truncate ? formatted.substring(0, truncate) + "…" : formatted;
  },
  /**
   *
   * @param {Options} options
   * @returns {string}
   */
  toFormattedHref(options) {
    return options.get("formatHref", this.toHref(options.get("defaultProtocol")), this);
  },
  /**
   * The start index of this token in the original input string
   * @returns {number}
   */
  startIndex() {
    return this.tk[0].s;
  },
  /**
   * The end index of this token in the original input string (up to this
   * index but not including it)
   * @returns {number}
   */
  endIndex() {
    return this.tk[this.tk.length - 1].e;
  },
  /**
  	Returns an object  of relevant values for this token, which includes keys
  	* type - Kind of token ('url', 'email', etc.)
  	* value - Original text
  	* href - The value that should be added to the anchor tag's href
  		attribute
  		@method toObject
  	@param {string} [protocol] `'http'` by default
  */
  toObject(protocol) {
    if (protocol === void 0) {
      protocol = defaults.defaultProtocol;
    }
    return {
      type: this.t,
      value: this.toString(),
      isLink: this.isLink,
      href: this.toHref(protocol),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   *
   * @param {Options} options Formatting option
   */
  toFormattedObject(options) {
    return {
      type: this.t,
      value: this.toFormattedString(options),
      isLink: this.isLink,
      href: this.toFormattedHref(options),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   * Whether this token should be rendered as a link according to the given options
   * @param {Options} options
   * @returns {boolean}
   */
  validate(options) {
    return options.get("validate", this.toString(), this);
  },
  /**
   * Return an object that represents how this link should be rendered.
   * @param {Options} options Formattinng options
   */
  render(options) {
    const token = this;
    const href = this.toHref(options.get("defaultProtocol"));
    const formattedHref = options.get("formatHref", href, this);
    const tagName = options.get("tagName", href, token);
    const content = this.toFormattedString(options);
    const attributes = {};
    const className = options.get("className", href, token);
    const target = options.get("target", href, token);
    const rel = options.get("rel", href, token);
    const attrs = options.getObj("attributes", href, token);
    const eventListeners = options.getObj("events", href, token);
    attributes.href = formattedHref;
    if (className) {
      attributes.class = className;
    }
    if (target) {
      attributes.target = target;
    }
    if (rel) {
      attributes.rel = rel;
    }
    if (attrs) {
      assign(attributes, attrs);
    }
    return {
      tagName,
      attributes,
      content,
      eventListeners
    };
  }
};
function createTokenClass(type, props) {
  class Token extends MultiToken {
    constructor(value, tokens) {
      super(value, tokens);
      this.t = type;
    }
  }
  for (const p in props) {
    Token.prototype[p] = props[p];
  }
  Token.t = type;
  return Token;
}
const Email = createTokenClass("email", {
  isLink: true,
  toHref() {
    return "mailto:" + this.toString();
  }
});
const Text = createTokenClass("text");
const Nl = createTokenClass("nl");
const Url = createTokenClass("url", {
  isLink: true,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(scheme2) {
    if (scheme2 === void 0) {
      scheme2 = defaults.defaultProtocol;
    }
    return this.hasProtocol() ? this.v : "".concat(scheme2, "://").concat(this.v);
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const tokens = this.tk;
    return tokens.length >= 2 && tokens[0].t !== LOCALHOST && tokens[1].t === COLON;
  }
});
const makeState = (arg) => new State(arg);
function init$1(_ref) {
  let {
    groups
  } = _ref;
  const qsAccepting = groups.domain.concat([AMPERSAND, ASTERISK, AT, BACKSLASH, BACKTICK, CARET, DOLLAR, EQUALS, HYPHEN, NUM, PERCENT, PIPE, PLUS, POUND, SLASH, SYM, TILDE, UNDERSCORE]);
  const qsNonAccepting = [APOSTROPHE, COLON, COMMA, DOT, EXCLAMATION, QUERY, QUOTE, SEMI, OPENANGLEBRACKET, CLOSEANGLEBRACKET, OPENBRACE, CLOSEBRACE, CLOSEBRACKET, OPENBRACKET, OPENPAREN, CLOSEPAREN, FULLWIDTHLEFTPAREN, FULLWIDTHRIGHTPAREN, LEFTCORNERBRACKET, RIGHTCORNERBRACKET, LEFTWHITECORNERBRACKET, RIGHTWHITECORNERBRACKET, FULLWIDTHLESSTHAN, FULLWIDTHGREATERTHAN];
  const localpartAccepting = [AMPERSAND, APOSTROPHE, ASTERISK, BACKSLASH, BACKTICK, CARET, DOLLAR, EQUALS, HYPHEN, OPENBRACE, CLOSEBRACE, PERCENT, PIPE, PLUS, POUND, QUERY, SLASH, SYM, TILDE, UNDERSCORE];
  const Start = makeState();
  const Localpart = tt(Start, TILDE);
  ta(Localpart, localpartAccepting, Localpart);
  ta(Localpart, groups.domain, Localpart);
  const Domain = makeState(), Scheme = makeState(), SlashScheme = makeState();
  ta(Start, groups.domain, Domain);
  ta(Start, groups.scheme, Scheme);
  ta(Start, groups.slashscheme, SlashScheme);
  ta(Domain, localpartAccepting, Localpart);
  ta(Domain, groups.domain, Domain);
  const LocalpartAt = tt(Domain, AT);
  tt(Localpart, AT, LocalpartAt);
  tt(Scheme, AT, LocalpartAt);
  tt(SlashScheme, AT, LocalpartAt);
  const LocalpartDot = tt(Localpart, DOT);
  ta(LocalpartDot, localpartAccepting, Localpart);
  ta(LocalpartDot, groups.domain, Localpart);
  const EmailDomain = makeState();
  ta(LocalpartAt, groups.domain, EmailDomain);
  ta(EmailDomain, groups.domain, EmailDomain);
  const EmailDomainDot = tt(EmailDomain, DOT);
  ta(EmailDomainDot, groups.domain, EmailDomain);
  const Email$1 = makeState(Email);
  ta(EmailDomainDot, groups.tld, Email$1);
  ta(EmailDomainDot, groups.utld, Email$1);
  tt(LocalpartAt, LOCALHOST, Email$1);
  const EmailDomainHyphen = tt(EmailDomain, HYPHEN);
  ta(EmailDomainHyphen, groups.domain, EmailDomain);
  ta(Email$1, groups.domain, EmailDomain);
  tt(Email$1, DOT, EmailDomainDot);
  tt(Email$1, HYPHEN, EmailDomainHyphen);
  const EmailColon = tt(Email$1, COLON);
  ta(EmailColon, groups.numeric, Email);
  const DomainHyphen = tt(Domain, HYPHEN);
  const DomainDot = tt(Domain, DOT);
  ta(DomainHyphen, groups.domain, Domain);
  ta(DomainDot, localpartAccepting, Localpart);
  ta(DomainDot, groups.domain, Domain);
  const DomainDotTld = makeState(Url);
  ta(DomainDot, groups.tld, DomainDotTld);
  ta(DomainDot, groups.utld, DomainDotTld);
  ta(DomainDotTld, groups.domain, Domain);
  ta(DomainDotTld, localpartAccepting, Localpart);
  tt(DomainDotTld, DOT, DomainDot);
  tt(DomainDotTld, HYPHEN, DomainHyphen);
  tt(DomainDotTld, AT, LocalpartAt);
  const DomainDotTldColon = tt(DomainDotTld, COLON);
  const DomainDotTldColonPort = makeState(Url);
  ta(DomainDotTldColon, groups.numeric, DomainDotTldColonPort);
  const Url$1 = makeState(Url);
  const UrlNonaccept = makeState();
  ta(Url$1, qsAccepting, Url$1);
  ta(Url$1, qsNonAccepting, UrlNonaccept);
  ta(UrlNonaccept, qsAccepting, Url$1);
  ta(UrlNonaccept, qsNonAccepting, UrlNonaccept);
  tt(DomainDotTld, SLASH, Url$1);
  tt(DomainDotTldColonPort, SLASH, Url$1);
  const SchemeColon = tt(Scheme, COLON);
  const SlashSchemeColon = tt(SlashScheme, COLON);
  const SlashSchemeColonSlash = tt(SlashSchemeColon, SLASH);
  const UriPrefix = tt(SlashSchemeColonSlash, SLASH);
  ta(Scheme, groups.domain, Domain);
  tt(Scheme, DOT, DomainDot);
  tt(Scheme, HYPHEN, DomainHyphen);
  ta(SlashScheme, groups.domain, Domain);
  tt(SlashScheme, DOT, DomainDot);
  tt(SlashScheme, HYPHEN, DomainHyphen);
  ta(SchemeColon, groups.domain, Url$1);
  tt(SchemeColon, SLASH, Url$1);
  ta(UriPrefix, groups.domain, Url$1);
  ta(UriPrefix, qsAccepting, Url$1);
  tt(UriPrefix, SLASH, Url$1);
  const bracketPairs = [
    [OPENBRACE, CLOSEBRACE],
    // {}
    [OPENBRACKET, CLOSEBRACKET],
    // []
    [OPENPAREN, CLOSEPAREN],
    // ()
    [OPENANGLEBRACKET, CLOSEANGLEBRACKET],
    // <>
    [FULLWIDTHLEFTPAREN, FULLWIDTHRIGHTPAREN],
    // （）
    [LEFTCORNERBRACKET, RIGHTCORNERBRACKET],
    // 「」
    [LEFTWHITECORNERBRACKET, RIGHTWHITECORNERBRACKET],
    // 『』
    [FULLWIDTHLESSTHAN, FULLWIDTHGREATERTHAN]
    // ＜＞
  ];
  for (let i = 0; i < bracketPairs.length; i++) {
    const [OPEN, CLOSE] = bracketPairs[i];
    const UrlOpen = tt(Url$1, OPEN);
    tt(UrlNonaccept, OPEN, UrlOpen);
    tt(UrlOpen, CLOSE, Url$1);
    const UrlOpenQ = makeState(Url);
    ta(UrlOpen, qsAccepting, UrlOpenQ);
    const UrlOpenSyms = makeState();
    ta(UrlOpen, qsNonAccepting);
    ta(UrlOpenQ, qsAccepting, UrlOpenQ);
    ta(UrlOpenQ, qsNonAccepting, UrlOpenSyms);
    ta(UrlOpenSyms, qsAccepting, UrlOpenQ);
    ta(UrlOpenSyms, qsNonAccepting, UrlOpenSyms);
    tt(UrlOpenQ, CLOSE, Url$1);
    tt(UrlOpenSyms, CLOSE, Url$1);
  }
  tt(Start, LOCALHOST, DomainDotTld);
  tt(Start, NL$1, Nl);
  return {
    start: Start,
    tokens: tk
  };
}
function run(start, input, tokens) {
  let len = tokens.length;
  let cursor = 0;
  let multis = [];
  let textTokens = [];
  while (cursor < len) {
    let state = start;
    let secondState = null;
    let nextState = null;
    let multiLength = 0;
    let latestAccepting = null;
    let sinceAccepts = -1;
    while (cursor < len && !(secondState = state.go(tokens[cursor].t))) {
      textTokens.push(tokens[cursor++]);
    }
    while (cursor < len && (nextState = secondState || state.go(tokens[cursor].t))) {
      secondState = null;
      state = nextState;
      if (state.accepts()) {
        sinceAccepts = 0;
        latestAccepting = state;
      } else if (sinceAccepts >= 0) {
        sinceAccepts++;
      }
      cursor++;
      multiLength++;
    }
    if (sinceAccepts < 0) {
      cursor -= multiLength;
      if (cursor < len) {
        textTokens.push(tokens[cursor]);
        cursor++;
      }
    } else {
      if (textTokens.length > 0) {
        multis.push(initMultiToken(Text, input, textTokens));
        textTokens = [];
      }
      cursor -= sinceAccepts;
      multiLength -= sinceAccepts;
      const Multi = latestAccepting.t;
      const subtokens = tokens.slice(cursor - multiLength, cursor);
      multis.push(initMultiToken(Multi, input, subtokens));
    }
  }
  if (textTokens.length > 0) {
    multis.push(initMultiToken(Text, input, textTokens));
  }
  return multis;
}
function initMultiToken(Multi, input, tokens) {
  const startIdx = tokens[0].s;
  const endIdx = tokens[tokens.length - 1].e;
  const value = input.slice(startIdx, endIdx);
  return new Multi(value, tokens);
}
const INIT = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: false
};
function init() {
  INIT.scanner = init$2(INIT.customSchemes);
  for (let i = 0; i < INIT.tokenQueue.length; i++) {
    INIT.tokenQueue[i][1]({
      scanner: INIT.scanner
    });
  }
  INIT.parser = init$1(INIT.scanner.tokens);
  for (let i = 0; i < INIT.pluginQueue.length; i++) {
    INIT.pluginQueue[i][1]({
      scanner: INIT.scanner,
      parser: INIT.parser
    });
  }
  INIT.initialized = true;
}
function tokenize(str) {
  if (!INIT.initialized) {
    init();
  }
  return run(INIT.parser.start, str, run$1(INIT.scanner.start, str));
}
function escapeText(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(href) {
  return href.replace(/"/g, "&quot;");
}
function attributesToString(attributes) {
  const result = [];
  for (const attr in attributes) {
    let val = attributes[attr] + "";
    result.push("".concat(attr, '="').concat(escapeAttr(val), '"'));
  }
  return result.join(" ");
}
function defaultRender(_ref) {
  let {
    tagName,
    attributes,
    content
  } = _ref;
  return "<".concat(tagName, " ").concat(attributesToString(attributes), ">").concat(escapeText(content), "</").concat(tagName, ">");
}
function linkifyStr(str, opts) {
  if (opts === void 0) {
    opts = {};
  }
  opts = new Options(opts, defaultRender);
  const tokens = tokenize(str);
  const result = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.t === "nl" && opts.get("nl2br")) {
      result.push("<br>\n");
    } else if (!token.isLink || !opts.check(token)) {
      result.push(escapeText(token.toString()));
    } else {
      result.push(opts.render(token));
    }
  }
  return result.join("");
}
if (!String.prototype.linkify) {
  Object.defineProperty(String.prototype, "linkify", {
    writable: false,
    value: function linkify(options) {
      return linkifyStr(this, options);
    }
  });
}
var striptags = { exports: {} };
(function(module) {
  (function(global) {
    if (typeof Symbol2 !== "function") {
      var Symbol2 = function(name) {
        return name;
      };
      Symbol2.nonNative = true;
    }
    const STATE_PLAINTEXT = Symbol2("plaintext");
    const STATE_HTML = Symbol2("html");
    const STATE_COMMENT = Symbol2("comment");
    const ALLOWED_TAGS_REGEX = /<(\w*)>/g;
    const NORMALIZE_TAG_REGEX = /<\/?([^\s\/>]+)/;
    function striptags2(html, allowable_tags, tag_replacement) {
      html = html || "";
      allowable_tags = allowable_tags || [];
      tag_replacement = tag_replacement || "";
      let context = init_context(allowable_tags, tag_replacement);
      return striptags_internal(html, context);
    }
    function init_striptags_stream(allowable_tags, tag_replacement) {
      allowable_tags = allowable_tags || [];
      tag_replacement = tag_replacement || "";
      let context = init_context(allowable_tags, tag_replacement);
      return function striptags_stream(html) {
        return striptags_internal(html || "", context);
      };
    }
    striptags2.init_streaming_mode = init_striptags_stream;
    function init_context(allowable_tags, tag_replacement) {
      allowable_tags = parse_allowable_tags(allowable_tags);
      return {
        allowable_tags,
        tag_replacement,
        state: STATE_PLAINTEXT,
        tag_buffer: "",
        depth: 0,
        in_quote_char: ""
      };
    }
    function striptags_internal(html, context) {
      if (typeof html != "string") {
        throw new TypeError("'html' parameter must be a string");
      }
      let allowable_tags = context.allowable_tags;
      let tag_replacement = context.tag_replacement;
      let state = context.state;
      let tag_buffer = context.tag_buffer;
      let depth = context.depth;
      let in_quote_char = context.in_quote_char;
      let output = "";
      for (let idx = 0, length = html.length; idx < length; idx++) {
        let char = html[idx];
        if (state === STATE_PLAINTEXT) {
          switch (char) {
            case "<":
              state = STATE_HTML;
              tag_buffer += char;
              break;
            default:
              output += char;
              break;
          }
        } else if (state === STATE_HTML) {
          switch (char) {
            case "<":
              if (in_quote_char) {
                break;
              }
              depth++;
              break;
            case ">":
              if (in_quote_char) {
                break;
              }
              if (depth) {
                depth--;
                break;
              }
              in_quote_char = "";
              state = STATE_PLAINTEXT;
              tag_buffer += ">";
              if (allowable_tags.has(normalize_tag(tag_buffer))) {
                output += tag_buffer;
              } else {
                output += tag_replacement;
              }
              tag_buffer = "";
              break;
            case '"':
            case "'":
              if (char === in_quote_char) {
                in_quote_char = "";
              } else {
                in_quote_char = in_quote_char || char;
              }
              tag_buffer += char;
              break;
            case "-":
              if (tag_buffer === "<!-") {
                state = STATE_COMMENT;
              }
              tag_buffer += char;
              break;
            case " ":
            case "\n":
              if (tag_buffer === "<") {
                state = STATE_PLAINTEXT;
                output += "< ";
                tag_buffer = "";
                break;
              }
              tag_buffer += char;
              break;
            default:
              tag_buffer += char;
              break;
          }
        } else if (state === STATE_COMMENT) {
          switch (char) {
            case ">":
              if (tag_buffer.slice(-2) == "--") {
                state = STATE_PLAINTEXT;
              }
              tag_buffer = "";
              break;
            default:
              tag_buffer += char;
              break;
          }
        }
      }
      context.state = state;
      context.tag_buffer = tag_buffer;
      context.depth = depth;
      context.in_quote_char = in_quote_char;
      return output;
    }
    function parse_allowable_tags(allowable_tags) {
      let tag_set = /* @__PURE__ */ new Set();
      if (typeof allowable_tags === "string") {
        let match;
        while (match = ALLOWED_TAGS_REGEX.exec(allowable_tags)) {
          tag_set.add(match[1]);
        }
      } else if (!Symbol2.nonNative && typeof allowable_tags[Symbol2.iterator] === "function") {
        tag_set = new Set(allowable_tags);
      } else if (typeof allowable_tags.forEach === "function") {
        allowable_tags.forEach(tag_set.add, tag_set);
      }
      return tag_set;
    }
    function normalize_tag(tag_buffer) {
      let match = NORMALIZE_TAG_REGEX.exec(tag_buffer);
      return match ? match[1].toLowerCase() : null;
    }
    if (module.exports) {
      module.exports = striptags2;
    } else {
      global.striptags = striptags2;
    }
  })(commonjsGlobal);
})(striptags);
const getRoute = (router, url) => {
  const removePrefix = (str, prefix) => str.startsWith(prefix) ? str.slice(prefix.length) : str;
  const removePrefixes = (str, ...prefixes) => prefixes.reduce((acc, prefix) => removePrefix(acc, prefix), str);
  if (!router) {
    return null;
  }
  const isAbsoluteURL = /^https?:\/\//.test(url);
  const isNonHttpLink = /^[a-z][a-z0-9+.-]*:.+/.test(url);
  if (!isAbsoluteURL && isNonHttpLink) {
    return null;
  }
  if (isAbsoluteURL && !url.startsWith(w())) {
    return null;
  }
  if (!isAbsoluteURL && !url.startsWith("/")) {
    return null;
  }
  const relativeUrl = isAbsoluteURL ? removePrefixes(url, w(), "/index.php") : url;
  const relativeRouterBase = removePrefixes(router.history.base, f(), "/index.php");
  const potentialRouterPath = removePrefixes(relativeUrl, relativeRouterBase) || "/";
  const route = router.resolve(potentialRouterPath).route;
  if (!route.matched.length) {
    return null;
  }
  return route.fullPath;
};
Vue.util.warn;
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
const isIOS = /* @__PURE__ */ getIsIOS();
function getIsIOS() {
  var _a, _b;
  return isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((_b = window == null ? void 0 : window.navigator) == null ? void 0 : _b.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
const directiveHooks = {
  mounted: "inserted",
  updated: "componentUpdated",
  unmounted: "unbind"
};
function toRef(...args) {
  if (args.length !== 1)
    return toRef$1(...args);
  const r = args[0];
  return typeof r === "function" ? readonly(customRef(() => ({ get: r, set: noop }))) : ref$1(r);
}
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
const defaultWindow = isClient ? window : void 0;
function useEventListener(...args) {
  let target;
  let events;
  let listeners;
  let options;
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events))
    events = [events];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register2 = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      const optionsClone = isObject(options2) ? __spreadValues({}, options2) : options2;
      cleanups.push(
        ...events.flatMap((event) => {
          return listeners.map((listener) => register2(el, event, listener, optionsClone));
        })
      );
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
let _iOSWorkaround = false;
function onClickOutside(target, handler, options = {}) {
  const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
  if (!window2)
    return noop;
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true;
    Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop));
    window2.document.documentElement.addEventListener("click", noop);
  }
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return ignore.some((target2) => {
      if (typeof target2 === "string") {
        return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
      } else {
        const el = unrefElement(target2);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  const listener = (event) => {
    const el = unrefElement(target);
    if (!el || el === event.target || event.composedPath().includes(el))
      return;
    if (event.detail === 0)
      shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  const cleanup = [
    useEventListener(window2, "click", listener, { passive: true, capture }),
    useEventListener(window2, "pointerdown", (e2) => {
      const el = unrefElement(target);
      shouldListen = !shouldIgnore(e2) && !!(el && !e2.composedPath().includes(el));
    }, { passive: true }),
    detectIframe && useEventListener(window2, "blur", (event) => {
      setTimeout(() => {
        var _a;
        const el = unrefElement(target);
        if (((_a = window2.document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement))) {
          handler(event);
        }
      }, 0);
    })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
const vOnClickOutside = {
  [directiveHooks.mounted](el, binding) {
    const capture = !binding.modifiers.bubble;
    if (typeof binding.value === "function") {
      el.__onClickOutside_stop = onClickOutside(el, binding.value, { capture });
    } else {
      const [handler, options] = binding.value;
      el.__onClickOutside_stop = onClickOutside(el, handler, Object.assign({ capture }, options));
    }
  },
  [directiveHooks.unmounted](el) {
    el.__onClickOutside_stop();
  }
};
function resolveElement(el) {
  if (typeof Window !== "undefined" && el instanceof Window)
    return el.document.documentElement;
  if (typeof Document !== "undefined" && el instanceof Document)
    return el.documentElement;
  return el;
}
function checkOverflowScroll(ele) {
  const style = window.getComputedStyle(ele);
  if (style.overflowX === "scroll" || style.overflowY === "scroll" || style.overflowX === "auto" && ele.clientWidth < ele.scrollWidth || style.overflowY === "auto" && ele.clientHeight < ele.scrollHeight) {
    return true;
  } else {
    const parent = ele.parentNode;
    if (!parent || parent.tagName === "BODY")
      return false;
    return checkOverflowScroll(parent);
  }
}
function preventDefault(rawEvent) {
  const e2 = rawEvent || window.event;
  const _target = e2.target;
  if (checkOverflowScroll(_target))
    return false;
  if (e2.touches.length > 1)
    return true;
  if (e2.preventDefault)
    e2.preventDefault();
  return false;
}
const elInitialOverflow = /* @__PURE__ */ new WeakMap();
function useScrollLock(element, initialState = false) {
  const isLocked = ref$1(initialState);
  let stopTouchMoveListener = null;
  let initialOverflow = "";
  watch(toRef(element), (el) => {
    const target = resolveElement(toValue(el));
    if (target) {
      const ele = target;
      if (!elInitialOverflow.get(ele))
        elInitialOverflow.set(ele, ele.style.overflow);
      if (ele.style.overflow !== "hidden")
        initialOverflow = ele.style.overflow;
      if (ele.style.overflow === "hidden")
        return isLocked.value = true;
      if (isLocked.value)
        return ele.style.overflow = "hidden";
    }
  }, {
    immediate: true
  });
  const lock = () => {
    const el = resolveElement(toValue(element));
    if (!el || isLocked.value)
      return;
    if (isIOS) {
      stopTouchMoveListener = useEventListener(
        el,
        "touchmove",
        (e2) => {
          preventDefault(e2);
        },
        { passive: false }
      );
    }
    el.style.overflow = "hidden";
    isLocked.value = true;
  };
  const unlock = () => {
    const el = resolveElement(toValue(element));
    if (!el || !isLocked.value)
      return;
    if (isIOS)
      stopTouchMoveListener == null ? void 0 : stopTouchMoveListener();
    el.style.overflow = initialOverflow;
    elInitialOverflow.delete(el);
    isLocked.value = false;
  };
  tryOnScopeDispose(unlock);
  return computed({
    get() {
      return isLocked.value;
    },
    set(v2) {
      if (v2)
        lock();
      else unlock();
    }
  });
}
function onScrollLock() {
  let isMounted = false;
  const state = ref$1(false);
  return (el, binding) => {
    state.value = binding.value;
    if (isMounted)
      return;
    isMounted = true;
    const isLocked = useScrollLock(el, binding.value);
    watch(state, (v2) => isLocked.value = v2);
  };
}
onScrollLock();
const userStatus = {
  data() {
    return {
      hasStatus: false,
      userStatus: {
        status: null,
        message: null,
        icon: null
      }
    };
  },
  methods: {
    /**
     * Fetches the user-status from the server
     *
     * @param {string} userId UserId of the user to fetch the status for
     *
     * @return {Promise<void>}
     */
    async fetchUserStatus(userId) {
      var _a, _b;
      if (!userId) {
        return;
      }
      const capabilities = e();
      if (!Object.prototype.hasOwnProperty.call(capabilities, "user_status") || !capabilities.user_status.enabled) {
        return;
      }
      if (!getCurrentUser()) {
        return;
      }
      try {
        const { data } = await cancelableClient.get(v("apps/user_status/api/v1/statuses/{userId}", { userId }));
        const {
          status,
          message,
          icon
        } = data.ocs.data;
        this.userStatus.status = status;
        this.userStatus.message = message || "";
        this.userStatus.icon = icon || "";
        this.hasStatus = true;
      } catch (e2) {
        if (e2.response.status === 404 && ((_b = (_a = e2.response.data.ocs) == null ? void 0 : _a.data) == null ? void 0 : _b.length) === 0) {
          return;
        }
        console.error(e2);
      }
    }
  }
};
register(t10);
const browserStorage = getBuilder_1("nextcloud").persist().build();
function getUserHasAvatar(userId) {
  const flag = browserStorage.getItem("user-has-avatar." + userId);
  if (typeof flag === "string") {
    return Boolean(flag);
  }
  return null;
}
function setUserHasAvatar(userId, flag) {
  if (userId) {
    browserStorage.setItem("user-has-avatar." + userId, flag);
  }
}
const _sfc_main$3 = {
  name: "NcAvatar",
  directives: {
    ClickOutside: vOnClickOutside
  },
  components: {
    DotsHorizontal,
    NcActions,
    NcButton,
    NcIconSvgWrapper,
    NcLoadingIcon,
    NcUserStatusIcon
  },
  mixins: [userStatus],
  props: {
    /**
     * Set a custom url to the avatar image
     * either the url, user or displayName property must be defined
     */
    url: {
      type: String,
      default: void 0
    },
    /**
     * Set a css icon-class for an icon to be used instead of the avatar.
     */
    iconClass: {
      type: String,
      default: void 0
    },
    /**
     * Set the user id to fetch the avatar
     * either the url, user or displayName property must be defined
     */
    user: {
      type: String,
      default: void 0
    },
    /**
     * Whether or not to display the user-status
     */
    showUserStatus: {
      type: Boolean,
      default: true
    },
    /**
     * Whether or not to the status-icon should be used instead of online/away
     */
    showUserStatusCompact: {
      type: Boolean,
      default: true
    },
    /**
     * When the user status was preloaded via another source it can be handed in with this property to save the request.
     * If this property is not set the status will be fetched automatically.
     * If a preloaded no-status is available provide this object with properties "status", "icon" and "message" set to null.
     */
    preloadedUserStatus: {
      type: Object,
      default: void 0
    },
    /**
     * Is the user a guest user (then we have to user a different endpoint)
     */
    isGuest: {
      type: Boolean,
      default: false
    },
    /**
     * Set a display name that will be rendered as a tooltip
     * either the url, user or displayName property must be defined
     * specify just the displayname to generate a placeholder avatar without
     * trying to fetch the avatar based on the user id
     */
    displayName: {
      type: String,
      default: void 0
    },
    /**
     * Set a size in px for the rendered avatar
     */
    size: {
      type: Number,
      default: 32
    },
    /**
     * Placeholder avatars will be automatically generated when this is set to true
     */
    allowPlaceholder: {
      type: Boolean,
      default: true
    },
    /**
     * Disable the tooltip
     */
    disableTooltip: {
      type: Boolean,
      default: false
    },
    /**
     * Disable the menu
     */
    disableMenu: {
      type: Boolean,
      default: false
    },
    /**
     * Declares a custom tooltip when not null
     * Fallback will be the displayName
     *
     * requires disableTooltip not to be set to true
     */
    tooltipMessage: {
      type: String,
      default: null
    },
    /**
     * Declares username is not a user's name, when true.
     * Prevents loading user's avatar from server and forces generating colored initials,
     * i.e. if the user is a group
     */
    isNoUser: {
      type: Boolean,
      default: false
    },
    /**
     * Selector for the popover menu container
     */
    menuContainer: {
      type: [String, Object, Element, Boolean],
      default: "body"
    }
  },
  data() {
    return {
      avatarUrlLoaded: null,
      avatarSrcSetLoaded: null,
      userDoesNotExist: false,
      isAvatarLoaded: false,
      isMenuLoaded: false,
      contactsMenuLoading: false,
      contactsMenuActions: [],
      contactsMenuOpenState: false
    };
  },
  computed: {
    avatarAriaLabel() {
      var _a, _b;
      if (!this.hasMenu) {
        return;
      }
      if (this.canDisplayUserStatus || this.showUserStatusIconOnAvatar) {
        return t$1("Avatar of {displayName}, {status}", { displayName: (_a = this.displayName) != null ? _a : this.user, status: getUserStatusText(this.userStatus.status) });
      }
      return t$1("Avatar of {displayName}", { displayName: (_b = this.displayName) != null ? _b : this.user });
    },
    canDisplayUserStatus() {
      return this.showUserStatus && this.hasStatus && ["online", "away", "busy", "dnd"].includes(this.userStatus.status);
    },
    showUserStatusIconOnAvatar() {
      return this.showUserStatus && this.showUserStatusCompact && this.hasStatus && this.userStatus.status !== "dnd" && this.userStatus.icon;
    },
    /**
     * The user identifier, either the display name if set or the user property
     * If both properties are not set an empty string is returned
     */
    userIdentifier() {
      if (this.isDisplayNameDefined) {
        return this.displayName;
      }
      if (this.isUserDefined) {
        return this.user;
      }
      return "";
    },
    isUserDefined() {
      return typeof this.user !== "undefined";
    },
    isDisplayNameDefined() {
      return typeof this.displayName !== "undefined";
    },
    isUrlDefined() {
      return typeof this.url !== "undefined";
    },
    hasMenu() {
      var _a;
      if (this.disableMenu) {
        return false;
      }
      if (this.isMenuLoaded) {
        return this.menu.length > 0;
      }
      return !(this.user === ((_a = getCurrentUser()) == null ? void 0 : _a.uid) || this.userDoesNotExist || this.url);
    },
    /**
     * True if initials should be shown as the user icon fallback
     */
    showInitials() {
      return this.allowPlaceholder && this.userDoesNotExist && !(this.iconClass || this.$slots.icon);
    },
    avatarStyle() {
      const style = {
        "--size": this.size + "px",
        lineHeight: this.size + "px",
        fontSize: Math.round(this.size * 0.45) + "px"
      };
      return style;
    },
    initialsWrapperStyle() {
      const { r, g, b } = usernameToColor(this.userIdentifier);
      return {
        backgroundColor: "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", 0.1)")
      };
    },
    initialsStyle() {
      const { r, g, b } = usernameToColor(this.userIdentifier);
      return {
        color: "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")")
      };
    },
    tooltip() {
      if (this.disableTooltip) {
        return false;
      }
      if (this.tooltipMessage) {
        return this.tooltipMessage;
      }
      return this.displayName;
    },
    /**
     * Get the (max. two) initials of the user as uppcase string
     */
    initials() {
      let initials = "?";
      if (this.showInitials) {
        const user = this.userIdentifier.trim();
        if (user === "") {
          return initials;
        }
        const filteredChars = user.match(new RegExp("[\\p{L}\\p{N}\\s]", "gu"));
        if (filteredChars == null) {
          return initials;
        }
        const filtered = filteredChars.join("");
        const idx = filtered.lastIndexOf(" ");
        initials = String.fromCodePoint(filtered.codePointAt(0));
        if (idx !== -1) {
          initials = initials.concat(String.fromCodePoint(filtered.codePointAt(idx + 1)));
        }
      }
      return initials.toLocaleUpperCase();
    },
    menu() {
      const actions = this.contactsMenuActions.map((item) => {
        const route = getRoute(this.$router, item.hyperlink);
        return {
          ncActionComponent: route ? NcActionRouter : NcActionLink,
          ncActionComponentProps: route ? {
            to: route,
            icon: item.icon
          } : {
            href: item.hyperlink,
            icon: item.icon
          },
          text: item.title
        };
      });
      function escape2(html) {
        const text = document.createTextNode(html);
        const p = document.createElement("p");
        p.appendChild(text);
        return p.innerHTML;
      }
      if (this.showUserStatus && (this.userStatus.icon || this.userStatus.message)) {
        const emojiIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">\n					<text x="50%" y="50%" text-anchor="middle" style="dominant-baseline: central; font-size: 85%">'.concat(escape2(this.userStatus.icon), "</text>\n				</svg>");
        return [{
          ncActionComponent: NcActionText,
          ncActionComponentProps: {},
          iconSvg: this.userStatus.icon ? emojiIcon : void 0,
          text: "".concat(this.userStatus.message)
        }].concat(actions);
      }
      return actions;
    }
  },
  watch: {
    url() {
      this.userDoesNotExist = false;
      this.loadAvatarUrl();
    },
    user() {
      this.userDoesNotExist = false;
      this.isMenuLoaded = false;
      this.loadAvatarUrl();
    }
  },
  mounted() {
    this.loadAvatarUrl();
    subscribe("settings:avatar:updated", this.loadAvatarUrl);
    subscribe("settings:display-name:updated", this.loadAvatarUrl);
    if (this.showUserStatus && this.user && !this.isNoUser) {
      if (!this.preloadedUserStatus) {
        this.fetchUserStatus(this.user);
      } else {
        this.userStatus.status = this.preloadedUserStatus.status || "";
        this.userStatus.message = this.preloadedUserStatus.message || "";
        this.userStatus.icon = this.preloadedUserStatus.icon || "";
        this.hasStatus = this.preloadedUserStatus.status !== null;
      }
      subscribe("user_status:status.updated", this.handleUserStatusUpdated);
    }
  },
  beforeDestroy() {
    unsubscribe("settings:avatar:updated", this.loadAvatarUrl);
    unsubscribe("settings:display-name:updated", this.loadAvatarUrl);
    if (this.showUserStatus && this.user && !this.isNoUser) {
      unsubscribe("user_status:status.updated", this.handleUserStatusUpdated);
    }
  },
  methods: {
    t: t$1,
    handleUserStatusUpdated(state) {
      if (this.user === state.userId) {
        this.userStatus = {
          status: state.status,
          icon: state.icon,
          message: state.message
        };
      }
    },
    /**
     * Toggle the popover menu on click or enter
     * @param {KeyboardEvent|MouseEvent} event the UI event
     */
    async toggleMenu(event) {
      if (event.type === "keydown" && event.key !== "Enter") {
        return;
      }
      if (!this.contactsMenuOpenState) {
        await this.fetchContactsMenu();
      }
      this.contactsMenuOpenState = !this.contactsMenuOpenState;
    },
    closeMenu() {
      this.contactsMenuOpenState = false;
    },
    async fetchContactsMenu() {
      this.contactsMenuLoading = true;
      try {
        const user = encodeURIComponent(this.user);
        const { data } = await cancelableClient.post(_("contactsmenu/findOne"), "shareType=0&shareWith=".concat(user));
        this.contactsMenuActions = data.topAction ? [data.topAction].concat(data.actions) : data.actions;
      } catch (e2) {
        this.contactsMenuOpenState = false;
      }
      this.contactsMenuLoading = false;
      this.isMenuLoaded = true;
    },
    /**
     * Handle avatar loading if user or url defined
     */
    loadAvatarUrl() {
      this.isAvatarLoaded = false;
      if (!this.isUrlDefined && (!this.isUserDefined || this.isNoUser)) {
        this.isAvatarLoaded = true;
        this.userDoesNotExist = true;
        return;
      }
      if (this.isUrlDefined) {
        this.updateImageIfValid(this.url);
        return;
      }
      if (this.size <= 64) {
        const avatarUrl = this.avatarUrlGenerator(this.user, 64);
        const srcset = [
          avatarUrl + " 1x",
          this.avatarUrlGenerator(this.user, 512) + " 8x"
        ].join(", ");
        this.updateImageIfValid(avatarUrl, srcset);
      } else {
        const avatarUrl = this.avatarUrlGenerator(this.user, 512);
        this.updateImageIfValid(avatarUrl);
      }
    },
    /**
     * Generate an avatar url from the server's avatar endpoint
     *
     * @param {string} user the user id
     * @param {number} size the desired size
     * @return {string}
     */
    avatarUrlGenerator(user, size) {
      var _a;
      let avatarUrl = getAvatarUrl(user, size, this.isGuest);
      if (user === ((_a = getCurrentUser()) == null ? void 0 : _a.uid) && typeof oc_userconfig !== "undefined") {
        avatarUrl += "?v=" + oc_userconfig.avatar.version;
      }
      return avatarUrl;
    },
    /**
     * Check if the provided url is valid and update Avatar if so
     *
     * @param {string} url the avatar url
     * @param {Array} srcset the avatar srcset
     */
    updateImageIfValid(url, srcset = null) {
      const userHasAvatar = getUserHasAvatar(this.user);
      if (this.isUserDefined && typeof userHasAvatar === "boolean") {
        this.isAvatarLoaded = true;
        this.avatarUrlLoaded = url;
        if (srcset) {
          this.avatarSrcSetLoaded = srcset;
        }
        if (userHasAvatar === false) {
          this.userDoesNotExist = true;
        }
        return;
      }
      const img = new Image();
      img.onload = () => {
        this.avatarUrlLoaded = url;
        if (srcset) {
          this.avatarSrcSetLoaded = srcset;
        }
        this.isAvatarLoaded = true;
        setUserHasAvatar(this.user, true);
      };
      img.onerror = () => {
        console.debug("Invalid avatar url", url);
        this.avatarUrlLoaded = null;
        this.avatarSrcSetLoaded = null;
        this.userDoesNotExist = true;
        this.isAvatarLoaded = false;
        setUserHasAvatar(this.user, false);
      };
      if (srcset) {
        img.srcset = srcset;
      }
      img.src = url;
    }
  }
};
var _sfc_render$3 = function render7() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", { directives: [{ name: "click-outside", rawName: "v-click-outside", value: _vm.closeMenu, expression: "closeMenu" }], ref: "main", staticClass: "avatardiv popovermenu-wrapper", class: {
    "avatardiv--unknown": _vm.userDoesNotExist,
    "avatardiv--with-menu": _vm.hasMenu,
    "avatardiv--with-menu-loading": _vm.contactsMenuLoading
  }, style: _vm.avatarStyle }, [_vm._t("icon", function() {
    return [_vm.iconClass ? _c("span", { staticClass: "avatar-class-icon", class: _vm.iconClass }) : _vm.isAvatarLoaded && !_vm.userDoesNotExist ? _c("img", { attrs: { "src": _vm.avatarUrlLoaded, "srcset": _vm.avatarSrcSetLoaded, "alt": "" } }) : _vm._e()];
  }), _vm.hasMenu && _vm.menu.length === 0 ? _c("NcButton", { staticClass: "action-item action-item__menutoggle", attrs: { "type": "tertiary-no-background", "aria-label": _vm.avatarAriaLabel, "title": _vm.tooltip }, on: { "click": _vm.toggleMenu }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_vm.contactsMenuLoading ? _c("NcLoadingIcon") : _c("DotsHorizontal", { attrs: { "size": 20 } })];
  }, proxy: true }], null, false, 2617833509) }) : _vm.hasMenu ? _c("NcActions", { attrs: { "force-menu": "", "manual-open": "", "type": "tertiary-no-background", "container": _vm.menuContainer, "open": _vm.contactsMenuOpenState, "aria-label": _vm.avatarAriaLabel, "title": _vm.tooltip }, on: { "update:open": function($event) {
    _vm.contactsMenuOpenState = $event;
  }, "click": _vm.toggleMenu }, scopedSlots: _vm._u([_vm.contactsMenuLoading ? { key: "icon", fn: function() {
    return [_c("NcLoadingIcon")];
  }, proxy: true } : null], null, true) }, _vm._l(_vm.menu, function(item, key) {
    return _c(item.ncActionComponent, _vm._b({ key, tag: "component", scopedSlots: _vm._u([item.iconSvg ? { key: "icon", fn: function() {
      return [_c("NcIconSvgWrapper", { attrs: { "svg": item.iconSvg } })];
    }, proxy: true } : null], null, true) }, "component", item.ncActionComponentProps, false), [_vm._v(" " + _vm._s(item.text) + " ")]);
  }), 1) : _vm._e(), _vm.showUserStatusIconOnAvatar ? _c("span", { staticClass: "avatardiv__user-status avatardiv__user-status--icon" }, [_vm._v(" " + _vm._s(_vm.userStatus.icon) + " ")]) : _vm.canDisplayUserStatus ? _c("NcUserStatusIcon", { staticClass: "avatardiv__user-status", attrs: { "status": _vm.userStatus.status, "aria-hidden": String(_vm.hasMenu) } }) : _vm._e(), _vm.showInitials ? _c("span", { staticClass: "avatardiv__initials-wrapper", style: _vm.initialsWrapperStyle }, [_c("span", { staticClass: "avatardiv__initials", style: _vm.initialsStyle }, [_vm._v(" " + _vm._s(_vm.initials) + " ")])]) : _vm._e()], 2);
};
var _sfc_staticRenderFns$3 = [];
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  "e7e86f59"
);
const NcAvatar = __component__$3.exports;
const margin = 8;
const defaultSize = 32;
const _sfc_main$2 = {
  name: "NcListItemIcon",
  components: {
    NcAvatar,
    NcHighlight,
    NcIconSvgWrapper
  },
  mixins: [
    userStatus
  ],
  props: {
    /**
     * Default first line text
     */
    name: {
      type: String,
      required: true
    },
    /**
     * Secondary optional line
     * Only visible on size of 32 and above
     */
    subname: {
      type: String,
      default: ""
    },
    /**
     * Icon class to be displayed at the end of the component
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * SVG icon to be displayed at the end of the component
     */
    iconSvg: {
      type: String,
      default: ""
    },
    /**
     * Descriptive name for the icon
     */
    iconName: {
      type: String,
      default: ""
    },
    /**
     * Search within the highlight of name/subname
     */
    search: {
      type: String,
      default: ""
    },
    /**
     * Set a size in px that will define the avatar height/width
     * and therefore, the height of the component
     */
    avatarSize: {
      type: Number,
      default: defaultSize
    },
    /**
     * Disable the margins of this component.
     * Useful for integration in `NcSelect` for example
     */
    noMargin: {
      type: Boolean,
      default: false
    },
    /**
     * See the [Avatar](#Avatar) displayName prop
     * Fallback to name
     */
    displayName: {
      type: String,
      default: null
    },
    /**
     * See the [Avatar](#Avatar) isNoUser prop
     * Enable/disable the UserStatus fetching
     */
    isNoUser: {
      type: Boolean,
      default: false
    },
    /**
     * Unique list item ID
     */
    id: {
      type: String,
      default: null
    }
  },
  setup() {
    return {
      margin,
      defaultSize
    };
  },
  computed: {
    hasIcon() {
      return this.icon !== "";
    },
    hasIconSvg() {
      return this.iconSvg !== "";
    },
    isValidSubname() {
      var _a, _b;
      return ((_b = (_a = this.subname) == null ? void 0 : _a.trim) == null ? void 0 : _b.call(_a)) !== "";
    },
    isSizeBigEnough() {
      return this.avatarSize >= 26;
    },
    cssVars() {
      const margin2 = this.noMargin ? 0 : this.margin;
      return {
        "--height": this.avatarSize + 2 * margin2 + "px",
        "--margin": this.margin + "px"
      };
    },
    /**
     * Seperates the search property into two parts, the first one is the search part on the name, the second on the subname.
     * @return {[string, string]}
     */
    searchParts() {
      const EMAIL_NOTATION = /^([^<]*)<([^>]+)>?$/;
      const match = this.search.match(EMAIL_NOTATION);
      if (this.isNoUser || !match) {
        return [this.search, this.search];
      }
      return [match[1].trim(), match[2]];
    }
  },
  beforeMount() {
    if (!this.isNoUser && !this.subname) {
      this.fetchUserStatus(this.user);
    }
  }
};
var _sfc_render$2 = function render8() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._g({ staticClass: "option", class: { "option--compact": _vm.avatarSize < _vm.defaultSize }, style: _vm.cssVars, attrs: { "id": _vm.id } }, _vm.$listeners), [_c("NcAvatar", _vm._b({ staticClass: "option__avatar", attrs: { "disable-menu": true, "disable-tooltip": true, "display-name": _vm.displayName || _vm.name, "is-no-user": _vm.isNoUser, "size": _vm.avatarSize } }, "NcAvatar", _vm.$attrs, false)), _c("div", { staticClass: "option__details" }, [_c("NcHighlight", { staticClass: "option__lineone", attrs: { "text": _vm.name, "search": _vm.searchParts[0] } }), _vm.isValidSubname && _vm.isSizeBigEnough ? _c("NcHighlight", { staticClass: "option__linetwo", attrs: { "text": _vm.subname, "search": _vm.searchParts[1] } }) : _vm.hasStatus ? _c("span", [_c("span", [_vm._v(_vm._s(_vm.userStatus.icon))]), _c("span", [_vm._v(_vm._s(_vm.userStatus.message))])]) : _vm._e()], 1), _vm._t("default", function() {
    return [_vm.hasIconSvg ? _c("NcIconSvgWrapper", { staticClass: "option__icon", attrs: { "svg": _vm.iconSvg, "name": _vm.iconName } }) : _vm.hasIcon ? _c("span", { staticClass: "icon option__icon", class: _vm.icon, attrs: { "aria-label": _vm.iconName } }) : _vm._e()];
  })], 2);
};
var _sfc_staticRenderFns$2 = [];
var __component__$2 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  "a0f4d73a"
);
const NcListItemIcon = __component__$2.exports;
register(t16);
const _sfc_main$1 = {
  name: "NcSelect",
  components: {
    ChevronDown,
    NcEllipsisedOption,
    NcListItemIcon,
    NcLoadingIcon,
    VueSelect: vueSelectExports.VueSelect
  },
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: __spreadProps(__spreadValues(__spreadValues({}, vueSelectExports.VueSelect.props), vueSelectExports.VueSelect.mixins.reduce((allProps, mixin) => __spreadValues(__spreadValues({}, allProps), mixin.props), {})), {
    /**
     * `aria-label` for the clear input button
     */
    ariaLabelClearSelected: {
      type: String,
      default: t$1("Clear selected")
    },
    /**
     * `aria-label` for the search input
     *
     * A descriptive `inputLabel` is preferred as this is not visible.
     */
    ariaLabelCombobox: {
      type: String,
      default: null
    },
    /**
     * `aria-label` for the listbox element
     */
    ariaLabelListbox: {
      type: String,
      default: t$1("Options")
    },
    /**
     * Allows to customize the `aria-label` for the deselect-option button
     * The default is "Deselect " + optionLabel
     * @type {(optionLabel: string) => string}
     */
    ariaLabelDeselectOption: {
      type: Function,
      default: (optionLabel) => t$1("Deselect {option}", { option: optionLabel })
    },
    /**
     * Append the dropdown element to the end of the body
     * and size/position it dynamically.
     *
     * @see https://vue-select.org/api/props.html#appendtobody
     */
    appendToBody: {
      type: Boolean,
      default: true
    },
    /**
     * When `appendToBody` is true, this function is responsible for
     * positioning the drop down list.
     *
     * If a function is returned from `calculatePosition`, it will
     * be called when the drop down list is removed from the DOM.
     * This allows for any garbage collection you may need to do.
     *
     * @see https://vue-select.org/api/props.html#calculateposition
     */
    calculatePosition: {
      type: Function,
      default: null
    },
    /**
     * Close the dropdown when selecting an option
     *
     * @see https://vue-select.org/api/props.html#closeonselect
     */
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    /**
     * Replace default vue-select components
     *
     * @see https://vue-select.org/api/props.html#components
     */
    components: {
      type: Object,
      default: () => ({
        Deselect: {
          render: (createElement) => createElement(Close, {
            props: {
              size: 20,
              fillColor: "var(--vs-controls-color)"
            },
            style: {
              cursor: "pointer"
            }
          })
        }
      })
    },
    /**
     * Sets the maximum number of options to display in the dropdown list
     */
    limit: {
      type: Number,
      default: null
    },
    /**
     * Disable the component
     *
     * @see https://vue-select.org/api/props.html#disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Determines whether the dropdown should be open.
     * Receives the component instance as the only argument.
     *
     * @see https://vue-select.org/api/props.html#dropdownshouldopen
     */
    dropdownShouldOpen: {
      type: Function,
      default: ({ noDrop, open }) => {
        return noDrop ? false : open;
      }
    },
    /**
     * Callback to determine if the provided option should
     * match the current search text. Used to determine
     * if the option should be displayed.
     *
     * Defaults to the internal vue-select function documented at the link
     * below
     *
     * Enabling `userSelect` will automatically set this to filter by the
     * `displayName` and `subname` properties of the user option object
     * unless this prop is set explicitly
     *
     * @see https://vue-select.org/api/props.html#filterby
     */
    filterBy: {
      type: Function,
      default: null
    },
    /**
     * Class for the `input`
     *
     * Necessary for use in NcActionInput
     */
    inputClass: {
      type: [String, Object],
      default: null
    },
    /**
     * Input element id
     */
    inputId: {
      type: String,
      default: () => "select-input-".concat(GenRandomId())
    },
    /**
     * Visible label for the input element
     *
     * @todo Set default for @nextcloud/vue 9
     */
    inputLabel: {
      type: String,
      default: null
    },
    /**
     * Pass true if you are using an external label
     */
    labelOutside: {
      type: Boolean,
      default: false
    },
    /**
     * Display a visible border around dropdown options
     * which have keyboard focus
     */
    keyboardFocusBorder: {
      type: Boolean,
      default: true
    },
    /**
     * Key of the displayed label for object options
     *
     * Defaults to the internal vue-select string documented at the link
     * below
     *
     * Enabling `userSelect` will automatically set this to `'displayName'`
     * unless this prop is set explicitly
     *
     * @see https://vue-select.org/api/props.html#label
     */
    label: {
      type: String,
      default: null
    },
    /**
     * Show the loading icon
     *
     * @see https://vue-select.org/api/props.html#loading
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Allow selection of multiple options
     *
     * @see https://vue-select.org/api/props.html#multiple
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * Disable automatic wrapping when selected options overflow the width
     */
    noWrap: {
      type: Boolean,
      default: false
    },
    /**
     * Array of options
     *
     * @type {Array<string | number | Record<string | number, any>>}
     *
     * @see https://vue-select.org/api/props.html#options
     */
    options: {
      type: Array,
      default: () => []
    },
    /**
     * Placeholder text
     *
     * @see https://vue-select.org/api/props.html#placeholder
     */
    placeholder: {
      type: String,
      default: ""
    },
    /**
     * Customized component's response to keydown events while the search input has focus
     *
     * @see https://vue-select.org/guide/keydown.html#mapkeydown
     */
    mapKeydown: {
      type: Function,
      /**
       * Patched Vue-Select keydown events handlers map to stop Escape propagation in open select
       *
       * @param {Record<number, Function>} map - Mapped keyCode to handlers { <keyCode>:<callback> }
       * @param {import('@nextcloud/vue-select').VueSelect} vm - VueSelect instance
       * @return {Record<number, Function>} patched keydown event handlers
       */
      default(map, vm) {
        return __spreadProps(__spreadValues({}, map), {
          /**
           * Patched Escape handler to stop propagation from open select
           *
           * @param {KeyboardEvent} event - default keydown event handler
           */
          27: (event) => {
            if (vm.open) {
              event.stopPropagation();
            }
            map[27](event);
          }
        });
      }
    },
    /**
     * A unique identifier used to generate IDs and DOM attributes. Must be unique for every instance of the component.
     *
     * @see https://vue-select.org/api/props.html#uid
     */
    uid: {
      type: String,
      default: () => GenRandomId()
    },
    /**
     * When `appendToBody` is true, this sets the placement of the dropdown
     *
     * @type {'bottom' | 'top'}
     */
    placement: {
      type: String,
      default: "bottom"
    },
    /**
     * If false, the focused dropdown option will not be reset when filtered
     * options change
     */
    resetFocusOnOptionsChange: {
      type: Boolean,
      default: true
    },
    /**
     * Enable the user selector with avatars
     *
     * Objects must contain the data expected by the
     * [NcListItemIcon](#/Components/NcListItemIcon) and
     * [NcAvatar](#/Components/NcAvatar) components
     */
    userSelect: {
      type: Boolean,
      default: false
    },
    /**
     * Removed in v9 - use `modelValue` (`v-model`) instead
     * @deprecated
     */
    value: {
      type: [String, Number, Object, Array],
      default: void 0
    },
    /**
     * Currently selected value
     *
     * The `v-model` directive may be used for two-way data binding
     *
     * @type {string | number | Record<string | number, any> | Array<any>}
     *
     * @see https://vue-select.org/api/props.html#value
     */
    modelValue: {
      type: [String, Number, Object, Array],
      default: null
    },
    /**
     * Enable if a value is required for native form validation
     */
    required: {
      type: Boolean,
      default: false
    },
    /**
     * Any available prop
     *
     * @see https://vue-select.org/api/props.html
     */
    // Not an actual prop but needed to show in vue-styleguidist docs
    // eslint-disable-next-line
    " ": {}
  }),
  emits: [
    /**
     * All events from https://vue-select.org/api/events.html
     */
    // Not an actual event but needed to show in vue-styleguidist docs
    " ",
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    "input",
    "update:modelValue",
    /** Same as update:modelValue for Vue 2 compatibility */
    "update:model-value"
  ],
  setup() {
    const clickableArea = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--default-clickable-area"));
    const gridBaseLine = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--default-grid-baseline"));
    const avatarSize = clickableArea - 2 * gridBaseLine;
    const model = useModelMigration("value", "input");
    return {
      avatarSize,
      model
    };
  },
  data() {
    return {
      search: ""
    };
  },
  computed: {
    inputRequired() {
      if (!this.required) {
        return null;
      }
      return this.model === null || Array.isArray(this.model) && this.model.length === 0;
    },
    localCalculatePosition() {
      if (this.calculatePosition !== null) {
        return this.calculatePosition;
      }
      return (dropdownMenu, component, { width }) => {
        dropdownMenu.style.width = width;
        const addClass = {
          name: "addClass",
          fn(_middlewareArgs) {
            dropdownMenu.classList.add("vs__dropdown-menu--floating");
            return {};
          }
        };
        const togglePlacementClass = {
          name: "togglePlacementClass",
          fn({ placement }) {
            component.$el.classList.toggle(
              "select--drop-up",
              placement === "top"
            );
            dropdownMenu.classList.toggle(
              "vs__dropdown-menu--floating-placement-top",
              placement === "top"
            );
            return {};
          }
        };
        const updatePosition = () => {
          computePosition(component.$refs.toggle, dropdownMenu, {
            placement: this.placement,
            middleware: [
              offset(-1),
              addClass,
              togglePlacementClass,
              // Match popperjs default collision prevention behavior by appending the following middleware in order
              flip(),
              shift({ limiter: limitShift() })
            ]
          }).then(({ x, y }) => {
            Object.assign(dropdownMenu.style, {
              left: "".concat(x, "px"),
              top: "".concat(y, "px"),
              width: "".concat(component.$refs.toggle.getBoundingClientRect().width, "px")
            });
          });
        };
        const cleanup = autoUpdate(
          component.$refs.toggle,
          dropdownMenu,
          updatePosition
        );
        return cleanup;
      };
    },
    localFilterBy() {
      const EMAIL_NOTATION = /[^<]*<([^>]+)/;
      if (this.filterBy !== null) {
        return this.filterBy;
      }
      if (this.userSelect) {
        return (option, label, search) => {
          var _a, _b, _c;
          const match = search.match(EMAIL_NOTATION);
          return match && ((_c = (_b = (_a = option.subname) == null ? void 0 : _a.toLocaleLowerCase) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.indexOf(match[1].toLocaleLowerCase())) > -1 || "".concat(label, " ").concat(option.subname).toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1;
        };
      }
      return vueSelectExports.VueSelect.props.filterBy.default;
    },
    localLabel() {
      if (this.label !== null) {
        return this.label;
      }
      if (this.userSelect) {
        return "displayName";
      }
      return vueSelectExports.VueSelect.props.label.default;
    },
    propsToForward() {
      const vueSelectKeys = [
        ...Object.keys(vueSelectExports.VueSelect.props),
        ...vueSelectExports.VueSelect.mixins.flatMap((mixin) => {
          var _a;
          return Object.keys((_a = mixin.props) != null ? _a : {});
        })
      ];
      const initialPropsToForward = Object.fromEntries(
        Object.entries(this.$props).filter(([key, _value]) => vueSelectKeys.includes(key))
      );
      const propsToForward = __spreadProps(__spreadValues({}, initialPropsToForward), {
        // Custom overrides of vue-select props
        value: this.model,
        calculatePosition: this.localCalculatePosition,
        filterBy: this.localFilterBy,
        label: this.localLabel
      });
      return propsToForward;
    },
    listenersToForward() {
      return __spreadProps(__spreadValues({}, this.$listeners), {
        input: ($event) => {
          this.model = $event;
        }
      });
    }
  },
  mounted() {
    if (!this.labelOutside && !this.inputLabel && !this.ariaLabelCombobox) {
      Vue.util.warn("[NcSelect] An `inputLabel` or `ariaLabelCombobox` should be set. If an external label is used, `labelOutside` should be set to `true`.");
    }
    if (this.inputLabel && this.ariaLabelCombobox) {
      Vue.util.warn("[NcSelect] Only one of `inputLabel` or `ariaLabelCombobox` should to be set.");
    }
  },
  methods: {
    t: t$1
  }
};
var _sfc_render$1 = function render9() {
  var _vm = this, _c = _vm._self._c;
  return _c("VueSelect", _vm._g(_vm._b({ staticClass: "select", class: {
    "select--no-wrap": _vm.noWrap,
    "user-select": _vm.userSelect
  }, on: { "search": (searchString) => _vm.search = searchString }, scopedSlots: _vm._u([!_vm.labelOutside && _vm.inputLabel ? { key: "header", fn: function() {
    return [_c("label", { staticClass: "select__label", attrs: { "for": _vm.inputId } }, [_vm._v(" " + _vm._s(_vm.inputLabel) + " ")])];
  }, proxy: true } : null, { key: "search", fn: function({ attributes, events }) {
    return [_c("input", _vm._g(_vm._b({ class: ["vs__search", _vm.inputClass], attrs: { "required": _vm.inputRequired, "dir": "auto" } }, "input", attributes, false), events))];
  } }, { key: "open-indicator", fn: function({ attributes }) {
    return [_c("ChevronDown", _vm._b({ style: {
      cursor: !_vm.disabled ? "pointer" : null
    }, attrs: { "fill-color": "var(--vs-controls-color)", "size": 26 } }, "ChevronDown", attributes, false))];
  } }, { key: "option", fn: function(option) {
    return [_vm.userSelect ? _c("NcListItemIcon", _vm._b({ attrs: { "avatar-size": 32, "name": option[_vm.localLabel], "search": _vm.search } }, "NcListItemIcon", option, false)) : _c("NcEllipsisedOption", { attrs: { "name": String(option[_vm.localLabel]), "search": _vm.search } })];
  } }, { key: "selected-option", fn: function(selectedOption) {
    return [_vm.userSelect ? _c("NcListItemIcon", _vm._b({ attrs: { "avatar-size": _vm.avatarSize, "name": selectedOption[_vm.localLabel], "no-margin": "", "search": _vm.search } }, "NcListItemIcon", selectedOption, false)) : _c("NcEllipsisedOption", { attrs: { "name": String(selectedOption[_vm.localLabel]), "search": _vm.search } })];
  } }, { key: "spinner", fn: function(spinner) {
    return [spinner.loading ? _c("NcLoadingIcon") : _vm._e()];
  } }, { key: "no-options", fn: function() {
    return [_vm._v(" " + _vm._s(_vm.t("No results")) + " ")];
  }, proxy: true }, _vm._l(_vm.$scopedSlots, function(_2, name) {
    return { key: name, fn: function(data) {
      return [_vm._t(name, null, null, data)];
    } };
  })], null, true) }, "VueSelect", _vm.propsToForward, false), _vm.listenersToForward));
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
const NcSelect = __component__$1.exports;
var debounce$2 = { exports: {} };
function debounce(function_, wait = 100, options = {}) {
  if (typeof function_ !== "function") {
    throw new TypeError("Expected the first parameter to be a function, got `".concat(typeof function_, "`."));
  }
  if (wait < 0) {
    throw new RangeError("`wait` must not be negative.");
  }
  const { immediate } = typeof options === "boolean" ? { immediate: options } : options;
  let storedContext;
  let storedArguments;
  let timeoutId;
  let timestamp;
  let result;
  function run2() {
    const callContext = storedContext;
    const callArguments = storedArguments;
    storedContext = void 0;
    storedArguments = void 0;
    result = function_.apply(callContext, callArguments);
    return result;
  }
  function later() {
    const last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeoutId = setTimeout(later, wait - last);
    } else {
      timeoutId = void 0;
      if (!immediate) {
        result = run2();
      }
    }
  }
  const debounced = function(...arguments_) {
    if (storedContext && this !== storedContext && Object.getPrototypeOf(this) === Object.getPrototypeOf(storedContext)) {
      throw new Error("Debounced method called with different contexts of the same prototype.");
    }
    storedContext = this;
    storedArguments = arguments_;
    timestamp = Date.now();
    const callNow = immediate && !timeoutId;
    if (!timeoutId) {
      timeoutId = setTimeout(later, wait);
    }
    if (callNow) {
      result = run2();
    }
    return result;
  };
  Object.defineProperty(debounced, "isPending", {
    get() {
      return timeoutId !== void 0;
    }
  });
  debounced.clear = () => {
    if (!timeoutId) {
      return;
    }
    clearTimeout(timeoutId);
    timeoutId = void 0;
  };
  debounced.flush = () => {
    if (!timeoutId) {
      return;
    }
    debounced.trigger();
  };
  debounced.trigger = () => {
    result = run2();
    debounced.clear();
  };
  return debounced;
}
debounce$2.exports.debounce = debounce;
debounce$2.exports = debounce;
var debounceExports = debounce$2.exports;
const debounce$1 = /* @__PURE__ */ getDefaultExportFromCjs(debounceExports);
const logger = getLoggerBuilder().setApp("end_to_end_encryption").detectUser().build();
const _sfc_main = {
  name: "AdminSection",
  components: {
    NcButton,
    NcSelect,
    NcSettingsSection
  },
  data() {
    return {
      loading: false,
      loadingGroups: true,
      allowedGroups: loadState("end_to_end_encryption", "allowed_groups").map((group) => {
        return {
          id: group,
          displayname: group
        };
      }).sort(function(a, b) {
        return a.displayname.localeCompare(b.displayname);
      }),
      groups: []
    };
  },
  mounted() {
    this.groups = this.allowedGroups;
    this.searchGroup();
  },
  methods: {
    searchGroup: debounce$1(async function(query) {
      this.loadingGroups = true;
      try {
        const response = await cancelableClient.get(v("cloud/groups/details"), {
          search: query,
          limit: 20,
          offset: 0
        });
        this.groups = response.data.ocs.data.groups.sort(function(a, b) {
          return a.displayname.localeCompare(b.displayname);
        });
      } catch (err) {
        logger.error("Could not fetch groups", err);
      } finally {
        this.loadingGroups = false;
      }
    }, 500),
    saveChanges() {
      this.loading = true;
      this.loadingGroups = true;
      const groups = this.allowedGroups.map((group) => {
        return group.id;
      });
      OCP.AppConfig.setValue("end_to_end_encryption", "allowed_groups", JSON.stringify(groups), {
        success: function() {
          this.loading = false;
          this.loadingGroups = false;
          showSuccess(t("end_to_end_encryption", "Saved groups"));
        }.bind(this)
      });
    }
  }
};
var _sfc_render = function render10() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcSettingsSection", { staticClass: "admin-e2ee", attrs: { "name": _vm.t("end_to_end_encryption", "End-to-End Encryption") } }, [_c("h3", [_vm._v(_vm._s(_vm.t("end_to_end_encryption", "Limit to groups")))]), _c("p", { staticClass: "settings-hint" }, [_vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "When at least one group is selected, only people of the listed groups can use the End-to-End encryption app.")) + " ")]), _c("NcSelect", { staticClass: "admin-e2ee__group-select", attrs: { "disabled": _vm.loading, "input-label": _vm.t("end_to_end_encryption", "Limit app usage to groups"), "label": "displayname", "loading": _vm.loadingGroups, "options": _vm.groups, "multiple": "", "searchable": "" }, on: { "search-change": _vm.searchGroup }, model: { value: _vm.allowedGroups, callback: function($$v) {
    _vm.allowedGroups = $$v;
  }, expression: "allowedGroups" } }), _c("NcButton", { staticClass: "admin-e2ee__save-button", attrs: { "loading": _vm.loading, "type": "primary" }, on: { "click": _vm.saveChanges } }, [_vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "Save")) + " ")])], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "03024419"
);
__component__.options.__file = "/home/louis/workspace/nextcloud/instances/master/apps-extra/end_to_end_encryption/src/components/AdminSection.vue";
const AdminSection = __component__.exports;
Vue.prototype.t = translate;
Vue.prototype.n = translatePlural;
const View = Vue.extend(AdminSection);
new View({}).$mount("#security-admin-end-to-end");
//# sourceMappingURL=end_to_end_encryption-adminSettings.mjs.map
