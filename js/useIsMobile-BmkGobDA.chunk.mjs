const appName = "end_to_end_encryption";
const appVersion = "1.17.0-beta.2";
import { i as ref$1, K as readonly } from "./_plugin-vue2_normalizer-BdKAaywK.chunk.mjs";
const MOBILE_BREAKPOINT = 1024;
const MOBILE_SMALL_BREAKPOINT = MOBILE_BREAKPOINT / 2;
const isLessThanBreakpoint = (breakpoint) => document.documentElement.clientWidth < breakpoint;
const isMobile = ref$1(isLessThanBreakpoint(MOBILE_BREAKPOINT));
const isSmallMobile = ref$1(isLessThanBreakpoint(MOBILE_SMALL_BREAKPOINT));
window.addEventListener("resize", () => {
  isMobile.value = isLessThanBreakpoint(MOBILE_BREAKPOINT);
  isSmallMobile.value = isLessThanBreakpoint(MOBILE_SMALL_BREAKPOINT);
}, { passive: true });
function useIsMobile() {
  return readonly(isMobile);
}
readonly(isMobile);
export {
  useIsMobile as u
};
//# sourceMappingURL=useIsMobile-BmkGobDA.chunk.mjs.map
