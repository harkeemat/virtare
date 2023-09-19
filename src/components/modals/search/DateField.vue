<template>
  <a-date-picker placeholder=""
  :disabledDate="disabledDateData"
  @change="handleChange"
  :value="value"
  :format="globalDateFormat?globalDateFormat:'MMM DD, YYYY'"
  :value-format="globalDateFormat?globalDateFormat:`YYYY-MM-DD`"
  :size="size"
  @focus="emit('focus')"
  @blur="emit('blur')"
  style="width: 100%"
  :defaultValue="defaultValue"
  />
</template>

<script>
  import { ref } from 'vue';
  import dayjs,{Dayjs} from 'dayjs';
export default {
    props:{
    placeholderData:String,
    disabledDateData:String,
    globalDateFormat:String,
    size:Number,
    defaultValue:Dayjs
  },
  setup(props, { emit }) {
    const handleChange = () => {
      emit('change')
    }

    // const disabledDate = currentDate => {
    //   return dayjs(currentDate).subtract(18,'years');
    // }

    return {
      value: ref(undefined),
      handleChange,
      dayjs,
      emit
    };
  },

}
</script>
