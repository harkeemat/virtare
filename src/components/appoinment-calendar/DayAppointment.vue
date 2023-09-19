<template>
  <a-row :gutter="16">
    <a-col :span="24">
      <div class="dayCalendar">
        <table class="table table-bordered" v-if="appointmentSearch">
          <tbody v-for="(timeHeding, k) in appointmentSearch" :key="k">
            <tr>
              <th>{{ timeHeding.time }}</th>

              <td v-if="appointmentSearch">
                <AppointmentCardList
                  v-for="(appointment, i) in timeHeding.data"
                  :key="i"
                  :cardData="appointment"
                  :count="i"
                  :length="timeHeding.data.length"
                  tabName="day"
                  :data="timeHeding.data"
                ></AppointmentCardList>
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
import AppointmentCardList from "./AppointmentCardList";
import { timeStampToTime } from "@/commonMethods/commonMethod";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    AppointmentCardList,
  },
  props: {},
  setup() {
    const store = useStore();
    const officeTime = computed(() => {
      return store.state.appointment.officeTime;
    });

    const linkTo = "patients-summary";
    const appointmentSearch = computed(() => {
      return store.state.appointment.searchAppointmentRecords;
    });
    return {
      officeTime,
      timeStampToTime,
      linkTo,
      appointmentSearch,
    };
  },
};
</script>
<style>
.dayCalendar {
  min-height: 150px;
}

</style>