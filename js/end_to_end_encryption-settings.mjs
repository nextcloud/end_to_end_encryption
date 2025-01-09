(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode(".notecard[data-v-6269b3af] {\n  position: relative;\n}\n.notecard .close-button[data-v-6269b3af] {\n  position: absolute;\n  top: 0;\n  right: 0;\n}\nli[data-v-6269b3af] {\n  list-style-type: initial;\n  margin-left: 1rem;\n  padding: 0.25rem 0;\n}\n.margin-bottom[data-v-6269b3af] {\n  margin-bottom: 0.75rem;\n}\n.modal-container[data-v-6269b3af] {\n  padding: 16px;\n}\n.modal-container button[data-v-6269b3af] {\n  margin-top: 16px;\n  margin-left: 8px;\n}\n.button-row[data-v-6269b3af] {\n  display: flex;\n  justify-content: end;\n}"));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
const appName = "end_to_end_encryption";
const appVersion = "1.17.0-beta.2";
import { s as normalizeComponent, h as defineComponent, N as NcButton, q as NcNoteCard, l as loadState, D as DialogBuilder, k as translate, d as cancelableClient, v, x as showSuccess, y as showError, _, V as Vue, z as translatePlural } from "./_plugin-vue2_normalizer-BdKAaywK.chunk.mjs";
import { N as NcSettingsSection } from "./NcSettingsSection-B7SqDXbX-81sIi28k.chunk.mjs";
import { N as NcCheckboxRadioSwitch } from "./NcCheckboxRadioSwitch-R1y0mLbC-PPdao6TU.chunk.mjs";
import { l as logger } from "./logger-kgPHxwTN.chunk.mjs";
import "./useModelMigration-EhAWvqDD-BpHklyZH.chunk.mjs";
const _sfc_main$1 = {
  name: "CloseIcon",
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
  return _c("span", _vm._b({ staticClass: "material-design-icon close-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  null
);
__component__$1.options.__file = "/home/louis/workspace/nextcloud/instances/master/apps-extra/end_to_end_encryption/node_modules/vue-material-design-icons/Close.vue";
const IconClose = __component__$1.exports;
const _sfc_main = defineComponent({
  name: "SecuritySection",
  components: {
    NcSettingsSection,
    NcButton,
    NcCheckboxRadioSwitch,
    NcNoteCard,
    IconClose
  },
  data() {
    return {
      hasKey: loadState("end_to_end_encryption", "hasKey"),
      shouldDisplayWarning: false,
      deleteEncryptedFiles: false,
      shouldDisplayE2EEInBrowserWarning: false,
      userConfig: loadState("end_to_end_encryption", "userConfig", { e2eeInBrowserEnabled: false })
    };
  },
  computed: {
    confirmationDialog() {
      const builder = new DialogBuilder();
      return builder.setName(translate("end_to_end_encryption", "Confirm resetting keys")).setText(translate("end_to_end_encryption", "This is the final warning: Do you really want to reset your keys?")).addButton({
        label: translate("end_to_end_encryption", "Cancel"),
        type: "tertiary",
        callback: () => {
          this.deleteEncryptedFiles = false;
          this.shouldDisplayWarning = false;
        }
      }).addButton({
        label: translate("end_to_end_encryption", "Reset keys"),
        type: "error",
        callback: this.resetEncryption.bind(this)
      }).build();
    },
    encryptionState() {
      if (this.hasKey) {
        return translate(
          "end_to_end_encryption",
          "End-to-end encryption is currently enabled and correctly setup."
        );
      } else {
        return translate(
          "end_to_end_encryption",
          "End-to-end encryption is currently disabled. You can set it up with the {productName} clients.",
          {
            productName: OCA.Theming ? OCA.Theming.name : "Nextcloud"
          }
        );
      }
    }
  },
  methods: {
    showDialog() {
      this.confirmationDialog.show();
    },
    startResetProcess() {
      this.shouldDisplayWarning = true;
    },
    async deletePrivateKey() {
      var _a, _b;
      const { data } = await cancelableClient.delete(
        v("/apps/end_to_end_encryption/api/v1/private-key")
      );
      return this.handleResponse({
        status: (_b = (_a = data.ocs) == null ? void 0 : _a.meta) == null ? void 0 : _b.status,
        error: null
      });
    },
    async deletePublicKey() {
      var _a, _b;
      const { data } = await cancelableClient.delete(
        v("/apps/end_to_end_encryption/api/v1/public-key")
      );
      return this.handleResponse({
        status: (_b = (_a = data.ocs) == null ? void 0 : _a.meta) == null ? void 0 : _b.status,
        error: null
      });
    },
    async deleteFiles() {
      var _a, _b;
      if (this.deleteEncryptedFiles) {
        const { data } = await cancelableClient.delete(
          v(
            "/apps/end_to_end_encryption/api/v1/encrypted-files"
          )
        );
        return this.handleResponse({
          status: (_b = (_a = data.ocs) == null ? void 0 : _a.meta) == null ? void 0 : _b.status,
          error: null
        });
      }
      return true;
    },
    async resetEncryption() {
      try {
        let success = true;
        success = success && await this.deletePrivateKey();
        success = success && await this.deletePublicKey();
        success = success && await this.deleteFiles();
        if (success) {
          showSuccess(
            translate(
              "end_to_end_encryption",
              "End-to-end encryption keys reset"
            )
          );
        }
      } catch (e) {
        this.handleResponse({
          errorMessage: translate(
            "end_to_end_encryption",
            "Unable to reset end-to-end encryption"
          ),
          error: e
        });
      } finally {
        this.shouldDisplayWarning = false;
        this.hasKey = false;
      }
    },
    async handleResponse({ status, errorMessage, error }) {
      if (status !== "ok") {
        showError(errorMessage);
        logger.error(errorMessage, { error });
        return false;
      }
      return true;
    },
    async setConfig(key, value) {
      await cancelableClient.put(_("apps/end_to_end_encryption/api/v1/config/{key}", { key }), {
        value: typeof value === "string" ? value : JSON.stringify(value)
      });
      this.userConfig[key] = value;
    },
    t: translate
  }
});
var _sfc_render = function render2() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("NcSettingsSection", { attrs: { "name": _vm.t("end_to_end_encryption", "End-to-end encryption"), "description": _vm.encryptionState } }, [!_vm.shouldDisplayE2EEInBrowserWarning && _vm.userConfig["e2eeInBrowserEnabled"] === false ? _c("NcButton", { staticClass: "margin-bottom", attrs: { "disabled": !_vm.hasKey, "type": "secondary" }, on: { "click": function($event) {
    _vm.shouldDisplayE2EEInBrowserWarning = true;
  } } }, [_vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "Enable E2EE navigation in browser")) + " ")]) : _c("NcNoteCard", { staticClass: "notecard", attrs: { "type": "warning", "show-alert": true, "heading": _vm.t("end_to_end_encryption", "Enabling E2EE in the browser can weaken security") } }, [_vm.userConfig["e2eeInBrowserEnabled"] === false ? _c("NcButton", { staticClass: "close-button", attrs: { "aria-label": _vm.t("end_to_end_encryption", "Close"), "type": "tertiary-no-background" }, on: { "click": function($event) {
    _vm.shouldDisplayE2EEInBrowserWarning = false;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("IconClose", { attrs: { "size": 20 } })];
  }, proxy: true }], null, false, 2888946197) }) : _vm._e(), _vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "The server could serve malicious source code to extract the secret that protects your files.")) + " "), _c("NcCheckboxRadioSwitch", { staticClass: "margin-bottom", attrs: { "disabled": !_vm.hasKey, "data-cy-e2ee-settings-setting": "e2ee_in_browser_enabled", "checked": _vm.userConfig.e2eeInBrowserEnabled, "type": "switch" }, on: { "update:checked": (value) => _vm.setConfig("e2eeInBrowserEnabled", value) } }, [_vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "Enable E2EE navigation in browser")) + " ")])], 1), !_vm.shouldDisplayWarning ? _c("NcButton", { attrs: { "disabled": !_vm.hasKey, "type": _vm.hasKey && !_vm.shouldDisplayWarning ? "error" : "secondary" }, on: { "click": function($event) {
    return _vm.startResetProcess();
  } } }, [_vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "Reset end-to-end encryption")) + " ")]) : _c("NcNoteCard", { staticClass: "notecard", attrs: { "type": "warning", "show-alert": true, "heading": _vm.t("end_to_end_encryption", "Please read carefully before resetting your end-to-end encryption keys") } }, [_c("NcButton", { staticClass: "close-button", attrs: { "aria-label": _vm.t("end_to_end_encryption", "Close"), "type": "tertiary-no-background" }, on: { "click": function($event) {
    _vm.shouldDisplayWarning = false;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("IconClose", { attrs: { "size": 20 } })];
  }, proxy: true }]) }), _c("ul", [_c("li", [_vm._v(_vm._s(_vm.t("end_to_end_encryption", "Once your end-to-end encryption keys are reset, all files stored in your encrypted folder will be inaccessible.")))]), _c("li", [_vm._v(_vm._s(_vm.t("end_to_end_encryption", "You should only reset your end-to-end encryption keys if you lost your secure key words (mnemonic).")))]), _c("li", [_vm._v(_vm._s(_vm.t("end_to_end_encryption", "Check on all connected devices if you can retrieve your mnemonic.")))]), _c("li", [_vm._v(_vm._s(_vm.t("end_to_end_encryption", "Any still connected device might cause problems after deleting the keys, so it is better to disconnect and reconnect the devices again.")))])]), _c("NcCheckboxRadioSwitch", { staticClass: "margin-bottom", attrs: { "checked": _vm.deleteEncryptedFiles, "type": "switch" }, on: { "update:checked": function($event) {
    _vm.deleteEncryptedFiles = $event;
  } } }, [_vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "Delete existing encrypted files")) + " ")]), _c("NcButton", { attrs: { "type": "error" }, on: { "click": _vm.showDialog } }, [_vm._v(" " + _vm._s(_vm.t("end_to_end_encryption", "Confirm and reset end-to-end encryption")) + " ")])], 1)], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "6269b3af"
);
__component__.options.__file = "/home/louis/workspace/nextcloud/instances/master/apps-extra/end_to_end_encryption/src/components/SecuritySection.vue";
const SecuritySection = __component__.exports;
Vue.prototype.t = translate;
Vue.prototype.n = translatePlural;
const View = Vue.extend(SecuritySection);
new View({}).$mount("#security-end-to-end");
//# sourceMappingURL=end_to_end_encryption-settings.mjs.map
