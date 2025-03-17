(function(){"use strict";try{if(typeof document<"u"){var t=document.createElement("style");t.appendChild(document.createTextNode(".notecard[data-v-982b8510]{position:relative}.notecard .close-button[data-v-982b8510]{position:absolute;top:0;right:0}li[data-v-982b8510]{list-style-type:initial;margin-left:1rem;padding:.25rem 0}.margin-bottom[data-v-982b8510]{margin-bottom:.75rem}.modal-container[data-v-982b8510]{padding:16px}.modal-container button[data-v-982b8510]{margin-top:16px;margin-left:8px}.button-row[data-v-982b8510]{display:flex;justify-content:end}")),document.head.appendChild(t)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}})();
import{m as c,h as l,N as d,l as a,k as o,d as s,v as r,s as y,u as p,_,V as i,w as u}from"./_plugin-vue2_normalizer-DyPK9ady.chunk.mjs";import{N as h}from"./NcSettingsSection-BYKUjim0-BJUjXi0Y.chunk.mjs";import{b as g,a as f,D as b}from"./NcCheckboxRadioSwitch-CCuKA55c-BgdAd0xL.chunk.mjs";import{l as m}from"./logger-BkQT3Vdm.chunk.mjs";import"./useModelMigration-EhAWvqDD-CndCUUad.chunk.mjs";const v={name:"CloseIcon",emits:["click"],props:{title:{type:String},fillColor:{type:String,default:"currentColor"},size:{type:Number,default:24}}};var w=function(){var e=this,t=e._self._c;return t("span",e._b({staticClass:"material-design-icon close-icon",attrs:{"aria-hidden":e.title?null:"true","aria-label":e.title,role:"img"},on:{click:function(n){return e.$emit("click",n)}}},"span",e.$attrs,!1),[t("svg",{staticClass:"material-design-icon__svg",attrs:{fill:e.fillColor,width:e.size,height:e.size,viewBox:"0 0 24 24"}},[t("path",{attrs:{d:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}},[e.title?t("title",[e._v(e._s(e.title))]):e._e()])])])},E=[],k=c(v,w,E,!1,null,null);const C=k.exports,N=l({name:"SecuritySection",components:{NcSettingsSection:h,NcButton:d,NcCheckboxRadioSwitch:g,NcNoteCard:f,IconClose:C},data(){return{hasKey:a("end_to_end_encryption","hasKey"),shouldDisplayWarning:!1,deleteEncryptedFiles:!1,shouldDisplayE2EEInBrowserWarning:!1,userConfig:a("end_to_end_encryption","userConfig",{e2eeInBrowserEnabled:!1})}},computed:{confirmationDialog(){return new b().setName(o("end_to_end_encryption","Confirm resetting keys")).setText(o("end_to_end_encryption","This is the final warning: Do you really want to reset your keys?")).addButton({label:o("end_to_end_encryption","Cancel"),type:"tertiary",callback:()=>{this.deleteEncryptedFiles=!1,this.shouldDisplayWarning=!1}}).addButton({label:o("end_to_end_encryption","Reset keys"),type:"error",callback:this.resetEncryption.bind(this)}).build()},encryptionState(){return this.hasKey?o("end_to_end_encryption","End-to-end encryption is currently enabled and correctly setup."):o("end_to_end_encryption","End-to-end encryption is currently disabled. You can set it up with the {productName} clients.",{productName:OCA.Theming?OCA.Theming.name:"Nextcloud"})}},methods:{showDialog(){this.confirmationDialog.show()},startResetProcess(){this.shouldDisplayWarning=!0},async deletePrivateKey(){var e,t;const{data:n}=await s.delete(r("/apps/end_to_end_encryption/api/v1/private-key"));return this.handleResponse({status:(t=(e=n.ocs)==null?void 0:e.meta)==null?void 0:t.status,error:null})},async deletePublicKey(){var e,t;const{data:n}=await s.delete(r("/apps/end_to_end_encryption/api/v1/public-key"));return this.handleResponse({status:(t=(e=n.ocs)==null?void 0:e.meta)==null?void 0:t.status,error:null})},async deleteFiles(){var e,t;if(this.deleteEncryptedFiles){const{data:n}=await s.delete(r("/apps/end_to_end_encryption/api/v1/encrypted-files"));return this.handleResponse({status:(t=(e=n.ocs)==null?void 0:e.meta)==null?void 0:t.status,error:null})}return!0},async resetEncryption(){try{let e=!0;e=e&&await this.deletePrivateKey(),e=e&&await this.deletePublicKey(),e=e&&await this.deleteFiles(),e&&y(o("end_to_end_encryption","End-to-end encryption keys reset"))}catch(e){this.handleResponse({errorMessage:o("end_to_end_encryption","Unable to reset end-to-end encryption"),error:e})}finally{this.shouldDisplayWarning=!1,this.hasKey=!1}},async handleResponse({status:e,errorMessage:t,error:n}){return e!=="ok"?(p(t),m.error(t,{error:n}),!1):!0},async setConfig(e,t){await s.put(_("apps/end_to_end_encryption/api/v1/config/{key}",{key:e}),{value:typeof t=="string"?t:JSON.stringify(t)}),this.userConfig[e]=t},t:o}});var B=function(){var e=this,t=e._self._c;return e._self._setupProxy,t("NcSettingsSection",{attrs:{name:e.t("end_to_end_encryption","End-to-end encryption"),description:e.encryptionState}},[!e.shouldDisplayE2EEInBrowserWarning&&e.userConfig.e2eeInBrowserEnabled===!1?t("NcButton",{staticClass:"margin-bottom",attrs:{disabled:!e.hasKey,type:"secondary"},on:{click:function(n){e.shouldDisplayE2EEInBrowserWarning=!0}}},[e._v(" "+e._s(e.t("end_to_end_encryption","Enable E2EE navigation in browser"))+" ")]):t("NcNoteCard",{staticClass:"notecard",attrs:{type:"warning","show-alert":!0,heading:e.t("end_to_end_encryption","Enabling E2EE in the browser can weaken security")}},[e.userConfig.e2eeInBrowserEnabled===!1?t("NcButton",{staticClass:"close-button",attrs:{"aria-label":e.t("end_to_end_encryption","Close"),type:"tertiary-no-background"},on:{click:function(n){e.shouldDisplayE2EEInBrowserWarning=!1}},scopedSlots:e._u([{key:"icon",fn:function(){return[t("IconClose",{attrs:{size:20}})]},proxy:!0}],null,!1,2888946197)}):e._e(),e._v(" "+e._s(e.t("end_to_end_encryption","The server could serve malicious source code to extract the secret that protects your files."))+" "),t("NcCheckboxRadioSwitch",{staticClass:"margin-bottom",attrs:{disabled:!e.hasKey,"data-cy-e2ee-settings-setting":"e2ee_in_browser_enabled",checked:e.userConfig.e2eeInBrowserEnabled,type:"switch"},on:{"update:checked":n=>e.setConfig("e2eeInBrowserEnabled",n)}},[e._v(" "+e._s(e.t("end_to_end_encryption","Enable E2EE navigation in browser"))+" ")])],1),e.shouldDisplayWarning?t("NcNoteCard",{staticClass:"notecard",attrs:{type:"warning","show-alert":!0,heading:e.t("end_to_end_encryption","Please read carefully before resetting your end-to-end encryption keys")}},[t("NcButton",{staticClass:"close-button",attrs:{"aria-label":e.t("end_to_end_encryption","Close"),type:"tertiary-no-background"},on:{click:function(n){e.shouldDisplayWarning=!1}},scopedSlots:e._u([{key:"icon",fn:function(){return[t("IconClose",{attrs:{size:20}})]},proxy:!0}])}),t("ul",[t("li",[e._v(e._s(e.t("end_to_end_encryption","Once your end-to-end encryption keys are reset, all files stored in your encrypted folder will be inaccessible.")))]),t("li",[e._v(e._s(e.t("end_to_end_encryption","You should only reset your end-to-end encryption keys if you lost your secure key words (mnemonic).")))]),t("li",[e._v(e._s(e.t("end_to_end_encryption","Check on all connected devices if you can retrieve your mnemonic.")))]),t("li",[e._v(e._s(e.t("end_to_end_encryption","Any still connected device might cause problems after deleting the keys, so it is better to disconnect and reconnect the devices again.")))])]),t("NcCheckboxRadioSwitch",{staticClass:"margin-bottom",attrs:{checked:e.deleteEncryptedFiles,type:"switch"},on:{"update:checked":function(n){e.deleteEncryptedFiles=n}}},[e._v(" "+e._s(e.t("end_to_end_encryption","Delete existing encrypted files"))+" ")]),t("NcButton",{attrs:{type:"error"},on:{click:e.showDialog}},[e._v(" "+e._s(e.t("end_to_end_encryption","Confirm and reset end-to-end encryption"))+" ")])],1):t("NcButton",{attrs:{disabled:!e.hasKey,type:e.hasKey&&!e.shouldDisplayWarning?"error":"secondary"},on:{click:function(n){return e.startResetProcess()}}},[e._v(" "+e._s(e.t("end_to_end_encryption","Reset end-to-end encryption"))+" ")])],1)},D=[],S=c(N,B,D,!1,null,"982b8510");const x=S.exports;i.prototype.t=o,i.prototype.n=u;const I=i.extend(x);new I({}).$mount("#security-end-to-end");
//# sourceMappingURL=end_to_end_encryption-settings.mjs.map
