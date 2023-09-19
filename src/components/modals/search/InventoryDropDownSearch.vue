<template>
  <a-select
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    ref="select"
    class=""
    :value="value"
    @input="updateValue"
    style="width: 100%"
    :show-search="true"
    :placeholder="placeholder?placeholder:'Please Select'"
    :show-arrow="true"
    :filter-option="false"
    :not-found-content="loadingStatus ? undefined : null"
    :options="options? options : dropdownListing"
    @search="handleInventorySearch"
    @change="handleInventoryChange"
    size="large" >
    <template v-if="loadingStatus" #notFoundContent>
      <a-spin size="small" />
      <p>Data not found!</p>
    </template>
  </a-select>
</template>

<script>
import {
  defineComponent,
  computed,
  // watchEffect,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import Services from "@/services/serviceMethod";
export default defineComponent({
  components: {},
  props: {
    value: String,
    close: Boolean,
    placeholder:String,
    deviceTypeId:Number,
    options:Array,
  },

  setup(props, context) {
    const store = useStore();

    const dropdownListing = computed(() => {
      return store.state.common.dropdownListing;
    });

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };

    // watchEffect(() => {
    //   store.commit('dropdownListing', null)
    //   if (props.close) {
    //     Services.singleDropdownSearch(
    //       "",
    //       (d) => (store.commit('dropdownListing', d)),
    //       "inventory",
    //       props.deviceTypeId,
    //       '1',
    //       'macAddress',
    //       'ASC',
    //     );
    //     store.commit("checkChangeInput", false);
    //   }
    // });
    
    onMounted(() => {
      Services.singleDropdownSearch(
        "",
        (d) => (store.commit('dropdownListing', d)),
        null,
        "inventory",
        props.deviceTypeId,
        '1',
        'macAddress',
        'ASC',
      );
    });

    const handleInventorySearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      dropdownListing.value = [];
      Services.singleDropdownSearch(
        val,
        (d) => (store.commit('dropdownListing', d)),
        null,
        "inventory",
        props.deviceTypeId,
        '1',
        'macAddress',
        'ASC',
      );
    };

    const handleInventoryChange = (val) => {
      // Services.singleDropdownSearch( val, (d) => (store.commit('dropdownListing', d)), "inventory" );
      context.emit("handleInventoryChange", val);
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handleInventoryChange,
      handleInventorySearch,
      dropdownListing,
      updateValue,
    };
  },
});
</script>
