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
    :placeholder="placeholder?placeholder:'Please Select'"
    :show-arrow="true"
    :filter-option="false"
    :not-found-content="loadingStatus ? undefined : null"
    :options="CptCodeActivitiesData"
    @search="handleCptCodeSearch"
    @change="handleCptCodeChange"
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
    editDataCptCode:Array,
    placeholder:String,
    listHeight:Number
  },

  setup(props, context) {
    const store = useStore();
    const CptCodeActivitiesData = ref()
    
   

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };
    watchEffect(() => {
      if (props.close) {
        Services.singleDropdownSearch(
          "",
          (d) => (CptCodeActivitiesData.value = d),
          null,
          "cptCodeActivities"
        );
        store.commit("checkChangeInput", false);
      }
       props.editDataCptCode?CptCodeActivitiesData.value = props.editDataCptCode:CptCodeActivitiesData.value
    });
    onMounted(() => {
      Services.singleDropdownSearch(
        "",
        (d) => (CptCodeActivitiesData.value = d),
        null,
        "cptCodeActivities"
      );
    });

    const handleCptCodeSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      CptCodeActivitiesData.value = [];
      Services.singleDropdownSearch(
        val,
        (d) => (CptCodeActivitiesData.value = d),
        null,
        "cptCodeActivities"
      );
    };

    const handleCptCodeChange = (val) => {
      context.emit("handleCptCodeChange", val);
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handleCptCodeChange,
      handleCptCodeSearch,
      CptCodeActivitiesData,
      updateValue,
    };
  },
});
</script>
