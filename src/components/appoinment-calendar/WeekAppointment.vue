<template>
<a-row>
    <a-col :span="12">
        <div class="calenderLeftRightBtn">
            <a-button type="primary" @click="weekChange('sub')">
                <template #icon>
                    <LeftOutlined />
                </template>
            </a-button>
            <a-button type="primary" @click="weekChange('add')">
                <template #icon>
                    <RightOutlined />
                </template>
            </a-button>
        </div>
    </a-col>
    <a-col :span="12">
        <h3>{{(weekDate.calendarDate).format("MMMM DD")}} - {{(dayjs(weekDate.calendarDate).endOf('week')).format("MMMM DD")}}</h3>
    </a-col>
    <a-col :span="24">
        <div class="dayCalendar">

            <table class="table table-bordered" v-if="appointmentSearch">

                <tbody v-for="(week, k) in appointmentSearch" :key="k">
                    <tr>
                        <th>{{ week.time }}</th>
                        <td v-if="appointmentSearch">
                            <AppointmentCardList v-for="(appointment, i) in week.data" :key="i" :cardData="appointment" :count="i" :length="week.data.length" @is-showrecordByday="showrecordByday($event)" tabName="week" :data="week.data"></AppointmentCardList>
                        </td>
                        <td v-else></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </a-col>
</a-row>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import AppointmentCardList from "./AppointmentCardList";

import { dateFormat } from "../../commonMethods/commonMethod";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs"
export default {
  components: {
    AppointmentCardList,

    LeftOutlined,
    RightOutlined,
  },
  props: {},
  setup(props, { emit }) {


    const store = useStore();
    const weekDate = store.getters.appointmentRecords.value
    const appointmentSearch = computed(() => {
      return store.state.appointment.searchAppointmentRecords;
    });
    const weekName = computed(() => {
      return store.state.appointment.weekName;
    });
    function showrecordByday(event) {
      emit("is-dateClick", event);
    }
    function weekChange(event) {
      let date = ''
      if (event == "sub") {
        date = weekDate.calendarDate.subtract(1, 'week')
      } else {
        date = weekDate.calendarDate.add(1, 'week');
      }
      emit("week-select", date)
    }

    return {
      weekChange,
      weekName,
      appointmentSearch,
      dateFormat,
      showrecordByday,
      weekDate,
      dayjs
    };
  },
};
</script>
<style>
.dayCalendar {
  min-height: 150px;
}
</style>