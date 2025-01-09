(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode("/**\n * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/**\n * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors\n * SPDX-License-Identifier: AGPL-3.0-or-later\n */\n/*\n* Ensure proper alignment of the vue material icons\n*/\n.material-design-icon[data-v-0974f50a] {\n  display: flex;\n  align-self: center;\n  justify-self: center;\n  align-items: center;\n  justify-content: center;\n}\n.settings-section[data-v-0974f50a] {\n  display: block;\n  margin-bottom: auto;\n  padding: 30px;\n}\n.settings-section[data-v-0974f50a]:not(:last-child) {\n  border-bottom: 1px solid var(--color-border);\n}\n.settings-section--limit-width > *[data-v-0974f50a] {\n  max-width: 900px;\n}\n.settings-section__name[data-v-0974f50a] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  font-weight: bold;\n  max-width: 900px;\n  margin-top: 0;\n}\n.settings-section__info[data-v-0974f50a] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--default-clickable-area);\n  height: var(--default-clickable-area);\n  margin: calc((var(--default-clickable-area) - 16px) / 2 * -1);\n  margin-left: 0;\n  color: var(--color-text-maxcontrast);\n}\n.settings-section__info[data-v-0974f50a]:hover, .settings-section__info[data-v-0974f50a]:focus, .settings-section__info[data-v-0974f50a]:active {\n  color: var(--color-main-text);\n}\n.settings-section__desc[data-v-0974f50a] {\n  margin-top: -0.2em;\n  margin-bottom: 1em;\n  color: var(--color-text-maxcontrast);\n  max-width: 900px;\n}"));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
const appName = "end_to_end_encryption";
const appVersion = "1.17.0-beta.2";
import { r as register, a3 as t24, n as normalizeComponent, t } from "./_plugin-vue2_normalizer-BdKAaywK.chunk.mjs";
register(t24);
const _sfc_main$1 = {
  name: "HelpCircleIcon",
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
var _sfc_render$1 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon help-circle-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
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
const HelpCircle = __component__$1.exports;
const _sfc_main = {
  name: "NcSettingsSection",
  components: {
    HelpCircle
  },
  props: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    docUrl: {
      type: String,
      default: ""
    },
    /**
     * Limit the width of the setting's content
     *
     * Setting this to false allows unrestricted (width) settings content.
     * Note that the name and description have always a width limit.
     * @deprecated Will be removed with next version and will not be used on Nextcloud 30+ (always forced to true)
     */
    limitWidth: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      docNameTranslated: t("External documentation for {name}", {
        name: this.name
      })
    };
  },
  computed: {
    forceLimitWidth() {
      var _a, _b;
      if (this.limitWidth) {
        return true;
      }
      const [major] = (_b = (_a = window._oc_config) == null ? void 0 : _a.version.split(".", 2)) != null ? _b : [];
      return major && Number.parseInt(major) >= 30;
    },
    hasDescription() {
      return this.description.length > 0;
    },
    hasDocUrl() {
      return this.docUrl.length > 0;
    }
  }
};
var _sfc_render = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "settings-section", class: { "settings-section--limit-width": _vm.forceLimitWidth } }, [_c("h2", { staticClass: "settings-section__name" }, [_vm._v(" " + _vm._s(_vm.name) + " "), _vm.hasDocUrl ? _c("a", { staticClass: "settings-section__info", attrs: { "href": _vm.docUrl, "title": _vm.docNameTranslated, "aria-label": _vm.docNameTranslated, "target": "_blank", "rel": "noreferrer nofollow" } }, [_c("HelpCircle", { attrs: { "size": 20 } })], 1) : _vm._e()]), _vm.hasDescription ? _c("p", { staticClass: "settings-section__desc" }, [_vm._v(" " + _vm._s(_vm.description) + " ")]) : _vm._e(), _vm._t("default")], 2);
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "0974f50a"
);
const NcSettingsSection = __component__.exports;
export {
  NcSettingsSection as N
};
//# sourceMappingURL=NcSettingsSection-B7SqDXbX-81sIi28k.chunk.mjs.map
