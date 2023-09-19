<template>
  <a-select v-if="globalCode && !isColor" class="" 
  :getPopupContainer="triggerNode => triggerNode.parentNode"
    :value="value"
    :listHeight="listHeight?listHeight:150"
    show-search
    showArrow
    :mode="mode"
    :disabled="disabled"
    placeholder="Please Select"
    style="width: 100%"
    size="large"
    :options="globalCode.map((item) => ({label: item.name, value: item.id?item.id:item.udid }))"
    :filter-option="filterOption"
    @change="handleChange"
  ></a-select>

  <a-select v-else-if="globalCode && isColor" class="" 
  :getPopupContainer="triggerNode => triggerNode.parentNode"
  :listHeight="listHeight?listHeight:150"
    :value="value"
    show-search
    :mode="mode"
    :disabled="disabled"
    placeholder="Please Select"
    style="width: 100%"
    size="large"
    :filter-option="filterOption">
    <a-select-option class="priority" v-for="item in globalCode" :key="item.id">
      <span v-if="isColor" class="circleBox" :style="item.style">
        <span class="circleBoxName">{{ item.name }}</span>
      </span>
      <span v-else>{{ item.name }}</span>
    </a-select-option>
  </a-select>

  <a-select v-else>
     <a-select-option value="" hidden>{{'Please Select'}}</a-select-option>
  </a-select>
<!-- 
    :options="globalCode.map((item) => ({label: isColor ? item.color+' '+item.name : item.name, value: item.id ? item.id : item.udid }))"
     -->
    <!-- <a-select v-if="globalCode && !isColor"
    :value="value"
    show-search
    :mode="mode"
    placeholder="Please Select"
    style="width: 100%"
    size="large"
    :filter-option="filterOption"
    :options="globalCode.map((item) => ({label: item.name, value: item.id?item.id:item.udid }))">
  </a-select>
  <a-select v-else>
     <a-select-option value="" hidden>{{'Please Select'}}</a-select-option>
  </a-select>
  <a-select v-if="globalCode && isColor"
    :value="value"
    show-search
    :mode="mode"
    placeholder="Please Select"
    style="width: 100%"
    size="large"
    :filter-option="filterOption">
    <a-select-option class="priority" v-for="item in globalCode" :key="item.id">
      <span v-if="isColor" class="circleBox" :style="item.style">
        <span class="circleBoxName">{{ item.name }}</span>
      </span>
      <span v-else>{{ item.name }}</span>
    </a-select-option>
  </a-select>
  <a-select v-if="!globalCode">
     <a-select-option value="" hidden>{{'Please Select'}}</a-select-option>
  </a-select> -->
</template>
<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props:{
    globalCode:Array,
    mode:String,
    isColor:Boolean,
    listHeight:Number,
    responseReturn:Boolean,
    disabled:Boolean
  },
  setup(props, { emit }) {
 
    const filterOption = (input, globalCode) => {
      if(props.responseReturn){
       emit("checkReturnResponse",{value:globalCode.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,input:input})
      }
      return globalCode.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const handleChange = () => {
      emit('changeData')
    }

    return {
      value: ref(undefined),
      filterOption,
      handleChange,
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