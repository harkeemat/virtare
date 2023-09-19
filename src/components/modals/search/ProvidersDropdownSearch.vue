<template>
  <a-select
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    ref="select"
    :mode="mode"
    :value="value"
    @input="updateValue"
    style="width: 100%"
    :show-search="true"
    :placeholder="placeholder ? placeholder : 'Input Search Text'"
    :show-arrow="true"
    :filter-option="false"
    :not-found-content="loadingStatus ? undefined : null"
    :options="providerData"
    @search="handleProviderSearch"
    @focus="handleProviderSearch"
    @change="handleProviderChange"
    size="large"
  >
    <template v-if="loadingStatus" #notFoundContent>
      <a-spin size="small" />
      <p>Data not found!</p>
    </template>
  </a-select>
</template>

<script>
import { defineComponent, ref, onMounted, watchEffect, reactive } from "vue";
import { useStore } from "vuex";
import Services from "@/services/serviceMethod";
export default defineComponent({
  components: {},
  props: {
    value: String,
    checkSameAsProvider: Boolean,
    mode: String,
    close: Boolean,
    placeholder: String,
    targetRecords: Array,
    dropdownList: Array,
  },

  setup(props, context) {
    const store = useStore();
    const provider = reactive(props.dropdownList);
    const providerData = provider ? ref(provider) : ref([]);

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };

    onMounted(() => {
      Services.singleDropdownSearch("", (d) => (providerData.value = d), props.targetRecords, "provider");
    });

    watchEffect(() => {
      if (props.close) {
        Services.singleDropdownSearch("", (d) => (providerData.value = d), props.targetRecords, "provider");
      }
    });

    const handleProviderSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      providerData.value = [];
      const value = val.target ? val.target.value : val
      Services.singleDropdownSearch(value, (d) => (providerData.value = d), props.targetRecords, "provider");
    };

    const handleProviderChange = (val) => {
      if (props.checkSameAsProvider) {
        context.emit("handlePatientChange", val);
      } else {
        context.emit("handleProviderChange", val);
      }
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handleProviderChange,
      handleProviderSearch,
      providerData,
      updateValue,
    };
  },
});
</script>
