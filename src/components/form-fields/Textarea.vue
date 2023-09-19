<template>
    <a-textarea :placeholder="''" 
    :disabled="disabled" 
    @change="handleChange" 
    :value="value" 
    :size="size" 
    :maxLength="max" 
    style="width: 100%" 
    />
</template>
<script>
  import { ref } from 'vue';
  export default {
    emits:["change"],
      props:{
      placeholderData:String,
      disabled:Boolean,
      size:String,
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