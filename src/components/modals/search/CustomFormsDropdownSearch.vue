<template>
  <a-select
    class=""
    :listHeight="listHeight?listHeight:150"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    ref="select"
    :mode="mode"
    :value="value"
    style="width: 100%"
    :show-search="true"
    placeholder="Please Select"
    :show-arrow="true"
    :filter-option="false"
    :not-found-content="loadingStatus ? undefined : null"
    :options="customFormData"
    @search="handleCustomFormSearch"
    @change="handleCustomFormChange"
    @focus="handleCustomFormSearch(null)"
    size="large">
    <template  v-if="loadingStatus" #notFoundContent>
      <a-spin size="small" />
      <p>Data not found!</p>
    </template>
  </a-select>
</template>

<script>
import { defineComponent, ref,onMounted } from "vue";
import { useStore } from "vuex"
import Services from "@/services/serviceMethod"
export default defineComponent({
  components: {
 
  },
  props:{
    value:String,
    mode:String,
    listHeight: Number,
  },
  
  setup(props,context) {
    const store = useStore()
    const customFormData = ref([]);
    
    const updateValue = (customForm) => {
      context.emit('update:modelValue', customForm.target.value);
    }

    onMounted(()=>{
      Services.singleDropdownSearch('', (d) => (customFormData.value = d), null, 'custom-forms')
    })

    const handleCustomFormSearch = (val) => {
      store.commit('dropdownLoadingStatus', true)
      customFormData.value=[];
      Services.singleDropdownSearch(val, (d) => (customFormData.value = d), null, 'custom-forms')
    };

    const handleCustomFormChange = (val) => {
      context.emit('handleCustomFormChange',val)
    };

    return {
      loadingStatus:store.getters.dropdownLoadingStatus,
      handleCustomFormChange,
      handleCustomFormSearch,
      customFormData,
      updateValue
    };
  },
});
</script>
