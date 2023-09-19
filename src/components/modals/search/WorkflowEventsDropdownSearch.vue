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
    :options="eventData"
    @search="handleEventSearch"
    @change="handleEventChange"
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
    const eventData = ref([]);
    
    const updateValue = (event) => {
      context.emit('update:modelValue', event.target.value);
    }

    onMounted(()=>{
      Services.singleDropdownSearch('', (d) => (eventData.value = d), null, 'workflow/event')
    })

    const handleEventSearch = (val) => {
      store.commit('dropdownLoadingStatus', true)
      eventData.value=[];
      Services.singleDropdownSearch(val, (d) => (eventData.value = d), null, 'workflow/event')
    };

    const handleEventChange = (val) => {
      context.emit('handleEventChange',val)
    };

    return {
      loadingStatus:store.getters.dropdownLoadingStatus,
      handleEventChange,
      handleEventSearch,
      eventData,
      updateValue
    };
  },
});
</script>
