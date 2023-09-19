<template>
  <a-time-picker
  :format="globalTimeFormat ? globalTimeFormat : 'HH:mm:ss'"
  :value-format="globalTimeFormat ? globalTimeFormat : 'HH:mm:ss'"
  :size="size"
  style="width: 100%"
  :showNow="type == 'duration' ? false : true"
  placeholder="" />
</template>

<script>
  import { ref } from 'vue';
export default {
    props:{
    placeholderData:String,
    disabledDateData:String,
    globalTimeFormat:String,
    size:Number,
    type:String,
  },
  setup(props, { emit }) {
    const handleChange = () => {
      emit('change')
    }

    return {
      value: ref(undefined),
      handleChange,
    };
  },

}
</script>
