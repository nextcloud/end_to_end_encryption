const appName = "end_to_end_encryption";
const appVersion = "1.17.0-beta.2";
import { b as getCurrentUser, a as getLoggerBuilder } from "./_plugin-vue2_normalizer-BdKAaywK.chunk.mjs";
const getLogger = (user) => {
  if (user === null) {
    return getLoggerBuilder().setApp("end_to_end_encryption").build();
  }
  return getLoggerBuilder().setApp("end_to_end_encryption").setUid(user.uid).build();
};
const logger = getLogger(getCurrentUser());
export {
  logger as l
};
//# sourceMappingURL=logger-kgPHxwTN.chunk.mjs.map
