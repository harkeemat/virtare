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
    :options="programData"
    @search="handleProgramSearch"
    @focus="handleProgramSearch"
    @change="handleProgramChange"
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
    checkSameAsProgram: Boolean,
    mode: String,
    close: Boolean,
    placeholder: String,
    targetRecords: Array,
    dropdownList: Array,
  },

  setup(props, context) {
    const store = useStore();
    const program = reactive(props.dropdownList);
    const programData = program ? ref(program) : ref([]);

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };

    onMounted(() => {
      Services.singleDropdownSearch("", (d) => (programData.value = d), props.targetRecords, "program");
    });
    
    watchEffect(() => {
      if (props.close) {
        Services.singleDropdownSearch("", (d) => (programData.value = d), props.targetRecords, "program");
      }
    });

    const handleProgramSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      programData.value = [];
      const value = val.target ? val.target.value : val
      Services.singleDropdownSearch(value, (d) => (programData.value = d),props.targetRecords,  "program");
    };

    const handleProgramChange = (val) => {
      if (props.checkSameAsProgram) {
        context.emit("handlePatientChange", val);
      } else {
        context.emit("handleProgramChange", val);
      }
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handleProgramChange,
      handleProgramSearch,
      programData,
      updateValue,
    };
  },
});
</script>
