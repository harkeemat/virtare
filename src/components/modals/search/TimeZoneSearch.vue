<template>
  <a-select
  class=""
  :listHeight="listHeight?listHeight:150"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    ref="select"
    :mode="mode"
    :value="value"
    @input="updateValue"
    style="width: 100%"
    :show-search="true"
    placeholder="Please Select"
    :show-arrow="true"
    :filter-option="false"
    :not-found-content="loadingStatus ? undefined : null"
    :options="timeZoneData"
    @search="handleTimeZoneSearch"
    @change="handleTimeZoneChange"
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
    editDataTimeZone:Array,
    listHeight: Number,
  },

  setup(props, context) {
    const store = useStore();
    const timeZoneData = ref()
    
   

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };
    watchEffect(() => {
      if (props.close) {
        Services.singleDropdownSearch(
          "",
          (d) => (timeZoneData.value = d),
          null,
          "timezone"
        );
        store.commit("checkChangeInput", false);
      }
       props.editDataTimeZone?timeZoneData.value = props.editDataTimeZone:timeZoneData.value
    });
    onMounted(() => {
      Services.singleDropdownSearch(
        "",
        (d) => (timeZoneData.value = d),
        null,
        "timezone"
      );
    });

    const handleTimeZoneSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      timeZoneData.value = [];
      Services.singleDropdownSearch(
        val,
        (d) => (timeZoneData.value = d),
        null,
        "timezone"
      );
    };

    const handleTimeZoneChange = (val) => {
      // Services.singleDropdownSearch( val, (d) => (timeZoneData.value = d), "timezone" );
      context.emit("handleTimeZoneChange", val);
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handleTimeZoneChange,
      handleTimeZoneSearch,
      timeZoneData,
      updateValue,
    };
  },
});
</script>
