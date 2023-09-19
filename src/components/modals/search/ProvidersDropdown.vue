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
    defaultProviderData: Array,
    fromStaff: Boolean,
  },

  setup(props, context) {
    const store = useStore();
    const provider = reactive(props.dropdownList);
    const providerData = provider ? ref(provider) : ref([]);

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };

    onMounted(() => {
      Services.singleDropdownSearch(
        "",
        (d) => (providerData.value = d),
        null,
        "provider",
        null,
        null,
        null,
        null,
        "providerDropdown"
      );
    });

    watchEffect(() => {
      if (props.close) {
        Services.singleDropdownSearch(
          "",
          (d) => (providerData.value = d),
          null,
          "provider",
          null,
          null,
          null,
          null,
          "providerDropdown"
        );
      }
      props.defaultProviderData ? providerData.value = props.defaultProviderData : providerData.value
    });

    const handleProviderSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      providerData.value = [];
      const value = val.target ? val.target.value : val
      Services.singleDropdownSearch(
        value,
        (d) => (providerData.value = d),
        null,
        "provider",
        null,
        null,
        null,
        null,
        "providerDropdown"
      );
    };

    const handleProviderChange = (values) => {
      var selectedList = []
      providerData.value.map(provider => {
        if(Array.isArray(values)) {
          if(values.includes(provider.value)) {
            selectedList.push(provider)
          }
        }
        else {
          selectedList = values
        }
      });
      if(props.fromStaff && props.fromStaff == true) {
        context.emit("handleProviderChange", selectedList);
      }
      else {
        context.emit("handleProviderChange", selectedList.value);
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
