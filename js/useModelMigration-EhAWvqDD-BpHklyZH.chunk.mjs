const appName = "end_to_end_encryption";
const appVersion = "1.17.0-beta.2";
import { a4 as getCurrentInstance, V as Vue, j as computed } from "./_plugin-vue2_normalizer-BdKAaywK.chunk.mjs";
function useModelMigration(oldModelName, oldModelEvent, required = false) {
  const vm = getCurrentInstance().proxy;
  if (required && vm.$props[oldModelName] === void 0 && vm.$props.modelValue === void 0) {
    Vue.util.warn('Missing required prop: "modelValue" or old "'.concat(oldModelName, '"'));
  }
  const model = computed({
    get() {
      if (vm.$props[oldModelName] !== void 0) {
        return vm.$props[oldModelName];
      }
      return vm.$props.modelValue;
    },
    set(value) {
      vm.$emit("update:modelValue", value);
      vm.$emit("update:model-value", value);
      vm.$emit(oldModelEvent, value);
    }
  });
  return model;
}
export {
  useModelMigration as u
};
//# sourceMappingURL=useModelMigration-EhAWvqDD-BpHklyZH.chunk.mjs.map
