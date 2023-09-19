<template>
    <a-input :placeholder="''"
    :disabled="disabled"
    @change="handleChange"
    :value="value"
    :size="size"
    :maxLength="max"
    style="width: 100%"
    @keypress="emit('keypress')"
    />
</template>
<script>
  import { ref } from 'vue';
  import { alphabetsOnly } from '@/commonMethods/commonMethod';
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
        emit,
        alphabetsOnly
      };
    },

  }
  </script>

  <style>

  </style>
