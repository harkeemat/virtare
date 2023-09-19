<template>
  <div class="common-form">
    <a-form>
      <a-form-item>
        <a-select
          ref="select"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          :value="value"
          @input="updateValue"
          style="width: 100%"
          show-search
          placeholder="Patient search with first & last name"
          :show-arrow="false"
          :allowClear="true"
          :filter-option="false"
          :not-found-content="loadingStatus ? undefined : null"
          :options="
          data?data?.map((item) => ({
                  label: item.name,
                  value: item.udid
                }))
                :''
          "
          @search="handleSearch"
          @change="handleChange"
        >
          <!-- +'<span>'+item.phoneNumber+'</span><span>'+item.email+'</span>' -->
          <template v-if="loadingStatus" #notFoundContent>
            <a-spin size="small" />
            <p>Data not found!</p>
          </template>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import Services from "@/services/serviceMethod";
export default defineComponent({
  components: {},
  props: {
    value: String,
  },

  setup(props, context) {
    const store = useStore();
    const data = ref([]);

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };

    const handleSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      Services.headerSearch(val, (d) => (data.value = d), "patientData/search");
    };

    const handleChange = (val) => {
      context.emit("handleChange", val);
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handleChange,
      handleSearch,
      data,
      updateValue,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  .ant-select-selection-search {
    display: flex;
    align-items: center;
  }
}
</style>
