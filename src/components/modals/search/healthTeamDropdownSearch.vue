<template>
<!-- <div> -->
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
    :placeholder="placeholder ? placeholder : 'Please Select'"
    :show-arrow="true"
    :filter-option="false"
    :not-found-content="loadingStatus ? undefined : null"
    :options="healthTeamData"
    @search="handleHealthTeamSearch"
    @change="handleHealthTeamChange"
    size="large"
    :disabled="isDisabled"
  >
    <template v-if="loadingStatus" #notFoundContent>
      <a-spin size="small" />
      <p>Data not found!</p>
    </template>
  </a-select>
<!-- </div> -->

  
</template>
 


<script>
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import { useStore } from "vuex";
import Services from "@/services/serviceMethod";
export default defineComponent({
  components: {},
  props: {
    value: String,
    checkSameAsStaff: Boolean,
    mode: String,
    placeholder: String,
    close: Boolean,
    editDataHealthTeam:Array,
    listHeight: Number,
    isDisabled: Boolean,
    healthTeamId:String
  },

  setup(props, context) {
    const store = useStore();
    const healthTeamData = ref([]);

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };
    onMounted(() => {
      Services.singleDropdownSearch("", (d) => (healthTeamData.value = d),null, `patient/${props.healthTeamId}/staff?isPrimary=1`);
    });
    watchEffect(() => {
      if (props.close) {
        Services.singleDropdownSearch(
          "",
          (d) => (healthTeamData.value = d),
          null,
          `patient/${props.healthTeamId}/staff?isPrimary=1`
        );
      }
      
        props.editDataStaff?healthTeamData.value = props.editDataStaff:healthTeamData.value
        
    });

    const handleHealthTeamSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      healthTeamData.value = [];
      Services.singleDropdownSearch(val, (d) => (healthTeamData.value = d),null, `patient/${props.healthTeamId}/staff?isPrimary=1`);
    };

    const handleHealthTeamChange = (val) => {
      if (props.checkSameAsStaff) {
        context.emit("handleHealthTeamChange", val);
      } else {
        context.emit("handleHealthTeamChange", val);
      }
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handleHealthTeamChange,
      handleHealthTeamSearch,
      healthTeamData,
      updateValue,
    };
  },
});
</script>
