<template>
    <a-input-number :placeholder="''" 
    :disabled="disabled" 
    @change="handleChange" 
    :value="value" 
    :size="size" 
    style="width: 100%" 
    :maxlength="maxlength"
    :min="min"
    :max="max"
    />
</template>
<script>
  import { ref } from 'vue';
  export default {
      props:{
      placeholderData:String,
      disabled:Boolean,
      size:Number,
      maxlength:Number,
      min:Number,
      max:Number,
    },
    setup(props, { emit }) {
      
      const handleChange = (event) => {
        emit('change',event)
      }
  
      return {
        value: ref(undefined),
        handleChange,
      };
    },
  
  }
  </script>
  
  <style>
  
  </style>