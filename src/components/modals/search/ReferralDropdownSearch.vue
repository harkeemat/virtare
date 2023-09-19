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
    :options="referralData"
    @search="handleReferralSearch"
    @change="handleReferralChange"
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
    editDataReferral:Array,
    listHeight: Number,
  },

  setup(props, context) {
    const store = useStore();
    const referralData = ref()
    
   

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };
    watchEffect(() => {
      if (props.close) {
        Services.singleDropdownSearch(
          "",
          (d) => (referralData.value = d),
          null,
          "referral?referral=referral"
        );
        store.commit("checkChangeInput", false);
      }
       props.editDataReferral?referralData.value = props.editDataReferral:referralData.value
    });
    onMounted(() => {
      Services.singleDropdownSearch(
        "",
        (d) => (referralData.value = d),
        null,
        "referral?referral=referral"
      );
    });

    const handleReferralSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      referralData.value = [];
      Services.singleDropdownSearch(
        val,
        (d) => (referralData.value = d),
        null,
        "referral?referral=referral"
      );
    };

    const handleReferralChange = (val) => {
      // Services.singleDropdownSearch( val, (d) => (referralData.value = d), "Referral" );
      context.emit("handleReferralChange", val);
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handleReferralChange,
      handleReferralSearch,
      referralData,
      updateValue,
    };
  },
});
</script>
