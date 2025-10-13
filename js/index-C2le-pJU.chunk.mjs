function a(t,n,r){const o=document.querySelector("#initial-state-".concat(t,"-").concat(n));if(o===null){if(r!==void 0)return r;throw new Error("Could not find initial state ".concat(n," of ").concat(t))}try{return JSON.parse(atob(o.value))}catch(e){throw new Error("Could not parse initial state ".concat(n," of ").concat(t))}}export{a as l};
//# sourceMappingURL=index-C2le-pJU.chunk.mjs.map
