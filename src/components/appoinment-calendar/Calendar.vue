<template>
  <div class="appoinmentCalendar">
    <a-calendar  v-model:value="value" :fullscreen="false" @select="onSelect" @panelChange="onPanelChange" />
  </div>
</template>
<script>
import { defineComponent, ref, computed, watchPostEffect } from 'vue';
import { useStore } from "vuex"
import dayjs from 'dayjs';
export default defineComponent({
  props:{
    dateSelected:Object
  },
  setup(props, {emit}) {
    const store = useStore()
    const value = ref();
    const date = computed(() =>{
      return dayjs(store.state.appointment.calendarDate)
    })
    const selectedValue = ref();
    const onSelect = value => {
      store.state.appointment.calendarDate = value;
      selectedValue.value = value;
      emit("is-click",dayjs(value))
      
    };
    watchPostEffect(()=>{
      value.value = props.dateSelected
      //onSelect(props.dateSelected)
    })
    const onPanelChange = (value) => {
      emit("is-click",dayjs(value))
    };
    return {
      value,
      date,
      selectedValue,
      onSelect,
      onPanelChange,
    };
  },

});
</script>
<style lang="scss">
.appoinmentCalendar {
 // width: 300px;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 4px;
  .ant-select-dropdown {
    top: 100px !important;
  }
  .ant-fullcalendar-header {
    text-align: center;
  }
  .ant-picker-calendar-header {
    align-items: self-start;
    gap: 5px;
    .ant-picker-calendar-month-select  {
      margin: 0;
    }
  }
}
</style>