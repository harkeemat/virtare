<template>
  <a-select
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    ref="select"
    class=""
    :listHeight="listHeight?listHeight:150"
    :mode="mode"
    :value="value"
    @input="updateValue"
    style="width: 100%"
    :show-search="true"
    :placeholder="placeholder?placeholder:''"
    :show-arrow="true"
    :filter-option="false"
    :not-found-content="loadingStatus ? undefined : null"
    :options="conditionData.map((item) =>
       ({ label: item?.code , value: item?.value }))" 
    @search="handleConditionSearch"
    @change="handleConditionChange"
    size="large"
  >
    <template v-if="loadingStatus" #notFoundContent>
      <a-spin size="small" />
      <p>Data not found!</p>
    </template>
  </a-select>
</template>

<script>
import { defineComponent, watchEffect, onMounted,ref } from "vue";
import { useStore } from "vuex";
import Services from "@/services/serviceMethod";
export default defineComponent({
  components: {},
  props: {
    value: String,
    mode: String,
    close: Boolean,
    editDataCondition:Array,
    placeholder:String,
    listHeight:Number,
    targetRecords:Array,
    entity:String
  },

  setup(props, context) {
    const store = useStore();
    const conditionData = ref()

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };
    watchEffect(() => {    
      if (props.close) {
        Services.singleDropdownSearch(
          "",
          (d) => (conditionData.value = d),
          props.targetRecords,
          // null,
          "condition"
        );
        store.commit("checkChangeInput", false);
      }
       props.editDataCondition?conditionData.value = props.editDataCondition:conditionData.value
    });
    onMounted(() => {
      Services.singleDropdownSearch(
        "",
        (d) => (conditionData.value = d),
        props.targetRecords,
        // null,
        "condition"
      );
    });

    const handleConditionSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      conditionData.value = [];
      Services.singleDropdownSearch(
        val,
        (d) => (conditionData.value = d),
        props.targetRecords,
        // null,
        "condition"
      );
    };

    const handleConditionChange = (val) => {
      context.emit("handleConditionChange", val);
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handleConditionChange,
      handleConditionSearch,
      conditionData,
      updateValue,
    };
  },
});
</script>
