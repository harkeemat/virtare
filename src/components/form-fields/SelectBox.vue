<template>
  <a-select v-if="globalCode?.length > 0" class="" :getPopupContainer="triggerNode => triggerNode.parentNode" :value="value"
    :listHeight="listHeight ? listHeight : 150" showArrow show-search :mode="mode" :disabled="disabled" :placeholder="''"
    style="width: 100%" size="large" :max-tag-count="10" :max-tag-text-length="maxLength" :options="[
     {...defaultOption},
     ...globalCode?.map((item) =>
      entity != 'programs' ? ({ label: item.friendlyName ? item.friendlyName : item.name, value: item.udid ? item.udid : item.id }) :
        ({ label:item?.code ? item?.code:item?.name, value: item?.udid }))
    ]" :filter-option="filterOption" @change="changeData"
    :virtual="false" :notFoundContent="notFoundContent"
    @search="search"
    >
    <template #suffixIcon>
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L0.535898 0L7.4641 0L4 6Z" fill="#8A969F" />
      </svg>

    </template>
  </a-select>
  <a-select v-else class="" :getPopupContainer="triggerNode => triggerNode.parentNode" :value="value"
    :listHeight="listHeight ? listHeight : 150" show-search showArrow :mode="mode" :disabled="disabled" :placeholder="''"
    style="width: 100%" size="large" :max-tag-count="maxtag" @search="search"
    :virtual="false"  :notFoundContent="notFoundContent" >
    <template #suffixIcon>
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L0.535898 0L7.4641 0L4 6Z" fill="#8A969F" />
      </svg>

    </template>
  </a-select>
</template>
<script>

import { defineComponent, ref } from 'vue';
import {defaultOption} from '@/commonMethods/commonMethod'
export default defineComponent({
  component: {

  },
  props: {
    globalCode: Array,
    entity: String,
    mode: String,
    isColor: Boolean,
    listHeight: Number,
    disabled: Boolean,
    placeholderData: String,
    maxLength: Number,
    maxtag: Number,
    notFoundContent: {
            type: Boolean,
            default: undefined
        },
  },
  setup(props, { emit }) {
    const value = ref(undefined)
    const placeName = props?.placeholderData ? ref(props?.placeholderData) : ''
    const filterOption = (input,globalCode) => {
      emit("checkReturnResponse", input)
      return globalCode.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const handleChange = (event) => {
      emit("checkReturnResponse",event)
    }
    const changeData = (event) => {
      emit("changeData",event)
    }

   const search = value => {emit('onSearch',value)};


    return {
      value,
      filterOption,
      handleChange,
      placeName,
      changeData,
      search,
      defaultOption
    };
  },

});
</script>

<style scoped>
/* .ant-select-selection-item {
      padding-left: 35px !important;
      position: relative !important;
      top: -7px !important;
    }
    .ant-select-selection-item .circleBox {
      position: relative;
      top: 6px;
    } */
.ant-select-selection-item .circleBox {
  position: relative;
  top: 6px;
}

.ant-select-selection-item .circleBoxName {
  position: relative;
  top: -6px;
  left: 35px;
}

.ant-select-item-option-content .circleBoxName {
  padding-left: 35px;
  position: relative;
  top: 2px;
}
</style>
